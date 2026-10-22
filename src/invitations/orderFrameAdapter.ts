import { formatDate, formatTime } from './model'
import { isCatalogMusic } from './musicCatalog'
import { applyNewOrderTemplate } from './newOrderTemplates'
import type { InvitationData, Celebration } from './model'
import { downloadCalendar } from './calendar'
import { saveOrderRsvp } from './rsvp'
import type { RsvpTarget } from './rsvp'

type OrderWindow = Window & { orderInvitation?: InvitationData }
const initialized = new WeakSet<Document>()
const signatures = new WeakMap<Document, string>()
const musicDefaults = new WeakMap<HTMLAudioElement, string>()
const eventTemplates = new WeakMap<Document, HTMLElement>()
const safeURL = (value: string) => /^https?:\/\//i.test(value.trim()) ? value.trim() : ''

export function applyOrderFrame(doc: Document, d: InvitationData) {
  if (!doc.defaultView) return
  ;(doc.defaultView as OrderWindow).orderInvitation = d
  doc.title = `${d.groom} & ${d.bride} — Wedding invitation`
  const text = (selector: string, value: string) => doc.querySelectorAll<HTMLElement>(selector).forEach(el => {
    if (el.textContent !== value) el.textContent = value
    el.style.whiteSpace = 'pre-line'
    el.style.overflowWrap = 'anywhere'
  })
  const link = (selector: string, value: string) => doc.querySelectorAll<HTMLAnchorElement>(selector).forEach(el => {
    el.hidden = !safeURL(value)
    if (safeURL(value)) { el.href = value; el.target = '_blank'; el.rel = 'noopener noreferrer' }
    else el.removeAttribute('href')
  })
  if (!initialized.has(doc)) {
    const css = doc.createElement('style')
    css.textContent = '[hidden]{display:none!important}.order-extra{padding:20px;text-align:center;white-space:pre-line;overflow-wrap:anywhere}.order-event{padding:20px;margin:16px 0;text-align:center;border:1px solid currentColor;border-radius:12px}.order-event>*{margin:8px 0;white-space:pre-line;overflow-wrap:anywhere}.order-event a,.order-event button{display:inline-block;margin:8px;padding:8px;color:inherit;font:inherit}.order-rsvp{display:grid;gap:12px;max-width:360px;margin:auto;padding:20px}.order-rsvp input,.order-rsvp select,.order-rsvp button{font:inherit;padding:12px;width:100%;box-sizing:border-box}.order-rsvp p{white-space:normal}#page-3 .page-inner{overflow-y:auto;max-height:85svh}#evStage.order-events{display:block;height:auto;min-height:0;position:relative}#evStage.order-events .order-event{position:relative;opacity:1;transform:none}#page-5 .page-inner,#page-7 .page-inner{overflow-y:auto;max-height:85svh}'
    css.textContent += '#evStage.order-events{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:20px}.order-events .ev-node.order-event{position:relative;left:auto;right:auto;top:auto;bottom:auto;width:auto;opacity:1;transform:none;cursor:default}.order-events .ev-detail{display:block;opacity:1;max-height:none;visibility:visible;transform:none}.order-events .tl-item{list-style:none}'
    doc.head.append(css)
    initialized.add(doc)
  }
  if (d.template >= 12) {
    applyNewOrderTemplate(doc, d)
  } else if (d.template === 9) {
    text('#bride-name-el', d.bride); text('#groom-name-el', d.groom)
    doc.querySelector('#bride-name-el')?.setAttribute('aria-label', d.bride)
    doc.querySelector('#groom-name-el')?.setAttribute('aria-label', d.groom)
    text('#bride-parents-el', d.brideFamily); text('#groom-parents-el', d.groomFamily)
    text('.story-quote', d.message); text('.ending-note-text', d.giftNote || d.message)
    const names = doc.querySelectorAll('.closing-name')
    if (names[0]) names[0].textContent = d.bride
    if (names[1]) names[1].textContent = d.groom
  } else if (d.template === 10) {
    text('#bride-name-el', d.bride); text('#groom-name-el', d.groom)
    text('#bride-parents-el', d.brideFamily); text('#groom-parents-el', d.groomFamily)
    text('.when-line', `${formatDate(d.date, { weekday: 'long' })} · ${formatTime(d.time)}`)
    text('.venue-name', d.venue); text('.venue-addr', d.address); link('.map-link', d.map)
    text('.ending-note', d.message)
    const names = doc.querySelectorAll('.close-name')
    if (names[0]) names[0].textContent = d.bride
    if (names[1]) names[1].textContent = d.groom
    text('#big-day-num', d.date.slice(8)); text('.month-year', formatDate(d.date, { month: 'long', year: 'numeric' }))
  } else {
    text('.hc-bride,.pl-n1,.i-bride,#stRvBride', d.bride)
    text('.hc-groom,.pl-n2,.i-groom,#stRvGroom', d.groom)
    text('#iBrideParents', d.brideFamily); text('#iGroomParents', d.groomFamily)
    doc.querySelectorAll<HTMLElement>('.fam-side').forEach((el, i) => { el.hidden = !(i === 0 ? d.brideFamily : d.groomFamily).trim() })
    text('.i-bless', d.message)
    text('.ft-names', `${d.bride} & ${d.groom}`)
    text('.ft-date', `${formatDate(d.date)} · ${d.venue}`)
    const hashtag = `#${d.bride.replace(/\s/g, '')}Weds${d.groom.replace(/\s/g, '')}`
    text('#ttkHashtag,.tt-ig a', hashtag)
    const facts = doc.querySelectorAll<HTMLElement>('.tt')
    facts.forEach(el => {
      const label = el.querySelector('.tt-l')?.textContent?.trim()
      const value = el.querySelector('.tt-v')
      if (label === 'Dress Code' && value) { value.textContent = d.dressCode; el.hidden = !d.dressCode.trim() }
      if (label === 'Venue' && value) value.textContent = `${d.venue}\n${d.address}`
      if (label === 'Parking') el.hidden = true
    })
    // Sample calendar and event-modal handlers capture the demo config. Order
    // cards below own current data and their own calendar/map actions instead.
    doc.querySelectorAll<HTMLElement>('.ev-journey-wrap').forEach(el => { el.hidden = true })
  }
  if (d.template < 12) { updateEvents(doc, d); updateExtras(doc, d) }
  const music = doc.querySelector<HTMLAudioElement>('audio')
  if (music) {
    if (!musicDefaults.has(music)) musicDefaults.set(music, music.currentSrc || music.src || music.querySelector('source')?.src || '')
    const source = (isCatalogMusic(d.music) ? d.music : safeURL(d.music)) || musicDefaults.get(music)!
    if (source && music.src !== new URL(source, doc.baseURI).href) {
      const playing = !music.paused
      music.src = source
      if (playing) void music.play().catch(() => {})
    }
  }
  // Remove sample calendar URLs everywhere; use current form data.
  doc.querySelectorAll<HTMLAnchorElement>('a[href*="calendar.google.com"],a[href$=".ics"],a[data-order-main-calendar]').forEach(el => {
    el.dataset.orderMainCalendar = ''
    el.href = '#'
    el.onclick = e => { e.preventDefault(); downloadCalendar({ ...d.events[0], date: d.date, time: d.time, venue: d.venue, address: d.address }, d.offset, `${d.groom} & ${d.bride}`) }
  })
}

