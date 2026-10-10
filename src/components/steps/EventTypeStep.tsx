import Card from '../ui/Card';

interface EventTypeStepProps {
  onSelect: (type: 'wedding') => void;
}

const EVENT_TYPES = [
  { id: 'wedding' as const, label: 'Wedding', icon: '💍', available: true },
  { id: 'birthday' as const, label: 'Birthday', icon: '🎂', available: false },
  { id: 'engagement' as const, label: 'Engagement', icon: '💐', available: false },
  { id: 'anniversary' as const, label: 'Anniversary', icon: '🥂', available: false },
];

export default function EventTypeStep({ onSelect }: EventTypeStepProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
        What are you celebrating?
      </h2>
      <p className="text-gray-500 mb-8 text-center">Choose the type of event for your invitation.</p>
      <div className="grid grid-cols-2 gap-4">
        {EVENT_TYPES.map((event) => (
          <Card
            key={event.id}
            className={`text-center ${!event.available ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => event.available && onSelect(event.id as 'wedding')}
          >
            <div className="text-4xl mb-3">{event.icon}</div>
            <h3 className="font-medium text-gray-900">{event.label}</h3>
            {!event.available && (
              <span className="text-xs text-gray-400 mt-1 inline-block">Coming Soon</span>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
