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
echo "║         build.sh rev 2026-05-24-v7       ║"
echo "╚══════════════════════════════════════════╝"
echo ""

mkdir -p "$OUTPUT_DIR"

# Ensure hook scripts are executable (volume mounts may drop exec bit)
find "$LB_DIR/config/hooks" -name "*.chroot" -exec chmod +x {} \; 2>/dev/null || true
find "$LB_DIR/auto" -type f -exec chmod +x {} \; 2>/dev/null || true

# Clear any stale chroot/binary state left over from a previous failed build.
# The live-build directory is volume-mounted so state persists between runs.
echo "[build] Cleaning stale live-build state..."
cd "$LB_DIR"
lb clean --chroot --binary 2>/dev/null || true
cd - >/dev/null

# Write authoritative package lists directly — overrides whatever is on disk.
# This guarantees the build works even if local files were never git-pulled.
echo "[build] Writing package lists..."
PKG_LISTS="$LB_DIR/config/package-lists"
mkdir -p "$PKG_LISTS"

cat > "$PKG_LISTS/security.list.chroot" << 'PKGEOF'
# Security tools — verified available in Debian Bookworm
nmap
masscan
netcat-openbsd
ncat
tcpdump
wireshark
tshark
ettercap-text-only
arpwatch
hashcat
john
crunch
nikto
gobuster
sqlmap
wfuzz
dirb
aircrack-ng
reaver
binwalk
foremost
scalpel
sleuthkit
autopsy
gdb
ltrace
strace
dc3dd
gddrescue
whois
dnsrecon
dnsenum
mitmproxy
sslsplit
proxychains4
lynis
chkrootkit
rkhunter
gpg
keepassxc
kleopatra
openssl
sshpass
autossh
proxytunnel
stunnel4
tor
torsocks
macchanger
python3-scapy
python3-impacket
python3-ldap3
python3-requests
python3-paramiko
python3-cryptography
python3-pycryptodome
PKGEOF

cat > "$PKG_LISTS/dev.list.chroot" << 'PKGEOF'
# Development tools
# NOTE: clang/lldb/valgrind removed — they add ~500MB and can be installed post-boot
gcc
g++
make
cmake
ninja-build
gdb
python3
python3-pip
python3-venv
python3-dev
python3-setuptools
python3-wheel
ipython3
build-essential
pkg-config
libssl-dev
libffi-dev
libbz2-dev
libreadline-dev
libsqlite3-dev
zlib1g-dev
git
git-lfs
tig
geany
docker.io
docker-compose
sqlite3
postgresql-client
default-mysql-client
jq
httpie
meld
xz-utils
tar
PKGEOF

cat > "$PKG_LISTS/desktop.list.chroot" << 'PKGEOF'
# Desktop environment — Openbox + full app suite
xorg
xserver-xorg
xserver-xorg-input-all
xserver-xorg-input-libinput
xserver-xorg-video-all
xinit
x11-utils
x11-xserver-utils
openbox
obconf
picom
lxappearance
lightdm
lightdm-gtk-greeter
lightdm-gtk-greeter-settings
network-manager
network-manager-gnome
wpasupplicant
pipewire
pipewire-pulse
pipewire-alsa
wireplumber
pavucontrol
blueman
xfce4-power-manager
xfce4-notifyd
thunar
thunar-archive-plugin
thunar-volman
gvfs
gvfs-backends
evince
eog
vlc
mousepad
geany
file-roller
flameshot
redshift
redshift-gtk
xclip
xdotool
wmctrl
rofi
dunst
feh
xarchiver
galculator
gnome-font-viewer
font-manager
xfce4-terminal
xterm
alacritty
nitrogen
lxrandr
arandr
numlockx
xautomation
libnotify-bin
zenity
yad
arc-theme
papirus-icon-theme
tint2
pasystray
cbatticon
qt5ct
qt5-style-plugins
adwaita-qt
cups
system-config-printer
hplip
printer-driver-gutenprint
fonts-liberation
fonts-freefont-ttf
fonts-dejavu
ttf-bitstream-vera
fonts-inter
fonts-noto-color-emoji
tlp
tlp-rdw
powertop
acpi
laptop-detect
ufw
gufw
gparted
copyq
i3lock
xss-lock
unclutter
brightnessctl
plymouth
plymouth-themes
libinput-tools
python3-evdev
PKGEOF