function eventCard(doc: Document, event: Celebration, d: InvitationData) {
  const original = eventTemplates.get(doc)
  const card = original ? original.cloneNode(true) as HTMLElement : doc.createElement('article')
  card.classList.remove('scroll-in', 'ev-row1', 'ev-row2')
  card.classList.add('order-event')
  card.dataset.inviteEventKey = event.id || `legacy-${d.events.indexOf(event)}`
  card.removeAttribute('style'); card.removeAttribute('data-idx')
  card.querySelectorAll('a,button').forEach(el => el.remove())
  if (original) {
    for (const [selector, value] of [['.ev-name,.tl-name', event.title], ['.ev-date,.tl-when', `${formatDate(event.date)} · ${formatTime(event.time)}`], ['.ev-venue,.tl-venue', event.venue], ['.ev-desc', event.address]]) {
      card.querySelectorAll(selector).forEach(el => { el.textContent = value })
    }
    const icon = card.querySelector<HTMLImageElement>('.ev-icon')
    if (icon) { icon.src = '/shaadipath-t02/assets/icons/icon-shaadi.webp'; icon.alt = '' }
    if (d.template === 10) { const address = doc.createElement('p'); address.textContent = event.address; card.querySelector('.tl-content')?.append(address) }
  } else {
    for (const [tag, value] of [['h3', event.title], ['p', `${formatDate(event.date)} · ${formatTime(event.time)}`], ['p', event.venue], ['p', event.address]]) {
      const el = doc.createElement(tag); el.textContent = value; card.append(el)
    }
  }
  if (safeURL(event.map)) {
    const map = doc.createElement('a'); map.href = event.map; map.textContent = 'Directions'; map.target = '_blank'; map.rel = 'noopener noreferrer'; card.append(map)
  }
  const calendar = doc.createElement('button'); calendar.type = 'button'; calendar.textContent = 'Add to calendar'
  calendar.onclick = () => downloadCalendar(event, d.offset, `${d.groom} & ${d.bride}`)
  card.append(calendar)
  return card
}

