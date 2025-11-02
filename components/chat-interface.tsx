"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import MessageItem from "./message-item"
import { Send, Sparkles } from "lucide-react"

interface Message {
  id: string
  text: string
  timestamp: Date
  videoUrl?: string
  isResponse?: boolean
  isLoading?: boolean
}

interface ChatInterfaceProps {
  messages: Message[]
  onSendMessage: (message: string) => void
}

const EXAMPLE_PROMPTS = [
  {
    icon: "∑",
    text: "Draw y = sin(x) from -π to π",
  },
  {
    icon: "⚛",
    text: "Visualize electron orbits in a hydrogen atom",
  },
  {
    icon: "●",
    text: "Derive the parameter of a circle",
  },
]

export default function ChatInterface({ messages, onSendMessage }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim()) return

    setIsLoading(true)
    const message = inputValue
    setInputValue("")

    try {
      await onSendMessage(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExampleClick = (promptText: string) => {
    setInputValue(promptText)
    setIsLoading(true)
    onSendMessage(promptText)
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center w-full px-4">
        <div className="w-full max-w-2xl py-8">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full min-h-96">
              <div className="text-center max-w-xl">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Sparkles className="text-primary-foreground" size={40} strokeWidth={1.5} />
                </div>
                <h1 className="text-foreground text-4xl font-black mb-2">AnimAI Studio</h1>
                <p className="text-muted-foreground text-base mb-8 font-medium leading-relaxed">
                  Generate stunning <span className="font-bold text-foreground">Math, Physics & Chemistry</span>{" "}
                  animations with AI
                </p>

                <div className="space-y-3 text-left bg-muted p-6 rounded-2xl border border-border">
                  <p className="text-foreground text-xs font-bold uppercase tracking-widest">Try these:</p>
                  <ul className="text-muted-foreground text-sm space-y-3">
                    {EXAMPLE_PROMPTS.map((prompt, index) => (
                      <li
                        key={index}
                        onClick={() => handleExampleClick(prompt.text)}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-all cursor-pointer group"
                      >
                        <span className="text-lg group-hover:scale-110 transition-transform">{prompt.icon}</span>
                        <span className="font-medium group-hover:text-foreground transition-colors">{prompt.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-muted-foreground text-xs mt-8 leading-relaxed font-medium">
                  Rendering takes 2–3 minutes. Grab some coffee while we work our magic ☕
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message) => (
                <div key={message.id} className="animate-fade-in">
                  <MessageItem message={message} />
                </div>
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-6 bg-background">
        <div className="flex gap-3 max-w-2xl mx-auto">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your animation… (e.g., 'Draw y = sin(x)' or 'Define a tangent to a circle')"
            className="flex-1 bg-muted text-foreground placeholder-muted-foreground rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-ring border-0 transition-all font-medium text-sm shadow-sm hover:shadow-md focus:shadow-md"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground rounded-xl px-4 py-3 flex items-center justify-center transition-all font-semibold shadow-sm hover:shadow-md hover:scale-105 active:scale-95 duration-200"
          >
            <Send size={20} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  )
}
