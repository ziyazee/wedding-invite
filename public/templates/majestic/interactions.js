(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const opening = document.querySelector('#opening');
  const intro = opening?.querySelector('video');
  const skipIntro = !opening || new URLSearchParams(location.search).has('skipIntro');
  const hero = document.querySelector('main video');
  const music = document.querySelector('#music-track');
  const musicToggle = document.querySelector('#music-toggle');
  const openButton = document.querySelector('#open-invitation');
  let started = false;
  let finished = false;
  let fallbackTimer;
  if (intro) intro.muted = true;
  hero.muted = true;
  hero.autoplay = true;
  hero.play().catch(() => {});
  music.volume = .4;
  document.body.style.overflow = skipIntro ? '' : 'hidden';
  if (skipIntro) {
    finished = true;
    if (opening) opening.hidden = true;
    document.querySelectorAll('main > section:first-child [data-reveal]').forEach(el => el.classList.add('visible'));
  }
  const updateMusic = () => {
    musicToggle.setAttribute('aria-label', music.paused ? 'Play music' : 'Mute music');
    musicToggle.setAttribute('aria-pressed', String(!music.paused));
  };
  music.addEventListener('play', updateMusic);
  music.addEventListener('pause', updateMusic);
  musicToggle.addEventListener('click', () => {
    if (music.paused) music.play().catch(updateMusic);
    else music.pause();
  });
  function finishOpening() {
    if (finished) return;
    finished = true;
    clearTimeout(fallbackTimer);
    intro?.pause();
    opening?.classList.add('finished');
    document.body.style.overflow = '';
    document.querySelectorAll('main > section:first-child [data-reveal]').forEach(el => el.classList.add('visible'));
    if (!reducedMotion) hero.play().catch(() => {});
    setTimeout(() => {
      if (opening) opening.hidden = true;
      const heading = document.querySelector('h1');
      if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
    }, reducedMotion ? 0 : 1000);
  }
  function startOpening() {
    if (started || !opening) return;
    started = true;
    musicToggle.hidden = false;
    music.play().catch(updateMusic);
    if (reducedMotion) { finishOpening(); return; }
    openButton.textContent = 'Opening…';
    intro.play().then(() => opening.classList.add('playing')).catch(finishOpening);
    fallbackTimer = setTimeout(finishOpening, 18000);
  }
  opening?.addEventListener('click', startOpening);
  intro?.addEventListener('ended', finishOpening);
  intro?.addEventListener('error', () => { if (started) finishOpening(); });
  const reveals = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      reveals.unobserve(entry.target);
    });
  }, { threshold: .08 });
  document.querySelectorAll('main [data-reveal]').forEach(el => {
    if (!el.closest('main > section:first-child')) reveals.observe(el);
  });
  const backgroundVisibility = new IntersectionObserver(entries => {
    if (!finished || reducedMotion) return;
    if (entries[0].isIntersecting) hero.play().catch(() => {});
    else hero.pause();
  });
  backgroundVisibility.observe(hero);
  const countdown = document.querySelectorAll('#countdown .grid > div > span:first-child');
  function updateCountdown() {
    let remaining = Math.max(0, Math.floor((new Date('2027-09-18T17:00:00+02:00').getTime() - Date.now()) / 1000));
    [86400, 3600, 60, 1].forEach((unit, index) => {
      countdown[index].textContent = String(Math.floor(remaining / unit)).padStart(2, '0');
      remaining %= unit;
    });
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  const buttons = [...document.querySelectorAll('main button')];
  buttons.find(button => button.textContent.trim() === 'Calendar' && !button.hasAttribute('data-wedding-calendar'))?.addEventListener('click', () => {
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const event = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Wedding Invite//Majestic//EN','BEGIN:VEVENT','UID:elisa-jhon-20270918@wedding-invite',`DTSTAMP:${stamp}`,'DTSTART:20270918T150000Z','DTEND:20270919T000000Z','SUMMARY:Elisa & Jhon — Wedding','LOCATION:Villa Montalcino\\, Italy','END:VEVENT','END:VCALENDAR',''].join('\r\n');
    const url = URL.createObjectURL(new Blob([event], { type: 'text/calendar;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url; link.download = 'elisa-jhon-wedding.ics';
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
})();
