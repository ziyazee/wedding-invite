import React from 'react'
import { ImageResponse } from '@vercel/og'

interface Theme {
  background: string
  nameColor: string
  accentColor: string
  labelColor: string
  bgImage: string
}

// Visual identity per active template ID (1–5).
const THEMES: Record<number, Theme> = {
  1: {
    // Royal Grace — warm ivory
    background: 'linear-gradient(145deg, #f5f0e8 0%, #e4ddd0 100%)',
    nameColor: '#2d2416',
    accentColor: '#8b9274',
    labelColor: '#9a8c74',
    bgImage: '/templates/royal-grace/opening-poster.webp',
  },
  2: {
    // Majestic — deep champagne
    background: 'linear-gradient(145deg, #30200c 0%, #1a1008 100%)',
    nameColor: '#f2e8d4',
    accentColor: '#d4a843',
    labelColor: '#c0a060',
    bgImage: '/templates/majestic/assets/hero-poster-DkA1j00-.jpg',
  },
  3: {
    // A Timeless Union — deep navy
    background: 'linear-gradient(145deg, #1a2744 0%, #0e1938 100%)',
    nameColor: '#d4a843',
    accentColor: '#d4a843',
    labelColor: '#b89440',
    bgImage: '/landing/timeless-union-opening.jpg',
  },
  4: {
    // Mandap at Dusk — deep terracotta
    background: 'linear-gradient(145deg, #2d1810 0%, #4a2818 100%)',
    nameColor: '#f0d8b0',
    accentColor: '#e8985a',
    labelColor: '#c87840',
    bgImage: '/templates/mandap-at-dusk/preview.jpg',
  },
  5: {
    // Secret Garden — deep sage
    background: 'linear-gradient(145deg, #2d4a3e 0%, #1e3328 100%)',
    nameColor: '#f0ece0',
    accentColor: '#c8b87a',
    labelColor: '#a09860',
    bgImage: '/templates/secret-garden/assets/opened.jpg',
  },
}

const FALLBACK_THEME: Theme = {
  background: 'linear-gradient(145deg, #1c1610 0%, #2d2418 100%)',
  nameColor: '#f2e8d4',
  accentColor: '#d4a843',
  labelColor: '#b89440',
  bgImage: '',
}

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug') ?? ''

  const supabaseUrl = process.env.VITE_SUPABASE_URL ?? ''
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY ?? ''

  let groom = 'Groom'
  let bride = 'Bride'
  let weddingDate = ''
  let templateId = 1

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
        if (det.groom) groom = det.groom
        if (det.bride) bride = det.bride
        if (det.date) {
          weddingDate = new Date(`${det.date}T12:00:00Z`).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            timeZone: 'UTC',
          })
        }
        if (det.template) templateId = Number(det.template)
      }
    } catch {
      // Use defaults.
    }
  }

  const theme = THEMES[templateId] ?? FALLBACK_THEME
  const base = new URL(req.url).origin

  // Fetch the template background image. Wrapped so a missing asset won't break the response.
  let bgDataUrl: string | null = null
  if (theme.bgImage) {
    try {
      const imgRes = await fetch(`${base}${theme.bgImage}`, { signal: AbortSignal.timeout(3000) })
      const mime = imgRes.headers.get('content-type')?.split(';')[0].trim() ?? ''
      // A missing asset can return the SPA HTML with status 200. Never pass
      // that HTML (or a firewall challenge) to the image renderer.
      if (imgRes.ok && /^image\/(?:png|jpeg|webp)$/.test(mime)) {
        const bytes = new Uint8Array(await imgRes.arrayBuffer())
        let binary = ''
        for (let offset = 0; offset < bytes.length; offset += 8192) {
          binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192))
        }
        bgDataUrl = `data:${mime};base64,${btoa(binary)}`
      }
    } catch {
      // Continue without bg image.
    }
  }

  const el = (
    <div
      style={{
        display: 'flex',
        width: '1200px',
        height: '630px',
        position: 'relative',
        overflow: 'hidden',
        // Use the renderer's bundled font so a blocked font request cannot
        // break the preview. Satori does not support the old WOFF2 asset.
        fontFamily: 'sans-serif',
      }}
    >
      {/* Gradient background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: theme.background,
          display: 'flex',
        }}
      />

      {/* Template screenshot (blurred, darkened) */}
      {bgDataUrl && (
        <img
          src={bgDataUrl}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.22,
          }}
        />
      )}

      {/* Content */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '56px 80px 80px',
        }}
      >
        {/* "WEDDING INVITATION" label */}
        <div
          style={{
            color: theme.labelColor,
            fontSize: '14px',
            letterSpacing: '7px',
            textTransform: 'uppercase',
            marginBottom: '48px',
          }}
        >
          Wedding Invitation
        </div>

        {/* Names + ampersand */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span
            style={{
              fontSize: '80px',
              color: theme.nameColor,
              fontWeight: 700,
              lineHeight: 1.05,
              textAlign: 'center',
            }}
          >
            {groom}
          </span>
          <span
            style={{
              fontSize: '28px',
              color: theme.accentColor,
              letterSpacing: '10px',
              margin: '10px 0',
            }}
          >
            &amp;
          </span>
          <span
            style={{
              fontSize: '80px',
              color: theme.nameColor,
              fontWeight: 700,
              lineHeight: 1.05,
              textAlign: 'center',
            }}
          >
            {bride}
          </span>
        </div>

        {/* Wedding date */}
        {weddingDate && (
          <div
            style={{
              color: theme.accentColor,
              fontSize: '24px',
              marginTop: '36px',
              letterSpacing: '2px',
            }}
          >
            {weddingDate}
          </div>
        )}

        {/* Branding */}
        <div
          style={{
            position: 'absolute',
            bottom: '28px',
            color: theme.labelColor,
            fontSize: '12px',
            letterSpacing: '5px',
            textTransform: 'uppercase',
            opacity: 0.65,
          }}
        >
          shaadiinvites.in
        </div>
      </div>
    </div>
  )

  return new ImageResponse(el, {
    width: 1200,
    height: 630,
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=3600',
    },
  })
}
