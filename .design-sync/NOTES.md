# design-sync notes — Longevo

Repo-specific gotchas for future syncs. Read this before re-syncing.

## Repo shape
- This is a **Next.js application**, not a packaged component library. There is no `dist/`;
  the converter runs in **synth-entry mode** from `src/components/ui/*.tsx` (`cfg.srcDir`).
- `node_modules/longevo` is a **symlink to the repo root**, created so the converter's
  `PKG_DIR = node_modules/<pkg>` resolves to the repo (a workspace linker would do this).
  It is gitignored — **recreate it on a fresh clone** before building:
  `ln -sfn "$(pwd)" node_modules/longevo`
- Components are shadcn-style Tailwind + CVA. Import in previews from `'longevo'`
  (shimmed to `window.Longevo`); `@/lib/utils` resolves via `cfg.tsconfig` paths.

## CSS is compiled, not raw
- `cfg.cssEntry` points at `.design-sync/compiled.css` (gitignored, regenerated).
- `cfg.buildCmd` compiles Tailwind (`.design-sync/tailwind.compile.cjs`) scanning
  `src/**` AND `.design-sync/previews/**`. **Always run `buildCmd` before `package-build`**
  whenever previews introduce new utility classes, or those classes render unstyled.

## base-ui / Tailwind v3 variant shim (IMPORTANT)
- `Switch`, `Tabs`, and `AlertDialog` come from `@base-ui/react` v1, which is authored with
  **Tailwind v4 bare `data-*:` variant syntax** (`data-checked:`, `data-active:`, …).
  This repo pins **Tailwind v3.4**, which does not understand that syntax, so those class
  strings silently drop — the Switch renders **invisible** (no track color) without a fix.
- `tailwind.compile.cjs` registers those state attributes as v3 variants via `addVariant`
  (`BASE_UI_STATES`). This is a **build-environment shim only — it never touches the
  components.** If a base-ui component renders unstyled after an upgrade, extend that list.
- Latent component quirk (not fixed): `Tabs` root uses `data-horizontal:flex-col` but
  base-ui emits `data-orientation="horizontal"`, so it never applies. The `Tabs` previews
  force `flex-col` in their own className to get the standard tabs-on-top layout.

## Known render warns (triaged benign — do not re-chase)
- `[RENDER_THIN] AlertDialog`: "rendered height 0px". The open alert dialog portals with
  `fixed` positioning, so the container measures 0px, but the screenshot renders perfectly
  (verified visually). Benign — the card looks correct.

## Preview scope
- Authored rich previews for the 16 family roots + 10 structural leaf parts (26 total).
  The remaining ~50 sub-parts (Trigger/Portal/Overlay/Content/Item/etc.) ship as honest
  **floor cards** — functional and importable, demonstrated inside their family root's card.
- Overlay families (`Dialog`, `AlertDialog`, `Sheet`, `DropdownMenu`, `DropdownMenuLabel`)
  render their **open** state via `defaultOpen`/`modal={false}` and use
  `cfg.overrides.<Name> = {cardMode: single, viewport}` so the portal renders inside the card.
- `Card`, `Tabs` use `cardMode: column` (stories wider than a grid cell).

## Re-sync risks (what can silently go stale)
- The `node_modules/longevo` symlink and `.design-sync/node_modules` are gitignored —
  recreate on a fresh clone.
- `tailwind.compile.cjs` **duplicates the theme** from `tailwind.config.ts`. If the app's
  tokens/colors change, update the compile config to match (or the bundle tokens drift).
- Previews import realistic Longevo domain content (clinic names, ratings) — pure
  composition, not tied to app data, so they don't rot with app changes.
- base-ui version bumps may change emitted `data-*` attributes; re-verify Switch/Tabs render
  after upgrading `@base-ui/react`.
