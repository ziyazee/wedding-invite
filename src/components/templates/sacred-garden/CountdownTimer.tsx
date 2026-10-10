import { useState, useEffect } from 'react';
import { SG } from './styles';

interface CountdownTimerProps {
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(target: string): TimeLeft | null {
  const diff = new Date(target + 'T00:00:00').getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-18 h-18 md:w-22 md:h-22 rounded-lg flex items-center justify-center border"
        style={{ backgroundColor: SG.bgCard, borderColor: SG.goldDim }}
      >
        <span
          className="text-3xl md:text-4xl font-bold"
          style={{ fontFamily: SG.fontSerif, color: SG.gold }}
        >
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span
        className="text-xs mt-2 tracking-[0.15em] uppercase"
        style={{ fontFamily: SG.fontBody, color: SG.creamMuted }}
      >
        {label}
      </span>
    </div>
  );
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() => calcTimeLeft(targetDate));

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(calcTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <div className="text-center py-10">
        <p className="text-xl" style={{ fontFamily: SG.fontScript, color: SG.gold }}>
          The celebration has begun!
        </p>
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="flex justify-center gap-4 md:gap-6">
        <TimeBox value={timeLeft.days} label="Days" />
        <TimeBox value={timeLeft.hours} label="Hours" />
        <TimeBox value={timeLeft.minutes} label="Minutes" />
        <TimeBox value={timeLeft.seconds} label="Seconds" />
      </div>
    </div>
  );
}
