# 狼人杀提示词体系改进实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 按 `docs/superpowers/specs/2026-08-19-prompt-improvement-design.md` 重写全部 LLM 提示词（人设卡、阵营策略、答辩机制、威胁评估击杀、投票博弈），并配合轻量引擎改动（vote_result 事件、记忆注入、改票判定简化、反共识税重构）。

**Architecture:** `src/game.ts`（1757 行）拆出两个新模块：`src/gameUtils.ts`（纯工具函数，机械搬移）与 `src/prompts.ts`（全部提示词构建器 + 人设数据）。game.ts 保留状态机与校验逻辑，从新模块导入。每个阶段任务改为"组装上下文 → 调 builder 生成任务文本"。

**Tech Stack:** TypeScript (ES modules, strict)、OpenAI SDK、vitest（新增 devDependency）、wrangler。

## Global Constraints

- 每次提交前 `npm run check` 与 `npm test` 必须通过。
- 代码风格：2 空格缩进、分号、函数/变量 camelCase、类型 PascalCase、**不添加任何代码注释**。
- 状态转移与校验留在 `src/game.ts`；提示词文本构建在 `src/prompts.ts`；纯工具在 `src/gameUtils.ts`。
- 所有提示词文案使用简体中文，与现有风格一致。
- 不修改 `public/`、`src/index.ts`、`wrangler.jsonc`；不新增环境变量。
- Conventional Commits：`feat:` / `refactor:` / `test:` / `chore:` / `docs:`。
- 人设卡与身份（狼/民）正交：任何人设不得暗示持卡者的真实身份。
- 保底发言变体采用确定性选择（座位号+天数取模），非随机，保证测试稳定（对 spec"随机选"的微调，目的一致：多样性）。

---

### Task 1: 引入 vitest 并抽离纯工具模块 gameUtils.ts

**Files:**
- Create: `src/gameUtils.ts`
- Create: `src/__tests__/helpers.ts`
- Create: `src/__tests__/gameUtils.test.ts`
- Modify: `src/game.ts`（删除被搬移的函数，改为 import）
- Modify: `package.json`（新增 test script 与 vitest devDependency）

**Interfaces:**
- Consumes: 无（首个任务）
- Produces: `src/gameUtils.ts` 导出：`TOTAL_PLAYERS`、`WEREWOLF_COUNT`、`PLAYER_NAMES`，以及 `seatNumber(seat: string): number`、`sortSeats(seats: string[]): string[]`、`chooseRandom<T>(items: T[]): T`、`asString(value: unknown, fallback?: string): string`、`asBoolean(value: unknown, fallback?: boolean): boolean`、`asStringArray(value: unknown): string[]`、`isSeat(value: string): boolean`、`escapeRegex(text: string): string`、`dedupeSeatsInOrder(seats: string[]): string[]`、`formatSeatList(seats: string[], emptyText: string): string`、`collectSeatsByKeywords(content: string, keywords: string[]): string[]`、`extractPrimarySuspicionTarget(playerName: string, content: string, alivePlayers: string[]): string | null`、`extractSupportTargets`、`extractOpposeTargets`、`hasEvidenceSignals(content: string): boolean`、`hasRhythmSignals(content: string): boolean`、`extractObservation(content: string): string | null`、`normalizeSummaryText(summary: string): string`、`normalizeSpeechText(text: string): string`、`normalizeEvidenceMatchText(text: string): string`、`extractEvidenceQuotes(evidenceItem: string): string[]`、`normalizeEvidenceItems(items: string[]): string[]`、`chooseFallbackSpeechTarget(playerName: string, alivePlayers: string[]): string`
- Produces: `src/__tests__/helpers.ts` 导出 `makeState(overrides?: Partial<GameState>): GameState`

- [ ] **Step 1: 安装 vitest 并加 script**

```bash
npm install -D vitest
```

`package.json` scripts 增加：

```json
  "scripts\": {
    "dev\": "wrangler dev",
    "deploy": "wrangler deploy",
    "check\": "tsc --noEmit",
    "test\": "vitest run"
  },
```

- [ ] **Step 2: 写 helpers 与失败测试**

`src/__tests__/helpers.ts`：

```typescript
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
```

注意：`votingStyles` 字段在 Task 4 会随类型删除一起从 helpers 移除。

`src/__tests__/gameUtils.test.ts`：

```typescript
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
```

- [ ] **Step 3: 运行测试确认失败**

Run: `npx vitest run src/__tests__/gameUtils.test.ts`
Expected: FAIL（无法解析 `../gameUtils`）

- [ ] **Step 4: 创建 src/gameUtils.ts**

从 `src/game.ts` **剪切**以下内容到 `src/gameUtils.ts`（代码原样搬移，每个搬移项加 `export`，不加注释）：

- 常量：`TOTAL_PLAYERS`、`WEREWOLF_COUNT`、`PLAYER_NAMES`（原 80-82 行）
- 函数：`seatNumber`（200-203）、`sortSeats`（205-207）、`chooseRandom`（209-211）、`asString`（213-215）、`asBoolean`（217-225）、`asStringArray`（227-233）、`isSeat`（243-245）、`escapeRegex`（346-348）、`dedupeSeatsInOrder`（350-360）、`formatSeatList`（362-364）、`collectSeatsByKeywords`（366-381）、`extractPrimarySuspicionTarget`（383-405）、`extractSupportTargets`（407-420）、`extractOpposeTargets`（422-441）、`hasEvidenceSignals`（443-446）、`hasRhythmSignals`（448-451）、`extractObservation`（325-338）、`normalizeSummaryText`（453-462）、`normalizeSpeechText`（521-523）、`normalizeEvidenceMatchText`（683-685）、`extractEvidenceQuotes`（687-703）、`normalizeEvidenceItems`（669-681）、`chooseFallbackSpeechTarget`（572-574）

`src/game.ts` 顶部加：

```typescript
import {
  PLAYER_NAMES,
  WEREWOLF_COUNT,
  asBoolean,
  asString,
  asStringArray,
  chooseFallbackSpeechTarget,
  chooseRandom,
  dedupeSeatsInOrder,
  escapeRegex,
  extractEvidenceQuotes,
  extractObservation,
  extractPrimarySuspicionTarget,
  extractOpposeTargets,
  extractSupportTargets,
  formatSeatList,
  hasEvidenceSignals,
  hasRhythmSignals,
  isSeat,
  normalizeEvidenceItems,
  normalizeEvidenceMatchText,
  normalizeSpeechText,
  normalizeSummaryText,
  seatNumber,
  sortSeats,
} from "./gameUtils";
```

（`normalizeConfidence`、`parseJSONFromText`、`sleep`、`nowISO`、`cloneState`、`appendTimeline`、`addEvent`、`formatRole`、`hasSelfSuspicionSpeech`、`validateSpeechOutput` 及其余全部函数保留在 game.ts。`collectSeatsByKeywords` 不需要出现在 game.ts 的 import 里，因为它的调用者 `extractPrimarySuspicionTarget` 等已搬移；若 game.ts 内仍有引用则加入 import。）

- [ ] **Step 5: 验证编译与测试通过**

