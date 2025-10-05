"use client"

import { motion } from "framer-motion"
import { Crown } from "lucide-react"
import type { Player } from "@/lib/mock-data"
import { PlayerNode } from "@/components/main-zone/player-node"

interface MapBoardProps {
  players: Player[]
  selectedPlayerId: string | null
  onSelectPlayer: (playerId: string) => void
  highlightedPlayerIds?: string[]
}

export function MapBoard({ players, selectedPlayerId, onSelectPlayer, highlightedPlayerIds = [] }: MapBoardProps) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Marble texture overlay */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),rgba(148,163,184,0.2))]" />

      {/* Radial lighting from center */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.15),transparent_60%)]" />

      {/* Floating dust particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-200/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Central throne emblem */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-amber-400/30 blur-3xl rounded-full scale-150" />

          {/* Throne icon */}
          <div className="relative bg-gradient-to-br from-amber-100 to-amber-50 p-8 rounded-full border-4 border-amber-400 shadow-2xl">
            <Crown className="w-16 h-16 text-amber-600" strokeWidth={1.5} />
          </div>

          {/* Ornamental ring */}
          <motion.div
            className="absolute inset-0 border-2 border-amber-300/50 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            style={{ scale: 1.3 }}
          />
        </div>
      </motion.div>

      {/* Player nodes positioned around the throne */}
      <div className="relative w-full h-full">
        {players.map((player, index) => (
          <motion.div
            key={player.id}
            className="absolute"
            style={{
              left: `${player.position.x}%`,
              top: `${player.position.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
          >
            <PlayerNode
              player={player}
              isSelected={selectedPlayerId === player.id}
              isHighlighted={highlightedPlayerIds.includes(player.id)}
              onClick={() => onSelectPlayer(player.id)}
            />
          </motion.div>
        ))}
      </div>

      {/* Decorative corner ornaments */}
      <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-amber-400/30" />
      <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-amber-400/30" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-amber-400/30" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-amber-400/30" />
    </div>
  )
}
