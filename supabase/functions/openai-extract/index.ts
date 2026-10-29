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

  const anthropicKey = Deno.env.get('ANTHROPIC_KEY') || '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'

  let body: { pdf: string; filename?: string; prompt?: string }
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body.' }), { status: 400, headers: CORS })
  }

  if (!body.pdf) {
    return new Response(JSON.stringify({ error: 'Missing PDF data.' }), { status: 400, headers: CORS })
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
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{ role: 'user', content: [
          { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: body.pdf }, cache_control: { type: 'ephemeral' } },
          { type: 'text', text: body.prompt ?? 'Extract all text content from this PDF.' },
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
      JSON.stringify({ error: err instanceof Error ? err.message : 'Failed to process PDF.' }),
      { status: 500, headers: CORS },
    )
  }
})
