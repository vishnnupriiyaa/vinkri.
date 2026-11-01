import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface LogoEntranceIntroProps {
  isOpen: boolean;
  onEnterStore: () => void;
}

export const LogoEntranceIntro: React.FC<LogoEntranceIntroProps> = ({
  isOpen,
  onEnterStore
}) => {
  const [isEntering, setIsEntering] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    setIsEntering(false);
    setProgress(0);

    // Initial appearance trigger
    const startTimer = setTimeout(() => {
      setHasStarted(true);
    }, 80);

    // Progress bar animation to 100%
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 45);

    // Auto-enter smoothly after progress finishes (approx 2.7s)
    const autoEnterTimer = setTimeout(() => {
      handleEnter();
    }, 3200);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        handleEnter();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(startTimer);
      clearInterval(progressInterval);
      clearTimeout(autoEnterTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEnter = () => {
    if (isEntering) return;
    setIsEntering(true);

    // Cinematic dissolve duration into the full website
    setTimeout(() => {
      onEnterStore();
    }, 950);
  };

  return (
    <div
      onClick={handleEnter}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center select-none overflow-hidden cursor-pointer transition-all duration-1000 ease-out ${
        isEntering
          ? 'opacity-0 scale-125 filter blur-md pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse at 50% 50%, #16100b 0%, #0a0704 50%, #020101 100%)'
      }}
    >
      {/* Subtle luxury architectural grid & ambient spotlight backdrop */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '70px 70px'
          }}
        />
        {/* Warm radial amber glow behind logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-amber-600/15 via-[#d2f53a]/10 to-amber-600/15 rounded-full blur-[140px] animate-pulse" />
      </div>

      {/* Top Street Kicker & Direct Skip Button */}
      <div className="absolute top-4 sm:top-8 inset-x-0 px-4 sm:px-12 flex items-center justify-between z-30 pointer-events-auto">
        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono tracking-widest uppercase text-[#a89685] opacity-80">
          <span className="w-2 h-2 rounded-full bg-[#d2f53a] animate-pulse" />
          <span>VINKRI ATELIER · HYDERABAD</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEnter();
          }}
          className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#cfbfaf] hover:text-white px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
        >
          <span>Skip Intro</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Centerpiece: VINKRI Logo Entrance Animation */}
      <div className="relative z-20 flex flex-col items-center px-4 max-w-2xl w-full">
        {/* Top Eyebrow */}
        <div
          className={`text-[9px] sm:text-[11px] font-mono tracking-[0.3em] uppercase text-[#a89685] mb-4 sm:mb-6 transition-all duration-700 ${
            hasStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          WELCOME TO THE FLAGSHIP
        </div>

        {/* The Official VINKRI Logo Graphic */}
        <div
          className={`relative w-full max-w-[280px] xs:max-w-sm sm:max-w-md md:max-w-lg transition-all duration-1000 ease-out flex items-center justify-center ${
            hasStarted ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-8'
          } ${isEntering ? 'scale-125 filter brightness-125' : ''}`}
        >
          {/* Logo Housing */}
          <div className="relative overflow-hidden rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.95)] border border-white/15 bg-black p-2 sm:p-4">
            <img
              src="/assets/aistudio/vinkri_logo.jpg"
              alt="VINKRI"
              className="w-full h-auto object-contain max-h-[100px] sm:max-h-[140px] md:max-h-[160px] filter drop-shadow-[0_0_35px_rgba(255,255,255,0.4)]"
            />

            {/* Glowing sweep shimmer beam across logo */}
            <div
              className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full pointer-events-none transition-transform duration-1000 delay-300 ${
                hasStarted ? 'translate-x-full' : ''
              }`}
              style={{ transitionDuration: '1.4s' }}
            />
          </div>
        </div>

        {/* Subtitle & Curated Tagline */}
        <div
          className={`mt-6 sm:mt-8 text-center space-y-2 transition-all duration-700 delay-200 ${
            hasStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p
            className="text-base sm:text-xl md:text-2xl font-serif tracking-wide text-[#f5eee6]"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            A Store full of <span className="text-[#d2f53a] font-bold italic">Soulful creations.</span>
          </p>
          <p className="text-[10px] sm:text-xs font-mono tracking-widest text-[#a89685] uppercase">
            5 Architectural Floors · Kinetic Desk Toys · Dioramas · Figurines · Decor Lamps
          </p>
        </div>

        {/* Cinematic Progress Bar ("OPENING THE STORE...") */}
        <div
          className={`w-full max-w-xs mt-6 sm:mt-8 flex flex-col items-center gap-2 transition-all duration-700 delay-300 ${
            hasStarted ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="w-full flex items-center justify-between text-[9px] font-mono text-[#8c7b6d] tracking-widest uppercase">
            <span>OPENING THE STORE</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#d2f53a] to-amber-400 rounded-full transition-all duration-100 ease-out shadow-[0_0_12px_rgba(210,245,58,0.7)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Tactile "Enter Store" Button / Interaction Indicator */}
        <div
          className={`mt-6 sm:mt-8 flex flex-col items-center gap-2.5 transition-all duration-700 delay-400 ${
            hasStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEnter();
            }}
            className="group px-7 sm:px-9 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#d2f53a] via-[#cbf033] to-[#bce82e] hover:from-[#dbf74f] hover:to-[#c6ed3a] text-black font-mono text-xs sm:text-sm font-black tracking-widest uppercase transition-all duration-300 shadow-[0_0_35px_rgba(210,245,58,0.45)] hover:shadow-[0_0_55px_rgba(210,245,58,0.7)] hover:scale-105 active:scale-95 flex items-center gap-2.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>ENTER STORE</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <span className="text-[9px] sm:text-[10px] font-mono text-[#8c7b6d] tracking-wider uppercase text-center">
            Click anywhere or press Space to step inside
          </span>
        </div>
      </div>

      {/* Bottom Est. Stamp */}
      <div className="absolute bottom-4 sm:bottom-6 inset-x-0 text-center z-20 pointer-events-none px-4">
        <span className="text-[8px] sm:text-[9px] font-mono tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[#695646]">
          ✦ VINKRI · HYDERABAD · EST. 2026 ✦
        </span>
      </div>
    </div>
  );
};
