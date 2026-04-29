import OpenAI from "openai";

type Role = "werewolf" | "villager";
type Winner = "werewolves" | "villagers" | "none";
type Phase = "day" | "night";
type VoteStyleKey = "conservative" | "pressure" | "contrarian" | "logic_driven";
type DayStage = "speeches" | "summary" | "first_vote" | "second_vote" | "resolve";

export interface EnvVars {
  SILICONFLOW_API_KEY?: string;
  SILICONFLOW_MODEL?: string;
  SILICONFLOW_GM_MODEL?: string;
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

interface DayProgress {
  day: number;
  aliveOrder: string[];
  stage: DayStage;
  seatCursor: number;
  speeches: Record<string, string>;
  daySummary: string;
  initialVotes: Record<string, string | null>;
  voteDistribution: string;
  consensusTargets: string[];
  finalVotes: Record<string, FinalVote>;
  started: boolean;
  firstVoteAnnounced: boolean;
  secondVoteAnnounced: boolean;
}

interface VoteDecision {
  target: string;
  confidence: "high" | "medium" | "low";
  riskIfWrong: string;
  altTarget: string;
  targetVsAltReason: string;
  evidence: string[];
}

interface VoteValidationOptions {
  alivePlayers: string[];
  evidenceSourceText: string;
  requireRiskIfWrong: boolean;
  consensusTargets?: string[];
}

export interface GameState {
  id: string;
  roles: Record<string, Role>;
  alivePlayers: string[];
  currentDay: number;
  nextPhase: Phase;
  dayProgress: DayProgress | null;
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

const HERD_EVIDENCE_HINTS = ["大家", "多数", "最高票", "票型", "都在投", "跟票", "跟风", "随大流"];

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
  "alt_target": "备选目标（必须是不同于 target 的存活玩家）",
  "target_vs_alt_reason": "为什么 target 比 alt_target 更可疑（>=8字）",
  "evidence": ["证据1（含《可核查引用》）", "证据2（含《可核查引用》）"],
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

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeConfidence(value: string): "high" | "medium" | "low" {
  const lowered = value.toLowerCase();
  if (lowered === "high" || lowered === "low") {
    return lowered;
  }
  return "medium";
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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function dedupeSeatsInOrder(seats: string[]): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const seat of seats) {
    if (isSeat(seat) && !seen.has(seat)) {
      seen.add(seat);
      ordered.push(seat);
    }
  }
  return ordered;
}

function formatSeatList(seats: string[], emptyText: string): string {
  return seats.length ? sortSeats(seats).join(", ") : emptyText;
}

function collectSeatsByKeywords(content: string, keywords: string[]): string[] {
  if (!keywords.length) return [];

  const escaped = keywords.map(escapeRegex);
  const headPattern = new RegExp(`(?:${escaped.join("|")})[^\\n。；，]{0,18}?(Seat[1-8])`, "g");
  const tailPattern = new RegExp(`(Seat[1-8])[^\\n。；，]{0,10}?(?:${escaped.join("|")})`, "g");

  const hits: string[] = [];
  for (const match of content.matchAll(headPattern)) {
    if (match[1]) hits.push(match[1]);
  }
  for (const match of content.matchAll(tailPattern)) {
    if (match[1]) hits.push(match[1]);
  }
  return dedupeSeatsInOrder(hits);
}

function extractPrimarySuspicionTarget(
  playerName: string,
  content: string,
  alivePlayers: string[],
): string | null {
  const targets = collectSeatsByKeywords(content, [
    "怀疑",
    "可疑",
    "像狼",
    "是狼",
    "狼面",
    "嫌疑",
    "优先投",
    "先投",
    "投给",
    "投票给",
    "票给",
    "点名",
    "警惕",
  ]);

  return targets.find((seat) => seat !== playerName && alivePlayers.includes(seat)) ?? null;
}

function extractSupportTargets(
  playerName: string,
  content: string,
  alivePlayers: string[],
): string[] {
  const targets = collectSeatsByKeywords(content, ["支持", "认同", "同意", "信任", "站边", "保"]);
  return targets.filter((seat) => {
    if (seat === playerName || !alivePlayers.includes(seat)) {
      return false;
    }
    const negativePattern = new RegExp(`不(?:太)?(?:支持|认同|同意|信任|站边|保)[^\\n。；，]{0,8}?${escapeRegex(seat)}`);
    return !negativePattern.test(content);
  });
}

function extractOpposeTargets(
  playerName: string,
  content: string,
  alivePlayers: string[],
  primarySuspicion: string | null,
): string[] {
  const explicit = collectSeatsByKeywords(content, [
    "反对",
    "质疑",
    "不信",
    "不认同",
    "可疑",
    "怀疑",
    "嫌疑",
    "狼面",
    "踩",
  ]);
  const merged = primarySuspicion ? [primarySuspicion, ...explicit] : explicit;
  return dedupeSeatsInOrder(merged).filter((seat) => seat !== playerName && alivePlayers.includes(seat));
}

function hasEvidenceSignals(content: string): boolean {
  const hints = ["因为", "理由", "依据", "证据", "逻辑", "矛盾", "前后", "时间线", "行为", "动机"];
  return hints.some((hint) => content.includes(hint));
}

function hasRhythmSignals(content: string): boolean {
  const hints = ["带节奏", "跟风", "造势", "抱团", "拉票", "控票", "冲票", "节奏"];
  return hints.some((hint) => content.includes(hint));
}

function normalizeSummaryText(summary: string): string {
  const lines = summary
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-*•\d一二三四五六七八九十\.\):：\s]+/, "").trim())
    .filter(Boolean);

  return lines.slice(0, 6).join("\n");
}

