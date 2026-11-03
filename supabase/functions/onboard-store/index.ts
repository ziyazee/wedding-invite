import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { validateStoreDetails, validateStoreTemplates } from '../_shared/storeOnboarding.ts'

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
}
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers })
const maxFileSize = 5 * 1024 * 1024

async function readPNG(value: FormDataEntryValue | null, label: string): Promise<Uint8Array | null> {
  if (value === null) return null
  if (!(value instanceof File) || value.size < 24 || value.size > maxFileSize || value.type !== 'image/png') throw new Error(`${label} must be a PNG smaller than 5 MB.`)
  const bytes = new Uint8Array(await value.arrayBuffer())
  if (![137,80,78,71,13,10,26,10].every((byte, i) => bytes[i] === byte) || ![73,72,68,82].every((byte, i) => bytes[12 + i] === byte)) throw new Error(`${label} is not a valid PNG.`)
  const view = new DataView(bytes.buffer)
  const width = view.getUint32(16), height = view.getUint32(20)
  if (!width || !height || width > 2048 || height > 2048) throw new Error(`${label} must be at most 2048 × 2048 pixels.`)
  return bytes
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response(null, { headers })
  if (req.method !== 'POST') return reply({ error: 'Method not allowed.' }, 405)
  const url = Deno.env.get('SUPABASE_URL')
  const anon = Deno.env.get('SUPABASE_ANON_KEY')
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!url || !anon || !key) return reply({ error: 'Store onboarding is not configured.' }, 503)
  const auth = req.headers.get('Authorization')
  if (!auth) return reply({ error: 'Sign in as an administrator.' }, 401)
  const caller = createClient(url, anon, { global: { headers: { Authorization: auth } }, auth: { persistSession: false } })
  const { data: { user }, error: authError } = await caller.auth.getUser()
  if (authError || !user) return reply({ error: 'Your session expired. Sign in again.' }, 401)
  if (String(user.app_metadata?.role).toUpperCase() !== 'ADMIN') return reply({ error: 'Administrator access required.' }, 403)
  const admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
  let requestId: string | undefined
  let requestReserved: boolean | undefined = false
  try {
    if (Number(req.headers.get('Content-Length') || 0) > 12 * 1024 * 1024) throw new Error('The upload is too large.')
    const form = await req.formData()
    const payload = JSON.parse(String(form.get('payload') || '{}'))
    requestId = payload.request_id
    if (typeof requestId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)) throw new Error('Invalid setup reference. Start a new store setup.')
    if (!['create', 'resume', 'access'].includes(payload.action)) throw new Error('Invalid setup action.')
    const { data: existing, error: lookupError } = await admin.from('store_onboarding_requests').select('*').eq('id', requestId).maybeSingle()
    if (lookupError) throw lookupError
    requestReserved = !!existing
    if (!existing && payload.action !== 'create') throw new Error('Store setup not found.')
    const details = validateStoreDetails(payload.action === 'create' ? payload.details : existing.details)
    const templates = validateStoreTemplates(payload.action === 'create' ? payload.templates : existing.templates)
    // Validate assets before reserving a new store. Resume can reuse uploads.
    const logo = await readPNG(form.get('logo'), 'Logo')
    const banner = await readPNG(form.get('banner'), 'Banner')
    if (!logo && !existing?.logo_uploaded) throw new Error('Choose a store logo.')
    const baseURL = `${url.replace(/\/$/, '')}/storage/v1/object/public/store-branding`
    requestReserved = undefined
    const { data: prepared, error: prepareError } = await admin.rpc('prepare_store_onboarding', {
      p_id: requestId, p_actor: user.id, p_details: details, p_templates: templates, p_base_url: baseURL,
    })
    if (prepareError) throw prepareError
    requestReserved = true
    if (payload.action === 'access' && !prepared.completed_at) throw new Error('Finish store setup before creating an account link.')
    if (!prepared.completed_at) {
      for (const [kind, bytes] of [['logo', logo], ['banner', banner]] as const) {
        if (!bytes) continue
        const object = `${kind === 'logo' ? 'company-logos' : 'landing'}/${details.slug}.png`
        const { error } = await admin.storage.from('store-branding').upload(object, bytes, { contentType: 'image/png', cacheControl: '3600', upsert: true })
        if (error) throw new Error(`${kind === 'logo' ? 'Logo' : 'Banner'} upload failed. Resume this setup to retry.`)
        const { error: savedError } = await admin.from('store_onboarding_requests').update({ [`${kind}_uploaded`]: true }).eq('id', requestId)
        if (savedError) throw savedError
      }
    }
    const appURL = new URL(Deno.env.get('STORE_APP_URL') || 'https://www.shaadiinvites.in')
    if (appURL.protocol !== 'https:' && !['localhost','127.0.0.1'].includes(appURL.hostname)) throw new Error('The account setup URL must use HTTPS.')
    const redirectTo = new URL('/account/setup', appURL).href
    const owner = await admin.rpc('store_onboarding_owner', { p_id: requestId })
    if (owner.error) throw owner.error
    let link = await admin.auth.admin.generateLink({ type: owner.data?.id ? 'recovery' : 'invite', email: details.email, options: { redirectTo } })
    // Another attempt may have created the account before its response was lost.
    if (link.error && !owner.data?.id) {
      const retryOwner = await admin.rpc('store_onboarding_owner', { p_id: requestId })
      if (retryOwner.error) throw retryOwner.error
      if (retryOwner.data?.id) link = await admin.auth.admin.generateLink({ type: 'recovery', email: details.email, options: { redirectTo } })
    }
    if (link.error || !link.data.properties?.action_link) throw new Error('The owner setup link could not be created. Resume this setup to retry.')
    const { data: result, error: finishError } = await admin.rpc('finish_store_onboarding', { p_id: requestId })
    if (finishError) throw finishError
    // The single-use account link is returned only to the admin; never persisted
    // in the database, localStorage or logs. No invitation email is sent here.
    return reply({ ...result, request_id: requestId, setup_url: link.data.properties.action_link, store_url: `https://${details.slug}.shaadiinvites.in`, login_url: new URL('/login', appURL).href })
  } catch (error) {
    if (requestReserved === undefined && requestId) {
      const check = await admin.from('store_onboarding_requests').select('id').eq('id', requestId).maybeSingle()
      if (!check.error) requestReserved = !!check.data
    }
    const code = error && typeof error === 'object' && 'code' in error ? error.code : undefined
    const message = code === '23505' ? 'That login email or store address is already in use. Open its existing setup, or use different details.'
      : error && typeof error === 'object' && 'message' in error ? String(error.message) : 'Store setup failed. Retry with the same details.'
    return reply({ error: message, request_id: requestId, request_reserved: requestReserved }, 400)
  }
})
