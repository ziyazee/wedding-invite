import { useState } from 'react';
import { GoldDividerB, LotusOrnament } from '../assets/svg';
import { GoldSparkles } from '../animations/GoldSparkles';

interface RsvpProps {
  reducedMotion: boolean;
}

export function Rsvp({ reducedMotion }: RsvpProps) {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [attending, setAttending] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Please enter your name';
    if (!attending) next.attending = 'Please select an option';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="cp-section cp-section--rsvp">
        <div className="cp-section__content">
          <div className="cp-rsvp__thankyou">
            <LotusOrnament style={{ width: 48, height: 'auto' }} />
            <h2 className="cp-section__title">Thank You</h2>
            <p className="cp-rsvp__thankyou-text">
              {attending === 'yes'
                ? 'We are delighted you will be joining us. See you at the celebration!'
                : 'Thank you for letting us know. You will be missed!'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="cp-section cp-section--rsvp">
      <GoldSparkles count={8} reducedMotion={reducedMotion} />

      <div className="cp-section__content">
        <div className="cp-reveal-child cp-rsvp__header">
          <GoldDividerB style={{ maxWidth: 160, width: '100%' }} className="cp-shimmer cp-shimmer--slow" />
          <h2 className="cp-section__title">RSVP</h2>
          <GoldDividerB style={{ maxWidth: 160, width: '100%' }} className="cp-shimmer cp-shimmer--slow cp-shimmer--delay-2" />
        </div>

        <form className="cp-reveal-child cp-rsvp__form" onSubmit={handleSubmit}>
          <div className="cp-rsvp__field">
            <label className="cp-rsvp__label" htmlFor="cp-name">
              Your Name
            </label>
            <input
              id="cp-name"
              className="cp-rsvp__input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
            />
            {errors.name && <span className="cp-rsvp__error">{errors.name}</span>}
          </div>

          <div className="cp-rsvp__field">
            <label className="cp-rsvp__label" htmlFor="cp-attending">
              Will you attend?
            </label>
            <select
              id="cp-attending"
              className="cp-rsvp__select"
              value={attending}
              onChange={(e) => setAttending(e.target.value)}
            >
              <option value="">Select…</option>
              <option value="yes">Joyfully Accept</option>
              <option value="no">Respectfully Decline</option>
            </select>
            {errors.attending && (
              <span className="cp-rsvp__error">{errors.attending}</span>
            )}
          </div>

          {attending === 'yes' && (
            <div className="cp-rsvp__field">
              <label className="cp-rsvp__label" htmlFor="cp-guests">
                Number of Guests
              </label>
              <input
                id="cp-guests"
                className="cp-rsvp__input cp-rsvp__input--small"
                type="number"
                min={1}
                max={10}
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
              />
            </div>
          )}

          <div className="cp-rsvp__field">
            <label className="cp-rsvp__label" htmlFor="cp-message">
              Message for the Couple
            </label>
            <textarea
              id="cp-message"
              className="cp-rsvp__textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your wishes…"
              rows={3}
            />
          </div>

          <button type="submit" className="cp-rsvp__submit">
            Send RSVP
          </button>
        </form>
      </div>
    </section>
  );
}
