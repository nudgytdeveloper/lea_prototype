# Changelog

## 2026-03-25 (8)

### Fixed
- Duplicate Anam session call on "Chat more" click: add init guard ref to prevent React StrictMode double-invocation
- Anam avatar audio muted: remove `muted` attribute from video element so avatar voice is audible

## 2026-03-25 (7)

### Fixed
- Production API calls: replace hardcoded `localhost:3001` with `NEXT_PUBLIC_API_URL` env var so Render deployment hits the correct backend

## 2026-03-25 (6)

### Fixed
- Anam session token creation: use correct `{ personaConfig: { personaId } }` request body per API docs to fix "Legacy session tokens are no longer supported" error
- Avatar video visibility: listen to `VIDEO_STREAM_STARTED` and `AUDIO_STREAM_STARTED` as fallbacks so loading overlay clears; add `muted` to `<video>` for autoplay compliance
- Microphone not released on avatar error: call `cleanup()` in catch block and always call `stopStreaming()` unconditionally during cleanup

## 2026-03-25 (5)

### Added
- Anam.ai avatar chat integration: "Chat more" button on completion screen launches interactive avatar
- `POST /api/lea-2026/anam-session` endpoint for secure session token exchange
- `apps/web/components/anam-avatar.tsx`: avatar chat component with loading/error states and cleanup
- `ANAM_API_KEY` env var in `.env.example`

## 2026-03-25 (4)

### Changed
- `apps/api/src/index.js`: allow CORS from `https://lea-prototype.onrender.com` (and optional `WEB_ORIGIN`)

## 2026-03-25 (3)

### Added
- Session ID generation: Firestore doc ID returned as `sessionId` in API response
- Dynamic QR code on completion screen encoded with `sessionId` using `react-qr-code`

### Changed
- `apps/api/src/index.js`: `POST /api/lea-2026/response` now returns `{ ok: true, sessionId }`
- `apps/web/components/ai-facilitator.tsx`: stores `sessionId` from API response, renders live QR code, clears on kiosk reset

## 2026-03-25 (2)

### Added
- Firebase Firestore persistence: `apps/api/src/firestore.js` initializes Firebase Admin SDK via env vars
- `apps/api/.env.example` with required Firebase credential variables
- `dotenv` and `firebase-admin` dependencies to `apps/api`

### Changed
- `apps/api/src/index.js`: route handler is now async and writes validated responses to Firestore `responses` collection
- `apps/web/components/ai-facilitator.tsx`: final question Continue now POSTs all answers to the API, shows loading/error state, auto-resets the kiosk after 5 seconds

### Removed
- `apps/api/src/index.ts`, `apps/api/src/firestore.ts`, `apps/api/tsconfig.json` — API is plain JS, no TypeScript
- TypeScript devDependencies from `apps/api/package.json`

## 2026-03-25

### Added
- pnpm workspace monorepo structure with `apps/web` and `apps/api`

### Changed
- moved Next.js app into `apps/web`
- ignore local Firebase config file `@lea-prototype-firebase.json`