function buildFallbackDaySummary(
  day: number,
  speeches: Record<string, string>,
  alivePlayers: string[],
): string {
  const aliveSorted = sortSeats(alivePlayers);
  const suspicionPairs: string[] = [];
  const supportPairs: string[] = [];
  const opposePairs: string[] = [];
  const evidencePlayers: string[] = [];
  const rhythmPlayers: string[] = [];
  const unclearPlayers: string[] = [];

  for (const playerName of aliveSorted) {
    const speech = asString(speeches[playerName], "").trim();
    if (!speech || speech === "（发言失败）") {
      unclearPlayers.push(playerName);
      continue;
    }

    const primarySuspicion = extractPrimarySuspicionTarget(playerName, speech, aliveSorted);
    if (primarySuspicion) {
      suspicionPairs.push(`${playerName}->${primarySuspicion}`);
    } else {
      unclearPlayers.push(playerName);
    }

    const supportTargets = extractSupportTargets(playerName, speech, aliveSorted);
    if (supportTargets.length) {
      supportPairs.push(`${playerName}:${supportTargets.join("/")}`);
    }

    const opposeTargets = extractOpposeTargets(playerName, speech, aliveSorted, primarySuspicion);
    if (opposeTargets.length) {
      opposePairs.push(`${playerName}:${opposeTargets.join("/")}`);
    }

    if (hasEvidenceSignals(speech)) {
      evidencePlayers.push(playerName);
    }
    if (hasRhythmSignals(speech)) {
      rhythmPlayers.push(playerName);
    }
  }

  const lines = [
    `【规则保底摘要 Day ${day}】存活玩家 ${aliveSorted.length} 人。`,
    `点名怀疑：${suspicionPairs.length ? suspicionPairs.join("；") : "无人明确点名"}`,
    `明确支持：${supportPairs.length ? supportPairs.join("；") : "无人明确支持对象"}`,
    `明确反对：${opposePairs.length ? opposePairs.join("；") : "无人明确反对对象"}`,
    `提出理由/证据：${formatSeatList(dedupeSeatsInOrder(evidencePlayers), "无人明确给出")}`,
    `质疑带节奏/跟风：${formatSeatList(dedupeSeatsInOrder(rhythmPlayers), "无人提及")}；观望或目标不明：${formatSeatList(dedupeSeatsInOrder(unclearPlayers), "无")}`,
  ];

  return lines.slice(0, 6).join("\n");
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

function countVotes(votes: Record<string, string | null>): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const target of Object.values(votes)) {
    if (!target) continue;
    counts[target] = (counts[target] ?? 0) + 1;
  }
  return counts;
}

function getTopVoteTargets(voteCounts: Record<string, number>): string[] {
  if (!Object.keys(voteCounts).length) return [];
  const maxVotes = Math.max(...Object.values(voteCounts));
  return Object.entries(voteCounts)
    .filter(([, count]) => count === maxVotes)
    .map(([player]) => player)
    .sort((a, b) => seatNumber(a) - seatNumber(b));
}

function chooseFallbackAltTarget(target: string, alivePlayers: string[]): string {
  return alivePlayers.find((seat) => seat !== target) ?? target;
}

function normalizeEvidenceItems(items: string[]): string[] {
  const cleaned = items
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => item.replace(/\s+/g, " "));
  const unique: string[] = [];
  for (const item of cleaned) {
    if (!unique.includes(item)) {
      unique.push(item);
    }
  }
  return unique.slice(0, 4);
}

function normalizeEvidenceMatchText(text: string): string {
  return text.replace(/\s+/g, "");
}

