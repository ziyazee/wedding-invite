import { AbsoluteFill, useVideoConfig, staticFile } from 'remotion';
import { Audio } from '@remotion/media';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadCormorant } from '@remotion/google-fonts/CormorantGaramond';
import { Intro } from './scenes/Intro';
import { Dashboard } from './scenes/Dashboard';
import { AIUpload } from './scenes/AIUpload';
import { LivePreview } from './scenes/LivePreview';
import { PersonalTouches } from './scenes/PersonalTouches';
import { PublishReveal } from './scenes/PublishReveal';
import { MultiInvite } from './scenes/MultiInvite';
import { PricingFlash } from './scenes/PricingFlash';
import { StoreLanding } from './scenes/StoreLanding';
import { CallToAction } from './scenes/CallToAction';

loadPlayfair();
loadInter();
loadCormorant();

const FADE_FRAMES = 15;

export const DemoVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <Audio src={staticFile('audio/final-mix-elevenlabs.wav')} />

      <TransitionSeries>
        {/* 1. Intro — What is Shaadi Invites */}
        <TransitionSeries.Sequence durationInFrames={Math.round(9 * fps)}>
          <Intro />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE_FRAMES })}
        />

        {/* 2. Dashboard — Your dedicated workspace */}
        <TransitionSeries.Sequence durationInFrames={Math.round(10.5 * fps)}>
          <Dashboard />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE_FRAMES })}
        />

        {/* 3. AI Upload — Upload card, AI fills form */}
        <TransitionSeries.Sequence durationInFrames={Math.round(12.4 * fps)}>
          <AIUpload />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE_FRAMES })}
        />

        {/* 4. Review + Live Preview — Drag, resize, Google Maps */}
        <TransitionSeries.Sequence durationInFrames={Math.round(10.4 * fps)}>
          <LivePreview />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE_FRAMES })}
        />

        {/* 5. Personal Touches — Music, dress code, language */}
        <TransitionSeries.Sequence durationInFrames={Math.round(13.3 * fps)}>
          <PersonalTouches />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE_FRAMES })}
        />

        {/* 6. Publish + WhatsApp + Management link */}
        <TransitionSeries.Sequence durationInFrames={Math.round(10.2 * fps)}>
          <PublishReveal />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE_FRAMES })}
        />

        {/* 7. Multiple Invitations */}
        <TransitionSeries.Sequence durationInFrames={Math.round(8.8 * fps)}>
          <MultiInvite />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE_FRAMES })}
        />

        {/* 8. Pricing — You're in control */}
        <TransitionSeries.Sequence durationInFrames={Math.round(8.2 * fps)}>
          <PricingFlash />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE_FRAMES })}
        />

        {/* 9. Store Landing Page */}
        <TransitionSeries.Sequence durationInFrames={Math.round(7.9 * fps)}>
          <StoreLanding />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE_FRAMES })}
        />

        {/* 10. CTA — Onboard your store */}
        <TransitionSeries.Sequence durationInFrames={Math.round(11.5 * fps)}>
          <CallToAction />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
