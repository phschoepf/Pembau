# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing website for **Pembau** (pembau.art), a cultural association in Innsbruck-Vill. Content, comments and identifiers are mostly **German**; keep it that way. The site is a single-page React app with a hand-built "folded paper" visual language (rotated frames with clip-path corner folds that unfold on click).

The app lives entirely in `pembau/`. The repo root only holds the devcontainer, license, and the occasional source PDF for content.

## Commands

Run everything from `pembau/`:

```bash
npm install
npm run dev        # Vite dev server on port 5173
npm run build      # tsc -b && vite build  → dist/
npm run preview    # serve dist/ on port 4173
npm run lint       # eslint . (flat config, TS + react-hooks + react-refresh)
```

There is no test suite.

**Build state on `main`:** `npm run build` currently fails at the `tsc -b` step because `tsconfig.app.json` has `noUnusedLocals`/`noUnusedParameters` and `LandingPage.tsx` has unused image/component imports. `npx vite build` alone succeeds. `npm run lint` also reports ~20 pre-existing errors (mostly unused vars, one `no-empty-pattern` in `menu/Head.tsx`). Don't mistake these for regressions you introduced; if you touch a file, removing its unused imports is welcome.

Deployment: `pembau/Dockerfile` (multi-stage node → nginx, SPA fallback via `nginx.conf`). `vite.config.ts` uses `base: '/'`. The `deploy`/`gh-pages` scripts and `"homepage"` in `package.json` are leftovers from an older GitHub Pages setup at `/Pembau/` — any `/Pembau/...` path still in the source is stale.

## Architecture

**Stack:** Vite 7, React 19, TypeScript, `react-router` v7, `zustand`, `react-markdown`. All styling is inline `style={{}}` plus one global `src/style.css` (typography classes like `h1dmsans`, `h1serif`, `orange`, `textframe`, `collapsetextwrapper`, and responsive `@media` breakpoints at 1920/900/824/700/670px). Fonts (DM Sans, Noto Serif) are loaded from Google Fonts in `index.html`.

**Routing / shell** (`src/App.tsx`): `BrowserRouter` with two routes — `/` → `LandingPage.tsx`, `/About/` → `AboutAktuell.tsx`. `Head`, optional `Menu` overlay, and `Foot` wrap the routes inside a `#pageswrapper` flex column (max 1920px, `gap` drives vertical rhythm). Sub-section navigation uses URL hashes (`/About/#leitbild`, `#geschichte`, `#aktuell`, `#team`, `/#ende`): each page reads `window.location.hash` in a `useEffect` and `scrollIntoView`s a ref. Add new anchor targets to that switch.

**Global state** (`src/stores/MainStore.ts`): a single zustand store holding only `menuOpen` / `contactsOpen`. Everything else is local component state.

**Layout idiom** (documented in comments in `LandingPage.tsx`): the page is a flex column of sections; sections are offset with `translate`/`rotate`/negative margins and oversized widths (`min(150%, 2000px)`, `marginLeft: -40%`) rather than absolute positioning, so the document flow stays intact. Expect and preserve this deliberately "messy" collage layout.

**Fold frame components** (`src/Components/`):
- `CollapseFramePercent` — the current one. Props: `width`/`height` (in %), `rotation`, `folds: Partial<Record<Corner, {horPercent, vertPercent, perma?}>>`, `foldColor`, `initiallyCollapsed`, `toggleOnce`. It renders children inside a `clip-path: polygon(...)` that cuts off corners; clicking unfolds non-`perma` corners. The polygon string and fold triangles are generated inside the file.
- `CollapseFrame` — same API but sized in `vw`; older, still used in places.
- `ImageFrameJPG` — even older: swaps between two pre-rendered `*Br.webp`/`*TrBl.webp` images with the fold baked in (asset suffixes `Br`, `TrBl`, `BrTl` name the folded corners).
- `CollapseText` — fetches markdown at runtime from `public/content/*Always.md` (+ optional `*Expand.md`) and renders it via `react-markdown` with a "Mehr Lesen / Weniger Lesen" toggle. Pass paths as `/content/xyz.md` (served from `public/`).
- `Carousel` — auto-loads `src/assets/about/carousel/*.webp` via `import.meta.glob`.

**Content:** long-form About texts live as markdown in `pembau/public/content/`; short structured content (e.g. the "Little future" flyer campaign) lives as typed objects in `src/content/*.ts`. Page-specific composed sections live in `src/Customframes/` (e.g. `TextFrameAussicht`, `TextFrameEndeLP`).

**Dead code to ignore:** `src/About.tsx` (superseded by `AboutAktuell.tsx`), `src/alter shit/`, `src/NiceTry/`, `src/assets/about/images.json`, and the large commented-out blocks inside pages. Don't "clean these up" unless asked; the author keeps them as reference.

## Devcontainer

`.devcontainer/` uses `docker-compose.yaml` on the image `mcr.microsoft.com/devcontainers/typescript-node:4-24-trixie` — a Node/TypeScript image, **not a Python environment**: a bare system `python3` exists but there is no `pip`, so don't plan on Python tooling or packages. It mounts `~/.claude`, `~/.claude-json`, `~/.config/gh` from the host. Ports 5173 (Vite dev) and 4173 (Vite preview) are forwarded.

`.devcontainer/.env` is committed and intentionally empty. It is the place for future non-secret variables. **Do not delete it** — `docker-compose.yaml` references it via `env_file` and the build fails without it.