Run: `npm run check && npm test`
Expected: 两者均 PASS

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/gameUtils.ts src/game.ts src/__tests__/
git commit -m "chore: add vitest and extract pure utilities to gameUtils"
```

---

### Task 2: vote_result 事件 + resolveDayVote 抽取 + buildPlayerMemory

**Files:**
- Modify: `src/game.ts`（resolve 阶段抽取为 `resolveDayVote`；新增 `buildPlayerMemory`；两者 export）
- Test: `src/__tests__/memory.test.ts`

**Interfaces:**
- Consumes: `makeState`（Task 1 helpers）
- Produces:
  - `export function resolveDayVote(state: GameState, progress: DayProgress): void` — 写 vote_result 事件、处决/平票、Day1 分散度日志、置 `state.dayProgress = null`
  - `export function buildPlayerMemory(state: GameState, playerName: string): string` — 返回含 `## 你的历史（只有你自己知道）` 的文本块，无历史时返回 `""`
  - `vote_result` 事件形状：`addEvent(state, "vote_result", "GameMaster", summaryText, "day", { round: 2, votes: Record<string, string>, changed: Record<string, boolean> })`

- [ ] **Step 1: 写失败测试**

`src/__tests__/memory.test.ts`：

```typescript
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
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/__tests__/memory.test.ts`
Expected: FAIL（`resolveDayVote`、`buildPlayerMemory` 未导出）

- [ ] **Step 3: 实现**

`src/game.ts` 在 `runDayPhaseStep` 之前新增。同时把 `interface DayProgress` 改为 `export interface DayProgress`（原 32 行，测试需导入该类型）：

```typescript
export function buildPlayerMemory(state: GameState, playerName: string): string {
  if (state.currentDay <= 1) return "";

  const lines: string[] = [];
  const pastSpeeches = state.publicEventLog.filter(
    (event) => event.type === "speech" && event.speaker === playerName && event.day < state.currentDay,
  );
  const lastSpeech = pastSpeeches[pastSpeeches.length - 1];
  if (lastSpeech) {
    lines.push(`- 你昨天的发言："${lastSpeech.content}"`);
  }

  const pastVoteResults = state.publicEventLog.filter(
    (event) => event.type === "vote_result" && event.day < state.currentDay,
  );
  const lastVoteResult = pastVoteResults[pastVoteResults.length - 1];
  if (lastVoteResult) {
    const votes = (lastVoteResult.votes ?? {}) as Record<string, string>;
    const changed = (lastVoteResult.changed ?? {}) as Record<string, boolean>;
    const myVote = votes[playerName];
    if (myVote) {
      lines.push(`- 你昨天的终投：${myVote}${changed[playerName] ? "（你改过票）" : ""}`);
    }
  }

  if (state.playerObservations[playerName]) {
    lines.push(`- 你声明的观察对象：${state.playerObservations[playerName]}`);
  }

  if (!lines.length) return "";
  return ["## 你的历史（只有你自己知道）", ...lines, "- 你今天的发言不能与昨天自相矛盾"].join("\n");
}
```

将 `runDayPhaseStep` 尾部（"📊 投票统计"段起，到 `state.dayProgress = null;` 与 `return true;` 之前的整段）搬入新函数，`runDayPhaseStep` 尾部只保留：

```typescript
  resolveDayVote(state, progress);
  return true;
}
```

新函数（原代码 + vote_result 事件写入）：

```typescript
export function resolveDayVote(state: GameState, progress: DayProgress): void {
  appendTimeline(state, `${"─".repeat(70)}`);
  appendTimeline(state, "📊 投票统计");
  appendTimeline(state, `${"─".repeat(70)}`);

  const changedCount = Object.values(progress.finalVotes).filter((vote) => vote.changed_vote).length;
  appendTimeline(state, `📈 改票统计：${changedCount} 名玩家改变了投票`);

  const voteCounts: Record<string, number> = {};
  for (const vote of Object.values(progress.finalVotes)) {
    voteCounts[vote.target] = (voteCounts[vote.target] ?? 0) + 1;
  }

  for (const [player, count] of Object.entries(voteCounts).sort((a, b) => seatNumber(a[0]) - seatNumber(b[0]))) {
    appendTimeline(state, `  ${player}: ${count} 票`);
  }

  const maxVotes = Math.max(...Object.values(voteCounts));
  const eliminated = Object.entries(voteCounts)
    .filter(([, count]) => count === maxVotes)
    .map(([player]) => player);

  if (eliminated.length === 1) {
    const eliminatedPlayer = eliminated[0];
    state.alivePlayers = state.alivePlayers.filter((p) => p !== eliminatedPlayer);
    appendTimeline(state, `💀 ${eliminatedPlayer} 被处决（${formatRole(state.roles[eliminatedPlayer])}）`);
    addEvent(state, "death", "GameMaster", `${eliminatedPlayer} 被投票处决`, "day");
  } else {
    appendTimeline(state, `⚖️ 平票（${eliminated.join(", ")}），无人被处决`);
  }

  const voteSummary = Object.entries(progress.finalVotes)
    .sort((a, b) => seatNumber(a[0]) - seatNumber(b[0]))
    .map(([player, vote]) => `${player}→${vote.target}`)
    .join("；");
  addEvent(state, "vote_result", "GameMaster", `终投结果：${voteSummary}`, "day", {
    round: 2,
    votes: Object.fromEntries(
      Object.entries(progress.finalVotes).map(([player, vote]) => [player, vote.target]),
    ),
    changed: Object.fromEntries(
      Object.entries(progress.finalVotes).map(([player, vote]) => [player, vote.changed_vote]),
    ),
  });

  if (state.currentDay === 1) {
    const topVotes = Math.max(...Object.values(voteCounts));
    const targetCount = Object.keys(voteCounts).length;
    if (topVotes <= 4 || targetCount >= 4) {
      appendTimeline(state, `✅ Day1 投票分散度：高（最高票：${topVotes}，目标数：${targetCount}）`);
    } else {
      appendTimeline(state, `⚠️ Day1 投票分散度：低（最高票：${topVotes}，目标数：${targetCount}）`);
    }
  }

  state.dayProgress = null;
}
```

- [ ] **Step 4: 运行测试与检查**

Run: `npm run check && npx vitest run src/__tests__/memory.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/game.ts src/__tests__/memory.test.ts
git commit -m "feat: add vote_result event and player memory builder"
```

---

### Task 3: 证据事实类型标记 + 反共识税重构

**Files:**
- Modify: `src/game.ts`（`buildVoteEvidenceFacts` 返回类型扩展；`hasIndependentEvidenceForConsensusTarget` 重写；`VoteValidationOptions` 增字段；删除 `HERD_EVIDENCE_HINTS`；更新 4 处 `validateVoteDecision` 调用点）
- Test: `src/__tests__/evidence.test.ts`

**Interfaces:**
- Consumes: `normalizeEvidenceMatchText`、`extractEvidenceQuotes`（gameUtils）
- Produces:
  - `export interface VoteEvidenceContext { factsText: string; sourceText: string; speechAndDeathText: string }`
  - `export function buildVoteEvidenceFacts(state: GameState, speeches: Record<string, string>, recentDeath?: PublicEvent, voteDistribution?: string): VoteEvidenceContext`
  - `export function hasIndependentEvidenceForConsensusTarget(evidence: string[], target: string, speechAndDeathText: string): boolean`
  - `VoteValidationOptions` 变为 `{ alivePlayers: string[]; evidenceSourceText: string; speechAndDeathText: string; requireRiskIfWrong: boolean; consensusTargets?: string[] }`

- [ ] **Step 1: 写失败测试**

`src/__tests__/evidence.test.ts`：

