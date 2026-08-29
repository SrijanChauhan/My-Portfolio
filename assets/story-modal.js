/* ── PHOTO STORY — click a project's photo collage to page through the
   field-research photos full-screen, Instagram-story style: images only,
   no captions, tap/arrow to advance. ───────────────────────────────── */
(function () {
  const PHOTO_STORIES = {
    'grameen-pay': [
      'assets/images/grameen-pay/field-7.jpg',
      'assets/images/grameen-pay/field-1.jpg',
      'assets/images/grameen-pay/field-6.jpg',
      'assets/images/grameen-pay/field-5.jpg',
      'assets/images/grameen-pay/field-4.jpg',
      'assets/images/grameen-pay/field-3.jpg',
      'assets/images/grameen-pay/field-2.jpg'
    ]
  };

  const triggers = document.querySelectorAll('.photo-story-trigger');
  if (!triggers.length) return;

  const modal = document.createElement('div');
  modal.className = 'photo-story';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.hidden = true;
  modal.innerHTML =
    '<div class="photo-story-backdrop"></div>' +
    '<div class="photo-story-panel">' +
      '<div class="photo-story-bars"></div>' +
      '<button type="button" class="photo-story-close" aria-label="Close">&times;</button>' +
      '<img class="photo-story-img" alt="">' +
      '<button type="button" class="photo-story-zone photo-story-prev" aria-label="Previous photo"></button>' +
      '<button type="button" class="photo-story-zone photo-story-next" aria-label="Next photo"></button>' +
    '</div>';
  document.body.appendChild(modal);

  const barsEl   = modal.querySelector('.photo-story-bars');
  const imgEl    = modal.querySelector('.photo-story-img');
  const closeBtn = modal.querySelector('.photo-story-close');
  const backdrop = modal.querySelector('.photo-story-backdrop');
  const prevZone = modal.querySelector('.photo-story-prev');
  const nextZone = modal.querySelector('.photo-story-next');

  let photos = [];
  let index = 0;
  let lastFocused = null;

  function render() {
    imgEl.src = photos[index];
    [...barsEl.children].forEach((bar, i) => {
      bar.classList.toggle('done', i < index);
      bar.classList.toggle('active', i === index);
    });
  }

  function open(id, startIndex) {
    photos = PHOTO_STORIES[id];
    if (!photos || !photos.length) return;
    index = startIndex && startIndex > 0 && startIndex < photos.length ? startIndex : 0;
    barsEl.innerHTML = photos.map(() => '<span class="photo-story-bar"><span class="photo-story-bar-fill"></span></span>').join('');
    render();
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('story-modal-open');
    closeBtn.focus();
  }

  function close() {
    modal.hidden = true;
    document.body.classList.remove('story-modal-open');
    if (lastFocused) lastFocused.focus();
  }

  function next() {
    if (index < photos.length - 1) { index++; render(); } else { close(); }
  }
  function prev() {
    if (index > 0) { index--; render(); }
  }

  triggers.forEach(trigger => {
    const startIndex = parseInt(trigger.dataset.storyIndex, 10) || 0;
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      open(trigger.dataset.story, startIndex);
    });
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        open(trigger.dataset.story, startIndex);
      }
    });
  });

  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  prevZone.addEventListener('click', prev);
  nextZone.addEventListener('click', next);
  document.addEventListener('keydown', (e) => {
    if (modal.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });
})();

/* ── STORY MODAL — click a project card to read the full write-up
   in a plain, unbranded view (no chart art, just the text). Projects
   with a matching entry in RESEARCH_INSIGHTS get a "Research at a
   glance" section appended, pulled from the underlying market study
   rather than restated as marketing prose. ─────────────────────── */
