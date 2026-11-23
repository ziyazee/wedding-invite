/**
 * Ivory Nikah — Dua / Blessing Section
 *
 * A moment of spiritual gravity. Quranic verse in Arabic with English
 * translation. Sacred quiet — NO petals, NO florals. Jali lattice overlay
 * and warm glow background create a mosque-like quality.
 */
import type { DuaBlessing } from '../types';
import { GoldDividerB, GoldDiamond, SectionLabelRule } from '../assets/svg';

interface DuaProps {
  dua: DuaBlessing;
}

export function Dua({ dua }: DuaProps) {
  return (
    <section className="in-section in-section--warm-glow in-section--jali in-section--dua">
      <div className="in-section__bg" />

      <div className="in-section__content">
        {/* "Blessing" label with flanking rules */}
        <div className="in-dua__label in-reveal-child">
          <SectionLabelRule side="left" style={{ width: 40 }} />
          <span className="in-text-label">Blessing</span>
          <SectionLabelRule side="right" style={{ width: 40 }} />
        </div>

        {/* Arabic verse */}
        <p className="in-dua__verse in-reveal-child">
          {dua.arabic}
        </p>

        {/* Divider */}
        <div className="in-reveal-child" style={{ margin: '0 auto 32px' }}>
          <GoldDividerB style={{ maxWidth: 160, width: '100%', margin: '0 auto' }} />
        </div>

        {/* English translation */}
        <p className="in-dua__translation in-reveal-child">
          &ldquo;{dua.translation}&rdquo;
        </p>

        {/* Attribution */}
        {dua.source && (
          <p className="in-dua__source in-reveal-child">
            &mdash; {dua.source}
          </p>
        )}

        {/* Gold diamond marker */}
        <div className="in-reveal-child" style={{ display: 'flex', justifyContent: 'center' }}>
          <GoldDiamond size={6} />
        </div>
      </div>
    </section>
  );
}
