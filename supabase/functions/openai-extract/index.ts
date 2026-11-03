import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
}

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

  const anthropicKey = Deno.env.get('ANTHROPIC_KEY')
  if (!anthropicKey) {
    return new Response(
      JSON.stringify({ error: 'Anthropic API key is not configured.' }),
      { status: 500, headers: CORS },
    )
  }

  let body: { pdf?: string; image?: string; mimeType?: string; filename?: string; prompt?: string }
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body.' }), { status: 400, headers: CORS })
  }

  if (!body || typeof body !== 'object') {
    return new Response(JSON.stringify({ error: 'Invalid request body.' }), { status: 400, headers: CORS })
  }
  // Keep accepting the original PDF payload while supporting image inputs.
  const mimeType = body.mimeType ?? 'application/pdf'
  const isPdf = mimeType === 'application/pdf'
  if (!['application/pdf', 'image/jpeg', 'image/png', 'image/webp'].includes(mimeType)) {
    return new Response(JSON.stringify({ error: 'Choose a PDF, JPG, PNG, or WebP invitation.' }), { status: 400, headers: CORS })
  }
  const fileData = isPdf ? body.pdf : body.image
  if (typeof fileData !== 'string' || !fileData.length) {
    return new Response(JSON.stringify({ error: 'Missing invitation file data.' }), { status: 400, headers: CORS })
  }
  const limitBytes = (isPdf ? 20 : 5) * 1024 * 1024
  const padding = fileData.endsWith('==') ? 2 : fileData.endsWith('=') ? 1 : 0
  if (fileData.length > Math.ceil(limitBytes / 3) * 4 || fileData.length / 4 * 3 - padding > limitBytes) {
    return new Response(JSON.stringify({ error: isPdf ? 'Choose a PDF under 20 MB.' : 'Choose an image under 5 MB.' }), { status: 413, headers: CORS })
  }
  if (fileData.length % 4 !== 0 || !/^[A-Za-z0-9+/]+={0,2}$/.test(fileData)) {
    return new Response(JSON.stringify({ error: 'Invalid invitation file data.' }), { status: 400, headers: CORS })
  }
  const signature = atob(fileData.slice(0, 16))
  const matchesType = isPdf ? signature.startsWith('%PDF-')
    : mimeType === 'image/jpeg' ? signature.startsWith('\xff\xd8\xff')
    : mimeType === 'image/png' ? signature.startsWith('\x89PNG\r\n\x1a\n')
    : signature.startsWith('RIFF') && signature.slice(8, 12) === 'WEBP'
  if (!matchesType) {
    return new Response(JSON.stringify({ error: 'The file content does not match its format. Choose a valid PDF, JPG, PNG, or WebP file.' }), { status: 400, headers: CORS })
  }
  if (body.prompt !== undefined && typeof body.prompt !== 'string') {
    return new Response(JSON.stringify({ error: 'Invalid extraction prompt.' }), { status: 400, headers: CORS })
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5-5',
        max_tokens: 4096,
        messages: [{ role: 'user', content: [
          { type: isPdf ? 'document' : 'image', source: { type: 'base64', media_type: mimeType, data: fileData }, cache_control: { type: 'ephemeral' } },
          { type: 'text', text: body.prompt ?? 'Extract all text content from this invitation.' },
        ] }],
      }),
    })

    const result = await res.json()
    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: result?.error?.message ?? 'Claude API request failed.' }),
        { status: res.status, headers: CORS },
      )
    }

    const raw = (result?.content?.find((c: any) => c.type === 'text')?.text || '')
      .replace(/```json\n?|```/g, '').trim()

    return new Response(JSON.stringify({ text: raw }), { headers: CORS })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Failed to process invitation.' }),
      { status: 500, headers: CORS },
    )
  }
})
