// Plain ESM shared by Vite and the server endpoint. No browser or SDK imports.
// These are sharing artworks, separate from the invitation route catalogue.
const artworks = {
  1: ['Royal Grace', '/templates/royal-grace/opening-poster.webp'],
  2: ['Majestic', '/templates/majestic/assets/hero-poster-DkA1j00-.jpg'],
  3: ['A Timeless Union', '/templates/a-timeless-union/timeless-union-opening.jpg'],
  4: ['Mandap at Dusk', '/templates/mandap-at-dusk/preview.jpg'],
  5: ['Secret Garden', '/templates/secret-garden/assets/opened.jpg'],
  6: ['Embroidered Garden', '/templates/embroidered-garden/assets/intro-curtains-opt.webp'],
  7: ['Bloom', '/templates/bloom/assets/intro-video-2-poster.jpg'],
  8: ['The Artful Love Story', '/templates/the-artful-love-story/assets/zBRd2fZShor1nxxKvdVKhKU.png'],
  9: ['Maroon Letter', '/templates/maroon-letter/demo.webp'],
  10: ['Emerald Parchment', '/templates/emerald-parchment/demo.webp'],
  11: ['Royal Jodhpur', '/templates/shaadipath-t02/assets/layers/Herp Palace.webp'],
  12: ['Destination Wedding', '/templates/destination-wedding/wedding/background_gate.webp'],
  13: ['Raabta', '/templates/raabta/assets/mosque-scene.webp'],
  14: ['Qubool', '/templates/qubool/assets/gate/00-gate.webp'],
  15: ['Mangal', '/templates/mangal/assets/gate/00-gate-p.webp'],
  16: ['Viah', '/templates/viah/assets/gate/00-gate-p.png'],
  17: ['Tajmahal', '/templates/tajmahal/assets/opening-poster.jpg'],
  18: ['Kerala', '/templates/kerala/assets/opening-poster.jpg'],
}
export const shareTitleLimit = 140
export const shareDescriptionLimit = 300
const plainText = (value, limit) => typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, limit) : ''

export function invitationSharePreview(details, defaultsOnly = false) {
  const names = details.brideFirst === true ? [details.bride, details.groom] : [details.groom, details.bride]
  const couple = names.map(name => plainText(name, 80)).filter(Boolean).join(' & ') || 'Our wedding'
  let date = ''
  if (typeof details.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(details.date)) {
    const parsed = new Date(`${details.date}T12:00:00Z`)
    if (Number.isFinite(parsed.getTime())) date = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(parsed)
  }
  const venue = plainText(details.venue, 160)
  const design = Object.hasOwn(artworks, details.template) ? artworks[details.template] : artworks[1]
  return {
    title: (!defaultsOnly && plainText(details.shareTitle, shareTitleLimit)) || plainText(`${couple} | Wedding Invitation`, shareTitleLimit),
    description: (!defaultsOnly && plainText(details.shareDescription, shareDescriptionLimit)) || plainText([date, venue, 'Join us to celebrate our wedding.'].filter(Boolean).join(' · '), shareDescriptionLimit),
    image: design[1],
    imageAlt: `${design[0]} artwork for ${couple}`,
  }
}
