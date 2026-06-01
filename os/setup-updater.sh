#!/bin/bash
# Cryogram OS — apply updates and install built-in updater infrastructure.
# Invoked automatically by the one-liner:
#   sudo bash -c 'D=/opt/cryogram-src; SSL="-c http.sslCAInfo=/etc/ssl/certs/ca-certificates.crt"; \
#     update-ca-certificates --fresh 2>/dev/null || true; \
#     [ -d "$D/.git" ] && git $SSL -C "$D" pull \
#     || git $SSL clone --depth=1 -b claude/custom-security-os-URNk5 https://github.com/cunffy/Hack.git "$D"; \
#     bash "$D/os/setup-updater.sh"'
set -euo pipefail

# ── Pre-flight: time sync + SSL certs ────────────────────────────────────────
# Fix clock first — SSL cert verification fails if the clock is wrong.
# Install chrony (NTP daemon) so time stays correct automatically from now on.
if ! command -v chronyc &>/dev/null; then
  echo "  [pre] Installing chrony (NTP time sync)..."
  apt-get update -qq || true
  apt-get install -y -qq chrony || true
fi
systemctl enable chrony 2>/dev/null || true
systemctl start  chrony 2>/dev/null || true
# Force immediate step sync (don't wait for gradual slew)
chronyc makestep 2>/dev/null || true

# NetworkManager dispatcher: sync time the moment any network comes up
mkdir -p /etc/NetworkManager/dispatcher.d
cat > /etc/NetworkManager/dispatcher.d/10-cryogram-timesync << 'NMD'
#!/bin/bash
# Sync system clock whenever a network interface comes up
[ "$2" = "up" ] || exit 0
chronyc makestep 2>/dev/null || timedatectl set-ntp true 2>/dev/null || true
NMD
chmod +x /etc/NetworkManager/dispatcher.d/10-cryogram-timesync

# Ensure SSL certificates are present and the bundle is up to date
if [ ! -f /etc/ssl/certs/ca-certificates.crt ] || [ ! -s /etc/ssl/certs/ca-certificates.crt ]; then
  echo "  [pre] Installing ca-certificates..."
  apt-get install -y -qq ca-certificates || true
fi
# Always rebuild the bundle — on some Debian systems the certs are installed
# but git still reports CAfile:none until update-ca-certificates is run.
update-ca-certificates --fresh 2>/dev/null || true
# Point git at the bundle explicitly for all subsequent operations
export GIT_SSL_CAINFO=/etc/ssl/certs/ca-certificates.crt
git config --global http.sslCAInfo /etc/ssl/certs/ca-certificates.crt

SRC="$(cd "$(dirname "$0")/.." && pwd)"
DEST="/opt/cryogram"
BRANCH="claude/custom-security-os-URNk5"
REPO_URL="https://github.com/cunffy/Hack.git"

echo ""
echo "  ██████╗██████╗ ██╗   ██╗ ██████╗  ██████╗ ██████╗  █████╗ ███╗   ███╗"
echo "  ██╔════╝██╔══██╗╚██╗ ██╔╝██╔═══██╗██╔════╝ ██╔══██╗████╗ ████║"
echo "  ██║     ██████╔╝ ╚████╔╝ ██║   ██║██║  ███╗ ███████║██╔████╔██║"
echo "  ██║     ██╔══██╗  ╚██╔╝  ██║   ██║██║   ██║ ██╔══██║██║╚██╔╝██║"
echo "  ╚██████╗██║  ██║   ██║   ╚██████╔╝╚██████╔╝ ██║  ██║██║ ╚═╝ ██║"
echo "   ╚═════╝╚═╝  ╚═╝   ╚═╝    ╚═════╝  ╚═════╝  ╚═╝  ╚═╝╚═╝     ╚═╝"
echo ""
echo "  Cryogram OS — System Update & Setup"
echo "  ──────────────────────────────────────"
echo ""

# ── Ensure required X11 and audio tools are installed ────────────────────────
for pkg in xdotool wmctrl rsync pulseaudio-utils brightnessctl; do
  if ! command -v "${pkg%%-*}" &>/dev/null && ! dpkg -l "$pkg" 2>/dev/null | grep -q '^ii'; then
    echo "  [pre] Installing missing tool: $pkg ..."
    apt-get install -y -qq "$pkg" 2>/dev/null || true
  fi
