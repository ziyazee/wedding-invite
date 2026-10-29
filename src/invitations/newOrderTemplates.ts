import { formatDate, formatTime } from './model'
import type { InvitationData } from './model'
import { downloadCalendar } from './calendar'

export function destinationConfig(d: InvitationData) {
  return {
    groom_name: d.groom, bride_name: d.bride, groom_father_name: d.groomFamily, bride_father_name: d.brideFamily,
    groom_mother_name: '', bride_mother_name: '', groom_grandfather_name: '', groom_grandmother_name: '', bride_grandfather_name: '', bride_grandmother_name: '',
    person1_relation: '', person2_relation: '', wedding_date: formatDate(d.date),
    venue_name: d.venue, venue_address: d.address, venue_map_url: d.map, couple_message: d.message || '\u200b',
    contact_name: '', contact_number: '', instagram_url: '', social_youtube_url: '', website_url: '', youtube_url: '',
    hashtag: `${d.groom.replace(/\s/g, '')}Weds${d.bride.replace(/\s/g, '')}`, instagram_invite_text: '', hashtag_invite_text: '',
    music_url: d.music || '/templates/destination-wedding/music.mp3',
    rsvp_enabled: false, guest_notes_enabled: false,
    functions: d.events.map((event, index) => ({ id: event.id || `legacy-${index}`, name: event.title, date: event.date, time: formatTime(event.time), venue_name: event.venue, venue_address: event.address, venue_map_url: event.map, dress_code: d.dressCode })),
    media_slots: { couple_carousel: [], background_music: [{ url: d.music || '/templates/destination-wedding/music.mp3' }] }, couple_photos: [],
  }
}

export function destinationHTML(html: string, d: InvitationData) {
  const baseTag = `<base href="${new URL('/templates/destination-wedding/', window.location.origin).href}">`
  const configJS = `window.__AAMANTRAN_INVITE__=${JSON.stringify(destinationConfig(d)).replace(/</g, '\\u003c')};`
  let replaced = false
  let out = html.replace(/<head([^>]*)>/, `<head$1>${baseTag}`)
  out = out.replace(/window\.__AAMANTRAN_INVITE__\s*=\s*\{[\s\S]*?\};\s*(?=<\/script>)/, () => { replaced = true; return configJS + '\n' })
  if (!replaced) throw new Error('Destination configuration is missing.')
  return out
}

const templates = new WeakMap<Document, HTMLElement>()
const signatures = new WeakMap<Document, string>()

