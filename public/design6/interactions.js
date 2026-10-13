(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero = document.querySelector('main video');
  const music = document.querySelector('#music-track');
  const musicToggle = document.querySelector('#music-toggle');
  const finished = true;
  hero.muted = true;
  music.volume = .4;
  musicToggle.hidden = false;
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
  updateMusic();
  document.querySelectorAll('main > section:first-child [data-reveal]').forEach(el => el.classList.add('visible'));
  if (!reducedMotion) hero.play().catch(() => {});
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
  buttons.find(button => button.textContent.trim() === 'Calendar').addEventListener('click', () => {
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const event = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Wedding Invite//Majestic//EN','BEGIN:VEVENT','UID:elisa-jhon-20270918@wedding-invite',`DTSTAMP:${stamp}`,'DTSTART:20270918T150000Z','DTEND:20270919T000000Z','SUMMARY:Elisa & Jhon — Wedding','LOCATION:Villa Montalcino\\, Italy','END:VEVENT','END:VCALENDAR',''].join('\r\n');
    const url = URL.createObjectURL(new Blob([event], { type: 'text/calendar;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url; link.download = 'elisa-jhon-wedding.ics';
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  const gifts = buttons.filter(button => /^(Card|Bank Transfer)/.test(button.textContent.trim()));
  gifts.forEach((button, index) => {
    const panel = document.createElement('div');
    panel.id = `gift-panel-${index}`;
    panel.className = 'gift-panel'; panel.hidden = true;
    panel.textContent = index === 0 ? 'If you prefer, you can hand us a card or envelope in person.' : 'Bank transfer details will be shared by the couple. Please contact them directly if you would like to contribute.';
    button.type = 'button';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', panel.id);
    button.parentElement.append(panel);
    button.addEventListener('click', () => {
      const show = panel.hidden;
      gifts.forEach(other => {
        other.setAttribute('aria-expanded', 'false');
        other.parentElement.querySelector('.gift-panel').hidden = true;
      });
      panel.hidden = !show;
      button.setAttribute('aria-expanded', String(show));
    });
  });

  const form = document.querySelector('#rsvp-form');
  const companions = document.querySelector('#companions');
  const status = document.querySelector('#rsvp-status');
  let companionId = 0;
  function addCompanion(type, saved = {}) {
    if (companions.children.length >= 10) return;
    const id = ++companionId;
    const card = document.createElement('div'); card.className = 'companion-card'; card.dataset.type = type;
    card.innerHTML = `<header><strong>${type}</strong><button type="button" class="remove-companion" aria-label="Remove ${type.toLowerCase()}">Remove</button></header><label for="companion-${id}">Full name *<input id="companion-${id}" data-field="name" maxlength="100" required placeholder="Full name"></label><label for="companion-allergy-${id}">Allergies or dietary requirements<input id="companion-allergy-${id}" data-field="allergies" maxlength="300" placeholder="Any allergies or dietary needs"></label>`;
    card.querySelector('[data-field="name"]').value = typeof saved.name === 'string' ? saved.name.slice(0, 100) : '';
    card.querySelector('[data-field="allergies"]').value = typeof saved.allergies === 'string' ? saved.allergies.slice(0, 300) : '';
    card.querySelector('button').addEventListener('click', () => {
      card.remove();
      form.querySelectorAll('[data-add]').forEach(button => button.disabled = false);
    });
    companions.append(card);
    form.querySelectorAll('[data-add]').forEach(button => button.disabled = companions.children.length >= 10);
  }
  form.querySelectorAll('[data-add]').forEach(button => button.addEventListener('click', () => {
    addCompanion(button.dataset.add);
    companions.lastElementChild?.querySelector('input').focus();
  }));
  function updateAttendance() {
    const attending = form.elements.attendance.value === 'yes';
    form.querySelectorAll('[data-attending]').forEach(group => {
      group.hidden = !attending;
      group.querySelectorAll('input, button').forEach(input => input.disabled = !attending);
    });
  }
  form.querySelectorAll('[name="attendance"]').forEach(input => input.addEventListener('change', updateAttendance));
  const storageKey = 'majestic-rsvp-v1';
  const fieldNames = ['name','phone','allergies','accommodation','song','message'];
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (saved && typeof saved === 'object') {
      fieldNames.forEach(name => { if (typeof saved[name] === 'string') form.elements[name].value = saved[name].slice(0, form.elements[name].maxLength); });
      form.elements.attendance.value = saved.attendance === 'no' ? 'no' : 'yes';
      form.elements.transport.checked = saved.transport === true;
      if (Array.isArray(saved.companions)) saved.companions.slice(0,10).forEach(companion => {
        if (companion && typeof companion === 'object') addCompanion(companion.type === 'Child' ? 'Child' : 'Adult', companion);
      });
      updateAttendance();
    }
  } catch { /* Storage is optional; the form remains available. */ }
  form.addEventListener('input', event => { if (event.target.setCustomValidity) event.target.setCustomValidity(''); });
  form.addEventListener('submit', event => {
    event.preventDefault();
    for (const input of form.querySelectorAll('input[required]:not(:disabled)')) {
      if (!input.value.trim()) { input.setCustomValidity('Please fill out this field.'); input.reportValidity(); return; }
    }
    if (!form.reportValidity()) return;
    const attending = form.elements.attendance.value === 'yes';
    const response = Object.fromEntries(fieldNames.map(name => [name, form.elements[name].disabled ? '' : form.elements[name].value.trim()]));
    Object.assign(response, {
      attendance: attending ? 'yes' : 'no', transport: attending && form.elements.transport.checked,
      companions: attending ? [...companions.children].map(card => ({ type: card.dataset.type, name: card.querySelector('[data-field="name"]').value.trim(), allergies: card.querySelector('[data-field="allergies"]').value.trim() })) : [],
      savedAt: new Date().toISOString(),
    });
    try {
      localStorage.setItem(storageKey, JSON.stringify(response));
      status.textContent = 'Thank you! Your RSVP is saved on this device. You can update it here anytime.';
      form.querySelector('[type="submit"]').textContent = 'Update RSVP';
    } catch { status.textContent = 'Your browser could not save this response. Enable browser storage and try again.'; }
  });
})();
