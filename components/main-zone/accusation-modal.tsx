"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Gavel, X, ThumbsUp, ThumbsDown, Scale, AlertTriangle } from "lucide-react"
import Image from "next/image"
import type { Player } from "@/lib/mock-data"
import { mockPlayers, CURRENT_PLAYER_ID } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface AccusationModalProps {
  isOpen: boolean
  accusedPlayer: Player | null | undefined
  onClose: () => void
  onSubmitAccusation: (charges: string) => void
}

interface VoteDisplay {
  playerId: string
  vote: "guilty" | "innocent" | null
  weight: number
}

export function AccusationModal({ isOpen, accusedPlayer, onClose, onSubmitAccusation }: AccusationModalProps) {
  const [charges, setCharges] = useState("")
  const [showVoting, setShowVoting] = useState(false)
  const [currentVote, setCurrentVote] = useState<"guilty" | "innocent" | null>(null)

  // Mock voting data (would come from server in production)
  const [votes, setVotes] = useState<VoteDisplay[]>(
    mockPlayers
      .filter((p) => p.status !== "executed" && p.id !== accusedPlayer?.id)
      .map((p) => ({
        playerId: p.id,
        vote: p.id === CURRENT_PLAYER_ID ? currentVote : null,
        weight: p.influenceWeight,
      })),
  )

  if (!accusedPlayer) return null

  const handleSubmitCharges = () => {
    if (charges.trim()) {
      setShowVoting(true)
    }
  }

  const handleVote = (vote: "guilty" | "innocent") => {
    setCurrentVote(vote)
    setVotes((prev) => prev.map((v) => (v.playerId === CURRENT_PLAYER_ID ? { ...v, vote } : v)))
  }

  const handleConfirmVote = () => {
    if (currentVote) {
      onSubmitAccusation(charges)
      onClose()
    }
  }

  // Calculate vote totals
  const guiltyVotes = votes.filter((v) => v.vote === "guilty").reduce((sum, v) => sum + v.weight, 0)
  const innocentVotes = votes.filter((v) => v.vote === "innocent").reduce((sum, v) => sum + v.weight, 0)
  const totalWeight = votes.reduce((sum, v) => sum + v.weight, 0)
  const guiltyPercent = totalWeight > 0 ? (guiltyVotes / totalWeight) * 100 : 0
  const innocentPercent = totalWeight > 0 ? (innocentVotes / totalWeight) * 100 : 0

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border-2 border-red-500 rounded-lg shadow-2xl z-50"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center border-2 border-red-500">
                    <Gavel className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-red-400">
                      {showVoting ? "Trial in Progress" : "Accuse of Treason"}
                    </h2>
                    <p className="text-sm text-slate-400">
                      {showVoting ? "Cast your weighted vote" : "Formal accusation triggers public trial"}
                    </p>
                  </div>
                </div>
                <Button onClick={onClose} size="icon" variant="ghost" className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <Separator className="mb-6 bg-slate-700" />

              {/* Accused player info */}
              <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full border-2 border-red-400 overflow-hidden">
                    <Image
                      src={accusedPlayer.portraitUrl || "/placeholder.svg"}
                      alt={accusedPlayer.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white">{accusedPlayer.title}</h3>
                    <p className="text-sm text-slate-400">The Accused</p>
                  </div>
                </div>
              </div>

              {!showVoting ? (
                /* Charges input */
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
                    State Your Charges
                  </h3>
                  <Textarea
                    value={charges}
                    onChange={(e) => setCharges(e.target.value)}
                    placeholder="Describe the treasonous acts committed by the accused..."
                    className="min-h-32 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    Your charges will be public. All players will vote based on influence weight.
                  </p>
                </div>
              ) : (
                /* Voting interface */
                <div className="space-y-6 mb-6">
                  {/* Vote tally */}
                  <div className="p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Scale className="w-5 h-5 text-amber-400" />
                        <span className="font-semibold text-white">Weighted Vote Tally</span>
                      </div>
                      <span className="text-sm text-slate-400">
                        {votes.filter((v) => v.vote !== null).length} / {votes.length} voted
                      </span>
                    </div>

                    <div className="space-y-3">
                      {/* Guilty bar */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-red-400 font-semibold">Guilty</span>
                          <span className="text-sm text-red-400 font-bold">{guiltyVotes} weight</span>
                        </div>
                        <Progress value={guiltyPercent} className="h-3" />
                      </div>

                      {/* Innocent bar */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-green-400 font-semibold">Innocent</span>
                          <span className="text-sm text-green-400 font-bold">{innocentVotes} weight</span>
                        </div>
                        <Progress value={innocentPercent} className="h-3" />
                      </div>
                    </div>
                  </div>

                  {/* Charges display */}
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <h4 className="text-sm font-semibold text-slate-400 mb-2">Charges:</h4>
                    <p className="text-white text-sm">{charges}</p>
                  </div>

                  {/* Your vote */}
                  <div className="p-4 bg-gradient-to-br from-amber-500/10 to-amber-600/5 rounded-lg border border-amber-500/30">
                    <h4 className="text-sm font-semibold text-amber-400 mb-3">Cast Your Vote</h4>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={() => handleVote("guilty")}
                        className={cn(
                          "h-auto py-4 flex flex-col items-center gap-2",
                          currentVote === "guilty"
                            ? "bg-red-500 hover:bg-red-600 text-white border-2 border-red-400"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700",
                        )}
                      >
                        <ThumbsDown className="w-6 h-6" />
                        <span className="font-bold">Guilty</span>
                      </Button>

                      <Button
                        onClick={() => handleVote("innocent")}
                        className={cn(
                          "h-auto py-4 flex flex-col items-center gap-2",
                          currentVote === "innocent"
                            ? "bg-green-500 hover:bg-green-600 text-white border-2 border-green-400"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700",
                        )}
                      >
                        <ThumbsUp className="w-6 h-6" />
                        <span className="font-bold">Innocent</span>
                      </Button>
                    </div>

                    <p className="text-xs text-slate-400 mt-3 text-center">
                      Your vote carries {mockPlayers.find((p) => p.id === CURRENT_PLAYER_ID)?.influenceWeight} influence
                      weight
                    </p>
                  </div>

                  {/* Warning */}
                  <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-300">
                      If found guilty, the accused will be executed and removed from the game. This decision is final.
                    </p>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3">
                <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
                  Cancel
                </Button>
                {!showVoting ? (
                  <Button
                    onClick={handleSubmitCharges}
                    disabled={!charges.trim()}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold disabled:bg-slate-700 disabled:text-slate-500"
                  >
                    Submit Charges (150g)
                  </Button>
                ) : (
                  <Button
                    onClick={handleConfirmVote}
                    disabled={!currentVote}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold disabled:bg-slate-700 disabled:text-slate-500"
                  >
                    Confirm Vote
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
