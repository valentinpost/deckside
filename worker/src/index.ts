interface Env {
  DECKS: KVNamespace;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

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

        // Optimistic concurrency: reject only if the cloud version is
        // ahead of or equal to what the client sent (another device wrote).
        // Accept when the client version is higher (local edits).
        if (existing && typeof existing.version === 'number' && typeof body.version === 'number' && existing.version >= body.version) {
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
