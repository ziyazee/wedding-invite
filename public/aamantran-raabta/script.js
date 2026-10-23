// ═══════════════════════════════════════════════════════════════════════
// NOOR TEMPLATE — interaction script
// All invitation data is injected server-side via Handlebars.
// Deliberately restrained page pacing (no scroll-zoom hero, no
// auto-drifting carousel — content reads top-to-bottom like a storybook,
// one scene at a time) with a couple of genuine delight moments layered
// back in: a real scratch-to-reveal date box and a confetti burst on full
// reveal / RSVP "yes".
// ═══════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════
// CONFETTI — small DOM-based burst, plays once per call. Shared by the
// scratch-card date reveal and the RSVP "yes" confirmation.
// ═══════════════════════════════════════════════════════════════════════
function fireConfetti(container) {
  if (!container) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const COLORS = ['#E2B959', '#CC9A32', '#F3D488', '#232F52', '#F6EFDD'];
  const COUNT = 26;

  for (let i = 0; i < COUNT; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    const angle = (Math.random() - 0.5) * Math.PI * 0.9 - Math.PI / 2; // upward-ish spread
    const dist = 60 + Math.random() * 90;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist + 40; // gravity pulls it back down a bit
    piece.style.setProperty('--dx', `${dx}px`);
    piece.style.setProperty('--dy', `${dy}px`);
    piece.style.setProperty('--rot', `${(Math.random() - 0.5) * 480}deg`);
    piece.style.background = COLORS[i % COLORS.length];
    piece.style.animationDelay = `${Math.random() * 0.15}s`;
    piece.style.left = `${45 + Math.random() * 10}%`;
    container.appendChild(piece);
    piece.addEventListener('animationend', () => piece.remove());
  }
}

// ═══════════════════════════════════════════════════════════════════════
// GATE — full-screen tap-to-enter overlay
// A single symmetric gate-closed.png is split into matching halves purely
// via CSS background-position (see styles.css). Scroll is locked until the
// guest opens it — progressive enhancement: if this script fails to run,
// the gate (position:fixed, full-screen) still visually blocks the page
// either way, so there's no stuck state. Unlike jaisalmer's gate, there's
// no scroll-driven re-close/re-open and no camera push-through tied to a
// scroll-zoom scene — the gate is a one-time entrance, then content simply
// starts, so it only ever needs to open once and stay open.
// ═══════════════════════════════════════════════════════════════════════
(function () {
  const gate = document.getElementById('gateOverlay');
  if (!gate) return;

  const html = document.documentElement;
  const prevHtmlOverflow = html.style.overflow;
  const prevBodyOverflow = document.body.style.overflow;
  html.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';

  let revealed = false;

  // Chrome restores the previous scrollY on refresh even after a hard reload,
  // and that restore can land AFTER this script runs — which would drop the
  // guest partway down the invite, behind a still-closed gate. The
  // scrollRestoration guard in <head> is the first line of defence; re-pin on
  // the later lifecycle events too, in case restoration wins the race.
  // Guarded on `revealed` so a guest who has already entered and scrolled is
  // never yanked back to the top by a late `load` on a slow connection.
  function pinToGate() {
    if (revealed) return;
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }
  pinToGate();
  window.addEventListener('pageshow', pinToGate);
  window.addEventListener('load', pinToGate);

  function openGate() {
    if (revealed) return;
    revealed = true;
    gate.classList.add('gate-open', 'gate-revealed');
    html.style.overflow = prevHtmlOverflow;
    document.body.style.overflow = prevBodyOverflow;
  }

  gate.addEventListener('click', openGate);
  gate.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openGate(); }
  });
})();

