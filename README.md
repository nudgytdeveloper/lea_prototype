# LEA 2026 Prototype (Monorepo)

Prototype app for **LEA 2026 (Singapore)** used at a single venue: **The Fullerton Hotel**.

This repo is a **pnpm workspace monorepo**:
- `apps/web`: Next.js frontend (collects 3 answers)
- `apps/api`: Express backend (receives submissions)
- `constants`: shared enums/constants (event/venue/question IDs)
- `utils`: shared Zod schemas/types for request/response validation

Partner integration (QR `session` deep link, Firestore): [UMBRA.md](./UMBRA.md).

## Prerequisites
- Node.js (recommended: Node 22+)
- pnpm

## Install

```bash
pnpm install --no-frozen-lockfile
```

## Run (web + api)

```bash
pnpm dev
```

Services:
- Web: `http://localhost:3000`
- API: `http://localhost:3001`

## API endpoints
- `GET /health`
- `POST /api/lea-2026/response`

Example:

```bash
curl -s -X POST http://localhost:3001/api/lea-2026/response \
  -H 'content-type: application/json' \
  -d '{"answers":[{"questionId":"Q1","value":"investor"},{"questionId":"Q2","value":"foo"},{"questionId":"Q3","value":["bar"]}]}'
```

## Scripts
- `pnpm dev`: run all apps in parallel
- `pnpm build`: build apps
- `pnpm lint`: lint apps

## Troubleshooting
- If you see `EADDRINUSE :::3001`, something is already using port 3001. Stop that process and rerun `pnpm dev`.

