import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS })
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

  const geminiKey = Deno.env.get('GEMINI_KEY')
  if (!geminiKey) {
    return new Response(
      JSON.stringify({ error: 'Gemini API key is not configured.' }),
      { status: 500, headers: CORS },
    )
  }

  let body: { pdf: string; filename?: string }
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body.' }), { status: 400, headers: CORS })
  }

  if (!body.pdf) {
    return new Response(JSON.stringify({ error: 'Missing PDF data.' }), { status: 400, headers: CORS })
  }

  try {
    const models = ['gemini-3.8-flash', 'gemini-2.5-flash']
    const payload = JSON.stringify({
      contents: [{
        parts: [
          { inlineData: { mimeType: 'application/pdf', data: body.pdf } },
          { text: 'Extract all text content from this PDF document. Return only the raw text, preserving the layout and structure as much as possible.' },
        ],
      }],
    })

    let lastError = ''
    for (const model of models) {
      for (let attempt = 0; attempt < 3; attempt++) {
        if (attempt > 0) await new Promise(r => setTimeout(r, 1000 * 2 ** attempt))
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
          { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload },
        )
        if (res.status === 503) { lastError = 'Model temporarily unavailable'; continue }
        const result = await res.json()
        if (!res.ok) { lastError = result?.error?.message ?? 'Gemini API request failed.'; continue }
        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
        return new Response(JSON.stringify({ text }), { headers: CORS })
      }
    }

    return new Response(JSON.stringify({ error: lastError || 'All models unavailable.' }), { status: 503, headers: CORS })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Failed to process PDF.' }),
      { status: 500, headers: CORS },
    )
  }
})
