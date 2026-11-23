import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HM_DURATION, HM_EASE, HM_BREAKPOINTS } from './animations/constants';

// Stylesheet (fonts are loaded via @import in CSS)
import './styles/hawa-mahal.css';

// Sections
import Welcome from './sections/Welcome';
import WelcomeMessage from './sections/WelcomeMessage';
import Family from './sections/Family';
import Countdown from './sections/Countdown';
import Celebrations from './sections/Celebrations';
import RSVP from './sections/RSVP';
import Closing from './sections/Closing';

// Sample data
import sampleData from './data/sample';

// Register GSAP plugins once at root
gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function HawaMahal() {
  const rootRef = useRef<HTMLDivElement>(null);

  // Cornice shimmer: repeating sweep every 2s while in viewport
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(HM_BREAKPOINTS.fullMotion, () => {
      gsap.set('.hm-cornice-shimmer', {
        backgroundPosition: '100% 0',
      });

      ScrollTrigger.batch('.hm-cornice-shimmer', {
        start: 'top 90%',
        once: true,
        onEnter: (elements) => {
          elements.forEach((el) => {
            const tl = gsap.timeline({ repeat: -1, delay: 0 });
            tl.fromTo(el,
              { backgroundPosition: '100% 0' },
              {
                backgroundPosition: '-100% 0',
                duration: HM_DURATION.shimmer,
                ease: HM_EASE.shimmer,
              }
            ).to({}, { duration: 2 });
          });
        },
      });
    });
  }, { scope: rootRef });

  return (
    <div ref={rootRef} className="hm-root">
      <Welcome data={sampleData} />
      <WelcomeMessage data={sampleData} />
      <Family data={sampleData} />
      <Countdown data={sampleData} />
      <Celebrations data={sampleData} />
      <RSVP data={sampleData} />
      <Closing data={sampleData} />
    </div>
  );
}
