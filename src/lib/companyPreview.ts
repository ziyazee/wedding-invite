export function companyPreviewError(cause: unknown): string {
  // Supabase RPC errors are plain objects, not necessarily Error instances.
  if (cause && typeof cause === 'object') {
    const error = cause as { message?: unknown; code?: unknown }
    if (error.code === 'PGRST202' || error.code === '42883' || error.code === '42P01') {
      return 'Preview setup is missing in Supabase. Apply 202611030004_company_preview.sql, then try again.'
    }
    if (typeof error.message === 'string' && error.message.trim()) return error.message
  }
  return 'Unable to load preview. Please try again.'
}
