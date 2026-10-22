#!/usr/bin/env bash
# GaadiWalo backend - deploy to the EC2 demo host.
#
# Builds the backend image locally for linux/amd64, streams it to the instance
# over SSH (no registry needed), then (re)starts the container behind Nginx.
#
# Usage (from the repository root):
#   EC2_HOST=<public-ip> SSH_KEY=~/.ssh/<key>.pem apps/backend/deploy/deploy-ec2.sh
#
# Optional:
#   ENV_FILE=apps/backend/.env   Upload this file to /opt/gaadiwalo/.env before starting.
#                                Omit it to reuse the .env already on the server.
#   SSH_USER=ubuntu              Login user on the instance.
#
# The host must already be prepared with ec2-bootstrap.sh.

set -euo pipefail

readonly EC2_HOST="${EC2_HOST:?Set EC2_HOST to the instance public IP}"
readonly SSH_KEY="${SSH_KEY:?Set SSH_KEY to the instance .pem key path}"
readonly SSH_USER="${SSH_USER:-ubuntu}"
readonly ENV_FILE="${ENV_FILE:-}"

readonly IMAGE_NAME="gaadiwalo-backend"
readonly CONTAINER_NAME="gaadiwalo-backend"
readonly REMOTE_ENV_FILE="/opt/gaadiwalo/.env"
readonly BACKEND_PORT="8080"
readonly HEALTH_CHECK_ATTEMPTS=15

readonly REPOSITORY_ROOT="$(git rev-parse --show-toplevel)"
readonly IMAGE_TAG="$(git -C "${REPOSITORY_ROOT}" rev-parse --short HEAD)"
readonly IMAGE_REFERENCE="${IMAGE_NAME}:${IMAGE_TAG}"
readonly SSH_TARGET="${SSH_USER}@${EC2_HOST}"
readonly SSH_OPTIONS=(-i "${SSH_KEY}" -o StrictHostKeyChecking=accept-new)

run_remote() {
  ssh "${SSH_OPTIONS[@]}" "${SSH_TARGET}" "$@"
}

echo "==> Building ${IMAGE_REFERENCE} for linux/amd64"
docker build --platform=linux/amd64 \
  -f "${REPOSITORY_ROOT}/apps/backend/Dockerfile" \
  -t "${IMAGE_REFERENCE}" \
  "${REPOSITORY_ROOT}/apps/backend"

echo "==> Shipping image to ${EC2_HOST}"
docker save "${IMAGE_REFERENCE}" | gzip | run_remote "gunzip | docker load"

if [[ -n "${ENV_FILE}" ]]; then
  echo "==> Uploading ${ENV_FILE} to ${REMOTE_ENV_FILE}"
  scp "${SSH_OPTIONS[@]}" "${ENV_FILE}" "${SSH_TARGET}:${REMOTE_ENV_FILE}"
  run_remote "chmod 600 ${REMOTE_ENV_FILE}"
fi

# First deploys may run before secrets exist: start with an empty env file so the
# container boots (/health works) and Supabase-backed endpoints stay disabled.
if ! run_remote "test -f ${REMOTE_ENV_FILE}"; then
  echo "    WARNING: no ${REMOTE_ENV_FILE} on the server; creating an empty one."
  echo "    Supabase-backed endpoints will fail until you re-run with ENV_FILE=<path to backend .env>."
  run_remote "install -m 600 /dev/null ${REMOTE_ENV_FILE}"
fi

echo "==> Restarting container ${CONTAINER_NAME}"
# Port is bound to localhost only; Nginx is the public entry point.
run_remote "docker rm -f ${CONTAINER_NAME} >/dev/null 2>&1 || true
  docker run -d \
    --name ${CONTAINER_NAME} \
    --restart unless-stopped \
    --env-file ${REMOTE_ENV_FILE} \
    -e NODE_ENV=production \
    -e PORT=${BACKEND_PORT} \
    -p 127.0.0.1:${BACKEND_PORT}:${BACKEND_PORT} \
    ${IMAGE_REFERENCE}
  docker image prune -af --filter 'until=168h' >/dev/null"

# Checked on the host against the container directly, so it works before and after
# HTTPS is enabled (Nginx then only answers for the configured domain).
echo "==> Waiting for container health on 127.0.0.1:${BACKEND_PORT}/health"
for attempt in $(seq 1 "${HEALTH_CHECK_ATTEMPTS}"); do
  if run_remote "curl -fsS http://127.0.0.1:${BACKEND_PORT}/health"; then
    echo
    echo "==> Deployed ${IMAGE_REFERENCE} to ${EC2_HOST}"
    exit 0
  fi
  echo "    not ready yet (${attempt}/${HEALTH_CHECK_ATTEMPTS})"
  sleep 2
done

echo "Health check failed. Recent container logs:" >&2
run_remote "docker logs --tail 50 ${CONTAINER_NAME}" >&2
exit 1
