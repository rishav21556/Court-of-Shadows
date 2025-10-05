"use client"

import { useState } from "react"
import { MapBoard } from "@/components/main-zone/map-board"
import { ResourceBar } from "@/components/main-zone/resource-bar"
import { AlliancePanel } from "@/components/main-zone/alliance-panel"
import { ActionsSidebar } from "@/components/main-zone/actions-sidebar"
import { RevoltPanel } from "@/components/main-zone/revolt-panel"
import { SpyModal } from "@/components/main-zone/spy-modal"
import { AccusationModal } from "@/components/main-zone/accusation-modal"
import { ActionHistoryPanel } from "@/components/main-zone/action-history-panel"
import { ChatPanel } from "@/components/main-zone/chat-panel"
import { mockPlayers, mockAlliances, mockServerStats, CURRENT_PLAYER_ID, getPlayerById } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Crown } from "lucide-react"

export default function MainZonePage() {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null)
  const [selectedAllianceId, setSelectedAllianceId] = useState<string | null>(null)
  const [highlightedPlayerIds, setHighlightedPlayerIds] = useState<string[]>([])
  const [isRevoltPanelOpen, setIsRevoltPanelOpen] = useState(false)
  const [spyTargetId, setSpyTargetId] = useState<string | null>(null)
  const [accusedPlayerId, setAccusedPlayerId] = useState<string | null>(null)

  const currentPlayer = getPlayerById(CURRENT_PLAYER_ID)!
  const selectedPlayer = selectedPlayerId ? getPlayerById(selectedPlayerId) : null
  const spyTarget = spyTargetId ? getPlayerById(spyTargetId) : null
  const accusedPlayer = accusedPlayerId ? getPlayerById(accusedPlayerId) : null

  const handleAllianceClick = (allianceId: string) => {
    if (selectedAllianceId === allianceId) {
      setSelectedAllianceId(null)
      setHighlightedPlayerIds([])
    } else {
      setSelectedAllianceId(allianceId)
      const alliance = mockAlliances.find((a) => a.id === allianceId)
      if (alliance) {
        setHighlightedPlayerIds(alliance.memberIds)
      }
    }
  }

  const handleActionClick = (action: string, targetId: string) => {
    console.log("[v0] Action clicked:", action, "on player:", targetId)

    if (action === "spy") {
      setSpyTargetId(targetId)
      setSelectedPlayerId(null)
    } else if (action === "accuse") {
      setAccusedPlayerId(targetId)
      setSelectedPlayerId(null)
    }
  }

  const handleAttemptRevolt = (allyIds: string[]) => {
    console.log("[v0] Revolt attempted with allies:", allyIds)
  }

  const handleConfirmSpy = () => {
    console.log("[v0] Spy deployed on:", spyTargetId)
    setSpyTargetId(null)
  }

  const handleSubmitAccusation = (charges: string) => {
    console.log("[v0] Accusation submitted:", charges, "against:", accusedPlayerId)
    setAccusedPlayerId(null)
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-slate-900">
      {/* Top resource bar */}
      <ResourceBar currentPlayer={currentPlayer} serverStats={mockServerStats} />

      {/* Left alliance panel */}
      <AlliancePanel
        alliances={mockAlliances}
        onAllianceClick={handleAllianceClick}
        selectedAllianceId={selectedAllianceId}
      />

      {/* Right actions sidebar */}
      {selectedPlayer && (
        <ActionsSidebar
          selectedPlayer={selectedPlayer}
          onClose={() => setSelectedPlayerId(null)}
          onActionClick={handleActionClick}
        />
      )}

      {/* Revolt panel */}
      <RevoltPanel
        isOpen={isRevoltPanelOpen}
        onClose={() => setIsRevoltPanelOpen(false)}
        onAttemptRevolt={handleAttemptRevolt}
      />

      {/* Spy modal */}
      <SpyModal
        isOpen={!!spyTargetId}
        targetPlayer={spyTarget}
        onClose={() => setSpyTargetId(null)}
        onConfirmSpy={handleConfirmSpy}
      />

      {/* Accusation modal */}
      <AccusationModal
        isOpen={!!accusedPlayerId}
        accusedPlayer={accusedPlayer}
        onClose={() => setAccusedPlayerId(null)}
        onSubmitAccusation={handleSubmitAccusation}
      />

      {/* Main game board */}
      <div className="flex-1 relative mt-16">
        <MapBoard
          players={mockPlayers}
          selectedPlayerId={selectedPlayerId}
          onSelectPlayer={setSelectedPlayerId}
          highlightedPlayerIds={highlightedPlayerIds}
        />
      </div>

      {/* Bottom left - Action history */}
      <ActionHistoryPanel />

      {/* Bottom right - Chat */}
      <ChatPanel />

      {/* Bottom center - Revolt button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
        <Button
          onClick={() => setIsRevoltPanelOpen(true)}
          size="lg"
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-bold shadow-2xl border-2 border-amber-400"
        >
          <Crown className="w-5 h-5 mr-2" />
          Plan Revolt
        </Button>
      </div>
    </div>
  )
}
