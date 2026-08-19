import { PLAYER_NAMES, extractPrimarySuspicionTarget, sortSeats } from "./gameUtils";
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
