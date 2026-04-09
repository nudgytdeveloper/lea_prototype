export enum Venue {
  FullertonHotel = "FullertonHotel"
}

export enum Event {
  LEA2026Singapore = "LEA2026Singapore"
}

export enum LeaQuestionId {
  Q1 = "Q1",
  Q2 = "Q2",
  Q3 = "Q3"
}

export const LEA_2026_VENUE = Venue.FullertonHotel
export const LEA_2026_EVENT = Event.LEA2026Singapore

/** Display name for the AI assistant in transcript UI and persona greetings. */
export const AI_ASSISTANT_DISPLAY_NAME = "Nudgyt AI" as const

/** Web Audio output gain for Anam persona (HTMLMediaElement volume caps at 1.0). */
export const ANAM_AVATAR_AUDIO_OUTPUT_GAIN = 2
