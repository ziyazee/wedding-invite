import type { TimelineEvent } from '../../../types';
import { SG } from './styles';

interface EventTimelineProps {
  events?: TimelineEvent[];
}

const DEFAULT_EVENTS: TimelineEvent[] = [
  { name: 'Guest Arrival', time: '17:00' },
  { name: 'Nikkah Ceremony', time: '18:00' },
  { name: 'Mocktail Hour', time: '19:00' },
  { name: 'Dinner', time: '20:00' },
  { name: 'Dance', time: '21:00' },
];

function formatTime(time: string): string {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
}

export default function EventTimeline({ events }: EventTimelineProps) {
  const items = events && events.length > 0 ? events : DEFAULT_EVENTS;

  return (
    <div className="py-10 px-6">
      <h3
        className="text-center text-3xl mb-10"
        style={{ fontFamily: SG.fontScript, color: SG.gold }}
      >
        Event Schedule
      </h3>

      <div className="relative max-w-sm mx-auto">
        {/* Vertical gold line */}
        <div
          className="absolute left-6 top-0 bottom-0 w-px"
          style={{ backgroundColor: SG.goldDim }}
        />

        <div className="space-y-8">
          {items.map((event, i) => (
            <div key={i} className="flex items-start gap-5 relative">
              {/* Dot */}
              <div
                className="w-3 h-3 rounded-full mt-1.5 shrink-0 relative z-10"
                style={{
                  backgroundColor: SG.gold,
                  boxShadow: `0 0 8px ${SG.goldDim}`,
                  marginLeft: '18px',
                }}
              />
              {/* Content */}
              <div>
                <p
                  className="text-lg font-semibold"
                  style={{ fontFamily: SG.fontSerif, color: SG.cream }}
                >
                  {event.name}
                </p>
                <p
                  className="text-sm mt-0.5"
                  style={{ fontFamily: SG.fontBody, color: SG.creamMuted }}
                >
                  {formatTime(event.time)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
