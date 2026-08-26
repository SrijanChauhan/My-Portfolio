# TODO — pending your input

Written 2026-08-27 after a look-and-feel audit. Everything fixable without
new information from you has already been fixed/removed from the live site.
These items need real content or a decision from you before they can be
finished — tackle tomorrow.

## Repository — 4 entries removed, need real replacements
`repository.html` had four bracketed placeholder entries (a Product
framework, a Product teardown, a Music "on repeat" post, an Art notes post)
that linked to `#` — dead links with fake content, so they've been deleted
from the live `ENTRIES` array rather than leave them broken. The Music and
Art category filter chips still exist (for when you have entries again) but
will show the "Nothing matches that yet" empty state until then.

To bring these back: write the real title/blurb/tags for each and give me
the actual URL it lives at (Substack, Medium, LinkedIn, wherever), same
shape as the three existing entries.

## Social sharing preview (Open Graph / Twitter Card)
No `og:image`, `og:title`, or `twitter:card` meta tags exist yet, so sharing
either page's link in Slack/iMessage/Twitter shows no preview image and a
generic title. Blocked on:
- A real domain (site currently only runs locally) — need to know where
  this deploys (GitHub Pages, Vercel, custom domain?) for the `og:url`.
- A 1200×630 preview image — could be a screenshot of the hero, or a
  designed card. Tell me which and I'll generate/wire it up.

## About section copy
Wrote a real (non-bracketed) 2-sentence bio grounded in facts already on
the page (fintech/lending focus, discovery-driven approach) so nothing
placeholder-looking ships. If you want a different angle — more personal,
mentions something not already stated in the case studies — send me the
specifics and I'll swap it in.
