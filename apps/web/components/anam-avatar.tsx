"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { createClient, AnamEvent } from "@anam-ai/js-sdk"
import type { AnamClient } from "@anam-ai/js-sdk"
import { Maximize2, Minimize2, X } from "lucide-react"

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

        client.addListener(AnamEvent.CONNECTION_CLOSED, () => {
          if (!cancelled) {
            setError("Connection closed")
            setIsLoading(false)
          }
        })

        await client.streamToVideoElement("anam-video")
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
  }, [sessionToken, cleanup])

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
    <div className="text-center py-4">
      {/* Close button */}
      <div className="flex justify-end mb-4">
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

      {/* Video container */}
      <div
        ref={containerRef}
        className="relative mx-auto w-full max-w-none aspect-video rounded-2xl overflow-hidden bg-black"
      >
        {/* Loading state */}
        {isLoading && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <div
              className="h-10 w-10 rounded-full border-2 border-white/20 border-t-white/80 animate-spin mb-4"
            />
            <p className="text-sm text-white/50">Starting avatar...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <p className="text-sm text-red-400 mb-3">{error}</p>
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-semibold text-white/60 rounded-full transition-all duration-200 hover:text-white hover:bg-white/10"
              style={{ border: '1px solid rgba(255,255,255,0.15)' }}
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
            isLoading || error ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(168, 85, 247, 0.1))',
          }}
        />
      </div>

      {/* End chat button */}
      {!isLoading && !error && (
        <button
          onClick={handleClose}
          className="mt-6 px-6 py-2.5 text-sm font-semibold text-white/60 rounded-full transition-all duration-200 hover:text-white hover:bg-white/10"
          style={{ border: '1px solid rgba(255,255,255,0.15)' }}
        >
          End chat
        </button>
      )}
    </div>
  )
}
