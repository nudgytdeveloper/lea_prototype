# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Prototype event networking kiosk for **LEA 2026 Singapore** at The Fullerton Hotel. A pnpm monorepo with a Next.js frontend and Express backend that collects attendee profile data via a 3-question interactive form.

## Commands

### Development

```bash
pnpm install --no-frozen-lockfile   # Install all dependencies
pnpm dev                             # Run web + api in parallel
```

### Individual apps

```bash
pnpm --filter @lea/web dev          # Next.js frontend on :3000
pnpm --filter @lea/api dev          # Express backend on :3001
pnpm --filter @lea/constants build  # Build constants package
pnpm --filter @lea/utils build      # Build utils package
```

### Build & Lint

```bash
pnpm build                          # Build all apps
pnpm lint                           # ESLint on web app
```

## Architecture

### Monorepo Structure

- `apps/web` — Next.js 16 + React 19 frontend (TypeScript)
- `apps/api` — Express 4 backend (TypeScript, CommonJS output to `dist/`)
- `constants/` — Shared TypeScript enums (`Venue`, `Event`, `LeaQuestionId`)
- `utils/` — Shared Zod schemas for request/response validation

### Data Flow

1. `apps/web/components/ai-facilitator.tsx` renders the 3-question kiosk UI
2. On submit, posts to `http://localhost:3001/api/lea-2026/response`
3. API validates using `Lea2026SubmissionSchema` from `@lea/utils`
4. Question IDs are typed enums from `@lea/constants` (`LeaQuestionId.Q1/Q2/Q3`)

### API Endpoints

- `GET /health` → `{ ok: true }`
- `POST /api/lea-2026/response` → `{ answers: Array<{questionId, value}>, submittedAt? }`

### Key Files

- `apps/web/app/page.tsx` — Root page, renders `<AIFacilitator />`
- `apps/web/components/ai-facilitator.tsx` — Main kiosk component (~640 lines), manages all question state and submission
- `apps/api/src/index.ts` — Express server entry, CORS configured for `localhost:3000`
- `constants/src/index.ts` — `Venue`, `Event`, `LeaQuestionId` enums
- `utils/src/index.ts` — Zod schemas: `Lea2026AnswerSchema`, `Lea2026SubmissionSchema`, `Lea2026ResponseSchema`

### Frontend Stack

- Next.js 16 with `typescript.ignoreBuildErrors: true` and `images.unoptimized: true`
- Tailwind CSS 4 with OKLch color variables; theme config in `apps/web/styles/globals.css`
- shadcn/ui component library (58 components in `apps/web/components/ui/`)
- Path alias `@/*` maps to `apps/web/*`

### Shared Package Dependencies

- `constants` and `utils` must be built (`pnpm build`) before the API can import them
- Both output to their respective `dist/` directories with TypeScript declarations
