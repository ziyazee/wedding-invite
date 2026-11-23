import React, { useRef, useState, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useGSAP } from '@gsap/react';

// Sections
import Welcome from './sections/Welcome';
import Family from './sections/Family';
import Countdown from './sections/Countdown';
import Celebrations from './sections/Celebrations';
import RSVPSection from './sections/RSVP';
import Closing from './sections/Closing';

// Assets
import floralVineBorder from './assets/images/decorative/floral-vine-border.png';

// Data & styles
import sampleData from './data/sample';
import './MuslimCouple.css';

// Register GSAP plugins once
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, useGSAP);

/**
 * Google Fonts loader — injects a <link> for the template's fonts.
 * Native templates manage their own fonts (no SiteFonts wrapper).
 */
function useFontLoader() {
  useEffect(() => {
    const fontUrl =
      'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cormorant+Garamond:wght@300;400;500;600&family=Great+Vibes&family=Lato:wght@300;400;700&display=swap';

    // Avoid duplicate link tags
    const existing = document.querySelector(`link[href="${fontUrl}"]`);
    if (existing) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fontUrl;
    document.head.appendChild(link);

    return () => {
      // Cleanup on unmount if needed
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, []);
}

/**
 * MuslimCoupleTemplate — Main entry component
 * Composes all 6 sections into a scrollable invitation.
 */
const MuslimCoupleTemplate: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Load fonts
  useFontLoader();

  // Data — in production this would come from props/context
  const data = sampleData;

  // Handle tap-to-open
  const handleOpen = useCallback(() => {
    setIsOpen(true);

    // Start music on open if URL provided
    if (data.musicUrl && !audioRef.current) {
      const audio = new Audio(data.musicUrl);
      audio.loop = true;
      audio.volume = 0.3;
      audioRef.current = audio;
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay blocked — user can tap music button
      });
    }

    // Refresh ScrollTrigger after opening to calculate correct positions
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }, [data.musicUrl]);

  // Music toggle
  const handleMusicToggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      if (data.musicUrl) {
        const newAudio = new Audio(data.musicUrl);
        newAudio.loop = true;
        newAudio.volume = 0.3;
        audioRef.current = newAudio;
        newAudio.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Silent fail
        });
      }
      return;
    }

    if (audio.paused) {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Silent fail
      });
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [data.musicUrl]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div ref={rootRef} className="mc-root">
      <Welcome
        couple={data.couple}
        musicUrl={data.musicUrl}
        onOpen={handleOpen}
        isOpen={isOpen}
        isPlaying={isPlaying}
        onMusicToggle={handleMusicToggle}
      />

      {isOpen && (
        <>
          <div className="mc-garland-transition" style={{ position: 'relative' }}>
            <div className="mc-garland-side mc-garland-side--left" aria-hidden="true">
              <img src={floralVineBorder} alt="" loading="eager" />
            </div>
            <div className="mc-garland-side mc-garland-side--right" aria-hidden="true">
              <img src={floralVineBorder} alt="" loading="eager" />
            </div>
            <Family
              groomFamily={data.groomFamily}
              brideFamily={data.brideFamily}
              couple={data.couple}
              isOpen={isOpen}
            />
          </div>
          <Countdown couple={data.couple} isOpen={isOpen} />
          <Celebrations events={data.events} isOpen={isOpen} />
          <RSVPSection rsvp={data.rsvp} isOpen={isOpen} />
          <Closing closing={data.closing} isOpen={isOpen} />
        </>
      )}
    </div>
  );
};

export default MuslimCoupleTemplate;
