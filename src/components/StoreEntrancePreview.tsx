import React, { useState } from 'react';
import { Bell, Sparkles, ArrowRight, MapPin, Volume2, Store, Eye } from 'lucide-react';
import { sound } from '../utils/audio';

interface StoreEntrancePreviewProps {
  isOpen: boolean;
  onEnterStore: () => void;
}

export const StoreEntrancePreview: React.FC<StoreEntrancePreviewProps> = ({
  isOpen,
  onEnterStore
}) => {
  const [isOpening, setIsOpening] = useState(false);
  const [bellRung, setBellRung] = useState(false);
  const [bellCount, setBellCount] = useState(0);

  if (!isOpen) return null;

  const handleRingBell = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.enabled = true;
    sound.playDoorBell();
    setBellRung(true);
    setBellCount((prev) => prev + 1);
    setTimeout(() => setBellRung(false), 1200);
  };

  const handleEnter = () => {
    if (isOpening) return;
    sound.enabled = true;
    sound.playDoorBell();
    setIsOpening(true);

    // Smooth door opening sequence, then reveal atelier
    setTimeout(() => {
      onEnterStore();
    }, 1250);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center select-none overflow-hidden transition-all duration-1000 ${
        isOpening ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse at 50% 35%, #241912 0%, #120c08 55%, #080504 100%)'
      }}
    >
      {/* Background Architectural Street Glow & Bokeh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px]" />
        {/* Subtle brick / architectural stone texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'radial-gradient(#ffffff 1px, transparent 1px), radial-gradient(#ffffff 1px, #120c08 1px)',
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 20px 20px'
          }}
        />
      </div>

      {/* Top Street Bar & Skip Button */}
      <div className="absolute top-0 inset-x-0 p-4 sm:p-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-[#3e2e22] text-[#c9b9a8] backdrop-blur-md text-xs font-mono">
          <MapPin className="w-3.5 h-3.5 text-[#d2f53a]" />
          <span>Road No. 36 · Jubilee Hills, Hyderabad</span>
        </div>

        <button
          onClick={handleEnter}
          className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#f5ede2] text-xs font-mono font-medium tracking-wider uppercase transition-all backdrop-blur-md border border-white/15 hover:border-white/40 cursor-pointer flex items-center gap-1.5"
        >
          <span>Direct Entry</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Boutique Storefront Structure */}
      <div className="relative w-full max-w-xl sm:max-w-2xl px-4 flex flex-col items-center z-20">
        {/* Overhead Brass Signboard */}
        <div className="mb-6 sm:mb-8 text-center flex flex-col items-center">
          {/* Cute swinging boutique crest */}
          <div className="relative mb-3 flex items-center justify-center">
            <div className="w-0.5 h-6 bg-gradient-to-b from-transparent to-[#b89569]" />
          </div>

          <div className="relative px-6 py-2.5 rounded-xl bg-gradient-to-b from-[#2e2118] to-[#1c140e] border border-[#523d2c] shadow-[0_10px_35px_rgba(0,0,0,0.6)] flex flex-col items-center">
            {/* Tiny accent lamps above sign */}
            <div className="absolute -top-1.5 flex gap-12 pointer-events-none">
              <div className="w-3 h-1.5 bg-[#d2f53a] rounded-full shadow-[0_0_12px_#d2f53a]" />
              <div className="w-3 h-1.5 bg-[#d2f53a] rounded-full shadow-[0_0_12px_#d2f53a]" />
            </div>

            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#bfa993] mb-1">
              ARCHITECTURAL ATELIER
            </span>
            <h1
              className="text-3xl sm:text-4xl font-black tracking-widest text-[#f5ebd9] uppercase"
              style={{ fontFamily: 'var(--font-display, sans-serif)' }}
            >
              V I N K R I
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-4 h-px bg-[#8a6b47]" />
              <span className="text-[9px] font-mono tracking-widest text-[#d2f53a] uppercase font-bold">
                ✦ 5-STORY GLASS HOUSE ✦
              </span>
              <div className="w-4 h-px bg-[#8a6b47]" />
            </div>
          </div>
        </div>

        {/* The Boutique Entrance Doors Frame */}
        <div className="relative w-full aspect-[1.15/1] sm:aspect-[1.25/1] max-w-[480px] rounded-t-3xl border-t-8 border-x-8 border-[#3a2a1f] bg-[#0c0806] shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between p-3 sm:p-4">
          {/* Top transom window showing warm golden interior glow */}
          <div className="w-full h-10 border-b-4 border-[#3a2a1f] flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-[#2d1f14] to-[#1a110a]">
            {/* Interior glowing chandelier / lamps peek */}
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/20 via-orange-500/10 to-transparent blur-sm pointer-events-none" />
            <div className="flex items-center gap-4 text-[9px] font-mono tracking-widest text-amber-200/70 uppercase">
              <span>EST. 2026</span>
              <span>•</span>
              <span className="text-[#d2f53a]">HYDERABAD</span>
              <span>•</span>
              <span>KINETIC CURIOSITY</span>
            </div>
          </div>

          {/* Double Glass Doors Area with Interactive Doorbell on the side */}
          <div className="relative flex-1 flex my-2 overflow-hidden rounded-md border-2 border-[#2b1f16] bg-black">
            {/* Peek Inside: Miniature backlit studio displays inside the store */}
            <div className="absolute inset-0 flex items-center justify-around px-8 opacity-80 pointer-events-none transition-transform duration-700">
              <div className="w-20 h-24 rounded-lg bg-gradient-to-t from-amber-950/80 to-transparent border border-amber-600/30 flex flex-col items-center justify-center p-1 text-center shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                <div className="w-8 h-8 rounded-full bg-amber-400/30 blur-xs mb-1" />
                <span className="text-[7.5px] font-mono text-amber-200">Moon Tree</span>
              </div>
              <div className="w-24 h-28 rounded-lg bg-gradient-to-t from-emerald-950/80 to-transparent border border-emerald-600/30 flex flex-col items-center justify-center p-1 text-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <div className="w-10 h-10 rounded bg-emerald-400/20 blur-xs mb-1" />
                <span className="text-[7.5px] font-mono text-emerald-200">Mt. Everest</span>
              </div>
              <div className="w-20 h-24 rounded-lg bg-gradient-to-t from-blue-950/80 to-transparent border border-blue-600/30 flex flex-col items-center justify-center p-1 text-center shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                <div className="w-8 h-8 rounded-full bg-blue-400/30 blur-xs mb-1" />
                <span className="text-[7.5px] font-mono text-blue-200">Grid Cube</span>
              </div>
            </div>

            {/* Left Glass Door */}
            <div
              className={`w-1/2 h-full border-r-2 border-[#3a2a1f] bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-[2px] transition-all duration-1000 ease-in-out relative flex items-center justify-end pr-2.5 ${
                isOpening ? '-translate-x-full opacity-40' : 'translate-x-0 opacity-95'
              }`}
            >
              {/* Fluted glass ribbed effect */}
              <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,rgba(255,255,255,0.4)_8px,rgba(255,255,255,0.4)_9px)] pointer-events-none" />

              {/* Brass Door Handle Left */}
              <div className="relative z-10 w-2.5 h-20 rounded-full bg-gradient-to-b from-[#d4af37] via-[#f7e49a] to-[#a07c1e] shadow-[0_2px_10px_rgba(0,0,0,0.6)] flex items-center justify-center">
                <div className="w-1 h-12 bg-[#6b5011] rounded-full opacity-40" />
              </div>
            </div>

            {/* Right Glass Door */}
            <div
              className={`w-1/2 h-full border-l-2 border-[#3a2a1f] bg-gradient-to-l from-white/10 via-white/5 to-white/10 backdrop-blur-[2px] transition-all duration-1000 ease-in-out relative flex items-center justify-start pl-2.5 ${
                isOpening ? 'translate-x-full opacity-40' : 'translate-x-0 opacity-95'
              }`}
            >
              {/* Fluted glass ribbed effect */}
              <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,rgba(255,255,255,0.4)_8px,rgba(255,255,255,0.4)_9px)] pointer-events-none" />

              {/* Brass Door Handle Right */}
              <div className="relative z-10 w-2.5 h-20 rounded-full bg-gradient-to-b from-[#d4af37] via-[#f7e49a] to-[#a07c1e] shadow-[0_2px_10px_rgba(0,0,0,0.6)] flex items-center justify-center">
                <div className="w-1 h-12 bg-[#6b5011] rounded-full opacity-40" />
              </div>
            </div>

            {/* Cute Hanging Boutique Sign on the Door */}
            <div
              className={`absolute top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-all duration-500 ${
                isOpening ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
              }`}
            >
              <div className="px-3.5 py-1.5 rounded-md bg-[#1f150e]/95 border border-[#856543] shadow-lg flex items-center gap-1.5 text-center">
                <Sparkles className="w-3 h-3 text-[#d2f53a] animate-spin" style={{ animationDuration: '6s' }} />
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#f5eedf] uppercase">
                  PUSH TO STEP INSIDE
                </span>
              </div>
            </div>
          </div>

          {/* Terrazzo Floor / Brass Door Threshold */}
          <div className="w-full h-8 bg-gradient-to-r from-[#211710] via-[#33241a] to-[#211710] border-t-2 border-[#523d2d] flex items-center justify-center rounded-b-md relative overflow-hidden">
            <span className="text-[9px] font-mono tracking-[0.25em] text-[#bca58f] uppercase">
              ✦ JUBILEE HILLS ATELIER · ENTRANCE ✦
            </span>
          </div>
        </div>

        {/* Cute Interactive Doorbell and Enter Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3.5 w-full max-w-[480px]">
          {/* Ring Doorbell Button */}
          <button
            onClick={handleRingBell}
            className={`flex-1 w-full py-3 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border ${
              bellRung
                ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.5)] scale-105'
                : 'bg-[#1e150f] hover:bg-[#281c14] text-[#e0cfbe] border-[#453224] hover:border-[#6b4f3a]'
            }`}
          >
            <Bell className={`w-4 h-4 text-[#d2f53a] ${bellRung ? 'animate-bounce' : ''}`} />
            <span>{bellRung ? 'Ding-Dong! 🔔' : bellCount > 0 ? `Ring Again (${bellCount})` : 'Ring Doorbell'}</span>
          </button>

          {/* Main Enter Store Button */}
          <button
            onClick={handleEnter}
            disabled={isOpening}
            className="flex-1 w-full py-3 px-5 rounded-xl bg-gradient-to-r from-[#d2f53a] to-[#bce82e] hover:from-[#dbf74f] hover:to-[#c6ed3a] text-black font-extrabold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_30px_rgba(210,245,58,0.35)] hover:shadow-[0_0_40px_rgba(210,245,58,0.55)] cursor-pointer flex items-center justify-center gap-2 transform active:scale-95"
          >
            <Store className="w-4 h-4" />
            <span>{isOpening ? 'Opening Doors...' : 'Step Inside Store'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Friendly micro-caption */}
        <p className="mt-4 text-center text-xs text-[#9c8979] font-sans flex items-center justify-center gap-2">
          <span>Explore 5 floors of handcrafted desk toys, dioramas, stands & decor lamps</span>
        </p>
      </div>
    </div>
  );
};
