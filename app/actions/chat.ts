"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createChatSession(title = "New Chat") {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  const { data, error } = await supabase
    .from("chat_sessions")
    .insert({
      user_id: user.id,
      title,
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath("/dashboard")
  return data
}

export async function getChatSessions() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from("chat_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })

  if (error) throw error

  return data || []
}

export async function getChatMessages(sessionId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("session_id", sessionId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })

  if (error) throw error

  return data || []
}

export async function saveChatMessage(
  sessionId: string,
  text: string,
  videoUrl?: string,
  isResponse = false,
  isError = false,
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  const { data, error } = await supabase
    .from("chat_messages")
    .insert({
      session_id: sessionId,
      user_id: user.id,
      text,
      video_url: videoUrl,
      is_response: isResponse,
      is_error: isError,
    })
    .select()
    .single()

  if (error) throw error

  // Update session's updated_at timestamp
  await supabase.from("chat_sessions").update({ updated_at: new Date().toISOString() }).eq("id", sessionId)

  return data
}

export async function deleteChatSession(sessionId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  const { error } = await supabase.from("chat_sessions").delete().eq("id", sessionId).eq("user_id", user.id)

  if (error) throw error

  revalidatePath("/dashboard")
}

export async function updateChatSessionTitle(sessionId: string, title: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  const { error } = await supabase.from("chat_sessions").update({ title }).eq("id", sessionId).eq("user_id", user.id)

  if (error) throw error

  revalidatePath("/dashboard")
}