// ── Read wedding date from the hidden element set by Handlebars ───────
const rawDate   = document.getElementById('js-wedding-date')?.dataset.date || '';
const dateParts = rawDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
const prettyDate = dateParts
  ? new Date(`${rawDate}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  : '';

const inviteDateEl = document.getElementById('inviteDateText');
if (inviteDateEl && prettyDate) inviteDateEl.textContent = prettyDate;

// ═══════════════════════════════════════════════════════════════════════
// SCRATCH-CARD DATE REVEAL — one box, genuine drag-to-scratch (canvas +
// destination-out compositing), not a canned animation. "Tap to reveal" is
// a one-tap accessibility fallback that fades the canvas out directly.
// Confetti fires once, the moment the date is fully revealed either way.
// ═══════════════════════════════════════════════════════════════════════
(function () {
  const wrap     = document.getElementById('scratchDateWrap');
  const canvas   = document.getElementById('scratchDateCanvas');
  const fallback = document.getElementById('scratchDateFallback');
  const confetti = document.getElementById('confettiBurst');
  if (!wrap || !canvas) return;

  const REVEAL_THRESHOLD = 0.5;
  const BRUSH_RADIUS     = 16;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  // getContext can return null — anti-fingerprinting extensions block canvas,
  // and willReadFrequently + getImageData (used below to measure how much has
  // been scratched off) is precisely the pattern they target. Unguarded, the
  // first ctx.setTransform() throws; and because every IIFE below shares this
  // one file, that single uncaught error would also take out the countdown,
  // lanterns, carousel, wish wall and RSVP toggle. Degrade to the date simply
  // being shown, with no scratch game.
  if (!ctx) {
    wrap.classList.add('date-revealed');
    return;
  }

  let revealed = false;
  let cssW = 0, cssH = 0;
  let scratchedEnough = false;
  let dragging = false;
  let lastX = null, lastY = null;

  function reveal() {
    if (revealed) return;
    revealed = true;
    wrap.classList.add('date-revealed');
    fireConfetti(confetti);
  }

  function drawFoil() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    cssW = rect.width || 1;
    cssH = rect.height || 1;
    canvas.width  = cssW * dpr;
    canvas.height = cssH * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, cssW, cssH);
    const step = Math.max(4, cssW * 0.045);
    for (let x = -cssH; x < cssW + cssH; x += step) {
      ctx.fillStyle = (Math.round(x / step) % 2 === 0) ? '#cfd6db' : '#e9edf0';
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + step, 0);
      ctx.lineTo(x + step + cssH, cssH);
      ctx.lineTo(x + cssH, cssH);
      ctx.closePath();
      ctx.fill();
    }

    ctx.fillStyle = 'rgba(90, 60, 30, 0.5)';
    ctx.font = `${Math.round(cssH * 0.3)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✎ scratch here', cssW / 2, cssH / 2);

    scratchedEnough = false;
    // Clear (not set) any inline opacity override from a previous scratch —
    // an explicit inline value would permanently beat the .date-revealed
    // CSS rule regardless of class, since inline style always wins.
    canvas.style.opacity = '';
    canvas.style.pointerEvents = '';
  }

  function posFromEvent(e) {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function eraseAt(x, y) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  }

  function eraseLine(x0, y0, x1, y1) {
    const dist = Math.hypot(x1 - x0, y1 - y0);
    const steps = Math.max(1, Math.ceil(dist / (BRUSH_RADIUS / 2)));
    for (let i = 0; i <= steps; i++) {
      eraseAt(x0 + (x1 - x0) * (i / steps), y0 + (y1 - y0) * (i / steps));
    }
  }

  function checkScratchedEnough() {
    if (scratchedEnough) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0, sampled = 0;
    for (let i = 3; i < data.length; i += 4 * 6) {
      sampled++;
      if (data[i] < 40) transparent++;
    }
    if (sampled && transparent / sampled > REVEAL_THRESHOLD) {
      scratchedEnough = true;
      canvas.style.transition = 'opacity 0.4s ease';
      canvas.style.opacity = '0';
      canvas.style.pointerEvents = 'none';
      reveal();
    }
  }

  function start(e) {
    dragging = true;
    canvas.setPointerCapture?.(e.pointerId);
    const p = posFromEvent(e);
    lastX = p.x; lastY = p.y;
    eraseAt(p.x, p.y);
  }
  function move(e) {
    if (!dragging) return;
    const p = posFromEvent(e);
    eraseLine(lastX, lastY, p.x, p.y);
    lastX = p.x; lastY = p.y;
    checkScratchedEnough();
  }
  function end() { dragging = false; }

  canvas.addEventListener('pointerdown', start);
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);

  if (fallback) fallback.addEventListener('click', reveal);

  drawFoil();
  window.addEventListener('resize', drawFoil, { passive: true });
})();

// ── Hero title — first names only, shrunk to fit ──────────────────────
// A fixed clamp() can't account for how much a name pair's *rendered*
// width varies (script fonts especially) — only measuring it can guarantee
// it never clips against the viewport edge, which fixed clamp() minimums do
// on narrow screens with longer names.
(function () {
  const row     = document.getElementById('heroNamesRow');
  const brideEl = document.getElementById('heroBride');
  const groomEl = document.getElementById('heroGroom');
  const joinEl  = document.getElementById('heroJoin');
  if (!row || !brideEl || !groomEl) return;

  const firstName = s => String(s || '').trim().split(/\s+/)[0] || '';
  const b = firstName(brideEl.dataset.person2);
  const g = firstName(groomEl.dataset.person1);
  if (b) brideEl.textContent = b;
  if (g) groomEl.textContent = g;

  // Every item in the row is now text, so all of it scales together and the
  // row ratio is exact — no need to subtract a fixed-width element first.
  const parts = [groomEl, joinEl, brideEl].filter(Boolean);

  function fitText() {
    for (const el of parts) el.style.fontSize = '';

    const maxWidth = window.innerWidth * 0.9;
    const natural  = row.scrollWidth;
    if (natural <= maxWidth) return;

    const ratio = maxWidth / natural;
    for (const el of parts) {
      const base = parseFloat(getComputedStyle(el).fontSize);
      el.style.fontSize = Math.max(base * ratio, 13) + 'px';
    }
  }
  fitText();
  window.addEventListener('resize', fitText, { passive: true });
  // Re-fit once the display font swaps in — metrics change and a name that
  // fit in the fallback face can overflow in Cormorant.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fitText).catch(() => {});
  }
})();

// ── Load dynamic bismillah image URL (Handlebars renders it into data-dynamic-src) ──
(function () {
  const bismillah = document.getElementById('bismillah');
  if (!bismillah) return;
  const u = bismillah.dataset.dynamicSrc;
  if (u && u.trim()) bismillah.src = u;
})();

// ═══════════════════════════════════════════════════════════════════════
// COUNTDOWN TIMER
// ═══════════════════════════════════════════════════════════════════════

