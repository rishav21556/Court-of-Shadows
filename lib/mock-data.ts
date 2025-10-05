// MOCK DATA - POC ONLY
// This file contains static data for demonstration purposes
// In production, this data would come from the game server

export interface Player {
  id: string
  title: string // Anonymous title like "The Crimson Duke"
  portraitUrl: string
  gold: number
  power: number // Knights/military power
  alliances: string[] // Array of alliance IDs
  influenceWeight: number // Used in trial voting
  status: "alive" | "executed"
  position: { x: number; y: number } // Position on board (percentage)
  spyCount: number
  intent?: "revolt" | "loyal" | "neutral" // Hidden from others
}

export interface Alliance {
  id: string
  name: string
  emblemUrl: string
  description: string
  memberIds: string[]
  color: string // For visual identification
}

export interface ActionLog {
  id: string
  timestamp: Date
  actorId: string
  targetId?: string
  action: "spy" | "accuse" | "alliance_proposed" | "alliance_accepted" | "bribe" | "revolt_attempt"
  result: string
  isPrivate: boolean
}

export interface ServerStats {
  turnNumber: number
  phase: "planning" | "voting" | "resolution"
  timeRemaining: number // seconds
  activePlayers: number
}

export interface GameAction {
  id: string
  timestamp: number
  type: "alliance" | "accusation" | "spy" | "revolt" | "execution" | "bribe" | "vote"
  actorId: string
  targetId?: string
  description: string
  isPublic: boolean
}

export interface ChatMessage {
  id: string
  timestamp: number
  senderId: string
  recipientId?: string // undefined means public
  message: string
  isWhisper: boolean
}

// MOCK: Current player ID
export const CURRENT_PLAYER_ID = "player-1"

// MOCK: 10 Players arranged around the throne
export const mockPlayers: Player[] = [
  {
    id: "player-1",
    title: "The Crimson Duke",
    portraitUrl: "/noble-red-duke.jpg",
    gold: 450,
    power: 12,
    spyCount: 2,
    alliances: ["alliance-1"],
    influenceWeight: 3,
    status: "alive",
    position: { x: 50, y: 15 }, // Top center
    intent: "revolt",
  },
  {
    id: "player-2",
    title: "The Silver Baroness",
    portraitUrl: "/noble-silver-woman.jpg",
    gold: 320,
    power: 8,
    spyCount: 1,
    alliances: ["alliance-1"],
    influenceWeight: 2,
    status: "alive",
    position: { x: 75, y: 25 },
    intent: "loyal",
  },
  {
    id: "player-3",
    title: "The Golden Merchant",
    portraitUrl: "/wealthy-merchant-gold.jpg",
    gold: 680,
    power: 5,
    spyCount: 3,
    alliances: ["alliance-2"],
    influenceWeight: 4,
    status: "alive",
    position: { x: 85, y: 50 },
    intent: "neutral",
  },
  {
    id: "player-4",
    title: "The Iron General",
    portraitUrl: "/military-general-armor.jpg",
    gold: 280,
    power: 18,
    spyCount: 0,
    alliances: [],
    influenceWeight: 5,
    status: "alive",
    position: { x: 75, y: 75 },
    intent: "loyal",
  },
  {
    id: "player-5",
    title: "The Jade Diplomat",
    portraitUrl: "/diplomat-green-elegant.jpg",
    gold: 410,
    power: 7,
    spyCount: 2,
    alliances: ["alliance-2", "alliance-3"],
    influenceWeight: 3,
    status: "alive",
    position: { x: 50, y: 85 }, // Bottom center
    intent: "neutral",
  },
  {
    id: "player-6",
    title: "The Obsidian Lord",
    portraitUrl: "/dark-lord-black.jpg",
    gold: 520,
    power: 14,
    spyCount: 1,
    alliances: ["alliance-3"],
    influenceWeight: 4,
    status: "alive",
    position: { x: 25, y: 75 },
    intent: "revolt",
  },
  {
    id: "player-7",
    title: "The Sapphire Scholar",
    portraitUrl: "/scholar-blue-wise.jpg",
    gold: 290,
    power: 4,
    spyCount: 4,
    alliances: ["alliance-1"],
    influenceWeight: 2,
    status: "alive",
    position: { x: 15, y: 50 },
    intent: "neutral",
  },
  {
    id: "player-8",
    title: "The Amber Assassin",
    portraitUrl: "/assassin-orange-mysterious.jpg",
    gold: 380,
    power: 11,
    spyCount: 2,
    alliances: [],
    influenceWeight: 2,
    status: "alive",
    position: { x: 25, y: 25 },
    intent: "revolt",
  },
  {
    id: "player-9",
    title: "The Pearl Priestess",
    portraitUrl: "/priestess-white-holy.jpg",
    gold: 340,
    power: 6,
    spyCount: 1,
    alliances: ["alliance-2"],
    influenceWeight: 3,
    status: "alive",
    position: { x: 35, y: 35 },
    intent: "loyal",
  },
  {
    id: "player-10",
    title: "The Bronze Traitor",
    portraitUrl: "/traitor-bronze-executed.jpg",
    gold: 0,
    power: 0,
    spyCount: 0,
    alliances: [],
    influenceWeight: 0,
    status: "executed",
    position: { x: 65, y: 35 },
    intent: "neutral",
  },
]

