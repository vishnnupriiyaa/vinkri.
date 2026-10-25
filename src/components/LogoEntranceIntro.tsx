import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

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

  useEffect(() => {
    if (!isOpen) return;

    // Small delay to trigger smooth CSS transitions on mount
    const timer = setTimeout(() => {
      setHasStarted(true);
    }, 100);

    // Auto-enter smoothly after 2.8s if user doesn't click
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
      clearTimeout(timer);
      clearTimeout(autoEnterTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEnter = () => {
    if (isEntering) return;
    sound.enabled = true;
    sound.playChime();
    setIsEntering(true);

    // Cinematic push-through duration
    setTimeout(() => {
      onEnterStore();
    }, 950);
  };

  return (
    <div
      onClick={handleEnter}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center select-none overflow-hidden cursor-pointer transition-all duration-1000 ${
        isEntering
          ? 'opacity-0 scale-125 filter blur-sm pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse at 50% 50%, #16100b 0%, #0c0805 50%, #050302 100%)'
      }}
    >
      {/* Subtle architectural luxury grid backdrop */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '80px 80px'
          }}
        />
        {/* Warm radial amber glow behind logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-600/15 rounded-full blur-[120px] animate-pulse" />
      </div>

      {/* Top Street & Direct Skip Kicker */}
      <div className="absolute top-4 sm:top-6 inset-x-0 px-4 sm:px-10 flex items-center justify-between z-30 pointer-events-auto">
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-[#a89685] opacity-80">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d2f53a] animate-pulse" />
          <span>HYDERABAD</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEnter();
          }}
          className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#cfbfaf] hover:text-white px-3 sm:px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
        >
          <span>Skip Intro</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Centerpiece: Official VINKRI Logo Animation */}
      <div className="relative z-20 flex flex-col items-center px-4 max-w-xl w-full">
        {/* The Official VINKRI Logo Graphic */}
        <div
          className={`relative w-full max-w-[300px] xs:max-w-sm sm:max-w-lg transition-all duration-1000 ease-out flex items-center justify-center ${
            hasStarted ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-6'
          } ${isEntering ? 'scale-125 filter brightness-125' : ''}`}
        >
          {/* Subtle light sweep across logo */}
          <div className="relative overflow-hidden rounded-xl shadow-[0_15px_60px_rgba(0,0,0,0.9)] border border-white/10 bg-black">
            <img
              src="/assets/aistudio/50547_5739e055.jpg"
              alt="VINKRI"
              className="w-full h-auto object-cover max-h-[140px] sm:max-h-[220px]"
            />

            {/* Glowing sweep shimmer beam */}
            <div
              className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full pointer-events-none transition-transform duration-1000 delay-500 ${
                hasStarted ? 'translate-x-full' : ''
              }`}
              style={{ transitionDuration: '1.4s' }}
            />
          </div>
        </div>

        {/* Subtitle & Curated Tagline */}
        <div
          className={`mt-5 sm:mt-7 text-center space-y-1.5 sm:space-y-2 transition-all duration-700 delay-200 ${
            hasStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p
            className="text-sm sm:text-base md:text-lg font-medium tracking-wide text-[#e8ded1]"
            style={{ fontFamily: 'var(--font-display, sans-serif)' }}
          >
            A Store full of <span className="text-[#d2f53a] font-bold">Soulful creations.</span>
          </p>
          <p className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#9c8979] uppercase">
            5 Floors · Kinetic Toys · Dioramas · Decor Lamps
          </p>
        </div>

        {/* Tactile "Enter Store" Button / Interaction Indicator */}
        <div
          className={`mt-6 sm:mt-9 flex flex-col items-center gap-2.5 sm:gap-3 transition-all duration-700 delay-400 ${
            hasStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEnter();
            }}
            className="group px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#d2f53a] to-[#bce82e] hover:from-[#dbf74f] hover:to-[#c6ed3a] text-black font-mono text-[11px] sm:text-xs font-black tracking-widest uppercase transition-all duration-300 shadow-[0_0_35px_rgba(210,245,58,0.4)] hover:shadow-[0_0_50px_rgba(210,245,58,0.65)] hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ENTER STORE</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>

          <span className="text-[9px] sm:text-[10px] font-mono text-[#8c7b6d] tracking-wider uppercase text-center">
            Click anywhere or press Space to step inside
          </span>
        </div>
      </div>

      {/* Bottom Est. Stamp */}
      <div className="absolute bottom-3 sm:bottom-6 inset-x-0 text-center z-20 pointer-events-none px-4">
        <span className="text-[8px] sm:text-[9px] font-mono tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[#695646]">
          ✦ VINKRI · HYDERABAD · EST. 2026 ✦
        </span>
      </div>
    </div>
  );
};
