import { next } from '@vercel/edge'

// Social media crawlers that need server-rendered OG tags.
const BOTS =
  /whatsapp|facebookexternalhit|twitterbot|linkedinbot|slackbot|telegrambot|discordbot|googlebot|bingbot|yandexbot/i

function escHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export default async function middleware(req: Request) {
  const host = req.headers.get('host') ?? ''
  const ua = req.headers.get('user-agent') ?? ''

  // Only intercept subdomain requests from known social crawlers.
  if (
    !host.endsWith('.shaadiinvites.in') ||
    host === 'www.shaadiinvites.in' ||
    !BOTS.test(ua)
  ) {
    return next()
  }

  const slug = host.slice(0, host.indexOf('.shaadiinvites.in'))
  const supabaseUrl = process.env.VITE_SUPABASE_URL ?? ''
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY ?? ''

  let groom = ''
  let bride = ''
  let date = ''

  try {
    const r = await fetch(`${supabaseUrl}/rest/v1/rpc/get_published_invitation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({ p_path: slug }),
    })
    if (r.ok) {
      const d = await r.json()
      const det = d?.details ?? {}
      groom = det.groom ?? ''
      bride = det.bride ?? ''
      const raw: string = det.date ?? ''
      if (raw) {
        date = new Date(`${raw}T12:00:00Z`).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          timeZone: 'UTC',
        })
      }
    }
  } catch {
    // Fall through to generic metadata.
  }

  const title =
    groom && bride
      ? `${groom} & ${bride} — Wedding Invitation`
      : 'Wedding Invitation'
  const desc =
    groom && bride && date
      ? `You're invited to the wedding of ${groom} and ${bride} on ${date}.`
      : groom && bride
        ? `You're invited to the wedding of ${groom} and ${bride}.`
        : 'You are invited. Open this wedding invitation.'
  const canonical = `https://${slug}.shaadiinvites.in`
  const ogImage = `https://shaadiinvites.in/api/og?slug=${encodeURIComponent(slug)}`

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escHtml(title)}</title>
<meta name="description" content="${escHtml(desc)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${escHtml(title)}">
<meta property="og:description" content="${escHtml(desc)}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escHtml(title)}">
<meta name="twitter:description" content="${escHtml(desc)}">
<meta name="twitter:image" content="${ogImage}">
</head>
<body style="margin:0;background:#fffaf2;font-family:serif;display:grid;place-items:center;min-height:100vh">
<p style="color:#75664c;padding:2rem;text-align:center">${escHtml(title)}</p>
</body>
</html>`

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

export const config = {
  // Run on all paths; exclude /api/* so og.tsx doesn't recurse.
  matcher: ['/((?!api/).*)', '/'],
}
