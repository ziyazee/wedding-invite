(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const opening = document.querySelector('#opening');
  const video = opening.querySelector('video');
  const openButton = document.querySelector('#open-invitation');
  const music = document.querySelector('#music-track');
  const musicButton = document.querySelector('#music');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let opened = false;
  let revealTimer;
  video.muted = true;
  video.pause();
  document.body.style.overflow = 'hidden';

  function updateMusic() {
    const playing = !music.paused;
    musicButton.setAttribute('aria-label', playing ? 'Mute music' : 'Play music');
    musicButton.setAttribute('aria-pressed', String(playing));
    document.querySelector('#sound-waves').style.opacity = playing ? '1' : '.25';
  }
  music.addEventListener('play', updateMusic);
  music.addEventListener('pause', updateMusic);
  music.volume = .45;
  musicButton.addEventListener('click', () => {
    if (music.paused) music.play().catch(updateMusic);
    else music.pause();
  });
  function revealNames() { opening.classList.add('revealed'); }
  function finishVideo() {
    clearTimeout(revealTimer);
    video.pause();
    video.poster = '/design5/assets/opened.jpg';
    video.style.background = 'url(/design5/assets/opened.jpg) center / cover';
    revealNames();
  }
  function openInvitation() {
    if (opened) return;
    opened = true;
    opening.classList.add('opened');
    document.body.style.overflow = '';
    openButton.tabIndex = -1;
    musicButton.hidden = false;
    music.play().catch(updateMusic);
    if (reducedMotion) {
      video.removeAttribute('src');
      video.load();
      finishVideo();
      return;
    }
    video.currentTime = 0;
    video.play().catch(finishVideo);
    revealTimer = window.setTimeout(revealNames, 4000);
  }
  opening.addEventListener('click', openInvitation);
  video.addEventListener('ended', revealNames);
  video.addEventListener('error', () => { if (opened) finishVideo(); });

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }, { threshold: .08 });
  document.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));

  const countdown = document.querySelector('#countdown');
  countdown.classList.add('sg-clock-countdown');
  countdown.innerHTML = `
    <p class="sg-clock-heading">Until our forever</p>
    <div class="sg-clock-face">
      <img class="sg-clock-art" src="/design5/assets/pearl-clock.png" alt="" decoding="async">
      <svg class="sg-clock-dial" viewBox="0 0 300 300" aria-hidden="true">
        <path class="sg-clock-sector"></path>
        <path class="sg-clock-hand" d="M150 83V30"></path>
      </svg>
      <div class="sg-clock-value"><span class="sg-clock-days">0</span><span class="sg-clock-unit">Days</span></div>
    </div>
    <p class="sg-clock-time" role="timer" aria-live="off"><span data-clock-hours>0</span> hours, <span data-clock-minutes>0</span> min and <span data-clock-seconds>0</span> sec</p>`;
  const days = countdown.querySelector('.sg-clock-days');
  const hours = countdown.querySelector('[data-clock-hours]');
  const minutes = countdown.querySelector('[data-clock-minutes]');
  const seconds = countdown.querySelector('[data-clock-seconds]');
  const sector = countdown.querySelector('.sg-clock-sector');
  const hand = countdown.querySelector('.sg-clock-hand');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fallbackDate = new Date('2026-10-03T17:00:00+02:00').getTime();
  let targetDate = fallbackDate;
  let clockVisible = false;
  let clockFrame = 0;
  const remainingTime = () => Math.max(0, targetDate - Date.now());
  function drawClock(remaining) {
    // The seconds remaining decrease, so the hand sweeps counterclockwise.
    const turn = (remaining % 60000) / 60000;
    const angle = turn * Math.PI * 2;
    const x = 150 + 120 * Math.sin(angle);
    const y = 150 - 120 * Math.cos(angle);
    sector.setAttribute('d', turn ? `M150 150 L150 30 A120 120 0 ${turn > .5 ? 1 : 0} 1 ${x} ${y} Z` : '');
    hand.setAttribute('transform', `rotate(${turn * 360} 150 150)`);
  }
  function updateClock() {
    const remaining = remainingTime();
    const totalSeconds = Math.ceil(remaining / 1000);
    days.textContent = String(Math.floor(totalSeconds / 86400));
    hours.textContent = String(Math.floor(totalSeconds / 3600) % 24);
    minutes.textContent = String(Math.floor(totalSeconds / 60) % 60);
    seconds.textContent = String(totalSeconds % 60);
    countdown.querySelector('.sg-clock-unit').textContent = Math.floor(totalSeconds / 86400) === 1 ? 'Day' : 'Days';
    drawClock(remaining);
  }
  function animateClock() {
    clockFrame = 0;
    const remaining = remainingTime();
    drawClock(remaining);
    if (remaining > 0 && clockVisible && !document.hidden && !motionPreference.matches) {
      clockFrame = window.requestAnimationFrame(animateClock);
    }
  }
  function resumeClock() {
    window.cancelAnimationFrame(clockFrame);
    clockFrame = 0;
    updateClock();
    if (clockVisible && !document.hidden && !motionPreference.matches) animateClock();
  }
  function readClockDate() {
    const selectedDate = Date.parse(countdown.dataset.weddingInstant || '');
    targetDate = Number.isFinite(selectedDate) ? selectedDate : fallbackDate;
    resumeClock();
  }
  new IntersectionObserver(entries => {
    clockVisible = entries[0].isIntersecting;
    resumeClock();
  }).observe(countdown);
  document.addEventListener('visibilitychange', resumeClock);
  motionPreference.addEventListener('change', resumeClock);
  window.addEventListener('invitation-preview-updated', readClockDate);
  readClockDate();
  window.setInterval(updateClock, 1000);

  const calendarButton = [...document.querySelectorAll('button')].find(button => button.textContent.trim() === 'Calendar' && !button.hasAttribute('data-wedding-calendar'));
  calendarButton?.addEventListener('click', () => {
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const content = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding Invite//Secret Garden//EN', 'BEGIN:VEVENT', 'UID:clara-nour-20261003@wedding-invite', `DTSTAMP:${stamp}`, 'DTSTART:20261003T131500Z', 'DTEND:20261003T210000Z', 'SUMMARY:Clara & Nour — Wedding', 'LOCATION:Mairie de Vauréal\\, Vauréal\\, France', 'END:VEVENT', 'END:VCALENDAR', ''].join('\r\n');
    const url = URL.createObjectURL(new Blob([content], { type: 'text/calendar;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'clara-and-nour-wedding.ics';
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

})();
