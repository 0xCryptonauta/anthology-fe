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
- **Accessible by default (WCAG 2.2 AA / ISO/IEC 40500:2025).** Every new
  control ships keyboard-operable with a translated `aria-label`; see the
  Accessibility section below.

## Accessibility (WCAG 2.2 AA)

- **Landmarks**: skip link (`a11y.skipToMain` → `#main-content`) in `RootView`;
  `<main id="main-content">`, `<footer>`, Bootstrap `<nav>` for the header.
- **Focus**: keyboard-only ring (`#22d3ee`, 3px) in `index.css`, **scoped to
  `@media (hover: hover) and (pointer: fine)`** so touch devices never show a
  ring; `:focus:not(:focus-visible)` removes click outlines everywhere, the
  mobile tap highlight (`-webkit-tap-highlight-color`) is disabled globally,
  and Bootstrap's blue focus glow on form controls is neutralized. Text
  inputs/selects keep the ring on desktop click (browsers treat them as
  keyboard targets — you are about to type).
- **Target size**: icon-only controls use `.icon-button` (min 24×24, centered).
- **Buttons over spans**: interactive controls are `<button type="button">`.
  Embed play overlays (YouTube/Vimeo/archive/Spotify) use
  `role="button"` + `tabIndex` + `Enter`/`Space` because they must contain an
  iframe when active.
- **Forms**: `<label htmlFor>` + `useId()` everywhere; validation uses
  `aria-invalid` + `aria-describedby`; errors/warnings use `role="alert"` /
  `role="status"`; checkboxes are wrapped in their `<label>`.
- **State**: expandable category cards and list-skin memoirs expose
  `aria-expanded`; anthology items in the selector expose `aria-pressed`.
- **Media**: every iframe has a `title`; decorative images/SVGs are
  `aria-hidden`/`alt=""` with the control carrying the accessible name.
- **Contrast**: footer text `#a1a1aa` on `#242424` (≈5.4:1); placeholders and
  `[+]/[-]` indicators use `zinc-400`/`zinc-300` on dark surfaces.
- **Tooling**: `eslint-plugin-jsx-a11y` runs in `bun run lint` (0 errors
  required); rules for keyboard events, static-element interactions, labels,
  iframe titles and alt text are errors, not warnings.

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
- Height `min(600px, 90dvh)` by default; pass `height` to override (the
  copy/move modal uses `min(700px, 90dvh)`). Portrait sheets sit `40px` above
  the screen bottom.
- Portrait: content anchored to the top of the sheet (grows **downward**);
  desktop: bottom-anchored. Card capped to the sheet (`calc(100% - 6px)`).
- **Only inner content scrolls** — the frame (title, actions) stays fixed.
  Give the scrollable region `flex: 1 1 auto; min-height: 0; overflow-y: auto`.
- Closes on `pointerdown` outside (mouse/touch/pen).
- **Never nest Modals** — use an inline screen toggle (see `DownloadReduxStore`).
- Closed modals render only their trigger; the `Offcanvas` tree and body mount
  when opened, so long memoir lists don't pay for closed sheets.

### Buttons
- Primary: `#111827`, white text, radius 0.75rem.
- Danger: red, white text.
- Cancel: `#e2e8f0`, dark text.

### Anthology selector (`src/components/Layout/ContractSelector.tsx`)
- Panel background: `#cbd5e1` (light variant) / `rgba(255,255,255,0.06)`
  (dark), radius 10px, padding 10px.
- Dropdowns: border `1px solid #94a3b8`, radius 6px, padding `4px 8px`.
- Selected item: bold + accent (`#0891b2` light / `#22d3ee` dark).
- Variants: `light` (modals) · `dark` (/share). `showUserSelect={false}` hides
  the user dropdown where only local matters (/share, copy/move modal).

### Memoir cards
- Light card `#f9f9f9`, radius 8px, `0 1px 3px rgba(0,0,0,0.1)` shadow.
- Title + content centered; meta (date) centered under the content.
- Action row: icon order **edit · move · copy · share · delete**, `18px` gap,
  centered under the date. Local-only actions gated by `isLocalAnthology`.

