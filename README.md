# Portfolio

Srijan Chauhan's static product-management portfolio site: a home page with case studies and
a searchable "repository" of writing, built with plain HTML/CSS/JS — no framework, no build step.

## Structure

```
index.html          Home page — hero, case studies, about, footer
repository.html      Filterable/searchable list of essays, frameworks, teardowns, notes
assets/style.css     All styling
assets/music.js      Optional ambient background-music player
assets/resume.pdf    Downloadable résumé (linked from the hero and footer)
assets/nav.js        Nav/menu behavior
CHANGELOG.md         Dated release notes for this site
```

## Running locally

No build step — just serve the folder and open it.

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000/index.html`.

## Customizing

Name, résumé, contact links, the hero stats, and all four Work case studies (DroomPay,
M2P, Grameen Pay, Cadence) are already filled in with real content. Remaining placeholder
copy is wrapped in `[brackets]` — search for `[` across `index.html` and `repository.html`
to find what's left (the about-section bio, one skills row, and a few Repository entries).

To add repository entries, edit the `ENTRIES` array at the bottom of `repository.html`.

### Work section graphics

Each case study's `.project-media` is an inline SVG, not a screenshot — for DroomPay/M2P
(internal, confidential tools) it's an abstract data chart in the site's blue; for Cadence
and Grameen Pay it's an original graphic voiced in *their own* brand colors (Cadence's
volt-green-on-black, Grameen Pay's FSS red) rather than the portfolio's palette. Edit the
SVG markup directly in `index.html` per project, and its matching classes (`.chart-*`,
`.cd-*`, `.gp-*`) in `assets/style.css`.

## Background music player

`assets/music.js` drives a vinyl-record icon in the nav (spins while playing) that rolls
out a track panel anchored to the button. It streams from direct URLs — nothing is hosted
in this repo. Edit the `PLAYLIST` array at the top of the file:

```js
const PLAYLIST = [
  { title: "Track Name", artist: "Artist", src: "https://.../track.mp3" },
];
```

Only use direct links you have the rights to host/stream. The player never autoplays;
it starts on the visitor's first click of the toggle, and remembers play state and
position across page navigation via `sessionStorage`.

## Theme

The dark blue palette and gradient in `assets/style.css` are lifted from *The Outfield* by
The Night Game — CSS-only, no image asset. It now runs the full page uninterrupted,
including through Contact — no seam between About and Contact. The site font is Switzer
(Fontshare). The nav bar is a translucent glass panel (`backdrop-filter: blur`), fixed
white text, consistent with the mobile menu, section rail, and music player.

A starfield (`body::before`, a tiled set of radial-gradient dots) runs behind the whole
page, fixed so it doesn't scroll away. The Contact footer has a jagged pine-forest
silhouette (`.footer-trees`, hand-traced as an SVG path) sitting at the bottom, with the
starfield showing through above and around it.
