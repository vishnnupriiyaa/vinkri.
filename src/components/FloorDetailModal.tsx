import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  Moon,
  Check,
  Heart,
  ChevronDown,
  Sliders,
  Trash2,
  Building,
  MapPin,
  Star,
  Award,
  Layers,
  ChevronRight,
  Info
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
  wishlistIds = [],
  onToggleWishlist,
  cartProductIds = [],
  onRemoveFromCart
}) => {
  const isDark = theme === 'rustic-dark';
  const [roomLighting, setRoomLighting] = useState<'bright' | 'studio' | 'mood'>('studio');
  const [addedId, setAddedId] = useState<string | null>(null);

  // Door entrance portal state: simulates sliding glass elevator/chamber doors opening on arrival
  const [doorState, setDoorState] = useState<'closed' | 'opening' | 'open'>('closed');

  // Dropdown state for remaining items
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRemainingId, setSelectedRemainingId] = useState<string | null>(null);
  const [showAllRemainingList, setShowAllRemainingList] = useState(false);

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

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!floor) return null;

  // Products belonging to this specific floor
  const floorProducts = PRODUCTS_DATA.filter((p) => p.floorNumber === floor.numeric);

  // Top 3 items in this category for the First Row
  const top3Products = floorProducts.slice(0, 3);

  // All remaining items listed below them in a dropdown
  const remainingProducts = floorProducts.slice(3);

  // Default selected remaining product
  const activeRemainingProduct =
    remainingProducts.find((p) => p.id === selectedRemainingId) ||
    remainingProducts[0] ||
    null;

  const handleElevatorFloor = (targetFloorNum: number) => {
    const targetFloor = FLOORS_DATA.find((f) => f.numeric === targetFloorNum);
    if (targetFloor && onSwitchFloor) {
      onSwitchFloor(targetFloor);
      setIsDropdownOpen(false);
      setSelectedRemainingId(null);
    }
  };

  const handleQuickAdd = (product: Product) => {
    if (onQuickAdd) {
      onQuickAdd(product);
      setAddedId(product.id);
      setTimeout(() => setAddedId(null), 1500);
    }
  };

  // Custom architectural flooring definition per level
  const floorFinishes: Record<number, { name: string; texture: string; border: string }> = {
    5: {
      name: 'Polished Nordic Birch with Aluminium Inlays',
      texture:
        'linear-gradient(to right, rgba(230,210,180,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(230,210,180,0.04) 1px, transparent 1px)',
      border: '#3b82f6'
    },
    4: {
      name: 'Smoked Walnut Parquet Planking',
      texture:
        'linear-gradient(45deg, rgba(80,55,35,0.2) 25%, transparent 25%), linear-gradient(-45deg, rgba(80,55,35,0.2) 25%, transparent 25%)',
      border: '#10b981'
    },
    3: {
      name: 'Terrazzo Marble with Brass Divider Grid',
      texture:
        'radial-gradient(circle, rgba(200,160,100,0.1) 10%, transparent 10%), radial-gradient(circle, rgba(100,80,60,0.15) 15%, transparent 15%)',
      border: '#f59e0b'
    },
    2: {
      name: 'Hand-cast Basalt Stone & Cast Concrete',
      texture:
        'linear-gradient(to right, rgba(0,0,0,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.15) 1px, transparent 1px)',
      border: '#f43f5e'
    },
    1: {
      name: 'Veined Spanish Travertine with Warm Underglow',
      texture:
        'linear-gradient(135deg, rgba(160,120,80,0.08) 25%, transparent 25%), linear-gradient(225deg, rgba(160,120,80,0.08) 25%, transparent 25%)',
      border: '#a855f7'
    }
  };

  const currentFinish = floorFinishes[floor.numeric] || floorFinishes[5];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      {/* Outer Atelier Chamber Container */}
      <div
        className={`relative w-full max-w-7xl max-h-[92vh] rounded-2xl md:rounded-3xl border shadow-[0_25px_70px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden transition-all duration-300 animate-virtual-walkin ${
          isDark
            ? 'bg-[#100b08] border-[#382619] text-[#f7f2ea]'
            : 'bg-[#faf6f0] border-[#ded4c3] text-[#282019]'
        }`}
      >
        {/* Door Opening Portal Animation: Simulates stepping out of the elevator into the floor */}
        {doorState !== 'open' && (
          <div className="absolute inset-0 z-50 pointer-events-none flex overflow-hidden">
            {/* Left Sliding Door */}
            <div
              className={`w-1/2 h-full flex flex-col justify-center items-end pr-6 sm:pr-10 border-r border-[#d2f53a]/30 shadow-2xl transition-transform duration-700 ease-out ${
                isDark
                  ? 'bg-gradient-to-r from-[#0d0906] to-[#1c140e] text-[#f5ede2]'
                  : 'bg-gradient-to-r from-[#f0e6d6] to-[#ded2bf] text-[#2c2016]'
              } ${doorState === 'opening' ? '-translate-x-full' : 'translate-x-0'}`}
            >
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#d2f53a]">
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
            >
              <span className="font-mono text-xs uppercase tracking-widest font-black text-[#d2f53a]">
                {floor.name}...
              </span>
            </div>
          </div>
        )}

        {/* Scrollable Container with Custom Styled Scrollbar */}
        <div
          className={`flex-1 flex flex-col overflow-y-auto max-h-[92vh] ${
            isDark ? 'vinkri-window-scrollbar' : 'vinkri-window-scrollbar-light'
          }`}
        >
          {/* 1. Floor Topbar: Back to Store Front, Floor Title, Level Number & Elevator Quick Jump */}
          <div
            id="floorTopbar"
            className={`sticky top-0 px-4 sm:px-8 py-3.5 sm:py-4 flex flex-wrap items-center justify-between gap-3 border-b z-30 transition-colors backdrop-blur-md ${
              isDark ? 'bg-[#18110b]/95 border-[#2d1e14]' : 'bg-[#f4ebe0]/95 border-[#e2d5c3]'
            }`}
          >
            {/* Back to Store Front Button */}
            <button
              id="backBtn"
              onClick={onClose}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer border flex items-center gap-2 text-xs sm:text-sm font-mono font-bold shadow-xs active:scale-95 ${
                isDark
                  ? 'bg-[#241a12] hover:bg-[#322318] border-[#3f2e21] text-[#f5ede2] hover:text-[#d2f53a] hover:border-[#d2f53a]/50'
                  : 'bg-white hover:bg-[#ede3d3] border-[#ded4c3] text-[#2c2016] hover:text-[#c35626] hover:border-[#c35626]/50'
              }`}
              title="Return to Building Front (Esc)"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-extrabold tracking-wide">Back to Store Front</span>
            </button>

            {/* Center Floor Title & Atelier Status */}
            <div id="floorTitle" className="flex flex-col items-center text-center">
              <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase text-[#a89685]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ATELIER FLOOR · HYDERABAD</span>
              </div>
              <h2
                className="text-lg sm:text-2xl font-black tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                LEVEL 0{floor.number} · {floor.name}
              </h2>
            </div>

            {/* Right: Elevator Quick Switcher & Close */}
            <div id="floorNo" className="flex items-center gap-2">
              {/* Quick Elevator Level Switcher */}
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
                            : 'bg-[#c35626] text-white shadow-xs'
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

              {/* Level Badge */}
              <div
                className="px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-mono font-black text-xs border shadow-xs"
                style={{
                  backgroundColor: `${floor.accentHex}20`,
                  borderColor: `${floor.accentHex}50`,
                  color: floor.accentHex
                }}
              >
                <span>LEVEL</span>
                <span>0{floor.number}</span>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className={`p-2 rounded-xl transition-all cursor-pointer border ${
                  isDark
                    ? 'bg-[#221811] hover:bg-[#302118] border-[#3d2c1f] text-[#cfbfaf] hover:text-white'
                    : 'bg-white hover:bg-[#ede3d3] border-[#ded4c3] text-[#45372d]'
                }`}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 2. Floor Atmosphere & Editorial Intro */}
          <div
            className={`px-4 sm:px-8 py-4 sm:py-5 border-b transition-colors ${
              isDark ? 'bg-[#150e09] border-[#291b12]' : 'bg-[#faf4ec] border-[#e8ded0]'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#a89685]">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: floor.accentHex }}
                  />
                  <span>INSIDE THE ATELIER</span>
                  <span>•</span>
                  <span style={{ color: floor.accentHex }} className="font-bold">
                    {floor.tagline}
                  </span>
                </div>
                <p
                  className={`text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed ${
                    isDark ? 'text-[#c7b7a6]' : 'text-[#69584b]'
                  }`}
                >
                  {floor.description} Handcrafted at our studio in Hyderabad.
                </p>
              </div>

              {/* Lighting & Flooring Details */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono ${
                    isDark ? 'bg-[#0f0a07] border-[#291b12]' : 'bg-white border-[#ded4c3]'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[10px] uppercase font-bold text-[#8c7b6d] pr-1">
                    LIGHTING:
                  </span>
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
                      {mode === 'bright' ? 'Daylight' : mode === 'studio' ? 'Spotlight' : 'Ambient'}
                    </button>
                  ))}
                </div>

                <div
                  className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-mono uppercase ${
                    isDark ? 'bg-[#0f0a07] border-[#291b12] text-[#8c7b6d]' : 'bg-white border-[#ded4c3] text-[#7d6c5d]'
                  }`}
                >
                  <Building className="w-3 h-3 text-[#d2f53a]" />
                  <span>FLOOR: {currentFinish.name.split(' ')[0]} {currentFinish.name.split(' ')[1]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. FIRST ROW: TOP 3 ITEMS IN THIS CATEGORY */}
          <div className="px-4 sm:px-8 py-6 sm:py-8 border-b">
            {/* First Row Section Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: floor.accentHex }}
                />
                <h3
                  className="text-base sm:text-lg font-black tracking-wider uppercase font-mono"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  TOP 3 CREATIONS ON THIS FLOOR
                </h3>
                <span
                  className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${floor.accentHex}20`,
                    color: floor.accentHex
                  }}
                >
                  FIRST ROW HIGHLIGHTS
                </span>
              </div>

              <span className="text-xs font-mono text-[#8c7b6d]">
                Category: <strong className="text-white/90">{floor.name}</strong>
              </span>
            </div>

            {/* Top 3 Items Responsive 3-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {top3Products.map((product, idx) => {
                const isInCart = cartProductIds.includes(product.id);
                const isJustAdded = addedId === product.id;
                const isWishlisted = wishlistIds.includes(product.id);

                const rankLabels = [
                  { label: '#01 TOP PICK', color: '#f59e0b' },
                  { label: '#02 SIGNATURE', color: '#3b82f6' },
                  { label: '#03 FEATURED', color: '#10b981' }
                ];
                const rank = rankLabels[idx] || { label: `#0${idx + 1} ATELIER`, color: floor.accentHex };

                return (
                  <div
                    key={product.id}
                    className={`group relative rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 shadow-lg ${
                      isDark
                        ? 'bg-[#150e09] hover:bg-[#1c140d] border-[#2f2015] hover:border-[#d2f53a]/60 shadow-[0_8px_25px_rgba(0,0,0,0.6)]'
                        : 'bg-white hover:bg-[#faf4ec] border-[#e2d5c3] hover:border-[#c35626]/60 shadow-[0_8px_25px_rgba(195,86,38,0.08)]'
                    }`}
                  >
                    {/* Top Row: Rank Badge & Wishlist Button */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md border"
                        style={{
                          backgroundColor: `${rank.color}18`,
                          borderColor: `${rank.color}45`,
                          color: rank.color
                        }}
                      >
                        {rank.label}
                      </span>

                      {onToggleWishlist && (
                        <button
                          onClick={() => onToggleWishlist(product.id)}
                          className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                            isWishlisted
                              ? 'bg-rose-500/20 text-rose-500 border-rose-500/40'
                              : isDark
                              ? 'bg-[#1e150f] text-[#8c7b6d] border-[#382b20] hover:text-white'
                              : 'bg-white text-[#7d6c5d] border-[#ded4c3] hover:text-black'
                          }`}
                          title="Save to Wishlist"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`}
                          />
                        </button>
                      )}
                    </div>

                    {/* Product Image Stage with Ambient Floor Glow */}
                    <div
                      onClick={() => onSelectProduct(product)}
                      className="relative w-full aspect-square rounded-xl overflow-hidden border cursor-pointer flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-[1.02]"
                      style={{
                        backgroundColor: isDark ? '#080503' : '#ede2d3',
                        borderColor: `${floor.accentHex}30`
                      }}
                      title="Click to view full product details"
                    >
                      <ProductArtwork
                        productId={product.id}
                        aspectRatio="square"
                        theme={theme}
                        showGlow={roomLighting !== 'bright'}
                        className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Floating Category Tag */}
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase backdrop-blur-md bg-black/60 text-white/90 border border-white/10">
                        {product.shortTag || product.category}
                      </div>

                      {/* Dark Room Quick Trigger Badge */}
                      {onOpenVirtualDarkRoom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenVirtualDarkRoom(product.id);
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-black text-amber-400 border border-white/15 backdrop-blur-md transition-all"
                          title="Inspect in 3D Dark Room"
                        >
                          <Moon className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Product Information */}
                    <div className="space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-1 text-[11px] font-mono text-[#8c7b6d]">
                          <span className="truncate">{product.dimensions}</span>
                          <span className="flex items-center gap-0.5 text-amber-500 shrink-0">
                            <Star className="w-3 h-3 fill-amber-500" />
                            <strong className="font-bold">{product.rating}</strong>
                          </span>
                        </div>

                        <h4
                          onClick={() => onSelectProduct(product)}
                          className="text-base sm:text-lg font-black tracking-tight mt-1 cursor-pointer hover:underline truncate"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {product.name}
                        </h4>

                        <p
                          className={`text-xs mt-1 line-clamp-2 leading-relaxed ${
                            isDark ? 'text-[#a89685]' : 'text-[#69584b]'
                          }`}
                        >
                          {product.description}
                        </p>
                      </div>

                      {/* Price Section */}
                      <div className="pt-2 border-t border-white/5 flex items-baseline justify-between">
                        <div className="flex items-baseline gap-2">
                          {product.originalPrice && (
                            <span className="text-xs line-through text-[#8c7b6d]">
                              ₹{product.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                          <span
                            className={`text-lg sm:text-xl font-black font-mono ${
                              isDark ? 'text-[#d2f53a]' : 'text-[#c35626]'
                            }`}
                          >
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <span className="text-[10px] font-mono text-[#8c7b6d]">INCL. GST</span>
                      </div>

                      {/* Action Buttons: Add to Trolley & Remove */}
                      <div className="pt-2 space-y-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuickAdd(product)}
                            className={`flex-1 py-2.5 px-3 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 ${
                              isJustAdded
                                ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                                : isDark
                                ? 'bg-[#d2f53a] hover:bg-[#bce427] text-black shadow-[0_0_15px_rgba(210,245,58,0.25)]'
                                : 'bg-[#c35626] hover:bg-[#a8471d] text-white shadow-xs'
                            }`}
                          >
                            {isJustAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                <span>Added!</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>{isInCart ? 'Add (+1)' : 'Add to Trolley'}</span>
                              </>
                            )}
                          </button>

                          {isInCart && onRemoveFromCart && (
                            <button
                              onClick={() => onRemoveFromCart(product.id)}
                              className="p-2.5 rounded-xl border border-rose-500/50 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-all cursor-pointer active:scale-95 shrink-0"
                              title="Remove item from trolley"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() => onSelectProduct(product)}
                          className={`w-full py-1.5 px-3 rounded-lg border text-[11px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            isDark
                              ? 'bg-[#1a120b] hover:bg-[#251b14] border-[#332316] text-[#b3a191] hover:text-white'
                              : 'bg-[#faf4ec] hover:bg-[#f2e7d7] border-[#ded4c3] text-[#4d3f32]'
                          }`}
                        >
                          <span>Full Specifications</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. ALL REMAINING ITEMS LISTED BELOW THEM IN A DROPDOWN */}
          <div className="px-4 sm:px-8 py-6 sm:py-8">
            <div className="max-w-4xl mx-auto">
              {/* Section Banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#d2f53a]" />
                  <h3
                    className="text-base sm:text-lg font-black tracking-wider uppercase font-mono"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    REMAINING ITEMS IN THIS CATEGORY
                  </h3>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {remainingProducts.length} items available
                  </span>
                </div>

                {remainingProducts.length > 0 && (
                  <button
                    onClick={() => setShowAllRemainingList(!showAllRemainingList)}
                    className="text-xs font-mono text-[#d2f53a] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>{showAllRemainingList ? 'Hide Expanded Grid' : 'Or view all as cards'}</span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-transform ${
                        showAllRemainingList ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                )}
              </div>

              {remainingProducts.length === 0 ? (
                <div
                  className={`p-6 rounded-2xl border text-center font-mono text-xs ${
                    isDark ? 'bg-[#150e09] border-[#291b12] text-[#8c7b6d]' : 'bg-[#faf6f0] border-[#ded4c3] text-[#7d6c5d]'
                  }`}
                >
                  <p>All highlight creations for Level 0{floor.number} are displayed in the top row.</p>
                  <p className="mt-1">Explore our full boutique catalog in the main floor archive below.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Interactive Dropdown Component */}
                  <div className="relative">
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#a89685] mb-2">
                      Select a product from the remaining collection:
                    </label>

                    {/* Dropdown Button Trigger */}
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`w-full p-3.5 sm:p-4 rounded-2xl border flex items-center justify-between gap-3 text-left transition-all cursor-pointer shadow-md ${
                        isDark
                          ? 'bg-[#1c140d] hover:bg-[#251b14] border-[#3d2a1b] text-white focus:border-[#d2f53a]'
                          : 'bg-white hover:bg-[#faf4ec] border-[#ded4c3] text-[#282019] focus:border-[#c35626]'
                      }`}
                      aria-expanded={isDropdownOpen}
                      aria-haspopup="listbox"
                    >
                      {activeRemainingProduct ? (
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-black/40 p-1 flex items-center justify-center">
                            <ProductArtwork
                              productId={activeRemainingProduct.id}
                              aspectRatio="square"
                              theme={theme}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="font-black text-sm sm:text-base truncate">
                              {activeRemainingProduct.name}
                            </p>
                            <div className="flex items-center gap-2 text-xs font-mono text-[#8c7b6d]">
                              <span>{activeRemainingProduct.shortTag || activeRemainingProduct.category}</span>
                              <span>•</span>
                              <span
                                className={`font-bold ${
                                  isDark ? 'text-[#d2f53a]' : 'text-[#c35626]'
                                }`}
                              >
                                ₹{activeRemainingProduct.price.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="font-mono text-xs text-[#8c7b6d]">
                          Choose a remaining product...
                        </span>
                      )}

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/30 border border-white/10 text-[#d2f53a] hidden sm:inline-block">
                          {remainingProducts.length} Options
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-200 ${
                            isDropdownOpen ? 'rotate-180 text-[#d2f53a]' : 'text-[#8c7b6d]'
                          }`}
                        />
                      </div>
                    </button>

                    {/* Dropdown Menu Popup */}
                    {isDropdownOpen && (
                      <div
                        className={`absolute top-full left-0 right-0 mt-2 rounded-2xl border shadow-2xl z-40 max-h-72 overflow-y-auto p-2 transition-all ${
                          isDark
                            ? 'bg-[#18110b] border-[#3f2b1d] text-white vinkri-window-scrollbar'
                            : 'bg-white border-[#ded4c3] text-[#282019] vinkri-window-scrollbar-light'
                        }`}
                        role="listbox"
                      >
                        {remainingProducts.map((p, pIdx) => {
                          const isSelected = activeRemainingProduct?.id === p.id;
                          const inCart = cartProductIds.includes(p.id);

                          return (
                            <div
                              key={p.id}
                              onClick={() => {
                                setSelectedRemainingId(p.id);
                                setIsDropdownOpen(false);
                              }}
                              className={`p-2.5 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-colors mb-1 ${
                                isSelected
                                  ? isDark
                                    ? 'bg-[#291b12] border border-[#d2f53a]/50 text-[#d2f53a]'
                                    : 'bg-[#faf4ec] border border-[#c35626]/50 text-[#c35626]'
                                  : isDark
                                  ? 'hover:bg-[#22160e]'
                                  : 'hover:bg-[#f7f0e6]'
                              }`}
                              role="option"
                              aria-selected={isSelected}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span className="font-mono text-xs text-[#8c7b6d] w-6 shrink-0">
                                  #{pIdx + 4}
                                </span>
                                <div className="w-8 h-8 rounded-md overflow-hidden bg-black/30 border border-white/10 p-0.5 shrink-0 flex items-center justify-center">
                                  <ProductArtwork
                                    productId={p.id}
                                    aspectRatio="square"
                                    theme={theme}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-xs sm:text-sm truncate">
                                    {p.name}
                                  </p>
                                  <span className="text-[10px] font-mono text-[#8c7b6d]">
                                    {p.dimensions}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                <span className="font-mono font-bold text-xs">
                                  ₹{p.price.toLocaleString('en-IN')}
                                </span>
                                {inCart && (
                                  <span className="text-[9px] font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                                    In Cart
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Showcase for the Item Selected from Dropdown */}
                  {activeRemainingProduct && (
                    <div
                      className={`p-5 sm:p-6 rounded-2xl border transition-all duration-300 shadow-xl ${
                        isDark
                          ? 'bg-[#150e09] border-[#2f2015]'
                          : 'bg-white border-[#e2d5c3]'
                      }`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        {/* Artwork Preview (5 cols) */}
                        <div className="md:col-span-5 flex flex-col items-center">
                          <div
                            onClick={() => onSelectProduct(activeRemainingProduct)}
                            className="relative w-full max-w-xs aspect-square rounded-2xl overflow-hidden border cursor-pointer flex items-center justify-center shadow-md group"
                            style={{
                              backgroundColor: isDark ? '#080503' : '#ede2d3',
                              borderColor: `${floor.accentHex}40`
                            }}
                            title="Click to view full specs"
                          >
                            <ProductArtwork
                              productId={activeRemainingProduct.id}
                              aspectRatio="square"
                              theme={theme}
                              showGlow={true}
                              className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                            />

                            <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase backdrop-blur-md bg-black/70 text-white border border-white/10">
                              Selected from Dropdown
                            </div>

                            {onOpenVirtualDarkRoom && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenVirtualDarkRoom(activeRemainingProduct.id);
                                }}
                                className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/70 hover:bg-black text-amber-400 border border-white/15 backdrop-blur-md transition-all"
                                title="Inspect in Dark Room"
                              >
                                <Moon className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Details & Actions (7 cols) */}
                        <div className="md:col-span-7 space-y-4">
                          <div>
                            <div className="flex items-center gap-2 text-[11px] font-mono text-[#8c7b6d]">
                              <span>LEVEL 0{floor.number} ARCHIVE</span>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-amber-500">
                                <Star className="w-3 h-3 fill-amber-500" />
                                <strong>{activeRemainingProduct.rating}</strong>
                                <span>({activeRemainingProduct.reviewsCount} reviews)</span>
                              </span>
                            </div>

                            <h4
                              className="text-xl sm:text-2xl font-black tracking-tight mt-1"
                              style={{ fontFamily: 'var(--font-display)' }}
                            >
                              {activeRemainingProduct.name}
                            </h4>

                            <p
                              className={`text-xs sm:text-sm mt-1 leading-relaxed ${
                                isDark ? 'text-[#b3a191]' : 'text-[#69584b]'
                              }`}
                            >
                              {activeRemainingProduct.description}
                            </p>
                          </div>

                          {/* Quick Spec Pills */}
                          <div
                            className={`p-3.5 rounded-xl border space-y-1.5 text-xs font-mono ${
                              isDark ? 'bg-[#1b130c] border-[#312317]' : 'bg-[#faf4ec] border-[#ded4c3]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[#8c7b6d]">DIMENSIONS:</span>
                              <span className="font-bold">{activeRemainingProduct.dimensions}</span>
                            </div>

                            {activeRemainingProduct.materials?.[0] && (
                              <div className="flex items-center justify-between">
                                <span className="text-[#8c7b6d]">PRIMARY MATERIAL:</span>
                                <span className="font-bold truncate max-w-[220px]">
                                  {activeRemainingProduct.materials[0]}
                                </span>
                              </div>
                            )}

                            {activeRemainingProduct.powerSource && (
                              <div className="flex items-center justify-between">
                                <span className="text-[#8c7b6d]">POWER SOURCE:</span>
                                <span className="font-bold">{activeRemainingProduct.powerSource}</span>
                              </div>
                            )}
                          </div>

                          {/* Price and Cart Buttons */}
                          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-baseline gap-2">
                              {activeRemainingProduct.originalPrice && (
                                <span className="text-xs line-through text-[#8c7b6d]">
                                  ₹{activeRemainingProduct.originalPrice.toLocaleString('en-IN')}
                                </span>
                              )}
                              <span
                                className={`text-2xl font-black font-mono ${
                                  isDark ? 'text-[#d2f53a]' : 'text-[#c35626]'
                                }`}
                              >
                                ₹{activeRemainingProduct.price.toLocaleString('en-IN')}
                              </span>
                              <span className="text-[10px] font-mono text-[#8c7b6d]">INCL. GST</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleQuickAdd(activeRemainingProduct)}
                                className={`py-2.5 px-4 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 ${
                                  addedId === activeRemainingProduct.id
                                    ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                                    : isDark
                                    ? 'bg-[#d2f53a] hover:bg-[#bce427] text-black shadow-[0_0_15px_rgba(210,245,58,0.25)]'
                                    : 'bg-[#c35626] hover:bg-[#a8471d] text-white shadow-xs'
                                }`}
                              >
                                {addedId === activeRemainingProduct.id ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                    <span>Added!</span>
                                  </>
                                ) : (
                                  <>
                                    <ShoppingBag className="w-3.5 h-3.5" />
                                    <span>
                                      {cartProductIds.includes(activeRemainingProduct.id)
                                        ? 'Add Another (+1)'
                                        : 'Add to Trolley'}
                                    </span>
                                  </>
                                )}
                              </button>

                              {cartProductIds.includes(activeRemainingProduct.id) && onRemoveFromCart && (
                                <button
                                  onClick={() => onRemoveFromCart(activeRemainingProduct.id)}
                                  className="p-2.5 rounded-xl border border-rose-500/50 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-all cursor-pointer active:scale-95"
                                  title="Remove from trolley"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}

                              <button
                                onClick={() => onSelectProduct(activeRemainingProduct)}
                                className={`py-2.5 px-3 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                  isDark
                                    ? 'bg-[#1a120b] hover:bg-[#251b14] border-[#332316] text-[#b3a191] hover:text-white'
                                    : 'bg-[#faf4ec] hover:bg-[#f2e7d7] border-[#ded4c3] text-[#4d3f32]'
                                }`}
                              >
                                <span>Full Specs</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Expanded Grid View of All Remaining Items if Toggled */}
                  {showAllRemainingList && (
                    <div className="pt-4 border-t border-white/10">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-[#a89685] mb-4">
                        All Remaining Items in {floor.name}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {remainingProducts.map((p) => {
                          const isInCart = cartProductIds.includes(p.id);
                          const isJustAdded = addedId === p.id;
                          return (
                            <div
                              key={p.id}
                              className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                                isDark
                                  ? 'bg-[#140e0a] hover:bg-[#1b130c] border-[#291b12]'
                                  : 'bg-white hover:bg-[#faf4ec] border-[#ded4c3]'
                              }`}
                            >
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/40 border border-white/10 p-1 shrink-0 flex items-center justify-center">
                                  <ProductArtwork
                                    productId={p.id}
                                    aspectRatio="square"
                                    theme={theme}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h5 className="font-bold text-xs sm:text-sm truncate">{p.name}</h5>
                                  <p className="font-mono text-xs font-black text-[#d2f53a]">
                                    ₹{p.price.toLocaleString('en-IN')}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 pt-2 border-t border-white/5">
                                <button
                                  onClick={() => handleQuickAdd(p)}
                                  className={`flex-1 py-1.5 px-2 rounded-lg font-mono text-[11px] font-bold uppercase transition-all flex items-center justify-center gap-1 cursor-pointer ${
                                    isJustAdded
                                      ? 'bg-emerald-500 text-white'
                                      : isDark
                                      ? 'bg-[#d2f53a] text-black hover:bg-[#bce427]'
                                      : 'bg-[#c35626] text-white hover:bg-[#a8471d]'
                                  }`}
                                >
                                  <ShoppingBag className="w-3 h-3" />
                                  <span>{isInCart ? 'In Cart (+1)' : 'Add'}</span>
                                </button>

                                <button
                                  onClick={() => onSelectProduct(p)}
                                  className={`p-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                                    isDark
                                      ? 'bg-[#1e150f] hover:bg-[#2a1d15] border-[#382b20] text-[#cfbfaf]'
                                      : 'bg-white hover:bg-[#faf4ec] border-[#ded4c3] text-[#45372d]'
                                  }`}
                                  title="View details"
                                >
                                  <Info className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer of Modal: Quick navigation return */}
          <div
            className={`px-4 sm:px-8 py-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#8c7b6d] ${
              isDark ? 'bg-[#120c08] border-[#24170e]' : 'bg-[#f4eee6] border-[#e2d5c3]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>VINKRI Atelier & Architecture Store · Hyderabad, India</span>
            </div>

            <div className="flex items-center gap-4">
              <span>Press ESC to return to building front</span>
              <button
                onClick={onClose}
                className={`px-3 py-1 rounded-lg border font-bold transition-all cursor-pointer ${
                  isDark
                    ? 'bg-[#1d140e] hover:bg-[#281c13] text-white border-[#38271a]'
                    : 'bg-white hover:bg-[#eee3d4] text-[#2c2016] border-[#ded4c3]'
                }`}
              >
                Exit Floor View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
