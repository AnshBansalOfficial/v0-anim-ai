"use client"

import { useState, useEffect } from "react"
import TopBar from "../components/top-bar"
import ChatInterface from "../components/chat-interface"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const CHAT_STORAGE_KEY = "animai_guest_chat_history"

interface Message {
  id: string
  text: string
  timestamp: Date
  videoUrl?: string
  isResponse?: boolean
  isLoading?: boolean
  isError?: boolean
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isHydrated, setIsHydrated] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        router.push("/dashboard")
        return
      }
    }
    checkUser()

    // Load guest messages from localStorage
    const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY)
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
        setMessages(parsedMessages)
      } catch (error) {
        console.error("[v0] Error loading messages from localStorage:", error)
      }
    }
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages))
    }
  }, [messages, isHydrated])

  // Show login prompt after 3 messages
  useEffect(() => {
    const userMessages = messages.filter((m) => !m.isResponse)
    if (userMessages.length >= 3) {
      setShowLoginPrompt(true)
    }
  }, [messages])

  const handleSendMessage = async (message: string) => {
    console.log("[v0] handleSendMessage called with:", message)

    // 1. Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      timestamp: new Date(),
      isResponse: false,
    }
    setMessages((prev) => [...prev, userMessage])

    // 2. Add initial loading message
    const loadingMessageId = (Date.now() + 1).toString()
    const initialLoadingMessage: Message = {
      id: loadingMessageId,
      text: "Thinking...",
      timestamp: new Date(),
      isResponse: true,
      isLoading: true,
    }
    setMessages((prev) => [...prev, initialLoadingMessage])

    try {
      console.log("[v0] Calling API route...")
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: message }),
      })

      console.log("[v0] API response status:", response.status)

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] API response data:", data)

      if (!data.success) {
        const errorMessage: Message = {
          id: loadingMessageId,
          text: data.error || "An error occurred",
          timestamp: new Date(),
          isResponse: true,
          isLoading: false,
          isError: true,
        }
        setMessages((prev) => prev.map((msg) => (msg.id === loadingMessageId ? errorMessage : msg)))
        return
      }

      const responseMessage: Message = {
        id: loadingMessageId,
        text: data.text || "Your animation has been generated successfully!",
        videoUrl: data.videoUrl,
        timestamp: new Date(),
        isResponse: true,
        isLoading: false,
      }

      setMessages((prev) => prev.map((msg) => (msg.id === loadingMessageId ? responseMessage : msg)))
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      const errorMessage: Message = {
        id: loadingMessageId,
        text: "Failed to process your request. Please try again.",
        timestamp: new Date(),
        isResponse: true,
        isLoading: false,
        isError: true,
      }
      setMessages((prev) => prev.map((msg) => (msg.id === loadingMessageId ? errorMessage : msg)))
    }
  }

  if (!isHydrated) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <TopBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <TopBar showAuth={true} />

      {showLoginPrompt && (
        <div className="bg-primary text-primary-foreground px-4 py-3 text-center">
          <p className="text-sm font-medium">
            Want to save your chat history?{" "}
            <Button asChild variant="secondary" size="sm" className="ml-2">
              <Link href="/auth/sign-up">Sign up for free</Link>
            </Button>
          </p>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <ChatInterface messages={messages} onSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}
