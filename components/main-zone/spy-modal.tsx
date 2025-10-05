"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, X, AlertCircle, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import type { Player } from "@/lib/mock-data"
import { getPlayerAlliances } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface SpyModalProps {
  isOpen: boolean
  targetPlayer: Player | null
  onClose: () => void
  onConfirmSpy: () => void
}

// Mock spy intelligence levels (would be dynamic in production)
const INTELLIGENCE_LEVELS = ["Basic Info", "Resources", "Alliances", "Secret Plans"]

export function SpyModal({ isOpen, targetPlayer, onClose, onConfirmSpy }: SpyModalProps) {
  const [selectedLevel, setSelectedLevel] = useState(0)

  if (!targetPlayer) return null

  const alliances = getPlayerAlliances(targetPlayer.id)
  const spyCost = 50 + selectedLevel * 25

  // Mock intelligence data (would come from server in production)
  const intelligenceData = {
    basic: {
      title: targetPlayer.title,
      status: targetPlayer.status,
      influenceWeight: targetPlayer.influenceWeight,
    },
    resources: {
      gold: targetPlayer.gold,
      power: targetPlayer.power,
      spyCount: targetPlayer.spyCount,
    },
    alliances: alliances.map((a) => a.name),
    secretPlans: [
      "Planning to accuse Duke of Thornwood",
      "Considering alliance with Merchant Guild",
      "Stockpiling gold for revolt attempt",
    ],
  }

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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border-2 border-purple-500 rounded-lg shadow-2xl z-50"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center border-2 border-purple-500">
                    <Eye className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-purple-400">Deploy Spy</h2>
                    <p className="text-sm text-slate-400">Gather intelligence on your target</p>
                  </div>
                </div>
                <Button onClick={onClose} size="icon" variant="ghost" className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <Separator className="mb-6 bg-slate-700" />

              {/* Target info */}
              <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full border-2 border-purple-400 overflow-hidden">
                    <Image
                      src={targetPlayer.portraitUrl || "/placeholder.svg"}
                      alt={targetPlayer.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white">{targetPlayer.title}</h3>
                    <p className="text-sm text-slate-400">Target of espionage</p>
                  </div>
                </div>
              </div>

              {/* Intelligence level selection */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
                  Select Intelligence Level
                </h3>

                <div className="space-y-3">
                  {INTELLIGENCE_LEVELS.map((level, index) => {
                    const isSelected = selectedLevel === index
                    const cost = 50 + index * 25
                    return (
                      <motion.button
                        key={level}
                        onClick={() => setSelectedLevel(index)}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          isSelected
                            ? "border-purple-500 bg-purple-500/10"
                            : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                isSelected ? "border-purple-500 bg-purple-500" : "border-slate-600"
                              }`}
                            >
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </div>
                            <div>
                              <p className="font-semibold text-white">{level}</p>
                              <p className="text-xs text-slate-400">
                                {index === 0 && "Public information only"}
                                {index === 1 && "Gold, power, and spy counts"}
                                {index === 2 && "Alliance memberships revealed"}
                                {index === 3 && "Secret intentions and plans"}
                              </p>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full border border-purple-500/50">
                            {cost}g
                          </span>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Intelligence preview */}
              <div className="mb-6 p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-lg border border-purple-500/30">
                <h3 className="text-sm font-semibold text-purple-400 mb-3">Intelligence Preview</h3>

                <div className="space-y-3 text-sm">
                  {/* Basic info - always shown */}
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-semibold">Basic Information</p>
                      <p className="text-slate-400 text-xs">
                        Status: {intelligenceData.basic.status}, Influence: {intelligenceData.basic.influenceWeight}
                      </p>
                    </div>
                  </div>

                  {/* Resources */}
                  {selectedLevel >= 1 ? (
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-white font-semibold">Resource Details</p>
                        <p className="text-slate-400 text-xs">
                          {intelligenceData.resources.gold} gold, {intelligenceData.resources.power} power,{" "}
                          {intelligenceData.resources.spyCount} spies
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 opacity-50">
                      <AlertCircle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                      <p className="text-slate-500">Resource Details - Locked</p>
                    </div>
                  )}

                  {/* Alliances */}
                  {selectedLevel >= 2 ? (
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-white font-semibold">Alliance Memberships</p>
                        <p className="text-slate-400 text-xs">{intelligenceData.alliances.join(", ") || "None"}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 opacity-50">
                      <AlertCircle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                      <p className="text-slate-500">Alliance Memberships - Locked</p>
                    </div>
                  )}

                  {/* Secret plans */}
                  {selectedLevel >= 3 ? (
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-white font-semibold">Secret Plans</p>
                        <ul className="text-slate-400 text-xs list-disc list-inside">
                          {intelligenceData.secretPlans.map((plan, i) => (
                            <li key={i}>{plan}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 opacity-50">
                      <AlertCircle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                      <p className="text-slate-500">Secret Plans - Locked</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button
                  onClick={onConfirmSpy}
                  className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-bold"
                >
                  Deploy Spy ({spyCost}g)
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
