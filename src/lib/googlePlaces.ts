import { supabase } from './supabase'

export type PlaceSuggestion = { placeId: string; label: string; address: string }
export type SelectedPlace = PlaceSuggestion & { map: string; latitude: number; longitude: number }
type Result = { suggestions?: PlaceSuggestion[]; map?: string; place?: SelectedPlace; image?: string; error?: string }

export async function googlePlaces(body: Record<string, string>, signal?: AbortSignal): Promise<Result> {
  if (!supabase) throw new Error('Location search is unavailable. You can paste a Maps link instead.')
  const { data, error } = await supabase.functions.invoke<Result>('google-places', { body, signal, timeout: 12000 })
  if (error) {
    let message = 'Location search is unavailable. Try again or paste a Maps link.'
    if (error.context instanceof Response) {
      try {
        const response = await error.context.json()
        if (typeof response?.error === 'string') message = response.error
      } catch { /* The function gateway can return a non-JSON response. */ }
    }
    throw new Error(message)
  }
  if (data?.error) throw new Error(data.error)
  if (!data) throw new Error('No location response. Try again or paste a Maps link.')
  return data
}

export function safeMapLink(value: string): string | undefined {
  try {
    const url = new URL(value)
    return ['https:', 'http:'].includes(url.protocol) ? url.href : undefined
  } catch { return undefined }
}

export function savedPlaceId(value: string): string | undefined {
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || !['www.google.com', 'google.com', 'maps.google.com'].includes(url.hostname)) return
    const id = url.searchParams.get('query_place_id')
    return id && /^[a-zA-Z0-9_-]{1,256}$/.test(id) ? id : undefined
  } catch { return undefined }
}
