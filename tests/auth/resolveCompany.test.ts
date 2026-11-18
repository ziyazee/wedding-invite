import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockMaybeSingle = vi.fn()
const mockIlike = vi.fn(() => ({ maybeSingle: mockMaybeSingle }))
const mockSelect = vi.fn(() => ({ ilike: mockIlike }))
const mockFrom = vi.fn(() => ({ select: mockSelect }))

vi.mock('../../src/lib/supabase', () => ({
  supabase: { from: (...args: unknown[]) => mockFrom(...args) },
  isSupabaseConfigured: true,
}))

import { getCompanyByEmail } from '../../src/lib/auth/resolveCompany'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('getCompanyByEmail', () => {
  it('returns null for empty email', async () => {
    expect(await getCompanyByEmail('')).toBe(null)
    expect(mockFrom).not.toHaveBeenCalled()
  })

  it('queries companies with ilike (case-insensitive)', async () => {
    const company = { id: 1, company_name: 'TestCo', contact_name: null, slug: 'testco', phone: null, branding_base_url: null, catalog_restricted: false }
    mockMaybeSingle.mockResolvedValue({ data: company, error: null })

    const result = await getCompanyByEmail('Store@Company.com')

    expect(mockFrom).toHaveBeenCalledWith('companies')
    expect(mockSelect).toHaveBeenCalledWith('*')
    expect(mockIlike).toHaveBeenCalledWith('email', 'Store@Company.com')
    expect(result).toEqual(company)
  })

  it('returns null on Supabase error', async () => {
    mockMaybeSingle.mockResolvedValue({ data: null, error: { message: 'DB error' } })

    const result = await getCompanyByEmail('user@example.com')
    expect(result).toBe(null)
  })

  it('returns null when no matching company', async () => {
    mockMaybeSingle.mockResolvedValue({ data: null, error: null })

    const result = await getCompanyByEmail('nobody@example.com')
    expect(result).toBe(null)
  })
})