(function () {
  const section = document.getElementById('countdownSection');
  if (window.frameElement?.hasAttribute('data-order-template')) return;
  const dateStr = rawDate;

  if (!dateStr) {
    if (section) section.style.display = 'none';
    return;
  }

  let wDate = new Date(dateStr + 'T00:00:00');

  if (isNaN(wDate.getTime())) {
    if (section) section.style.display = 'none';
    return;
  }

  const dDisplay = document.getElementById('countdownDateDisplay');
  if (dDisplay) {
    dDisplay.textContent = wDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  const targetTime = wDate.getTime();

  function updateTimer() {
    const order = window.orderInvitation;
    const distance = (order ? new Date(`${order.date}T${order.time}:00${order.offset}`).getTime() : targetTime) - Date.now();

    const elDays  = document.getElementById('cdDays');
    const elHours = document.getElementById('cdHours');
    const elMins  = document.getElementById('cdMins');
    const elSecs  = document.getElementById('cdSecs');

    if (distance < 0) {
      if (elDays)  elDays.textContent  = '00';
      if (elHours) elHours.textContent = '00';
      if (elMins)  elMins.textContent  = '00';
      if (elSecs)  elSecs.textContent  = '00';
      return;
    }

    if (elDays)  elDays.textContent  = String(Math.floor(distance / 86400000)).padStart(2, '0');
    if (elHours) elHours.textContent = String(Math.floor((distance % 86400000) / 3600000)).padStart(2, '0');
    if (elMins)  elMins.textContent  = String(Math.floor((distance % 3600000) / 60000)).padStart(2, '0');
    if (elSecs)  elSecs.textContent  = String(Math.floor((distance % 60000) / 1000)).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
})();

// ═══════════════════════════════════════════════════════════════════════
// GENERAL REVEAL-ON-SCROLL — .reveal elements fade/rise into place once
// ═══════════════════════════════════════════════════════════════════════

(function () {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  // Stagger: elements are indexed within their own scene so a section
  // assembles piece by piece instead of every line arriving at once. The
  // delay is applied as an inline transition-delay and cleared once the
  // element has landed, so it never slows a later re-entry or fights the
  // reduced-motion rule (which zeroes transitions in CSS anyway).
  const STEP = 90;   // ms between siblings
  const CAP  = 540;  // never delay a single element longer than this
  document.querySelectorAll('.scene, .lantern-divider').forEach(scene => {
    scene.querySelectorAll('.reveal').forEach((el, i) => {
      el.dataset.revealDelay = String(Math.min(i * STEP, CAP));
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const d = Number(el.dataset.revealDelay || 0);
        if (d) {
          el.style.transitionDelay = d + 'ms';
          el.addEventListener('transitionend', function clear() {
            el.style.transitionDelay = '';
            el.removeEventListener('transitionend', clear);
          });
        }
        el.classList.add('is-visible');
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.2 });
  targets.forEach(t => observer.observe(t));
})();

// ═══════════════════════════════════════════════════════════════════════
// COUPLE PHOTO — simple dot-navigated slideshow, no auto-drift, no clones.
// A plain dot-nav carousel rather than jaisalmer's infinite-loop
// drift-and-settle reel.
// ═══════════════════════════════════════════════════════════════════════

(function () {
  const track    = document.getElementById('carouselTrack');
  const dotsWrap = document.getElementById('carouselDots');
  const btnPrev  = document.getElementById('carouselPrev');
  const btnNext  = document.getElementById('carouselNext');

  if (!track) return;
  const slides = Array.from(track.querySelectorAll('.carousel-slide'));
  const count  = slides.length;
  if (count === 0) return;

  const AUTOPLAY_MS = 4500;
  const SETTLE_MS   = 900;   // transition is 0.55s; buffer for a missed event
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Seamless forward wrap. Advancing past the last photo with a plain modulo
  // would animate the track backwards across every slide — a long visible
  // rewind on each loop. Instead a clone of the first photo sits after the
  // last: autoplay moves forward onto it, then silently resets to the real
  // first slide with the transition off, so the loop reads as continuous.
  // Only autoplay ever reaches the clone; goTo() stays within the real range.
  if (count > 1) {
    const clone = slides[0].cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  }

  let index = 0;   // 0..count-1 are real slides; `count` is the clone
  let timer = null;

  function setTransition(on) {
    track.style.transition = on ? '' : 'none';
  }

  function render() {
    track.style.transform = `translateX(-${index * 100}%)`;
    if (dotsWrap) {
      // The clone shows photo 1, so its dot is dot 1.
      const active = index % count;
      dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) =>
        d.classList.toggle('active', i === active));
    }
  }

  function goTo(i) {
    index = ((i % count) + count) % count;
    setTransition(true);
    render();
  }

  // Snap from the clone back to the real first slide with no animation.
  function resetFromClone() {
    setTransition(false);
    index = 0;
    render();
    void track.offsetWidth;   // flush, so the next move animates again
    setTransition(true);
  }

  function advance() {
    if (index >= count) return;
    index += 1;
    setTransition(true);
    render();
    if (index !== count) return;

    // Landed on the clone — reset once it has settled. transitionend is the
    // accurate signal, but it never fires if the tab is hidden or the element
    // is not rendered, so a timeout backstops it.
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      track.removeEventListener('transitionend', onEnd);
      clearTimeout(fallback);
      resetFromClone();
    };
    const onEnd = e => { if (e.propertyName === 'transform') finish(); };
    track.addEventListener('transitionend', onEnd);
    const fallback = setTimeout(finish, SETTLE_MS);
  }

  function stopAuto()  { clearInterval(timer); timer = null; }
  function startAuto() {
    if (reduceMotion || count < 2 || timer) return;
    timer = setInterval(advance, AUTOPLAY_MS);
  }
  // After a manual move, restart the clock so the next auto-advance is a full
  // interval away instead of firing immediately.
  function restartAuto() { stopAuto(); startAuto(); }

  if (dotsWrap) {
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `carousel-dot${i === 0 ? ' active' : ''}`;
      dot.setAttribute('aria-label', `Go to photo ${i + 1}`);
      dot.addEventListener('click', () => { goTo(i); restartAuto(); });
      dotsWrap.appendChild(dot);
    });
  }

  if (btnPrev) btnPrev.addEventListener('click', () => { goTo(index - 1); restartAuto(); });
  if (btnNext) btnNext.addEventListener('click', () => { goTo(index + 1); restartAuto(); });

  let touchStartX = 0;
  track.parentElement?.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    stopAuto();               // don't slide out from under a finger
  }, { passive: true });
  track.parentElement?.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) goTo(index + (dx < 0 ? 1 : -1));
    restartAuto();
  });

  // Hold while someone is actually looking at or interacting with it.
  const hoverTarget = document.querySelector('.carousel-wrapper') || track.parentElement;
  if (hoverTarget) {
    hoverTarget.addEventListener('mouseenter', stopAuto);
    hoverTarget.addEventListener('mouseleave', startAuto);
    hoverTarget.addEventListener('focusin',  stopAuto);
    hoverTarget.addEventListener('focusout', startAuto);
  }

  // A hidden tab does not fire transitionend, and intervals still queue, so
  // pause outright rather than letting advances pile up while away.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAuto(); else startAuto();
  });

  render();
  startAuto();
})();

