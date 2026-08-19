import { describe, expect, it } from "vitest";
import { buildNightKillTask } from "../prompts";
import { makeState } from "./helpers";

describe("buildNightKillTask", () => {
  it("包含击杀优先级、同伴与存活名单", () => {
    const task = buildNightKillTask(makeState(), "Seat2", ["Seat5"]);
    expect(task).toContain("击杀优先级");
    expect(task).toContain("你的同伴：Seat5");
    expect(task).toContain("当前存活玩家");
  });

  it("不包含错位的伪装提示", () => {
    expect(buildNightKillTask(makeState(), "Seat2", ["Seat5"])).not.toContain("过于完美");
  });

  it("有白天处决事件时注入上下文", () => {
    const state = makeState();
    state.publicEventLog.push({
      type: "death",
      speaker: "GameMaster",
      content: "Seat4 被投票处决",
      day: 1,
      phase: "day",
      alive: [],
    });
    expect(buildNightKillTask(state, "Seat2", ["Seat5"])).toContain("Seat4 被投票处决");
  });
});
