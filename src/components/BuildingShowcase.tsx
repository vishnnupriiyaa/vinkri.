import React, { useState, useEffect } from 'react';
import {
  Plus,
  Check,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Eye,
  Star,
  ShoppingBag,
  Trash2,
  Heart
} from 'lucide-react';
import { FloorInfo, Product, ThemeMode } from '../types';
import { FLOORS_DATA, PRODUCTS_DATA } from '../data/products';
import { ProductArtwork } from './ProductArtwork';

interface BuildingShowcaseProps {
  theme: ThemeMode;
  onSelectFloor?: (floor: FloorInfo, slot?: 'left' | 'center' | 'right', productId?: string) => void;
  selectedFloorNumber?: number | null;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onOpenStorePhilosophy?: () => void;
  wishlistIds?: string[];
  onToggleWishlist?: (productId: string) => void;
  cartProductIds?: string[];
  onRemoveFromCart?: (productId: string) => void;
}

export const BuildingShowcase: React.FC<BuildingShowcaseProps> = ({
  theme,
  onSelectFloor,
  selectedFloorNumber,
  onSelectProduct,
  onQuickAdd,
  onOpenStorePhilosophy,
  wishlistIds = [],
  onToggleWishlist,
  cartProductIds = [],
  onRemoveFromCart
}) => {
  const isDark = theme === 'rustic-dark';
  const [hoveredFloor, setHoveredFloor] = useState<number | null>(null);
  const [hoveredRoom, setHoveredRoom] = useState<{
    floor: number;
    slot: 'left' | 'center' | 'right';
    productId?: string;
  } | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  // Active in-building expanding floor (starts with null or selectedFloorNumber)
  const [expandedFloorNumber, setExpandedFloorNumber] = useState<number | null>(3);

  // Keep expandedFloorNumber in sync if parent selectedFloorNumber changes
  useEffect(() => {
    if (selectedFloorNumber !== undefined) {
      setExpandedFloorNumber(selectedFloorNumber);
    }
  }, [selectedFloorNumber]);

  // Unified 5-story architectural floor configuration matching the exact cropped slices
  const floorsConfig = [
    {
      number: 5,
      name: 'DESK TOYS',
      color: isDark ? '#3b82f6' : '#2563eb',
      tagline: 'Play. Fidget. Display.',
      sliceLight: '/assets/aistudio/slices/light_floor5.jpg',
      sliceDark: '/assets/aistudio/slices/dark_floor5.jpg',
      aspectRatio: '1376 / 106',
      rooms: [
        { slot: 'left' as const, productId: 'grid-cube', title: 'Grid Cube', price: 1899 },
        { slot: 'center' as const, productId: 'automaton-horse', title: 'Automaton Horse', price: 4499 },
        { slot: 'right' as const, productId: 'chrome-snake', title: 'Chrome Serpent', price: 2799 }
      ]
    },
    {
      number: 4,
      name: 'CUSTOM DIORAMAS',
      color: isDark ? '#10b981' : '#059669',
      tagline: 'Mini worlds. Big stories.',
      sliceLight: '/assets/aistudio/slices/light_floor4.jpg',
      sliceDark: '/assets/aistudio/slices/dark_floor4.jpg',
      aspectRatio: '1376 / 105',
      rooms: [
        { slot: 'left' as const, productId: 'mount-everest-light', title: 'Mount Everest Light', price: 2499 },
        { slot: 'center' as const, productId: 'aeroplane-diorama', title: 'Aeroplane Diorama', price: 3299 },
        { slot: 'right' as const, productId: 'bonsai-sanctuary', title: 'Bonsai Sanctuary', price: 3899 }
      ]
    },
    {
      number: 3,
      name: 'DIECAST CAR STANDS',
      color: isDark ? '#f59e0b' : '#d97706',
      tagline: 'Display. Organize. Collect.',
      sliceLight: '/assets/aistudio/slices/light_floor3.jpg',
      sliceDark: '/assets/aistudio/slices/dark_floor3.jpg',
      aspectRatio: '1376 / 106',
      rooms: [
        { slot: 'left' as const, productId: 'diecast-stack', title: 'Collector 1:64 Stack', price: 2899 },
        { slot: 'center' as const, productId: 'car-showcase', title: 'Car Showcase', price: 3499 },
        { slot: 'right' as const, productId: 'tiered-track-rack', title: 'Track Showcase', price: 2699 }
      ]
    },
    {
      number: 2,
      name: 'CUSTOM FIGURINES',
      color: isDark ? '#f43f5e' : '#e11d48',
      tagline: 'People. Moments. Memories.',
      sliceLight: '/assets/aistudio/slices/light_floor2.jpg',
      sliceDark: '/assets/aistudio/slices/dark_floor2.jpg',
      aspectRatio: '1376 / 105',
      rooms: [
        { slot: 'left' as const, productId: 'custom-figurine-duo', title: 'Portrait Duo', price: 4999 },
        { slot: 'center' as const, productId: 'buddha-halo-lamp', title: 'Buddha Halo Lamp', price: 3699 },
        { slot: 'right' as const, productId: 'shiva-trishul-lamp', title: 'Shiva Trishul Aura', price: 3799 }
      ]
    },
    {
      number: 1,
      name: 'DECOR LAMPS',
      color: isDark ? '#f97316' : '#ea580c',
      tagline: 'Light up your space.',
      sliceLight: '/assets/aistudio/slices/light_floor1.jpg',
      sliceDark: '/assets/aistudio/slices/dark_floor1.jpg',
      aspectRatio: '1376 / 105',
      rooms: [
        { slot: 'left' as const, productId: 'crescent-bonsai', title: 'Crescent Moon Bonsai', price: 3199 },
        { slot: 'center' as const, productId: 'moon-tree-light', title: 'Moon Tree Light', price: 2499 },
        { slot: 'right' as const, productId: 'floating-levitron', title: 'Floating Levitron', price: 4999 }
      ]
    }
  ];

  const handleToggleFloor = (floorNumber: number) => {
    setExpandedFloorNumber((prev) => (prev === floorNumber ? null : floorNumber));
  };

  const handleRoomClick = (
    e: React.MouseEvent,
    productId: string,
    floorNumber: number
  ) => {
    e.stopPropagation();
    // If not already expanded, expand this floor
    if (expandedFloorNumber !== floorNumber) {
      setExpandedFloorNumber(floorNumber);
    }
    const prod = PRODUCTS_DATA.find((p) => p.id === productId);
    if (prod) {
      onSelectProduct(prod);
    }
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onQuickAdd(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="relative w-full flex flex-col justify-center select-none">
      {/* Outer Building Architectural Frame */}
      <div
        className={`relative w-full rounded-3xl overflow-hidden shadow-2xl border transition-all duration-500 ${
          isDark
            ? 'bg-[#0a0705] border-[#2e2015] shadow-[0_20px_60px_rgba(0,0,0,0.9)]'
            : 'bg-[#faf6f0] border-[#e2d5c3] shadow-[0_20px_60px_rgba(195,86,38,0.12)]'
        }`}
      >
        {/* Architectural Rooftop VINKRI Billboard Display with 3D Scaffolding & Spotlights */}
        <div className="relative w-full pt-2.5 px-4 z-20">
          <div
            className="w-full max-w-[62%] mx-auto flex flex-col items-center cursor-pointer group"
            onClick={() => {
              if (onOpenStorePhilosophy) onOpenStorePhilosophy();
            }}
            title="VINKRI Flagship Rooftop Billboard • Hyderabad Atelier (Click to learn more)"
          >
            {/* Top Spotlights (3 overhead floodlights angled downward) */}
            <div className="w-full flex justify-around px-8 -mb-0.5 relative z-30 pointer-events-none">
              {[0, 1, 2].map((spot) => (
                <div key={spot} className="flex flex-col items-center">
                  <div
                    className={`w-2.5 h-1.5 rounded-t-xs border transition-colors ${
                      isDark
                        ? 'bg-[#2a2017] border-[#4a3928] shadow-[0_0_8px_rgba(210,245,58,0.5)]'
                        : 'bg-[#ebdcd0] border-[#c35626]/50 shadow-[0_1px_4px_rgba(195,86,38,0.15)]'
                    }`}
                  />
                  <div
                    className={`w-6 h-3 -mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity blur-[2px] ${
                      isDark
                        ? 'bg-gradient-to-b from-[#d2f53a]/40 to-transparent'
                        : 'bg-gradient-to-b from-amber-400/30 to-transparent'
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Main Billboard Housing Enclosure */}
            <div
              className={`relative w-full h-8 sm:h-10 rounded-md flex items-center justify-between px-2 sm:px-4 overflow-hidden transition-all duration-300 border ${
                isDark
                  ? 'bg-black/95 border-[#4a3726] shadow-[0_0_35px_rgba(210,245,58,0.35),0_10px_25px_rgba(0,0,0,0.9)] group-hover:border-[#d2f53a]'
                  : 'bg-[#faf6f0] border-[#c35626]/50 shadow-[0_6px_22px_rgba(195,86,38,0.22),0_2px_8px_rgba(60,40,25,0.08)] group-hover:border-[#c35626]'
              }`}
            >
              <div
                className={`hidden sm:flex items-center gap-1 text-[7px] font-mono font-bold tracking-widest shrink-0 ${
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

              <div className="flex-1 flex items-center justify-center px-1">
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

              <div className="hidden sm:flex items-center gap-1 text-[7px] font-mono font-bold tracking-widest shrink-0">
                <span className={isDark ? 'text-[#d2f53a]' : 'text-[#c35626] font-semibold'}>
                  ATELIER
                </span>
              </div>
            </div>

            {/* Bottom Support Struts */}
            <div className="w-full flex justify-around px-8 -mt-0.5 relative z-10 pointer-events-none opacity-85">
              {[0, 1, 2, 3].map((girder) => (
                <div key={girder} className="flex flex-col items-center">
                  <div
                    className={`w-0.5 sm:w-1 h-1.5 ${
                      isDark
                        ? 'bg-[#3d2f21] border-x border-[#1a130c]'
                        : 'bg-[#b09d8b] border-x border-[#8c7866]'
                    }`}
                  />
                  <div
                    className={`w-2 sm:w-2.5 h-0.5 rounded-full ${
                      isDark ? 'bg-[#5a4430]' : 'bg-[#c35626]/80'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Roof Parapet Slice */}
        <div className="relative w-full -mt-0.5 leading-none">
          <img
            src={isDark ? '/assets/aistudio/slices/dark_roof.jpg' : '/assets/aistudio/slices/light_roof.jpg'}
            alt="Roof"
            className="w-full h-auto block select-none pointer-events-none"
            style={{ aspectRatio: '1376 / 45' }}
          />
        </div>

        {/* 5-Story Stack of Floors with In-Place Vertical Shelf Expansion */}
        <div className="relative w-full flex flex-col">
          {floorsConfig.map((floor) => {
            const isHovered = hoveredFloor === floor.number;
            const isExpanded = expandedFloorNumber === floor.number;
            const floorProducts = PRODUCTS_DATA.filter((p) => p.floorNumber === floor.number);

            // Left badge column dimensions
            const leftBadgeStyle = { left: '1.5%', width: '19.5%', height: '100%' };
            // Middle 3-room grid dimensions
            const roomsGridStyle = { left: '21.5%', width: '57%', height: '100%' };
            // Right indicator column dimensions
            const rightMarkerStyle = { left: '79.5%', width: '19%', height: '100%' };

            // Breakdown into 2 shelf tiers of 3 creations each:
            const shelfRow1Products = floorProducts.slice(3, 6);
            const shelfRow2Products = floorProducts.slice(6, 9);

            return (
              <div key={floor.number} className="relative w-full flex flex-col">
                {/* 1. TOP VITRINE WINDOW SLICE (Floor 0X: 3 display windows with original products) */}
                <div
                  onMouseEnter={() => setHoveredFloor(floor.number)}
                  onMouseLeave={() => setHoveredFloor(null)}
                  onClick={() => handleToggleFloor(floor.number)}
                  className={`relative w-full cursor-pointer transition-all duration-300 ${
                    isExpanded
                      ? isDark
                        ? 'ring-2 ring-[#d2f53a] shadow-[0_0_25px_rgba(210,245,58,0.25)] z-20'
                        : 'ring-2 ring-[#c35626] shadow-[0_0_25px_rgba(195,86,38,0.2)] z-20'
                      : isHovered
                      ? isDark
                        ? 'ring-1 ring-[#d2f53a]/40'
                        : 'ring-1 ring-[#c35626]/40'
                      : ''
                  }`}
                  style={{ aspectRatio: floor.aspectRatio }}
                >
                  <img
                    src={isDark ? floor.sliceDark : floor.sliceLight}
                    alt={floor.name}
                    className="w-full h-full object-cover block select-none pointer-events-none"
                  />

                  {/* Left Column: Floor Category Badge */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFloor(floor.number);
                    }}
                    style={leftBadgeStyle}
                    className="absolute inset-y-0 cursor-pointer flex items-center px-1 sm:px-2 z-20 group/badge"
                    title={`Click to ${isExpanded ? 'collapse' : 'open and expand'} Level 0${floor.number} · ${floor.name}`}
                  >
                    <div
                      className={`w-full h-[88%] rounded-lg transition-all duration-200 flex flex-col justify-center px-1.5 sm:px-2.5 py-0.5 sm:py-1 border shadow-xs ${
                        isExpanded
                          ? isDark
                            ? 'bg-[#1e150f] border-[#d2f53a] shadow-[0_4px_16px_rgba(210,245,58,0.25)]'
                            : 'bg-[#faf6f0] border-[#c35626] shadow-[0_4px_16px_rgba(195,86,38,0.2)]'
                          : isDark
                          ? isHovered
                            ? 'bg-[#1e150f]/95 border-[#d2f53a]/60'
                            : 'bg-[#18120d]/85 border-[#382b20]'
                          : isHovered
                          ? 'bg-[#faf6f0]/95 border-[#c35626]/60'
                          : 'bg-[#faf6f0]/75 hover:bg-[#faf6f0]/90 border-[#e8ded0]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[7px] sm:text-[8px] font-mono font-black tracking-wider truncate ${
                            isDark ? 'text-[#d2f53a]' : 'text-[#c35626]'
                          }`}
                        >
                          0{floor.number} · FLOOR
                        </span>
                        <ChevronDown
                          className={`w-2.5 h-2.5 shrink-0 transition-transform duration-300 ${
                            isDark ? 'text-[#d2f53a]' : 'text-[#c35626]'
                          } ${isExpanded ? 'rotate-180' : isHovered ? 'translate-y-0.5' : 'opacity-40'}`}
                        />
                      </div>
                      <p
                        className={`text-[8px] sm:text-[10px] font-black tracking-tight leading-none truncate mt-0.5 ${
                          isDark ? 'text-white' : 'text-[#1e140d]'
                        }`}
                      >
                        {floor.name}
                      </p>
                      <span
                        className={`text-[7px] truncate block mt-0.5 font-medium ${
                          isDark ? 'text-[#a89685]' : 'text-[#786452]'
                        }`}
                      >
                        {floor.tagline}
                      </span>
                    </div>
                  </div>

                  {/* Middle Column: 3 Transparent Glass Chamber Hotspots */}
                  <div
                    style={roomsGridStyle}
                    className="absolute inset-y-0 grid grid-cols-3 gap-1 px-1 py-1 z-20"
                  >
                    {floor.rooms.map((room) => {
                      const isThisRoomHovered =
                        hoveredRoom?.floor === floor.number && hoveredRoom?.slot === room.slot;
                      const prod = PRODUCTS_DATA.find((p) => p.id === room.productId);
                      const isJustAdded = addedId === room.productId;

                      return (
                        <div
                          key={room.slot}
                          onMouseEnter={() =>
                            setHoveredRoom({
                              floor: floor.number,
                              slot: room.slot,
                              productId: room.productId
                            })
                          }
                          onMouseLeave={() => setHoveredRoom(null)}
                          onClick={(e) => handleRoomClick(e, room.productId, floor.number)}
                          className={`group/room relative rounded-md cursor-pointer transition-all duration-200 flex flex-col justify-end p-1.5 overflow-hidden border ${
                            isThisRoomHovered
                              ? isDark
                                ? 'bg-white/[0.08] border-white/50 shadow-[inset_0_0_20px_rgba(255,255,255,0.2)]'
                                : 'bg-[#c35626]/[0.06] border-[#c35626]/60 shadow-[inset_0_0_20px_rgba(195,86,38,0.18)]'
                              : 'bg-transparent border-transparent hover:bg-white/[0.04]'
                          }`}
                          title={`Inspect ${room.title} (₹${room.price.toLocaleString('en-IN')})`}
                        >
                          {/* Hover Quick Action Card at bottom of glass bay */}
                          <div
                            className={`transition-all duration-200 rounded-md p-1 sm:p-1.5 text-left border shadow-2xl z-30 ${
                              isThisRoomHovered
                                ? 'opacity-100 translate-y-0 pointer-events-auto'
                                : 'opacity-0 translate-y-2 pointer-events-none'
                            } ${
                              isDark
                                ? 'bg-black/92 text-white border-white/30 backdrop-blur-md'
                                : 'bg-white/95 text-[#1c140e] border-[#c35626]/30 backdrop-blur-md'
                            }`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-between gap-1.5">
                              <div
                                className="min-w-0 flex-1 cursor-pointer"
                                onClick={(e) => handleRoomClick(e, room.productId, floor.number)}
                              >
                                <p className="text-[9px] sm:text-[10px] font-black truncate leading-tight">
                                  {room.title}
                                </p>
                                <span
                                  className={`text-[8px] sm:text-[9px] font-bold font-mono ${
                                    isDark ? 'text-[#d2f53a]' : 'text-[#c35626]'
                                  }`}
                                >
                                  ₹{room.price.toLocaleString('en-IN')}
                                </span>
                              </div>

                              {prod && (
                                <button
                                  onClick={(e) => handleQuickAdd(e, prod)}
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
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right Column: Floor Number Marker & Expand Indicator */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFloor(floor.number);
                    }}
                    style={rightMarkerStyle}
                    className="absolute inset-y-0 cursor-pointer flex items-center justify-center group/marker z-20"
                    title={`Floor 0${floor.number} - Click to ${isExpanded ? 'collapse' : 'expand'}`}
                  >
                    <div
                      className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 border shadow-xs ${
                        isExpanded
                          ? isDark
                            ? 'bg-[#1e150f] border-[#d2f53a] shadow-[0_2px_10px_rgba(210,245,58,0.2)]'
                            : 'bg-white border-[#c35626] shadow-[0_2px_10px_rgba(195,86,38,0.15)]'
                          : isDark
                          ? isHovered
                            ? 'bg-[#1e150f]/95 border-[#d2f53a]/60'
                            : 'bg-[#18120d]/80 hover:bg-[#1e150f]/95 border-[#382b20]'
                          : isHovered
                          ? 'bg-white/95 border-[#c35626]/60'
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
                        {isExpanded ? 'CLOSE' : 'EXPAND'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. THE EXPANDING SHELVES DRAWER (EXACTLY AS SHOWN IN THE VIDEO) */}
                {/* Expands downwards right inside the building with horizontal wooden beams & vertical dividers, pushing the lower floors down */}
                <div
                  className={`relative w-full overflow-hidden transition-all duration-700 ease-in-out ${
                    isExpanded
                      ? 'max-h-[1400px] opacity-100 z-10'
                      : 'max-h-0 opacity-0 pointer-events-none'
                  }`}
                >
                  <div
                    className={`w-full transition-colors flex flex-col ${
                      isDark
                        ? 'bg-[#120c08] border-y border-[#3d2c1d]'
                        : 'bg-[#faf4ec] border-y border-[#decbb8]'
                    }`}
                  >
                    {/* Horizontal Wooden Beam Above Expanding Shelves */}
                    <div
                      className={`w-full h-2 sm:h-2.5 shadow-inner border-y ${
                        isDark
                          ? 'bg-gradient-to-r from-[#2c1d12] via-[#3d2919] to-[#2c1d12] border-[#4a3421]'
                          : 'bg-gradient-to-r from-[#decbb7] via-[#e8dbcc] to-[#decbb7] border-[#ccb7a0]'
                      }`}
                    />

                    {/* Department Quick Header Banner */}
                    <div
                      className={`w-full px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between border-b transition-colors ${
                        isDark
                          ? 'border-[#2c1d12] bg-[#160f09]/80'
                          : 'border-[#decbb8] bg-[#f5ede1]/80'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 sm:gap-2.5">
                        <div
                          className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full animate-pulse"
                          style={{ backgroundColor: floor.color }}
                        />
                        <span
                          className="text-[8px] sm:text-[10px] font-mono font-black uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded border"
                          style={{
                            backgroundColor: `${floor.color}15`,
                            borderColor: `${floor.color}40`,
                            color: floor.color
                          }}
                        >
                          LEVEL 0{floor.number} · SHELVES
                        </span>
                        <span
                          className={`text-xs sm:text-sm font-black tracking-tight ${
                            isDark ? 'text-white' : 'text-[#1e140d]'
                          }`}
                        >
                          {floor.name}
                        </span>
                        <span
                          className={`hidden md:inline text-[9px] font-mono ${
                            isDark ? 'text-[#8a7563]' : 'text-[#8c7866]'
                          }`}
                        >
                          (6 Curated Artisan Creations on Display)
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {onSelectFloor && (
                          <button
                            type="button"
                            onClick={() =>
                              onSelectFloor(
                                FLOORS_DATA.find((f) => f.numeric === floor.number) || FLOORS_DATA[0]
                              )
                            }
                            className={`text-[8.5px] sm:text-[10px] font-mono font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-md border transition-all flex items-center gap-1 cursor-pointer ${
                              isDark
                                ? 'bg-[#1f150e] text-[#d2f53a] hover:bg-[#281b12] border-[#382618]'
                                : 'bg-white text-[#c35626] hover:bg-[#fbf7f2] border-[#dfd2be]'
                            }`}
                            title="View full floor page with catalog"
                          >
                            <span>Floor View</span>
                            <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleToggleFloor(floor.number)}
                          className={`text-[8.5px] sm:text-[10px] font-mono font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md border transition-all flex items-center gap-1 cursor-pointer ${
                            isDark
                              ? 'bg-[#1f150e] text-[#c9b9a8] hover:text-white border-[#382618]'
                              : 'bg-white text-[#786452] hover:text-[#1e140d] border-[#dfd2be]'
                          }`}
                          title="Collapse floor shelves"
                        >
                          <span>Close</span>
                          <ChevronUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        </button>
                      </div>
                    </div>

                    {/* SHELF TIER 1: 3 CARDS WITH VISIBLE PRODUCT IMAGES */}
                    <div className="relative w-full px-2 sm:px-4 py-2 sm:py-3">
                      <div className="grid grid-cols-3 gap-2 sm:gap-3.5">
                        {shelfRow1Products.map((product, idx) => {
                          const isInCart = cartProductIds.includes(product.id);
                          const isJustAdded = addedId === product.id;

                          return (
                            <div
                              key={product.id}
                              onClick={() => onSelectProduct(product)}
                              className={`group/card relative rounded-xl sm:rounded-2xl p-2 sm:p-3 flex flex-col justify-between transition-all duration-300 cursor-pointer border animate-drop-cascade ${
                                isDark
                                  ? 'bg-[#18110b] hover:bg-[#1f150e] border-[#2c1d12] hover:border-[#d2f53a]/60 shadow-[0_4px_16px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_24px_rgba(210,245,58,0.15)] hover:scale-[1.015]'
                                  : 'bg-white hover:bg-[#fffdfa] border-[#e2d5c3] hover:border-[#c35626]/70 shadow-[0_3px_12px_rgba(195,86,38,0.06)] hover:shadow-[0_8px_24px_rgba(195,86,38,0.12)] hover:scale-[1.015]'
                              }`}
                              style={{ animationDelay: `${idx * 80 + 50}ms` }}
                            >
                              <div>
                                <div className="flex items-center justify-between mb-1.5">
                                  <span
                                    className={`text-[7px] sm:text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                                      isDark
                                        ? 'bg-[#0f0a07] text-[#9c8979] border-[#2b1c11]'
                                        : 'bg-[#faf4ec] text-[#69584b] border-[#ded4c3]'
                                    }`}
                                  >
                                    SHELF 01 · BAY 0{idx + 1}
                                  </span>
                                  <div className="flex items-center gap-0.5 text-amber-500 text-[8.5px] sm:text-[9.5px] font-mono font-bold">
                                    <Star className="w-2.5 h-2.5 fill-amber-500" />
                                    <span>{product.rating}</span>
                                  </div>
                                </div>

                                {/* Product Image Viewport */}
                                <div
                                  className={`relative aspect-[4/3] sm:aspect-square w-full rounded-lg sm:rounded-xl overflow-hidden border mb-1.5 sm:mb-2 flex items-center justify-center p-1.5 transition-all duration-300 ${
                                    isDark
                                      ? 'bg-[#090604] border-[#261910] group-hover/card:border-[#d2f53a]/40 shadow-inner'
                                      : 'bg-[#faf4ec] border-[#e6dac9] group-hover/card:border-[#c35626]/40 shadow-inner'
                                  }`}
                                >
                                  <ProductArtwork
                                    productId={product.id}
                                    aspectRatio="square"
                                    theme={theme}
                                    objectFit="cover"
                                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                                  />

                                  {/* Quick view button */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onSelectProduct(product);
                                    }}
                                    className={`absolute top-1 right-1 sm:top-1.5 sm:right-1.5 z-10 p-1 sm:p-1.5 rounded-md opacity-0 group-hover/card:opacity-100 transition-opacity backdrop-blur-md border shadow-xs cursor-pointer ${
                                      isDark
                                        ? 'bg-black/75 text-white hover:text-[#d2f53a] border-white/20'
                                        : 'bg-white/90 text-[#1e140d] hover:text-[#c35626] border-[#decbb7]'
                                    }`}
                                    title="View Details"
                                  >
                                    <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                  </button>
                                </div>

                                <h4
                                  className={`text-[9.5px] sm:text-xs md:text-sm font-black tracking-tight leading-snug line-clamp-1 group-hover/card:underline ${
                                    isDark ? 'text-white' : 'text-[#1e140d]'
                                  }`}
                                  style={{ fontFamily: 'var(--font-display)' }}
                                >
                                  {product.name}
                                </h4>

                                <p
                                  className={`text-[8px] sm:text-[9.5px] line-clamp-1 mt-0.5 ${
                                    isDark ? 'text-[#a89685]' : 'text-[#69584b]'
                                  }`}
                                >
                                  {product.description || product.shortTag}
                                </p>
                              </div>

                              <div
                                className={`pt-1.5 mt-1.5 sm:pt-2 sm:mt-2 border-t flex items-center justify-between gap-1 ${
                                  isDark ? 'border-[#261910]' : 'border-[#eedfcb]'
                                }`}
                              >
                                <span
                                  className={`text-[10.5px] sm:text-xs md:text-sm font-black font-mono ${
                                    isDark ? 'text-[#d2f53a]' : 'text-[#c35626]'
                                  }`}
                                >
                                  ₹{product.price.toLocaleString('en-IN')}
                                </span>

                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={(e) => handleQuickAdd(e, product)}
                                    className={`py-1 px-1.5 sm:px-2.5 rounded-md sm:rounded-lg text-[8.5px] sm:text-[10px] font-mono font-black uppercase transition-all duration-200 flex items-center gap-1 cursor-pointer active:scale-95 ${
                                      isJustAdded
                                        ? 'bg-emerald-500 text-white'
                                        : isDark
                                        ? 'bg-[#d2f53a] hover:bg-[#bce427] text-black font-black'
                                        : 'bg-[#c35626] hover:bg-[#a8471d] text-white font-black'
                                    }`}
                                  >
                                    {isJustAdded ? (
                                      <Check className="w-3 h-3 stroke-[3]" />
                                    ) : (
                                      <>
                                        <ShoppingBag className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                        <span>{isInCart ? '+1' : 'Add'}</span>
                                      </>
                                    )}
                                  </button>

                                  {isInCart && onRemoveFromCart && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onRemoveFromCart(product.id);
                                      }}
                                      className="p-1 rounded-md border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-all cursor-pointer"
                                      title="Remove from trolley"
                                    >
                                      <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Horizontal Wooden Divider Beam */}
                    <div
                      className={`w-full h-1.5 sm:h-2 shadow-inner border-y ${
                        isDark
                          ? 'bg-gradient-to-r from-[#2c1d12] via-[#3d2919] to-[#2c1d12] border-[#4a3421]'
                          : 'bg-gradient-to-r from-[#decbb7] via-[#e8dbcc] to-[#decbb7] border-[#ccb7a0]'
                      }`}
                    />

                    {/* SHELF TIER 2: 3 CARDS WITH VISIBLE PRODUCT IMAGES */}
                    <div className="relative w-full px-2 sm:px-4 py-2 sm:py-3">
                      <div className="grid grid-cols-3 gap-2 sm:gap-3.5">
                        {shelfRow2Products.map((product, idx) => {
                          const isInCart = cartProductIds.includes(product.id);
                          const isJustAdded = addedId === product.id;

                          return (
                            <div
                              key={product.id}
                              onClick={() => onSelectProduct(product)}
                              className={`group/card relative rounded-xl sm:rounded-2xl p-2 sm:p-3 flex flex-col justify-between transition-all duration-300 cursor-pointer border animate-drop-cascade ${
                                isDark
                                  ? 'bg-[#18110b] hover:bg-[#1e150e] border-[#2c1d12] hover:border-[#d2f53a]/60 shadow-[0_4px_16px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_24px_rgba(210,245,58,0.15)] hover:scale-[1.015]'
                                  : 'bg-white hover:bg-[#fffdfa] border-[#e2d5c3] hover:border-[#c35626]/70 shadow-[0_3px_12px_rgba(195,86,38,0.06)] hover:shadow-[0_8px_24px_rgba(195,86,38,0.12)] hover:scale-[1.015]'
                              }`}
                              style={{ animationDelay: `${(idx + 3) * 80 + 50}ms` }}
                            >
                              <div>
                                <div className="flex items-center justify-between mb-1.5">
                                  <span
                                    className={`text-[7px] sm:text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                                      isDark
                                        ? 'bg-[#0f0a07] text-[#9c8979] border-[#2b1c11]'
                                        : 'bg-[#faf4ec] text-[#69584b] border-[#ded4c3]'
                                    }`}
                                  >
                                    SHELF 02 · BAY 0{idx + 4}
                                  </span>

                                  <div className="flex items-center gap-0.5 text-amber-500 text-[8.5px] sm:text-[9.5px] font-mono font-bold">
                                    <Star className="w-2.5 h-2.5 fill-amber-500" />
                                    <span>{product.rating}</span>
                                  </div>
                                </div>

                                {/* Product Image Viewport */}
                                <div
                                  className={`relative aspect-[4/3] sm:aspect-square w-full rounded-lg sm:rounded-xl overflow-hidden border mb-1.5 sm:mb-2 flex items-center justify-center p-1.5 transition-all duration-300 ${
                                    isDark
                                      ? 'bg-[#090604] border-[#261910] group-hover/card:border-[#d2f53a]/40 shadow-inner'
                                      : 'bg-[#faf4ec] border-[#e6dac9] group-hover/card:border-[#c35626]/40 shadow-inner'
                                  }`}
                                >
                                  <ProductArtwork
                                    productId={product.id}
                                    aspectRatio="square"
                                    theme={theme}
                                    objectFit="cover"
                                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                                  />

                                  {/* Quick view button */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onSelectProduct(product);
                                    }}
                                    className={`absolute top-1 right-1 sm:top-1.5 sm:right-1.5 z-10 p-1 sm:p-1.5 rounded-md opacity-0 group-hover/card:opacity-100 transition-opacity backdrop-blur-md border shadow-xs cursor-pointer ${
                                      isDark
                                        ? 'bg-black/75 text-white hover:text-[#d2f53a] border-white/20'
                                        : 'bg-white/90 text-[#1e140d] hover:text-[#c35626] border-[#decbb7]'
                                    }`}
                                    title="View Details"
                                  >
                                    <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                  </button>
                                </div>

                                <h4
                                  className={`text-[9.5px] sm:text-xs md:text-sm font-black tracking-tight leading-snug line-clamp-1 group-hover/card:underline ${
                                    isDark ? 'text-white' : 'text-[#1e140d]'
                                  }`}
                                  style={{ fontFamily: 'var(--font-display)' }}
                                >
                                  {product.name}
                                </h4>

                                <p
                                  className={`text-[8px] sm:text-[9.5px] line-clamp-1 mt-0.5 ${
                                    isDark ? 'text-[#a89685]' : 'text-[#69584b]'
                                  }`}
                                >
                                  {product.description || product.shortTag}
                                </p>
                              </div>

                              <div
                                className={`pt-1.5 mt-1.5 sm:pt-2 sm:mt-2 border-t flex items-center justify-between gap-1 ${
                                  isDark ? 'border-[#261910]' : 'border-[#eedfcb]'
                                }`}
                              >
                                <span
                                  className={`text-[10.5px] sm:text-xs md:text-sm font-black font-mono ${
                                    isDark ? 'text-[#d2f53a]' : 'text-[#c35626]'
                                  }`}
                                >
                                  ₹{product.price.toLocaleString('en-IN')}
                                </span>

                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={(e) => handleQuickAdd(e, product)}
                                    className={`py-1 px-1.5 sm:px-2.5 rounded-md sm:rounded-lg text-[8.5px] sm:text-[10px] font-mono font-black uppercase transition-all duration-200 flex items-center gap-1 cursor-pointer active:scale-95 ${
                                      isJustAdded
                                        ? 'bg-emerald-500 text-white'
                                        : isDark
                                        ? 'bg-[#d2f53a] hover:bg-[#bce427] text-black font-black'
                                        : 'bg-[#c35626] hover:bg-[#a8471d] text-white font-black'
                                    }`}
                                  >
                                    {isJustAdded ? (
                                      <Check className="w-3 h-3 stroke-[3]" />
                                    ) : (
                                      <>
                                        <ShoppingBag className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                        <span>{isInCart ? '+1' : 'Add'}</span>
                                      </>
                                    )}
                                  </button>

                                  {isInCart && onRemoveFromCart && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onRemoveFromCart(product.id);
                                      }}
                                      className="p-1 rounded-md border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-all cursor-pointer"
                                      title="Remove from trolley"
                                    >
                                      <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bottom Horizontal Wooden Beam */}
                    <div
                      className={`w-full h-2 sm:h-2.5 shadow-inner border-y ${
                        isDark
                          ? 'bg-gradient-to-r from-[#2c1d12] via-[#3d2919] to-[#2c1d12] border-[#4a3421]'
                          : 'bg-gradient-to-r from-[#decbb7] via-[#e8dbcc] to-[#decbb7] border-[#ccb7a0]'
                      }`}
                    />
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Ground Floor Atelier Storefront (Pushed down when floors expand) */}
        <div
          onClick={() => {
            if (onOpenStorePhilosophy) onOpenStorePhilosophy();
          }}
          className="relative w-full cursor-pointer group/atelier leading-none"
          title="Enter VINKRI Flagship Atelier Boutique • Hyderabad"
        >
          <img
            src={isDark ? '/assets/aistudio/slices/dark_ground.jpg' : '/assets/aistudio/slices/light_ground.jpg'}
            alt="VINKRI Flagship Atelier Boutique"
            className="w-full h-auto block select-none pointer-events-none"
            style={{ aspectRatio: '1376 / 196' }}
          />

          <div className="absolute inset-x-0 bottom-3 flex justify-center pointer-events-none">
            <div
              className={`opacity-0 group-hover/atelier:opacity-100 transition-opacity px-3 py-1 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-widest border shadow-xl ${
                isDark
                  ? 'bg-black/90 text-[#d2f53a] border-white/20'
                  : 'bg-white/95 text-[#c35626] border-[#dfd2bf]'
              }`}
            >
              Enter Boutique Storefront →
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
