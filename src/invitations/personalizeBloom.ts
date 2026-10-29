import type { InvitationData } from './model'
import { formatDate, formatTime, mapURL } from './model'
import { wrapCardText } from './cardContentFit'
import type { RsvpTarget } from './rsvp'

export type ThemeConfig = { names: string[]; floral: string; frame: string; bg: string; ink: string }

const cardinalWords = (value: number) => {
 const small = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen']
 const tens = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety']
 return value < 20 ? small[value] : `${tens[Math.floor(value / 10)]}${value % 10 ? `-${small[value % 10]}` : ''}`
}

const ordinalWords = ['','first','second','third','fourth','fifth','sixth','seventh','eighth','ninth','tenth','eleventh','twelfth','thirteenth','fourteenth','fifteenth','sixteenth','seventeenth','eighteenth','nineteenth','twentieth','twenty-first','twenty-second','twenty-third','twenty-fourth','twenty-fifth','twenty-sixth','twenty-seventh','twenty-eighth','twenty-ninth','thirtieth','thirty-first']

function bloomDateCopy(iso: string) {
 const date = new Date(`${iso}T12:00:00Z`)
 const weekday = new Intl.DateTimeFormat('en-GB', { weekday: 'long', timeZone: 'UTC' }).format(date)
 const month = new Intl.DateTimeFormat('en-GB', { month: 'long', timeZone: 'UTC' }).format(date)
 const year = date.getUTCFullYear()
 const yearWords = year === 2000 ? 'two thousand' : year > 2000 && year < 2100 ? `two thousand ${cardinalWords(year - 2000)}` : String(year)
 return [`on ${weekday}`, `the ${ordinalWords[date.getUTCDate()]} of ${month}`, yearWords]
}