cat > "$PKG_LISTS/gaming.list.chroot" << 'PKGEOF'
# Gaming — GPU drivers, Wine, Lutris
vulkan-tools
mesa-vulkan-drivers
libvulkan1
libvulkan-dev
mesa-utils
libgl1-mesa-dri
libgles2-mesa
firmware-amd-graphics
xserver-xorg-video-amdgpu
mesa-va-drivers
xserver-xorg-video-intel
intel-media-va-driver
i965-va-driver
xserver-xorg-video-nouveau
wine
wine64
winetricks
lutris
gamemode
libgamemode0
libgamemodeauto0
mangohud
pipewire
pipewire-pulse
wireplumber
pavucontrol
joystick
jstest-gtk
ffmpeg
mesa-utils-extra
PKGEOF

cat > "$PKG_LISTS/base.list.chroot" << 'PKGEOF'
# Base system — core utilities
apt-transport-https
ca-certificates
curl
wget
gnupg
lsb-release
sudo
bash-completion
man-db
less
vim
nano
htop
btop
lsof
strace
file
tree
unzip
zip
p7zip-full
rsync
openssh-client
openssh-server
net-tools
iproute2
iputils-ping
dnsutils
traceroute
whois
socat
git
locales
tzdata
keyboard-configuration
console-setup
fonts-jetbrains-mono
fonts-noto
# Firmware — broad hardware coverage
firmware-linux
firmware-linux-free
firmware-linux-nonfree
# WiFi firmware — covers Intel, Realtek, Atheros, Broadcom adapters
firmware-iwlwifi
firmware-realtek
firmware-atheros
firmware-brcm80211
amd64-microcode
intel-microcode
PKGEOF

echo "[build] Package lists written."

# Write hook scripts from here so stale volume-mounted copies can't break the build.
HOOKS_DIR="$LB_DIR/config/hooks/normal"
mkdir -p "$HOOKS_DIR"

cat > "$HOOKS_DIR/0400-calamares.hook.chroot" << 'HOOKEOF'
#!/bin/bash
# Install Calamares graphical installer — non-fatal
set +e

echo "[calamares] Installing Calamares..."

# Install calamares only — NOT calamares-settings-debian, which ships its own
# settings.conf that conflicts with ours staged in includes.chroot.
DEBIAN_FRONTEND=noninteractive apt-get install -y calamares 2>/dev/null || \
{
  echo "deb http://deb.debian.org/debian bookworm-backports main" >> /etc/apt/sources.list
  apt-get update -qq
  DEBIAN_FRONTEND=noninteractive apt-get install -y -t bookworm-backports calamares 2>/dev/null
} || echo "[calamares] Install failed — manual install needed after boot."

cat > /usr/share/applications/install-cryogram.desktop << 'DESKTOP'
[Desktop Entry]
Name=Install Cryogram OS
Comment=Install Cryogram OS to this computer
Exec=pkexec calamares
Icon=system-software-install
Terminal=false
Type=Application
Categories=System;
DESKTOP

echo "[calamares] Done (failures are non-fatal)."
exit 0
HOOKEOF
chmod +x "$HOOKS_DIR/0400-calamares.hook.chroot"
cat > "$HOOKS_DIR/0300-cryogram.hook.chroot" << 'HOOKEOF'
#!/bin/bash
set +e

INSTALL_DIR="/opt/cryogram"

