import type { GameState } from "../game";

export function makeState(overrides: Partial<GameState> = {}): GameState {
  const roles: Record<string, "werewolf" | "villager"> = {
    Seat1: "villager",
    Seat2: "werewolf",
    Seat3: "villager",
    Seat4: "villager",
    Seat5: "werewolf",
    Seat6: "villager",
    Seat7: "villager",
    Seat8: "villager",
  };
  return {
    id: "test-game",
    roles,
    alivePlayers: ["Seat1", "Seat2", "Seat3", "Seat4", "Seat5", "Seat6", "Seat7", "Seat8"],
    currentDay: 2,
    nextPhase: "day",
    dayProgress: null,
    votingStyles: {
      Seat1: "conservative",
      Seat2: "logic_driven",
      Seat3: "contrarian",
      Seat4: "pressure",
      Seat5: "conservative",
      Seat6: "logic_driven",
      Seat7: "contrarian",
      Seat8: "pressure",
    },
    playerObservations: {},
    publicEventLog: [],
    timeline: [],
    finished: false,
    winner: "none",
    lastUpdatedAt: new Date().toISOString(),
    ...overrides,
  };
}
