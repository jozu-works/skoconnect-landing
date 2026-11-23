# Task: Assess + fix the SkoConnect landing page against the 375px/mobile defaults

You are working in the DEDICATED WORKTREE: `/home/atlas/worktrees/landing-ux-defaults`
(branch `lane/landing-ux-defaults`, off `main`). Do ALL reads and writes inside this
directory. No /tmp writes, no screenshots, no Playwright — render verification is the
dispatcher's job. No git commits — leave the tree dirty for review.

## Context

- This is the SkoConnect marketing landing page: Next.js (static export), source in
  `app/` + `components/`, Tailwind v4-ish config in `tailwind.config.js`.
- Founder directive (Nov 15 2026): five mobile-UX rules are now STANDING DEFAULTS for
  every surface. They are documented in your global skill
  `~/.config/opencode/skills/web-patterns-library/SKILL.md` — READ THAT SECTION FIRST
  ("375px/mobile defaults — STANDING RULES").
- Also load and apply your design skills in this order: `taste-skill` (art direction),
  then `web-patterns-library`, then `ui-design-quality`. State which skill files you read.

## Part 1 — ASSESS (write findings to `UX-ASSESSMENT.md` in the worktree)

Audit the landing page at a 375px viewport against the five defaults, plus general
mobile craft:

1. Tables → cards under 640px (any desktop-style data/table layouts on mobile?)
2. Big numbers never wrap (fee amounts, KPI-style stats, "+$X" values — nowrap +
   tabular-nums, ≤30px at 375px)
3. Inputs ≥16px (every input/select/textarea in the signup/contact forms — cite
   file:line of the current size)
4. Touch targets ≥44px on coarse pointers (all buttons, links, icon targets)
5. Fixed bottom bars pad their content (any fixed CTA/nav bar + content padding)

For each: verdict PASS/FAIL with file:line evidence, and the exact fix. Also flag any
true mobile-layout breaks you find (horizontal overflow, squashed grids) with evidence.
Keep the existing design language, brand palette, and content — this is a defaults
compliance pass, NOT a redesign.

## Part 2 — APPLY THE FIXES

Implement every FAIL from Part 1 with incremental per-file edits — NEVER whole-file
rewrites. Preserve all desktop rendering (media-query discipline: mobile rules under
`max-width` queries or `pointer: coarse` blocks only).

## Part 3 — VERIFY

- `npm run build` must exit 0 (install deps first if node_modules is missing:
  `npm install`). NOTE: node_modules may be absent in this fresh worktree — install.
- Write per-fix evidence to `UX-FIXES-EVIDENCE.md`: each fix id → the file:line you
  changed + a one-line grep-able proof (e.g. the exact CSS property added).
- End your reply with: file paths created/modified + the last 10 lines of
  `git status --short` output.

## Hard constraints

- No commits, no pushes. Working tree stays dirty.
- No dependency additions except devDeps already in package.json.
- Do not touch `app/account-deletion`, `app/data-deletion`, or
  `components/DeletionPageLayout.tsx` (legal pages — out of scope).
- If something cannot be verified without rendering, say so explicitly instead of
  claiming it.
