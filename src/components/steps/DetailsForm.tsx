import { useState } from 'react';
import type { WeddingDetails, TimelineEvent } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';

interface DetailsFormProps {
  initial: Partial<WeddingDetails>;
  onSubmit: (details: WeddingDetails) => void;
  onBack: () => void;
}

export default function DetailsForm({ initial, onSubmit, onBack }: DetailsFormProps) {
  const [form, setForm] = useState<WeddingDetails>({
    groomName: initial.groomName || '',
    brideName: initial.brideName || '',
    weddingDate: initial.weddingDate || '',
    venueName: initial.venueName || '',
    venueAddress: initial.venueAddress || '',
    ceremonyTime: initial.ceremonyTime || '',
    receptionTime: initial.receptionTime || '',
    optionalMessage: initial.optionalMessage || '',
    tagline: initial.tagline || '',
    dressCode: initial.dressCode || '',
    giftNote: initial.giftNote || '',
    timelineEvents: initial.timelineEvents || [],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof WeddingDetails, string>>>({});
  const [showAdditional, setShowAdditional] = useState(
    Boolean(initial.tagline || initial.dressCode || initial.giftNote || (initial.timelineEvents && initial.timelineEvents.length > 0))
  );

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!form.groomName.trim()) newErrors.groomName = 'Required';
    if (!form.brideName.trim()) newErrors.brideName = 'Required';
    if (!form.weddingDate) newErrors.weddingDate = 'Required';
    if (!form.venueName.trim()) newErrors.venueName = 'Required';
    if (!form.venueAddress.trim()) newErrors.venueAddress = 'Required';
    if (!form.ceremonyTime) newErrors.ceremonyTime = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const cleaned: WeddingDetails = {
      ...form,
      tagline: form.tagline?.trim() || undefined,
      dressCode: form.dressCode?.trim() || undefined,
      giftNote: form.giftNote?.trim() || undefined,
      timelineEvents: form.timelineEvents && form.timelineEvents.length > 0
        ? form.timelineEvents.filter(ev => ev.name.trim())
        : undefined,
    };
    onSubmit(cleaned);
  }

  function update(field: keyof WeddingDetails, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function addTimelineEvent() {
    setForm((prev) => ({
      ...prev,
      timelineEvents: [...(prev.timelineEvents || []), { name: '', time: '' }],
    }));
  }

  function updateTimelineEvent(index: number, field: keyof TimelineEvent, value: string) {
    setForm((prev) => {
      const events = [...(prev.timelineEvents || [])];
      events[index] = { ...events[index], [field]: value };
      return { ...prev, timelineEvents: events };
    });
  }

  function removeTimelineEvent(index: number) {
    setForm((prev) => ({
      ...prev,
      timelineEvents: (prev.timelineEvents || []).filter((_, i) => i !== index),
    }));
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
        Wedding Details
      </h2>
      <p className="text-gray-500 mb-8 text-center">Tell us about the happy couple and the big day.</p>

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Groom's Name"
            placeholder="e.g. Karan"
            value={form.groomName}
            onChange={(e) => update('groomName', e.target.value)}
            error={errors.groomName}
          />
          <Input
            label="Bride's Name"
            placeholder="e.g. Priya"
            value={form.brideName}
            onChange={(e) => update('brideName', e.target.value)}
            error={errors.brideName}
          />
        </div>

        <Input
          label="Wedding Date"
          type="date"
          value={form.weddingDate}
          onChange={(e) => update('weddingDate', e.target.value)}
          error={errors.weddingDate}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Ceremony Time"
            type="time"
            value={form.ceremonyTime}
            onChange={(e) => update('ceremonyTime', e.target.value)}
            error={errors.ceremonyTime}
          />
          <Input
            label="Reception Time"
            type="time"
            value={form.receptionTime}
            onChange={(e) => update('receptionTime', e.target.value)}
            error={errors.receptionTime}
          />
        </div>

        <Input
          label="Venue Name"
          placeholder="e.g. The Grand Ballroom"
          value={form.venueName}
          onChange={(e) => update('venueName', e.target.value)}
          error={errors.venueName}
        />

        <Input
          label="Venue Address"
          placeholder="e.g. 123 Park Avenue, Mumbai"
          value={form.venueAddress}
          onChange={(e) => update('venueAddress', e.target.value)}
          error={errors.venueAddress}
        />

        <Textarea
          label="Personal Message (optional)"
          placeholder="A heartfelt note for your guests..."
          value={form.optionalMessage}
          onChange={(e) => update('optionalMessage', e.target.value)}
        />

        {/* Additional Details */}
        <div className="border-t border-gray-200 pt-5">
          <button
            type="button"
            onClick={() => setShowAdditional(!showAdditional)}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors w-full"
          >
            <svg
              className={`w-4 h-4 transition-transform ${showAdditional ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Additional Details (optional)
          </button>

          {showAdditional && (
            <div className="space-y-5 mt-5">
              <Input
                label="Tagline / Quote"
                placeholder="e.g. Two Souls, One Destiny"
                value={form.tagline || ''}
                onChange={(e) => update('tagline', e.target.value)}
              />

              <Input
                label="Dress Code"
                placeholder="e.g. Avoid deep red and maroon attire"
                value={form.dressCode || ''}
                onChange={(e) => update('dressCode', e.target.value)}
              />

              <Input
                label="Gift Note"
                placeholder="e.g. No boxed gifts please"
                value={form.giftNote || ''}
                onChange={(e) => update('giftNote', e.target.value)}
              />

              {/* Timeline Events */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Event Timeline</label>
                <p className="text-xs text-gray-400 mb-2">Add events in order (e.g. Guest Arrival, Ceremony, Dinner)</p>

                <div className="space-y-3">
                  {(form.timelineEvents || []).map((event, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        placeholder="Event name"
                        value={event.name}
                        onChange={(e) => updateTimelineEvent(i, 'name', e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                      <input
                        type="time"
                        value={event.time}
                        onChange={(e) => updateTimelineEvent(i, 'time', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeTimelineEvent(i)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addTimelineEvent}
                  className="text-sm text-gray-600 hover:text-gray-900 mt-1 self-start transition-colors"
                >
                  + Add Event
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button type="button" variant="ghost" onClick={onBack}>
          ← Back
        </Button>
        <Button type="submit">
          Next: Choose Template →
        </Button>
      </div>
    </form>
  );
}
