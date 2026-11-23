// Byte ranges for the game clips. Workers static assets answer a Range request with the whole file
// (200), and Safari will not play a video without a 206. wrangler.jsonc runs this first only for
// /assets/video/*; any other request that reaches it (an address with no file) goes to the assets,
// which serve the 404 page.
export default {
  async fetch(request, env) {
    const res = await env.ASSETS.fetch(request);
    if (!new URL(request.url).pathname.startsWith('/assets/video/') || res.status !== 200) return res;
    const headers = new Headers(res.headers);
    headers.set('Accept-Ranges', 'bytes');
    const m = request.method === 'GET' && /^bytes=(\d*)-(\d*)$/.exec(request.headers.get('Range') || '');
    if (!m || (!m[1] && !m[2])) return new Response(res.body, { status: 200, headers });
    const body = await res.arrayBuffer();
    const size = body.byteLength;
    const start = m[1] ? Number(m[1]) : Math.max(0, size - Number(m[2]));
    const end = m[1] && m[2] ? Math.min(Number(m[2]), size - 1) : size - 1;
    if (start >= size || start > end) {
      headers.set('Content-Range', `bytes */${size}`);
      headers.delete('Content-Length');
      return new Response(null, { status: 416, headers });
    }
    headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
    headers.set('Content-Length', String(end - start + 1));
    return new Response(body.slice(start, end + 1), { status: 206, headers });
  },
};
