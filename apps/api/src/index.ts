import cors from "cors";
import express from "express";
import type { Request, Response } from "express";
import { LEA_2026_EVENT, LEA_2026_VENUE } from "@lea/constants";
import { Lea2026ResponseSchema, Lea2026SubmissionSchema } from "@lea/utils";

const PORT = Number(process.env.PORT ?? 3001);

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

app.post("/api/lea-2026/response", (req: Request, res: Response) => {
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

  // Prototype behavior: accept and log.
  console.log("LEA 2026 response:", fullParsed.data);

  return res.status(200).json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});

