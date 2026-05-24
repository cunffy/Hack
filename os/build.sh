#!/bin/bash
# ============================================================
#  Cryogram OS — Master Build Script
#  Runs inside Docker. Produces a bootable .iso in /build/output
# ============================================================
set -euo pipefail

VERSION="${CRYOGRAM_VERSION:-1.0}"
CODENAME="${CRYOGRAM_CODENAME:-obsidian}"
OUTPUT_DIR="/build/output"
LB_DIR="/build/live-build"
ASSETS_DIR="/build/assets"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║        CRYOGRAM OS  BUILD  SYSTEM        ║"
echo "║           Version ${VERSION} (${CODENAME})          ║"
echo "╚══════════════════════════════════════════╝"
echo ""

mkdir -p "$OUTPUT_DIR"

# ---- 1. Generate graphic assets ----
echo "[1/6] Generating GRUB theme and wallpaper assets..."
THEME_DIR="$LB_DIR/config/includes.chroot/usr/share/grub/themes/cryogram"
BG_DIR="$LB_DIR/config/includes.chroot/usr/share/backgrounds/cryogram"
mkdir -p "$BG_DIR"
mkdir -p "$LB_DIR/config/includes.chroot/usr/share/pixmaps"

if command -v inkscape &>/dev/null; then
  inkscape --export-type=png --export-width=1920 --export-height=1080 \
    "$ASSETS_DIR/wallpaper.svg" -o "$BG_DIR/wallpaper.png" 2>/dev/null || \
    convert -size 1920x1080 gradient:"#0a0e14"-"#0f1a2e" "$BG_DIR/wallpaper.png"
  inkscape --export-type=png --export-width=1920 --export-height=1080 \
    "$ASSETS_DIR/grub-background.svg" -o "$THEME_DIR/background.png" 2>/dev/null || \
    convert -size 1920x1080 gradient:"#0a0e14"-"#0f1a2e" "$THEME_DIR/background.png"
  inkscape --export-type=png --export-width=256 --export-height=256 \
    "$ASSETS_DIR/icon.svg" -o "$LB_DIR/config/includes.chroot/usr/share/pixmaps/cryogram.png" 2>/dev/null || \
    convert -size 256x256 xc:"#0a0e14" "$LB_DIR/config/includes.chroot/usr/share/pixmaps/cryogram.png"
else
  convert -size 1920x1080 gradient:"#0a0e14"-"#0f1a2e" "$BG_DIR/wallpaper.png"
  convert -size 1920x1080 gradient:"#0a0e14"-"#0f1a2e" "$THEME_DIR/background.png"
  convert -size 256x256 xc:"#0a0e14" "$LB_DIR/config/includes.chroot/usr/share/pixmaps/cryogram.png"
fi

bash "$THEME_DIR/generate-assets.sh"

# ---- 2. Pre-build Cryogram app in Docker container ----
# Building inside the live-build chroot requires downloading Electron + compiling
# C++ native addons in a restricted environment. We build here in Docker (full
# tools, reliable network) and stage the output into includes.chroot.
echo "[2/6] Building Cryogram app..."

# Guard: npm must be present (Dockerfile recently added Node.js 20).
# If this errors, the image must be rebuilt: docker compose build --no-cache
if ! command -v npm &>/dev/null; then
  echo ""
  echo "ERROR: npm not found. The Dockerfile was updated to add Node.js 20."
  echo "Rebuild the image from scratch:"
  echo "  docker compose down"
  echo "  docker compose build --no-cache"
  echo "  docker compose up"
  exit 1
fi

if [ ! -d "/build/cryogram-src" ]; then
  echo "ERROR: /build/cryogram-src not found (docker-compose bind-mount missing)."
  exit 1
fi

# The bind-mount is :ro (read-only), so npm cannot write node_modules into it.
# Copy source to a writable temp workspace first.
BUILD_WS="/tmp/cryogram-build"
echo "  Copying source to writable workspace..."
rm -rf "$BUILD_WS"
mkdir -p "$BUILD_WS"
cp -r /build/cryogram-src/. "$BUILD_WS/"
# Remove any stale build artifacts that may have come from the host
rm -rf "$BUILD_WS/node_modules" "$BUILD_WS/out" "$BUILD_WS/dist"
cd "$BUILD_WS"

echo "  Installing npm dependencies (includes ~80 MB Electron binary)..."
npm install
echo "  npm install done."

