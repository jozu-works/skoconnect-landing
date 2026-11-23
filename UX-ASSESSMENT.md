# SkoConnect Landing Page — 375px Mobile Defaults Assessment

Date: 2026-11-15 · Worktree: `landing-ux-defaults` · Audited at a 375px viewport, code-level audit (no browser render — see verification notes).
Skills applied: `design-taste-frontend` (taste-skill), `web-patterns-library` §375px/mobile defaults, `ui-design-quality`.
Scope: `app/page.tsx` (landing), `app/globals.css`, `app/layout.tsx`. Excluded per task: `app/account-deletion`, `app/data-deletion`, `components/DeletionPageLayout.tsx`.

---

## Rule 1 — Tables → cards under 640px

**Verdict: PASS (not applicable).**

Evidence: `grep -rn "<table\|<td\|<tr" app components` → zero matches. The page renders
no desktop-style data tables. All grid content (`stats-grid`, `features-grid`,
`trust-grid`, `footer-grid`) already collapses to 1 column at ≤767px
(`app/page.tsx:586-591`) and 2 columns at ≤1023px (`app/page.tsx:545-562`). No fix needed.

## Rule 2 — Big numbers never wrap

**Verdict: PASS (not applicable — no numeric KPI/fee values on the page).**

Evidence: the "stats bar" values are emoji/symbols (`app/page.tsx:838-841`: ☁️ 🔒 📱 ✓),
not fee amounts, "+$X" values, or KPI numbers, so there is no value that can wrap a
`+`/currency sign onto its own line. No pricing figures appear anywhere on the page
(pilot = free, pricing is a mailto inquiry).

Guardrail note for future edits: when numeric KPIs are added to this page they must use
`white-space: nowrap; font-variant-numeric: tabular-nums;` and ≤30px at 375px. Not applied
here because there is nothing to bind it to.

## Rule 3 — Inputs ≥16px

**Verdict: FAIL.**

Evidence: `components/...` — the signup/contact form is `RequestAccessModal` in
`app/page.tsx`. The shared input style is:

- `app/page.tsx:197-201` — `inputStyle = { ..., fontSize: 14, ... }` → **14px < 16px**,
  triggers iOS Safari auto-zoom on focus.
- Affected: text inputs at `app/page.tsx:240, 244, 248, 252` and the textarea at
  `app/page.tsx:256` (spreads `inputStyle`).

Fix (applied in Part 2):
- `fontSize: 14` → `16` in `inputStyle` (fixes all 5 fields at once).
- Add correct `autoComplete` / `inputMode` attributes per field (organization, name,
  email, tel).

Observation (no change): `app/globals.css:202` defines a global `.input` utility at
`0.9375rem` (15px) — but it is only consumed by `components/DeletionForm.tsx`, which is
used exclusively by the out-of-scope legal deletion pages. Bumping it would change legal
pages we were told not to touch, so it is left as-is and flagged here.

## Rule 4 — Touch targets ≥44px on coarse pointers

**Verdict: PARTIAL FAIL.**

Already passing:
- `.btn-teal`, `.btn-ghost-white`, `.p-tab` have `min-height: 44px` (`app/page.tsx:498-502`).
- Hero primary/secondary CTAs ≈48px tall (`app/page.tsx:700, 703`).
- Modal submit and Done buttons ≈45-47px (`app/page.tsx:231, 261`).
- Nav "Sign In" link and nav links are hidden at ≤640px/≤768px (`hidden sm:block`,
  `hidden md:flex` — `app/page.tsx:645, 657`), so they need no mobile target.
- Hero/final Play badges and persona Sign In are borderline (38-40px) → fixed below.

Failing on coarse pointers:
- **Footer links** (`app/page.tsx:1137, 1156`): 14px inline text, no min-height → ~17px tap target. FAIL.
- **Modal close "×"** (`app/page.tsx:222`): 22px glyph, no padding box → ~24px target. FAIL.
- **Google Play badge links** (`app/page.tsx:709-712, 1079-1081`): `padding: 8px 16px 8px 12px` + 22px icon → ~38px height. FAIL (borderline).
- **Persona "Sign In →"** (`app/page.tsx:919`): `padding: 11px 22px` → ~40px. FAIL (borderline).
- **Support mailto link** (`app/page.tsx:1096-1100`): 13px inline text link → ~17px target. FAIL.

Fix (applied in Part 2): a single `@media (pointer: coarse)` block (desktop/fine-pointer
rendering untouched) giving all of the above ≥44px targets.

## Rule 5 — Fixed bottom bars pad their content

**Verdict: PASS (not applicable).**

Evidence: the only `position: fixed` element is the top nav (`app/page.tsx:620`) and the
modal backdrop (`app/page.tsx:215`); there is no fixed bottom CTA/nav bar. Hero clears
the fixed nav explicitly (`padding-top: 106px` at ≤767px, `app/page.tsx:576-578`). Nothing
to pad.

---

## Other mobile-layout findings

1. **Footer legal/status row inner flex never wraps** — `app/page.tsx:1167`: the right-hand
   group ("Hosted on Google Cloud Firebase infrastructure · All systems operational") is a
   non-wrapping flex; on 375px the outer row wraps the group onto its own line but the
   group itself then wraps *text* mid-span, producing an awkward two-line stack. Minor FAIL →
   add `flexWrap: 'wrap'` to the inner group (desktop unaffected).
2. No horizontal-overflow sources found: every fixed-pixel decoration (orbs, dot grid) sits
   inside `overflow: hidden` sections (`app/page.tsx:666, 1059`), the hero-right column with
   pixel-positioned cards is removed ≤767px (`app/page.tsx:583-585`), and `.lp` sets
   `overflow-x: hidden` (`app/page.tsx:308`).
3. `viewport` meta: Next.js App Router emits the default `width=device-width, initial-scale=1`
   automatically for `app/layout.tsx` (no manual export needed). OK.

---

## Fix list (implemented in Part 2)

| ID | Rule | Fix |
|----|------|-----|
| F1 | R3 | `inputStyle` fontSize 14 → 16 (`app/page.tsx:200`) |
| F2 | R3 | autocomplete/inputMode attributes on the 4 inputs |
| F3 | R4 | coarse-pointer ≥44px targets: footer links, modal ×, Play badges, persona Sign In, mailto |
| F4 | misc | footer status row inner group gets `flexWrap: 'wrap'` |

## Verification note

Per task constraints this assessment is a **code-level audit** (no Playwright/screenshots
permitted here). Mobile rendering behavior of the applied fixes (e.g. actual tap-target
geometry, absence of iOS zoom) must be confirmed by the dispatcher's render pass; the
build-compilation check is done locally in Part 3.
