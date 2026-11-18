import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isSupabaseConfigured, supabase } from '../../lib/supabase'
import { getUserRole, useAuth } from '../../lib/auth'
import { getCompanyByEmail } from '../../lib/auth/resolveCompany'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()
  const { refresh } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase) {
      setError('Login is not configured yet. Add the Supabase URL and anonymous key to the app environment.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (authError) throw authError
      if (!data.user) throw new Error('We could not verify this account. Please try again.')

      const role = getUserRole(data.user)
      if (role === 'ADMIN') {
        refresh()
        navigate('/admin/dashboard', { replace: true })
      } else if (data.user.email) {
        const company = await getCompanyByEmail(data.user.email)
        if (!company) {
          await supabase.auth.signOut()
          throw new Error('This email is not linked to a client company. Please contact Shaadi Invites support.')
        }
        refresh()
        navigate('/client/dashboard', { replace: true })
      } else {
        await supabase.auth.signOut()
        throw new Error('This account has no email address. Please contact Shaadi Invites support.')
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to sign in. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <Link className="login-brand" to="/" aria-label="Shaadi Invites home">
          <img src="/logo.png" alt="Shaadi Invites" />
        </Link>
        <span className="login-kicker">THE WEDDING STUDIO</span>
        <h1 id="login-title">Welcome <em>back.</em></h1>
        <p className="login-intro">Sign in to continue to your Shaadi Invites dashboard.</p>
        <form onSubmit={submit}>
          <label htmlFor="login-email">Username</label>
          <input id="login-email" type="email" autoComplete="username" autoCapitalize="none" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@company.com" required />
          <label htmlFor="login-password">Password</label>
          <input id="login-password" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Your password" required />
          {error && <p className="login-error" role="alert">{error}</p>}
          <button type="submit" disabled={busy || !isSupabaseConfigured}>{busy ? 'Signing in…' : 'Sign in'} <span aria-hidden="true">→</span></button>
          {!isSupabaseConfigured && <p className="login-config-note">Login is unavailable until Supabase is configured.</p>}
        </form>
        <p className="login-footnote">Secure access for our invitation partners.</p>
      </section>
    </main>
  )
}
