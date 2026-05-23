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

# Convert SVG wallpaper → PNG
if command -v inkscape &>/dev/null; then
  inkscape --export-type=png --export-width=1920 --export-height=1080 \
    "$ASSETS_DIR/wallpaper.svg" -o "$BG_DIR/wallpaper.png" 2>/dev/null
  inkscape --export-type=png --export-width=1920 --export-height=1080 \
    "$ASSETS_DIR/grub-background.svg" -o "$THEME_DIR/background.png" 2>/dev/null
  inkscape --export-type=png --export-width=256 --export-height=256 \
    "$ASSETS_DIR/icon.svg" -o "$LB_DIR/config/includes.chroot/usr/share/pixmaps/cryogram.png" 2>/dev/null
else
  # Fallback: solid color PNG via ImageMagick
  convert -size 1920x1080 gradient:"#0a0e14"-"#0f1a2e" "$BG_DIR/wallpaper.png"
  convert -size 1920x1080 gradient:"#0a0e14"-"#0f1a2e" "$THEME_DIR/background.png"
  convert -size 256x256 xc:"#0a0e14" "$LB_DIR/config/includes.chroot/usr/share/pixmaps/cryogram.png"
fi

# Generate GRUB bitmap assets
bash "$THEME_DIR/generate-assets.sh"

# Copy wallpaper to LightDM uses
cp "$BG_DIR/wallpaper.png" "$LB_DIR/config/includes.chroot/usr/share/backgrounds/cryogram/wallpaper.png" 2>/dev/null || true

# ---- 2. Prepare Opera GX hook ----
echo "[1.5/6] Ensuring Opera GX hook is present..."
# Opera GX hook is already in hooks/normal/0350-opera-gx.hook.chroot

# ---- 3. Configure live-build ----
echo "[2/6] Configuring live-build..."
cd "$LB_DIR"
bash auto/config

# ---- 4. Copy Calamares config into chroot ----
echo "[3/6] Staging Calamares installer configuration..."
CALA_DEST="$LB_DIR/config/includes.chroot/etc/calamares"
mkdir -p "$CALA_DEST/branding"
cp /build/calamares/settings.conf "$CALA_DEST/"
cp -r /build/calamares/branding/cryogram "$CALA_DEST/branding/"

# Copy Calamares module configs
if [ -d /build/calamares/modules ]; then
  mkdir -p "$CALA_DEST/modules"
  cp -r /build/calamares/modules/. "$CALA_DEST/modules/"
fi

# ---- 5. Build the ISO ----
echo "[4/6] Building Cryogram OS ISO (this takes 30–90 minutes)..."
bash auto/build

# ---- 6. Rename and copy output ----
echo "[5/6] Packaging output..."
ISO_SRC=$(find "$LB_DIR" -name "*.iso" | head -1)
if [ -z "$ISO_SRC" ]; then
  echo "ERROR: No ISO file found after build. Check build.log for details."
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
