# UMBRA — QR deep link & Firestore integration

This document is for teams integrating **their** mobile or web app with the LEA kiosk flow. After an attendee completes the three questions on the kiosk, the kiosk shows a QR code. The encoded URL should open **your** app; the **`session`** query parameter is the Firestore document ID you use to load that attendee’s saved profile.

---

## End-to-end flow

1. Attendee completes the kiosk form.
2. The kiosk `POST`s answers to the LEA API, which writes one document to Firestore and returns `{ sessionId }` (same value as the new document ID).
3. The kiosk renders a QR code whose payload is a URL: **your app’s base URL** + `?session=<sessionId>`.
4. Your app reads the `session` parameter, then **reads** `responses/<sessionId>` from the shared Firebase project (or uses a backend you operate that does so).

---

## QR URL contract

| Item | Specification |
|------|----------------|
| **Who owns the host** | Your team. The QR must deep-link into **your** app or site, not the kiosk origin (unless you explicitly choose the kiosk URL). |
| **Query parameter name** | `session` |
| **Parameter value** | Firestore document ID returned by the kiosk backend as `sessionId` (URL-encoded when embedded in the QR). |
| **Example** | `https://your-app.example.com/open?session=AbC12dEfGhIjKlMnOpQr` |

**Kiosk configuration:** the web app builds the QR from `NEXT_PUBLIC_APP_URL` when set, otherwise from `window.location.origin`. For Umbra, deploy the kiosk with:

```bash
NEXT_PUBLIC_APP_URL=https://your-app.example.com/your-path
```

Trailing slashes on the base URL are normalized; the kiosk appends `/?session=…` (or `?session=…` after the normalized base).

---

## Firestore

| Item | Value |
|------|--------|
| **Collection** | `responses` |
| **Document ID** | Same string as the `session` query parameter (and as `sessionId` from the submit API). |
| **Writer** | LEA API service account (`apps/api` → `POST /api/lea-2026/response`). |

**Access:** Reading these documents requires credentials or rules agreed with the Nudgyt / LEA team (e.g. service account, server-side proxy, or Firestore security rules scoped to your use case). The kiosk frontend does not expose Firestore keys.

---

## Stored document schema (`responses/{sessionId}`)

The API validates and stores payloads matching **`Lea2026Response`** (Zod: `Lea2026ResponseSchema` in `@lea/utils`). Shape in JSON terms:

### JSON shape

```json
{
  "event": "LEA2026Singapore",
  "venue": "FullertonHotel",
  "answers": [
    { "questionId": "Q1", "value": "founder" },
    { "questionId": "Q2", "value": "networking" },
    { "questionId": "Q3", "value": "tech" }
  ],
  "submittedAt": "2026-04-07 03:45:12 PM"
}
```

### Field reference

| Field | Type | Notes |
|-------|------|--------|
| `event` | string (enum) | Constant for this deployment: `"LEA2026Singapore"` (`Event.LEA2026Singapore`). |
| `venue` | string (enum) | Constant: `"FullertonHotel"` (`Venue.FullertonHotel`). |
| `answers` | array (length 3) | Exactly three items, one per `questionId` `Q1`, `Q2`, `Q3` (order in the array is not guaranteed; resolve by `questionId`). |
| `answers[].questionId` | string | `"Q1"` \| `"Q2"` \| `"Q3"`. |
| `answers[].value` | string \| string[] | Kiosk currently sends a **single string** per question (the selected option id). The schema allows an array for forward compatibility. |
| `submittedAt` | string (optional) | If omitted in the API request, the server sets a formatted timestamp in **Asia/Singapore** (see API implementation). |

### Canonical enums (TypeScript / shared package)

From `@lea/constants`:

- `Event.LEA2026Singapore` → `"LEA2026Singapore"`
- `Venue.FullertonHotel` → `"FullertonHotel"`
- `LeaQuestionId.Q1` → `"Q1"`, `Q2` → `"Q2"`, `Q3` → `"Q3"`

Zod schemas (for validation or code generation): `@lea/utils` exports `Lea2026AnswerSchema`, `Lea2026SubmissionSchema`, `Lea2026ResponseSchema`.

---

## Question semantics and option ids (`value` fields)

The kiosk maps UI choices to the `value` strings below.

| `questionId` | Kiosk question (summary) | Allowed `value` strings |
|--------------|---------------------------|-------------------------|
| `Q1` | Role | `investor`, `founder`, `executive`, `operator`, `creative` |
| `Q2` | Looking for today | `networking`, `partnerships`, `investment`, `hiring`, `learning` |
| `Q3` | Industry | `tech`, `finance`, `healthcare`, `media`, `other` |

---

## API that creates the session (reference)

Integrators normally **only read Firestore** using `session`. For completeness, the document is created by:

- **Method / path:** `POST /api/lea-2026/response`
- **Request body** (`Lea2026SubmissionSchema`): `{ "answers": [ { "questionId", "value" }, … ] }` — three answers; `submittedAt` optional.
- **Success response:** `{ "ok": true, "sessionId": "<firestore-document-id>" }`

Base URL is the deployed LEA API (e.g. configured as `NEXT_PUBLIC_API_URL` on the kiosk). **CORS** on the API is restricted to known web origins; server-to-server calls from your backend do not send a browser `Origin` and are typically allowed.

---

## Integration checklist

- [ ] Provide **production base URL** (and path if needed) for `NEXT_PUBLIC_APP_URL` on the kiosk build.
- [ ] Confirm **Firebase project** and how your app or backend obtains **read** access to `responses/{sessionId}`.
- [ ] Handle missing or invalid `session` (no document, malformed id) with a clear user message.
- [ ] Treat `answers` as keyed by `questionId`, not by array index.

---

## Versioning

Schemas live in the monorepo packages `constants/` and `utils/`. If enums or question ids change, this document should be updated together with those packages and the kiosk UI.
