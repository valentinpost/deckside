interface Env {
  DECKS: KVNamespace;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

function cors(): Response {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS preflight
    if (request.method === 'OPTIONS') return cors();

    // GET /api/deck/:deckId — Read deck from KV
    const deckMatch = path.match(/^\/api\/deck\/([A-Za-z0-9_-]+)$/);
    if (deckMatch) {
      const deckId = deckMatch[1]!;

      if (request.method === 'GET') {
        const data = await env.DECKS.get(deckId, 'json');
        if (!data) return json({ error: 'Not found' }, 404);
        return json(data);
      }

      if (request.method === 'PUT') {
        const body = await request.json() as { version?: number; [key: string]: unknown };
        const existing = await env.DECKS.get(deckId, 'json') as { version?: number } | null;

        // Optimistic concurrency check
        if (existing && body.version !== existing.version) {
          return json(existing, 409);
        }

        await env.DECKS.put(deckId, JSON.stringify(body));
        return json({ ok: true });
      }
    }

    // GET /api/moxfield/:deckId — Proxy to Moxfield API
    const moxfieldMatch = path.match(/^\/api\/moxfield\/([A-Za-z0-9_-]+)$/);
    if (moxfieldMatch && request.method === 'GET') {
      const deckId = moxfieldMatch[1]!;
      const moxRes = await fetch(`https://api2.moxfield.com/v2/decks/all/${deckId}`, {
        headers: {
          'User-Agent': 'SideboardGuide/1.0',
          'Accept': 'application/json',
        },
      });

      if (!moxRes.ok) {
        return json({ error: 'Moxfield fetch failed' }, moxRes.status);
      }

      const data = await moxRes.json();
      return json(data);
    }

    return json({ error: 'Not found' }, 404);
  },
};
