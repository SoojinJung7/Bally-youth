#!/usr/bin/env bash
# Idempotent browser setup for headless screenshots — no root required.
# Installs Playwright (into the skill dir) + Chromium (global cache) and the
# nss libs Chromium needs, downloaded as .deb and extracted locally.
set -euo pipefail

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CACHE="$SKILL_DIR/.cache"
LIBDIR="$CACHE/libs"
mkdir -p "$CACHE"

cd "$SKILL_DIR"

# 1) Playwright node module (resolved by scripts/shoot.mjs walking up to here)
if [ ! -d node_modules/playwright ]; then
  [ -f package.json ] || npm init -y >/dev/null 2>&1
  echo "→ installing playwright (npm)…"
  npm install playwright >/dev/null 2>&1
fi

# 2) Chromium browser (cached in ~/.cache/ms-playwright; idempotent)
echo "→ ensuring Chromium is installed…"
npx --yes playwright install chromium >/dev/null 2>&1 || npx playwright install chromium

# 3) System libs without root (libnss3 → also pulls libnspr4/libnssutil3)
if [ ! -d "$LIBDIR/root" ]; then
  echo "→ downloading nss libs without root…"
  mkdir -p "$LIBDIR" && cd "$LIBDIR"
  apt-get download libnss3 libnspr4
  for d in *.deb; do dpkg-deb -x "$d" root; done
  cd "$SKILL_DIR"
fi

LDPATH="$LIBDIR/root/usr/lib/x86_64-linux-gnu"
echo ""
echo "✓ setup complete."
echo "  export LD_LIBRARY_PATH=\"$LDPATH:\$LD_LIBRARY_PATH\""
