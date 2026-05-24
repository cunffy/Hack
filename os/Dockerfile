FROM debian:bookworm

ENV DEBIAN_FRONTEND=noninteractive
ENV LC_ALL=C

# Install live-build and all build deps
RUN apt-get update && apt-get install -y \
    live-build \
    live-config \
    live-boot \
    syslinux-utils \
    squashfs-tools \
    xorriso \
    grub-efi-amd64-bin \
    grub-pc-bin \
    curl \
    wget \
    git \
    python3 \
    python3-pip \
    inkscape \
    imagemagick \
    calamares \
    debootstrap \
    cpio \
    dpkg-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /build

# Copy live-build configuration
COPY live-build/ /build/live-build/

# Copy OS assets (wallpaper, icon, GRUB background)
COPY assets/ /build/assets/

# Copy Calamares config
COPY calamares/ /build/calamares/

# Make hook scripts executable
RUN find /build/live-build/config/hooks -name "*.chroot" -exec chmod +x {} \;
RUN find /build/live-build/auto -type f -exec chmod +x {} \;

# Entry point: run the build
COPY build.sh /build/build.sh
RUN chmod +x /build/build.sh
CMD ["/build/build.sh"]
