"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { Eye, Handshake, Gavel, Search, Coins, X, AlertCircle, Clock } from "lucide-react"
import Image from "next/image"
import type { Player } from "@/lib/mock-data"
import { CURRENT_PLAYER_ID, getPlayerAlliances, isAllyWith } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface ActionsSidebarProps {
  selectedPlayer: Player | null
  onClose: () => void
  onActionClick: (action: string, targetId: string) => void
}

interface ActionButton {
  id: string
  label: string
  icon: React.ReactNode
  cost: { gold?: number; power?: number }
  cooldown?: number
  description: string
  disabled?: boolean
  disabledReason?: string
}

export function ActionsSidebar({ selectedPlayer, onClose, onActionClick }: ActionsSidebarProps) {
  if (!selectedPlayer) return null

  const isCurrentPlayer = selectedPlayer.id === CURRENT_PLAYER_ID
  const isExecuted = selectedPlayer.status === "executed"
  const isAlly = isAllyWith(CURRENT_PLAYER_ID, selectedPlayer.id)
  const alliances = getPlayerAlliances(selectedPlayer.id)

  // Define available actions
  const actions: ActionButton[] = [
    {
      id: "spy",
      label: "Deploy Spy",
      icon: <Eye className="w-4 h-4" />,
      cost: { gold: 50 },
      description: "Send a spy to gather intelligence on this player's resources, alliances, or intentions.",
      disabled: isCurrentPlayer || isExecuted,
      disabledReason: isCurrentPlayer ? "Cannot spy on yourself" : isExecuted ? "Player is executed" : undefined,
    },
    {
      id: "alliance",
      label: isAlly ? "Break Alliance" : "Propose Alliance",
      icon: <Handshake className="w-4 h-4" />,
      cost: { gold: isAlly ? 0 : 100 },
      description: isAlly
        ? "End your alliance with this player. This action is public."
        : "Propose a formal alliance. Both players gain mutual benefits and voting power.",
      disabled: isCurrentPlayer || isExecuted,
      disabledReason: isCurrentPlayer ? "Cannot ally with yourself" : isExecuted ? "Player is executed" : undefined,
    },
    {
      id: "accuse",
      label: "Accuse of Treason",
      icon: <Gavel className="w-4 h-4" />,
      cost: { gold: 150 },
      description: "Formally accuse this player of treason. Triggers a public trial with weighted voting.",
      disabled: isCurrentPlayer || isExecuted,
      disabledReason: isCurrentPlayer ? "Cannot accuse yourself" : isExecuted ? "Player already executed" : undefined,
    },
    {
      id: "inspect",
      label: "Inspect Details",
      icon: <Search className="w-4 h-4" />,
      cost: {},
      description: "View detailed public information about this player's status and history.",
      disabled: false,
    },
    {
      id: "bribe",
      label: "Offer Bribe",
      icon: <Coins className="w-4 h-4" />,
      cost: { gold: 200 },
      cooldown: 2,
      description: "Secretly offer gold to influence this player's vote in the next trial.",
      disabled: isCurrentPlayer || isExecuted,
      disabledReason: isCurrentPlayer ? "Cannot bribe yourself" : isExecuted ? "Player is executed" : undefined,
    },
  ]

  return (
    <AnimatePresence>
      <motion.div
        className="fixed right-0 top-20 bottom-20 w-96 z-30 bg-slate-900/95 border-l border-amber-500/30 backdrop-blur-sm overflow-y-auto"
        initial={{ x: 400 }}
        animate={{ x: 0 }}
        exit={{ x: 400 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6">
          {/* Header with close button */}
          <div className="flex items-start justify-between mb-4">
            <h2 className="font-serif text-xl font-bold text-amber-400">Player Actions</h2>
            <Button onClick={onClose} size="icon" variant="ghost" className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <Separator className="mb-6 bg-slate-700" />

          {/* Selected player info */}
          <motion.div
            className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4 mb-3">
              {/* Portrait */}
              <div className="relative w-16 h-16 rounded-full border-2 border-amber-400 overflow-hidden flex-shrink-0">
                <Image
                  src={selectedPlayer.portraitUrl || "/placeholder.svg"}
                  alt={selectedPlayer.title}
                  fill
                  className={cn("object-cover", isExecuted && "grayscale")}
                />
              </div>

              {/* Title and status */}
              <div className="flex-1">
                <h3 className="font-serif text-lg font-bold text-white">{selectedPlayer.title}</h3>
                {isCurrentPlayer && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full border border-amber-500/50">
                    YOU
                  </span>
                )}
                {isExecuted && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full border border-red-500/50">
                    EXECUTED
                  </span>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-slate-400 text-xs">Influence Weight</p>
                <p className="text-white font-semibold">{selectedPlayer.influenceWeight}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Status</p>
                <p className="text-white font-semibold capitalize">{selectedPlayer.status}</p>
              </div>
            </div>

            {/* Alliances */}
            {alliances.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-700">
                <p className="text-slate-400 text-xs mb-2">Alliances:</p>
                <div className="flex flex-wrap gap-2">
                  {alliances.map((alliance) => (
                    <span
                      key={alliance.id}
                      className="px-2 py-1 text-xs rounded-full text-white border"
                      style={{
                        backgroundColor: alliance.color + "20",
                        borderColor: alliance.color + "50",
                        color: alliance.color,
                      }}
                    >
                      {alliance.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Ally indicator */}
            {isAlly && !isCurrentPlayer && (
              <div className="mt-3 pt-3 border-t border-slate-700">
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <Handshake className="w-4 h-4" />
                  <span>Allied with you</span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Actions list */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Available Actions</h3>

            {actions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Button
                  onClick={() => !action.disabled && onActionClick(action.id, selectedPlayer.id)}
                  disabled={action.disabled}
                  className={cn(
                    "w-full h-auto p-4 flex flex-col items-start gap-2 text-left",
                    action.disabled
                      ? "bg-slate-800/30 border-slate-700 cursor-not-allowed opacity-50"
                      : "bg-slate-800 border-slate-600 hover:bg-slate-700 hover:border-amber-500/50",
                  )}
                  variant="outline"
                >
                  {/* Action header */}
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className="text-amber-400">{action.icon}</div>
                      <span className="font-semibold text-white">{action.label}</span>
                    </div>

                    {/* Cost badges */}
                    <div className="flex items-center gap-2">
                      {action.cost.gold && (
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full border border-amber-500/50">
                          {action.cost.gold}g
                        </span>
                      )}
                      {action.cost.power && (
                        <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full border border-red-500/50">
                          {action.cost.power}p
                        </span>
                      )}
                      {action.cooldown && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/50">
                          <Clock className="w-3 h-3" />
                          {action.cooldown}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400">{action.description}</p>

                  {/* Disabled reason */}
                  {action.disabled && action.disabledReason && (
                    <div className="flex items-center gap-1 text-xs text-red-400">
                      <AlertCircle className="w-3 h-3" />
                      <span>{action.disabledReason}</span>
                    </div>
                  )}
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Help text */}
          <div className="mt-6 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-xs text-blue-300">
              Select an action to interact with {selectedPlayer.title}. Some actions are public and will be visible to
              all players, while others remain secret.
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