function updateEvents(doc: Document, d: InvitationData) {
  const signature = JSON.stringify([d.events, d.groom, d.bride, d.offset])
  if (signatures.get(doc) === signature) return
  signatures.set(doc, signature)
  if (d.template === 9) {
    // Preserve the two original scratch canvases and their native listeners.
    for (const [index, key] of ['nikkah', 'reception'].entries()) {
      const card = doc.querySelector<HTMLElement>(`#event-${key}-card`)
      if (!card) continue
      const event = d.events[index]
      card.hidden = !event
      if (!event) continue
      card.dataset.inviteEventKey = event.id || `legacy-${index}`
      for (const [selector, value] of [
        ['.event-name-large,.scratch-event-name', event.title], ['.scratch-date,.detail-date', formatDate(event.date)],
        ['.scratch-time,.detail-time', formatTime(event.time)], ['.scratch-venue', event.venue],
        ['.detail-venue span', `${event.venue}, ${event.address}`], ['.scratch-hint', `Scratch to reveal ${event.title}`],
      ]) card.querySelectorAll(selector).forEach(el => { el.textContent = value })
      const map = card.querySelector<HTMLAnchorElement>('.detail-map')
      if (map) { map.hidden = !safeURL(event.map); if (safeURL(event.map)) map.href = event.map; else map.removeAttribute('href') }
      card.querySelector('[data-order-calendar]')?.remove()
      const button = doc.createElement('button'); button.dataset.orderCalendar = ''; button.className = 'detail-map f-heading'; button.textContent = 'Add to calendar'
      button.onclick = () => downloadCalendar(event, d.offset, `${d.groom} & ${d.bride}`)
      card.querySelector('.event-details')?.append(button)
    }
    doc.querySelector('#order-extra-events')?.remove()
    const extras = doc.createElement('div'); extras.id = 'order-extra-events'
    d.events.slice(2).forEach(event => extras.append(eventCard(doc, event, d)))
    doc.querySelector('.events-container')?.append(extras)
    const countdown = doc.querySelector<HTMLElement>('#countdown-section')
    if (countdown) countdown.style.display = 'block'
  } else {
    const host = doc.querySelector(d.template === 10 ? '#page-3 ol' : '#evStage')
    if (host) {
      if (!eventTemplates.has(doc)) {
        const original = host.querySelector<HTMLElement>(d.template === 10 ? '.tl-item' : '.ev-node')
        if (original) eventTemplates.set(doc, original.cloneNode(true) as HTMLElement)
      }
      host.classList.add('order-events')
      host.replaceChildren(...d.events.map(event => {
        const card = eventCard(doc, event, d)
        if (host.tagName !== 'OL' || card.tagName === 'LI') return card
        const li = doc.createElement('li'); li.append(card); return li
      }))
    }
  }
}

