(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const video = document.querySelector('#opening video');
  const cover = document.getElementById('intro-cover');
  const names = document.querySelectorAll('.opening-name');
  const openingDate = names[1];
  if (openingDate && !openingDate.hasAttribute('data-personalized-date')) {
    openingDate.innerHTML = '<span>27</span><span>SEP</span><span>2026</span>';
    openingDate.setAttribute('aria-label', '27 September 2026');
    openingDate.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:.12em;margin-top:.75rem;color:#7c9658;font-family:var(--font-display);font-size:clamp(.85rem,2.4vw,1.05rem);font-weight:700;letter-spacing:.42em;line-height:1.15;padding-left:.42em';
  }
  const templateDate = [...document.querySelectorAll('#wedding-events p')].find(el => /12 June 2027/i.test(el.textContent || ''));
  if (templateDate) {
    templateDate.innerHTML = '<span>27</span><span>SEP</span><span>2026</span>';
    templateDate.setAttribute('aria-label', '27 September 2026');
    templateDate.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:.12em;color:#7c9658;font-family:var(--font-display);font-size:clamp(.85rem,2.4vw,1.05rem);font-weight:700;letter-spacing:.42em;line-height:1.15;padding-left:.42em';
  }
  let opened = false;
  let completed = false;
  let openingTimeout;
  document.body.style.overflow = 'hidden';
  history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  function showNames() { names.forEach(el => el.classList.add('visible')); }
  function finishOpening() {
    if (completed) return;
    completed = true;
    clearTimeout(openingTimeout);
    cover.remove();
    document.body.style.overflow = '';
    showNames();
  }
  function openInvitation() {
    if (opened) return;
    opened = true;
    cover.classList.add('opening');
    video.classList.remove('opacity-0');
    video.classList.add('opacity-100');
    openingTimeout = window.setTimeout(finishOpening, 22000);
    if (reducedMotion.matches && Number.isFinite(video.duration)) {
      video.currentTime = Math.max(0, video.duration - .05);
      finishOpening();
    } else {
      video.play().catch(() => { video.classList.add('video-unavailable'); finishOpening(); });
    }
  }
  cover.addEventListener('click', openInvitation);
  cover.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openInvitation(); }
  });
  video.addEventListener('timeupdate', () => {
    if (video.duration > 3 && video.currentTime >= video.duration - 3) showNames();
  });
  video.addEventListener('ended', finishOpening);
  video.addEventListener('error', () => {
    video.classList.add('video-unavailable');
    if (opened) finishOpening();
  });

  // Reference countdown shows three medallions, without seconds.
  function updateCountdown() {
    const difference = Math.max(0, new Date('2027-06-12T17:00:00+02:00').getTime() - Date.now());
    const values = [Math.floor(difference / 86400000), Math.floor(difference / 3600000) % 24, Math.floor(difference / 60000) % 60];
    document.querySelectorAll('[data-countdown]').forEach(el => { el.textContent = String(values[Number(el.dataset.countdown)]).padStart(2, '0'); });
  }
  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
  }), { threshold: 0.04 });
  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));

  const pearl = document.getElementById('timeline-pearl');
  const track = document.getElementById('timeline-track');
  let pendingFrame = false;
  function updatePearl() {
    pendingFrame = false;
    const rect = track.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (innerHeight * .7 - rect.top) / (rect.height + innerHeight * .1)));
    pearl.style.top = `${progress * 100}%`;
  }
  window.addEventListener('scroll', () => {
    if (!pendingFrame) { pendingFrame = true; requestAnimationFrame(updatePearl); }
  }, { passive: true });
  updatePearl();

  const events = {
    'wedding-events': { title: 'Camille & Antoine – Wedding', location: 'Château de Belvent, 12 Route des Vignes, 21220 Gevrey-Chambertin, France', start: '20270612T150000Z', end: '20270612T210000Z' },
  };
  document.querySelector('.lucide-map-pin')?.closest('button')?.setAttribute('data-maps', 'wedding-events');
  document.querySelector('.lucide-calendar')?.closest('button')?.setAttribute('data-calendar', 'wedding-events');
  document.querySelectorAll('[data-maps]').forEach(button => button.addEventListener('click', () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(events[button.dataset.maps].location)}`, '_blank', 'noopener,noreferrer');
  }));
  let activeMenu;
  function closeMenu() {
    if (!activeMenu) return;
    activeMenu.button.setAttribute('aria-expanded', 'false'); activeMenu.menu.remove(); activeMenu = undefined;
  }
  function escapeIcs(text) { return text.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;'); }
  function downloadCalendar(event) {
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Embroidered Garden//Wedding//EN', 'BEGIN:VEVENT', `UID:${event.start}@embroidered-garden.local`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`, `DTSTART:${event.start}`, `DTEND:${event.end}`, `SUMMARY:${escapeIcs(event.title)}`, `LOCATION:${escapeIcs(event.location)}`, 'END:VEVENT', 'END:VCALENDAR'];
    const url = URL.createObjectURL(new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/calendar;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'wedding.ics'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  document.querySelectorAll('[data-calendar]').forEach(button => button.addEventListener('click', e => {
    e.stopPropagation();
    const wasOpen = activeMenu?.button === button;
    closeMenu(); if (wasOpen) return;
    const event = events[button.dataset.calendar];
    const menu = document.createElement('div'); menu.className = 'calendar-menu'; menu.setAttribute('role', 'menu');
    for (const label of ['Google Calendar', 'Apple Calendar']) {
      const option = document.createElement('button'); option.type = 'button'; option.setAttribute('role', 'menuitem'); option.textContent = label;
      option.addEventListener('click', () => {
        if (label === 'Google Calendar') {
          const query = new URLSearchParams({ action: 'TEMPLATE', text: event.title, dates: `${event.start}/${event.end}`, location: event.location });
          window.open(`https://calendar.google.com/calendar/render?${query}`, '_blank', 'noopener,noreferrer');
        } else downloadCalendar(event);
        closeMenu(); button.focus();
      }); menu.append(option);
    }
    document.body.append(menu);
    const rect = button.getBoundingClientRect();
    menu.style.left = `${Math.max(8, Math.min(innerWidth - 200, rect.left))}px`;
    menu.style.top = `${rect.bottom + scrollY + 6}px`;
    activeMenu = { menu, button }; button.setAttribute('aria-expanded', 'true'); menu.firstElementChild.focus();
  }));
  document.addEventListener('click', closeMenu);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && activeMenu) { const button = activeMenu.button; closeMenu(); button.focus(); } });

  const musicTrack = document.getElementById('music-track');
  const musicBtn = document.getElementById('music-btn');
  if (musicTrack && musicBtn) {
    musicTrack.volume = 0.45;
    function updateMusicBtn() {
      const playing = !musicTrack.paused;
      musicBtn.setAttribute('aria-label', playing ? 'Mute music' : 'Play music');
      musicBtn.setAttribute('aria-pressed', String(playing));
      document.getElementById('eg-sound-waves').style.opacity = playing ? '1' : '.25';
    }
    musicTrack.addEventListener('play', updateMusicBtn);
    musicTrack.addEventListener('pause', updateMusicBtn);
    musicBtn.addEventListener('click', () => { if (musicTrack.paused) musicTrack.play().catch(updateMusicBtn); else musicTrack.pause(); });
    cover.addEventListener('click', () => { musicBtn.hidden = false; musicTrack.play().catch(updateMusicBtn); }, { once: true });
  }

})();
