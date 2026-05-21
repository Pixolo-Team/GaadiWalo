# Backend Docker + Render Deployment

This document defines the Docker and Render setup for the GaadiWalo backend service.

## Scope

- Container target: `apps/backend`
- Frontend deployment remains on Vercel
- Render deployment target: backend web service only

## Files Added

- `apps/backend/Dockerfile`
- `apps/backend/.dockerignore`
- `render.yaml`

## Local Docker Build

Build the backend image from the backend app directory context:

```bash
docker build -f apps/backend/Dockerfile -t gaadiwalo-backend:latest apps/backend
```

Run the image locally:

```bash
docker run --rm -p 8080:8080 --env-file apps/backend/.env gaadiwalo-backend:latest
```

Health check:

```bash
curl http://localhost:8080/health
```

## Render Deployment Options

### Option 1: Deploy a prebuilt image with `render.yaml`

Recommended when you want Render to pull a registry image instead of building from the repository.

Steps:

1. Build and push your backend image to Docker Hub, GHCR, ECR, or another supported registry.
2. Update `render.yaml` and replace `docker.io/your-dockerhub-user/gaadiwalo-backend:latest` with your real image URL.
3. If the image is private, add the registry credential in Render first.
4. In Render, create a new Blueprint instance from the connected GitHub repository.
5. Confirm the service name, image URL, plan, and environment variables from `render.yaml`.
6. Fill the secret values manually in Render for:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `AUTH_RESET_TOKEN_SECRET`
7. Deploy the Blueprint.
8. Verify `GET /health` after the service becomes live.

### Option 2: Push an image to a registry, then connect it in the Render Dashboard

Recommended when you want tighter control over image versions.

Build the image:

```bash
docker build -f apps/backend/Dockerfile -t your-dockerhub-user/gaadiwalo-backend:latest apps/backend
```

Push the image:

```bash
docker push your-dockerhub-user/gaadiwalo-backend:latest
```

Render setup steps:

1. In Render, create a new Web Service.
2. Choose the existing image / container registry flow.
3. Provide the image name, for example `your-dockerhub-user/gaadiwalo-backend:latest`.
4. Add registry credentials if the image is private.
5. Set the container port to Render's injected `PORT` environment variable behavior.
6. Add the same backend environment variables used in `.env.example`.
7. Set the health check path to `/health`.
8. Deploy and verify the service.

## Render Blueprint Example For Image-Backed Deploys

Use this structure when you want Render to pull a prebuilt image:

```yaml
services:
  - type: web
    name: gaadiwalo-backend
    runtime: image
    image:
      url: docker.io/your-dockerhub-user/gaadiwalo-backend:latest
    healthCheckPath: /health
```

For a private image, add Render registry credentials and reference them in the Blueprint:

```yaml
services:
  - type: web
    name: gaadiwalo-backend
    runtime: image
    image:
      url: docker.io/your-dockerhub-user/gaadiwalo-backend:latest
      creds:
        fromRegistryCreds:
          name: your-render-credential-name
    healthCheckPath: /health
```

## Build and Push Commands

Render requires the image to be built for `linux/amd64`.

Build:

```bash
docker build --platform=linux/amd64 -f apps/backend/Dockerfile -t your-dockerhub-user/gaadiwalo-backend:latest apps/backend
```

Push:

```bash
docker push your-dockerhub-user/gaadiwalo-backend:latest
```

## Updating an Existing Image-Backed Service

Render does not auto-redeploy just because a new image is pushed to the same tag. After pushing a new image, trigger a deploy by either:

1. Render Dashboard -> Manual Deploy -> Deploy latest reference
2. A Render deploy hook

You can also deploy a specific tag or digest with the deploy hook.

## Required Render Environment Variables

Render should define these variables for the backend service:

- `NODE_ENV=production`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `AUTH_RESET_TOKEN_SECRET`
- `AUTH_RESET_TOKEN_TTL_MINUTES=10`
- `SUPABASE_USERS_TABLE=users`
- `SUPABASE_LOGIN_USER_ID_COLUMN=user_code`
- `SUPABASE_USER_EMAIL_COLUMN=email`
- `SUPABASE_USER_NAME_COLUMN=full_name`
- `SUPABASE_USER_PHONE_COLUMN=phone`
- `SUPABASE_USER_ROLE_COLUMN=role_id`
- `SUPABASE_USER_BRANCH_COLUMN=branch_id`
- `SUPABASE_USER_ACTIVE_COLUMN=is_active`
- `SUPABASE_USER_JOINED_AT_COLUMN=created_at`
- `SUPABASE_ROLES_TABLE=roles`
- `SUPABASE_ROLE_ID_COLUMN=id`
- `SUPABASE_ROLE_NAME_COLUMN=name`
- `SUPABASE_BRANCHES_TABLE=branches`
- `SUPABASE_BRANCH_ID_COLUMN=id`
- `SUPABASE_BRANCH_NAME_COLUMN=name`
- `SUPABASE_BRANCH_ACTIVE_COLUMN=is_active`

## Notes

- The backend already binds to `0.0.0.0`, which is required inside containers.
- The backend reads `PORT` from the environment, so Render can assign its own port at runtime.
- Do not copy `apps/backend/.env` into the image.
- The current Docker setup installs dependencies inside the container during build because the backend app does not yet have a committed lockfile.
