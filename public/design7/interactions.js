(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const opening = document.querySelector('#opening');
  const [first] = opening.querySelectorAll('video');
  const music = document.querySelector('#music-track');
  const musicButton = document.querySelector('#music-toggle');
  let started = false, finished = false, fallback;
  first.muted = true;
  music.volume = .4;
  document.body.style.overflow = 'hidden';
  const syncMusic = () => {
    musicButton.setAttribute('aria-label', music.paused ? 'Play music' : 'Mute music');
    musicButton.setAttribute('aria-pressed', String(!music.paused));
  };
  music.addEventListener('play', syncMusic);
  music.addEventListener('pause', syncMusic);
  musicButton.addEventListener('click', () => {
    if (music.paused) music.play().catch(syncMusic);
    else music.pause();
  });
  function finish() {
    if (finished) return;
    finished = true;
    clearTimeout(fallback);
    document.body.style.overflow = '';
    opening.classList.add('finished');
    setTimeout(() => {
      first.pause(); opening.hidden = true;
      // Do not move focus back to the opening after the guest has scrolled away.
      if (window.scrollY < 1 && (document.activeElement === document.body || document.activeElement === document.querySelector('#open-invitation'))) {
        const heading = document.querySelector('h1'); heading.tabIndex = -1; heading.focus({ preventScroll: true });
      }
    }, reduced ? 0 : 850);
  }
  opening.addEventListener('click', () => {
    if (started) return;
    started = true; musicButton.hidden = false;
    document.body.style.overflow = '';
    opening.classList.add('started');
    const openButton = document.querySelector('#open-invitation');
    openButton.hidden = true;
    openButton.tabIndex = -1;
    music.play().catch(syncMusic);
    if (reduced) { finish(); return; }
    document.querySelector('#open-invitation').textContent = 'Opening…';
    first.play().then(() => opening.classList.add('stage-one')).catch(finish);
    fallback = setTimeout(finish, 25000);
  });
  first.addEventListener('ended', finish);
  first.addEventListener('error', () => { if (started) finish(); });

  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: .08 });
  document.querySelectorAll('main [data-reveal]').forEach(el => observer.observe(el));
  document.querySelector('#hero button').addEventListener('click', () => document.querySelector('#countdown').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }));
  const numbers = document.querySelectorAll('#countdown .leading-none');
  function countdown() {
    let left = Math.max(0, Math.floor((new Date('2026-09-27T17:30:00+02:00').getTime() - Date.now()) / 1000));
    [86400,3600,60].forEach((unit,index) => { numbers[index].textContent = String(Math.floor(left / unit)).padStart(2,'0'); left %= unit; });
  }
  countdown(); setInterval(countdown, 30000);
  const buttons = [...document.querySelectorAll('main button')];
  const venues = ['Hotel du Cap-Eden-Roc, Boulevard J. F. Kennedy, Antibes, France', 'Restaurant César, Plage Keller, Chemin de la Garoupe, Antibes, France'];
  buttons.filter(button => button.textContent.trim() === 'Open in Maps').forEach((button,index) => {
    button.addEventListener('click', () => window.open('https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(venues[index]), '_blank', 'noopener,noreferrer'));
  });
  buttons.filter(button => button.textContent.trim() === 'Add to Calendar').forEach((button,index) => {
    button.addEventListener('click', () => {
      const event = index === 0 ? { title: 'Martina & Javier — Wedding', start: '20260927T153000Z', end: '20260927T233000Z' } : { title: 'Martina & Javier — Welcome Evening', start: '20260926T153000Z', end: '20260926T183000Z' };
      const stamp = new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
      const content = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Wedding Invite//Bloom//EN','BEGIN:VEVENT',`UID:bloom-${index}-20260927@wedding-invite`,`DTSTAMP:${stamp}`,`DTSTART:${event.start}`,`DTEND:${event.end}`,`SUMMARY:${event.title}`,`LOCATION:${venues[index].replace(/,/g,'\\,')}`,'END:VEVENT','END:VCALENDAR',''].join('\r\n');
      const url = URL.createObjectURL(new Blob([content],{type:'text/calendar;charset=utf-8'}));
      const link = document.createElement('a'); link.href=url; link.download=index === 0 ? 'bloom-wedding.ics' : 'bloom-welcome-evening.ics';
      document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url),1000);
    });
  });
  const storyButton = document.querySelector('[aria-controls="our-story-content"]');
  const story = document.querySelector('#our-story-content');
  if (storyButton && story) {
    storyButton.addEventListener('click', () => {
      story.hidden = !story.hidden;
      storyButton.setAttribute('aria-expanded', String(!story.hidden));
      storyButton.textContent = story.hidden ? 'Our Story' : 'Hide Story';
    });
  }
  const gallery = document.querySelector('#our-story .animate-marquee');
  if (gallery) {
    const track = gallery.parentElement;
    const controls = document.createElement('div'); controls.className='gallery-controls';
    const pause = document.createElement('button'); pause.type='button'; controls.append(pause); track.after(controls);
    let paused = reduced;
    function updateGallery() {
      gallery.style.animationPlayState = paused ? 'paused' : 'running';
      pause.textContent = paused ? 'Play gallery' : 'Pause gallery';
      pause.setAttribute('aria-pressed', String(paused));
    }
    pause.addEventListener('click', () => { paused = !paused; updateGallery(); }); updateGallery();
    track.tabIndex=0; track.setAttribute('aria-label','Photo gallery. Scroll horizontally to browse.');
    track.addEventListener('mouseenter', () => gallery.style.animationPlayState='paused');
    track.addEventListener('mouseleave', updateGallery);
    track.addEventListener('touchstart', () => { paused=true; updateGallery(); },{passive:true});
    let drag;
    track.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'mouse') return;
      paused=true; updateGallery(); drag={x:event.clientX,scroll:track.scrollLeft}; track.setPointerCapture(event.pointerId);
    });
    track.addEventListener('pointermove', event => { if(drag) track.scrollLeft=drag.scroll+drag.x-event.clientX; });
    track.addEventListener('pointerup', () => drag=null);
    track.addEventListener('pointercancel', () => drag=null);
  }

  const form=document.querySelector('#rsvp-form');
  const names=document.querySelector('#guest-names');
  const countOutput=document.querySelector('#guest-count');
  const minus=document.querySelector('#minus'), plus=document.querySelector('#plus');
  const status=document.querySelector('#rsvp-status');
  if (!form || !names || !countOutput || !minus || !plus || !status) return;
  let count=1;
  function renderGuests(values) {
    const previous=values || [...names.querySelectorAll('input')].map(input=>input.value);
    names.replaceChildren(); countOutput.value=String(count); countOutput.textContent=String(count);
    minus.disabled=count<=1; plus.disabled=count>=10;
    for(let i=2;i<=count;i++) {
      const row=document.createElement('div'); const label=document.createElement('label'); const input=document.createElement('input');
      input.id=`additional-guest-${i}`; input.required=true; input.maxLength=120; input.placeholder='Full name'; input.value=typeof previous[i-2]==='string'?previous[i-2].slice(0,120):'';
      label.htmlFor=input.id; label.textContent=`Guest ${i} full name *`; row.append(label,input); names.append(row);
    }
  }
  minus.addEventListener('click',()=>{count=Math.max(1,count-1);renderGuests();});
  plus.addEventListener('click',()=>{count=Math.min(10,count+1);renderGuests();});
  function attendanceChanged() {
    const attending=form.elements.attendance.value==='yes';
    form.querySelectorAll('[data-attending]').forEach(group=>{
      group.hidden=!attending; group.querySelectorAll('input,button').forEach(input=>input.disabled=!attending);
    });
    if(attending){minus.disabled=count<=1;plus.disabled=count>=10;}
  }
  form.querySelectorAll('[name="attendance"]').forEach(input=>input.addEventListener('change',attendanceChanged));
  const storageKey='bloom-rsvp-v1';
  try {
    const saved=JSON.parse(localStorage.getItem(storageKey)||'null');
    if(saved && typeof saved.name==='string') {
      form.elements.name.value=saved.name.slice(0,120);
      form.elements.message.value=typeof saved.message==='string'?saved.message.slice(0,1000):'';
      form.elements.attendance.value=saved.attendance==='no'?'no':'yes';
      form.elements.transport.value=saved.transport==='shuttle'?'shuttle':saved.transport==='valet'?'valet':'';
      count=Math.max(1,Math.min(10,Math.floor(Number(saved.count)||1)));
      renderGuests(Array.isArray(saved.guests)?saved.guests:[]);
    } else renderGuests();
  } catch { renderGuests(); }
  attendanceChanged();
  form.addEventListener('input',event=>{if(event.target.setCustomValidity)event.target.setCustomValidity('');});
  form.addEventListener('submit',event=>{
    event.preventDefault();
    for(const input of form.querySelectorAll('input[required]:not([type="radio"]):not(:disabled)')) {
      if(!input.value.trim()){input.setCustomValidity('Please enter a name.');input.reportValidity();return;}
    }
    if(!form.reportValidity())return;
    const attending=form.elements.attendance.value==='yes';
    const response={name:form.elements.name.value.trim(),attendance:attending?'yes':'no',count:attending?count:0,guests:attending?[...names.querySelectorAll('input')].map(input=>input.value.trim()):[],transport:attending?form.elements.transport.value:'',message:form.elements.message.value.trim(),savedAt:new Date().toISOString()};
    try {
      localStorage.setItem(storageKey,JSON.stringify(response));
      status.textContent='Thank you! Your reply is saved on this device. You can update it here anytime.';
      form.querySelector('[type="submit"]').textContent='Update RSVP';
    } catch {status.textContent='Your browser could not save your reply. Enable browser storage and try again.';}
  });
})();