export async function personalizeBloom(
 doc: Document,
 personal: HTMLElement,
 d: InvitationData,
 _theme: ThemeConfig,
 events: typeof d.events,
 rsvpTarget: RsvpTarget | undefined,
 signal: AbortSignal,
): Promise<{ welcome: HTMLElement; ending: DocumentFragment }> {
 const bloomWelcome = doc.querySelector<HTMLElement>('section#welcome')!
 const bloomCeremony = doc.querySelector<HTMLElement>('section#wedding-events')!
 const bloomFooter = doc.querySelector('footer')!
 personal.classList.add('atelier-bloom-rules')
 personal.querySelectorAll<HTMLElement>(':scope > .atelier-note').forEach(note => {
  const heading = note.querySelector('h2')?.textContent
  if (heading === 'Dress code') {
   note.hidden = !d.dressCode.trim()
   const art = doc.createElement('img')
   art.src = '/templates/bloom/assets/black-tie-illustration-Bzqxj15v.webp'
   art.alt = 'Wedding attire illustration'
   art.setAttribute('data-couple-illustration', '')
   art.hidden = d.showCoupleIllustrations === false
   note.append(art)
  }
  if (heading === 'A little note') note.hidden = !d.giftNote.trim()
  if (note.querySelector('a')) note.hidden = !d.gallery.trim()
 })
 const weddingEvent = d.events[0]
 const weddingEventIndex = events.indexOf(weddingEvent)
 const ceremonyCard = personal.querySelectorAll<HTMLElement>('.atelier-event')[weddingEventIndex]
 if (!bloomCeremony || !weddingEvent || !ceremonyCard) throw new Error('Could not load the Bloom celebration layout.')
 const ceremonyCopy = bloomCeremony.querySelector('[data-reveal]')
 const sectionHeading = ceremonyCopy?.querySelector('h2')
 const venue = ceremonyCopy?.querySelector('h3')
 const location = venue?.nextElementSibling
 const details = ceremonyCopy?.querySelector(':scope > .space-y-3')
 const dateRow = details?.firstElementChild
 const date = dateRow?.firstElementChild
 const time = dateRow?.lastElementChild
 const address = details?.lastElementChild
 if (!sectionHeading || !venue || !location || !date || !time || !address) throw new Error('Could not load the Bloom celebration details.')
 bloomCeremony.classList.add('atelier-bloom-ceremony')
 const nativeFrame = bloomCeremony.querySelector<HTMLElement>('[style*="aspect-ratio"]')!
 nativeFrame.setAttribute('data-bloom-card', 'image')
 ceremonyCopy!.setAttribute('data-bloom-copy', '')
 sectionHeading.textContent = wrapCardText(weddingEvent.title, 18)
 venue.textContent = wrapCardText(weddingEvent.venue, 24)
 venue.classList.remove('whitespace-nowrap')
 const addressParts = weddingEvent.address.split(/\n|,\s*/).map(part => part.trim()).filter(Boolean)
 const locality = weddingEvent.address.includes('\n') ? '' : addressParts.slice(1).join(', ')
 location.textContent = wrapCardText(locality, 32)
 location.classList.remove('whitespace-nowrap')
 if (!locality) location.remove()
 const eventDate = new Date(`${weddingEvent.date}T12:00:00Z`)
 const day = eventDate.getUTCDate()
 const suffix = day % 100 >= 11 && day % 100 <= 13 ? 'th' : (['th','st','nd','rd'][day % 10] || 'th')
 date.children[0].textContent = `${formatDate(weddingEvent.date, { weekday: 'long' })}, ${day}${suffix}`
 date.children[1].textContent = `of ${formatDate(weddingEvent.date, { month: 'long', year: 'numeric' }).replace(/ (\d{4})$/, ', $1')}`
 time.textContent = formatTime(weddingEvent.time)
 address.children[0].textContent = wrapCardText(weddingEvent.address.includes('\n') ? weddingEvent.address : addressParts[0] || '', 32)
 address.children[1].textContent = wrapCardText(locality, 32)
 if (!locality) address.children[1].remove()
 const venueArt = bloomCeremony.querySelector('img')
 if (venueArt) venueArt.alt = ''
 const controls = bloomCeremony.lastElementChild
 const originalButtons = controls?.querySelectorAll('button')
 if (originalButtons?.length === 2) {
  const directions = doc.createElement('a')
  directions.className = originalButtons[0].className
  directions.textContent = 'Open in Maps'
  directions.href = mapURL(weddingEvent.venue, weddingEvent.address, weddingEvent.map)
  directions.hidden = !weddingEvent.map.trim()
  directions.target = '_blank'
  directions.rel = 'noreferrer'
  originalButtons[0].replaceWith(directions)
  const calendar = originalButtons[1]
  calendar.textContent = 'Add to calendar'
  calendar.setAttribute('data-personal-calendar', '0')
  for (const attribute of ['id','aria-haspopup','aria-expanded','data-state']) calendar.removeAttribute(attribute)
 }
 ceremonyCard.remove()
 personal.querySelectorAll<HTMLElement>('.atelier-event').forEach(card => {
  card.setAttribute('data-bloom-card', 'video')
  const video = doc.createElement('video')
  video.src = '/templates/bloom/assets/hum.mov'
  video.autoplay = true
  video.loop = true
  video.muted = true
  video.defaultMuted = true
  video.setAttribute('muted', '')
  video.playsInline = true
  video.preload = 'metadata'
  video.setAttribute('aria-hidden', 'true')
  video.tabIndex = -1
  video.style.cssText = 'display:block;grid-area:1 / 1;width:100%;height:auto;align-self:center;pointer-events:none'
  card.style.backgroundImage = 'none'
  card.style.padding = '0'
  card.style.minHeight = '0'
  card.style.gridTemplateColumns = 'minmax(0,1fr)'
  card.prepend(video)
  const copy = card.querySelector<HTMLElement>('.atelier-event-copy')
  if (copy) {
   copy.style.gridArea = '1 / 1'
   copy.style.position = 'relative'
   copy.style.zIndex = '1'
   copy.style.padding = '0'
   copy.setAttribute('data-bloom-copy', '')
  }
 })
 const welcomeContent = bloomWelcome?.querySelector<HTMLElement>(':scope > div')
 welcomeContent?.style.setProperty('padding-top', '40px')
 const familyIntro = welcomeContent?.querySelector(':scope > p')
 const nameBlock = welcomeContent?.querySelector(':scope > .space-y-2')
 const nameHeadings = nameBlock?.querySelectorAll('h3')
 const connector = nameBlock?.querySelector('p')
 const messageBlock = welcomeContent?.querySelector(':scope > .space-y-6')
 const welcomeMessage = messageBlock?.querySelector(':scope > p')
 const dateBlock = messageBlock?.querySelector(':scope > div')
 const weekday = dateBlock?.querySelector('span')
 const writtenDate = dateBlock?.querySelector('p')
 if (!bloomWelcome || !familyIntro || !nameHeadings || nameHeadings.length !== 2 || !connector || !messageBlock || !welcomeMessage || !weekday || !writtenDate) {
  throw new Error('Could not load the Bloom welcome layout.')
 }
 familyIntro.textContent = personal.querySelector('.atelier-welcome .atelier-eyebrow')?.textContent || ''
 nameHeadings[0].textContent = d.groom
 nameHeadings[1].textContent = d.bride
 connector.textContent = '&'
 bloomWelcome.classList.add('atelier-bloom-welcome')
 nameBlock!.classList.remove('space-y-2')
 nameBlock!.classList.add('atelier-opening-names', 'atelier-family-names', 'atelier-bloom-names')
 nameBlock!.setAttribute('data-names-layout', d.groomFamily.trim() || d.brideFamily.trim() ? 'stacked' : 'auto')
 for (const [index, family] of [d.groomFamily, d.brideFamily].entries()) {
  const person = doc.createElement('div')
  person.className = 'atelier-bloom-person'
  nameHeadings[index].replaceWith(person)
  const familyText = doc.createElement('p')
  familyText.className = 'atelier-bloom-family'
  familyText.textContent = family
  familyText.hidden = !family.trim()
  person.append(nameHeadings[index], familyText)
 }
 welcomeMessage.textContent = d.message
 ;(welcomeMessage as HTMLElement).hidden = !d.message.trim()
 welcomeMessage.classList.add('whitespace-pre-line')
 const [weekdayLine, dateLine, yearLine] = bloomDateCopy(d.date)
 weekday.textContent = weekdayLine
 writtenDate.replaceChildren(doc.createTextNode(dateLine), doc.createElement('br'), doc.createTextNode(yearLine))
 personal.querySelector('.atelier-welcome')?.remove()
 const bloomEnding = doc.createDocumentFragment()
 const rsvpResponse = await fetch('/templates/bloom/rsvp.html', { signal })
 if (!rsvpResponse.ok) throw new Error('Could not load the Bloom RSVP layout.')
 const rsvpTemplate = doc.createElement('template')
 rsvpTemplate.innerHTML = await rsvpResponse.text()
 const rsvp = rsvpTemplate.content.querySelector<HTMLElement>('#rsvp')
 const rsvpForm = rsvp?.querySelector<HTMLFormElement>('#rsvp-form')
 const closingNames = bloomFooter?.querySelector('p.font-script')
 const closingDate = bloomFooter?.querySelector('p.section-eyebrow')
 if (!rsvp || !rsvpForm || !bloomFooter || !closingNames || !closingDate) throw new Error('Could not load the Bloom closing layout.')
 rsvpForm.dataset.storageKey = rsvpTarget ? `order-rsvp-reply:${rsvpTarget.orderId}` : JSON.stringify(['bloom-rsvp-preview', d.groom, d.bride, d.date])
 rsvpForm.dataset.persistence = rsvpTarget ? 'server' : 'preview'
 const rsvpNote = rsvpForm.querySelector('.form-note')
 if (rsvpNote) rsvpNote.textContent = rsvpTarget ? 'Your reply will be shared with the hosts.' : 'Preview only. Guests can send their RSVP from the published invitation.'
 const rsvpSubmit = rsvpForm.querySelector<HTMLButtonElement>('[type="submit"]')
 if (rsvpSubmit) { rsvpSubmit.textContent = 'Send RSVP'; rsvpSubmit.disabled = false }
 const closingAmpersand = doc.createElement('span')
 closingAmpersand.className = 'italic'
 closingAmpersand.textContent = '&'
 const closingGroom = doc.createElement('span')
 const closingBride = doc.createElement('span')
 closingGroom.textContent = d.groom
 closingBride.textContent = d.bride
 closingNames.classList.add('atelier-opening-names', 'atelier-bloom-names')
 closingNames.replaceChildren(closingGroom, closingAmpersand, closingBride)
 closingDate.textContent = formatDate(d.date)
 personal.querySelector(':scope > .atelier-note:last-child')?.remove()
 bloomEnding.append(rsvp, bloomFooter)
 return { welcome: bloomWelcome, ending: bloomEnding }
}
