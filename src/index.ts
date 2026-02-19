import {
  coerceState,
  createNewGameState,
  runOneStep,
  runToEnd,
  type EnvVars,
} from "./game";

interface Env extends EnvVars {
  ASSETS: Fetcher;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

async function readBody<T>(request: Request): Promise<T> {
  if (!request.body) return {} as T;
  try {
    return (await request.json()) as T;
  } catch {
    throw new Error("请求体必须是 JSON");
  }
}

async function handleApi(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);

  if (request.method === "GET" && url.pathname === "/api/health") {
    return json({
      ok: true,
      now: new Date().toISOString(),
      hasApiKey: Boolean(env.SILICONFLOW_API_KEY),
      model: env.SILICONFLOW_MODEL ?? null,
      baseUrl: env.SILICONFLOW_BASE_URL ?? null,
    });
  }

  if (request.method === "POST" && url.pathname === "/api/game/new") {
    return json({
      state: createNewGameState(),
    });
  }

  if (request.method === "POST" && url.pathname === "/api/game/step") {
    try {
      const body = await readBody<{ state: unknown }>(request);
      const state = coerceState(body.state);
      const updated = await runOneStep(state, env);
      return json({ state: updated });
    } catch (error) {
      return json({ error: String(error) }, 400);
    }
  }

  if (request.method === "POST" && url.pathname === "/api/game/run") {
    try {
      const body = await readBody<{ state?: unknown; maxSteps?: number }>(request);
      const state = body.state ? coerceState(body.state) : createNewGameState();
      // Keep server-side batch runs conservative to avoid very long edge requests.
      const maxSteps = Number.isFinite(body.maxSteps) ? Math.max(1, Math.min(8, Number(body.maxSteps))) : 4;
      const result = await runToEnd(state, env, maxSteps);
      return json(result);
    } catch (error) {
      return json({ error: String(error) }, 400);
    }
  }

  return json({ error: "Not Found" }, 404);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      return handleApi(request, env);
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    return env.ASSETS.fetch(request);
  },
};
