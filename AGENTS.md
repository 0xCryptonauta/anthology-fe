# AGENTS.md

See `CLAUDE.md` for tech stack, commands, and architecture overview. This file adds
repo-specific gotchas and patterns that are easy to miss.

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
- **Merge**: Use `git merge --no-ff` into dev to preserve branch topology.
- **Pre-existing TS errors**: Verify no NEW errors were introduced when
  changing code. Run `bun run tsc --noEmit | grep -c "^src"` and compare
  against the baseline of 12.