done

# Ensure PipeWire's PulseAudio compatibility layer is installed for pactl to work
if command -v pipewire &>/dev/null && ! command -v pipewire-pulse &>/dev/null; then
  echo "  [pre] Installing pipewire-pulse (required for pactl volume control)..."
  apt-get install -y -qq pipewire-pulse 2>/dev/null || true
fi

# ── Sanity checks ─────────────────────────────────────────────────────────────
if [ ! -d "$DEST/out" ]; then
  echo "  ERROR: $DEST/out not found — is Cryogram OS installed at $DEST?"
  exit 1
fi
if [ ! -f "$SRC/out/main/index.js" ]; then
  echo "  ERROR: $SRC/out/main/index.js not found — source clone looks incomplete."
  exit 1
fi

# ── 1. Sync the built app files ───────────────────────────────────────────────
echo "  [1/4] Syncing app files  $SRC/out/  →  $DEST/out/ ..."
# Sync to a staging dir first so the live app files are only replaced once
# the full transfer has succeeded — prevents a partial update from breaking the OS.
STAGING=$(mktemp -d)
trap 'rm -rf "$STAGING"' EXIT

rsync -a "$SRC/out/" "$STAGING/"

# Verify the two critical entry points survived the staging copy
if [ ! -f "$STAGING/main/index.js" ] || [ ! -f "$STAGING/renderer/index.html" ]; then
  echo "  ERROR: staging copy is missing critical files — aborting."
  exit 1
fi

# Atomic swap: replace live out/ only after staging is verified complete
rsync -a --delete "$STAGING/" "$DEST/out/"
echo "        Done."

# ── 2. Install the update script ──────────────────────────────────────────────
echo "  [2/4] Installing /usr/local/bin/cryogram-update ..."
cat > /usr/local/bin/cryogram-update << UPDATER
#!/bin/bash
set -euo pipefail
BRANCH="$BRANCH"
SRC="/opt/cryogram-src"

echo "── Cryogram OS Updater ──────────────────────────"
# Ensure SSL certs are present before any HTTPS git operation
if [ ! -f /etc/ssl/certs/ca-certificates.crt ] || [ ! -s /etc/ssl/certs/ca-certificates.crt ]; then
  apt-get update -qq && apt-get install -y -qq ca-certificates
fi
update-ca-certificates --fresh 2>/dev/null || true
export GIT_SSL_CAINFO=/etc/ssl/certs/ca-certificates.crt
git config --global http.sslCAInfo /etc/ssl/certs/ca-certificates.crt

if [ ! -d "\$SRC/.git" ]; then
  echo "── First run: cloning source repository..."
  git -c http.sslCAInfo=/etc/ssl/certs/ca-certificates.crt clone --depth=1 --branch "\$BRANCH" "$REPO_URL" "\$SRC"
else
  echo "── Pulling latest changes from \$BRANCH..."
  git -C "\$SRC" -c http.sslCAInfo=/etc/ssl/certs/ca-certificates.crt fetch --depth=1 origin "\$BRANCH"
  git -C "\$SRC" reset --hard "origin/\$BRANCH"
fi

echo "── Verifying downloaded files..."
if [ ! -f "\$SRC/out/main/index.js" ] || [ ! -f "\$SRC/out/renderer/index.html" ]; then
  echo "ERROR: critical files missing after pull — aborting update."
  exit 1
fi

# Run the full setup script from the pulled source — this syncs out/, patches
# Openbox keybindings, reloads Openbox config, and restarts Electron.
# Doing it this way guarantees every update deploys ALL changes (not just JS).
echo "── Applying full system update..."
bash "\$SRC/os/setup-updater.sh"
UPDATER
chmod +x /usr/local/bin/cryogram-update
echo "        Done."

# ── 3. Write update config ────────────────────────────────────────────────────
echo "  [3/4] Writing /etc/cryogram/update.conf ..."
mkdir -p /etc/cryogram
cat > /etc/cryogram/update.conf << CONF
REPO_URL="$REPO_URL"
BRANCH="$BRANCH"
CONF

