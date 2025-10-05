"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Users } from "lucide-react"
import Image from "next/image"
import type { Alliance } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AlliancePanelProps {
  alliances: Alliance[]
  onAllianceClick: (allianceId: string) => void
  selectedAllianceId: string | null
}

export function AlliancePanel({ alliances, onAllianceClick, selectedAllianceId }: AlliancePanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <motion.div
      className="fixed left-0 top-20 bottom-20 z-30"
      initial={{ x: -300 }}
      animate={{ x: isCollapsed ? -240 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-full">
        {/* Panel content */}
        <div className="h-full w-64 bg-slate-900/95 border-r border-amber-500/30 backdrop-blur-sm overflow-y-auto">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-700">
              <Users className="w-5 h-5 text-amber-400" />
              <h2 className="font-serif text-lg font-bold text-amber-400">Alliances</h2>
            </div>

            {/* Alliance list */}
            <div className="space-y-3">
              {alliances.map((alliance, index) => (
                <motion.button
                  key={alliance.id}
                  onClick={() => onAllianceClick(alliance.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border-2 transition-all",
                    selectedAllianceId === alliance.id
                      ? "border-amber-500 bg-amber-500/10"
                      : "border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800",
                  )}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    {/* Alliance emblem */}
                    <div
                      className="w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden flex-shrink-0"
                      style={{ backgroundColor: alliance.color }}
                    >
                      <Image
                        src={alliance.emblemUrl || "/placeholder.svg"}
                        alt={alliance.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>

                    {/* Alliance info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-sm truncate">{alliance.name}</h3>
                      <p className="text-xs text-slate-400">{alliance.memberIds.length} members</p>
                    </div>

                    {/* Color indicator */}
                    <div
                      className="w-3 h-3 rounded-full border border-white/30"
                      style={{ backgroundColor: alliance.color }}
                    />
                  </div>

                  {/* Description (shown when selected) */}
                  <AnimatePresence>
                    {selectedAllianceId === alliance.id && (
                      <motion.p
                        className="mt-2 pt-2 border-t border-slate-700 text-xs text-slate-300"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        {alliance.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-6 pt-4 border-t border-slate-700">
              <p className="text-xs text-slate-400 text-center">
                {alliances.reduce((sum, a) => sum + a.memberIds.length, 0)} players in {alliances.length} alliances
              </p>
            </div>
          </div>
        </div>

        {/* Collapse toggle button */}
        <Button
          onClick={() => setIsCollapsed(!isCollapsed)}
          size="icon"
          variant="outline"
          className="absolute -right-10 top-1/2 -translate-y-1/2 w-8 h-16 rounded-r-lg border-l-0 bg-slate-900/95 border-amber-500/30 hover:bg-slate-800"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-amber-400" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-amber-400" />
          )}
        </Button>
      </div>
    </motion.div>
  )
}
