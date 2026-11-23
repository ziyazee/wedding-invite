import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
}

const DEFAULT_INVITATION_MESSAGE = 'Join us as we celebrate love, laughter, and a lifetime of togetherness. Your presence means the world to us!'

/** Normalise any phone string to E.164 digits (no leading +).
 *  Assumes India (+91) when only 10 digits are given. */
function normalisePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 10) return `91${digits}`
  if (digits.length === 11 && digits.startsWith('0')) return `91${digits.slice(1)}`
  return digits
}

async function sendTemplate(
  token: string,
  phoneNumId: string,
  graphApiVersion: string,
  to: string,
  template: object,
): Promise<{ ok: boolean; error?: string }> {
  const payload = { messaging_product: 'whatsapp', to, type: 'template', template }
  console.log(`[send-whatsapp] payload:`, JSON.stringify(payload))
  const res = await fetch(`https://graph.facebook.com/${graphApiVersion}/${phoneNumId}/messages`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const result = await res.json()
  if (!res.ok) {
    console.error(`[send-whatsapp] Meta API error:`, JSON.stringify(result))
    return { ok: false, error: result?.error?.message ?? JSON.stringify(result) }
  }
  return { ok: true }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS })
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed.' }), { status: 405, headers: CORS })
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

  const token      = Deno.env.get('WHATSAPP_ACCESS_TOKEN')
  const phoneNumId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')

  if (!token || !phoneNumId) {
    return new Response(
      JSON.stringify({ error: 'WhatsApp is not configured on this server.' }),
      { status: 500, headers: CORS },
    )
  }

  let body: {
    phone: string; groomBride: string; groomName: string; brideName: string
    weddingDate: string; inviteUrl: string; managementUrl: string; companyName: string
  }
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body.' }), { status: 400, headers: CORS })
  }

  const { phone, groomBride, groomName, brideName, weddingDate, inviteUrl: rawInviteUrl, managementUrl: rawManagementUrl, companyName } = body ?? {}
  if (![phone, groomBride, rawInviteUrl, rawManagementUrl, companyName].every(v => typeof v === 'string' && v.trim())) {
    return new Response(JSON.stringify({ error: 'Missing required fields.' }), { status: 400, headers: CORS })
  }

  const to = normalisePhone(phone)
  if (to.length < 7 || to.length > 15) {
    return new Response(JSON.stringify({ error: 'Enter a valid phone number.' }), { status: 400, headers: CORS })
  }

  const PROD_ORIGIN = 'https://www.shaadiinvites.in'
  const fixUrl = (raw: string) => {
    try { return `${PROD_ORIGIN}${new URL(raw).pathname}` } catch { return raw }
  }
  const inviteUrl = fixUrl(rawInviteUrl)
  const managementUrl = fixUrl(rawManagementUrl)

  const groom = groomName || groomBride.split('&')[0]?.trim() || 'Groom'
  const bride = brideName || groomBride.split('&')[1]?.trim() || 'Bride'

  const graphApiVersion = Deno.env.get('WHATSAPP_GRAPH_API_VERSION') ?? 'v21.0'
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const cardImageUrl = `${supabaseUrl}/functions/v1/card-image?groom=${encodeURIComponent(groom)}&bride=${encodeURIComponent(bride)}&date=${encodeURIComponent(weddingDate || '')}&company=${encodeURIComponent(companyName)}`
  console.log(`[send-whatsapp] to=${to} phoneNumId=${phoneNumId} graphApiVersion=${graphApiVersion}`)

  // Send all 3 templates sequentially so they arrive in order.
  const results: { template: string; ok: boolean; error?: string }[] = []

  // 1 — Confirmation notice
  const r1 = await sendTemplate(token, phoneNumId, graphApiVersion, to, {
    name: 'order_confirmation_v1',
    language: { code: 'en' },
    components: [{
      type: 'body',
      parameters: [
        { type: 'text', parameter_name: 'customer_name', text: groomBride },
        { type: 'text', parameter_name: 'invitation_link', text: inviteUrl },
        { type: 'text', parameter_name: 'manage_link', text: managementUrl },
        { type: 'text', parameter_name: 'company_name', text: companyName },
      ],
    }],
  })
  results.push({ template: 'order_confirmation_v2', ...r1 })

  /* --- TEMPORARILY DISABLED for testing --- */
  /*
  // Generate card image and upload directly to WhatsApp Media API
  const testImageUrl = 'https://www.shaadiinvites.in/upload-card-design.png'
  let imageHeader: { link: string } | { id: string } = { link: testImageUrl }
  try {
    const imgResp = await fetch(testImageUrl)
    if (imgResp.ok) {
      const imgBlob = await imgResp.blob()
      const form = new FormData()
      form.append('messaging_product', 'whatsapp')
      form.append('type', 'image/png')
      form.append('file', new File([imgBlob], 'card.png', { type: 'image/png' }))
      const mediaRes = await fetch(`https://graph.facebook.com/${graphApiVersion}/${phoneNumId}/media`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: form,
      })
      const mediaJson = await mediaRes.json()
      console.log('[send-whatsapp] media upload:', JSON.stringify(mediaJson))
      if (mediaJson.id) imageHeader = { id: mediaJson.id }
    }
  } catch (e) { console.error('[send-whatsapp] media upload failed, using link fallback:', e) }

  // 2 — Invitation with image header + open button
  const r2 = await sendTemplate(token, phoneNumId, graphApiVersion, to, {
    name: 'wedding_invitation_v1',
    language: { code: 'en' },
    components: [
      {
        type: 'header',
        parameters: [{ type: 'image', image: imageHeader }],
      },
      {
        type: 'body',
        parameters: [
          { type: 'text', parameter_name: 'invitation_message', text: DEFAULT_INVITATION_MESSAGE },
          { type: 'text', parameter_name: 'invitation_url', text: inviteUrl },
          { type: 'text', parameter_name: 'name', text: groomBride },
        ],
      },
      {
        type: 'button',
        sub_type: 'url',
        index: '0',
        parameters: [{ type: 'text', text: new URL(inviteUrl).pathname.slice(1) }],
      },
    ],
  })
  results.push({ template: 'wedding_invitation_v1', ...r2 })

  // Delay so the marketing template (2) lands before the utility template (3)
  await new Promise(resolve => setTimeout(resolve, 3000))

  // 3 — Management link with dashboard button
  const r3 = await sendTemplate(token, phoneNumId, graphApiVersion, to, {
    name: 'order_management_v1',
    language: { code: 'en' },
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', parameter_name: 'company', text: companyName },
        ],
      },
      {
        type: 'button',
        sub_type: 'url',
        index: '0',
        parameters: [{ type: 'text', text: new URL(managementUrl).pathname.slice(1) }],
      },
    ],
  })
  results.push({ template: 'order_management_v1', ...r3 })
  */

  const failed = results.filter(r => !r.ok)

  if (failed.length === results.length) {
    return new Response(
      JSON.stringify({ error: 'All messages failed to send.', results }),
      { status: 400, headers: CORS },
    )
  }

  return new Response(
    JSON.stringify({ success: true, results }),
    { headers: CORS },
  )
})
