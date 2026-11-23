# Merge notes — promo/develop-reconcile

Source: https://github.com/jozu-works/skoconnect-landing/issues/25

## Base state

- Worktree: `/home/atlas/skoconnect-landing/.worktrees/landing-promo`
- Branch: `promo/develop-reconcile`, created from `origin/develop`
- `origin/develop` at merge time: `97170936e0d342962f1aa9bd2868937a6941b0ea`
- `origin/main` at merge time: `cd39f472ae3a9087fb61c89ab56b73acfa84bce4`
- The issue's quoted heads (`fd8170d`, `0180cac`) were stale; `git fetch origin --prune` advanced both refs before the worktree was created. Divergence was still 10 ahead / 17 behind.
- Main checkout at `/home/atlas/skoconnect-landing` was left untouched (pre-existing uncommitted edits preserved).

## Merge command

```sh
git merge --no-ff origin/main -m "Merge origin/main into promo/develop-reconcile"
```

## Conflicts and resolutions

### `.github/scripts/review_gate.py` — content conflict

- Cause: duplicate severity-policy port. `develop` carried #23 (`ea14ff3`, `700d259`); `main` carried the ratified #22 (`25f2e41`). The only textual conflict was the reviewer model line: develop's long explanatory comment vs main's plain `"model": "gpt-6-luna"` line. Git auto-merged main's coverage-contract severity sentence into the same system prompt.
- Resolution: took main's version of the whole file.
  ```sh
  git checkout --theirs -- .github/scripts/review_gate.py
  git add .github/scripts/review_gate.py
  git diff --exit-code origin/main -- .github/scripts/review_gate.py
  ```
  The final diff command exited 0, so the file matches `origin/main` byte-for-byte.
- Rationale: #22 is the ratified org-wide copy per issue #25. Both sides pinned `gpt-6-luna`, so no develop-only behavior was lost.

## Auto-merged changes retained

- `.github/workflows/pr-checks.yml`: main's `Jest unit tests` job added; develop's staging smoke checks retained.
- `.github/workflows/review-gate.yml`: main's live-base-head resolution and reviewer wiring retained.
- `.github/workflows/staging-deploy.yml`: identical on develop and main (empty diff), so develop's copy was kept; no equivalent replacement needed.
- `BRIEF.md`, `README.md`, `UX-ASSESSMENT.md`, `UX-FIXES-EVIDENCE.md`, `app/page.tsx`: main's a11y/mobile-defaults and documentation updates retained.
- Develop-only `/enroll` route and iOS honest-state fixes remain present: `app/enroll/page.tsx`, `components/EnrollFallback.tsx`, `lib/redirect.ts`, `jest.config.js`, `__tests__/EnrollFallback.test.tsx`.

## Verification

Environment: Node `v22.22.2`, npm `10.9.7` (unchanged; CI workflow pins Node 24).

| Command | Exit | Result |
| --- | ---: | --- |
| `npm ci` | 0 | Added 706 packages in 6m; 20 audit findings (8 moderate, 11 high, 1 critical) reported by npm, no fixes applied |
| `npm run build` | 0 | Next.js 14.2.35 compiled; 7/7 static pages generated; `/enroll` prerendered (2.07 kB, 89.5 kB first load). Non-fatal warnings: outdated caniuse-lite and 3 font preconnect/custom-font warnings in `app/layout.tsx` |
| `npm test -- --ci` | 0 | 5 suites passed / 5 total; 32 tests passed / 32 total; 0 snapshots; 4.72 s |

Feature greps (exit 0):

```text
$ test -f app/enroll/page.tsx && echo 'PRESENT app/enroll/page.tsx'
PRESENT app/enroll/page.tsx

$ grep -n "EnrollFallback" app/enroll/page.tsx
2:import EnrollFallback from '@/components/EnrollFallback';
19:  return <EnrollFallback />;

$ grep -n "device ===" components/EnrollFallback.tsx
92:          {device === 'android' ? (
139:          ) : device === 'ios' ? (

$ grep -nE "animate-spin|Opening the SkoConnect app" components/EnrollFallback.tsx
95:                className="mx-auto mb-6 h-12 w-12 rounded-full border-[3px] border-brand-100 border-t-brand-600 animate-spin"
97:                aria-label="Opening the SkoConnect app"
100:                Opening the SkoConnect app…

$ grep -n "currently available on Android" components/EnrollFallback.tsx
142:                SkoConnect is currently available on Android

$ grep -n "currently available on android" __tests__/EnrollFallback.test.tsx
91:      await screen.findByText(/skoconnect is currently available on android/i),
```

The only spinner/opening-state references are at lines 95-100, inside the Android branch beginning at line 92. The iOS branch begins at line 139 and contains the honest-state copy at line 142, so the fake opening spinner is absent from iOS. The same behavior is asserted by `__tests__/EnrollFallback.test.tsx` and passed in the Jest run.
