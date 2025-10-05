"use client"

import { motion } from "framer-motion"

export function Footer() {
  return (
    <footer className="border-t-2 border-amber-600/20 bg-gradient-to-r from-stone-100 via-stone-50 to-stone-100 px-4 py-6 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-stone-600 md:flex-row"
      >
        {/* Navigation Links */}
        <div className="flex gap-6">
          <a href="#" className="transition-colors hover:text-red-800">
            Terms
          </a>
          <a href="#" className="transition-colors hover:text-red-800">
            Privacy
          </a>
          <a href="#" className="transition-colors hover:text-red-800">
            Support
          </a>
        </div>

        {/* Version & Status */}
        <div className="flex items-center gap-4">
          <span className="text-stone-500">v1.0.0</span>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <span className="font-medium text-green-700">Server Online</span>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}
