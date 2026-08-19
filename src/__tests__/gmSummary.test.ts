import { describe, expect, it } from "vitest";
import { GAME_MASTER_SYSTEM_PROMPT, buildDaySummaryTask } from "../prompts";

describe("buildDaySummaryTask", () => {
  it("要求按玩家逐行陈述且禁止倾向性措辞", () => {
    const task = buildDaySummaryTask(2, { Seat1: "我怀疑 Seat2" });
    expect(task).toContain("第 2 天");
    expect(task).toContain("按玩家逐行陈述");
    expect(task).toContain("禁止使用");
    expect(task).toContain("我怀疑 Seat2");
  });
});

describe("GAME_MASTER_SYSTEM_PROMPT", () => {
  it("保持只输出 JSON 的定位", () => {
    expect(GAME_MASTER_SYSTEM_PROMPT).toContain("只输出 JSON");
  });
});
