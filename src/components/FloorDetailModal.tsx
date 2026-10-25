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
  Sun,
  Lightbulb,
  Check,
  Heart,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Layers,
  Box,
  MapPin
} from 'lucide-react';
import { FloorInfo, Product, ThemeMode } from '../types';
import { PRODUCTS_DATA, FLOORS_DATA } from '../data/products';
import { ProductArtwork } from './ProductArtwork';
import { sound } from '../utils/audio';

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
  onToggleWishlist
}) => {
  const isDark = theme === 'rustic-dark';
  const [activeSlot, setActiveSlot] = useState<'left' | 'center' | 'right'>('center');
  const [viewMode, setViewMode] = useState<'walkthrough' | 'gallery'>('walkthrough');
  const [roomLighting, setRoomLighting] = useState<'bright' | 'studio' | 'mood'>('studio');
  const [addedId, setAddedId] = useState<string | null>(null);

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

  const handleNextChamber = () => {
    sound.playClick();
    if (activeSlot === 'left') setActiveSlot('center');
    else if (activeSlot === 'center') setActiveSlot('right');
    else setActiveSlot('left');
  };

  const handlePrevChamber = () => {
    sound.playClick();
    if (activeSlot === 'right') setActiveSlot('center');
    else if (activeSlot === 'center') setActiveSlot('left');
    else setActiveSlot('right');
  };

  const handleElevatorFloor = (targetFloorNum: number) => {
    sound.playChime();
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
    roomLighting === 'bright' ? 0.85 : roomLighting === 'studio' ? 0.45 : 0.15;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-2 sm:p-4 lg:p-6 flex items-center justify-center select-none animate-fadeIn">
      {/* Blurred Architectural Glass Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-500"
      />

      <div
        className={`relative w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border my-auto transition-all duration-300 flex flex-col ${
          isDark
            ? 'bg-[#120c08] border-[#38281d] text-[#f7f2ea]'
            : 'bg-[#faf6f0] border-[#ded4c3] text-[#282019]'
        }`}
        style={{
          boxShadow: isDark
            ? `0 25px 70px -15px ${floor.accentHex}20, 0 0 50px rgba(0,0,0,0.9)`
            : `0 25px 70px -15px ${floor.accentHex}15, 0 10px 40px rgba(0,0,0,0.15)`
        }}
      >
        {/* Top Atelier Bar: Floor Level Title, Elevator Buttons & Close */}
        <div
          className={`px-5 py-3.5 sm:px-6 sm:py-4 flex flex-wrap items-center justify-between gap-3 border-b relative z-30 transition-colors ${
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
                  INTERIOR ATELIER
                </span>
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest hidden sm:inline">
                  INSIDE CHAMBERS
                </span>
              </div>
              <h3
                className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2"
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
              className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl border ${
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
                onClick={() => {
                  sound.playClick();
                  setViewMode('walkthrough');
                }}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all cursor-pointer ${
                  viewMode === 'walkthrough'
                    ? isDark
                      ? 'bg-[#d2f53a] text-black shadow-xs'
                      : 'bg-[#c35626] text-white shadow-xs'
                    : 'text-[#8c7b6d] hover:text-white'
                }`}
              >
                Walkthrough
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setViewMode('gallery');
                }}
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

            {/* Close Button */}
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors cursor-pointer border ${
                isDark
                  ? 'bg-[#221811] hover:bg-[#302118] border-[#3d2c1f] text-[#cfbfaf] hover:text-white'
                  : 'bg-white hover:bg-[#ede3d3] border-[#ded4c3] text-[#45372d]'
              }`}
              title="Step outside building (Esc)"
              aria-label="Exit Floor"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ambient Room Ceiling Lighting Controls Bar */}
        <div
          className={`px-6 py-2 flex items-center justify-between text-xs font-mono border-b ${
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
                  onClick={() => {
                    sound.playClick();
                    setRoomLighting(mode);
                  }}
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

          <div className="hidden md:flex items-center gap-2 text-[10px] text-[#9c8979]">
            <MapPin className="w-3 h-3 text-[#d2f53a]" />
            <span>Hyderabad Atelier · 5-Story Glass House</span>
          </div>
        </div>

        {/* Dynamic Architectural Floor Interior Stage */}
        {viewMode === 'walkthrough' ? (
          /* Single Chamber Walkthrough: Feel standing in front of the piece in the room */
          <div className="relative p-5 sm:p-8 flex flex-col lg:flex-row items-center gap-6 lg:gap-10 overflow-hidden min-h-[460px]">
            {/* Background Floor & Wall Optical Atmosphere */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-700"
              style={{
                background: isDark
                  ? `radial-gradient(ellipse at 50% 30%, ${floor.accentHex}15 0%, #120c08 70%)`
                  : `radial-gradient(ellipse at 50% 30%, ${floor.accentHex}10 0%, #faf6f0 70%)`,
                opacity: 0.9
              }}
            />

            {/* Ceiling Spotlight Cone projecting down */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 pointer-events-none transition-opacity duration-500 rounded-full blur-[70px]"
              style={{
                background: isDark
                  ? `radial-gradient(circle, ${floor.accentHex}35 0%, transparent 70%)`
                  : 'radial-gradient(circle, rgba(255,230,190,0.5) 0%, transparent 70%)',
                opacity: lightOpacity
              }}
            />

            {/* Left Column: Visual Exhibition Pedestal */}
            <div className="relative w-full lg:w-1/2 flex flex-col items-center justify-center">
              {/* Chamber Navigation Chevrons */}
              <button
                onClick={handlePrevChamber}
                className={`absolute left-0 z-20 p-2.5 rounded-full border shadow-xl transition-all cursor-pointer ${
                  isDark
                    ? 'bg-black/70 hover:bg-black border-white/20 text-white hover:scale-110'
                    : 'bg-white/85 hover:bg-white border-[#ded4c3] text-black hover:scale-110'
                }`}
                title="Step to previous chamber (←)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNextChamber}
                className={`absolute right-0 z-20 p-2.5 rounded-full border shadow-xl transition-all cursor-pointer ${
                  isDark
                    ? 'bg-black/70 hover:bg-black border-white/20 text-white hover:scale-110'
                    : 'bg-white/85 hover:bg-white border-[#ded4c3] text-black hover:scale-110'
                }`}
                title="Step to next chamber (→)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* The Pedestal Display Box */}
              <div className="relative w-full max-w-[340px] aspect-square rounded-2xl p-4 flex items-center justify-center transition-all duration-300">
                {/* Plinth Shadow & Light Halo */}
                <div
                  className="absolute -bottom-4 w-64 h-8 rounded-full blur-[14px] pointer-events-none"
                  style={{
                    backgroundColor: isDark ? 'rgba(0,0,0,0.95)' : 'rgba(0,0,0,0.25)',
                    transform: 'scale(1.1)'
                  }}
                />

                {currentProduct && (
                  <div className="relative w-full h-full rounded-xl overflow-hidden border shadow-2xl transition-all duration-300">
                    <ProductArtwork
                      productId={currentProduct.id}
                      aspectRatio="square"
                      theme={theme}
                      showGlow={true}
                      className="w-full h-full"
                    />

                    {/* Wishlist Button on artwork */}
                    {onToggleWishlist && (
                      <button
                        onClick={() => onToggleWishlist(currentProduct.id)}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                          wishlistIds.includes(currentProduct.id)
                            ? isDark
                              ? 'bg-[#d2f53a] text-black'
                              : 'bg-[#c35626] text-white'
                            : 'bg-black/50 text-white hover:bg-black/80'
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
                )}
              </div>

              {/* Floor Pedestal Base Label */}
              <div
                className={`mt-4 px-3.5 py-1.5 rounded-full text-[10px] font-mono tracking-widest uppercase border flex items-center gap-2 ${
                  isDark ? 'bg-[#18110b] border-[#332317] text-[#c9b9a8]' : 'bg-[#eee4d6] border-[#dac9b4] text-[#5e4b3c]'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: floor.accentHex }} />
                <span>CHAMBER {activeSlot.toUpperCase()} · EXHIBIT BAY</span>
              </div>
            </div>

            {/* Right Column: Piece Specifications, Craftsmanship & Quick Actions */}
            <div className="relative w-full lg:w-1/2 flex flex-col justify-between space-y-4">
              {currentProduct ? (
                <>
                  <div>
                    {/* Eyebrow & Badge */}
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider"
                        style={{
                          backgroundColor: `${floor.accentHex}20`,
                          color: floor.accentHex
                        }}
                      >
                        {currentProduct.shortTag || currentProduct.category}
                      </span>
                      {currentProduct.badge && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                          {currentProduct.badge}
                        </span>
                      )}
                    </div>

                    {/* Product Name */}
                    <h2
                      className="text-2xl sm:text-3xl font-black tracking-tight"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {currentProduct.name}
                    </h2>

                    {/* Price and Stock */}
                    <div className="flex items-baseline gap-3 mt-2">
                      <span
                        className={`text-2xl sm:text-3xl font-black font-mono ${
                          isDark ? 'text-[#d2f53a]' : 'text-[#c35626]'
                        }`}
                      >
                        ₹{currentProduct.price.toLocaleString('en-IN')}
                      </span>
                      {currentProduct.originalPrice && (
                        <span className="text-sm line-through opacity-50 font-mono">
                          ₹{currentProduct.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                      <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold ml-2">
                        ✦ In Stock · Hyderabad Workshop
                      </span>
                    </div>

                    {/* Description */}
                    <p
                      className={`text-xs sm:text-sm mt-3 leading-relaxed ${
                        isDark ? 'text-[#c2b09e]' : 'text-[#615042]'
                      }`}
                    >
                      {currentProduct.description}
                    </p>
                  </div>

                  {/* Curated Specifications Grid */}
                  <div
                    className={`p-3.5 rounded-xl border grid grid-cols-2 gap-3 text-xs font-mono ${
                      isDark ? 'bg-[#18110b] border-[#2b1e15]' : 'bg-[#f4eae0] border-[#ded1be]'
                    }`}
                  >
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-[#8c7b6d] block mb-0.5">
                        DIMENSIONS:
                      </span>
                      <span className="font-bold text-[11px]">{currentProduct.dimensions}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-[#8c7b6d] block mb-0.5">
                        POWER SOURCE:
                      </span>
                      <span className="font-bold text-[11px]">
                        {currentProduct.powerSource || 'Passive Mechanical'}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[9px] uppercase tracking-wider text-[#8c7b6d] block mb-0.5">
                        ARCHITECTURAL MATERIALS:
                      </span>
                      <span className="text-[10.5px] leading-tight block">
                        {currentProduct.materials.join(' · ')}
                      </span>
                    </div>
                  </div>

                  {/* Interactive Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                    {/* Add to Trolley Button */}
                    <button
                      onClick={() => handleQuickAdd(currentProduct)}
                      className={`w-full sm:flex-1 py-3 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 ${
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
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add to Trolley • ₹{currentProduct.price.toLocaleString('en-IN')}</span>
                        </>
                      )}
                    </button>

                    {/* Inspect Full Specs Button */}
                    <button
                      onClick={() => {
                        onClose();
                        onSelectProduct(currentProduct);
                      }}
                      className={`w-full sm:w-auto py-3 px-4 rounded-xl border text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        isDark
                          ? 'bg-[#18110b] hover:bg-[#251a12] border-[#3d2b1f] text-white'
                          : 'bg-white hover:bg-[#faf4ec] border-[#ded4c3] text-[#1c140e]'
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                      <span>Deep Specs</span>
                    </button>

                    {/* Test in Dark Room Button */}
                    {onOpenVirtualDarkRoom && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenVirtualDarkRoom(currentProduct.id);
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer shrink-0 ${
                          isDark
                            ? 'bg-[#18110b] hover:bg-[#251a12] border-[#3d2b1f] text-amber-400'
                            : 'bg-white hover:bg-[#faf4ec] border-[#ded4c3] text-amber-600'
                        }`}
                        title="Simulate lighting in Virtual Dark Room"
                      >
                        <Moon className="w-4 h-4" />
                      </button>
                    )}
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
          /* Wide 3-Chamber Gallery View: Inspect all 3 rooms side-by-side */
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

                          <span className="text-[10px] font-mono font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            <span>Step Inside</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
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
                    onClick={() => {
                      sound.playClick();
                      setActiveSlot(slot);
                    }}
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
