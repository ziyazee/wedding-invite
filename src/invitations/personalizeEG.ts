import type { InvitationData } from './model'
import type { ThemeConfig } from './personalizeBloom'

const escape = (value: string) => value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))

export function personalizeEG(
 doc: Document,
 personal: HTMLElement,
 d: InvitationData,
 _theme: ThemeConfig,
): void {
 personal.classList.add('atelier-card-content-fit', 'atelier-embroidered-fit')
 const welcome = personal.querySelector('.atelier-welcome')
 if (welcome) {
  welcome.classList.add('atelier-secret-garden-welcome')
  const hasFamily = Boolean(d.groomFamily.trim() || d.brideFamily.trim())
  welcome.innerHTML = `<p class="atelier-eyebrow">Together with our families</p><div class="atelier-opening-names atelier-family-names${hasFamily ? ' atelier-names-stacked' : ''}" data-names-layout="${hasFamily ? 'stacked' : 'auto'}"><div class="atelier-couple-person"><h2 class="font-script">${escape(d.groom)}</h2><p class="atelier-family-details"${d.groomFamily.trim() ? '' : ' hidden'}>${escape(d.groomFamily)}</p></div><span class="atelier-couple-connector font-script">&amp;</span><div class="atelier-couple-person"><h2 class="font-script">${escape(d.bride)}</h2><p class="atelier-family-details"${d.brideFamily.trim() ? '' : ' hidden'}>${escape(d.brideFamily)}</p></div></div><p>${escape(d.message)}</p>`
 }
 personal.querySelectorAll<HTMLElement>(':scope > .atelier-note').forEach(note => {
  const heading = note.querySelector('h2')?.textContent
  if (heading === 'Dress code') {
   note.hidden = !d.dressCode.trim()
   const art = doc.createElement('img')
   art.src = '/templates/embroidered-garden/assets/dress-code-illustration-v2.webp'
   art.alt = 'Embroidered wedding attire illustrations'
   art.loading = 'lazy'
   art.setAttribute('data-couple-illustration', '')
   art.hidden = d.showCoupleIllustrations === false
   note.append(art)
  }
  if (heading === 'A little note') note.hidden = !d.giftNote.trim()
  if (note.querySelector('a')) note.hidden = !d.gallery.trim()
 })
 const mainEvent = personal.querySelector<HTMLElement>('.atelier-event')
 if (mainEvent) {
  mainEvent.style.position = 'relative'
  mainEvent.style.overflow = 'visible'
  mainEvent.style.marginBottom = 'clamp(170px,30vw,280px)'
  const garlandWrap = doc.createElement('div')
  garlandWrap.className = 'atelier-garland-wrap'
  garlandWrap.style.cssText = 'position:absolute;top:100%;left:50%;transform:translate(-50%,-28%);width:130%;max-width:none;z-index:30;pointer-events:none'
  const garland = doc.createElement('img')
  garland.src = '/templates/embroidered-garden/assets/dresscode-hanging-garland-v2.webp'
  garland.alt = ''
  garland.className = 'swaying-garland'
  garland.setAttribute('aria-hidden', 'true')
  garland.style.cssText = 'display:block;width:100%;height:auto;transform-origin:center top;animation:garland-sway 7s ease-in-out infinite'
  garlandWrap.append(garland)
  mainEvent.append(garlandWrap)
 }
 personal.querySelectorAll<HTMLElement>('.atelier-event').forEach((card, index) => {
  if (index === 0) return
  card.style.position = 'relative'
  card.style.overflow = 'hidden'
  card.style.minHeight = '0'
  card.style.padding = '0'
  card.style.backgroundImage = 'none'
  card.style.display = 'grid'
  const video = doc.createElement('video')
  video.src = '/templates/embroidered-garden/assets/celebration.mov'
  video.autoplay = true
  video.loop = true
  video.muted = true
  video.defaultMuted = true
  video.setAttribute('muted', '')
  video.playsInline = true
  video.setAttribute('aria-hidden', 'true')
  video.style.cssText = 'grid-area:1 / 1;display:block;width:100%;height:auto;object-fit:contain;pointer-events:none'
  card.prepend(video)
  const copy = card.querySelector<HTMLElement>('.atelier-event-copy')
  if (copy) { copy.style.position = 'absolute'; copy.style.zIndex = '1' }
 })
 const rsvp = doc.createElement('section')
 rsvp.className = 'atelier-note atelier-rsvp'
 rsvp.innerHTML = `<form data-atelier-rsvp><label><span class="atelier-label-text">Full name <span class="atelier-required">*</span></span><input name="fullName" type="text" maxlength="120" placeholder="Your full name" required></label><fieldset><legend>Will you be attending? <span>*</span></legend><label><input name="attendance" type="radio" value="yes" required checked> Joyfully accepts</label><label><input name="attendance" type="radio" value="no"> Regretfully declines</label></fieldset><div class="atelier-guest-count"><p>Number of guests attending <span>*</span></p><button type="button" data-guest-step="-1" aria-label="Remove a guest">−</button><output data-guest-count>1</output><button type="button" data-guest-step="1" aria-label="Add a guest">+</button><input name="guestCount" type="hidden" value="1"></div><div class="atelier-additional-guests"></div><label><span class="atelier-label-text">A personal message for the couple</span><textarea name="message" maxlength="1000" rows="4" placeholder="Write a message (optional)"></textarea></label><p class="atelier-rsvp-note">Your reply will be shared with the hosts.</p><button type="submit">Update RSVP</button><p class="atelier-rsvp-status" role="status" aria-live="polite"></p></form>`
 personal.append(rsvp)
}
