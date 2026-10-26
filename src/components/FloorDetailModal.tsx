import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Eye,
  Sparkles,
  Plus,
  ShoppingBag,
  Moon,
  Check,
  Heart,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Trash2,
  Building,
  Layers,
  Box,
  MapPin
} from 'lucide-react';
import { FloorInfo, Product, ThemeMode } from '../types';
import { PRODUCTS_DATA, FLOORS_DATA } from '../data/products';
import { ProductArtwork } from './ProductArtwork';

interface FloorDetailModalProps {
  floor: FloorInfo | null;
  onClose: () => void;
  theme: ThemeMode;
  onSelectProduct: (product: Product) => void;
  onQuickAdd?: (product: Product) => void;
  onOpenVirtualDarkRoom?: (productId: string) => void;
  onSwitchFloor?: (floor: FloorInfo) => void;
  initialSlot?: 'left' | 'center' | 'right' | null;
  wishlistIds?: string[];
  onToggleWishlist?: (productId: string) => void;
  cartProductIds?: string[];
  onRemoveFromCart?: (productId: string) => void;
}

export const FloorDetailModal: React.FC<FloorDetailModalProps> = ({
  floor,
  onClose,
  theme,
  onSelectProduct,
  onQuickAdd,
  onOpenVirtualDarkRoom,
  onSwitchFloor,
  initialSlot = 'center',
  wishlistIds = [],
  onToggleWishlist,
  cartProductIds = [],
  onRemoveFromCart
}) => {
  const isDark = theme === 'rustic-dark';
  const [activeSlot, setActiveSlot] = useState<'left' | 'center' | 'right'>('center');
  const [viewMode, setViewMode] = useState<'walkthrough' | 'gallery'>('walkthrough');
  const [roomLighting, setRoomLighting] = useState<'bright' | 'studio' | 'mood'>('studio');
  const [addedId, setAddedId] = useState<string | null>(null);

  // Door entrance portal state: simulates sliding glass elevator/chamber doors opening on arrival
  const [doorState, setDoorState] = useState<'closed' | 'opening' | 'open'>('closed');

  useEffect(() => {
    if (!floor) return;
    setDoorState('closed');
    const openTimer = setTimeout(() => {
      setDoorState('opening');
    }, 60);

    const completeTimer = setTimeout(() => {
      setDoorState('open');
    }, 850);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(completeTimer);
    };
  }, [floor?.number]);

  useEffect(() => {
    if (initialSlot) {
      setActiveSlot(initialSlot);
    } else {
      setActiveSlot('center');
    }
  }, [floor, initialSlot]);

  if (!floor) return null;

  const currentItem = floor.items.find((i) => i.slot === activeSlot) || floor.items[0];
  const currentProduct = currentItem?.productId
    ? PRODUCTS_DATA.find((p) => p.id === currentItem.productId)
    : null;

  const isInCart = currentProduct ? cartProductIds.includes(currentProduct.id) : false;

  const handleNextChamber = () => {
    if (activeSlot === 'left') setActiveSlot('center');
    else if (activeSlot === 'center') setActiveSlot('right');
    else setActiveSlot('left');
  };

  const handlePrevChamber = () => {
    if (activeSlot === 'right') setActiveSlot('center');
    else if (activeSlot === 'center') setActiveSlot('left');
    else setActiveSlot('right');
  };

  const handleElevatorFloor = (targetFloorNum: number) => {
    const targetFloor = FLOORS_DATA.find((f) => f.numeric === targetFloorNum);
    if (targetFloor && onSwitchFloor) {
      onSwitchFloor(targetFloor);
    }
  };

  const handleQuickAdd = (product: Product) => {
    if (onQuickAdd) {
      onQuickAdd(product);
      setAddedId(product.id);
      setTimeout(() => setAddedId(null), 1500);
    }
  };

  // Lighting multipliers for the room atmosphere
  const lightOpacity =
    roomLighting === 'bright' ? 0.9 : roomLighting === 'studio' ? 0.5 : 0.2;

  // Custom architectural flooring definition per level
  const floorFinishes: Record<number, { name: string; texture: string; border: string }> = {
    5: {
      name: 'Polished Nordic Birch Plywood with Aluminium Joints',
      texture: 'linear-gradient(to right, rgba(230,210,180,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(230,210,180,0.04) 1px, transparent 1px)',
      border: '#3b82f6'
    },
    4: {
      name: 'Chevron Smoked Walnut Parquet Planking',
      texture: 'linear-gradient(45deg, rgba(80,55,35,0.2) 25%, transparent 25%), linear-gradient(-45deg, rgba(80,55,35,0.2) 25%, transparent 25%)',
      border: '#10b981'
    },
    3: {
      name: 'Charcoal Shadowbox Pine Gallery Flooring',
      texture: 'linear-gradient(to right, rgba(0,0,0,0.4) 1px, transparent 1px)',
      border: '#f59e0b'
    },
    2: {
      name: 'Honed Industrial Architectural Slate Tiles',
      texture: 'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
      border: '#8b5cf6'
    },
    1: {
      name: 'Warm Hand-Oiled Teak Atelier Hardwood Floor',
      texture: 'linear-gradient(to bottom, rgba(140,80,30,0.15) 1px, transparent 1px)',
      border: '#d2f53a'
    }
  };

  const currentFinish = floorFinishes[floor.numeric] || floorFinishes[1];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-2 sm:p-4 lg:p-6 flex items-center justify-center select-none animate-fadeIn">
      {/* Blurred Architectural Glass Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-500"
      />

      <div
        className={`relative w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border my-auto transition-all duration-500 flex flex-col ${
          isDark
            ? 'bg-[#120c08] border-[#38281d] text-[#f7f2ea]'
            : 'bg-[#faf6f0] border-[#ded4c3] text-[#282019]'
        } ${doorState === 'closed' ? 'scale-95 opacity-90' : 'scale-100 opacity-100'}`}
        style={{
          boxShadow: isDark
            ? `0 25px 70px -15px ${floor.accentHex}25, 0 0 50px rgba(0,0,0,0.95)`
            : `0 25px 70px -15px ${floor.accentHex}20, 0 10px 40px rgba(0,0,0,0.15)`
        }}
      >
        {/* Double Motorized Sliding Elevator Doors Overlay (Simulates Entering the Floor) */}
        {doorState !== 'open' && (
          <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden flex">
            {/* Left Sliding Door */}
            <div
              className={`w-1/2 h-full flex flex-col justify-center items-end pr-6 sm:pr-10 border-r border-[#d2f53a]/30 shadow-2xl transition-transform duration-700 ease-out ${
                isDark
                  ? 'bg-gradient-to-r from-[#0d0906] to-[#1c140e] text-[#f5ede2]'
                  : 'bg-gradient-to-r from-[#f0e6d6] to-[#ded2bf] text-[#2c2016]'
              } ${doorState === 'opening' ? '-translate-x-full' : 'translate-x-0'}`}
              style={{
                backgroundImage:
                  'repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 24px)'
              }}
            >
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest opacity-80">
                <span className="w-2 h-2 rounded-full bg-[#d2f53a] animate-ping" />
                <span className="font-bold">ENTERING LEVEL 0{floor.number}</span>
              </div>
            </div>

            {/* Right Sliding Door */}
            <div
              className={`w-1/2 h-full flex flex-col justify-center items-start pl-6 sm:pr-10 border-l border-[#d2f53a]/30 shadow-2xl transition-transform duration-700 ease-out ${
                isDark
                  ? 'bg-gradient-to-l from-[#0d0906] to-[#1c140e] text-[#f5ede2]'
                  : 'bg-gradient-to-l from-[#f0e6d6] to-[#ded2bf] text-[#2c2016]'
              } ${doorState === 'opening' ? 'translate-x-full' : 'translate-x-0'}`}
              style={{
                backgroundImage:
                  'repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 24px)'
              }}
            >
              <span className="font-mono text-xs uppercase tracking-widest font-black text-[#d2f53a]">
                DOORS OPENING...
              </span>
            </div>
          </div>
        )}

        {/* Top Atelier Bar: Floor Level Title, Elevator Buttons & Exit */}
        <div
          className={`px-4 sm:px-6 py-3 sm:py-3.5 flex flex-wrap items-center justify-between gap-3 border-b relative z-30 transition-colors ${
            isDark ? 'bg-[#18110b] border-[#2d1e14]' : 'bg-[#f4ebe0] border-[#e2d5c3]'
          }`}
        >
          {/* Floor Header Badge */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex flex-col items-center justify-center font-mono font-black border shadow-md shrink-0"
              style={{
                backgroundColor: `${floor.accentHex}20`,
                borderColor: `${floor.accentHex}50`,
                color: floor.accentHex
              }}
            >
              <span className="text-[8px] uppercase tracking-wider opacity-75">LEVEL</span>
              <span className="text-base sm:text-lg font-black leading-none">{floor.number}</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#a89685]">
                  INSIDE LEVEL 0{floor.number}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest hidden sm:inline">
                  WALKTHROUGH ACTIVE
                </span>
              </div>
              <h3
                className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <span>{floor.name}</span>
                <span
                  className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${floor.accentHex}25`,
                    color: floor.accentHex
                  }}
                >
                  {floor.tagline}
                </span>
              </h3>
            </div>
          </div>

          {/* Center/Right: Elevator Panel to jump floors without exiting */}
          <div className="flex items-center gap-2">
            <div
              className={`hidden md:flex items-center gap-1 px-2.5 py-1 rounded-xl border ${
                isDark ? 'bg-[#0f0a07] border-[#291b12]' : 'bg-white/80 border-[#ded3c2]'
              }`}
              title="Atelier Elevator - Ride between levels"
            >
              <span className="text-[9px] font-mono font-bold uppercase text-[#8c7b6d] pr-1">
                ELEVATOR:
              </span>
              {[5, 4, 3, 2, 1].map((fNum) => {
                const isActive = floor.numeric === fNum;
                return (
                  <button
                    key={fNum}
                    onClick={() => handleElevatorFloor(fNum)}
                    className={`w-6 h-6 rounded-md text-[10px] font-mono font-black transition-all cursor-pointer ${
                      isActive
                        ? isDark
                          ? 'bg-[#d2f53a] text-black shadow-[0_0_10px_rgba(210,245,58,0.4)]'
                          : 'bg-[#c35626] text-white shadow-sm'
                        : isDark
                        ? 'text-[#9c8979] hover:bg-white/10 hover:text-white'
                        : 'text-[#69584b] hover:bg-black/5 hover:text-black'
                    }`}
                  >
                    0{fNum}
                  </button>
                );
              })}
            </div>

            {/* View Mode Toggle: Single Walkthrough vs Wide 3-Chamber Gallery */}
            <div
              className={`flex items-center rounded-lg p-0.5 border text-xs font-mono ${
                isDark ? 'bg-[#0f0a07] border-[#291b12]' : 'bg-white/80 border-[#ded3c2]'
              }`}
            >
              <button
                onClick={() => setViewMode('walkthrough')}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all cursor-pointer ${
                  viewMode === 'walkthrough'
                    ? isDark
                      ? 'bg-[#d2f53a] text-black shadow-xs'
                      : 'bg-[#c35626] text-white shadow-xs'
                    : 'text-[#8c7b6d] hover:text-white'
                }`}
              >
                Chambers
              </button>
              <button
                onClick={() => setViewMode('gallery')}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all cursor-pointer ${
                  viewMode === 'gallery'
                    ? isDark
                      ? 'bg-[#d2f53a] text-black shadow-xs'
                      : 'bg-[#c35626] text-white shadow-xs'
                    : 'text-[#8c7b6d] hover:text-white'
                }`}
              >
                All 3 Bays
              </button>
            </div>

            {/* Exit to Exterior Building Button */}
            <button
              onClick={onClose}
              className={`px-2.5 py-1.5 rounded-xl transition-all cursor-pointer border flex items-center gap-1.5 text-xs font-mono font-bold ${
                isDark
                  ? 'bg-[#221811] hover:bg-[#302118] border-[#3d2c1f] text-[#cfbfaf] hover:text-white'
                  : 'bg-white hover:bg-[#ede3d3] border-[#ded4c3] text-[#45372d]'
              }`}
              title="Step outside to view the full building (Esc)"
              aria-label="Exit Floor"
            >
              <Building className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Exit to Building</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Ambient Room Ceiling Lighting Controls Bar */}
        <div
          className={`px-4 sm:px-6 py-2 flex items-center justify-between text-xs font-mono border-b ${
            isDark ? 'bg-[#140e09] border-[#271a10] text-[#8c7a6b]' : 'bg-[#faf4ec] border-[#ebe0cf] text-[#786452]'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-[#d2f53a]" />
            <span className="text-[10px] uppercase font-bold tracking-wider">
              GALLERY SPOTLIGHTS:
            </span>
            <div className="flex items-center gap-1 ml-1">
              {(['bright', 'studio', 'mood'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setRoomLighting(mode)}
                  className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase transition-all cursor-pointer ${
                    roomLighting === mode
                      ? isDark
                        ? 'bg-white/20 text-[#d2f53a] border border-[#d2f53a]/40 shadow-xs'
                        : 'bg-[#c35626]/15 text-[#c35626] border border-[#c35626]/40'
                      : 'opacity-50 hover:opacity-90'
                  }`}
                >
                  {mode === 'bright' ? 'Daylight 100%' : mode === 'studio' ? 'Spotlight 60%' : 'Ambient 20%'}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[10px]">
            <MapPin className="w-3 h-3 text-[#d2f53a]" />
            <span>HYDERABAD FLAGSHIP ATELIER • LEVEL 0{floor.number}</span>
          </div>
        </div>

        {/* Main Floor Interior Presentation */}
        {viewMode === 'walkthrough' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px] sm:min-h-[480px]">
            {/* Left 7 Cols: Spatial Chamber Stage with 3D physical depth */}
            <div
              className={`lg:col-span-7 relative flex flex-col items-center justify-center p-6 sm:p-10 border-b lg:border-b-0 lg:border-r overflow-hidden transition-colors ${
                isDark ? 'bg-[#0a0705] border-[#2d1e14]' : 'bg-[#f5ede2] border-[#e2d5c3]'
              }`}
            >
              {/* Overhead Gallery Track Lights Beam Effect */}
              <div
                className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full pointer-events-none blur-[65px] transition-all duration-700"
                style={{
                  backgroundColor: floor.accentHex,
                  opacity: lightOpacity * 0.4
                }}
              />

              {/* Ceiling beam structure lines */}
              <div className="absolute top-0 inset-x-0 h-6 border-b border-white/5 flex justify-around pointer-events-none opacity-30">
                <span className="w-1 h-3 bg-white/20" />
                <span className="w-1 h-3 bg-white/20" />
                <span className="w-1 h-3 bg-white/20" />
              </div>

              {/* Chamber Navigation Arrows (Walk between left, center, right bays) */}
              <button
                onClick={handlePrevChamber}
                className={`absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full flex items-center justify-center border shadow-xl transition-all cursor-pointer ${
                  isDark
                    ? 'bg-[#18110b]/90 hover:bg-[#251a12] border-[#38281d] text-white hover:scale-105'
                    : 'bg-white/90 hover:bg-[#faf4ec] border-[#ded4c3] text-[#282019] hover:scale-105'
                }`}
                title="Walk to previous chamber"
                aria-label="Previous Chamber"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNextChamber}
                className={`absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full flex items-center justify-center border shadow-xl transition-all cursor-pointer ${
                  isDark
                    ? 'bg-[#18110b]/90 hover:bg-[#251a12] border-[#38281d] text-white hover:scale-105'
                    : 'bg-white/90 hover:bg-[#faf4ec] border-[#ded4c3] text-[#282019] hover:scale-105'
                }`}
                title="Walk to next chamber"
                aria-label="Next Chamber"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Product Artwork on Spatial Pedestal */}
              <div className="relative z-10 w-full max-w-xs sm:max-w-sm flex flex-col items-center">
                <div
                  className="w-full aspect-square rounded-2xl overflow-hidden border shadow-2xl relative flex items-center justify-center transition-all duration-500 group"
                  style={{
                    backgroundColor: isDark ? '#080503' : '#ede2d3',
                    borderColor: `${floor.accentHex}40`
                  }}
                >
                  {currentProduct && (
                    <ProductArtwork
                      productId={currentProduct.id}
                      aspectRatio="square"
                      theme={theme}
                      showGlow={true}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                  )}

                  {/* Chamber Location Ribbon */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase backdrop-blur-md border shadow-md bg-black/60 text-white border-white/10">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: floor.accentHex }}
                    />
                    <span>BAY {activeSlot.toUpperCase()} · FLR 0{floor.number}</span>
                  </div>
                </div>

                {/* Pedestal Base Display */}
                <div
                  className="w-48 h-3 rounded-full mt-3 blur-[2px] transition-all"
                  style={{
                    backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.15)',
                    boxShadow: `0 0 25px ${floor.accentHex}30`
                  }}
                />
              </div>

              {/* Physical Floorboard Runner Trim along bottom */}
              <div
                className="absolute bottom-0 inset-x-0 h-7 border-t flex items-center justify-between px-4 text-[9px] font-mono uppercase opacity-75 pointer-events-none"
                style={{
                  backgroundColor: isDark ? '#140e0a' : '#eae0d2',
                  borderColor: isDark ? '#261b12' : '#ded1c0',
                  backgroundImage: currentFinish.texture
                }}
              >
                <span className="truncate">FLOORING: {currentFinish.name}</span>
                <span className="shrink-0">ATELIER GRID SPEC 0{floor.number}</span>
              </div>
            </div>

            {/* Right 5 Cols: Product Details & Cart Actions */}
            <div
              className={`lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 transition-colors ${
                isDark ? 'bg-[#150e09]' : 'bg-[#faf6f0]'
              }`}
            >
              {currentProduct ? (
                <>
                  <div className="space-y-4">
                    {/* Chamber indicator */}
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[10px] font-mono font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${floor.accentHex}20`,
                          color: floor.accentHex
                        }}
                      >
                        CHAMBER: {activeSlot.toUpperCase()} BAY
                      </span>

                      {onToggleWishlist && (
                        <button
                          onClick={() => onToggleWishlist(currentProduct.id)}
                          className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                            wishlistIds.includes(currentProduct.id)
                              ? 'bg-rose-500/20 text-rose-500 border-rose-500/40'
                              : isDark
                              ? 'bg-[#1e150f] text-[#8c7b6d] border-[#382b20] hover:text-white'
                              : 'bg-white text-[#7d6c5d] border-[#ded4c3] hover:text-black'
                          }`}
                          title="Save to Wishlist"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              wishlistIds.includes(currentProduct.id) ? 'fill-current' : ''
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    <div>
                      <h4
                        className="text-xl sm:text-2xl font-black tracking-tight leading-tight"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {currentProduct.name}
                      </h4>
                      <p
                        className={`text-xs mt-1 leading-relaxed ${
                          isDark ? 'text-[#a89685]' : 'text-[#69584b]'
                        }`}
                      >
                        {currentProduct.description}
                      </p>
                    </div>

                    {/* Price and Material Specifications */}
                    <div
                      className={`p-3.5 rounded-xl border space-y-2 text-xs font-mono ${
                        isDark ? 'bg-[#1c140d] border-[#312317]' : 'bg-white border-[#ded4c3] shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[#8c7b6d]">PRICE (INCL. GST):</span>
                        <span
                          className={`text-base font-black ${
                            isDark ? 'text-[#d2f53a]' : 'text-[#c35626]'
                          }`}
                        >
                          ₹{currentProduct.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#8c7b6d]">PRIMARY TIMBER:</span>
                        <span className="font-bold">{currentProduct.materials?.[0] || 'Seasoned Timber'}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#8c7b6d]">CATEGORY:</span>
                        <span className="font-bold uppercase">{currentProduct.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Add to Trolley & Remove from Trolley */}
                  <div className="space-y-2.5 pt-6">
                    <div className="flex flex-col sm:flex-row items-stretch gap-2">
                      {/* Add to Trolley CTA */}
                      <button
                        onClick={() => handleQuickAdd(currentProduct)}
                        className={`flex-1 py-3 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 ${
                          addedId === currentProduct.id
                            ? 'bg-emerald-500 text-black shadow-emerald-500/40'
                            : isDark
                            ? 'bg-[#d2f53a] hover:bg-[#bce82e] text-black shadow-[0_0_20px_rgba(210,245,58,0.3)]'
                            : 'bg-[#c35626] hover:bg-[#a64319] text-white shadow-md'
                        }`}
                      >
                        {addedId === currentProduct.id ? (
                          <>
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>Added to Trolley!</span>
                          </>
                        ) : isInCart ? (
                          <>
                            <ShoppingBag className="w-4 h-4" />
                            <span>Add Another (+1)</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4" />
                            <span>Add to Trolley • ₹{currentProduct.price.toLocaleString('en-IN')}</span>
                          </>
                        )}
                      </button>

                      {/* Explicit Remove from Trolley button if in cart */}
                      {isInCart && onRemoveFromCart && (
                        <button
                          onClick={() => onRemoveFromCart(currentProduct.id)}
                          className="py-3 px-4 rounded-xl border text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border-rose-500/30"
                          title="Remove item from your trolley"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Inspect Specs */}
                      <button
                        onClick={() => {
                          onClose();
                          onSelectProduct(currentProduct);
                        }}
                        className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          isDark
                            ? 'bg-[#18110b] hover:bg-[#251a12] border-[#3d2b1f] text-white'
                            : 'bg-white hover:bg-[#faf4ec] border-[#ded4c3] text-[#1c140e]'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Specs</span>
                      </button>

                      {/* Test in Dark Room */}
                      {onOpenVirtualDarkRoom && (
                        <button
                          onClick={() => {
                            onClose();
                            onOpenVirtualDarkRoom(currentProduct.id);
                          }}
                          className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            isDark
                              ? 'bg-[#18110b] hover:bg-[#251a12] border-[#3d2b1f] text-amber-400'
                              : 'bg-white hover:bg-[#faf4ec] border-[#ded4c3] text-amber-600'
                          }`}
                          title="Simulate lighting in Virtual Dark Room"
                        >
                          <Moon className="w-3.5 h-3.5" />
                          <span>Dark Room</span>
                        </button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center text-sm font-mono opacity-50">
                  Select a chamber to inspect its handcrafted piece.
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Wide 3-Chamber Gallery View */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#9c8979]">
                LEVEL {floor.number} · 3 INTEGRATED CHAMBERS
              </span>
              <h4
                className="text-xl font-bold tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Explore Every Creation on This Level
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {floor.items.map((item) => {
                const product = item.productId
                  ? PRODUCTS_DATA.find((p) => p.id === item.productId)
                  : null;
                const itemInCart = product ? cartProductIds.includes(product.id) : false;

                return (
                  <div
                    key={item.slot}
                    onClick={() => {
                      setActiveSlot(item.slot);
                      setViewMode('walkthrough');
                    }}
                    className={`group flex flex-col p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                      isDark
                        ? 'bg-[#18110c] hover:bg-[#221812] border-[#2f2016] hover:border-[#d2f53a]/50 shadow-lg'
                        : 'bg-white hover:bg-[#faf4ec] border-[#e2d5c3] hover:border-[#c35626]/50 shadow-xs'
                    }`}
                  >
                    {/* Chamber Slot Ribbon */}
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase mb-2 pb-2 border-b border-inherit">
                      <span className="font-bold flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: floor.accentHex }}
                        />
                        <span>BAY {item.slot.toUpperCase()}</span>
                      </span>
                      <span className="text-[#9c8979]">FLR 0{floor.number}</span>
                    </div>

                    {/* Artwork Container */}
                    <div
                      className={`w-full aspect-square rounded-xl overflow-hidden flex items-center justify-center mb-3 border relative ${
                        isDark ? 'bg-[#0a0705] border-[#221912]' : 'bg-[#f4eae0] border-[#ded1be]'
                      }`}
                    >
                      {product && (
                        <ProductArtwork
                          productId={product.id}
                          aspectRatio="square"
                          theme={theme}
                          showGlow={false}
                          className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                    </div>

                    {/* Item info */}
                    {product && (
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <span
                            className="text-[9px] font-mono font-bold uppercase tracking-wider block mb-1"
                            style={{ color: floor.accentHex }}
                          >
                            {product.shortTag}
                          </span>
                          <h5 className="font-black text-sm group-hover:underline">
                            {product.name}
                          </h5>
                          <p
                            className={`text-[11px] line-clamp-2 mt-1 leading-snug ${
                              isDark ? 'text-[#b09e8e]' : 'text-[#69584b]'
                            }`}
                          >
                            {product.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-inherit">
                          <span
                            className={`font-mono font-black text-sm ${
                              isDark ? 'text-[#d2f53a]' : 'text-[#c35626]'
                            }`}
                          >
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>

                          <div className="flex items-center gap-2">
                            {itemInCart && onRemoveFromCart && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRemoveFromCart(product.id);
                                }}
                                className="p-1 rounded text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                                title="Remove from trolley"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <span className="text-[10px] font-mono font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                              <span>Step Inside</span>
                              <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Chamber Switcher Bar: Quick-switch between Bays in walkthrough mode */}
        {viewMode === 'walkthrough' && (
          <div
            className={`px-5 py-3 border-t flex flex-wrap items-center justify-between gap-3 ${
              isDark ? 'bg-[#150e09] border-[#271a10]' : 'bg-[#f4eee6] border-[#e2d5c3]'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#9c8979] mr-2">
                STEP INTO BAY:
              </span>
              {(['left', 'center', 'right'] as const).map((slot) => {
                const item = floor.items.find((i) => i.slot === slot);
                const isSelected = activeSlot === slot;
                return (
                  <button
                    key={slot}
                    onClick={() => setActiveSlot(slot)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 border ${
                      isSelected
                        ? isDark
                          ? 'bg-[#d2f53a] text-black border-[#d2f53a] shadow-md font-black'
                          : 'bg-[#c35626] text-white border-[#c35626] shadow-sm font-black'
                        : isDark
                        ? 'bg-[#1a130e] hover:bg-[#251b14] border-[#382b20] text-[#cfbfaf]'
                        : 'bg-white hover:bg-[#faf4ec] border-[#ded4c3] text-[#3d3126]'
                    }`}
                  >
                    <span>Bay {slot}</span>
                    {item && <span className="opacity-70 text-[10px]">· {item.title}</span>}
                  </button>
                );
              })}
            </div>

            <div className="text-[10px] font-mono text-[#8c7b6d] flex items-center gap-3">
              <span>Use ← → keys to walk chambers</span>
              <span>•</span>
              <span>ESC to exit floor</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