export function applyNewOrderTemplate(doc: Document, d: InvitationData) {
  const mark = (el: Element, section: string, field: string) => {
    el.setAttribute('data-invite-text', `t${d.template}.${section}.${field}`)
    el.setAttribute('data-invite-label', `${section} · ${field}`)
  }
  const copy = (selector: string, value: string, section: string, field: string) => doc.querySelectorAll<HTMLElement>(selector).forEach(el => {
    if (el.textContent !== value) el.textContent = value
    mark(el, section, field)
    el.style.whiteSpace = 'pre-line'; el.style.overflowWrap = 'anywhere'
  })
  const hide = (selector: string) => doc.querySelectorAll<HTMLElement>(selector).forEach(el => { el.hidden = true })
  if (d.template === 13) {
    copy('#heroGroom,#p1Name', d.groom, 'couple', 'groom'); copy('#heroBride,#p2Name', d.bride, 'couple', 'bride')
    doc.querySelector('#heroGroom')?.setAttribute('data-person1', d.groom); doc.querySelector('#heroBride')?.setAttribute('data-person2', d.bride)
    copy('.hero-blessing', d.message, 'opening', 'message')
    const families = doc.querySelectorAll<HTMLElement>('.scene-blessing .invite-couple-line')
    families.forEach((el, index) => { const value = index === 0 ? d.groomFamily : index === 1 ? d.brideFamily : ''; el.textContent = value; el.hidden = !value.trim(); mark(el, 'families', index === 0 ? 'groom' : 'bride') })
    copy('#inviteDateText,#countdownDateDisplay', formatDate(d.date), 'date', 'wedding')
    copy('.scene-things .thing-row:first-of-type .thing-val', d.venue, 'venue', 'name')
    const rows = doc.querySelectorAll<HTMLElement>('.thing-row')
    if (rows[0]) { const name = rows[0].querySelector('.thing-val'), address = rows[0].querySelector('.thing-desc'); if(name){name.textContent=d.venue;mark(name,'venue','name')} if(address){address.textContent=d.address;mark(address,'venue','address')} }
    rows.forEach((row, index) => { if(index > 0)row.hidden=true })
    hide('.scene-couple,.scene-insta,.scene-video,.rsvp-block:has([data-aamantran="wish"]),#wishAllOverlay')
  } else if (d.template === 14) {
    copy('.gate__names', `${d.groom} & ${d.bride}`, 'gate', 'names'); copy('.names', `${d.groom} & ${d.bride}`, 'opening', 'names')
    copy('.gate__date,.date-big,.footer__date', formatDate(d.date), 'date', 'wedding')
    copy('.footer__names', `${d.groom} & ${d.bride}`, 'closing', 'names')
    copy('.lede--story', d.message, 'welcome', 'message')
    doc.querySelectorAll<HTMLElement>('.family').forEach((family, index) => {
      const rows = family.querySelectorAll<HTMLElement>('.family__name')
      rows.forEach((row, i) => { row.textContent = i === 0 ? (index === 0 ? d.groomFamily : d.brideFamily) : ''; row.hidden = i > 0; if(i===0)mark(row,'families',index===0?'groom':'bride') })
      family.hidden = !(index === 0 ? d.groomFamily : d.brideFamily).trim()
    })
    hide('.blessing,.blessing__names,.know__item:has(a[href^="tel:"]),.film,.wishwall,.wishmodal,[data-aamantran="wish"]')
    copy('[data-scene="3"] .lede,[data-scene="6"] .scene-title', d.venue, 'venue', 'name')
    copy('[data-scene="6"] .lede', d.address, 'venue', 'address')
    copy('.hashtag', `#${d.groom.replace(/\s/g,'')}Weds${d.bride.replace(/\s/g,'')}`, 'social', 'hashtag')
    hide('[data-scene="5"] .know,.card:has([data-aamantran="wish"])')
    doc.querySelectorAll<HTMLAnchorElement>('[data-scene="7"] a').forEach(el => { el.hidden = true })
  }

  if (d.template !== 12) {
    const host = doc.querySelector(d.template === 13 ? '.functions-run' : '.functions')
    const signature = JSON.stringify([d.events, d.dressCode, d.groom, d.bride, d.offset])
    if (host && signatures.get(doc) !== signature) {
      if (!templates.has(doc) && host.firstElementChild) templates.set(doc, host.firstElementChild.cloneNode(true) as HTMLElement)
      const original = templates.get(doc)
      if (original) {
        const cards = d.events.map((event, index) => {
          const card = original.cloneNode(true) as HTMLElement
          const section = `event-${event.id || `legacy-${index}`}`
          card.setAttribute('data-invite-section', section)
          card.querySelectorAll('.reveal').forEach(el => { el.classList.remove('reveal'); (el as HTMLElement).style.opacity = '1' })
          card.querySelectorAll('[data-invite-text]').forEach(el => el.removeAttribute('data-invite-text'))
          const set = (selector: string, value: string, field: string) => card.querySelectorAll(selector).forEach(el => { el.textContent=value;mark(el,section,field) })
          set('.fn-name,.fn__name',event.title,'title')
          if(d.template===13){const rows=card.querySelectorAll('.fn-row');[formatDate(event.date),formatTime(event.time),`${event.venue}\n${event.address}`].forEach((value,i)=>{if(rows[i]){rows[i].textContent=value;mark(rows[i],section,['date','time','venue'][i])}})}
          else {set('.fn__date',formatDate(event.date),'date');set('.fn__time',formatTime(event.time),'time');set('.fn__venue',`${event.venue}\n${event.address}`,'venue')}
          set('.fn-dress,.fn__meta',d.dressCode,'dress')
          card.querySelectorAll<HTMLElement>('.fn-dress,.fn__meta').forEach(el=>{el.hidden=!d.dressCode.trim()})
          card.querySelectorAll<HTMLAnchorElement>('a').forEach(el=>{el.hidden=!event.map.trim();el.href=event.map||'#';mark(el,section,'directions')})
          const button=doc.createElement('button');button.type='button';button.className=d.template===13?'fn-map':'fn__map';button.textContent='Add to calendar';mark(button,section,'calendar');button.onclick=()=>downloadCalendar(event,d.offset,`${d.groom} & ${d.bride}`)
          ;(card.querySelector('.function-card')||card).append(button)
          return card
        })
        host.replaceChildren(...cards); signatures.set(doc,signature)
      }
    }
  }

  // Keep optional order notes/gallery out of demo contact and photo sections.
  let extras=doc.querySelector<HTMLElement>('#order-personal-notes')
  if(!extras){extras=doc.createElement('section');extras.id='order-personal-notes';extras.className='order-extra';(doc.querySelector('#rsvpSection')||doc.querySelector('[data-scene="8"]')||doc.querySelector('#root'))?.after(extras)}
  const extraKey=JSON.stringify([d.giftNote,d.dressCode,d.gallery,d.map])
  if(extras.dataset.content!==extraKey){
    extras.dataset.content=extraKey;extras.replaceChildren();extras.setAttribute('data-invite-section','notes')
    for(const [field,value] of [['dress',d.dressCode],['gift',d.giftNote]])if(value.trim()){const p=doc.createElement('p');p.textContent=value;mark(p,'notes',field);extras.append(p)}
    for(const [field,title,url] of [['gallery','Our photo gallery',d.gallery],['directions','Wedding directions',d.map]])if(url.trim()){const a=doc.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=title;mark(a,'notes',field);extras.append(a)}
    extras.hidden=!extras.childElementCount
  }
  if(d.template===12&&!doc.querySelector('#order-rsvp-host')){const host=doc.createElement('section');host.id='order-rsvp-host';host.className='order-extra';doc.body.append(host)}
  doc.querySelectorAll<HTMLElement>('.scene,.panel,.gate,#root > div > section,#order-rsvp-host').forEach((section,index)=>{
    if(!section.hasAttribute('data-invite-section'))section.setAttribute('data-invite-section',`scene-${d.template===14 ? section.dataset.scene || 'gate' : index}`)
  })
}

