"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Crown, Coins, Users, Swords, TrendingUp, AlertTriangle, CheckCircle2, X } from "lucide-react"
import Image from "next/image"
import { CURRENT_PLAYER_ID, getPlayerById, mockPlayers, getPlayerAlliances } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface RevoltPanelProps {
  isOpen: boolean
  onClose: () => void
  onAttemptRevolt: (allyIds: string[]) => void
}

// Revolt requirements (static for POC)
const REVOLT_REQUIREMENTS = {
  minimumGold: 500,
  minimumAllies: 2,
  minimumCombinedPower: 30,
}

export function RevoltPanel({ isOpen, onClose, onAttemptRevolt }: RevoltPanelProps) {
  const [selectedAllyIds, setSelectedAllyIds] = useState<string[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)

  const currentPlayer = getPlayerById(CURRENT_PLAYER_ID)!
  const currentAlliances = getPlayerAlliances(CURRENT_PLAYER_ID)

  // Get potential allies (players in same alliances, excluding self and executed)
  const potentialAllies = mockPlayers.filter((p) => {
    if (p.id === CURRENT_PLAYER_ID || p.status === "executed") return false
    return currentAlliances.some((alliance) => alliance.memberIds.includes(p.id))
  })

  // Calculate revolt metrics
  const selectedAllies = mockPlayers.filter((p) => selectedAllyIds.includes(p.id))
  const totalGold = currentPlayer.gold + selectedAllies.reduce((sum, p) => sum + p.gold, 0)
  const totalPower = currentPlayer.power + selectedAllies.reduce((sum, p) => sum + p.power, 0)
  const allyCount = selectedAllyIds.length

  // Check conditions
  const goldMet = totalGold >= REVOLT_REQUIREMENTS.minimumGold
  const alliesMet = allyCount >= REVOLT_REQUIREMENTS.minimumAllies
  const powerMet = totalPower >= REVOLT_REQUIREMENTS.minimumCombinedPower
  const allConditionsMet = goldMet && alliesMet && powerMet

  // Calculate success chance (static formula for POC)
  const successChance = Math.min(
    95,
    Math.floor(
      (totalGold / REVOLT_REQUIREMENTS.minimumGold) * 30 +
        (allyCount / REVOLT_REQUIREMENTS.minimumAllies) * 30 +
        (totalPower / REVOLT_REQUIREMENTS.minimumCombinedPower) * 40,
    ),
  )

  const toggleAlly = (playerId: string) => {
    setSelectedAllyIds((prev) => (prev.includes(playerId) ? prev.filter((id) => id !== playerId) : [...prev, playerId]))
  }

  const handleAttemptRevolt = () => {
    if (allConditionsMet) {
      setShowConfirmation(true)
    }
  }

  const confirmRevolt = () => {
    onAttemptRevolt(selectedAllyIds)
    setShowConfirmation(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border-2 border-amber-500 rounded-lg shadow-2xl z-50"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center border-2 border-amber-500">
                    <Crown className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-amber-400">Plan Revolt</h2>
                    <p className="text-sm text-slate-400">Seize the throne with your allies</p>
                  </div>
                </div>
                <Button onClick={onClose} size="icon" variant="ghost" className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <Separator className="mb-6 bg-slate-700" />

              {/* Condition Indicators */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">Revolt Conditions</h3>

                <div className="space-y-4">
                  {/* Gold requirement */}
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Coins className={cn("w-5 h-5", goldMet ? "text-green-400" : "text-red-400")} />
                        <span className="font-semibold text-white">Combined Gold</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn("font-bold", goldMet ? "text-green-400" : "text-red-400")}>
                          {totalGold} / {REVOLT_REQUIREMENTS.minimumGold}
                        </span>
                        {goldMet ? (
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                    </div>
                    <Progress
                      value={(totalGold / REVOLT_REQUIREMENTS.minimumGold) * 100}
                      className="h-2"
                    />
                  </div>

                  {/* Allies requirement */}
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Users className={cn("w-5 h-5", alliesMet ? "text-green-400" : "text-red-400")} />
                        <span className="font-semibold text-white">Allied Support</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn("font-bold", alliesMet ? "text-green-400" : "text-red-400")}>
                          {allyCount} / {REVOLT_REQUIREMENTS.minimumAllies}
                        </span>
                        {alliesMet ? (
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                    </div>
                    <Progress
                      value={(allyCount / REVOLT_REQUIREMENTS.minimumAllies) * 100}
                      className="h-2"
                    />
                  </div>

                  {/* Power requirement */}
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Swords className={cn("w-5 h-5", powerMet ? "text-green-400" : "text-red-400")} />
                        <span className="font-semibold text-white">Combined Power</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn("font-bold", powerMet ? "text-green-400" : "text-red-400")}>
                          {totalPower} / {REVOLT_REQUIREMENTS.minimumCombinedPower}
                        </span>
                        {powerMet ? (
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                    </div>
                    <Progress
                      value={(totalPower / REVOLT_REQUIREMENTS.minimumCombinedPower) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              </div>

              {/* Success Gauge */}
              <div className="mb-6 p-4 bg-gradient-to-br from-amber-500/10 to-amber-600/5 rounded-lg border border-amber-500/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-400" />
                    <span className="font-semibold text-white">Estimated Success</span>
                  </div>
                  <motion.span
                    className="text-3xl font-bold text-amber-400"
                    key={successChance}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                  >
                    {successChance}%
                  </motion.span>
                </div>
                <Progress
                  value={successChance}
                  className="h-3"
                />
                <p className="text-xs text-slate-400 mt-2">
                  Based on combined resources, allies, and power. Actual outcome may vary.
                </p>
              </div>

              <Separator className="mb-6 bg-slate-700" />

              {/* Ally Selection */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
                  Select Allies ({selectedAllyIds.length} selected)
                </h3>

                {potentialAllies.length === 0 ? (
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-center">
                    <p className="text-slate-400">No potential allies available. Form alliances first.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {potentialAllies.map((player) => {
                      const isSelected = selectedAllyIds.includes(player.id)
                      return (
                        <motion.button
                          key={player.id}
                          onClick={() => toggleAlly(player.id)}
                          className={cn(
                            "p-3 rounded-lg border-2 transition-all text-left",
                            isSelected
                              ? "border-amber-500 bg-amber-500/10"
                              : "border-slate-700 bg-slate-800/50 hover:border-slate-600",
                          )}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden flex-shrink-0">
                              <Image
                                src={player.portraitUrl || "/placeholder.svg"}
                                alt={player.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-white text-sm truncate">{player.title}</h4>
                              <div className="flex items-center gap-2 text-xs text-slate-400">
                                <span>{player.power} power</span>
                                <span>•</span>
                                <span>~{Math.round(player.gold / 100) * 100} gold</span>
                              </div>
                            </div>
                            {isSelected && <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />}
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button
                  onClick={handleAttemptRevolt}
                  disabled={!allConditionsMet}
                  className={cn(
                    "flex-1 font-bold",
                    allConditionsMet
                      ? "bg-amber-500 hover:bg-amber-600 text-slate-900"
                      : "bg-slate-700 text-slate-500 cursor-not-allowed",
                  )}
                >
                  {allConditionsMet ? "Attempt Revolt" : "Conditions Not Met"}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Confirmation Modal */}
          <AnimatePresence>
            {showConfirmation && (
              <motion.div
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-900 border-2 border-red-500 rounded-lg shadow-2xl z-[60] p-6"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center border-2 border-red-500 mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white mb-2">Confirm Revolt</h3>
                  <p className="text-sm text-slate-400">
                    This action cannot be undone. If you fail, you and your allies will face severe consequences.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button onClick={() => setShowConfirmation(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={confirmRevolt} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold">
                    Confirm Revolt
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  )
}
