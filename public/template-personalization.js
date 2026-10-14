(() => {
  const script = document.currentScript
  const template = Number(script?.dataset.template)
  const query = new URLSearchParams(window.location.search)
  if (!query.has('groom') || !query.has('bride')) return

  const groom = query.get('groom') || ''
  const bride = query.get('bride') || ''
  const event = query.get('event') || 'Wedding Celebration'
  const venue = query.get('venue') || ''
  const address = query.get('address') || ''
  const message = query.get('message') || ''
  const groomFamily = query.get('groomFamily') || ''
  const brideFamily = query.get('brideFamily') || ''
  const map = query.get('map') || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue}, ${address}`)}`
  const date = query.get('date') || ''
  const time = query.get('time') || ''
  const music = query.get('music') || ''

  function formatDate(value, options) {
    if (!value) return ''
    const parsed = new Date(`${value}T12:00:00Z`)
    return Number.isNaN(parsed.getTime()) ? '' : new Intl.DateTimeFormat('en-GB', { ...options, timeZone: 'UTC' }).format(parsed)
  }

  const longDate = formatDate(date, { day: 'numeric', month: 'long', year: 'numeric' })
  const shortDate = formatDate(date, { day: '2-digit', month: '2-digit', year: '2-digit' })
  const timeLabel = time ? new Date(`2000-01-01T${time}:00Z`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }) : ''
  const initial = `${groom.charAt(0)}&${bride.charAt(0)}`
  const names = { KIRAN: groom, RAHUL: bride, KRISHNA: groom, RADHA: bride }
  const familyRows = new Map([
    ["Mr. [Bride's Grandfather Name] & Mrs. [Bride's Grandmother Name]", brideFamily],
    ["Mr. [Bride's Father Name] & Mrs. [Bride's Mother Name]", brideFamily],
    ["Mr. [Grandfather's Name] & Mrs. [Grandmother's Name]", groomFamily],
    ["Mr. [Father's Name] & Mrs. [Mother's Name]", brideFamily],
  ])
  const processed = new WeakMap()

  function transformText(node) {
    const value = node.nodeValue || ''
    if (processed.get(node) === value) return
    const trimmed = value.trim()
    let next = value

    if (message && (trimmed.startsWith('Some souls are destined to find each other') || trimmed.startsWith('Some love stories are written by destiny'))) {
      next = value.replace(trimmed, message)
    } else if (familyRows.has(trimmed)) {
      next = value.replace(trimmed, familyRows.get(trimmed) || '')
    } else if ((!brideFamily && trimmed === 'and beloved daughter of') || (!groomFamily && trimmed === 'together with')) {
      next = value.replace(trimmed, '')
    } else {
      next = value.replace(/\b(KIRAN|RAHUL|KRISHNA|RADHA)\b/gi, (match) => {
        const person = names[match.toUpperCase()]
        if (!person) return match
        if (match === match.toUpperCase()) return person.toUpperCase()
        if (match === match.toLowerCase()) return person.toLowerCase()
        return person
      })
      if (template === 13 && trimmed === '15 December 2026' && longDate) next = next.replace(trimmed, longDate)
      if (template === 14 && trimmed === '08/08/26 - 📍 TAJ HOTEL MUMBAI') {
        next = value.replace(trimmed, `${shortDate} - 📍 ${venue} ${address}`.trim())
      }
      if (template === 13 && trimmed === '7:00 PM' && timeLabel) next = next.replace(trimmed, timeLabel)
      if (template === 14 && trimmed === 'MEHANDI') next = next.replace(trimmed, event.toUpperCase())
      if (template === 13 && trimmed === 'Mehendi Night') next = next.replace(trimmed, event)
      if (/^TAJ HOTEL(?: MUMBAI)?$/i.test(trimmed) && venue) next = next.replace(trimmed, venue.toUpperCase())
      if (trimmed === 'K&R' && groom && bride) next = next.replace(trimmed, initial.toUpperCase())
      if (trimmed === '#Rahulkikiran' && groom && bride) next = next.replace(trimmed, `#${groom}${bride}`)
    }

    if (next !== value) node.nodeValue = next
    processed.set(node, next)
  }

  function apply() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    let node
    while ((node = walker.nextNode())) transformText(node)

    document.querySelectorAll('a').forEach((anchor) => {
      if (/location|locaion/i.test(anchor.textContent || '')) anchor.href = map
    })
    document.title = template === 14
      ? `${bride.toUpperCase()} WEDS ${groom.toUpperCase()}`
      : `${groom.toUpperCase()} WEDS ${bride.toUpperCase()}`
    document.querySelectorAll('meta[property="og:title"],meta[name="twitter:title"]').forEach((meta) => { meta.content = document.title })
    if (music) document.querySelectorAll('audio').forEach((audio) => { if (audio.getAttribute('src') !== music) audio.src = music })
  }

  apply()
  new MutationObserver(apply).observe(document.body, { subtree: true, childList: true, characterData: true })
})()
