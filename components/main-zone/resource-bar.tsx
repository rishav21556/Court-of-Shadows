"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Coins, Swords, Eye, Clock, Users } from "lucide-react"
import type { Player, ServerStats } from "@/lib/mock-data"

interface ResourceBarProps {
  currentPlayer: Player
  serverStats: ServerStats
}

export function ResourceBar({ currentPlayer, serverStats }: ResourceBarProps) {
  const [animatedGold, setAnimatedGold] = useState(0)
  const [animatedPower, setAnimatedPower] = useState(0)

  // Animate counting on mount
  useEffect(() => {
    const goldInterval = setInterval(() => {
      setAnimatedGold((prev) => {
        if (prev >= currentPlayer.gold) {
          clearInterval(goldInterval)
          return currentPlayer.gold
        }
        return prev + Math.ceil(currentPlayer.gold / 30)
      })
    }, 30)

    const powerInterval = setInterval(() => {
      setAnimatedPower((prev) => {
        if (prev >= currentPlayer.power) {
          clearInterval(powerInterval)
          return currentPlayer.power
        }
        return prev + 1
      })
    }, 50)

    return () => {
      clearInterval(goldInterval)
      clearInterval(powerInterval)
    }
  }, [currentPlayer.gold, currentPlayer.power])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-slate-900 via-slate-800 to-transparent border-b border-amber-500/30 backdrop-blur-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left: Player resources */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-500/50">
              <Coins className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Gold</p>
              <p className="text-lg font-bold text-amber-400">{animatedGold}</p>
            </div>
          </div>

          <div className="w-px h-10 bg-slate-700" />

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/50">
              <Swords className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Power</p>
              <p className="text-lg font-bold text-red-400">{animatedPower}</p>
            </div>
          </div>

          <div className="w-px h-10 bg-slate-700" />

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center border border-purple-500/50">
              <Eye className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Spies</p>
              <p className="text-lg font-bold text-purple-400">{currentPlayer.spyCount}</p>
            </div>
          </div>
        </div>

        {/* Center: Game title */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <h1 className="font-serif text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400">
            Court of Shadows
          </h1>
        </div>

        {/* Right: Server status */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-xs text-slate-400">Time Remaining</p>
              <p className="text-lg font-bold text-blue-400">{formatTime(serverStats.timeRemaining)}</p>
            </div>
          </div>

          <div className="w-px h-10 bg-slate-700" />

          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-xs text-slate-400">Turn {serverStats.turnNumber}</p>
              <p className="text-sm font-semibold text-green-400 capitalize">{serverStats.phase}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
