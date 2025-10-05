"use client"
import { motion } from "framer-motion"
import { Crown, Settings, BookOpen, LogOut, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="relative border-b-4 border-red-800/30 bg-gradient-to-r from-red-900 via-red-800 to-red-900 px-4 py-6 shadow-2xl md:px-8">
      {/* Decorative banner wave animation */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="banner-wave absolute inset-0 bg-gradient-to-b from-amber-400/30 to-transparent" />
      </div>

      <div className="relative mx-auto flex max-w-7xl items-center justify-between">
        {/* Game Title */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3"
        >
          <Crown className="h-8 w-8 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] md:h-10 md:w-10" />
          <h1 className="shimmer-text font-serif text-3xl font-bold text-white drop-shadow-lg md:text-4xl">
            Court of Shadows
          </h1>
        </motion.div>

        {/* Profile Dropdown */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full border-2 border-amber-400/50 bg-amber-400/10 text-white transition-all hover:border-amber-400 hover:bg-amber-400/20 hover:scale-110"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 border-amber-600/30 bg-stone-50">
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <BookOpen className="mr-2 h-4 w-4" />
                Tutorial
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      </div>
    </header>
  )
}
