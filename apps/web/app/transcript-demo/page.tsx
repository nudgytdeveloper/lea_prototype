"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, RotateCcw, MessageSquareText, Volume2 } from "lucide-react"
import { TranscriptPanel, type TranscriptMessage } from "@/components/transcript-panel"

// Demo conversation data
const demoConversation: Array<{ role: "user" | "ai"; content: string }> = [
  { role: "ai", content: "Hello! I'm Lea, your AI networking assistant. I noticed you're interested in investment opportunities. What specific sectors are you most excited about right now?" },
  { role: "user", content: "I've been really focused on AI infrastructure and developer tools lately." },
  { role: "ai", content: "Great focus areas! The AI infrastructure space is evolving rapidly. Are you looking at the foundational layer like compute and model serving, or more towards the application layer with developer tooling?" },
  { role: "user", content: "Mostly the foundational layer. I think there's still a lot of opportunity in making AI more efficient and accessible." },
  { role: "ai", content: "Absolutely. I've identified three founders here today working on exactly that. Would you like me to facilitate introductions? One is building next-gen inference optimization, another is working on distributed training infrastructure." },
  { role: "user", content: "Yes, I'd love to meet them! Especially the one working on inference optimization." },
  { role: "ai", content: "Perfect! I'll send you their profiles with a personalized intro. Based on your investment thesis, I think you'll find their approach to model compression particularly interesting. They've achieved 40% latency reduction while maintaining accuracy." },
]

