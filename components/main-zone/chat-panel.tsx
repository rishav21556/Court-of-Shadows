"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, ChevronUp, ChevronDown, Send, Lock } from "lucide-react"
import Image from "next/image"
import { mockChatMessages, mockPlayers, getPlayerById, CURRENT_PLAYER_ID } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function ChatPanel() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [message, setMessage] = useState("")
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null)

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("[v0] Sending message:", message, "to:", selectedRecipient || "public")
      setMessage("")
    }
  }

  const formatTimestamp = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    return `${Math.floor(minutes / 60)}h ago`
  }

  return (
    <motion.div
      className="fixed bottom-20 right-4 w-96 z-30"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="bg-slate-900/95 border border-amber-500/30 rounded-lg backdrop-blur-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif text-lg font-bold text-amber-400">Court Chat</h3>
          </div>
          <Button
            onClick={() => setIsCollapsed(!isCollapsed)}
            size="icon"
            variant="ghost"
            className="text-slate-400 hover:text-white"
          >
            {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              {/* Messages list */}
              <div className="max-h-80 overflow-y-auto p-3 space-y-3">
                {mockChatMessages.map((msg, index) => {
                  const sender = getPlayerById(msg.senderId)
                  const isCurrentUser = msg.senderId === CURRENT_PLAYER_ID
                  const isWhisperToMe = msg.isWhisper && msg.recipientId === CURRENT_PLAYER_ID
                  const isWhisperFromMe = msg.isWhisper && msg.senderId === CURRENT_PLAYER_ID

                  return (
                    <motion.div
                      key={msg.id}
                      className={cn(
                        "flex gap-2",
                        isCurrentUser ? "flex-row-reverse" : "flex-row",
                        msg.isWhisper && "opacity-90",
                      )}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {/* Avatar */}
                      <div className="relative w-8 h-8 rounded-full border border-white/20 overflow-hidden flex-shrink-0">
                        <Image
                          src={sender?.portraitUrl || "/placeholder.svg"}
                          alt={sender?.title || "Unknown"}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Message bubble */}
                      <div className={cn("flex-1 min-w-0", isCurrentUser && "flex flex-col items-end")}>
                        <div
                          className={cn(
                            "inline-block max-w-[85%] p-2 rounded-lg",
                            isCurrentUser
                              ? "bg-amber-500/20 border border-amber-500/50"
                              : "bg-slate-800 border border-slate-700",
                            msg.isWhisper && "border-purple-500/50",
                          )}
                        >
                          {/* Sender name and whisper indicator */}
                          <div className="flex items-center gap-1 mb-1">
                            <p className="text-xs font-semibold text-amber-400">{sender?.title || "Unknown"}</p>
                            {msg.isWhisper && (
                              <div className="flex items-center gap-1">
                                <Lock className="w-3 h-3 text-purple-400" />
                                <span className="text-xs text-purple-400">
                                  {isWhisperToMe && "to you"}
                                  {isWhisperFromMe && `to ${getPlayerById(msg.recipientId!)?.title}`}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Message text */}
                          <p className="text-sm text-white leading-relaxed">{msg.message}</p>

                          {/* Timestamp */}
                          <p className="text-xs text-slate-400 mt-1">{formatTimestamp(msg.timestamp)}</p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Input area */}
              <div className="p-3 border-t border-slate-700 bg-slate-800/50">
                {/* Recipient selector */}
                {selectedRecipient && (
                  <div className="mb-2 flex items-center gap-2">
                    <Lock className="w-3 h-3 text-purple-400" />
                    <span className="text-xs text-purple-400">
                      Whispering to {getPlayerById(selectedRecipient)?.title}
                    </span>
                    <button
                      onClick={() => setSelectedRecipient(null)}
                      className="ml-auto text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* Message input */}
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleSendMessage()}
                    placeholder={selectedRecipient ? "Whisper a message..." : "Send a message to all..."}
                    className="flex-1 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    size="icon"
                    className="bg-amber-500 hover:bg-amber-600 text-slate-900"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                {/* Quick whisper buttons */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {mockPlayers
                    .filter((p) => p.id !== CURRENT_PLAYER_ID && p.status !== "executed")
                    .slice(0, 4)
                    .map((player) => (
                      <button
                        key={player.id}
                        onClick={() => setSelectedRecipient(player.id)}
                        className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-full transition-all"
                      >
                        Whisper to {player.title.split(" ")[0]}
                      </button>
                    ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
