"use client"

import { motion } from "framer-motion"
import { Coins, Swords, Shield, Skull } from "lucide-react"
import Image from "next/image"
import { type Player, CURRENT_PLAYER_ID, getPlayerAlliances } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface PlayerNodeProps {
  player: Player
  isSelected: boolean
  isHighlighted: boolean
  onClick: () => void
}

export function PlayerNode({ player, isSelected, isHighlighted, onClick }: PlayerNodeProps) {
  const isCurrentPlayer = player.id === CURRENT_PLAYER_ID
  const isExecuted = player.status === "executed"
  const alliances = getPlayerAlliances(player.id)

  // Mask stats for other players
  const displayGold = isCurrentPlayer ? player.gold : "~" + Math.round(player.gold / 100) * 100
  const displayPower = isCurrentPlayer ? player.power : "~" + Math.round(player.power / 5) * 5

  return (
    <motion.button
      onClick={onClick}
      className={cn("relative group cursor-pointer", isExecuted && "opacity-60 cursor-not-allowed")}
      whileHover={!isExecuted ? { scale: 1.05 } : {}}
      whileTap={!isExecuted ? { scale: 0.95 } : {}}
      disabled={isExecuted}
    >
      {/* Selection ring */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-amber-500 -m-2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Highlight glow */}
      {isHighlighted && (
        <motion.div
          className="absolute inset-0 bg-blue-400/30 blur-xl rounded-full scale-150"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />
      )}

      {/* Main node container */}
      <div
        className={cn(
          "relative w-32 h-32 rounded-full border-4 bg-white shadow-xl transition-all",
          isSelected ? "border-amber-500" : "border-amber-200",
          isCurrentPlayer && "ring-4 ring-amber-400/50",
          !isExecuted && "group-hover:border-amber-400 group-hover:shadow-2xl",
        )}
      >
        {/* Portrait */}
        <div className="relative w-full h-full rounded-full overflow-hidden">
          <Image
            src={player.portraitUrl || "/placeholder.svg"}
            alt={player.title}
            fill
            className={cn("object-cover", isExecuted && "grayscale")}
          />

          {/* Executed overlay */}
          {isExecuted && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Skull className="w-12 h-12 text-red-400" />
            </div>
          )}
        </div>

        {/* Alliance badges */}
        {alliances.length > 0 && !isExecuted && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {alliances.map((alliance) => (
              <motion.div
                key={alliance.id}
                className="w-6 h-6 rounded-full border-2 border-white shadow-md overflow-hidden"
                style={{ backgroundColor: alliance.color }}
                whileHover={{ scale: 1.2 }}
                title={alliance.name}
              >
                <Image
                  src={alliance.emblemUrl || "/placeholder.svg"}
                  alt={alliance.name}
                  width={24}
                  height={24}
                  className="object-cover"
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Current player indicator */}
        {isCurrentPlayer && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center">
            <Shield className="w-3 h-3 text-white" />
          </div>
        )}
      </div>

      {/* Tooltip card on hover */}
      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        <motion.div
          className="bg-white border-2 border-amber-200 rounded-lg shadow-xl p-3 min-w-[200px]"
          initial={{ y: -10 }}
          animate={{ y: 0 }}
        >
          {/* Title */}
          <h3 className="font-serif text-sm font-bold text-slate-800 mb-2 text-center">{player.title}</h3>

          {/* Stats */}
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-slate-600">
                <Coins className="w-3 h-3 text-amber-600" />
                Gold
              </span>
              <span className="font-semibold text-slate-800">{displayGold}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-slate-600">
                <Swords className="w-3 h-3 text-red-600" />
                Power
              </span>
              <span className="font-semibold text-slate-800">{displayPower}</span>
            </div>
            {isCurrentPlayer && (
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Spies</span>
                <span className="font-semibold text-slate-800">{player.spyCount}</span>
              </div>
            )}
          </div>

          {/* Alliances */}
          {alliances.length > 0 && (
            <div className="mt-2 pt-2 border-t border-slate-200">
              <p className="text-xs text-slate-600 mb-1">Alliances:</p>
              <div className="flex flex-wrap gap-1">
                {alliances.map((alliance) => (
                  <span
                    key={alliance.id}
                    className="text-xs px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: alliance.color }}
                  >
                    {alliance.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Executed status */}
          {isExecuted && (
            <div className="mt-2 pt-2 border-t border-red-200">
              <p className="text-xs text-red-600 font-semibold text-center">EXECUTED</p>
            </div>
          )}

          {/* Current player note */}
          {isCurrentPlayer && (
            <div className="mt-2 pt-2 border-t border-amber-200">
              <p className="text-xs text-amber-700 font-semibold text-center">YOU</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.button>
  )
}
