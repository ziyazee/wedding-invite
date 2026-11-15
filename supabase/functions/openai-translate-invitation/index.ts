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
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Use POST to translate invitation text.' }), { status: 405, headers: CORS })

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return new Response(JSON.stringify({ error: 'Unauthorised.' }), { status: 401, headers: CORS })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorised.' }), { status: 401, headers: CORS })

  const openaiKey = Deno.env.get('OPENAI_KEY')
  if (!openaiKey) return new Response(JSON.stringify({ error: 'OpenAI API key is not configured.' }), { status: 500, headers: CORS })

  let body: { fields?: unknown; targetLanguage?: unknown }
  try { body = await req.json() } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body.' }), { status: 400, headers: CORS })
  }
  const allowedPath = /^(groom|bride|groomFamily|brideFamily|message|dressCode|giftNote|venue|address|label\.\w+|events\.\d+\.(title|venue|address|schedule\.\d+\.(title|description|location)))$/
  const allowedLanguages = ['Hindi', 'Kannada', 'Malayalam'] as const
  const targetLanguage = typeof body.targetLanguage === 'string' ? body.targetLanguage : ''
  if (!allowedLanguages.includes(targetLanguage as typeof allowedLanguages[number]) || !Array.isArray(body.fields) || body.fields.length < 1 || body.fields.length > 600 || body.fields.some(field => !field || typeof field !== 'object' || typeof field.path !== 'string' || !allowedPath.test(field.path) || typeof field.text !== 'string' || !field.text.trim())) {
    return new Response(JSON.stringify({ error: `Provide invitation text to translate.` }), { status: 400, headers: CORS })
  }
  const fields = body.fields as { path: string; text: string }[]
  if (fields.reduce((sum, field) => sum + field.text.length, 0) > 18000) {
    return new Response(JSON.stringify({ error: 'This invitation has too much text to translate at once.' }), { status: 413, headers: CORS })
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openaiKey}` },
      body: JSON.stringify({
        model: 'gpt-5.5',
        reasoning_effort: 'low',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: `You are an expert ${targetLanguage} translator specializing in elegant, respectful wedding invitations. Translate every supplied field into natural, grammatically correct ${targetLanguage} written in ${targetLanguage} script. This includes personal details, event information, and UI labels — translate everything provided. Do not add any fields beyond what was supplied. Preserve the meaning, warmth, respectful family forms, and tone. Transliterate personal and venue names into ${targetLanguage} script without changing their identity. Keep phone numbers, URLs, map links, and identifiers unchanged. The date and time fields are not supplied because the invitation preview formats them separately. Do not add facts. Return only a JSON object with a translations object containing exactly the same keys as the supplied paths and one translated string for each key.` },
          { role: 'user', content: JSON.stringify({ targetLanguage, fields }) },
        ],
      }),
    })
    const result = await response.json()
    if (!response.ok) {
      return new Response(JSON.stringify({ error: result?.error?.message ?? 'OpenAI translation failed.' }), { status: response.status, headers: CORS })
    }
    const content = result?.choices?.[0]?.message?.content
    if (typeof content !== 'string') return new Response(JSON.stringify({ error: 'OpenAI returned no translation.' }), { status: 502, headers: CORS })
    const parsed = JSON.parse(content)
    const translations = parsed?.translations
    if (!translations || typeof translations !== 'object' || Array.isArray(translations) || fields.some(field => typeof translations[field.path] !== 'string')) {
      return new Response(JSON.stringify({ error: 'OpenAI returned an incomplete translation.' }), { status: 502, headers: CORS })
    }
    const promptTokens = Number(result?.usage?.prompt_tokens) || 0
    const completionTokens = Number(result?.usage?.completion_tokens) || 0
    // Standard GPT-5.5 rates: $5 / 1M input tokens and $30 / 1M output tokens.
    const estimatedCostUsd = (promptTokens * 5 + completionTokens * 30) / 1_000_000
    return new Response(JSON.stringify({ translations, usage: { promptTokens, completionTokens }, estimatedCostUsd }), { headers: CORS })
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Could not translate the invitation.' }), { status: 500, headers: CORS })
  }
})
