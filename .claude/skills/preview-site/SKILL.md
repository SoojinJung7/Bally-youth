---
name: preview-site
description: Launch and screenshot this static site (bally-junior.com) in a headless browser — serve it locally, drive headless Chromium via Playwright, and capture KR/EN + desktop/mobile screenshots of any element. Use to visually verify a change actually renders (footer, hero, tiles, etc.).
---

# preview-site — render & screenshot the static site

This repo is a **static site** (plain HTML/CSS/JS, served as files, deployed
to GitHub Pages). "Running" it = serve the folder, point headless Chromium at
it, and look at a screenshot. There is no build step.

## One-time setup (idempotent)

The sandbox has no browser. This script installs Playwright + Chromium and the
two system libs Chromium needs (`libnss3`, `libnspr4`) **without root**, into
this skill's gitignored `.cache/` + `node_modules/`. Safe to re-run.

```bash
bash .claude/skills/preview-site/scripts/setup-browser.sh
```

It prints the `LD_LIBRARY_PATH` you must export before running the browser
(the no-root libs live there). If `ldd` later shows *other* missing libs on a
new machine, download them the same way:
`cd .claude/skills/preview-site/.cache/libs && apt-get download <pkg> && dpkg-deb -x <pkg>.deb root`.

## Serve + screenshot

```bash
# 1) serve the repo root (poll the port; don't sleep)
python3 -m http.server 8765 >/tmp/preview.log 2>&1 & echo $! > /tmp/preview.pid
timeout 15 bash -c 'until curl -sf http://localhost:8765/ >/dev/null; do sleep 0.5; done'

# 2) drive the browser (LD_LIBRARY_PATH from setup output)
SKILL=.claude/skills/preview-site
export LD_LIBRARY_PATH="$PWD/$SKILL/.cache/libs/root/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH"
node $SKILL/scripts/shoot.mjs http://localhost:8765/ /tmp/shots .site-footer

# 3) stop the server when done
kill $(cat /tmp/preview.pid)
```

`shoot.mjs <url> <outDir> [selector]` writes three PNGs and prints any console
errors:
- `<name>_ko.png`  — desktop (1280px), Korean
- `<name>_en.png`  — desktop, after clicking the `#langBtn` KR/EN toggle
- `<name>_mobile.png` — 390px mobile, Korean

`<name>` is derived from the selector (e.g. `.site-footer` → `footer`). Pass a
different selector to shoot another component (`.hero`, `#worksGrid`, etc.), or
`body` for the whole page. Then **Read the PNGs** — a blank frame means it
failed to launch.

## Notes / gotchas
- The site blocks right-click and image drag (`assets/i18n.js`) — that's
  expected, not an error.
- Language is a client-side toggle: every translatable node has `data-en`;
  clicking `#langBtn` (class `.lang`) swaps ko⇄en. `shoot.mjs` uses this.
- Tiles/news render async via `script.js` after a `fetch`; `shoot.mjs` waits on
  `networkidle` + the selector, so dynamic content is captured.
- `.cache/` and `node_modules/` are gitignored (Chromium ~150MB) — never commit
  them.
