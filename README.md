# Portfolio

A static product-management portfolio site: a home page with case studies and a searchable
"repository" of writing, built with plain HTML/CSS/JS — no framework, no build step.

## Structure

```
index.html          Home page — hero, case studies, about, footer
repository.html      Filterable/searchable list of essays, frameworks, teardowns, notes
assets/style.css     All styling
assets/music.js      Optional ambient background-music player
```

## Running locally

No build step — just serve the folder and open it.

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000/index.html`.

## Customizing

All placeholder copy is wrapped in `[brackets]` — search for `[` across `index.html`,
`repository.html`, and the `ENTRIES` array in `repository.html` to find every spot that
needs real content (name, bio, case studies, metrics, links, résumé, email).

To add repository entries, edit the `ENTRIES` array at the bottom of `repository.html`.

## Background music player

`assets/music.js` drives the "SOUND ON/OFF" toggle and the bottom-left player widget.
It streams from direct URLs — nothing is hosted in this repo. Edit the `PLAYLIST` array
at the top of the file:

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
