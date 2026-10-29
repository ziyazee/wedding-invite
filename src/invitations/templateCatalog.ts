import { isSupabaseConfigured, supabase } from '../lib/supabase'

export type InvitationTemplate = {
  id: number
  template_code: string
  name: string
  category: string
  thumbnail_url: string
  preview_url: string
  is_active: boolean
  company_id?: number | null
}

/** Supabase is the source of truth for template identity and visibility. */
export async function loadTemplateCatalog(activeOnly = true): Promise<InvitationTemplate[]> {
  if (!supabase || !isSupabaseConfigured) throw new Error('Template catalog is not configured.')
  const { data, error } = await supabase
    .from('invitation_templates')
    .select('id,template_code,name,category,thumbnail_url,preview_url,is_active')
    .order('id')
  if (error) throw error
  const templates = (data || []) as InvitationTemplate[]
  return activeOnly ? templates.filter(template => template.is_active) : templates
}
