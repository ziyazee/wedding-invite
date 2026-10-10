import { useState } from 'react';
import type { TemplateProps } from '../../../types';
import { slugify } from '../../../lib/slugify';
import { SG } from './styles';
import { GoldDivider, GoldBorder, RoseCluster, GeometricCorner } from './decorations';
import SplashScreen from './SplashScreen';
import CountdownTimer from './CountdownTimer';
import EventTimeline from './EventTimeline';
import GuestGuidelines from './GuestGuidelines';
import RsvpForm from './RsvpForm';

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export default function SacredGarden({ details, slug, showSplash = true, previewMode }: TemplateProps) {
  const [splashOpen, setSplashOpen] = useState(showSplash);
  const [splashAnimating, setSplashAnimating] = useState(false);

  function handleOpen() {
    setSplashAnimating(true);
    setTimeout(() => setSplashOpen(false), 800);
  }

  const inviteSlug = slug || slugify(details.groomName, details.brideName);

  return (
    <div className="min-h-full relative" style={{ backgroundColor: SG.bg, color: SG.cream }}>
      {/* Splash Screen */}
      {splashOpen && (
        <SplashScreen onOpen={handleOpen} animating={splashAnimating} />
      )}

      {/* Geometric corners */}
      <GeometricCorner className="absolute top-4 left-4 opacity-60" />
      <GeometricCorner className="absolute top-4 right-4 opacity-60 -scale-x-100" />

      <div className="relative z-10 max-w-lg mx-auto px-6 py-12">

        {/* 1. Couple Names + Date */}
        <section className="text-center py-8">
          <GoldBorder className="mb-6" />
          <p
            className="text-xs tracking-[0.3em] uppercase mb-6"
            style={{ fontFamily: SG.fontBody, color: SG.creamMuted }}
          >
            Together with their families
          </p>
          <h1
            className="text-5xl md:text-6xl mb-2"
            style={{ fontFamily: SG.fontScript, color: SG.gold }}
          >
            {details.groomName || 'Groom'}
          </h1>
          <p className="text-2xl my-3" style={{ fontFamily: SG.fontScript, color: SG.creamMuted }}>
            &amp;
          </p>
          <h1
            className="text-5xl md:text-6xl mb-6"
            style={{ fontFamily: SG.fontScript, color: SG.gold }}
          >
            {details.brideName || 'Bride'}
          </h1>
          <RoseCluster className="mx-auto mb-6 opacity-70" />
          <p
            className="text-lg"
            style={{ fontFamily: SG.fontSerif, color: SG.cream }}
          >
            {formatDate(details.weddingDate)}
          </p>
          <GoldBorder className="mt-6" />
        </section>

        {/* 2. Spiritual Tagline */}
        <section className="text-center py-8">
          <p
            className="text-3xl md:text-4xl leading-snug"
            style={{ fontFamily: SG.fontScript, color: SG.gold }}
          >
            {details.tagline || 'Two Souls One Destiny\nA Lifetime written by Allah'}
          </p>
        </section>

        {/* 3. Welcome Message */}
        <section className="text-center py-8">
          <GoldDivider className="mb-6" />
          <p
            className="text-sm leading-relaxed max-w-sm mx-auto"
            style={{ fontFamily: SG.fontBody, color: SG.creamMuted }}
          >
            {details.optionalMessage ||
              'We invite you to join us for an evening of love, laughter, duas, and unforgettable memories as we celebrate the beginning of our journey together.'}
          </p>
          <GoldDivider className="mt-6" />
        </section>

        {/* 4. Countdown Timer */}
        <section>
          <h3
            className="text-center text-3xl mb-2"
            style={{ fontFamily: SG.fontScript, color: SG.gold }}
          >
            Counting Down
          </h3>
          <CountdownTimer targetDate={details.weddingDate} />
        </section>

        {/* 5. Event Timeline */}
        <section>
          <EventTimeline events={details.timelineEvents} />
        </section>

        {/* 6. Venue */}
        <section className="text-center py-10">
          <GoldDivider className="mb-6" />
          <p
            className="text-xs tracking-[0.3em] uppercase mb-3"
            style={{ fontFamily: SG.fontBody, color: SG.creamMuted }}
          >
            Venue
          </p>
          <h3
            className="text-2xl font-semibold mb-2"
            style={{ fontFamily: SG.fontSerif, color: SG.cream }}
          >
            {details.venueName || 'Venue Name'}
          </h3>
          <p
            className="text-sm"
            style={{ fontFamily: SG.fontBody, color: SG.creamMuted }}
          >
            {details.venueAddress || 'Venue Address'}
          </p>
          <GoldDivider className="mt-6" />
        </section>

        {/* 7. Guest Guidelines */}
        <GuestGuidelines dressCode={details.dressCode} giftNote={details.giftNote} />

        {/* 8. RSVP Form */}
        <section>
          <GoldDivider className="mb-4" />
          <RsvpForm slug={inviteSlug} previewMode={previewMode} />
        </section>

        {/* 9. Closing */}
        <section className="text-center py-12">
          <GoldBorder className="mb-8" />
          <p
            className="text-sm tracking-[0.15em] uppercase mb-4"
            style={{ fontFamily: SG.fontBody, color: SG.creamMuted }}
          >
            Hope to see you there!
          </p>
          <p
            className="text-4xl"
            style={{ fontFamily: SG.fontScript, color: SG.gold }}
          >
            {details.groomName || 'Groom'} &amp; {details.brideName || 'Bride'}
          </p>
          <GoldBorder className="mt-8" />
          <RoseCluster className="mx-auto mt-6 opacity-50" />
        </section>
      </div>

      {/* Bottom geometric corners */}
      <GeometricCorner className="absolute bottom-4 left-4 opacity-60 -scale-y-100" />
      <GeometricCorner className="absolute bottom-4 right-4 opacity-60 -scale-x-100 -scale-y-100" />
    </div>
  );
}