// ═══════════════════════════════════════════════════════════════════════
// BACKGROUND MUSIC — plays on open + play/pause button
// ═══════════════════════════════════════════════════════════════════════

(function () {
  const audio = document.getElementById('bgMusic');
  const btn   = document.getElementById('musicBtn');
  if (!audio || !btn) { window.__bgMusicControl = null; return; }

  const iconNote  = btn.querySelector('.music-icon-note');
  const iconPause = btn.querySelector('.music-icon-pause');

  const GESTURES = ['pointerdown', 'touchstart', 'touchend', 'click', 'keydown', 'wheel'];

  let userPaused  = false;
  let unlockBound = false;
  let everUnmuted = false;
  let pausedByExternal = false;

  function setPlaying(playing) {
    iconNote.style.display  = playing ? 'none'  : 'block';
    iconPause.style.display = playing ? 'block' : 'none';
    btn.classList.toggle('is-playing', playing);
    btn.setAttribute('aria-label', playing ? 'Pause music' : 'Play music');
  }

  function unbindUnlock() {
    if (unlockBound) {
      GESTURES.forEach(t => window.removeEventListener(t, onGesture, true));
      unlockBound = false;
    }
    btn.classList.remove('music-awaiting-unmute');
    btn.removeAttribute('title');
  }

  function bindUnlock() {
    if (unlockBound) return;
    unlockBound = true;
    GESTURES.forEach(t =>
      window.addEventListener(t, onGesture, { capture: true, passive: true })
    );
  }

  function onGesture(e) {
    if (userPaused) return;
    if (e.target && btn.contains(e.target)) return;
    playAudible();
  }

  function playAudible() {
    const wasMutedAndRolling = audio.muted && !audio.paused;
    audio.muted = false;
    if (!everUnmuted) audio.currentTime = 0;
    return audio.play().then(() => {
      everUnmuted = true;
      setPlaying(true);
      unbindUnlock();
    }).catch(() => {
      if (wasMutedAndRolling) {
        audio.muted = true;
        audio.play().catch(() => {});
      }
    });
  }

  function needsAttention() { return audio.paused || audio.muted; }

  function tryAutoplay() {
    if (userPaused || !needsAttention()) return;

    audio.muted = false;
    audio.play().then(() => {
      everUnmuted = true;
      setPlaying(true);
      unbindUnlock();
    }).catch(() => {
      audio.muted = true;
      audio.play().then(() => {
        setPlaying(true);
        btn.classList.add('music-awaiting-unmute');
        btn.setAttribute(
          'title',
          'Tap anywhere on the page to turn sound on (browser policy)'
        );
      }).catch(() => setPlaying(false));
    });
  }

  bindUnlock();
  tryAutoplay();

  audio.addEventListener('canplay', () => tryAutoplay(), { once: true });
  window.addEventListener('load', () => tryAutoplay(), { once: true });
  window.addEventListener('pageshow', () => tryAutoplay());
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) tryAutoplay();
  });

  btn.addEventListener('click', () => {
    if (needsAttention()) {
      userPaused = false;
      playAudible();
    } else {
      userPaused = true;
      audio.pause();
      setPlaying(false);
      unbindUnlock();
    }
    pausedByExternal = false;
  });

  window.__bgMusicControl = {
    pauseForExternal() {
      if (audio.paused || audio.muted) return;
      pausedByExternal = true;
      audio.pause();
      setPlaying(false);
    },
    resumeAfterExternal() {
      if (!pausedByExternal) return;
      pausedByExternal = false;
      if (userPaused) return;
      playAudible();
    },
  };
})();

