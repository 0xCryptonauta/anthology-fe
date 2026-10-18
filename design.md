# Anthology — Design Source of Truth

The single, centralized reference for visual design, components and interaction
rules. When a design decision changes in the code, update this file in the same
change. If something here conflicts with the code, the code wins — then fix
this file.

## Principles

- **Dark-first.** The app is designed on dark surfaces; light surfaces exist
  only for content cards and modal panels.
- **Plain, user-facing copy (ELI10).** No developer jargon in the UI — say
  "Memory (Anthologies)", not "store/cache/service worker".
- **App voice.** The app speaks as itself or to "you" — no first-person plural
  ("we", "our", "us").
- **Color semantics:** accent cyan = interactive/selected · red = destructive ·
  green = neutral toggle actions.
- **No emojis for actions.** Action controls use the SVG icon set (see Icons).
- **Minimal chrome.** Small labels, quiet secondary text, color reserved for
  meaning.

## Colors

| Role | Value | Where |
|---|---|---|
| Page background | `#242424` (+ pattern classes) | `index.css`, `RootView` |
| Accent (base) | `#06b6d4` | badges, `border-sky-500/40` glows |
| Accent on light surfaces | `#0891b2` | selected anthology (light variant) |
| Accent on dark surfaces | `#22d3ee` | selected anthology (dark variant) |
| Danger / destructive | `red` / `#dc2626` | delete buttons, validation borders |
| Neutral toggle (green) | `rgb(143 200 129)` | "Anthology Info" button |
| Dark surface | `#161b22` | banner fallback, search input |
| Embed box | `#1a1a2e` | click-to-play placeholders |
| Light card | `#f9f9f9` | memoir cards |
| Light panel | `#f1f5f9` | selector panel (light variant) |
| Dark panel (translucent) | `rgba(255,255,255,0.06)` | selector panel (dark variant) |
| Muted button | `#e2e8f0` | cancel buttons |
| Text on dark | `white` | page copy |
| Text on light | `#1a1a1a` | cards, modals |
| Secondary text | `#333` / `#555` / `#666` | titles / content / meta |
| Input border | `#cbd5e1` | dropdowns, search bars |

**Category colors:** 15 neon `border-*/shadow-*` presets hashed per category
name (`UserContracts.CATEGORY_COLORS` + `getCategoryStyles`). Never hardcode a
category color.

## Typography

- Font: **Inter** (global, `index.css`).
- Sizes in use: modal titles ~1.2rem · memoir titles 1rem · memoir content
  0.9rem · meta (date/address) 12px · UI labels/inputs 14px.
- Weights: 600 for titles and the selected selector item, 500 for labels.

## Components

### Modal / sheet (`src/components/Layout/Modal.tsx`)
- Bottom sheet at all sizes; sidepanel variant for the nav (`placement="end"`).
- Height `min(600px, 90dvh)`; portrait sheets sit `40px` above the screen
  bottom.
- Portrait: content anchored to the top of the sheet (grows **downward**);
  desktop: bottom-anchored. Card capped to the sheet (`calc(100% - 6px)`).
- **Only inner content scrolls** — the frame (title, actions) stays fixed.
  Give the scrollable region `flex: 1 1 auto; min-height: 0; overflow-y: auto`.
- Closes on `pointerdown` outside (mouse/touch/pen).
- **Never nest Modals** — use an inline screen toggle (see `DownloadReduxStore`).

### Buttons
- Primary: `#111827`, white text, radius 0.75rem.
- Danger: red, white text.
- Cancel: `#e2e8f0`, dark text.

### Anthology selector (`src/components/Layout/ContractSelector.tsx`)
- Panel background: `#f1f5f9` (light variant) / `rgba(255,255,255,0.06)`
  (dark), radius 10px, padding 10px.
- Dropdowns: border `1px solid #cbd5e1`, radius 6px, padding `4px 8px`.
- Selected item: bold + accent (`#0891b2` light / `#22d3ee` dark).
- Variants: `light` (modals) · `dark` (/share). `showUserSelect={false}` hides
  the user dropdown where only local matters (/share, copy/move modal).

### Memoir cards
- Light card `#f9f9f9`, radius 8px, `0 1px 3px rgba(0,0,0,0.1)` shadow.
- Title + content centered; meta (date) centered under the content.
- Action row: icon order **edit · move · copy · share · delete**, `18px` gap,
  centered under the date. Local-only actions gated by `isLocalAnthology`.

### Reading panel (/about)
- Translucent white `rgba(255,255,255,0.35)` + `backdrop-filter: blur(6px)`,
  radius 12px, padding 24px.
- Black text (`#1a1a1a`); section headings in amber `#b45309`.

## Icons

- SVG set in `public/icons/` (`edit`, `copy`, `copy-clipboard`, `share`,
  `delete`), referenced with **absolute paths** (`/icons/…`).
- Sizes: `18px` actions · `16px` inline (wallet disconnect, buffer decline).
- Black SVGs: add `filter: invert(1)` when placed on dark surfaces.
- Remaining emojis (allowed): 📝 add memoir, 💾 download, 📲 install,
  ✅ buffer accept.

## Backgrounds (`src/styles/backgrounds.css`)

- Pattern classes + `.bg-overlay::before` 50% dark film; element must be
  `position: relative`.
- `getBgClass(key)` hashes a key to a pattern — deterministic per category or
  anthology.
- Toggle: `dapp.categoryBackgroundsEnabled`; anthology pages sync the footer via
  `dapp.anthologyFooterBgClass`.
- New patterns: add the class to `backgrounds.css` **and** `BG_CLASSES` in
  `src/utils/backgrounds.ts`.

## Interaction rules

- **One embed plays at a time** (`thirdPartyEmbeds/embedPlayback.ts` registry).
  YouTube/Vimeo/archive.org are click-to-play; Spotify remounts when another
  embed starts.
- **Search** matches words at ≥90% similarity (`SEARCH_ACCURACY` in
  `src/utils/searchMatch.ts`; 1 = exact only) — no substring matching, so
  "test" won't match "latest" or "testing". Used by the anthology filter and
  the global search.
- **Never use `<datalist>`** on mobile (system autofill can't be suppressed) —
  build custom dropdowns (`TitleEditor`).
- Destructive actions always get a confirm modal that names what is deleted
  (e.g. "Delete private memory — All anthologies"; "All its memoirs will be
  deleted too").

## Known limitations

- Facebook embeds have a ~350px minimum width (their iframe) — best effort.
- `navigator.storage` / `caches` are unavailable on insecure origins (LAN
  `http://` dev) — storage panel shows "—" there; fine on HTTPS.
- Spotify playback started inside its own iframe can't be detected (two Spotify
  players may overlap).
