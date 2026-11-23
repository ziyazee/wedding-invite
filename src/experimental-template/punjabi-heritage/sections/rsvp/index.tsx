/* RSVP — "Aseesh" reply card. A painted tableau (a manja, a lota of water, a plate of sweets) sits
   above a calm parchment form; the useRsvp state is shared, markup and motion are this section's own.
   Animation: tableau settles in, fields rise one by one; on success the stitched check draws itself. */

import { useRef } from 'react'
import { gsap, useGSAP, reveal, drawOn, useRsvp, EASE } from '../../core'
import type { SectionPlugin, SectionProps } from '../../core'
import RsvpDivider from './Divider'
import tableauSrc from '../../assets/generated/rsvp-tableau.webp'
import './rsvp.css'

function Rsvp({ ctx }: SectionProps) {
  const ref = useRef<HTMLElement>(null)
  const { form, update, submit, status, canSubmit, sent } = useRsvp(ctx.onRsvp)

  useGSAP(
    () => {
      if (ctx.reducedMotion) return
      gsap.from('.ph-rsvp__tableau', { opacity: 0, y: 28, scale: 0.96, duration: 1.3, ease: EASE.expo, scrollTrigger: { trigger: '.ph-rsvp__tableau', start: 'top 88%', once: true } })
      reveal('.ph-rsvp__head > *', { trigger: '.ph-rsvp__head', stagger: 0.12 })
      reveal('.ph-form > *', { trigger: '.ph-form', stagger: 0.09, start: 'top 90%' })
    },
    { scope: ref, dependencies: [ctx.reducedMotion] },
  )

  // Success state: the check draws itself.
  useGSAP(
    () => {
      if (!sent || ctx.reducedMotion) return
      drawOn('.ph-rsvp__check .ph-draw', { trigger: null, stagger: 0.4, duration: 0.9 })
      reveal('.ph-rsvp__thanks > *', { trigger: null, stagger: 0.15 })
    },
    { scope: ref, dependencies: [sent, ctx.reducedMotion] },
  )

  return (
    <section ref={ref} className="ph-section ph-rsvp" aria-label="RSVP">
      <div className="ph-section__inner">
        <img className="ph-rsvp__tableau" src={tableauSrc} alt="" width={900} height={531} loading="lazy" decoding="async" />
        <div className="ph-rsvp__head">
          <p className="ph-eyebrow">RSVP</p>
          <h2 className="ph-title">Will you come?</h2>
          <p className="ph-lede ph-rsvp__lede">A manja is kept for you. Tell us you will be there.</p>
        </div>

        {sent ? (
          <div className="ph-rsvp__thanks" role="status">
            <svg className="ph-rsvp__check" viewBox="0 0 64 64" aria-hidden="true">
              <circle className="ph-draw" pathLength="1" cx="32" cy="32" r="29" />
              <path className="ph-draw" pathLength="1" d="M20 33 L29 42 L45 23" />
            </svg>
            <h3 className="ph-title ph-rsvp__thanks-title">Shukriya</h3>
            <p className="ph-body">
              {form.attending ? 'Your place is kept. We cannot wait to celebrate with you.' : 'You will be missed, and carried in our blessings. Thank you for letting us know.'}
            </p>
          </div>
        ) : (
          <form className="ph-form" onSubmit={submit} noValidate>
            <div className="ph-field">
              <label className="ph-field__label" htmlFor="ph-rsvp-name">Your name</label>
              <input
                id="ph-rsvp-name"
                className="ph-input"
                type="text"
                autoComplete="name"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                required
              />
            </div>

            <div className="ph-field" role="group" aria-label="Will you attend?">
              <span className="ph-field__label">Will you attend?</span>
              <div className="ph-choice">
                <button
                  type="button"
                  className={`ph-btn${form.attending === true ? ' is-active' : ''}`}
                  aria-pressed={form.attending === true}
                  onClick={() => update('attending', true)}
                >
                  Yes, I will come
                </button>
                <button
                  type="button"
                  className={`ph-btn${form.attending === false ? ' is-active' : ''}`}
                  aria-pressed={form.attending === false}
                  onClick={() => update('attending', false)}
                >
                  I cannot make it
                </button>
              </div>
            </div>

            {form.attending === true ? (
              <>
                <div className="ph-field">
                  <label className="ph-field__label" htmlFor="ph-rsvp-guests">Guests</label>
                  <select
                    id="ph-rsvp-guests"
                    className="ph-input"
                    value={form.guestCount}
                    onChange={(e) => update('guestCount', Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div className="ph-field">
                  <label className="ph-field__label" htmlFor="ph-rsvp-diet">Dietary needs</label>
                  <input
                    id="ph-rsvp-diet"
                    className="ph-input"
                    type="text"
                    placeholder="Optional"
                    value={form.dietary}
                    onChange={(e) => update('dietary', e.target.value)}
                  />
                </div>
              </>
            ) : null}

            {status === 'error' ? (
              <p className="ph-form__error" role="alert">Something went wrong. Please try again.</p>
            ) : null}

            <button type="submit" className="ph-btn ph-btn--solid" disabled={!canSubmit}>
              {status === 'sending' ? 'Sending…' : 'Send RSVP'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

const plugin: SectionPlugin = {
  id: 'rsvp',
  Component: Rsvp,
  particles: [
    { sprite: 'flame', motion: 'float', count: 6, size: [9, 15], opacity: [0.3, 0.65], zone: 'margins', color: 'lamp' },
    { sprite: 'kanak', motion: 'drift', count: 4, size: [14, 22], opacity: [0.2, 0.45], zone: 'margins', color: 'goldBright' },
  ],
  Divider: RsvpDivider,
}

export default plugin
