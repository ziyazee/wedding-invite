/* ============================================================================
   Mehrab — Nikah invitation

   Owns: the gate, background art selection (portrait vs landscape), lazy
   loading, scroll parallax, idle drift, countdown, and the music toggle.

   Owns NOTHING to do with RSVP or wishes — the platform runtime binds those
   from the data-aamantran attributes in the markup. Never fetch invite data
   here (see guide.md §4).

   Two rules worth keeping in mind when editing:
   1. GSAP owns `transform` on .layer elements. Position them from CSS with
      left/right/width/height only.
   2. Scrolling happens inside .scroller, not window, so ScrollTrigger must be
      told about that scroller — otherwise every trigger silently never fires.
   ========================================================================= */

(() => {
  "use strict";

  /* ── Feel ────────────────────────────────────────────────────────────
     "calm" | "smooth" | "lively" | "intense" */
  const SPEED = "lively";

  const PRESETS = {
    calm:    { parallax: 0.8, idle: 1.0, dur: 6 },
    smooth:  { parallax: 1.2, idle: 1.8, dur: 5 },
    lively:  { parallax: 2.2, idle: 3.4, dur: 4 },
    intense: { parallax: 3.0, idle: 5.0, dur: 3.2 },
  };

  /* Phones used to get a knocked-back version of the feel (parallax .75, idle
     .6). Against a portrait plate that reads as no motion at all — a phone is
     narrow, so a horizontal drift of a few pixels is invisible where the same
     tween is obvious across a 1440px stage — on a phone that reads as no
     animation at all. Mobile therefore runs the drift ABOVE
     desktop amplitude so it covers a comparable fraction of the screen, and
     leans vertical, which is the axis a tall screen actually shows off. */
  const MOBILE_SCALE = { parallax: 1.05, idle: 1.35 };
  /* A tablet sits between the two: plenty of stage, but less than a desktop. */
  const TABLET_SCALE = { parallax: 0.95, idle: 1.1 };
  const cfg = PRESETS[SPEED] || PRESETS.smooth;

  const MOBILE_Q = "(max-width: 720px)";
  /* An iPad in portrait is framed far closer to a phone than to a desktop, so
     it takes the portrait plates too. In landscape it keeps the 16:9 art. */
  const TABLET_PORTRAIT_Q = "(min-width: 721px) and (max-width: 1024px) and (orientation: portrait)";
  const TABLET_Q = "(min-width: 721px) and (max-width: 1024px)";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const scroller = document.getElementById("scroller");
  const dataEl   = document.getElementById("js-data");
  const panels   = Array.from(document.querySelectorAll(".panel"));

  /* Which scene uses which background plate. The portrait twin is the same
     name with `-p` before the extension; see the image brief. */
  /* Background URLs are NOT held here as string literals.

     guide.md 6.1: on upload the platform rewrites relative asset paths to the
     CDN in .html and .css, but in .js it rewrites ONLY import/from specifiers
     and root-relative strings. A relative asset literal in JS therefore ships
     verbatim and resolves against the page URL instead of the CDN — a 404 on
     every live invite. (Quoted examples are deliberately omitted here: the
     rewriter would rewrite them inside this very comment.)

     So each background lives on its own element as data-bg / data-bg-p (the
     portrait twin) in index.html, which IS rewritten, and is read back here.
     Same pattern the .layer elements already use for data-src. */

  const isMobile   = () => window.matchMedia(MOBILE_Q).matches;
  const isTablet   = () => window.matchMedia(TABLET_Q).matches;
  /* Who gets the 9:16 plates: phones, and tablets held upright. */
  const wantsPortrait = () =>
    isMobile() || window.matchMedia(TABLET_PORTRAIT_Q).matches;
  /* Motion scale for the current viewport, read fresh each time so a rotation
     or resize picks up the right amplitude instead of keeping load-time values. */
  const motionScale = () =>
    isMobile() ? MOBILE_SCALE : isTablet() ? TABLET_SCALE : { parallax: 1, idle: 1 };

  /* ── Layer loading ────────────────────────────────────────────────────
     Every layer keeps its URL in data-src and is only fetched when its scene
     is near the viewport. Eight scenes of full-bleed art is far too much to
     load up front on a phone. */

  /* During local preview only, stamp a version onto asset URLs so a
     regenerated image with the SAME filename can never be served from a stale
     browser cache. This cost real debugging time once: placeholder art and
     final art shared filenames, and Safari kept painting the placeholders long
     after the files on disk had changed. Live renders are served from the
     platform CDN under a fresh path per deploy, so this only applies to
     localhost. */
  const DEV_BUST = /^(localhost|127\.0\.0\.1)$/.test(location.hostname)
    ? "?v=" + Date.now()
    : "";

  function applyImage(layer, url) {
    url += DEV_BUST;
    // Decode before painting so a scene never flashes a half-drawn plate.
    const img = new Image();
    img.onload = () => {
      layer.style.backgroundImage = `url("${url}")`;
      layer.classList.add("is-ready");
    };
    img.onerror = () => {
      // Missing art must not leave a black hole — the panel's CSS tint shows
      // through instead, which is why the tints exist.
      layer.classList.add("is-ready", "is-missing");
    };
    img.src = url;
  }

  function loadLayer(layer) {
    if (layer.dataset.loaded === "1") return;
    layer.dataset.loaded = "1";

    if (layer.classList.contains("bg")) {
      const base = layer.dataset.bg;
      if (!base) return;
      const portrait = wantsPortrait();
      const url = (portrait && layer.dataset.bgP) ? layer.dataset.bgP : base;

      // If the portrait plate hasn't been generated yet, fall back to the
      // landscape one rather than showing nothing.
      if (portrait) {
        const probe = new Image();
        probe.onload  = () => applyImage(layer, url);
        probe.onerror = () => applyImage(layer, base);
        probe.src = url;
      } else {
        applyImage(layer, base);
      }
      layer.dataset.currentSet = portrait ? "portrait" : "landscape";
      return;
    }

    const src = layer.dataset.src;
    if (src) applyImage(layer, src);
  }

  /* Load a scene's layers when it comes within one screen of the viewport.
     Eight scenes of full-bleed art is several megabytes; fetching all of it up
     front means a guest on mobile data pays for the whole invitation before the
     gate even opens. One screen of lead time is enough for the decode-then-paint
     pass below to finish before the scene arrives.

     Scene 1 is exempt — it is already on screen behind the gate, so waiting for
     an observer callback would show it blank on the guest's first scroll. */
  document.querySelectorAll('.panel[data-scene="1"] .layer').forEach(loadLayer);

  if (window.IntersectionObserver) {
    /* root is .scroller, not the viewport: this page scrolls inside that
       element, so a viewport-rooted observer measures against the wrong box
       and the one-screen lead time collapses to nothing. */
    const io = new IntersectionObserver((entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.querySelectorAll(".layer").forEach(loadLayer);
        obs.unobserve(entry.target);
      }
    }, { root: scroller, rootMargin: "100% 0px" });
    panels.forEach((panel) => io.observe(panel));
  } else {
    document.querySelectorAll(".layer").forEach(loadLayer);
  }

  /* Re-swap backgrounds when crossing the mobile breakpoint (orientation
     change, or a desktop window dragged narrow). Only already-loaded plates
     are touched; the rest pick the right set when they load. */
  const onBreakpoint = () => {
    const want = wantsPortrait() ? "portrait" : "landscape";
    document.querySelectorAll(".layer.bg").forEach((layer) => {
      if (layer.dataset.loaded !== "1") return;
      if (layer.dataset.currentSet === want) return;
      layer.dataset.loaded = "0";
      loadLayer(layer);
    });
    // The gate can still be open behind the first scroll.
    if (typeof refreshGateArt === "function") refreshGateArt();
    // Amplitudes are per-viewport, so the tweens have to be rebuilt too —
    // otherwise an iPad rotated to portrait keeps desktop's motion values.
    rebuildMotion();
  };

  /* Watch every query that changes which plate or which amplitude applies.
     An iPad rotating portrait<->landscape never crosses 720px, so watching
     only the mobile query left it on the wrong art and the wrong motion. */
  [MOBILE_Q, TABLET_Q, TABLET_PORTRAIT_Q, "(orientation: portrait)"].forEach((q) => {
    const mq = window.matchMedia(q);
    if (mq.addEventListener) mq.addEventListener("change", onBreakpoint);
    else if (mq.addListener) mq.addListener(onBreakpoint);
  });

  /* ── Motion ───────────────────────────────────────────────────────────
     GSAP is optional. If the CDN is blocked the page stays fully readable —
     it just doesn't drift. Everything below is inside this guard. */
  function initMotion() {
    if (!window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.defaults({ scroller });

    panels.forEach((panel) => {
      const layers = Array.from(panel.querySelectorAll(".layer"));
      const inner  = panel.querySelector(".panel__inner");

      layers.forEach((layer, li) => {
        const depth = parseFloat(layer.dataset.depth) || 0;
        // Figures must not rotate — rotating a person makes them "swim".
        const isFigure = /\b(fig-|hands)/.test(layer.className);
        const isBranch = /\bbranch\b/.test(layer.className);
        const isToplights = /\btoplights\b/.test(layer.className);
        const topAnchored = isToplights || isBranch;
        /* Scene 5's dholak (`.hands`) is held up in mid-air over a blurred
           background — nothing is drawn beneath it, so it is NOT grounded. It
           still never rotates (hands that rotate "swim"), but it takes the full
           two-way scroll parallax and a vertical float. Filed as a grounded
           figure it started at 0 on phones, only ever crept one way, and had no
           vertical idle at all, so it read as not moving. */
        const isFloating = layer.classList.contains("hands");
        const isGroundedFigure = isFigure && !topAnchored && !isFloating;

        const px = cfg.parallax * motionScale().parallax;
        const mob = isMobile();

        // Grounded figures and toplights start at 0 on mobile so feet stay planted and fairy lights don't pop.
        // Branch elements glide gently and slowly down into view as the user scrolls!
        const startY = ((isToplights || isGroundedFigure) && mob) 
          ? 0 
          : isBranch 
            ? (-depth * px * (mob ? 0.4 : 0.35)) 
            : (-depth * px * 0.5);

        const endY = (isToplights && mob) 
          ? (depth * px * 0.3) 
          : (isGroundedFigure && mob) 
            ? (depth * px * 0.35) 
            : isBranch 
              ? (depth * px * (mob ? 0.35 : 0.3)) 
              : (depth * px * 0.5);

        /* data-mobile-drop-in="N" (phones only): a hanging band that starts
           hidden ABOVE its scene — lifted by N% of its own height, clipped by
           the panel's overflow — lowers into place as the scene scrolls up into
           view, and is fully home at the moment the scene reaches the top of
           the screen. After that the tween is finished, so the band simply
           stays in the top of its scene instead of travelling down through it. */
        const dropIn = mob ? parseFloat(layer.dataset.mobileDropIn) : NaN;
        const hasDropIn = Number.isFinite(dropIn);

        /* data-mobile-parallax="N" (phones only) scales a layer's scroll travel.
           yPercent is relative to the layer's OWN height, so a layer cropped
           short on a phone moves far fewer pixels than the same layer does on
           desktop — scene 1's pool strip is 156px tall there against 360px, so
           its parallax came out at under half the desktop movement. */
        const travel = (mob && parseFloat(layer.dataset.mobileParallax)) || 1;

        gsap.fromTo(
          layer,
          { yPercent: hasDropIn ? -dropIn : startY * travel },
          {
            yPercent: hasDropIn ? 0 : endY * travel,
            ease: "none",
            // scrub:1 adds a little lag behind the scroll, which reads as weight
            scrollTrigger: {
              trigger: panel,
              start: "top bottom",
              /* A drop-in band finishes settling a little AFTER its scene reaches
                 the top (20% of a screen later). Ending exactly at the top made
                 the whole drop happen in the arrival alone, which read as fast;
                 the extra stretch slows it while the last few pixels of settling
                 stay inside the top band. */
              end: hasDropIn ? "top -20%" : "bottom top",
              scrub: 1,
            },
          }
        );

        /* Idle drift — this is what makes the page feel alive when the guest
           stops scrolling. It runs on mobile too, at reduced amplitude: eight
           scenes of infinite tweens can stutter on mid-range hardware, so the
           motion is scaled back rather than switched off. */
        if (!reduceMotion && depth > 0) {
          /* data-mobile-float scales the idle drift on phones for one layer.
             A top-anchored band drifts DOWN by its full amplitude (~110px at
             depth 24), which on a single-screen scene is enough to pull
             hanging lanterns off the top edge and into the middle. */
          const floatScale = (mob && parseFloat(layer.dataset.mobileFloat)) || 1;
          const amp = depth * cfg.idle * motionScale().idle * floatScale;
          const dir = li % 2 ? -1 : 1;
          /* On a tall narrow screen a horizontal drift travels a tiny fraction
             of the frame and reads as static, so the axes are weighted the
             other way round on a phone: vertical leads, horizontal supports. */

          /* A top-anchored band (string lights, garlands) has nothing below it
             and a mask fading its bottom edge, so drifting it UP walks it out
             of frame — on a phone that looked like the lights had stopped.
             Push these DOWN instead, into the space the CSS now reserves. */
          const ySign = topAnchored ? 1 : -1;

          /* A standing figure is grounded: its feet rest on a path, a floor or
             a courtyard drawn into the background. Scaling it about the default
             CENTRE origin lifts the bottom edge as it grows, and the couple
             visibly float above the ground. Scaling from the BOTTOM edge instead
             grows them upward from the feet, which stay planted. */
          if (isGroundedFigure) {
            gsap.set(layer, { transformOrigin: "50% 100%" });
          }

          gsap.to(layer, {
            x: isBranch ? 0 : (amp * dir * (mob ? 0.55 : 1)),
            /* Grounded figures drift on the horizontal only. Branch layers move strictly vertically, slowly and softly. */
            /* A floating object bobs gently rather than at full layer amplitude:
               the generic value is ~69px on a phone, which on the scene's focal
               object reads as bouncing and fights the scroll parallax. */
            y: isGroundedFigure ? 0
              : isBranch ? (ySign * amp * 0.35)
              : isFloating ? (ySign * amp * (mob ? 0.45 : 0.4))
              : (ySign * amp * (mob ? 1.0 : 0.55)),
            scale: 1 + depth * (mob ? 0.003 : 0.005),
            rotation: (isFigure || isBranch) ? 0 : depth * 0.05 * dir,
            duration: (isBranch ? (cfg.dur * 1.5) : cfg.dur) + li * 0.4,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });

          /* A band of small repeating dots defeats translation: every light
             looks like every other one, so sliding the whole band 40px reads
             as nothing moving at all — especially on a phone, where that band
             is only a couple of centimetres wide. Brightness is the cue the
             eye DOES catch on a field like this, so the lights breathe as
             well as drift. Same trick for the diffuse glow/bokeh accents. */
          if (topAnchored || /\bglow\b/.test(layer.className)) {
            /* The tween is built BEFORE the image decodes, and .is-ready is
               what raises the layer from opacity 0 to its resting value. A
               relative "-=0.22" would therefore latch onto 0 and animate to a
               negative value, leaving the layer invisible for good. Read the
               resting opacity from CSS once the layer is actually ready, then
               breathe around THAT. */
            const startTwinkle = () => {
              const rest = parseFloat(getComputedStyle(layer).opacity) || 1;
              if (rest < 0.05) return;            // hidden by design — leave it
              gsap.fromTo(layer,
                { opacity: rest },
                {
                  opacity: Math.max(0.12, rest - (topAnchored ? 0.3 : 0.2)),
                  duration: (cfg.dur * 0.45) + li * 0.25,
                  ease: "sine.inOut",
                  repeat: -1,
                  yoyo: true,
                  delay: li * 0.3,
                  overwrite: false,
                });
            };
            if (layer.classList.contains("is-ready")) startTwinkle();
            else {
              // Wait for the decode-then-paint pass to set its resting value.
              const obs = new MutationObserver(() => {
                if (layer.classList.contains("is-ready")) {
                  obs.disconnect();
                  // Let the .6s CSS fade finish so we read the settled value.
                  setTimeout(startTwinkle, 700);
                }
              });
              obs.observe(layer, { attributes: true, attributeFilter: ["class"] });
            }
          }
        }
      });

      if (inner) {
        gsap.from(inner, {
          autoAlpha: 0,
          y: reduceMotion ? 0 : 60,
          scale: reduceMotion ? 1 : 0.97,
          duration: reduceMotion ? 0.01 : 1.15,
          ease: "power3.out",
          scrollTrigger: { trigger: panel, start: "top 72%" },
        });

        /* Stagger the lines within a scene so text arrives as a sequence
           rather than one block. */
        if (!reduceMotion) {
          const bits = inner.querySelectorAll(
            ".eyebrow, .names, .scene-title, .date-big, .lede, .hashtag, .fn, .card, .know__row, .family"
          );
          if (bits.length > 1) {
            gsap.from(bits, {
              autoAlpha: 0,
              y: 26,
              duration: 0.8,
              ease: "power2.out",
              stagger: 0.09,
              scrollTrigger: { trigger: panel, start: "top 66%" },
            });
          }
        }
      }
    });

    // Scene 1's text is already on screen at load, so its reveal would sit
    // waiting for a scroll that never comes.
    ScrollTrigger.refresh();
  }

  /* Tear the tweens down and build them again at the current viewport's
     amplitudes. Called when a breakpoint or orientation changes — an iPad
     rotated to portrait otherwise keeps the desktop motion values it was
     built with, which is half of why motion "disappears" off desktop.

     Layer transforms are cleared explicitly: killing a yoyo tween leaves the
     layer wherever it stopped, and GSAP owns transform on .layer, so a stale
     offset would stick permanently. */
  let motionBuilt = false;
  function rebuildMotion() {
    if (!window.gsap || !window.ScrollTrigger || !motionBuilt) return;
    ScrollTrigger.getAll().forEach((t) => t.kill());
    document.querySelectorAll(".layer").forEach((l) => {
      gsap.killTweensOf(l);
      gsap.set(l, { clearProps: "transform" });
    });
    document.querySelectorAll(".panel__inner").forEach((el) => {
      gsap.killTweensOf(el);
      gsap.set(el, { clearProps: "transform,opacity,visibility" });
    });
    initMotion();
  }

  /* ── Start the guest at the top on refresh (guide.md 7.2) ─────────────
     Chrome's scroll restore can win the race against this script, so the
     `load` re-pin is the one that actually matters on a hard refresh. The
     guard is essential: never yank someone who has already opened the gate
     and is reading — this only pins while the gate is still closed.

     This template scrolls inside .scroller rather than the window, so that
     element is reset too. */
  function pinToStart() {
    const gate = document.getElementById("gate");
    if (!gate || gate.classList.contains("is-open")) return;  // already entered
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (scroller) scroller.scrollTop = 0;
  }
  pinToStart();
  window.addEventListener("pageshow", pinToStart);
  window.addEventListener("load", pinToStart);

  /* ── RSVP: ask yes or no first ────────────────────────────────────────
     Three panels, one visible at a time. The
     question comes first, because a long form up front reads as work.

     The decline panel sits OUTSIDE the form, which is what keeps this simple:
     `attending` is a hidden field permanently set to "yes", so the only thing
     that ever reaches the runtime is an acceptance, and every [data-field] the
     runtime looks for appears exactly once. A decline just answers kindly and
     offers the way back.

     (Consequence worth knowing: a "no" is not recorded anywhere. If the couple
     should see who cannot come, the decline panel needs its own name field and
     a second form posting attending:false — the RSVP API accepts it.) */
  (function initRsvpChoice() {
    const choice  = document.querySelector('[data-rsvp="choice"]');
    const accept  = document.querySelector('[data-rsvp="accept"]');
    const decline = document.querySelector('[data-rsvp="decline"]');
    if (!choice || !accept || !decline) return;

    const status = document.querySelector('[data-aamantran="rsvp-status"]');

    function show(step) {
      choice.hidden  = step !== "choice";
      accept.hidden  = step !== "accept";
      decline.hidden = step !== "decline";
    }

    document.querySelectorAll("[data-rsvp-choice]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const yes = btn.dataset.rsvpChoice === "yes";
        show(yes ? "accept" : "decline");
        // Land on the first field, but never on a phone — the keyboard would
        // cover the form the guest was just shown.
        if (yes && !isMobile()) {
          accept.querySelector('[data-field="guestName"]')?.focus({ preventScroll: true });
        }
      });
    });

    document.querySelectorAll("[data-rsvp-back]").forEach((btn) => {
      btn.addEventListener("click", () => {
        show("choice");
        if (status) { status.textContent = ""; status.classList.remove("is-demo"); }
        choice.querySelector("[data-rsvp-choice]")?.focus({ preventScroll: true });
      });
    });
  })();

  /* ── Wishes: four at a time, on a rotation ────────────────────────────
     The platform runtime owns the wall: it empties and rebuilds it on load and
     again after every posted wish. So nothing here holds onto nodes — a
     MutationObserver re-reads the wall whenever the runtime touches it, exactly
     the "let the runtime fill it first, then rearrange" pattern from guide.md 4.

     Set by the block below so the demo submit fallback can echo a wish back. */
  let pushSessionWish = null;

  /* Sample wishes for the storefront demo. Written for a Nikah — duas and
     walima rather than the generic wedding lines a shared preview would use. */
  const DEMO_WISHES = [
    ["Barakallahu lakuma wa baraka alaykuma. May Allah bless you both and join you in goodness.", "Ayesha"],
    ["So happy for you two. Save me a seat at the walima!", "Rehan"],
    ["May your home always be full of light, laughter and barakah.", "The Qureshis"],
    ["Been waiting for this day for years. Mubarak ho to both families!", "Sana"],
    ["Sending all our love from Lucknow. May this nikah be the start of something beautiful.", "Faiz & Mariam"],
    ["Ameen to every dua made for you today. Couldn't be happier for you both.", "Imran"],
  ];

  (function initWishWall() {
    const wall = document.querySelector('[data-aamantran="wish-wall"]');
    if (!wall) return;

    const viewAll = document.querySelector('[data-wish="view-all"]');
    const modal   = document.querySelector('[data-wish="modal"]');
    const list    = document.querySelector('[data-wish="list"]');

    const ON_WALL = 4;      // how many are visible at once, always
    const EVERY   = 5000;   // ms between swaps
    const FADE    = 360;    // must match the .aamantran-wish opacity transition

    let cards = [];
    let visible = [];       // indices currently on the wall
    let queue = [];         // indices waiting their turn
    let slot = 0;           // which of the visible positions swaps next
    let timer = null;
    let paused = false;
    let resumeAt = 0;
    let modalOpen = false;

    /* Same shape the runtime builds, so one stylesheet covers both. */
    function makeCard(message, author) {
      const wrap = document.createElement("div");
      wrap.className = "aamantran-wish";
      const p = document.createElement("p");
      p.className = "aamantran-wish-message";
      p.textContent = '"' + message + '"';
      const s = document.createElement("span");
      s.className = "aamantran-wish-author";
      s.textContent = "— " + author;
      wrap.appendChild(p);
      wrap.appendChild(s);
      return wrap;
    }

    /* One card at a time is swapped, never the whole set: the wall keeps exactly
       ON_WALL cards from the first render to the last. Paging the list in blocks
       of four is what made a sixth wish show as "4, then 2". */
    function tick() {
      if (paused || document.hidden || modalOpen) return;
      if (resumeAt && Date.now() < resumeAt) return;
      if (!queue.length) return;

      const outIdx = visible[slot];
      const inIdx  = queue.shift();
      const outCard = cards[outIdx];
      const inCard  = cards[inIdx];
      if (!outCard || !inCard) return;

      outCard.classList.add("wish-out");          // fade, still occupying its slot
      setTimeout(() => {
        if (modalOpen) return;
        outCard.classList.add("wish-hidden");
        outCard.classList.remove("wish-out");
        queue.push(outIdx);
        visible[slot] = inIdx;
        inCard.classList.remove("wish-hidden");
        slot = (slot + 1) % visible.length;
      }, FADE);
    }

    function restart() {
      if (timer) { clearInterval(timer); timer = null; }
      if (reduceMotion || !queue.length) return;
      timer = setInterval(tick, EVERY);
    }

    function sync() {
      cards = Array.prototype.filter.call(
        wall.children, (el) => el.classList.contains("aamantran-wish"));

      visible = [];
      queue = [];
      slot = 0;

      const n = Math.min(ON_WALL, cards.length);
      cards.forEach((c, i) => {
        c.classList.remove("wish-out");
        c.classList.toggle("wish-hidden", i >= n);
        (i < n ? visible : queue).push(i);
      });

      if (viewAll) {
        viewAll.hidden = cards.length === 0;
        viewAll.textContent = cards.length
          ? `View all wishes (${cards.length})`
          : "View all wishes";
      }

      restart();
      if (modalOpen) fillModal();
    }

    /* Hovering, focusing or touching the wall holds the current four in place —
       a rotation that moves while someone is reading is just lost text. */
    ["mouseenter", "focusin"].forEach((ev) =>
      wall.addEventListener(ev, () => { paused = true; }));
    ["mouseleave", "focusout"].forEach((ev) =>
      wall.addEventListener(ev, () => { paused = false; }));
    wall.addEventListener("touchstart", () => { paused = true; }, { passive: true });
    wall.addEventListener("touchend", () => {
      paused = false;
      // Give a thumb a few seconds before the text moves under it again.
      resumeAt = Date.now() + 5000;
    }, { passive: true });

    /* ── View all ─────────────────────────────────────────────────────── */
    let lastFocus = null;

    function fillModal() {
      if (!list) return;
      list.replaceChildren();
      cards.forEach((c) => {
        const copy = c.cloneNode(true);
        // The wall's rotation state must not travel into the modal, which shows
        // every wish at once.
        copy.classList.remove("wish-hidden", "wish-out");
        list.appendChild(copy);
      });
    }

    function openModal() {
      if (!modal || !cards.length) return;
      modalOpen = true;
      lastFocus = document.activeElement;
      fillModal();
      modal.hidden = false;
      document.body.classList.add("is-modal");
      modal.querySelector(".wishmodal__close")?.focus({ preventScroll: true });
    }

    function closeModal() {
      if (!modal || modal.hidden) return;
      modalOpen = false;
      modal.hidden = true;
      if (list) list.replaceChildren();
      document.body.classList.remove("is-modal");
      sync();                       // restart the rotation from a clean state
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }

    viewAll?.addEventListener("click", openModal);
    modal?.querySelectorAll('[data-wish="close"]').forEach((b) =>
      b.addEventListener("click", closeModal));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });

    /* childList only. The rotation toggles classes on the children, so observing
       attributes or the subtree would make this observer retrigger itself. */
    let queued = false;
    new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; sync(); });
    }).observe(wall, { childList: true });

    /* A wish the guest just typed, shown back to them for this session only.
       Prepended so it lands on the wall straight away, where they will see it. */
    pushSessionWish = function (message, author) {
      wall.insertBefore(makeCard(message, author), wall.firstChild);
    };

    /* Sample wishes, for the storefront demo ONLY. Gated on the URL, never on
       "the runtime is missing" — a live invite whose SDK request failed is also
       missing its runtime, and a real couple's page must never show invented
       wishes from people who do not exist. Live invites are always served from
       /i/<slug>, so a pathname test cannot misfire. Nothing is persisted. */
    if (/^\/demo\//.test(window.location.pathname) && !wall.children.length) {
      DEMO_WISHES.forEach(([m, a]) => wall.appendChild(makeCard(m, a)));
    }

    sync();
  })();

  /* ── Demo-page submit fallback (guide.md 5) ───────────────────────────
     /demo/<slug> — the public preview a buyer clicks from the storefront — is
     rendered WITHOUT the SDK. Nothing binds to these forms there, so a submit
     does what an unhandled submit always does: a native GET and a full page
     reload, which throws the visitor back to the top, behind the gate, having
     lost their place. It is the first thing a buyer tries.

     TIMING TRAP (also from the guide): the runtime is injected AFTER this
     file is parsed, so window.__AAMANTRAN__ does not exist at parse time even
     on a live invite. The check therefore happens INSIDE the handler, at
     submit time, by which point the runtime has loaded. Our listener
     registers first, so on a live invite it sees the runtime, returns, and
     the platform's own handler does the real work. */
  document.querySelectorAll('form[data-aamantran="rsvp"], form[data-aamantran="wish"]')
    .forEach((form) => {
      form.addEventListener("submit", (e) => {
        if (window.__AAMANTRAN__) return;   // real runtime owns this submit
        e.preventDefault();                 // never let it reload the page

        const kind   = form.dataset.aamantran;
        const status = document.querySelector(`[data-aamantran="${kind}-status"]`);
        if (status) {
          status.textContent = kind === "rsvp"
            ? "Thank you — your RSVP would be sent on the live invitation."
            : "Thank you — your message would be posted on the live invitation.";
          status.classList.add("is-demo");
        }

        /* Echo a demo visitor's own wish back onto the wall so the feature
           reads as working on the page buyers judge. Session only — nothing is
           stored, and a refresh clears it.

           Gated on the URL for the same reason as the sample wishes above, and
           skipped under the local preview server, whose mock runtime already
           appends the wish itself (both would mean two copies). */
        if (kind === "wish"
            && pushSessionWish
            && !window.__PREVIEW__
            && /^\/demo\//.test(window.location.pathname)) {
          const name = form.querySelector('[data-field="guestName"]');
          const msg  = form.querySelector('[data-field="message"]');
          const text = (msg?.value || "").trim();
          if (text) {
            pushSessionWish(text, (name?.value || "").trim() || "Guest");
            form.reset();
          }
        }
      });
    });

  /* GSAP and ScrollTrigger are already loaded by the two <script defer> tags
     ahead of this file in index.html, so they are on window by the time this
     runs — no runtime injection needed. They used to be pulled from cdnjs,
     which the platform's CSP script-src blocks (only 'self' and the media CDN
     are allowed), so on a published invite every animation silently no-opped
     and the page was completely static. initMotion() still guards on
     window.gsap, so a missing file degrades to a static but readable page. */
  initMotion();
  motionBuilt = true;

  /* ── Gate artwork ─────────────────────────────────────────────────────
     Loaded the same way as a scene background: portrait plate on phones,
     landscape elsewhere, decoded before it is painted, and falling back to the
     gate's CSS gradient if the file is missing. */

  /* Named rather than an IIFE so a rotation can re-run it: an iPad turned
     upright while the gate is still open needs the portrait plate swapped in,
     the same as the scenes behind it. */
  function refreshGateArt() {
    const art = document.querySelector(".gate__art");
    if (!art) return;
    // Same guide.md 6.1 reason as the scene backgrounds: the URL lives on the
    // element in HTML, where the platform's asset rewriter can see it.
    const base = art.dataset.bg;
    if (!base) return;
    const want = (wantsPortrait() && art.dataset.bgP) ? art.dataset.bgP : base;

    const paint = (url) => {
      const img = new Image();
      img.onload = () => {
        art.style.setProperty("--gate-img", `url("${url + DEV_BUST}")`);
        art.classList.add("is-ready");
      };
      // No art yet (or a missing portrait twin) — the gradient carries the gate.
      img.onerror = () => {
        if (url !== base) paint(base);
      };
      img.src = url + DEV_BUST;
    };
    paint(want);
  }
  refreshGateArt();

  /* ── Fit-to-width text ────────────────────────────────────────────────
     A wedding hashtag is one unbreakable token and couples pick long ones, so
     it can overrun its column at any breakpoint. Shrink it to fit rather than
     letting it clip or fragment. */
  function fitText(el) {
    if (!el) return;
    el.style.setProperty("--fit", 1);
    const avail = el.clientWidth;
    if (!avail) return;
    // The element is a block, so scrollWidth == clientWidth even while the
    // text overruns it. Measure the TEXT itself with a Range instead.
    let textW = 0;
    try {
      const r = document.createRange();
      r.selectNodeContents(el);
      textW = r.getBoundingClientRect().width;
    } catch (_) {
      return;
    }
    if (!textW) return;
    const ratio = avail / textW;
    if (ratio < 1) el.style.setProperty("--fit", Math.max(ratio * 0.97, 0.35));
  }

  const hashtagEl = document.querySelector(".hashtag");
  const refit = () => fitText(hashtagEl);

  /* Measure after layout has actually settled. A single early call reads the
     fallback font at the wrong width and then never corrects itself, which is
     exactly how a 515px tag ended up sitting in a 259px column. */
  if (hashtagEl) {
    requestAnimationFrame(() => requestAnimationFrame(refit));
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => requestAnimationFrame(refit));
    }
    window.addEventListener("resize", refit);
    /* Observing the container would feed back on itself: refit changes the font
       size, which resizes the element, which fires the observer again —
       "ResizeObserver loop completed with undelivered notifications". Watch the
       panel instead (its size doesn't depend on the hashtag) and defer the
       measurement out of the observer callback. */
    if (window.ResizeObserver) {
      const panelEl = hashtagEl.closest(".panel");
      if (panelEl) {
        let queued = false;
        new ResizeObserver(() => {
          if (queued) return;
          queued = true;
          requestAnimationFrame(() => { queued = false; refit(); });
        }).observe(panelEl);
      }
    }
  }

  /* ── Gate ─────────────────────────────────────────────────────────── */
  const gate = document.getElementById("gate");
  const gateBtn = document.getElementById("gate-btn");

  document.body.classList.add("is-gated");

  function openGate() {
    if (!gate || gate.classList.contains("is-open")) return;
    gate.classList.add("is-open");
    document.body.classList.remove("is-gated");
    startMusic();
    // Let the reveal animations measure against the now-scrollable page.
    setTimeout(() => window.ScrollTrigger && ScrollTrigger.refresh(), 850);
    setTimeout(() => gate.remove(), 900);
  }

  gateBtn?.addEventListener("click", openGate);
  gate?.addEventListener("click", openGate);

  /* ── Music ────────────────────────────────────────────────────────────
     Browsers block audible autoplay, so the track starts muted and unmutes
     on the guest's first real interaction (guide.md §1). */
  const audio = document.getElementById("music");
  const musicBtn = document.getElementById("music-btn");
  let musicOn = false;

  function reflectMusic() {
    musicBtn?.classList.toggle("is-playing", musicOn);
    musicBtn?.setAttribute("aria-pressed", String(musicOn));
  }

  function startMusic() {
    if (!audio) return;
    audio.muted = false;
    audio.volume = 0.55;
    audio.play().then(() => {
      musicOn = true;
      reflectMusic();
    }).catch(() => {
      // Autoplay refused — the guest can still start it from the button.
      musicOn = false;
      reflectMusic();
    });
  }

  musicBtn?.addEventListener("click", () => {
    if (!audio) return;
    if (musicOn) {
      audio.pause();
      musicOn = false;
      reflectMusic();
    } else {
      audio.muted = false;
      audio.play().then(() => { musicOn = true; reflectMusic(); }).catch(() => {});
    }
  });

  /* ── Countdown ────────────────────────────────────────────────────────
     Hidden entirely when there's no date, the date is unparseable, or the
     wedding has already happened — an invitation showing "-3 days" is worse
     than one showing nothing. */
  const cdEl = document.getElementById("countdown");
  const iso = dataEl?.dataset.date || "";

  if (cdEl && iso && !window.frameElement?.hasAttribute('data-order-template')) {
    // Parse as local noon: `new Date("2027-02-12")` is parsed as UTC, which
    // lands on the previous day for anyone west of GMT.
    const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const target = m
      ? new Date(+m[1], +m[2] - 1, +m[3], 12, 0, 0)
      : new Date(iso);

    if (!isNaN(target.getTime())) {
      const nodes = {
        days:  cdEl.querySelector('[data-cd="days"]'),
        hours: cdEl.querySelector('[data-cd="hours"]'),
        mins:  cdEl.querySelector('[data-cd="mins"]'),
        secs:  cdEl.querySelector('[data-cd="secs"]'),
      };

      const tick = () => {
        const order = window.orderInvitation;
        const diff = (order ? new Date(`${order.date}T${order.time}:00${order.offset}`).getTime() : target.getTime()) - Date.now();
        if (diff <= 0) {
          cdEl.hidden = true;
          if (!window.orderInvitation) clearInterval(timer);
          return;
        }
        const s = Math.floor(diff / 1000);
        cdEl.hidden = false;
        nodes.days.textContent  = Math.floor(s / 86400);
        nodes.hours.textContent = Math.floor((s % 86400) / 3600);
        nodes.mins.textContent  = Math.floor((s % 3600) / 60);
        nodes.secs.textContent  = s % 60;
      };

      if (target.getTime() > Date.now()) {
        cdEl.hidden = false;
        tick();
        var timer = setInterval(tick, 1000);
      }
    }
  }

  /* ── Floating lanterns (scene 4 only) ────────────────────────────────
     Hanging lanterns that drift down the left and right edges of the
     celebrations scene, adding depth and Mughal ambiance. */
  (function initFloatingLanterns() {
    if (reduceMotion) return;

    /* Runs on every panel carrying data-lantern — today that is scene 4. */
    const panels = document.querySelectorAll(".panel[data-lantern]");
    if (!panels.length) return;

    // [ left%, size px, opacity, depth (px per px scrolled), sway secs ]
    const SEED = [
      [ -4, 104, 0.58, 0.62, 5.2 ],
      [ 89, 110, 0.58, 0.70, 6.0 ],
      [ -2,  82, 0.52, 0.50, 4.6 ],
      [ 85,  88, 0.54, 0.56, 6.6 ],
      [  3,  64, 0.48, 0.38, 5.4 ],
      [ 82,  68, 0.48, 0.42, 7.0 ],
      [ -6,  72, 0.50, 0.46, 6.2 ],
      [ 92,  76, 0.52, 0.52, 5.0 ],
      [ 10,  44, 0.38, 0.28, 7.8 ],
      [ 77,  46, 0.40, 0.32, 6.8 ],
      [ 16,  34, 0.32, 0.22, 8.4 ],
      [ 73,  36, 0.34, 0.25, 7.2 ],
      [ 22,  28, 0.26, 0.17, 9.0 ],
      [ 68,  30, 0.28, 0.20, 8.0 ]
    ];

    const scenes = [];
    panels.forEach((scene4) => {
    /* Same guide.md 6.1 reason as every other asset in this file: the URL is
       read off the element, where the platform's rewriter can see and rewrite
       it. A './assets/…' literal here would 404 on every live invite. */
    const lanternSrc = scene4.dataset.lantern;
    if (!lanternSrc) return;

    const layer = document.createElement("div");
    layer.className = "lantern-layer";
    layer.setAttribute("aria-hidden", "true");

    const items = SEED.map(([left, size, op, depth, sway], i) => {
      const el = document.createElement("div");
      el.className = "float-lantern";
      el.style.setProperty("--size", size + "px");
      el.style.setProperty("--op", op);
      el.style.setProperty("--sway", sway + "s");
      el.style.left = left + "%";
      const img = document.createElement("img");
      img.className = "fl-img";
      img.src = lanternSrc + DEV_BUST;
      img.alt = "";
      img.loading = "lazy";
      el.appendChild(img);
      layer.appendChild(el);
      return { el, depth, sway, phase: i * 1.7, base: (i * 95) % 650 };
    });

    scene4.appendChild(layer);
    scenes.push({ el: scene4, items });
    });

    if (!scenes.length) return;

    let ticking = false;
    function update() {
      ticking = false;
      const scrollPos = scroller ? scroller.scrollTop : (window.pageYOffset || document.documentElement.scrollTop || 0);
      for (const sc of scenes) {
      const sceneTop = sc.el.offsetTop;
      const y = scrollPos - sceneTop;
      const totalH = sc.el.offsetHeight || 1200;
      const span = totalH + 400;

      for (const it of sc.items) {
        let ty = (it.base + y * it.depth) % span;
        if (ty < 0) ty += span;
        const t  = scrollPos * 0.006 + it.phase;
        const dx = Math.sin(t) * (8 + it.depth * 16);
        const rot = Math.sin(t * 0.85) * (2 + it.depth * 5);
        it.el.style.setProperty("--y", (ty - 120) + "px");
        it.el.style.setProperty("--x", dx.toFixed(2) + "px");
        it.el.style.setProperty("--rot", rot.toFixed(2) + "deg");
      }
      }
    }

    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }

    if (scroller) scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  })();
})();
