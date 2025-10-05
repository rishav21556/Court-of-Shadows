"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { History, ChevronUp, ChevronDown, Eye, Handshake, Gavel, Crown, Skull, Coins } from "lucide-react"
import { mockGameActions } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ACTION_ICONS = {
  alliance: Handshake,
  accusation: Gavel,
  spy: Eye,
  revolt: Crown,
  execution: Skull,
  bribe: Coins,
  vote: Gavel,
}

const ACTION_COLORS = {
  alliance: "text-green-400 bg-green-500/20 border-green-500/50",
  accusation: "text-red-400 bg-red-500/20 border-red-500/50",
  spy: "text-purple-400 bg-purple-500/20 border-purple-500/50",
  revolt: "text-amber-400 bg-amber-500/20 border-amber-500/50",
  execution: "text-slate-400 bg-slate-500/20 border-slate-500/50",
  bribe: "text-yellow-400 bg-yellow-500/20 border-yellow-500/50",
  vote: "text-blue-400 bg-blue-500/20 border-blue-500/50",
}

export function ActionHistoryPanel() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [filter, setFilter] = useState<"all" | "public" | "private">("all")

  const filteredActions = mockGameActions.filter((action) => {
    if (filter === "public") return action.isPublic
    if (filter === "private") return !action.isPublic
    return true
  })

  const formatTimestamp = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    return `${Math.floor(minutes / 60)}h ago`
  }

  return (
    <motion.div
      className="fixed bottom-20 left-4 w-96 z-30"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-slate-900/95 border border-amber-500/30 rounded-lg backdrop-blur-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif text-lg font-bold text-amber-400">Action History</h3>
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
              {/* Filter tabs */}
              <div className="flex gap-2 p-3 bg-slate-800/50 border-b border-slate-700">
                {(["all", "public", "private"] as const).map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    className={cn(
                      "px-3 py-1 text-xs font-semibold rounded-full transition-all capitalize",
                      filter === filterType
                        ? "bg-amber-500 text-slate-900"
                        : "bg-slate-700 text-slate-400 hover:bg-slate-600",
                    )}
                  >
                    {filterType}
                  </button>
                ))}
              </div>

              {/* Actions list */}
              <div className="max-h-96 overflow-y-auto p-3 space-y-2">
                {filteredActions.length === 0 ? (
                  <p className="text-center text-slate-400 text-sm py-4">No actions to display</p>
                ) : (
                  filteredActions.map((action, index) => {
                    const Icon = ACTION_ICONS[action.type]
                    const colorClass = ACTION_COLORS[action.type]

                    return (
                      <motion.div
                        key={action.id}
                        className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-all"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div
                            className={cn("w-8 h-8 rounded-full flex items-center justify-center border", colorClass)}
                          >
                            <Icon className="w-4 h-4" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white leading-relaxed">{action.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-slate-400">{formatTimestamp(action.timestamp)}</span>
                              {!action.isPublic && (
                                <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/50">
                                  Secret
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