function updateExtras(doc: Document, d: InvitationData) {
  const host = doc.querySelector(d.template === 9 ? '#ending-note-section' : d.template === 10 ? '#page-7 .page-inner' : '.footer')
  if (host) {
    let extra = host.querySelector<HTMLElement>('.order-extra')
    if (!extra) { extra = doc.createElement('div'); extra.className = 'order-extra'; host.append(extra) }
    extra.replaceChildren()
    for (const [heading, value, key] of [['Dress code', d.dressCode, 'dressCode'], ['A little note', d.giftNote, 'giftNote']]) {
      if (!value.trim()) continue
      const group = doc.createElement('div'); group.dataset.note = key
      const title = doc.createElement('h3'); title.textContent = heading
      const content = doc.createElement('p'); content.textContent = value; group.append(title, content); extra.append(group)
    }
  }
  const gallery = doc.querySelector(d.template === 9 ? '#gallery-section' : d.template === 10 ? '#page-5 .page-inner' : '.gal-grid')
  if (gallery) {
    // Orders must not display the demo couple's photographs.
    gallery.replaceChildren()
    const label = doc.createElement('p'); label.textContent = 'Our moments'; gallery.append(label)
    if (safeURL(d.gallery)) { const link = doc.createElement('a'); link.textContent = 'Open photo gallery'; link.href = d.gallery; link.target = '_blank'; link.rel = 'noopener noreferrer'; gallery.append(link) }
    else label.textContent = `${d.groom} & ${d.bride}`
  }
}

export function installOrderFrameRsvp(doc: Document, template: number, target?: RsvpTarget) {
  const host = doc.querySelector(template === 12 ? '#order-rsvp-host' : template === 13 ? '#order-rsvp-host,#rsvpSection .rsvp-action-area' : template === 14 ? '#order-rsvp-host,[data-scene="8"] .card:has([data-aamantran="rsvp"])' : template === 9 ? '#rsvp-section' : template === 10 ? '#rsvp-form-wrap' : '#rsvp .container')
  if (!host || host.querySelector('.order-rsvp')) return () => {}
  if(template>=12)host.id='order-rsvp-host'
  const form = doc.createElement('form'); form.className = 'order-rsvp'
  const name = doc.createElement('input'); name.placeholder = 'Your name'; name.setAttribute('aria-label', 'Your name'); name.required = true; name.maxLength = 120
  const count = doc.createElement('input'); count.type = 'number'; count.min = '1'; count.max = '10'; count.value = '1'; count.required = true; count.setAttribute('aria-label', 'Number of guests')
  const guestFields = doc.createElement('div')
  count.oninput = () => {
    const total = Math.min(10, Math.max(1, Number(count.value) || 1))
    const values = Array.from(guestFields.querySelectorAll('input')).map(input => input.value)
    guestFields.replaceChildren()
    for (let i = 1; i < total; i++) {
      const input = doc.createElement('input'); input.required = true; input.maxLength = 120; input.placeholder = `Guest ${i + 1} name`; input.setAttribute('aria-label', input.placeholder); input.value = values[i - 1] || ''; guestFields.append(input)
    }
  }
  const attendance = doc.createElement('select'); attendance.setAttribute('aria-label', 'Attendance')
  for (const [value, label] of [['yes', 'Attending'], ['no', 'Unable to attend']]) { const option = doc.createElement('option'); option.value = value; option.textContent = label; attendance.append(option) }
  attendance.onchange = () => {
    count.disabled = attendance.value === 'no'
    guestFields.hidden = count.disabled
    guestFields.querySelectorAll('input').forEach(input => { input.disabled = count.disabled })
  }
  const button = doc.createElement('button'); button.type = 'submit'; button.textContent = 'Send RSVP'
  const status = doc.createElement('p'); status.setAttribute('role', 'status')
  if (!target) { button.disabled = true; status.textContent = 'RSVP is available on the published invitation.' }
  form.append(name, attendance, count, guestFields, button, status); host.replaceChildren(form)
  form.onsubmit = async e => {
    e.preventDefault()
    if (!target || button.disabled) return
    button.disabled = true; status.textContent = 'Sending…'
    try {
      await saveOrderRsvp(target, { name: name.value.trim(), attendance: attendance.value === 'no' ? 'no' : 'yes', count: attendance.value === 'no' ? 0 : Number(count.value), guests: attendance.value === 'no' ? [] : Array.from(guestFields.querySelectorAll('input')).map(input => input.value.trim()), message: '' })
      status.textContent = 'Thank you. Your reply has been saved.'
    } catch (error) { status.textContent = error instanceof Error ? error.message : 'Please try again.' }
    finally { button.disabled = false }
  }
  return () => { form.onsubmit = null; form.remove() }
}
