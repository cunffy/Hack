#!/bin/bash
# Cryogram OS — apply updates and install built-in updater infrastructure.
# Run as root (sudo bash os/setup-updater.sh) from /opt/cryogram-src,
# or let the one-liner below invoke it automatically.
set -euo pipefail

SRC="$(cd "$(dirname "$0")/.." && pwd)"
DEST="/opt/cryogram"
BRANCH="claude/custom-security-os-URNk5"
REPO_URL="https://github.com/cunffy/Hack.git"

echo ""
echo "  ██████╗██████╗ ██╗   ██╗ ██████╗ ██████╗  █████╗ ███╗   ███╗"
echo "  ██╔════╝██╔══██╗╚██╗ ██╔╝██╔═══██╗██╔════╝ ██╔══██╗████╗ ████║"
echo "  ██║     ██████╔╝ ╚████╔╝ ██║   ██║██║  ███╗ ███████║██╔████╔██║"
echo "  ██║     ██╔══██╗  ╚██╔╝  ██║   ██║██║   ██║ ██╔══██║██║╚██╔╝██║"
echo "  ╚██████╗██║  ██║   ██║   ╚██████╔╝╚██████╔╝ ██║  ██║██║ ╚═╝ ██║"
echo "   ╚═════╝╚═╝  ╚═╝   ╚═╝    ╚═════╝  ╚═════╝  ╚═╝  ╚═╝╚═╝     ╚═╝"
echo ""
echo "  Cryogram OS — System Update & Setup"
echo "  ─────────────────────────────────────"
echo ""

# ── 1. Sync the built app files ──────────────────────────────────────────────
echo "  [1/4] Syncing app files to $DEST/out/ ..."
if [ ! -d "$DEST/out" ]; then
  echo "  ERROR: $DEST/out not found — is Cryogram OS installed?"
  exit 1
fi
rsync -a --delete "$SRC/out/" "$DEST/out/"
echo "        Done."

# ── 2. Install the update script ─────────────────────────────────────────────
echo "  [2/4] Installing /usr/local/bin/cryogram-update ..."
cat > /usr/local/bin/cryogram-update << UPDATER
#!/bin/bash
set -euo pipefail
BRANCH="$BRANCH"
SRC="/opt/cryogram-src"
DEST="/opt/cryogram"

echo "── Cryogram OS Updater ──────────────────────────"
if [ ! -d "\$SRC/.git" ]; then
  echo "── First run: cloning source repository..."
  git clone --depth=1 --branch "\$BRANCH" "$REPO_URL" "\$SRC"
else
  echo "── Pulling latest changes from \$BRANCH..."
  git -C "\$SRC" fetch --depth=1 origin "\$BRANCH"
  git -C "\$SRC" reset --hard "origin/\$BRANCH"
fi

echo "── Syncing app files..."
rsync -a --delete "\$SRC/out/" "\$DEST/out/"

echo "── Update complete — rebooting in 5 seconds..."
sleep 5
reboot
UPDATER
chmod +x /usr/local/bin/cryogram-update
echo "        Done."

# ── 3. Write update config ───────────────────────────────────────────────────
echo "  [3/4] Writing /etc/cryogram/update.conf ..."
mkdir -p /etc/cryogram
cat > /etc/cryogram/update.conf << CONF
REPO_URL="$REPO_URL"
BRANCH="$BRANCH"
CONF

# Ensure /opt/cryogram-src is recognised as the source dir for updater:check
if [ ! -L /opt/cryogram-src ] && [ "$SRC" != "/opt/cryogram-src" ]; then
  ln -sf "$SRC" /opt/cryogram-src 2>/dev/null || true
fi
echo "        Done."

# ── 4. Sudoers rule ──────────────────────────────────────────────────────────
echo "  [4/4] Granting passwordless sudo for cryogram-update ..."
SUDO_RULE="cryogram ALL=(ALL) NOPASSWD: /usr/local/bin/cryogram-update"
echo "$SUDO_RULE" > /etc/sudoers.d/cryogram-update
chmod 440 /etc/sudoers.d/cryogram-update
echo "        Done."

# ── Restart the app ──────────────────────────────────────────────────────────
echo ""
echo "  ✓ All done! Restarting Cryogram..."
echo ""
pkill -f "electron.*out/main" 2>/dev/null || true
