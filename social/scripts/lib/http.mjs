const GRAPH_VERSION = 'v23.0';

export function graphUrl(path) {
  return `https://graph.facebook.com/${GRAPH_VERSION}/${path}`;
}

// POST form-encoded a Graph API. Lanza Error si la API devuelve error.
// fetchImpl inyectable para tests; por defecto usa fetch global (Node 20+).
export async function httpPostForm(url, params, { fetchImpl = fetch } = {}) {
  const res = await fetchImpl(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params),
  });
  const json = await res.json();
  if (!res.ok || json.error) {
    throw new Error(`Graph API error: ${json.error?.message || `HTTP ${res.status}`}`);
  }
  return json;
}
