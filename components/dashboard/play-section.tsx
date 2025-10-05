"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Crown, Users, Swords, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PlaySection() {
  const [isMatchmaking, setIsMatchmaking] = useState(false)

  const handleEnterCourt = () => {
    setIsMatchmaking(true)
    // Simulate matchmaking
    setTimeout(() => {
      setIsMatchmaking(false)
    }, 5000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative flex flex-col items-center justify-center rounded-2xl border-4 border-amber-600/30 bg-gradient-to-br from-stone-100 via-white to-stone-100 p-8 shadow-2xl md:p-12"
    >
      {/* Background throne illustration with parallax */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="absolute inset-0 flex items-center justify-center opacity-5"
      >
        <Crown className="h-64 w-64 text-amber-900" />
      </motion.div>

      <div className="relative z-10 w-full max-w-md space-y-8 text-center">
        {/* Main emblem */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4, type: "spring" }}
          className="flex justify-center"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 via-red-600 to-amber-400 opacity-20 blur-xl"
            />
            <div className="relative rounded-full border-4 border-amber-600 bg-gradient-to-br from-red-900 to-red-800 p-8 shadow-2xl">
              <Crown className="h-16 w-16 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.6 }}>
          <h2 className="mb-2 font-serif text-3xl font-bold text-stone-900 md:text-4xl">The Court Awaits</h2>
          <p className="text-balance text-stone-600">Enter the palace and prove your worth among the shadows</p>
        </motion.div>

        {/* Play Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Button
            onClick={handleEnterCourt}
            disabled={isMatchmaking}
            className="glow-pulse group relative h-16 w-full overflow-hidden border-2 border-amber-600 bg-gradient-to-r from-red-900 via-red-800 to-red-900 px-8 font-serif text-xl font-bold text-white shadow-2xl transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] disabled:opacity-100"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {isMatchmaking ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  Summoning Counselors...
                </>
              ) : (
                <>
                  <Swords className="h-6 w-6" />
                  Enter the Court
                  <Swords className="h-6 w-6" />
                </>
              )}
            </span>
          </Button>
        </motion.div>

        {/* Live Activity */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex items-center justify-center gap-6 text-sm text-stone-600"
        >
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            <Users className="h-4 w-4" />
            <span className="font-medium">32 players online</span>
          </div>
          <div className="h-4 w-px bg-stone-300" />
          <div className="flex items-center gap-2">
            <Swords className="h-4 w-4" />
            <span className="font-medium">6 games in progress</span>
          </div>
        </motion.div>
      </div>

      {/* Matchmaking Overlay */}
      <AnimatePresence>
        {isMatchmaking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-stone-900/95 backdrop-blur-sm"
          >
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="mb-6 flex justify-center"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="h-24 w-24 rounded-full border-4 border-amber-400 border-t-transparent"
                  />
                  <Crown className="absolute inset-0 m-auto h-12 w-12 text-amber-400" />
                </div>
              </motion.div>
              <p className="font-serif text-2xl font-bold text-amber-100">Summoning other counselors...</p>
              <p className="mt-2 text-amber-200/70">Preparing the court chamber</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
