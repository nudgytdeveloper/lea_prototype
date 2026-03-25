# Changelog

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