// ═══════════════════════════════════════════════════════════════════════
// YOUTUBE ↔ BACKGROUND MUSIC
// ═══════════════════════════════════════════════════════════════════════

(function () {
  const iframe = document.getElementById('preWeddingVideo');
  if (!iframe) return;

  const rawSrc = iframe.getAttribute('src') || '';
  if (!rawSrc || rawSrc.includes('{{')) return;

  const loc = window.location;
  const canUseOrigin = !!(
    loc && loc.origin && loc.origin !== 'null' && /^https?:/.test(loc.origin)
  );
  if (!canUseOrigin) return;

  let url;
  try { url = new URL(rawSrc, window.location.href); }
  catch (_) { return; }
  if (url.origin !== 'https://www.youtube.com') return;

  const needsApi    = url.searchParams.get('enablejsapi') !== '1';
  const needsOrigin = url.searchParams.get('origin') !== loc.origin;
  if (needsApi || needsOrigin) {
    if (needsApi) url.searchParams.set('enablejsapi', '1');
    if (needsOrigin) url.searchParams.set('origin', loc.origin);
    iframe.src = url.toString();
  }

  const YT_ORIGIN = 'https://www.youtube.com';
  const PLAYING = 1;
  const PAUSED  = 2;
  const ENDED   = 0;

  function sendListening() {
    const win = iframe.contentWindow;
    if (!win) return;
    win.postMessage(
      JSON.stringify({ event: 'listening', id: iframe.id, channel: 'widget' }),
      YT_ORIGIN
    );
    win.postMessage(
      JSON.stringify({
        event: 'command',
        func: 'addEventListener',
        args: ['onStateChange'],
        id: iframe.id,
        channel: 'widget',
      }),
      YT_ORIGIN
    );
  }

  iframe.addEventListener('load', () => {
    setTimeout(sendListening, 300);
    setTimeout(sendListening, 1200);
  });

  window.addEventListener('message', (event) => {
    if (event.origin !== YT_ORIGIN) return;
    if (event.source !== iframe.contentWindow) return;

    let msg;
    try {
      msg = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
    } catch (_) { return; }
    if (!msg || typeof msg !== 'object') return;

    const state =
      msg.event === 'onStateChange' ? msg.info :
      msg.event === 'infoDelivery' && msg.info && 'playerState' in msg.info ? msg.info.playerState :
      null;
    if (state === null || state === undefined) return;

    const ctl = window.__bgMusicControl;
    if (!ctl) return;
    if (state === PLAYING) ctl.pauseForExternal();
    else if (state === PAUSED || state === ENDED) ctl.resumeAfterExternal();
  });
})();

// ═══════════════════════════════════════════════════════════════════════
// WISH WALL — rotating grid
// ═══════════════════════════════════════════════════════════════════════

(function () {
  const wall = document.querySelector('[data-aamantran="wish-wall"]');
  if (!wall) return;

  const INTERVAL    = 4000;
  const viewAllBtn  = document.getElementById('wishViewAll');
  const overlay     = document.getElementById('wishAllOverlay');
  const overlayList = document.getElementById('wishAllList');
  const closeBtn    = document.getElementById('wishAllClose');

  let cards       = [];
  let visible     = [];
  let hidden      = [];
  let rotSlot     = 0;
  let timer       = null;
  let overlayOpen = false;
  let lastFocus   = null;

  function visibleCount() { return window.innerWidth <= 640 ? 3 : 4; }

  // Only worth offering when the rotation is actually hiding something.
  function syncViewAllBtn() {
    if (!viewAllBtn) return;
    const extra = cards.length > visibleCount();
    viewAllBtn.hidden = !extra;
    viewAllBtn.textContent = extra
      ? `View all wishes (${cards.length})`
      : 'View all wishes';
  }

  function fillOverlay() {
    if (!overlayList) return;
    overlayList.replaceChildren();
    cards.forEach(c => {
      const clone = c.cloneNode(true);
      // The wall's rotation state must not travel into the modal, where
      // every wish is shown at once.
      clone.classList.remove('wish-hidden', 'wish-out');
      clone.removeAttribute('id');
      overlayList.appendChild(clone);
    });
  }

  function openOverlay() {
    if (!overlay || overlayOpen || !cards.length) return;
    overlayOpen = true;
    clearInterval(timer);          // don't rotate underneath the modal
    lastFocus = document.activeElement;
    fillOverlay();
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeOverlay() {
    if (!overlay || !overlayOpen) return;
    overlayOpen = false;
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    if (overlayList) overlayList.replaceChildren();
    initGrid();                    // restart rotation from a clean state
    const back = lastFocus || viewAllBtn;
    if (back && back.focus) back.focus();
  }

  function initGrid() {
    clearInterval(timer);
    cards   = Array.from(wall.querySelectorAll('.aamantran-wish'));
    visible = [];
    hidden  = [];
    rotSlot = 0;
    syncViewAllBtn();
    if (!cards.length) return;

    const n = Math.min(visibleCount(), cards.length);

    cards.forEach((c, i) => {
      c.classList.remove('wish-hidden', 'wish-out');
      if (i < n) {
        visible.push(i);
      } else {
        c.classList.add('wish-hidden');
        hidden.push(i);
      }
    });

    if (overlayOpen) { fillOverlay(); return; }
    if (hidden.length > 0) startRotation();
  }

  function startRotation() {
    timer = setInterval(() => {
      if (!hidden.length || overlayOpen) { clearInterval(timer); return; }

      const outIdx   = visible[rotSlot];
      const inIdx    = hidden.shift();
      const outCard  = cards[outIdx];
      const inCard   = cards[inIdx];

      outCard.classList.add('wish-out');
      setTimeout(() => {
        if (overlayOpen) return;
        outCard.classList.add('wish-hidden');
        outCard.classList.remove('wish-out');
        hidden.push(outIdx);

        visible[rotSlot] = inIdx;
        inCard.classList.remove('wish-hidden');
        rotSlot = (rotSlot + 1) % visible.length;
      }, 360);
    }, INTERVAL);
  }

  if (viewAllBtn) viewAllBtn.addEventListener('click', openOverlay);
  if (closeBtn)   closeBtn.addEventListener('click', closeOverlay);
  if (overlay) {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeOverlay();   // backdrop only, not the dialog
    });
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlayOpen) closeOverlay();
  });

  // The visible count changes at 640px, so a rotation built for 4 slots is
  // wrong after a shrink to 3. Only rebuild when it actually crosses over.
  let lastVisibleN = visibleCount();
  window.addEventListener('resize', () => {
    const n = visibleCount();
    if (n === lastVisibleN) return;
    lastVisibleN = n;
    if (!overlayOpen) initGrid();
  }, { passive: true });

  const observer = new MutationObserver(() => {
    setTimeout(initGrid, 50);
  });
  observer.observe(wall, { childList: true });
})();