```typescript
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
    expect(validateVoteDecision("Seat1", decision(["大家都在投《Seat3: 5票》"]), options)).toContain("独立证据");
  });

  it("有指向目标的言行引用时放行", () => {
    expect(validateVoteDecision("Seat1", decision(["Seat3 发言《发言前后矛盾》"]), options)).toBeNull();
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/__tests__/evidence.test.ts`
Expected: FAIL（`VoteEvidenceContext` 不存在、`validateVoteDecision` 缺 `speechAndDeathText`）

- [ ] **Step 3: 实现**

`src/game.ts` 中：

0. 把 `interface VoteDecision` 改为 `export interface VoteDecision`（原 48 行），`function validateVoteDecision` 加 `export`（原 784 行，测试需导入）。
1. 删除 `const HERD_EVIDENCE_HINTS = [...]`（原 134 行）。
2. `VoteValidationOptions`（原 57-62 行）改为：

```typescript
interface VoteValidationOptions {
  alivePlayers: string[];
  evidenceSourceText: string;
  speechAndDeathText: string;
  requireRiskIfWrong: boolean;
  consensusTargets?: string[];
}
```

3. `buildVoteEvidenceFacts`（原 705-740 行）整体替换为（加 `export`，返回 `VoteEvidenceContext`，同时把 `vote_result` 纳入公共事实源）：

```typescript
export interface VoteEvidenceContext {
  factsText: string;
  sourceText: string;
  speechAndDeathText: string;
}

export function buildVoteEvidenceFacts(
  state: GameState,
  speeches: Record<string, string>,
  recentDeath?: PublicEvent,
  voteDistribution?: string,
): VoteEvidenceContext {
  type FactKind = "speech" | "death" | "vote" | "announcement";
  const typedFacts: { fact: string; kind: FactKind }[] = [];

  const recentPublicFacts = state.publicEventLog
    .filter((event) =>
      ["speech", "death", "announcement", "vote_distribution", "vote_result"].includes(event.type),
    )
    .slice(-24);

  for (const event of recentPublicFacts) {
    const kind: FactKind =
      event.type === "speech"
        ? "speech"
        : event.type === "death"
          ? "death"
          : event.type === "announcement"
            ? "announcement"
            : "vote";
    typedFacts.push({ fact: `Day${event.day}-${event.phase} ${event.speaker}: ${event.content}`, kind });
  }

  if (recentDeath) {
    typedFacts.push({ fact: `最近死亡事件：${recentDeath.content}`, kind: "death" });
  }

  for (const playerName of sortSeats(Object.keys(speeches))) {
    typedFacts.push({ fact: `${playerName} 当日发言：${speeches[playerName] ?? "（无）"}`, kind: "speech" });
  }

  if (voteDistribution) {
    for (const line of voteDistribution.split("\n").map((line) => line.trim()).filter(Boolean)) {
      typedFacts.push({ fact: `第一轮票型：${line}`, kind: "vote" });
    }
  }

  const seen = new Set<string>();
  const unique = typedFacts.filter(({ fact }) => {
    if (seen.has(fact)) return false;
    seen.add(fact);
    return true;
  });

  return {
    factsText: unique.map(({ fact }, idx) => `${idx + 1}. ${fact}`).join("\n"),
    sourceText: unique.map(({ fact }) => fact).join("\n"),
    speechAndDeathText: unique
      .filter(({ kind }) => kind === "speech" || kind === "death")
      .map(({ fact }) => fact)
      .join("\n"),
  };
}
```

4. `hasIndependentEvidenceForConsensusTarget`（原 753-755 行）替换为（加 `export`）：

```typescript
export function hasIndependentEvidenceForConsensusTarget(
  evidence: string[],
  target: string,
  speechAndDeathText: string,
): boolean {
  const sourceNormalized = normalizeEvidenceMatchText(speechAndDeathText);
  return evidence.some((item) => {
    if (!item.includes(target)) return false;
    return extractEvidenceQuotes(item).some((quote) => {
      const normalizedQuote = normalizeEvidenceMatchText(quote);
      return normalizedQuote.length >= 2 && sourceNormalized.includes(normalizedQuote);
    });
  });
}
```

5. `validateVoteDecision` 中共识分支（原 818-822 行）改为：

```typescript
  if (options.consensusTargets?.includes(decision.target)) {
    if (!hasIndependentEvidenceForConsensusTarget(decision.evidence, decision.target, options.speechAndDeathText)) {
      return `命中最高票目标 ${decision.target} 时，必须给出至少一条指向该目标言行的独立证据`;
    }
  }
```

6. 更新 4 处 `validateVoteDecision` 调用点（第一轮原 1342-1346、1362-1366；第二轮原 1471-1476、1495-1500）：options 各加一行 `speechAndDeathText: firstRoundEvidence.speechAndDeathText,`（或 `secondRoundEvidence.speechAndDeathText`）。

- [ ] **Step 4: 运行测试与检查**

Run: `npm run check && npx vitest run src/__tests__/evidence.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/game.ts src/__tests__/evidence.test.ts
git commit -m "feat: rework anti-consensus tax with typed evidence facts"
```

---

### Task 4: 人设卡 + 新系统提示模板（建立 prompts.ts）

**Files:**
- Create: `src/prompts.ts`
- Modify: `src/game.ts`（删除 `VOTING_STYLE_CARDS`、`DEFAULT_VOTING_STYLES`、`VoteStyleKey`、`votingStyles` 字段；`buildPlayerSystemMessage` 移入 prompts.ts）
- Modify: `src/__tests__/helpers.ts`（移除 `votingStyles`）
- Test: `src/__tests__/systemPrompt.test.ts`

**Interfaces:**
- Consumes: `PLAYER_NAMES`（gameUtils）；`import type { GameState, Role } from "./game"`
- Produces:
  - `export interface PersonaCard { name: string; background: string; speechStyle: string; voteTendency: string }`
  - `export const PERSONA_CARDS: Record<string, PersonaCard>`（键为 Seat1-Seat8）
  - `export function buildPlayerSystemMessage(playerName: string, state: GameState): string`
  - `GameState` 不再有 `votingStyles` 字段

- [ ] **Step 1: 写失败测试**

`src/__tests__/systemPrompt.test.ts`：

```typescript
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
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/__tests__/systemPrompt.test.ts`
Expected: FAIL（`../prompts` 不存在）

- [ ] **Step 3: 创建 src/prompts.ts**

