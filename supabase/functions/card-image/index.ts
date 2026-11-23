import satori from 'https://esm.sh/satori@0.10.11?bundle'
import { Resvg, initWasm } from 'https://esm.sh/@resvg/resvg-wasm@2.4.1'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

let ready = false
let fontData: ArrayBuffer | null = null

async function init() {
  if (ready) return
  console.log('[card-image] init start')

  const wasmResp = await fetch('https://esm.sh/@resvg/resvg-wasm@2.4.1/index_bg.wasm')
  console.log('[card-image] wasm status:', wasmResp.status)
  const wasmBuf = await wasmResp.arrayBuffer()

  const fontResp = await fetch('https://cdn.jsdelivr.net/npm/@fontsource/playfair-display@5.0.11/files/playfair-display-latin-400-normal.woff')
  console.log('[card-image] font status:', fontResp.status, 'size:', fontResp.headers.get('content-length'))
  const fontBuf = await fontResp.arrayBuffer()
  console.log('[card-image] font byteLength:', fontBuf.byteLength)

  await initWasm(wasmBuf)
  fontData = fontBuf
  ready = true
  console.log('[card-image] init complete')
}

function formatDate(raw: string): string {
  if (!raw) return ''
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata',
    }).format(new Date(raw)).toUpperCase()
  } catch { return raw }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS })

  const url = new URL(req.url)
  const groom   = url.searchParams.get('groom')   || 'Groom'
  const bride   = url.searchParams.get('bride')   || 'Bride'
  const date    = formatDate(url.searchParams.get('date') || '')
  const company = (url.searchParams.get('company') || 'Shaadi Invites').toUpperCase()

  try {
    await init()

    const groomSize = groom.length > 14 ? 44 : groom.length > 10 ? 52 : 62
    const brideSize = bride.length > 14 ? 44 : bride.length > 10 ? 52 : 62

    const svg = await satori(
      {
        type: 'div',
        props: {
          style: {
            width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            backgroundImage: 'linear-gradient(135deg, #faf5ef 0%, #ede4d4 100%)',
            fontFamily: 'Playfair Display',
            padding: '40px',
          },
          children: [
            // Outer border
            {
              type: 'div',
              props: {
                style: {
                  position: 'absolute', top: 18, left: 18, right: 18, bottom: 18,
                  border: '1px solid rgba(201,169,110,0.5)',
                },
              },
            },
            // Groom
            {
              type: 'div',
              props: {
                style: { fontSize: groomSize, color: '#2c1810', lineHeight: 1, marginBottom: 10 },
                children: groom,
              },
            },
            // Weds row
            {
              type: 'div',
              props: {
                style: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 },
                children: [
                  { type: 'div', props: { style: { width: 110, height: 1, background: '#c9a96e', opacity: 0.7 } } },
                  { type: 'div', props: { style: { fontSize: 15, color: '#9b7d52', letterSpacing: 5 }, children: 'weds' } },
                  { type: 'div', props: { style: { width: 110, height: 1, background: '#c9a96e', opacity: 0.7 } } },
                ],
              },
            },
            // Bride
            {
              type: 'div',
              props: {
                style: { fontSize: brideSize, color: '#2c1810', lineHeight: 1, marginBottom: 18 },
                children: bride,
              },
            },
            // Date
            ...(date ? [{
              type: 'div',
              props: {
                style: { fontSize: 14, color: '#6b5b45', letterSpacing: 4, marginBottom: 18 },
                children: date,
              },
            }] : []),
            // Bottom rule
            { type: 'div', props: { style: { width: 180, height: 1, background: '#c9a96e', opacity: 0.5, marginBottom: 12 } } },
            // Company
            {
              type: 'div',
              props: {
                style: { fontSize: 11, color: '#a0906c', letterSpacing: 2 },
                children: `INVITATION BY ${company}`,
              },
            },
          ],
        },
      },
      {
        width: 800,
        height: 418,
        fonts: [{ name: 'Playfair Display', data: fontData!, weight: 400, style: 'normal' }],
      },
    )

    const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 800 } })
    const png = resvg.render().asPng()

    return new Response(png, {
      headers: { ...CORS, 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' },
    })
  } catch (err) {
    console.error('[card-image] error:', err)
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: CORS })
  }
})
