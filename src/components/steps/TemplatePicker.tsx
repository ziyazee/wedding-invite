import { TEMPLATES } from '../../constants/templates';
import type { TemplateId } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface TemplatePickerProps {
  selected: TemplateId | null;
  onSelect: (id: TemplateId) => void;
  onBack: () => void;
}

export default function TemplatePicker({ selected, onSelect, onBack }: TemplatePickerProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
        Choose a Template
      </h2>
      <p className="text-gray-500 mb-8 text-center">Pick a design that matches your style.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {TEMPLATES.map((t) => (
          <Card
            key={t.id}
            selected={selected === t.id}
            onClick={() => onSelect(t.id)}
          >
            <div
              className="h-32 rounded-lg mb-4 flex items-center justify-center"
              style={{ backgroundColor: t.previewColors.bg }}
            >
              <div className="text-center">
                <div
                  className="text-2xl font-bold mb-1"
                  style={{
                    color: t.previewColors.accent,
                    fontFamily:
                      t.id === 'classic-elegant'
                        ? 'Playfair Display'
                        : t.id === 'floral-garden' || t.id === 'sacred-garden'
                          ? 'Great Vibes'
                          : 'Space Grotesk',
                  }}
                >
                  A & B
                </div>
                <div className="text-xs" style={{ color: t.previewColors.text }}>
                  are getting married
                </div>
              </div>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">{t.name}</h3>
            <p className="text-sm text-gray-500">{t.description}</p>
          </Card>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="ghost" onClick={onBack}>
          ← Back
        </Button>
      </div>
    </div>
  );
}
