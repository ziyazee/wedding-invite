import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement as h } from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'
import { readTextLayout, emptyTextLayout, editableText } from '../src/invitations/textLayout.ts'
import { validateDetails } from '../src/invitations/model.ts'
import { InvitationContext } from '../src/invitations/context.tsx'
import { EditableText, InvitationLayoutProvider } from '../src/invitations/components/EditableText.tsx'
import { InvitationSection } from '../src/invitations/components/InvitationSection.tsx'
import { InvitationMedia } from '../src/invitations/components/InvitationMedia.tsx'
import MohadRahma from '../src/pages/MohadRahma.tsx'
import { downloadCalendar } from '../src/invitations/calendar.ts'

const event = { id: 'wedding', title: 'Nikah & Wedding', date: '2027-12-20', time: '11:00', venue: 'Garden Hall', address: 'Mangalore', map: '' }
const details = { template: 1, groom: 'Mohad', bride: 'Rahma', date: event.date, time: event.time, offset: '+05:30', venue: event.venue, address: event.address, map: '', message: 'Welcome', groomFamily: '', brideFamily: '', dressCode: '', giftNote: '', music: '', gallery: '', events: [event] }
const id = 't1.opening.groom'
const layout = { version: 1, elements: { [id]: { fontSize: 64, fontFamily: 'serif', color: '#aAbB01', x: 0.1, y: -0.2 } } }
const textMarkup = (value, props = {}) => render(h(InvitationLayoutProvider, { layout: value }, h(InvitationSection, { 'data-invite-section': 'opening' }, h(EditableText, { as: 'h2', textId: id, label: 'Groom', ...props }, 'Mohad'))))

test('valid version-1 edits survive normalization without mutating input', () => {
  const original = JSON.stringify(layout)
  assert.deepEqual(readTextLayout(layout), layout)
  assert.equal(JSON.stringify(layout), original)
  assert.notEqual(readTextLayout(layout).elements[id], layout.elements[id])
})

test('missing, malformed and future layouts fall back to defaults', () => {
  for (const value of [undefined, null, '', [], {}, { version: 2, elements: layout.elements }, { version: 1, elements: [] }]) assert.deepEqual(readTextLayout(value), emptyTextLayout())
})

test('invalid styles are discarded while valid fields remain', () => {
  assert.deepEqual(readTextLayout({ version: 1, elements: { [id]: { fontSize: 161, x: Infinity, y: -0.2, fontFamily: 'url(evil)', color: 'red', unknown: true } } }).elements[id], { y: -0.2 })
})

test('size and coordinate boundaries are inclusive and reject non-numbers', () => {
  for (const fontSize of [8, 160]) assert.equal(readTextLayout({ version: 1, elements: { [id]: { fontSize, x: -1, y: 1 } } }).elements[id].fontSize, fontSize)
  for (const fontSize of [7, 161, NaN, Infinity, '20']) assert.deepEqual(readTextLayout({ version: 1, elements: { [id]: { fontSize } } }).elements, {})
})

test('invalid IDs are rejected and unknown valid IDs are retained', () => {
  const value = readTextLayout({ version: 1, elements: { 'bad id': { fontSize: 20 }, ['a'.repeat(161)]: { fontSize: 20 }, 't1.future.caption': { fontSize: 20 } } })
  assert.deepEqual(Object.keys(value.elements), ['t1.future.caption'])
})

test('layout entry limit is enforced', () => {
  assert.equal(Object.keys(readTextLayout({ version: 1, elements: Object.fromEntries(Array.from({ length: 305 }, (_, i) => [`t1.field${i}`, { fontSize: 20 }])) }).elements).length, 300)
})

test('markers preserve the saved ID contract; standalone text has no markers', () => {
  assert.deepEqual(editableText(1, 'opening', 'groom', 'Groom'), { 'data-invite-text': id, 'data-invite-label': 'Groom' })
  assert.deepEqual(editableText(undefined, 'opening', 'groom', 'Groom'), {})
})

test('order JSON serialization and published validation preserve saved edits', () => {
  const submitted = validateDetails({ ...details, textOverrides: layout })
  const reloaded = validateDetails(JSON.parse(JSON.stringify(submitted)), true)
  assert.deepEqual(reloaded.textOverrides, layout)
  assert.equal(reloaded.events[0].id, 'wedding')
})

test('old orders without edits receive empty defaults', () => {
  assert.deepEqual(validateDetails(details, true).textOverrides, emptyTextLayout())
})

