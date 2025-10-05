"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BookOpen, Scroll } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export function TutorialPanel() {
  const [tutorialOpen, setTutorialOpen] = useState(false)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="h-fit"
      >
        <Card className="overflow-hidden border-2 border-amber-600/30 bg-gradient-to-br from-amber-50 via-stone-50 to-amber-50 p-6 shadow-2xl">
          {/* Parchment texture effect */}
          <div className="absolute inset-0 bg-[url('/parchment-texture.png')] opacity-5" />

          <div className="relative space-y-4">
            {/* How to Play Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Button
                onClick={() => setTutorialOpen(true)}
                className="w-full border-2 border-amber-600 bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg transition-all hover:scale-105 hover:from-amber-700 hover:to-amber-800 hover:shadow-xl"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                How to Play
              </Button>
            </motion.div>

            {/* Court Chronicles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-lg border-2 border-amber-600/30 bg-white/50 p-4 shadow-inner"
            >
              <div className="mb-3 flex items-center gap-2">
                <Scroll className="h-5 w-5 animate-pulse text-amber-700" />
                <h3 className="font-serif text-lg font-bold text-stone-900">Court Chronicles</h3>
              </div>
              <p className="text-balance font-serif text-sm leading-relaxed text-stone-700">
                In the shadowed halls of the royal palace, whispers of betrayal echo through marble corridors.
                Counselors gather in secret, forging alliances and plotting against rivals. Only the cunning survive,
                and only the bold claim the throne...
              </p>
            </motion.div>

            {/* Decorative quill */}
            <motion.div
              animate={{ rotate: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="flex justify-center opacity-30"
            >
              <svg className="h-16 w-16 text-amber-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.71 2.29a1 1 0 0 0-1.42 0l-18 18a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l18-18a1 1 0 0 0 0-1.42zM7 17l-3 3v-3h3z" />
              </svg>
            </motion.div>
          </div>
        </Card>
      </motion.div>

      {/* Tutorial Modal */}
      <Dialog open={tutorialOpen} onOpenChange={setTutorialOpen}>
        <DialogContent className="max-w-2xl border-2 border-amber-600/30 bg-gradient-to-br from-stone-50 to-amber-50">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-stone-900">How to Play Court of Shadows</DialogTitle>
            <DialogDescription className="text-stone-600">Master the art of courtly intrigue</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="rounded-lg border border-amber-600/20 bg-white p-4">
              <h4 className="mb-2 font-serif font-bold text-red-900">1. Form Alliances</h4>
              <p className="text-sm text-stone-700">
                Build trust with other counselors through secret negotiations and mutual support.
              </p>
            </div>

            <div className="rounded-lg border border-amber-600/20 bg-white p-4">
              <h4 className="mb-2 font-serif font-bold text-red-900">2. Spy on Rivals</h4>
              <p className="text-sm text-stone-700">
                Gather intelligence on your opponents' plans and use it to your advantage.
              </p>
            </div>

            <div className="rounded-lg border border-amber-600/20 bg-white p-4">
              <h4 className="mb-2 font-serif font-bold text-red-900">3. Hold Trials</h4>
              <p className="text-sm text-stone-700">
                Accuse suspected traitors and convince others to vote for their exile.
              </p>
            </div>

            <div className="rounded-lg border border-amber-600/20 bg-white p-4">
              <h4 className="mb-2 font-serif font-bold text-red-900">4. Lead the Revolt</h4>
              <p className="text-sm text-stone-700">
                When the time is right, rally your allies and seize control of the throne!
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
