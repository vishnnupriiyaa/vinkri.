import React, { useState } from 'react';
import { Plus, Check, ChevronRight } from 'lucide-react';
import { FloorInfo, Product, ThemeMode } from '../types';
import { FLOORS_DATA, PRODUCTS_DATA } from '../data/products';
import { sound } from '../utils/audio';

interface BuildingShowcaseProps {
  theme: ThemeMode;
  onSelectFloor: (floor: FloorInfo) => void;
  selectedFloorNumber?: number | null;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onOpenStorePhilosophy?: () => void;
}

export const BuildingShowcase: React.FC<BuildingShowcaseProps> = ({
  theme,
  onSelectFloor,
  selectedFloorNumber,
  onSelectProduct,
  onQuickAdd,
  onOpenStorePhilosophy
}) => {
  const isDark = theme === 'rustic-dark';
  const [hoveredFloor, setHoveredFloor] = useState<number | null>(null);
  const [hoveredRoom, setHoveredRoom] = useState<{ floor: number; slot: 'left' | 'center' | 'right'; productId?: string } | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  // Exact vertical and horizontal boundaries tailored for dark vs light building architectures
  const darkFloorsConfig = [
    {
      number: 5,
      top: '11.8%',
      height: '14.8%',
      name: 'DESK TOYS',
      color: '#3b82f6',
      tagline: 'Play. Fidget. Display.',
      rooms: [
        { slot: 'left' as const, productId: 'grid-cube', title: 'Grid Cube', price: 1899 },
        { slot: 'center' as const, productId: 'automaton-horse', title: 'Automaton Horse', price: 4499 },
        { slot: 'right' as const, productId: 'chrome-snake', title: 'Chrome Serpent', price: 2799 }
      ]
    },
    {
      number: 4,
      top: '26.8%',
      height: '14.8%',
      name: 'CUSTOM DIORAMAS',
      color: '#10b981',
      tagline: 'Mini worlds. Big stories.',
      rooms: [
        { slot: 'left' as const, productId: 'mount-everest-light', title: 'Mount Everest Light', price: 2499 },
        { slot: 'center' as const, productId: 'aeroplane-diorama', title: 'Aeroplane Diorama', price: 3299 },
        { slot: 'right' as const, productId: 'bonsai-sanctuary', title: 'Bonsai Sanctuary', price: 3899 }
      ]
    },
    {
      number: 3,
      top: '41.8%',
      height: '14.8%',
      name: 'DIECAST CAR STANDS',
      color: '#f59e0b',
      tagline: 'Display. Organize. Collect.',
      rooms: [
        { slot: 'left' as const, productId: 'diecast-stack', title: 'Collector 1:64 Stack', price: 2899 },
        { slot: 'center' as const, productId: 'car-showcase', title: 'Car Showcase', price: 3499 },
        { slot: 'right' as const, productId: 'tiered-track-rack', title: 'Track Showcase', price: 2699 }
      ]
    },
    {
      number: 2,
      top: '56.8%',
      height: '14.8%',
      name: 'CUSTOM FIGURINES',
      color: '#f43f5e',
      tagline: 'People. Moments. Memories.',
      rooms: [
        { slot: 'left' as const, productId: 'custom-figurine-duo', title: 'Portrait Duo', price: 4999 },
        { slot: 'center' as const, productId: 'buddha-halo-lamp', title: 'Buddha Halo Lamp', price: 3699 },
        { slot: 'right' as const, productId: 'shiva-trishul-lamp', title: 'Shiva Trishul Aura', price: 3799 }
      ]
    },
    {
      number: 1,
      top: '71.8%',
      height: '13.8%',
      name: 'DECOR LAMPS',
      color: '#f97316',
      tagline: 'Light up your space.',
      rooms: [
        { slot: 'left' as const, productId: 'moon-tree-light', title: 'Moon Tree Light', price: 2499 },
        { slot: 'center' as const, productId: 'crescent-bonsai', title: 'Crescent Moon Bonsai', price: 3199 },
        { slot: 'right' as const, productId: 'floating-levitron', title: 'Floating Levitron', price: 4999 }
      ]
    },
    {
      number: 0,
      top: '85.8%',
      height: '14.2%',
      name: 'VINKRI FLAGSHIP STOREFRONT',
      color: '#d2f53a',
      tagline: 'Bespoke Atelier & Glass Boutique',
      rooms: []
    }
  ];

  // Calibrated alignment for the daylight travertine building in light mode
  const lightFloorsConfig = [
    {
      number: 5,
      top: '5.8%',
      height: '13.8%',
      name: 'DESK TOYS',
      color: '#2563eb',
      tagline: 'Play. Fidget. Display.',
      rooms: [
        { slot: 'left' as const, productId: 'grid-cube', title: 'Grid Cube', price: 1899 },
        { slot: 'center' as const, productId: 'automaton-horse', title: 'Automaton Horse', price: 4499 },
        { slot: 'right' as const, productId: 'chrome-snake', title: 'Chrome Serpent', price: 2799 }
      ]
    },
    {
      number: 4,
      top: '20.4%',
      height: '13.8%',
      name: 'CUSTOM DIORAMAS',
      color: '#059669',
      tagline: 'Mini worlds. Big stories.',
      rooms: [
        { slot: 'left' as const, productId: 'mount-everest-light', title: 'Mount Everest Light', price: 2499 },
        { slot: 'center' as const, productId: 'aeroplane-diorama', title: 'Aeroplane Diorama', price: 3299 },
        { slot: 'right' as const, productId: 'bonsai-sanctuary', title: 'Bonsai Sanctuary', price: 3899 }
      ]
    },
    {
      number: 3,
      top: '35.0%',
      height: '13.8%',
      name: 'DIECAST CAR STANDS',
      color: '#d97706',
      tagline: 'Display. Organize. Collect.',
      rooms: [
        { slot: 'left' as const, productId: 'diecast-stack', title: 'Collector 1:64 Stack', price: 2899 },
        { slot: 'center' as const, productId: 'car-showcase', title: 'Car Showcase', price: 3499 },
        { slot: 'right' as const, productId: 'tiered-track-rack', title: 'Track Showcase', price: 2699 }
      ]
    },
    {
      number: 2,
      top: '49.6%',
      height: '13.8%',
      name: 'CUSTOM FIGURINES',
      color: '#e11d48',
      tagline: 'People. Moments. Memories.',
      rooms: [
        { slot: 'left' as const, productId: 'custom-figurine-duo', title: 'Portrait Duo', price: 4999 },
        { slot: 'center' as const, productId: 'buddha-halo-lamp', title: 'Buddha Halo Lamp', price: 3699 },
        { slot: 'right' as const, productId: 'shiva-trishul-lamp', title: 'Shiva Trishul Aura', price: 3799 }
      ]
    },
    {
      number: 1,
      top: '64.2%',
      height: '13.8%',
      name: 'DECOR LAMPS',
      color: '#ea580c',
      tagline: 'Light up your space.',
      rooms: [
        { slot: 'left' as const, productId: 'crescent-bonsai', title: 'Crescent Moon Bonsai', price: 3199 },
        { slot: 'center' as const, productId: 'moon-tree-light', title: 'Moon Tree Light', price: 2499 },
        { slot: 'right' as const, productId: 'floating-levitron', title: 'Floating Levitron', price: 4999 }
      ]
    },
    {
      number: 0,
      top: '78.8%',
      height: '14.8%',
      name: 'VINKRI FLAGSHIP ATELIER',
      color: '#c35626',
      tagline: 'Bespoke Atelier & Glass Boutique',
      rooms: []
    }
  ];

  const floorsConfig = isDark ? darkFloorsConfig : lightFloorsConfig;

  const handleRoomClick = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    sound.playClick();
    const prod = PRODUCTS_DATA.find((p) => p.id === productId);
    if (prod) {
      onSelectProduct(prod);
    }
  };

  const handleQuickAddRoom = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    sound.playChime();
    const prod = PRODUCTS_DATA.find((p) => p.id === productId);
    if (prod) {
      onQuickAdd(prod);
      setAddedId(productId);
      setTimeout(() => setAddedId(null), 1500);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-center select-none">
      {/* Seamless Integrated Building Structure */}
      <div
        className="relative w-full transition-all duration-700 overflow-hidden rounded-2xl shadow-2xl"
        style={{ aspectRatio: isDark ? '1.364 / 1' : '1.38 / 1' }}
      >
        {/* Background Building Image */}
        <div className="relative w-full h-full">
          <img
            src={isDark ? '/assets/aistudio/IMG-20261007-WA0097_d9b5d091.jpg' : '/assets/aistudio/light_building.jpg'}
            alt="VINKRI 5-Story Glass Architectural Atelier • Hyderabad"
            className="max-w-none absolute transition-all duration-700"
            style={
              isDark
                ? {
                    left: '-52.4%',
                    top: '-16.9%',
                    width: '152.4%',
                    height: '116.9%',
                    objectFit: 'cover'
                  }
                : {
                    left: '-20%',
                    top: '-1%',
                    width: '140%',
                    height: '102%',
                    objectFit: 'cover'
                  }
            }
          />

          {/* Theme-Adaptive Atmosphere Blends */}
          {isDark ? (
            <>
              {/* Dark Rustic Mode: Nighttime espresso/charcoal atmospheric blends */}
              <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#0a0705] via-[#0a0705]/60 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#0a0705] to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#0a0705] via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#0a0705]/70 to-transparent pointer-events-none" />
            </>
          ) : (
            <>
              {/* Warm Beige Mode: Crisp, natural daylight vignette blending into #faf6f0 */}
              <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#faf6f0] via-[#faf6f0]/50 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#faf6f0] via-[#faf6f0]/40 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#faf6f0] via-[#faf6f0]/60 to-transparent pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#faf6f0] via-[#faf6f0]/50 to-transparent pointer-events-none" />
            </>
          )}

          {/* Rooftop VINKRI Atelier Sign Hotspot */}
          <div
            className="absolute z-20 flex items-center justify-center cursor-pointer group"
            style={
              isDark
                ? { top: '1.2%', left: '26%', width: '48%', height: '8.5%' }
                : { top: '1.0%', left: '21%', width: '58%', height: '5.2%' }
            }
            onClick={() => {
              sound.playClick();
              if (onOpenStorePhilosophy) onOpenStorePhilosophy();
            }}
            title="VINKRI Rooftop Atelier Studio • Jubilee Hills, Hyderabad"
          >
            <div
              className={`w-full h-full rounded-md flex items-center justify-center px-3 py-1 transition-all ${
                isDark
                  ? 'group-hover:bg-white/10 group-hover:ring-1 group-hover:ring-[#d2f53a]/50'
                  : 'group-hover:bg-[#c35626]/10 group-hover:ring-1 group-hover:ring-[#c35626]/40'
              }`}
            >
              <span className="sr-only">VINKRI Atelier Crown</span>
            </div>
          </div>

          {/* Interactive Architectural Floor Layers */}
          <div className="absolute inset-0 z-10 pointer-events-auto">
            {floorsConfig.map((floor) => {
              const floorData = FLOORS_DATA.find((f) => f.numeric === floor.number);
              const isHovered = hoveredFloor === floor.number;
              const isSelected = selectedFloorNumber === floor.number;

              // Left badge column dimensions
              const leftBadgeStyle = isDark
                ? { left: '0%', width: '28%', height: '100%' }
                : { left: '1.5%', width: '19.5%', height: '100%' };

              // Middle 3-room grid dimensions
              const roomsGridStyle = isDark
                ? { left: '28%', width: '64%', height: '100%' }
                : { left: '21.5%', width: '57%', height: '100%' };

              // Right indicator column dimensions
              const rightMarkerStyle = isDark
                ? { left: '92%', width: '8%', height: '100%' }
                : { left: '79.5%', width: '19%', height: '100%' };

              return (
                <div
                  key={floor.number}
                  onMouseEnter={() => setHoveredFloor(floor.number)}
                  onMouseLeave={() => setHoveredFloor(null)}
                  style={{
                    top: floor.top,
                    height: floor.height,
                    left: '0%',
                    width: '100%'
                  }}
                  className="absolute"
                >
                  {/* Left Column: Interactive Hotspot over Floor Category Badge */}
                  <div
                    onClick={() => {
                      sound.playClick();
                      if (floorData) onSelectFloor(floorData);
                      else if (floor.number === 0 && onOpenStorePhilosophy) onOpenStorePhilosophy();
                    }}
                    style={leftBadgeStyle}
                    className="absolute inset-y-0 cursor-pointer flex items-center px-1 sm:px-1.5 z-20 group/badge"
                    title={`Filter by ${floor.name}`}
                  >
                    {isDark ? (
                      /* Dark Mode: Transparent hotspot over building's built-in facade badge */
                      <div
                        className={`w-full h-[85%] rounded-md transition-all duration-200 border ${
                          isHovered || isSelected
                            ? 'border-white/50 bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.15)] ring-1 ring-white/30'
                            : 'border-transparent hover:bg-white/5'
                        }`}
                      />
                    ) : (
                      /* Light Mode: Elegant, sun-drenched travertine architectural badge */
                      <div
                        className={`w-full h-[88%] rounded-lg transition-all duration-200 flex flex-col justify-center px-2 py-1 border shadow-xs ${
                          isHovered || isSelected
                            ? 'bg-[#faf6f0]/95 border-[#c35626]/60 shadow-[0_4px_16px_rgba(195,86,38,0.15)] ring-1 ring-[#c35626]/30'
                            : 'bg-[#faf6f0]/75 hover:bg-[#faf6f0]/90 border-[#e8ded0]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] font-mono font-black text-[#c35626] tracking-widest">
                            0{floor.number} · FLOOR
                          </span>
                          <ChevronRight
                            className={`w-2.5 h-2.5 text-[#c35626] transition-transform ${
                              isHovered || isSelected ? 'translate-x-0.5' : 'opacity-40'
                            }`}
                          />
                        </div>
                        <p className="text-[10px] font-black tracking-tight text-[#1e140d] leading-none truncate mt-0.5">
                          {floor.name}
                        </p>
                        <span className="text-[7.5px] text-[#786452] truncate block mt-0.5 font-medium">
                          {floor.tagline}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Middle Column: 3 Transparent Glass Chamber Hotspots (Products are visually inside the building!) */}
                  {floor.rooms.length > 0 ? (
                    <div
                      style={roomsGridStyle}
                      className="absolute inset-y-0 grid grid-cols-3 gap-1 px-1 py-1 z-20"
                    >
                      {floor.rooms.map((room) => {
                        const isThisRoomHovered =
                          hoveredRoom?.floor === floor.number && hoveredRoom?.slot === room.slot;
                        const isJustAdded = addedId === room.productId;

                        return (
                          <div
                            key={room.slot}
                            onMouseEnter={() =>
                              setHoveredRoom({ floor: floor.number, slot: room.slot, productId: room.productId })
                            }
                            onMouseLeave={() => setHoveredRoom(null)}
                            onClick={(e) => handleRoomClick(e, room.productId)}
                            className={`group/room relative rounded-md cursor-pointer transition-all duration-200 flex flex-col justify-end p-1.5 overflow-hidden border ${
                              isThisRoomHovered
                                ? isDark
                                  ? 'bg-white/[0.08] border-white/50 shadow-[inset_0_0_20px_rgba(255,255,255,0.2)] ring-1 ring-white/40'
                                  : 'bg-[#c35626]/[0.06] border-[#c35626]/60 shadow-[inset_0_0_20px_rgba(195,86,38,0.18)] ring-1 ring-[#c35626]/40'
                                : 'bg-transparent border-transparent hover:bg-white/[0.04]'
                            }`}
                            title={`Inspect ${room.title} (₹${room.price.toLocaleString('en-IN')})`}
                          >
                            {/* Hover Quick Action Pill: Compact & Non-overlapping at the bottom of the glass bay */}
                            <div
                              className={`transition-all duration-200 rounded-md p-1.5 text-left border shadow-2xl z-30 ${
                                isThisRoomHovered
                                  ? 'opacity-100 translate-y-0 pointer-events-auto'
                                  : 'opacity-0 translate-y-2 pointer-events-none'
                              } ${
                                isDark
                                  ? 'bg-black/92 text-white border-white/30 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.8)]'
                                  : 'bg-white/95 text-[#1c140e] border-[#c35626]/30 backdrop-blur-md shadow-[0_4px_20px_rgba(195,86,38,0.2)]'
                              }`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center justify-between gap-1.5">
                                <div
                                  className="min-w-0 flex-1 cursor-pointer"
                                  onClick={(e) => handleRoomClick(e, room.productId)}
                                >
                                  <p className="text-[10px] font-black truncate leading-tight">
                                    {room.title}
                                  </p>
                                  <span
                                    className={`text-[9px] font-bold font-mono ${
                                      isDark ? 'text-[#d2f53a]' : 'text-[#c35626]'
                                    }`}
                                  >
                                    ₹{room.price.toLocaleString('en-IN')}
                                  </span>
                                </div>

                                <button
                                  onClick={(e) => handleQuickAddRoom(e, room.productId)}
                                  className={`p-1 rounded text-[9px] font-bold flex items-center justify-center cursor-pointer transition-all shrink-0 ${
                                    isJustAdded
                                      ? 'bg-emerald-500 text-white'
                                      : isDark
                                      ? 'bg-[#d2f53a] text-black hover:scale-105'
                                      : 'bg-[#c35626] text-white hover:scale-105'
                                  }`}
                                  title="Quick Add to Trolley"
                                >
                                  {isJustAdded ? (
                                    <Check className="w-2.5 h-2.5" />
                                  ) : (
                                    <Plus className="w-2.5 h-2.5 stroke-[3]" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Ground Floor: Transparent Storefront Hotspot */
                    <div
                      onClick={() => {
                        sound.playClick();
                        if (onOpenStorePhilosophy) onOpenStorePhilosophy();
                      }}
                      style={roomsGridStyle}
                      className="absolute inset-y-0 px-2 py-1 flex items-center justify-center cursor-pointer group/store z-20"
                      title="Enter VINKRI Flagship Boutique • Jubilee Hills, Hyderabad"
                    >
                      <div
                        className={`w-full h-full rounded-md transition-all flex items-center justify-center ${
                          isDark
                            ? 'group-hover/store:bg-white/10 group-hover/store:ring-1 group-hover/store:ring-[#d2f53a]/40'
                            : 'group-hover/store:bg-[#c35626]/10 group-hover/store:ring-1 group-hover/store:ring-[#c35626]/40'
                        }`}
                      >
                        <div
                          className={`opacity-0 group-hover/store:opacity-100 transition-opacity px-3 py-1 rounded text-[10px] font-extrabold uppercase tracking-widest border shadow-xl ${
                            isDark
                              ? 'bg-black/90 text-[#d2f53a] border-white/20'
                              : 'bg-white/95 text-[#c35626] border-[#dfd2bf]'
                          }`}
                        >
                          Enter Boutique Storefront →
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Right Column: Interactive Hotspot over Floor Number Marker */}
                  <div
                    onClick={() => {
                      sound.playClick();
                      if (floorData) onSelectFloor(floorData);
                    }}
                    style={rightMarkerStyle}
                    className="absolute inset-y-0 cursor-pointer flex items-center justify-center group/marker z-20"
                    title={`Floor 0${floor.number}`}
                  >
                    {isDark ? (
                      <div
                        className={`w-[85%] h-[75%] rounded transition-all ${
                          isHovered || isSelected
                            ? 'ring-1 ring-white/50 bg-white/15'
                            : 'group-hover/marker:bg-white/10'
                        }`}
                      />
                    ) : (
                      <div
                        className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 border shadow-xs ${
                          isHovered || isSelected
                            ? 'bg-white/95 border-[#c35626]/60 shadow-[0_2px_10px_rgba(195,86,38,0.15)] ring-1 ring-[#c35626]/30'
                            : 'bg-white/60 hover:bg-white/80 border-[#e8ded0]'
                        }`}
                      >
                        <span className="text-[9px] font-mono font-black text-[#c35626]">
                          0{floor.number}
                        </span>
                        <span className="text-[8px] font-bold text-[#45372d] uppercase tracking-wider">
                          FLOOR
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Right Architectural Signature: "IDEAS INTO EVERYDAY OBJECTS →" */}
          <div
            onClick={() => {
              sound.playClick();
              if (onOpenStorePhilosophy) onOpenStorePhilosophy();
            }}
            style={{ bottom: '2.5%', right: '2.5%' }}
            className="absolute z-20 cursor-pointer group"
          >
            <div
              className={`text-[9px] sm:text-[11px] font-extrabold tracking-[0.2em] uppercase px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md backdrop-blur-md transition-all flex items-center gap-1.5 border shadow-lg ${
                isDark
                  ? 'bg-black/85 hover:bg-black text-[#d2f53a] border-white/20 group-hover:border-[#d2f53a]'
                  : 'bg-[#faf6f0]/95 hover:bg-white text-[#c35626] border-[#dfd2bf] shadow-md group-hover:border-[#c35626]'
              }`}
            >
              <span>IDEAS INTO EVERYDAY OBJECTS</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
