import type { InvitationData } from './model.ts'

export const shareTitleLimit: 140
export const shareDescriptionLimit: 300
type ShareDetails = Partial<Pick<InvitationData, 'template' | 'groom' | 'bride' | 'brideFirst' | 'date' | 'venue' | 'shareTitle' | 'shareDescription'>>
export function invitationSharePreview(details: ShareDetails, defaultsOnly?: boolean): {
  title: string
  description: string
  image: string
  imageAlt: string
}
