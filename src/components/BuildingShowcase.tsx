import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Play, ShoppingBag, Check } from 'lucide-react';
import { FloorInfo, Product, ThemeMode } from '../types';
import { FLOORS_DATA, PRODUCTS_DATA } from '../data/products';

interface BuildingShowcaseProps {
  theme: ThemeMode;
  onSelectFloor?: (floor: FloorInfo, slot?: 'left' | 'center' | 'right', productId?: string) => void;
  selectedFloorNumber?: number | null;
  onSelectProduct?: (product: Product) => void;
  onQuickAdd?: (product: Product) => void;
  onOpenStorePhilosophy?: () => void;
  wishlistIds?: string[];
  onToggleWishlist?: (productId: string) => void;
  cartProductIds?: string[];
  onRemoveFromCart?: (productId: string) => void;
  isEntranceOpen?: boolean;
}

interface BuildingSlice {
  id: string;
  floorNumber?: number; // 5, 4, 3, 2, 1
  name: string;
  category: string;
  tagline: string;
  tabColor: string;
  tabBorder: string;
  height: number; // in pixels on 656px width
  lightSrc: string;
  darkSrc: string;
}

// 7 exact slices forming the 656 x 768px architectural building cabinet
const BUILDING_SLICES: BuildingSlice[] = [
  {
    id: 'roof',
    name: 'ROOF PARAPET',
    category: '',
    tagline: '',
    tabColor: '#334155',
    tabBorder: '#475569',
    height: 44,
    lightSrc: '/assets/aistudio/crops/light_roof.jpg',
    darkSrc: '/assets/aistudio/crops/dark_roof.jpg'
  },
  {
    id: 'floor5',
    floorNumber: 5,
    name: 'LEVEL 05',
    category: 'DESK TOYS',
    tagline: 'Play. Fidget. Display.',
    tabColor: '#1e40af',
    tabBorder: '#3b82f6',
    height: 118,
    lightSrc: '/assets/aistudio/crops/light_floor5.jpg',
    darkSrc: '/assets/aistudio/crops/dark_floor5.jpg'
  },
  {
    id: 'floor4',
    floorNumber: 4,
    name: 'LEVEL 04',
    category: 'CUSTOM DIORAMAS',
    tagline: 'Mini worlds. Big stories.',
    tabColor: '#047857',
    tabBorder: '#10b981',
    height: 122,
    lightSrc: '/assets/aistudio/crops/light_floor4.jpg',
    darkSrc: '/assets/aistudio/crops/dark_floor4.jpg'
  },
  {
    id: 'floor3',
    floorNumber: 3,
    name: 'LEVEL 03',
    category: 'DIECAST CAR STANDS',
    tagline: 'Display. Organize. Collect.',
    tabColor: '#b45309',
    tabBorder: '#f59e0b',
    height: 104,
    lightSrc: '/assets/aistudio/crops/light_floor3.jpg',
    darkSrc: '/assets/aistudio/crops/dark_floor3.jpg'
  },
  {
    id: 'floor2',
    floorNumber: 2,
    name: 'LEVEL 02',
    category: 'CUSTOM FIGURINES',
    tagline: 'People. Moments. Memories.',
    tabColor: '#881337',
    tabBorder: '#f43f5e',
    height: 114,
    lightSrc: '/assets/aistudio/crops/light_floor2.jpg',
    darkSrc: '/assets/aistudio/crops/dark_floor2.jpg'
  },
  {
    id: 'floor1',
    floorNumber: 1,
    name: 'LEVEL 01',
    category: 'DECOR LAMPS',
    tagline: 'Light up your space.',
    tabColor: '#92400e',
    tabBorder: '#d97706',
    height: 124,
    lightSrc: '/assets/aistudio/crops/light_floor1.jpg',
    darkSrc: '/assets/aistudio/crops/dark_floor1.jpg'
  },
  {
    id: 'ground',
    name: 'GROUND ATELIER',
    category: '',
    tagline: '',
    tabColor: '#1c1917',
    tabBorder: '#44403c',
    height: 142,
    lightSrc: '/assets/aistudio/crops/light_ground.jpg',
    darkSrc: '/assets/aistudio/crops/dark_ground.jpg'
  }
];

interface NicheCellProps {
  prod?: Product;
  index: number;
  isDark: boolean;
  isHovered: boolean;
  justAddedId: string | null;
  hasError: boolean;
  onHover: (idx: number | null) => void;
  onSelect?: (prod: Product) => void;
  onQuickAdd: (prod: Product, e: React.MouseEvent) => void;
  onImageError: (id: string) => void;
}

