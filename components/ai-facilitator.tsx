"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

const networkingOptions = [
  { id: "investor", label: "Investor" },
  { id: "founder", label: "Founder" },
  { id: "executive", label: "Executive" },
  { id: "operator", label: "Operator" },
  { id: "creative", label: "Creative" },
]

export function AIFacilitator() {
  const [selected, setSelected] = useState<string | null>(null)
  const [isHovering, setIsHovering] = useState(false)

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Pure black background for maximum contrast */}
      <div className="absolute inset-0 bg-black" />
      
      {/* ========== HERO GRADIENT - THE STAR OF THE SHOW ========== */}
      {/* This is the large, vibrant, animated aurora-like gradient */}
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
        
        {/* Nudgyt Logo - Top left, original colors preserved */}
        <div className="absolute top-8 left-8">
          <Image
            src="/nudgyt-logo.png"
            alt="Nudgyt"
            width={110}
            height={32}
            className="drop-shadow-lg h-auto"
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
              className="relative rounded-[2rem] p-10 md:p-12"
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
              
              {/* Question Header */}
              <div className="mb-10 text-center">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
                  Question 1 of 5
                </p>
                <h1 className="text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl text-balance">
                  What best describes your role?
                </h1>
                <p className="mt-4 text-lg leading-relaxed text-white/50 max-w-lg mx-auto">
                  This helps us personalize your networking experience
                </p>
              </div>

              {/* Answer Options - Elegant Rounded Chips */}
              <div className="mb-10 flex flex-wrap justify-center gap-3">
                {networkingOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelected(option.id)}
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
                    {/* Hover glow for unselected */}
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
                disabled={!selected}
                className={`group relative mx-auto flex w-full max-w-sm overflow-hidden rounded-2xl px-10 py-5 text-base font-bold tracking-wide transition-all duration-500 ${
                  selected
                    ? "text-black"
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
            </div>
          </div>

          {/* ========== QR CODE SECTION ========== */}
          <div className="mt-12">
            <div 
              className="flex items-center gap-5 rounded-2xl px-6 py-5"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(20px)',
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
                <p className="text-sm font-semibold text-white/90">Continue on your phone</p>
                <p className="text-xs text-white/40 mt-0.5">Scan to open mobile experience</p>
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
      `}</style>
    </div>
  )
}
