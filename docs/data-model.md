---
title: Data Model
summary: JSON content collections, their schemas, and how to edit them.
read_when:
  - adding or editing conference content (talks, speakers, sponsors)
  - modifying a Zod schema in content.config.ts
---

# Data Model

All content is stored as JSON in `src/data/` and validated by Zod schemas in `src/content.config.ts`. Every entry must include a unique `id` string.

## Collections

### site

Single entry (`caen-tech-2026`). Event metadata: date, venue address, social links, ticketing URL, contact email.

### speakers

Speaker profiles: `name`, `role`, `company`, `bio`, `photo` (image path). Optional `featured` (boolean) — featured speakers appear on the homepage.

### program

Conference schedule items. Key fields:

- `speakerIds` — array referencing speaker IDs.
- `startTime` / `endTime` — ISO datetime strings.
- `roomId` — references a room ID, or `"all"` for plenary sessions.
- `theme` — topic category (e.g. "Développement", "Écosystème").
- `level` — enum: `"débutant"`, `"intermédiaire"`, `"avancé"`.
- `type` — enum: `"conférence"`, `"atelier"`.
- `featured` — optional boolean; featured items appear on the homepage.

### rooms

Conference rooms: `name`, `seats` (capacity), `color` (CSS color used in the calendar grid).

### sponsors

Sponsors with tiered visibility: `logo`, `url`, `tier` (enum: `"gold"`, `"silver"`, `"bronze"`).

### partners

Event partners: `name`, `logo`, `url`, `description`.

### team

Organizers: `name`, `photo`, optional `contact` URL, `volunteer` boolean.

### podcasts

Episodes: `title`, `image`, `summary`, `links` (record of platform name → URL).

### faq

FAQ entries: `question`, `answer`.

## Editing Content

1. Edit the JSON file in `src/data/`.
2. Respect the schema — Astro will throw a build error on validation failure.
3. For new speakers referenced in program items, add the speaker entry first, then use its `id` in `speakerIds`.
4. Room colors appear directly in the calendar grid CSS; pick a value that contrasts well on white.
