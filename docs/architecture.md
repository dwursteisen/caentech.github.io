---
title: Architecture Overview
summary: Static Astro site structure — pages, components, layouts, data, styles, and scripts.
read_when:
  - onboarding onto the project
  - trying to understand how the codebase is organized
---

# Architecture Overview

Caen.Tech is a fully static Astro 6 site for a one-day tech conference in Caen, Normandy. It produces plain HTML/CSS/JS with no server runtime.

## Key Directories

```
src/
├── pages/          File-based routing (one .astro file per page)
├── components/     Reusable Astro components
├── layouts/        BaseLayout.astro — wraps all pages with Header + Footer
├── data/           JSON content files (speakers, program, sponsors…)
├── scripts/        Vanilla TypeScript (modal.ts, nav.ts)
└── styles/         Global CSS + modular stylesheets
```

## Pages

| Route | File | Purpose |
| ------- | ------ | --------- |
| `/` | `index.astro` | Homepage with hero, teasers, CTA |
| `/programme` | `programme.astro` | Full schedule grid + speaker list |
| `/sponsors` | `sponsors.astro` | Sponsor tiers |
| `/infos-pratiques` | `infos-pratiques.astro` | Venue, FAQ, practical details |
| `/podcasts` | `podcasts.astro` | Podcast episodes |
| `/a-propos` | `a-propos.astro` | About the event and team |
| `/contact` | `contact.astro` | Contact info |

## Data Flow

Content lives in `src/data/*.json`. Astro Content Collections (defined in `src/content.config.ts`) load and validate them with Zod schemas. Components fetch data via `getCollection()` and `getEntry()`:

```ts
const speakers = await getCollection("speakers");
const site = await getEntry("site", "caen-tech-2026");
```

## Component Patterns

- Pages compose components inside `BaseLayout`.
- Components fetch their own data (no prop-drilling from pages for collections).
- Styling uses a mix of global Pleasant BEM blocks (`.Section`, `.Grid`, `.Card`) and component-scoped `<style>` blocks.
- Interactive behavior is handled by two vanilla scripts loaded in components: `nav.ts` (mobile menu toggle) and `modal.ts` (talk detail dialog).

## Configuration

- `astro.config.ts` — site URL (`https://caen.tech`), static output.
- `tsconfig.json` — extends `astro/tsconfigs/strict`.
- `content.config.ts` — 9 content collections with Zod schemas.
