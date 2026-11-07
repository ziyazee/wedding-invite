import { next } from '@vercel/edge'
import { reservedSlugs } from './src/invitations/model.ts'
import type { InvitationData } from './src/invitations/model.ts'
import { invitationSharePreview } from './src/invitations/sharePreview.ts'

type PublishedInvitation = { slug?: string; details?: Partial<InvitationData> }

function validInvitationPath(path: string): string | null {
  const normalized = path.replace(/^\/+|\/+$/g, '')
  if (/^test-invite\/[a-z][a-z0-9.-]{0,119}$/.test(normalized)) return normalized
  if (!/^[a-z][a-z0-9.-]{0,79}(?:\/[1-9]\d{0,19})?$/.test(normalized)) return null
  const first = normalized.split('/')[0]
  if (reservedSlugs.has(first) || ['account', 'edits', 'testing', 'manage', 'test-manage', 'test-invite', 'templates'].includes(first)) return null
  return normalized
}

function invitationPath(requestUrl: URL): string | null {
  const host = requestUrl.hostname.toLowerCase()
  const suffix = '.shaadiinvites.in'
  if (host.endsWith(suffix) && host !== `www${suffix}`) {
    return requestUrl.pathname === '/' ? validInvitationPath(host.slice(0, -suffix.length)) : null
  }

  const querySlug = requestUrl.searchParams.get('invite')
  if (querySlug) return validInvitationPath(querySlug)

  if (requestUrl.pathname.startsWith('/invite/')) {
    return validInvitationPath(requestUrl.pathname.slice('/invite/'.length))
  }
  return validInvitationPath(requestUrl.pathname)
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

export default async function proxy(request: Request): Promise<Response> {
  if (request.method !== 'GET' && request.method !== 'HEAD') return next()
  const userAgent = request.headers.get('user-agent') || ''
  if (!/WhatsApp|facebookexternalhit|Facebot|Twitterbot|LinkedInBot|TelegramBot|Slackbot|Discordbot/i.test(userAgent)) return next()

  const url = new URL(request.url)
  const path = invitationPath(url)
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY
  if (!path || !supabaseUrl || !anonKey) return next()

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
      signal: AbortSignal.timeout(4000),
    })
    if (!lookup.ok) return next()

    const published = await lookup.json() as PublishedInvitation | null
    const details = published?.details
    if (!details || typeof details !== 'object' || typeof details.template !== 'number') return next()

    const preview = invitationSharePreview(details)
    const { title, description, imageAlt } = preview
    const origin = url.hostname === 'shaadiinvites.in' || url.hostname.endsWith('.shaadiinvites.in') ? 'https://www.shaadiinvites.in' : url.origin
    const image = new URL(preview.image, origin).href
    const canonical = new URL(`/${validInvitationPath(published?.slug || '') || path}`, origin).href

    return new Response(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="canonical" href="${escapeHtml(canonical)}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Shaadi Invites">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${escapeHtml(canonical)}">
    <meta property="og:image" content="${escapeHtml(image)}">
    <meta property="og:image:alt" content="${escapeHtml(imageAlt)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${escapeHtml(image)}">
    <meta name="twitter:image:alt" content="${escapeHtml(imageAlt)}">
  </head>
  <body><p>${escapeHtml(description)}</p><a href="${escapeHtml(canonical)}">Open the invitation</a></body>
</html>`, {
      headers: {
        'Cache-Control': 'private, no-store',
        'Content-Type': 'text/html; charset=utf-8',
        'Vary': 'User-Agent',
      },
    })
  } catch {
    return next()
  }
}