(function () {
  const projects = document.querySelectorAll('#work .project');
  if (!projects.length) return;

  const RESEARCH_INSIGHTS = {
    'grameen-pay': {
      stats: [
        { num: '1,154', label: 'people surveyed' },
        { num: '4', label: 'regions' },
        { num: '28', label: 'districts' },
        { num: '7', label: 'focus groups' }
      ],
      rows: [
        { label: 'Respondent mix', value: '338 shop owners · 325 farmers · 223 daily-wage earners · 106 salaried' },
        { label: 'Microcredit appetite', value: '41–79% interested by region · avg ticket ₹55K–₹110K' },
        { label: 'Insurance appetite', value: '53–79% interested by region · avg premium ₹146–285/mo' }
      ],
      personas: [
        { name: 'Traditionalists', desc: 'Conservative, price-driven, buy through conventional channels' },
        { name: 'Steady Climbers', desc: 'Aspire to a more comfortable lifestyle, buy branded for social standing' },
        { name: 'Young Enthusiasts', desc: 'Ages 18–28, digitally fluent, influence other segments’ decisions' },
        { name: 'Village Elites', desc: 'Progressive, highly educated, expect the best quality and service' }
      ],
      journey: ['Awareness', 'Consideration', 'Validation', 'Purchase', 'Experience', 'Advocacy']
    }
  };

  const modal = document.createElement('div');
  modal.className = 'story-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.hidden = true;
  modal.innerHTML =
    '<div class="story-modal-backdrop"></div>' +
    '<div class="story-modal-panel">' +
      '<button type="button" class="story-modal-close" aria-label="Close">&times;</button>' +
      '<div class="story-modal-meta"></div>' +
      '<h2 class="story-modal-title"></h2>' +
      '<p class="story-modal-body"></p>' +
      '<div class="story-modal-tags"></div>' +
      '<div class="story-modal-impact"></div>' +
      '<div class="story-modal-research"></div>' +
    '</div>';
  document.body.appendChild(modal);

  const metaEl     = modal.querySelector('.story-modal-meta');
  const titleEl    = modal.querySelector('.story-modal-title');
  const bodyEl     = modal.querySelector('.story-modal-body');
  const tagsEl     = modal.querySelector('.story-modal-tags');
  const impactEl   = modal.querySelector('.story-modal-impact');
  const researchEl = modal.querySelector('.story-modal-research');
  const closeBtn   = modal.querySelector('.story-modal-close');
  const backdrop   = modal.querySelector('.story-modal-backdrop');

  let lastFocused = null;

  function renderResearch(insights) {
    researchEl.innerHTML = '';
    if (!insights) return;

    const label = document.createElement('div');
    label.className = 'research-label';
    label.textContent = 'Research at a glance';
    researchEl.appendChild(label);

    const statsWrap = document.createElement('div');
    statsWrap.className = 'research-stats';
    insights.stats.forEach(s => {
      const stat = document.createElement('div');
      stat.className = 'research-stat';
      stat.innerHTML = '<span class="num">' + s.num + '</span><span class="label">' + s.label + '</span>';
      statsWrap.appendChild(stat);
    });
    researchEl.appendChild(statsWrap);

    insights.rows.forEach(r => {
      const row = document.createElement('div');
      row.className = 'research-row';
      row.innerHTML = '<span class="research-row-label">' + r.label + '</span><span class="research-row-value">' + r.value + '</span>';
      researchEl.appendChild(row);
    });

    const personasWrap = document.createElement('div');
    personasWrap.className = 'research-personas';
    insights.personas.forEach(p => {
      const span = document.createElement('span');
      span.className = 'story-modal-tag';
      span.textContent = p.name;
      span.title = p.desc;
      personasWrap.appendChild(span);
    });
    researchEl.appendChild(personasWrap);

    const journeyWrap = document.createElement('div');
    journeyWrap.className = 'research-journey';
    journeyWrap.textContent = insights.journey.join('  →  ');
    researchEl.appendChild(journeyWrap);
  }

  function open(project) {
    const meta = [...project.querySelectorAll('.meta-row > span:not(.dot)')]
      .map(s => s.textContent.trim());
    const tags = [...project.querySelectorAll('.tag')].map(t => t.textContent.trim());
    const impactNum   = project.querySelector('.impact .num');
    const impactLabel = project.querySelector('.impact .label');

    metaEl.textContent  = meta.join(' · ');
    titleEl.textContent = project.querySelector('h3').textContent.trim();
    bodyEl.textContent  = project.querySelector('.project-body > div > p').textContent.trim();

    tagsEl.innerHTML = '';
    tags.forEach(t => {
      const span = document.createElement('span');
      span.className = 'story-modal-tag';
      span.textContent = t;
      tagsEl.appendChild(span);
    });

    impactEl.innerHTML = '';
    if (impactNum && impactLabel) {
      const numSpan = document.createElement('span');
      numSpan.className = 'story-modal-impact-num';
      numSpan.textContent = impactNum.textContent;
      const labelSpan = document.createElement('span');
      labelSpan.className = 'story-modal-impact-label';
      labelSpan.textContent = impactLabel.textContent;
      impactEl.appendChild(numSpan);
      impactEl.appendChild(labelSpan);
    }

    renderResearch(RESEARCH_INSIGHTS[project.dataset.project]);

    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('story-modal-open');
    closeBtn.focus();
  }

  function close() {
    modal.hidden = true;
    document.body.classList.remove('story-modal-open');
    if (lastFocused) lastFocused.focus();
  }

  projects.forEach(project => {
    project.setAttribute('tabindex', '0');
    project.setAttribute('role', 'button');
    project.setAttribute('aria-haspopup', 'dialog');
    project.classList.add('project-clickable');

    project.addEventListener('click', (e) => {
      if (e.target.closest('.project-media-hero, .photo-story-trigger')) return;
      open(project);
    });
    project.addEventListener('keydown', (e) => {
      if (e.target.closest('.project-media-hero, .photo-story-trigger')) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(project);
      }
    });
  });

  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (!modal.hidden && e.key === 'Escape') close();
  });
})();
