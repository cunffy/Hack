# Cryogram OS

A custom Debian-based Linux operating system built for security operations. Replaces Windows entirely. Ships with CyberDen as the desktop interface and a full offensive/defensive security toolkit pre-installed.

## What's included

| Category | Contents |
|---|---|
| Desktop | CyberDen (Terminal, Editor, Password Tester, Leaker), Openbox WM, Picom compositor, Tint2 panel |
| Browser | Opera GX (default) |
| Security tools | Nmap, Wireshark, Metasploit, Hashcat, John, Aircrack-ng, Bettercap, SQLmap, Nikto, Gobuster, Volatility, Autopsy, MITMProxy, Recon-ng, + 50 more |
| Languages | Python 3, Node.js 20 LTS, Go 1.22, Rust (stable), C/C++ (GCC/Clang) |
| Dev tools | Git, Docker, SQLite, Monaco editor (via CyberDen), Geany |
| Gaming | Steam + Proton, Proton-GE, Heroic (Epic/GOG), Lutris, Wine, MangoHud, GameMode, ProtonUp-Qt |
| GPU drivers | AMD (amdgpu), Intel (i915), NVIDIA (proprietary — auto-activated on first boot) |
| System | systemd, NetworkManager, PipeWire audio, Bluetooth, LightDM login screen |
| Installer | Calamares graphical installer (full disk, dual boot, or custom partitioning) |
| UX polish | Super key app launcher (Rofi), snap windows left/right/max, volume & brightness OSD, touchpad gestures, natural scrolling, tap-to-click, clipboard history (CopyQ), auto screen lock (i3lock + xss-lock), Plymouth boot splash |
| Privacy | UFW firewall (deny incoming by default), DNS-over-TLS (Cloudflare + Quad9), zero telemetry, first-boot privacy notice |
| Power | TLP battery management (doubles laptop battery life), auto CPU governor, hybrid GPU safe idle |
| Printing | CUPS + HP (hplip) + generic (Gutenprint) drivers — 90% of printers work plug-and-play |
| Fonts & rendering | Inter UI font, JetBrains Mono, subpixel LCD rendering across GTK + Qt apps |

## Build Requirements

- A machine running **Linux** (or WSL2 on Windows)
- **Docker** and **docker-compose** installed
- **16 GB free disk space** for the build workspace
- **8 GB+ RAM** recommended
- Internet connection (downloads ~3 GB of packages during build)

## Build the ISO

```bash
# 1. Clone the repo
git clone https://github.com/cunffy/hack cryogram
cd cryogram/os

# 2. Build — takes 30–90 minutes depending on connection speed
docker-compose up --build

# 3. ISO appears in os/output/
ls output/
# cryogram-os-1.0-amd64.iso   (~3–4 GB)
# cryogram-os-1.0-amd64.iso.sha256
```

Watch build progress:
```bash
docker logs -f cryogram-build
```

## Install to a Computer (replaces Windows)

### Step 1 — Write the ISO to a USB drive (8 GB+ USB)

**Linux/Mac:**
```bash
sudo dd if=output/cryogram-os-1.0-amd64.iso of=/dev/sdX bs=4M status=progress
# Replace /dev/sdX with your USB device (check with lsblk)
```

**Windows:**
Use [Rufus](https://rufus.ie) — select the ISO, choose GPT partition scheme, write.

### Step 2 — Boot from USB

1. Insert USB into the target machine
2. Restart and enter BIOS/UEFI (usually F2, F12, DEL, or ESC on boot)
3. Set USB as first boot device
4. Save and reboot — Cryogram live environment starts automatically

### Step 3 — Install

1. You'll boot into the live desktop (no install yet — safe to explore)
2. Double-click **"Install Cryogram OS"** on the desktop, or right-click → Install Cryogram OS
3. Follow the Calamares installer:
   - Choose language / timezone / keyboard
   - **Partitioning**: choose "Erase disk" to fully replace Windows, or "Manual" for dual boot
   - Set your username and password
   - Click Install
4. Installation takes ~15–30 minutes
5. Reboot, remove USB → Cryogram boots

### Dual boot with Windows

In the Calamares partitioner, choose **"Alongside"** or **"Manual partitioning"**. Calamares will install GRUB and detect Windows automatically — you'll get a boot menu at startup to choose between Cryogram OS and Windows.

## First Boot

The system boots directly into CyberDen. Default live credentials: `cryogram` / `cryogram` (you set your own password during install).

### Set up your tools

1. Open **Settings** in CyberDen → add your HIBP and Dehashed API keys
2. Open **Password Tester** → accept the authorization disclaimer
3. Drop wordlists (e.g. `rockyou.txt`) to `/home/yourusername/wordlists/`

### Gaming

Steam, Lutris, Heroic, and Wine are pre-installed. Right-click the desktop → **Gaming** to launch any of them.

**First launch — Steam:**
- Steam will update itself on first run, then log in with your Steam account
- Enable Proton for Windows games: Steam → Settings → Compatibility → "Enable Steam Play for all titles"
- **Proton-GE** is pre-installed at `~/.steam/root/compatibilitytools.d/` — select it per-game in Properties → Compatibility

**NVIDIA GPU:**
On first boot a script auto-detects your GPU and activates the NVIDIA driver if present. If you have an NVIDIA card and games perform poorly, run:
```bash
nvidia-smi        # confirms driver is active
prime-select nvidia   # if on a laptop with hybrid GPU
```

**AMD / Intel GPU:**
Drivers are loaded automatically — no setup needed.

**MangoHud overlay** (shows FPS, GPU/CPU temp, frametime):
```bash
# Launch any game with overlay:
mangohud steam
mangohud lutris
# Or toggle in-game with Shift+F12
```

**GameMode** (boosts CPU governor while gaming):
```bash
gamemoderun steam
# Or prefix any game launch command with gamemoderun
```

**Check game compatibility** before buying: [protondb.com](https://protondb.com)

### Security tools from Terminal

All tools are in PATH:
```bash
nmap --help
msfconsole          # Metasploit
hashcat --help
john --wordlist=/usr/share/wordlists/rockyou.txt hash.txt
bettercap --help
sqlmap --help
wireshark           # GUI
```

## Updating

```bash
sudo apt update && sudo apt upgrade
```

CyberDen updates: pull the repo and rebuild (`npm run build`), the installed version is at `/opt/cyberden`.

## Directory structure

```
os/
├── build.sh               Main build entry point (runs inside Docker)
├── Dockerfile             Docker build environment
├── docker-compose.yml     Easy one-command build
├── assets/
│   ├── icon.svg           Cryogram logo
│   ├── wallpaper.svg      Desktop wallpaper
│   └── grub-background.svg GRUB boot screen background
├── live-build/
│   ├── auto/              live-build automation scripts
│   └── config/
│       ├── package-lists/ APT package lists (base, security, dev, desktop)
│       ├── hooks/         Chroot hooks (Node.js, Rust, Go, CyberDen, Opera GX)
│       └── includes.chroot/ Files copied verbatim into the OS image
│           ├── etc/       System config (LightDM, Openbox, GTK theme)
│           └── usr/share/ GRUB theme, wallpapers, .desktop files
└── calamares/             Graphical installer configuration
    ├── settings.conf
    └── branding/cryogram/ Installer branding (name, colors, slideshow)
```
