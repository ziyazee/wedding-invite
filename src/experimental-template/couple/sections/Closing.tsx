import type { WeddingData } from '../types';
import { LotusOrnament, GoldDividerA } from '../assets/svg';
import { GoldSparkles } from '../animations/GoldSparkles';

interface ClosingProps {
  data: WeddingData;
  reducedMotion: boolean;
}

export function Closing({ data, reducedMotion }: ClosingProps) {
  return (
    <section className="cp-section cp-section--closing">
      <GoldSparkles count={8} reducedMotion={reducedMotion} />

      <div className="cp-section__content">
        <div className="cp-reveal-child cp-closing__ornament">
          <LotusOrnament style={{ width: 56, height: 'auto' }} className="cp-shimmer cp-shimmer--slow" />
        </div>

        <p className="cp-reveal-child cp-closing__message">
          {data.personalNote ||
            'With hearts full of joy, we look forward to celebrating with you.'}
        </p>

        <p className="cp-reveal-child cp-closing__names">
          {data.couple.brideName} &amp; {data.couple.groomName}
        </p>

        <div className="cp-reveal-child cp-closing__divider">
          <GoldDividerA style={{ maxWidth: 240, width: '100%' }} className="cp-shimmer cp-shimmer--slow cp-shimmer--delay-1" />
        </div>

        <p className="cp-reveal-child cp-closing__footer">
          Made with love
        </p>
      </div>
    </section>
  );
}
