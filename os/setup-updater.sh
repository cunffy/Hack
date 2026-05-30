#!/bin/bash
# Cryogram OS — apply updates and install built-in updater infrastructure.
# Invoked automatically by the one-liner:
#   sudo bash -c 'D=/opt/cryogram-src; [ -d "$D/.git" ] \
#     && git -C "$D" pull \
#     || git clone --depth=1 -b claude/custom-security-os-URNk5 https://github.com/cunffy/Hack.git "$D"; \
#     bash "$D/os/setup-updater.sh"'
set -euo pipefail

# Ensure SSL certificates are present — minimal Debian installs sometimes lack them
if [ ! -f /etc/ssl/certs/ca-certificates.crt ] || [ ! -s /etc/ssl/certs/ca-certificates.crt ]; then
  echo "  [pre] Installing ca-certificates (required for HTTPS git clone)..."
  apt-get update -qq && apt-get install -y -qq ca-certificates && update-ca-certificates --fresh
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

# ── Restart the app ───────────────────────────────────────────────────────────
# The session loop in /usr/local/bin/cryogram-session restarts Electron
# automatically whenever it exits non-zero, so pkill is enough.
echo ""
echo "  ✓ All done! Restarting Cryogram..."
echo ""
pkill -f "electron.*out/main" 2>/dev/null || true