test('event IDs and edits remain attached when events are reordered', () => {
  const edits = { version: 1, elements: { 't1.event-reception.title': { fontSize: 38 } } }
  const events = [event, { ...event, id: 'reception', title: 'Reception', date: '2027-12-21' }]
  const saved = validateDetails({ ...details, events: events.toReversed(), textOverrides: edits })
  assert.deepEqual(saved.events.map(e => e.id), ['reception', 'wedding'])
  assert.deepEqual(saved.textOverrides, edits)
})

test('invalid dates and unsafe links fail validation', () => {
  assert.throws(() => validateDetails({ ...details, date: '2027-02-30' }), /valid event date/)
  assert.throws(() => validateDetails({ ...details, map: 'javascript:alert(1)' }), /must start/)
})

test('native text renders saved size, font and color with original semantic tag', () => {
  const html = textMarkup(layout)
  assert.match(html, /<h2[^>]*data-invite-text="t1.opening.groom"/)
  assert.match(html, /--invite-font-size:64px/)
  assert.match(html, /--invite-font-family:Georgia/)
  assert.match(html, /--invite-color:#aAbB01/)
  assert.match(html, /data-invite-custom-size=""/)
  assert.match(html, />Mohad<\/h2>/)
})

test('no saved override leaves template styles unchanged', () => {
  const html = textMarkup(undefined, { style: { fontSize: 42, transform: 'scale(1.2)' } })
  assert.match(html, /font-size:42px;transform:scale\(1.2\)/)
  assert.doesNotMatch(html, /data-invite-custom|--invite-font|translate:/)
})

test('different orders do not share text overrides', () => {
  assert.match(textMarkup(layout), /--invite-font-size:64px/)
  assert.doesNotMatch(textMarkup(emptyTextLayout()), /--invite-font-size/)
})

test('media defaults defer images and preload video metadata', () => {
  assert.match(render(h(InvitationMedia, { src: '/art.png', alt: '' })), /loading="lazy"/)
  const video = render(h(InvitationMedia, { kind: 'video', src: '/opening.mp4', muted: true }))
  assert.match(video, /preload="metadata"/)
  assert.match(video, /playsInline=""/)
  assert.doesNotMatch(video, /kind=/)
})

test('priority opening images are eager and explicit media options are respected', () => {
  const html = render(h(InvitationMedia, { src: '/poster.jpg', priority: true, alt: '' }))
  assert.match(html, /loading="eager"/)
  assert.match(html, /fetchPriority="high"/)
  assert.match(render(h(InvitationMedia, { kind: 'video', preload: 'none' })), /preload="none"/)
})

test('Royal Grace initial rendering contains personalized text, overrides and opening control', () => {
  const html = render(h(InvitationContext.Provider, { value: { ...details, groom: 'Ayaan <Ali>', textOverrides: layout } }, h(MohadRahma)))
  assert.match(html, /Ayaan &lt;Ali&gt;/)
  assert.match(html, /--invite-font-size:64px/)
  assert.match(html, /aria-label="Open your invitation"/)
  assert.match(html, /royal-grace\/opening.mp4/)
  assert.doesNotMatch(html, /data-invite-selected|data-invite-guide/)
})

test('standalone Royal Grace retains sample names without order edit markers', () => {
  const html = render(h(MohadRahma))
  assert.match(html, />Mohad<\/span>/)
  assert.match(html, />Rahma<\/span>/)
  assert.doesNotMatch(html, /data-invite-text=/)
})

test('calendar downloads use the event time zone, escape text and omit an invented end time', async t => {
  let blob
  let clicked = false
  const anchor = { click() { clicked = true } }
  t.mock.method(URL, 'createObjectURL', value => { blob = value; return 'blob:unit-test' })
  t.mock.method(URL, 'revokeObjectURL', () => {})
  t.mock.method(globalThis, 'setTimeout', fn => { fn(); return 0 })
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'document')
  Object.defineProperty(globalThis, 'document', { configurable: true, value: { createElement: tag => { assert.equal(tag, 'a'); return anchor } } })
  t.after(() => { if (previous) Object.defineProperty(globalThis, 'document', previous); else delete globalThis.document })
  downloadCalendar({ ...event, title: 'Wedding; dinner\nWelcome' }, '+05:30', 'Mohad & Rahma')
  const content = await blob.text()
  assert.match(content, /DTSTART:20271220T053000Z/)
  assert.ok(content.includes('Wedding\\; dinner\\nWelcome'))
  assert.doesNotMatch(content, /DTEND|DURATION/)
  assert.equal(anchor.download, 'celebration.ics')
  assert.equal(clicked, true)
})
