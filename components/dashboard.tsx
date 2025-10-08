"use client"

import { Header } from "@/components/dashboard/header"
import { StatsPanel } from "@/components/dashboard/stats-panel"
import { TutorialPanel } from "@/components/dashboard/tutorial-panel"
import { PlaySection } from "@/components/dashboard/play-section"
import { Footer } from "@/components/dashboard/footer"
import { FloatingParticles } from "@/components/dashboard/floating-particles"
import { useAuth } from "@/components/auth/AuthWrapper"

export function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-stone-50 via-white to-stone-100">
      {/* Background decorative elements */}
      <FloatingParticles />

      {/* Ornamental border */}
      <div className="pointer-events-none absolute inset-0 border-8 border-amber-600/20" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />

        <main className="flex-1 px-4 py-8 md:px-8">
          <div className="mx-auto max-w-7xl">
            {/* Desktop: 3-column layout, Mobile: stacked */}
            <div className="grid gap-6 lg:grid-cols-[300px_1fr_300px]">
              <StatsPanel />
              <PlaySection />
              <TutorialPanel />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
