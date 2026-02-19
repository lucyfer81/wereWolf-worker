import OpenAI from "openai";

type Role = "werewolf" | "villager";
type Winner = "werewolves" | "villagers" | "none";
type Phase = "day" | "night";
type VoteStyleKey = "conservative" | "pressure" | "contrarian" | "logic_driven";

export interface EnvVars {
  SILICONFLOW_API_KEY?: string;
  SILICONFLOW_MODEL?: string;
  SILICONFLOW_BASE_URL?: string;
}

export interface PublicEvent {
  type: string;
  speaker: string;
  content: string;
  day: number;
  phase: Phase;
  alive: string[];
  [key: string]: unknown;
}

interface FinalVote {
  target: string;
  changed_vote: boolean;
  why_change: string | null;
}

export interface GameState {
  id: string;
  roles: Record<string, Role>;
  alivePlayers: string[];
  currentDay: number;
  nextPhase: Phase;
  votingStyles: Record<string, VoteStyleKey>;
  playerObservations: Record<string, string>;
  publicEventLog: PublicEvent[];
  timeline: string[];
  finished: boolean;
  winner: Winner;
  lastUpdatedAt: string;
}

const TOTAL_PLAYERS = 8;
const WEREWOLF_COUNT = 2;
const PLAYER_NAMES = Array.from({ length: TOTAL_PLAYERS }, (_, i) => `Seat${i + 1}`);

const VOTING_STYLE_CARDS: Record<
  VoteStyleKey,
  { name: string; rules: string; scenarios: string[] }
> = {
  conservative: {
    name: "保守谨慎型",
    rules: "无确凿证据时弃票（投给自己），不急于站队",
    scenarios: [
      "场景1：Day 1 没有人提出实质性指控时，选择观望",
      "场景2：看到多人互相指控但逻辑都薄弱时，不急于站队",
    ],
  },
  pressure: {
    name: "施压型",
    rules: "Day 1 倾向投票给理由最弱的发言者",
    scenarios: [
      "场景1：某人的发言仅为“我觉得 XXX 可疑”而无具体行为时，优先投他",
      "场景2：多人保持观望时，主动制造压力迫使表态",
    ],
  },
  contrarian: {
    name: "反共识型",
    rules:
      "当多人迅速聚焦同一目标时，优先评估“最早提出主叙事的人”而非直接投给被聚焦者",
    scenarios: [
      "场景1：看到 3 人同投 Seat1 时，检查谁最先指控 Seat1，评估其是否在带节奏",
      "场景2：不直接投给被聚焦者，而是投给“造势者”",
    ],
  },
  logic_driven: {
    name: "逻辑驱动型",
    rules: "优先抓自相矛盾或论据跳跃的发言",
    scenarios: [
      "场景1：发现某人前后发言矛盾（例如先说观察 XXX 后又投 XXX），标记为可疑",
      "场景2：某人论据从行为 A 跳到行为 B 而无逻辑链条，重点怀疑",
    ],
  },
};

const DEFAULT_VOTING_STYLES: Record<string, VoteStyleKey> = {
  Seat1: "conservative",
  Seat2: "logic_driven",
  Seat3: "contrarian",
  Seat4: "pressure",
  Seat5: "conservative",
  Seat6: "logic_driven",
  Seat7: "contrarian",
  Seat8: "pressure",
};

const GAME_MASTER_SYSTEM_PROMPT = `
# 狼人杀游戏管理员 (GameMaster)

你是狼人杀游戏的 Game Master（游戏管理员），负责推进游戏流程和裁决胜负。
你只需要输出 JSON，不要输出额外文本。
`;

const PLAYER_SYSTEM_TEMPLATE = `
# 狼人杀游戏：你是一名玩家

## 当前处境

你现在身处一个有8名玩家的村庄，其中有2名隐藏的狼人。
- 你的座位号：**{player_name}**（你就是这个玩家）
- 你的身份：**{role}**
- 你知道的信息：{role_info}
- 其他玩家：Seat1 - Seat8

## 你的投票风格

你是 {style_name} 型玩家。

规则：{style_rules}

场景示例：
{style_scenarios}

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
  "content": "你的发言内容或决策理由（<=120字）",
  "confidence": "high | medium | low",
  "risk_if_wrong": "如果投错会导致什么后果（投票时必须填写）",
  "alt_target": "备选目标（不确定时可填自己）",
  "changed_vote": false,
  "why_change": ""
}
`;

