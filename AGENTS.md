# Repository Guidelines

## Project Structure & Module Organization
- `src/index.ts`: Cloudflare Worker entrypoint; handles `/api/*` routes and forwards non-API requests to static assets.
- `src/game.ts`: core Werewolf game state machine, phase progression, and OpenAI/SiliconFlow integration.
- `public/`: browser UI (`index.html`, `app.js`, `styles.css`) served via Workers Assets.
- Root configs: `wrangler.jsonc` (Worker/assets/env), `tsconfig.json` (strict TypeScript), `.dev.vars.example` (local env template), `progress.md` (implementation notes).

## Build, Test, and Development Commands
- `npm install`: install dependencies.
- `cp .dev.vars.example .dev.vars`: create local environment file.
- `npm run dev`: start local Wrangler dev server for API + static assets.
- `npm run check`: run TypeScript checks (`tsc --noEmit`).
- `npm run deploy`: deploy to Cloudflare Workers.
- Optional preflight: `npx wrangler deploy --dry-run` to validate packaging/bindings without full deploy.

## Coding Style & Naming Conventions
- Language/runtime: TypeScript (ES modules) in `src/`, vanilla JS/CSS/HTML in `public/`.
- Follow existing style: 2-space indentation, semicolons, and descriptive helper names.
- Naming conventions:
  - `camelCase` for variables/functions
  - `PascalCase` for interfaces/types
  - `UPPER_SNAKE_CASE` for constants (for example `TOTAL_PLAYERS`)
- Keep transport/routing concerns in `src/index.ts`; keep gameplay rules and state transitions in `src/game.ts`.

## Testing Guidelines
- No dedicated automated test suite is present yet; `npm run check` is the minimum required validation.
- Run smoke tests locally before opening a PR:
  - `curl http://127.0.0.1:8787/api/health`
  - `curl -X POST http://127.0.0.1:8787/api/game/new -H 'content-type: application/json' -d '{}'`
- For new tests, prefer `src/__tests__/` with `*.test.ts` naming, focused on state transitions and API contracts.

## Commit & Pull Request Guidelines
- This workspace snapshot does not include `.git`, so project-specific commit patterns cannot be inferred from history here.
- Use Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`) with concise imperative summaries.
- PRs should include:
  - scope and rationale
  - verification steps run (`npm run check`, smoke tests)
  - screenshots for UI changes in `public/`
  - any env/config changes (`wrangler.jsonc`, secrets, new vars)

## Security & Configuration Tips
- Never commit secrets (`.dev.vars`, API keys).
- Store `SILICONFLOW_API_KEY` with `wrangler secret put`.
- Keep non-secret defaults (model/base URL) in `wrangler.jsonc` and document any changes in the PR.
