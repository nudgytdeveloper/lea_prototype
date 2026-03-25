"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import Image from "next/image"
import { ArrowRight, Check } from "lucide-react"

// Question data structure
const questions = [
  {
    id: 1,
    title: "What best describes your role?",
    subtitle: "This helps us personalize your networking experience",
    options: [
      { id: "investor", label: "Investor" },
      { id: "founder", label: "Founder" },
      { id: "executive", label: "Executive" },
      { id: "operator", label: "Operator" },
      { id: "creative", label: "Creative" },
    ],
  },
  {
    id: 2,
    title: "What are you looking for today?",
    subtitle: "Select what matters most to you right now",
    options: [
      { id: "networking", label: "Networking" },
      { id: "partnerships", label: "Partnerships" },
      { id: "investment", label: "Investment" },
      { id: "hiring", label: "Hiring Talent" },
      { id: "learning", label: "Learning" },
    ],
  },
  {
    id: 3,
    title: "What industry are you in?",
    subtitle: "Help us connect you with the right people",
    options: [
      { id: "tech", label: "Technology" },
      { id: "finance", label: "Finance" },
      { id: "healthcare", label: "Healthcare" },
      { id: "media", label: "Media" },
      { id: "other", label: "Other" },
    ],
  },
]

// Liquid/Energy effect component for chips
function LiquidGlow({ isActive }: { isActive: boolean }) {
  return (
    <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
      {/* Flowing energy particles */}
      <div 
        className={`absolute inset-0 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Primary shimmer wave */}
        <div 
          className="absolute inset-0 animate-shimmer-flow"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.15), rgba(0, 212, 255, 0.2), rgba(236, 72, 153, 0.15), transparent)',
            backgroundSize: '200% 100%',
          }}
        />
        {/* Secondary energy pulse */}
        <div 
          className="absolute inset-0 animate-energy-pulse"
          style={{
            background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.15), transparent 60%)',
          }}
        />
        {/* Edge glow */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: 'inset 0 0 20px rgba(168, 85, 247, 0.2), inset 0 0 40px rgba(0, 212, 255, 0.1)',
          }}
        />
      </div>
    </div>
  )
}

// Title liquid effect component
function TitleLiquidEffect({ isActive }: { isActive: boolean }) {
  return (
    <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
      {/* Subtle underline glow */}
      <div 
        className="absolute bottom-0 left-1/4 right-1/4 h-px animate-title-glow"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.6), rgba(0, 212, 255, 0.6), rgba(236, 72, 153, 0.6), transparent)',
        }}
      />
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-1 h-1 rounded-full bg-cyan-400/40 animate-float-particle-1" />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 rounded-full bg-purple-400/40 animate-float-particle-2" />
        <div className="absolute bottom-1/3 left-1/3 w-0.5 h-0.5 rounded-full bg-pink-400/40 animate-float-particle-3" />
      </div>
    </div>
  )
}

export function AIFacilitator() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [hoveredChip, setHoveredChip] = useState<string | null>(null)
  const [isTitleHovered, setIsTitleHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const currentQ = questions[currentQuestion]
  const selected = answers[currentQuestion] || null
  const totalQuestions = questions.length

  // Handle mouse move for interactive glow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        cardRef.current.style.setProperty('--mouse-x', `${x}%`)
        cardRef.current.style.setProperty('--mouse-y', `${y}%`)
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleSelect = useCallback((optionId: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: optionId }))
  }, [currentQuestion])

  const handleContinue = useCallback(() => {
    if (!selected || isTransitioning) return

    setIsTransitioning(true)

    // Smooth transition to next question or complete
    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(prev => prev + 1)
      } else {
        setIsComplete(true)
      }
      setIsTransitioning(false)
    }, 400)
  }, [selected, isTransitioning, currentQuestion, totalQuestions])

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Pure black background for maximum contrast */}
      <div className="absolute inset-0 bg-black" />
      
      {/* ========== HERO GRADIENT - THE STAR OF THE SHOW ========== */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[900px] h-[900px]">
          {/* Primary vibrant gradient orb - CYAN/BLUE */}
          <div 
            className="absolute top-0 left-0 w-[700px] h-[700px] rounded-full animate-gradient-shift-1"
            style={{
              background: 'radial-gradient(circle at center, rgba(0, 212, 255, 0.9) 0%, rgba(0, 150, 255, 0.6) 30%, rgba(100, 100, 255, 0.3) 50%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />
          
          {/* Secondary gradient orb - PURPLE/VIOLET */}
          <div 
            className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full animate-gradient-shift-2"
            style={{
              background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.95) 0%, rgba(139, 92, 246, 0.7) 25%, rgba(124, 58, 237, 0.4) 45%, transparent 65%)',
              filter: 'blur(50px)',
            }}
          />
          
          {/* Tertiary gradient orb - MAGENTA/PINK */}
          <div 
            className="absolute bottom-0 left-1/4 w-[650px] h-[650px] rounded-full animate-gradient-shift-3"
            style={{
              background: 'radial-gradient(circle at center, rgba(236, 72, 153, 0.9) 0%, rgba(219, 39, 119, 0.65) 30%, rgba(190, 24, 93, 0.35) 50%, transparent 70%)',
              filter: 'blur(55px)',
            }}
          />
          
          {/* Accent highlight - bright white/cyan core for luminosity */}
          <div 
            className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full animate-pulse-slow"
            style={{
              background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.4) 0%, rgba(200, 230, 255, 0.2) 30%, transparent 60%)',
              filter: 'blur(40px)',
            }}
          />
          
          {/* Deep blue accent for depth */}
          <div 
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full animate-gradient-shift-4"
            style={{
              background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.8) 0%, rgba(37, 99, 235, 0.5) 35%, transparent 65%)',
              filter: 'blur(45px)',
            }}
          />
        </div>
      </div>

      {/* Subtle noise texture overlay for premium feel */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Main content container */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-8 py-16">
        
        {/* Nudgyt Logo - Top left, small brand mark */}
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

        {/* Central Content Layout */}
        <div className="flex w-full max-w-3xl flex-col items-center">
          
          {/* ========== GLASSMORPHISM QUESTION CARD ========== */}
          <div className="relative w-full">
            {/* Outer glow effect */}
            <div 
              className="absolute -inset-1 rounded-[2.5rem] opacity-50"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.3), rgba(168, 85, 247, 0.3), rgba(236, 72, 153, 0.3))',
                filter: 'blur(20px)',
              }}
            />
            
            {/* Main glassmorphism card */}
            <div 
              ref={cardRef}
              className="relative rounded-[2rem] p-10 md:p-12 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Subtle top highlight line */}
              <div 
                className="absolute top-0 left-12 right-12 h-px"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                }}
              />
              
              {/* Content wrapper for transitions */}
              <div 
                className={`transition-all duration-400 ease-out ${
                  isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                }`}
              >
                {!isComplete ? (
                  <>
                    {/* Question Header */}
                    <div className="mb-10 text-center">
                      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
                        Question {currentQuestion + 1} of {totalQuestions}
                      </p>
                      
                      {/* Title with liquid effect */}
                      <div 
                        className="relative inline-block"
                        onMouseEnter={() => setIsTitleHovered(true)}
                        onMouseLeave={() => setIsTitleHovered(false)}
                      >
                        <h1 className="text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl text-balance cursor-default">
                          {currentQ.title}
                        </h1>
                        <TitleLiquidEffect isActive={isTitleHovered} />
                      </div>
                      
                      <p className="mt-4 text-lg leading-relaxed text-white/50 max-w-lg mx-auto">
                        {currentQ.subtitle}
                      </p>
                    </div>

                    {/* Answer Options - Elegant Rounded Chips */}
                    <div className="mb-10 flex flex-wrap justify-center gap-3">
                      {currentQ.options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleSelect(option.id)}
                          onMouseEnter={() => setHoveredChip(option.id)}
                          onMouseLeave={() => setHoveredChip(null)}
                          className={`group relative rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 ${
                            selected === option.id
                              ? "text-black"
                              : "text-white/90 hover:text-white"
                          }`}
                          style={
                            selected === option.id
                              ? {
                                  background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
                                  boxShadow: '0 0 30px rgba(168, 85, 247, 0.5), 0 0 60px rgba(0, 212, 255, 0.3), 0 10px 40px -10px rgba(0, 0, 0, 0.5)',
                                }
                              : {
                                  background: 'rgba(255, 255, 255, 0.06)',
                                  border: '1px solid rgba(255, 255, 255, 0.1)',
                                }
                          }
                        >
                          {/* Liquid glow effect for unselected chips */}
                          {selected !== option.id && (
                            <LiquidGlow isActive={hoveredChip === option.id} />
                          )}
                          
                          {/* Hover background for unselected */}
                          {selected !== option.id && (
                            <div 
                              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{
                                background: 'rgba(255, 255, 255, 0.08)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                              }}
                            />
                          )}
                          <span className="relative z-10">{option.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Primary CTA Button */}
                    <button
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                      onClick={handleContinue}
                      disabled={!selected || isTransitioning}
                      className={`group relative mx-auto flex w-full max-w-sm overflow-hidden rounded-2xl px-10 py-5 text-base font-bold tracking-wide transition-all duration-500 ${
                        selected
                          ? "text-black cursor-pointer"
                          : "cursor-not-allowed text-white/30"
                      }`}
                      style={
                        selected
                          ? {
                              background: 'linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%)',
                              boxShadow: '0 0 40px rgba(168, 85, 247, 0.4), 0 0 80px rgba(0, 212, 255, 0.25), 0 20px 60px -15px rgba(0, 0, 0, 0.5)',
                            }
                          : {
                              background: 'rgba(255, 255, 255, 0.08)',
                            }
                      }
                    >
                      <span className="relative z-10 flex w-full items-center justify-center gap-3">
                        Continue
                        <ArrowRight 
                          className={`h-5 w-5 transition-transform duration-300 ${
                            isHovering && selected ? "translate-x-1" : ""
                          }`} 
                        />
                      </span>
                      {/* Shine effect on hover */}
                      {selected && (
                        <div 
                          className="absolute inset-0 -z-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
                          style={{
                            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                          }}
                        />
                      )}
                    </button>
                  </>
                ) : (
                  /* ========== COMPLETION STATE ========== */
                  <div className="text-center py-4">
                    <div 
                      className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
                      style={{
                        background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.3), rgba(168, 85, 247, 0.3))',
                        boxShadow: '0 0 40px rgba(168, 85, 247, 0.3), 0 0 80px rgba(0, 212, 255, 0.2)',
                      }}
                    >
                      <Check className="h-10 w-10 text-white" strokeWidth={2.5} />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">You&apos;re all set!</h2>
                    <p className="text-white/50 text-lg max-w-md mx-auto">
                      We&apos;ve personalized your experience. Scan the QR code below to continue on your phone.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ========== QR CODE SECTION ========== */}
          <div 
            className={`mt-12 transition-all duration-500 ${
              isComplete ? 'scale-105 opacity-100' : 'scale-100 opacity-100'
            }`}
          >
            <div 
              className={`flex items-center gap-5 rounded-2xl px-6 py-5 transition-all duration-500 ${
                isComplete ? 'ring-2 ring-white/20' : ''
              }`}
              style={{
                background: isComplete 
                  ? 'rgba(255, 255, 255, 0.08)' 
                  : 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(20px)',
                boxShadow: isComplete 
                  ? '0 0 30px rgba(168, 85, 247, 0.2), 0 0 60px rgba(0, 212, 255, 0.15)' 
                  : 'none',
              }}
            >
              {/* QR Code */}
              <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-white p-1.5 shadow-lg">
                <div 
                  className="h-full w-full rounded-lg"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 29 29'%3E%3Cpath d='M0 0h29v29H0z' fill='%23fff'/%3E%3Cpath d='M1 1h7v7H1zM21 1h7v7h-7zM1 21h7v7H1z' stroke='%23000' stroke-width='2' fill='none'/%3E%3Cpath d='M3 3h3v3H3zM23 3h3v3h-3zM3 23h3v3H3zM9 1h3v1H9zM13 1h3v1h-3zM17 1h1v1h-1zM1 9h1v3H1zM1 13h1v3H1zM1 17h1v1H1zM27 9h1v3h-1zM27 13h1v3h-1zM27 17h1v1h-1zM9 27h3v1H9zM13 27h3v1h-3zM17 27h1v1h-1zM9 9h3v3H9zM13 9h3v3h-3zM17 9h3v3h-3zM9 13h3v3H9zM17 13h3v3h-3zM9 17h3v3H9zM13 17h3v3h-3zM17 17h3v3h-3z' fill='%23000'/%3E%3C/svg%3E")`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-white/90">
                  {isComplete ? 'Scan to continue' : 'Continue on your phone'}
                </p>
                <p className="text-xs text-white/40 mt-0.5">
                  {isComplete ? 'Your personalized experience awaits' : 'Scan to open mobile experience'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Minimal Branding */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <p className="text-xs font-medium tracking-widest uppercase text-white/25">
            Powered by Nudgyt AI
          </p>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes gradient-shift-1 {
          0%, 100% {
            transform: translate(0%, 0%) scale(1);
          }
          25% {
            transform: translate(5%, 10%) scale(1.05);
          }
          50% {
            transform: translate(-5%, 5%) scale(0.95);
          }
          75% {
            transform: translate(10%, -5%) scale(1.02);
          }
        }
        
        @keyframes gradient-shift-2 {
          0%, 100% {
            transform: translate(0%, 0%) scale(1);
          }
          25% {
            transform: translate(-10%, 5%) scale(1.03);
          }
          50% {
            transform: translate(5%, -10%) scale(0.97);
          }
          75% {
            transform: translate(-5%, 8%) scale(1.05);
          }
        }
        
        @keyframes gradient-shift-3 {
          0%, 100% {
            transform: translate(0%, 0%) scale(1);
          }
          25% {
            transform: translate(8%, -8%) scale(0.98);
          }
          50% {
            transform: translate(-8%, 5%) scale(1.04);
          }
          75% {
            transform: translate(5%, 10%) scale(0.96);
          }
        }
        
        @keyframes gradient-shift-4 {
          0%, 100% {
            transform: translate(0%, 0%) scale(1);
          }
          25% {
            transform: translate(-5%, -10%) scale(1.02);
          }
          50% {
            transform: translate(10%, 5%) scale(0.98);
          }
          75% {
            transform: translate(-8%, 8%) scale(1.04);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
        
        @keyframes shimmer-flow {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        
        @keyframes energy-pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.02);
          }
        }
        
        @keyframes title-glow {
          0%, 100% {
            opacity: 0.4;
            transform: scaleX(0.8);
          }
          50% {
            opacity: 1;
            transform: scaleX(1);
          }
        }
        
        @keyframes float-particle-1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.4;
          }
          50% {
            transform: translate(10px, -15px) scale(1.5);
            opacity: 0.8;
          }
        }
        
        @keyframes float-particle-2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(-15px, -10px) scale(1.3);
            opacity: 0.7;
          }
        }
        
        @keyframes float-particle-3 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.5;
          }
          50% {
            transform: translate(8px, -12px) scale(1.4);
            opacity: 0.9;
          }
        }
        
        .animate-gradient-shift-1 {
          animation: gradient-shift-1 15s ease-in-out infinite;
        }
        
        .animate-gradient-shift-2 {
          animation: gradient-shift-2 18s ease-in-out infinite;
        }
        
        .animate-gradient-shift-3 {
          animation: gradient-shift-3 20s ease-in-out infinite;
        }
        
        .animate-gradient-shift-4 {
          animation: gradient-shift-4 17s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-shimmer-flow {
          animation: shimmer-flow 2s ease-in-out infinite;
        }
        
        .animate-energy-pulse {
          animation: energy-pulse 1.5s ease-in-out infinite;
        }
        
        .animate-title-glow {
          animation: title-glow 2s ease-in-out infinite;
        }
        
        .animate-float-particle-1 {
          animation: float-particle-1 2s ease-in-out infinite;
        }
        
        .animate-float-particle-2 {
          animation: float-particle-2 2.5s ease-in-out infinite 0.3s;
        }
        
        .animate-float-particle-3 {
          animation: float-particle-3 1.8s ease-in-out infinite 0.6s;
        }
      `}</style>
    </div>
  )
}
