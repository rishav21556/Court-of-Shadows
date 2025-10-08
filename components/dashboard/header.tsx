"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Crown, Settings, BookOpen, LogOut, User, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useAuth } from "../auth/AuthWrapper"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function Header() {
  const { user } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSettings = () => {
    router.push('/');
    setIsDropdownOpen(false);
  };

  const handleTutorial = () => {
    router.push('/');
    setIsDropdownOpen(false);
  };

  const logout = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    await fetch(`${baseUrl}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setIsDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b-4 border-red-800/30 bg-gradient-to-r from-red-900 via-red-800 to-red-900 px-4 py-4 shadow-2xl backdrop-blur-sm md:px-8 md:py-6">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-amber-400/30 to-transparent"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{ backgroundSize: "200% 200%" }}
        />
      </div>

      {/* Ornamental corners */}
      <div className="absolute left-0 top-0 h-16 w-16 border-l-2 border-t-2 border-amber-400/30 pointer-events-none" />
      <div className="absolute right-0 top-0 h-16 w-16 border-r-2 border-t-2 border-amber-400/30 pointer-events-none" />

      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Game Title Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center gap-3"
        >
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          >
            <Crown className="h-8 w-8 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] md:h-10 md:w-10" />
          </motion.div>
          <div className="flex flex-col">
            <h1 className="font-serif text-2xl font-bold leading-tight text-white drop-shadow-lg md:text-4xl">
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                Court of Shadows
              </span>
            </h1>
            <span className="text-xs text-amber-400/70 md:text-sm">Strategic Intrigue Awaits</span>
          </div>
        </motion.div>

        {/* User Profile Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center gap-3"
        >
          {/* User info display (optional) */}
          {user && (
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold text-amber-400">{user.user_name}</span>
              <span className="text-xs text-amber-400/60 capitalize">{user.role || 'Player'}</span>
            </div>
          )}

          {/* Profile Dropdown Menu */}
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="group relative h-11 gap-2 rounded-full border-2 border-amber-400/50 bg-gradient-to-br from-amber-400/20 to-amber-600/20 px-4 text-white shadow-lg transition-all duration-300 hover:border-amber-400 hover:from-amber-400/30 hover:to-amber-600/30 hover:shadow-amber-400/50 hover:scale-105 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-red-900"
              >
                <User className="h-5 w-5 text-amber-400" />
                <span className="hidden text-sm font-semibold sm:inline">Profile</span>
                <ChevronDown
                  className={`h-4 w-4 text-amber-400 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="z-[100] w-56 border-2 border-amber-600/50 bg-stone-900/95 p-2 shadow-2xl backdrop-blur-md animate-in slide-in-from-top-2 duration-200"
            >
              {/* User info in dropdown (mobile) */}
              {user && (
                <>
                  <div className="mb-2 flex items-center gap-3 rounded-md bg-stone-800/50 p-3 md:hidden">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400/20">
                      <User className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white">{user.user_name}</span>
                      <span className="text-xs text-amber-400/70 capitalize">{user.role || 'Player'}</span>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-amber-600/30 md:hidden" />
                </>
              )}

              {/* Menu Items */}
              <DropdownMenuItem
                onClick={handleSettings}
                className="group cursor-pointer rounded-md px-3 py-2.5 text-white transition-colors hover:bg-stone-800 focus:bg-stone-800 focus:text-white"
              >
                <Settings className="mr-3 h-4 w-4 text-amber-400 transition-transform group-hover:rotate-90" />
                <span className="font-medium">Settings</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleTutorial}
                className="group cursor-pointer rounded-md px-3 py-2.5 text-white transition-colors hover:bg-stone-800 focus:bg-stone-800 focus:text-white"
              >
                <BookOpen className="mr-3 h-4 w-4 text-amber-400 transition-transform group-hover:scale-110" />
                <span className="font-medium">Tutorial</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-2 bg-amber-600/30" />

              <DropdownMenuItem
                onClick={handleLogout}
                className="group cursor-pointer rounded-md px-3 py-2.5 text-red-400 transition-colors hover:bg-red-950/50 focus:bg-red-950/50 focus:text-red-300"
              >
                <LogOut className="mr-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
                <span className="font-medium">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      </div>

      {/* Bottom decorative line */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </header>
  )
}