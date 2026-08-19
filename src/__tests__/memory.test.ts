import { describe, expect, it } from "vitest";
import { buildPlayerMemory, resolveDayVote, type DayProgress } from "../game";
import { makeState } from "./helpers";

function makeProgress(overrides: Partial<DayProgress> = {}): DayProgress {
  return {
    day: 2,
    aliveOrder: ["Seat1", "Seat2", "Seat3"],
    stage: "resolve",
    seatCursor: 0,
    speeches: { Seat1: "我怀疑 Seat2", Seat2: "我怀疑 Seat3", Seat3: "观望" },
    daySummary: "摘要",
    initialVotes: { Seat1: "Seat2", Seat2: "Seat3", Seat3: "Seat3" },
    voteDistribution: "📊 第一轮投票结果（票型分布）：\n  Seat3: 2票\n  Seat2: 1票",
    consensusTargets: ["Seat3"],
    finalVotes: {
      Seat1: { target: "Seat2", changed_vote: false, why_change: null },
      Seat2: { target: "Seat2", changed_vote: true, why_change: "票型显示 Seat2 更可疑" },
      Seat3: { target: "Seat2", changed_vote: false, why_change: null },
    },
    started: true,
    firstVoteAnnounced: true,
    secondVoteAnnounced: true,
    ...overrides,
  };
}

describe("resolveDayVote", () => {
  it("多数票处决并写入 vote_result 事件", () => {
    const state = makeState({ alivePlayers: ["Seat1", "Seat2", "Seat3"] });
    resolveDayVote(state, makeProgress());
    expect(state.alivePlayers).not.toContain("Seat2");
    expect(state.dayProgress).toBeNull();
    const voteResult = state.publicEventLog.find((event) => event.type === "vote_result");
    expect(voteResult).toBeDefined();
    expect((voteResult?.votes as Record<string, string>)["Seat1"]).toBe("Seat2");
    expect((voteResult?.changed as Record<string, boolean>)["Seat2"]).toBe(true);
  });

  it("平票时无人处决但仍写 vote_result", () => {
    const state = makeState({ alivePlayers: ["Seat1", "Seat2"] });
    const progress = makeProgress({
      aliveOrder: ["Seat1", "Seat2"],
      finalVotes: {
        Seat1: { target: "Seat2", changed_vote: false, why_change: null },
        Seat2: { target: "Seat1", changed_vote: false, why_change: null },
      },
    });
    resolveDayVote(state, progress);
    expect(state.alivePlayers).toEqual(["Seat1", "Seat2"]);
    expect(state.publicEventLog.find((event) => event.type === "vote_result")).toBeDefined();
  });
});

describe("buildPlayerMemory", () => {
  it("Day1 或无历史时返回空字符串", () => {
    expect(buildPlayerMemory(makeState({ currentDay: 1 }), "Seat1")).toBe("");
    expect(buildPlayerMemory(makeState(), "Seat7")).toBe("");
  });

  it("包含昨日发言、昨日终投与观察对象", () => {
    const state = makeState({
      playerObservations: { Seat1: "关注 Seat4 票型" },
      publicEventLog: [
        { type: "speech", speaker: "Seat1", content: "我怀疑 Seat5", day: 1, phase: "day", alive: [] },
        {
          type: "vote_result",
          speaker: "GameMaster",
          content: "终投结果：Seat1→Seat5",
          day: 1,
          phase: "day",
          alive: [],
          votes: { Seat1: "Seat5" },
          changed: { Seat1: true },
        },
      ],
    });
    const memory = buildPlayerMemory(state, "Seat1");
    expect(memory).toContain("你昨天的发言：\"我怀疑 Seat5\"");
    expect(memory).toContain("你昨天的终投：Seat5");
    expect(memory).toContain("你改过票");
    expect(memory).toContain("你声明的观察对象：关注 Seat4 票型");
    expect(memory).toContain("不能与昨天自相矛盾");
  });
});
