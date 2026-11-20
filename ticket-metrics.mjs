const facilities = new Set([
  "東京ディズニーランド",
  "東京ディズニーシー",
  "よみうりランド",
  "西武園ゆうえんち",
  "サンシャイン水族館",
  "横浜・八景島シーパラダイス",
  "鴨川シーワールド",
  "上野動物園",
  "東武動物公園",
  "よこはま動物園ズーラシア"
]);
const surfaces = new Set(['card', 'guide']);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/api/ticket-click') return env.ASSETS.fetch(request);
    const headers = { 'Cache-Control': 'no-store' };
    if (request.method !== 'POST') return new Response(null, { status: 405, headers: { ...headers, Allow: 'POST' } });

    const origin = request.headers.get('Origin');
    if ((origin && origin !== url.origin) || request.headers.get('Sec-Fetch-Site') === 'cross-site') {
      return new Response(null, { status: 403, headers });
    }
    if (!(request.headers.get('Content-Type') || '').startsWith('application/x-www-form-urlencoded')) {
      return new Response(null, { status: 415, headers });
    }
    // A ticket event only needs two short values. Bound body reads as well as logged data.
    const reader = request.body?.getReader();
    if (!reader) return new Response(null, { status: 400, headers });
    const decoder = new TextDecoder();
    let bytes = 0;
    let body = '';
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 1024) {
        await reader.cancel();
        return new Response(null, { status: 413, headers });
      }
      body += decoder.decode(value, { stream: true });
    }
    body += decoder.decode();
    const params = new URLSearchParams(body);
    const facility = params.get('facility');
    const surface = params.get('surface');
    if (!facilities.has(facility) || !surfaces.has(surface)) return new Response(null, { status: 400, headers });

    console.log({ event: 'ticket_click', facility, surface });
    return new Response(null, { status: 204, headers });
  },
};
