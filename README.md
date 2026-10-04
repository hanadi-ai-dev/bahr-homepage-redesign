# Bahr — Make Waves

An independent homepage redesign for the GDG on Campus University of Jeddah × Bahr challenge.

One ripple becomes a current, momentum, and impact. The site pairs Bahr's verified identity and content with a responsive Ripple Field, an editorial service index, large project showcases, and a connected closing scene.

## Run

Use Node.js 24 LTS (Node 22.12+ also satisfies the build tool requirement).

```bash
npm ci
npm run dev
```

The dev server defaults to port 5173. No API keys, database, backend, or environment file is required.

## Production

```bash
npm run lint
npm run build
npm run preview
```

The complete static website is generated in `dist/`. Assets use relative paths, so the same output works on a domain root or GitHub project Pages. The repository contains a manual GitHub Pages workflow; it does not deploy on push.

## Browser tests

```bash
npx playwright install chromium
npm run build
npm test
```

On this cloud machine, Chromium is already installed:

```bash
CHROMIUM_PATH=/usr/bin/chromium npm test
```

Tests own port 4173; stop a manually running preview before testing. Coverage includes five viewport sizes, keyboard navigation, mobile menu focus, service controls, asset loading, reduced motion, motion persistence, pin cleanup, ripple rendering, axe accessibility scans, and the no-JavaScript fallback.

## Project map

- `index.html` — semantic homepage and verified content; all core content exists before JavaScript.
- `src/style.css` — responsive editorial composition, palette, typography, and interaction states.
- `src/main.ts` — navigation, service index, GSAP timelines, ScrollTrigger, motion preferences, and cleanup.
- `src/ripple-field.ts` — responsive canvas surface, pointer tension, autonomous drift, visibility throttling.
- `public/images/` — official Bahr mark and optimized, responsive project images.
- `tests/homepage.spec.ts` — functional and accessibility browser tests.
- `.github/workflows/pages.yml` — manual deployment to GitHub Pages.
- `docs/CONTENT-SOURCES.md` — verified content and asset provenance.
- `docs/HANDOFF.md` — design explanation, deployment, GitHub steps, QA, and submission text.

## Editing

Change content in `index.html`. Palette tokens live at the beginning of `src/style.css`. Motion orchestration is in `setupMotion()` in `src/main.ts`; the field geometry lives in `src/ripple-field.ts`.

The site respects the device's reduced-motion setting and offers a persistent pause control. Canvas work stops off-screen and in hidden tabs. On narrow screens the hero scrolls naturally without pinning. GSAP context and matchMedia cleanup prevent duplicate animation state during changes and hot reloads.

The contact action opens an email composer for the verified address `dive@b7r.agency`. Project links open Bahr's official case studies. This project does not process or collect form submissions.
