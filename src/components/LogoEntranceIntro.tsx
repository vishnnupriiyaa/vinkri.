import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react';

interface LogoEntranceIntroProps {
  isOpen: boolean;
  onEnterStore: () => void;
}

interface NicheItem {
  id: string;
  title: string;
  category: string;
  image: string;
  price: string;
  accent: string;
}

export const LogoEntranceIntro: React.FC<LogoEntranceIntroProps> = ({
  isOpen,
  onEnterStore
}) => {
  const [shuttersClosed, setShuttersClosed] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [logoRevealed, setLogoRevealed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 4 rows by 3 columns of luxury illuminated collectibles
  const cabinetGrid: NicheItem[][] = [
    // Row 1: Motorized Blue Shutters
    [
      {
        id: 'biplane',
        title: 'Aeroplane Diorama',
        category: 'Vintage Cloud Diorama',
        image: '/assets/images/aeroplane_diorama_1792823666542.jpg',
        price: '₹3,299',
        accent: '#008ba8'
      },
      {
        id: 'automaton',
        title: 'Equine Automaton',
        category: 'Handcrafted Kinetic Wood',
        image: '/assets/images/automaton_horse_1792823850330.jpg',
        price: '₹4,499',
        accent: '#008ba8'
      },
      {
        id: 'bonsai-rock',
        title: 'Bonsai Sanctuary',
        category: 'Japanese Moss Garden',
        image: '/assets/images/bonsai_sanctuary_1792823852211.jpg',
        price: '₹3,899',
        accent: '#008ba8'
      }
    ],
    // Row 2: Motorized White Shutters
    [
      {
        id: 'diecast-stack',
        title: 'Collector 1:64 Stack',
        category: 'Multi-Bay Parking Bay',
        image: '/assets/images/diecast_car_stand_1792823666503.jpg',
        price: '₹2,899',
        accent: '#d97706'
      },
      {
        id: 'red-sports-car',
        title: 'Red Exotic Supercar',
        category: 'Precision Scale Showcase',
        image: '/assets/images/car_showcase_1792822133725.jpg',
        price: '₹3,499',
        accent: '#e11d48'
      },
      {
        id: 'track-rack',
        title: 'Tiered Track Showcase',
        category: 'Cantilevered Display Rack',
        image: '/assets/images/tiered_track_rack_1792823874061.jpg',
        price: '₹2,699',
        accent: '#d97706'
      }
    ],
    // Row 3: Motorized White Shutters
    [
      {
        id: 'portrait-duo',
        title: 'Portrait Duo Sculpture',
        category: 'Custom Ceramic Figurine',
        image: '/assets/images/custom_couple_figurine_1792823872735.jpg',
        price: '₹4,999',
        accent: '#f43f5e'
      },
      {
        id: 'buddha-statue',
        title: 'Buddha Halo Luminaire',
        category: 'Illuminated Aura Niche',
        image: '/assets/images/buddha_halo_lamp_1792822134221.jpg',
        price: '₹3,699',
        accent: '#eab308'
      },
      {
        id: 'shiva-trishul',
        title: 'Shiva Trishul Aura',
        category: 'Sacred Halo Downlight',
        image: '/assets/images/shiva_trishul_aura_1792823667127.jpg',
        price: '₹3,799',
        accent: '#eab308'
      }
    ],
    // Row 4: Motorized White Shutters
    [
      {
        id: 'crescent-bonsai',
        title: 'Crescent Moon Bonsai',
        category: 'Organic Branch Lamp',
        image: '/assets/images/crescent_moon_bonsai_1792823851166.jpg',
        price: '₹3,199',
        accent: '#ea580c'
      },
      {
        id: 'moon-tree-light',
        title: 'Moon Tree Light',
        category: 'Luminous Brass Tree',
        image: '/assets/images/moon_tree_light_1792822133142.jpg',
        price: '₹2,499',
        accent: '#ea580c'
      },
      {
        id: 'levitron-bags',
        title: 'Boutique Atelier Niche',
        category: 'Magnetic Levitation & Bags',
        image: '/assets/images/floating_levitron_1792823852255.jpg',
        price: '₹4,999',
        accent: '#ea580c'
      }
    ]
  ];

  const handleTriggerShutters = useCallback(() => {
    if (shuttersClosed) return;
    setShuttersClosed(true);

    // After all 4 rows have finished sliding down (450ms delay + 600ms duration = 1050ms)
    setTimeout(() => {
      setLogoRevealed(true);
    }, 1100);

    // Auto-open website smoothly after logo reveal
    setTimeout(() => {
      handleFinalEnter();
    }, 3600);
  }, [shuttersClosed]);

  const handleFinalEnter = () => {
    if (isEntering) return;
    setIsEntering(true);
    setTimeout(() => {
      onEnterStore();
    }, 950);
  };

  useEffect(() => {
    if (!isOpen) return;

    setShuttersClosed(false);
    setIsEntering(false);
    setLogoRevealed(false);

    // Mount reveal
    const startTimer = setTimeout(() => {
      setHasStarted(true);
    }, 100);

    // Auto-trigger shutter sequence after user admires the illuminated cabinet
    const autoCloseTimer = setTimeout(() => {
      handleTriggerShutters();
    }, 1800);

    // Scroll trigger (wheel / touch)
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 10) {
        handleTriggerShutters();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        if (!shuttersClosed) {
          handleTriggerShutters();
        } else {
          handleFinalEnter();
        }
      } else if (e.key === 'Escape') {
        handleFinalEnter();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(autoCloseTimer);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleTriggerShutters, shuttersClosed]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between select-none overflow-hidden transition-all duration-1000 ease-out p-3 sm:p-6 ${
        isEntering
          ? 'opacity-0 scale-110 filter blur-md pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse at 50% 50%, #16100c 0%, #0c0805 55%, #030201 100%)'
      }}
    >
      {/* Ambient Architectural Spotlight Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '80px 80px'
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[550px] bg-amber-600/12 rounded-full blur-[160px]" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-30 w-full max-w-5xl flex items-center justify-between py-1 px-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#d2f53a] animate-pulse" />
          <span className="text-[10px] sm:text-xs font-mono tracking-widest uppercase text-[#a89685]">
            VINKRI ATELIER · 4×3 CABINET GRID
          </span>
        </div>

        <button
          type="button"
          onClick={handleFinalEnter}
          className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#cfbfaf] hover:text-white px-3 sm:px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
        >
          <span>Skip to Website</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Main Multi-Tiered Luxury Display Cabinet Grid (4 Rows × 3 Columns) */}
      <main className="relative z-20 w-full max-w-4xl flex-1 flex flex-col items-center justify-center my-auto">
        <div
          className={`relative w-full rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 transition-all duration-700 border shadow-[0_25px_80px_rgba(0,0,0,0.95)] ${
            hasStarted ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-6'
          }`}
          style={{
            background: 'linear-gradient(180deg, #24170f 0%, #19100a 50%, #120a06 100%)',
            borderColor: '#3d2919'
          }}
        >
          {/* Cabinet Top Architectural Crown Rail */}
          <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-[#3d2919] px-2 text-[#9e8c7c]">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#5a3f29]" />
                ))}
              </div>
              <span className="text-[8.5px] sm:text-[10px] font-mono tracking-widest uppercase">
                MOTORIZED SHUTTER MECHANISM
              </span>
            </div>

            <div className="flex items-center gap-2 text-[9px] font-mono">
              <span className="text-[#d2f53a]">● 3000K RECESSED LIGHTS</span>
              <span className="text-[#8c7a6b] hidden sm:inline">| 60FPS MOTORIZED BLINDS</span>
            </div>
          </div>

          {/* 4-Row by 3-Column Architectural Wooden Grid */}
          <div className="grid grid-rows-4 gap-2 sm:gap-2.5 w-full">
            {cabinetGrid.map((row, rowIdx) => {
              // Row 1 uses motorized blue shutters (#008ba8), rows 2-4 use clean white shutters
              const isBlueRow = rowIdx === 0;

              return (
                <div key={rowIdx} className="grid grid-cols-3 gap-2 sm:gap-3 w-full">
                  {row.map((item, colIdx) => (
                    <div
                      key={item.id}
                      className="group relative rounded-xl sm:rounded-2xl overflow-hidden border transition-all duration-300"
                      style={{
                        height: 'clamp(72px, 14vh, 120px)',
                        background: 'linear-gradient(135deg, #2a1c13 0%, #17100b 100%)',
                        borderColor: '#3e2b1d'
                      }}
                    >
                      {/* 1. INTERNAL ILLUMINATED NICHE (Warm 3000K Recessed Ambient Lighting) */}
                      <div className="absolute inset-0 flex items-center justify-between p-2 z-0">
                        {/* 3000K Warm Top Downlight Cone */}
                        <div
                          className="absolute -top-3 inset-x-0 h-10 pointer-events-none opacity-80"
                          style={{
                            background:
                              'radial-gradient(ellipse at 50% 0%, rgba(255, 214, 153, 0.45) 0%, rgba(255, 180, 100, 0.15) 50%, transparent 100%)'
                          }}
                        />

                        {/* Miniature spotlight lamp fitting */}
                        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-amber-200/60 shadow-[0_0_8px_rgba(255,200,120,0.8)]" />

                        {/* Product Artwork Studio Image */}
                        <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-1 bg-black/40 border border-white/10 shadow-inner">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                          />
                        </div>

                        {/* Info details inside niche */}
                        <div className="flex-1 min-w-0 pl-2 text-left">
                          <span className="text-[7px] sm:text-[8px] font-mono uppercase text-[#e6a86c] block truncate">
                            {item.category}
                          </span>
                          <h4 className="text-[9px] sm:text-[11px] md:text-xs font-bold text-white tracking-tight truncate leading-tight">
                            {item.title}
                          </h4>
                          <span className="text-[8.5px] sm:text-[10px] font-mono font-bold text-[#d2f53a] block mt-0.5">
                            {item.price}
                          </span>
                        </div>
                      </div>

                      {/* 2. MOTORIZED SLIDING SHUTTER PANEL (Sliding down vertically) */}
                      {/* Easing: cubic-bezier(0.25, 1, 0.5, 1) transition over 600ms per row with a 150ms staggered delay between rows */}
                      <div
                        className={`absolute inset-0 z-10 flex flex-col justify-between p-2 sm:p-2.5 shadow-2xl transition-transform duration-600 ${
                          shuttersClosed ? 'translate-y-0' : '-translate-y-full'
                        }`}
                        style={{
                          transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)',
                          transitionDelay: `${rowIdx * 150}ms`,
                          background: isBlueRow
                            ? 'linear-gradient(180deg, #007a94 0%, #008ba8 50%, #006b82 100%)'
                            : 'linear-gradient(180deg, #ffffff 0%, #f7f5f0 50%, #ede8de 100%)',
                          borderColor: isBlueRow ? '#00a5c7' : '#ded8cc',
                          borderWidth: '1px'
                        }}
                      >
                        {/* Motorized Slat Grooves Texture */}
                        <div className="w-full flex flex-col gap-1.5 opacity-25">
                          {[0, 1, 2, 3].map((slat) => (
                            <div
                              key={slat}
                              className={`w-full h-0.5 ${isBlueRow ? 'bg-black/40' : 'bg-[#9c8979]/30'}`}
                            />
                          ))}
                        </div>

                        {/* Center Badge on Shutter */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[7px] sm:text-[8px] font-mono font-bold tracking-widest uppercase px-1.5 py-0.5 rounded ${
                              isBlueRow
                                ? 'bg-black/30 text-white border border-white/20'
                                : 'bg-[#18110b] text-[#d2f53a] border border-[#2b1c11]'
                            }`}
                          >
                            R0{rowIdx + 1}·C0{colIdx + 1}
                          </span>

                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              isBlueRow ? 'bg-[#d2f53a]' : 'bg-[#c35626]'
                            } shadow-xs animate-pulse`}
                          />
                        </div>

                        {/* Bottom Brushed Aluminum / Steel Handle Rail */}
                        <div
                          className={`w-full h-1.5 sm:h-2 rounded-xs shadow-xs flex items-center justify-center ${
                            isBlueRow
                              ? 'bg-gradient-to-r from-[#005263] via-[#00a5c7] to-[#005263] border-t border-white/30'
                              : 'bg-gradient-to-r from-[#b3a494] via-[#f0eae1] to-[#b3a494] border-t border-white/60'
                          }`}
                        >
                          <div className="w-8 h-0.5 rounded-full bg-black/30" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* OVERLAY: Illuminated VINKRI Logo and Entrance Actions */}
          <div
            className={`absolute inset-0 z-30 flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl p-4 transition-all duration-700 backdrop-blur-xs ${
              logoRevealed
                ? 'opacity-100 scale-100 pointer-events-auto bg-black/60'
                : 'opacity-0 scale-90 pointer-events-none'
            }`}
          >
            {/* Ambient Logo Backlight Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-36 bg-[#d2f53a]/25 rounded-full blur-[70px] pointer-events-none" />

            {/* VINKRI Wordmark Graphic */}
            <div className="relative z-10 max-w-[240px] sm:max-w-xs md:max-w-sm rounded-xl overflow-hidden shadow-[0_15px_60px_rgba(0,0,0,0.95)] border border-white/20 bg-black p-2 sm:p-3">
              <img
                src="/assets/aistudio/vinkri_logo.jpg"
                alt="VINKRI"
                className="w-full h-auto object-contain filter drop-shadow-[0_0_25px_rgba(255,255,255,0.45)]"
              />
            </div>

            {/* Subtitle */}
            <p
              className="mt-3 text-base sm:text-xl font-serif text-[#fbf6f0] tracking-wide text-center"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              A Store full of <span className="text-[#d2f53a] font-bold italic">Soulful creations.</span>
            </p>

            <span className="text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-[#a89685] mt-1">
              HYDERABAD ATELIER · 5 FLOORS
            </span>

            {/* Enter Store Button */}
            <button
              type="button"
              onClick={handleFinalEnter}
              className="mt-4 px-6 sm:px-8 py-2.5 rounded-full bg-gradient-to-r from-[#d2f53a] via-[#cbf033] to-[#bce82e] hover:scale-105 active:scale-95 text-black font-mono text-xs sm:text-sm font-black tracking-widest uppercase transition-all duration-300 shadow-[0_0_35px_rgba(210,245,58,0.5)] flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>ENTER ATELIER STORE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Shutter Trigger Controls */}
      <footer className="relative z-30 w-full max-w-2xl flex flex-col items-center gap-1.5 pb-1">
        {!shuttersClosed ? (
          <button
            type="button"
            onClick={handleTriggerShutters}
            className="group px-5 sm:px-6 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-[#f5eee6] hover:text-white font-mono text-[10px] sm:text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-lg backdrop-blur-md"
          >
            <span>Trigger Motorized Shutters</span>
            <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5 text-[#d2f53a]" />
          </button>
        ) : (
          <span className="text-[9px] sm:text-[10px] font-mono text-[#d2f53a] tracking-widest uppercase">
            ✦ MOTORIZED SHUTTERS ENGAGED · ATELIER OPENING ✦
          </span>
        )}

        <span className="text-[8.5px] sm:text-[9.5px] font-mono text-[#786452] tracking-wider uppercase text-center">
          Scroll down or click to close shutters and unveil the store
        </span>
      </footer>
    </div>
  );
};
