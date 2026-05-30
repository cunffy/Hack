#!/bin/bash
# Cryogram OS — apply updates and install built-in updater infrastructure.
# Invoked automatically by the one-liner:
#   sudo bash -c 'D=/opt/cryogram-src; [ -d "$D/.git" ] \
#     && git -C "$D" pull \
#     || git clone --depth=1 -b claude/custom-security-os-URNk5 https://github.com/cunffy/Hack.git "$D"; \
#     bash "$D/os/setup-updater.sh"'
set -euo pipefail

# ── Pre-flight: time sync + SSL certs ────────────────────────────────────────
# Fix clock first — SSL cert verification fails if the clock is wrong.
# Install chrony (NTP daemon) so time stays correct automatically from now on.
if ! command -v chronyc &>/dev/null; then
  echo "  [pre] Installing chrony (NTP time sync)..."
  apt-get update -qq && apt-get install -y -qq chrony
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

# Ensure SSL certificates are present
if [ ! -f /etc/ssl/certs/ca-certificates.crt ] || [ ! -s /etc/ssl/certs/ca-certificates.crt ]; then
  echo "  [pre] Installing ca-certificates..."
  apt-get install -y -qq ca-certificates && update-ca-certificates --fresh
fi

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

# ── Ensure required X11 tools are installed ───────────────────────────────────
for pkg in xdotool wmctrl rsync; do
  if ! command -v "$pkg" &>/dev/null; then
    echo "  [pre] Installing missing tool: $pkg ..."
    apt-get install -y -qq "$pkg" 2>/dev/null || true
  fi
done

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
DEST="/opt/cryogram"
STAGING=\$(mktemp -d)
trap 'rm -rf "\$STAGING"' EXIT

echo "── Cryogram OS Updater ──────────────────────────"
# Ensure SSL certs are present before any HTTPS git operation
if [ ! -f /etc/ssl/certs/ca-certificates.crt ] || [ ! -s /etc/ssl/certs/ca-certificates.crt ]; then
  apt-get update -qq && apt-get install -y -qq ca-certificates && update-ca-certificates --fresh
fi
if [ ! -d "\$SRC/.git" ]; then
  echo "── First run: cloning source repository..."
  git clone --depth=1 --branch "\$BRANCH" "$REPO_URL" "\$SRC"
else
  echo "── Pulling latest changes from \$BRANCH..."
  git -C "\$SRC" fetch --depth=1 origin "\$BRANCH"
  git -C "\$SRC" reset --hard "origin/\$BRANCH"
fi

echo "── Verifying downloaded files..."
if [ ! -f "\$SRC/out/main/index.js" ] || [ ! -f "\$SRC/out/renderer/index.html" ]; then
  echo "ERROR: critical files missing after pull — aborting update."
  exit 1
fi

echo "── Staging app files..."
rsync -a "\$SRC/out/" "\$STAGING/"

echo "── Applying update..."
rsync -a --delete "\$STAGING/" "\$DEST/out/"

echo "── Update complete — rebooting in 5 seconds..."
sleep 5
reboot
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
      <action name="Execute"><execute>bash -c "pkill -f 'electron.*out/main'"</execute></action>
    </item>
  </menu>
</openbox_menu>
OBMENU

# ── Patch openbox config (Alt+Tab keybindings + single workspace) ─────────────
OB_CONF="/etc/xdg/openbox/cryogram-rc.xml"
if [ -f "$OB_CONF" ]; then
  # Pin Cryogram to the desktop layer in openbox (never above normal windows)
  if ! grep -q 'class="cryogram"' "$OB_CONF"; then
    sed -i 's|<applications>|<applications>\n    <application class="cryogram"><layer>below</layer><decor>no</decor><border>no</border><skip_taskbar>yes</skip_taskbar><skip_pager>yes</skip_pager></application>|' "$OB_CONF"
  fi
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
  # Ensure 4 workspaces for Super+1–4 switching
  sed -i 's|<desktops>[^<]*<number>[0-9]*</number>[^<]*</desktops>|<desktops><number>4</number></desktops>|' "$OB_CONF" 2>/dev/null || true
  if ! grep -q '<number>4</number>' "$OB_CONF"; then
    sed -i 's|<desktops>|<desktops><number>4</number>|' "$OB_CONF" 2>/dev/null || true
  fi
fi

# ── Ensure persistent data directory is owned by cryogram ────────────────────
# Electron stores settings (theme, PIN, API keys) in /opt/cryogram-data.
# If the dir is missing or root-owned the cryogram user can't write there and
# settings reset on every reboot.
mkdir -p /opt/cryogram-data
chown cryogram:cryogram /opt/cryogram-data 2>/dev/null || true
chmod 755 /opt/cryogram-data

# ── Restart the app ───────────────────────────────────────────────────────────
# The session loop in /usr/local/bin/cryogram-session restarts Electron
# automatically whenever it exits non-zero, so pkill is enough.
echo ""
echo "  ✓ All done! Restarting Cryogram..."
echo ""
pkill -f "electron.*out/main" 2>/dev/null || true
