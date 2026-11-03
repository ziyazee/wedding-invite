import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './Login.css'

export default function AccountSetup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    let cancelled = false
    async function check() {
      try {
        if (!supabase) throw new Error('Account setup is not configured.')
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error || !user?.email) throw new Error('This setup link has expired or is invalid. Ask Shaadi Invites for a new link.')
        if (String(user.app_metadata?.role).toUpperCase() === 'ADMIN') throw new Error('Open the store owner’s setup link in a separate browser session.')
        const { data: company, error: companyError } = await supabase.from('companies').select('id').eq('email', user.email.toLowerCase()).maybeSingle()
        if (companyError || !company) throw new Error('This account is not linked to a store. Contact Shaadi Invites.')
        if (!cancelled) setEmail(user.email)
      } catch (cause) {
        if (!cancelled) setError(cause instanceof Error ? cause.message : 'Unable to verify this setup link.')
      } finally { if (!cancelled) setLoading(false) }
    }
    void check()
    return () => { cancelled = true }
  }, [])

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!supabase || !email) return
    if (password.length < 12 || password !== confirmation) { setError('Use at least 12 characters and enter the same password in both fields.'); return }
    setBusy(true); setError('')
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      navigate('/client/dashboard', { replace: true })
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to save your password.') }
    finally { setBusy(false) }
  }

  return <main className="login-page"><section className="login-card">
    <Link className="login-brand" to="/"><img src="/logo.png" alt="Shaadi Invites" /></Link>
    <span className="login-kicker">YOUR STORE IS READY</span>
    <h1>Welcome <em>aboard.</em></h1>
    <p className="login-intro">{loading ? 'Checking your account setup link…' : email ? `Choose a password for ${email}.` : 'Set up your store dashboard access.'}</p>
    {error && <p className="login-error" role="alert">{error}</p>}
    {email && <form onSubmit={submit}>
      <label htmlFor="setup-password">New password</label><input id="setup-password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required value={password} onChange={event => setPassword(event.target.value)} />
      <label htmlFor="setup-confirm">Confirm password</label><input id="setup-confirm" type="password" autoComplete="new-password" minLength={12} maxLength={128} required value={confirmation} onChange={event => setConfirmation(event.target.value)} />
      <button disabled={busy}>{busy ? 'Saving…' : 'Set password & open dashboard'} →</button>
    </form>}
    <p className="login-footnote"><Link to="/login">Already have a password? Sign in</Link></p>
  </section></main>
}
