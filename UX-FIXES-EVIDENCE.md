# UX Fixes — Evidence

Companion to `UX-ASSESSMENT.md`. All fixes are in `app/page.tsx` (only file modified by the
fix pass). All mobile-specific rules live under `@media (pointer: coarse)` — desktop
(fine-pointer) rendering is unchanged. `npm run build` exit 0 (Next.js static export, 6/6
pages prerendered).

| ID | Rule / finding | file:line | Grep-able proof |
|----|----------------|-----------|-----------------|
| F1 | R3: inputs ≥16px (iOS auto-zoom) | `app/page.tsx:200` | `color: '#fff', fontSize: 16, outline: 'none'` (was `fontSize: 14`) — applies to all 4 inputs + textarea via `inputStyle` spread |
| F2a | R3: autocomplete/enter hints | `app/page.tsx:240` | `autoComplete="organization" enterKeyHint="next"` |
| F2b | R3: autocomplete/enter hints | `app/page.tsx:244` | `autoComplete="name" enterKeyHint="next"` |
| F2c | R3: autocomplete/enter hints | `app/page.tsx:248` | `autoComplete="email" inputMode="email"` |
| F2d | R3: autocomplete/enter hints | `app/page.tsx:252` | `type="tel" autoComplete="tel" inputMode="tel"` |
| F3a | R4: modal close ≥44px | `app/page.tsx:506` + `:222` | CSS `.lp-close-btn { width: 44px; height: 44px; }` inside `@media (pointer: coarse)` (`:505`); class on the `×` button |
| F3b | R4: Google Play badges ≥44px | `app/page.tsx:507` + `:720`, `:1090` | CSS `.lp-play-badge { min-height: 44px; }`; class on both badge links |
| F3c | R4: persona Sign In ≥44px | `app/page.tsx:508` + `:928` | CSS `.lp-signin-link { min-height: 44px; }`; class on the link |
| F3d | R4: support mailto ≥44px | `app/page.tsx:509` + `:1108` | CSS `.lp-mailto { display: inline-flex; align-items: center; min-height: 44px; padding: 0 8px; }` |
| F3e | R4: footer links ≥44px | `app/page.tsx:510` + `:1147`, `:1166` | CSS `.lp-footer-link { display: inline-flex; align-items: center; min-height: 44px; }`; class on both footer link maps (Product + Company) |
| F4 | misc: footer status row wraps at 375px | `app/page.tsx:1177` | `flexWrap: 'wrap', rowGap: 4` added to the inner status group |

## Not changed (documented, intentional)

- Rule 1 (tables→cards): no `<table>` exists on the landing page — PASS/N-A, no fix.
- Rule 2 (big numbers): no numeric KPI/fee values exist — PASS/N-A, no fix.
- Rule 5 (fixed bottom bar): no fixed bottom bar exists — PASS/N-A, no fix.
- `app/globals.css:202` `.input { font-size: 0.9375rem }` (15px) left untouched: it is only
  consumed by `components/DeletionForm.tsx`, which renders only on the out-of-scope legal
  deletion pages. Flagged in the assessment for the owner of those pages.

## Rendering caveat

Per task constraints, no screenshots/Playwright were run in this worktree. The coarse-pointer
tap-target geometry and the absence of iOS focus-zoom are verified at the code level
(CSS is present and correctly scoped); final visual confirmation belongs to the dispatcher's
render pass.
