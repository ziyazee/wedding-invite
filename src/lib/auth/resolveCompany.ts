import { supabase } from '../supabase'

export type Company = {
  id: number
  company_name: string
  contact_name: string | null
  slug: string | null
  phone: string | null
  branding_base_url: string | null
  catalog_restricted: boolean
  is_test_account?: boolean
}

export async function getCompanyByEmail(email: string): Promise<Company | null> {
  if (!supabase || !email) return null
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .ilike('email', email)
    .maybeSingle()
  if (error || !data) return null
  return data as Company
}