```typescript
import { PLAYER_NAMES } from "./gameUtils";
import type { GameState, Role } from "./game";

export interface PersonaCard {
  name: string;
  background: string;
  speechStyle: string;
  voteTendency: string;
}

export const PERSONA_CARDS: Record<string, PersonaCard> = {
  Seat1: {
    name: "老会计",
    background: "管了三十年村账，惜字如金，账没算清绝不表态。",
    speechStyle: "冷静、精确，喜欢用数字和“账”打比方，口癖“这笔账对不上”。",
    voteTendency: "保守谨慎：没有确凿证据时投自己观望，不急于站队。",
  },
  Seat2: {
    name: "退休数学老师",
    background: "教了一辈子几何，只认前提—推理—结论的完整链条。",
    speechStyle: "条理分明，习惯先列前提再下结论，口癖“逻辑上说不通”。",
    voteTendency: "逻辑驱动：重点抓前后矛盾和论据跳跃的发言。",
  },
  Seat3: {
    name: "调查记者",
    background: "跑社会新闻十几年，第一反应永远是“谁在带节奏”。",
    speechStyle: "犀利、爱追问，习惯反问，口癖“谁最先喊的？”。",
    voteTendency: "反共识：多人快速聚焦同一目标时，优先审查最早造势的人。",
  },
  Seat4: {
    name: "拳馆教练",
    background: "带过市队，最看不惯说话含糊、避重就轻的人。",
    speechStyle: "嗓门大、句子短、直来直去，口癖“把话说清楚”。",
    voteTendency: "施压：Day1 倾向投给理由最弱、最含糊的发言者。",
  },
  Seat5: {
    name: "村医",
    background: "行医二十年，见过太多误诊，深知冤枉一个好人的代价。",
    speechStyle: "温和但严谨，讲究证据链完整，口癖“证据呢？”。",
    voteTendency: "保守谨慎：宁可弃票也不在证据不足时押注。",
  },
  Seat6: {
    name: "程序员",
    background: "在城里写了十年代码，习惯把一切拆成时间线和状态。",
    speechStyle: "简洁、爱列条目，喜欢复盘先后顺序，口癖“时间线对一下”。",
    voteTendency: "逻辑驱动：用发言与投票的先后顺序核对一致性。",
  },
  Seat7: {
    name: "戏班班主",
    background: "唱了半辈子戏，最懂台上的演技，也最不信演技。",
    speechStyle: "慢条斯理、绵里藏针，爱用戏文打比方，口癖“演得真好啊”。",
    voteTendency: "反共识：警惕情绪饱满、一呼百应的“主演”，先查造势者。",
  },
  Seat8: {
    name: "烧烤摊主",
    background: "夜市摆摊多年，阅人无数，眼里不揉沙子。",
    speechStyle: "豪爽、接地气，想到哪说到哪但句句带刺，口癖“我瞅你就不对劲”。",
    voteTendency: "施压：对含糊其辞者当场点名，逼所有人表态。",
  },
};

const FACTION_GOALS: Record<Role, string> = {
  villager:
    "你是村民阵营。胜利条件：放逐所有狼人。你唯一的武器是逻辑与投票——发言必须有立场，投票必须有理由。",
  werewolf:
    "你是狼人阵营。胜利条件：活到狼人数量不少于村民。白天你要伪装成普通村民：误导放逐方向、暗中保护队友。",
};

const STRATEGY_HANDBOOKS: Record<Role, string> = {
  villager: [
    "- 发言必须有立场：明确说你怀疑谁、为什么，或明确说你在观望、在等什么信息",
    "- 警惕两类人：推理过于完美的“神探”，和从不表态的老好人",
    "- 被冤枉时据理力争，指出指控你的人在证据上的漏洞",
    "- 推理只基于公开事实，不确定就承认不确定",
  ].join("\n"),
  werewolf: [
    "- 绝不主动指控队友；队友被围攻时，质疑指控者的“证据”，而不是硬洗白",
    "- 被指控时反打：把火力引向指控者中证据最弱的人",
    "- 推理不必太完美，适度暴露盲区，全知会惹眼",
    "- 你的投票目标是让好人被放逐，但别显得刻意",
  ].join("\n"),
};

const PLAYER_SYSTEM_TEMPLATE = `
# 狼人杀游戏：你是一名玩家

## 当前处境

你现在身处一个有8名玩家的村庄，其中有2名隐藏的狼人。
- 你的座位号：**{player_name}**（你就是这个玩家）
- 你的身份：**{role}**
- 你知道的信息：{role_info}
- 其他玩家：Seat1 - Seat8

## 你的人设

你是「{persona_name}」：{persona_background}
说话方式：{persona_speech_style}
你的发言必须始终符合这个人设的语气和口癖，禁止使用千篇一律的套话。

## 你的阵营目标

{faction_goal}

## 你的身份策略手册

{strategy_handbook}

## 你的投票倾向

{vote_tendency}

## 你不知道的信息

除了身份卡透露的信息外，你不知道任何人的真实身份。
你只能通过他们的发言、投票、行为来判断谁是敌人。
你必须承认自己不知道，不能假装确定或编造不存在的信息。
你必须始终把“我”理解为 {player_name} 本人。
白天发言时禁止怀疑或指控自己；投票时允许因观望投给自己，但这不等同于自我指控。

## 夜晚发生什么

{night_action}

## 输出格式

请以 JSON 格式回复：
{
  "action": "speech | vote | night_action",
  "target": "Seat1 | Seat2 | Seat3 | Seat4 | Seat5 | Seat6 | Seat7 | Seat8",
  "content": "你的发言内容或决策理由（<=180字）",
  "focus": "你接下来重点观察什么（<=20字，可选）",
  "confidence": "high | medium | low",
  "risk_if_wrong": "如果投错会导致什么后果（投票时必须填写）",
  "alt_target": "备选目标（必须是不同于 target 的存活玩家）",
  "target_vs_alt_reason": "为什么 target 比 alt_target 更可疑（>=8字）",
  "evidence": ["证据1（含《可核查引用》）", "证据2（含《可核查引用》）"],
  "why_change": "改票理由（仅终投改票时填写，将公示）"
}
`;

export function buildPlayerSystemMessage(playerName: string, state: GameState): string {
  const role = state.roles[playerName];
  const persona = PERSONA_CARDS[playerName];

  let roleInfo = "你是村民。你不知道其他任何人的身份。";
  let nightAction = "夜晚时，村民没有行动，请等待天亮。";

  if (role === "werewolf") {
    const teammates = PLAYER_NAMES.filter((p) => state.roles[p] === "werewolf" && p !== playerName);
    roleInfo = `你是狼人。你的同伴是：${teammates.join(", ") || "（无）"}`;
    nightAction = "夜晚时，评估威胁并选择一个村民击杀。";
  }

  return PLAYER_SYSTEM_TEMPLATE.replaceAll("{player_name}", playerName)
    .replaceAll("{role}", role)
    .replaceAll("{role_info}", roleInfo)
    .replaceAll("{persona_name}", persona.name)
    .replaceAll("{persona_background}", persona.background)
    .replaceAll("{persona_speech_style}", persona.speechStyle)
    .replaceAll("{faction_goal}", FACTION_GOALS[role])
    .replaceAll("{strategy_handbook}", STRATEGY_HANDBOOKS[role])
    .replaceAll("{vote_tendency}", persona.voteTendency)
    .replaceAll("{night_action}", nightAction);
}
```

注意：`replaceAll` 同时修复旧实现 `String.replace` 只替换首个 `{player_name}`、导致"我"锚点行残留字面占位符的 bug。

- [ ] **Step 4: game.ts 接线与 votingStyles 移除**

`src/game.ts`：

1. 顶部加 `import { buildPlayerSystemMessage } from "./prompts";`，删除原 `buildPlayerSystemMessage` 函数（原 898-921 行）。
2. 删除 `VoteStyleKey` 类型（原 6 行）、`VOTING_STYLE_CARDS`（原 84-121 行）、`DEFAULT_VOTING_STYLES`（原 123-132 行）。
3. `GameState` 接口删除 `votingStyles: Record<string, VoteStyleKey>;`（原 71 行）。
4. `createNewGameState` 删除 `votingStyles: { ...DEFAULT_VOTING_STYLES },`。
5. `coerceState` 删除 `votingStyles: { ...DEFAULT_VOTING_STYLES, ...(candidate.votingStyles ?? {}) },`。
6. `src/__tests__/helpers.ts` 删除 `votingStyles: {...}` 整块。

- [ ] **Step 5: 运行测试与检查**

Run: `npm run check && npm test`
Expected: 全部 PASS（含 Task 1-3 既有测试）

- [ ] **Step 6: Commit**

