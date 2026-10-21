import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

async function copyText(value: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value)
      return
    }
  } catch {
    // Some browsers deny clipboard access even when the API is available.
  }

  const focused = document.activeElement as HTMLElement | null
  const selection = window.getSelection()
  const ranges = selection ? Array.from({ length: selection.rangeCount }, (_, index) => selection.getRangeAt(index).cloneRange()) : []
  const field = document.createElement('textarea')
  field.value = value
  field.readOnly = true
  field.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;padding:0;border:0;opacity:0;font-size:16px'
  document.body.append(field)
  try {
    field.focus()
    field.select()
    field.setSelectionRange(0, value.length)
    if (!document.execCommand('copy')) throw new Error('Clipboard unavailable')
  } finally {
    field.remove()
    focused?.focus({ preventScroll: true })
    if (selection && ranges.length) {
      selection.removeAllRanges()
      ranges.forEach(range => selection.addRange(range))
    }
  }
}

export default function CopyLinkButton({ value, children, className, label }: {
  value: string; children: ReactNode; className?: string; label?: string
}) {
  const [status, setStatus] = useState<'idle' | 'copying' | 'copied' | 'manual'>('idle')
  const manual = useRef<HTMLInputElement>(null)
  useEffect(() => { setStatus('idle') }, [value])
  useEffect(() => {
    if (status === 'manual') { manual.current?.focus(); manual.current?.select() }
    if (status !== 'copied') return
    const timer = window.setTimeout(() => setStatus('idle'), 2500)
    return () => window.clearTimeout(timer)
  }, [status])
  async function copy() {
    setStatus('copying')
    try { await copyText(value); setStatus('copied') }
    catch { setStatus('manual') }
  }
  return <>
    <button type="button" className={className} disabled={status === 'copying' || !value}
      aria-label={status === 'copied' ? 'Link copied' : label} aria-live="polite" onClick={() => void copy()}>
      {status === 'copied' ? 'Copied!' : status === 'copying' ? 'Copying…' : children}
    </button>
    {status === 'manual' && <label className="copy-link-manual">
      Copy this link manually:
      <input ref={manual} readOnly value={value} onFocus={event => event.currentTarget.select()}/>
    </label>}
  </>
}
