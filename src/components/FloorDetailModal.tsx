import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  Moon,
  Check,
  Heart,
  Sliders,
  Trash2,
  Building,
  Star,
  Eye,
  Layers
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
  initialProductId?: string | null;
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
  initialSlot,
  initialProductId,
  wishlistIds = [],
  onToggleWishlist,
  cartProductIds = [],
  onRemoveFromCart
}) => {
  const isDark = theme === 'rustic-dark';
  const showcaseRef = useRef<HTMLDivElement>(null);
  const [roomLighting, setRoomLighting] = useState<'bright' | 'studio' | 'mood'>('studio');
  const [addedId, setAddedId] = useState<string | null>(null);

  // Products belonging to this specific floor
  const floorProducts = floor
    ? PRODUCTS_DATA.filter((p) => p.floorNumber === floor.numeric)
    : [];

  // Active product on stage ("when a product is clicked that product should be there")
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  // Update active product when floor or initialProductId changes
  useEffect(() => {
    if (!floor) return;
    const prods = PRODUCTS_DATA.filter((p) => p.floorNumber === floor.numeric);
    if (prods.length === 0) {
      setActiveProduct(null);
      return;
    }

    if (initialProductId) {
      const matched = prods.find((p) => p.id === initialProductId);
      if (matched) {
        setActiveProduct(matched);
        return;
      }
    }

    if (initialSlot) {
      const slotItem = floor.items.find((item) => item.slot === initialSlot);
      if (slotItem?.productId) {
        const matched = prods.find((p) => p.id === slotItem.productId);
        if (matched) {
          setActiveProduct(matched);
          return;
        }
      }
    }

    // Default to the first product on the floor
    setActiveProduct(prods[0]);
  }, [floor?.numeric, initialProductId, initialSlot]);

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

  const handleSelectProductOnStage = (product: Product) => {
    setActiveProduct(product);
    if (showcaseRef.current) {
      showcaseRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // Custom architectural flooring definition per level
  const floorFinishes: Record<number, { name: string; border: string }> = {
    5: { name: 'Polished Nordic Birch & Aluminium Inlays', border: '#3b82f6' },
    4: { name: 'Smoked Walnut Parquet Planking', border: '#10b981' },
    3: { name: 'Terrazzo Marble with Brass Inlay Grid', border: '#f59e0b' },
    2: { name: 'Hand-cast Basalt Stone & Concrete Base', border: '#f43f5e' },
    1: { name: 'Veined Spanish Travertine with Warm Glow', border: '#f97316' }
  };

  const currentFinish = floorFinishes[floor.numeric] || floorFinishes[5];
  const activeProductInCart = activeProduct ? cartProductIds.includes(activeProduct.id) : false;
  const activeProductWishlisted = activeProduct ? wishlistIds.includes(activeProduct.id) : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      {/* Outer Atelier Chamber Container */}
      <div
        className={`relative w-full max-w-7xl max-h-[92vh] rounded-2xl md:rounded-3xl border shadow-[0_25px_70px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden transition-all duration-300 animate-virtual-walkin ${
          isDark
            ? 'bg-[#100b08] border-[#382619] text-[#f7f2ea]'
            : 'bg-[#faf6f0] border-[#ded4c3] text-[#282019]'
        }`}
      >
        {/* Scrollable Container with Custom Styled Scrollbar */}
        <div
          className={`flex-1 flex flex-col overflow-y-auto max-h-[92vh] ${
            isDark ? 'vinkri-window-scrollbar' : 'vinkri-window-scrollbar-light'
          }`}
        >
          {/* 1. Floor Topbar: Back to Building, Floor Title, Level Number & Elevator Quick Jump */}
          <div
            className={`sticky top-0 px-4 sm:px-8 py-3.5 sm:py-4 flex flex-wrap items-center justify-between gap-3 border-b z-30 transition-colors backdrop-blur-md ${
              isDark ? 'bg-[#18110b]/95 border-[#2d1e14]' : 'bg-[#f4ebe0]/95 border-[#e2d5c3]'
            }`}
          >
            {/* Back to Store Front Button */}
            <button
              onClick={onClose}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer border flex items-center gap-2 text-xs sm:text-sm font-mono font-bold shadow-xs active:scale-95 ${
                isDark
                  ? 'bg-[#241a12] hover:bg-[#322318] border-[#3f2e21] text-[#f5ede2] hover:text-[#d2f53a] hover:border-[#d2f53a]/50'
                  : 'bg-white hover:bg-[#ede3d3] border-[#ded4c3] text-[#2c2016] hover:text-[#c35626] hover:border-[#c35626]/50'
              }`}
              title="Return to Building Front (Esc)"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-extrabold tracking-wide">Back to Building</span>
            </button>

            {/* Center Floor Title & Atelier Status */}
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase text-[#a89685]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>HYDERABAD FLAGSHIP ATELIER</span>
              </div>
              <h2
                className="text-lg sm:text-2xl font-black tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                LEVEL 0{floor.number} · {floor.name}
              </h2>
            </div>

            {/* Right: Elevator Quick Switcher & Close */}
            <div className="flex items-center gap-2">
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
            className={`px-4 sm:px-8 py-3.5 sm:py-4 border-b transition-colors ${
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
                  <span>INSIDE LEVEL 0{floor.number}</span>
                  <span>•</span>
                  <span style={{ color: floor.accentHex }} className="font-bold">
                    {floor.tagline}
                  </span>
                </div>
                <p
                  className={`text-xs sm:text-sm mt-0.5 max-w-3xl leading-relaxed ${
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
                  <span>{currentFinish.name.split(' ')[0]} {currentFinish.name.split(' ')[1]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. ACTIVE PRODUCT SPOTLIGHT SHOWCASE ("when a product is clicked that product should be there") */}
          {activeProduct && (
            <div
              ref={showcaseRef}
              className={`px-4 sm:px-8 py-5 sm:py-6 border-b transition-colors ${
                isDark ? 'bg-[#130d08]' : 'bg-[#fcfaf7]'
              }`}
            >
              <div
                className={`p-4 sm:p-6 rounded-2xl border transition-all duration-300 shadow-xl ${
                  isDark
                    ? 'bg-[#18110b] border-[#382618]'
                    : 'bg-white border-[#ded4c3]'
                }`}
              >
                {/* Spotlight Header Tag */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full animate-pulse"
                      style={{ backgroundColor: floor.accentHex }}
                    />
                    <span className="text-[11px] font-mono font-black uppercase tracking-wider text-[#d2f53a]">
                      ACTIVE PRODUCT SPOTLIGHT
                    </span>
                    <span className="text-xs font-mono text-[#8c7b6d]">• Click any creation below to switch view</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {onToggleWishlist && (
                      <button
                        onClick={() => onToggleWishlist(activeProduct.id)}
                        className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                          activeProductWishlisted
                            ? 'bg-rose-500/20 text-rose-500 border-rose-500/40'
                            : isDark
                            ? 'bg-[#221811] text-[#8c7b6d] border-[#382b20] hover:text-white'
                            : 'bg-white text-[#7d6c5d] border-[#ded4c3] hover:text-black'
                        }`}
                        title="Save to Wishlist"
                      >
                        <Heart
                          className={`w-4 h-4 ${activeProductWishlisted ? 'fill-current' : ''}`}
                        />
                      </button>
                    )}

                    {onOpenVirtualDarkRoom && (
                      <button
                        onClick={() => onOpenVirtualDarkRoom(activeProduct.id)}
                        className="px-2.5 py-1 rounded-lg bg-black/80 hover:bg-black text-amber-400 border border-white/20 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Inspect in 3D Dark Room"
                      >
                        <Moon className="w-3.5 h-3.5" />
                        <span>3D Dark Room</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Artwork Showcase Stage (5 cols) */}
                  <div className="lg:col-span-5 flex flex-col items-center justify-center">
                    <div
                      onClick={() => onSelectProduct(activeProduct)}
                      className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden border cursor-pointer flex items-center justify-center shadow-lg group"
                      style={{
                        backgroundColor: isDark ? '#080503' : '#ede2d3',
                        borderColor: `${floor.accentHex}40`
                      }}
                      title="Click to view full specs modal"
                    >
                      <ProductArtwork
                        productId={activeProduct.id}
                        aspectRatio="square"
                        theme={theme}
                        showGlow={roomLighting !== 'bright'}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Floating Category Tag */}
                      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase backdrop-blur-md bg-black/70 text-white border border-white/10">
                        {activeProduct.shortTag || activeProduct.category}
                      </div>

                      {/* Inspect Hint */}
                      <div className="absolute top-3 right-3 px-2 py-1 rounded-md text-[9px] font-mono font-bold uppercase backdrop-blur-md bg-black/60 text-white/80 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </div>
                    </div>
                  </div>

                  {/* Details & Specifications & Actions (7 cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-[#8c7b6d]">
                        <span>LEVEL 0{floor.number} · {floor.name}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-amber-500">
                          <Star className="w-3 h-3 fill-amber-500" />
                          <strong className="font-bold">{activeProduct.rating}</strong>
                          <span>({activeProduct.reviewsCount} reviews)</span>
                        </span>
                      </div>

                      <h3
                        onClick={() => onSelectProduct(activeProduct)}
                        className="text-2xl sm:text-3xl font-black tracking-tight mt-1 cursor-pointer hover:underline"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {activeProduct.name}
                      </h3>

                      <p
                        className={`text-xs sm:text-sm mt-1 leading-relaxed ${
                          isDark ? 'text-[#b3a191]' : 'text-[#69584b]'
                        }`}
                      >
                        {activeProduct.description}
                      </p>
                    </div>

                    {/* Quick Specs Grid */}
                    <div
                      className={`p-3.5 rounded-xl border space-y-1.5 text-xs font-mono ${
                        isDark ? 'bg-[#140e0a] border-[#291b12]' : 'bg-[#faf4ec] border-[#ded4c3]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[#8c7b6d]">DIMENSIONS:</span>
                        <span className="font-bold">{activeProduct.dimensions}</span>
                      </div>

                      {activeProduct.materials?.[0] && (
                        <div className="flex items-center justify-between">
                          <span className="text-[#8c7b6d]">PRIMARY MATERIALS:</span>
                          <span className="font-bold truncate max-w-[240px]">
                            {activeProduct.materials.join(', ')}
                          </span>
                        </div>
                      )}

                      {activeProduct.powerSource && (
                        <div className="flex items-center justify-between">
                          <span className="text-[#8c7b6d]">POWER SOURCE:</span>
                          <span className="font-bold">{activeProduct.powerSource}</span>
                        </div>
                      )}

                      {activeProduct.ledColors && activeProduct.ledColors.length > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-[#8c7b6d]">ILLUMINATION:</span>
                          <span className="font-bold">{activeProduct.ledColors.join(' • ')}</span>
                        </div>
                      )}
                    </div>

                    {/* Price and Cart Buttons */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-baseline gap-2">
                        {activeProduct.originalPrice && (
                          <span className="text-xs line-through text-[#8c7b6d]">
                            ₹{activeProduct.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                        <span
                          className={`text-2xl sm:text-3xl font-black font-mono ${
                            isDark ? 'text-[#d2f53a]' : 'text-[#c35626]'
                          }`}
                        >
                          ₹{activeProduct.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] font-mono text-[#8c7b6d]">INCL. GST</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuickAdd(activeProduct)}
                          className={`py-3 px-5 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 ${
                            addedId === activeProduct.id
                              ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                              : isDark
                              ? 'bg-[#d2f53a] hover:bg-[#bce427] text-black shadow-[0_0_15px_rgba(210,245,58,0.25)]'
                              : 'bg-[#c35626] hover:bg-[#a8471d] text-white shadow-xs'
                          }`}
                        >
                          {addedId === activeProduct.id ? (
                            <>
                              <Check className="w-4 h-4 stroke-[3]" />
                              <span>Added to Trolley!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-4 h-4" />
                              <span>
                                {activeProductInCart ? 'Add Another (+1)' : 'Add to Trolley'}
                              </span>
                            </>
                          )}
                        </button>

                        {activeProductInCart && onRemoveFromCart && (
                          <button
                            onClick={() => onRemoveFromCart(activeProduct.id)}
                            className="p-3 rounded-xl border border-rose-500/50 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-all cursor-pointer active:scale-95"
                            title="Remove from trolley"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => onSelectProduct(activeProduct)}
                          className={`py-3 px-4 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            isDark
                              ? 'bg-[#221811] hover:bg-[#2e2017] border-[#382618] text-[#b3a191] hover:text-white'
                              : 'bg-[#faf4ec] hover:bg-[#f2e7d7] border-[#ded4c3] text-[#4d3f32]'
                          }`}
                        >
                          <span>Full Specs</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. ALL PRODUCTS ON THIS FLOOR: COMPLETE VISIBLE GALLERY */}
          <div className="px-4 sm:px-8 py-6 sm:py-8">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" style={{ color: floor.accentHex }} />
                <h3
                  className="text-base sm:text-lg font-black tracking-wider uppercase font-mono"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  ALL PRODUCTS ON THIS FLOOR
                </h3>
                <span
                  className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${floor.accentHex}20`,
                    color: floor.accentHex
                  }}
                >
                  {floorProducts.length} CREATIONS
                </span>
              </div>

              <span className="text-xs font-mono text-[#8c7b6d]">
                Click any product to feature it on the active spotlight stage
              </span>
            </div>

            {/* Comprehensive Floor Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {floorProducts.map((product, idx) => {
                const isActive = activeProduct?.id === product.id;
                const isInCart = cartProductIds.includes(product.id);
                const isJustAdded = addedId === product.id;
                const isWishlisted = wishlistIds.includes(product.id);

                return (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProductOnStage(product)}
                    className={`group relative rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer shadow-lg ${
                      isActive
                        ? isDark
                          ? 'bg-[#1c140d] border-[#d2f53a] shadow-[0_0_30px_rgba(210,245,58,0.2)] ring-1 ring-[#d2f53a]'
                          : 'bg-[#fffaf3] border-[#c35626] shadow-[0_0_25px_rgba(195,86,38,0.2)] ring-1 ring-[#c35626]'
                        : isDark
                        ? 'bg-[#150e09] hover:bg-[#1c140d] border-[#2f2015] hover:border-white/30'
                        : 'bg-white hover:bg-[#faf4ec] border-[#e2d5c3] hover:border-[#c35626]/40'
                    }`}
                  >
                    {/* Top Row: Index/Rank Badge & Action Buttons */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                            isActive
                              ? isDark
                                ? 'bg-[#d2f53a] text-black border-[#d2f53a]'
                                : 'bg-[#c35626] text-white border-[#c35626]'
                              : isDark
                              ? 'bg-white/10 text-white/80 border-white/20'
                              : 'bg-black/5 text-[#544336] border-black/10'
                          }`}
                        >
                          {isActive ? 'ACTIVE ON STAGE' : `#0${idx + 1}`}
                        </span>

                        {product.isTopSeller && (
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 border border-amber-500/30">
                            TOP PICK
                          </span>
                        )}
                      </div>

                      {onToggleWishlist && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWishlist(product.id);
                          }}
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

                    {/* Product Image Stage */}
                    <div
                      className="relative w-full aspect-square rounded-xl overflow-hidden border flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-[1.02]"
                      style={{
                        backgroundColor: isDark ? '#080503' : '#ede2d3',
                        borderColor: isActive ? floor.accentHex : `${floor.accentHex}25`
                      }}
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

                      {/* Dark Room Quick Trigger */}
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
                          className="text-base sm:text-lg font-black tracking-tight mt-1 truncate"
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickAdd(product);
                            }}
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
                                <span>{isInCart ? 'In Trolley (+1)' : 'Add to Trolley'}</span>
                              </>
                            )}
                          </button>

                          {isInCart && onRemoveFromCart && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveFromCart(product.id);
                              }}
                              className="p-2.5 rounded-xl border border-rose-500/50 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-all cursor-pointer active:scale-95 shrink-0"
                              title="Remove item from trolley"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectProductOnStage(product);
                            }}
                            className={`flex-1 py-1.5 px-2 rounded-lg border text-[11px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                              isActive
                                ? isDark
                                  ? 'bg-[#d2f53a]/20 border-[#d2f53a] text-[#d2f53a]'
                                  : 'bg-[#c35626]/15 border-[#c35626] text-[#c35626]'
                                : isDark
                                ? 'bg-[#1a120b] hover:bg-[#251b14] border-[#332316] text-[#b3a191] hover:text-white'
                                : 'bg-[#faf4ec] hover:bg-[#f2e7d7] border-[#ded4c3] text-[#4d3f32]'
                            }`}
                          >
                            <span>{isActive ? 'Current View' : 'Focus Product'}</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectProduct(product);
                            }}
                            className={`p-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                              isDark
                                ? 'bg-[#1e150f] hover:bg-[#2a1d15] border-[#382b20] text-[#cfbfaf]'
                                : 'bg-white hover:bg-[#faf4ec] border-[#ded4c3] text-[#45372d]'
                            }`}
                            title="Full Specifications Details Modal"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. Footer of Modal: Quick navigation return */}
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
                className={`px-3.5 py-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
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