function extractEvidenceQuotes(evidenceItem: string): string[] {
  const matches: string[] = [];
  const patterns = [
    /《([^》]{2,80})》/g,
    /“([^”]{2,80})”/g,
    /"([^"]{2,80})"/g,
    /「([^」]{2,80})」/g,
  ];
  for (const pattern of patterns) {
    for (const match of evidenceItem.matchAll(pattern)) {
      if (match[1]) {
        matches.push(match[1].trim());
      }
    }
  }
  return matches;
}

function buildVoteEvidenceFacts(
  state: GameState,
  speeches: Record<string, string>,
  recentDeath?: PublicEvent,
  voteDistribution?: string,
): { factsText: string; sourceText: string } {
  const facts: string[] = [];
  const recentPublicFacts = state.publicEventLog
    .filter((event) => ["speech", "death", "announcement", "vote_distribution"].includes(event.type))
    .slice(-24);

  for (const event of recentPublicFacts) {
    facts.push(`Day${event.day}-${event.phase} ${event.speaker}: ${event.content}`);
  }

  if (recentDeath) {
    facts.push(`最近死亡事件：${recentDeath.content}`);
  }

  for (const playerName of sortSeats(Object.keys(speeches))) {
    facts.push(`${playerName} 当日发言：${speeches[playerName] ?? "（无）"}`);
  }

  if (voteDistribution) {
    for (const line of voteDistribution.split("\n").map((line) => line.trim()).filter(Boolean)) {
      facts.push(`第一轮票型：${line}`);
    }
  }

  const dedupedFacts = facts.filter((fact, idx) => facts.indexOf(fact) === idx);
  const numberedFacts = dedupedFacts.map((fact, idx) => `${idx + 1}. ${fact}`);
  return {
    factsText: numberedFacts.join("\n"),
    sourceText: dedupedFacts.join("\n"),
  };
}

function parseVoteDecision(response: Record<string, unknown>, defaultTarget: string): VoteDecision {
  return {
    target: asString(response.target, defaultTarget).trim(),
    confidence: normalizeConfidence(asString(response.confidence, "medium")),
    riskIfWrong: asString(response.risk_if_wrong, "").trim(),
    altTarget: asString(response.alt_target, "").trim(),
    targetVsAltReason: asString(response.target_vs_alt_reason, "").trim(),
    evidence: normalizeEvidenceItems(asStringArray(response.evidence)),
  };
}

function hasIndependentEvidenceForConsensusTarget(evidence: string[], target: string): boolean {
  return evidence.some((item) => item.includes(target) && !HERD_EVIDENCE_HINTS.some((hint) => item.includes(hint)));
}

function validateEvidenceArray(
  evidence: string[],
  evidenceSourceText: string,
  minItems: number,
): string | null {
  if (evidence.length < minItems) {
    return `evidence 至少提供 ${minItems} 条`;
  }

  const sourceNormalized = normalizeEvidenceMatchText(evidenceSourceText);
  for (const evidenceItem of evidence) {
    const quotes = extractEvidenceQuotes(evidenceItem);
    if (!quotes.length) {
      return "每条 evidence 必须包含《引用片段》或等价引号";
    }
    const matched = quotes.some((quote) => {
      const normalizedQuote = normalizeEvidenceMatchText(quote);
      return normalizedQuote.length >= 2 && sourceNormalized.includes(normalizedQuote);
    });
    if (!matched) {
      return `证据引用未在公共事实中命中：${evidenceItem}`;
    }
  }

  return null;
}

function validateVoteDecision(
  playerName: string,
  decision: VoteDecision,
  options: VoteValidationOptions,
): string | null {
  if (!options.alivePlayers.includes(decision.target)) {
    return "target 不是存活玩家";
  }

  if (!decision.altTarget || !options.alivePlayers.includes(decision.altTarget)) {
    return "alt_target 不是存活玩家";
  }

  if (decision.altTarget === decision.target) {
    return "alt_target 必须与 target 不同";
  }

  if (decision.altTarget === playerName) {
    return "alt_target 不能是你自己";
  }

  if (decision.targetVsAltReason.length < 8) {
    return "target_vs_alt_reason 必须 >= 8 字";
  }

  if (options.requireRiskIfWrong && decision.riskIfWrong.length < 6) {
    return "risk_if_wrong 必须 >= 6 字";
  }

  const evidenceIssue = validateEvidenceArray(decision.evidence, options.evidenceSourceText, 2);
  if (evidenceIssue) {
    return evidenceIssue;
  }

  if (options.consensusTargets?.includes(decision.target)) {
    if (!hasIndependentEvidenceForConsensusTarget(decision.evidence, decision.target)) {
      return `命中最高票目标 ${decision.target} 时，必须给出至少一条指向该目标的独立证据`;
    }
  }

  return null;
}