// ═══════════════════════════════════════════════════════════════════════
// SAMPLE WISHES — DEMO PAGE ONLY
// The /demo/<slug> route renders the template without the Aamantran SDK, so
// the wish wall sits empty on the exact page a prospective buyer is judging.
// These placeholders fill it so the feature is visible.
//
// The gate is an explicit /demo/ pathname test, NOT "is the SDK missing?".
// Those are not equivalent: on a live invite whose SDK request failed, the
// SDK would also be missing, and a couple's real invitation would then show
// invented wishes from people who do not exist. Live invites are served from
// /i/<slug> (and /i/<slug>/preview), so this can never fire there.
//
// Must run after the wish-wall IIFE above so its MutationObserver is already
// watching — appending here is what triggers initGrid() and the rotation.
// ═══════════════════════════════════════════════════════════════════════

(function () {
  if (!/^\/demo\//.test(window.location.pathname)) return;

  const wall = document.querySelector('[data-aamantran="wish-wall"]');
  if (!wall || wall.children.length) return;

  // Six, deliberately: more than the four slots the wall shows on desktop,
  // so the rotation and the "View all wishes" button are both demonstrated.
  const SAMPLE = [
    ['Wishing you both a lifetime of love, barakah, and quiet joy.', 'Ayesha'],
    ['May God bless this union and fill your home with light.',    'The Qureshis'],
    ['So happy for you two — save us a seat at the walima!',         'Imran & Sana'],
    ['From classmates to this. Could not be happier for you both.',  'Hina'],
    ['Sending all our love from Hyderabad. Have the most beautiful day.', 'Faisal & Nadia'],
    ['May every year together be brighter than the last.',           'The Sheikh Family'],
  ];

  // Structure mirrors the SDK's renderWishWall() exactly — same classes and
  // the same quote/em-dash decoration — so these style identically to real
  // wishes and need no CSS of their own.
  for (const [message, author] of SAMPLE) {
    const wrap = document.createElement('div');
    wrap.className = 'aamantran-wish';

    const p = document.createElement('p');
    p.className = 'aamantran-wish-message';
    p.textContent = `"${message}"`;

    const span = document.createElement('span');
    span.className = 'aamantran-wish-author';
    span.textContent = `— ${author}`;

    wrap.appendChild(p);
    wrap.appendChild(span);
    wall.appendChild(wrap);
  }
})();

// ═══════════════════════════════════════════════════════════════════════
// FORM FALLBACK WHEN THE SDK IS ABSENT
// The RSVP and wish forms are submitted by the injected Aamantran SDK, which
// calls preventDefault. /demo/<slug> is rendered WITHOUT the SDK, so nothing
// intercepts the submit: the browser performs a native GET, the page reloads,
// and the guest lands back at the closed gate having lost their place.
//
// The SDK is injected AFTER this file, so window.__AAMANTRAN__ does not exist
// yet at parse time — the check therefore has to happen inside the handler, at
// submit time, by which point the SDK has loaded. This listener is registered
// before the SDK's, so on a live invite it sees the SDK and defers; the SDK's
// own handler then does the real work.
//
// On the demo the wish is echoed into the wall for that session only. Nothing
// is persisted and nothing is sent anywhere.
// ═══════════════════════════════════════════════════════════════════════

(function () {
  const isDemo   = /^\/demo\//.test(window.location.pathname);
  const wishForm = document.querySelector('form[data-aamantran="wish"]');
  const rsvpForm = document.querySelector('form[data-aamantran="rsvp"]');
  if (!wishForm && !rsvpForm) return;

  function setStatus(form, kind, msg, isError) {
    const el = form.querySelector(`[data-aamantran="${kind}-status"]`);
    if (!el) return;
    el.textContent = msg;
    el.style.color = isError ? '#E58F8F' : 'var(--gold-300)';
  }

  function fieldValue(form, name) {
    const el = form.querySelector(`[data-field="${name}"]`);
    return el ? String(el.value || '').trim() : '';
  }

  if (wishForm) {
    wishForm.addEventListener('submit', e => {
      if (window.__AAMANTRAN__) return;      // real SDK owns this submit
      e.preventDefault();                    // never let it reload the page

      if (!isDemo) {
        setStatus(wishForm, 'wish', 'Could not share your wish right now.', true);
        return;
      }

      const guestName = fieldValue(wishForm, 'guestName');
      const message   = fieldValue(wishForm, 'message');
      if (!guestName || !message) {
        setStatus(wishForm, 'wish', 'Name and message are required.', true);
        return;
      }

      const wall = document.querySelector('[data-aamantran="wish-wall"]');
      if (wall) {
        // Same shape the SDK renders, so it styles identically and the wall's
        // MutationObserver picks it up into the rotation and the count.
        const wrap = document.createElement('div');
        wrap.className = 'aamantran-wish';
        const p = document.createElement('p');
        p.className = 'aamantran-wish-message';
        p.textContent = `"${message}"`;
        const span = document.createElement('span');
        span.className = 'aamantran-wish-author';
        span.textContent = `— ${guestName}`;
        wrap.appendChild(p);
        wrap.appendChild(span);
        // Prepend, so the tester sees their own wish immediately instead of it
        // landing behind the rotation.
        wall.insertBefore(wrap, wall.firstChild);
      }

      wishForm.reset();
      setStatus(wishForm, 'wish', 'Your wish has been shared.', false);
    });
  }

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', e => {
      if (window.__AAMANTRAN__) return;
      e.preventDefault();

      if (!isDemo) {
        setStatus(rsvpForm, 'rsvp', 'Could not submit RSVP right now.', true);
        return;
      }
      if (!fieldValue(rsvpForm, 'guestName')) {
        setStatus(rsvpForm, 'rsvp', 'Please fill all required RSVP fields.', true);
        return;
      }
      setStatus(rsvpForm, 'rsvp', 'RSVP submitted successfully. Thank you!', false);
      rsvpForm.reset();
    });
  }
})();

