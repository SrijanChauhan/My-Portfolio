/* ── MOBILE MENU ─────────────────────────────────────── */
(function () {
  const burger = document.querySelector('.nav-burger');
  const links  = document.getElementById('navlinks');
  if (!burger || !links) return;

  burger.addEventListener('click', () => {
    const open = !links.classList.contains('open');
    links.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ── MIRROR BALL TOGGLE ───────────────────────────────── */
(function () {
  const btn = document.querySelector('.mirror-btn');
  const spinAnim = btn && btn.querySelector('#mirrorSpin');
  const shimmerAnim = btn && btn.querySelector('#facetShimmer');
  if (!btn || !spinAnim || !shimmerAnim) return;

  btn.addEventListener('click', () => {
    const spinning = btn.getAttribute('aria-pressed') === 'true';
    btn.setAttribute('aria-pressed', spinning ? 'false' : 'true');

    // Only the ball's face (facets + shading) rotates, driven by SMIL,
    // not the whole icon — rotating the outline/glow/sparkles too made
    // the highlight swing in a circle, which read as sliding, not spinning.
    if (spinning) {
      spinAnim.endElement();
      shimmerAnim.beginElement();
    } else {
      shimmerAnim.endElement();
      spinAnim.beginElement();
    }

    btn.classList.remove('popped');
    void btn.offsetWidth; // restart the pop animation even on rapid clicks
    btn.classList.add('popped');
  });

  btn.addEventListener('animationend', (e) => {
    if (e.animationName === 'mirror-pop') btn.classList.remove('popped');
  });
})();

/* ── SECTION RAIL (home page only) ───────────────────── */
(function () {
  const rail = document.querySelector('.rail');
  if (!rail) return;

  const currentEl = rail.querySelector('.rail-current');
  const ticks  = [...rail.querySelectorAll('.rail-ticks a')];
  const labels = [...rail.querySelectorAll('.rail-labels a')];
  const sections = ticks
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  function setActive(id) {
    const href = '#' + id;
    ticks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === href));
    labels.forEach(a => a.classList.toggle('active', a.getAttribute('href') === href));
    const match = ticks.find(a => a.getAttribute('href') === href);
    if (match) currentEl.textContent = match.dataset.label;

    // Nothing to navigate to while the hero itself is on screen —
    // only show the rail once there's a reason to use it.
    rail.classList.toggle('visible', id !== sections[0].id);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));
  if (sections[0]) setActive(sections[0].id);
})();

/* ── FOOTER LOCAL TIME ────────────────────────────────── */
(function () {
  const el = document.getElementById('local-time');
  if (!el) return;

  function tick() {
    el.textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  tick();
  setInterval(tick, 30000);
})();