```bash
git add src/prompts.ts src/game.ts src/__tests__/
git commit -m "feat: replace voting styles with persona cards in system prompt"
```

---

### Task 5: 白天发言任务重构（答辩 + 180字 + focus + 保底变体）

**Files:**
- Modify: `src/prompts.ts`（新增 `buildSpeechTask`、`buildSpeechRetryTask`、`findAccusationsAgainst`）
- Modify: `src/game.ts`（speeches 阶段改用 builders；新增 `resolveFocus` 并 export；重写 `buildFallbackSpeech` 并 export）
- Test: `src/__tests__/speechPrompt.test.ts`

**Interfaces:**
- Consumes: `buildPlayerMemory`（Task 2）、`extractObservation`、`extractPrimarySuspicionTarget`、`seatNumber`、`chooseFallbackSpeechTarget`（gameUtils）、`Role` 类型
- Produces:
  - `export interface SpeechTaskContext { playerName: string; role: Role; day: number; alivePlayers: string[]; speeches: Record<string, string>; memory: string; accusations: string[]; factsText: string; observation: string | null }`
  - `export function buildSpeechTask(ctx: SpeechTaskContext): string`
  - `export function buildSpeechRetryTask(baseTask: string, previous: { playerName: string; day: number; target: string; content: string; evidence: string[] }): string`
  - `export function findAccusationsAgainst(speeches: Record<string, string>, playerName: string, alivePlayers: string[]): string[]`
  - `export function buildFallbackSpeech(playerName: string, alivePlayers: string[], currentDay: number): { content: string; target: string }`（game.ts）
  - `export function resolveFocus(response: Record<string, unknown>, content: string): string | null`（game.ts）

- [ ] **Step 1: 写失败测试**

`src/__tests__/speechPrompt.test.ts`：

```typescript
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
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/__tests__/speechPrompt.test.ts`
Expected: FAIL（builders 未定义）

- [ ] **Step 3: 实现 prompts.ts 追加**

顶部 import 追加 `extractPrimarySuspicionTarget` from `"./gameUtils"`。文件末尾追加：

```typescript
export interface SpeechTaskContext {
  playerName: string;
  role: Role;
  day: number;
  alivePlayers: string[];
  speeches: Record<string, string>;
  memory: string;
  accusations: string[];
  factsText: string;
  observation: string | null;
}

export function findAccusationsAgainst(
  speeches: Record<string, string>,
  playerName: string,
  alivePlayers: string[],
): string[] {
  const accusations: string[] = [];
  for (const [speaker, speech] of Object.entries(speeches)) {
    if (speaker === playerName || speech === "（发言失败）") continue;
    if (extractPrimarySuspicionTarget(speaker, speech, alivePlayers) === playerName) {
      accusations.push(`${speaker}：「${speech}」`);
    }
  }
  return accusations;
}

export function buildSpeechTask(ctx: SpeechTaskContext): string {
  const parts: string[] = [
    `现在是第 ${ctx.day} 天白天，轮到你发言。`,
    `你当前座位：${ctx.playerName}（你就是“我”）`,
    `你的身份：${ctx.role}`,
    `当前存活玩家：${ctx.alivePlayers.join(", ")}`,
    "",
  ];

  if (ctx.memory) {
    parts.push(ctx.memory, "");
  }

  if (Object.keys(ctx.speeches).length) {
    parts.push("之前的发言记录：");
    parts.push(JSON.stringify(ctx.speeches, null, 2));
    parts.push("");
  }

  if (ctx.accusations.length) {
    parts.push("## ⚠️ 你被指控了");
    for (const accusation of ctx.accusations) {
      parts.push(`今天 ${accusation}`);
    }
    parts.push("你必须在发言中正面回应（解释/反驳/反打），不能装作没看见。");
    parts.push("");
  }

  parts.push("可核查公共事实（evidence 必须引用其中原文片段）：");
  parts.push(ctx.factsText);
  parts.push("");

  if (ctx.observation) {
    parts.push(`你声明的观察重点：${ctx.observation}`);
    parts.push("");
  }

  parts.push("## 发言要求");
  parts.push("- 长度 <=180 字");
  parts.push("- 结构：先给结论（怀疑谁/为何观望）→ 给一条《引用》证据 → 回应指控（如有）");
  parts.push("- 表达方式必须符合你的人设，禁止套用固定句式");
  if (ctx.day === 1) {
    parts.push(`- 你可以点名怀疑对象并给理由，或说明暂时观望；若点名，target 不能是你自己（${ctx.playerName}）`);
  } else {
    parts.push(`- 必须包含怀疑对象和理由；target 填你怀疑的存活玩家，且不能是你自己（${ctx.playerName}）`);
  }
  parts.push("- 禁止出现“我怀疑自己/我觉得自己像狼”这类自我指控");
  parts.push("- evidence 至少1条，包含《引用片段》且可在公共事实中找到");
  parts.push("- focus 字段填写你接下来重点观察什么（<=20字）");

  if (ctx.role === "werewolf") {
    parts.push("", "## 狼人生存提醒");
    parts.push("- 推理不必太“完美”，全知神探反而惹眼，适度保留盲区");
    parts.push("- 不要主动指控队友；队友被围攻时质疑指控者的“证据”，而不是硬洗白");
    parts.push("- 若你被点名，反打指控者中证据最弱的人");
  }

  return parts.join("\n");
}

export function buildSpeechRetryTask(
  baseTask: string,
  previous: { playerName: string; day: number; target: string; content: string; evidence: string[] },
): string {
  return [
    baseTask,
    "",
    "纠错要求：",
    `- 你就是 ${previous.playerName}，不得怀疑或指控自己`,
    previous.day > 1
      ? "- 你必须在 target 字段给出一个不是自己的存活玩家"
      : "- 你可以观望，但若点名怀疑对象，必须是其他存活玩家",
    "- 你必须给出至少1条可核查 evidence，并在 evidence 中包含《引用片段》",
    `- 你上一版 target：${previous.target || "（空）"}`,
    `- 你上一版发言：${previous.content}`,
    `- 你上一版 evidence：${JSON.stringify(previous.evidence, null, 2)}`,
    "请重新输出 JSON。",
  ].join("\n");
}
```

- [ ] **Step 4: game.ts 侧实现**

`src/game.ts`：

1. import 增加 `buildSpeechRetryTask, buildSpeechTask, findAccusationsAgainst` from `"./prompts"`。
2. `buildFallbackSpeech`（原 576-601 行）替换为（加 `export`）：

```typescript
const FALLBACK_SPEECH_VARIANTS: Record<"observe" | "day1" | "suspicious", string[]> = {
  observe: [
    "现在下结论为时过早，我先把这票攥在手里，听大家的。",
    "没有实锤之前我不咬人，谁给的理由硬我听谁的。",
  ],
  day1: [
    "第一天信息就这么点，我不急着站队。{target} 的发言我先记下，明天拿票型对一对。",
    "今天先记档：{target} 说了什么、投了谁，我明天逐条核对。",
  ],
  suspicious: [
    "我盯的是 {target}：发言和票对不上号。今天给个说得通的解释，否则我这票不动。",
    "{target} 的理由前后对不齐，我暂持怀疑，欢迎你自证。",
  ],
};

export function buildFallbackSpeech(
  playerName: string,
  alivePlayers: string[],
  currentDay: number,
): { content: string; target: string } {
  const fallbackTarget = chooseFallbackSpeechTarget(playerName, alivePlayers);

  if (fallbackTarget === playerName) {
    const variants = FALLBACK_SPEECH_VARIANTS.observe;
    return {
      target: playerName,
      content: variants[(seatNumber(playerName) + currentDay) % variants.length],
    };
  }

  const variants = currentDay === 1 ? FALLBACK_SPEECH_VARIANTS.day1 : FALLBACK_SPEECH_VARIANTS.suspicious;
  return {
    target: fallbackTarget,
    content: variants[(seatNumber(playerName) + currentDay) % variants.length].replaceAll(
      "{target}",
      fallbackTarget,
    ),
  };
}
```

