import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
}
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: CORS })
type Prediction = { placePrediction?: { placeId?: string; text?: { text?: string }; structuredFormat?: { mainText?: { text?: string }; secondaryText?: { text?: string } } } }
const PLACE_FIELDS = 'id,displayName,formattedAddress,location'

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS })
  if (req.method !== 'POST') return reply({ error: 'Method not allowed.' }, 405)
  const authorization = req.headers.get('Authorization')
  if (!authorization) return reply({ error: 'Sign in to search locations.' }, 401)

  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authorization } },
    })
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return reply({ error: 'Sign in to search locations.' }, 401)
    if (String(user.app_metadata?.role).toUpperCase() !== 'ADMIN') {
      const { data: companyId, error } = await supabase.rpc('current_user_company_id')
      if (error || !companyId) return reply({ error: 'A company account is required to search locations.' }, 403)
    }

    const apiKey = Deno.env.get('GOOGLE_API_KEY')
    if (!apiKey) return reply({ error: 'Location search is not configured. You can paste a Google Maps link instead.' }, 503)
    const raw = await req.text()
    if (raw.length > 4096) return reply({ error: 'Location request is too long.' }, 413)
    let body: { action?: unknown; input?: unknown; sessionToken?: unknown; placeId?: unknown; latitude?: unknown; longitude?: unknown }
    try { body = JSON.parse(raw) } catch { return reply({ error: 'Invalid location request.' }, 400) }
    if (!body || typeof body !== 'object' || !['autocomplete', 'details', 'find', 'preview'].includes(String(body.action))) {
      return reply({ error: 'Invalid location request.' }, 400)
    }
    if ((body.action === 'autocomplete' || body.sessionToken !== undefined) && (typeof body.sessionToken !== 'string' || !/^[a-zA-Z0-9_-]{1,36}$/.test(body.sessionToken))) {
      return reply({ error: 'Invalid search session.' }, 400)
    }
    if (body.input !== undefined && (typeof body.input !== 'string' || body.input.length > 500)) {
      return reply({ error: 'Location text is too long.' }, 400)
    }

    if (body.action === 'preview') {
      const latitude = typeof body.latitude === 'string' && body.latitude.trim() ? Number(body.latitude) : NaN
      const longitude = typeof body.longitude === 'string' && body.longitude.trim() ? Number(body.longitude) : NaN
      if (!Number.isFinite(latitude) || Math.abs(latitude) > 90 || !Number.isFinite(longitude) || Math.abs(longitude) > 180) {
        return reply({ error: 'Invalid map position.' }, 400)
      }
      const coordinates = `${latitude},${longitude}`
      const params = new URLSearchParams({ center: coordinates, markers: `color:red|${coordinates}`, zoom: '15', size: '600x420', scale: '1', format: 'png', key: apiKey })
      const response = await fetch(`https://maps.googleapis.com/maps/api/staticmap?${params}`, { signal: AbortSignal.timeout(8000) })
      if (!response.ok || !response.headers.get('content-type')?.startsWith('image/png')) {
        return reply({ error: 'Map preview is unavailable. Open the Maps link to verify this location.' }, 502)
      }
      const bytes = new Uint8Array(await response.arrayBuffer())
      if (bytes.length > 2 * 1024 * 1024) return reply({ error: 'Map preview is too large.' }, 502)
      let binary = ''
      for (let offset = 0; offset < bytes.length; offset += 8192) binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192))
      // Return image bytes only; the authenticated Google URL and key stay on the server.
      return reply({ image: `data:image/png;base64,${btoa(binary)}` })
    }

    let url: string
    let options: RequestInit
    const headers = { 'Content-Type': 'application/json', 'X-Goog-Api-Key': apiKey }
    if (body.action === 'autocomplete') {
      if (typeof body.input !== 'string' || body.input.trim().length < 3 || body.input.length > 200) {
        return reply({ error: 'Enter between 3 and 200 characters to search.' }, 400)
      }
      url = 'https://places.googleapis.com/v1/places:autocomplete'
      options = {
        method: 'POST',
        headers: { ...headers, 'X-Goog-FieldMask': 'suggestions.placePrediction.placeId,suggestions.placePrediction.text.text,suggestions.placePrediction.structuredFormat' },
        body: JSON.stringify({ input: body.input.trim(), sessionToken: body.sessionToken, languageCode: 'en', regionCode: 'in' }),
      }
    } else if (body.action === 'find') {
      if (typeof body.input !== 'string' || body.input.trim().length < 3) return reply({ error: 'Enter a venue and address first.' }, 400)
      url = 'https://places.googleapis.com/v1/places:searchText'
      options = {
        method: 'POST',
        headers: { ...headers, 'X-Goog-FieldMask': PLACE_FIELDS.split(',').map(field => `places.${field}`).join(',') },
        body: JSON.stringify({ textQuery: body.input.trim(), pageSize: 1, languageCode: 'en', regionCode: 'in' }),
      }
    } else {
      if (typeof body.placeId !== 'string' || !/^[a-zA-Z0-9_-]{1,256}$/.test(body.placeId)) {
        return reply({ error: 'Choose a location from the suggestions.' }, 400)
      }
      const params = new URLSearchParams({ languageCode: 'en' })
      if (typeof body.sessionToken === 'string') params.set('sessionToken', body.sessionToken)
      url = `https://places.googleapis.com/v1/places/${encodeURIComponent(body.placeId)}?${params}`
      options = { headers: { ...headers, 'X-Goog-FieldMask': PLACE_FIELDS } }
    }
    const response = await fetch(url, { ...options, signal: AbortSignal.timeout(8000) })
    if (!response.ok) {
      // Never return upstream diagnostics: they can contain project or credential details.
      return reply({ error: response.status === 429 ? 'Location search is busy. Try again shortly or paste a Maps link.' : 'Google location search is unavailable. Try again or paste a Maps link.' }, response.status === 429 ? 429 : 502)
    }
    const result = await response.json()
    if (body.action === 'autocomplete') {
      const suggestions = ((result.suggestions || []) as Prediction[]).flatMap(({ placePrediction: place }) => {
        if (!place?.placeId || !place.text?.text) return []
        return [{ placeId: place.placeId, label: place.structuredFormat?.mainText?.text || place.text.text, address: place.structuredFormat?.secondaryText?.text || '' }]
      }).slice(0, 5)
      return reply({ suggestions })
    }
    const place = body.action === 'find' ? result.places?.[0] : result
    if (!place) return reply({ error: 'No location found. Search with a nearby city or paste a Maps link.' }, 404)
    if (typeof place.id !== 'string' || !/^[a-zA-Z0-9_-]{1,256}$/.test(place.id) ||
        !Number.isFinite(place.location?.latitude) || !Number.isFinite(place.location?.longitude)) {
      return reply({ error: 'This location could not be verified. Choose another result or paste a Maps link.' }, 502)
    }
    // Persist the exempt place ID and the user's own query, not Google's venue/address data.
    const params = new URLSearchParams({ api: '1', query: typeof body.input === 'string' && body.input.trim() ? body.input.trim().slice(0, 150) : 'Location', query_place_id: place.id })
    const map = `https://www.google.com/maps/search/?${params}`
    return reply({ map, place: {
      placeId: place.id, map, label: place.displayName?.text || 'Selected location', address: place.formattedAddress || '',
      latitude: place.location.latitude, longitude: place.location.longitude,
    } })
  } catch {
    return reply({ error: 'Location search could not finish. Try again or paste a Maps link.' }, 502)
  }
})