export default function TranscriptDemo() {
  const [messages, setMessages] = useState<TranscriptMessage[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isAiSpeaking, setIsAiSpeaking] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showTranscript, setShowTranscript] = useState(true)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const messageIdRef = useRef(0)

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

  const playNextMessage = useCallback(() => {
    if (currentIndex >= demoConversation.length) {
      setIsPlaying(false)
      setIsAiSpeaking(false)
      return
    }

    const message = demoConversation[currentIndex]
    
    if (message.role === "ai") {
      setIsAiSpeaking(true)
      // Simulate AI speaking with typing indicator
      timeoutRef.current = setTimeout(() => {
        addMessage(message.role, message.content)
        setIsAiSpeaking(false)
        setCurrentIndex((prev) => prev + 1)
      }, 1500 + message.content.length * 15) // Vary delay based on content length
    } else {
      addMessage(message.role, message.content)
      setCurrentIndex((prev) => prev + 1)
    }
  }, [currentIndex, addMessage])

  useEffect(() => {
    if (isPlaying && currentIndex < demoConversation.length) {
      const delay = currentIndex === 0 ? 500 : 2000
      timeoutRef.current = setTimeout(playNextMessage, delay)
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isPlaying, currentIndex, playNextMessage])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setIsAiSpeaking(false)
    setCurrentIndex(0)
    setMessages([])
    messageIdRef.current = 0
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Hero Gradient Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[900px] h-[900px]">
          <div 
            className="absolute top-0 left-0 w-[700px] h-[700px] rounded-full animate-pulse"
            style={{
              background: "radial-gradient(circle at center, rgba(0, 212, 255, 0.7) 0%, rgba(0, 150, 255, 0.4) 30%, rgba(100, 100, 255, 0.2) 50%, transparent 70%)",
              filter: "blur(60px)",
              animation: "pulse 8s ease-in-out infinite",
            }}
          />
          <div 
            className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full"
            style={{
              background: "radial-gradient(circle at center, rgba(168, 85, 247, 0.8) 0%, rgba(139, 92, 246, 0.5) 25%, rgba(124, 58, 237, 0.3) 45%, transparent 65%)",
              filter: "blur(50px)",
              animation: "pulse 10s ease-in-out infinite 1s",
            }}
          />
          <div 
            className="absolute bottom-0 left-1/4 w-[650px] h-[650px] rounded-full"
            style={{
              background: "radial-gradient(circle at center, rgba(236, 72, 153, 0.7) 0%, rgba(219, 39, 119, 0.45) 30%, rgba(190, 24, 93, 0.25) 50%, transparent 70%)",
              filter: "blur(55px)",
              animation: "pulse 9s ease-in-out infinite 2s",
            }}
          />
        </div>
      </div>

      {/* Noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-8 py-16">
        {/* Logo */}
        <div className="absolute top-5 left-6 z-20">
          <Image
            src="/nudgyt-logo.png"
            alt="Nudgyt"
            width={72}
            height={22}
            className="object-contain"
            style={{ width: 72, height: "auto" }}
            priority
          />
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Live Transcript Demo</h1>
          <p className="text-white/50 text-sm">Experience the premium chat UI in action</p>
        </div>

        {/* Main Card */}
        <div className="relative w-full max-w-5xl">
          {/* Outer glow */}
          <div 
            className="absolute -inset-1 rounded-[2.5rem] opacity-50"
            style={{
              background: "linear-gradient(135deg, rgba(0, 212, 255, 0.3), rgba(168, 85, 247, 0.3), rgba(236, 72, 153, 0.3))",
              filter: "blur(20px)",
            }}
          />

          {/* Glassmorphism card */}
          <div 
            className="relative rounded-[2rem] p-8 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
            }}
          >
            {/* Top highlight */}
            <div 
              className="absolute top-0 left-12 right-12 h-px"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
              }}
            />

            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePlayPause}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-black transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)",
                    boxShadow: "0 0 20px rgba(168, 85, 247, 0.3), 0 0 40px rgba(0, 212, 255, 0.2)",
                  }}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      {currentIndex > 0 ? "Resume" : "Start Demo"}
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-white/60 transition-all duration-200 hover:text-white hover:bg-white/10"
                  style={{ border: "1px solid rgba(255, 255, 255, 0.15)" }}
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTranscript(!showTranscript)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  showTranscript ? "text-white" : "text-white/40 hover:text-white/70"
                }`}
                style={{
                  background: showTranscript
                    ? "linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%)"
                    : "rgba(255, 255, 255, 0.05)",
                  border: `1px solid ${showTranscript ? "rgba(168, 85, 247, 0.3)" : "rgba(255, 255, 255, 0.08)"}`,
                }}
              >
                <MessageSquareText className="h-4 w-4" />
                <span>Transcript</span>
              </motion.button>
            </div>

            {/* Content Area */}
            <div className="flex gap-6">
              {/* Mock Video Area */}
              <div 
                className="relative flex-1 aspect-video rounded-2xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(20, 20, 30, 0.9) 100%)",
                  boxShadow: "0 0 60px -15px rgba(168, 85, 247, 0.3), 0 0 30px -10px rgba(6, 182, 212, 0.2)",
                }}
              >
                {/* Gradient border */}
                <div
                  className="absolute -inset-px rounded-2xl z-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(6, 182, 212, 0.3), rgba(236, 72, 153, 0.3))",
                    filter: "blur(1px)",
                  }}
                />

                <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                  {/* Avatar placeholder */}
                  <div className="text-center">
                    <div 
                      className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center"
                      style={{
                        background: "linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(6, 182, 212, 0.3))",
                        boxShadow: "0 0 40px rgba(168, 85, 247, 0.3)",
                      }}
                    >
                      <Volume2 className={`h-10 w-10 text-white/60 ${isAiSpeaking ? "animate-pulse" : ""}`} />
                    </div>
                    <p className="text-white/70 font-medium">Lea AI</p>
                    <p className="text-white/40 text-sm mt-1">
                      {isAiSpeaking ? "Speaking..." : isPlaying ? "Listening..." : "Ready to chat"}
                    </p>
                  </div>

                  {/* Speaking indicator */}
                  <AnimatePresence>
                    {isAiSpeaking && (
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

            {/* Progress indicator */}
            <div className="mt-6 flex items-center gap-2">
              <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: "linear-gradient(90deg, rgba(168, 85, 247, 0.8), rgba(6, 182, 212, 0.8))",
                  }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${(currentIndex / demoConversation.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className="text-xs text-white/40 font-medium min-w-[3rem] text-right">
                {currentIndex}/{demoConversation.length}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom branding */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <p className="text-xs font-medium tracking-widest uppercase text-white/25">
            Powered by Nudgyt AI
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.7;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  )
}
