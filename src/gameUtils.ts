export const TOTAL_PLAYERS = 8;
export const WEREWOLF_COUNT = 2;
export const PLAYER_NAMES = Array.from({ length: TOTAL_PLAYERS }, (_, i) => `Seat${i + 1}`);

export function seatNumber(seat: string): number {
  const match = seat.match(/\d+/);
  return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER;
}

export function sortSeats(seats: string[]): string[] {
  return [...seats].sort((a, b) => seatNumber(a) - seatNumber(b));
}

export function chooseRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function asBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  return fallback;
}

export function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function isSeat(value: string): boolean {
  return PLAYER_NAMES.includes(value);
}

export function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function dedupeSeatsInOrder(seats: string[]): string[] {
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

export function formatSeatList(seats: string[], emptyText: string): string {
  return seats.length ? sortSeats(seats).join(", ") : emptyText;
}

export function collectSeatsByKeywords(content: string, keywords: string[]): string[] {
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

export function extractPrimarySuspicionTarget(
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

export function extractSupportTargets(
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

export function extractOpposeTargets(
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

export function hasEvidenceSignals(content: string): boolean {
  const hints = ["因为", "理由", "依据", "证据", "逻辑", "矛盾", "前后", "时间线", "行为", "动机"];
  return hints.some((hint) => content.includes(hint));
}

export function hasRhythmSignals(content: string): boolean {
  const hints = ["带节奏", "跟风", "造势", "抱团", "拉票", "控票", "冲票", "节奏"];
  return hints.some((hint) => content.includes(hint));
}

export function extractObservation(content: string): string | null {
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

export function normalizeSummaryText(summary: string): string {
  const lines = summary
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-*•\d一二三四五六七八九十\.\):：\s]+/, "").trim())
    .filter(Boolean);

  return lines.slice(0, 6).join("\n");
}

export function normalizeSpeechText(text: string): string {
  return text.replace(/\s+/g, "");
}

export function normalizeEvidenceMatchText(text: string): string {
  return text.replace(/\s+/g, "");
}

export function extractEvidenceQuotes(evidenceItem: string): string[] {
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

export function normalizeEvidenceItems(items: string[]): string[] {
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

export function chooseFallbackSpeechTarget(playerName: string, alivePlayers: string[]): string {
  return alivePlayers.find((seat) => seat !== playerName) ?? playerName;
}