function buildFallbackInitialVote(playerName: string, alivePlayers: string[]): VoteDecision {
  const altTarget = chooseFallbackAltTarget(playerName, alivePlayers);
  return {
    target: playerName,
    confidence: "low",
    riskIfWrong: "证据不足时强行站队可能误杀村民并暴露推理漏洞。",
    altTarget,
    targetVsAltReason:
      altTarget === playerName
        ? "当前没有可比较对象，先保守观望。"
        : `当前证据不足以证明 ${playerName} 比 ${altTarget} 更可疑，我先保守观望。`,
    evidence: ["证据不足，保守处理。", "避免在信息不充分时跟票。"],
  };
}

const DAY_STAGES: DayStage[] = ["speeches", "summary", "first_vote", "second_vote", "resolve"];

function createDayProgress(state: GameState): DayProgress {
  return {
    day: state.currentDay,
    aliveOrder: sortSeats(state.alivePlayers),
    stage: "speeches",
    seatCursor: 0,
    speeches: {},
    daySummary: "",
    initialVotes: {},
    voteDistribution: "",
    consensusTargets: [],
    finalVotes: {},
    started: false,
    firstVoteAnnounced: false,
    secondVoteAnnounced: false,
  };
}

function ensureDayProgress(state: GameState): DayProgress {
  const candidate = state.dayProgress;
  const aliveSnapshot = sortSeats(state.alivePlayers);

  const invalid =
    !candidate ||
    candidate.day !== state.currentDay ||
    !Array.isArray(candidate.aliveOrder) ||
    candidate.aliveOrder.join(",") !== aliveSnapshot.join(",") ||
    !DAY_STAGES.includes(candidate.stage) ||
    typeof candidate.seatCursor !== "number";

  if (invalid) {
    state.dayProgress = createDayProgress(state);
    return state.dayProgress;
  }

  candidate.seatCursor = Math.max(0, Math.min(candidate.seatCursor, candidate.aliveOrder.length));
  if (!candidate.speeches || typeof candidate.speeches !== "object") candidate.speeches = {};
  if (!candidate.initialVotes || typeof candidate.initialVotes !== "object") candidate.initialVotes = {};
  if (!candidate.finalVotes || typeof candidate.finalVotes !== "object") candidate.finalVotes = {};
  if (!Array.isArray(candidate.consensusTargets)) candidate.consensusTargets = [];
  if (typeof candidate.daySummary !== "string") candidate.daySummary = "";
  if (typeof candidate.voteDistribution !== "string") candidate.voteDistribution = "";
  candidate.started = Boolean(candidate.started);
  candidate.firstVoteAnnounced = Boolean(candidate.firstVoteAnnounced);
  candidate.secondVoteAnnounced = Boolean(candidate.secondVoteAnnounced);
  return candidate;
}

