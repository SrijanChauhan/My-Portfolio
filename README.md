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
```

## Running locally

No build step — just serve the folder and open it.

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000/index.html`.

## Customizing

Name, résumé, and contact links (LinkedIn, GitHub, email, phone) are already filled in.
Remaining placeholder copy is wrapped in `[brackets]` — search for `[` across `index.html`
and `repository.html` to find spots that still need real content (case study details,
metrics, about-section bio, and the `ENTRIES` array entries).

To add repository entries, edit the `ENTRIES` array at the bottom of `repository.html`.

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

The dark palette and gradient in `assets/style.css` are lifted from *The Outfield* by
The Night Game — CSS-only, no image asset. The site font is Alex Brush (Google Fonts),
matching the handwritten style on that cover. The nav bar has no fixed background;
it uses `mix-blend-mode: difference` so its text stays legible against whatever part
of the gradient is scrolled behind it.
