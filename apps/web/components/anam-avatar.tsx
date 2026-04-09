"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { createClient, AnamEvent } from "@anam-ai/js-sdk"
import type { AnamClient } from "@anam-ai/js-sdk"
import { Maximize2, Minimize2, X, MessageSquareText } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { AI_ASSISTANT_DISPLAY_NAME, ANAM_AVATAR_AUDIO_OUTPUT_GAIN } from "@lea/constants"
import { TranscriptPanel, type TranscriptMessage } from "./transcript-panel"

interface AnamAvatarProps {
  sessionToken: string
  onClose: () => void
}

// Mock data for demonstration - shows alternating AI and user messages
const MOCK_TRANSCRIPT_DATA: TranscriptMessage[] = [
  {
    id: "mock-1",
    role: "ai",
    content: `Hello! I'm ${AI_ASSISTANT_DISPLAY_NAME}, your AI networking assistant. I'm here to help connect you with the right people at this event.`,
    timestamp: new Date(Date.now() - 60000),
    isNew: false,
  },
  {
    id: "mock-2", 
    role: "user",
    content: `Hi ${AI_ASSISTANT_DISPLAY_NAME}! I'm looking to meet some investors in the fintech space.`,
    timestamp: new Date(Date.now() - 45000),
    isNew: false,
  },
  {
    id: "mock-3",
    role: "ai",
    content: "That's great! Based on your profile, I can see you're a founder in the payments sector. There are several fintech investors here today who might be a perfect match.",
    timestamp: new Date(Date.now() - 30000),
    isNew: false,
  },
  {
    id: "mock-4",
    role: "user",
    content: "That sounds perfect. Can you tell me more about them?",
    timestamp: new Date(Date.now() - 15000),
    isNew: false,
  },
]

