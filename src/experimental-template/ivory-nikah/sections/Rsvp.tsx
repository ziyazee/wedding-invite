/**
 * Ivory Nikah — RSVP Section
 *
 * Response form with glass-card effect. Balances aesthetic integrity
 * with form usability. Jali background + warm glow center.
 */
import { useState } from 'react';
import { GoldDividerB, RsvpAccent } from '../assets/svg';
import { AmbientLayer } from '../animations/AmbientLayer';
import { rsvpPetals } from '../animations/petalData';

const cornerUrl = new URL('../assets/images/decorative/floral-corner.png', import.meta.url).href;

interface RsvpProps {
  reducedMotion: boolean;
}

export function Rsvp({ reducedMotion }: RsvpProps) {
  const [submitted, setSubmitted] = useState(false);
  const [attending, setAttending] = useState<boolean | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="in-section in-section--warm-glow in-section--jali in-section--rsvp">
      <div className="in-section__bg" />

      {/* Ambient petals — edges only, keep-clear zone respected */}
      <AmbientLayer petals={rsvpPetals} reducedMotion={reducedMotion} />

      <div className="in-section__content">
        <h2 className="in-text-heading in-reveal-child" style={{ marginBottom: 16 }}>
          Kindly Respond
        </h2>

        <div className="in-reveal-child" style={{ marginBottom: 16 }}>
          <GoldDividerB style={{ maxWidth: 200, width: '100%', margin: '0 auto' }} />
        </div>

        <div className="in-reveal-child" style={{ marginBottom: 40, display: 'flex', justifyContent: 'center' }}>
          <RsvpAccent style={{ width: 80 }} />
        </div>

        {/* RSVP Card */}
        <div className="in-rsvp-card">
          {/* Corner ornaments */}
          <img className="in-floral-corner in-floral-corner--tl" src={cornerUrl} alt="" draggable={false} />
          <img className="in-floral-corner in-floral-corner--tr" src={cornerUrl} alt="" draggable={false} />
          <img className="in-floral-corner in-floral-corner--bl" src={cornerUrl} alt="" draggable={false} />
          <img className="in-floral-corner in-floral-corner--br" src={cornerUrl} alt="" draggable={false} />

          {submitted ? (
            <div className="in-rsvp-success">
              <h3 className="in-rsvp-success__title">Thank You</h3>
              <p className="in-rsvp-success__message">
                Your response has been recorded
              </p>
            </div>
          ) : (
            <form className="in-rsvp-form" onSubmit={handleSubmit}>
              <div className="in-field-group">
                <label className="in-field-label" htmlFor="in-rsvp-name">
                  Your Name
                </label>
                <input
                  id="in-rsvp-name"
                  className="in-input"
                  type="text"
                  placeholder="Full name"
                  required
                  autoComplete="name"
                />
              </div>

              <div className="in-field-group">
                <label className="in-field-label" htmlFor="in-rsvp-guests">
                  Number of Guests
                </label>
                <input
                  id="in-rsvp-guests"
                  className="in-input"
                  type="number"
                  placeholder="1"
                  min={1}
                  max={10}
                  defaultValue={1}
                />
              </div>

              <div className="in-field-group">
                <label className="in-field-label">Attendance</label>
                <div className="in-toggle-group">
                  <button
                    type="button"
                    className={`in-toggle-option ${attending === true ? 'in-toggle-option--selected' : ''}`}
                    onClick={() => setAttending(true)}
                  >
                    Joyfully Accept
                  </button>
                  <button
                    type="button"
                    className={`in-toggle-option ${attending === false ? 'in-toggle-option--selected' : ''}`}
                    onClick={() => setAttending(false)}
                  >
                    Regretfully Decline
                  </button>
                </div>
              </div>

              <div className="in-field-group">
                <label className="in-field-label" htmlFor="in-rsvp-message">
                  Message (optional)
                </label>
                <textarea
                  id="in-rsvp-message"
                  className="in-input in-textarea"
                  placeholder="A message for the couple..."
                  rows={3}
                />
              </div>

              <button className="in-button" type="submit" style={{ marginTop: 12, alignSelf: 'center' }}>
                Send Response
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
