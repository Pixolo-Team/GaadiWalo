# GaadiWalo Backend

This package contains the Hono backend for GaadiWalo.

## Available Scripts

- `npm run dev` starts the local development server.
- `npm run build` compiles the TypeScript source.
- `npm run lint` performs a strict TypeScript validation pass.
- `npm run test` runs the health endpoint tests.

## Health API

- Endpoint: `GET /health`
- Response: standard project envelope with service health details

## Docker

Build the image from `apps/backend`:

```bash
docker build -t gaadiwalo-health-api .
docker run -p 8080:8080 gaadiwalo-health-api
```

## Google Cloud Run

Deploy with Cloud Build from `apps/backend`:

```bash
gcloud builds submit --config cloudbuild.yaml
```