# Create /opt/cryogram-src symlink if the script ran from a different path,
# so the in-app updater:check handler can find the .git directory.
if [ "$SRC" != "/opt/cryogram-src" ] && [ ! -e /opt/cryogram-src ]; then
  ln -sf "$SRC" /opt/cryogram-src
fi
echo "        Done."

# ── SSH service — disable on a desktop security OS (stops shutdown errors) ───
# ssh.service failing on shutdown causes console errors and slows reboot.
systemctl disable ssh 2>/dev/null || true
systemctl mask    ssh 2>/dev/null || true

# ── 4. Sudoers rule ───────────────────────────────────────────────────────────
echo "  [4/4] Granting passwordless sudo for cryogram-update ..."
echo "cryogram ALL=(ALL) NOPASSWD: /usr/local/bin/cryogram-update" \
  > /etc/sudoers.d/cryogram-update
chmod 440 /etc/sudoers.d/cryogram-update
echo "        Done."

# ── Emergency right-click desktop menu ───────────────────────────────────────
cat > /etc/xdg/openbox/cryogram-menu.xml << 'OBMENU'
<?xml version="1.0" encoding="UTF-8"?>
<openbox_menu>
  <menu id="root-menu" label="Cryogram OS">
    <item label="Open Terminal">
      <action name="Execute"><execute>xterm -bg '#0a0e14' -fg '#c9d1d9' -fa 'JetBrains Mono' -fs 11</execute></action>
    </item>
    <item label="Raise Desktop">
      <action name="Execute"><execute>bash -c "xdotool search --class 'cryogram' | head -1 | xargs -r xdotool windowraise"</execute></action>
    </item>
    <separator/>
    <item label="Restart Cryogram">
      <action name="Execute"><execute>bash -c "pkill -x cryogram 2>/dev/null || pkill -9 -x cryogram"</execute></action>
    </item>
  </menu>
</openbox_menu>
OBMENU

# ── Patch openbox config (Alt+Tab keybindings + single workspace) ─────────────
OB_CONF="/etc/xdg/openbox/cryogram-rc.xml"
if [ -f "$OB_CONF" ]; then
  # Pin only the main shell window (title="CryogramShell") to the desktop layer.
  # Standalone app windows share the same WM_CLASS but must NOT be in the below
  # layer — they need to appear above normal windows. Remove any old broad rule
  # that matched all cryogram-class windows, then add the title-scoped rule.
  python3 - "$OB_CONF" << 'PYFIX'
import sys, re
path = sys.argv[1]
with open(path) as f:
    data = f.read()
# Remove any existing cryogram application rule (old or new format)
data = re.sub(r'\s*<application[^>]*class="cryogram"[^>]*>.*?</application>', '', data, flags=re.DOTALL)
# Insert the scoped rule — only matches windows with title="CryogramShell"
new_rule = ('    <application class="cryogram" title="CryogramShell">'
            '<layer>below</layer><decor>no</decor><border>no</border>'
            '<skip_taskbar>yes</skip_taskbar><skip_pager>yes</skip_pager>'
            '<desktop>all</desktop></application>')
data = data.replace('<applications>', '<applications>\n' + new_rule, 1)
with open(path, 'w') as f:
    f.write(data)
print('  [+] Openbox cryogram rule updated (title-scoped to CryogramShell)')
PYFIX
  # Enable right-click menu if not already wired up
  if ! grep -q 'cryogram-menu' "$OB_CONF"; then
    sed -i 's|<mouse>|<menu><file>/etc/xdg/openbox/cryogram-menu.xml</file></menu>\n  <mouse>|' "$OB_CONF"
    sed -i 's|<context name="Root">.*</context>|<context name="Root"><mousebind button="Right" action="Press"><action name="ShowMenu"><menu>root-menu</menu></action></mousebind></context>|' "$OB_CONF"
  fi
  # Only patch if Alt+Tab binding is missing
  if ! grep -q 'A-Tab' "$OB_CONF"; then
    echo "  [+] Patching openbox config with Alt+Tab keybindings..."
    sed -i 's|</keyboard>|  <keybind key="A-Tab"><action name="NextWindow"><dialog>icons</dialog><bar>no</bar><raise>yes</raise><allDesktops>no</allDesktops><panels>no</panels><desktop>no</desktop></action></keybind>\n    <keybind key="A-S-Tab"><action name="PreviousWindow"><dialog>icons</dialog><bar>no</bar><raise>yes</raise><allDesktops>no</allDesktops><panels>no</panels><desktop>no</desktop></action></keybind>\n  </keyboard>|' "$OB_CONF"
  fi
  # Brightness keys — force-replace every time so stale absolute-value bindings
  # (set 0 / set 100%) can't survive; always use relative +10% / 10%-.
  echo "  [+] Setting brightness keybindings (force-replace)..."
  python3 - "$OB_CONF" << 'PYFIX'
