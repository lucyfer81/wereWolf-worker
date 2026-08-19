import { describe, expect, it } from "vitest";
import { buildSpeechTask, buildSpeechRetryTask, findAccusationsAgainst } from "../prompts";
import { buildFallbackSpeech, resolveFocus } from "../game";

const baseCtx = {
  playerName: "Seat1",
  role: "villager" as const,
  day: 2,
  alivePlayers: ["Seat1", "Seat2", "Seat3"],
  speeches: { Seat2: "我怀疑 Seat1，理由不硬但先表个态" },
  memory: "## 你的历史（只有你自己知道）\n- 你昨天的发言：\"观望\"",
  accusations: [],
  factsText: "1. Day2-day Seat2: 我怀疑 Seat1",
  observation: null as string | null,
};

describe("findAccusationsAgainst", () => {
  it("检测到指向自己的指控", () => {
    const hits = findAccusationsAgainst({ Seat2: "我怀疑 Seat1，先表个态" }, "Seat1", ["Seat1", "Seat2"]);
    expect(hits).toHaveLength(1);
    expect(hits[0]).toContain("Seat2");
    expect(hits[0]).toContain("我怀疑 Seat1");
  });

  it("无指控时返回空数组", () => {
    expect(findAccusationsAgainst({ Seat2: "我怀疑 Seat3" }, "Seat1", ["Seat1", "Seat2", "Seat3"])).toEqual([]);
  });
});

describe("buildSpeechTask", () => {
  it("包含记忆、事实与 180 字要求", () => {
    const task = buildSpeechTask(baseCtx);
    expect(task).toContain("你的历史");
    expect(task).toContain("可核查公共事实");
    expect(task).toContain("<=180 字");
    expect(task).toContain("focus");
  });

  it("被指控时注入答辩要求，未被指控时不注入", () => {
    const accused = buildSpeechTask({ ...baseCtx, accusations: ["Seat2：「我怀疑 Seat1」"] });
    expect(accused).toContain("你被指控了");
    expect(accused).toContain("正面回应");
    expect(buildSpeechTask({ ...baseCtx, accusations: [] })).not.toContain("你被指控了");
  });

  it("狼人收到生存提醒，村民没有", () => {
    expect(buildSpeechTask({ ...baseCtx, role: "werewolf" })).toContain("狼人生存提醒");
    expect(buildSpeechTask(baseCtx)).not.toContain("狼人生存提醒");
  });

  it("Day2 要求必须给出怀疑目标", () => {
    expect(buildSpeechTask(baseCtx)).toContain("必须包含怀疑对象和理由");
  });
});

describe("buildSpeechRetryTask", () => {
  it("包含上一版输出与纠错要求", () => {
    const retry = buildSpeechRetryTask("BASE", { playerName: "Seat1", day: 2, target: "", content: "x", evidence: [] });
    expect(retry).toContain("BASE");
    expect(retry).toContain("你就是 Seat1");
    expect(retry).toContain("请重新输出 JSON");
  });
});

describe("resolveFocus", () => {
  it("优先使用 focus 字段并截断到20字", () => {
    expect(resolveFocus({ focus: "Seat4 的票型与发言一致性" }, "内容")).toBe("Seat4 的票型与发言一致性");
    expect(resolveFocus({ focus: "超".repeat(30) }, "内容")).toHaveLength(20);
  });

  it("无 focus 时回退到正则提取", () => {
    expect(resolveFocus({}, "我会重点关注 Seat4 的票型")).toContain("Seat4");
    expect(resolveFocus({}, "今天天气不错")).toBeNull();
  });
});

describe("buildFallbackSpeech", () => {
  it("目标合法且 Day2 内容包含目标座位", () => {
    const fallback = buildFallbackSpeech("Seat1", ["Seat1", "Seat3"], 2);
    expect(fallback.target).toBe("Seat3");
    expect(fallback.content).toContain("Seat3");
  });

  it("同日不同座位产生不同变体（确定性）", () => {
    const a = buildFallbackSpeech("Seat1", ["Seat1", "Seat3"], 1);
    const b = buildFallbackSpeech("Seat2", ["Seat2", "Seat3"], 1);
    expect(a.content).not.toBe(b.content);
  });
});
