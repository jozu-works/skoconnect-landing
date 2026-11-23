# skoconnect-landing

Static Next.js export for the SkoConnect marketing site (Firebase Hosting).

## CI (PR Checks)

Every PR to `main`/`develop` runs:

- **Build + Smoke** — `next build` + export artifact sanity (index.html, 404.html,
  firebase.json security headers present).
- **Jest unit tests** — `__tests__/` suite with `--ci`.
- **AI review gate** — org-wide reviewer gate (see jozu-ops#83 BC5).

Wave-1 fleet CI tracking: jozu-works/jozu-ops#155.
