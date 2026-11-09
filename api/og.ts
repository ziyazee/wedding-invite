import type { IncomingMessage, ServerResponse } from 'node:http'
import React from 'react'
import sharp from 'sharp'
import { ImageResponse } from '@vercel/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Bundle the artwork and fonts to avoid HTTP requests through bot protection.
async function previewAssets() {
  const [background, regular, italic, dateFont] = await Promise.all([
    readFile(join(process.cwd(), 'public/og-background-optimized.jpg')),
    readFile(join(process.cwd(), 'public/templates/secret-garden/assets/cormorant-garamond-latin-400-normal-B7YtguxJ.woff')),
    readFile(join(process.cwd(), 'public/templates/secret-garden/assets/cormorant-garamond-latin-300-italic-DRnsRYID.woff')),
    readFile(join(process.cwd(), 'node_modules/@vercel/og/dist/noto-sans-v27-latin-regular.ttf')),
  ])
  return {
    background: `data:image/jpeg;base64,${background.toString('base64')}`,
    regular: Uint8Array.from(regular).buffer,
    italic: Uint8Array.from(italic).buffer,
    dateFont: Uint8Array.from(dateFont).buffer,
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
  let celebrationNames: string[] = []

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
        const celebrationEvents = Array.isArray(det.events)
          ? det.events.filter((event: { title?: unknown }) => typeof event?.title === 'string' && event.title.trim())
          : []
        celebrationEvents.sort((a: { title?: string; date?: string; time?: string }, b: { title?: string; date?: string; time?: string }) => {
          const dateOrder = (a.date || '9999-12-31').localeCompare(b.date || '9999-12-31')
          const timeOrder = (a.time || '23:59').localeCompare(b.time || '23:59')
          return dateOrder || timeOrder || (a.title || '').localeCompare(b.title || '', 'en', { sensitivity: 'base' })
        })
        celebrationNames = celebrationEvents.map((event: { title: string }) => event.title.trim())
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
  const celebrationText = celebrationNames.join(' · ')
  // Both names shrink together when needed to fit the left panel.
  const nameSize = Math.max(28, Math.min(124, 1150 / Math.max(firstName.length, secondName.length)))
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
      position: 'absolute', top: 38, left: 60, width: 780, height: 126,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    } }, el('span', { style: nameStyle }, firstName)),
    el('div', { style: {
      position: 'absolute', top: 158, left: 60, width: 780, height: 58,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 60, fontStyle: 'italic', fontWeight: 300,
    } }, 'weds'),
    el('div', { style: {
      position: 'absolute', top: 215, left: 60, width: 780, height: 126,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    } }, el('span', { style: nameStyle }, secondName)),
    weddingDate ? el('div', { style: {
      position: 'absolute', top: 362, left: 60, width: 780,
      display: 'flex', justifyContent: 'center', fontFamily: 'Preview Date',
      fontSize: 46, fontWeight: 400, letterSpacing: '2px',
    } }, weddingDate) : null,
    celebrationText ? el('div', { style: {
      position: 'absolute', top: 408, left: 60, width: 780, height: 130,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', fontSize: celebrationText.length > 110 ? 27 : celebrationText.length > 65 ? 34 : 42,
      lineHeight: 1.2, wordBreak: 'break-word', letterSpacing: '.3px',
    } }, celebrationText) : null,
    companyName ? el('div', { style: {
      position: 'absolute', top: celebrationText ? 530 : 500, left: 74, width: 752,
      display: 'flex', justifyContent: 'center', textAlign: 'center',
      fontSize: companyName.length > 35 ? 26 : 34,
      fontStyle: 'italic', fontWeight: 300, lineHeight: 1.15, letterSpacing: '1px', wordBreak: 'break-word',
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
        { name: 'Preview Date', data: assets.dateFont, weight: 400, style: 'normal' },
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
  const bytes = await sharp(Buffer.from(await image.arrayBuffer()))
    .jpeg({ quality: 85, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toBuffer()
  response.statusCode = image.status
  image.headers.forEach((value, name) => response.setHeader(name, value))
  response.setHeader('Content-Type', 'image/jpeg')
  response.setHeader('Content-Length', bytes.byteLength)
  response.end(request.method === 'HEAD' ? undefined : bytes)
}
