import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useInvitationDetails } from "../invitations/context";
import { formatDate, formatTime, mapURL, weddingISO } from "../invitations/model";
import { downloadCalendar } from "../invitations/calendar";
import { invitationExample } from "../invitations/templateData";
import { useTajmahalTouchScroll } from "./useTajmahalTouchScroll";
import "./Tajmahal.css";

/** Starter scaffold for the Tajmahal wedding invitation template. */
export default function Tajmahal() {
  const scrollerRef = useRef<HTMLElement>(null);
  useTajmahalTouchScroll(scrollerRef);
  const details = useInvitationDetails() || invitationExample(17)!;
  const edited = (id: string, original: string) => details.textOverrides?.elements[id]?.content ?? original;
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const countdownPageRef = useRef<HTMLElement>(null);
  const coupleLayerRef = useRef<HTMLImageElement>(null);
  const celebrationsPageRef = useRef<HTMLElement>(null);
  const fifthPageRef = useRef<HTMLElement>(null);
  const fifthCoupleRef = useRef<HTMLImageElement>(null);
  const sixthPageRef = useRef<HTMLElement>(null);
  const sixthCoupleRef = useRef<HTMLImageElement>(null);
  const seventhPageRef = useRef<HTMLElement>(null);
  const seventhCoupleRef = useRef<HTMLImageElement>(null);
  const seventhVideoRef = useRef<HTMLVideoElement>(null);
  const hasStarted = useRef(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [posterVisible, setPosterVisible] = useState(true);
  const [promptVisible, setPromptVisible] = useState(true);
  const [showEnding, setShowEnding] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const scroller = document.querySelector(".tajmahal-template");
    const page = scroller?.querySelector<HTMLElement>('[data-invite-section="t17.families"]');
    if (!scroller || !page) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      page.classList.add("is-visible");
      observer.disconnect();
    }, { root: scroller, threshold: 0.2 });

    observer.observe(page);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const page = countdownPageRef.current;
    const layer = coupleLayerRef.current;
    const scroller = page?.closest(".tajmahal-template");
    if (!page || !layer || !scroller) return;

    let frame = 0;
    const updateParallax = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = page.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1,
          (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height),
        ));
        layer.style.setProperty("--couple-scroll-y", `${(progress * 16) - 8}%`);
      });
    };

    scroller.addEventListener("scroll", updateParallax, { passive: true });
    window.addEventListener("resize", updateParallax);
    updateParallax();
    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll", updateParallax);
      window.removeEventListener("resize", updateParallax);
    };
  }, []);

  useEffect(() => {
    const page = fifthPageRef.current;
    const couple = fifthCoupleRef.current;
    const scroller = page?.closest<HTMLElement>(".tajmahal-template");
    if (!page || !couple || !scroller) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const updateParallax = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = page.getBoundingClientRect();
        const top = bounds.top - scroller.getBoundingClientRect().top;
        const progress = Math.max(0, Math.min(1,
          (scroller.clientHeight - top) / (scroller.clientHeight + bounds.height),
        ));
        couple.style.setProperty("--nikah-scroll-y", `${(progress - 0.5) * 16}%`);
      });
    };

    scroller.addEventListener("scroll", updateParallax, { passive: true });
    window.addEventListener("resize", updateParallax);
    updateParallax();
    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll", updateParallax);
      window.removeEventListener("resize", updateParallax);
    };
  }, []);

  useEffect(() => {
    const page = sixthPageRef.current;
    const couple = sixthCoupleRef.current;
    const scroller = page?.closest<HTMLElement>(".tajmahal-template");
    if (!page || !couple || !scroller) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const updateParallax = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = page.getBoundingClientRect();
        const top = bounds.top - scroller.getBoundingClientRect().top;
        const progress = Math.max(0, Math.min(1,
          (scroller.clientHeight - top) / (scroller.clientHeight + bounds.height),
        ));
        couple.style.setProperty("--garden-scroll-y", `${(progress - 0.5) * 16}%`);
      });
    };

    scroller.addEventListener("scroll", updateParallax, { passive: true });
    window.addEventListener("resize", updateParallax);
    updateParallax();
    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll", updateParallax);
      window.removeEventListener("resize", updateParallax);
    };
  }, []);

  useEffect(() => {
    const page = seventhPageRef.current;
    const couple = seventhCoupleRef.current;
    const scroller = page?.closest<HTMLElement>(".tajmahal-template");
    if (!page || !couple || !scroller) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const updateParallax = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = page.getBoundingClientRect();
        const top = bounds.top - scroller.getBoundingClientRect().top;
        const progress = Math.max(0, Math.min(1,
          (scroller.clientHeight - top) / (scroller.clientHeight + bounds.height),
        ));
        couple.style.setProperty("--terrace-scroll-y", `${(progress - 0.5) * 15}%`);
      });
    };

    scroller.addEventListener("scroll", updateParallax, { passive: true });
    window.addEventListener("resize", updateParallax);
    updateParallax();
    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll", updateParallax);
      window.removeEventListener("resize", updateParallax);
    };
  }, []);

  useEffect(() => {
    const video = seventhVideoRef.current;
    const page = seventhPageRef.current;
    const scroller = page?.closest<HTMLElement>(".tajmahal-template");
    if (!video || !page || !scroller) return;

    // Set both the DOM properties and attributes before mobile playback attempts.
    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");

    const playBackground = () => {
      if (document.hidden || !video.paused) return;
      video.muted = true;
      // A blocked attempt is retried on readiness, scene entry, or a user gesture.
      void video.play().catch(() => {});
    };
    let sceneVisible = false;
    const observer = new IntersectionObserver(([entry]) => {
      sceneVisible = entry.isIntersecting;
      if (sceneVisible) playBackground();
    }, { root: scroller, threshold: 0.1 });
    const resumeVisibleBackground = () => {
      if (sceneVisible) playBackground();
    };

    observer.observe(page);
    video.addEventListener("canplay", playBackground);
    // The opening tap also gives this video a playback attempt in a user gesture.
    scroller.addEventListener("click", playBackground, { passive: true });
    scroller.addEventListener("touchend", playBackground, { passive: true });
    document.addEventListener("visibilitychange", resumeVisibleBackground);
    playBackground();
    return () => {
      observer.disconnect();
      video.removeEventListener("canplay", playBackground);
      scroller.removeEventListener("click", playBackground);
      scroller.removeEventListener("touchend", playBackground);
      document.removeEventListener("visibilitychange", resumeVisibleBackground);
    };
  }, []);

  useEffect(() => {
    const page = celebrationsPageRef.current;
    const scroller = page?.closest<HTMLElement>(".tajmahal-template");
    if (!page || !scroller) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { root: scroller, threshold: 0.15 });

    page.querySelectorAll(".tajmahal-template__celebration-card:not(.is-visible)").forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, [details.events]);

  function playOpening(event: MouseEvent<HTMLButtonElement>) {
    event.currentTarget.blur();
    setPromptVisible(false);
    if (audioRef.current) {
      audioRef.current.volume = 0.35;
      void audioRef.current.play().catch(() => {});
    }
    if (!videoRef.current) return;
    videoRef.current.muted = true;
    if (!hasStarted.current) {
      videoRef.current.currentTime = 1.5;
      hasStarted.current = true;
    }
    void videoRef.current.play().catch(() => {});
  }

  function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.volume = 0.35;
      void audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }

  const weddingTime = new Date(weddingISO(details)).getTime();
  const remaining = Math.max(0, (Number.isFinite(weddingTime) ? weddingTime : now) - now);
  const countdown = [
    Math.floor(remaining / 86400000),
    Math.floor(remaining / 3600000) % 24,
    Math.floor(remaining / 60000) % 60,
    Math.floor(remaining / 1000) % 60,
  ];

  return (
    <main ref={scrollerRef} className="tajmahal-template">
      <section className="tajmahal-template__entry" data-invite-section="t17.entry" aria-label="Tajmahal wedding invitation opening video">
        <audio ref={audioRef} src="/templates/tajmahal/assets/music.mp3" loop preload="none" onPlay={() => setMusicPlaying(true)} onPause={() => setMusicPlaying(false)} />
        <button className="tajmahal-template__entry-trigger" type="button" onClick={playOpening} aria-label="Tap here to begin the celebration">
          <video
            ref={videoRef}
            className="tajmahal-template__entry-video"
            src="/templates/tajmahal/assets/opening.mp4"
            poster="/templates/tajmahal/assets/opening-poster.jpg"
            preload="auto"
            playsInline
            muted
            onPlaying={() => setPosterVisible(false)}
            onTimeUpdate={() => {
              const video = videoRef.current;
              if (video && video.duration > 0 && video.duration - video.currentTime <= 3) setShowEnding(true);
            }}
            onEnded={() => setShowEnding(true)}
            aria-label="Opening video"
          />
          {posterVisible && <img className="tajmahal-template__entry-poster" src="/templates/tajmahal/assets/opening-poster.jpg" alt="" />}
          <span className={`tajmahal-template__tap-prompt${promptVisible ? "" : " is-hidden"}`} data-invite-text="t17.entry.prompt" data-invite-label="Tap prompt" aria-hidden={!promptVisible}>{edited("t17.entry.prompt", "Tap here to begin the celebration")}</span>
        </button>
        <button className="tajmahal-template__music" type="button" aria-label={musicPlaying ? "Pause music" : "Play music"} onClick={toggleMusic}>
          {musicPlaying ? "Ⅱ" : "♫"}
        </button>
        {showEnding && <div className="tajmahal-template__ending-copy" aria-live="polite">
          <p className="tajmahal-template__ending-name" data-invite-text="t17.ending.groom" data-invite-label="Groom name">{edited("t17.ending.groom", details.groom)}</p>
          <span className="tajmahal-template__ending-weds" data-invite-text="t17.ending.weds" data-invite-label="Weds text">{edited("t17.ending.weds", "Weds")}</span>
          <p className="tajmahal-template__ending-name" data-invite-text="t17.ending.bride" data-invite-label="Bride name">{edited("t17.ending.bride", details.bride)}</p>
          {details.date && <p className="tajmahal-template__ending-detail" data-invite-text="t17.ending.date" data-invite-label="Wedding date">{edited("t17.ending.date", formatDate(details.date))}</p>}
        </div>}
      </section>
      <section className="tajmahal-template__families-page" data-invite-section="t17.families" aria-labelledby="tajmahal-families-title">
        <p className="tajmahal-template__eyebrow" data-invite-text="t17.families.heading" data-invite-label="Family heading">{edited("t17.families.heading", "Together with our families")}</p>
        <span className="tajmahal-template__ornament" aria-hidden="true">──── ❀ ────</span>
        <h1 id="tajmahal-families-title" className="tajmahal-template__families-heading" data-invite-text="t17.families.groom" data-invite-label="Groom name">{edited("t17.families.groom", details.groom)}</h1>
        <div className="tajmahal-template__family-grid">
          <div className="tajmahal-template__family">
            <span className="tajmahal-template__ornament tajmahal-template__ornament--small" aria-hidden="true">──── ❀ ────</span>
            {details.groomFamily.trim() && <p data-invite-text="t17.families.groom-family" data-invite-label="Groom family">{edited("t17.families.groom-family", details.groomFamily)}</p>}
          </div>
          <div className="tajmahal-template__family">
            <h2 data-invite-text="t17.families.bride" data-invite-label="Bride name">{edited("t17.families.bride", details.bride)}</h2>
            <span className="tajmahal-template__ornament tajmahal-template__ornament--small" aria-hidden="true">──── ❀ ────</span>
            {details.brideFamily.trim() && <p data-invite-text="t17.families.bride-family" data-invite-label="Bride family">{edited("t17.families.bride-family", details.brideFamily)}</p>}
          </div>
        </div>
        <span className="tajmahal-template__ornament" aria-hidden="true">──── ❀ ────</span>
        <p className="tajmahal-template__family-message" data-invite-text="t17.families.message" data-invite-label="Invitation message">{edited("t17.families.message", details.message)}</p>
        <span className="tajmahal-template__ornament" aria-hidden="true">──── ❀ ────</span>
      </section>
      <section ref={countdownPageRef} className="tajmahal-template__countdown-page" data-invite-section="t17.countdown" aria-label="Wedding countdown">
        <div className="tajmahal-template__countdown-canvas">
          <img
            ref={coupleLayerRef}
            className="tajmahal-template__countdown-couple"
            src="/templates/tajmahal/assets/3-couple.webp"
            alt=""
            aria-hidden="true"
          />
          <div className="tajmahal-template__countdown-grid" aria-live="off">
            {countdown.map((value, index) => (
              <div className="tajmahal-template__countdown-item" key={index}>
                <strong>{String(value).padStart(2, "0")}</strong>
                <span>{["Days", "Hours", "Minutes", "Seconds"][index]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section ref={celebrationsPageRef} className="tajmahal-template__fourth-page" data-invite-section="t17.scene4" aria-label="Wedding celebrations">
        <div className="tajmahal-template__fourth-backdrop" aria-hidden="true">
          <img className="tajmahal-template__fourth-image" src="/templates/tajmahal/assets/4.png" alt="" />
        </div>
        <div className="tajmahal-template__celebration-stack">
          {details.events.map((event, index) => {
            const sectionId = `t17.event-${event.id || `legacy-${index}`}`;
            const field = (name: string, label: string) => ({
              "data-invite-text": `${sectionId}.${name}`,
              "data-invite-label": `${event.title} · ${label}`,
            });
            const text = (name: string, value: string) => edited(`${sectionId}.${name}`, value);
            return <div className="tajmahal-template__celebration-slide" key={event.id ?? index} data-invite-section={sectionId} role="group" aria-label={event.title}>
              <div className="tajmahal-template__celebration-card">
                <h2 {...field("title", "Celebration title")}>{text("title", event.title)}</h2>
                {event.date && <>
                  <time className="tajmahal-template__event-date" dateTime={event.date}>
                    <span className="tajmahal-template__event-day" {...field("day", "Day")}>{text("day", formatDate(event.date, { day: "numeric" }))}</span>
                    <span className="tajmahal-template__event-month-year">
                      <span {...field("month", "Month")}>{text("month", formatDate(event.date, { month: "long" }))}</span>
                      <span className="tajmahal-template__event-year" {...field("year", "Year")}>{text("year", formatDate(event.date, { year: "numeric" }))}</span>
                    </span>
                  </time>
                  <p className="tajmahal-template__event-weekday" {...field("weekday", "Weekday")}>{text("weekday", formatDate(event.date, { weekday: "long" }))}</p>
                </>}
                {event.time && <p className="tajmahal-template__event-time" {...field("time", "Time")}>{text("time", formatTime(event.time))}</p>}
                <div className="tajmahal-template__event-location">
                  <h3 {...field("venue", "Venue")}>{text("venue", event.venue)}</h3>
                  {event.address && <p {...field("address", "Address")}>{text("address", event.address)}</p>}
                </div>
                <div className="tajmahal-template__event-actions">
                  {(event.map || event.venue || event.address) && <a href={mapURL(event.venue, event.address, event.map)} target="_blank" rel="noreferrer" aria-label={`Directions to ${event.title}`}>
                    <span {...field("directions", "Directions label")}>{text("directions", "Directions")}</span>
                  </a>}
                  {event.date && <button type="button" onClick={() => downloadCalendar(event, details.offset, `${details.groom} & ${details.bride}`)} aria-label={`Save the date for ${event.title}`}>
                    <span {...field("calendar", "Save the date label")}>{text("calendar", "Save the date")}</span> <span aria-hidden="true">+</span>
                  </button>}
                </div>
              </div>
            </div>;
          })}
        </div>
      </section>
      <section ref={fifthPageRef} className="tajmahal-template__fifth-page" data-invite-section="t17.scene5" aria-label="Wedding scene five">
        <div className="tajmahal-template__fifth-canvas">
          <img className="tajmahal-template__fifth-image" src="/templates/tajmahal/assets/5.png" alt="" aria-hidden="true" />
          <img ref={fifthCoupleRef} className="tajmahal-template__fifth-couple" src="/templates/tajmahal/assets/5-couple.webp" alt="" aria-hidden="true" draggable={false} />
        </div>
      </section>
      <section ref={sixthPageRef} className="tajmahal-template__sixth-page" data-invite-section="t17.scene6" aria-label="Wedding scene six">
        <div className="tajmahal-template__sixth-canvas">
          <img className="tajmahal-template__sixth-image" src="/templates/tajmahal/assets/6.png" alt="" aria-hidden="true" />
          <img ref={sixthCoupleRef} className="tajmahal-template__sixth-couple" src="/templates/tajmahal/assets/6-couple.webp" alt="" aria-hidden="true" draggable={false} />
        </div>
      </section>
      <section ref={seventhPageRef} className="tajmahal-template__seventh-page" data-invite-section="t17.scene7" aria-label="Wedding scene seven">
        <div className="tajmahal-template__seventh-canvas">
          <video ref={seventhVideoRef} className="tajmahal-template__seventh-image" src="/templates/tajmahal/assets/7.mp4" poster="/templates/tajmahal/assets/7.png" preload="auto" autoPlay loop muted playsInline controls={false} aria-hidden="true" />
          <img ref={seventhCoupleRef} className="tajmahal-template__seventh-couple" src="/templates/tajmahal/assets/7-couple.webp" alt="" aria-hidden="true" draggable={false} />
        </div>
      </section>
    </main>
  );
}
