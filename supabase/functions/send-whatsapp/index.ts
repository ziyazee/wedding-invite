import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/** Normalise any phone string to E.164 digits (no leading +).
 *  Assumes India (+91) when only 10 digits are given. */
function normalisePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 10) return `91${digits}`
  if (digits.length === 11 && digits.startsWith('0')) return `91${digits.slice(1)}`
  return digits
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS })
  }

  // Verify the caller is a signed-in dashboard user.
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

  const token        = Deno.env.get('WHATSAPP_ACCESS_TOKEN')
  const phoneNumId   = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')
  const templateName = Deno.env.get('WHATSAPP_TEMPLATE_NAME') ?? 'invitation_ready'

  if (!token || !phoneNumId) {
    return new Response(
      JSON.stringify({ error: 'WhatsApp is not configured on this server.' }),
      { status: 500, headers: CORS },
    )
  }

  let body: { phone: string; groomBride: string; inviteUrl: string; managementUrl: string; companyName: string }
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body.' }), { status: 400, headers: CORS })
  }

  const { phone, groomBride, inviteUrl, managementUrl, companyName } = body
  if (!phone || !groomBride || !inviteUrl || !managementUrl || !companyName) {
    return new Response(JSON.stringify({ error: 'Missing required fields.' }), { status: 400, headers: CORS })
  }

  const to = normalisePhone(phone)
  if (to.length < 7 || to.length > 15) {
    return new Response(JSON.stringify({ error: 'Enter a valid phone number.' }), { status: 400, headers: CORS })
  }

  const res = await fetch(`https://graph.facebook.com/v19.0/${phoneNumId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: 'en' },
        components: [{
          type: 'body',
          parameters: [
            { type: 'text', text: groomBride },
            { type: 'text', text: inviteUrl },
            { type: 'text', text: managementUrl },
            { type: 'text', text: companyName },
          ],
        }],
      },
    }),
  })

  const result = await res.json()
  if (!res.ok) {
    const msg = result?.error?.message ?? 'Failed to send WhatsApp message.'
    return new Response(JSON.stringify({ error: msg }), { status: 400, headers: CORS })
  }

  return new Response(JSON.stringify({ success: true }), { headers: CORS })
})