### Memoir loading
- List, Media, and Text skins render memoirs in chunks of 50
  (`MEMOIRS_CHUNK_SIZE`).
- A sentinel 300px below the viewport auto-loads the next 50; a visible
  **Load more** button is the keyboard/fallback control for the same action.
- A live status shows `Showing {loaded} of {total} memoirs`; when every memoir
  is mounted it changes to `All {total} memoirs loaded`.
- Search and order changes reset to the first 50; deletions clamp the window.
- JSON skin is exempt — it intentionally renders the complete anthology.

### Share sheet
- Round brand buttons (44px) with official marks from `public/icons/`
  (white glyphs): X `#000000` · WhatsApp `#25D366` · Telegram `#26A5E4` ·
  Facebook `#1877F2`. `title`/`aria-label` required; opens the platform intent
  link.

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
  YouTube/Vimeo/archive.org/Spotify are click-to-play; activating another embed
  deactivates the previous one.
- **Embeds load cheap first**: poster thumbnail + click-to-play (YouTube
  thumbnail, Vimeo/Spotify oEmbed thumbnails, archive.org image service);
  third-party scripts (Twitter, Reddit, Instagram) load only when scrolled
  into view.
- **Search** matches words by prefix ("tes" finds "test") or ≥90% similarity
  for typos (`SEARCH_ACCURACY` in `src/utils/searchMatch.ts`); no mid-word
  substring matching ("test" won't match "latest"). Used by the anthology
  filter and the global search.
- **Never use `<datalist>`** on mobile (system autofill can't be suppressed) —
  build custom dropdowns (`TitleEditor`).
- **Mobile-first control rows**: toolbars stay on a single line down to 320px —
  compact controls only (36px height, 14px font, `whiteSpace: nowrap`, 8px
  gaps, max ~3 per row). Long labels get their own line above the controls
  (`ChangeAnthologyDefaultSkin`). The skin selector labels stay in English
  (product terms: Media/Text/Json/List/Playlist) so the row never widens in
  other languages.
- **Destructive actions** always get a confirm modal that names what is deleted
  (e.g. "Delete private memory — All anthologies"; "All its memoirs will be
  deleted too").
- **Auto-fill title:** When a URL is present in Add/Edit Memoir, an "Auto-fill
  title" button fetches the media title via public oEmbed/metadata APIs.
- **Deep links & QR codes:** On-chain anthologies share via
  `/?contract=0x...` URLs (encoded in the QR code so both native phone cameras
  and the in-app scanner open the anthology directly) and can be cloned offline
  via "Save to Private Memory".

## Localization

- Built-in dictionaries: **English (`en`, source of truth) and Spanish (`es`)**
  in `src/i18n/translations.ts`. The `es` object is typed
  `Record<TranslationKey, string>` so a missing translation fails the build.
- All UI copy goes through `t("key")` from `useTranslation()`
  (`src/i18n/useTranslation.ts`). Never hardcode user-facing strings.
- Locale preference lives in `dappSlice.locale` (`"auto" | "en" | "es"`,
  persisted). `"auto"` (default) resolves from `navigator.languages`: any
  `es*` language selects Spanish, everything else falls back to English.
- The hook syncs `<html lang>` with the resolved locale, which lets the
  browser/OS offer **real-time translation** for languages without a bundled
  dictionary. Supported locales show no translate prompt.
- **`translate="no"` guards**: user-generated content (anthology titles,
  categories, subcategories, memoir titles/content, JSON dumps) must carry
  `translate="no"` so native browser translation never rewrites saved data.
- **"Memoir" is a product term** — never translate it. Every dictionary keeps
  `memoir` / `memoirs` verbatim (Spanish uses *memoir/memoirs*, not
  *recuerdo*). Same for "Anthology" as the product name.
- The language picker is `LanguageSelector` in `/settings`.

## Known limitations

- Facebook embeds have a ~350px minimum width (their iframe) — best effort.
- `navigator.storage` / `caches` are unavailable on insecure origins (LAN
  `http://` dev) — storage panel shows "—" there; fine on HTTPS.
- Spotify playback started inside its own iframe can't be detected (two Spotify
  players may overlap).