// MOCK: 3 Alliances
export const mockAlliances: Alliance[] = [
  {
    id: "alliance-1",
    name: "The Crimson Pact",
    emblemUrl: "/red-shield-emblem.jpg",
    description: "United in blood and honor, seeking to restore the old ways.",
    memberIds: ["player-1", "player-2", "player-7"],
    color: "#DC2626", // red-600
  },
  {
    id: "alliance-2",
    name: "The Golden Circle",
    emblemUrl: "/gold-coin-emblem.jpg",
    description: "Merchants and traders who control the flow of wealth.",
    memberIds: ["player-3", "player-5", "player-9"],
    color: "#D97706", // amber-600
  },
  {
    id: "alliance-3",
    name: "The Shadow Council",
    emblemUrl: "/dark-moon-emblem.jpg",
    description: "Those who work in darkness to shape the future.",
    memberIds: ["player-5", "player-6"],
    color: "#7C3AED", // violet-600
  },
]

// MOCK: Server stats
export const mockServerStats: ServerStats = {
  turnNumber: 7,
  phase: "planning",
  timeRemaining: 180, // 3 minutes
  activePlayers: 9, // 10 - 1 executed
}

// MOCK: Action history
export const mockActionLog: ActionLog[] = [
  {
    id: "log-1",
    timestamp: new Date(Date.now() - 120000), // 2 minutes ago
    actorId: "player-4",
    targetId: "player-10",
    action: "accuse",
    result: "Player executed by trial",
    isPrivate: false,
  },
  {
    id: "log-2",
    timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    actorId: "player-1",
    targetId: "player-3",
    action: "spy",
    result: "Intel gathered: High wealth",
    isPrivate: true,
  },
  {
    id: "log-3",
    timestamp: new Date(Date.now() - 480000), // 8 minutes ago
    actorId: "player-2",
    targetId: "player-1",
    action: "alliance_proposed",
    result: "Alliance accepted",
    isPrivate: false,
  },
  {
    id: "log-4",
    timestamp: new Date(Date.now() - 600000), // 10 minutes ago
    actorId: "player-6",
    action: "revolt_attempt",
    result: "Revolt failed - insufficient support",
    isPrivate: false,
  },
]

// MOCK: Game actions
export const mockGameActions: GameAction[] = [
  {
    id: "action-1",
    timestamp: Date.now() - 300000,
    type: "alliance",
    actorId: "player-1",
    targetId: "player-2",
    description: "Duke of Thornwood formed an alliance with Countess of Ravencrest",
    isPublic: true,
  },
  {
    id: "action-2",
    timestamp: Date.now() - 240000,
    type: "spy",
    actorId: "player-3",
    targetId: "player-4",
    description: "A spy was deployed (target unknown)",
    isPublic: false,
  },
  {
    id: "action-3",
    timestamp: Date.now() - 180000,
    type: "accusation",
    actorId: "player-5",
    targetId: "player-6",
    description: "Baron of Ironhold accused Merchant Prince of Goldvale of treason",
    isPublic: true,
  },
  {
    id: "action-4",
    timestamp: Date.now() - 120000,
    type: "vote",
    actorId: "player-1",
    targetId: "player-6",
    description: "Votes were cast in the trial",
    isPublic: true,
  },
  {
    id: "action-5",
    timestamp: Date.now() - 60000,
    type: "execution",
    actorId: "system",
    targetId: "player-6",
    description: "Merchant Prince of Goldvale was found guilty and executed",
    isPublic: true,
  },
]

// MOCK: Chat messages
export const mockChatMessages: ChatMessage[] = [
  {
    id: "msg-1",
    timestamp: Date.now() - 300000,
    senderId: "player-1",
    message: "We must work together to survive this night.",
    isWhisper: false,
  },
  {
    id: "msg-2",
    timestamp: Date.now() - 270000,
    senderId: "player-2",
    recipientId: "player-1",
    message: "I agree. Let's form an alliance.",
    isWhisper: true,
  },
  {
    id: "msg-3",
    timestamp: Date.now() - 240000,
    senderId: "player-3",
    message: "Someone here is plotting against the crown!",
    isWhisper: false,
  },
  {
    id: "msg-4",
    timestamp: Date.now() - 180000,
    senderId: "player-5",
    message: "I have evidence of treason. The Merchant Prince must answer for his crimes!",
    isWhisper: false,
  },
  {
    id: "msg-5",
    timestamp: Date.now() - 120000,
    senderId: "player-4",
    recipientId: CURRENT_PLAYER_ID,
    message: "Be careful who you trust. Not everyone is who they seem.",
    isWhisper: true,
  },
  {
    id: "msg-6",
    timestamp: Date.now() - 60000,
    senderId: "player-7",
    message: "Justice has been served, but at what cost?",
    isWhisper: false,
  },
]

// Helper functions
export function getPlayerById(id: string): Player | undefined {
  return mockPlayers.find((p) => p.id === id)
}

export function getAllianceById(id: string): Alliance | undefined {
  return mockAlliances.find((a) => a.id === id)
}

export function getPlayerAlliances(playerId: string): Alliance[] {
  const player = getPlayerById(playerId)
  if (!player) return []
  return mockAlliances.filter((a) => a.memberIds.includes(playerId))
}

export function isAllyWith(playerId: string, targetId: string): boolean {
  const playerAlliances = getPlayerAlliances(playerId)
  return playerAlliances.some((a) => a.memberIds.includes(targetId))
}
