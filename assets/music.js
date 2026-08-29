/* ─────────────────────────────────────────────────────────────
   AMBIENT PLAYLIST — hosted locally in assets/audio/. Drop your
   own licensed/owned MP3 files in that folder and list them below.
   Never autoplays — browsers block it and visitors hate it.
   ───────────────────────────────────────────────────────────── */

const PLAYLIST = [
  { title: "Lovebomb", artist: "The Neighbourhood", src: "assets/audio/The Neighbourhood - Lovebomb (Official Audio).mp3" },
  { title: "The Night Game", artist: "The Outfield", src: "assets/audio/the night game - the outfield.mp3" },
  { title: "Aperture", artist: "Harry Styles", src: "assets/audio/Aperture - Harry Styles.mp3" }
];

(function () {
  const btn    = document.querySelector('.music-btn');
  const audio  = document.getElementById('ambient');
  const player = document.getElementById('player');
  if (!btn || !audio || !PLAYLIST.length) return;

  const titleEl = player.querySelector('.pl-title');
  const artEl   = player.querySelector('.pl-artist');
  const posEl   = player.querySelector('.pl-pos');
  const playBtn = player.querySelector('.pl-play');
  const prevBtn = player.querySelector('.pl-prev');
  const nextBtn = player.querySelector('.pl-next');

  // A single-track playlist has nothing to skip to — hide the
  // prev/next/position UI instead of leaving dead controls.
  if (PLAYLIST.length <= 1) {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    posEl.style.display = 'none';
  }

  const KEY = 'ambient-state';
  let i = 0, failures = 0;

  audio.volume = 0.18;                       // quiet enough to read over

  // Restore track + position across page navigation
  try {
    const s = JSON.parse(sessionStorage.getItem(KEY) || '{}');
    if (typeof s.i === 'number') i = s.i % PLAYLIST.length;
    if (s.t) audio.currentTime = s.t;
  } catch (e) {}

  function save(playing) {
    try {
      sessionStorage.setItem(KEY, JSON.stringify({
        i: i, t: audio.currentTime, on: !!playing
      }));
    } catch (e) {}
  }

  function paint() {
    const t = PLAYLIST[i];
    titleEl.textContent = t.title;
    artEl.textContent   = t.artist;
    posEl.textContent   = String(i + 1).padStart(2, '0') + '/' + String(PLAYLIST.length).padStart(2, '0');
    const on = !audio.paused;
    playBtn.textContent = on ? '❚❚' : '▶';
    playBtn.setAttribute('aria-label', on ? 'Pause' : 'Play');
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    player.classList.toggle('open', !!player.dataset.opened);
  }

  function load(index, autoplay) {
    i = (index + PLAYLIST.length) % PLAYLIST.length;
    audio.src = PLAYLIST[i].src;
    paint();
    if (autoplay) start();
  }

  function start() {
    audio.play()
      .then(() => { failures = 0; player.dataset.opened = '1'; paint(); save(true); })
      .catch(() => { paint(); });        // blocked until a genuine click
  }

  // Skip past a broken file instead of stalling on it
  audio.addEventListener('error', () => {
    if (++failures >= PLAYLIST.length) { titleEl.textContent = 'Playlist unavailable'; return; }
    load(i + 1, true);
  });
  audio.addEventListener('ended', () => load(i + 1, true));   // continuous loop
  audio.addEventListener('timeupdate', () => { if (!audio.paused) save(true); });
  audio.addEventListener('play', paint);
  audio.addEventListener('pause', () => { paint(); save(false); });

  function toggle() {
    if (audio.paused) { player.dataset.opened = '1'; start(); }
    else { audio.pause(); }
  }

  btn.addEventListener('click', toggle);
  playBtn.addEventListener('click', toggle);
  player.querySelector('.pl-next').addEventListener('click', () => load(i + 1, true));
  player.querySelector('.pl-prev').addEventListener('click', () => load(i - 1, true));
  player.querySelector('.pl-close').addEventListener('click', () => {
    audio.pause(); delete player.dataset.opened; paint();
  });

  // Clicking anywhere outside the player/toggle collapses the panel
  // (playback keeps going — this only hides the dock).
  document.addEventListener('click', (e) => {
    if (!player.dataset.opened) return;
    if (player.contains(e.target) || btn.contains(e.target)) return;
    delete player.dataset.opened;
    paint();
  });

  load(i, false);

  // If sound was on before they changed pages, resume on their first interaction
  let wanted = false;
  try { wanted = JSON.parse(sessionStorage.getItem(KEY) || '{}').on; } catch (e) {}
  if (wanted) {
    const resume = () => {
      start();
      document.removeEventListener('click', resume);
      document.removeEventListener('keydown', resume);
    };
    document.addEventListener('click', resume);
    document.addEventListener('keydown', resume);
  }
})();
