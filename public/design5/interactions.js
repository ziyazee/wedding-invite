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

  const calendarButton = [...document.querySelectorAll('button')].find(button => button.textContent.trim() === 'Calendar');
  calendarButton.addEventListener('click', () => {
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

  const rsvp = document.querySelector('#rsvp');
  const rsvpButton = rsvp.querySelector('button');
  rsvpButton.setAttribute('aria-expanded', 'false');
  rsvpButton.setAttribute('aria-controls', 'rsvp-form');
  const form = document.createElement('form');
  form.id = 'rsvp-form';
  form.hidden = true;
  form.innerHTML = `<fieldset><legend>Will you attend?</legend><div class="sg-radio-row"><label><input type="radio" name="attendance" value="yes" checked> Yes, I'll be there</label><label><input type="radio" name="attendance" value="no"> Sorry, I can't</label></div></fieldset>
    <div><label for="guest-name">Full name</label><input id="guest-name" name="name" autocomplete="name" required maxlength="100" placeholder="Your name"></div>
    <div id="guest-count"><label for="guests">Number of guests</label><input id="guests" name="guests" type="number" min="1" max="10" step="1" value="1" required></div>
    <div><label for="guest-message">Message (optional)</label><textarea id="guest-message" name="message" rows="3" maxlength="500"></textarea></div>
    <p class="sg-note">Demo RSVP: your response is saved on this device only and is not sent to the couple.</p>
    <button class="sg-submit" type="submit">Save RSVP</button><p id="rsvp-status" role="status" aria-live="polite"></p>`;
  rsvp.querySelector(':scope > div').append(form);
  const storageKey = 'secret-garden-rsvp-v1';
  const guestCount = form.querySelector('#guests');
  const nameField = form.querySelector('#guest-name');
  const messageField = form.querySelector('#guest-message');
  const status = form.querySelector('#rsvp-status');
  const attendanceChanged = () => {
    const attending = form.elements.attendance.value === 'yes';
    form.querySelector('#guest-count').hidden = !attending;
    guestCount.disabled = !attending;
  };
  form.addEventListener('change', attendanceChanged);
  nameField.addEventListener('input', () => nameField.setCustomValidity(''));
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (saved && typeof saved.name === 'string') {
      nameField.value = saved.name.slice(0, 100);
      messageField.value = typeof saved.message === 'string' ? saved.message.slice(0, 500) : '';
      guestCount.value = String(Math.min(10, Math.max(1, Number(saved.guests) || 1)));
      form.elements.attendance.value = saved.attendance === 'no' ? 'no' : 'yes';
      attendanceChanged();
    }
  } catch { /* The form remains usable if browser storage is unavailable. */ }
  rsvpButton.addEventListener('click', () => {
    rsvp.classList.add('envelope-open');
    rsvpButton.setAttribute('aria-expanded', 'true');
    window.setTimeout(() => {
      rsvpButton.parentElement.hidden = true;
      form.hidden = false;
      form.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      nameField.focus({ preventScroll: true });
    }, reducedMotion ? 0 : 600);
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!nameField.value.trim()) {
      nameField.setCustomValidity('Please enter your name.');
      nameField.reportValidity();
      return;
    }
    if (!form.reportValidity()) return;
    const response = {
      name: nameField.value.trim(),
      attendance: form.elements.attendance.value,
      guests: guestCount.disabled ? 0 : Number(guestCount.value),
      message: messageField.value.trim(),
      savedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(storageKey, JSON.stringify(response));
      status.textContent = 'Thank you! Your RSVP is saved on this device. You can update it here anytime.';
      form.querySelector('[type="submit"]').textContent = 'Update RSVP';
    } catch {
      status.textContent = 'Your browser could not save this response. Please enable browser storage and try again.';
    }
  });
})();
