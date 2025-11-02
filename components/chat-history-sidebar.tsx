"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Plus, Trash2, LogOut, CreditCard } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ChatSession {
  id: string
  title: string
  created_at: string
  updated_at: string
}

interface ChatHistorySidebarProps {
  sessions: ChatSession[]
  currentSessionId?: string
  onNewChat: () => void
  onSelectSession: (sessionId: string) => void
  onDeleteSession: (sessionId: string) => void
  userEmail?: string
  subscriptionTier?: string
}

export default function ChatHistorySidebar({
  sessions,
  currentSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  userEmail,
  subscriptionTier = "free",
}: ChatHistorySidebarProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const handleDeleteClick = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSessionToDelete(sessionId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (sessionToDelete) {
      onDeleteSession(sessionToDelete)
      setSessionToDelete(null)
    }
    setDeleteDialogOpen(false)
  }

  const getTierBadgeColor = () => {
    switch (subscriptionTier) {
      case "pro":
        return "bg-blue-500"
      case "team":
        return "bg-purple-500"
      case "enterprise":
        return "bg-amber-500"
      default:
        return "bg-muted"
    }
  }

  return (
    <>
      <div className="w-64 bg-card border-r border-border flex flex-col h-full">
        <div className="p-4 border-b border-border">
          <Button onClick={onNewChat} className="w-full" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>

        <ScrollArea className="flex-1 p-2">
          <div className="space-y-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`group flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-accent transition-colors ${
                  currentSessionId === session.id ? "bg-accent" : ""
                }`}
                onClick={() => onSelectSession(session.id)}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span className="text-sm truncate">{session.title}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleDeleteClick(session.id, e)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <div className={`px-2 py-1 rounded text-xs font-semibold text-white ${getTierBadgeColor()}`}>
              {subscriptionTier.toUpperCase()}
            </div>
          </div>
          <div className="text-xs text-muted-foreground truncate mb-2">{userEmail}</div>
          {subscriptionTier === "free" && (
            <Button asChild variant="outline" size="sm" className="w-full bg-transparent">
              <Link href="/pricing">
                <CreditCard className="h-4 w-4 mr-2" />
                Upgrade
              </Link>
            </Button>
          )}
          <Button onClick={handleLogout} variant="ghost" size="sm" className="w-full">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this chat session? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
