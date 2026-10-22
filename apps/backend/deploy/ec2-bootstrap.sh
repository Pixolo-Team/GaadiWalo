#!/usr/bin/env bash
# GaadiWalo backend - EC2 host bootstrap (Ubuntu 24.04 LTS or newer, t3.micro / t2.micro).
#
# Prepares a fresh instance to run the backend container behind Nginx:
#   - 2 GB swap (the micro instance only has 1 GB RAM)
#   - Docker Engine + compose plugin, with log rotation
#   - Nginx reverse proxy: port 80 -> 127.0.0.1:8080 (backend container)
#   - Certbot (HTTPS is enabled later, once a domain points at the instance)
#   - /opt/gaadiwalo app directory for the backend .env file
#
# Usage:
#   - Paste the whole file into EC2 "Advanced details -> User data" at launch, or
#   - Run on the instance: sudo bash ec2-bootstrap.sh
#
# Safe to re-run. Output is logged to /var/log/gaadiwalo-bootstrap.log.

set -euo pipefail

exec > >(tee -a /var/log/gaadiwalo-bootstrap.log) 2>&1

readonly APP_USER="ubuntu"
readonly APP_DIRECTORY="/opt/gaadiwalo"
readonly BACKEND_PORT="8080"
readonly SWAP_FILE="/swapfile"
readonly SWAP_SIZE="2G"
readonly SERVER_TIMEZONE="Asia/Kolkata"

export DEBIAN_FRONTEND=noninteractive
# Auto-restart services after upgrades instead of prompting (Ubuntu needrestart).
export NEEDRESTART_MODE=a

echo "==> GaadiWalo bootstrap started at $(date -Is)"

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run as root (sudo bash ec2-bootstrap.sh)." >&2
  exit 1
fi

# --- Base system ---------------------------------------------------------------
timedatectl set-timezone "${SERVER_TIMEZONE}" || true
apt-get update -y
# Keep existing config files on upgrade so it never blocks on a dpkg prompt.
apt-get upgrade -y -o Dpkg::Options::=--force-confdef -o Dpkg::Options::=--force-confold
apt-get install -y ca-certificates curl gnupg nginx certbot python3-certbot-nginx

# --- Swap (prevents OOM kills on 1 GB RAM) -------------------------------------
if [[ ! -f "${SWAP_FILE}" ]]; then
  fallocate -l "${SWAP_SIZE}" "${SWAP_FILE}"
  chmod 600 "${SWAP_FILE}"
  mkswap "${SWAP_FILE}"
fi
if ! grep -q "^${SWAP_FILE} " /proc/swaps; then
  swapon "${SWAP_FILE}"
fi
grep -q "^${SWAP_FILE} " /etc/fstab || echo "${SWAP_FILE} none swap sw 0 0" >> /etc/fstab
echo "vm.swappiness=10" > /etc/sysctl.d/99-gaadiwalo-swap.conf
sysctl --system > /dev/null

# --- Docker Engine (official apt repository) -----------------------------------
install -m 0755 -d /etc/apt/keyrings
if [[ ! -f /etc/apt/keyrings/docker.asc ]]; then
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc
fi
# shellcheck disable=SC1091
. /etc/os-release
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu ${VERSION_CODENAME} stable" \
  > /etc/apt/sources.list.d/docker.list
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Cap container logs so they cannot fill the small EBS volume.
cat > /etc/docker/daemon.json <<'JSON'
{
  "log-driver": "json-file",
  "log-opts": { "max-size": "10m", "max-file": "3" }
}
JSON
systemctl enable docker
systemctl restart docker
usermod -aG docker "${APP_USER}"

# --- App directory (backend .env lives here, never in the image) ---------------
install -d -m 0750 -o "${APP_USER}" -g "${APP_USER}" "${APP_DIRECTORY}"

# --- Nginx reverse proxy ---------------------------------------------------------
cat > /etc/nginx/sites-available/gaadiwalo-backend <<NGINX
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    client_max_body_size 10m;

    # Host-level check that works before the backend container is deployed.
    location = /nginx-health {
        access_log off;
        default_type text/plain;
        return 200 "ok";
    }

    location / {
        proxy_pass http://127.0.0.1:${BACKEND_PORT};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 60s;
    }
}
NGINX
ln -sf /etc/nginx/sites-available/gaadiwalo-backend /etc/nginx/sites-enabled/gaadiwalo-backend
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl enable nginx
systemctl reload nginx || systemctl restart nginx

# --- Cleanup -----------------------------------------------------------------------
apt-get autoremove -y
apt-get clean

echo "==> GaadiWalo bootstrap finished at $(date -Is)"
docker --version
nginx -v
free -h
