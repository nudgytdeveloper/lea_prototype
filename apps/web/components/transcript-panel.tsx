"use client"

import { AI_ASSISTANT_DISPLAY_NAME } from "@lea/constants"
import { useEffect, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, User } from "lucide-react"

export interface TranscriptMessage {
  id: string
  role: "user" | "ai"
  content: string
  timestamp?: Date
  isNew?: boolean
}

type TranscriptPanelVariant = "default" | "overlay"

interface TranscriptPanelProps {
  messages: TranscriptMessage[]
  isAiSpeaking?: boolean
  className?: string
  /** Fullscreen right-rail: taller, more transparent glass over video */
  variant?: TranscriptPanelVariant
}

// Typing indicator component
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-5 py-3">
      <motion.div
        className="w-2.5 h-2.5 rounded-full bg-white/50"
        animate={{ opacity: [0.4, 1, 0.4], scale: [0.85, 1, 0.85] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="w-2.5 h-2.5 rounded-full bg-white/50"
        animate={{ opacity: [0.4, 1, 0.4], scale: [0.85, 1, 0.85] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      />
      <motion.div
        className="w-2.5 h-2.5 rounded-full bg-white/50"
        animate={{ opacity: [0.4, 1, 0.4], scale: [0.85, 1, 0.85] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      />
    </div>
  )
}

// Chat bubble component - redesigned for horizontal layout
function ChatBubble({ message }: { message: TranscriptMessage }) {
  const [showGlow, setShowGlow] = useState(message.isNew ?? false)
  const isUser = message.role === "user"

  // Remove glow after animation completes
  useEffect(() => {
    if (showGlow) {
      const timer = setTimeout(() => setShowGlow(false), 2500)
      return () => clearTimeout(timer)
    }
  }, [showGlow])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1],
      }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={`relative max-w-[70%] group flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      >
        {/* Speaker icon */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 ${
            isUser ? "bg-gradient-to-br from-pink-500/30 to-orange-500/20" : "bg-gradient-to-br from-purple-500/30 to-cyan-500/20"
          }`}
          style={{
            border: `1px solid ${isUser ? "rgba(236, 72, 153, 0.3)" : "rgba(168, 85, 247, 0.3)"}`,
          }}
        >
          {isUser ? (
            <User className="w-4 h-4 text-pink-300/80" />
          ) : (
            <Bot className="w-4 h-4 text-purple-300/80" />
          )}
        </div>

        {/* Bubble container */}
        <div className="relative">
          {/* Glow effect for new messages */}
          <AnimatePresence>
            {showGlow && (
              <motion.div
                initial={{ opacity: 0.9, scale: 1.02 }}
                animate={{ 
                  opacity: [0.9, 0.4, 0.7, 0.3], 
                  scale: [1.02, 1.05, 1.03, 1] 
                }}
                exit={{ opacity: 0, scale: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className={`absolute -inset-2 rounded-[2rem] blur-xl ${
                  isUser
                    ? "bg-gradient-to-r from-pink-500/40 to-orange-500/30"
                    : "bg-gradient-to-r from-purple-500/40 to-cyan-500/30"
                }`}
              />
            )}
          </AnimatePresence>

          {/* Bubble */}
          <div
            className={`relative rounded-[1.5rem] px-5 py-3.5 backdrop-blur-xl transition-all duration-300 ${
              isUser ? "rounded-tr-lg" : "rounded-tl-lg"
            }`}
            style={{
              background: isUser
                ? "linear-gradient(135deg, rgba(236, 72, 153, 0.18) 0%, rgba(249, 115, 22, 0.12) 100%)"
                : "linear-gradient(135deg, rgba(168, 85, 247, 0.18) 0%, rgba(6, 182, 212, 0.12) 100%)",
              border: `1px solid ${isUser ? "rgba(236, 72, 153, 0.25)" : "rgba(168, 85, 247, 0.25)"}`,
              boxShadow: `0 8px 32px -8px ${
                isUser ? "rgba(236, 72, 153, 0.2)" : "rgba(168, 85, 247, 0.2)"
              }, 0 0 0 1px rgba(255, 255, 255, 0.06) inset`,
            }}
          >
            {/* Subtle inner highlight */}
            <div
              className={`absolute inset-0 opacity-60 pointer-events-none ${
                isUser ? "rounded-[1.5rem] rounded-tr-lg" : "rounded-[1.5rem] rounded-tl-lg"
              }`}
              style={{
                background: isUser
                  ? "radial-gradient(ellipse at top right, rgba(249, 115, 22, 0.15), transparent 50%)"
                  : "radial-gradient(ellipse at top left, rgba(6, 182, 212, 0.15), transparent 50%)",
              }}
            />

            {/* Speaker label */}
            <p className={`relative z-10 text-[11px] font-semibold uppercase tracking-wider mb-1.5 ${
              isUser ? "text-pink-300/60" : "text-purple-300/60"
            }`}>
              {isUser ? "You" : AI_ASSISTANT_DISPLAY_NAME}
            </p>

            {/* Content */}
            <p className="relative z-10 text-[16px] leading-relaxed text-white/95 font-medium">
              {message.content}
            </p>

            {/* Timestamp */}
            {message.timestamp && (
              <p className="relative z-10 mt-2 text-[10px] text-white/30 font-medium">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function TranscriptPanel({
  messages,
  isAiSpeaking = false,
  className = "",
  variant = "default",
}: TranscriptPanelProps) {
  const isOverlay = variant === "overlay"
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true)
  const [showJumpToLatest, setShowJumpToLatest] = useState(false)

  const lastMessageKey = useMemo(() => {
    const last = messages[messages.length - 1]
    return last ? `${last.id}:${last.role}` : "empty"
  }, [messages])

  // Auto-scroll to latest message
  useEffect(() => {
    if (!isScrolledToBottom) return
    const target = bottomRef.current
    if (!target) return

    // Wait a tick so layout/animations update scrollHeight.
    const raf = requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "end" })
    })
    return () => cancelAnimationFrame(raf)
  }, [lastMessageKey, isAiSpeaking, isScrolledToBottom])

  // Track scroll position
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      const atBottom = scrollTop + clientHeight >= scrollHeight - 48
      setIsScrolledToBottom(atBottom)
      setShowJumpToLatest(!atBottom && messages.length > 0)
    }
  }

  const panelStyle = isOverlay
    ? {
        background:
          "linear-gradient(180deg, rgba(10, 10, 18, 0.35) 0%, rgba(10, 10, 18, 0.22) 100%)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow:
          "0 12px 40px -12px rgba(0, 0, 0, 0.45), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)",
        minHeight: 0,
        maxHeight: "none" as const,
      }
    : {
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.02) 100%)",
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow:
          "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)",
        minHeight: "180px",
        maxHeight: "260px",
      }

  return (
    <motion.div
      initial={{ opacity: 0, y: isOverlay ? 12 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: isOverlay ? 12 : 20 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className={`relative flex flex-col w-full overflow-hidden rounded-2xl ${
        isOverlay ? "h-full min-h-0 flex-1" : ""
      } ${className}`}
      style={panelStyle}
    >
      {/* Header bar */}
      <div
        className="relative px-6 py-3 border-b flex-shrink-0"
        style={{ borderColor: "rgba(255, 255, 255, 0.06)" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <div className="relative flex items-center justify-center">
              <motion.div
                animate={{
                  scale: isAiSpeaking ? [1, 1.3, 1] : 1,
                  opacity: isAiSpeaking ? [0.5, 1, 0.5] : 0.8,
                }}
                transition={{
                  duration: 1.5,
                  repeat: isAiSpeaking ? Infinity : 0,
                  ease: "easeInOut",
                }}
                className="absolute w-4 h-4 rounded-full bg-cyan-400/30"
              />
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  background: isAiSpeaking
                    ? "linear-gradient(135deg, #06b6d4, #a855f7)"
                    : "rgba(255, 255, 255, 0.5)",
                }}
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white/90 tracking-wide">
                Live Transcript
              </h3>
            </div>
          </div>
          
          {/* Status badge */}
          <div 
            className="px-3 py-1 rounded-full text-[11px] font-medium"
            style={{
              background: isAiSpeaking 
                ? "linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(6, 182, 212, 0.15))"
                : "rgba(255, 255, 255, 0.05)",
              border: `1px solid ${isAiSpeaking ? "rgba(168, 85, 247, 0.3)" : "rgba(255, 255, 255, 0.08)"}`,
              color: isAiSpeaking ? "rgba(168, 85, 247, 0.9)" : "rgba(255, 255, 255, 0.4)",
            }}
          >
            {isAiSpeaking ? "AI Speaking" : "Listening"}
          </div>
        </div>

        {/* Subtle highlight line */}
        <div
          className="absolute bottom-0 left-6 right-6 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)",
          }}
        />
      </div>

      {/* Messages container */}
      <div className="relative flex-1 min-h-0">
        {/* Top fade */}
        <div
          className="absolute top-0 left-0 right-0 h-6 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10, 10, 15, 0.5), transparent)",
          }}
        />

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-6 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(10, 10, 15, 0.5), transparent)",
          }}
        />

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20 px-6 py-4 space-y-4"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255, 255, 255, 0.1) transparent",
          }}
        >
          {/* Empty state */}
          {messages.length === 0 && !isAiSpeaking && (
            <div className="flex items-center justify-center h-full py-8">
              <p className="text-sm text-white/30 font-medium">Conversation will appear here...</p>
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>
            {isAiSpeaking && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="flex justify-start items-start gap-3"
              >
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 bg-gradient-to-br from-purple-500/30 to-cyan-500/20"
                  style={{
                    border: "1px solid rgba(168, 85, 247, 0.3)",
                  }}
                >
                  <Bot className="w-4 h-4 text-purple-300/80" />
                </div>
                <div
                  className="rounded-[1.5rem] rounded-tl-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)",
                    border: "1px solid rgba(168, 85, 247, 0.2)",
                  }}
                >
                  <TypingIndicator />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sentinel element for scroll-to-bottom */}
          <div ref={bottomRef} />
        </div>

        {/* Jump to latest button */}
        <AnimatePresence>
          {showJumpToLatest && (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={() => {
                setIsScrolledToBottom(true)
                setShowJumpToLatest(false)
                bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
              }}
              className="absolute bottom-6 right-6 z-20 px-3.5 py-2 rounded-full text-[12px] font-semibold text-white/80 hover:text-white transition-colors"
              style={{
                background:
                  "linear-gradient(135deg, rgba(168, 85, 247, 0.22) 0%, rgba(6, 182, 212, 0.16) 100%)",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                boxShadow: "0 12px 24px -12px rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(12px)",
              }}
            >
              Jump to latest
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom gradient accent */}
      <div
        className="h-1 flex-shrink-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(168, 85, 247, 0.3), rgba(6, 182, 212, 0.3), rgba(236, 72, 153, 0.3))",
        }}
      />
    </motion.div>
  )
}
