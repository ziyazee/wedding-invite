/* RSVP — uses the shared useRsvp state; markup and animation are this section's own.
   A still life crowns a calm ledger of fields: two brass fanoos, a rose-and-jasmine swag, an attar bottle and
   a dish of petals on a carved ledge. Animation: the still life unveils from the centre, the heading and fields
   focus-pull in; on success a khatam check draws itself. */

import { useRef } from 'react'
import { gsap, useGSAP, EASE, reveal, drawOn, useRsvp } from '../../core'
import type { SectionPlugin, SectionProps } from '../../core'
import RsvpDivider from './Divider'
import archSrc from '../../assets/generated/rsvp-tableau.webp'
import './rsvp.css'

function Rsvp({ ctx }: SectionProps) {
  const ref = useRef<HTMLElement>(null)
  const { form, update, submit, status, canSubmit, sent } = useRsvp(ctx.onRsvp)

  useGSAP(
    () => {
      if (ctx.reducedMotion) return
      gsap.from('.mw-rsvp__arch', { clipPath: 'inset(0 50% 0 50%)', opacity: 0, duration: 1.6, ease: EASE.expo, clearProps: 'clipPath', scrollTrigger: { trigger: '.mw-rsvp__arch', start: 'top 90%', once: true } })
      gsap.from('.mw-rsvp__lantern-glow', { opacity: 0, duration: 2.2, delay: 0.8, ease: EASE.out, scrollTrigger: { trigger: '.mw-rsvp__arch', start: 'top 90%', once: true } })
      reveal('.mw-rsvp__head > *', { trigger: '.mw-rsvp__head', stagger: 0.12 })
      reveal('.mw-form > *', { trigger: '.mw-form', stagger: 0.1, start: 'top 88%' })
    },
    { scope: ref, dependencies: [ctx.reducedMotion] },
  )

  // Success state: the check draws itself.
  useGSAP(
    () => {
      if (!sent || ctx.reducedMotion) return
      drawOn('.mw-rsvp__check .mw-draw', { trigger: null, stagger: 0.4, duration: 0.9 })
      reveal('.mw-rsvp__thanks > *', { trigger: null, stagger: 0.15 })
    },
    { scope: ref, dependencies: [sent, ctx.reducedMotion] },
  )

  return (
    <section ref={ref} className="mw-section mw-rsvp" aria-label="RSVP">
      <div className="mw-section__inner">
        <div className="mw-rsvp__still">
          <img className="mw-rsvp__arch" src={archSrc} alt="" loading="lazy" decoding="async" />
          <span className="mw-rsvp__lantern-glow" aria-hidden="true" />
        </div>
        <div className="mw-rsvp__head">
          <p className="mw-eyebrow">RSVP</p>
          <h2 className="mw-title">Will you join us?</h2>
          <p className="mw-lede mw-rsvp__lede">We would be honoured by your presence.</p>
        </div>

        {sent ? (
          <div className="mw-rsvp__thanks" role="status">
            <svg className="mw-rsvp__check" viewBox="0 0 64 64" aria-hidden="true">
              <circle className="mw-draw" pathLength="1" cx="32" cy="32" r="29" />
              <path className="mw-draw" pathLength="1" d="M20 33 L29 42 L45 23" />
            </svg>
            <h3 className="mw-title" style={{ fontSize: 30 }}>Thank you</h3>
            <p className="mw-body">
              {form.attending ? 'We cannot wait to celebrate with you.' : 'You will be missed. Thank you for letting us know.'}
            </p>
          </div>
        ) : (
          <form className="mw-form" onSubmit={submit} noValidate>
            <div className="mw-field">
              <label className="mw-field__label" htmlFor="mw-rsvp-name">Your name</label>
              <input
                id="mw-rsvp-name"
                className="mw-input"
                type="text"
                autoComplete="name"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                required
              />
            </div>

            <div className="mw-field" role="group" aria-label="Will you attend?">
              <span className="mw-field__label">Will you attend?</span>
              <div className="mw-choice">
                <button
                  type="button"
                  className={`mw-btn${form.attending === true ? ' is-active' : ''}`}
                  aria-pressed={form.attending === true}
                  onClick={() => update('attending', true)}
                >
                  Joyfully accept
                </button>
                <button
                  type="button"
                  className={`mw-btn${form.attending === false ? ' is-active' : ''}`}
                  aria-pressed={form.attending === false}
                  onClick={() => update('attending', false)}
                >
                  Regretfully decline
                </button>
              </div>
            </div>

            {form.attending === true ? (
              <>
                <div className="mw-field">
                  <label className="mw-field__label" htmlFor="mw-rsvp-guests">Guests</label>
                  <select
                    id="mw-rsvp-guests"
                    className="mw-input"
                    value={form.guestCount}
                    onChange={(e) => update('guestCount', Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div className="mw-field">
                  <label className="mw-field__label" htmlFor="mw-rsvp-diet">Dietary needs</label>
                  <input
                    id="mw-rsvp-diet"
                    className="mw-input"
                    type="text"
                    placeholder="Optional"
                    value={form.dietary}
                    onChange={(e) => update('dietary', e.target.value)}
                  />
                </div>
              </>
            ) : null}

            {status === 'error' ? (
              <p className="mw-form__error" role="alert">Something went wrong. Please try again.</p>
            ) : null}

            <button type="submit" className="mw-btn mw-btn--solid" disabled={!canSubmit}>
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
    { sprite: 'pearl', motion: 'float', count: 5, size: [6, 10], opacity: [0.5, 0.85], zone: 'margins', color: 'pearl' },
    { sprite: 'mogra', motion: 'fall', count: 4, size: [9, 14], opacity: [0.5, 0.85], zone: 'margins', color: 'goldBright' },
    { sprite: 'attar', motion: 'rise', count: 3, size: [7, 10], opacity: [0.25, 0.5], zone: 'lower', color: 'rose' },
  ],
  Divider: RsvpDivider,
}

export default plugin