const NicheCell: React.FC<NicheCellProps> = ({
  prod,
  index,
  isDark,
  isHovered,
  justAddedId,
  hasError,
  onHover,
  onSelect,
  onQuickAdd,
  onImageError
}) => {
  if (!prod) return <div className="flex-1" />;

  return (
    <div
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect && onSelect(prod)}
      className="group/niche relative flex-1 h-full mx-1 flex items-center justify-center p-1.5 cursor-pointer"
    >
      {/* Unified Studio-Graded Recessed Display Bay */}
      <div
        className={`relative w-full h-full rounded-lg overflow-hidden flex items-center justify-center border transition-all duration-300 ${
          isDark
            ? 'bg-[#17100b] border-[#3a2719]/80 group-hover/niche:border-[#e5a045]/70 shadow-[inset_0_1px_14px_rgba(0,0,0,0.65)]'
            : 'bg-[#eee4d6] border-[#d6c5b0] group-hover/niche:border-[#c35626]/70 shadow-[inset_0_1px_10px_rgba(85,60,35,0.12)]'
        }`}
      >
        {!hasError ? (
          <>
            {/* Ambient Tonal Extension Backdrop (unifies aspect ratios & studio tones) */}
            <img
              src={prod.imageThumbnail}
              alt=""
              aria-hidden="true"
              referrerPolicy="no-referrer"
              className={`absolute inset-0 w-full h-full object-cover scale-125 blur-md transition-opacity duration-300 pointer-events-none select-none ${
                isDark
                  ? 'opacity-40 brightness-[0.52] contrast-[1.08] saturate-[0.88] sepia-[0.12]'
                  : 'opacity-45 brightness-[0.95] contrast-[1.02] saturate-[0.9] sepia-[0.06]'
              }`}
            />

            {/* Crisp Foreground Studio Product Photography with Balanced Color LUT */}
            <img
              src={prod.imageThumbnail}
              alt={prod.name}
              referrerPolicy="no-referrer"
              onError={() => onImageError(prod.id)}
              className={`relative z-10 max-h-[92%] max-w-[90%] object-contain select-none transition-transform duration-300 group-hover/niche:scale-105 ${
                isDark
                  ? 'brightness-[0.90] contrast-[1.06] saturate-[0.94] sepia-[0.07]'
                  : 'brightness-[1.03] contrast-[1.04] saturate-[1.05]'
              }`}
            />

            {/* Measured Architectural Vignette & Warm Rim Scrim */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 z-20 ${
                isDark
                  ? 'bg-[radial-gradient(ellipse_at_center,transparent_48%,rgba(14,8,5,0.58)_100%)]'
                  : 'bg-[radial-gradient(ellipse_at_center,transparent_58%,rgba(120,92,64,0.16)_100%)]'
              }`}
            />
          </>
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center p-2 text-center ${
              isDark ? 'bg-[#1a110b] text-[#e5a045]' : 'bg-[#f4ecdf] text-[#c35626]'
            }`}
          >
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider line-clamp-2">
              {prod.name}
            </span>
          </div>
        )}

        {/* Hover Name, Price & Quick-Add Bar */}
        <div
          className={`absolute bottom-1.5 left-1.5 right-1.5 px-2 py-1 rounded-md backdrop-blur-md transition-all duration-200 border flex items-center justify-between gap-1.5 shadow-md z-30 ${
            isHovered
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2 pointer-events-none'
          } ${
            isDark
              ? 'bg-[#160e08]/92 text-[#f5efe6] border-[#e5a045]/50'
              : 'bg-[#faf6f0]/95 text-[#1e140d] border-[#c35626]/40'
          }`}
        >
          <span className="text-[8.5px] font-bold truncate">
            {prod.name}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className={`text-[8.5px] font-mono font-black tabular-nums ${
                isDark ? 'text-[#e5a045]' : 'text-[#c35626]'
              }`}
            >
              ₹{prod.price.toLocaleString('en-IN')}
            </span>

            <button
              type="button"
              onClick={(e) => onQuickAdd(prod, e)}
              className={`p-1 rounded text-[7px] font-bold uppercase transition-colors cursor-pointer ${
                justAddedId === prod.id
                  ? isDark
                    ? 'bg-[#d2f53a] text-black'
                    : 'bg-[#2c1e13] text-white'
                  : isDark
                  ? 'bg-[#e5a045] hover:bg-[#f0b35e] text-black'
                  : 'bg-[#c35626] hover:bg-[#a84419] text-white'
              }`}
              title="Quick Add to Cart"
              aria-label={`Quick add ${prod.name}`}
            >
              {justAddedId === prod.id ? (
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              ) : (
                <ShoppingBag className="w-2.5 h-2.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const BuildingShowcase: React.FC<BuildingShowcaseProps> = ({
  theme,
  onSelectFloor,
  selectedFloorNumber,
  onSelectProduct,
  onQuickAdd
}) => {
  const isDark = theme === 'rustic-dark';
  const containerRef = useRef<HTMLDivElement>(null);

  // Active floor number (1 to 5, default: 3 matching reference video hero)
  const [activeFloor, setActiveFloor] = useState<number>(3);

  // Whether drop down is expanded (false = intact 5-story cabinet, true = drop down state)
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Hovered floor number when cabinet is intact
  const [hoveredFloor, setHoveredFloor] = useState<number | null>(null);

  // Hovered product niche index (0 to 8)
  const [hoveredProductIndex, setHoveredProductIndex] = useState<number | null>(null);

  // Quick-add feedback
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Track any broken product images
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Synchronize when selectedFloorNumber changes externally
  useEffect(() => {
    if (selectedFloorNumber !== undefined && selectedFloorNumber !== null) {
      setActiveFloor(selectedFloorNumber);
      setIsExpanded(true);
    }
  }, [selectedFloorNumber]);

  const handleToggleFloor = (floorNum?: number) => {
    if (floorNum !== undefined) {
      if (activeFloor === floorNum && isExpanded) {
        setIsExpanded(false);
        return;
      }
      setActiveFloor(floorNum);
      setIsExpanded(true);
      const floorInfo = FLOORS_DATA.find((f) => f.numeric === floorNum);
      if (floorInfo && onSelectFloor) onSelectFloor(floorInfo);
      return;
    }

    setIsExpanded((prev) => {
      const next = !prev;
      if (next) {
        const floorInfo = FLOORS_DATA.find((f) => f.numeric === activeFloor);
        if (floorInfo && onSelectFloor) onSelectFloor(floorInfo);
      }
      return next;
    });
  };

  const handleReplaySequence = () => {
    setIsExpanded(false);
    setTimeout(() => {
      setIsExpanded(true);
    }, 900);
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickAdd) onQuickAdd(product);
    setJustAddedId(product.id);
    setTimeout(() => setJustAddedId(null), 1400);
  };

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  const activeIndex = BUILDING_SLICES.findIndex((s) => s.floorNumber === activeFloor);
  const safeActiveIndex = activeIndex >= 0 ? activeIndex : 3;

  const upperSlices = BUILDING_SLICES.slice(0, safeActiveIndex);
  const heroSlice = BUILDING_SLICES[safeActiveIndex];
  const lowerSlices = BUILDING_SLICES.slice(safeActiveIndex + 1);

  const allFloorProducts = PRODUCTS_DATA.filter((p) => p.floorNumber === activeFloor);
  const nicheProducts = allFloorProducts.slice(0, 9);

  const row1Products = nicheProducts.slice(0, 3);
  const row2Products = nicheProducts.slice(3, 6);
  const row3Products = nicheProducts.slice(6, 9);

  return (
    <div
      ref={containerRef}
      className="relative w-full flex flex-col items-center select-none font-sans"
    >
      {/* ============================================================== */}
      {/* 1. TOP INTERACTIVE CONTROLLER BAR                              */}
      {/* Harmonized Color Grading & Clean Floor Switcher                */}
      {/* ============================================================== */}
      <div
        className={`w-full max-w-[656px] mb-3 px-3 py-2 rounded-xl flex flex-wrap items-center justify-between gap-2 border transition-all duration-300 shadow-sm ${
          isDark
            ? 'bg-[#150e09] border-[#2e2015] text-[#f7f2ea]'
            : 'bg-[#f6efe5] border-[#decbb8] text-[#2c1e13]'
        }`}
      >
        {/* Toggle / Reassemble Button */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleToggleFloor()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-95 whitespace-nowrap ${
              isExpanded
                ? isDark
                  ? 'bg-[#e5a045] hover:bg-[#f0b35e] text-black font-black'
                  : 'bg-[#c35626] hover:bg-[#a84419] text-white font-black'
                : isDark
                ? 'bg-[#25170e] hover:bg-[#352215] text-[#f5c27d] border border-[#4a2f1c]'
                : 'bg-white hover:bg-[#fbf7f1] text-[#2c1e13] border border-[#d8c4ae]'
            }`}
          >
            <RotateCcw className={`w-3 h-3 transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`} />
            <span>{isExpanded ? 'Reassemble Cabinet' : 'Click Floor to Open'}</span>
          </button>

          {/* Active floor category label */}
          <span className={`hidden sm:inline text-[10px] font-mono font-semibold tracking-wide whitespace-nowrap ${
            isDark ? 'text-[#cbb7a1]' : 'text-[#635040]'
          }`}>
            {heroSlice.name} · {heroSlice.category}
          </span>
        </div>

        {/* Floor Selection Tabs (05 - 01) */}
        <div className="flex items-center gap-1 flex-wrap">
          {[5, 4, 3, 2, 1].map((floorNum) => {
            const isActive = activeFloor === floorNum && isExpanded;
            const slice = BUILDING_SLICES.find((s) => s.floorNumber === floorNum);

            return (
              <button
                key={floorNum}
                type="button"
                onClick={() => handleToggleFloor(floorNum)}
                className={`px-2 py-1 rounded text-[9.5px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95 whitespace-nowrap ${
                  isActive
                    ? isDark
                      ? 'bg-[#e5a045] text-black shadow-sm font-black'
                      : 'bg-[#c35626] text-white shadow-sm font-black'
                    : isDark
                    ? 'bg-[#20140c] text-[#c2b09e] hover:text-white hover:bg-[#301f13] border border-[#342316]'
                    : 'bg-white text-[#69584b] hover:text-[#1e140d] hover:bg-[#faf5ed] border border-[#decbb8]'
                }`}
                title={`Floor 0${floorNum}: ${slice?.category || ''}`}
              >
                <span className="tabular-nums">0{floorNum}</span>
                <span className="hidden md:inline text-[8.5px] font-semibold opacity-85 uppercase">
                  {floorNum === 5 ? 'TOYS' : floorNum === 4 ? 'DIORAMA' : floorNum === 3 ? 'CARS' : floorNum === 2 ? 'FIGURES' : 'LAMPS'}
                </span>
              </button>
            );
          })}

          {/* Sequence Replay */}
          <button
            type="button"
            onClick={handleReplaySequence}
            className={`p-1.5 ml-0.5 rounded border transition-colors cursor-pointer active:scale-95 ${
              isDark
                ? 'bg-[#20140c] text-[#b4a08d] hover:text-white border-[#342316]'
                : 'bg-white text-[#69584b] hover:text-[#1e140d] border-[#decbb8]'
            }`}
            title="Replay Drop Down Animation"
            aria-label="Replay drop down animation"
          >
            <Play className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. THE 656PX ARCHITECTURAL BUILDING VIEWPORT                    */}
      {/* ============================================================== */}
      <div
        className={`relative w-full max-w-[656px] rounded-2xl overflow-hidden border transition-all duration-300 shadow-2xl ${
          isDark
            ? 'bg-[#0d0805] border-[#332216] shadow-[0_24px_60px_rgba(0,0,0,0.85)]'
            : 'bg-[#f4ece1] border-[#decbb8] shadow-[0_20px_50px_rgba(110,72,38,0.14)]'
        }`}
      >
        <div className="relative w-full flex flex-col items-center">
          {/* ----------------------------------------------------------- */}
          {/* SECTION A: UPPER SLICES (SLIDE UP ON EXPAND)                */}
          {/* ----------------------------------------------------------- */}
          <motion.div
            initial={false}
            animate={{
              y: isExpanded ? -450 : 0,
              opacity: isExpanded ? 0 : 1,
              height: isExpanded ? 0 : 'auto'
            }}
            transition={{
              duration: 0.75,
              ease: [0.25, 1, 0.5, 1]
            }}
            className="w-full overflow-hidden origin-top select-none pointer-events-none"
            style={{ width: '656px', maxWidth: '100%' }}
          >
            {upperSlices.map((slice) => (
              <img
                key={slice.id}
                src={isDark ? slice.darkSrc : slice.lightSrc}
                alt={slice.name}
                className={`w-full h-auto block select-none ${
                  isDark
                    ? 'brightness-[0.96] contrast-[1.04] saturate-[0.96]'
                    : 'brightness-[1.01] contrast-[1.02]'
                }`}
                style={{ aspectRatio: `656 / ${slice.height}` }}
              />
            ))}
          </motion.div>

          {/* ----------------------------------------------------------- */}
          {/* SECTION B: HERO PRODUCT SHOWCASE (ACTIVE FLOOR)             */}
          {/* ----------------------------------------------------------- */}
          <div
            onClick={() => handleToggleFloor()}
            className="group/shelf relative w-full z-30 select-none cursor-pointer"
            style={{ width: '656px', maxWidth: '100%' }}
            title={isExpanded ? 'Click to reassemble cabinet' : 'Click to open floor showcase'}
          >
            <img
              src={isDark ? heroSlice.darkSrc : heroSlice.lightSrc}
              alt={`${heroSlice.name} Showcase`}
              className={`w-full h-auto block select-none pointer-events-none transition-[filter] duration-300 group-hover/shelf:brightness-105 ${
                isDark
                  ? 'brightness-[0.96] contrast-[1.04] saturate-[0.96]'
                  : 'brightness-[1.01] contrast-[1.02]'
              }`}
              style={{ aspectRatio: `656 / ${heroSlice.height}` }}
            />

            {/* Balanced Bottom-Edge Scrim & Clean Action Pill */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-80 group-hover/shelf:opacity-100 transition-opacity flex items-end justify-between px-3.5 pb-2 pointer-events-none">
              <span
                className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded backdrop-blur-md border ${
                  isDark
                    ? 'bg-[#160e08]/88 text-[#f2dcc0] border-[#e5a045]/45'
                    : 'bg-[#2a1c12]/85 text-[#faf6f0] border-white/25'
                }`}
              >
                {heroSlice.name} · {heroSlice.category}
              </span>

              <span
                className={`text-[8.5px] font-mono font-bold tracking-wider px-2.5 py-0.5 rounded backdrop-blur-md border transition-all ${
                  isExpanded
                    ? isDark
                      ? 'bg-[#1a110a]/90 text-[#e5a045] border-[#e5a045]/55'
                      : 'bg-[#2c1e13]/90 text-[#faf6f0] border-[#decbb8]/40'
                    : 'opacity-0 group-hover/shelf:opacity-100 ' +
                      (isDark
                        ? 'bg-[#e5a045] text-black border-[#e5a045]'
                        : 'bg-[#c35626] text-white border-[#a84419]')
                }`}
              >
                {isExpanded ? 'REASSEMBLE ↺' : 'OPEN FLOOR ▾'}
              </span>
            </div>
          </div>

          {/* Slim Architectural Fascia Bar when Expanded (replaces duplicate tabs) */}
          {isExpanded && (
            <div
              className={`w-full py-1.5 px-3.5 flex items-center justify-between border-y z-25 transition-colors ${
                isDark
                  ? 'bg-[#160e09] border-[#342316] text-[#d6c2ab]'
                  : 'bg-[#efe6da] border-[#d6c3ad] text-[#4b3a2b]'
              }`}
              style={{ width: '656px', maxWidth: '100%' }}
            >
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider">
                {heroSlice.name} · {nicheProducts.length} Studio Pieces
              </span>
              <span className="text-[9px] font-mono opacity-80">
                Hover to preview · Click any piece for full view
              </span>
            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* SECTION C: THE 3-ROW SUSPENDED GANTRY                       */}
          {/* Unified Color-Graded Timber & Studio Lightbox Alcoves       */}
          {/* ----------------------------------------------------------- */}
          <motion.div
            initial={false}
            animate={{
              height: isExpanded ? 'auto' : 0,
              opacity: isExpanded ? 1 : 0
            }}
            transition={{
              duration: 0.65,
              ease: [0.25, 1, 0.5, 1]
            }}
            className="relative w-full overflow-hidden z-20"
            style={{ width: '656px', maxWidth: '100%' }}
          >
            {/* Architectural Wooden Cabinet SVG Structure (656 x 328) */}
            <svg
              viewBox="0 0 656 328"
              className="w-full h-auto block select-none"
              style={{ aspectRatio: '656 / 328' }}
            >
              <defs>
                {/* Light Mode Travertine & Oak Wood Gradients */}
                <linearGradient id="lightWoodBeam" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#d9c8b6" />
                  <stop offset="45%" stopColor="#c1aa92" />
                  <stop offset="100%" stopColor="#947c65" />
                </linearGradient>
                <linearGradient id="lightWoodPost" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#947c65" />
                  <stop offset="30%" stopColor="#d9c8b6" />
                  <stop offset="70%" stopColor="#c1aa92" />
                  <stop offset="100%" stopColor="#856e57" />
                </linearGradient>

                {/* Dark Mode Warm Roasted Walnut Gradients */}
                <linearGradient id="darkWoodBeam" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#462d1c" />
                  <stop offset="45%" stopColor="#2c1b10" />
                  <stop offset="100%" stopColor="#160c06" />
                </linearGradient>
                <linearGradient id="darkWoodPost" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#160c06" />
                  <stop offset="30%" stopColor="#462d1c" />
                  <stop offset="70%" stopColor="#2c1b10" />
                  <stop offset="100%" stopColor="#140a05" />
                </linearGradient>

                {/* Recessed Alcove Warm Cove Wash */}
                <radialGradient id="nicheCoveDark" cx="50%" cy="22%" r="72%">
                  <stop offset="0%" stopColor="#3c2616" stopOpacity="0.85" />
                  <stop offset="65%" stopColor="#1a110b" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#100a06" stopOpacity="1" />
                </radialGradient>
                <radialGradient id="nicheCoveLight" cx="50%" cy="22%" r="72%">
                  <stop offset="0%" stopColor="#fcf7ef" stopOpacity="1" />
                  <stop offset="70%" stopColor="#efe5d7" stopOpacity="1" />
                  <stop offset="100%" stopColor="#e2d4c2" stopOpacity="1" />
                </radialGradient>
              </defs>

              {/* Top Beam */}
              <rect x="0" y="0" width="656" height="8" fill={isDark ? 'url(#darkWoodBeam)' : 'url(#lightWoodBeam)'} />

              {/* ROW 1 (y: 8..104, h: 96) */}
              <rect x="14" y="8" width="202" height="96" fill={isDark ? 'url(#nicheCoveDark)' : 'url(#nicheCoveLight)'} />
              <rect x="226" y="8" width="204" height="96" fill={isDark ? 'url(#nicheCoveDark)' : 'url(#nicheCoveLight)'} />
              <rect x="440" y="8" width="202" height="96" fill={isDark ? 'url(#nicheCoveDark)' : 'url(#nicheCoveLight)'} />
              <rect x="0" y="8" width="14" height="96" fill={isDark ? 'url(#darkWoodPost)' : 'url(#lightWoodPost)'} />
              <rect x="642" y="8" width="14" height="96" fill={isDark ? 'url(#darkWoodPost)' : 'url(#lightWoodPost)'} />
              <rect x="216" y="8" width="10" height="96" fill={isDark ? 'url(#darkWoodPost)' : 'url(#lightWoodPost)'} />
              <rect x="430" y="8" width="10" height="96" fill={isDark ? 'url(#darkWoodPost)' : 'url(#lightWoodPost)'} />

              {/* Middle Beam 1 */}
              <rect x="0" y="104" width="656" height="8" fill={isDark ? 'url(#darkWoodBeam)' : 'url(#lightWoodBeam)'} />

              {/* ROW 2 (y: 112..208, h: 96) */}
              <rect x="14" y="112" width="202" height="96" fill={isDark ? 'url(#nicheCoveDark)' : 'url(#nicheCoveLight)'} />
              <rect x="226" y="112" width="204" height="96" fill={isDark ? 'url(#nicheCoveDark)' : 'url(#nicheCoveLight)'} />
              <rect x="440" y="112" width="202" height="96" fill={isDark ? 'url(#nicheCoveDark)' : 'url(#nicheCoveLight)'} />
              <rect x="0" y="112" width="14" height="96" fill={isDark ? 'url(#darkWoodPost)' : 'url(#lightWoodPost)'} />
              <rect x="642" y="112" width="14" height="96" fill={isDark ? 'url(#darkWoodPost)' : 'url(#lightWoodPost)'} />
              <rect x="216" y="112" width="10" height="96" fill={isDark ? 'url(#darkWoodPost)' : 'url(#lightWoodPost)'} />
              <rect x="430" y="112" width="10" height="96" fill={isDark ? 'url(#darkWoodPost)' : 'url(#lightWoodPost)'} />

              {/* Middle Beam 2 */}
              <rect x="0" y="208" width="656" height="8" fill={isDark ? 'url(#darkWoodBeam)' : 'url(#lightWoodBeam)'} />

              {/* ROW 3 (y: 216..312, h: 96) */}
              <rect x="14" y="216" width="202" height="96" fill={isDark ? 'url(#nicheCoveDark)' : 'url(#nicheCoveLight)'} />
              <rect x="226" y="216" width="204" height="96" fill={isDark ? 'url(#nicheCoveDark)' : 'url(#nicheCoveLight)'} />
              <rect x="440" y="216" width="202" height="96" fill={isDark ? 'url(#nicheCoveDark)' : 'url(#nicheCoveLight)'} />
              <rect x="0" y="216" width="14" height="96" fill={isDark ? 'url(#darkWoodPost)' : 'url(#lightWoodPost)'} />
              <rect x="642" y="216" width="14" height="96" fill={isDark ? 'url(#darkWoodPost)' : 'url(#lightWoodPost)'} />
              <rect x="216" y="216" width="10" height="96" fill={isDark ? 'url(#darkWoodPost)' : 'url(#lightWoodPost)'} />
              <rect x="430" y="216" width="10" height="96" fill={isDark ? 'url(#darkWoodPost)' : 'url(#lightWoodPost)'} />

              {/* Bottom Foundation Beam */}
              <rect x="0" y="312" width="656" height="16" fill={isDark ? 'url(#darkWoodBeam)' : 'url(#lightWoodBeam)'} />
            </svg>

            {/* Product Compartments in All 3 Rows */}
            <div className="absolute inset-0 z-25 pointer-events-none">
              {/* ROW 1: Products 0, 1, 2 (Drop Down Entrance) */}
              <motion.div
                initial={false}
                animate={{
                  y: isExpanded ? 0 : -60,
                  opacity: isExpanded ? 1 : 0
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.25, 1, 0.5, 1],
                  delay: 0.12
                }}
                className="absolute flex items-center justify-between pointer-events-auto"
                style={{
                  top: '2.44%', // 8 / 328
                  height: '29.27%', // 96 / 328
                  left: '2.13%', // 14 / 656
                  right: '2.13%'
                }}
              >
                {[0, 1, 2].map((i) => (
                  <NicheCell
                    key={row1Products[i]?.id || `r1-${i}`}
                    prod={row1Products[i]}
                    index={i}
                    isDark={isDark}
                    isHovered={hoveredProductIndex === i}
                    justAddedId={justAddedId}
                    hasError={!!(row1Products[i] && failedImages[row1Products[i].id])}
                    onHover={setHoveredProductIndex}
                    onSelect={onSelectProduct}
                    onQuickAdd={handleQuickAdd}
                    onImageError={handleImageError}
                  />
                ))}
              </motion.div>

              {/* ROW 2: Products 3, 4, 5 */}
              <div
                className="absolute flex items-center justify-between pointer-events-auto"
                style={{
                  top: '34.15%', // 112 / 328
                  height: '29.27%', // 96 / 328
                  left: '2.13%',
                  right: '2.13%'
                }}
              >
                {[0, 1, 2].map((idx) => {
                  const i = idx + 3;
                  const prod = row2Products[idx];
                  return (
                    <NicheCell
                      key={prod?.id || `r2-${i}`}
                      prod={prod}
                      index={i}
                      isDark={isDark}
                      isHovered={hoveredProductIndex === i}
                      justAddedId={justAddedId}
                      hasError={!!(prod && failedImages[prod.id])}
                      onHover={setHoveredProductIndex}
                      onSelect={onSelectProduct}
                      onQuickAdd={handleQuickAdd}
                      onImageError={handleImageError}
                    />
                  );
                })}
              </div>

              {/* ROW 3: Products 6, 7, 8 */}
              <div
                className="absolute flex items-center justify-between pointer-events-auto"
                style={{
                  top: '65.85%', // 216 / 328
                  height: '29.27%', // 96 / 328
                  left: '2.13%',
                  right: '2.13%'
                }}
              >
                {[0, 1, 2].map((idx) => {
                  const i = idx + 6;
                  const prod = row3Products[idx];
                  return (
                    <NicheCell
                      key={prod?.id || `r3-${i}`}
                      prod={prod}
                      index={i}
                      isDark={isDark}
                      isHovered={hoveredProductIndex === i}
                      justAddedId={justAddedId}
                      hasError={!!(prod && failedImages[prod.id])}
                      onHover={setHoveredProductIndex}
                      onSelect={onSelectProduct}
                      onQuickAdd={handleQuickAdd}
                      onImageError={handleImageError}
                    />
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* ----------------------------------------------------------- */}
          {/* SECTION D: LOWER SLICES (SLIDE DOWN ON EXPAND)              */}
          {/* ----------------------------------------------------------- */}
          <motion.div
            initial={false}
            animate={{
              y: isExpanded ? 450 : 0,
              opacity: isExpanded ? 0 : 1,
              height: isExpanded ? 0 : 'auto'
            }}
            transition={{
              duration: 0.75,
              ease: [0.25, 1, 0.5, 1]
            }}
            className="w-full overflow-hidden origin-top select-none pointer-events-none"
            style={{ width: '656px', maxWidth: '100%' }}
          >
            {lowerSlices.map((slice) => (
              <img
                key={slice.id}
                src={isDark ? slice.darkSrc : slice.lightSrc}
                alt={slice.name}
                className={`w-full h-auto block select-none ${
                  isDark
                    ? 'brightness-[0.96] contrast-[1.04] saturate-[0.96]'
                    : 'brightness-[1.01] contrast-[1.02]'
                }`}
                style={{ aspectRatio: `656 / ${slice.height}` }}
              />
            ))}
          </motion.div>

          {/* =========================================================== */}
          {/* 3. INTACT-STATE INTERACTIVE FLOOR OVERLAY                   */}
          {/* =========================================================== */}
          {!isExpanded && (
            <div className="absolute inset-0 z-40 pointer-events-auto">
              {/* Top prompt */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none px-3 py-1 rounded-full backdrop-blur-md border text-[8.5px] font-mono font-bold uppercase tracking-widest shadow-md bg-black/65 text-[#f3cfa0] border-[#e5a045]/40 whitespace-nowrap">
                Click Any Floor to Open Showcase
              </div>

              {/* Exact Floor Hit Areas */}
              {[
                { floor: 5, top: '5.73%', height: '15.36%', slice: BUILDING_SLICES[1] },
                { floor: 4, top: '21.09%', height: '15.89%', slice: BUILDING_SLICES[2] },
                { floor: 3, top: '36.98%', height: '13.54%', slice: BUILDING_SLICES[3] },
                { floor: 2, top: '50.52%', height: '14.84%', slice: BUILDING_SLICES[4] },
                { floor: 1, top: '65.36%', height: '16.15%', slice: BUILDING_SLICES[5] }
              ].map(({ floor, top, height, slice }) => {
                const isHovered = hoveredFloor === floor;

                return (
                  <div
                    key={floor}
                    onMouseEnter={() => setHoveredFloor(floor)}
                    onMouseLeave={() => setHoveredFloor(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFloor(floor);
                    }}
                    onTouchEnd={(e) => {
                      e.stopPropagation();
                      handleToggleFloor(floor);
                    }}
                    className="absolute left-0 right-0 cursor-pointer group/fl-zone transition-all duration-200 flex items-center justify-between px-3 select-none"
                    style={{ top, height }}
                    title={`Click to open ${slice.name}: ${slice.category}`}
                  >
                    {/* Hover highlight bounding box */}
                    <div
                      className={`absolute inset-x-2 inset-y-1 rounded-xl pointer-events-none transition-all duration-200 border ${
                        isHovered
                          ? isDark
                            ? 'bg-[#e5a045]/18 border-[#e5a045] shadow-[0_0_24px_rgba(229,160,69,0.3)]'
                            : 'bg-[#c35626]/16 border-[#c35626] shadow-[0_0_24px_rgba(195,86,38,0.28)]'
                          : 'border-transparent bg-black/0 hover:bg-black/5'
                      }`}
                    />

                    {/* Left: Floor Category Badge */}
                    <div
                      className={`relative z-10 px-2.5 py-1.5 rounded-md backdrop-blur-md transition-all duration-200 border flex flex-col shadow-sm ${
                        isHovered ? 'scale-105 shadow-md ring-1 ring-white/30' : 'opacity-90'
                      }`}
                      style={{
                        backgroundColor: `${slice.tabColor}dd`,
                        borderColor: slice.tabBorder,
                        color: '#ffffff'
                      }}
                    >
                      <span className="text-[8.5px] font-mono font-black tracking-wider text-white/90">
                        0{floor} · FLOOR
                      </span>
                      <span className="text-[9.5px] font-black tracking-tight leading-none mt-0.5">
                        {slice.category}
                      </span>
                      <span className="text-[7.5px] font-medium opacity-85 leading-tight mt-0.5">
                        {slice.tagline}
                      </span>
                    </div>

                    {/* Right: Floor Indicator + Action Prompt */}
                    <div className="relative z-10 flex items-center gap-2">
                      {isHovered && (
                        <div
                          className={`px-2.5 py-1 rounded-md backdrop-blur-md transition-all duration-200 text-[8.5px] font-mono font-black tracking-wider border shadow-md ${
                            isDark
                              ? 'bg-[#e5a045] text-black border-[#e5a045]'
                              : 'bg-[#c35626] text-white border-[#a84419]'
                          }`}
                        >
                          OPEN FLOOR ▾
                        </div>
                      )}

                      <div className="px-2 py-1 rounded text-[8.5px] font-mono font-black tracking-wider border shadow-sm bg-black/70 text-white/90 border-white/20">
                        0{floor} FLOOR
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
