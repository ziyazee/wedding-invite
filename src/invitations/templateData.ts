import examples from '../data/template-invitations.json'
import type { InvitationData } from './model'

export const templateInvitationData = examples as Record<number, InvitationData>

export function invitationExample(templateId: number): InvitationData | undefined {
  return templateInvitationData[templateId]
}
