type CompanyAssets = { slug: string | null; branding_base_url?: string | null; hero_image_path?: string | null }

/** Uploaded stores and existing repository assets use the same slug filenames. */
export function companyAssetURL(company: CompanyAssets | null | undefined, kind: 'logo' | 'banner'): string | undefined {
  if (!company?.slug) return undefined
  if (kind === 'banner' && company.branding_base_url && !company.hero_image_path) return undefined
  const base = (company.branding_base_url || '').replace(/\/$/, '')
  return `${base}/${kind === 'logo' ? 'company-logos' : 'landing'}/${encodeURIComponent(company.slug)}.png`
}
