import { readTextLayout } from './textLayout.ts'
import type { TextLayout } from './textLayout.ts'
import { catalogMusicPath, isCatalogMusic } from './musicCatalog.ts'

export const TEMPLATE_DISPLAY_ORDER: Record<number, number> = { 2:1, 6:2, 13:3, 14:4, 7:5, 5:6, 1:7, 3:8, 15:9, 4:10, 16:11, 17:12, 18:13 }
export const designs = [
  { id: 1, name: 'Royal Grace', description: 'Sage and ivory stationery with pearls and delicate botanical relief.', route: '/royal-grace', image: '/templates/royal-grace/opening-poster.jpg', color: '#8b9274' },
  { id: 2, name: 'Majestic', description: 'Pearl accents, chandeliers and grand garden scenes.', route: '/majestic', image: '/templates/majestic/assets/hero-poster-DkA1j00-.jpg', color: '#e9dfca' },
  { id: 3, name: 'A Timeless Union', description: 'A traditional Hindu wedding invitation with family blessings, a mehendi celebration, and a photo story.', route: '/arjunbhavana', image: '/templates/a-timeless-union/timeless-union-opening.jpg', color: '#f8f2e9' },
  { id: 4, name: 'Mandap at Dusk', description: 'A sunset mandap reveal with a cinematic curtain opening and a personal name reveal.', route: '/mandap-at-dusk', image: '/templates/mandap-at-dusk/preview.jpg', color: '#d19b72' },
  { id: 5, name: 'Secret Garden', description: 'Romantic garden scenery and delicate floral details.', route: '/secret-garden', image: '/templates/secret-garden/assets/opened.jpg', color: '#d6d8c3' },
  { id: 6, name: 'Embroidered Garden', description: 'Garden illustrations and soft embroidered textures.', route: '/embroidered-garden', image: '/templates/embroidered-garden/assets/footer-chateau-opt.webp', color: '#dce2cd' },
  { id: 7, name: 'Bloom', description: 'Expressive florals and a beautifully animated welcome.', route: '/bloom', image: '/templates/bloom/assets/welcome-flowers-Dy0evJgO.webp', color: '#e9c9bd' },
  { id: 8, name: 'The Artful Love Story', description: 'An ornate Indian wedding invitation with a photo story, celebration details, and a countdown.', route: '/the-artful-love-story', image: '/templates/the-artful-love-story/assets/zBRd2fZShor1nxxKvdVKhKU.png', color: '#fbf5ed' },
  { id: 9, name: 'Maroon Letter', description: 'Cinematic maroon stationery and lanterns.', route: '/maroon-letter', image: '/templates/maroon-letter/demo.webp', color: '#31090e' },
  { id: 10, name: 'Emerald Parchment', description: 'Forest green parchment with a cinematic opening.', route: '/emerald-parchment', image: '/templates/emerald-parchment/demo.webp', color: '#0f1e16' },
  { id: 11, name: 'Royal Jodhpur', description: 'Midnight blue and gold palace celebrations.', route: '/royal-jodhpur', image: '/templates/shaadipath-t02/assets/layers/Herp Palace.webp', color: '#0d1b3e' },
  { id: 12, name: 'Destination Wedding', description: 'A cinematic destination wedding invitation with couple photos and travel details.', route: '/destination-wedding', image: '/templates/destination-wedding/wedding/background_gate.webp', color: '#1a3a2a' },
  { id: 13, name: 'Raabta', description: 'Moonlit mosque scenery with floating lanterns and ornate arches.', route: '/raabta', image: '/templates/raabta/assets/mosque-scene.webp', color: '#1b2838' },
  { id: 14, name: 'Qubool', description: 'Ornate jaali patterns with a cinematic gate reveal.', route: '/qubool', image: '/templates/qubool/assets/gate/00-gate.webp', color: '#2a1f1a' },
  { id: 15, name: 'Mangal', description: 'Cinematic mandap scenes with sacred fire and vermillion-gold palette.', route: '/mangal', image: '/templates/mangal/assets/gate/00-gate-p.webp', color: '#8B1A1A' },
  { id: 16, name: 'Viah', description: 'Bold Punjabi wedding vibes with hot pink, gold, and phulkari motifs.', route: '/viah', image: '/templates/viah/assets/gate/00-gate-p.webp', color: '#FF1493' },
  { id: 17, name: 'Tajmahal', description: 'A moonlit palace invitation with family blessings and a cinematic opening.', route: '/tajmahal', image: '/templates/tajmahal/assets/opening-poster.jpg', color: '#101a30' },
  { id: 18, name: 'Kerala', description: 'A lush tropical invitation with backwater serenity and Kerala wedding traditions.', route: '/kerala', image: '/templates/kerala/assets/opening-poster.jpg', color: '#0a1a0f' },
] as const
export interface WeddingMoment { id: string; time: string; title: string; description: string; location: string }
export interface Celebration { id?: string; title: string; date: string; time?: string; venue: string; address: string; map: string; schedule?: WeddingMoment[] }
export function nameTextLimit(template: number, field: string): number | undefined {
  return [2,3,5,6,7].includes(template) && (field==='groom'||field==='bride') ? 40 : undefined
}
export function cardTextLimit(template: number, field: string): number | undefined {
  return [2,3,5,6,7].includes(template) ? ({ title: 40, venue: 60, address: 100 } as Record<string, number>)[field] : undefined
}
export interface InvitationData {
  layoutVersion?: 1 | 2;
  textOverrides?: TextLayout;
  showCoupleIllustrations?: boolean;
  brideFirst?: boolean;
  template: number; groom: string; bride: string; date: string; time: string; offset: string;
  venue: string; address: string; map: string; message: string; groomFamily: string; brideFamily: string;
  dressCode: string; giftNote: string; music: string; gallery: string; events: Celebration[];
  musicStart?: number; musicEnd?: number;
  companyLogo?: string; companyName?: string; companyPhone?: string;
}
export const COMPANY_WHATSAPP_MESSAGE = 'Hi, I need a wedding invitation like this. Could you share the details and pricing?'
export function companyWhatsAppURL(phone?: string): string | undefined {
  const digits = phone?.replace(/\D/g, '') || ''
  const number = digits.length === 10 ? `91${digits}` : digits.length >= 11 && digits.length <= 15 ? digits : ''
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(COMPANY_WHATSAPP_MESSAGE)}` : undefined
}
export interface SavedInvitation { slug: string; details: InvitationData; createdAt: string; orderId?: string }
export const weddingISO = (d: InvitationData) => `${d.date}T${d.time || '00:00'}:00${d.offset}`
export const formatDate = (date: string, options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }) => new Date(`${date}T12:00:00Z`).toLocaleDateString('en-GB', { ...options, timeZone: 'UTC' })
export const formatTime = (time: string) => { if (!time) return ''; return new Date(`2000-01-01T${time}:00Z`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }) }
export const mapURL = (venue: string, address: string, url = '') => url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue}, ${address}`)}`
export function nameSlug(groom: string, bride: string) {
  return `${groom}${bride}`.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 80) || 'wedding'
}
const gluedHonorific = /^(dr|mr|mrs|ms|prof|rev|sr|jr|st|smt|shri|haj|hajj)\.(\S)/i
export function displayName(s: string) {
  return s
    .replace(gluedHonorific, (_, prefix, ch) => `${prefix}. ${ch}`)
    .replace(/(^|\n|\s)(\S)/g, (_, sep, ch) => `${sep}${ch.toUpperCase()}`)
}
function normName(s: string) {
  return s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 35)
}
export function slugVariants(groom: string, bride: string, brideFirst = false): string[] {
  const first = normName(brideFirst ? bride : groom)
  const second = normName(brideFirst ? groom : bride)
  const base = first && second ? `${first}${second}` : first || second || 'wedding'
  return [
    base,
    `${first}weds${second}`,
    `${first}and${second}`,
    `${first}-${second}`,
    `${first}marries${second}`,
    `${first}with${second}`,
    `${base}wedding`,
  ]
}
export function inviteUrl(slug: string): string {
  const w = globalThis as any
  const host: string = w.location?.hostname ?? ''
  if (host && !host.endsWith('.shaadiinvites.in') && host !== 'shaadiinvites.in') {
    return `${w.location.origin}/${slug}`
  }
  return `https://www.shaadiinvites.in/${slug}`
}
// Saved URLs may predate the move from invitation subdomains to paths.
// Keep the reserved path as the source of truth for every displayed/shared link.
export function withCurrentInviteUrl<T extends { published_path: string | null; published_url: string | null }>(order: T): T {
  return order.published_path && order.published_url
    ? { ...order, published_url: inviteUrl(order.published_path) }
    : order
}
export function companyPreviewUrl(companySlug: string): string {
  const w = globalThis as any
  const host: string = w.location?.hostname ?? ''
  if (host && !host.endsWith('.shaadiinvites.in') && host !== 'shaadiinvites.in') {
    return `${w.location.origin}/preview?invite=${companySlug}`
  }
  return `https://${companySlug}.shaadiinvites.in/preview`
}
export const reservedSlugs = new Set(['assets','images','fonts','dashboard','client','admin','login','create','preview','invite','newdesign','royal-grace','api','arjunmeera','rohankavya','aarongrace','danielsarah','vikramananya','nikhiladiti','embroidered-garden','secret-garden','majestic','bloom','the-artful-love-story','arjunbhavana','a-timeless-union','mandap-at-dusk','maroon-letter','emerald-parchment','royal-jodhpur','destination-wedding','raabta','qubool','blossom-and-oud','noor','sunehri','yasmin','maitri','kiran','ivory-arch','mangal','gulabi-mandap','viah','tajmahal','kerala','birthday','housewarming'])
export function validateDetails(value: unknown, allowRetired = false): InvitationData {
  if (!value || typeof value !== 'object') throw new Error('Invitation details are required.')
  const d = value as InvitationData
  for (const point of [d.musicStart, d.musicEnd]) {
    if (point !== undefined && (typeof point !== 'number' || !Number.isFinite(point) || point < 0)) throw new Error('Choose a valid music playback range.')
  }
  if (d.musicEnd !== undefined && d.musicEnd <= (d.musicStart ?? 0)) throw new Error('Music must end after its start time.')
  if(d.showCoupleIllustrations!==undefined&&typeof d.showCoupleIllustrations!=='boolean')throw new Error('Choose a valid illustration setting.')
  if(d.brideFirst!==undefined&&typeof d.brideFirst!=='boolean')throw new Error('Choose a valid couple name order.')
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
    if (typeof v === 'string' && !v.trim()) return ''
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
  if (d.layoutVersion !== undefined && d.layoutVersion !== 1 && d.layoutVersion !== 2) throw new Error('Choose a valid invitation layout.')
  const schedule = (items: unknown): WeddingMoment[] => {
    if (items === undefined) return []
    if (!Array.isArray(items) || items.length > 12) throw new Error('Add up to twelve wedding day moments.')
    const ids = new Set<string>()
    return items.map(item => {
      if (!item || typeof item !== 'object' || typeof item.id !== 'string' || !/^[a-zA-Z0-9_-]{1,80}$/.test(item.id) || ids.has(item.id)) throw new Error('Invalid wedding day moment. Remove it and add it again.')
      ids.add(item.id)
      return { id: item.id, time: time(item.time), title: text(item.title, 'schedule title', 80, true), description: text(item.description ?? '', 'schedule description', 300), location: text(item.location ?? '', 'schedule location', 160) }
    })
  }
  return {
    ...(d.layoutVersion !== undefined ? { layoutVersion: d.layoutVersion } : {}),
    textOverrides: readTextLayout(d.textOverrides),
    showCoupleIllustrations:d.showCoupleIllustrations !== false,
    brideFirst:d.brideFirst === true,
    template:d.template, groom:displayName(text(d.groom,'groom name',nameTextLimit(d.template,'groom') ?? 80,true)), bride:displayName(text(d.bride,'bride name',nameTextLimit(d.template,'bride') ?? 80,true)), date:date(d.date), time:time(d.time), offset:d.offset,
    venue:text(d.venue,'venue',cardTextLimit(d.template,'venue') ?? 160,true),address:text(d.address,'address',cardTextLimit(d.template,'address') ?? 300,true),map:url(d.map,'map link'),
    message:text(d.message,'welcome message',2000),groomFamily:text(d.groomFamily,'groom family',200),brideFamily:text(d.brideFamily,'bride family',200),
    dressCode:text(d.dressCode,'dress code',600),giftNote:text(d.giftNote,'gift note',600),music:isCatalogMusic(d.music) ? catalogMusicPath(d.music) : url(d.music,'music link'),gallery:url(d.gallery,'gallery link'),
    ...(d.musicStart !== undefined ? { musicStart: d.musicStart } : {}),
    ...(d.musicEnd !== undefined ? { musicEnd: d.musicEnd } : {}),
    events:d.events.map(e=>({...(typeof e.id==='string'&&/^[a-zA-Z0-9_-]{1,80}$/.test(e.id)?{id:e.id}:{}),...(e.schedule !== undefined ? { schedule: schedule(e.schedule) } : {}),title:text(e.title,'celebration name',cardTextLimit(d.template,'title') ?? 100,true),date:date(e.date),time:time(e.time),venue:text(e.venue,'celebration venue',cardTextLimit(d.template,'venue') ?? 160,true),address:text(e.address,'celebration address',cardTextLimit(d.template,'address') ?? 300,true),map:url(e.map,'map link')})),
    ...(typeof d.companyLogo === 'string' && d.companyLogo ? { companyLogo: d.companyLogo } : {}),
    ...(typeof d.companyName === 'string' && d.companyName ? { companyName: d.companyName } : {}),
    ...(typeof d.companyPhone === 'string' && d.companyPhone ? { companyPhone: d.companyPhone } : {}),
  }
}
