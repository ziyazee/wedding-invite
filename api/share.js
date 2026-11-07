import { invitationSharePreview } from '../src/invitations/sharePreviewCore.js'

const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
const headers = { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'private, no-store', 'Vary': 'User-Agent' }

// Vercel's Web Standard function contract. Only sharing crawlers are rewritten
// here; regular invitation requests use the existing static routes.
export default {
  async fetch(request) {
    if (!['GET', 'HEAD'].includes(request.method)) return new Response(null, { status: 405, headers: { Allow: 'GET, HEAD' } })
    const failure = (status, message) => new Response(request.method === 'HEAD' ? null : message, { status, headers: { ...headers, 'X-Robots-Tag': 'noindex' } })
    const url = new URL(request.url)
    const paths = url.searchParams.getAll('path')
    const path = paths.length === 1 ? paths[0] : ''
    const isTest = /^test-invite\/[a-z][a-z0-9.-]{0,119}$/.test(path)
    if (!isTest && !/^[a-z][a-z0-9.-]{0,79}(?:\/[1-9]\d{0,19})?$/.test(path)) return failure(404, 'Invitation not found.')
    const supabaseUrl = process.env.VITE_SUPABASE_URL
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY
    if (!supabaseUrl || !anonKey) {
      console.error('[share-preview] Missing Supabase URL or public key in this deployment environment.')
      return failure(503, 'Sharing preview is temporarily unavailable.')
    }
    try {
      const rpc = isTest ? 'get_test_published_invitation' : 'get_published_invitation'
      const lookup = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/rpc/${rpc}`, {
        method: 'POST',
        headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ p_path: path }),
        signal: AbortSignal.timeout(4000),
      })
      if (!lookup.ok) {
        console.error('[share-preview] Public invitation lookup failed with status', lookup.status)
        return failure(503, 'Sharing preview is temporarily unavailable.')
      }
      const published = await lookup.json()
      const details = published?.details
      // Company storefronts also use subdomains. Keep their generic site title
      // when the public invitation lookup finds no order for that hostname.
      if (published === null && url.searchParams.get('legacyHost') === '1') {
        return new Response(request.method === 'HEAD' ? null : '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Shaadi Invites — Wedding Invitations</title></head><body></body></html>', { headers })
      }
      if (!details || typeof details !== 'object' || typeof details.template !== 'number') return failure(404, 'Invitation not found.')
      const preview = invitationSharePreview(details)
      const origin = url.hostname === 'shaadiinvites.in' || url.hostname.endsWith('.shaadiinvites.in') ? 'https://www.shaadiinvites.in' : url.origin
      const canonical = new URL(`/${path}`, origin).href
      const image = new URL(preview.image, origin).href
      const title = escapeHtml(preview.title)
      const description = escapeHtml(preview.description)
      const html = `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title><meta name="description" content="${description}">
<link rel="canonical" href="${escapeHtml(canonical)}">
<meta property="og:type" content="website"><meta property="og:site_name" content="Shaadi Invites">
<meta property="og:title" content="${title}"><meta property="og:description" content="${description}">
<meta property="og:url" content="${escapeHtml(canonical)}"><meta property="og:image" content="${escapeHtml(image)}">
<meta property="og:image:alt" content="${escapeHtml(preview.imageAlt)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}"><meta name="twitter:image" content="${escapeHtml(image)}">
<meta name="twitter:image:alt" content="${escapeHtml(preview.imageAlt)}">
</head><body><p>${description}</p><a href="${escapeHtml(canonical)}">Open the invitation</a></body></html>`
      return new Response(request.method === 'HEAD' ? null : html, { headers })
    } catch (error) {
      console.error('[share-preview] Request failed:', error instanceof Error ? error.name : 'UnknownError')
      return failure(503, 'Sharing preview is temporarily unavailable.')
    }
  },
}