function getRecentNightDeath(state: GameState): PublicEvent | undefined {
  return [...state.publicEventLog]
    .reverse()
    .find((event) => event.type === "death" && event.phase === "night");
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

interface ModelCallOptions {
  temperature?: number;
  timeoutMs?: number;
  maxRetries?: number;
}

async function callJSONModel(
  client: OpenAI,
  model: string,
  systemMessage: string,
  task: string,
  options: ModelCallOptions = {},
): Promise<Record<string, unknown>> {
  const base = {
    model,
    messages: [
      { role: "system" as const, content: systemMessage },
      { role: "user" as const, content: task },
    ],
    temperature: options.temperature ?? 0.7,
  };
  const requestOptions = {
    ...(options.timeoutMs !== undefined ? { timeout: options.timeoutMs } : {}),
    ...(options.maxRetries !== undefined ? { maxRetries: options.maxRetries } : {}),
  };

  let content = "";
  try {
    const response = await client.chat.completions.create(
      {
        ...base,
        response_format: { type: "json_object" },
        stream: false,
        enable_thinking: false,
      } as OpenAI.ChatCompletionCreateParamsNonStreaming,
      requestOptions,
    );
    content = asString(response.choices[0]?.message?.content, "");
  } catch {
    const response = await client.chat.completions.create(
      { ...base, stream: false, enable_thinking: false } as OpenAI.ChatCompletionCreateParamsNonStreaming,
      requestOptions,
    );
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
  options: ModelCallOptions = {},
): Promise<Record<string, unknown>> {
  return callJSONModel(client, model, GAME_MASTER_SYSTEM_PROMPT, task, options);
}

async function generateDaySummary(
  state: GameState,
  client: OpenAI,
  gmModel: string,
  speeches: Record<string, string>,
): Promise<string> {
  const fallbackSummary = buildFallbackDaySummary(state.currentDay, speeches, state.alivePlayers);
  const gmTask = [
    `请为第 ${state.currentDay} 天的发言生成投票摘要。`,
    "以下是今天所有存活玩家的发言：",
    JSON.stringify(speeches, null, 2),
    "你必须只输出 JSON：{\"summary\":\"...\"}。",
    "summary 必须仅包含事实，不表达立场，且最多 6 行。",
    "每行尽量覆盖：点名怀疑对象、支持/反对对象、是否给出理由、是否质疑带节奏。",
  ].join("\n");

  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const gmResponse = await getGmResponse(client, gmModel, gmTask, {
        temperature: 0.2,
        timeoutMs: 15000,
        maxRetries: 1,
      });
      const normalized = normalizeSummaryText(asString(gmResponse.summary, ""));
      if (!normalized) {
        throw new Error("summary 字段为空或无有效内容");
      }
      return normalized;
    } catch (error) {
      appendTimeline(state, `⚠️ GM 摘要第 ${attempt} 次尝试失败（模型：${gmModel}）：${String(error)}`);
      if (attempt < maxAttempts) {
        const delayMs = 300 * 2 ** (attempt - 1);
        appendTimeline(state, `⏳ GM 摘要将在 ${delayMs}ms 后重试`);
        await sleep(delayMs);
      }
    }
  }

  appendTimeline(state, "🛟 GM 摘要已降级为本地规则摘要");
  return fallbackSummary;
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

async function runDayPhaseStep(
  state: GameState,
  client: OpenAI,
  model: string,
  gmModel: string,
): Promise<boolean> {
  const progress = ensureDayProgress(state);
  const aliveSorted = progress.aliveOrder;
  const recentDeath = getRecentNightDeath(state);

  if (!progress.started) {
    appendTimeline(state, `\n${"=".repeat(70)}`);
    appendTimeline(state, `☀️ 第 ${state.currentDay} 天 - 白天`);
    appendTimeline(state, `${"=".repeat(70)}\n`);
    progress.started = true;
  }

  if (progress.stage === "speeches") {
    const playerName = aliveSorted[progress.seatCursor];
    if (!playerName) {
      progress.stage = "summary";
      progress.seatCursor = 0;
      return false;
    }

    const speechEvidenceContext = buildVoteEvidenceFacts(state, progress.speeches, recentDeath);
    const taskParts: string[] = [
      `现在是第 ${state.currentDay} 天白天。`,
      `你当前座位：${playerName}（你就是“我”）`,
      `你的身份：${state.roles[playerName]}`,
      `当前存活玩家：${aliveSorted.join(", ")}`,
      "",
    ];

    if (Object.keys(progress.speeches).length) {
      taskParts.push("之前的发言记录：");
      taskParts.push(JSON.stringify(progress.speeches, null, 2));
      taskParts.push("");
    }

    if (state.currentDay > 1 && state.playerObservations[playerName]) {
      taskParts.push(`你观察的重点是：${state.playerObservations[playerName]}`);
      taskParts.push("");
    }

    taskParts.push("可核查公共事实（evidence 必须引用其中原文片段）：");
    taskParts.push(speechEvidenceContext.factsText);
    taskParts.push("");

    if (state.currentDay === 1) {
      taskParts.push("请进行你的发言（<=120字）。你可以点名怀疑对象并给理由，或说明暂时观望。");
      taskParts.push(`如果你点名怀疑对象，target 不能是你自己（${playerName}）。`);
    } else {
      taskParts.push("请进行你的发言（<=120字），必须包含怀疑对象和理由。");
      taskParts.push(`必须在 target 字段填写你怀疑的存活玩家，且 target 不能是你自己（${playerName}）。`);
    }
    taskParts.push("禁止出现“我怀疑自己 / 我觉得自己像狼 / 我投自己因为我是狼”这类自我指控。");
    taskParts.push("你必须填写 evidence 数组，至少1条；每条都要包含《引用片段》且可在公共事实中找到。");

    if (state.roles[playerName] === "werewolf") {
      taskParts.push("小提示：过于完美的推理可能引起注意，偶尔保持模糊更安全。");
    }

    try {
      const baseTask = taskParts.join("\n");
      const response = await getPlayerResponse(state, client, model, playerName, baseTask);
      let content = asString(response.content, "（发言失败）").trim() || "（发言失败）";
      let target = asString(response.target, "").trim();
      let evidence = normalizeEvidenceItems(asStringArray(response.evidence));
      let speechIssue = validateSpeechOutput(
        playerName,
        content,
        target,
        aliveSorted,
        state.currentDay,
      );
      const speechEvidenceIssue = validateEvidenceArray(evidence, speechEvidenceContext.sourceText, 1);
      if (!speechIssue && speechEvidenceIssue) {
        speechIssue = speechEvidenceIssue;
      }

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
          "- 你必须给出至少1条可核查 evidence，并在 evidence 中包含《引用片段》",
          `- 你上一版 target：${target || "（空）"}`,
          `- 你上一版发言：${content}`,
          `- 你上一版 evidence：${JSON.stringify(evidence, null, 2)}`,
          "请重新输出 JSON。",
        ].join("\n");
        const retry = await getPlayerResponse(state, client, model, playerName, retryTask);
        content = asString(retry.content, "（发言失败）").trim() || "（发言失败）";
        target = asString(retry.target, "").trim();
        evidence = normalizeEvidenceItems(asStringArray(retry.evidence));
        speechIssue = validateSpeechOutput(
          playerName,
          content,
          target,
          aliveSorted,
          state.currentDay,
        );
        const retrySpeechEvidenceIssue = validateEvidenceArray(evidence, speechEvidenceContext.sourceText, 1);
        if (!speechIssue && retrySpeechEvidenceIssue) {
          speechIssue = retrySpeechEvidenceIssue;
        }

        if (speechIssue) {
          const fallback = buildFallbackSpeech(playerName, aliveSorted, state.currentDay);
          content = fallback.content;
          appendTimeline(state, `⚠️ ${playerName} 二次发言仍违规（${speechIssue}），已使用保底发言`);
        } else {
          appendTimeline(state, `✅ ${playerName} 纠错重试成功`);
        }
      }

      progress.speeches[playerName] = content;
      appendTimeline(state, `🗣️ ${playerName}: ${content}`);
      addEvent(state, "speech", playerName, content, "day");

      const observation = extractObservation(content);
      if (observation) {
        state.playerObservations[playerName] = observation;
      }
    } catch (error) {
      progress.speeches[playerName] = "（发言失败）";
      appendTimeline(state, `❌ ${playerName} 发言失败：${String(error)}`);
    }

    progress.seatCursor += 1;
    if (progress.seatCursor >= aliveSorted.length) {
      progress.stage = "summary";
      progress.seatCursor = 0;
    } else {
      appendTimeline(state, `⏱️ 白天发言进度：${progress.seatCursor}/${aliveSorted.length}`);
    }
    return false;
  }

  if (progress.stage === "summary") {
    progress.daySummary = await generateDaySummary(state, client, gmModel, progress.speeches);
    appendTimeline(state, `📋 GM摘要：\n${progress.daySummary}`);
    appendTimeline(state, "");
    progress.stage = "first_vote";
    progress.seatCursor = 0;
    return false;
  }

  if (progress.stage === "first_vote") {
    if (!progress.firstVoteAnnounced) {
      appendTimeline(state, `${"─".repeat(70)}`);
      appendTimeline(state, "🗳️ 【第一轮：私下初投】");
      appendTimeline(state, `${"─".repeat(70)}`);
      progress.firstVoteAnnounced = true;
    }

    const playerName = aliveSorted[progress.seatCursor];
    if (!playerName) {
      progress.stage = "second_vote";
      progress.seatCursor = 0;
      return false;
    }

    const firstRoundEvidence = buildVoteEvidenceFacts(state, progress.speeches, recentDeath);
    const taskParts = [
      `现在是第 ${state.currentDay} 天白天【第一轮：初投】。`,
      `你的身份：${state.roles[playerName]}`,
      `当前存活玩家：${aliveSorted.join(", ")}`,
      "",
      "GM公共公告摘要：",
      progress.daySummary,
      "",
      "可核查公共事实（evidence 必须引用其中原文片段）：",
      firstRoundEvidence.factsText,
      "",
      `你今天的发言："${progress.speeches[playerName] ?? "（无）"}"`,
      "",
      "投票约束：",
      "- 这是第一轮私下投票，结果不会立即公开",
      "- 你必须在 risk_if_wrong 字段填写投错代价（>=6字）",
      "- 你必须填写 evidence 数组，至少2条；每条都要包含《引用片段》且可在公共事实中找到",
      "- 你必须填写 alt_target，且 alt_target 必须是不同于 target 的存活玩家",
      "- 你必须填写 target_vs_alt_reason（>=8字），说明为何 target 比 alt_target 更可疑",
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
      const baseTask = taskParts.join("\n");
      const response = await getPlayerResponse(state, client, model, playerName, baseTask);
      let decision = parseVoteDecision(response, playerName);
      let voteIssue = validateVoteDecision(playerName, decision, {
        alivePlayers: aliveSorted,
        evidenceSourceText: firstRoundEvidence.sourceText,
        requireRiskIfWrong: true,
      });

      if (voteIssue) {
        appendTimeline(state, `⚠️ ${playerName} 第一轮投票触发约束（${voteIssue}），请求纠错重试`);
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
        const retry = await getPlayerResponse(state, client, model, playerName, retryTask);
        decision = parseVoteDecision(retry, playerName);
        voteIssue = validateVoteDecision(playerName, decision, {
          alivePlayers: aliveSorted,
          evidenceSourceText: firstRoundEvidence.sourceText,
          requireRiskIfWrong: true,
        });
      }

      if (voteIssue) {
        decision = buildFallbackInitialVote(playerName, aliveSorted);
        appendTimeline(state, `⚠️ ${playerName} 第一轮二次输出仍违规（${voteIssue}），已降级为保守弃票`);
      }

      progress.initialVotes[playerName] = aliveSorted.includes(decision.target) ? decision.target : playerName;
    } catch (error) {
      appendTimeline(state, `❌ ${playerName} 第一轮投票失败：${String(error)}，默认弃票`);
      progress.initialVotes[playerName] = playerName;
    }

    progress.seatCursor += 1;
    if (progress.seatCursor >= aliveSorted.length) {
      progress.voteDistribution = generateVoteDistribution(progress.initialVotes);
      addEvent(state, "vote_distribution", "GameMaster", progress.voteDistribution, "day", {
        round: 1,
        votes: progress.initialVotes,
      });
      appendTimeline(state, progress.voteDistribution);
      const firstRoundVoteCounts = countVotes(progress.initialVotes);
      progress.consensusTargets = getTopVoteTargets(firstRoundVoteCounts);
      if (progress.consensusTargets.length) {
        appendTimeline(
          state,
          `🧷 反共识税目标：${progress.consensusTargets.join(", ")}（若继续投这些目标，需额外独立证据）`,
        );
      }
      appendTimeline(state, "💡 第一轮投票已结束，现在进入第二轮终投。");
      appendTimeline(state, "");
      progress.stage = "second_vote";
      progress.seatCursor = 0;
    } else {
      appendTimeline(state, `⏱️ 第一轮投票进度：${progress.seatCursor}/${aliveSorted.length}`);
    }
    return false;
  }

  if (progress.stage === "second_vote") {
    if (!progress.secondVoteAnnounced) {
      appendTimeline(state, `${"─".repeat(70)}`);
      appendTimeline(state, "🗳️ 【第二轮：私下终投】");
      appendTimeline(state, `${"─".repeat(70)}`);
      progress.secondVoteAnnounced = true;
    }

    const playerName = aliveSorted[progress.seatCursor];
    if (!playerName) {
      progress.stage = "resolve";
      progress.seatCursor = 0;
      return false;
    }

    const secondRoundEvidence = buildVoteEvidenceFacts(
      state,
      progress.speeches,
      recentDeath,
      progress.voteDistribution,
    );
    const taskParts = [
      `现在是第 ${state.currentDay} 天白天【第二轮：终投】。`,
      `你的身份：${state.roles[playerName]}`,
      `当前存活玩家：${aliveSorted.join(", ")}`,
      "",
      "GM公共公告摘要：",
      progress.daySummary,
      "",
      progress.voteDistribution,
      "",
      "可核查公共事实（evidence 必须引用其中原文片段）：",
      secondRoundEvidence.factsText,
      "",
      `当前最高票目标：${progress.consensusTargets.join(", ") || "（无）"}`,
      `你第一轮投给了：${progress.initialVotes[playerName] ?? playerName}`,
      `你今天的发言："${progress.speeches[playerName] ?? "（无）"}"`,
      "",
      "投票约束：",
      "- 你可以看到第一轮票型分布，据此调整决策",
      "- 你必须填写 evidence 数组，至少2条；每条都要包含《引用片段》且可在公共事实中找到",
      "- 你必须填写 alt_target，且 alt_target 必须是不同于 target 的存活玩家",
      "- 你必须填写 target_vs_alt_reason（>=8字），说明为何 target 比 alt_target 更可疑",
      "- 若 target 命中当前最高票目标，必须额外给出至少一条指向该目标的独立证据（不能只说“大家都投”）",
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
      const initialTarget = progress.initialVotes[playerName] ?? playerName;
      const baseTask = taskParts.join("\n");
      const response = await getPlayerResponse(state, client, model, playerName, baseTask);
      let decision = parseVoteDecision(response, initialTarget);
      let changedVote = asBoolean(response.changed_vote, false);
      let whyChange = asString(response.why_change, "").trim();
      let voteIssue = validateVoteDecision(playerName, decision, {
        alivePlayers: aliveSorted,
        evidenceSourceText: secondRoundEvidence.sourceText,
        requireRiskIfWrong: false,
        consensusTargets: progress.consensusTargets,
      });

      if (voteIssue) {
        appendTimeline(state, `⚠️ ${playerName} 第二轮投票触发约束（${voteIssue}），请求纠错重试`);
        const retryTask = [
          baseTask,
          "",
          "纠错要求：",
          `- 你上一版 target：${decision.target || "（空）"}`,
          `- 你上一版 alt_target：${decision.altTarget || "（空）"}`,
          `- 你上一版 target_vs_alt_reason：${decision.targetVsAltReason || "（空）"}`,
          `- 你上一版 evidence：${JSON.stringify(decision.evidence, null, 2)}`,
          "- 命中最高票目标时，必须补充独立证据，不能只写“多数人在投”。",
          "- 请重新输出 JSON，并满足上述全部硬约束。",
        ].join("\n");
        const retry = await getPlayerResponse(state, client, model, playerName, retryTask);
        decision = parseVoteDecision(retry, initialTarget);
        changedVote = asBoolean(retry.changed_vote, false);
        whyChange = asString(retry.why_change, "").trim();
        voteIssue = validateVoteDecision(playerName, decision, {
          alivePlayers: aliveSorted,
          evidenceSourceText: secondRoundEvidence.sourceText,
          requireRiskIfWrong: false,
          consensusTargets: progress.consensusTargets,
        });
      }

      if (voteIssue) {
        progress.finalVotes[playerName] = {
          target: initialTarget,
          changed_vote: false,
          why_change: null,
        };
        appendTimeline(state, `⚠️ ${playerName} 第二轮二次输出仍违规（${voteIssue}），已保留第一轮票数`);
      } else {
        const target = decision.target;
        const actualChanged = hasChangedVote(initialTarget, target);
        if (!actualChanged && changedVote) {
          changedVote = false;
          whyChange = "";
        }

        const validChange = isValidVoteChange(changedVote, whyChange);
        if (actualChanged && !changedVote) {
          progress.finalVotes[playerName] = {
            target: initialTarget,
            changed_vote: false,
            why_change: null,
          };
          appendTimeline(state, `⚠️ ${playerName} 实际改票但未声明 changed_vote=true，改票无效，保留第一轮票数`);
        } else if (actualChanged && changedVote && !validChange) {
          progress.finalVotes[playerName] = {
            target: initialTarget,
            changed_vote: false,
            why_change: null,
          };
          appendTimeline(state, `⚠️ ${playerName} 改票理由不足，改票无效，保留第一轮票数`);
        } else {
          progress.finalVotes[playerName] = {
            target,
            changed_vote: actualChanged ? changedVote : false,
            why_change: whyChange.trim() ? whyChange.trim() : null,
          };
          const changedTag = progress.finalVotes[playerName].changed_vote ? " (改票)" : "";
          appendTimeline(state, `🗳️ ${playerName} → ${target}${changedTag}`);
          if (progress.finalVotes[playerName].changed_vote && progress.finalVotes[playerName].why_change) {
            appendTimeline(state, `   理由：${progress.finalVotes[playerName].why_change}`);
          }
        }
      }
    } catch (error) {
      appendTimeline(state, `❌ ${playerName} 第二轮投票失败：${String(error)}，使用第一轮票数`);
      progress.finalVotes[playerName] = {
        target: progress.initialVotes[playerName] ?? playerName,
        changed_vote: false,
        why_change: null,
      };
    }

    progress.seatCursor += 1;
    if (progress.seatCursor >= aliveSorted.length) {
      progress.stage = "resolve";
      progress.seatCursor = 0;
    } else {
      appendTimeline(state, `⏱️ 第二轮投票进度：${progress.seatCursor}/${aliveSorted.length}`);
    }
    return false;
  }

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
  return true;
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
    dayProgress: null,
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
    dayProgress:
      candidate.dayProgress && typeof candidate.dayProgress === "object"
        ? (candidate.dayProgress as DayProgress)
        : null,
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
  const gmModel = asString(env.SILICONFLOW_GM_MODEL, "").trim() || model;
  const client = new OpenAI({
    apiKey,
    baseURL,
  });

  if (state.nextPhase === "night") {
    state.dayProgress = null;
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
    const dayCompleted = await runDayPhaseStep(state, client, model, gmModel);
    if (dayCompleted) {
      const winner = checkWinCondition(state);
      if (winner !== "none") {
        state.finished = true;
        state.winner = winner;
      } else {
        state.nextPhase = "night";
      }
    } else {
      state.nextPhase = "day";
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
  maxSteps = 96,
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
