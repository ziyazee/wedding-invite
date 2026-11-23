/**
 * Ivory Nikah — Countdown Section
 *
 * Live countdown timer with gold gradient numbers.
 * Horizontal layout breaks from the vertical stacking pattern.
 * Jali lattice overlay creates geometric harmony.
 */
import { useState, useEffect, useCallback } from 'react';
import { GoldDividerB, CountdownSeparator } from '../assets/svg';
import { AmbientLayer } from '../animations/AmbientLayer';
import { countdownPetals } from '../animations/petalData';

interface CountdownProps {
  targetDate: string;
  reducedMotion: boolean;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function Countdown({ targetDate, reducedMotion }: CountdownProps) {
  const calcRemaining = useCallback((): TimeRemaining => {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }, [targetDate]);

  const [remaining, setRemaining] = useState(calcRemaining);

  useEffect(() => {
    const id = setInterval(() => setRemaining(calcRemaining()), 1000);
    return () => clearInterval(id);
  }, [calcRemaining]);

  const formattedDate = new Date(targetDate + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const units: Array<{ key: keyof TimeRemaining; label: string }> = [
    { key: 'days', label: 'Days' },
    { key: 'hours', label: 'Hours' },
    { key: 'minutes', label: 'Min' },
    { key: 'seconds', label: 'Sec' },
  ];

  return (
    <section className="in-section in-section--clear in-section--jali in-section--countdown">
      {/* Ambient petals */}
      <AmbientLayer petals={countdownPetals} reducedMotion={reducedMotion} />

      <div className="in-section__content">
        <p className="in-text-subtitle in-reveal-child" style={{ color: 'var(--in-brown-warm)', marginBottom: 36 }}>
          The celebration begins in
        </p>

        {/* Countdown grid */}
        <div className="in-countdown in-reveal-child">
          {units.map((unit, i) => (
            <div key={unit.key} style={{ display: 'contents' }}>
              <div className="in-countdown__unit">
                <span className="in-countdown__number">
                  {String(remaining[unit.key]).padStart(2, '0')}
                </span>
                <span className="in-countdown__label">{unit.label}</span>
              </div>
              {i < units.length - 1 && (
                <CountdownSeparator style={{ flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>

        {/* Target date */}
        <p className="in-countdown__target-date in-reveal-child">
          {formattedDate}
        </p>

        {/* Divider */}
        <div className="in-reveal-child" style={{ marginTop: 24 }}>
          <GoldDividerB style={{ maxWidth: 160, width: '100%', margin: '0 auto' }} />
        </div>
      </div>
    </section>
  );
}
