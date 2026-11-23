/* RSVP — shared useRsvp state; a varaverpu (welcome) ledger under a pair of kuthuvilakku.
   Animation: lamps settle in, heading and fields focus-pull in; on success the check mark draws itself. */

import { useRef } from 'react'
import { useGSAP, reveal, drawOn, useRsvp } from '../../core'
import type { SectionPlugin, SectionProps } from '../../core'
import RsvpDivider from './Divider'
import header from '../../assets/generated/rsvp-header.webp'
import './rsvp.css'

function Rsvp({ ctx }: SectionProps) {
  const ref = useRef<HTMLElement>(null)
  const { form, update, submit, status, canSubmit, sent } = useRsvp(ctx.onRsvp)

  useGSAP(
    () => {
      if (ctx.reducedMotion) return
      reveal('.tm-rsvp__header', { trigger: '.tm-rsvp__header', start: 'top 92%', duration: 1.6 })
      reveal('.tm-rsvp__head > *', { trigger: '.tm-rsvp__head', stagger: 0.12 })
      reveal('.tm-form > *', { trigger: '.tm-form', stagger: 0.1, start: 'top 88%' })
    },
    { scope: ref, dependencies: [ctx.reducedMotion] },
  )

  // Success state: the check draws itself.
  useGSAP(
    () => {
      if (!sent || ctx.reducedMotion) return
      drawOn('.tm-rsvp__check .tm-draw', { trigger: null, stagger: 0.4, duration: 0.9 })
      reveal('.tm-rsvp__thanks > *', { trigger: null, stagger: 0.15 })
    },
    { scope: ref, dependencies: [sent, ctx.reducedMotion] },
  )

  return (
    <section ref={ref} className="tm-section tm-rsvp" aria-label="RSVP">
      <img className="tm-rsvp__header" src={header} alt="" loading="lazy" decoding="async" />
      <div className="tm-section__inner">
        <div className="tm-rsvp__head">
          <p className="tm-eyebrow">RSVP</p>
          <h2 className="tm-title">Will you join us?</h2>
          <p className="tm-lede tm-rsvp__lede">Come with your family and bless the couple. Your company would make our day complete.</p>
        </div>

        {sent ? (
          <div className="tm-rsvp__thanks" role="status">
            <svg className="tm-rsvp__check" viewBox="0 0 64 64" aria-hidden="true">
              <path className="tm-draw" pathLength="1" d="M22 3 H42 V12 H52 V22 H61 V42 H52 V52 H42 V61 H22 V52 H12 V42 H3 V22 H12 V12 H22 Z" />
              <path className="tm-draw" pathLength="1" d="M20 33 L29 42 L45 23" />
            </svg>
            <h3 className="tm-title" style={{ fontSize: 30 }}>Nandri</h3>
            <p className="tm-body">
              {form.attending ? 'We cannot wait to celebrate with you.' : 'You will be missed. Thank you for letting us know.'}
            </p>
          </div>
        ) : (
          <form className="tm-form" onSubmit={submit} noValidate>
            <div className="tm-field">
              <label className="tm-field__label" htmlFor="tm-rsvp-name">Your name</label>
              <input
                id="tm-rsvp-name"
                className="tm-input"
                type="text"
                autoComplete="name"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                required
              />
            </div>

            <div className="tm-field" role="group" aria-label="Will you attend?">
              <span className="tm-field__label">Will you attend?</span>
              <div className="tm-choice">
                <button
                  type="button"
                  className={`tm-btn${form.attending === true ? ' is-active' : ''}`}
                  aria-pressed={form.attending === true}
                  onClick={() => update('attending', true)}
                >
                  Joyfully accept
                </button>
                <button
                  type="button"
                  className={`tm-btn${form.attending === false ? ' is-active' : ''}`}
                  aria-pressed={form.attending === false}
                  onClick={() => update('attending', false)}
                >
                  Regretfully decline
                </button>
              </div>
            </div>

            {form.attending === true ? (
              <>
                <div className="tm-field">
                  <label className="tm-field__label" htmlFor="tm-rsvp-guests">Guests</label>
                  <select
                    id="tm-rsvp-guests"
                    className="tm-input"
                    value={form.guestCount}
                    onChange={(e) => update('guestCount', Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div className="tm-field">
                  <label className="tm-field__label" htmlFor="tm-rsvp-diet">Dietary needs</label>
                  <input
                    id="tm-rsvp-diet"
                    className="tm-input"
                    type="text"
                    placeholder="Optional"
                    value={form.dietary}
                    onChange={(e) => update('dietary', e.target.value)}
                  />
                </div>
              </>
            ) : null}

            {status === 'error' ? (
              <p className="tm-form__error" role="alert">Something went wrong. Please try again.</p>
            ) : null}

            <button type="submit" className="tm-btn tm-btn--solid" disabled={!canSubmit}>
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
    { sprite: 'malli', motion: 'float', count: 4, size: [10, 16], opacity: [0.5, 0.85], zone: 'lower', color: 'goldDim' },
    { sprite: 'kanakambaram', motion: 'fall', count: 3, size: [14, 20], opacity: [0.5, 0.85], zone: 'margins', color: 'dawn' },
  ],
  Divider: RsvpDivider,
}

export default plugin
