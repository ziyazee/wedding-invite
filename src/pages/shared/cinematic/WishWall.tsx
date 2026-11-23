import { useCallback, useEffect, useRef, useState } from 'react'
import type { RsvpTarget } from '../../../invitations/rsvp'

const DEMO_WISHES = [
  ['May your journey together be filled with love, laughter and endless blessings. Shubh Vivah!', 'Meera'],
  ['So happy for you both. Can\'t wait for the sangeet!', 'Rahul'],
  ['Wishing you a lifetime of togetherness and joy. Sada saubhagyavati bhava.', 'The Sharmas'],
  ['Been waiting for this day for years. Congratulations to both families!', 'Ananya'],
  ['Sending all our love from Jaipur. May this vivah be the start of something beautiful.', 'Vikram & Neha'],
  ['Blessings and prayers for a wonderful life together. So happy for you both!', 'Priya Aunty'],
] as const

const ON_WALL = 4
const EVERY = 5000
const FADE = 360

interface WishWallProps {
  rsvpTarget?: RsvpTarget
  blessingTitle?: string
  blessingHeading?: string
}

export function WishWall({ rsvpTarget, blessingTitle = 'Blessings for the couple', blessingHeading = 'Aashirvaad' }: WishWallProps) {
  const wallRef = useRef<HTMLDivElement>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [wishes, setWishes] = useState<{ message: string; author: string }[]>([])
  const [visibleIndices, setVisibleIndices] = useState<number[]>([])
  const [queue, setQueue] = useState<number[]>([])
  const slotRef = useRef(0)
  const pausedRef = useRef(false)
  const resumeAtRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Seed demo wishes when no runtime
  useEffect(() => {
    if (/^\/demo\//.test(window.location.pathname) && wishes.length === 0) {
      setWishes(DEMO_WISHES.map(([message, author]) => ({ message, author })))
    }
  }, [])

  // Sync visible/queue when wishes change
  useEffect(() => {
    const n = Math.min(ON_WALL, wishes.length)
    const vis: number[] = []
    const q: number[] = []
    wishes.forEach((_, i) => {
      if (i < n) vis.push(i)
      else q.push(i)
    })
    setVisibleIndices(vis)
    setQueue(q)
    slotRef.current = 0
  }, [wishes])

  // Rotation timer
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current)

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || queue.length === 0) return

    timerRef.current = setInterval(() => {
      if (pausedRef.current || document.hidden || modalOpen) return
      if (resumeAtRef.current && Date.now() < resumeAtRef.current) return

      setQueue(prevQueue => {
        if (prevQueue.length === 0) return prevQueue
        const inIdx = prevQueue[0]
        const restQueue = prevQueue.slice(1)

        setVisibleIndices(prevVis => {
          const slot = slotRef.current
          const outIdx = prevVis[slot]
          const newVis = [...prevVis]
          newVis[slot] = inIdx
          slotRef.current = (slot + 1) % newVis.length

          // Push the swapped-out index back to queue
          setQueue(q => [...q, outIdx])
          return newVis
        })

        return restQueue
      })
    }, EVERY)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [queue.length, modalOpen])

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const nameInput = form.querySelector<HTMLInputElement>('[data-field="guestName"]')
    const msgInput = form.querySelector<HTMLTextAreaElement>('[data-field="message"]')
    const status = form.querySelector<HTMLElement>('[data-aamantran="wish-status"]')
    const text = (msgInput?.value || '').trim()
    const author = (nameInput?.value || '').trim() || 'Guest'

    if (!text) return

    if ((window as any).__AAMANTRAN__) return // real runtime owns this submit

    if (status) {
      status.textContent = 'Thank you — your message would be posted on the live invitation.'
      status.classList.add('is-demo')
    }

    if (/^\/demo\//.test(window.location.pathname) && !(window as any).__PREVIEW__) {
      setWishes(prev => [{ message: text, author }, ...prev])
      form.reset()
    }
  }, [])

  const openModal = useCallback(() => {
    if (wishes.length === 0) return
    setModalOpen(true)
    document.body.classList.add('is-modal')
  }, [wishes.length])

  const closeModal = useCallback(() => {
    setModalOpen(false)
    document.body.classList.remove('is-modal')
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [closeModal])

  return (
    <>
      <div className="card">
        <p className="eyebrow">{blessingTitle}</p>
        <h2 className="scene-title">{blessingHeading}</h2>
        <form className="form" data-aamantran="wish" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="wish-name">Your name</label>
            <input id="wish-name" data-field="guestName" type="text" required autoComplete="name" />
          </div>
          <div className="field">
            <label htmlFor="wish-msg">Your blessing</label>
            <textarea id="wish-msg" data-field="message" rows={3} required />
          </div>
          <button className="btn btn--solid" type="submit">Send your blessing</button>
          <p className="status" data-aamantran="wish-status" role="status" aria-live="polite" />
        </form>

        <div
          className="wishwall"
          data-aamantran="wish-wall"
          ref={wallRef}
          onMouseEnter={() => { pausedRef.current = true }}
          onMouseLeave={() => { pausedRef.current = false }}
          onFocus={() => { pausedRef.current = true }}
          onBlur={() => { pausedRef.current = false }}
          onTouchStart={() => { pausedRef.current = true }}
          onTouchEnd={() => { pausedRef.current = false; resumeAtRef.current = Date.now() + 5000 }}
        >
          {wishes.map((w, i) => (
            <div
              key={i}
              className={`aamantran-wish${!visibleIndices.includes(i) ? ' wish-hidden' : ''}`}
            >
              <p className="aamantran-wish-message">&ldquo;{w.message}&rdquo;</p>
              <span className="aamantran-wish-author">&mdash; {w.author}</span>
            </div>
          ))}
        </div>
        {wishes.length > 0 && (
          <button className="wish-viewall" type="button" onClick={openModal}>
            View all wishes ({wishes.length})
          </button>
        )}
      </div>

      {/* Wish modal */}
      <div className={`wishmodal${modalOpen ? '' : ''}`} data-wish="modal" hidden={!modalOpen}>
        <div className="wishmodal__scrim" data-wish="close" onClick={closeModal} />
        <div className="wishmodal__panel" role="dialog" aria-modal="true" aria-labelledby="wishmodal-title">
          <div className="wishmodal__head">
            <h3 className="wishmodal__title" id="wishmodal-title">{blessingTitle}</h3>
            <button className="wishmodal__close" type="button" data-wish="close" aria-label="Close all blessings" onClick={closeModal}>&times;</button>
          </div>
          <div className="wishmodal__list" data-wish="list">
            {wishes.map((w, i) => (
              <div key={i} className="aamantran-wish">
                <p className="aamantran-wish-message">&ldquo;{w.message}&rdquo;</p>
                <span className="aamantran-wish-author">&mdash; {w.author}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
