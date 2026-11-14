import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Play, ShoppingBag, Check } from 'lucide-react';
import { FloorInfo, Product, ThemeMode } from '../types';
import { FLOORS_DATA, PRODUCTS_DATA } from '../data/products';

interface BuildingShowcaseProps {
  theme: ThemeMode;
  onSelectFloor?: (floor: FloorInfo, slot?: 'left' | 'center' | 'right', productId?: string) => void;
  onCollapseFloor?: () => void;
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
    height: 77,
    lightSrc: '/assets/aistudio/crops/light_floor1.jpg?v=2',
    darkSrc: '/assets/aistudio/crops/dark_floor1.jpg?v=2'
  },
  {
    id: 'ground',
    name: 'GROUND ATELIER',
    category: '',
    tagline: '',
    tabColor: '#1c1917',
    tabBorder: '#44403c',
    height: 189,
    lightSrc: '/assets/aistudio/crops/light_ground.jpg?v=2',
    darkSrc: '/assets/aistudio/crops/dark_ground.jpg?v=2'
  }
];

// Bottom trim (as % of 656px width) so active hero floor ends right on its horizontal cornice beam when expanded
const HERO_BOTTOM_TRIM_PCT: Record<number, number> = {
  5: 0.35, // trims 2px floor4 ceiling glow below dark beam
  4: 2.06, // trims 13.5px floor3 top fascia so floor4 ends cleanly on its cornice
  3: 0.62, // trims 4px floor2 glow below beam
  2: 0.78, // trims 5px lower trim below beam
  1: 0     // floor1 ends in glowing window; uses photographic cornice cap above Row 1
};

interface ArchThemeMetrics {
  leftSkyEnd: number;
  rightSkyStart: number;
  skyLeftColor: string;
  skyRightColor: string;
  bays: Array<{ x: number; width: number; leftPct: string; widthPct: string }>;
  outerPosts: Array<{
    x: number;
    width: number;
    limestoneX?: number;
    limestoneW?: number;
    oakX: number;
    oakW: number;
  }>;
  innerPosts: Array<{ x: number; width: number }>;
  beamX: number;
  beamW: number;
  oakBeamX: number;
  oakBeamW: number;
}

// Sub-pixel measurements from cropped dark_floor*.jpg & light_floor*.jpg (656px canvas)
const DARK_ARCH: ArchThemeMetrics = {
  leftSkyEnd: 44,
  rightSkyStart: 614,
  skyLeftColor: '#17100A',
  skyRightColor: '#17100A',
  bays: [
    { x: 70, width: 152, leftPct: '10.67%', widthPct: '23.17%' },
    { x: 240, width: 176, leftPct: '36.59%', widthPct: '26.83%' },
    { x: 434, width: 154, leftPct: '66.16%', widthPct: '23.48%' }
  ],
  outerPosts: [
    { x: 44, width: 26, oakX: 44, oakW: 26 },
    { x: 588, width: 26, oakX: 588, oakW: 26 }
  ],
  innerPosts: [
    { x: 222, width: 18 },
    { x: 416, width: 18 }
  ],
  beamX: 43,
  beamW: 572,
  oakBeamX: 43,
  oakBeamW: 572
};

const LIGHT_ARCH: ArchThemeMetrics = {
  leftSkyEnd: 53,
  rightSkyStart: 603,
  skyLeftColor: '#E7E7E5',
  skyRightColor: '#E1E0DD',
  bays: [
    { x: 70, width: 153, leftPct: '10.67%', widthPct: '23.32%' },
    { x: 233, width: 190, leftPct: '35.52%', widthPct: '28.96%' },
    { x: 433, width: 152, leftPct: '66.01%', widthPct: '23.17%' }
  ],
  outerPosts: [
    { x: 53, width: 17, limestoneX: 53, limestoneW: 9, oakX: 62, oakW: 8 },
    { x: 585, width: 18, limestoneX: 594, limestoneW: 9, oakX: 585, oakW: 9 }
  ],
  innerPosts: [
    { x: 223, width: 10 },
    { x: 423, width: 10 }
  ],
  beamX: 52,
  beamW: 552,
  oakBeamX: 62,
  oakBeamW: 532
};

