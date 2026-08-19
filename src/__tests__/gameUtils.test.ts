import { describe, expect, it } from "vitest";
import {
  PLAYER_NAMES,
  chooseFallbackSpeechTarget,
  extractObservation,
  extractPrimarySuspicionTarget,
  normalizeEvidenceItems,
  sortSeats,
} from "../gameUtils";

describe("gameUtils", () => {
  it("sortSeats 按座位号排序", () => {
    expect(sortSeats(["Seat8", "Seat2", "Seat10"])).toEqual(["Seat2", "Seat8", "Seat10"]);
  });

  it("extractPrimarySuspicionTarget 命中怀疑目标且排除自己", () => {
    expect(extractPrimarySuspicionTarget("Seat1", "我怀疑 Seat3，发言矛盾", PLAYER_NAMES)).toBe("Seat3");
    expect(extractPrimarySuspicionTarget("Seat1", "我觉得 Seat1 可疑", PLAYER_NAMES)).toBeNull();
  });

  it("extractObservation 提取观察片段", () => {
    expect(extractObservation("我会重点关注 Seat4 的票型")).toContain("Seat4");
    expect(extractObservation("今天天气不错")).toBeNull();
  });

  it("normalizeEvidenceItems 去重且最多4条", () => {
    expect(normalizeEvidenceItems(["a", "a", " b ", "", "c", "d", "e"])).toEqual(["a", "b", "c", "d"]);
  });

  it("chooseFallbackSpeechTarget 返回首个非自己存活玩家", () => {
    expect(chooseFallbackSpeechTarget("Seat3", ["Seat2", "Seat3"])).toBe("Seat2");
    expect(chooseFallbackSpeechTarget("Seat1", ["Seat1"])).toBe("Seat1");
  });
});
