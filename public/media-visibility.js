/* Shared by React invitations and standalone template documents. */
(() => {
  'use strict';
  if (window.__invitationMediaVisibility) return;
  window.__invitationMediaVisibility = true;

  const tracked = new Set();
  const resumeWhenVisible = new Map();
  let pageAway = false;
  let frozen = false;
  let pageBlurred = false;
  const suspended = () => document.hidden || pageAway || frozen || pageBlurred;
  const source = media => media.currentSrc || media.src;
  // Muted decorative videos may continue; only media capable of playing sound is paused.
  const hasSound = media => media instanceof HTMLAudioElement || !media.muted;

  function remember(node) {
    if (node instanceof HTMLMediaElement) tracked.add(node);
    if (node instanceof Element) node.querySelectorAll('audio, video').forEach(media => tracked.add(media));
  }
  function pruneRemovedMedia() {
    tracked.forEach(media => {
      if (media.isConnected) return;
      resumeWhenVisible.delete(media);
      media.pause();
      tracked.delete(media);
    });
  }
  function suspend() {
    document.querySelectorAll('audio, video').forEach(media => tracked.add(media));
    pruneRemovedMedia();
    tracked.forEach(media => {
      if (hasSound(media) && !media.paused && !media.ended) {
        resumeWhenVisible.set(media, source(media));
        media.pause();
      }
    });
  }
  function resume() {
    if (suspended()) return;
    pruneRemovedMedia();
    const pending = [...resumeWhenVisible];
    resumeWhenVisible.clear();
    pending.forEach(([media, previousSource]) => {
      if (!media.isConnected || media.ended || source(media) !== previousSource) return;
      // An intro may have finished or been dismissed while the app was hidden.
      if (media instanceof HTMLVideoElement && (media.closest('[hidden]') || !media.getClientRects().length)) return;
      if (!media.paused) return;
      // Resume from the existing currentTime; never restart or unmute a track.
      // If the browser requires a fresh gesture, the existing music button still works.
      media.play().catch(() => {});
    });
  }
  function sync() {
    if (suspended()) suspend();
    else resume();
  }

  function setPageFocus(blurred) {
    pageBlurred = blurred;
    sync();
    // The public invitation and dashboard previews live in nested frames.
    // Deliver the pause synchronously, without a timer or postMessage delay.
    document.querySelectorAll('iframe').forEach(frame => {
      try {
        const child = frame.contentWindow;
        if (child) child.dispatchEvent(new child.CustomEvent('invitation-page-focus', { detail: blurred }));
      } catch { /* External embeds manage their own playback. */ }
    });
  }
  function syncPageFocus() {
    let root = window;
    try { if (window.top.document) root = window.top; } catch { /* Cross-origin host. */ }
    // Focusing an input or moving into a preview iframe keeps the top document
    // focused. Only losing focus outside the whole page should suspend music.
    root.dispatchEvent(new root.CustomEvent('invitation-page-focus', { detail: !root.document.hasFocus() }));
  }
  window.addEventListener('invitation-page-focus', event => {
    if (typeof event.detail === 'boolean') setPageFocus(event.detail);
  });
  window.addEventListener('blur', syncPageFocus);
  window.addEventListener('focus', syncPageFocus);

  // Capture catches non-bubbling events from all current and future media elements.
  document.addEventListener('play', event => {
    const media = event.target;
    if (!(media instanceof HTMLMediaElement)) return;
    tracked.add(media);
    // Block delayed autoplay attempts in the background without scheduling new music.
    if (suspended() && hasSound(media)) media.pause();
  }, true);
  document.addEventListener('volumechange', event => {
    const media = event.target;
    if (media instanceof HTMLMediaElement && suspended() && hasSound(media)) media.pause();
  }, true);
  document.addEventListener('visibilitychange', () => {
    // Some mobile browsers restore visibility without sending a focus event.
    if (!document.hidden) pageBlurred = false;
    sync();
  });
  window.addEventListener('pagehide', () => { pageAway = true; suspend(); });
  window.addEventListener('pageshow', () => { pageAway = false; pageBlurred = false; sync(); });
  document.addEventListener('freeze', () => { frozen = true; suspend(); });
  document.addEventListener('resume', () => { frozen = false; sync(); });

  // React route changes and template switches must not leave detached audio playing.
  const observer = new MutationObserver(records => {
    records.forEach(record => record.addedNodes.forEach(remember));
    pruneRemovedMedia();
    if (suspended()) suspend();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  remember(document.documentElement);
  sync();
})();
