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

  const days = document.querySelector('#countdown .leading-none');
  const updateDays = () => {
    days.textContent = String(Math.max(0, Math.floor((new Date('2026-10-03T17:00:00+02:00').getTime() - Date.now()) / 86400000)));
  };
  updateDays();
  window.setInterval(updateDays, 60000);

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
