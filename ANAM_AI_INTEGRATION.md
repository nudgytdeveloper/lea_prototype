# Anam.ai integration (generic)

This is a **system-agnostic** guide for integrating Anam.ai avatar chat into any product. It focuses on the standard, secure pattern: **server creates a session token** → **client streams avatar** → **cleanup on close**.

## Minimal architecture (recommended)

- **Backend** (your server): holds `ANAM_API_KEY`, creates short-lived **session tokens**
- **Frontend** (browser app): uses the **Anam JS SDK** with the session token to stream video/audio

**Never** call Anam’s session-token API directly from the browser.

---

## 1) Backend: mint an Anam session token

### Required server env vars

- **`ANAM_API_KEY`**: Anam server API key (secret)
- **`ANAM_PERSONA_ID`**: persona to use for the session

### Create an endpoint in your backend

Your frontend should call something like:

- `POST /anam/session`

Return:

```json
{ "sessionToken": "<token>" }
```

### Server-side request to Anam

Your backend calls Anam:

- `POST https://api.anam.ai/v1/auth/session-token`
- Headers:
  - `Authorization: Bearer <ANAM_API_KEY>`
  - `Content-Type: application/json`
- Body:

```json
{
  "personaConfig": { "personaId": "<ANAM_PERSONA_ID>" }
}
```

### Express example (copy/paste)

```js
app.post("/anam/session", async (_req, res) => {
  try {
    const response = await fetch("https://api.anam.ai/v1/auth/session-token", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.ANAM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personaConfig: { personaId: process.env.ANAM_PERSONA_ID },
      }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: "Anam auth failed", details: data });
    return res.json({ sessionToken: data.sessionToken });
  } catch (err) {
    return res.status(500).json({ error: "Failed to create Anam session" });
  }
});
```

**Production notes** (keep it simple):

- If your frontend is browser-based and cross-origin, configure **CORS** on `/anam/session`
- Add basic **rate limiting** to this endpoint

---

## 2) Frontend: stream the avatar in the browser

### Install the SDK

```bash
pnpm add @anam-ai/js-sdk
# or: npm i @anam-ai/js-sdk
```

### High-level flow

1. User clicks “Start chat”
2. Frontend calls your backend: `POST /anam/session`
3. Backend returns `sessionToken`
4. Frontend:
   - `createClient(sessionToken)`
   - `client.streamToVideoElement("anam-video")`

### Minimal React example (copy/paste)

```tsx
import { useEffect, useRef, useState } from "react";
import { createClient } from "@anam-ai/js-sdk";

export function AnamAvatarWidget() {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const clientRef = useRef<any>(null);

  async function start() {
    const res = await fetch("/anam/session", { method: "POST" });
    const data = await res.json();
    setSessionToken(data.sessionToken);
  }

  useEffect(() => {
    if (!sessionToken) return;
    let cancelled = false;

    async function run() {
      const client = createClient(sessionToken);
      clientRef.current = client;
      await client.streamToVideoElement("anam-video");
      if (cancelled) await client.stopStreaming();
    }

    run();

    return () => {
      cancelled = true;
      const client = clientRef.current;
      clientRef.current = null;
      if (client) void client.stopStreaming();

      const video = document.getElementById("anam-video") as HTMLVideoElement | null;
      if (video?.srcObject) {
        (video.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
        video.srcObject = null;
      }
    };
  }, [sessionToken]);

  return (
    <div>
      {!sessionToken ? (
        <button onClick={start}>Start chat</button>
      ) : (
        <video id="anam-video" autoPlay playsInline style={{ width: "100%" }} />
      )}
    </div>
  );
}
```

### Cleanup (must-have)

On close/unmount, always:

- call `client.stopStreaming()`
- stop tracks on `video.srcObject`

This prevents “can’t start again” / “concurrent session limit” / devices not released.

---

## 3) Common issues (quick checklist)

- **No audio/video**: browser autoplay policies — start streaming only after a user gesture; ensure `<video autoPlay playsInline>` is used.
- **Repeated opens fail**: cleanup missing — ensure `stopStreaming()` + track stop runs.
- **Session creation fails**: check `ANAM_API_KEY`, `ANAM_PERSONA_ID`, and server network egress.