interface NicheCellProps {
  prod?: Product;
  index: number;
  bayIndex: number;
  bayPos: { leftPct: string; widthPct: string };
  isDark: boolean;
  isHovered: boolean;
  justAddedId: string | null;
  onHover: (idx: number | null) => void;
  onSelect?: (prod: Product) => void;
  onQuickAdd: (prod: Product, e: React.MouseEvent) => void;
}

const NicheCell: React.FC<NicheCellProps> = ({
  prod,
  index,
  bayPos,
  isDark,
  isHovered,
  justAddedId,
  onHover,
  onSelect,
  onQuickAdd
}) => {
  const [retryCount, setRetryCount] = useState(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setRetryCount(0);
    setHasError(false);
  }, [prod?.id]);

  if (!prod) {
    return (
      <div
        className="absolute top-0 bottom-0"
        style={{ left: bayPos.leftPct, width: bayPos.widthPct }}
      />
    );
  }

  const baseSrc = prod.imageThumbnail;
  const imgSrc =
    retryCount > 0
      ? `${baseSrc}${baseSrc.includes('?') ? '&' : '?'}r=${retryCount}`
      : baseSrc;

  const handleImgError = () => {
    if (retryCount < 3) {
      const delay = retryCount === 0 ? 400 : retryCount === 1 ? 1200 : 2400;
      window.setTimeout(() => {
        setRetryCount((c) => c + 1);
      }, delay);
    } else {
      setHasError(true);
    }
  };

  // Keep square vitrines centered on the real photographic shelf sill so frosted side windows & oak panels stay 100% visible
  const vitrineBottomOffset = 'pb-[1.5%]';

  return (
    <div
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect && onSelect(prod)}
      className={`group/niche absolute top-0 bottom-0 flex items-end justify-center ${vitrineBottomOffset} cursor-pointer transition-all duration-200 ${
        isDark
          ? 'hover:ring-1 hover:ring-inset hover:ring-[#e5a045]/75'
          : 'hover:ring-1 hover:ring-inset hover:ring-[#c35626]/70'
      }`}
      style={{ left: bayPos.leftPct, width: bayPos.widthPct }}
    >
      {/* Square Museum Vitrine Sitting Flush on Shelf Sill (leaves real photographic walls, oak panels & windows visible) */}
      <div
        className={`relative aspect-square h-[84%] flex flex-col items-center justify-end overflow-hidden rounded-[2px] border transition-transform duration-300 group-hover/niche:scale-[1.04] ${
          isDark
            ? 'border-[#6f5233]/65 bg-[#20160d]/30 shadow-[0_2px_7px_rgba(16,9,4,0.38)]'
            : 'border-[#8f7455]/55 bg-[#f7efe0]/30 shadow-[0_2px_6px_rgba(80,58,34,0.18)]'
        }`}
      >
        {!hasError ? (
          <div className="relative w-full flex-1 min-h-0 flex items-center justify-center overflow-hidden">
            <img
              src={imgSrc}
              alt={prod.name}
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={handleImgError}
              className={`w-full h-full object-cover select-none ${
                isDark
                  ? 'brightness-[0.96] contrast-[1.03] saturate-[0.98] sepia-[0.06]'
                  : 'brightness-[1.01] contrast-[1.02] saturate-[1.02]'
              }`}
            />
          </div>
        ) : (
          <div
            className={`w-full flex-1 flex items-center justify-center p-1.5 text-center ${
              isDark ? 'bg-[#362415] text-[#f2dcc0]' : 'bg-[#ede0cc] text-[#4b3826]'
            }`}
          >
            <span className="text-[8.5px] font-mono font-bold uppercase tracking-wider line-clamp-2">
              {prod.name}
            </span>
          </div>
        )}

        {/* Slim Architectural Display Base Plinth */}
        <div
          aria-hidden="true"
          className={`w-full h-[2.5px] shrink-0 ${
            isDark ? 'bg-[#3d2c1c]' : 'bg-[#7d6447]'
          }`}
        />
      </div>

      {/* Hover Name, Price & Quick-Add Bar */}
      <div
        className={`absolute bottom-1 left-1 right-1 px-1.5 py-1 rounded-[3px] backdrop-blur-md transition-all duration-200 border flex items-center justify-between gap-1 shadow-md z-30 ${
          isHovered
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-2 pointer-events-none'
        } ${
          isDark
            ? 'bg-[#1c130b]/92 text-[#f7efe6] border-[#e5a045]/55'
            : 'bg-[#faf6f0]/95 text-[#1e140d] border-[#c35626]/45'
        }`}
      >
        <span className="text-[8px] font-bold truncate">
          {prod.name}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          <span
            className={`text-[8px] font-mono font-black tabular-nums ${
              isDark ? 'text-[#e5a045]' : 'text-[#c35626]'
            }`}
          >
            ₹{prod.price}
          </span>

          <button
            type="button"
            onClick={(e) => onQuickAdd(prod, e)}
            className={`p-0.5 rounded-[2px] text-[7px] font-bold uppercase transition-colors cursor-pointer ${
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
  );
};

export const BuildingShowcase: React.FC<BuildingShowcaseProps> = ({
  theme,
  onSelectFloor,
  onCollapseFloor,
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
        if (onCollapseFloor) onCollapseFloor();
        return;
      }
      setActiveFloor(floorNum);
      setIsExpanded(true);
      const floorInfo = FLOORS_DATA.find((f) => f.numeric === floorNum);
      if (floorInfo && onSelectFloor) onSelectFloor(floorInfo);
      return;
    }

    const next = !isExpanded;
    setIsExpanded(next);
    if (next) {
      const floorInfo = FLOORS_DATA.find((f) => f.numeric === activeFloor);
      if (floorInfo && onSelectFloor) onSelectFloor(floorInfo);
    } else if (onCollapseFloor) {
      onCollapseFloor();
    }
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

  // Photorealistic empty floor crop (656x103) parameters per theme
  const arch = isDark ? DARK_ARCH : LIGHT_ARCH;
  const trimPct = isExpanded ? HERO_BOTTOM_TRIM_PCT[activeFloor] ?? 0 : 0;
  const emptyFloorSrc = isDark
    ? '/assets/aistudio/crops/dark_empty_floor.jpg'
    : '/assets/aistudio/crops/light_empty_floor.jpg';
  const rows = [row1Products, row2Products, row3Products];

  return (
    <div
      ref={containerRef}
      className="relative w-full flex flex-col items-center select-none font-sans"
    >
      {/* ============================================================== */}
      {/* 1. TOP INTERACTIVE CONTROLLER BAR                              */}
      {/* ============================================================== */}
      <div
        className={`w-full max-w-[656px] mb-3 px-3 py-2 rounded-xl flex flex-wrap items-center justify-between gap-2 border transition-all duration-300 shadow-sm ${
          isDark
            ? 'bg-[#1a120b] border-[#312317] text-[#f7f2ea]'
            : 'bg-[#e7e5e0] border-[#d3cfc7] text-[#2c1e13]'
        }`}
      >
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
                ? 'bg-[#291c12] hover:bg-[#3a2819] text-[#f5c27d] border border-[#4d3522]'
                : 'bg-[#f6f4f0] hover:bg-white text-[#2c1e13] border border-[#c9c3b8]'
            }`}
          >
            <RotateCcw className={`w-3 h-3 transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`} />
            <span>{isExpanded ? 'Reassemble Cabinet' : 'Click Floor to Open'}</span>
          </button>

          <span className={`hidden sm:inline text-[10px] font-mono font-semibold tracking-wide whitespace-nowrap ${
            isDark ? 'text-[#cbb7a1]' : 'text-[#5b4d3f]'
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
                    ? 'bg-[#24180f] text-[#c7b5a2] hover:text-white hover:bg-[#342317] border border-[#3a2719]'
                    : 'bg-[#f6f4f0] text-[#5e5042] hover:text-[#1e140d] hover:bg-white border border-[#cfcac0]'
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

          <button
            type="button"
            onClick={handleReplaySequence}
            className={`p-1.5 ml-0.5 rounded border transition-colors cursor-pointer active:scale-95 ${
              isDark
                ? 'bg-[#24180f] text-[#b4a08d] hover:text-white border-[#3a2719]'
                : 'bg-[#f6f4f0] text-[#5e5042] hover:text-[#1e140d] border-[#cfcac0]'
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
      {/* Matches Exact Exterior Sky/Wall Shade (#17100A / #E5E4E1)      */}
      {/* ============================================================== */}
      <div
        className={`relative w-full max-w-[656px] rounded-2xl overflow-hidden border transition-all duration-300 ${
          isDark
            ? 'bg-[#17100A] border-[#2b1e14] shadow-[0_24px_60px_rgba(0,0,0,0.75)]'
            : 'bg-[#e5e4e1] border-[#d3cfc7] shadow-[0_18px_45px_rgba(70,58,44,0.12)]'
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
                className="w-full h-auto block select-none"
                style={{ aspectRatio: `656 / ${slice.height}` }}
              />
            ))}
          </motion.div>

          {/* ----------------------------------------------------------- */}
          {/* SECTION B: HERO PRODUCT SHOWCASE (ACTIVE FLOOR)             */}
          {/* ----------------------------------------------------------- */}
          <div
            onClick={() => handleToggleFloor()}
            className="group/shelf relative w-full z-30 overflow-hidden select-none cursor-pointer"
            style={{ width: '656px', maxWidth: '100%' }}
            title={isExpanded ? 'Click to reassemble cabinet' : 'Click to open floor showcase'}
          >
            <img
              src={isDark ? heroSlice.darkSrc : heroSlice.lightSrc}
              alt={`${heroSlice.name} Showcase`}
              className="w-full h-auto block select-none pointer-events-none transition-[filter] duration-300 group-hover/shelf:brightness-105"
              style={{
                aspectRatio: `656 / ${heroSlice.height}`,
                marginBottom: trimPct > 0 ? `-${trimPct}%` : undefined
              }}
            />

            {/* Unobtrusive Top-Corner Prompt (no bottom scrim darkening the floor seam) */}
            <div className="absolute inset-x-12 top-2 flex items-center justify-end pointer-events-none opacity-0 group-hover/shelf:opacity-100 transition-opacity duration-200">
              <span
                className={`text-[8.5px] font-mono font-bold tracking-wider px-2 py-0.5 rounded backdrop-blur-md border ${
                  isExpanded
                    ? isDark
                      ? 'bg-[#1a110a]/92 text-[#e5a045] border-[#e5a045]/55'
                      : 'bg-[#2c1e13]/92 text-[#faf6f0] border-[#decbb8]/40'
                    : isDark
                    ? 'bg-[#e5a045] text-black border-[#e5a045]'
                    : 'bg-[#c35626] text-white border-[#a84419]'
                }`}
              >
                {isExpanded ? 'REASSEMBLE ↺' : 'OPEN FLOOR ▾'}
              </span>
            </div>
          </div>

          {/* ----------------------------------------------------------- */}
          {/* SECTION C: 3-ROW PHOTOREALISTIC ARCHITECTURAL EXTENSION     */}
          {/* Uses Real Building Floor Photography for Exact Wall Texture */}
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
            {/* Floor 01 ends in an open window bay; prepend a matching photographed horizontal cornice beam */}
            {activeFloor === 1 && (
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: '656 / 11' }}>
                <img
                  src={emptyFloorSrc}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-auto block select-none pointer-events-none object-cover object-bottom"
                  style={{ aspectRatio: '656 / 103', marginTop: '-14.02%' }}
                />
              </div>
            )}

            {/* 3 Stacked Photorealistic Building Showcase Rows (656 x 103 each) */}
            {rows.map((rowProds, rIdx) => {
              const rowContent = (
                <div
                  key={`photo-row-${rIdx}`}
                  className="relative w-full overflow-hidden"
                  style={{ aspectRatio: '656 / 103' }}
                >
                  <img
                    src={emptyFloorSrc}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full block select-none pointer-events-none"
                  />

                  {/* Product Vitrines Aligned inside the Real Illuminated Building Bays (y=8..92 -> top 7.77%, h 81.55%) */}
                  <div
                    className="absolute left-0 right-0 pointer-events-auto"
                    style={{ top: '7.77%', height: '81.55%' }}
                  >
                    {[0, 1, 2].map((bIdx) => {
                      const i = rIdx * 3 + bIdx;
                      const prod = rowProds[bIdx];
                      return (
                        <NicheCell
                          key={prod?.id || `r${rIdx + 1}-${bIdx}`}
                          prod={prod}
                          index={i}
                          bayIndex={bIdx}
                          bayPos={arch.bays[bIdx]}
                          isDark={isDark}
                          isHovered={hoveredProductIndex === i}
                          justAddedId={justAddedId}
                          onHover={setHoveredProductIndex}
                          onSelect={onSelectProduct}
                          onQuickAdd={handleQuickAdd}
                        />
                      );
                    })}
                  </div>
                </div>
              );

              if (rIdx === 0) {
                return (
                  <motion.div
                    key="photo-row-wrap-0"
                    initial={false}
                    animate={{
                      y: isExpanded ? 0 : -45,
                      opacity: isExpanded ? 1 : 0
                    }}
                    transition={{
                      duration: 0.55,
                      ease: [0.25, 1, 0.5, 1],
                      delay: 0.1
                    }}
                  >
                    {rowContent}
                  </motion.div>
                );
              }

              return rowContent;
            })}
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
                className="w-full h-auto block select-none"
                style={{ aspectRatio: `656 / ${slice.height}` }}
              />
            ))}
          </motion.div>

          {/* =========================================================== */}
          {/* 3. INTACT-STATE INTERACTIVE FLOOR OVERLAY                   */}
          {/* =========================================================== */}
          {!isExpanded && (
            <div className="absolute inset-0 z-40 pointer-events-auto">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none px-3 py-1 rounded-md backdrop-blur-md border text-[8.5px] font-mono font-bold uppercase tracking-widest shadow-md bg-black/65 text-[#f3cfa0] border-[#e5a045]/40 whitespace-nowrap">
                Click Any Floor to Open Showcase
              </div>

              {[
                { floor: 5, top: '5.73%', height: '15.36%', slice: BUILDING_SLICES[1] },
                { floor: 4, top: '21.09%', height: '15.89%', slice: BUILDING_SLICES[2] },
                { floor: 3, top: '36.98%', height: '13.54%', slice: BUILDING_SLICES[3] },
                { floor: 2, top: '50.52%', height: '14.84%', slice: BUILDING_SLICES[4] },
                { floor: 1, top: '65.36%', height: '10.03%', slice: BUILDING_SLICES[5] }
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
                    <div
                      className={`absolute inset-x-10 ${
                        floor === 1 ? 'inset-y-0.5' : 'inset-y-1'
                      } rounded-xl pointer-events-none transition-all duration-200 border ${
                        isHovered
                          ? isDark
                            ? 'bg-[#e5a045]/18 border-[#e5a045] shadow-[0_0_24px_rgba(229,160,69,0.3)]'
                            : 'bg-[#c35626]/16 border-[#c35626] shadow-[0_0_24px_rgba(195,86,38,0.28)]'
                          : 'border-transparent bg-black/0 hover:bg-black/5'
                      }`}
                    />

                    {/* Left: Floor Category Badge */}
                    <div
                      className={`relative z-10 px-2.5 ${
                        floor === 1 ? 'py-1' : 'py-1.5'
                      } rounded-md backdrop-blur-md transition-all duration-200 border flex flex-col shadow-sm ${
                        isHovered ? 'scale-105 shadow-md ring-1 ring-white/30' : 'opacity-90'
                      }`}
                      style={{
                        backgroundColor: `${slice.tabColor}dd`,
                        borderColor: slice.tabBorder,
                        color: '#ffffff'
                      }}
                    >
                      <span className="text-[8.5px] font-mono font-black tracking-wider text-white/90 leading-tight">
                        0{floor} · FLOOR
                      </span>
                      <span className="text-[9.5px] font-black tracking-tight leading-none mt-0.5">
                        {slice.category}
                      </span>
                      <span
                        className={`text-[7.5px] font-medium opacity-85 leading-tight mt-0.5 ${
                          floor === 1 ? 'hidden sm:block' : ''
                        }`}
                      >
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
