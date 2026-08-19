import { describe, expect, it } from "vitest";
import { buildFirstVoteTask, buildSecondVoteTask } from "../prompts";
import { finalizeSecondRoundVote, type VoteDecision } from "../game";

const baseCtx = {
  playerName: "Seat1",
  role: "villager" as const,
  day: 2,
  alivePlayers: ["Seat1", "Seat2", "Seat3"],
  daySummary: "摘要内容",
  factsText: "1. 事实",
  mySpeech: "我的发言",
  memory: "## 你的历史（只有你自己知道）",
  observation: null as string | null,
  recentDeathContent: null as string | null,
};

describe("buildFirstVoteTask", () => {
  it("包含反锚定定调与硬约束", () => {
    const task = buildFirstVoteTask(baseCtx);
    expect(task).toContain("不是投票指引");
    expect(task).toContain("risk_if_wrong");
    expect(task).toContain("至少2条");
    expect(task).toContain("alt_target");
  });

  it("Day1 注入分散提示，Day2 不注入", () => {
    expect(buildFirstVoteTask({ ...baseCtx, day: 1 })).toContain("投票分散是正常");
    expect(buildFirstVoteTask(baseCtx)).not.toContain("投票分散是正常");
  });
});

describe("buildSecondVoteTask", () => {
  it("包含博弈定调、初投信息与自动改票说明", () => {
    const task = buildSecondVoteTask({
      ...baseCtx,
      voteDistribution: "📊 第一轮投票结果（票型分布）：\n  Seat2: 2票",
      consensusTargets: ["Seat2"],
      initialTarget: "Seat2",
    });
    expect(task).toContain("最后的表态机会");
    expect(task).toContain("你第一轮投给了：Seat2");
    expect(task).toContain("改票无需声明");
    expect(task).toContain("独立证据");
    expect(task).not.toContain("changed_vote 必须");
  });
});

describe("finalizeSecondRoundVote", () => {
  const decision = (target: string): VoteDecision => ({
    target,
    confidence: "medium",
    riskIfWrong: "",
    altTarget: "Seat3",
    targetVsAltReason: "理由充分超过八字",
    evidence: [],
  });

  it("自动推导 changed_vote 并保留 why_change", () => {
    const vote = finalizeSecondRoundVote("Seat2", decision("Seat3"), "票型变化说明 Seat3 更可疑");
    expect(vote.target).toBe("Seat3");
    expect(vote.changed_vote).toBe(true);
    expect(vote.why_change).toBe("票型变化说明 Seat3 更可疑");
  });

  it("未改票时 changed_vote 为 false 且 why_change 为 null", () => {
    const vote = finalizeSecondRoundVote("Seat2", decision("Seat2"), "多余的理由");
    expect(vote.changed_vote).toBe(false);
    expect(vote.why_change).toBeNull();
  });
});