function nowISO(): string {
  return new Date().toISOString();
}

function cloneState(state: GameState): GameState {
  return structuredClone(state);
}

function seatNumber(seat: string): number {
  const match = seat.match(/\d+/);
  return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER;
}

function sortSeats(seats: string[]): string[] {
  return [...seats].sort((a, b) => seatNumber(a) - seatNumber(b));
}

function chooseRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  return fallback;
}

function isSeat(value: string): boolean {
  return PLAYER_NAMES.includes(value);
}

function parseJSONFromText(text: string): Record<string, unknown> {
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    // continue
  }

  const fencedJson = text.match(/```json\s*([\s\S]*?)```/i);
  if (fencedJson?.[1]) {
    try {
      return JSON.parse(fencedJson[1].trim()) as Record<string, unknown>;
    } catch {
      // continue
    }
  }

  const fenced = text.match(/```\s*([\s\S]*?)```/);
  if (fenced?.[1]) {
    const body = fenced[1].replace(/^json/i, "").trim();
    try {
      return JSON.parse(body) as Record<string, unknown>;
    } catch {
      // continue
    }
  }

  const first = text.indexOf("{");
  if (first !== -1) {
    let depth = 0;
    for (let i = first; i < text.length; i += 1) {
      if (text[i] === "{") depth += 1;
      if (text[i] === "}") {
        depth -= 1;
        if (depth === 0) {
          const candidate = text.slice(first, i + 1);
          try {
            return JSON.parse(candidate) as Record<string, unknown>;
          } catch {
            break;
          }
        }
      }
    }
  }

  throw new Error("无法从模型输出中提取有效 JSON");
}

function appendTimeline(state: GameState, line: string): void {
  state.timeline.push(line);
  if (state.timeline.length > 5000) {
    state.timeline = state.timeline.slice(-5000);
  }
}

function addEvent(
  state: GameState,
  eventType: string,
  speaker: string,
  content: string,
  phase: Phase,
  extra: Record<string, unknown> = {},
): void {
  state.publicEventLog.push({
    type: eventType,
    speaker,
    content,
    day: state.currentDay,
    phase,
    alive: [...state.alivePlayers],
    ...extra,
  });
}

function formatRole(role: Role): string {
  return role === "werewolf" ? "🐺 狼人" : "👤 村民";
}

function extractObservation(content: string): string | null {
  const keywords = ["观察", "关注", "留意", "重点", "盯着"];
  for (const keyword of keywords) {
    const idx = content.indexOf(keyword);
    if (idx !== -1) {
      return content
        .slice(idx, idx + 30)
        .replaceAll("，", "、")
        .replaceAll("。", "")
        .trim();
    }
  }
  return null;
}

function normalizeSpeechText(text: string): string {
  return text.replace(/\s+/g, "");
}

function hasSelfSuspicionSpeech(playerName: string, content: string): boolean {
  const normalized = normalizeSpeechText(content);
  const directSelfPatterns = [
    "我怀疑自己",
    "我觉得自己可疑",
    "我认为自己是狼",
    `我怀疑${playerName}`,
    `我觉得${playerName}可疑`,
    `我认为${playerName}是狼`,
    `我会投${playerName}`,
    `我投${playerName}`,
    `优先怀疑${playerName}`,
    `优先投${playerName}`,
  ];
  return directSelfPatterns.some((pattern) => normalized.includes(pattern));
}

function validateSpeechOutput(
  playerName: string,
  content: string,
  target: string,
  alivePlayers: string[],
  currentDay: number,
): string | null {
  if (!content.trim()) {
    return "发言内容为空";
  }

  if (currentDay > 1) {
    if (!target || !isSeat(target)) {
      return "缺少有效怀疑目标 target";
    }
    if (!alivePlayers.includes(target)) {
      return "怀疑目标不是存活玩家";
    }
    if (target === playerName) {
      return "怀疑目标不能是自己";
    }
  }

  if (hasSelfSuspicionSpeech(playerName, content)) {
    return "发言内容包含自我怀疑";
  }

  return null;
}

function chooseFallbackSpeechTarget(playerName: string, alivePlayers: string[]): string {
  return alivePlayers.find((seat) => seat !== playerName) ?? playerName;
}

