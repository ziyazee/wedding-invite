import { useEffect, type RefObject } from "react";

/** Give touch swipes a deliberate settling time; mouse/trackpad keep native snapping. */
export function useTajmahalTouchScroll(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scroller = root.current;
    if (!scroller) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let gesture: {
      x: number; y: number; started: number; scrollTop: number;
      stops: number[]; index: number; previous: number; next: number; dragging: boolean;
    } | null = null;

    const release = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      gesture = null;
      scroller.classList.remove("is-touch-scrolling");
    };

    const settle = (target: number) => {
      const from = scroller.scrollTop;
      const distance = target - from;
      if (Math.abs(distance) < 1 || reducedMotion.matches) {
        scroller.scrollTop = target;
        release();
        return;
      }
      const started = performance.now();
      const step = (now: number) => {
        const progress = Math.min(1, (now - started) / 950);
        const eased = (1 - Math.cos(Math.PI * progress)) / 2;
        scroller.scrollTop = from + distance * eased;
        if (progress < 1) frame = requestAnimationFrame(step);
        else release();
      };
      frame = requestAnimationFrame(step);
    };

    const onStart = (event: TouchEvent) => {
      if (event.touches.length !== 1 || reducedMotion.matches) {
        release();
        return;
      }
      const target = event.target;
      if (target instanceof Element && target.closest("input, textarea, select, [contenteditable='true']")) return;

      // A fresh gesture can interrupt settling immediately, without a cooldown.
      cancelAnimationFrame(frame);
      frame = 0;
      const interrupted = scroller.classList.contains("is-touch-scrolling");
      const top = scroller.getBoundingClientRect().top;
      const scrollTop = scroller.scrollTop;
      const limit = scroller.scrollHeight - scroller.clientHeight;
      const stops = Array.from(scroller.querySelectorAll<HTMLElement>(
        ":scope > section, .tajmahal-template__celebration-slide",
      )).filter(section => getComputedStyle(section).scrollSnapAlign !== "none")
        .map(section => Math.max(0, Math.min(limit, section.getBoundingClientRect().top - top + scrollTop)));
      if (!stops.length) { release(); return; }
      const index = stops.reduce((nearest, stop, i) =>
        Math.abs(stop - scrollTop) < Math.abs(stops[nearest] - scrollTop) ? i : nearest, 0);
      const previous = stops.reduce((prior, stop, i) => stop < scrollTop - 2 ? i : prior, 0);
      const nextStop = stops.findIndex(stop => stop > scrollTop + 2);
      const next = nextStop < 0 ? stops.length - 1 : nextStop;
      const touch = event.touches[0];
      gesture = { x: touch.clientX, y: touch.clientY, started: performance.now(), scrollTop, stops, index, previous, next, dragging: interrupted };
    };

    const onMove = (event: TouchEvent) => {
      if (!gesture) return;
      if (event.touches.length !== 1) { release(); return; }
      const touch = event.touches[0];
      const distance = gesture.y - touch.clientY;
      if (!gesture.dragging && Math.abs(distance) <= Math.abs(touch.clientX - gesture.x)) return;
      if (!event.cancelable) { release(); return; }
      event.preventDefault();
      gesture.dragging = true;
      scroller.classList.add("is-touch-scrolling");
      const lower = gesture.stops[gesture.previous];
      const upper = gesture.stops[gesture.next];
      scroller.scrollTop = Math.max(lower, Math.min(upper, gesture.scrollTop + distance));
    };

    const onEnd = (event: TouchEvent) => {
      if (!gesture) return;
      if (!gesture.dragging || event.touches.length) { release(); return; }
      const distance = gesture.y - (event.changedTouches[0]?.clientY ?? gesture.y);
      const speed = Math.abs(distance) / Math.max(1, performance.now() - gesture.started);
      const committed = Math.abs(distance) >= Math.min(70, scroller.clientHeight * 0.08)
        || (Math.abs(distance) > 16 && speed > 0.4);
      const direction = committed ? Math.sign(distance) : 0;
      const index = direction > 0 ? gesture.next : direction < 0 ? gesture.previous : gesture.index;
      const target = gesture.stops[index];
      gesture = null;
      settle(target);
    };

    scroller.addEventListener("touchstart", onStart, { passive: true });
    scroller.addEventListener("touchmove", onMove, { passive: false });
    scroller.addEventListener("touchend", onEnd, { passive: true });
    scroller.addEventListener("touchcancel", release, { passive: true });
    scroller.addEventListener("wheel", release, { passive: true });
    window.addEventListener("resize", release);
    reducedMotion.addEventListener("change", release);
    return () => {
      release();
      scroller.removeEventListener("touchstart", onStart);
      scroller.removeEventListener("touchmove", onMove);
      scroller.removeEventListener("touchend", onEnd);
      scroller.removeEventListener("touchcancel", release);
      scroller.removeEventListener("wheel", release);
      window.removeEventListener("resize", release);
      reducedMotion.removeEventListener("change", release);
    };
  }, [root]);
}