if [ ! -d "$INSTALL_DIR/out" ]; then
  echo "ERROR: Cryogram pre-built files not found at $INSTALL_DIR/out"
  exit 1
fi

# Install native Node dependencies that can't be pre-bundled.
# electron ships a large binary, node-pty and better-sqlite3 are native addons.
if command -v npm &>/dev/null; then
  echo "[cryogram] Installing native Node dependencies via npm..."
  cd "$INSTALL_DIR"
  npm install --production electron node-pty better-sqlite3 2>&1 | tail -5 || \
    echo "[cryogram] WARNING: npm install failed — app may not launch"
  cd /
else
  echo "[cryogram] WARNING: npm not found — native deps missing, app may not launch"
fi

ELECTRON_BIN="$INSTALL_DIR/node_modules/electron/dist/electron"

if [ -f "$ELECTRON_BIN" ]; then
  chmod +x "$ELECTRON_BIN"
  ln -sf "$ELECTRON_BIN" /usr/local/bin/electron
else
  echo "[cryogram] WARNING: Electron binary not found at $ELECTRON_BIN"
fi

# Python deps for security scripts
if [ -f "$INSTALL_DIR/scripts/requirements.txt" ]; then
  pip3 install -r "$INSTALL_DIR/scripts/requirements.txt" \
    --break-system-packages --quiet 2>/dev/null || true
fi

cat > /usr/local/bin/cryogram << 'LAUNCHER'
#!/bin/bash
export ELECTRON_DISABLE_SANDBOX=1
export DISPLAY="${DISPLAY:-:0}"
exec /opt/cryogram/node_modules/electron/dist/electron \
  /opt/cryogram/out/main/index.js "$@"
LAUNCHER
chmod +x /usr/local/bin/cryogram

cat > /usr/local/bin/cryogram-kiosk << 'LAUNCHER'
#!/bin/bash
export ELECTRON_DISABLE_SANDBOX=1
export DISPLAY="${DISPLAY:-:0}"
exec /opt/cryogram/node_modules/electron/dist/electron \
  /opt/cryogram/out/main/index.js --kiosk --start-maximized "$@"
LAUNCHER
chmod +x /usr/local/bin/cryogram-kiosk

cat > /usr/share/applications/cryogram.desktop << 'DESKTOP'
[Desktop Entry]
Name=Cryogram
Comment=Security Operations Platform
Exec=/usr/local/bin/cryogram
Icon=/opt/cryogram/resources/icon.png
Terminal=false
Type=Application
Categories=Security;Network;System;
StartupWMClass=cryogram
NoDisplay=true
DESKTOP

echo "[cryogram] Setup complete at $INSTALL_DIR ($(du -sh $INSTALL_DIR | cut -f1))"
exit 0
HOOKEOF
chmod +x "$HOOKS_DIR/0300-cryogram.hook.chroot"

echo "[build] Hook scripts written."

# Stage a dpkg config into the chroot that suppresses conffile prompts.
# This applies to ALL dpkg/apt operations inside the chroot (package installs,
# hook scripts, etc.) so even an old hook can't hang on a conffile conflict.
mkdir -p "$LB_DIR/config/includes.chroot/etc/dpkg/dpkg.cfg.d"
printf 'force-confold\nforce-confdef\n' \
  > "$LB_DIR/config/includes.chroot/etc/dpkg/dpkg.cfg.d/99-noconfprompt"

# Remove calamares settings.conf from includes.chroot staging so the
# package install never finds a pre-existing file to conflict with.
# A post-install hook writes our custom config after calamares is installed.
rm -f "$LB_DIR/config/includes.chroot/etc/calamares/settings.conf"

# Write post-install hook that places our settings.conf after calamares lands
cat > "$HOOKS_DIR/0401-calamares-config.hook.chroot" << 'HOOKEOF'
#!/bin/bash
set +e
echo "[calamares-config] Writing Cryogram calamares settings..."
mkdir -p /etc/calamares
cat > /etc/calamares/settings.conf << 'CONF'
# Calamares settings for Cryogram OS installer
---
modules-search: [ local, /usr/lib/calamares/modules ]

