import { describe, expect, it } from "vitest";
import {
  buildVoteEvidenceFacts,
  hasIndependentEvidenceForConsensusTarget,
  validateVoteDecision,
  type VoteDecision,
} from "../game";
import { makeState } from "./helpers";

describe("buildVoteEvidenceFacts", () => {
  it("speechAndDeathText 只含发言与死亡类事实，不含票型", () => {
    const state = makeState();
    state.publicEventLog.push(
      { type: "speech", speaker: "Seat2", content: "我怀疑 Seat3，发言前后矛盾", day: 2, phase: "day", alive: [] },
      {
        type: "vote_distribution",
        speaker: "GameMaster",
        content: "📊 第一轮投票结果（票型分布）：\n  Seat3: 5票",
        day: 2,
        phase: "day",
        alive: [],
      },
    );
    const ctx = buildVoteEvidenceFacts(state, { Seat2: "我怀疑 Seat3，发言前后矛盾" });
    expect(ctx.speechAndDeathText).toContain("我怀疑 Seat3");
    expect(ctx.speechAndDeathText).not.toContain("票型分布");
    expect(ctx.sourceText).toContain("票型分布");
    expect(ctx.factsText).toMatch(/^1\. /m);
  });
});

describe("hasIndependentEvidenceForConsensusTarget", () => {
  const speechAndDeathText = "Day2-day Seat2: 我怀疑 Seat3，发言前后矛盾";

  it("引用命中发言事实且指向目标时为真", () => {
    expect(
      hasIndependentEvidenceForConsensusTarget(["Seat3 前后矛盾《发言前后矛盾》"], "Seat3", speechAndDeathText),
    ).toBe(true);
  });

  it("只引用票型或未指向目标时为假", () => {
    expect(hasIndependentEvidenceForConsensusTarget(["大家都投《Seat3: 5票》"], "Seat3", speechAndDeathText)).toBe(false);
    expect(hasIndependentEvidenceForConsensusTarget(["Seat4 前后矛盾《发言前后矛盾》"], "Seat3", speechAndDeathText)).toBe(false);
  });
});

describe("validateVoteDecision 反共识税", () => {
  const speechAndDeathText = "Day2-day Seat2: 我怀疑 Seat3，发言前后矛盾";
  const decision = (evidence: string[]): VoteDecision => ({
    target: "Seat3",
    confidence: "medium",
    riskIfWrong: "投错会放走真狼并误杀好人",
    altTarget: "Seat4",
    targetVsAltReason: "Seat3 的发言与票型矛盾更多",
    evidence,
  });
  const options = {
    alivePlayers: ["Seat1", "Seat3", "Seat4"],
    evidenceSourceText: `${speechAndDeathText}\n第一轮票型：Seat3: 5票`,
    speechAndDeathText,
    requireRiskIfWrong: true,
    consensusTargets: ["Seat3"],
  };

  it("命中最高票目标但只有票型证据时拒绝", () => {
    expect(validateVoteDecision("Seat1", decision(["大家都在投《Seat3: 5票》", "票型显示《Seat3: 5票》"]), options)).toContain("独立证据");
  });

  it("有指向目标的言行引用时放行", () => {
    expect(validateVoteDecision("Seat1", decision(["Seat3 发言《发言前后矛盾》", "票型显示《Seat3: 5票》"]), options)).toBeNull();
  });
});
