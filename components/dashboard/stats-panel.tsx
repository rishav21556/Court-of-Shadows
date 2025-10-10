"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Trophy, Coins, Sword, Target, Crown } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useAuth } from "../auth/AuthWrapper"

interface StatItemProps {
  icon: React.ReactNode
  label: string
  value: number
  suffix?: string
  delay: number
}

function StatItem({ icon, label, value, suffix = "", delay }: StatItemProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 1500
    const steps = 60
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex items-center gap-3 rounded-lg border border-amber-600/20 bg-gradient-to-br from-amber-50 to-white p-3 shadow-sm"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-md">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-stone-600">{label}</p>
        <p className="font-serif text-lg font-bold text-stone-900">
          {count}
          {suffix}
        </p>
      </div>
    </motion.div>
  )
}

export function StatsPanel() {
  const { user } = useAuth();
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="h-fit"
    >
      <Card className="overflow-hidden border-2 border-amber-600/30 bg-gradient-to-br from-red-900 via-red-800 to-red-900 p-6 shadow-2xl">
        {/* Decorative corner ornaments */}
        <div className="absolute left-0 top-0 h-16 w-16 border-l-4 border-t-4 border-amber-400/50" />
        <div className="absolute bottom-0 right-0 h-16 w-16 border-b-4 border-r-4 border-amber-400/50" />

        <div className="relative space-y-4">
          {/* Player Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6 text-center"
          >
            <div className="mb-2 flex justify-center">
              <Crown className="h-8 w-8 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            </div>
            <h2 className="font-serif text-xl font-bold text-amber-100">Counselor of Ravens</h2>
            <p className="text-sm text-amber-200/70">Your Royal Title</p>
          </motion.div>

          {/* Stats */}
          <div className="space-y-3">
            {user?.total_wins && user?.total_wins > 0 && (
              <>
                <StatItem icon={<Target className="h-5 w-5" />} label="Games Played" value={user?.total_games || 0} delay={0.1} />
                <StatItem icon={<Trophy className="h-5 w-5" />} label="Total Wins" value={user?.total_wins || 0} delay={0.2} />
                <StatItem icon={<Coins className="h-5 w-5" />} label="Win Percentage" value={((user?.total_wins || 0) / (user?.total_games || 1) * 100) || 0} suffix="%" delay={0.3} />
              </>            
            )}
            <StatItem icon={<Sword className="h-5 w-5" />} label="Rating" value={user?.rating || 500} delay={0.4} />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