function buildFallbackSpeech(
  playerName: string,
  alivePlayers: string[],
  currentDay: number,
): { content: string; target: string } {
  const fallbackTarget = chooseFallbackSpeechTarget(playerName, alivePlayers);

  if (fallbackTarget === playerName) {
    return {
      target: playerName,
      content: "目前信息不足，我先保持观望。",
    };
  }

  if (currentDay === 1) {
    return {
      target: fallbackTarget,
      content: `第一天信息有限，我先观望，但会重点关注 ${fallbackTarget} 后续发言与投票是否一致。`,
    };
  }

  return {
    target: fallbackTarget,
    content: `我暂时怀疑 ${fallbackTarget}，其发言与投票逻辑存在跳跃，我会继续观察后续一致性。`,
  };
}

function checkWinCondition(state: GameState): Winner {
  const aliveWerewolves = state.alivePlayers.filter((p) => state.roles[p] === "werewolf").length;
  const aliveVillagers = state.alivePlayers.filter((p) => state.roles[p] === "villager").length;
  if (aliveWerewolves === 0) return "villagers";
  if (aliveWerewolves >= aliveVillagers) return "werewolves";
  return "none";
}

function hasChangedVote(initialTarget: string, finalTarget: string): boolean {
  return initialTarget !== finalTarget;
}

function isValidVoteChange(changedVote: boolean, whyChange?: string | null): boolean {
  if (!changedVote) return true;
  if (!whyChange) return false;
  return whyChange.trim().length >= 5;
}

function generateVoteDistribution(votes: Record<string, string | null>): string {
  if (!Object.keys(votes).length) {
    return "📊 第一轮投票结果（票型分布）：\n  （无投票数据）";
  }

  const counts: Record<string, number> = {};
  for (const target of Object.values(votes)) {
    if (target) {
      counts[target] = (counts[target] ?? 0) + 1;
    }
  }

  if (!Object.keys(counts).length) {
    return "📊 第一轮投票结果（票型分布）：\n  （无有效投票）";
  }

  const lines = Object.entries(counts)
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return seatNumber(a[0]) - seatNumber(b[0]);
    })
    .map(([target, count]) => `  ${target}: ${count}票`);

  return ["📊 第一轮投票结果（票型分布）：", ...lines].join("\n");
}

function buildPlayerSystemMessage(
  playerName: string,
  state: GameState,
): string {
  const role = state.roles[playerName];
  const style = VOTING_STYLE_CARDS[state.votingStyles[playerName]];

  let roleInfo = "你是村民。你不知道其他任何人的身份。";
  let nightAction = "夜晚时，村民没有行动，请等待天亮。";

  if (role === "werewolf") {
    const teammates = PLAYER_NAMES.filter((p) => state.roles[p] === "werewolf" && p !== playerName);
    roleInfo = `你是狼人。你的同伴是：${teammates.join(", ") || "（无）"}`;
    nightAction = "夜晚时，与同伴商议并选择一个村民进行击杀。";
  }

  return PLAYER_SYSTEM_TEMPLATE.replace("{player_name}", playerName)
    .replace("{role}", role)
    .replace("{role_info}", roleInfo)
    .replace("{style_name}", style.name)
    .replace("{style_rules}", style.rules)
    .replace("{style_scenarios}", style.scenarios.join("\n"))
    .replace("{night_action}", nightAction);
}

function requireModelEnv(env: EnvVars): { apiKey: string; model: string; baseURL: string } {
  const missing: string[] = [];
  if (!env.SILICONFLOW_API_KEY) missing.push("SILICONFLOW_API_KEY");
  if (!env.SILICONFLOW_MODEL) missing.push("SILICONFLOW_MODEL");
  if (!env.SILICONFLOW_BASE_URL) missing.push("SILICONFLOW_BASE_URL");
  if (missing.length) {
    throw new Error(`缺少环境变量：${missing.join(", ")}`);
  }
  return {
    apiKey: env.SILICONFLOW_API_KEY!,
    model: env.SILICONFLOW_MODEL!,
    baseURL: env.SILICONFLOW_BASE_URL!,
  };
}

