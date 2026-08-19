import { describe, expect, it } from "vitest";
import { PERSONA_CARDS, buildPlayerSystemMessage } from "../prompts";
import { PLAYER_NAMES } from "../gameUtils";
import { makeState } from "./helpers";

describe("PERSONA_CARDS", () => {
  it("8 个座位各有一张人设卡且字段完整", () => {
    for (const seat of PLAYER_NAMES) {
      const card = PERSONA_CARDS[seat];
      expect(card.name.length).toBeGreaterThan(0);
      expect(card.background.length).toBeGreaterThan(4);
      expect(card.speechStyle.length).toBeGreaterThan(4);
      expect(card.voteTendency.length).toBeGreaterThan(4);
    }
  });
});

describe("buildPlayerSystemMessage", () => {
  it("村民提示包含人设与阵营目标且无未替换占位符", () => {
    const msg = buildPlayerSystemMessage("Seat1", makeState());
    expect(msg).toContain("老会计");
    expect(msg).toContain("村民阵营");
    expect(msg).toContain("你不知道任何人的真实身份");
    for (const placeholder of [
      "{player_name}",
      "{role}",
      "{role_info}",
      "{persona_name}",
      "{persona_background}",
      "{persona_speech_style}",
      "{faction_goal}",
      "{strategy_handbook}",
      "{vote_tendency}",
      "{night_action}",
    ]) {
      expect(msg).not.toContain(placeholder);
    }
  });

  it("狼人提示包含狼人阵营目标、同伴名单与 focus 字段说明", () => {
    const msg = buildPlayerSystemMessage("Seat2", makeState());
    expect(msg).toContain("狼人阵营");
    expect(msg).toContain("Seat5");
    expect(msg).toContain("focus");
    expect(msg).toContain("<=180字");
    expect(msg).not.toContain("changed_vote");
  });
});