sequence:
  - show:
    - welcome
    - locale
    - keyboard
    - partition
    - users
    - summary
  - exec:
    - partition
    - mount
    - unpackfs
    - machineid
    - fstab
    - locale
    - keyboard
    - localecfg
    - users
    - displaymanager
    - networkcfg
    - hwclock
    - services-systemd
    - bootloader-config
    - grubcfg
    - bootloader
    - packages
    - luksbootkeyfile
    - plymouthcfg
    - initramfs
    - removeuser
    - umount
  - show:
    - finished

branding: cryogram
prompt-install: false
dont-chroot: false
oem-setup: false
disable-cancel: false
disable-cancel-during-exec: false
quit-at-end: false
CONF
echo "[calamares-config] Done."
exit 0
HOOKEOF
chmod +x "$HOOKS_DIR/0401-calamares-config.hook.chroot"
echo "[build] Calamares config hook written."

# Fix skel timing: write a hook that copies /etc/skel to /home/cryogram
# AFTER all other hooks have populated skel. The configure-system hook
# creates the user early (before skel is filled), so the home dir misses
# the openbox autostart, GTK theme, and other per-user configs.
cat > "$HOOKS_DIR/0510-apply-skel.hook.chroot" << 'HOOKEOF'
#!/bin/bash
set +e
echo "[skel] Applying /etc/skel to /home/cryogram..."
rsync -a --ignore-existing /etc/skel/. /home/cryogram/
chown -R cryogram:cryogram /home/cryogram/
echo "[skel] Done."
exit 0
HOOKEOF
chmod +x "$HOOKS_DIR/0510-apply-skel.hook.chroot"
echo "[build] Skel apply hook written."

cat > "$HOOKS_DIR/0512-hardware-support.hook.chroot" << 'HOOKEOF'
#!/bin/bash
set +e

# Enable pipewire/wireplumber globally so it starts for every user on login
echo "[hw] Enabling pipewire user services globally..."
systemctl --global enable pipewire.socket        2>/dev/null || true
systemctl --global enable pipewire-pulse.socket  2>/dev/null || true
systemctl --global enable wireplumber.service    2>/dev/null || true

# Backlight udev rule — allows cryogram user to control brightness
# without sudo (brightnessctl needs write access to the sysfs node)
echo "[hw] Writing backlight udev rule..."
cat > /etc/udev/rules.d/90-backlight.rules << 'EOF'
ACTION=="add", SUBSYSTEM=="backlight", \
  RUN+="/bin/chmod 0666 /sys/class/backlight/%k/brightness", \
  RUN+="/bin/chmod 0666 /sys/class/backlight/%k/actual_brightness"
EOF

# Also grant via group membership (belt and suspenders)
groupadd -f video 2>/dev/null || true
usermod -aG video cryogram 2>/dev/null || true

# Input group for libinput-gestures
groupadd -f input 2>/dev/null || true
usermod -aG input cryogram 2>/dev/null || true

echo "[hw] Hardware support configured."
exit 0
HOOKEOF
chmod +x "$HOOKS_DIR/0512-hardware-support.hook.chroot"
echo "[build] Hardware support hook written."

# Brave Browser — privacy-focused Chromium, available on Linux (Opera GX is not)
cat > "$HOOKS_DIR/0520-brave.hook.chroot" << 'HOOKEOF'
#!/bin/bash
set +e
echo "[brave] Installing Brave Browser..."

curl -fsSL https://brave-browser-apt-release.s3.brave.com/brave-browser-archive-keyring.gpg \
  | gpg --dearmor -o /usr/share/keyrings/brave-browser-archive-keyring.gpg 2>/dev/null