import sys, re
path = sys.argv[1]
with open(path) as f:
    data = f.read()
data = re.sub(r'\s*<keybind key="XF86MonBrightness[^"]*">.*?</keybind>', '', data, flags=re.DOTALL)
new_bindings = (
    '  <keybind key="XF86MonBrightnessUp"><action name="Execute"><execute>brightnessctl set +10%</execute></action></keybind>\n'
    '    <keybind key="XF86MonBrightnessDown"><action name="Execute"><execute>brightnessctl set 10%-</execute></action></keybind>\n'
    '  </keyboard>'
)
data = data.replace('</keyboard>', new_bindings, 1)
with open(path, 'w') as f:
    f.write(data)
print("  Brightness keybindings replaced.")
PYFIX
  # Volume keys — pactl needs XDG_RUNTIME_DIR to locate the PipeWire socket.
  # Install a tiny wrapper so every call site (openbox + shell) gets it automatically.
  cat > /usr/local/bin/cryogram-pactl << 'PACTL_WRAP'
#!/bin/bash
export XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR:-/run/user/$(id -u)}"
exec pactl "$@"
PACTL_WRAP
  chmod +x /usr/local/bin/cryogram-pactl

  # Always force-replace volume keybindings so +5% / -5% / toggle are correct.
  # Remove any existing XF86Audio bindings first (prevents duplicate or stale entries).
  echo "  [+] Setting volume keybindings (force-replace)..."
  python3 - "$OB_CONF" << 'PYFIX'
import sys, re
path = sys.argv[1]
with open(path) as f:
    data = f.read()
# Strip any existing XF86Audio* keybind blocks
data = re.sub(r'\s*<keybind key="XF86Audio[^"]*">.*?</keybind>', '', data, flags=re.DOTALL)
# Insert fresh correct bindings before </keyboard>
new_bindings = (
    '  <keybind key="XF86AudioRaiseVolume"><action name="Execute"><execute>cryogram-pactl set-sink-volume @DEFAULT_SINK@ +5%</execute></action></keybind>\n'
    '    <keybind key="XF86AudioLowerVolume"><action name="Execute"><execute>cryogram-pactl set-sink-volume @DEFAULT_SINK@ -5%</execute></action></keybind>\n'
    '    <keybind key="XF86AudioMute"><action name="Execute"><execute>cryogram-pactl set-sink-mute @DEFAULT_SINK@ toggle</execute></action></keybind>\n'
    '  </keyboard>'
)
data = data.replace('</keyboard>', new_bindings, 1)
with open(path, 'w') as f:
    f.write(data)
print("  Volume keybindings replaced.")
PYFIX
  # Ensure 4 workspaces for Super+1–4 switching
  sed -i 's|<desktops>[^<]*<number>[0-9]*</number>[^<]*</desktops>|<desktops><number>4</number></desktops>|' "$OB_CONF" 2>/dev/null || true
  if ! grep -q '<number>4</number>' "$OB_CONF"; then
    sed -i 's|<desktops>|<desktops><number>4</number>|' "$OB_CONF" 2>/dev/null || true
  fi
fi

# ── Reload Openbox config so new keybindings take effect immediately ──────────
# openbox --reconfigure sends SIGUSR2 to the running Openbox WM.
# No reboot or logout needed — keybindings and window rules apply instantly.
DISPLAY="${DISPLAY:-:0}" openbox --reconfigure 2>/dev/null || true

