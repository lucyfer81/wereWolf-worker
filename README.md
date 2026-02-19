# Werewolf Worker (OpenAI SDK JS + SiliconFlow)

目标：在 Cloudflare **Worker + Static Assets** 架构下，复刻 `~/PyProjects/agentRPG` 的狼人杀核心逻辑，并提供 Web UI。

## 已实现

- Worker API (`/api/*`)
  - `POST /api/game/new`：初始化 8 人 2 狼对局
  - `POST /api/game/step`：推进一个阶段（Night 或 Day）
  - `POST /api/game/run`：批量推进（服务端保守上限，防超长请求）
- 逻辑复刻重点
  - Night0 开局
  - Day 双轮投票（初投 + 终投）
  - 改票校验（`changed_vote` + `why_change >= 5`）
  - 票型分布统计
  - 观察信号提取
  - 夜晚击杀冲突按座位号最小优先
  - 胜负判定（狼=0 村民胜；狼>=民 狼胜）
- Web UI (`public/`)
  - 新建对局、单步推进、自动跑局、日志与事件展示
  - “自动跑局”采用前端循环调用 `/api/game/step`，可看到逐步进度
- OpenAI SDK JS 直连 SiliconFlow
  - `baseURL=https://api.siliconflow.cn/v1`
  - 模型默认 `deepseek-ai/DeepSeek-V3.2`

## 本地开发

```bash
npm install
cp .dev.vars.example .dev.vars
npm run dev
```

## 部署到 Cloudflare Worker

1. 登录 Wrangler（一次性）

```bash
npx wrangler login
```

2. 先部署一次（创建 Worker）

```bash
npm run deploy
```

3. 写入敏感变量（Secret，仅 API Key）

```bash
npx wrangler secret put SILICONFLOW_API_KEY
```

4. 普通环境变量（明文）放在 `wrangler.jsonc` 的 `vars`：
- `SILICONFLOW_MODEL=deepseek-ai/DeepSeek-V3.2`
- `SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1`

5. 再部署一次使配置生效

```bash
npm run deploy
```

## 配置说明

- `wrangler.jsonc` 中已配置：
  - `assets.directory = "./public"`
  - `assets.run_worker_first = ["/api/*"]`
- `vars.SILICONFLOW_MODEL`（明文）
- `vars.SILICONFLOW_BASE_URL`（明文）
- `SILICONFLOW_API_KEY` 通过 `wrangler secret put` 设置