3. 新增（加 `export`）：

```typescript
export function resolveFocus(response: Record<string, unknown>, content: string): string | null {
  const focus = asString(response.focus, "").trim();
  if (focus) return focus.slice(0, 20);
  return extractObservation(content);
}
```

4. `runDayPhaseStep` 的 `speeches` 阶段：任务组装（原 `const speechEvidenceContext = ...` 到 `taskParts.push("小提示：过于完美的推理可能引起注意，偶尔保持模糊更安全。")` 的整段，含 `if (state.roles[playerName] === "werewolf")` 块）替换为：

```typescript
    const speechEvidenceContext = buildVoteEvidenceFacts(state, progress.speeches, recentDeath);
    const memory = buildPlayerMemory(state, playerName);
    const accusations = findAccusationsAgainst(progress.speeches, playerName, aliveSorted);

    const baseTask = buildSpeechTask({
      playerName,
      role: state.roles[playerName],
      day: state.currentDay,
      alivePlayers: aliveSorted,
      speeches: progress.speeches,
      memory,
      accusations,
      factsText: speechEvidenceContext.factsText,
      observation: state.currentDay > 1 ? state.playerObservations[playerName] : null,
    });
```

5. try 块内：在 `const response = await getPlayerResponse(...)` 后加 `let lastResponse = response;`；纠错重试内 `const retry = await ...` 后加 `lastResponse = retry;`。
6. 纠错重试任务组装（原 `const retryTask = [...]`）替换为：

```typescript
        const retryTask = buildSpeechRetryTask(baseTask, {
          playerName,
          day: state.currentDay,
          target,
          content,
          evidence,
        });
```

7. 保底调用处在 `content = fallback.content;` 后加 `target = fallback.target;`。
8. 观察提取处（原 `const observation = extractObservation(content);`）替换为 `const observation = resolveFocus(lastResponse, content);`。

- [ ] **Step 5: 运行测试与检查**

Run: `npm run check && npm test`
Expected: 全部 PASS

- [ ] **Step 6: Commit**

```bash
git add src/prompts.ts src/game.ts src/__tests__/speechPrompt.test.ts
git commit -m "feat: rebuild day speech task with defense and focus"
```

---

### Task 6: 夜晚击杀任务重构（威胁评估）

**Files:**
- Modify: `src/prompts.ts`（新增 `buildNightKillTask`）
- Modify: `src/game.ts`（`runNightPhase` 任务组装改用 builder；删除错位的"小提示"）
- Test: `src/__tests__/nightPrompt.test.ts`

**Interfaces:**
- Consumes: `sortSeats`（gameUtils）、`GameState` 类型
- Produces: `export function buildNightKillTask(state: GameState, werewolf: string, teammates: string[]): string`

- [ ] **Step 1: 写失败测试**

`src/__tests__/nightPrompt.test.ts`：

```typescript
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
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/__tests__/nightPrompt.test.ts`
Expected: FAIL（`buildNightKillTask` 未定义）

- [ ] **Step 3: 实现**

`src/prompts.ts` 顶部 import 追加 `sortSeats` from `"./gameUtils"`，末尾追加：

```typescript
export function buildNightKillTask(state: GameState, werewolf: string, teammates: string[]): string {
  const parts = [
    `现在是第 ${state.currentDay} 天夜晚，狼人行动时间。`,
    "",
    `你是狼人。你的同伴：${teammates.join(", ") || "（无）"}`,
    `当前存活玩家：${sortSeats(state.alivePlayers).join(", ")}`,
  ];

  const lastDayDeath = [...state.publicEventLog]
    .reverse()
    .find((event) => event.type === "death" && event.phase === "day");
  if (lastDayDeath) {
    parts.push(`昨天白天被处决：${lastDayDeath.content}`);
  }

  parts.push(
    "",
    "## 击杀优先级（从高到低）",
    "1. 发言最有说服力、正在把村民带向错误方向的好人——会推理的人留着就是威胁",
    "2. 票型和言论上最可能投你或队友的人",
    "3. 几乎无人怀疑的“干净牌”——留着高嫌疑者替你们背锅",
    "",
    "## 决策要求",
    "- 选择一个击杀目标（存活玩家，不能是狼人）",
    "- content 用一句话说明为什么此人威胁最大，可引用其今天的发言",
    "- 避免选择会暴露狼队思路的目标：例如你今天刚公开指控过的人，除非理由充分",
    "",
    "请输出 JSON：target + content。",
  );

  if (state.playerObservations[werewolf]) {
    parts.push("", `你之前关注的观察对象：${state.playerObservations[werewolf]}`);
  }

  return parts.join("\n");
}
```

`src/game.ts` `runNightPhase` 狼人循环内的任务组装（原 1077-1089 行 `const teammates = ...; let task = [...]; if (state.playerObservations[werewolf]) { task += ... }` 段）替换为：

```typescript
    const teammates = aliveWerewolves.filter((p) => p !== werewolf);
    const task = buildNightKillTask(state, werewolf, teammates);
```

import 增加 `buildNightKillTask`。

- [ ] **Step 4: 运行测试与检查**

Run: `npm run check && npm test`
Expected: 全部 PASS

- [ ] **Step 5: Commit**

```bash
git add src/prompts.ts src/game.ts src/__tests__/nightPrompt.test.ts
git commit -m "feat: rebuild night kill task around threat assessment"
```

---

### Task 7: 两轮投票任务重构 + 改票判定简化

**Files:**
- Modify: `src/prompts.ts`（新增 `buildFirstVoteTask`、`buildSecondVoteTask`）
- Modify: `src/game.ts`（两个投票阶段改用 builders；新增 `finalizeSecondRoundVote` 并 export；删除 `hasChangedVote`、`isValidVoteChange`、`asBoolean`；`VoteDecision`、`FinalVote` 加 export；投票纠错文案更新）
- Test: `src/__tests__/votePrompt.test.ts`

**Interfaces:**
- Consumes: `VoteDecision`、`FinalVote` 类型（game.ts，本任务加 export）
- Produces:
  - `export interface VoteTaskContext { playerName: string; role: Role; day: number; alivePlayers: string[]; daySummary: string; factsText: string; mySpeech: string; memory: string; observation: string | null; recentDeathContent: string | null }`
  - `export interface SecondVoteTaskContext extends VoteTaskContext { voteDistribution: string; consensusTargets: string[]; initialTarget: string }`
  - `export function buildFirstVoteTask(ctx: VoteTaskContext): string`
  - `export function buildSecondVoteTask(ctx: SecondVoteTaskContext): string`
  - `export function finalizeSecondRoundVote(initialTarget: string, decision: VoteDecision, whyChange: string): FinalVote`（game.ts）

- [ ] **Step 1: 写失败测试**

`src/__tests__/votePrompt.test.ts`：

```typescript
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
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/__tests__/votePrompt.test.ts`
Expected: FAIL（builders 与 `finalizeSecondRoundVote` 未定义）