echo "deb [signed-by=/usr/share/keyrings/brave-browser-archive-keyring.gpg arch=amd64] \
  https://brave-browser-apt-release.s3.brave.com/ stable main" \
  > /etc/apt/sources.list.d/brave-browser-release.list

apt-get update -qq 2>/dev/null

if DEBIAN_FRONTEND=noninteractive apt-get install -y brave-browser 2>/dev/null; then
  echo "[brave] Brave Browser installed."
  # Set as default browser
  update-alternatives --set x-www-browser /usr/bin/brave-browser 2>/dev/null || true
  xdg-settings set default-web-browser brave-browser.desktop 2>/dev/null || true
else
  echo "[brave] Install failed — run 'sudo apt install brave-browser' after boot."
fi

exit 0
HOOKEOF
chmod +x "$HOOKS_DIR/0520-brave.hook.chroot"
echo "[build] Opera GX hook written."

# Plymouth boot theme — Cryogram branded, dark + teal (non-fatal)
cat > "$HOOKS_DIR/0530-plymouth-theme.hook.chroot" << 'HOOKEOF'
#!/bin/bash
set +e
echo "[plymouth] Installing Cryogram boot theme..."

THEME_DIR="/usr/share/plymouth/themes/cryogram"
mkdir -p "$THEME_DIR"

# Generate assets with ImageMagick
W=1920; H=1080

# Background
convert -size "${W}x${H}" gradient:"#070b11-#050810" \
  "$THEME_DIR/bg.png" 2>/dev/null || \
  convert -size "${W}x${H}" xc:"#070b11" "$THEME_DIR/bg.png" 2>/dev/null || true

# Progress bar track
convert -size "560x3" xc:"#1a2840" "$THEME_DIR/track.png" 2>/dev/null || true

# Progress bar fill (cyan → purple gradient)
convert -size "560x3" gradient:"#00d4ff-#bb88ff" "$THEME_DIR/fill.png" 2>/dev/null || true

# Spinner dot
convert -size "8x8" xc:none \
  -fill "#00d4ff" -draw "circle 4,4 4,0" \
  "$THEME_DIR/dot.png" 2>/dev/null || true

# Wordmark — white-on-transparent "CRYOGRAM"
convert -size "480x80" xc:"#070b11" \
  -fill "#00d4ff" \
  -font DejaVu-Sans-Bold -pointsize 54 -gravity center \
  -draw 'text 0,0 "CRYOGRAM"' \
  "$THEME_DIR/wordmark.png" 2>/dev/null || true

# Plymouth .script file
cat > "$THEME_DIR/cryogram.script" << 'SCRIPT'
# Cryogram OS Plymouth theme
Window.SetBackgroundTopColor(0.027, 0.043, 0.067);
Window.SetBackgroundBottomColor(0.020, 0.031, 0.050);

bg      = Image("bg.png");
bg_s    = Sprite(bg);       bg_s.SetX(0); bg_s.SetY(0); bg_s.SetZ(-1);

logo    = Image("wordmark.png");
logo_s  = Sprite(logo);
logo_s.SetX((Window.GetWidth()  - logo.GetWidth())  / 2);
logo_s.SetY((Window.GetHeight() * 0.40));

track   = Image("track.png");
track_s = Sprite(track);
track_s.SetX((Window.GetWidth() - track.GetWidth()) / 2);
track_s.SetY(Window.GetHeight() * 0.68);
track_s.SetOpacity(0.3);

fill_full = Image("fill.png");
fill_s  = Sprite();
fill_s.SetX((Window.GetWidth() - track.GetWidth()) / 2);
fill_s.SetY(Window.GetHeight() * 0.68);

dot_img = Image("dot.png");
num_dots = 12;
dots = [];
for (i = 0; i < num_dots; i++) {
    s = Sprite(dot_img);
    s.SetZ(2);
    dots[i] = s;
}

