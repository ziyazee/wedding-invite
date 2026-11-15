import type { InvitationData } from './model'

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
] as const

export type LanguageCode = typeof LANGUAGES[number]['code']

export const LOCALE_MAP: Record<string, string> = { hi: 'hi-IN', kn: 'kn-IN', ml: 'ml-IN' }

export function invitationLocale(): string {
  if (typeof document === 'undefined') return 'en-GB'
  const lang = document.documentElement.lang.toLowerCase().slice(0, 2)
  return LOCALE_MAP[lang] || 'en-GB'
}

export const INVITATION_LABELS: Record<string, string> = {
  'label.togetherWithFamilies': 'Together with our families',
  'label.dressCode': 'Dress code',
  'label.giftNote': 'A little note',
  'label.directions': 'Directions',
  'label.saveTheDate': 'Save the date',
  'label.photoGallery': 'Our photo gallery',
  'label.allTimes': 'All times',
}

export function resolveTranslations(d: InvitationData): InvitationData {
  const t = d.language && d.translations?.[d.language]
  if (!t) return d
  const labels: Record<string, string> = {}
  for (const key of Object.keys(INVITATION_LABELS)) {
    if (t[key]) labels[key.replace('label.', '')] = t[key]
  }
  return {
    ...d,
    labels,
    groom: t.groom ?? d.groom,
    bride: t.bride ?? d.bride,
    groomFamily: t.groomFamily ?? d.groomFamily,
    brideFamily: t.brideFamily ?? d.brideFamily,
    message: t.message ?? d.message,
    dressCode: t.dressCode ?? d.dressCode,
    giftNote: t.giftNote ?? d.giftNote,
    venue: t.venue ?? d.venue,
    address: t.address ?? d.address,
    events: d.events.map((event, index) => ({
      ...event,
      title: t[`events.${index}.title`] ?? event.title,
      venue: t[`events.${index}.venue`] ?? event.venue,
      address: t[`events.${index}.address`] ?? event.address,
      ...(event.schedule ? { schedule: event.schedule.map((moment, momentIndex) => ({
        ...moment,
        title: t[`events.${index}.schedule.${momentIndex}.title`] ?? moment.title,
        description: t[`events.${index}.schedule.${momentIndex}.description`] ?? moment.description,
        location: t[`events.${index}.schedule.${momentIndex}.location`] ?? moment.location,
      })) } : {}),
    })),
  }
}