export function AnamAvatar({ sessionToken, onClose }: AnamAvatarProps) {
  const clientRef = useRef<AnamClient | null>(null)
  const initRef = useRef(false)
  const cleaningUpRef = useRef(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showTranscript, setShowTranscript] = useState(true)
  const [messages, setMessages] = useState<TranscriptMessage[]>(MOCK_TRANSCRIPT_DATA)
  const [isAiSpeaking, setIsAiSpeaking] = useState(false)
  const messageIdRef = useRef(MOCK_TRANSCRIPT_DATA.length)
  const processedMessagesRef = useRef<Set<string>>(new Set())
  const audioBoostCtxRef = useRef<AudioContext | null>(null)

  const teardownAudioBoost = useCallback(() => {
    const video = document.getElementById("anam-video") as HTMLVideoElement | null
    if (video) video.volume = 1
    const ctx = audioBoostCtxRef.current
    if (ctx) {
      audioBoostCtxRef.current = null
      void ctx.close()
    }
  }, [])

  const attachAudioBoost = useCallback(
    (audioStream: MediaStream) => {
      teardownAudioBoost()
      if (ANAM_AVATAR_AUDIO_OUTPUT_GAIN <= 1) return
      const video = document.getElementById("anam-video") as HTMLVideoElement | null
      if (video && audioStream === video.srcObject) {
        video.volume = 0
      }
      const ctx = new AudioContext()
      audioBoostCtxRef.current = ctx
      try {
        const source = ctx.createMediaStreamSource(audioStream)
        const gainNode = ctx.createGain()
        gainNode.gain.value = ANAM_AVATAR_AUDIO_OUTPUT_GAIN
        source.connect(gainNode)
        gainNode.connect(ctx.destination)
        void ctx.resume()
      } catch {
        void ctx.close()
        audioBoostCtxRef.current = null
        if (video) video.volume = 1
      }
    },
    [teardownAudioBoost]
  )

  const cleanup = useCallback(async () => {
    if (cleaningUpRef.current) return
    cleaningUpRef.current = true
    try {
      teardownAudioBoost()
      const client = clientRef.current
      if (client) {
        clientRef.current = null
        try { await client.stopStreaming() } catch { /* may not be streaming */ }
      }
      const video = document.getElementById("anam-video") as HTMLVideoElement | null
      if (video?.srcObject) {
        (video.srcObject as MediaStream).getTracks().forEach(t => t.stop())
        video.srcObject = null
      }
    } finally {
      cleaningUpRef.current = false
    }
  }, [teardownAudioBoost])

  // Add message helper - prevents duplicates
  const addMessage = useCallback((role: "user" | "ai", content: string) => {
    // Create a unique key for this message to prevent duplicates
    const normalized = content.trim()
    const contentKey = `${role}:${normalized}`
    if (processedMessagesRef.current.has(contentKey)) {
      return // Skip duplicate message
    }
    processedMessagesRef.current.add(contentKey)

    const id = `msg-${++messageIdRef.current}`
    setMessages((prev) => [
      ...prev,
      {
        id,
        role,
        content: normalized,
        timestamp: new Date(),
        isNew: true,
      },
    ])
  }, [])

  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    let cancelled = false

    const init = async () => {
      try {
        const client = createClient(sessionToken)
        clientRef.current = client

        const markReady = () => { if (!cancelled) setIsLoading(false) }

        client.addListener(AnamEvent.VIDEO_PLAY_STARTED, markReady)
        client.addListener(AnamEvent.VIDEO_STREAM_STARTED, markReady)
        client.addListener(AnamEvent.AUDIO_STREAM_STARTED, (audioStream) => {
          if (cancelled) return
          attachAudioBoost(audioStream)
          markReady()
        })

        // Listen for transcript events
        client.addListener(AnamEvent.MESSAGE_HISTORY_UPDATED, (history) => {
          if (cancelled || !history || history.length === 0) return
          history.forEach((msg) => {
            const role = msg.role === "user" ? "user" : "ai"
            addMessage(role, msg.content ?? "")
          })
        })

        // Derive AI speaking state from message stream events
        client.addListener(AnamEvent.MESSAGE_STREAM_EVENT_RECEIVED, (evt) => {
          if (cancelled) return
          const isPersona = evt.role === "persona"
          if (!isPersona) return
          setIsAiSpeaking(!evt.endOfSpeech)
        })

        client.addListener(AnamEvent.CONNECTION_CLOSED, () => {
          if (!cancelled) {
            setError("Connection closed")
            setIsLoading(false)
          }
        })

        await client.streamToVideoElement("anam-video")

        // Add a new AI message after connection to show the feed is live
        if (!cancelled) {
          setTimeout(() => {
            addMessage(
              "ai",
              `Hello! I'm ${AI_ASSISTANT_DISPLAY_NAME}, your AI networking assistant. How can I help you today?`
            )
          }, 2000)
        }
      } catch (err) {
        await cleanup()
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to start avatar")
          setIsLoading(false)
        }
      }
    }

    init()

    return () => {
      cancelled = true
      initRef.current = false
      cleanup()
    }
  }, [sessionToken, cleanup, addMessage, attachAudioBoost])

  useEffect(() => {
    const update = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener("fullscreenchange", update)
    update()
    return () => document.removeEventListener("fullscreenchange", update)
  }, [])

  const handleClose = useCallback(async () => {
    await cleanup()
    onClose()
  }, [cleanup, onClose])

  const handleToggleFullscreen = useCallback(async () => {
    const el = containerRef.current
    if (!el) return

    if (document.fullscreenElement) {
      await document.exitFullscreen()
      return
    }

    await el.requestFullscreen()
  }, [])

  const transcriptPanel = (
    <TranscriptPanel
      messages={messages}
      isAiSpeaking={isAiSpeaking}
      variant="overlay"
    />
  )

  const transcriptToggleButton = (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setShowTranscript(!showTranscript)}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
        showTranscript
          ? "text-white"
          : "text-white/40 hover:text-white/70"
      }`}
      style={{
        background: showTranscript
          ? "linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%)"
          : "rgba(255, 255, 255, 0.05)",
        border: `1px solid ${
          showTranscript ? "rgba(168, 85, 247, 0.3)" : "rgba(255, 255, 255, 0.08)"
        }`,
      }}
    >
      <MessageSquareText className="h-4 w-4" />
      <span>Transcript</span>
    </motion.button>
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Controls row - positioned above video (hidden while native fullscreen; duplicated inside fullscreen root) */}
      <div
        className={`mb-2 flex shrink-0 items-center justify-between ${isFullscreen ? "hidden" : ""}`}
      >
        {transcriptToggleButton}

        {/* Right controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleToggleFullscreen}
            className="p-2 rounded-full transition-all duration-200 text-white/40 hover:text-white hover:bg-white/10"
            aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-5 w-5" />
            ) : (
              <Maximize2 className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={handleClose}
            className="p-2 rounded-full transition-all duration-200 text-white/40 hover:text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main content: embedded = video + transcript column; fullscreen = full-bleed video + right overlay */}
      <div
        ref={containerRef}
        className={
          isFullscreen
            ? "relative flex h-svh w-full max-w-[100vw] flex-col overflow-hidden bg-black"
            : "flex min-h-0 flex-1 flex-col"
        }
      >
        {isFullscreen && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-start justify-between gap-2 p-3">
            <div className="pointer-events-auto">{transcriptToggleButton}</div>
            <div className="pointer-events-auto flex items-center gap-1">
              <button
                type="button"
                onClick={handleToggleFullscreen}
                className="rounded-full bg-black/35 p-2 text-white/80 backdrop-blur-md transition-all duration-200 hover:bg-black/50 hover:text-white"
                aria-label="Exit full screen"
              >
                <Minimize2 className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full bg-black/35 p-2 text-white/80 backdrop-blur-md transition-all duration-200 hover:bg-black/50 hover:text-white"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Video container */}
        <div
          className={
            isFullscreen
              ? "absolute inset-0 z-0 overflow-hidden bg-black"
              : "relative w-full overflow-hidden rounded-2xl bg-black"
          }
          style={
            isFullscreen
              ? undefined
              : {
                  aspectRatio: "16 / 9",
                  width: "100%",
                  maxWidth: "min(100%, calc((100svh - 11.5rem) * 16 / 9))",
                  maxHeight: "calc(100svh - 11.5rem)",
                  marginLeft: "auto",
                  marginRight: "auto",
                  boxShadow:
                    "0 0 80px -20px rgba(168, 85, 247, 0.4), 0 0 40px -15px rgba(6, 182, 212, 0.3), 0 25px 60px -20px rgba(0, 0, 0, 0.6)",
                }
          }
        >
          {/* Gradient border effect (embedded only) */}
          {!isFullscreen && (
            <div
              className="pointer-events-none absolute -inset-px z-0 rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(168, 85, 247, 0.5), rgba(6, 182, 212, 0.4), rgba(236, 72, 153, 0.4))",
                filter: "blur(1px)",
              }}
            />
          )}

          {/* Inner container */}
          <div
            className={`relative z-10 h-full w-full overflow-hidden bg-black ${
              isFullscreen ? "rounded-none" : "rounded-2xl"
            }`}
          >
            {/* Loading state */}
            {isLoading && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <div className="relative">
                  {/* Outer glow ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-3 rounded-full opacity-50"
                    style={{
                      background: "conic-gradient(from 0deg, transparent, rgba(168, 85, 247, 0.5), rgba(6, 182, 212, 0.5), transparent)",
                    }}
                  />
                  <div
                    className="relative h-14 w-14 rounded-full border-2 border-white/20 border-t-white/80 animate-spin"
                  />
                </div>
                <p className="mt-5 text-base text-white/50 font-medium">Initializing avatar...</p>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <p className="text-base text-red-400 mb-4">{error}</p>
                <button
                  onClick={handleClose}
                  className="px-5 py-2.5 text-sm font-semibold text-white/60 rounded-full transition-all duration-200 hover:text-white hover:bg-white/10"
                  style={{ border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  Go back
                </button>
              </div>
            )}

            {/* Video element - full coverage */}
            <video
              id="anam-video"
              autoPlay
              playsInline
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                isLoading || error ? "opacity-0" : "opacity-100"
              }`}
              style={{
                background: "linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(168, 85, 247, 0.1))",
              }}
            />

            {/* AI speaking indicator overlay - bottom left of video */}
            <AnimatePresence>
              {isAiSpeaking && !isLoading && !error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-5 left-5 flex items-center gap-2.5 rounded-full px-4 py-2"
                  style={{
                    background: "rgba(0, 0, 0, 0.6)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400"
                  />
                  <span className="text-sm text-white/80 font-medium">Speaking</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Embedded: live transcript as right glass overlay on video */}
          <AnimatePresence>
            {showTranscript && !isFullscreen && (
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="pointer-events-none absolute inset-0 z-30 flex justify-end py-2 pl-2 pr-2"
              >
                <div className="pointer-events-auto flex h-full min-h-0 w-[min(400px,42vw)] min-w-0 max-w-full flex-col">
                  {transcriptPanel}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Fullscreen: right-rail transcript (sibling of full-bleed video) */}
        <AnimatePresence>
          {showTranscript && isFullscreen && (
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 0 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="pointer-events-none absolute inset-y-0 right-0 z-30 flex w-[min(400px,42vw)] min-w-0 max-w-[min(400px,90vw)] flex-col py-3 pl-2 pr-3 pt-14"
            >
              <div className="pointer-events-auto flex h-full min-h-0 flex-1 flex-col">
                {transcriptPanel}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* End chat button - below everything with proper spacing (not inside fullscreen root) */}
      {!isLoading && !error && !isFullscreen && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={handleClose}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mx-auto mt-3 block shrink-0 rounded-full px-6 py-2.5 text-sm font-semibold text-white/60 transition-all duration-300 hover:bg-white/10 hover:text-white"
          style={{ 
            border: "1px solid rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
          }}
        >
          End conversation
        </motion.button>
      )}
    </div>
  )
}
