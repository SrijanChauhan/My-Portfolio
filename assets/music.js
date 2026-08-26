/* ─────────────────────────────────────────────────────────────
   PLAYLIST — driven by the SoundCloud Widget API. The iframe is
   visually hidden; these buttons are the only player UI visitors
   see. Never autoplays — browsers block it and visitors hate it.
   ───────────────────────────────────────────────────────────── */

const PLAYLIST = [
  { title: "pop", artist: "Harry Styles", url: "https://api.soundcloud.com/tracks/2277805115" },
  { title: "5 Dollar Pony Rides", artist: "Mac Miller", url: "https://api.soundcloud.com/tracks/1988665707" },
  { title: "Redbone", artist: "Childish Gambino", url: "https://api.soundcloud.com/tracks/291270561" },
  { title: "Pyramids", artist: "Frank Ocean", url: "https://api.soundcloud.com/tracks/1647148785" }
];

(function () {
  const btn    = document.querySelector('.music-btn');
  const iframe = document.getElementById('sc-player');
  const player = document.getElementById('player');
  if (!btn || !iframe || typeof SC === 'undefined' || !PLAYLIST.length) return;

  const titleEl = player.querySelector('.pl-title');
  const artEl   = player.querySelector('.pl-artist');
  const posEl   = player.querySelector('.pl-pos');
  const playBtn = player.querySelector('.pl-play');

  const KEY = 'ambient-state';
  let i = 0, playing = false, ready = false;
  const widget = SC.Widget(iframe);

  try {
    const s = JSON.parse(sessionStorage.getItem(KEY) || '{}');
    if (typeof s.i === 'number') i = s.i % PLAYLIST.length;
  } catch (e) {}

  function save(on) {
    try { sessionStorage.setItem(KEY, JSON.stringify({ i: i, on: !!on })); } catch (e) {}
  }

  function paint() {
    const t = PLAYLIST[i];
    titleEl.textContent = t.title;
    artEl.textContent   = t.artist;
    posEl.textContent   = String(i + 1).padStart(2, '0') + '/' + String(PLAYLIST.length).padStart(2, '0');
    playBtn.textContent = playing ? '❚❚' : '▶';
    playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
    btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
    player.classList.toggle('open', playing || !!player.dataset.opened);
  }

  function load(index, autoplay) {
    i = (index + PLAYLIST.length) % PLAYLIST.length;
    paint();
    widget.load(PLAYLIST[i].url, { auto_play: !!autoplay, show_artwork: false, callback: paint });
  }

  function toggle() {
    if (!ready) return;
    if (!playing) { player.dataset.opened = '1'; widget.play(); }
    else { widget.pause(); }
  }

  widget.bind(SC.Widget.Events.READY, function () {
    ready = true;
    if (i !== 0) load(i, false); else paint();

    widget.bind(SC.Widget.Events.PLAY,  function () { playing = true;  player.dataset.opened = '1'; paint(); save(true); });
    widget.bind(SC.Widget.Events.PAUSE, function () { playing = false; paint(); save(false); });
    widget.bind(SC.Widget.Events.FINISH, function () { load(i + 1, true); });
    widget.bind(SC.Widget.Events.ERROR,  function () { load(i + 1, true); });

    // If sound was on before they changed pages, resume on their first interaction
    let wanted = false;
    try { wanted = JSON.parse(sessionStorage.getItem(KEY) || '{}').on; } catch (e) {}
    if (wanted) {
      const resume = () => {
        player.dataset.opened = '1'; widget.play();
        document.removeEventListener('click', resume);
        document.removeEventListener('keydown', resume);
      };
      document.addEventListener('click', resume);
      document.addEventListener('keydown', resume);
    }
  });

  btn.addEventListener('click', toggle);
  playBtn.addEventListener('click', toggle);
  player.querySelector('.pl-next').addEventListener('click', () => load(i + 1, true));
  player.querySelector('.pl-prev').addEventListener('click', () => load(i - 1, true));
  player.querySelector('.pl-close').addEventListener('click', () => {
    widget.pause(); delete player.dataset.opened; paint();
  });

  paint();
})();
