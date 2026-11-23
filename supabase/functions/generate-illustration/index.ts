import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
}

const WATERCOLOR_PROMPT = `Use the uploaded photograph as the source image. Create and return exactly ONE finished image: a high-resolution PNG watercolor illustration with genuine transparency. Do not return the original photograph, a first draft, multiple options, or any text, caption, explanation, or other response.

Transform the photograph into a refined, richly detailed, semi-realistic traditional architectural watercolor for a premium wedding invitation. Preserve the venue's identity, exact architecture, perspective, proportions, asymmetry, composition and visible details. Keep the complete building uncropped, including its roof peaks, connected wings, columns, windows, entrance and attached venue elements. Preserve existing lettering as part of the architecture where visible; add no text and invent no architectural features.

Remove neighboring buildings, sky, distant scenery, people, vehicles, poles, wires, roads and unrelated vegetation. Retain only the venue and its naturally connected features, with a small amount of immediate painted foreground where needed to ground it.

Match this finish: carefully hand-painted watercolor with layered translucent washes, subtle pigment granulation, natural pigment variation, controlled wet-on-wet transitions, fine wet-on-dry architectural detail, restrained dry-brush texture and softly irregular painted edges. Keep stone joints, mouldings, capitals, window frames, relief and foliage detailed and legible. Use gentle dimensional shadows and selective cool highlights.

Use only a cool, muted sage-grey palette: pale sage ivory #E0E3D8, cool stone grey #CDD3C6, soft sage #B3BEAF, dusty sage #99A895, grey olive #7D8D7D and forest grey #586B5E. Keep the artwork luminous, naturally varied and low-to-medium contrast. Use cool ivory-grey highlights and layered grey-green shadows. Avoid yellow, beige, warm cream, gold, brown, orange, magenta, purple, vivid green, saturated blue and warm color grading.

TRANSPARENCY AND EDGE REQUIREMENTS:
The final image must have a real transparent alpha channel. Outside the painted venue and its small connected foreground, pixels must be transparent. Preserve transparent openings between columns and other architectural elements. Keep any watercolor fade narrow and directly against the painted silhouette, fading to full transparency.

Do not place the building on a background. Do not add paper texture outside the painted subject, canvas color, sky, scenery, background wash, gray haze, smoky halo, glow, vignette, shadow, rectangular field, border or frame. In particular, do not produce a dark or gray gradient around or behind the building. The area surrounding the watercolor must remain genuinely transparent, not merely appear transparent.

Before returning the result, ensure it is one complete isolated watercolor PNG with a clean transparent surround and no accompanying text.`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } })
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorised.' }), { status: 401, headers: CORS })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorised.' }), { status: 401, headers: CORS })
  }

  const openaiKey = Deno.env.get('OPENAI_KEY')
  if (!openaiKey) {
    return new Response(JSON.stringify({ error: 'OpenAI API key is not configured.' }), { status: 500, headers: CORS })
  }

  let body: { image?: string; mimeType?: string; name?: string }
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body.' }), { status: 400, headers: CORS })
  }

  if (!body || typeof body !== 'object') {
    return new Response(JSON.stringify({ error: 'Invalid request body.' }), { status: 400, headers: CORS })
  }

  const mimeType = body.mimeType ?? 'image/jpeg'
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(mimeType)) {
    return new Response(JSON.stringify({ error: 'Choose a JPG, PNG, or WebP photo.' }), { status: 400, headers: CORS })
  }

  if (typeof body.image !== 'string' || !body.image.length) {
    return new Response(JSON.stringify({ error: 'Missing venue photo.' }), { status: 400, headers: CORS })
  }

  const limitBytes = 5 * 1024 * 1024
  const padding = body.image.endsWith('==') ? 2 : body.image.endsWith('=') ? 1 : 0
  if (body.image.length / 4 * 3 - padding > limitBytes) {
    return new Response(JSON.stringify({ error: 'Choose a photo under 5 MB.' }), { status: 413, headers: CORS })
  }

  if (body.image.length % 4 !== 0 || !/^[A-Za-z0-9+/]+={0,2}$/.test(body.image)) {
    return new Response(JSON.stringify({ error: 'Invalid photo data.' }), { status: 400, headers: CORS })
  }

  try {
    const dataUrl = `data:${mimeType};base64,${body.image}`

    const res = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-image-2.6-sunburst',
        images: [{ image_url: dataUrl }],
        prompt: WATERCOLOR_PROMPT,
        size: '1024x1024',
        quality: 'high',
        output_format: 'png',
        background: 'transparent',
      }),
    })

    const result = await res.json()

    if (!res.ok) {
      const msg = result?.error?.message ?? 'Image generation failed.'
      return new Response(JSON.stringify({ error: msg }), { status: res.status, headers: CORS })
    }

    const b64 = result?.data?.[0]?.b64_json
    if (!b64) {
      return new Response(JSON.stringify({ error: 'No image returned from generation.' }), { status: 502, headers: CORS })
    }

    return new Response(JSON.stringify({ image: b64 }), { headers: CORS })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Failed to generate illustration.' }),
      { status: 500, headers: CORS },
    )
  }
})
