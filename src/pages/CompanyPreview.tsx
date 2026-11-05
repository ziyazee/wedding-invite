import { useEffect, useState } from 'react'
import { validateDetails } from '../invitations/model'
import type { InvitationData } from '../invitations/model'
import InvitationRenderer from '../invitations/InvitationRenderer'
import InvitationLoading from '../invitations/InvitationLoading'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { companyPreviewError } from '../lib/companyPreview'

export default function CompanyPreview({ slug }: { slug: string }) {
  const [details, setDetails] = useState<InvitationData | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    setDetails(null); setError('')
    if (!supabase || !isSupabaseConfigured) { setError('Preview is not available on this host.'); return }
    let cancelled = false
    void (async () => {
      try {
        const { data, error: rpcError } = await supabase.rpc('get_company_preview', { p_slug: slug })
        if (cancelled) return
        if (rpcError) throw rpcError
        if (!data?.details) { setError('No preview available. Open an order and click Preview in the dashboard first.'); return }
        setDetails(validateDetails(data.details, true))
      } catch (e) {
        if (!cancelled) setError(companyPreviewError(e))
      }
    })()
    return () => { cancelled = true }
  }, [slug])

  useEffect(() => {
    if (!details) return
    const prev = document.title
    document.title = `${details.groom} & ${details.bride} — Preview`
    return () => { document.title = prev }
  }, [details])

  if (error) return <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: '#69746d', font: '14px/1.5 Arial, sans-serif', textAlign: 'center', padding: '2rem' }}><div><h1 style={{ fontSize: '1.25rem', marginBottom: '.5rem' }}>Preview unavailable</h1><p>{error}</p></div></main>
  if (!details) return <InvitationLoading />
  return <InvitationRenderer details={details} />
}
