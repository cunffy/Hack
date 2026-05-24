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

# Print which command failed, for diagnosis
trap 'echo ""; echo "BUILD FAILED at line $LINENO (exit code $?)"; echo ""; exit 1' ERR

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║        CRYOGRAM OS  BUILD  SYSTEM        ║"
echo "║           Version ${VERSION} (${CODENAME})          ║"
echo "╚══════════════════════════════════════════╝"
echo ""

mkdir -p "$OUTPUT_DIR"

# Ensure hook scripts are executable (volume mounts may drop exec bit)
find "$LB_DIR/config/hooks" -name "*.chroot" -exec chmod +x {} \; 2>/dev/null || true
find "$LB_DIR/auto" -type f -exec chmod +x {} \; 2>/dev/null || true

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

# ---- 2. Stage pre-built Cryogram app into chroot ----
# The app is already built on the host (out/ exists in the source tree).
# The bind-mount is :ro which blocks writes — we read from it and write
# into the container's own filesystem (includes.chroot).
echo "[2/6] Staging Cryogram app into chroot..."

SRC="/build/cryogram-src"

if [ ! -d "$SRC" ]; then
  echo "ERROR: $SRC not found — docker-compose bind-mount missing."
  exit 1
fi

if [ ! -d "$SRC/out" ]; then
  echo "ERROR: $SRC/out not found."
  echo "The app must be built before building the ISO."
  echo "Run on the host machine first:"
  echo "  cd ~/cryogram && npm install && npm run build"
  exit 1
fi

CRYOGRAM_DEST="$LB_DIR/config/includes.chroot/opt/cryogram"
mkdir -p "$CRYOGRAM_DEST/node_modules"

# Copy pre-built electron-vite output (main, preload, renderer)
cp -r "$SRC/out/"        "$CRYOGRAM_DEST/"
cp    "$SRC/package.json" "$CRYOGRAM_DEST/"

# Copy security scripts (Python)
[ -d "$SRC/scripts" ]   && cp -r "$SRC/scripts/"   "$CRYOGRAM_DEST/"
[ -d "$SRC/resources" ] && cp -r "$SRC/resources/"  "$CRYOGRAM_DEST/"

# Copy Electron binary and the two native C++ addons.
# Pure-JS deps (axios, zustand, framer-motion, etc.) are already bundled into
# out/ by electron-vite's rollup step and don't need to be in node_modules.
for dep in electron node-pty better-sqlite3; do
  if [ -d "$SRC/node_modules/$dep" ]; then
    cp -r "$SRC/node_modules/$dep" "$CRYOGRAM_DEST/node_modules/"
    echo "  Copied $dep"
  else
    echo "  WARNING: $SRC/node_modules/$dep not found — run npm install first"
  fi
done

# .bin/electron wrapper symlink
mkdir -p "$CRYOGRAM_DEST/node_modules/.bin"
[ -e "$SRC/node_modules/.bin/electron" ] && \
  cp -P "$SRC/node_modules/.bin/electron" "$CRYOGRAM_DEST/node_modules/.bin/" 2>/dev/null || true

echo "  Staged: $(du -sh "$CRYOGRAM_DEST" | cut -f1)"

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

# Copy build.log to host-mounted output dir so it's readable after the run
cp "$LB_DIR/build.log" "$OUTPUT_DIR/build.log" 2>/dev/null || true

# ---- 6. Rename and copy output ----
echo "[6/6] Packaging output..."
ISO_SRC=$(find "$LB_DIR" -maxdepth 1 -name "*.iso" | head -1)
if [ -z "$ISO_SRC" ]; then
  echo ""
  echo "ERROR: No ISO file found after build."
  echo ""
  echo "=== Top-level files in $LB_DIR: ==="
  ls -lah "$LB_DIR/" 2>/dev/null || true
  echo ""
  echo "=== Last 80 lines of build.log: ==="
  tail -80 "$LB_DIR/build.log" 2>/dev/null || echo "(no build.log)"
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