async function callJSONModel(
  client: OpenAI,
  model: string,
  systemMessage: string,
  task: string,
): Promise<Record<string, unknown>> {
  const base = {
    model,
    messages: [
      { role: "system" as const, content: systemMessage },
      { role: "user" as const, content: task },
    ],
    temperature: 0.7,
  };

  let content = "";
  try {
    const response = await client.chat.completions.create({
      ...base,
      response_format: { type: "json_object" },
    });
    content = asString(response.choices[0]?.message?.content, "");
  } catch {
    const response = await client.chat.completions.create(base);
    content = asString(response.choices[0]?.message?.content, "");
  }

  if (!content) {
    throw new Error("模型返回空内容");
  }
  return parseJSONFromText(content);
}

async function getPlayerResponse(
  state: GameState,
  client: OpenAI,
  model: string,
  playerName: string,
  task: string,
): Promise<Record<string, unknown>> {
  const systemMessage = buildPlayerSystemMessage(playerName, state);
  return callJSONModel(client, model, systemMessage, task);
}

async function getGmResponse(
  client: OpenAI,
  model: string,
  task: string,
): Promise<Record<string, unknown>> {
  return callJSONModel(client, model, GAME_MASTER_SYSTEM_PROMPT, task);
}

async function runNightPhase(
  state: GameState,
  client: OpenAI,
  model: string,
): Promise<void> {
  appendTimeline(state, `\n${"=".repeat(70)}`);
  appendTimeline(state, `🌙 第 ${state.currentDay} 天 - 夜晚`);
  appendTimeline(state, `${"=".repeat(70)}\n`);

  const aliveWerewolves = sortSeats(
    state.alivePlayers.filter((player) => state.roles[player] === "werewolf"),
  );

  if (!aliveWerewolves.length) {
    appendTimeline(state, "💀 没有存活狼人，今晚平安夜");
    addEvent(state, "announcement", "GameMaster", "今晚平安夜，无人死亡", "night");
    return;
  }

  appendTimeline(state, `🐺 狼人行动中...（${aliveWerewolves.join(", ")}）`);

  const targets: Record<string, string | null> = {};

  for (const werewolf of aliveWerewolves) {
    const teammates = aliveWerewolves.filter((p) => p !== werewolf);
    let task = [
      `现在是第 ${state.currentDay} 天夜晚。`,
      "",
      `你是狼人。你的同伴：${teammates.join(", ") || "（无）"}`,
      `当前存活玩家：${sortSeats(state.alivePlayers).join(", ")}`,
      "请选择今晚的击杀目标。",
      "小提示：过于完美的推理可能引起注意，偶尔保持模糊更安全。",
    ].join("\n");

    if (state.playerObservations[werewolf]) {
      task += `\n你之前关注的观察对象：${state.playerObservations[werewolf]}`;
    }

    try {
      const response = await getPlayerResponse(state, client, model, werewolf, task);
      let target = asString(response.target);

      if (!state.alivePlayers.includes(target) || state.roles[target] === "werewolf") {
        const validTargets = state.alivePlayers.filter((p) => state.roles[p] !== "werewolf");
        target = validTargets.length ? chooseRandom(validTargets) : "";
        appendTimeline(state, `⚠️ ${werewolf} 选择无效目标，已随机修正为 ${target || "无"}`);
      }
      targets[werewolf] = target || null;
      appendTimeline(state, `🐺 ${werewolf} → ${target || "无"}`);
    } catch (error) {
      const validTargets = state.alivePlayers.filter((p) => state.roles[p] !== "werewolf");
      targets[werewolf] = validTargets.length ? chooseRandom(validTargets) : null;
      appendTimeline(state, `❌ ${werewolf} 夜晚行动失败：${String(error)}`);
    }
  }

  const targetCount: Record<string, number> = {};
  for (const target of Object.values(targets)) {
    if (target) {
      targetCount[target] = (targetCount[target] ?? 0) + 1;
    }
  }

  appendTimeline(state, `\n${"─".repeat(70)}`);
  appendTimeline(state, "🌙 击杀结果");
  appendTimeline(state, `${"─".repeat(70)}`);

  if (!Object.keys(targetCount).length) {
    appendTimeline(state, "💀 今晚无人死亡");
    addEvent(state, "announcement", "GameMaster", "今晚无人死亡", "night");
    return;
  }

  const maxCount = Math.max(...Object.values(targetCount));
  const finalists = Object.entries(targetCount)
    .filter(([, count]) => count === maxCount)
    .map(([seat]) => seat);
  const finalTarget = finalists.sort((a, b) => seatNumber(a) - seatNumber(b))[0];

  state.alivePlayers = state.alivePlayers.filter((p) => p !== finalTarget);
  appendTimeline(state, `💀 ${finalTarget} 被狼人杀害`);
  addEvent(state, "death", "GameMaster", `${finalTarget} 被狼人杀害`, "night");
}

