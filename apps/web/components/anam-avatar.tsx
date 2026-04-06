"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { createClient, AnamEvent } from "@anam-ai/js-sdk"
import type { AnamClient } from "@anam-ai/js-sdk"
import { Maximize2, Minimize2, X, MessageSquareText } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { TranscriptPanel, type TranscriptMessage } from "./transcript-panel"

interface AnamAvatarProps {
  sessionToken: string
  onClose: () => void
}

export function AnamAvatar({ sessionToken, onClose }: AnamAvatarProps) {
  const clientRef = useRef<AnamClient | null>(null)
  const initRef = useRef(false)
  const cleaningUpRef = useRef(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showTranscript, setShowTranscript] = useState(true)
  const [messages, setMessages] = useState<TranscriptMessage[]>([])
  const [isAiSpeaking, setIsAiSpeaking] = useState(false)
  const messageIdRef = useRef(0)

  const cleanup = useCallback(async () => {
    if (cleaningUpRef.current) return
    cleaningUpRef.current = true
    try {
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
  }, [])

  // Add message helper
  const addMessage = useCallback((role: "user" | "ai", content: string) => {
    const id = `msg-${++messageIdRef.current}`
    setMessages((prev) => [
      ...prev,
      {
        id,
        role,
        content,
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
        client.addListener(AnamEvent.AUDIO_STREAM_STARTED, markReady)

        // Listen for transcript events
        client.addListener(AnamEvent.MESSAGE_HISTORY_UPDATED, (data: { messages: Array<{ role: string; content: string }> }) => {
          if (!cancelled && data?.messages) {
            // Process new messages from the history
            const latestMessage = data.messages[data.messages.length - 1]
            if (latestMessage) {
              const role = latestMessage.role === "user" ? "user" : "ai"
              addMessage(role, latestMessage.content)
            }
          }
        })

        // Listen for AI speaking state
        client.addListener(AnamEvent.TALK_STREAM_STARTED, () => {
          if (!cancelled) setIsAiSpeaking(true)
        })

        client.addListener(AnamEvent.TALK_STREAM_ENDED, () => {
          if (!cancelled) setIsAiSpeaking(false)
        })

        client.addListener(AnamEvent.CONNECTION_CLOSED, () => {
          if (!cancelled) {
            setError("Connection closed")
            setIsLoading(false)
          }
        })

        await client.streamToVideoElement("anam-video")

        // Add initial greeting after connection
        if (!cancelled) {
          setTimeout(() => {
            addMessage("ai", "Hello! I'm your AI assistant. How can I help you today?")
          }, 1500)
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
  }, [sessionToken, cleanup, addMessage])

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

  return (
    <div className="py-4">
      {/* Controls row */}
      <div className="flex items-center justify-between mb-4">
        {/* Transcript toggle */}
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

      {/* Main content area */}
      <div className="flex gap-4">
        {/* Video container */}
        <div
          ref={containerRef}
          className={`relative flex-1 aspect-video rounded-2xl overflow-hidden bg-black transition-all duration-500 ${
            showTranscript ? "max-w-none" : "max-w-none"
          }`}
          style={{
            boxShadow: "0 0 60px -15px rgba(168, 85, 247, 0.3), 0 0 30px -10px rgba(6, 182, 212, 0.2)",
          }}
        >
          {/* Gradient border effect */}
          <div
            className="absolute -inset-px rounded-2xl z-0 pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(6, 182, 212, 0.3), rgba(236, 72, 153, 0.3))",
              filter: "blur(1px)",
            }}
          />

          {/* Inner container */}
          <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden bg-black">
            {/* Loading state */}
            {isLoading && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <div className="relative">
                  {/* Outer glow ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-2 rounded-full opacity-50"
                    style={{
                      background: "conic-gradient(from 0deg, transparent, rgba(168, 85, 247, 0.5), rgba(6, 182, 212, 0.5), transparent)",
                    }}
                  />
                  <div
                    className="relative h-12 w-12 rounded-full border-2 border-white/20 border-t-white/80 animate-spin"
                  />
                </div>
                <p className="mt-4 text-sm text-white/50 font-medium">Initializing avatar...</p>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <p className="text-sm text-red-400 mb-3">{error}</p>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-semibold text-white/60 rounded-full transition-all duration-200 hover:text-white hover:bg-white/10"
                  style={{ border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  Go back
                </button>
              </div>
            )}

            {/* Video element */}
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

            {/* AI speaking indicator overlay */}
            <AnimatePresence>
              {isAiSpeaking && !isLoading && !error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(0, 0, 0, 0.5)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-cyan-400"
                  />
                  <span className="text-xs text-white/70 font-medium">Speaking</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Transcript Panel */}
        <AnimatePresence>
          {showTranscript && (
            <TranscriptPanel
              messages={messages}
              isAiSpeaking={isAiSpeaking}
            />
          )}
        </AnimatePresence>
      </div>

      {/* End chat button */}
      {!isLoading && !error && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={handleClose}
          className="mt-6 mx-auto block px-6 py-2.5 text-sm font-semibold text-white/60 rounded-full transition-all duration-200 hover:text-white hover:bg-white/10"
          style={{ border: "1px solid rgba(255,255,255,0.15)" }}
        >
          End conversation
        </motion.button>
      )}
    </div>
  )
}
