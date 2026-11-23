import type { WeddingData } from '../types';
import { OmSymbol, SwastikSymbol, GoldDividerB } from '../assets/svg';
import { GoldSparkles } from '../animations/GoldSparkles';

interface WelcomeProps {
  data: WeddingData;
  reducedMotion: boolean;
}

export function Welcome({ data, reducedMotion }: WelcomeProps) {
  return (
    <section className="cp-section cp-section--welcome">
      <GoldSparkles count={10} reducedMotion={reducedMotion} />

      <div className="cp-section__content">
        <div className="cp-reveal-child cp-welcome__om">
          <OmSymbol style={{ width: 70, height: 'auto' }} className="cp-shimmer cp-shimmer--slow" />
        </div>

        <p className="cp-reveal-child cp-welcome__mantra">
          Shree Ganeshaya Namah
        </p>

        <div className="cp-reveal-child cp-welcome__swastik-row">
          <SwastikSymbol style={{ width: 20, height: 'auto' }} className="cp-shimmer cp-shimmer--delay-1" />
          <span className="cp-welcome__shubh">Shubh Vivah</span>
          <SwastikSymbol style={{ width: 20, height: 'auto' }} className="cp-shimmer cp-shimmer--delay-2" />
        </div>

        <div className="cp-reveal-child cp-welcome__divider">
          <GoldDividerB style={{ maxWidth: 140, width: '100%' }} className="cp-shimmer cp-shimmer--slow cp-shimmer--delay-1" />
        </div>

        <h2 className="cp-reveal-child cp-welcome__title">
          Together with their families
        </h2>

        <p className="cp-reveal-child cp-welcome__message">
          With the divine blessings of Lord Ganesh, the grace of our elders,
          and the love that binds our families together, we cordially invite you
          to witness and celebrate the auspicious union of
        </p>

        <div className="cp-reveal-child cp-welcome__names">
          <span className="cp-welcome__name">{data.couple.brideName}</span>
          <span className="cp-welcome__amp">&amp;</span>
          <span className="cp-welcome__name">{data.couple.groomName}</span>
        </div>
      </div>
    </section>
  );
}