- [ ] **Step 3: 实现 prompts.ts 追加**

```typescript
export interface VoteTaskContext {
  playerName: string;
  role: Role;
  day: number;
  alivePlayers: string[];
  daySummary: string;
  factsText: string;
  mySpeech: string;
  memory: string;
  observation: string | null;
  recentDeathContent: string | null;
}

export interface SecondVoteTaskContext extends VoteTaskContext {
  voteDistribution: string;
  consensusTargets: string[];
  initialTarget: string;
}

export function buildFirstVoteTask(ctx: VoteTaskContext): string {
  const parts = [
    `现在是第 ${ctx.day} 天白天【第一轮：私下初投】。`,
    `你的身份：${ctx.role}`,
    `当前存活玩家：${ctx.alivePlayers.join(", ")}`,
    "",
  ];

  if (ctx.memory) {
    parts.push(ctx.memory, "");
  }

  parts.push("GM公共公告摘要：", ctx.daySummary);
  parts.push("（这是事实汇总，不是投票指引——先形成你自己的判断，再对照它。）", "");
  parts.push("可核查公共事实（evidence 必须引用其中原文片段）：", ctx.factsText, "");
  parts.push(`你今天的发言："${ctx.mySpeech}"`, "");

  if (ctx.day === 1) {
    parts.push("Day1 信息天然稀少，投票分散是正常且健康的，无需急于站队。", "");
  }

  parts.push(
    "投票约束：",
    "- 这是第一轮私下投票，结果不会立即公开",
    "- 你必须在 risk_if_wrong 字段填写投错代价（>=6字）",
    "- evidence 至少2条；每条包含《引用片段》且可在公共事实中找到",
    "- alt_target 必须是不同于 target 的存活玩家",
    "- target_vs_alt_reason（>=8字）说明为何 target 比 alt_target 更可疑",
    "",
    "请投票给你认为最可能是狼人的玩家，或投给自己表示观望。",
  );

  if (ctx.recentDeathContent) {
    parts.push(`最近一次死亡：${ctx.recentDeathContent}`);
  }
  if (ctx.observation) {
    parts.push(`记住你要观察的对象：${ctx.observation}`);
  }
  return parts.join("\n");
}

export function buildSecondVoteTask(ctx: SecondVoteTaskContext): string {
  const parts = [
    `现在是第 ${ctx.day} 天白天【第二轮：终投】。`,
    `你的身份：${ctx.role}`,
    `当前存活玩家：${ctx.alivePlayers.join(", ")}`,
    "",
  ];

  if (ctx.memory) {
    parts.push(ctx.memory, "");
  }

  parts.push("GM公共公告摘要：", ctx.daySummary, "");
  parts.push(ctx.voteDistribution, "");
  parts.push("可核查公共事实（evidence 必须引用其中原文片段）：", ctx.factsText, "");
  parts.push(`当前最高票目标：${ctx.consensusTargets.join(", ") || "（无）"}`);
  parts.push(`你第一轮投给了：${ctx.initialTarget}`);
  parts.push(`你今天的发言："${ctx.mySpeech}"`, "");

  parts.push(
    "## 这是最后的表态机会",
    "你可以加入多数放逐嫌疑人，可以另立山头，也可以为人辩护——但必须给出你自己的理由。",
    "",
    "投票约束：",
    "- 你可以看到第一轮票型分布，据此调整决策",
    "- evidence 至少2条；每条包含《引用片段》且可在公共事实中找到",
    "- alt_target 必须是不同于 target 的存活玩家",
    "- target_vs_alt_reason（>=8字）说明为何 target 比 alt_target 更可疑",
    "- 若 target 命中当前最高票目标，必须至少给出一条指向该目标言行的独立证据（不能只说“大家都投”）",
    "- 改票无需声明，系统会自动对比你两轮的 target；改票时建议在 why_change 写一句理由（将公示）",
    "",
    "请进行你的终投。",
  );

  if (ctx.recentDeathContent) {
    parts.push(`最近一次死亡：${ctx.recentDeathContent}`);
  }
  if (ctx.observation) {
    parts.push(`记住你要观察的对象：${ctx.observation}`);
  }
  return parts.join("\n");
}
```

- [ ] **Step 4: game.ts 投票阶段改造**

1. import 增加 `buildFirstVoteTask, buildSecondVoteTask` from `"./prompts"`；`interface FinalVote` 改为 `export interface FinalVote`（`VoteDecision` 已在 Task 3 export）。
2. 删除函数：`hasChangedVote`（原 611-613 行）、`isValidVoteChange`（原 615-619 行）。`asBoolean`（现于 gameUtils）：确认仅被 second_vote 阶段的 `changed_vote` 解析使用（全局搜索 `asBoolean`），若仅此用途则从 gameUtils.ts 删除并从 game.ts import 中移除。
3. 新增（加 `export`）：

```typescript
export function finalizeSecondRoundVote(
  initialTarget: string,
  decision: VoteDecision,
  whyChange: string,
): FinalVote {
  const actualChanged = initialTarget !== decision.target;
  return {
    target: decision.target,
    changed_vote: actualChanged,
    why_change: actualChanged && whyChange.trim() ? whyChange.trim() : null,
  };
}
```

4. `first_vote` 阶段：任务组装（原 `const firstRoundEvidence = ...` 至 `taskParts` 全部 push、以及末尾 `if (recentDeath) ... if (state.playerObservations[playerName]) ...` 两段）替换为：

```typescript
    const firstRoundEvidence = buildVoteEvidenceFacts(state, progress.speeches, recentDeath);
    const baseTask = buildFirstVoteTask({
      playerName,
      role: state.roles[playerName],
      day: state.currentDay,
      alivePlayers: aliveSorted,
      daySummary: progress.daySummary,
      factsText: firstRoundEvidence.factsText,
      mySpeech: progress.speeches[playerName] ?? "（无）",
      memory: buildPlayerMemory(state, playerName),
      observation: state.playerObservations[playerName] ?? null,
      recentDeathContent: recentDeath?.content ?? null,
    });
```

纠错重试文案（原 `const retryTask = [...]`）替换为：

```typescript
        const retryTask = [
          baseTask,
          "",
          "纠错要求：",
          `- 你上一版 target：${decision.target || "（空）"}`,
          `- 你上一版 alt_target：${decision.altTarget || "（空）"}`,
          `- 你上一版 target_vs_alt_reason：${decision.targetVsAltReason || "（空）"}`,
          `- 你上一版 evidence：${JSON.stringify(decision.evidence, null, 2)}`,
          "- 请重新输出 JSON，并满足上述全部硬约束。",
        ].join("\n");
```

5. `second_vote` 阶段：任务组装（原 `const secondRoundEvidence = ...` 至全部 `taskParts` push 与末尾两段）替换为：

```typescript
    const secondRoundEvidence = buildVoteEvidenceFacts(
      state,
      progress.speeches,
      recentDeath,
      progress.voteDistribution,
    );
    const initialTarget = progress.initialVotes[playerName] ?? playerName;
    const baseTask = buildSecondVoteTask({
      playerName,
      role: state.roles[playerName],
      day: state.currentDay,
      alivePlayers: aliveSorted,
      daySummary: progress.daySummary,
      factsText: secondRoundEvidence.factsText,
      mySpeech: progress.speeches[playerName] ?? "（无）",
      memory: buildPlayerMemory(state, playerName),
      observation: state.playerObservations[playerName] ?? null,
      recentDeathContent: recentDeath?.content ?? null,
      voteDistribution: progress.voteDistribution,
      consensusTargets: progress.consensusTargets,
      initialTarget,
    });
```

