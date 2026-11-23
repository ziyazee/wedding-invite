import { useState, useEffect } from 'react';
import { GoldDividerB, LotusOrnament } from '../assets/svg';
import { GoldSparkles } from '../animations/GoldSparkles';

interface CountdownProps {
  targetDate: string;
  reducedMotion: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(target: string): TimeLeft {
  const diff = new Date(target + 'T00:00:00').getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function Countdown({ targetDate, reducedMotion }: CountdownProps) {
  const [time, setTime] = useState(() => calcTimeLeft(targetDate));

  useEffect(() => {
    const id = setInterval(() => setTime(calcTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const units: { label: string; value: number }[] = [
    { label: 'Days', value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Minutes', value: time.minutes },
    { label: 'Seconds', value: time.seconds },
  ];

  return (
    <section className="cp-section cp-section--countdown">
      <GoldSparkles count={10} reducedMotion={reducedMotion} />

      <div className="cp-glow-ring cp-glow-ring--md" aria-hidden="true" />
      <div className="cp-glow-ring cp-glow-ring--lg" aria-hidden="true" />

      <div className="cp-section__content">
        <div className="cp-reveal-child cp-countdown__header">
          <GoldDividerB style={{ maxWidth: 160, width: '100%' }} className="cp-shimmer cp-shimmer--slow" />
          <h2 className="cp-section__title">Counting the Days</h2>
          <GoldDividerB style={{ maxWidth: 160, width: '100%' }} className="cp-shimmer cp-shimmer--slow cp-shimmer--delay-2" />
        </div>

        <div className="cp-reveal-child cp-countdown__grid">
          {units.map((u, i) => (
            <div key={u.label} className="cp-countdown__unit">
              <span className="cp-countdown__value">
                {String(u.value).padStart(2, '0')}
              </span>
              <span className="cp-countdown__label">{u.label}</span>
              {i < units.length - 1 && (
                <span className="cp-countdown__dot" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>

        <div className="cp-reveal-child cp-countdown__ornament">
          <LotusOrnament style={{ width: 28, height: 'auto' }} className="cp-shimmer cp-shimmer--slow cp-shimmer--delay-1" />
        </div>
      </div>
    </section>
  );
}
