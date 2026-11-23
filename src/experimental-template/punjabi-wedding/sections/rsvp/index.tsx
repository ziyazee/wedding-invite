/* RSVP — shared useRsvp state; a shagan ledger under a rose-and-kalire arch.
   Animation: heading and fields focus-pull in; on success the check mark draws itself. */

import { useRef } from 'react'
import { useGSAP, reveal, drawOn, useRsvp } from '../../core'
import type { SectionPlugin, SectionProps } from '../../core'
import RsvpDivider from './Divider'
import arch from '../../assets/generated/rsvp-kalire-arch.png'
import './rsvp.css'

function Rsvp({ ctx }: SectionProps) {
  const ref = useRef<HTMLElement>(null)
  const { form, update, submit, status, canSubmit, sent } = useRsvp(ctx.onRsvp)

  useGSAP(
    () => {
      if (ctx.reducedMotion) return
      reveal('.pb-rsvp__arch', { trigger: '.pb-rsvp__arch', start: 'top 92%', duration: 1.6 })
      reveal('.pb-rsvp__head > *', { trigger: '.pb-rsvp__head', stagger: 0.12 })
      reveal('.pb-form > *', { trigger: '.pb-form', stagger: 0.1, start: 'top 88%' })
    },
    { scope: ref, dependencies: [ctx.reducedMotion] },
  )

  // Success state: the check draws itself.
  useGSAP(
    () => {
      if (!sent || ctx.reducedMotion) return
      drawOn('.pb-rsvp__check .pb-draw', { trigger: null, stagger: 0.4, duration: 0.9 })
      reveal('.pb-rsvp__thanks > *', { trigger: null, stagger: 0.15 })
    },
    { scope: ref, dependencies: [sent, ctx.reducedMotion] },
  )

  return (
    <section ref={ref} className="pb-section pb-rsvp" aria-label="RSVP">
      <img className="pb-rsvp__arch" src={arch} alt="" loading="lazy" decoding="async" />
      <div className="pb-section__inner">
        <div className="pb-rsvp__head">
          <p className="pb-eyebrow">RSVP</p>
          <h2 className="pb-title">Will you join us?</h2>
          <p className="pb-lede pb-rsvp__lede">Your blessings and your company would make our day complete.</p>
        </div>

        {sent ? (
          <div className="pb-rsvp__thanks" role="status">
            <svg className="pb-rsvp__check" viewBox="0 0 64 64" aria-hidden="true">
              <path className="pb-draw" pathLength="1" d="M22 3 H42 L61 22 V42 L42 61 H22 L3 42 V22 Z" />
              <path className="pb-draw" pathLength="1" d="M20 33 L29 42 L45 23" />
            </svg>
            <h3 className="pb-title" style={{ fontSize: 30 }}>Thank you</h3>
            <p className="pb-body">
              {form.attending ? 'We cannot wait to celebrate with you.' : 'You will be missed. Thank you for letting us know.'}
            </p>
          </div>
        ) : (
          <form className="pb-form" onSubmit={submit} noValidate>
            <div className="pb-field">
              <label className="pb-field__label" htmlFor="pb-rsvp-name">Your name</label>
              <input
                id="pb-rsvp-name"
                className="pb-input"
                type="text"
                autoComplete="name"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                required
              />
            </div>

            <div className="pb-field" role="group" aria-label="Will you attend?">
              <span className="pb-field__label">Will you attend?</span>
              <div className="pb-choice">
                <button
                  type="button"
                  className={`pb-btn${form.attending === true ? ' is-active' : ''}`}
                  aria-pressed={form.attending === true}
                  onClick={() => update('attending', true)}
                >
                  Joyfully accept
                </button>
                <button
                  type="button"
                  className={`pb-btn${form.attending === false ? ' is-active' : ''}`}
                  aria-pressed={form.attending === false}
                  onClick={() => update('attending', false)}
                >
                  Regretfully decline
                </button>
              </div>
            </div>

            {form.attending === true ? (
              <>
                <div className="pb-field">
                  <label className="pb-field__label" htmlFor="pb-rsvp-guests">Guests</label>
                  <select
                    id="pb-rsvp-guests"
                    className="pb-input"
                    value={form.guestCount}
                    onChange={(e) => update('guestCount', Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div className="pb-field">
                  <label className="pb-field__label" htmlFor="pb-rsvp-diet">Dietary needs</label>
                  <input
                    id="pb-rsvp-diet"
                    className="pb-input"
                    type="text"
                    placeholder="Optional"
                    value={form.dietary}
                    onChange={(e) => update('dietary', e.target.value)}
                  />
                </div>
              </>
            ) : null}

            {status === 'error' ? (
              <p className="pb-form__error" role="alert">Something went wrong. Please try again.</p>
            ) : null}

            <button type="submit" className="pb-btn pb-btn--solid" disabled={!canSubmit}>
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
    { sprite: 'gulab', motion: 'fall', count: 6, size: [12, 18], opacity: [0.4, 0.75], zone: 'margins', color: 'dawn' },
    { sprite: 'daisy', motion: 'float', count: 4, size: [12, 16], opacity: [0.5, 0.9], zone: 'lower', color: '#ffffff' },
  ],
  Divider: RsvpDivider,
}

export default plugin