try 块内改造：

- 删除 `let changedVote = asBoolean(response.changed_vote, false);`；`whyChange` 保持 `let whyChange = asString(response.why_change, "").trim();`。
- 删除 try 开头的 `const initialTarget = progress.initialVotes[playerName] ?? playerName;`（已上移到任务组装处）。
- 纠错重试内删除 `changedVote = asBoolean(retry.changed_vote, false);`，保留 `whyChange = asString(retry.why_change, "").trim();`。
- 第二轮纠错重试文案（原 `const retryTask = [...]`）替换为：

```typescript
        const retryTask = [
          baseTask,
          "",
          "纠错要求：",
          `- 你上一版 target：${decision.target || "（空）"}`,
          `- 你上一版 alt_target：${decision.altTarget || "（空）"}`,
          `- 你上一版 target_vs_alt_reason：${decision.targetVsAltReason || "（空）"}`,
          `- 你上一版 evidence：${JSON.stringify(decision.evidence, null, 2)}`,
          "- 命中最高票目标时，必须补充指向该目标言行的独立证据，不能只写“多数人在投”。",
          "- 请重新输出 JSON，并满足上述全部硬约束。",
        ].join("\n");
```

- 校验通过分支（原 `} else {` 内的 target/actualChanged/validChange 判定链）整体替换为：

```typescript
      } else {
        const finalVote = finalizeSecondRoundVote(initialTarget, decision, whyChange);
        progress.finalVotes[playerName] = finalVote;
        appendTimeline(state, `🗳️ ${playerName} → ${finalVote.target}${finalVote.changed_vote ? " (改票)" : ""}`);
        if (finalVote.why_change) {
          appendTimeline(state, `   理由：${finalVote.why_change}`);
        }
      }
```

- [ ] **Step 5: 运行测试与检查**

Run: `npm run check && npm test`
Expected: 全部 PASS

- [ ] **Step 6: Commit**

```bash
git add src/prompts.ts src/game.ts src/__tests__/votePrompt.test.ts
git commit -m "feat: simplify vote change handling and rebuild vote tasks"
```

---

### Task 8: GM 摘要提示收紧

**Files:**
- Modify: `src/prompts.ts`（迁入 `GAME_MASTER_SYSTEM_PROMPT`，新增 `buildDaySummaryTask`）
- Modify: `src/game.ts`（`generateDaySummary` 改用 builder；删除本地 `GAME_MASTER_SYSTEM_PROMPT`）
- Test: `src/__tests__/gmSummary.test.ts`

**Interfaces:**
- Consumes: 无新依赖
- Produces:
  - `export const GAME_MASTER_SYSTEM_PROMPT: string`
  - `export function buildDaySummaryTask(day: number, speeches: Record<string, string>): string`

- [ ] **Step 1: 写失败测试**

`src/__tests__/gmSummary.test.ts`：

```typescript
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
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/__tests__/gmSummary.test.ts`
Expected: FAIL（未从 prompts 导出）

- [ ] **Step 3: 实现**

`src/prompts.ts` 追加：

```typescript
export const GAME_MASTER_SYSTEM_PROMPT = `
# 狼人杀游戏管理员 (GameMaster)

你是狼人杀游戏的 Game Master（游戏管理员），负责推进游戏流程和裁决胜负。
你只需要输出 JSON，不要输出额外文本。
`;

export function buildDaySummaryTask(day: number, speeches: Record<string, string>): string {
  return [
    `请为第 ${day} 天的发言生成投票摘要。`,
    "以下是今天所有存活玩家的发言：",
    JSON.stringify(speeches, null, 2),
    "你必须只输出 JSON：{\"summary\":\"...\"}。",
    "summary 必须仅包含事实，不表达立场，且最多 6 行。",
    "按玩家逐行陈述：点名怀疑了谁、支持/反对了谁、是否给出理由、是否质疑他人带节奏。",
    "禁止使用“建议关注”“最可疑”“值得警惕”等倾向性措辞——只描述发言内容本身。",
  ].join("\n");
}
```

`src/game.ts`：

1. 删除本地 `GAME_MASTER_SYSTEM_PROMPT`（原 136-141 行），import 增加 `buildDaySummaryTask, GAME_MASTER_SYSTEM_PROMPT` from `"./prompts"`。
2. `generateDaySummary` 中 `const gmTask = [...].join("\n")` 段替换为：

```typescript
  const gmTask = buildDaySummaryTask(state.currentDay, speeches);
```

- [ ] **Step 4: 运行测试与检查**

Run: `npm run check && npm test`
Expected: 全部 PASS

- [ ] **Step 5: Commit**

```bash
git add src/prompts.ts src/game.ts src/__tests__/gmSummary.test.ts
git commit -m "feat: tighten GM summary prompt"
```

---

### Task 9: 全量验证与进度记录

**Files:**
- Modify: `progress.md`

**Interfaces:**
- Consumes: 全部前置任务
- Produces: 验证记录

- [ ] **Step 1: 全量静态验证**

```bash
npm run check && npm test && npx wrangler deploy --dry-run
```

Expected: 三项全部通过。

- [ ] **Step 2: 本地 API 冒烟（若环境允许本地监听；沙箱受限时记录跳过原因）**

```bash
npm run dev &
curl http://127.0.0.1:8787/api/health
curl -X POST http://127.0.0.1:8787/api/game/new -H 'content-type: application/json' -d '{}'
```

Expected: health 正常；new 返回完整 state。若 `wrangler dev` 因沙箱监听受限失败（progress.md 已知问题），记录后跳过。

- [ ] **Step 3: 真实模型对局验证（若 `.dev.vars` 已配置 SILICONFLOW_API_KEY）**

通过 UI 或 `/api/game/step` 循环跑 2-3 局完整对局，检查 timeline：
- Day1 分散度日志为"高"
- 终投改票人数 > 0
- "已使用保底发言"/"二次输出仍违规"次数少
- 跨天发言无自相矛盾（抽查）
- 8 人口吻差异明显（抽查）

无密钥环境则记录"待线上验证"，不阻塞。

- [ ] **Step 4: 更新 progress.md 并提交**

追加条目：提示词体系重构完成（人设卡/答辩/威胁击杀/投票博弈/记忆注入/改票简化/反共识税重构）、vitest 引入与测试文件清单、验证结果。

```bash
git add progress.md
git commit -m "docs: update progress notes for prompt overhaul"
```

---

## Self-Review 记录

- Spec 覆盖：§3.1→Task 4；§3.2→Task 5；§3.3→Task 6；§3.4→Task 3+7；§3.5→Task 8；§3.6→Task 2+5+7；§3.7→Task 3+5+7；§5 验证→Task 9。无遗漏。
- 类型一致性：`SpeechTaskContext`/`VoteTaskContext`/`SecondVoteTaskContext`/`VoteEvidenceContext` 在定义任务与使用任务中签名一致；`finalizeSecondRoundVote` 返回 `FinalVote`；`buildPlayerMemory` 返回 string。测试所需的类型/函数导出已安排在最早使用它的任务：`DayProgress`（Task 2）、`VoteDecision`/`validateVoteDecision`（Task 3）、`FinalVote`（Task 7）。
- 已知偏差（有意）：保底发言变体确定性选择（见 Global Constraints）；`asBoolean` 从 gameUtils 删除（唯一调用点消失）。

