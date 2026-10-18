import { supabase } from '../lib/supabase'

export interface RsvpTarget { orderId: string; path: string }
export interface RsvpResponse {
  name: string
  attendance: 'yes' | 'no'
  count: number
  guests: string[]
  message: string
}
export interface RsvpSubmitRequest {
  response: RsvpResponse
  resolve: () => void
  reject: (error: Error) => void
}

const tokens = new Map<string, string>()
function submissionToken(orderId: string) {
  const key = `order-rsvp-token:${orderId}`
  let token = tokens.get(key)
  if (!token) {
    try {
      const saved = localStorage.getItem(key)
      if (saved && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(saved)) token = saved
    } catch { /* Retain the token in memory when browser storage is unavailable. */ }
    token ||= crypto.randomUUID()
    tokens.set(key, token)
    try { localStorage.setItem(key, token) } catch { /* Sending the reply does not require browser storage. */ }
  }
  return token
}

export async function saveOrderRsvp(target: RsvpTarget, response: RsvpResponse) {
  if (!supabase) throw new Error('RSVP is temporarily unavailable. Please try again later.')
  const { data, error } = await supabase.rpc('submit_order_rsvp', {
    p_order_id: target.orderId,
    p_published_path: target.path,
    p_submission_token: submissionToken(target.orderId),
    p_full_name: response.name,
    p_attendance: response.attendance,
    p_guest_count: response.count,
    p_additional_guests: response.guests,
    p_message: response.message,
  })
  if (error || data?.saved !== true) {
    throw new Error(error?.code === 'P0001' ? error.message : 'Your RSVP could not be saved. Please try again.')
  }
}
