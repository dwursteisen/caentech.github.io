# Caen.tech Development Instructions

```bash
npm run dev        # start dev server (http://localhost:4321)
npm run build      # production build → dist/
npm run preview    # preview the production build locally
```

Stack: npm, ESM, TypeScript, Astro 6, Zod.

The site is fully static (Astro, static output). Content lives in `src/data/*.json` and is validated by Zod schemas in `src/content.config.ts`.

Always ignore `.plans` and `.local` directories when searching the codebase.

## Docfront - Seek Documentation and Skills

**Before any investigation or code exploration**, run `npm run docfront` to list the documentation index. This is mandatory for every task — do not skip it. Browse relevant subdirectories (`npm run docfront -- --dir topic-a --dir topic-b/sub-topic-c`) or list everything (`npm run docfront -- --recursive`).

ALWAYS check for available **skills** and use them before doing anything else.

## AlignFirst - Ticket ID

_Ticket ID_: Format is numeric. Use the ticket ID if explicitly provided. Otherwise, deduce it from the current branch name (no confirmation needed). If the branch name is unavailable, get it via `git branch --show-current`. Only ask the user as a last resort.
