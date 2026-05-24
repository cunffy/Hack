FROM debian:bookworm

ENV DEBIAN_FRONTEND=noninteractive
ENV LC_ALL=C

# Install live-build and all build deps
# -o Acquire::Check-Valid-Until=false handles clock-skew in constrained environments
RUN apt-get update -o Acquire::Check-Valid-Until=false && \
    apt-get install -y -o Acquire::Check-Valid-Until=false \
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

# Copy OS assets (wallpaper, icon, GRUB background)
COPY assets/ /build/assets/

# Copy Calamares config
COPY calamares/ /build/calamares/

# Entry point: run the build
# live-build/ is mounted as a volume at runtime (see docker-compose.yml)
# so it is NOT copied here — changes to hooks/package-lists/config take
# effect immediately without rebuilding the Docker image.
COPY build.sh /build/build.sh
RUN chmod +x /build/build.sh
CMD ["/build/build.sh"]
