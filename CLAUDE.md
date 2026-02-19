# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Werewolf game (狼人杀) running on Cloudflare Workers with static assets. The game logic is ported from a Python reference implementation (`~/PyProjects/agentRPG`) and uses AI players powered by SiliconFlow's DeepSeek model via the OpenAI SDK.

## Development Commands

```bash
# Setup
npm install
cp .dev.vars.example .dev.vars  # Create local environment file

# Local development
npm run dev                      # Start Wrangler dev server (API + static assets)
npm run check                    # TypeScript type checking (tsc --noEmit)

# Deployment
npm run deploy                   # Deploy to Cloudflare Workers
npx wrangler login               # One-time authentication
npx wrangler secret put SILICONFLOW_API_KEY  # Set API key as secret
npx wrangler deploy --dry-run    # Validate packaging without deploying
```

## Architecture

### Worker + Static Assets Model
- **Worker entrypoint**: `src/index.ts` - Handles `/api/*` routes, forwards non-API requests to static assets
- **Game logic**: `src/game.ts` - State machine, phase progression, OpenAI/SiliconFlow integration
- **Static files**: `public/` directory (served via Workers Assets binding)

### Key Configuration Files
- `wrangler.jsonc`: Worker name, assets directory, compatibility flags, environment variables
- `.dev.vars.example`: Template for local development variables
- `tsconfig.json`: Strict TypeScript, ES2022 target, WebWorker types

### Environment Variables
| Variable | Type | Where |
|----------|------|-------|
| `SILICONFLOW_API_KEY` | Secret | `wrangler secret put` / `.dev.vars` (local) |
| `SILICONFLOW_MODEL` | Plain text | `wrangler.jsonc` `vars` / `.dev.vars` (local) |
| `SILICONFLOW_BASE_URL` | Plain text | `wrangler.jsonc` `vars` / `.dev.vars` (local) |

**Important**: Never commit `.dev.vars` or any API keys. Use `wrangler secret put` for production secrets.

### API Endpoints
- `GET /api/health` - Health check and configuration status
- `POST /api/game/new` - Initialize new 8-player game (2 werewolves, 6 villagers)
- `POST /api/game/step` - Advance game by one phase (Night or Day)
- `POST /api/game/run` - Batch advance (conservative server-side limit to avoid edge timeouts)

### Game State Machine
- **Phases**: Night (werewolves kill) → Day (speech → 2-round voting)
- **Players**: 8 seats (Seat1-Seat8) with assigned voting styles
- **Win conditions**: Werewolves=0 → villagers win; werewolves >= villagers → werewolves win
- **Voting styles**: conservative, pressure, contrarian, logic_driven (affects AI behavior)

### Code Organization Principles
- Keep transport/routing in `src/index.ts`; gameplay rules in `src/game.ts`
- State validation via `coerceState()` ensures data integrity on API boundaries
- Player speech validation prevents self-suspension (enforced via `validateSpeechOutput`)
- Fallback speech generation handles model output failures gracefully

## Code Style
- 2-space indentation, semicolons, descriptive function names
- `camelCase` for variables/functions, `PascalCase` for interfaces/types
- `UPPER_SNAKE_CASE` for constants (e.g., `TOTAL_PLAYERS`)
- TypeScript strict mode enabled

## Smoke Tests
Before deploying, verify:
```bash
curl http://127.0.0.1:8787/api/health
curl -X POST http://127.0.0.1:8787/api/game/new -H 'content-type: application/json' -d '{}'
```
