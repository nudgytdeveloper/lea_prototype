"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export interface TranscriptMessage {
  id: string
  role: "user" | "ai"
  content: string
  timestamp?: Date
  isNew?: boolean
}

interface TranscriptPanelProps {
  messages: TranscriptMessage[]
  isAiSpeaking?: boolean
  className?: string
}

// Typing indicator component
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <motion.div
        className="w-2 h-2 rounded-full bg-white/40"
        animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1, 0.8] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="w-2 h-2 rounded-full bg-white/40"
        animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1, 0.8] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      />
      <motion.div
        className="w-2 h-2 rounded-full bg-white/40"
        animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1, 0.8] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      />
    </div>
  )
}

// Chat bubble component
function ChatBubble({ message, index }: { message: TranscriptMessage; index: number }) {
  const [showGlow, setShowGlow] = useState(message.isNew ?? false)
  const isUser = message.role === "user"

  // Remove glow after 2 seconds
  useEffect(() => {
    if (showGlow) {
      const timer = setTimeout(() => setShowGlow(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [showGlow])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1],
        delay: index * 0.05,
      }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={`relative max-w-[85%] group`}
      >
        {/* Glow effect for new messages */}
        <AnimatePresence>
          {showGlow && (
            <motion.div
              initial={{ opacity: 0.8, scale: 1.02 }}
              animate={{ opacity: [0.8, 0.4, 0.8], scale: [1.02, 1.04, 1.02] }}
              exit={{ opacity: 0, scale: 1 }}
              transition={{ duration: 1.5, repeat: 1 }}
              className={`absolute -inset-1 rounded-3xl blur-lg ${
                isUser
                  ? "bg-gradient-to-r from-pink-500/30 to-orange-500/30"
                  : "bg-gradient-to-r from-purple-500/30 to-cyan-500/30"
              }`}
            />
          )}
        </AnimatePresence>

        {/* Bubble */}
        <div
          className={`relative rounded-3xl px-4 py-3 backdrop-blur-xl transition-all duration-300 ${
            isUser
              ? "rounded-br-lg"
              : "rounded-bl-lg"
          }`}
          style={{
            background: isUser
              ? "linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(249, 115, 22, 0.1) 100%)"
              : "linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)",
            border: `1px solid ${isUser ? "rgba(236, 72, 153, 0.2)" : "rgba(168, 85, 247, 0.2)"}`,
            boxShadow: `0 4px 24px -4px ${
              isUser ? "rgba(236, 72, 153, 0.15)" : "rgba(168, 85, 247, 0.15)"
            }, 0 0 0 1px rgba(255, 255, 255, 0.05) inset`,
          }}
        >
          {/* Subtle inner glow */}
          <div
            className="absolute inset-0 rounded-3xl opacity-50"
            style={{
              background: isUser
                ? "radial-gradient(ellipse at top right, rgba(249, 115, 22, 0.1), transparent 60%)"
                : "radial-gradient(ellipse at top left, rgba(6, 182, 212, 0.1), transparent 60%)",
            }}
          />

          {/* Content */}
          <p className="relative z-10 text-[15px] leading-relaxed text-white/90 font-medium">
            {message.content}
          </p>

          {/* Timestamp */}
          {message.timestamp && (
            <p className="relative z-10 mt-1.5 text-[10px] text-white/30 font-medium">
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export function TranscriptPanel({
  messages,
  isAiSpeaking = false,
  className = "",
}: TranscriptPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true)

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current && isScrolledToBottom) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages, isAiSpeaking, isScrolledToBottom])

  // Track scroll position
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      setIsScrolledToBottom(scrollTop + clientHeight >= scrollHeight - 20)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className={`relative flex flex-col w-full max-w-[320px] h-full max-h-[480px] overflow-hidden rounded-2xl ${className}`}
      style={{
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)",
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow:
          "0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)",
      }}
    >
      {/* Header */}
      <div
        className="relative px-5 py-4 border-b"
        style={{ borderColor: "rgba(255, 255, 255, 0.06)" }}
      >
        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{
                scale: isAiSpeaking ? [1, 1.2, 1] : 1,
                opacity: isAiSpeaking ? [0.5, 1, 0.5] : 0.8,
              }}
              transition={{
                duration: 1.5,
                repeat: isAiSpeaking ? Infinity : 0,
                ease: "easeInOut",
              }}
              className="absolute w-3 h-3 rounded-full bg-cyan-400/30"
            />
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: isAiSpeaking
                  ? "linear-gradient(135deg, #06b6d4, #a855f7)"
                  : "rgba(255, 255, 255, 0.4)",
              }}
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white/90 tracking-wide">
              Live Transcript
            </h3>
            <p className="text-[11px] text-white/40 font-medium">
              {isAiSpeaking ? "AI is speaking..." : "Conversation"}
            </p>
          </div>
        </div>

        {/* Subtle highlight line */}
        <div
          className="absolute bottom-0 left-5 right-5 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)",
          }}
        />
      </div>

      {/* Messages container with fade edges */}
      <div className="relative flex-1 min-h-0">
        {/* Top fade */}
        <div
          className="absolute top-0 left-0 right-0 h-8 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0, 0, 0, 0.3), transparent)",
          }}
        />

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-8 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent)",
          }}
        />

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20 px-4 py-4 space-y-3"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255, 255, 255, 0.1) transparent",
          }}
        >
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <ChatBubble key={message.id} message={message} index={index} />
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>
            {isAiSpeaking && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex justify-start"
              >
                <div
                  className="rounded-3xl rounded-bl-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)",
                    border: "1px solid rgba(168, 85, 247, 0.15)",
                  }}
                >
                  <TypingIndicator />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Subtle bottom accent */}
      <div
        className="h-1"
        style={{
          background:
            "linear-gradient(90deg, rgba(168, 85, 247, 0.2), rgba(6, 182, 212, 0.2), rgba(236, 72, 153, 0.2))",
        }}
      />
    </motion.div>
  )
}
