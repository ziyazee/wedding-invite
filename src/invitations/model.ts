import { readTextLayout } from './textLayout'
import type { TextLayout } from './textLayout'

export const designs = [
  { id: 1, name: 'Royal Grace', description: 'Sage and ivory stationery with pearls and delicate botanical relief.', route: '/mohadrahma', image: '/images/royal-grace/opening-poster.jpg', color: '#8b9274' },
  { id: 2, name: 'Majestic', description: 'Pearl accents, chandeliers and grand garden scenes.', route: '/design6', image: '/design6/assets/hero-poster-DkA1j00-.jpg', color: '#e9dfca' },
  { id: 3, name: 'A Timeless Union', description: 'A traditional Hindu wedding invitation with family blessings, a mehendi celebration, and a photo story.', route: '/arjunbhavana', image: '/landing/timeless-union-opening.jpg', color: '#f8f2e9' },
  { id: 4, name: 'Mandap at Dusk', description: 'A sunset mandap reveal with a cinematic curtain opening and a personal name reveal.', route: '/design18', image: '/design18/preview.jpg', color: '#d19b72' },
  { id: 5, name: 'Secret Garden', description: 'Romantic garden scenery and delicate floral details.', route: '/design5', image: '/design5/assets/opened.jpg', color: '#d6d8c3' },
  { id: 6, name: 'Embroidered Garden', description: 'Garden illustrations and soft embroidered textures.', route: '/design3', image: '/design3/assets/footer-chateau.png', color: '#dce2cd' },
  { id: 7, name: 'Bloom', description: 'Expressive florals and a beautifully animated welcome.', route: '/design7', image: '/design7/assets/welcome-flowers-Dy0evJgO.png', color: '#e9c9bd' },
  { id: 8, name: 'The Artful Love Story', description: 'An ornate Indian wedding invitation with a photo story, celebration details, and a countdown.', route: '/design13', image: '/design13/assets/zBRd2fZShor1nxxKvdVKhKU.png', color: '#fbf5ed' },
] as const
export interface Celebration { id?: string; title: string; date: string; time: string; venue: string; address: string; map: string }
export function nameTextLimit(template: number, field: string): number | undefined {
  return [2,3,5,6,7].includes(template) && (field==='groom'||field==='bride') ? 40 : undefined
}
export function cardTextLimit(template: number, field: string): number | undefined {
  return [2,3,5,6,7].includes(template) ? ({ title: 40, venue: 60, address: 100 } as Record<string, number>)[field] : undefined
}
export interface InvitationData {
  textOverrides?: TextLayout;
  showCoupleIllustrations?: boolean;
  template: number; groom: string; bride: string; date: string; time: string; offset: string;
  venue: string; address: string; map: string; message: string; groomFamily: string; brideFamily: string;
  dressCode: string; giftNote: string; music: string; gallery: string; events: Celebration[];
}
export interface SavedInvitation { slug: string; details: InvitationData; createdAt: string; orderId?: string }
export const weddingISO = (d: InvitationData) => `${d.date}T${d.time}:00${d.offset}`
export const formatDate = (date: string, options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }) => new Date(`${date}T12:00:00Z`).toLocaleDateString('en-GB', { ...options, timeZone: 'UTC' })
export const formatTime = (time: string) => new Date(`2000-01-01T${time}:00Z`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' })
export const mapURL = (venue: string, address: string, url = '') => url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue}, ${address}`)}`
export function nameSlug(groom: string, bride: string) {
  return `${groom}${bride}`.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 80) || 'wedding'
}
export const reservedSlugs = new Set(['assets','images','fonts','dashboard','client','admin','login','create','preview','invite','newdesign','mohadrahma','api','arjunmeera','rohankavya','aarongrace','danielsarah','vikramananya','nikhiladiti',...Array.from({ length: 16 }, (_, index) => `design${index + 3}`)])
export function validateDetails(value: unknown, allowRetired = false): InvitationData {
  if (!value || typeof value !== 'object') throw new Error('Invitation details are required.')
  const d = value as InvitationData
  if(d.showCoupleIllustrations!==undefined&&typeof d.showCoupleIllustrations!=='boolean')throw new Error('Choose a valid illustration setting.')
  if (!designs.some(t => t.id === d.template) && !(allowRetired && [101, 104, 108, 109, 110, 111, 112, 115, 116, 117].includes(d.template))) throw new Error('Choose an available invitation template.')
  const text = (v: unknown, label: string, max: number, required = false) => {
    if (typeof v !== 'string' || v.length > max || (required && !v.trim())) throw new Error(`Please enter a valid ${label}.`)
    return v.trim()
  }
  const date = (v: unknown) => {
    if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v) || !Number.isFinite(Date.parse(`${v}T12:00:00Z`)) || new Date(`${v}T12:00:00Z`).toISOString().slice(0,10) !== v) throw new Error('Enter a valid event date.')
    return v
  }
  const time = (v: unknown) => {
    if (typeof v !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(v)) throw new Error('Enter a valid event time.')
    return v
  }
  const url = (v: unknown, label: string) => {
    const s = text(v, label, 2000)
    if (s && !/^https?:\/\//i.test(s)) throw new Error(`${label} must start with https:// or http://.`)
    if (s) { const parsed = new URL(s); if (parsed.username || parsed.password) throw new Error(`Invalid ${label}.`) }
    return s
  }
  if (typeof d.offset !== 'string' || !/^[+-](0\d|1[0-4]):(00|15|30|45)$/.test(d.offset)) throw new Error('Choose a valid time zone offset.')
  if (!Array.isArray(d.events) || d.events.length < 1 || d.events.length > 10) throw new Error('Add between one and ten celebrations.')
  return {
    textOverrides: readTextLayout(d.textOverrides),
    showCoupleIllustrations:d.showCoupleIllustrations !== false,
    template:d.template, groom:text(d.groom,'groom name',nameTextLimit(d.template,'groom') ?? 80,true), bride:text(d.bride,'bride name',nameTextLimit(d.template,'bride') ?? 80,true), date:date(d.date), time:time(d.time), offset:d.offset,
    venue:text(d.venue,'venue',cardTextLimit(d.template,'venue') ?? 160,true),address:text(d.address,'address',cardTextLimit(d.template,'address') ?? 300,true),map:url(d.map,'map link'),
    message:text(d.message,'welcome message',2000),groomFamily:text(d.groomFamily,'groom family',200),brideFamily:text(d.brideFamily,'bride family',200),
    dressCode:text(d.dressCode,'dress code',600),giftNote:text(d.giftNote,'gift note',600),music:url(d.music,'music link'),gallery:url(d.gallery,'gallery link'),
    events:d.events.map(e=>({...(typeof e.id==='string'&&/^[a-zA-Z0-9_-]{1,80}$/.test(e.id)?{id:e.id}:{}),title:text(e.title,'celebration name',cardTextLimit(d.template,'title') ?? 100,true),date:date(e.date),time:time(e.time),venue:text(e.venue,'celebration venue',cardTextLimit(d.template,'venue') ?? 160,true),address:text(e.address,'celebration address',cardTextLimit(d.template,'address') ?? 300,true),map:url(e.map,'map link')})),
  }
}