// ═══════════════════════════════════════════════════════════════════════
// RSVP SECTION — Yes / No toggle
// ═══════════════════════════════════════════════════════════════════════

(function () {
  const btnYes           = document.getElementById('btnRsvpYes');
  const btnNo            = document.getElementById('btnRsvpNo');
  const buttonsContainer = document.getElementById('rsvpButtons');
  const formContainer    = document.getElementById('rsvpFormContainer');
  const noContainer      = document.getElementById('rsvpNoContainer');
  const confetti         = document.getElementById('rsvpConfettiBurst');

  if (!btnYes || !btnNo) return;

  btnYes.addEventListener('click', () => {
    if (buttonsContainer) buttonsContainer.style.display = 'none';
    if (formContainer)    formContainer.style.display    = 'block';
    fireConfetti(confetti);
  });

  btnNo.addEventListener('click', () => {
    if (buttonsContainer) buttonsContainer.style.display = 'none';
    if (noContainer)      noContainer.style.display      = 'block';
  });
})();


// ═══════════════════════════════════════════════════════════════════════
// FLOATING LANTERNS — a fixed layer of hanging lanterns that drift as the
// guest scrolls. Each lantern has its own `--depth` (how far it travels
// per pixel scrolled), so near ones outrun far ones and the page reads as
// layered rather than flat.
//
// Notes: positions are seeded once from a fixed table (not random) so the
// composition is deterministic across reloads. Scroll work is coalesced
// into one requestAnimationFrame — never a per-event layout write. The
// layer also dims itself over the pale ivory scenes, where bright lanterns
// would read as clutter rather than atmosphere.
// ═══════════════════════════════════════════════════════════════════════
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  // left%, size px, opacity, depth (px travelled per px scrolled), sway secs
  // Kept small and pushed toward the left/right margins: these are
  // atmosphere behind the content, not subjects. An earlier pass sized
  // them 44-104px wide, which on a 430px phone made them dominate the
  // page and overlap the copy.
  // 14 lanterns across four depth bands. Sizes and depths are deliberately
  // generous — the client asked for them bigger, more numerous and more
  // visibly moving. The largest/nearest sit in the outer margins where they
  // can be big without covering copy; the small far ones drift inward.
  // [ left%, size px, opacity, depth (px per px scrolled), sway secs ]
  // 14 lanterns in four depth bands. Big and clearly moving (the client's
  // ask) but the LARGE ones are pinned to the outer margins — a big lantern
  // drifting through the centre covers the copy. Only the small, faint,
  // slow ones are allowed inboard, and none sit in the 30-68% text column.
  // [ left%, size px, opacity, depth (px per px scrolled), sway secs ]
  const SEED = [
    [ -6, 104, 0.95, 0.62, 5.2 ],
    [ 90, 110, 0.95, 0.70, 6.0 ],
    [ -3,  82, 0.88, 0.50, 4.6 ],
    [ 86,  88, 0.90, 0.56, 6.6 ],
    [  4,  64, 0.78, 0.38, 5.4 ],
    [ 82,  68, 0.80, 0.42, 7.0 ],
    [ -8,  72, 0.82, 0.46, 6.2 ],
    [ 93,  76, 0.85, 0.52, 5.0 ],
    [ 12,  44, 0.52, 0.28, 7.8 ],
    [ 76,  46, 0.54, 0.32, 6.8 ],
    [ 19,  34, 0.40, 0.22, 8.4 ],
    [ 71,  36, 0.42, 0.25, 7.2 ],
    [ 24,  28, 0.32, 0.17, 9.0 ],
    [ 67,  30, 0.34, 0.20, 8.0 ]
  ];

  const layer = document.createElement('div');
  layer.className = 'lantern-layer';
  layer.setAttribute('aria-hidden', 'true');

  const items = SEED.map(([left, size, op, depth, sway], i) => {
    const el = document.createElement('div');
    el.className = 'float-lantern';
    el.style.setProperty('--size', size + 'px');
    el.style.setProperty('--op', op);
    el.style.setProperty('--sway', sway + 's');
    el.style.left = left + '%';
    // The sprite is applied as a CSS background on .fl-img rather than an
    // <img src> here. The platform rewrites asset paths in HTML and CSS, but
    // in JS it only touches import/from and root-relative "https://api.aamantran.online/r2-proxy/templates/raabta-35864/draft/assets/" strings —
    // a './assets/…' literal would ship unrewritten and 404 on the live
    // invite, silently losing the lanterns. Keep the URL in the stylesheet.
    const img = document.createElement('div');
    img.className = 'fl-img';
    el.appendChild(img);
    layer.appendChild(el);
    // start each one at a different height so they don't arrive in a row
    return { el, depth, sway: sway, phase: i * 1.7, base: -220 - (i * 90) % 420 };
  });

  document.body.appendChild(layer);

  // Scenes with a pale background — the layer dims while one fills the view.
  const LIGHT = '.scene-invite, .scene-couple, .scene-insta, .lantern-divider';

  let ticking = false;
  function update() {
    ticking = false;
    const y = window.pageYOffset || document.documentElement.scrollTop || 0;
    const vh = window.innerHeight;
    for (const it of items) {
      // wrap so lanterns recycle instead of drifting off forever
      const span = vh + 620;
      let ty = (it.base + y * it.depth) % span;
      if (ty < 0) ty += span;
      // scroll-linked horizontal drift + tilt, so movement reads clearly as
      // the guest scrolls rather than only the idle CSS sway. Amplitude
      // scales with depth: the near lanterns swing most.
      const t  = y * 0.006 + it.phase;
      const dx = Math.sin(t) * (8 + it.depth * 16);
      const rot = Math.sin(t * 0.85) * (2 + it.depth * 5);
      it.el.style.setProperty('--y', (ty - 300) + 'px');
      it.el.style.setProperty('--x', dx.toFixed(2) + 'px');
      it.el.style.setProperty('--rot', rot.toFixed(2) + 'deg');
    }
    // dim over light scenes
    let light = false;
    document.querySelectorAll(LIGHT).forEach(sc => {
      const r = sc.getBoundingClientRect();
      if (r.top < vh * 0.55 && r.bottom > vh * 0.45) light = true;
    });
    layer.classList.toggle('over-light', light);
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
})();


