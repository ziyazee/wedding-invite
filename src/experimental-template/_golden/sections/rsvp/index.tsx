/* RSVP — uses the shared useRsvp state; markup and animation are this section's own.
   Animation: heading and fields focus-pull in; on success the check mark draws itself. */

import { useRef } from 'react'
import { useGSAP, reveal, drawOn, useRsvp } from '../../core'
import type { SectionPlugin, SectionProps } from '../../core'
import RsvpDivider from './Divider'
import './rsvp.css'

function Rsvp({ ctx }: SectionProps) {
  const ref = useRef<HTMLElement>(null)
  const { form, update, submit, status, canSubmit, sent } = useRsvp(ctx.onRsvp)

  useGSAP(
    () => {
      if (ctx.reducedMotion) return
      reveal('.gd-rsvp__head > *', { trigger: '.gd-rsvp__head', stagger: 0.12 })
      reveal('.gd-form > *', { trigger: '.gd-form', stagger: 0.1, start: 'top 88%' })
    },
    { scope: ref, dependencies: [ctx.reducedMotion] },
  )

  // Success state: the check draws itself.
  useGSAP(
    () => {
      if (!sent || ctx.reducedMotion) return
      drawOn('.gd-rsvp__check .gd-draw', { trigger: null, stagger: 0.4, duration: 0.9 })
      reveal('.gd-rsvp__thanks > *', { trigger: null, stagger: 0.15 })
    },
    { scope: ref, dependencies: [sent, ctx.reducedMotion] },
  )

  return (
    <section ref={ref} className="gd-section gd-rsvp" aria-label="RSVP">
      <div className="gd-section__inner">
        <div className="gd-rsvp__head">
          <p className="gd-eyebrow">RSVP</p>
          <h2 className="gd-title">Will you join us?</h2>
          <p className="gd-lede gd-rsvp__lede">We would be honoured by your presence.</p>
        </div>

        {sent ? (
          <div className="gd-rsvp__thanks" role="status">
            <svg className="gd-rsvp__check" viewBox="0 0 64 64" aria-hidden="true">
              <circle className="gd-draw" pathLength="1" cx="32" cy="32" r="29" />
              <path className="gd-draw" pathLength="1" d="M20 33 L29 42 L45 23" />
            </svg>
            <h3 className="gd-title" style={{ fontSize: 30 }}>Thank you</h3>
            <p className="gd-body">
              {form.attending ? 'We cannot wait to celebrate with you.' : 'You will be missed. Thank you for letting us know.'}
            </p>
          </div>
        ) : (
          <form className="gd-form" onSubmit={submit} noValidate>
            <div className="gd-field">
              <label className="gd-field__label" htmlFor="gd-rsvp-name">Your name</label>
              <input
                id="gd-rsvp-name"
                className="gd-input"
                type="text"
                autoComplete="name"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                required
              />
            </div>

            <div className="gd-field" role="group" aria-label="Will you attend?">
              <span className="gd-field__label">Will you attend?</span>
              <div className="gd-choice">
                <button
                  type="button"
                  className={`gd-btn${form.attending === true ? ' is-active' : ''}`}
                  aria-pressed={form.attending === true}
                  onClick={() => update('attending', true)}
                >
                  Joyfully accept
                </button>
                <button
                  type="button"
                  className={`gd-btn${form.attending === false ? ' is-active' : ''}`}
                  aria-pressed={form.attending === false}
                  onClick={() => update('attending', false)}
                >
                  Regretfully decline
                </button>
              </div>
            </div>

            {form.attending === true ? (
              <>
                <div className="gd-field">
                  <label className="gd-field__label" htmlFor="gd-rsvp-guests">Guests</label>
                  <select
                    id="gd-rsvp-guests"
                    className="gd-input"
                    value={form.guestCount}
                    onChange={(e) => update('guestCount', Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div className="gd-field">
                  <label className="gd-field__label" htmlFor="gd-rsvp-diet">Dietary needs</label>
                  <input
                    id="gd-rsvp-diet"
                    className="gd-input"
                    type="text"
                    placeholder="Optional"
                    value={form.dietary}
                    onChange={(e) => update('dietary', e.target.value)}
                  />
                </div>
              </>
            ) : null}

            {status === 'error' ? (
              <p className="gd-form__error" role="alert">Something went wrong. Please try again.</p>
            ) : null}

            <button type="submit" className="gd-btn gd-btn--solid" disabled={!canSubmit}>
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
    { sprite: 'firefly', motion: 'float', count: 9, size: [8, 16], opacity: [0.25, 0.7], zone: 'full', color: 'lamp' },
  ],
  Divider: RsvpDivider,
}

export default plugin
