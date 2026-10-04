# Validation record

Validated on 4 October 2026 in the cloud environment with Node.js 24.19.0, npm 11.9.0, and installed Chromium.

## Completed checks

| Check | Result |
| --- | --- |
| Frozen lockfile install (`npm ci`) | Passed; dependency installation also reproduced successfully from the local cache with `--offline`. |
| TypeScript (`tsc --noEmit`, included in build) | Passed. |
| Production build (`npm run build`) | Passed. |
| ESLint (`npm run lint`) | Passed. |
| Production browser suite | **13 passed**, 0 failed, 0 skipped; final full run after clean reinstall: 32.3 seconds. |
| Axe WCAG 2 A/AA and 2.1 AA checks | No detected violations at 390px and 1440px in the tested default, reduced-motion state. |
| External official links | Homepage, all-work index, Alageely, and Lineup returned HTTP 200. |
| Git whitespace check | Passed. |

## Browser test coverage

Five viewport cases: **320 × 740, 390 × 844, 768 × 1024, 1280 × 800, 1440 × 1000**. Each checks visible content, no horizontal overflow through the page, loaded images, the verified contact destination, and no browser-console, runtime, or failing asset-response errors.

Additional cases check keyboard service selection and exclusive expansion; the mobile dialog's focus loop, Escape dismissal and target navigation; static reduced-motion rendering; repeated pause/resume and persistent preference without accumulated pin spacers; a changing canvas with stable document height; accessibility scans; and a no-JavaScript page with functional native service controls and navigation.

## Visual review and fixes

Rendered screenshots were inspected at desktop and mobile sizes for the hero, editorial introduction, services, current shift, work, final contact, and mobile menu. The final hero images are saved in `docs/screenshots/`.

Corrections made during review:

- Replaced unsupported diagonal-arrow glyphs with inline SVGs.
- Tightened the mobile layout and reduced hero ripple opacity.
- Rebalanced heading letter spacing and supporting-text spacing.
- Added explicit keyboard focus wrapping to the mobile dialog.
- Improved muted-text contrast to the official `#646460` value.
- Moved the motion control away from the primary scroll action.
- Corrected a font-subset import and verified the rebuilt production assets.
- Made the test runner own its preview server and wait for lazy image loads.

## Performance observations

The production JavaScript bundle is approximately **120.88 kB / 47.36 kB gzip**; CSS is **24.82 kB / 6.04 kB gzip**. Only the required Latin and Arabic font files are bundled. Both project images have 720px and 1440px WebP variants, with native lazy loading and explicit dimensions. No video, analytics, third-party API, or runtime font CDN is required.

A local initial-load Layout Shift observer recorded approximately **0.0071 desktop** and **0.0190 mobile**. These are local laboratory observations without network throttling, not field Core Web Vitals or a Lighthouse score.

## Limits and publication state

Browser checks ran in Chromium. Real-device Safari, Firefox, and screen-reader testing were not performed. The automated accessibility scan covers the specified rules and tested states, not a blanket accessibility certification. Contact uses `mailto:`; an email was not sent.

The site has not been pushed to GitHub or publicly deployed. The included Pages workflow is manual. The cloud configuration draft stores installation and startup instructions; the user must review/save and publish the environment separately from deploying the website.