// ═══════════════════════════════════════════════════════════════════════
// LANTERN DIVIDER — the three hung lanterns swing on their own CSS timing,
// but also take a nudge from scroll velocity, so flicking past them makes
// them swing wider (like a draught) and they settle when the page is still.
// The nudge is written to a CSS custom property that the swing keyframes
// multiply, so it composes with the idle animation instead of fighting it.
// ═══════════════════════════════════════════════════════════════════════
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const hangs = document.querySelectorAll('.lantern-divider .hang');
  if (!hangs.length) return;

  let lastY = window.pageYOffset || 0;
  let vel = 0;
  let ticking = false;
  let settleRaf = null;

  function apply() {
    ticking = false;
    // clamp so a fast flick can't spin them; 1 = idle amplitude
    const boost = 1 + Math.min(Math.abs(vel) / 55, 1.9);
    hangs.forEach(h => h.style.setProperty('--gust', boost.toFixed(3)));
  }

  function decay() {
    vel *= 0.88;
    if (Math.abs(vel) > 0.4) {
      apply();
      settleRaf = requestAnimationFrame(decay);
    } else {
      vel = 0;
      apply();
      settleRaf = null;
    }
  }

  window.addEventListener('scroll', () => {
    const y = window.pageYOffset || 0;
    vel = y - lastY;
    lastY = y;
    if (!ticking) { ticking = true; requestAnimationFrame(apply); }
    if (settleRaf) cancelAnimationFrame(settleRaf);
    settleRaf = requestAnimationFrame(decay);
  }, { passive: true });
})();
