import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const orderRow = {
  id: 1,
  company_id: 4,
  template_code: 'mandap-at-dusk',
  created_by: 'user-1',
  groom_name: 'Kiran',
  bride_name: 'Anjali',
  phone_number: '9876543210',
  form_data: { template: 8, groom: 'Kiran', bride: 'Anjali', date: '2026-12-20', time: '11:00', offset: '+05:30', venue: 'Garden Hall', address: 'Mumbai', map: '', message: '', groomFamily: '', brideFamily: '', dressCode: '', giftNote: '', music: '', gallery: '', events: [], brideFirst: false },
  status: 'READY',
  published_path: 'kiran-anjali',
  published_url: 'https://shaadi.link/kiran-anjali',
  published_at: '2026-11-15T10:00:00Z',
  expires_at: null,
  rejection_reason: null,
  admin_notes: null,
  created_at: '2026-11-15T08:00:00Z',
}

const companyRow = { id: 4, company_name: 'City mart' }
const countResult = { count: 1, error: null, data: null }

function buildChain(ordersResult: unknown, companiesResult: unknown) {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {}
  chain.range = vi.fn().mockResolvedValue(ordersResult)
  chain.order = vi.fn().mockReturnValue({ range: chain.range })
  chain.select = vi.fn()
  chain.rpc = vi.fn().mockResolvedValue(companiesResult)
  chain.from = vi.fn().mockImplementation(() => {
    return {
      select: vi.fn().mockImplementation((_q: string, opts?: { head?: boolean }) => {
        if (opts?.head) return { eq: vi.fn().mockResolvedValue(countResult) }
        return { order: chain.order }
      }),
    }
  })
  return chain
}

let chain: ReturnType<typeof buildChain>

vi.mock('../../lib/supabase', () => {
  chain = buildChain(
    { data: [orderRow], count: 1, error: null },
    { data: [companyRow], error: null },
  )
  return {
    isSupabaseConfigured: true,
    supabase: {
      from: (...args: unknown[]) => chain.from(...args),
      rpc: (...args: unknown[]) => chain.rpc(...args),
      channel: () => ({ on: () => ({ subscribe: () => ({}) }), unsubscribe: vi.fn() }),
      removeChannel: vi.fn(),
    },
  }
})

vi.mock('../../pages/auth/DashboardAccess', () => ({
  DashboardAccess: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  signOutToLogin: vi.fn(),
}))

vi.mock('../../invitations/InvitationRenderer', () => ({
  default: () => <div data-testid="invitation-renderer" />,
}))

describe('AdminDashboard order queries', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    chain = buildChain(
      { data: [orderRow], count: 1, error: null },
      { data: [companyRow], error: null },
    )
  })

  it('fetches company names via admin_company_names RPC', async () => {
    const AdminDashboard = (await import('../AdminDashboard')).default
    render(<MemoryRouter><AdminDashboard /></MemoryRouter>)

    await waitFor(() => {
      expect(chain.rpc).toHaveBeenCalledWith('admin_company_names')
      expect(chain.from).toHaveBeenCalledWith('orders')
    })
  })

  it('renders company name from the merged company lookup', async () => {
    const AdminDashboard = (await import('../AdminDashboard')).default
    render(<MemoryRouter><AdminDashboard /></MemoryRouter>)

    await waitFor(() => {
      expect(screen.getByText('City mart')).toBeInTheDocument()
    })
  })

  it('shows dash when company lookup has no match', async () => {
    chain = buildChain(
      { data: [{ ...orderRow, company_id: 999 }], count: 1, error: null },
      { data: [companyRow], error: null },
    )

    vi.resetModules()
    vi.doMock('../../lib/supabase', () => ({
      isSupabaseConfigured: true,
      supabase: {
        from: (...args: unknown[]) => chain.from(...args),
        rpc: (...args: unknown[]) => chain.rpc(...args),
        channel: () => ({ on: () => ({ subscribe: () => ({}) }), unsubscribe: vi.fn() }),
        removeChannel: vi.fn(),
      },
    }))

    const { default: AdminDashboard } = await import('../AdminDashboard')
    render(<MemoryRouter><AdminDashboard /></MemoryRouter>)

    await waitFor(() => {
      const cells = screen.getAllByText('—')
      expect(cells.length).toBeGreaterThan(0)
    })
  })
})