# ── Rewrite session script (openbox before picom, xrender compositor) ────────
cat > /usr/local/bin/cryogram-session << 'SESSION'
#!/bin/bash
export DISPLAY="${DISPLAY:-:0}"
export HOME="${HOME:-/home/cryogram}"
export XDG_SESSION_TYPE=x11
export XDG_CURRENT_DESKTOP=Cryogram
export XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR:-/run/user/$(id -u)}"
mkdir -p "$XDG_RUNTIME_DIR" && chmod 700 "$XDG_RUNTIME_DIR" 2>/dev/null || true

# Paint the screen dark immediately — eliminates white flash before Electron loads
xsetroot -solid '#070b11' 2>/dev/null || true

# Keep the screen black on exit (reboot/shutdown) so framebuffer never flashes white
trap 'xsetroot -solid black 2>/dev/null || true' EXIT

# Disable X11 screensaver and power management
xset s off 2>/dev/null || true
xset s noblank 2>/dev/null || true
xset -dpms 2>/dev/null || true

# Openbox WM first — must be running before picom attaches
openbox --config-file /etc/xdg/openbox/cryogram-rc.xml &
WM_PID=$!
sleep 0.3

# Compositor for Electron transparency — xrender is faster to start than glx
picom --backend xrender --vsync --no-fading-openclose --daemon 2>/dev/null || true

# Hide cursor when idle
unclutter -root -idle 5 2>/dev/null &

# ── Audio: start PipeWire/PulseAudio if not already running ──────────────────
# cryogram-session may be the first process in the user session, so audio
# daemons might not be started yet (no loginctl session, no systemd user units).
if command -v pipewire &>/dev/null && ! pgrep -x pipewire > /dev/null 2>&1; then
  pipewire &
  sleep 0.5
  pipewire-pulse &>/dev/null &
  wireplumber &>/dev/null &
elif command -v pulseaudio &>/dev/null && ! pgrep -x pulseaudio > /dev/null 2>&1; then
  pulseaudio --start --exit-idle-time=-1 2>/dev/null || true
fi

# Set default audio sink if PipeWire/PulseAudio started without one
(sleep 3 && pactl set-default-sink @DEFAULT_SINK@ 2>/dev/null || \
  pactl list sinks short 2>/dev/null | awk 'NR==1{print $1}' | xargs -r pactl set-default-sink 2>/dev/null || true) &

# On live boot: launch installer after desktop loads
if grep -q "boot=live" /proc/cmdline 2>/dev/null; then
  (sleep 5 && sudo /usr/bin/calamares) &
fi

# Launch Cryogram — always restart on exit.
# Electron exits 0 when killed via SIGTERM (app.quit()), so we CANNOT break on
# exit code 0 — that would leave the screen black after every update.
# cryogram-session is killed by systemd/init on shutdown, so the loop auto-stops.
while true; do
  /usr/local/bin/cryogram || true
  sleep 1
done

kill $WM_PID 2>/dev/null || true
SESSION
chmod +x /usr/local/bin/cryogram-session

# ── Ensure persistent data directory is owned by cryogram ────────────────────
mkdir -p /opt/cryogram-data
chown cryogram:cryogram /opt/cryogram-data 2>/dev/null || true
chmod 755 /opt/cryogram-data

# ── Brightness: allow cryogram user to change backlight without sudo ──────────
# brightnessctl writes to /sys/class/backlight/*/brightness which is group-writable
# to 'video'. Without group membership brightnessctl silently does nothing.
usermod -a -G video cryogram 2>/dev/null || true
# Make brightness sysfs writable by the video group right now (persists via udev)
find /sys/class/backlight -name brightness -exec chmod g+w {} \; 2>/dev/null || true

# ── Restart the app ───────────────────────────────────────────────────────────
# Kill the running session loop and Cryogram, then start a fresh cryogram-session.
# This guarantees we're running the NEW session script (with the || true restart
# loop) even if the user had an old broken session loop still in memory.
# We use pkill -x cryogram (exact binary name) — the old pattern
# "electron.*out/main" never matched the actual binary and caused black screens.
echo ""
echo "  ✓ All done! Cryogram is restarting..."
echo ""
sleep 2
pkill -9 -f "cryogram-session" 2>/dev/null || true
pkill -9 -x cryogram 2>/dev/null || true
sleep 1
if id cryogram &>/dev/null; then
  su -c "DISPLAY=:0 nohup /usr/local/bin/cryogram-session > /tmp/cryogram-session.log 2>&1 &" cryogram || true
fi
