# Bahr — Make Waves: final handoff

## 1. Concept

“Make Waves” treats Bahr's name as an interface behaviour. A single point forms a field of ripples; those lines acquire direction, become a current, and reappear at the final contact scene. The composition is designed to hold up as a still image as well as in motion.

## 2. Visual system

Bahr's official warm off-white, charcoal, coral, and blue Arabic mark anchor the design. Oversized Space Grotesk carries the hierarchy, with selective serif italics and properly marked Arabic. Fine rules, asymmetry, and generous whitespace replace service cards. Coral appears in one concentrated middle scene to create calm → energy → calm.

The original proprietary font is not redistributed. The two self-hosted font families use the included open-source licenses.

## 3. Signature interaction

Ripple Field uses one 2D canvas. Pointer position changes the surface's tension, rather than moving an object after the cursor. GSAP `quickTo()` eases the deformation. Touch devices receive autonomous drift; reduced-motion users see a static field. Drawing is capped at 30fps and device-pixel ratio at 1.5, with fewer rings on mobile. It pauses off-screen and when the tab is hidden.

## 4. Story

- **Ripple:** the point and large “MAKE WAVES” composition introduce the idea.
- **Current:** verified agency positioning leads into an interactive service index. Choosing a service changes the line field and index.
- **Momentum:** a brief coral current shift transitions into two verified, large-format projects, Alageely and Lineup.
- **Impact:** the page settles into Bahr's real philosophy, then returns to expanding rings, the official “Let's dive deeper” CTA, Arabic wording, and email address.

## 5. GSAP actually used

- GSAP core, timeline labels, overlaps, directional masked text entrances, and stagger.
- ScrollTrigger for a short desktop hero pin/exit, mobile field deformation without pinning, the scrubbed current shift, selective one-time section entrances, and the tide indicator.
- `gsap.matchMedia()` to recompose motion by viewport; `gsap.context()` and `.revert()` for cleanup.
- `gsap.quickTo()` to reuse pointer-driven tweens.
- `gsap.ticker` for the lightweight field, with visibility-aware removal.
- Built-in `power3.out`, `power3.inOut`, and linear scroll easing.

No WebGL, scroll hijacking, third-party smooth scroller, SplitText, or heavy rendering framework is required.

## 6. Stack

Vite + strict TypeScript + semantic HTML + CSS + GSAP. Playwright and axe are development-only QA tools. This is a static site with no backend or credentials to configure.

## 7. Major files

`index.html`, `src/style.css`, `src/main.ts`, `src/ripple-field.ts`, `public/images/`, `vite.config.ts`, `tsconfig.json`, `eslint.config.js`, `playwright.config.ts`, `tests/homepage.spec.ts`, `package.json`, `package-lock.json`, and `.github/workflows/pages.yml`.

## 8. Run locally

Install Node.js 24 LTS. From the repository directory:

```bash
npm ci
npm run dev
```

## 9. Build

```bash
npm run lint
npm run typecheck
npm run build
npm run preview
```

Upload the contents of `dist/` to a static host. `npm run preview` serves that production output for local checking.

## 10. Free deployment

**Recommended: GitHub Pages for a public repository.** The manual workflow is already included.

1. Commit and push the project to your GitHub repository.
2. In repository Settings → Pages → Build and deployment, select **GitHub Actions**.
3. Open Actions → **Deploy homepage to GitHub Pages** → Run workflow on the branch containing this implementation.
4. Wait for the deployment job to finish. GitHub supplies the actual Pages URL in the deployment result and repository Pages settings.
5. Open that URL on your phone and desktop before submitting it.

The workflow runs only when manually triggered. Nothing has been pushed or deployed by this task. Relative assets support the repository subpath. If the repository is private and Pages is not included in your plan, use a free static-host plan such as Netlify instead: run `npm run build`, sign in to Netlify, and drag the `dist` directory into its manual deployment screen. No paid resource is necessary.

## 11. GitHub

Commit the source, public assets, lockfile, configuration, tests, documentation, font license notices, and workflow. `node_modules/`, `dist/`, `.env*`, and test output are ignored.

```bash
git add README.md .gitignore .github index.html package.json package-lock.json \
  src public docs tests vite.config.ts tsconfig.json eslint.config.js playwright.config.ts
git diff --cached --stat
git commit -m "Build Bahr Make Waves homepage redesign"
git push -u origin HEAD
```

The cloud checkout may use a working branch. Push it and open a pull request into `main` if needed, then run the deployment workflow on the intended branch. No secret or private environment file is needed.

## 12. QA

See `docs/QA.md` for actual results. Desktop and mobile screenshots were inspected, refined, and recaptured. Corrections included SVG arrows replacing missing glyphs, mobile dialog focus containment, contrast improvements, less dense hero linework, and revised spacing and typography.

## 13. Personal submission check

- Open the deployed URL once on your actual phone, preferably in Safari as well as Chrome if available.
- Follow the first scroll transition, switch a service, open the mobile menu, and try Pause motion.
- Open each project link and confirm your email app recognises the contact address.
- Check the competition's submission format and asset-use rules, and include your own name/team details in the form.
- Confirm that the final form contains the deployed website URL and repository URL, rather than a local development address.

Automated Chromium checks do not replace an actual iOS Safari inspection. No Safari or Firefox run is claimed.

## 14. Submission text

**Make Waves — a homepage redesign for Bahr**

I built the redesign around the meaning of Bahr: the sea as movement, rather than scenery. A small ripple becomes a current, carries the visitor through the agency's expertise and work, and returns as a larger visual at the contact section. The Ripple Field responds to the pointer with a subtle change in surface tension. Large typography, Bahr's real palette and Arabic mark, and a short coral transition give the page its rhythm. Built with Vite, TypeScript, and GSAP, it includes a deliberately recomposed mobile layout, keyboard navigation, reduced-motion support, and verified content from Bahr's official website.

## 15. Judge pitch

“Bahr means sea, so I made the sea a behaviour rather than a background. One ripple becomes the current that connects the whole page—from the first idea to the final impact—with Bahr's real identity and content at its centre.”
