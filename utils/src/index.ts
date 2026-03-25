import { z } from "zod";
import { Event, LeaQuestionId, Venue } from "@lea/constants";

export const Lea2026AnswerSchema = z.object({
  questionId: z.nativeEnum(LeaQuestionId),
  value: z.union([z.string(), z.array(z.string())]),
});

export const Lea2026SubmissionSchema = z.object({
  answers: z.array(Lea2026AnswerSchema).length(3),
  submittedAt: z.string().datetime().optional(),
});

export const Lea2026ResponseSchema = z.object({
  event: z.nativeEnum(Event),
  venue: z.nativeEnum(Venue),
  answers: z.array(Lea2026AnswerSchema).length(3),
  submittedAt: z.string().datetime().optional(),
});

export type Lea2026Response = z.infer<typeof Lea2026ResponseSchema>;

