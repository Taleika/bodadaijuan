(() => {
  const targetTime = new Date('2026-11-20T17:00:00-03:00').getTime();
  const units = {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds')
  };

  function updateCountdown() {
    const remaining = Math.max(0, Math.floor((targetTime - Date.now()) / 1000));
    const values = {
      days: Math.floor(remaining / 86400),
      hours: Math.floor((remaining % 86400) / 3600),
      minutes: Math.floor((remaining % 3600) / 60),
      seconds: remaining % 60
    };
    for (const [unit, value] of Object.entries(values)) {
      units[unit].textContent = String(value).padStart(2, '0');
    }
  }
  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  const entry = document.getElementById('entry');
  const invitation = document.getElementById('invitation');
  const openButton = document.getElementById('open-invitation');
  const audio = document.getElementById('music');
  const musicButton = document.getElementById('music-toggle');
  const musicIcon = musicButton.querySelector('.music-icon');

  function updateMusicButton() {
    const playing = !audio.paused && !audio.ended;
    musicButton.setAttribute('aria-pressed', String(playing));
    musicButton.setAttribute('aria-label', playing ? 'Pausar música' : 'Reproducir música');
    musicIcon.textContent = playing ? 'Ⅱ' : '▶';
  }

  audio.addEventListener('loadedmetadata', () => { musicButton.hidden = false; });
  audio.addEventListener('play', updateMusicButton);
  audio.addEventListener('pause', updateMusicButton);
  audio.addEventListener('error', () => { musicButton.hidden = true; });

  function tryPlayMusic() {
    if (audio.error) return;
    const attempt = audio.play();
    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(() => { updateMusicButton(); });
    }
  }

  musicButton.addEventListener('click', () => {
    if (audio.paused) tryPlayMusic();
    else audio.pause();
  });

  openButton.addEventListener('click', () => {
    if (entry.classList.contains('is-opening')) return;
    entry.classList.add('is-opening');
    openButton.disabled = true;
    // Playback begins from the visitor's tap, as required by browser audio policies.
    tryPlayMusic();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.setTimeout(() => {
      invitation.inert = false;
      document.body.classList.remove('before-open');
      entry.classList.add('is-fading');
      window.scrollTo(0, 0);
      window.setTimeout(() => {
        entry.hidden = true;
        invitation.querySelector('h1').setAttribute('tabindex', '-1');
        invitation.querySelector('h1').focus({ preventScroll: true });
      }, reducedMotion ? 0 : 350);
    }, reducedMotion ? 0 : 960);
  });
})();
