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
