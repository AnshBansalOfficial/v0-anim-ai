"use client"
import { Zap } from "lucide-react"

interface Message {
  id: string
  text: string
  timestamp: Date
  videoUrl?: string
  isResponse?: boolean
  isLoading?: boolean
}

interface MessageItemProps {
  message: Message
}

export default function MessageItem({ message }: MessageItemProps) {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleOpenVideo = () => {
    if (message.videoUrl) {
      window.open(message.videoUrl, "_blank")
    }
  }

  return (
    <div className={`flex ${message.isResponse ? "justify-start" : "justify-end"} mb-4 animate-fade-in`}>
      <div
        className={`max-w-sm transition-all duration-300 ${
          message.isResponse
            ? "bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-3 shadow-md hover:shadow-lg"
            : "bg-black dark:bg-white border border-gray-900 dark:border-gray-100 rounded-2xl px-5 py-3 shadow-md hover:shadow-lg"
        }`}
      >
        <p
          className={`text-sm leading-relaxed font-medium ${
            message.isResponse ? "text-black dark:text-white" : "text-white dark:text-black"
          }`}
        >
          {message.text}
        </p>

        <p
          className={`text-xs mt-2 font-normal ${
            message.isResponse ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-600"
          }`}
        >
          {formatTime(message.timestamp)}
        </p>

        {message.isLoading && (
          <div className="flex items-center gap-2 mt-3">
            <div className="flex gap-1.5">
              <div
                className="w-2 h-2 bg-black dark:bg-white rounded-full animate-typing"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="w-2 h-2 bg-black dark:bg-white rounded-full animate-typing"
                style={{ animationDelay: "0.15s" }}
              ></div>
              <div
                className="w-2 h-2 bg-black dark:bg-white rounded-full animate-typing"
                style={{ animationDelay: "0.3s" }}
              ></div>
            </div>
            <span className="text-gray-700 dark:text-gray-300 text-xs font-medium">Creating your animation...</span>
          </div>
        )}

        {message.isResponse && message.videoUrl && (
          <div className="mt-4 pt-3 border-t border-gray-300/50 dark:border-white/10">
            <p className="text-xs text-gray-700 dark:text-gray-300 mb-2 font-medium">Your animation is ready! 🎬</p>
            <button
              onClick={handleOpenVideo}
              className="inline-flex items-center gap-2 bg-black dark:bg-white hover:bg-gray-900 dark:hover:bg-gray-100 text-white dark:text-black px-4 py-2 rounded-xl transition-all text-xs font-semibold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 duration-200"
            >
              <Zap size={14} strokeWidth={2} />
              Watch Animation
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
