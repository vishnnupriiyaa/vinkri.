import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Star,
  ShoppingBag,
  Sparkles,
  Heart,
  Eye,
  Layers,
  Check,
  Trash2,
  Moon,
  Sun,
  Flame,
  ArrowRight,
  ShieldCheck,
  Compass,
  Building2,
  ChevronDown
} from 'lucide-react';
import { FloorInfo, Product, ThemeMode } from '../types';
import { PRODUCTS_DATA, FLOORS_DATA } from '../data/products';
import { ProductArtwork } from './ProductArtwork';

interface FloorPageViewProps {
  floor: FloorInfo;
  onBackToBuilding: () => void;
  theme: ThemeMode;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onOpenVirtualDarkRoom: (productId: string) => void;
  onSwitchFloor: (floor: FloorInfo) => void;
  wishlistIds?: string[];
  onToggleWishlist?: (productId: string) => void;
  cartProductIds?: string[];
  onRemoveFromCart?: (productId: string) => void;
}

export const FloorPageView: React.FC<FloorPageViewProps> = ({
  floor,
  onBackToBuilding,
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

  // Room ambience light setting
  const [ambientLight, setAmbientLight] = useState<'studio' | 'daylight' | 'mood'>('studio');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'rating'>('recommended');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Keyboard navigation: ESC returns to building
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBackToBuilding();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBackToBuilding]);

  // Scroll to top on floor change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [floor.numeric]);

  // Products belonging to this floor
  const floorProducts = useMemo(() => {
    return PRODUCTS_DATA.filter((p) => p.floorNumber === floor.numeric);
  }, [floor.numeric]);

  // Available sub-tags for filtering
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    floorProducts.forEach((p) => {
      if (p.shortTag) tags.add(p.shortTag);
    });
    return ['ALL', ...Array.from(tags)];
  }, [floorProducts]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return floorProducts
      .filter((product) => {
        const matchesSearch =
          searchQuery.trim() === '' ||
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.materials?.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesTag = selectedTag === 'ALL' || product.shortTag === selectedTag;

        return matchesSearch && matchesTag;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        // recommended: top sellers first
        if (a.isTopSeller && !b.isTopSeller) return -1;
        if (!a.isTopSeller && b.isTopSeller) return 1;
        return 0;
      });
  }, [floorProducts, searchQuery, selectedTag, sortBy]);

  // Top 3 featured creations for the first row showcase
  const topThreeCreations = useMemo(() => {
    // Priority: top sellers on this floor or first 3 items
    const topSellers = floorProducts.filter((p) => p.isTopSeller);
    if (topSellers.length >= 3) {
      return topSellers.slice(0, 3);
    }
    const nonSellers = floorProducts.filter((p) => !p.isTopSeller);
    return [...topSellers, ...nonSellers].slice(0, 3);
  }, [floorProducts]);

  const handleQuickAddClick = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickAdd(product);
    setJustAddedId(product.id);
    setTimeout(() => setJustAddedId(null), 1500);
  };

  // Architectural finishing specifications
  const floorFinishes: Record<number, { finish: string; ceiling: string; lighting: string }> = {
    5: {
      finish: 'Polished Nordic Birch Planking & Brushed Aluminum Inlays',
      ceiling: 'Acoustic Teak Slats with Integrated Recessed Micro-Downlights',
      lighting: 'Gallery Spotlight 4000K Neutral Crisp'
    },
    4: {
      finish: 'Smoked French Walnut Parquet with Antiqued Brass Dividers',
      ceiling: 'Matte Charcoal Coffer with Perimeter Fibre-Optic Starlight Glow',
      lighting: 'Museum Precision 3200K Warm Accent'
    },
    3: {
      finish: 'Polished Terrazzo Marble with Geometric Brass Inlay Lines',
      ceiling: 'Brushed Titanium Showroom Grid with Focused Downward Floodlights',
      lighting: 'Automotive Showroom High-CRI 4500K Pure Glow'
    },
    2: {
      finish: 'Hand-cast Basalt Stone & Warm Exposed Micro-Cement Plaster',
      ceiling: 'Fluted Acoustic Felt Vaults with Halo Backlighting Channels',
      lighting: 'Sculptural Halo 2700K Candlelight'
    },
    1: {
      finish: 'Honed Veined Spanish Travertine with Underfloor Radiant Heat',
      ceiling: 'Loom-woven Washi Paper Luminaire Diffusers',
      lighting: 'Ambient Sanctuary 2400K Warm Golden Sunset'
    }
  };

  const finishInfo = floorFinishes[floor.numeric] || floorFinishes[5];

  // Helper for elevator floor switching
  const handleElevatorClick = (numericFloor: number) => {
    const targetFloor = FLOORS_DATA.find((f) => f.numeric === numericFloor);
    if (targetFloor && targetFloor.numeric !== floor.numeric) {
      onSwitchFloor(targetFloor);
    }
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 pb-20 ${
        isDark ? 'bg-[#0d0906] text-[#f7f2ea]' : 'bg-[#faf6f0] text-[#282019]'
      }`}
    >
      {/* 1. TOP STICKY ATELIER NAVIGATION & ELEVATOR CONTROLS */}
      <div
        className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors shadow-xs ${
          isDark
            ? 'bg-[#120c08]/95 border-[#281a11]'
            : 'bg-[#f5ece1]/95 border-[#e2d5c3]'
        }`}
      >
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          {/* Back to Exterior Building Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToBuilding}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer border flex items-center gap-2 text-xs sm:text-sm font-mono font-bold shadow-xs active:scale-95 ${
                isDark
                  ? 'bg-[#1e150e] hover:bg-[#2c1e14] border-[#382618] text-[#f5ede2] hover:text-[#d2f53a] hover:border-[#d2f53a]/60'
                  : 'bg-white hover:bg-[#ede3d3] border-[#ded4c3] text-[#2c2016] hover:text-[#c35626] hover:border-[#c35626]/60'
              }`}
              title="Return to 3D Building Exterior (Esc)"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-extrabold tracking-wide">Return to Building Facade</span>
              <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[10px] rounded bg-black/20 border border-current opacity-70">
                ESC
              </kbd>
            </button>

            {/* Breadcrumb path */}
            <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-[#8c7b6d]">
              <span>ATELIER</span>
              <span>/</span>
              <span>HYDERABAD FLAGSHIP</span>
              <span>/</span>
              <span
                className="font-bold uppercase"
                style={{ color: floor.accentHex }}
              >
                LEVEL 0{floor.number} · {floor.name}
              </span>
            </div>
          </div>

          {/* Elevator Quick-Jump Switcher */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
                isDark ? 'bg-[#0a0705] border-[#291b12]' : 'bg-white/90 border-[#ded3c2]'
              }`}
            >
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8c7b6d] pr-1 flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                <span>ELEVATOR:</span>
              </span>
              {[5, 4, 3, 2, 1].map((fNum) => {
                const isActive = floor.numeric === fNum;
                const fData = FLOORS_DATA.find((f) => f.numeric === fNum);
                return (
                  <button
                    key={fNum}
                    onClick={() => handleElevatorClick(fNum)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-black transition-all cursor-pointer flex items-center gap-1 ${
                      isActive
                        ? isDark
                          ? 'bg-[#d2f53a] text-black shadow-[0_0_12px_rgba(210,245,58,0.35)]'
                          : 'bg-[#c35626] text-white shadow-xs'
                        : isDark
                        ? 'text-[#9c8979] hover:bg-white/10 hover:text-white'
                        : 'text-[#69584b] hover:bg-black/5 hover:text-black'
                    }`}
                    title={fData ? `Level 0${fNum}: ${fData.name}` : `Level 0${fNum}`}
                  >
                    <span>L0{fNum}</span>
                  </button>
                );
              })}
            </div>

            {/* Level Badge */}
            <div
              className="px-3 py-1.5 rounded-xl font-mono font-black text-xs border shadow-xs flex items-center gap-1.5"
              style={{
                backgroundColor: `${floor.accentHex}18`,
                borderColor: `${floor.accentHex}40`,
                color: floor.accentHex
              }}
            >
              <span>LEVEL 0{floor.number}</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-8 sm:space-y-10">
        {/* 2. ARCHITECTURAL FLOOR INTRO HERO BANNER */}
        <section
          className={`relative rounded-3xl border overflow-hidden p-6 sm:p-10 shadow-xl transition-all ${
            isDark
              ? 'bg-gradient-to-br from-[#160f0a] via-[#120c08] to-[#0a0705] border-[#382619]'
              : 'bg-gradient-to-br from-[#fffdfa] via-[#f9f3ea] to-[#f2e7d7] border-[#dfd2be]'
          }`}
        >
          {/* Subtle Ambient Backlight Glow */}
          <div
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
            style={{ backgroundColor: floor.accentHex }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className="px-2.5 py-1 rounded-md text-[10px] font-mono font-black uppercase tracking-widest border"
                  style={{
                    backgroundColor: `${floor.accentHex}20`,
                    borderColor: `${floor.accentHex}50`,
                    color: floor.accentHex
                  }}
                >
                  LEVEL 0{floor.number} • PHYSICAL ATELIER DEPARTMENT
                </span>

                <div className="flex items-center gap-1.5 text-xs font-mono text-[#8c7b6d]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Jubilee Hills Flagship • Hyderabad</span>
                </div>
              </div>

              <h1
                className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {floor.name}
              </h1>

              <p className="text-base sm:text-xl font-medium tracking-wide text-amber-500/90 font-mono">
                "{floor.tagline}"
              </p>

              <p
                className={`text-sm sm:text-base leading-relaxed pt-1 ${
                  isDark ? 'text-[#c7b7a6]' : 'text-[#5f5043]'
                }`}
              >
                {floor.description}
              </p>

              {/* Architectural Physical Materials & Finish Tag */}
              <div
                className={`inline-flex flex-wrap items-center gap-2 p-2.5 rounded-xl border text-xs font-mono mt-2 ${
                  isDark
                    ? 'bg-[#0f0a07] border-[#291b12] text-[#b3a191]'
                    : 'bg-white/80 border-[#e0d3c0] text-[#5c4b3d]'
                }`}
              >
                <Compass className="w-3.5 h-3.5" style={{ color: floor.accentHex }} />
                <span className="font-bold text-[#8c7b6d]">FLOOR FINISH:</span>
                <span>{finishInfo.finish}</span>
                <span className="text-[#8c7b6d]">•</span>
                <span className="text-[#8c7b6d]">CEILING:</span>
                <span>{finishInfo.ceiling}</span>
              </div>
            </div>

            {/* Room Ambience Lighting Switcher */}
            <div
              className={`p-3.5 rounded-2xl border flex flex-col gap-2 shrink-0 ${
                isDark ? 'bg-[#100b07] border-[#2d1e13]' : 'bg-white border-[#ded4c3]'
              }`}
            >
              <div className="flex items-center justify-between gap-3 text-[11px] font-mono text-[#8c7b6d]">
                <span className="font-bold uppercase">ROOM LIGHTING:</span>
                <span className="text-[10px] text-amber-500 font-bold">
                  {ambientLight === 'studio'
                    ? 'Studio Spotlight'
                    : ambientLight === 'daylight'
                    ? 'Warm Daylight'
                    : 'Ambient Mood Light'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => setAmbientLight('studio')}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    ambientLight === 'studio'
                      ? isDark
                        ? 'bg-[#d2f53a] text-black shadow-xs font-black'
                        : 'bg-[#c35626] text-white shadow-xs font-black'
                      : isDark
                      ? 'bg-[#1e150e] text-[#9c8979] hover:text-white'
                      : 'bg-[#f4ebe0] text-[#69584b] hover:text-black'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Studio</span>
                </button>

                <button
                  onClick={() => setAmbientLight('daylight')}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    ambientLight === 'daylight'
                      ? isDark
                        ? 'bg-[#d2f53a] text-black shadow-xs font-black'
                        : 'bg-[#c35626] text-white shadow-xs font-black'
                      : isDark
                      ? 'bg-[#1e150e] text-[#9c8979] hover:text-white'
                      : 'bg-[#f4ebe0] text-[#69584b] hover:text-black'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Daylight</span>
                </button>

                <button
                  onClick={() => setAmbientLight('mood')}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    ambientLight === 'mood'
                      ? isDark
                        ? 'bg-[#d2f53a] text-black shadow-xs font-black'
                        : 'bg-[#c35626] text-white shadow-xs font-black'
                      : isDark
                      ? 'bg-[#1e150e] text-[#9c8979] hover:text-white'
                      : 'bg-[#f4ebe0] text-[#69584b] hover:text-black'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark Room</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 3. FIRST ROW: TOP 3 CURATOR'S PICKS IN THIS CATEGORY */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2
                className="text-lg sm:text-2xl font-black tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                CURATOR'S TOP PICKS ON THIS FLOOR
              </h2>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30">
                FIRST ROW SHOWCASE
              </span>
            </div>

            <span className="text-xs font-mono text-[#8c7b6d]">
              Click any creation to inspect full specifications & materials
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topThreeCreations.map((product, idx) => {
              const isInCart = cartProductIds.includes(product.id);
              const isWishlisted = wishlistIds.includes(product.id);
              const isJustAdded = justAddedId === product.id;

              const badges = [
                '#01 CURATOR’S CHOICE',
                '#02 ATELIER FAVORITE',
                '#03 LIMITED BATCH'
              ];

              return (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className={`group relative rounded-3xl border p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1 ${
                    isDark
                      ? 'bg-gradient-to-b from-[#18110b] to-[#120d09] border-[#382619] hover:border-[#d2f53a]/60'
                      : 'bg-gradient-to-b from-white to-[#faf4ec] border-[#dfd4c4] hover:border-[#c35626]/60'
                  }`}
                >
                  <div>
                    {/* Header: Badge & Wishlist */}
                    <div className="flex items-center justify-between mb-3.5">
                      <span
                        className="text-[10px] font-mono font-black tracking-widest px-2.5 py-1 rounded-md border"
                        style={{
                          backgroundColor: `${floor.accentHex}15`,
                          borderColor: `${floor.accentHex}40`,
                          color: floor.accentHex
                        }}
                      >
                        {badges[idx] || `#0${idx + 1} SPOTLIGHT`}
                      </span>

                      {onToggleWishlist && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWishlist(product.id);
                          }}
                          className={`p-2 rounded-full border transition-all cursor-pointer ${
                            isWishlisted
                              ? 'bg-rose-500/20 text-rose-500 border-rose-500/40'
                              : isDark
                              ? 'bg-[#20160f] text-[#8c7b6d] border-[#382618] hover:text-white'
                              : 'bg-white text-[#8c7b6d] border-[#ded4c3] hover:text-black'
                          }`}
                          title="Save to Wishlist"
                        >
                          <Heart
                            className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`}
                          />
                        </button>
                      )}
                    </div>

                    {/* Product Artwork Showcase with Ambience response */}
                    <div
                      className={`relative aspect-4/3 rounded-2xl overflow-hidden border mb-4 flex items-center justify-center p-3 transition-colors ${
                        isDark ? 'bg-[#090604] border-[#261910]' : 'bg-[#f4eae0] border-[#e2d5c3]'
                      }`}
                    >
                      <ProductArtwork
                        productId={product.id}
                        aspectRatio="video"
                        theme={theme}
                        showGlow={ambientLight !== 'studio'}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Floating Category Tag */}
                      <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase backdrop-blur-md bg-black/70 text-white border border-white/10">
                        {product.shortTag || product.category}
                      </div>

                      {/* Inspect Hover Badge */}
                      <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase backdrop-blur-md bg-black/75 text-white border border-white/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                        <Eye className="w-3 h-3" />
                        <span>Inspect Product</span>
                      </div>
                    </div>

                    {/* Title, Rating & Description */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono text-[#8c7b6d]">
                        <span>LEVEL 0{floor.number}</span>
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          <strong className="font-bold">{product.rating}</strong>
                          <span>({product.reviewsCount})</span>
                        </div>
                      </div>

                      <h3
                        className="text-lg sm:text-xl font-black tracking-tight group-hover:underline"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {product.name}
                      </h3>

                      <p
                        className={`text-xs line-clamp-2 leading-relaxed ${
                          isDark ? 'text-[#b3a191]' : 'text-[#69584b]'
                        }`}
                      >
                        {product.description}
                      </p>
                    </div>

                    {/* Dimensions & Material Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-3 text-[11px] font-mono text-[#8c7b6d]">
                      <span
                        className={`px-2 py-0.5 rounded-md border ${
                          isDark ? 'bg-[#18110a] border-[#291b12]' : 'bg-[#ede3d4] border-[#d8c9b5]'
                        }`}
                      >
                        📏 {product.dimensions}
                      </span>
                      {product.materials?.[0] && (
                        <span
                          className={`px-2 py-0.5 rounded-md border truncate max-w-[170px] ${
                            isDark ? 'bg-[#18110a] border-[#291b12]' : 'bg-[#ede3d4] border-[#d8c9b5]'
                          }`}
                        >
                          🪵 {product.materials[0]}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pricing and Action Buttons */}
                  <div className="pt-4 mt-4 border-t border-inherit flex items-center justify-between gap-3">
                    <div>
                      {product.originalPrice && (
                        <span className="text-xs line-through text-[#8c7b6d] block font-mono">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                      <span
                        className={`text-xl font-black font-mono ${
                          isDark ? 'text-[#d2f53a]' : 'text-[#c35626]'
                        }`}
                      >
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* 3D Dark Room Button */}
                      {onOpenVirtualDarkRoom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenVirtualDarkRoom(product.id);
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                            isDark
                              ? 'bg-[#1e150f] hover:bg-[#2c1e14] border-[#382618] text-[#8c7b6d] hover:text-[#d2f53a]'
                              : 'bg-white hover:bg-[#ede3d3] border-[#ded4c3] text-[#69584b] hover:text-[#c35626]'
                          }`}
                          title="Simulate in 3D Dark Room"
                        >
                          <Moon className="w-4 h-4" />
                        </button>
                      )}

                      {/* Quick Add to Trolley Button */}
                      <button
                        onClick={(e) => handleQuickAddClick(product, e)}
                        className={`py-2.5 px-4 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 ${
                          isJustAdded
                            ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                            : isDark
                            ? 'bg-[#d2f53a] hover:bg-[#bce427] text-black shadow-[0_0_12px_rgba(210,245,58,0.25)]'
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
                            <span>{isInCart ? 'Add Another (+1)' : 'Add to Trolley'}</span>
                          </>
                        )}
                      </button>

                      {isInCart && onRemoveFromCart && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveFromCart(product.id);
                          }}
                          className="p-2.5 rounded-xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-all cursor-pointer active:scale-95"
                          title="Remove from trolley"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. ALL PRODUCTS ON THIS FLOOR - CONTROLS & FILTER TOOLBAR */}
        <section className="space-y-6 pt-4">
          <div
            className={`p-4 sm:p-5 rounded-2xl border transition-colors shadow-xs ${
              isDark ? 'bg-[#140e09] border-[#2e1f14]' : 'bg-[#faf4ec] border-[#ded4c3]'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Category / Sub-tag filter chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-mono font-bold uppercase text-[#8c7b6d] mr-1 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  <span>FILTER:</span>
                </span>
                {availableTags.map((tag) => {
                  const isSelected = selectedTag === tag;
                  return (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                        isSelected
                          ? isDark
                            ? 'bg-[#d2f53a] text-black border-[#d2f53a] shadow-xs'
                            : 'bg-[#c35626] text-white border-[#c35626] shadow-xs'
                          : isDark
                          ? 'bg-[#1b120c] hover:bg-[#251910] border-[#382618] text-[#b3a191] hover:text-white'
                          : 'bg-white hover:bg-[#ede3d3] border-[#ded4c3] text-[#5c4b3d] hover:text-black'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>

              {/* Search within Floor & Sort Dropdown */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Search Input */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8c7b6d]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search Level 0${floor.number}...`}
                    className={`pl-9 pr-3.5 py-1.5 rounded-xl text-xs font-mono border focus:outline-none transition-all w-48 sm:w-56 ${
                      isDark
                        ? 'bg-[#0f0a07] border-[#382618] text-white placeholder-[#69584b] focus:border-[#d2f53a]'
                        : 'bg-white border-[#ded4c3] text-black placeholder-[#a89685] focus:border-[#c35626]'
                    }`}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8c7b6d] hover:text-white"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#8c7b6d]" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono border font-bold cursor-pointer focus:outline-none ${
                      isDark
                        ? 'bg-[#0f0a07] border-[#382618] text-[#f5ede2]'
                        : 'bg-white border-[#ded4c3] text-[#2c2016]'
                    }`}
                  >
                    <option value="recommended">Curator's Sort</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                {/* Count badge */}
                <span
                  className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl border"
                  style={{
                    backgroundColor: `${floor.accentHex}15`,
                    borderColor: `${floor.accentHex}40`,
                    color: floor.accentHex
                  }}
                >
                  {filteredProducts.length} CREATIONS
                </span>
              </div>
            </div>
          </div>

          {/* 5. ALL CREATIONS ON THIS FLOOR: COMPREHENSIVE VISIBLE GRID */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2
                className="text-xl sm:text-2xl font-black tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                ALL CREATIONS IN {floor.name}
              </h2>
              <span className="text-xs font-mono text-[#8c7b6d]">
                Showing {filteredProducts.length} items
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div
                className={`text-center py-16 rounded-3xl border ${
                  isDark ? 'bg-[#140e09] border-[#291b12]' : 'bg-white border-[#ded4c3]'
                }`}
              >
                <p className="text-base font-bold font-mono">No creations match your filter criteria.</p>
                <button
                  onClick={() => {
                    setSelectedTag('ALL');
                    setSearchQuery('');
                  }}
                  className={`mt-3 px-4 py-2 rounded-xl text-xs font-mono font-bold border ${
                    isDark ? 'bg-[#1f150e] border-[#382618] text-[#d2f53a]' : 'bg-[#faf4ec] border-[#ded4c3] text-[#c35626]'
                  }`}
                >
                  Reset Floor Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                {filteredProducts.map((product, idx) => {
                  const isInCart = cartProductIds.includes(product.id);
                  const isWishlisted = wishlistIds.includes(product.id);
                  const isJustAdded = justAddedId === product.id;

                  return (
                    <div
                      key={product.id}
                      onClick={() => onSelectProduct(product)}
                      className={`group relative rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 ${
                        isDark
                          ? 'bg-[#150e09] hover:bg-[#1b120c] border-[#2c1d12] hover:border-[#d2f53a]/50'
                          : 'bg-white hover:bg-[#fffdfa] border-[#e2d5c3] hover:border-[#c35626]/50'
                      }`}
                    >
                      <div>
                        {/* Top: Slot & Wishlist */}
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                              isDark
                                ? 'bg-[#0f0a07] text-[#9c8979] border-[#2b1c11]'
                                : 'bg-[#faf4ec] text-[#69584b] border-[#ded4c3]'
                            }`}
                          >
                            BAY 0{idx + 1}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {product.isTopSeller && (
                              <span className="text-[9px] font-mono font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-500 border border-amber-500/30">
                                POPULAR
                              </span>
                            )}

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
                                    : 'bg-white text-[#8c7b6d] border-[#ded4c3] hover:text-black'
                                }`}
                                title="Wishlist"
                              >
                                <Heart
                                  className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500' : ''}`}
                                />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Product Artwork Container */}
                        <div
                          className={`relative aspect-square rounded-xl overflow-hidden border mb-3.5 flex items-center justify-center p-3 ${
                            isDark ? 'bg-[#090604] border-[#261910]' : 'bg-[#faf4ec] border-[#e6dac9]'
                          }`}
                        >
                          <ProductArtwork
                            productId={product.id}
                            aspectRatio="square"
                            theme={theme}
                            showGlow={ambientLight !== 'studio'}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />

                          {/* Quick Inspect Button on Hover */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <span className="px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-black/80 text-white border border-white/20 backdrop-blur-xs flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" />
                              <span>Inspect Details</span>
                            </span>
                          </div>
                        </div>

                        {/* Product Name & Details */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-mono text-[#8c7b6d]">
                            <span className="truncate max-w-[140px] uppercase">
                              {product.shortTag || product.category}
                            </span>
                            <span className="flex items-center gap-1 text-amber-500">
                              <Star className="w-3 h-3 fill-amber-500" />
                              <strong>{product.rating}</strong>
                            </span>
                          </div>

                          <h3
                            className="text-base font-bold tracking-tight line-clamp-1 group-hover:underline"
                            style={{ fontFamily: 'var(--font-display)' }}
                          >
                            {product.name}
                          </h3>

                          <p
                            className={`text-xs line-clamp-2 leading-relaxed ${
                              isDark ? 'text-[#b3a191]' : 'text-[#69584b]'
                            }`}
                          >
                            {product.description}
                          </p>
                        </div>

                        {/* Dimensions & Materials */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-2.5 text-[10px] font-mono text-[#8c7b6d]">
                          <span
                            className={`px-1.5 py-0.5 rounded border truncate max-w-[130px] ${
                              isDark ? 'bg-[#100a06] border-[#24160d]' : 'bg-[#f4eae0] border-[#ded4c3]'
                            }`}
                          >
                            {product.dimensions}
                          </span>
                          {product.materials?.[0] && (
                            <span
                              className={`px-1.5 py-0.5 rounded border truncate max-w-[130px] ${
                                isDark ? 'bg-[#100a06] border-[#24160d]' : 'bg-[#f4eae0] border-[#ded4c3]'
                              }`}
                            >
                              {product.materials[0]}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bottom Price & Add Buttons */}
                      <div className="pt-3.5 mt-3.5 border-t border-inherit flex items-center justify-between gap-2">
                        <div>
                          {product.originalPrice && (
                            <span className="text-[10px] line-through text-[#8c7b6d] block font-mono">
                              ₹{product.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                          <span
                            className={`text-lg font-black font-mono ${
                              isDark ? 'text-[#d2f53a]' : 'text-[#c35626]'
                            }`}
                          >
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* 3D Dark Room Button */}
                          {onOpenVirtualDarkRoom && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenVirtualDarkRoom(product.id);
                              }}
                              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                                isDark
                                  ? 'bg-[#1d130c] hover:bg-[#281a10] border-[#362315] text-[#8c7b6d] hover:text-[#d2f53a]'
                                  : 'bg-white hover:bg-[#ede3d3] border-[#ded4c3] text-[#69584b] hover:text-[#c35626]'
                              }`}
                              title="Virtual Dark Room"
                            >
                              <Moon className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Quick Add Button */}
                          <button
                            onClick={(e) => handleQuickAddClick(product, e)}
                            className={`py-2 px-3 rounded-xl font-mono text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1 ${
                              isJustAdded
                                ? 'bg-emerald-500 text-white'
                                : isDark
                                ? 'bg-[#d2f53a] hover:bg-[#bce427] text-black shadow-[0_0_10px_rgba(210,245,58,0.2)]'
                                : 'bg-[#c35626] hover:bg-[#a8471d] text-white'
                            }`}
                          >
                            {isJustAdded ? (
                              <Check className="w-3 h-3 stroke-[3]" />
                            ) : (
                              <ShoppingBag className="w-3 h-3" />
                            )}
                            <span>{isInCart ? '+1' : 'Trolley'}</span>
                          </button>

                          {isInCart && onRemoveFromCart && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveFromCart(product.id);
                              }}
                              className="p-2 rounded-xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-all cursor-pointer active:scale-95"
                              title="Remove from trolley"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* 6. BOTTOM ELEVATOR NAVIGATOR & ATELIER RETURN */}
        <section
          className={`rounded-3xl border p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-colors ${
            isDark ? 'bg-[#140e09] border-[#2f2015]' : 'bg-[#faf4ec] border-[#ded4c3]'
          }`}
        >
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-mono text-[#8c7b6d]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>HANDCRAFTED IN HYDERABAD • BESPOKE CUSTOMIZATIONS AVAILABLE</span>
            </div>
            <h3
              className="text-xl sm:text-2xl font-black tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Explore another level of the VINKRI Atelier
            </h3>
            <p
              className={`text-xs sm:text-sm ${
                isDark ? 'text-[#b3a191]' : 'text-[#69584b]'
              }`}
            >
              Ride the atelier elevator between levels or return to the exterior glass facade view.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onBackToBuilding}
              className={`px-5 py-3 rounded-xl border font-mono text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 active:scale-95 ${
                isDark
                  ? 'bg-[#1f150e] hover:bg-[#2b1d13] border-[#382618] text-white hover:text-[#d2f53a]'
                  : 'bg-white hover:bg-[#ede3d3] border-[#ded4c3] text-[#2c2016] hover:text-[#c35626]'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Exterior Building</span>
            </button>

            {/* Next Floor Shortcut */}
            {floor.numeric > 1 && (
              <button
                onClick={() => handleElevatorClick(floor.numeric - 1)}
                className={`px-5 py-3 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 active:scale-95 shadow-md ${
                  isDark
                    ? 'bg-[#d2f53a] hover:bg-[#bce427] text-black shadow-[0_0_15px_rgba(210,245,58,0.25)]'
                    : 'bg-[#c35626] hover:bg-[#a8471d] text-white'
                }`}
              >
                <span>Descend to Level 0{floor.numeric - 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {floor.numeric === 1 && (
              <button
                onClick={() => handleElevatorClick(5)}
                className={`px-5 py-3 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 active:scale-95 shadow-md ${
                  isDark
                    ? 'bg-[#d2f53a] hover:bg-[#bce427] text-black shadow-[0_0_15px_rgba(210,245,58,0.25)]'
                    : 'bg-[#c35626] hover:bg-[#a8471d] text-white'
                }`}
              >
                <span>Ascend to Level 05 (Desk Toys)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};
