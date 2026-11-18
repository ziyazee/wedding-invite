import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import { AuthProvider } from '../../src/lib/auth/AuthProvider'
import { useAuth } from '../../src/lib/auth/useAuth'

let authStateCallback: ((event: string, session: { user: Record<string, unknown> } | null) => void) | null = null
const mockUnsubscribe = vi.fn()
const mockGetUser = vi.fn()
const mockSignOut = vi.fn()

vi.mock('../../src/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: () => mockGetUser(),
      onAuthStateChange: (cb: (event: string, session: { user: Record<string, unknown> } | null) => void) => {
        authStateCallback = cb
        return { data: { subscription: { unsubscribe: mockUnsubscribe } } }
      },
      signOut: () => mockSignOut(),
    },
    from: () => ({
      select: () => ({
        ilike: () => ({
          maybeSingle: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
    }),
  },
  isSupabaseConfigured: true,
}))

function AuthConsumer() {
  const { user, role, company, isLoading } = useAuth()
  if (isLoading) return <div data-testid="loading">Loading</div>
  return (
    <div>
      <span data-testid="role">{role ?? 'none'}</span>
      <span data-testid="user">{user?.email ?? 'anonymous'}</span>
      <span data-testid="company">{company?.company_name ?? 'none'}</span>
    </div>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  authStateCallback = null
})

describe('AuthProvider', () => {
  it('starts in loading state', () => {
    mockGetUser.mockReturnValue(new Promise(() => {}))
    render(
      <AuthProvider><AuthConsumer /></AuthProvider>,
    )
    expect(screen.getByTestId('loading')).toBeInTheDocument()
  })

  it('resolves ADMIN user without company lookup', async () => {
    const adminUser = { id: 'u-1', email: 'admin@test.com', app_metadata: { role: 'ADMIN' }, user_metadata: {} }
    mockGetUser.mockResolvedValue({ data: { user: adminUser }, error: null })

    render(
      <AuthProvider><AuthConsumer /></AuthProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('role')).toHaveTextContent('ADMIN')
    })
    expect(screen.getByTestId('user')).toHaveTextContent('admin@test.com')
    expect(screen.getByTestId('company')).toHaveTextContent('none')
  })

  it('resolves unauthenticated user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: { message: 'not authenticated' } })

    render(
      <AuthProvider><AuthConsumer /></AuthProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('role')).toHaveTextContent('none')
    })
    expect(screen.getByTestId('user')).toHaveTextContent('anonymous')
  })

  it('provides signOut that clears state', async () => {
    const user = { id: 'u-1', email: 'user@test.com', app_metadata: {}, user_metadata: {} }
    mockGetUser.mockResolvedValue({ data: { user }, error: null })
    mockSignOut.mockResolvedValue({ error: null })

    function SignOutButton() {
      const { signOut, user } = useAuth()
      return <button onClick={() => void signOut()}>{user ? 'Signed in' : 'Signed out'}</button>
    }

    render(
      <AuthProvider><SignOutButton /></AuthProvider>,
    )

    await waitFor(() => {
      expect(screen.getByText('Signed in')).toBeInTheDocument()
    })

    await act(async () => {
      screen.getByText('Signed in').click()
    })

    await waitFor(() => {
      expect(screen.getByText('Signed out')).toBeInTheDocument()
    })
    expect(mockSignOut).toHaveBeenCalled()
  })
})
