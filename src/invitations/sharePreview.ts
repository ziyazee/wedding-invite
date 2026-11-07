import { designs } from './model.ts'
import type { InvitationData } from './model.ts'
import { TEMPLATE_THUMBNAIL_OVERRIDES } from '../lib/templateCardData.ts'

export const shareTitleLimit = 140
export const shareDescriptionLimit = 300
type ShareDetails = Partial<Pick<InvitationData, 'template' | 'groom' | 'bride' | 'brideFirst' | 'date' | 'venue' | 'shareTitle' | 'shareDescription'>>
const plainText = (value: unknown, limit: number) => typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, limit) : ''
// Viah's available portrait gate is PNG; its older catalogue WebP is absent.
const shareImageOverrides: Record<number, string> = { ...TEMPLATE_THUMBNAIL_OVERRIDES, 16: '/templates/viah/assets/gate/00-gate-p.png' }

// The form and sharing crawlers use the same copy and artwork selection.
export function invitationSharePreview(details: ShareDetails, defaultsOnly = false) {
  const names = details.brideFirst ? [details.bride, details.groom] : [details.groom, details.bride]
  const couple = names.map(name => plainText(name, 80)).filter(Boolean).join(' & ') || 'Our wedding'
  let date = ''
  if (typeof details.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(details.date)) {
    const parsed = new Date(`${details.date}T12:00:00Z`)
    if (Number.isFinite(parsed.getTime())) date = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(parsed)
  }
  const venue = plainText(details.venue, 160)
  const design = designs.find(item => item.id === details.template)
  return {
    title: (!defaultsOnly && plainText(details.shareTitle, shareTitleLimit)) || plainText(`${couple} | Wedding Invitation`, shareTitleLimit),
    description: (!defaultsOnly && plainText(details.shareDescription, shareDescriptionLimit)) || plainText([date, venue, 'Join us to celebrate our wedding.'].filter(Boolean).join(' · '), shareDescriptionLimit),
    image: (details.template && shareImageOverrides[details.template]) || design?.image || shareImageOverrides[1],
    imageAlt: `${design?.name || 'Wedding invitation'} artwork for ${couple}`,
  }
}
