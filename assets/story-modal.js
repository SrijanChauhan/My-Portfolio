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

  function open(id) {
    photos = PHOTO_STORIES[id];
    if (!photos || !photos.length) return;
    index = 0;
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
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      open(trigger.dataset.story);
    });
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        open(trigger.dataset.story);
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
   in a plain, unbranded view (no chart art, just the text). ────── */
(function () {
  const projects = document.querySelectorAll('#work .project');
  if (!projects.length) return;

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
    '</div>';
  document.body.appendChild(modal);

  const metaEl    = modal.querySelector('.story-modal-meta');
  const titleEl   = modal.querySelector('.story-modal-title');
  const bodyEl    = modal.querySelector('.story-modal-body');
  const tagsEl    = modal.querySelector('.story-modal-tags');
  const impactEl  = modal.querySelector('.story-modal-impact');
  const closeBtn  = modal.querySelector('.story-modal-close');
  const backdrop  = modal.querySelector('.story-modal-backdrop');

  let lastFocused = null;

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

    project.addEventListener('click', () => open(project));
    project.addEventListener('keydown', (e) => {
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
