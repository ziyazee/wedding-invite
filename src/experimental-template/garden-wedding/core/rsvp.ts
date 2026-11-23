/* Golden — shared RSVP state. Sections bring their own form markup. */

import { useCallback, useState } from 'react'
import type { RSVPFormData } from './types'

const INITIAL: RSVPFormData = { name: '', guestCount: 1, dietary: '', attending: null }

export function useRsvp(onSubmit?: (response: RSVPFormData) => void | Promise<void>) {
  const [form, setForm] = useState<RSVPFormData>(INITIAL)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const update = useCallback(<K extends keyof RSVPFormData>(key: K, value: RSVPFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }, [])

  const canSubmit = form.attending !== null && form.name.trim().length > 0 && status !== 'sending'

  const submit = useCallback(
    async (e?: { preventDefault: () => void }) => {
      e?.preventDefault()
      if (!canSubmit) return
      setStatus('sending')
      try {
        await onSubmit?.(form)
        setStatus('sent')
      } catch {
        setStatus('error')
      }
    },
    [canSubmit, form, onSubmit],
  )

  return { form, update, submit, status, canSubmit, sent: status === 'sent' }
}
