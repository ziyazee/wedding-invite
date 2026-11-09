import type { IncomingMessage, ServerResponse } from 'node:http'
import React from 'react'
import { ImageResponse } from '@vercel/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Bundle the artwork and fonts to avoid HTTP requests through bot protection.
async function previewAssets() {
  const [background, regular, italic] = await Promise.all([
    readFile(join(process.cwd(), 'public/og-background.png')),
    readFile(join(process.cwd(), 'public/templates/secret-garden/assets/cormorant-garamond-latin-400-normal-B7YtguxJ.woff')),
    readFile(join(process.cwd(), 'public/templates/secret-garden/assets/cormorant-garamond-latin-300-italic-DRnsRYID.woff')),
  ])
  return {
    background: `data:image/png;base64,${background.toString('base64')}`,
    regular: Uint8Array.from(regular).buffer,
    italic: Uint8Array.from(italic).buffer,
  }
}

async function renderPreview(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug') ?? ''
  const supabaseUrl = process.env.VITE_SUPABASE_URL ?? ''
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY ?? ''

  let groom = 'Groom'
  let bride = 'Bride'
  let brideFirst = false
  let companyName = ''
  let weddingDate = ''

  if (slug && supabaseUrl && supabaseKey) {
    try {
      const rpc = slug.startsWith('test-invite/') ? 'get_test_published_invitation' : 'get_published_invitation'
      const r = await fetch(`${supabaseUrl}/rest/v1/rpc/${rpc}`, {
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
        if (typeof det.groom === 'string' && det.groom.trim()) groom = det.groom.trim()
        if (typeof det.bride === 'string' && det.bride.trim()) bride = det.bride.trim()
        brideFirst = det.brideFirst === true
        companyName = typeof det.companyName === 'string' ? det.companyName.trim() : ''
        if (det.date) {
          const date = new Date(`${det.date}T12:00:00Z`)
          if (!Number.isNaN(date.getTime())) {
            weddingDate = new Intl.DateTimeFormat('en-GB', {
              day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC',
            }).format(date).replace(/\//g, ' • ')
          }
        }
      }
    } catch {
      // Keep a usable card if invitation data is temporarily unavailable.
    }
  }

  const assets = await previewAssets()
  const firstName = brideFirst ? bride : groom
  const secondName = brideFirst ? groom : bride
  // Both names shrink together when needed to fit the left panel.
  const nameSize = Math.max(24, Math.min(116, 760 / Math.max(firstName.length, secondName.length)))
  const nameStyle: React.CSSProperties = {
    display: 'flex', justifyContent: 'center', width: '100%',
    fontSize: nameSize, fontWeight: 400, lineHeight: 1.05,
    textAlign: 'center', wordBreak: 'break-word',
  }

  // Keep rendering in this entry file so Vercel need not resolve an emitted
  // sibling TSX module. createElement keeps the endpoint a plain .ts function.
  const el = React.createElement
  const card = el('div', { style: {
    display: 'flex', width: '1200px', height: '630px', position: 'relative',
    backgroundColor: '#063b39', color: '#fff3df', fontFamily: 'Invitation Serif',
  } },
    el('img', { src: assets.background, width: 1200, height: 630, style: {
      position: 'absolute', top: 0, left: 0, objectFit: 'cover',
    } }),
    el('div', { style: {
      position: 'absolute', top: 56, left: 44, width: 554,
      display: 'flex', justifyContent: 'center', fontSize: 23, letterSpacing: '7px',
    } }, 'THE WEDDING OF'),
    el('div', { style: {
      position: 'absolute', top: 104, left: 44, width: 554, height: 118,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    } }, el('span', { style: nameStyle }, firstName)),
    el('div', { style: {
      position: 'absolute', top: 224, left: 44, width: 554, height: 58,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 58, fontStyle: 'italic', fontWeight: 300,
    } }, 'weds'),
    el('div', { style: {
      position: 'absolute', top: 290, left: 44, width: 554, height: 118,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    } }, el('span', { style: nameStyle }, secondName)),
    weddingDate ? el('div', { style: {
      position: 'absolute', top: 428, left: 44, width: 554,
      display: 'flex', justifyContent: 'center', fontSize: 30, letterSpacing: '4px',
    } }, weddingDate) : null,
    companyName ? el('div', { style: {
      position: 'absolute', top: 477, left: 58, width: 526,
      display: 'flex', justifyContent: 'center', textAlign: 'center',
      fontSize: companyName.length > 35 ? 20 : 24,
      fontStyle: 'italic', fontWeight: 300, letterSpacing: '2px', wordBreak: 'break-word',
    } }, `Invitation by ${companyName}`) : null,
  )

  return new ImageResponse(
    card,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Invitation Serif', data: assets.regular, weight: 400, style: 'normal' },
        { name: 'Invitation Serif', data: assets.italic, weight: 300, style: 'italic' },
      ],
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=3600',
      },
    },
  )
}

export default async function og(request: IncomingMessage, response: ServerResponse) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.statusCode = 405
    response.setHeader('Allow', 'GET, HEAD')
    response.end()
    return
  }
  const url = new URL(request.url || '/api/og', `https://${request.headers.host || 'www.shaadiinvites.in'}`)
  const image = await renderPreview(new Request(url))
  const bytes = Buffer.from(await image.arrayBuffer())
  response.statusCode = image.status
  image.headers.forEach((value, name) => response.setHeader(name, value))
  response.setHeader('Content-Length', bytes.byteLength)
  response.end(request.method === 'HEAD' ? undefined : bytes)
}
