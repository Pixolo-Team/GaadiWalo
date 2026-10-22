#!/usr/bin/env bash
# GaadiWalo backend - enable HTTPS on the EC2 demo host with Let's Encrypt.
#
# Points the Nginx site at a hostname, issues a certificate with Certbot's Nginx
# plugin, and redirects HTTP to HTTPS. Certbot's systemd timer renews it.
#
# Usage (from the repository root):
#   EC2_HOST=<elastic-ip> SSH_KEY=~/.ssh/<key>.pem BACKEND_DOMAIN=<hostname> \
#     apps/backend/deploy/enable-https.sh
#
# BACKEND_DOMAIN must already resolve to EC2_HOST, and ports 80/443 must be open.
# A free hostname for an IP is <ip-with-dashes>.sslip.io (e.g. 3-6-163-232.sslip.io).
#
# Optional:
#   CERTBOT_EMAIL=<email>   Expiry notices. Omitted -> registers without an email.
#   SSH_USER=ubuntu
#
# Running this accepts the Let's Encrypt Subscriber Agreement.

set -euo pipefail

readonly EC2_HOST="${EC2_HOST:?Set EC2_HOST to the instance public IP}"
readonly SSH_KEY="${SSH_KEY:?Set SSH_KEY to the instance .pem key path}"
readonly BACKEND_DOMAIN="${BACKEND_DOMAIN:?Set BACKEND_DOMAIN to the backend hostname}"
readonly SSH_USER="${SSH_USER:-ubuntu}"
readonly CERTBOT_EMAIL="${CERTBOT_EMAIL:-}"

readonly NGINX_SITE="/etc/nginx/sites-available/gaadiwalo-backend"
readonly SSH_TARGET="${SSH_USER}@${EC2_HOST}"
readonly SSH_OPTIONS=(-i "${SSH_KEY}" -o StrictHostKeyChecking=accept-new)

run_remote() {
  ssh "${SSH_OPTIONS[@]}" "${SSH_TARGET}" "$@"
}

if [[ -n "${CERTBOT_EMAIL}" ]]; then
  readonly CERTBOT_ACCOUNT_FLAG="--email ${CERTBOT_EMAIL}"
else
  readonly CERTBOT_ACCOUNT_FLAG="--register-unsafely-without-email"
fi

echo "==> Setting Nginx server_name to ${BACKEND_DOMAIN}"
# Certbot's Nginx plugin needs a server block whose server_name matches the domain.
run_remote "sudo sed -i 's/^\(\s*server_name\) .*;/\1 ${BACKEND_DOMAIN};/' ${NGINX_SITE}
  sudo nginx -t
  sudo systemctl reload nginx"

echo "==> Issuing certificate for ${BACKEND_DOMAIN}"
run_remote "sudo certbot --nginx --non-interactive --agree-tos ${CERTBOT_ACCOUNT_FLAG} \
  --redirect -d ${BACKEND_DOMAIN}"

echo "==> Checking automatic renewal"
run_remote "sudo certbot renew --dry-run"

echo "==> Verifying https://${BACKEND_DOMAIN}/health"
curl -fsS "https://${BACKEND_DOMAIN}/health"
echo
echo "==> HTTPS enabled for ${BACKEND_DOMAIN}"
