/* ─────────────────────────────────────────────────────────────
   SOUND TOGGLE — reveals/hides the official Spotify embed player.
   Playback itself (play/pause/scrub) happens inside the embed's
   own UI: a raw <audio> tag can't legally stream a Spotify track,
   so the toggle here only controls whether the widget is shown,
   not whether audio is playing. If the visitor is logged into
   Spotify with Premium in that browser, the embed plays the full
   track; otherwise it plays a 30-second preview, per Spotify's terms.
   ───────────────────────────────────────────────────────────── */

(function () {
  const btn    = document.querySelector('.music-btn');
  const player = document.getElementById('player');
  if (!btn || !player) return;

  const label = btn.querySelector('.music-label');
  const closeBtn = player.querySelector('.pl-close');
  const KEY = 'player-open';

  function paint(open) {
    player.hidden = !open;
    btn.setAttribute('aria-pressed', open ? 'true' : 'false');
    label.textContent = open ? 'SOUND ON' : 'SOUND OFF';
  }

  function setOpen(open) {
    paint(open);
    try { sessionStorage.setItem(KEY, open ? '1' : '0'); } catch (e) {}
  }

  btn.addEventListener('click', () => setOpen(player.hidden));
  closeBtn.addEventListener('click', () => setOpen(false));

  let open = false;
  try { open = sessionStorage.getItem(KEY) === '1'; } catch (e) {}
  paint(open);
})();
