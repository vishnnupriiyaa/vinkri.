import React, { useState } from 'react';
import { Plus, Check, ChevronRight } from 'lucide-react';
import { FloorInfo, Product, ThemeMode } from '../types';
import { FLOORS_DATA, PRODUCTS_DATA } from '../data/products';

interface BuildingShowcaseProps {
  theme: ThemeMode;
  onSelectFloor: (floor: FloorInfo, slot?: 'left' | 'center' | 'right') => void;
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

  // Moving-to-floor elevator motion animation states
  const [movingFloorNumber, setMovingFloorNumber] = useState<number | null>(null);
  const [isMovingToFloor, setIsMovingToFloor] = useState(false);
  const [movingFloor, setMovingFloor] = useState<FloorInfo | null>(null);

  // Unified 5-story architectural floor configuration matching both light and dark buildings
  const floorsConfig = [
    {
      number: 5,
      top: '5.8%',
      height: '13.8%',
      name: 'DESK TOYS',
      color: isDark ? '#3b82f6' : '#2563eb',
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
      color: isDark ? '#10b981' : '#059669',
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
      color: isDark ? '#f59e0b' : '#d97706',
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
      color: isDark ? '#f43f5e' : '#e11d48',
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
      color: isDark ? '#f97316' : '#ea580c',
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
      color: isDark ? '#d2f53a' : '#c35626',
      tagline: 'Bespoke Atelier & Glass Boutique',
      rooms: []
    }
  ];

  const triggerMoveToFloor = (floorData: FloorInfo, slot: 'left' | 'center' | 'right' = 'center') => {
    if (isMovingToFloor) return;
    setMovingFloorNumber(floorData.numeric);
    setMovingFloor(floorData);
    setIsMovingToFloor(true);

    // Transit time for elevator moving animation
    setTimeout(() => {
      onSelectFloor(floorData, slot);
      setTimeout(() => {
        setIsMovingToFloor(false);
        setMovingFloorNumber(null);
        setMovingFloor(null);
      }, 350);
    }, 720);
  };

  const getCameraTransform = () => {
    if (!isMovingToFloor || movingFloorNumber === null) return 'scale(1) translate(0%, 0%)';
    switch (movingFloorNumber) {
      case 5:
        return 'scale(2.1) translateY(24%)';
      case 4:
        return 'scale(2.1) translateY(12%)';
      case 3:
        return 'scale(2.1) translateY(0%)';
      case 2:
        return 'scale(2.1) translateY(-12%)';
      case 1:
        return 'scale(2.1) translateY(-24%)';
      default:
        return 'scale(1) translate(0%, 0%)';
    }
  };

  const handleRoomClick = (e: React.MouseEvent, productId: string, floorNumber?: number, slot?: 'left' | 'center' | 'right') => {
    e.stopPropagation();
    if (floorNumber) {
      const floorData = FLOORS_DATA.find((f) => f.numeric === floorNumber);
      if (floorData) {
        triggerMoveToFloor(floorData, slot);
        return;
      }
    }
    const prod = PRODUCTS_DATA.find((p) => p.id === productId);
    if (prod) {
      onSelectProduct(prod);
    }
  };

  const handleQuickAddRoom = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
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
        style={{ aspectRatio: '1.38 / 1' }}
      >
        {/* Background Building Structure with Elevator Motion Camera Zoom */}
        <div
          className="relative w-full h-full transition-transform duration-700 ease-out"
          style={{
            transform: getCameraTransform(),
            transformOrigin: 'center center'
          }}
        >
          <img
            src={isDark ? '/assets/aistudio/dark_building.jpg' : '/assets/aistudio/light_building.jpg'}
            alt="VINKRI 5-Story Glass Architectural Atelier • Hyderabad"
            className="max-w-none absolute transition-all duration-700"
            style={{
              left: '-20%',
              top: '-1%',
              width: '140%',
              height: '102%',
              objectFit: 'cover'
            }}
          />

