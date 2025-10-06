FROM debian:bullseye-slim

# Install required dependencies
RUN apt-get update && apt-get install -y \
    wget \
    tar \
    gettext \
    iproute2 \
    ca-certificates \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Set Prometheus version
ENV PROM_VERSION=2.52.0

# Download and install Prometheus
RUN set -eux; \
    apt-get update && apt-get install -y wget ca-certificates curl && update-ca-certificates; \
    echo "Downloading Prometheus ${PROM_VERSION}..."; \
    wget --https-only --tries=5 --timeout=30 --no-check-certificate \
      https://github.com/prometheus/prometheus/releases/download/v${PROM_VERSION}/prometheus-${PROM_VERSION}.linux-amd64.tar.gz || \
    (echo "wget failed, trying curl fallback..." && \
     curl -L --retry 5 --retry-delay 10 -o prometheus-${PROM_VERSION}.linux-amd64.tar.gz \
     https://github.com/prometheus/prometheus/releases/download/v${PROM_VERSION}/prometheus-${PROM_VERSION}.linux-amd64.tar.gz); \
    tar -xzf prometheus-${PROM_VERSION}.linux-amd64.tar.gz; \
    mv prometheus-${PROM_VERSION}.linux-amd64/prometheus /bin/prometheus; \
    mv prometheus-${PROM_VERSION}.linux-amd64/promtool /bin/promtool; \
    mkdir -p /etc/prometheus /prometheus; \
    mv prometheus-${PROM_VERSION}.linux-amd64/consoles /etc/prometheus/; \
    mv prometheus-${PROM_VERSION}.linux-amd64/console_libraries /etc/prometheus/; \
    rm -rf prometheus-${PROM_VERSION}*


# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 9090
ENTRYPOINT ["/entrypoint.sh"]


# Simple and faster
# FROM prom/prometheus:v2.52.0
# COPY prometheus.yml /etc/prometheus/
# COPY entrypoint.sh /entrypoint.sh
# RUN chmod +x /entrypoint.sh
# ENTRYPOINT ["/entrypoint.sh"]

