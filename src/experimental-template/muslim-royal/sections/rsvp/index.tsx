/* RSVP — "Will You Join Us?" reply card. A painted takht tableau (bolsters, attar, a plate of dates,
   two silver vases of white roses) sits above a calm marble-ivory form; the useRsvp state is shared, markup and motion
   are this section's own. Animation: the tableau settles in with a lamp pulse, fields rise one by one;
   on success the inlay check draws itself.
   Calm card by design: flat ivory, no frosted effects. */

import { useRef } from 'react'
import { gsap, useGSAP, reveal, drawOn, useRsvp, EASE } from '../../core'
import type { SectionPlugin, SectionProps } from '../../core'
import RsvpDivider from './Divider'
import tableauSrc from '../../assets/generated/rsvp-takht-tableau.webp'
import './rsvp.css'

function Rsvp({ ctx }: SectionProps) {
  const ref = useRef<HTMLElement>(null)
  const { form, update, submit, status, canSubmit, sent } = useRsvp(ctx.onRsvp)

  useGSAP(
    () => {
      if (ctx.reducedMotion) return
      gsap.from('.mr-rsvp__tableau', { opacity: 0, y: 28, scale: 0.96, duration: 1.3, ease: EASE.expo, scrollTrigger: { trigger: '.mr-rsvp__tableau', start: 'top 88%', once: true } })
      gsap.to('.mr-rsvp__tableau', { filter: 'brightness(1.07)', duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      reveal('.mr-rsvp__head > *', { trigger: '.mr-rsvp__head', stagger: 0.12 })
      reveal('.mr-form > *', { trigger: '.mr-form', stagger: 0.09, start: 'top 90%' })
    },
    { scope: ref, dependencies: [ctx.reducedMotion] },
  )

  // Success state: the check draws itself.
  useGSAP(
    () => {
      if (!sent || ctx.reducedMotion) return
      drawOn('.mr-rsvp__check .mr-draw', { trigger: null, stagger: 0.4, duration: 0.9 })
      reveal('.mr-rsvp__thanks > *', { trigger: null, stagger: 0.15 })
    },
    { scope: ref, dependencies: [sent, ctx.reducedMotion] },
  )

  return (
    <section ref={ref} className="mr-section mr-rsvp" aria-label="RSVP">
      <div className="mr-section__inner">
        <img className="mr-rsvp__tableau" src={tableauSrc} alt="" width={900} height={456} loading="lazy" decoding="async" />
        <div className="mr-rsvp__head">
          <p className="mr-rsvp__ar mr-arabic" lang="ar" dir="rtl">أهلاً وسهلاً</p>
          <p className="mr-eyebrow">RSVP</p>
          <h2 className="mr-title">Will You Join Us?</h2>
          <p className="mr-lede mr-rsvp__lede">A seat is kept for you on the takht. Tell us you will be there.</p>
        </div>

        {sent ? (
          <div className="mr-rsvp__thanks" role="status">
            <svg className="mr-rsvp__check" viewBox="0 0 64 64" aria-hidden="true">
              <circle className="mr-draw" pathLength="1" cx="32" cy="32" r="29" />
              <path className="mr-draw" pathLength="1" d="M20 33 L29 42 L45 23" />
            </svg>
            <p className="mr-rsvp__ar mr-arabic" lang="ar" dir="rtl">جزاك الله خيراً</p>
            <h3 className="mr-title mr-rsvp__thanks-title">Thank You</h3>
            <p className="mr-body">
              {form.attending ? 'Your place is kept. May Allah reward you, and we cannot wait to celebrate with you.' : 'You will be missed, and carried in our prayers. Thank you for letting us know.'}
            </p>
          </div>
        ) : (
          <form className="mr-form" onSubmit={submit} noValidate>
            <div className="mr-field">
              <label className="mr-field__label" htmlFor="mr-rsvp-name">Your name</label>
              <input
                id="mr-rsvp-name"
                className="mr-input"
                type="text"
                autoComplete="name"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                required
              />
            </div>

            <div className="mr-field" role="group" aria-label="Will you attend?">
              <span className="mr-field__label">Will you attend?</span>
              <div className="mr-choice">
                <button
                  type="button"
                  className={`mr-btn${form.attending === true ? ' is-active' : ''}`}
                  aria-pressed={form.attending === true}
                  onClick={() => update('attending', true)}
                >
                  Yes, I will come
                </button>
                <button
                  type="button"
                  className={`mr-btn${form.attending === false ? ' is-active' : ''}`}
                  aria-pressed={form.attending === false}
                  onClick={() => update('attending', false)}
                >
                  I cannot make it
                </button>
              </div>
            </div>

            {form.attending === true ? (
              <>
                <div className="mr-field">
                  <label className="mr-field__label" htmlFor="mr-rsvp-guests">Guests</label>
                  <select
                    id="mr-rsvp-guests"
                    className="mr-input"
                    value={form.guestCount}
                    onChange={(e) => update('guestCount', Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div className="mr-field">
                  <label className="mr-field__label" htmlFor="mr-rsvp-diet">Dietary needs</label>
                  <input
                    id="mr-rsvp-diet"
                    className="mr-input"
                    type="text"
                    placeholder="Optional"
                    value={form.dietary}
                    onChange={(e) => update('dietary', e.target.value)}
                  />
                </div>
              </>
            ) : null}

            {status === 'error' ? (
              <p className="mr-form__error" role="alert">Something went wrong. Please try again.</p>
            ) : null}

            <button type="submit" className="mr-btn mr-btn--solid" disabled={!canSubmit}>
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
    { sprite: 'hilal', motion: 'drift', count: 4, size: [12, 18], opacity: [0.25, 0.5], zone: 'margins', color: 'goldBright' },
    { sprite: 'rose', motion: 'fall', count: 5, size: [11, 17], opacity: [0.25, 0.5], zone: 'upper', color: 'rose' },
  ],
  Divider: RsvpDivider,
}

export default plugin
