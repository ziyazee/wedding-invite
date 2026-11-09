type InvitationDetails = {
  template?: number
  groom?: string
  bride?: string
  brideFirst?: boolean
  date?: string
  venue?: string
  message?: string
  companyName?: string
  events?: Array<{ title?: string }>
}

type PublishedInvitation = { details?: InvitationDetails }

function invitationPath(requestUrl: URL): string | null {
  const host = requestUrl.hostname.toLowerCase()
  const suffix = '.shaadiinvites.in'
  if (host.endsWith(suffix) && host !== `www${suffix}`) {
    return requestUrl.pathname === '/' ? host.slice(0, -suffix.length) : null
  }

  const querySlug = requestUrl.searchParams.get('invite')
  if (querySlug) return querySlug

  if (requestUrl.pathname.startsWith('/invite/')) {
    return requestUrl.pathname.slice('/invite/'.length)
  }
  if (requestUrl.pathname.startsWith('/test-invite/')) {
    return requestUrl.pathname.slice(1)
  }

  // Published URLs use either /orderId/randomSlug or a single public slug.
  // Ignore asset and app routes before treating a root segment as an invite.
  const path = requestUrl.pathname.replace(/^\/+|\/+$/g, '')
  if (!path || /\.(?:html?|js|css|json|xml|txt|png|jpe?g|webp|avif|svg|gif|mp4|mov|webm|mp3|woff2?|ttf|otf)$/i.test(path)) return null
  if (/^(?:client|admin|login|account|dashboard|create|newDesign|testing567|edits|privacy|api|assets|templates|images)(?:\/|$)/i.test(path)) return null
  if (/^test-invite\/[a-z0-9-]+$/i.test(path)) return path
  if (/^\d+\/[A-Za-z0-9_-]+$/.test(path) || /^[A-Za-z0-9_-]+$/.test(path)) return path
  return null
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]!)
}

function formattedDate(value?: string): string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return ''
  const date = new Date(`${value}T12:00:00Z`)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(date)
}

export default async function proxy(request: Request): Promise<Response | undefined> {
  const userAgent = request.headers.get('user-agent') || ''
  if (!/WhatsApp|facebookexternalhit|Facebot/i.test(userAgent)) return undefined

  const url = new URL(request.url)
  const path = invitationPath(url)
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY
  if (!path || !supabaseUrl || !anonKey) return undefined

  try {
    const rpc = path.startsWith('test-invite/') ? 'get_test_published_invitation' : 'get_published_invitation'
    const lookup = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/rpc/${rpc}`, {
      method: 'POST',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ p_path: path }),
    })
    if (!lookup.ok) return undefined

    const published = await lookup.json() as PublishedInvitation | null
    const details = published?.details
    if (!details) return undefined

    const groom = details.groom?.trim() || 'Your names'
    const bride = details.bride?.trim()
    const couple = bride ? (details.brideFirst === true ? `${bride} & ${groom}` : `${groom} & ${bride}`) : groom
    const date = formattedDate(details.date)
    const venue = details.venue?.trim()
    const invitationMessage = details.message?.trim()
    const celebrationNames = Array.isArray(details.events)
      ? details.events.map(event => event.title?.trim()).filter((name): name is string => !!name)
      : []
    const description = celebrationNames.length
      ? `Celebrations: ${celebrationNames.join(' · ')}`
      : invitationMessage || `Join ${couple} for their wedding${date ? ` on ${date}` : ''}${venue ? ` at ${venue}` : ''}.`
  const image = new URL(`/api/og?slug=${encodeURIComponent(path)}&v=12`, url.origin).href
    const title = `${couple} are getting married!`
    const canonical = url.href

    return new Response(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="canonical" href="${escapeHtml(canonical)}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${escapeHtml(details.companyName?.trim() || 'Shaadi Invites')}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${escapeHtml(canonical)}">
    <meta property="og:image" content="${escapeHtml(image)}">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="Wedding invitation for ${escapeHtml(couple)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${escapeHtml(image)}">
  </head>
  <body><p>${escapeHtml(description)}</p><a href="${escapeHtml(canonical)}">Open the invitation</a></body>
</html>`, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=300',
        'Content-Type': 'text/html; charset=utf-8',
        'Vary': 'User-Agent',
      },
    })
  } catch {
    return undefined
  }
}
