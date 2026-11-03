import { useRef, useState, type MouseEvent } from "react";
import "./Mahal.css";

/**
 * Starter scaffold for the Mahal wedding invitation template.
 * Add the visual design and invitation content here as the template takes shape.
 */
export default function Mahal() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasStarted = useRef(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [posterVisible, setPosterVisible] = useState(true);
  const [promptVisible, setPromptVisible] = useState(true);

  function playOpening(event: MouseEvent<HTMLButtonElement>) {
    event.currentTarget.blur();
    setPromptVisible(false);
    if (!videoRef.current) return;
    videoRef.current.muted = !musicEnabled;
    if (!hasStarted.current) {
      videoRef.current.currentTime = 1.5;
      hasStarted.current = true;
    }
    void videoRef.current.play().catch(() => {});
  }

  function toggleMusic() {
    setMusicEnabled(enabled => {
      const next = !enabled;
      if (videoRef.current) videoRef.current.muted = !next;
      return next;
    });
  }

  return (
    <main className="mahal-template">
      <section className="mahal-template__entry" aria-label="Wedding invitation opening video">
        <button className="mahal-template__entry-trigger" type="button" onClick={playOpening} aria-label="Tap here to begin the celebration">
          <video
            ref={videoRef}
            className="mahal-template__entry-video"
            src="/templates/mahal/assets/opening.mp4"
            poster="/templates/mahal/assets/opening-poster.jpg"
            preload="auto"
            playsInline
            onPlaying={() => setPosterVisible(false)}
            aria-label="Opening video"
          />
          {posterVisible && <img className="mahal-template__entry-poster" src="/templates/mahal/assets/opening-poster.jpg" alt="" />}
          <span className={`mahal-template__tap-prompt${promptVisible ? "" : " is-hidden"}`} aria-hidden={!promptVisible}>Tap here to begin the celebration</span>
        </button>
        <button
          className="mahal-template__music"
          type="button"
          aria-label={musicEnabled ? "Mute music" : "Enable music"}
          onClick={toggleMusic}
        >
          {musicEnabled ? "♫" : "♪̸"}
        </button>
      </section>
      <section className="mahal-template__hero" aria-labelledby="mahal-title">
        <p className="mahal-template__eyebrow">Together with their families</p>
        <h1 id="mahal-title">A Celebration of Love</h1>
        <p className="mahal-template__names">Partner One &amp; Partner Two</p>
        <p className="mahal-template__date">Wedding date · Venue</p>
      </section>
    </main>
  );
}