async function runDayPhase(
  state: GameState,
  client: OpenAI,
  model: string,
): Promise<void> {
  appendTimeline(state, `\n${"=".repeat(70)}`);
  appendTimeline(state, `☀️ 第 ${state.currentDay} 天 - 白天`);
  appendTimeline(state, `${"=".repeat(70)}\n`);

  const speeches: Record<string, string> = {};
  const aliveSorted = sortSeats(state.alivePlayers);

  for (const playerName of aliveSorted) {
    const taskParts: string[] = [
      `现在是第 ${state.currentDay} 天白天。`,
      `你当前座位：${playerName}（你就是“我”）`,
      `你的身份：${state.roles[playerName]}`,
      `当前存活玩家：${aliveSorted.join(", ")}`,
      "",
    ];

    if (Object.keys(speeches).length) {
      taskParts.push("之前的发言记录：");
      taskParts.push(JSON.stringify(speeches, null, 2));
      taskParts.push("");
    }

    if (state.currentDay > 1 && state.playerObservations[playerName]) {
      taskParts.push(`你观察的重点是：${state.playerObservations[playerName]}`);
      taskParts.push("");
    }

    if (state.currentDay === 1) {
      taskParts.push("请进行你的发言（<=120字）。你可以点名怀疑对象并给理由，或说明暂时观望。");
      taskParts.push(`如果你点名怀疑对象，target 不能是你自己（${playerName}）。`);
    } else {
      taskParts.push("请进行你的发言（<=120字），必须包含怀疑对象和理由。");
      taskParts.push(`必须在 target 字段填写你怀疑的存活玩家，且 target 不能是你自己（${playerName}）。`);
    }
    taskParts.push("禁止出现“我怀疑自己 / 我觉得自己像狼 / 我投自己因为我是狼”这类自我指控。");

    if (state.roles[playerName] === "werewolf") {
      taskParts.push("小提示：过于完美的推理可能引起注意，偶尔保持模糊更安全。");
    }

    try {
      const baseTask = taskParts.join("\n");
      const response = await getPlayerResponse(
        state,
        client,
        model,
        playerName,
        baseTask,
      );
      let content = asString(response.content, "（发言失败）").trim() || "（发言失败）";
      let target = asString(response.target, "").trim();
      let speechIssue = validateSpeechOutput(
        playerName,
        content,
        target,
        aliveSorted,
        state.currentDay,
      );

      if (speechIssue) {
        appendTimeline(state, `⚠️ ${playerName} 发言触发约束（${speechIssue}），请求纠错重试`);
        const retryTask = [
          baseTask,
          "",
          "纠错要求：",
          `- 你就是 ${playerName}，不得怀疑或指控自己`,
          state.currentDay > 1
            ? "- 你必须在 target 字段给出一个不是自己的存活玩家"
            : "- 你可以观望，但若点名怀疑对象，必须是其他存活玩家",
          `- 你上一版 target：${target || "（空）"}`,
          `- 你上一版发言：${content}`,
          "请重新输出 JSON。",
        ].join("\n");
        const retry = await getPlayerResponse(
          state,
          client,
          model,
          playerName,
          retryTask,
        );
        content = asString(retry.content, "（发言失败）").trim() || "（发言失败）";
        target = asString(retry.target, "").trim();
        speechIssue = validateSpeechOutput(
          playerName,
          content,
          target,
          aliveSorted,
          state.currentDay,
        );

        if (speechIssue) {
          const fallback = buildFallbackSpeech(playerName, aliveSorted, state.currentDay);
          content = fallback.content;
          appendTimeline(state, `⚠️ ${playerName} 二次发言仍违规（${speechIssue}），已使用保底发言`);
        } else {
          appendTimeline(state, `✅ ${playerName} 纠错重试成功`);
        }
      }

      speeches[playerName] = content;

      appendTimeline(state, `🗣️ ${playerName}: ${content}`);
      addEvent(state, "speech", playerName, content, "day");

      const observation = extractObservation(content);
      if (observation) {
        state.playerObservations[playerName] = observation;
      }
    } catch (error) {
      speeches[playerName] = "（发言失败）";
      appendTimeline(state, `❌ ${playerName} 发言失败：${String(error)}`);
    }
  }

  let daySummary = "（摘要生成失败，请基于现有信息判断）";
  try {
    const gmTask = [
      `请为第 ${state.currentDay} 天的发言生成投票摘要。`,
      "以下是今天所有存活玩家的发言：",
      JSON.stringify(speeches, null, 2),
      "请生成仅包含事实的摘要（<=6行），不要表达立场。",
    ].join("\n");
    const gmResponse = await getGmResponse(client, model, gmTask);
    daySummary = asString(gmResponse.summary, daySummary);
  } catch (error) {
    appendTimeline(state, `⚠️ GM 摘要生成失败：${String(error)}`);
  }

  appendTimeline(state, `📋 GM摘要：\n${daySummary}`);
  appendTimeline(state, "");

  const initialVotes: Record<string, string | null> = {};
  const recentDeath = [...state.publicEventLog]
    .reverse()
    .find((event) => event.type === "death" && event.phase === "night");

  appendTimeline(state, `${"─".repeat(70)}`);
  appendTimeline(state, "🗳️ 【第一轮：私下初投】");
  appendTimeline(state, `${"─".repeat(70)}`);

  for (const playerName of aliveSorted) {
    const taskParts = [
      `现在是第 ${state.currentDay} 天白天【第一轮：初投】。`,
      `你的身份：${state.roles[playerName]}`,
      `当前存活玩家：${aliveSorted.join(", ")}`,
      "",
      "GM公共公告摘要：",
      daySummary,
      "",
      `你今天的发言："${speeches[playerName] ?? "（无）"}"`,
      "",
      "投票约束：",
      "- 这是第一轮私下投票，结果不会立即公开",
      "- 你必须在 risk_if_wrong 字段填写投错的代价",
      "- 如果你无法写清 risk_if_wrong，请投给自己且 confidence=low",
      "- 不要盲目跟风，基于摘要和你自己的发言决策",
      "",
      "请投票给你认为最可能是狼人的玩家，或投给自己表示观望。",
    ];

    if (recentDeath) {
      taskParts.push(`最近一次死亡：${recentDeath.content}`);
    }
    if (state.playerObservations[playerName]) {
      taskParts.push(`记住你要观察的对象：${state.playerObservations[playerName]}`);
    }

    try {
      const response = await getPlayerResponse(
        state,
        client,
        model,
        playerName,
        taskParts.join("\n"),
      );

      let target = asString(response.target, playerName);
      let confidence = asString(response.confidence, "medium").toLowerCase();
      const riskIfWrong = asString(response.risk_if_wrong, "");

      if (!riskIfWrong.trim()) {
        target = playerName;
        confidence = "low";
      }

      if (!state.alivePlayers.includes(target)) {
        target = playerName;
      }

      if (confidence === "low" && Math.random() < 0.5) {
        target = playerName;
      }

      initialVotes[playerName] = target;
    } catch (error) {
      appendTimeline(state, `❌ ${playerName} 第一轮投票失败：${String(error)}，默认弃票`);
      initialVotes[playerName] = playerName;
    }
  }

  const voteDistribution = generateVoteDistribution(initialVotes);
  appendTimeline(state, voteDistribution);
  appendTimeline(state, "💡 第一轮投票已结束，现在进入第二轮终投。");
  appendTimeline(state, "");

  appendTimeline(state, `${"─".repeat(70)}`);
  appendTimeline(state, "🗳️ 【第二轮：私下终投】");
  appendTimeline(state, `${"─".repeat(70)}`);

  const finalVotes: Record<string, FinalVote> = {};

  for (const playerName of aliveSorted) {
    const taskParts = [
      `现在是第 ${state.currentDay} 天白天【第二轮：终投】。`,
      `你的身份：${state.roles[playerName]}`,
      `当前存活玩家：${aliveSorted.join(", ")}`,
      "",
      "GM公共公告摘要：",
      daySummary,
      "",
      voteDistribution,
      "",
      `你第一轮投给了：${initialVotes[playerName] ?? playerName}`,
      `你今天的发言："${speeches[playerName] ?? "（无）"}"`,
      "",
      "投票约束：",
      "- 你可以看到第一轮票型分布，据此调整决策",
      "- 改票时 changed_vote 必须为 true",
      "- 改票时 why_change 必须>=5字，否则改票无效",
      "- 不改票时 changed_vote=false，why_change 为空",
      "",
      "请进行你的终投。",
    ];

    if (recentDeath) {
      taskParts.push(`最近一次死亡：${recentDeath.content}`);
    }
    if (state.playerObservations[playerName]) {
      taskParts.push(`记住你要观察的对象：${state.playerObservations[playerName]}`);
    }

    try {
      const response = await getPlayerResponse(
        state,
        client,
        model,
        playerName,
        taskParts.join("\n"),
      );
      let target = asString(response.target, playerName);
      let changedVote = asBoolean(response.changed_vote, false);
      let whyChange = asString(response.why_change, "");

      if (!state.alivePlayers.includes(target)) {
        target = playerName;
      }

      const initialTarget = initialVotes[playerName] ?? playerName;
      const actualChanged = hasChangedVote(initialTarget, target);
      if (!actualChanged && changedVote) {
        changedVote = false;
        whyChange = "";
      }

      const validChange = isValidVoteChange(changedVote, whyChange);
      if (actualChanged && changedVote && !validChange) {
        finalVotes[playerName] = {
          target: initialTarget,
          changed_vote: false,
          why_change: null,
        };
        appendTimeline(state, `⚠️ ${playerName} 改票理由不足，改票无效，保留第一轮票数`);
      } else {
        finalVotes[playerName] = {
          target,
          changed_vote: actualChanged ? changedVote : false,
          why_change: whyChange.trim() ? whyChange.trim() : null,
        };
        const changedTag = finalVotes[playerName].changed_vote ? " (改票)" : "";
        appendTimeline(state, `🗳️ ${playerName} → ${target}${changedTag}`);
        if (finalVotes[playerName].changed_vote && finalVotes[playerName].why_change) {
          appendTimeline(state, `   理由：${finalVotes[playerName].why_change}`);
        }
      }
    } catch (error) {
      appendTimeline(state, `❌ ${playerName} 第二轮投票失败：${String(error)}，使用第一轮票数`);
      finalVotes[playerName] = {
        target: initialVotes[playerName] ?? playerName,
        changed_vote: false,
        why_change: null,
      };
    }
  }

  appendTimeline(state, `${"─".repeat(70)}`);
  appendTimeline(state, "📊 投票统计");
  appendTimeline(state, `${"─".repeat(70)}`);

  const changedCount = Object.values(finalVotes).filter((vote) => vote.changed_vote).length;
  appendTimeline(state, `📈 改票统计：${changedCount} 名玩家改变了投票`);

  const voteCounts: Record<string, number> = {};
  for (const vote of Object.values(finalVotes)) {
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

  if (state.currentDay === 1) {
    const topVotes = Math.max(...Object.values(voteCounts));
    const targetCount = Object.keys(voteCounts).length;
    if (topVotes <= 4 || targetCount >= 4) {
      appendTimeline(state, `✅ Day1 投票分散度：高（最高票：${topVotes}，目标数：${targetCount}）`);
    } else {
      appendTimeline(state, `⚠️ Day1 投票分散度：低（最高票：${topVotes}，目标数：${targetCount}）`);
    }
  }
}

export function createNewGameState(): GameState {
  const roles: Role[] = [
    ...Array.from({ length: WEREWOLF_COUNT }, () => "werewolf" as const),
    ...Array.from({ length: TOTAL_PLAYERS - WEREWOLF_COUNT }, () => "villager" as const),
  ];
  const shuffled = [...roles].sort(() => Math.random() - 0.5);

  const roleMap: Record<string, Role> = {};
  for (let i = 0; i < PLAYER_NAMES.length; i += 1) {
    roleMap[PLAYER_NAMES[i]] = shuffled[i];
  }

  const state: GameState = {
    id: crypto.randomUUID(),
    roles: roleMap,
    alivePlayers: [...PLAYER_NAMES],
    currentDay: 0,
    nextPhase: "night",
    votingStyles: { ...DEFAULT_VOTING_STYLES },
    playerObservations: {},
    publicEventLog: [],
    timeline: [],
    finished: false,
    winner: "none",
    lastUpdatedAt: nowISO(),
  };

  appendTimeline(state, `${"=".repeat(70)}`);
  appendTimeline(state, "🐺 AI 狼人杀 Worker 版 - 游戏初始化");
  appendTimeline(state, `${"=".repeat(70)}`);
  appendTimeline(state, "📋 身份分配：");
  for (const seat of sortSeats(PLAYER_NAMES)) {
    appendTimeline(state, `  ${seat}: ${formatRole(state.roles[seat])}`);
  }
  appendTimeline(state, `👥 存活玩家：${sortSeats(state.alivePlayers).join(", ")}`);
  return state;
}

export function coerceState(input: unknown): GameState {
  if (!input || typeof input !== "object") {
    throw new Error("state 无效：必须是对象");
  }
  const candidate = input as Partial<GameState>;
  if (!candidate.roles || !candidate.alivePlayers || !candidate.nextPhase) {
    throw new Error("state 缺少关键字段");
  }

  const roles: Record<string, Role> = {};
  for (const seat of PLAYER_NAMES) {
    const role = (candidate.roles as Record<string, Role>)[seat];
    roles[seat] = role === "werewolf" ? "werewolf" : "villager";
  }

  const alivePlayers = sortSeats(
    (candidate.alivePlayers ?? []).filter((player): player is string => typeof player === "string" && isSeat(player)),
  );

  return {
    id: candidate.id ?? crypto.randomUUID(),
    roles,
    alivePlayers,
    currentDay: typeof candidate.currentDay === "number" ? candidate.currentDay : 0,
    nextPhase: candidate.nextPhase === "day" ? "day" : "night",
    votingStyles: { ...DEFAULT_VOTING_STYLES, ...(candidate.votingStyles ?? {}) },
    playerObservations: { ...(candidate.playerObservations ?? {}) },
    publicEventLog: Array.isArray(candidate.publicEventLog) ? candidate.publicEventLog : [],
    timeline: Array.isArray(candidate.timeline) ? candidate.timeline : [],
    finished: Boolean(candidate.finished),
    winner:
      candidate.winner === "villagers" || candidate.winner === "werewolves" ? candidate.winner : "none",
    lastUpdatedAt: candidate.lastUpdatedAt ?? nowISO(),
  };
}

export async function runOneStep(stateInput: GameState, env: EnvVars): Promise<GameState> {
  const state = cloneState(stateInput);
  if (state.finished) return state;

  const { apiKey, model, baseURL } = requireModelEnv(env);
  const client = new OpenAI({
    apiKey,
    baseURL,
  });

  if (state.nextPhase === "night") {
    await runNightPhase(state, client, model);
    const winner = checkWinCondition(state);
    if (winner !== "none") {
      state.finished = true;
      state.winner = winner;
    } else {
      state.currentDay = state.currentDay === 0 ? 1 : state.currentDay + 1;
      state.nextPhase = "day";
    }
  } else {
    await runDayPhase(state, client, model);
    const winner = checkWinCondition(state);
    if (winner !== "none") {
      state.finished = true;
      state.winner = winner;
    } else {
      state.nextPhase = "night";
    }
  }

  if (state.finished) {
    appendTimeline(state, `${"=".repeat(70)}`);
    if (state.winner === "werewolves") {
      appendTimeline(state, "🐺 狼人获胜！");
    } else {
      appendTimeline(state, "👤 村民获胜！");
    }
    appendTimeline(state, `${"=".repeat(70)}`);
  }

  state.lastUpdatedAt = nowISO();
  return state;
}

export async function runToEnd(
  stateInput: GameState,
  env: EnvVars,
  maxSteps = 24,
): Promise<{ state: GameState; reachedStepLimit: boolean }> {
  let state = cloneState(stateInput);
  let reachedStepLimit = false;

  for (let i = 0; i < maxSteps; i += 1) {
    if (state.finished) break;
    state = await runOneStep(state, env);
  }

  if (!state.finished) {
    reachedStepLimit = true;
  }

  return { state, reachedStepLimit };
}
