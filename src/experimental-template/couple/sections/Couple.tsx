import type { WeddingData } from '../types';
import { LotusOrnament, GoldDividerB } from '../assets/svg';
import { GoldSparkles } from '../animations/GoldSparkles';

interface CoupleProps {
  data: WeddingData;
  reducedMotion: boolean;
}

export function Couple({ data, reducedMotion }: CoupleProps) {
  const { couple, blessing } = data;

  return (
    <section className="cp-section cp-section--couple">
      <GoldSparkles count={8} reducedMotion={reducedMotion} />

      <div className="cp-glow-ring cp-glow-ring--sm" aria-hidden="true" />
      <div className="cp-glow-ring cp-glow-ring--md" aria-hidden="true" />

      <div className="cp-section__content">
        <div className="cp-reveal-child cp-couple__names">
          <div className="cp-couple__person">
            <h3 className="cp-couple__name">{couple.brideName}</h3>
            <p className="cp-couple__family">{couple.brideFamily}</p>
            {(couple.brideFatherName || couple.brideMotherName) && (
              <div className="cp-couple__parents">
                {couple.brideFatherName && (
                  <span className="cp-couple__parent">{couple.brideFatherName}</span>
                )}
                {couple.brideFatherName && couple.brideMotherName && (
                  <span className="cp-couple__parent-sep">&</span>
                )}
                {couple.brideMotherName && (
                  <span className="cp-couple__parent">{couple.brideMotherName}</span>
                )}
              </div>
            )}
          </div>

          <div className="cp-couple__divider-row">
            <GoldDividerB style={{ maxWidth: 60, width: '100%', opacity: 0.35 }} />
            <span className="cp-couple__ampersand">&amp;</span>
            <GoldDividerB style={{ maxWidth: 60, width: '100%', opacity: 0.35 }} />
          </div>

          <div className="cp-couple__person">
            <h3 className="cp-couple__name">{couple.groomName}</h3>
            <p className="cp-couple__family">{couple.groomFamily}</p>
            {(couple.groomFatherName || couple.groomMotherName) && (
              <div className="cp-couple__parents">
                {couple.groomFatherName && (
                  <span className="cp-couple__parent">{couple.groomFatherName}</span>
                )}
                {couple.groomFatherName && couple.groomMotherName && (
                  <span className="cp-couple__parent-sep">&</span>
                )}
                {couple.groomMotherName && (
                  <span className="cp-couple__parent">{couple.groomMotherName}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {blessing && (
          <div className="cp-reveal-child cp-couple__blessing">
            <LotusOrnament style={{ width: 36, height: 'auto', opacity: 0.6 }} className="cp-shimmer cp-shimmer--slow" />
            <p className="cp-couple__blessing-text">{blessing}</p>
            <LotusOrnament style={{ width: 36, height: 'auto', opacity: 0.6 }} className="cp-shimmer cp-shimmer--slow cp-shimmer--delay-2" />
          </div>
        )}
      </div>
    </section>
  );
}
