import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useInvitationDetails } from "../invitations/context";
import { formatDate, formatTime, mapURL, weddingISO } from "../invitations/model";
import { downloadCalendar } from "../invitations/calendar";
import { invitationExample } from "../invitations/templateData";
import "./Kerala.css";

export default function Kerala() {
  const details = useInvitationDetails() || invitationExample(18)!;
  const edited = (id: string, original: string) => details.textOverrides?.elements[id]?.content ?? original;
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
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
    const scroller = document.querySelector(".kerala-template");
    const page = scroller?.querySelector<HTMLElement>('[data-invite-section="t18.families"]');
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
    const page = document.querySelector<HTMLElement>('[data-invite-section="t18.celebrations"]');
    const scroller = page?.closest<HTMLElement>(".kerala-template");
    if (!page || !scroller) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { root: scroller, threshold: 0.15 });

    page.querySelectorAll(".kerala-template__celebration-card:not(.is-visible)").forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, [details.events]);

  function playOpening(event: MouseEvent<HTMLButtonElement>) {
    event.currentTarget.blur();
    setPromptVisible(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 4;
      audioRef.current.volume = 0.35;
      void audioRef.current.play().catch(() => {});
    }
    if (!videoRef.current) return;
    videoRef.current.muted = true;
    if (!hasStarted.current) {
      videoRef.current.currentTime = 0;
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
    <main className="kerala-template">
      <section className="kerala-template__entry" data-invite-section="t18.entry" aria-label="Kerala wedding invitation opening video">
        <audio ref={audioRef} src="/templates/kerala/assets/music.mp3" loop preload="none" onPlay={() => setMusicPlaying(true)} onPause={() => setMusicPlaying(false)} />
        <button className="kerala-template__entry-trigger" type="button" onClick={playOpening} aria-label="Tap here to begin the celebration">
          <video
            ref={videoRef}
            className="kerala-template__entry-video"
            src="/templates/kerala/assets/opening.mp4"
            poster="/templates/kerala/assets/opening-poster.jpg"
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
          {posterVisible && <img className="kerala-template__entry-poster" src="/templates/kerala/assets/opening-poster.jpg" alt="" />}
          <span className={`kerala-template__tap-prompt${promptVisible ? "" : " is-hidden"}`} data-invite-text="t18.entry.prompt" data-invite-label="Tap prompt" aria-hidden={!promptVisible}>{edited("t18.entry.prompt", "Tap here to begin the celebration")}</span>
        </button>
        <button className="kerala-template__music" type="button" aria-label={musicPlaying ? "Pause music" : "Play music"} onClick={toggleMusic}>
          {musicPlaying ? "Ⅱ" : "♫"}
        </button>
        {showEnding && <div className="kerala-template__ending-copy" aria-live="polite">
          <p className="kerala-template__ending-name" data-invite-text="t18.ending.groom" data-invite-label="Groom name">{edited("t18.ending.groom", details.groom)}</p>
          <span className="kerala-template__ending-weds" data-invite-text="t18.ending.weds" data-invite-label="Weds text">{edited("t18.ending.weds", "Weds")}</span>
          <p className="kerala-template__ending-name" data-invite-text="t18.ending.bride" data-invite-label="Bride name">{edited("t18.ending.bride", details.bride)}</p>
          {details.date && <p className="kerala-template__ending-detail" data-invite-text="t18.ending.date" data-invite-label="Wedding date">{edited("t18.ending.date", formatDate(details.date))}</p>}
        </div>}
      </section>
      <section className="kerala-template__families-page" data-invite-section="t18.families" aria-labelledby="kerala-families-title">
        <p className="kerala-template__eyebrow" data-invite-text="t18.families.heading" data-invite-label="Family heading">{edited("t18.families.heading", "Together with our families")}</p>
        <h1 id="kerala-families-title" className="kerala-template__families-heading" data-invite-text="t18.families.groom" data-invite-label="Groom name">{edited("t18.families.groom", details.groom)}</h1>
        <div className="kerala-template__family-grid">
          <div className="kerala-template__family">
            {details.groomFamily.trim() && <p data-invite-text="t18.families.groom-family" data-invite-label="Groom family">{edited("t18.families.groom-family", details.groomFamily)}</p>}
          </div>
          <div className="kerala-template__family">
            <h2 data-invite-text="t18.families.bride" data-invite-label="Bride name">{edited("t18.families.bride", details.bride)}</h2>
            {details.brideFamily.trim() && <p data-invite-text="t18.families.bride-family" data-invite-label="Bride family">{edited("t18.families.bride-family", details.brideFamily)}</p>}
          </div>
        </div>
        <p className="kerala-template__family-message" data-invite-text="t18.families.message" data-invite-label="Invitation message">{edited("t18.families.message", details.message)}</p>
      </section>
      <section className="kerala-template__countdown-page" data-invite-section="t18.countdown" aria-label="Wedding countdown">
        <div className="kerala-template__countdown-canvas">
          <div className="kerala-template__countdown-grid" aria-live="off">
            {countdown.map((value, index) => (
              <div className="kerala-template__countdown-item" key={index}>
                <strong>{String(value).padStart(2, "0")}</strong>
                <span>{["Days", "Hours", "Minutes", "Seconds"][index]}</span>
              </div>
            ))}
          </div>
        </div>
        <img className="kerala-template__countdown-couple" src="/templates/kerala/assets/3-couple.png" alt="" loading="lazy" decoding="async" />
      </section>
      <section className="kerala-template__celebrations-page" data-invite-section="t18.celebrations" aria-label="Wedding celebrations">
        <div className="kerala-template__celebration-stack">
          {details.events.map((event, index) => {
            const sectionId = `t18.event-${event.id || `legacy-${index}`}`;
            const field = (name: string, label: string) => ({
              "data-invite-text": `${sectionId}.${name}`,
              "data-invite-label": `${event.title} · ${label}`,
            });
            const text = (name: string, value: string) => edited(`${sectionId}.${name}`, value);
            return <div className="kerala-template__celebration-slide" key={event.id ?? index} data-invite-section={sectionId} role="group" aria-label={event.title}>
              <div className="kerala-template__celebration-card">
                <h2 {...field("title", "Celebration title")}>{text("title", event.title)}</h2>
                {event.date && <>
                  <time className="kerala-template__event-date" dateTime={event.date}>
                    <span className="kerala-template__event-day" {...field("day", "Day")}>{text("day", formatDate(event.date, { day: "numeric" }))}</span>
                    <span className="kerala-template__event-month-year">
                      <span {...field("month", "Month")}>{text("month", formatDate(event.date, { month: "long" }))}</span>
                      <span className="kerala-template__event-year" {...field("year", "Year")}>{text("year", formatDate(event.date, { year: "numeric" }))}</span>
                    </span>
                  </time>
                  <p className="kerala-template__event-weekday" {...field("weekday", "Weekday")}>{text("weekday", formatDate(event.date, { weekday: "long" }))}</p>
                </>}
                {event.time && <p className="kerala-template__event-time" {...field("time", "Time")}>{text("time", formatTime(event.time))}</p>}
                <div className="kerala-template__event-location">
                  <h3 {...field("venue", "Venue")}>{text("venue", event.venue)}</h3>
                  {event.address && <p {...field("address", "Address")}>{text("address", event.address)}</p>}
                </div>
                <div className="kerala-template__event-actions">
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
    </main>
  );
}
