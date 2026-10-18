# AGENTS.md

See `CLAUDE.md` for tech stack, commands, and architecture overview. This file adds
repo-specific gotchas and patterns that are easy to miss.

**Design system**: `design.md` (repo root) is the single source of truth for
colors, typography, components and interaction rules. Follow it for any UI work.

## Accessibility — mandatory for every change

**Every change must comply with ISO/IEC 40500:2025 (WCAG 2.2, Conformance
Level AA).** No exceptions, no "later". Follow the POUR principles:

- **Perceivable**: text contrast ≥ 4.5:1 (≥ 3:1 for large text/UI borders);
  every `<img>` gets meaningful `alt` (or `alt=""` + `aria-label` on the
  control when decorative); every `<iframe>` gets a `title`; decorative SVGs
  get `aria-hidden="true"`; use semantic landmarks (`<main id="main-content">`,
  `<footer>`, `<nav>`).
- **Operable**: all interactive controls must be real `<button type="button">`
  (preferred) or keyboard-operable (`role="button"` + `tabIndex={0}` +
  `Enter`/`Space` `onKeyDown`). Never leave a bare `<span onClick>` or
  `<div onClick>`. Modal triggers are auto-fixed by `Modal.tsx`, but new
  standalone controls must be keyboard reachable. No focus traps. Target
  size ≥ 24×24 CSS px for icon-only controls (use the `.icon-button` class).
  Never remove focus outlines without a `:focus-visible` replacement (global
  rule lives in `src/index.css`).
- **Understandable**: every form control has an explicit label — `<label
  htmlFor>` + `id` (use `useId()`), or `aria-label` when no visible label
  exists. Validation errors use `aria-invalid` + `aria-describedby` and
  `role="alert"`. Dynamic status messages (toasts, inline warnings) use
  `role="status"` / `aria-live`.
- **Robust**: expandable controls expose `aria-expanded`; selected states
  expose `aria-pressed`/`aria-selected`; keep `<html lang>` synced (done by
  `useTranslation`); user-generated content keeps `translate="no"`.
- **Icon-only controls** always carry `aria-label` + `title` (both translated
  via `t("...")` — never hardcode).

**Validation (run before every commit):**
```bash
bun run lint                    # must be 0 jsx-a11y errors
bun run tsc --noEmit | grep -c "^src"   # must stay at the 12-error baseline
bun run build                   # must pass
```
`eslint-plugin-jsx-a11y` (recommended + strict keyboard/label rules) is wired
into `eslint.config.js`; treat any new violation as a blocker.

## Gotchas

- **Pre-existing TS errors**: 12 errors in `AnthologyWhitelistedUsers`,
  `MemoirBuffer`, `GetUserContracts`, `IsWhitelisted`. Do not fix unless asked.
- **Never use `<datalist>` on mobile**: iOS Safari and Android Chrome inject
  system autofill suggestions (Wallet, Location) that can't be suppressed.
  `autocomplete="off"` is ignored. Build a custom dropdown with
  `useEffect` + outside-click listener instead. See `TitleEditor.tsx`.
- **Do not nest `<Modal>` components**: Both use outside-click detection that
  conflict. Use an inline `selectionScreen` boolean state within a single Modal
  to toggle between screens. See `DownloadReduxStore.tsx`.
- **Child views must NOT set `className="bg-dark"`**: RootView provides the
  background (dark or pattern via toggle). Applying `bg-dark` in child views
  covers the parent pattern. When toggle is ON, child views should be
  transparent. See `RootView.tsx`.

## Background system (`src/styles/backgrounds.css`)

- Toggled via `dappSlice.categoryBackgroundsEnabled` (persisted to localStorage).
- `getBgClass(key)` returns `bg-overlay $PATTERN` deterministically by hash.
- `bg-overlay` creates a `::before` pseudo-element with `inset:0` and 50% dark
  film. The element itself must have `position:relative` (set by `.bg-overlay`).
  Children automatically get `z-index:1; position:relative`.
- Pattern classes (e.g., `bg-nested-triangles`, `bg-arabesque-style`) are pure
  CSS gradients — no images, no runtime cost.
- When adding a new pattern class, add it to `backgrounds.css`. If it should be
  available via `getBgClass()`, also add it to the `BG_CLASSES` array in
  `src/utils/backgrounds.ts`.

## Title format convention

Anthology titles use `[Category][Subcategory]Title` bracket notation, parsed by
`parseContractsCategories` in `src/utils/parseContractsCategories.ts`. The raw
string is stored on-chain and parsed client-side. Do not change the format.

- Two leading bracket pairs max: `[Cat]` and `[Subcat]` (optional).
- Everything after brackets (or when no brackets) becomes the display title.
- No trimming is done server-side — whitespace in brackets becomes part of the
  category key.
- The `TitleEditor` component handles structured input/output for create/edit
  flows while preserving this format internally.

## Redux and persistence

- **The entire store is persisted** to localStorage via `redux-persist` with no
  whitelist. New fields added to any slice automatically persist.
- `dappSlice` holds app settings: `factoryRpc`, `isIconToLocal`,
  `categoryBackgroundsEnabled`, `anthologyFooterBgClass`.
- `anthologyFooterBgClass` syncs anthology page backgrounds to the Footer
  (which is a sibling in RootView's grid, outside the route component tree).
  Set via `useEffect` on mount, cleared on unmount.

## Types and imports

- `MemoirContent` and `Categories` types live in `@types/common.ts` — NOT in
  `UserContracts.tsx`. They were moved there to avoid circular imports between
  `TitleEditor.tsx`, `parseContractsCategories.ts`, and `UserContracts.tsx`.
- Path aliases are defined in the root `tsconfig.json` (not `tsconfig.app.json`).
  Both `@utils/*` and `@src/utils/*` resolve to `src/utils/*`.

## Conventions

- **Package manager**: Use `bun` (not npm/yarn). `bun run <script>`.
- **Branch naming**: `feature/`, `fix/`, `hotfix/`, `docs/`, `chore/` prefixes.
- **Commits**: Conventional commits (`feat:`, `fix:`, `refactor:`). `feat:`
  bumps minor version, `fix:` bumps patch via `standard-version`.
- **Release**: `bun run release` only on `main` branch. Dry-run with
  `bun run pre-release`.
- **Merge**: Use `git merge --no-ff` into `agent/DeepSeekV4.1`; agent work does not merge to `dev` (that's the user's integration branch).
- **Pre-existing TS errors**: Verify no NEW errors were introduced when
  changing code. Run `bun run tsc --noEmit | grep -c "^src"` and compare
  against the baseline of 12.