          {/* Theme-Adaptive Atmosphere Blends */}
          {isDark ? (
            <>
              {/* Dark Rustic Mode: Nighttime espresso/charcoal atmospheric blends */}
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0a0705] via-[#0a0705]/60 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#0a0705] to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#0a0705] via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0a0705]/70 to-transparent pointer-events-none" />
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

          {/* Architectural Rooftop VINKRI Billboard Display with 3D Scaffolding & Spotlights */}
          <div
            className="absolute z-25 flex flex-col items-center cursor-pointer group pointer-events-auto"
            style={{ top: '0.2%', left: '23%', width: '54%', height: '6.4%' }}
            onClick={() => {
              if (onOpenStorePhilosophy) onOpenStorePhilosophy();
            }}
            title="VINKRI Flagship Rooftop Billboard • Hyderabad Atelier (Click to learn more)"
          >
            {/* Top Architectural Spotlights (3 overhead floodlights angled downward) */}
            <div className="w-full flex justify-around px-8 -mb-1 relative z-30 pointer-events-none">
              {[0, 1, 2].map((spot) => (
                <div key={spot} className="flex flex-col items-center">
                  {/* Spotlight fixture head */}
                  <div
                    className={`w-2.5 h-1.5 rounded-t-xs border transition-colors ${
                      isDark
                        ? 'bg-[#2a2017] border-[#4a3928] shadow-[0_0_8px_rgba(210,245,58,0.5)]'
                        : 'bg-[#ebdcd0] border-[#c35626]/50 shadow-[0_1px_4px_rgba(195,86,38,0.15)]'
                    }`}
                  />
                  {/* Downward light beam cone */}
                  <div
                    className={`w-6 h-4 -mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity blur-[2px] ${
                      isDark
                        ? 'bg-gradient-to-b from-[#d2f53a]/40 to-transparent'
                        : 'bg-gradient-to-b from-amber-400/30 to-transparent'
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Main Billboard Housing Enclosure - Matches Theme Mode Palette */}
            <div
              className={`relative w-full flex-1 rounded-md flex items-center justify-between px-2 sm:px-3 overflow-hidden transition-all duration-300 border ${
                isDark
                  ? 'bg-black/95 border-[#4a3726] shadow-[0_0_35px_rgba(210,245,58,0.35),0_10px_25px_rgba(0,0,0,0.9)] group-hover:border-[#d2f53a] group-hover:shadow-[0_0_45px_rgba(210,245,58,0.65)]'
                  : 'bg-[#faf6f0] border-[#c35626]/50 shadow-[0_6px_22px_rgba(195,86,38,0.22),0_2px_8px_rgba(60,40,25,0.08)] group-hover:border-[#c35626] group-hover:shadow-[0_8px_30px_rgba(195,86,38,0.38)]'
              }`}
            >
              {/* Corner Metallic Fastener Rivets */}
              <div
                className={`absolute top-1 left-1 w-1 h-1 rounded-full border ${
                  isDark ? 'bg-white/30 border-black/50' : 'bg-[#c35626]/30 border-[#c35626]/60'
                }`}
              />
              <div
                className={`absolute top-1 right-1 w-1 h-1 rounded-full border ${
                  isDark ? 'bg-white/30 border-black/50' : 'bg-[#c35626]/30 border-[#c35626]/60'
                }`}
              />
              <div
                className={`absolute bottom-1 left-1 w-1 h-1 rounded-full border ${
                  isDark ? 'bg-white/30 border-black/50' : 'bg-[#c35626]/30 border-[#c35626]/60'
                }`}
              />
              <div
                className={`absolute bottom-1 right-1 w-1 h-1 rounded-full border ${
                  isDark ? 'bg-white/30 border-black/50' : 'bg-[#c35626]/30 border-[#c35626]/60'
                }`}
              />

              {/* Internal Luminous Backlight Aura */}
              <div
                className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
                  isDark
                    ? 'bg-gradient-to-r from-[#d2f53a]/15 via-white/10 to-[#d2f53a]/15 group-hover:opacity-100 opacity-70 animate-pulse'
                    : 'bg-gradient-to-r from-[#c35626]/8 via-amber-200/25 to-[#c35626]/8 opacity-80 group-hover:opacity-100'
                }`}
              />

              {/* Sub-badge Left: HYDERABAD */}
              <div
                className={`relative z-10 hidden sm:flex items-center gap-1 text-[7px] font-mono font-bold tracking-widest shrink-0 ${
                  isDark ? 'text-[#a89685]' : 'text-[#8c6b54]'
                }`}
              >
                <span
                  className={`w-1 h-1 rounded-full animate-pulse ${
                    isDark ? 'bg-emerald-400' : 'bg-[#c35626]'
                  }`}
                />
                <span>HYD</span>
              </div>

              {/* Center VINKRI Official Logo - Inverts cleanly for light theme beige background */}
              <div className="relative z-10 flex-1 flex items-center justify-center px-1">
                <img
                  src="/assets/aistudio/50547_5739e055.jpg"
                  alt="VINKRI Flagship Billboard"
                  className={`h-4 sm:h-5 md:h-6 w-auto max-w-[85%] object-contain group-hover:scale-105 transition-all duration-300 ${
                    isDark
                      ? 'filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]'
                      : 'filter invert mix-blend-multiply drop-shadow-[0_1px_3px_rgba(195,86,38,0.25)]'
                  }`}
                />
              </div>

              {/* Sub-badge Right: ATELIER */}
              <div className="relative z-10 hidden sm:flex items-center gap-1 text-[7px] font-mono font-bold tracking-widest shrink-0">
                <span className={isDark ? 'text-[#d2f53a]' : 'text-[#c35626] font-semibold'}>ATELIER</span>
              </div>

              {/* Glowing Neon Edge Accent Strips (Top & Bottom rails) */}
              <div
                className={`absolute top-0 inset-x-0 h-[1.5px] transition-colors ${
                  isDark
                    ? 'bg-gradient-to-r from-transparent via-[#d2f53a] to-transparent opacity-80 group-hover:opacity-100'
                    : 'bg-gradient-to-r from-transparent via-[#c35626] to-transparent opacity-90 group-hover:opacity-100'
                }`}
              />
              <div
                className={`absolute bottom-0 inset-x-0 h-[1.5px] transition-colors ${
                  isDark
                    ? 'bg-gradient-to-r from-transparent via-[#d2f53a] to-transparent opacity-80 group-hover:opacity-100'
                    : 'bg-gradient-to-r from-transparent via-[#c35626] to-transparent opacity-90 group-hover:opacity-100'
                }`}
              />
            </div>

            {/* Bottom Architectural Steel Support Struts / Girders */}
            <div className="w-full flex justify-around px-6 sm:px-12 -mt-0.5 relative z-10 pointer-events-none opacity-85">
              {[0, 1, 2, 3].map((girder) => (
                <div key={girder} className="flex flex-col items-center">
                  {/* Vertical steel strut */}
                  <div
                    className={`w-0.5 sm:w-1 h-1.5 ${
                      isDark
                        ? 'bg-[#3d2f21] border-x border-[#1a130c]'
                        : 'bg-[#b09d8b] border-x border-[#8c7866]'
                    }`}
                  />
                  {/* Rooftop anchor base plate */}
                  <div
                    className={`w-2 sm:w-2.5 h-0.5 rounded-full ${
                      isDark ? 'bg-[#5a4430]' : 'bg-[#c35626]/80'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Architectural Floor Layers */}
          <div className="absolute inset-0 z-10 pointer-events-auto">
            {floorsConfig.map((floor) => {
              const floorData = FLOORS_DATA.find((f) => f.numeric === floor.number);
              const isHovered = hoveredFloor === floor.number;
              const isSelected = selectedFloorNumber === floor.number;

              // Left badge column dimensions
              const leftBadgeStyle = { left: '1.5%', width: '19.5%', height: '100%' };

              // Middle 3-room grid dimensions
              const roomsGridStyle = { left: '21.5%', width: '57%', height: '100%' };

              // Right indicator column dimensions
              const rightMarkerStyle = { left: '79.5%', width: '19%', height: '100%' };

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
                      if (floorData) triggerMoveToFloor(floorData);
                      else if (floor.number === 0 && onOpenStorePhilosophy) onOpenStorePhilosophy();
                    }}
                    style={leftBadgeStyle}
                    className="absolute inset-y-0 cursor-pointer flex items-center px-1 sm:px-1.5 z-20 group/badge"
                    title={`Filter by ${floor.name}`}
                  >
                    <div
                      className={`w-full h-[88%] rounded-lg transition-all duration-200 flex flex-col justify-center px-1.5 sm:px-2 py-0.5 sm:py-1 border shadow-xs ${
                        isDark
                          ? isHovered || isSelected
                            ? 'bg-[#1e150f]/95 border-[#d2f53a]/60 shadow-[0_4px_16px_rgba(210,245,58,0.2)] ring-1 ring-[#d2f53a]/30'
                            : 'bg-[#18120d]/80 hover:bg-[#1e150f]/95 border-[#382b20]'
                          : isHovered || isSelected
                          ? 'bg-[#faf6f0]/95 border-[#c35626]/60 shadow-[0_4px_16px_rgba(195,86,38,0.15)] ring-1 ring-[#c35626]/30'
                          : 'bg-[#faf6f0]/75 hover:bg-[#faf6f0]/90 border-[#e8ded0]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[7px] sm:text-[8px] font-mono font-black tracking-wider sm:tracking-widest truncate ${
                            isDark ? 'text-[#d2f53a]' : 'text-[#c35626]'
                          }`}
                        >
                          0{floor.number} · FLOOR
                        </span>
                        <ChevronRight
                          className={`w-2 h-2 sm:w-2.5 sm:h-2.5 shrink-0 transition-transform ${
                            isDark ? 'text-[#d2f53a]' : 'text-[#c35626]'
                          } ${isHovered || isSelected ? 'translate-x-0.5' : 'opacity-40'}`}
                        />
                      </div>
                      <p
                        className={`text-[8.5px] sm:text-[10px] font-black tracking-tight leading-none truncate mt-0.5 ${
                          isDark ? 'text-white' : 'text-[#1e140d]'
                        }`}
                      >
                        {floor.name}
                      </p>
                      <span
                        className={`text-[7.5px] truncate block mt-0.5 font-medium ${
                          isDark ? 'text-[#a89685]' : 'text-[#786452]'
                        }`}
                      >
                        {floor.tagline}
                      </span>
                    </div>
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
                            onClick={(e) => handleRoomClick(e, room.productId, floor.number, room.slot)}
                            className={`group/room relative rounded-md cursor-pointer transition-all duration-200 flex flex-col justify-end p-1.5 overflow-hidden border ${
                              isThisRoomHovered
                                ? isDark
                                  ? 'bg-white/[0.08] border-white/50 shadow-[inset_0_0_20px_rgba(255,255,255,0.2)] ring-1 ring-white/40'
                                  : 'bg-[#c35626]/[0.06] border-[#c35626]/60 shadow-[inset_0_0_20px_rgba(195,86,38,0.18)] ring-1 ring-[#c35626]/40'
                                : 'bg-transparent border-transparent hover:bg-white/[0.04]'
                            }`}
                            title={`Step inside Level 0${floor.number} · ${room.title} (₹${room.price.toLocaleString('en-IN')})`}
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
                                  onClick={(e) => handleRoomClick(e, room.productId, floor.number, room.slot)}
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
                        if (onOpenStorePhilosophy) onOpenStorePhilosophy();
                      }}
                      style={roomsGridStyle}
                      className="absolute inset-y-0 px-2 py-1 flex items-center justify-center cursor-pointer group/store z-20"
                      title="Enter VINKRI Flagship Boutique • Hyderabad"
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
                      if (floorData) triggerMoveToFloor(floorData);
                    }}
                    style={rightMarkerStyle}
                    className="absolute inset-y-0 cursor-pointer flex items-center justify-center group/marker z-20"
                    title={`Floor 0${floor.number}`}
                  >
                    <div
                      className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 border shadow-xs ${
                        isDark
                          ? isHovered || isSelected
                            ? 'bg-[#1e150f]/95 border-[#d2f53a]/60 shadow-[0_2px_10px_rgba(210,245,58,0.2)] ring-1 ring-[#d2f53a]/30'
                            : 'bg-[#18120d]/80 hover:bg-[#1e150f]/95 border-[#382b20]'
                          : isHovered || isSelected
                          ? 'bg-white/95 border-[#c35626]/60 shadow-[0_2px_10px_rgba(195,86,38,0.15)] ring-1 ring-[#c35626]/30'
                          : 'bg-white/60 hover:bg-white/80 border-[#e8ded0]'
                      }`}
                    >
                      <span
                        className={`text-[9px] font-mono font-black ${
                          isDark ? 'text-[#d2f53a]' : 'text-[#c35626]'
                        }`}
                      >
                        0{floor.number}
                      </span>
                      <span
                        className={`text-[8px] font-bold uppercase tracking-wider ${
                          isDark ? 'text-[#c9b9a8]' : 'text-[#45372d]'
                        }`}
                      >
                        FLOOR
                      </span>
                    </div>
                  </div>

                  {/* Floor Window Illumination Burst during Elevator Movement */}
                  {isMovingToFloor && movingFloorNumber === floor.number && (
                    <div
                      className="absolute inset-0 pointer-events-none z-30 animate-pulse rounded-lg"
                      style={{
                        backgroundColor: `${floor.color}45`,
                        boxShadow: `inset 0 0 45px ${floor.color}, 0 0 35px ${floor.color}`
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Exterior Elevator Lift Carriage Animation */}
          {isMovingToFloor && (
            <div
              className="absolute z-35 right-[1.5%] w-8 sm:w-11 rounded-md border border-white/50 shadow-2xl transition-all duration-700 pointer-events-none flex flex-col items-center justify-center py-1 backdrop-blur-md"
              style={{
                top: floorsConfig.find((f) => f.number === movingFloorNumber)?.top || '50%',
                height: '11%',
                backgroundColor: isDark ? 'rgba(210, 245, 58, 0.35)' : 'rgba(195, 86, 38, 0.35)',
                boxShadow: isDark ? '0 0 30px rgba(210, 245, 58, 0.8)' : '0 0 25px rgba(195, 86, 38, 0.7)'
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span className="text-[7px] font-mono font-black text-white uppercase mt-0.5">
                0{movingFloorNumber}
              </span>
            </div>
          )}

          {/* Bottom Right Architectural Signature: "IDEAS INTO EVERYDAY OBJECTS →" */}
          <div
            onClick={() => {
              if (onOpenStorePhilosophy) onOpenStorePhilosophy();
            }}
            style={{ bottom: '2.5%', right: '2.5%' }}
            className="absolute z-20 cursor-pointer group"
          >
            <div
              className={`text-[8px] sm:text-[11px] font-extrabold tracking-[0.12em] sm:tracking-[0.2em] uppercase px-2 sm:px-3 py-1 sm:py-1.5 rounded-md backdrop-blur-md transition-all flex items-center gap-1 sm:gap-1.5 border shadow-lg ${
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

        {/* Cinematic Elevator In Transit HUD Overlay */}
        {isMovingToFloor && movingFloor && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none bg-black/45 backdrop-blur-[1px] transition-all duration-300">
            <div className="px-5 py-3.5 rounded-2xl bg-black/90 border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col items-center gap-1.5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono font-black text-[#d2f53a] tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-[#d2f53a] animate-ping" />
                <span>ELEVATOR IN TRANSIT • LEVEL 0{movingFloor.number}</span>
              </div>
              <span
                className="text-sm sm:text-base font-extrabold text-white tracking-wide"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Entering {movingFloor.name}...
              </span>
              <div className="w-36 h-1 rounded-full bg-white/20 overflow-hidden mt-1">
                <div className="h-full bg-gradient-to-r from-[#d2f53a] via-emerald-400 to-[#d2f53a] w-full animate-pulse" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
