#!/bin/bash
# Generates GRUB theme PNG assets from SVG sources using ImageMagick.
# Run this once on the build machine to produce the required .png files.
# Called automatically by the build script.
set -e

THEME_DIR="$(dirname "$0")"
cd "$THEME_DIR"

command -v convert >/dev/null 2>&1 || { apt-get install -y imagemagick; }
command -v inkscape >/dev/null 2>&1 || { apt-get install -y inkscape; }

# Background (1920x1080)
inkscape --export-type=png --export-width=1920 --export-height=1080 \
  background.svg -o background.png 2>/dev/null || \
  convert -size 1920x1080 gradient:"#0a0e14"-"#0f1a2e" background.png

# Selection highlight bar
convert -size 1x36 xc:"#0f1a2e" select_c.png
convert -size 1x36 xc:"#0f1a2e" select_e.png
convert -size 1x36 xc:"#0f1a2e" select_w.png
convert -size 1x36 gradient:"#00d4ff22"-"#00d4ff22" select_n.png
convert -size 1x36 gradient:"#00d4ff22"-"#00d4ff22" select_s.png
cp select_n.png select_nw.png
cp select_n.png select_ne.png
cp select_s.png select_sw.png
cp select_s.png select_se.png

# Scrollbar (simple)
convert -size 4x1 xc:"#1e2d40" scrollbar_frame_c.png
cp scrollbar_frame_c.png scrollbar_frame_n.png
cp scrollbar_frame_c.png scrollbar_frame_s.png
cp scrollbar_frame_c.png scrollbar_frame_e.png
cp scrollbar_frame_c.png scrollbar_frame_w.png
cp scrollbar_frame_c.png scrollbar_frame_ne.png
cp scrollbar_frame_c.png scrollbar_frame_nw.png
cp scrollbar_frame_c.png scrollbar_frame_se.png
cp scrollbar_frame_c.png scrollbar_frame_sw.png

convert -size 4x1 xc:"#00d4ff" scrollbar_thumb_c.png
cp scrollbar_thumb_c.png scrollbar_thumb_n.png
cp scrollbar_thumb_c.png scrollbar_thumb_s.png
cp scrollbar_thumb_c.png scrollbar_thumb_e.png
cp scrollbar_thumb_c.png scrollbar_thumb_w.png
cp scrollbar_thumb_c.png scrollbar_thumb_ne.png
cp scrollbar_thumb_c.png scrollbar_thumb_nw.png
cp scrollbar_thumb_c.png scrollbar_thumb_se.png
cp scrollbar_thumb_c.png scrollbar_thumb_sw.png

echo "GRUB theme assets generated."
