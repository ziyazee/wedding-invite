export function installRsvpForm(doc: Document): void {
 const rsvpForm = doc.querySelector<HTMLFormElement>('[data-atelier-rsvp]')
 if (!rsvpForm) return
 const rsvpSection = rsvpForm.closest<HTMLElement>('.atelier-rsvp-secret-garden,.atelier-rsvp-majestic')
 const openRsvpButtons = rsvpSection?.querySelectorAll<HTMLButtonElement>('[data-secret-garden-open-rsvp]')
 openRsvpButtons?.forEach(openRsvp => openRsvp.addEventListener('click', () => {
  rsvpForm.hidden = false
  rsvpSection?.classList.add('is-open')
  rsvpSection?.querySelector<HTMLElement>('[data-secret-garden-envelope]')?.setAttribute('hidden', '')
  rsvpForm.querySelector<HTMLInputElement>('input[name="fullName"]')?.focus({ preventScroll: true })
 }))
 const guestCountInput = rsvpForm.querySelector<HTMLInputElement>('input[name="guestCount"]')!
 const guestCountOutput = rsvpForm.querySelector<HTMLOutputElement>('[data-guest-count]')!
 const guestFields = rsvpForm.querySelector<HTMLElement>('.atelier-additional-guests')!
 const guestControls = rsvpForm.querySelector<HTMLElement>('.atelier-guest-count')!
 const status = rsvpForm.querySelector<HTMLElement>('.atelier-rsvp-status')!
 let guestCount = 1
 const attending = () => rsvpForm.querySelector<HTMLInputElement>('input[name="attendance"]:checked')?.value === 'yes'
 const renderGuestFields = () => {
  const isAttending = attending()
  guestControls.hidden = !isAttending
  guestCountInput.value = String(isAttending ? guestCount : 0)
  guestCountOutput.value = String(isAttending ? guestCount : 0)
  guestFields.replaceChildren()
  if (isAttending && !rsvpForm.hasAttribute('data-count-only')) for (let index = 2; index <= guestCount; index++) {
   const label = doc.createElement('label')
   label.textContent = `Guest ${index} full name *`
   const input = doc.createElement('input')
   input.name = 'additionalGuest'
   input.type = 'text'
   input.maxLength = 120
   input.required = true
   input.placeholder = `Guest ${index} full name`
   label.append(input)
   guestFields.append(label)
  }
 }
 rsvpForm.querySelectorAll<HTMLInputElement>('input[name="attendance"]').forEach(input => input.addEventListener('change', renderGuestFields))
 guestCountInput.addEventListener('change', () => { guestCount = Math.max(1, Math.min(10, Number(guestCountInput.value) || 1)); renderGuestFields() })
 rsvpForm.querySelectorAll<HTMLButtonElement>('[data-guest-step]').forEach(button => button.addEventListener('click', () => { guestCount = Math.max(1, Math.min(10, guestCount + Number(button.dataset.guestStep))); renderGuestFields() }))
 renderGuestFields()
 rsvpForm.addEventListener('submit', event => {
  event.preventDefault()
  const formData = new FormData(rsvpForm)
  const isAttending = attending()
  const response = { name: String(formData.get('fullName') || '').trim(), attendance: isAttending ? 'yes' as const : 'no' as const, count: isAttending ? guestCount : 0, guests: isAttending ? [...rsvpForm.querySelectorAll<HTMLInputElement>('input[name="additionalGuest"]')].map(input => input.value.trim()) : [], message: String(formData.get('message') || '').trim() }
  rsvpForm.dispatchEvent(new CustomEvent('invitation:rsvp-submit', { bubbles: true, cancelable: true, detail: { response, resolve: () => { status.textContent = 'Your RSVP has been updated.' }, reject: (error: Error) => { status.textContent = error.message } } }))
 })
}