angle   = 0;
radius  = 30;
cx      = Window.GetWidth() / 2;
cy      = Window.GetHeight() * 0.55;
progress = 0;

fun RefreshCallback() {
    angle = (angle + 0.09) % (2 * 3.14159265);
    for (i = 0; i < num_dots; i++) {
        a = angle + (i * 2 * 3.14159265 / num_dots);
        x = cx + Math.Cos(a) * radius;
        y = cy + Math.Sin(a) * radius;
        dots[i].SetX(x - dot_img.GetWidth()  / 2);
        dots[i].SetY(y - dot_img.GetHeight() / 2);
        opacity = (num_dots - i - 1) / num_dots;
        dots[i].SetOpacity(opacity * opacity * 0.9);
    }
    if (progress > 0.01) {
        fw = Math.Max(2, fill_full.GetWidth() * progress);
        scaled = fill_full.Scale(fw, fill_full.GetHeight());
        fill_s.SetImage(scaled);
    }
}
Plymouth.SetRefreshFunction(RefreshCallback);

fun BootProgressCallback(duration, p) { progress = p; }
Plymouth.SetBootProgressFunction(BootProgressCallback);

fun MessageCallback(text) { }
Plymouth.SetDisplayMessageFunction(MessageCallback);
SCRIPT

# Plymouth descriptor
cat > "$THEME_DIR/cryogram.plymouth" << 'PLYDESC'
[Plymouth Theme]
Name=Cryogram
Description=Cryogram OS Boot Theme
ModuleName=script

[script]
ImageDir=/usr/share/plymouth/themes/cryogram
ScriptFile=/usr/share/plymouth/themes/cryogram/cryogram.script
PLYDESC

# Activate the theme
plymouth-set-default-theme cryogram 2>/dev/null || true
update-initramfs -u -k all 2>/dev/null || true
echo "[plymouth] Cryogram theme installed."
exit 0
HOOKEOF
chmod +x "$HOOKS_DIR/0530-plymouth-theme.hook.chroot"
echo "[build] Plymouth theme hook written."

# Cryogram OS Session — makes Cryogram the entire UI, not an app on a desktop.
# Creates a dedicated X session, configures LightDM autologin, sudoers power rules.
cat > "$HOOKS_DIR/0545-cryogram-os-session.hook.chroot" << 'HOOKEOF'
#!/bin/bash
set -e
echo "[session] Configuring Cryogram OS dedicated session..."

# ── 1. Session launcher script ────────────────────────────────────────────
# This script IS the desktop session. LightDM runs it after autologin.
# Cryogram is the only application; openbox is an invisible WM backend.
cat > /usr/local/bin/cryogram-session << 'SESSION'
#!/bin/bash
export DISPLAY="${DISPLAY:-:0}"
export HOME="${HOME:-/home/cryogram}"
export XDG_SESSION_TYPE=x11
export XDG_CURRENT_DESKTOP=Cryogram

# Paint the screen dark immediately — eliminates white flash before Electron loads
xsetroot -solid '#070b11' 2>/dev/null || true

# Disable X11 power management and screensaver.
# Cryogram handles its own lock screen and session management.
xset s off 2>/dev/null || true
xset s noblank 2>/dev/null || true
xset -dpms 2>/dev/null || true

# Lightweight GPU compositor — Electron uses GPU compositing and needs a compositor
# for proper transparency/shadows. Fall back to software renderer if GPU fails.
picom --backend glx --vsync --no-fading-openclose --daemon 2>/dev/null || \
  picom --backend xrender --daemon 2>/dev/null || true

# Openbox as invisible WM backend — provides the EWMH/ICCCM window management
# that Electron expects. All user-facing features are disabled via config.
openbox --config-file /etc/xdg/openbox/cryogram-rc.xml &
WM_PID=$!

# Hide cursor when idle — security OS aesthetic
unclutter -root -idle 5 -noevents 2>/dev/null &

