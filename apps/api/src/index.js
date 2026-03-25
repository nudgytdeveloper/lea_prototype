require("dotenv").config();

const cors = require("cors");
const express = require("express");

const { LEA_2026_EVENT, LEA_2026_VENUE } = require("@lea/constants");
const { Lea2026ResponseSchema, Lea2026SubmissionSchema } = require("@lea/utils");
const { db } = require("./firestore");

const PORT = Number(process.env.PORT ?? 3001);
const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://lea-prototype.onrender.com",
];
const EXTRA_ALLOWED_ORIGINS = String(process.env.WEB_ORIGIN ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const ALLOWED_ORIGINS = new Set([
  ...DEFAULT_ALLOWED_ORIGINS,
  ...EXTRA_ALLOWED_ORIGINS,
]);

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.has(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/lea-2026/response", async (req, res) => {
  const submissionParsed = Lea2026SubmissionSchema.safeParse(req.body);
  if (!submissionParsed.success) {
    return res.status(400).json({
      ok: false,
      error: "Invalid payload",
      issues: submissionParsed.error.issues,
    });
  }

  const fullPayload = {
    event: LEA_2026_EVENT,
    venue: LEA_2026_VENUE,
    answers: submissionParsed.data.answers,
    submittedAt: submissionParsed.data.submittedAt ?? new Date().toISOString(),
  };

  const fullParsed = Lea2026ResponseSchema.safeParse(fullPayload);
  if (!fullParsed.success) {
    return res.status(400).json({
      ok: false,
      error: "Invalid payload after normalization",
      issues: fullParsed.error.issues,
    });
  }

  try {
    const docRef = await db.collection("responses").add(fullParsed.data);
    return res.status(200).json({ ok: true, sessionId: docRef.id });
  } catch (err) {
    console.error("Firestore write failed:", err);
    return res.status(500).json({ ok: false, error: "Failed to save response" });
  }
});

app.post("/api/lea-2026/anam-session", async (req, res) => {
  try {
    const response = await fetch("https://api.anam.ai/v1/auth/session-token", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.ANAM_API_KEY}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Anam auth failed");
    const data = await response.json();
    return res.json({ ok: true, sessionToken: data.sessionToken });
  } catch (err) {
    console.error("Anam session error:", err);
    return res.status(500).json({ ok: false, error: "Failed to create avatar session" });
  }
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
