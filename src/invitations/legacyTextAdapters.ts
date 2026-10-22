import type { InvitationData } from './model'
import { markNewOrderText } from './newOrderTemplates'

type Root = HTMLElement
type Rules = Record<string, string>
const eventKey = (details: InvitationData, index: number) => details.events[index]?.id || `legacy-${index}`

/** Explicit semantic mappings, not text matching or generated DOM paths.
 * Keep these IDs and section boundaries when replacing a template with React. */
export function markLegacyText(root: Root, d: InvitationData) {
  markNewOrderText(root, d)
  const mark = (scope: Element, section: string, rules: Rules) => {
    if (scope.getAttribute('data-invite-section') !== section) scope.setAttribute('data-invite-section', section)
    for (const [field, selector] of Object.entries(rules)) {
      scope.querySelectorAll<HTMLElement | SVGElement>(selector).forEach(el => {
        if (el.closest('script,style,defs,clipPath,mask') || el.closest('[data-invite-text]') !== (el.hasAttribute('data-invite-text') ? el : null)) return
        const id = `t${d.template}.${section}.${field}`
        if (el.getAttribute('data-invite-text') !== id) {
          el.setAttribute('data-invite-text', id)
          el.setAttribute('data-invite-label', `${section} · ${field}`)
        }
      })
    }
  }
  const section = (selector: string, name: string, rules: Rules) => root.querySelectorAll(selector).forEach(el => mark(el, name, rules))
  const names: Rules = {
    groom: '.atelier-opening-names > span:first-child,.atelier-couple-person:first-child h2',
    bride: '.atelier-opening-names > span:last-child,.atelier-couple-person:last-child h2',
    separator: '.atelier-opening-names > span:nth-child(2),.atelier-couple-connector',
    groomFamily: '.atelier-couple-person:first-child .atelier-family-details',
    brideFamily: '.atelier-couple-person:last-child .atelier-family-details',
  }
  const eventRules: Rules = {
    weekday: '.atelier-event-copy > .atelier-eyebrow', title: '.atelier-event-copy > h2',
    day: '.atelier-date > span:nth-child(1)', month: '.atelier-date > span:nth-child(2)', year: '.atelier-date > span:nth-child(3)',
    time: '.atelier-event-copy > .atelier-date + p', venue: '.atelier-event-copy > h3', address: '.atelier-event-copy > h3 + p',
    directions: '.atelier-links a', calendar: '.atelier-links button',
  }
  if ([5, 6, 7].includes(d.template)) {
    section('#hero,section#opening,main > section:first-child', 'opening', {
      ...names, heading: ':scope > div > p:first-child', date: '.atelier-opening-copy > p:last-child,.opening-name[data-personalized-date]',
    })
    section('.atelier-welcome', 'welcome', { ...names, caption: ':scope > .atelier-eyebrow', message: ':scope > p:last-child' })
    section('#countdown', 'countdown', {
      heading: 'h2', ...Object.fromEntries([0, 1, 2, 3].flatMap(i => [[`value-${i}`, `.grid > div:nth-child(${i + 1}) > span:first-child`], [`label-${i}`, `.grid > div:nth-child(${i + 1}) > span:last-child`]])),
    })
    root.querySelectorAll('.atelier-event').forEach(card => {
      const index = Number(card.querySelector<HTMLElement>('[data-personal-calendar]')?.dataset.personalCalendar)
      if (Number.isInteger(index) && d.events[index]) mark(card, `event-${eventKey(d, index)}`, eventRules)
    })
    section('.sg-details', 'venue', { heading: '.sg-details-heading h2', caption: '.sg-details-heading > p:not(.atelier-details-message)', message: '.atelier-details-message', location: '.sg-venue-heading', name: '.sg-venue-name', address: '.sg-venue-city', date: '.sg-venue-date', time: '.sg-venue-time span', directions: '.sg-venue-actions a', calendar: '.sg-venue-actions button' })
    section('.atelier-majestic-programme', 'programme', { heading: 'h2' })
    section('.atelier-majestic-dress', 'dress', { heading: 'h2', caption: 'h2 + p', text: 'h3' })
    section('.atelier-majestic-closing', 'closing', { names: 'h2', date: 'p' })
    // These are authored fixed heading labels, never customer text or DOM order.
    root.querySelectorAll('.atelier-note').forEach(note => {
      const title = note.querySelector('h2')?.textContent
      if (title === 'Dress code') mark(note, 'dress', { heading: 'h2', text: 'p' })
      else if (title === 'A little note') mark(note, 'gift', { heading: 'h2', text: 'p' })
      else if (note.querySelector('a') && !note.querySelector('form')) mark(note, 'gallery', { link: 'a' })
    })
    section('#welcome', 'welcome-native', { heading: 'h2', caption: ':scope > div > p:first-child', message: ':scope > div > p:last-child', ...names,
      groom: '.atelier-bloom-person:first-child h3', bride: '.atelier-bloom-person:last-child h3', separator: '.atelier-family-names > p',
      groomFamily: '.atelier-bloom-person:first-child .atelier-bloom-family', brideFamily: '.atelier-bloom-person:last-child .atelier-bloom-family',
      invitation: '.space-y-6 > p', weekday: '.space-y-6 > div > span', date: '.space-y-6 > div > p',
    })
    section('.atelier-embroidered-introduction', 'welcome-intro', { heading: '.atelier-fixed-intro-heading', message: '.atelier-fit-intro-content:first-of-type', blessing: '.atelier-fit-intro-content:last-of-type' })
    const ceremony = root.querySelector('.atelier-bloom-ceremony')
    if (ceremony) mark(ceremony, `event-${eventKey(d, 0)}`, { title: 'h2', venue: 'h3', address: 'h3 + p', calendar: '[data-personal-calendar]', directions: 'a', date: '.space-y-3 > div:first-child', location: '.space-y-3 > div:last-child' })
    section('footer', 'closing-native', { ...names, names: '.font-script:not(.atelier-opening-names)', date: '.section-eyebrow,:scope > p:not(.font-script),:scope > div > p:last-child:not(.font-script)' })
    section('#hero', 'opening', { curvedHeading: 'svg text' })
  }
  if (d.template === 3) {
    const timelessNames = { groom: '.d14-rules-names > div:first-child h2', bride: '.d14-rules-names > div:last-child h2', separator: '.d14-page-two-family-amp', groomFamily: '.d14-rules-names > div:first-child p', brideFamily: '.d14-rules-names > div:last-child p' }
    section('[data-d14-name="PAGE 1"]', 'opening', { ...timelessNames, date: '.d14-rules-opening-date' })
    section('[data-d14-name="PAGE 2"]', 'welcome', { ...timelessNames, invocation: '.d14-page-two-invocation', message: '.d14-page-two-intro', caption: '.d14-page-two-celebrate p' })
    root.querySelectorAll<HTMLElement>('[data-invite-event-key]').forEach(card => mark(card, `event-${card.dataset.inviteEventKey}`, {
      title: '.d14-engagement-heading', date: '.d14-engagement-date', time: '.d14-engagement-time', venue: '.d14-engagement-venue-name', address: '.d14-engagement-venue-city', directions: '.d14-rules-actions a', calendar: '.d14-rules-actions button',
    }))
    section('[data-invite-note="dress"]', 'dress', { heading: 'h2', text: 'p' })
    section('[data-invite-note="gift"]', 'gift', { heading: 'h2', text: 'p' })
  }
  if (d.template === 4) {
    section('.d18-entry', 'opening', { groom: 'h1 > span:first-child', separator: 'h1 > i', bride: 'h1 > span:last-child' })
    section('.d18-intro', 'welcome', { caption: ':scope > .d18-kicker', heading: ':scope > h2', message: '.d18-message', blessing: '.d18-message + p', names: '.d18-signature', groomFamily: '[data-family="groom"]', brideFamily: '[data-family="bride"]' })
    section('.d18-countdown', 'countdown', { caption: '.d18-kicker', heading: 'h2', complete: '.d18-after-date', ...Object.fromEntries([0, 1, 2, 3].flatMap(i => [[`value-${i}`, `.d18-counts > div:nth-child(${i + 1}) strong`], [`label-${i}`, `.d18-counts > div:nth-child(${i + 1}) span`]])) })
    section('.d18-section-heading', 'programme', { heading: 'h2', caption: 'p' })
    root.querySelectorAll<HTMLElement>('.d18-event[data-invite-event-key]').forEach(card => mark(card, `event-${card.dataset.inviteEventKey}`, { caption: '.d18-event-index', title: 'h3', day: '.d18-event-date strong', date: '.d18-event-date > span', venue: 'h4', address: '.d18-address', directions: '.d18-event-actions a', calendar: '.d18-event-actions button' }))
    section('.d18-notes', 'notes', { dressHeading: '[data-note="dress-heading"]', dress: '[data-note="dress"]', giftHeading: '[data-note="gift-heading"]', gift: '[data-note="gift"]', gallery: 'a' })
    section('.d18-footer', 'closing', { caption: '.d18-kicker', heading: 'h2', names: '.d18-footer-names', date: '.d18-footer-names + p', venue: 'a' })
  }
  if (d.template === 8) {
    // Authored scene names are stable in this exported design; the child text
    // may be HTML inside foreignObject or native SVG text.
    const scenes: Record<string, Rules> = {
      'PAGE 1': { groom: '[data-d13-name="GROOM NAME"] text,[data-d13-name="GROOM NAME"] p', bride: '[data-d13-name="BRIDE NAME"] text,[data-d13-name="BRIDE NAME"] p', separator: '[data-d13-name="WEDS"] p', date: '[data-d13-name="TAG LINE"] p' },
      'PAGE 2': { family: '[data-d13-name="GROOM FAMILY"] p', groom: '[data-d13-name="KIRAN"] text,[data-d13-name="KIRAN"] p', bride: '[data-d13-name="GROOM NAME "] text,[data-d13-name="GROOM NAME "] p', separator: '[data-d13-name="&"] p', heading: '[data-d13-name="INVITE"] p', message: '[data-d13-name="INVITE TAG LINE"] p' },
      'PAGE 5': { story: '[data-d13-name="PARAGRAPH STORY"] p', heading: '[data-d13-name="OUR STORY"] p', names: '[data-d13-name="BRIDE & GROOM"] p', caption: '[data-d13-name="MEET THE"] p' },
      'PAGE 6': { note: '[data-d13-name="RSVP Note"] p', heading: '[data-d13-name="WILL YOU JOIN US"] p', button: '[data-d13-name="RSVP "] p' },
      'PAGE 7': { heading: '[data-d13-name="INSTAGRAM"] p', tap: '[data-d13-name="TAP HERE"] p', magic: '[data-d13-name="TOUCH HERE FOR MAGIC"] p', countdown: '[data-d13-name="COUNTING THE DAYS"] p' },
    }
    for (const [scene, rules] of Object.entries(scenes)) section(`[data-d13-name="${scene}"]`, `scene-${scene.slice(-1)}`, rules)
    root.querySelectorAll('[data-d13-name="Wedding Event Slideshow"]').forEach(slideshow => {
      mark(slideshow, `event-${eventKey(d, 0)}`, {
        title: 'h2', date: 'h2 + div > div:nth-child(1) > span:last-child',
        time: 'h2 + div > div:nth-child(2) > span:last-child', venue: 'h2 + div > div:nth-child(3) > span:last-child',
        description: 'h2 ~ p', directions: 'a',
      })
    })
    // Remaining authored rich-text blocks (including fixed captions) use the
    // export's persistent names. Responsive copies share the same saved key.
    root.querySelectorAll('[data-d13-component-type="RichTextContainer"][data-d13-name]').forEach(block => {
      const scene = block.closest('[data-d13-name^="PAGE "]')
      if (!scene) return
      const name = block.getAttribute('data-d13-name')!.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
      const sceneName = `scene-${scene.getAttribute('data-d13-name')!.slice(-1)}`
      block.querySelectorAll('p,text').forEach((node, index) => {
        if (node.closest('[data-invite-text]')) return
        node.setAttribute('data-invite-text', `t8.${sceneName}.${name}-${index}`)
        node.setAttribute('data-invite-label', `${sceneName} · ${name}`)
      })
      scene.setAttribute('data-invite-section', sceneName)
    })
  }
  if ([9, 10, 11].includes(d.template)) {
    section('#hero,#names-reveal,#heroCopy', 'opening', { bride: '#bride-name-el,.hc-bride', groom: '#groom-name-el,.hc-groom', brideFamily: '#bride-parents-el', groomFamily: '#groom-parents-el', caption: '.hero-event-label', separator: '#ampersand-el,.hc-weds', blessing: '.hero-bismillah' })
    section('#bismillah-section', 'welcome', { blessing: '.section-bismillah', message: '.story-quote' })
    section('#page-0', 'date', { day: '#big-day-num', month: '.month-year', time: '.when-line', heading: '.page-heading' })
    section('#page-1,#countdown-section', 'countdown', { heading: '.page-heading,.countdown-label', days: '#cd-days', hours: '#cd-hours', minutes: '#cd-mins', seconds: '#cd-secs' })
    section('#page-2', 'venue', { heading: 'h2', name: '.venue-name', address: '.venue-addr', directions: '.map-link' })
    root.querySelectorAll<HTMLElement>('[data-invite-event-key]').forEach(card => mark(card, `event-${card.dataset.inviteEventKey}`, {
      title: '.event-name-large,.ev-name,.tl-name,:scope > h3', scratchTitle: '.scratch-event-name', scratchDate: '.scratch-date', scratchTime: '.scratch-time', scratchVenue: '.scratch-venue', hint: '.scratch-hint', reveal: '.scratch-hint-btn', date: '.detail-date,.ev-date,.tl-when,:scope > p:nth-of-type(1)', time: '.detail-time', venue: '.detail-venue span,.ev-venue,.tl-venue,:scope > p:nth-of-type(2)', address: '.ev-desc,.tl-content > p:last-child,:scope > p:nth-of-type(3)', directions: 'a', calendar: 'button[data-order-calendar],:scope > button',
    }))
    section('#ending-note-section,#page-7', 'notes', { message: '.ending-note-text,.ending-note', dressHeading: '[data-note="dressCode"] h3', dress: '[data-note="dressCode"] p', giftHeading: '[data-note="giftNote"] h3', gift: '[data-note="giftNote"] p' })
    section('#closing-names-section,#page-8', 'closing', { bride: ':scope > div > div:first-child > .closing-name,.close-name:first-of-type', groom: ':scope > div > div:nth-child(3) > .closing-name,.close-name:nth-of-type(2)', caption: '.close-footer span' })
    section('#invite', 'welcome', { bride: '.i-bride', groom: '.i-groom', message: '.i-bless', brideFamily: '#iBrideParents', groomFamily: '#iGroomParents', caption: '.i-close', heading: '.i-label', separator: '.i-amp' })
    section('#story', 'story', { bride: '#stRvBride', groom: '#stRvGroom', caption: '.sh-eye', heading: '.sh-h', message: '#stRvVerse', separator: '.st-rv-amp' })
    section('#events-section,#events', 'programme', { heading: ':scope > h2,:scope > .container > .section-head .sh-h', caption: ':scope > .container > .section-head .sh-eye' })
    section('#verse-section', 'verse', { text: 'p' })
    section('#rsvp-section,#rsvp', 'rsvp-native', { heading: 'h2', message: '#rsvpSub,.rsvp-description', caption: '.rsvp-eye' })
    section('.footer', 'closing', { names: '.ft-names', date: '.ft-date', caption: '.ft-credit' })
    section('#things', 'facts', { hashtag: '#ttkHashtag', heading: '.sh-h', caption: '.sh-eye', venue: '#ttkVenue',
      ...Object.fromEntries(['hashtag', 'dress', 'venue', 'parking'].flatMap((field, index) => [[`${field}Label`, `.tt:nth-child(${index + 1}) .tt-l`], [`${field}Value`, `.tt:nth-child(${index + 1}) .tt-v`]])),
    })
    section('#heroCountdown', 'hero-countdown', Object.fromEntries([0, 1, 2, 3].flatMap(i => [[`value-${i}`, `:scope > div:nth-child(${i + 1}) strong`], [`label-${i}`, `:scope > div:nth-child(${i + 1}) span`]])))
  }
  section('.atelier-rsvp,.order-rsvp', 'rsvp', { heading: ':scope > h2', caption: ':scope > .atelier-eyebrow', intro: '.atelier-rsvp-intro', open: '[data-secret-garden-open-rsvp]:not(:has(img))', name: 'label:has(input[name="fullName"]) > .atelier-label-text', message: 'label:has(textarea) > .atelier-label-text', guests: '.atelier-guest-count > p', submit: 'button[type="submit"]', question: 'legend' })
}

export function installLegacyTextAdapter(root: Root, getDetails: () => InvitationData) {
  const style = root.ownerDocument.createElement('style')
  style.textContent = '[data-invite-text]:is(span,small,strong,i,em){display:inline-block}svg:has([data-invite-text]){overflow:visible}'
  root.ownerDocument.head.append(style)
  let stopped = false
  let queued = false
  const apply = () => { queued = false; if (!stopped) markLegacyText(root, getDetails()) }
  const schedule = () => { if (!queued && !stopped) { queued = true; queueMicrotask(apply) } }
  const observer = new MutationObserver(records => {
    if (records.some(record => record.type === 'attributes' || [...record.addedNodes, ...record.removedNodes].some(node => node.nodeType === 1))) schedule()
  })
  observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-personal-calendar', 'data-invite-event-key'] })
  root.ownerDocument.addEventListener('invitation-layout-change', schedule)
  root.ownerDocument.defaultView?.addEventListener('invitation-preview-updated', schedule)
  apply()
  return () => { stopped = true; observer.disconnect(); style.remove(); root.ownerDocument.removeEventListener('invitation-layout-change', schedule); root.ownerDocument.defaultView?.removeEventListener('invitation-preview-updated', schedule) }
}
