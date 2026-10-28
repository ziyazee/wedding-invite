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

  const openaiKey = Deno.env.get('OPENAI_KEY')
  if (!openaiKey) {
    return new Response(
      JSON.stringify({ error: 'OpenAI API key is not configured.' }),
      { status: 500, headers: CORS },
    )
  }

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
    const res = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        input: [{ role: 'user', content: [
          { type: 'input_file', filename: body.filename ?? 'document.pdf', file_data: `data:application/pdf;base64,${body.pdf}` },
          { type: 'input_text', text: body.prompt ?? 'Extract all text content from this PDF.' },
        ] }],
      }),
    })

    const result = await res.json()
    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: result?.error?.message ?? 'OpenAI API request failed.' }),
        { status: res.status, headers: CORS },
      )
    }

    const raw = (result?.output?.find((o: any) => o.type === 'message')
      ?.content?.find((c: any) => c.type === 'output_text')?.text || '')
      .replace(/```json\n?|```/g, '').trim()

    return new Response(JSON.stringify({ text: raw }), { headers: CORS })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Failed to process PDF.' }),
      { status: 500, headers: CORS },
    )
  }
})