/** Fixed authored scenes keep their IDs independently of event count. Native
 * event cards are marked while personalized, using persisted celebration IDs. */
export function markNewOrderText(root: HTMLElement, d: InvitationData) {
  if (d.template < 12 || d.template > 14) return
  const normalize = (value: string) => value.trim().replace(/\s+/g, ' ').toLowerCase()
  const fields: [string, string][] = [
    ['groom',d.groom],['bride',d.bride],['groom-family',d.groomFamily],['bride-family',d.brideFamily],
    ['message',d.message],['date',formatDate(d.date)],['venue',d.venue],['address',d.address],['dress',d.dressCode],
  ]
  d.events.forEach((event,index)=>{const id=event.id||`legacy-${index}`;fields.push([`event-${id}-title`,event.title],[`event-${id}-date`,formatDate(event.date)],[`event-${id}-time`,formatTime(event.time)],[`event-${id}-venue`,event.venue],[`event-${id}-address`,event.address])})
  const occurrences=new Map<string,number>()
  const scopes = root.querySelectorAll<HTMLElement>(d.template===12 ? '#root section,#root > div,#order-rsvp-host,#order-personal-notes' : '.scene,.panel,.gate')
  scopes.forEach((scope,index)=>{
    if(scope.hasAttribute('data-invite-section')&&scope.dataset.inviteSection?.startsWith('event-'))return
    const section=d.template===12 ? `scene-${index}` : scope.dataset.scene ? `scene-${scope.dataset.scene}` : [...scope.classList].find(name=>name.startsWith('scene-')) || 'gate'
    scope.setAttribute('data-invite-section',section)
    scope.querySelectorAll<HTMLElement>('h1,h2,h3,h4,p,span,button,a,.hero-name,.invite-person,.invite-blessing,.invite-couple-line,.hero-blessing,.countdown-val,.countdown-lbl').forEach(el=>{
      if(el.closest('[data-invite-text]') || el.querySelector('[data-invite-text],input,textarea,select') || el.closest('form,svg,[hidden]') || !el.textContent?.trim())return
      // Do not select layout containers or nested icon wrappers as text.
      if(el.querySelector('h1,h2,h3,p,button,a'))return
      const value=normalize(el.textContent)
      const field=fields.find(([,text])=>text.trim()&&normalize(text)===value)?.[0]
      const authored=el.id || [...el.classList].find(name=>/^(fn|countdown|invite|hero|gate|footer|family|blessing|scene-title|eyebrow|lede)/.test(name))
      if(!field&&!authored&&d.template===12)return
      const base=`${section}.${field||authored||el.tagName.toLowerCase()}`.replace(/[^a-zA-Z0-9_.:-]/g,'-')
      let occurrence=occurrences.get(base)||0
      while(root.querySelector(`[data-invite-text="t${d.template}.${base}.${occurrence}"]`))occurrence++
      occurrences.set(base,occurrence+1)
      // Existing markers are never renumbered by countdown text updates.
      el.dataset.inviteText=`t${d.template}.${base}.${occurrence}`
      el.dataset.inviteLabel=field||el.textContent.trim().slice(0,60)
    })
  })
}