# ── Launch Cryogram OS shell ──────────────────────────────────────────────
# Auto-restart on crash (exit non-zero). Exit 0 = clean shutdown/update,
# which triggers session end via systemctl restart display-manager.
while true; do
  /usr/local/bin/cryogram
  STATUS=$?
  [ $STATUS -eq 0 ] && break
  sleep 1  # brief pause to prevent crash-loop thrashing
done

# Session ending — kill the WM
kill $WM_PID 2>/dev/null || true
SESSION
chmod +x /usr/local/bin/cryogram-session

# ── 2. X session descriptor ───────────────────────────────────────────────
mkdir -p /usr/share/xsessions
cat > /usr/share/xsessions/cryogram.desktop << 'XSESSION'
[Desktop Entry]
Name=Cryogram OS
Comment=Cryogram Security Operating System
Exec=/usr/local/bin/cryogram-session
TryExec=/usr/local/bin/cryogram
Type=Application
DesktopNames=Cryogram
X-LightDM-DesktopName=Cryogram
XSESSION

# ── 3. Minimal openbox config ─────────────────────────────────────────────
# No keybindings, no decorations, no taskbar — just EWMH compliance.
mkdir -p /etc/xdg/openbox
cat > /etc/xdg/openbox/cryogram-rc.xml << 'OBCONF'
<?xml version="1.0" encoding="UTF-8"?>
<openbox_config xmlns="http://openbox.org/3.4/rc">
  <resistance>
    <strength>0</strength>
    <screen_edge_strength>0</screen_edge_strength>
  </resistance>
  <focus>
    <followMouse>no</followMouse>
    <focusNew>yes</focusNew>
    <focusLast>yes</focusLast>
  </focus>
  <placement>
    <policy>Smart</policy>
  </placement>
  <theme>
    <name>Clearlooks</name>
    <titleLayout></titleLayout>
  </theme>
  <keyboard>
    <!-- No keybindings — Cryogram registers global shortcuts via Electron -->
  </keyboard>
  <mouse>
    <context name="Root">
      <!-- No right-click menu on root window — Cryogram is fullscreen anyway -->
    </context>
    <context name="Desktop">
    </context>
  </mouse>
  <applications>
    <application class="*">
      <decor>no</decor>
      <border>no</border>
      <skip_taskbar>yes</skip_taskbar>
      <skip_pager>yes</skip_pager>
    </application>
  </applications>
</openbox_config>
OBCONF

# ── 4. LightDM autologin into the Cryogram session ───────────────────────
# No greeter is shown. The OS boots directly into Cryogram (just like macOS).
mkdir -p /etc/lightdm/lightdm.conf.d
cat > /etc/lightdm/lightdm.conf.d/50-cryogram.conf << 'LDMCONF'
[Seat:*]
# Boot directly into the Cryogram OS session — no login screen
autologin-user=cryogram
autologin-user-timeout=0
user-session=cryogram
# Keep the greeter configured for if autologin ever fails (fallback only)
greeter-session=lightdm-gtk-greeter
LDMCONF

# ── 5. Sudoers rules for power management ────────────────────────────────
# cryogram user (and its Electron process) must be able to poweroff/reboot
# without a password prompt — same as macOS/Windows power button behavior.
cat > /etc/sudoers.d/cryogram-power << 'SUDOERS'
# Cryogram OS — power management without sudo password
cryogram ALL=(ALL) NOPASSWD: /bin/systemctl poweroff, /bin/systemctl reboot, /bin/systemctl hibernate, /bin/systemctl suspend, /bin/systemctl restart lightdm, /bin/systemctl restart display-manager
SUDOERS
chmod 440 /etc/sudoers.d/cryogram-power

echo "[session] Cryogram OS session configured."
exit 0
HOOKEOF
chmod +x "$HOOKS_DIR/0545-cryogram-os-session.hook.chroot"
echo "[build] OS session hook written."

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