echo "  Rebuilding native modules for Electron's ABI..."
# node-pty and better-sqlite3 are C++ addons; they must be compiled against
# Electron's embedded Node.js headers, not the system Node.js ABI.
npx @electron/rebuild -f -w node-pty -w better-sqlite3 2>/dev/null || \
  npx electron-rebuild   -f -w node-pty -w better-sqlite3 2>/dev/null || \
  echo "  WARNING: electron-rebuild unavailable; native modules may crash at runtime."

echo "  Building renderer / main / preload via electron-vite..."
npm run build
echo "  Build done: $(du -sh out/ | cut -f1)"

# Stage built files — live-build copies includes.chroot verbatim into the image,
# so these land at /opt/cryogram on the installed system.
CRYOGRAM_DEST="$LB_DIR/config/includes.chroot/opt/cryogram"
mkdir -p "$CRYOGRAM_DEST"

cp -r out/ "$CRYOGRAM_DEST/"
cp package.json "$CRYOGRAM_DEST/"
[ -d scripts ]   && cp -r scripts/   "$CRYOGRAM_DEST/"
[ -d resources ] && cp -r resources/ "$CRYOGRAM_DEST/"

# Only stage the Electron binary + native deps.
# Pure-JS deps (axios, zustand, framer-motion …) are rolled into out/ by
# electron-vite's rollup bundler and don't need to be in node_modules.
mkdir -p "$CRYOGRAM_DEST/node_modules"
for dep in electron node-pty better-sqlite3; do
  [ -d "node_modules/$dep" ] && cp -r "node_modules/$dep" "$CRYOGRAM_DEST/node_modules/"
done
mkdir -p "$CRYOGRAM_DEST/node_modules/.bin"
[ -e "node_modules/.bin/electron" ] && \
  cp -P "node_modules/.bin/electron" "$CRYOGRAM_DEST/node_modules/.bin/" 2>/dev/null || true

echo "  Staged: $(du -sh "$CRYOGRAM_DEST" | cut -f1) into chroot."

# ---- 3. Configure live-build ----
echo "[3/6] Configuring live-build..."
cd "$LB_DIR"
bash auto/config

# ---- 4. Copy Calamares config into chroot ----
echo "[4/6] Staging Calamares installer configuration..."
CALA_DEST="$LB_DIR/config/includes.chroot/etc/calamares"
mkdir -p "$CALA_DEST/branding"
cp /build/calamares/settings.conf "$CALA_DEST/"
cp -r /build/calamares/branding/cryogram "$CALA_DEST/branding/"

if [ -d /build/calamares/modules ]; then
  mkdir -p "$CALA_DEST/modules"
  cp -r /build/calamares/modules/. "$CALA_DEST/modules/"
fi

# ---- 5. Build the ISO ----
echo "[5/6] Building Cryogram OS ISO (this takes 30-90 minutes)..."
bash auto/build

# Always copy build.log to the host-mounted output dir for post-mortem reading
cp "$LB_DIR/build.log" "$OUTPUT_DIR/build.log" 2>/dev/null || true

# ---- 6. Rename and copy output ----
echo "[6/6] Packaging output..."
ISO_SRC=$(find "$LB_DIR" -maxdepth 1 -name "*.iso" | head -1)
if [ -z "$ISO_SRC" ]; then
  echo ""
  echo "ERROR: No ISO file found after build."
  echo ""
  echo "=== Files in $LB_DIR (top level): ==="
  ls -lah "$LB_DIR/" 2>/dev/null || true
  echo ""
  echo "=== Last 80 lines of build.log: ==="
  tail -80 "$LB_DIR/build.log" 2>/dev/null || echo "(no build.log)"
  echo ""
  echo "Full build.log has been copied to output/build.log for review."
  exit 1
fi

ISO_NAME="cryogram-os-${VERSION}-amd64.iso"
cp "$ISO_SRC" "$OUTPUT_DIR/$ISO_NAME"
sha256sum "$OUTPUT_DIR/$ISO_NAME" > "$OUTPUT_DIR/${ISO_NAME}.sha256"

SIZE=$(du -sh "$OUTPUT_DIR/$ISO_NAME" | cut -f1)

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║           BUILD COMPLETE  ✓                  ║"
echo "╠══════════════════════════════════════════════╣"
printf "║  ISO:    %-35s ║\n" "$ISO_NAME"
printf "║  Size:   %-35s ║\n" "$SIZE"
printf "║  SHA256: see %s.sha256 ║\n" "$ISO_NAME"
echo "╚══════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo "  1. Burn to USB:  sudo dd if=output/$ISO_NAME of=/dev/sdX bs=4M status=progress"
echo "     Or use:       Rufus (Windows) / Etcher (any OS)"
echo "  2. Boot the USB on your target machine"
echo "  3. Double-click 'Install Cryogram OS' on the desktop"
echo ""
