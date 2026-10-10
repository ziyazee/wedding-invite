import { useState } from 'react';
import type { RsvpEntry } from '../../../types';
import { SG } from './styles';

interface RsvpFormProps {
  slug: string;
  previewMode?: boolean;
}

const STORAGE_PREFIX = 'rsvp_';

function getRsvpEntries(slug: string): RsvpEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_PREFIX + slug) || '[]');
  } catch {
    return [];
  }
}

function saveRsvpEntry(slug: string, entry: RsvpEntry) {
  const entries = getRsvpEntries(slug);
  entries.push(entry);
  localStorage.setItem(STORAGE_PREFIX + slug, JSON.stringify(entries));
}

const inputClass = `w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-shadow`;

export default function RsvpForm({ slug, previewMode }: RsvpFormProps) {
  const [guestName, setGuestName] = useState('');
  const [attending, setAttending] = useState<'yes' | 'no' | ''>('');
  const [numberOfGuests, setNumberOfGuests] = useState('1');
  const [songPreference, setSongPreference] = useState('');
  const [childrenDetails, setChildrenDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (previewMode) return;

    if (!guestName.trim()) { setError('Please enter your name'); return; }
    if (!attending) { setError('Please confirm your attendance'); return; }
    setError('');

    const entry: RsvpEntry = {
      id: crypto.randomUUID(),
      guestName: guestName.trim(),
      attending,
      numberOfGuests: parseInt(numberOfGuests) || 1,
      songPreference: songPreference.trim() || undefined,
      childrenDetails: childrenDetails.trim() || undefined,
      submittedAt: new Date().toISOString(),
    };

    saveRsvpEntry(slug, entry);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="py-12 px-6 text-center">
        <h3
          className="text-3xl mb-3"
          style={{ fontFamily: SG.fontScript, color: SG.gold }}
        >
          Thank You!
        </h3>
        <p className="text-sm" style={{ fontFamily: SG.fontBody, color: SG.creamMuted }}>
          Your RSVP has been recorded. We look forward to celebrating with you.
        </p>
      </div>
    );
  }

  const inputStyles = {
    backgroundColor: 'transparent',
    borderColor: SG.goldDim,
    color: SG.cream,
    fontFamily: SG.fontBody,
  };
  const focusRing = `focus:ring-[${SG.gold}]`;

  return (
    <div className="py-10 px-6">
      <h3
        className="text-center text-3xl mb-2"
        style={{ fontFamily: SG.fontScript, color: SG.gold }}
      >
        RSVP
      </h3>
      <p
        className="text-center text-sm mb-8"
        style={{ fontFamily: SG.fontBody, color: SG.creamMuted }}
      >
        Kindly confirm your attendance
      </p>

      <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-5">
        {error && (
          <p className="text-sm text-center" style={{ color: SG.rose }}>{error}</p>
        )}

        <div>
          <label className="text-xs tracking-wider uppercase mb-1.5 block" style={{ color: SG.creamMuted, fontFamily: SG.fontBody }}>
            Your Name
          </label>
          <input
            className={inputClass + ' ' + focusRing}
            style={inputStyles}
            placeholder="Full name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            disabled={previewMode}
          />
        </div>

        <div>
          <label className="text-xs tracking-wider uppercase mb-1.5 block" style={{ color: SG.creamMuted, fontFamily: SG.fontBody }}>
            Will you attend?
          </label>
          <div className="flex gap-3">
            {(['yes', 'no'] as const).map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => !previewMode && setAttending(val)}
                className="flex-1 py-3 rounded-lg border text-sm transition-all"
                style={{
                  borderColor: attending === val ? SG.gold : SG.goldDim,
                  backgroundColor: attending === val ? SG.gold : 'transparent',
                  color: attending === val ? SG.bg : SG.creamMuted,
                  fontFamily: SG.fontBody,
                }}
              >
                {val === 'yes' ? 'Joyfully Accept' : 'Respectfully Decline'}
              </button>
            ))}
          </div>
        </div>

        {attending === 'yes' && (
          <>
            <div>
              <label className="text-xs tracking-wider uppercase mb-1.5 block" style={{ color: SG.creamMuted, fontFamily: SG.fontBody }}>
                Number of Guests
              </label>
              <input
                type="number"
                min="1"
                max="20"
                className={inputClass + ' ' + focusRing}
                style={inputStyles}
                value={numberOfGuests}
                onChange={(e) => setNumberOfGuests(e.target.value)}
                disabled={previewMode}
              />
            </div>

            <div>
              <label className="text-xs tracking-wider uppercase mb-1.5 block" style={{ color: SG.creamMuted, fontFamily: SG.fontBody }}>
                Song Request (optional)
              </label>
              <input
                className={inputClass + ' ' + focusRing}
                style={inputStyles}
                placeholder="What song would you love to hear?"
                value={songPreference}
                onChange={(e) => setSongPreference(e.target.value)}
                disabled={previewMode}
              />
            </div>

            <div>
              <label className="text-xs tracking-wider uppercase mb-1.5 block" style={{ color: SG.creamMuted, fontFamily: SG.fontBody }}>
                Children attending? (optional)
              </label>
              <textarea
                className={inputClass + ' ' + focusRing + ' resize-none'}
                style={inputStyles}
                rows={2}
                placeholder="Names and ages"
                value={childrenDetails}
                onChange={(e) => setChildrenDetails(e.target.value)}
                disabled={previewMode}
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={previewMode}
          className="w-full py-3 rounded-lg text-sm tracking-[0.15em] uppercase font-medium transition-all hover:opacity-90 disabled:opacity-50"
          style={{
            backgroundColor: SG.gold,
            color: SG.bg,
            fontFamily: SG.fontBody,
          }}
        >
          Send RSVP
        </button>
      </form>
    </div>
  );
}
