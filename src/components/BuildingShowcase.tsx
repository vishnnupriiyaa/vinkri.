import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import {
  RotateCcw,
  Play,
  ShoppingBag,
  Check,
  ArrowRight,
  ArrowUpRight,
  Layers
} from 'lucide-react';
import { BackdropFinish, FloorInfo, Product, ThemeMode } from '../types';
import { FLOORS_DATA, PRODUCTS_DATA } from '../data/products';
import { BACKDROP_OPTIONS } from '../data/backdrops';

interface BuildingShowcaseProps {
  theme: ThemeMode;
  backdropFinish?: BackdropFinish;
  onSelectBackdrop?: (finish: BackdropFinish) => void;
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
  wingBgDark: string;
  wingBgLight: string;
  wingHighlightDark: string;
  wingHighlightLight: string;
  height: number; // px on 656px crop
  lightSrc: string;
  darkSrc: string;
}

// Architectural brushed stone/metal subtle surface grain data-URI (no external request)
const ARCH_GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`;

// 7 photographic facade slices forming the 5-story central building bays
const BUILDING_SLICES: BuildingSlice[] = [
  {
    id: 'roof',
    name: 'ROOF PARAPET',
    category: '',
    tagline: '',
    wingBgDark: '#1c1510',
    wingBgLight: '#cfc7ba',
    wingHighlightDark: '#261d16',
    wingHighlightLight: '#dcd5c9',
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
    wingBgDark: '#11335e',
    wingBgLight: '#1c4678',
    wingHighlightDark: '#17437a',
    wingHighlightLight: '#245792',
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
    wingBgDark: '#124a43',
    wingBgLight: '#1a5c53',
    wingHighlightDark: '#175e55',
    wingHighlightLight: '#217166',
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
    wingBgDark: '#663e19',
    wingBgLight: '#804f23',
    wingHighlightDark: '#7e4d1f',
    wingHighlightLight: '#975e2b',
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
    wingBgDark: '#521e2f',
    wingBgLight: '#69293e',
    wingHighlightDark: '#66263c',
    wingHighlightLight: '#7f324c',
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
    wingBgDark: '#6f451d',
    wingBgLight: '#885727',
    wingHighlightDark: '#875525',
    wingHighlightLight: '#a16830',
    height: 77,
    lightSrc: '/assets/aistudio/crops/light_floor1.jpg?v=2',
    darkSrc: '/assets/aistudio/crops/dark_floor1.jpg?v=2'
  },
  {
    id: 'ground',
    name: 'GROUND ATELIER',
    category: '',
    tagline: '',
    wingBgDark: '#17110c',
    wingBgLight: '#dfd8cc',
    wingHighlightDark: '#1f1710',
    wingHighlightLight: '#eae4da',
    height: 189,
    lightSrc: '/assets/aistudio/crops/light_ground.jpg?v=2',
    darkSrc: '/assets/aistudio/crops/dark_ground.jpg?v=2'
  }
];

const HERO_BOTTOM_TRIM_PCT: Record<number, number> = {
  5: 0.35,
  4: 2.06,
  3: 0.62,
  2: 0.78,
  1: 0
};

interface ArchThemeMetrics {
  cropWidthPx: number;
  innerWidthPct: string;
  innerMarginLeftPct: string;
  bays: Array<{ leftPct: string; widthPct: string }>;
}

const DARK_ARCH: ArchThemeMetrics = {
  cropWidthPx: 570,
  innerWidthPct: '115.0877%',
  innerMarginLeftPct: '-7.7193%',
  bays: [
    { leftPct: '10.67%', widthPct: '23.17%' },
    { leftPct: '36.59%', widthPct: '26.83%' },
    { leftPct: '66.16%', widthPct: '23.48%' }
  ]
};

const LIGHT_ARCH: ArchThemeMetrics = {
  cropWidthPx: 550,
  innerWidthPct: '119.2727%',
  innerMarginLeftPct: '-9.6364%',
  bays: [
    { leftPct: '10.67%', widthPct: '23.32%' },
    { leftPct: '35.52%', widthPct: '28.96%' },
    { leftPct: '66.01%', widthPct: '23.17%' }
  ]
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
  const retryTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (retryTimerRef.current) {
      window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    setRetryCount(0);
    setHasError(false);

    return () => {
      if (retryTimerRef.current) {
        window.clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
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
  const imgSrc = `${baseSrc}${baseSrc.includes('?') ? '&' : '?'}v=2${retryCount > 0 ? `&r=${retryCount}` : ''}`;

  const handleImgError = () => {
    if (retryCount < 4) {
      const delays = [300, 800, 1600, 3000];
      const delay = delays[retryCount] ?? 2000;
      if (retryTimerRef.current) window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = window.setTimeout(() => {
        setRetryCount((c) => c + 1);
      }, delay);
    } else {
      setHasError(true);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect && onSelect(prod)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (onSelect) onSelect(prod);
        }
      }}
      aria-label={`Inspect ${prod.name}, ₹${prod.price}`}
      className={`group/niche absolute top-0 bottom-0 flex items-end justify-center pb-[1.5%] cursor-pointer transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none ${
        isDark
          ? 'hover:ring-1 hover:ring-inset hover:ring-[#e5a045]/75'
          : 'hover:ring-1 hover:ring-inset hover:ring-[#c35626]/70'
      }`}
      style={{ left: bayPos.leftPct, width: bayPos.widthPct }}
    >
      {/* Unified Full-Bay Museum Display Vitrine */}
      <div
        className={`relative w-[92%] h-[86%] flex flex-col justify-between overflow-hidden rounded-[2px] border transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/niche:scale-[1.02] group-hover/niche:-translate-y-[1px] ${
          isDark
            ? 'border-[#7c5c3a]/85 bg-gradient-to-b from-[#1e150e] via-[#140e09] to-[#0c0805] shadow-[0_3px_10px_rgba(0,0,0,0.52)]'
            : 'border-[#8f7455]/75 bg-gradient-to-b from-[#efe7da] via-[#e4d8c5] to-[#d6c6ae] shadow-[0_2px_8px_rgba(70,50,28,0.22)]'
        }`}
      >
        <div className="relative flex-1 min-h-0 flex items-stretch">
          {/* Left Square Specimen Frame (full unclipped 1:1 product artwork) */}
          <div
            className={`relative aspect-square h-full shrink-0 overflow-hidden border-r ${
              isDark
                ? 'bg-[#120c07] border-[#4d3824]/80'
                : 'bg-[#e7decb] border-[#b7a387]/70'
            }`}
          >
            {!hasError ? (
              <img
                key={imgSrc}
                src={imgSrc}
                alt={prod.name}
                loading="eager"
                decoding="async"
                onError={handleImgError}
                className={`w-full h-full object-cover select-none transition-transform duration-300 group-hover/niche:scale-[1.05] ${
                  isDark
                    ? 'brightness-[0.96] contrast-[1.04] saturate-[0.98] sepia-[0.04]'
                    : 'brightness-[1.01] contrast-[1.02] saturate-[1.02]'
                }`}
              />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center p-1 text-center ${
                  isDark ? 'bg-[#362415] text-[#f2dcc0]' : 'bg-[#ede0cc] text-[#4b3826]'
                }`}
              >
                <span className="text-[7.5px] font-mono font-bold uppercase tracking-wider line-clamp-2">
                  {prod.name}
                </span>
              </div>
            )}

            {/* Inner Shadowbox Vignette to harmonize dark & light photo backgrounds */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: isDark
                  ? 'inset 0 0 12px rgba(8,5,2,0.52)'
                  : 'inset 0 0 8px rgba(52,36,18,0.22)'
              }}
            />
          </div>

          {/* Right Museum Gallery Placard (Visible on >= sm viewports) */}
          <div className="hidden sm:flex flex-1 min-w-0 flex-col justify-between px-1.5 md:px-2 py-1 relative overflow-hidden">
            {/* Subtle Overhead Gallery Spot Cone */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background: isDark
                  ? 'radial-gradient(ellipse 90% 45% at 50% 0%, rgba(255,224,170,0.12) 0%, transparent 75%)'
                  : 'radial-gradient(ellipse 90% 45% at 50% 0%, rgba(255,255,255,0.45) 0%, transparent 75%)'
              }}
            />

            <div className="relative z-10 min-w-0">
              <span
                className={`block text-[6.5px] font-mono font-bold tracking-[0.14em] uppercase leading-none ${
                  isDark ? 'text-[#c99b63]' : 'text-[#8c4724]'
                }`}
              >
                ED. 0{index + 1}
              </span>
              <span
                className={`block text-[8.5px] md:text-[9.5px] font-bold leading-[1.15] mt-0.5 line-clamp-2 ${
                  isDark ? 'text-[#f7efe6]' : 'text-[#221810]'
                }`}
              >
                {prod.name}
              </span>
            </div>

            <div className="relative z-10 flex items-center justify-between gap-1 pt-0.5">
              <span
                className={`text-[8.5px] md:text-[9.5px] font-mono font-black tabular-nums leading-none ${
                  isDark ? 'text-[#e5a045]' : 'text-[#c35626]'
                }`}
              >
                ₹{prod.price}
              </span>

              <button
                type="button"
                onClick={(e) => onQuickAdd(prod, e)}
                className={`p-1 rounded-[2px] transition-colors cursor-pointer shrink-0 ${
                  justAddedId === prod.id
                    ? isDark
                      ? 'bg-[#d2f53a] text-black'
                      : 'bg-[#2c1e13] text-white'
                    : isDark
                    ? 'bg-[#e5a045] hover:bg-[#f0b35e] text-black'
                    : 'bg-[#c35626] hover:bg-[#a84419] text-white'
                }`}
                title="Quick Add to Trolley"
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

        {/* Continuous Museum Glass Specular Reflection */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isDark
              ? 'linear-gradient(122deg, rgba(255,245,228,0.08) 0%, transparent 42%, rgba(255,255,255,0.03) 65%, transparent 86%)'
              : 'linear-gradient(122deg, rgba(255,255,255,0.28) 0%, transparent 42%, rgba(255,255,255,0.08) 65%, transparent 86%)'
          }}
        />

        {/* Continuous Slim Bronze Plinth Sill */}
        <div
          aria-hidden="true"
          className={`w-full h-[3px] shrink-0 ${
            isDark
              ? 'bg-gradient-to-r from-[#3a291a] via-[#5e442b] to-[#3a291a]'
              : 'bg-gradient-to-r from-[#876e50] via-[#a78d6c] to-[#876e50]'
          }`}
        />
      </div>

      {/* Compact Mobile Hover/Tap Overlay (< sm viewports where placard is hidden) */}
      <div
        className={`sm:hidden absolute bottom-1 left-1 right-1 px-1.5 py-0.5 rounded-[2px] backdrop-blur-md transition-all duration-200 border flex items-center justify-between gap-1 shadow-md z-30 ${
          isHovered
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-1 pointer-events-none'
        } ${
          isDark
            ? 'bg-[#1c130b]/92 text-[#f7efe6] border-[#e5a045]/55'
            : 'bg-[#faf6f0]/95 text-[#1e140d] border-[#c35626]/45'
        }`}
      >
        <span className="text-[7.5px] font-bold truncate">{prod.name}</span>
        <span
          className={`text-[7.5px] font-mono font-black tabular-nums shrink-0 ${
            isDark ? 'text-[#e5a045]' : 'text-[#c35626]'
          }`}
        >
          ₹{prod.price}
        </span>
      </div>
    </div>
  );
};

// Clips outer sky margins cleanly from 656px crop slices flush against architectural piers
const CenterCropSlice: React.FC<{
  src: string;
  alt: string;
  height: number;
  arch: ArchThemeMetrics;
  trimPct?: number;
  className?: string;
  children?: React.ReactNode;
}> = ({ src, alt, height, arch, trimPct = 0, className = '', children }) => (
  <div
    className={`relative w-full overflow-hidden ${className}`}
    style={{
      aspectRatio: `${arch.cropWidthPx} / ${height}`,
      marginBottom: trimPct > 0 ? `-${trimPct}%` : undefined
    }}
  >
    <div
      className="relative h-full"
      style={{
        width: arch.innerWidthPct,
        marginLeft: arch.innerMarginLeftPct
      }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full block object-fill select-none pointer-events-none"
      />
      {children}
    </div>
  </div>
);

// Real Photographic Botanical Shrub Planters Seated on Stone Planter Curb
const PhotoPlanterCluster: React.FC<{ isDark: boolean; count?: number }> = ({
  isDark,
  count = 2
}) => (
  <div
    aria-hidden="true"
    className="absolute bottom-0 inset-x-0 flex items-end justify-around px-1 pointer-events-none z-20"
  >
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="relative flex flex-col items-center">
        {/* Soft Warm Architectural Planter Uplight Halo */}
        <div
          className={`w-10 sm:w-12 h-4 -mb-3 rounded-full blur-[5px] ${
            isDark ? 'bg-[#f4bc72]/35' : 'bg-[#d9c19c]/30'
          }`}
        />
        <img
          src={
            isDark
              ? '/assets/aistudio/arch/dark_shrubs.png'
              : '/assets/aistudio/arch/light_shrubs.png'
          }
          alt=""
          className="relative w-10 h-6 sm:w-14 sm:h-8 object-cover object-top select-none pointer-events-none drop-shadow-[0_3px_5px_rgba(0,0,0,0.65)]"
          style={{
            WebkitMaskImage:
              'linear-gradient(180deg, rgba(0,0,0,1) 55%, rgba(0,0,0,0.75) 100%)',
            maskImage:
              'linear-gradient(180deg, rgba(0,0,0,1) 55%, rgba(0,0,0,0.75) 100%)'
          }}
        />
        {/* Brushed Granite Planter Curb Trough */}
        <div
          className={`w-9 sm:w-12 h-[4px] border-t shadow-sm ${
            isDark ? 'bg-[#1a130d] border-[#423224]' : 'bg-[#a99e8e] border-[#cfc5b5]'
          }`}
        />
      </div>
    ))}
  </div>
);

export const BuildingShowcase: React.FC<BuildingShowcaseProps> = ({
  theme,
  backdropFinish = 'dark-walnut',
  onSelectBackdrop,
  onSelectFloor,
  onCollapseFloor,
  selectedFloorNumber,
  onSelectProduct,
  onQuickAdd
}) => {
  const isDark = theme === 'rustic-dark';
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeFloor, setActiveFloor] = useState<number>(3);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [hoveredFloor, setHoveredFloor] = useState<number | null>(null);
  const [hoveredProductIndex, setHoveredProductIndex] = useState<number | null>(null);
  const [hoveredHeroBay, setHoveredHeroBay] = useState<number | null>(null);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

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
    }, 640);
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
  const activeFloorInfo = FLOORS_DATA.find((f) => f.numeric === activeFloor);
  const featuredSlotIds = activeFloorInfo
    ? (['left', 'center', 'right'] as const)
        .map((slot) => activeFloorInfo.items.find((item) => item.slot === slot)?.productId)
        .filter((id): id is string => Boolean(id))
    : [];
  const featuredSlotProducts = featuredSlotIds
    .map((id) => allFloorProducts.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
  const featuredIdSet = new Set(featuredSlotProducts.map((p) => p.id));
  const orderedFloorProducts = [
    ...featuredSlotProducts,
    ...allFloorProducts.filter((p) => !featuredIdSet.has(p.id))
  ];
  const nicheProducts = orderedFloorProducts.slice(0, 9);

  const row1Products = nicheProducts.slice(0, 3);
  const row2Products = nicheProducts.slice(3, 6);
  const row3Products = nicheProducts.slice(6, 9);

  const arch = isDark ? DARK_ARCH : LIGHT_ARCH;
  const trimPct = isExpanded ? HERO_BOTTOM_TRIM_PCT[activeFloor] ?? 0 : 0;
  const emptyFloorSrc = isDark
    ? '/assets/aistudio/crops/dark_empty_floor.jpg'
    : '/assets/aistudio/crops/light_empty_floor.jpg';
  const rows = [row1Products, row2Products, row3Products];

  // Structural column proportions matching reference architecture
  const leftWingCls = 'w-[25%] sm:w-[23.5%] shrink-0';
  const centerWingCls = 'w-[62.5%] sm:w-[64%] shrink-0';
  const rightWingCls = 'w-[12.5%] sm:w-[12.5%] shrink-0';

  const framePierBg = isDark
    ? 'bg-gradient-to-b from-[#2b2017] via-[#1c140e] to-[#130e09] border-[#3d2e20]'
    : 'bg-gradient-to-b from-[#dfd7c9] via-[#ccc2b2] to-[#b8ad9b] border-[#b7ac9c]';

  // Physical Stepped Extruded Architectural Beam Across Entire 5-Bay Facade Width
  const renderSlabBeam = (isTop = false, beamKey?: string) => (
    <div
      key={beamKey}
      aria-hidden="true"
      className="relative w-full h-[4px] sm:h-[5px] pointer-events-none flex flex-col justify-between overflow-hidden"
      style={{
        background: isDark
          ? isTop
            ? 'linear-gradient(180deg, #523e2c 0%, #261c14 50%, #0d0906 100%)'
            : 'linear-gradient(180deg, #433223 0%, #1f1710 48%, #0a0704 100%)'
          : isTop
          ? 'linear-gradient(180deg, #f3ede4 0%, #cbc1b1 52%, #9a8e7c 100%)'
          : 'linear-gradient(180deg, #eae3d7 0%, #c1b7a6 52%, #948875 100%)',
        boxShadow: isDark
          ? '0 2px 6px rgba(0,0,0,0.62)'
          : '0 2px 5px rgba(60,48,34,0.24)'
      }}
    >
      {/* Fine Brushed Metal Catch-Light Coping Rim */}
      <div
        className={`w-full h-[1px] ${
          isDark ? 'bg-[#8d6d4b]/35' : 'bg-white/65'
        }`}
      />
      {/* Recessed Under-Slab Drip Shadow Groove */}
      <div
        className={`w-full h-[1px] ${
          isDark ? 'bg-black/75' : 'bg-[#6e604f]/35'
        }`}
      />
    </div>
  );

  // Unified 5-Bay Architectural Floor Row with Recessed Physical Depth, Spot Cones, Grain & Milled Frames
  const renderArchitecturalFloorRow = (slice: BuildingSlice, interactive: boolean) => {
    const floorNum = slice.floorNumber!;
    const isHovered = interactive && hoveredFloor === floorNum;
    const isActiveHero = isExpanded && activeFloor === floorNum;

    return (
      <div
        key={slice.id}
        onMouseEnter={interactive ? () => setHoveredFloor(floorNum) : undefined}
        onMouseLeave={
          interactive
            ? () => setHoveredFloor(null)
            : () => setHoveredHeroBay(null)
        }
        onClick={
          interactive
            ? (e) => {
                e.stopPropagation();
                handleToggleFloor(floorNum);
              }
            : undefined
        }
        onKeyDown={
          interactive
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleToggleFloor(floorNum);
                }
              }
            : undefined
        }
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-label={
          interactive
            ? `Open ${slice.name}: ${slice.category}`
            : undefined
        }
        className={`group/floor relative w-full flex flex-col select-none focus:outline-none ${
          interactive ? 'cursor-pointer' : ''
        }`}
      >
        <div className="w-full flex items-stretch">
          {/* LEFT ARCHITECTURAL DIRECTORY BAY (Recessed Enamel Steel Panel + Spot Cones + Architectural Texture) */}
          <div
            onClick={
              isActiveHero
                ? (e) => {
                    e.stopPropagation();
                    handleToggleFloor();
                  }
                : undefined
            }
            role={isActiveHero ? 'button' : undefined}
            tabIndex={isActiveHero ? 0 : undefined}
            aria-label={
              isActiveHero ? `Close ${slice.name}: ${slice.category}` : undefined
            }
            onKeyDown={
              isActiveHero
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleToggleFloor();
                    }
                  }
                : undefined
            }
            className={`${leftWingCls} relative flex flex-col justify-center px-2 sm:px-3.5 py-1 border-r-[3px] sm:border-r-[4px] transition-colors duration-200 overflow-hidden ${
              isDark ? 'border-[#211811]' : 'border-[#b9ae9d]'
            } ${isActiveHero ? 'cursor-pointer' : ''}`}
            style={{
              backgroundColor: isHovered
                ? isDark
                  ? slice.wingHighlightDark
                  : slice.wingHighlightLight
                : isDark
                ? slice.wingBgDark
                : slice.wingBgLight,
              boxShadow: isDark
                ? 'inset 0 8px 16px rgba(0,0,0,0.62), inset 5px 0 10px rgba(0,0,0,0.48), inset -5px 0 10px rgba(0,0,0,0.48), inset 0 -4px 8px rgba(0,0,0,0.42)'
                : 'inset 0 6px 12px rgba(25,18,10,0.45), inset 4px 0 8px rgba(25,18,10,0.32), inset -4px 0 8px rgba(25,18,10,0.32), inset 0 -3px 6px rgba(25,18,10,0.28)'
            }}
          >
            {/* Subtle Architectural Cladding Grain */}
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
              style={{ backgroundImage: ARCH_GRAIN_SVG }}
            />
            {/* Dual Recessed Ceiling Architectural Downlight Cones + Pinpoint Soffit Fixtures */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 46% 36% at 28% 2%, rgba(255,244,218,0.24) 0%, transparent 75%), radial-gradient(ellipse 46% 36% at 74% 2%, rgba(255,244,218,0.20) 0%, transparent 75%)'
              }}
            />
            <div
              aria-hidden="true"
              className="hidden sm:flex absolute top-[2px] inset-x-4 justify-around pointer-events-none"
            >
              <span className="w-2.5 h-[2px] rounded-full bg-[#fff3d6]/85 shadow-[0_0_6px_rgba(255,236,195,0.85)]" />
              <span className="w-2.5 h-[2px] rounded-full bg-[#fff3d6]/85 shadow-[0_0_6px_rgba(255,236,195,0.85)]" />
            </div>

            {/* Subtle Diagonal Architectural Glazing Reflection */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(124deg, rgba(255,255,255,0.07) 0%, transparent 45%, rgba(255,255,255,0.025) 68%, transparent 100%)'
              }}
            />

            {/* Subtle Recessed Plaque Reveal Hairline + Corner Pin Fasteners */}
            <div
              aria-hidden="true"
              className="hidden sm:block absolute inset-[3px] border border-white/[0.08] pointer-events-none"
            />
            <span aria-hidden="true" className="hidden sm:block absolute top-[5px] left-[5px] w-[2px] h-[2px] rounded-full bg-white/30 pointer-events-none" />
            <span aria-hidden="true" className="hidden sm:block absolute top-[5px] right-[5px] w-[2px] h-[2px] rounded-full bg-white/30 pointer-events-none" />
            <span aria-hidden="true" className="hidden sm:block absolute bottom-[5px] left-[5px] w-[2px] h-[2px] rounded-full bg-white/25 pointer-events-none" />
            <span aria-hidden="true" className="hidden sm:block absolute bottom-[5px] right-[5px] w-[2px] h-[2px] rounded-full bg-white/25 pointer-events-none" />

            <span className="relative z-10 text-[6.5px] sm:text-[8.5px] font-mono font-bold tracking-[0.16em] text-white/80 uppercase leading-tight drop-shadow-sm">
              0{floorNum} · FLOOR
            </span>
            <span className="relative z-10 text-[9px] sm:text-[13px] md:text-[14.5px] font-black tracking-tight text-white uppercase leading-[1.08] mt-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]">
              {slice.category}
            </span>
            <span className="relative z-10 hidden sm:block text-[8px] md:text-[9px] font-medium text-white/82 leading-tight mt-0.5 truncate">
              {slice.tagline}
            </span>
          </div>

          {/* CENTER 3 ARCHITECTURAL DISPLAY BAYS */}
          <div
            className={`${centerWingCls} relative overflow-hidden ${
              isDark ? 'bg-[#17100A]' : 'bg-[#e3ddd2]'
            }`}
          >
            <CenterCropSlice
              src={isDark ? slice.darkSrc : slice.lightSrc}
              alt={`${slice.name} ${slice.category}`}
              height={slice.height}
              arch={arch}
              trimPct={isActiveHero ? trimPct : 0}
              className={
                interactive
                  ? 'transition-[filter] duration-200 group-hover/floor:brightness-105'
                  : ''
              }
            >
              {/* Individual Interactive Product Hotspots Over the 3 Hero Windows When Expanded */}
              {isActiveHero && (
                <div className="absolute inset-0 z-20 pointer-events-auto">
                  {arch.bays.map((bayPos, bIdx) => {
                    const heroProd = row1Products[bIdx];
                    if (!heroProd) return null;
                    const isBayHovered = hoveredHeroBay === bIdx;

                    return (
                      <div
                        key={`hero-bay-${floorNum}-${heroProd.id}`}
                        role="button"
                        tabIndex={0}
                        onMouseEnter={() => setHoveredHeroBay(bIdx)}
                        onMouseLeave={() => setHoveredHeroBay(null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectProduct) onSelectProduct(heroProd);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            if (onSelectProduct) onSelectProduct(heroProd);
                          }
                        }}
                        aria-label={`Inspect featured piece ${heroProd.name}, ₹${heroProd.price}`}
                        className={`absolute top-0 bottom-0 cursor-pointer transition-all duration-200 focus:outline-none ${
                          isBayHovered
                            ? isDark
                              ? 'ring-1 ring-inset ring-[#e5a045]/85 bg-[#e5a045]/[0.05]'
                              : 'ring-1 ring-inset ring-[#c35626]/80 bg-[#c35626]/[0.04]'
                            : ''
                        }`}
                        style={{ left: bayPos.leftPct, width: bayPos.widthPct }}
                      >
                        <div
                          className={`absolute bottom-1.5 left-1.5 right-1.5 px-2 py-1 rounded-[2px] backdrop-blur-md transition-all duration-200 border flex items-center justify-between gap-1.5 shadow-md ${
                            isBayHovered
                              ? 'opacity-100 translate-y-0'
                              : 'opacity-0 translate-y-1.5 pointer-events-none'
                          } ${
                            isDark
                              ? 'bg-[#1c130b]/92 text-[#f7efe6] border-[#e5a045]/60'
                              : 'bg-[#faf6f0]/95 text-[#1e140d] border-[#c35626]/55'
                          }`}
                        >
                          <span className="text-[8.5px] font-bold truncate">
                            {heroProd.name}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span
                              className={`text-[8.5px] font-mono font-black tabular-nums ${
                                isDark ? 'text-[#e5a045]' : 'text-[#c35626]'
                              }`}
                            >
                              ₹{heroProd.price}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleQuickAdd(heroProd, e)}
                              className={`p-0.5 rounded-[2px] transition-colors cursor-pointer ${
                                justAddedId === heroProd.id
                                  ? isDark
                                    ? 'bg-[#d2f53a] text-black'
                                    : 'bg-[#2c1e13] text-white'
                                  : isDark
                                  ? 'bg-[#e5a045] hover:bg-[#f0b35e] text-black'
                                  : 'bg-[#c35626] hover:bg-[#a84419] text-white'
                              }`}
                              title="Quick Add to Trolley"
                              aria-label={`Quick add ${heroProd.name}`}
                            >
                              {justAddedId === heroProd.id ? (
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              ) : (
                                <ShoppingBag className="w-2.5 h-2.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CenterCropSlice>

            {/* Exterior Glass Curtain-Wall Specular Reflection & Gallery Uplighting Glint */}
            {!isExpanded && (
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none transition-all duration-200"
                style={{
                  background: isHovered
                    ? isDark
                      ? 'linear-gradient(118deg, rgba(255,224,170,0.16) 0%, transparent 38%, rgba(255,255,255,0.05) 62%, transparent 82%)'
                      : 'linear-gradient(118deg, rgba(255,255,255,0.22) 0%, transparent 38%, rgba(255,255,255,0.08) 62%, transparent 82%)'
                    : isDark
                    ? 'linear-gradient(118deg, rgba(255,244,226,0.06) 0%, transparent 34%, rgba(255,255,255,0.025) 58%, transparent 78%)'
                    : 'linear-gradient(118deg, rgba(255,255,255,0.12) 0%, transparent 36%, rgba(255,255,255,0.04) 58%, transparent 78%)',
                  boxShadow: isHovered
                    ? isDark
                      ? 'inset 0 0 0 1px rgba(229,160,69,0.72), inset 0 -1px 0 rgba(255,220,165,0.35)'
                      : 'inset 0 0 0 1px rgba(195,86,38,0.68), inset 0 -1px 0 rgba(255,255,255,0.5)'
                    : 'inset 0 -1px 0 rgba(255,242,218,0.14)'
                }}
              />
            )}

            {isHovered && (
              <div
                className={`absolute top-1.5 right-2 z-30 pointer-events-none flex items-center gap-1 px-2.5 py-0.5 rounded-[2px] text-[8px] font-mono font-black tracking-wider uppercase shadow-md border ${
                  isDark
                    ? 'bg-[#1a110a]/92 text-[#f5c27d] border-[#e5a045]/75'
                    : 'bg-[#faf6f0]/95 text-[#22170f] border-[#c35626]/70'
                }`}
              >
                <span>Open 0{floorNum}F</span>
                <ArrowUpRight className="w-2.5 h-2.5" />
              </div>
            )}

            {isActiveHero && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFloor();
                }}
                className="absolute top-1.5 right-2 z-30 opacity-0 group-hover/floor:opacity-100 focus:opacity-100 transition-opacity duration-200 px-2.5 py-0.5 rounded-[2px] text-[8px] font-mono font-bold tracking-wider uppercase shadow-md bg-black/82 text-[#f5c27d] border border-[#e5a045]/60 cursor-pointer"
              >
                Close Floor ↺
              </button>
            )}
          </div>

          {/* RIGHT ARCHITECTURAL FLOOR NUMBER BAY (Recessed Enamel Bay + Downlight + Frame) */}
          <div
            onClick={
              isActiveHero
                ? (e) => {
                    e.stopPropagation();
                    handleToggleFloor();
                  }
                : undefined
            }
            role={isActiveHero ? 'button' : undefined}
            tabIndex={isActiveHero ? 0 : undefined}
            aria-label={
              isActiveHero ? `Close ${slice.name}: ${slice.category}` : undefined
            }
            onKeyDown={
              isActiveHero
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleToggleFloor();
                    }
                  }
                : undefined
            }
            className={`${rightWingCls} relative flex flex-col items-center justify-center px-1 py-1 border-l-[3px] sm:border-l-[4px] transition-colors duration-200 overflow-hidden ${
              isDark ? 'border-[#211811]' : 'border-[#b9ae9d]'
            } ${isActiveHero ? 'cursor-pointer' : ''}`}
            style={{
              backgroundColor: isHovered
                ? isDark
                  ? slice.wingHighlightDark
                  : slice.wingHighlightLight
                : isDark
                ? slice.wingBgDark
                : slice.wingBgLight,
              boxShadow: isDark
                ? 'inset 0 8px 16px rgba(0,0,0,0.62), inset 5px 0 10px rgba(0,0,0,0.48), inset -5px 0 10px rgba(0,0,0,0.48), inset 0 -4px 8px rgba(0,0,0,0.42)'
                : 'inset 0 6px 12px rgba(25,18,10,0.45), inset 4px 0 8px rgba(25,18,10,0.32), inset -4px 0 8px rgba(25,18,10,0.32), inset 0 -3px 6px rgba(25,18,10,0.28)'
            }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
              style={{ backgroundImage: ARCH_GRAIN_SVG }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 68% 36% at 50% 2%, rgba(255,244,218,0.24) 0%, transparent 76%)'
              }}
            />
            {/* Subtle Recessed Plaque Reveal Hairline + Corner Pin Fasteners */}
            <div
              aria-hidden="true"
              className="hidden sm:block absolute inset-[3px] border border-white/[0.08] pointer-events-none"
            />
            <span aria-hidden="true" className="hidden sm:block absolute top-[5px] left-[5px] w-[2px] h-[2px] rounded-full bg-white/30 pointer-events-none" />
            <span aria-hidden="true" className="hidden sm:block absolute top-[5px] right-[5px] w-[2px] h-[2px] rounded-full bg-white/30 pointer-events-none" />
            <span className="hidden sm:block absolute top-[2px] w-2.5 h-[2px] rounded-full bg-[#fff3d6]/85 shadow-[0_0_6px_rgba(255,236,195,0.85)]" />

            <span className="relative z-10 text-[13px] sm:text-[18px] md:text-[21px] font-display font-black tracking-tight text-white leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)] tabular-nums">
              0{floorNum}
            </span>
            <span className="relative z-10 text-[6px] sm:text-[7.5px] font-mono font-bold tracking-[0.22em] text-white/75 uppercase mt-0.5">
              FLOOR
            </span>
          </div>
        </div>

        {/* Continuous Horizontal Chamfered Architectural Slab Divider */}
        {!isActiveHero && renderSlabBeam(false)}
      </div>
    );
  };

  return (
    <MotionConfig reducedMotion="user">
    <div
      ref={containerRef}
      className="relative w-full flex flex-col items-center select-none font-sans"
    >
      {/* ============================================================== */}
      {/* 1. COMPACT ARCHITECTURAL FLOOR CONTROL BAR                     */}
      {/* ============================================================== */}
      <div
        className={`w-full max-w-[980px] mb-2.5 px-2.5 sm:px-3 py-1.5 rounded-lg flex flex-wrap items-center justify-between gap-2 border transition-colors duration-200 ${
          isDark
            ? 'bg-[#19110b]/90 border-[#2f2216] text-[#f7f2ea]'
            : 'bg-[#e6e2da]/90 border-[#cfcac0] text-[#282019]'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={() => handleToggleFloor()}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9.5px] font-mono font-bold uppercase tracking-wider transition-colors duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
              isExpanded
                ? isDark
                  ? 'bg-[#e5a045] hover:bg-[#f0b35e] text-black font-black'
                  : 'bg-[#c35626] hover:bg-[#a84419] text-white font-black'
                : isDark
                ? 'bg-[#261a10] hover:bg-[#352416] text-[#f5c27d] border border-[#47311f]'
                : 'bg-[#f6f4f0] hover:bg-white text-[#2c1e13] border border-[#c9c3b8]'
            }`}
          >
            {isExpanded ? <RotateCcw className="w-3 h-3" /> : <Layers className="w-3 h-3" />}
            <span>{isExpanded ? 'Full Building' : 'Inspect Floor'}</span>
          </button>

          <span
            className={`hidden xl:inline text-[9.5px] font-mono font-semibold tracking-wider truncate ${
              isDark ? 'text-[#cbb7a1]' : 'text-[#5b4d3f]'
            }`}
          >
            {isExpanded
              ? `${heroSlice.name} · ${heroSlice.category}`
              : 'VINKRI FLAGSHIP · CLICK ANY FLOOR'}
          </span>
        </div>

        {/* Floor Tabs (05 - 01) */}
        <div className="flex items-center gap-1 flex-wrap">
          {[5, 4, 3, 2, 1].map((floorNum) => {
            const isActive = activeFloor === floorNum && isExpanded;
            const slice = BUILDING_SLICES.find((s) => s.floorNumber === floorNum);

            return (
              <button
                key={floorNum}
                type="button"
                onClick={() => handleToggleFloor(floorNum)}
                className={`px-2 py-1 rounded text-[9.5px] font-mono font-bold transition-colors duration-150 cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0 ${
                  isActive
                    ? isDark
                      ? 'bg-[#e5a045] text-black font-black'
                      : 'bg-[#c35626] text-white font-black'
                    : isDark
                    ? 'bg-[#22170e] text-[#c7b5a2] hover:text-white hover:bg-[#312115] border border-[#382618]'
                    : 'bg-[#f6f4f0] text-[#5e5042] hover:text-[#1e140d] hover:bg-white border border-[#cfcac0]'
                }`}
                title={`${slice?.name || ''}: ${slice?.category || ''}`}
              >
                <span className="tabular-nums">0{floorNum}</span>
                <span className="hidden md:inline text-[8.5px] font-semibold opacity-85 uppercase">
                  {floorNum === 5
                    ? 'TOYS'
                    : floorNum === 4
                    ? 'DIORAMA'
                    : floorNum === 3
                    ? 'CARS'
                    : floorNum === 2
                    ? 'FIGURES'
                    : 'LAMPS'}
                </span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={handleReplaySequence}
            className={`p-1.5 ml-0.5 rounded border transition-colors cursor-pointer shrink-0 ${
              isDark
                ? 'bg-[#22170e] text-[#b4a08d] hover:text-white border-[#382618]'
                : 'bg-[#f6f4f0] text-[#5e5042] hover:text-[#1e140d] border-[#cfcac0]'
            }`}
            title="Replay Floor Elevation Sequence"
            aria-label="Replay floor elevation sequence"
          >
            <Play className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1B. DARK WOOD & LIGHT WOOD BACKGROUND FINISH TESTER BAR        */}
      {/* ============================================================== */}
      {onSelectBackdrop && (
        <div
          className={`w-full max-w-[980px] mb-3 px-2.5 sm:px-3 py-1.5 rounded-lg flex flex-wrap items-center justify-between gap-1.5 border transition-colors duration-200 ${
            isDark
              ? 'bg-[#17100b]/85 border-[#2c2015] text-[#cbb7a1]'
              : 'bg-[#ebe6dc]/85 border-[#ccc4b7] text-[#4b3e31]'
          }`}
        >
          <span className="hidden xl:inline text-[9px] font-mono font-bold uppercase tracking-[0.14em] opacity-80 whitespace-nowrap">
            Backdrop
          </span>

          <div className="flex flex-wrap items-center justify-between sm:justify-start gap-1 sm:gap-1.5 w-full xl:w-auto">
            <span className="text-[8.5px] font-mono uppercase tracking-wider opacity-65 whitespace-nowrap">
              Dark
            </span>
            {BACKDROP_OPTIONS.filter((o) => o.group === 'dark-wood').map((opt) => {
              const isSelected = backdropFinish === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onSelectBackdrop(opt.id)}
                  className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-[3px] text-[9px] font-mono font-semibold transition-all duration-150 cursor-pointer border whitespace-nowrap shrink-0 ${
                    isSelected
                      ? isDark
                        ? 'bg-[#2a1d13] border-[#e5a045] text-[#f7efe6]'
                        : 'bg-[#241910] border-[#c35626] text-white'
                      : isDark
                      ? 'bg-[#1b130d]/70 border-[#322418] text-[#bda894] hover:text-white hover:border-[#533c27]'
                      : 'bg-[#e3ddd2]/80 border-[#c9c0b2] text-[#4c3e31] hover:border-[#8e7d6a]'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="w-2.5 h-2.5 rounded-[1px] border border-white/20 shrink-0"
                    style={{ background: opt.swatchStyle }}
                  />
                  <span>{opt.label}</span>
                </button>
              );
            })}

            <span
              aria-hidden="true"
              className={`hidden sm:inline-block h-3.5 w-[1px] mx-0.5 ${
                isDark ? 'bg-[#38291b]' : 'bg-[#c5bcad]'
              }`}
            />

            <span className="text-[8.5px] font-mono uppercase tracking-wider opacity-65 whitespace-nowrap">
              Light
            </span>
            {BACKDROP_OPTIONS.filter((o) => o.group === 'light-wood').map((opt) => {
              const isSelected = backdropFinish === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onSelectBackdrop(opt.id)}
                  className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-[3px] text-[9px] font-mono font-semibold transition-all duration-150 cursor-pointer border whitespace-nowrap shrink-0 ${
                    isSelected
                      ? isDark
                        ? 'bg-[#f5efe6] border-[#e5a045] text-[#1f160e]'
                        : 'bg-white border-[#c35626] text-[#1f160e] shadow-xs'
                      : isDark
                      ? 'bg-[#1b130d]/70 border-[#322418] text-[#bda894] hover:text-white hover:border-[#533c27]'
                      : 'bg-[#f4f0e8]/90 border-[#ccc2b4] text-[#4c3e31] hover:text-[#1f160e] hover:border-[#94836f]'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="w-2.5 h-2.5 rounded-[1px] border border-black/15 shrink-0"
                    style={{ background: opt.swatchStyle }}
                  />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. PHOTOREALISTIC 5-BAY VINKRI FLAGSHIP ARCHITECTURAL SCENE    */}
      {/* ============================================================== */}
      <div className="relative w-full max-w-[980px] flex flex-col items-center">
        {/* REAL PHOTOGRAPHIC FLANKING URBAN STREET TREES & HORIZON */}
        <AnimatePresence>
          {!isExpanded && (
            <motion.div
              key="flanking-trees"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              aria-hidden="true"
              className="hidden md:block absolute -inset-x-10 -top-4 bottom-8 pointer-events-none overflow-hidden -z-10"
            >
              {/* Left Real Urban Avenue Tree */}
              <img
                src={
                  isDark
                    ? '/assets/aistudio/arch/dark_tree_left.jpg'
                    : '/assets/aistudio/arch/light_tree_left.jpg'
                }
                alt=""
                className="absolute left-0 bottom-0 h-[92%] w-[16%] object-cover object-right select-none"
                style={{
                  WebkitMaskImage:
                    'linear-gradient(90deg, transparent 0%, black 42%, black 88%, transparent 100%)',
                  maskImage:
                    'linear-gradient(90deg, transparent 0%, black 42%, black 88%, transparent 100%)'
                }}
              />
              {/* Right Real Urban Avenue Tree */}
              <img
                src={
                  isDark
                    ? '/assets/aistudio/arch/dark_tree_right.jpg'
                    : '/assets/aistudio/arch/light_tree_right.jpg'
                }
                alt=""
                className="absolute right-0 bottom-0 h-[92%] w-[16%] object-cover object-left select-none"
                style={{
                  WebkitMaskImage:
                    'linear-gradient(270deg, transparent 0%, black 42%, black 88%, transparent 100%)',
                  maskImage:
                    'linear-gradient(270deg, transparent 0%, black 42%, black 88%, transparent 100%)'
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Building Massing Row: [Left Corner Pier] + [Main 5-Bay Front Facade] + [3D Perspective Right Wing] */}
        <div className="relative w-full flex items-stretch justify-center px-0 sm:px-3">
          {/* Textured Heavy Dark Steel/Masonry Far-Left Corner Pilaster with Stepped Finial Cap & Seam Reveals */}
          <div
            aria-hidden="true"
            className={`hidden sm:flex flex-col justify-between relative w-2.5 md:w-3.5 shrink-0 border-y border-l overflow-hidden ${
              isDark
                ? 'bg-gradient-to-r from-[#0e0a07] via-[#261c14] to-[#1a130d] border-[#36281c]'
                : 'bg-gradient-to-r from-[#bdb3a3] via-[#d8d0c3] to-[#c7beb0] border-[#afa493]'
            }`}
          >
            <div
              className="absolute inset-0 opacity-15 mix-blend-overlay"
              style={{ backgroundImage: ARCH_GRAIN_SVG }}
            />
            {/* Top Finial Coping Cap */}
            <div
              className={`relative z-10 w-full h-[5px] border-b ${
                isDark
                  ? 'bg-[#3c2d1f] border-black/60'
                  : 'bg-[#e6dfd4] border-[#9c907e]'
              }`}
            />
            {/* Mid-Elevation Subtle Vertical Light Seam */}
            <div
              className={`relative z-10 mx-auto w-[1px] flex-1 my-3 ${
                isDark ? 'bg-[#6e5237]/25' : 'bg-white/40'
              }`}
            />
            {/* Base Curb Kickplate */}
            <div
              className={`relative z-10 w-full h-[6px] border-t ${
                isDark
                  ? 'bg-[#2a1f16] border-[#4e3a28]'
                  : 'bg-[#b3a896] border-[#dcd4c7]'
              }`}
            />
          </div>

          {/* MAIN 5-BAY BUILDING FACADE CORE */}
          <div
            className={`relative flex-1 min-w-0 border-y shadow-2xl ${
              isDark
                ? 'bg-[#17100A] border-[#2e2318] shadow-[0_28px_72px_rgba(0,0,0,0.88)]'
                : 'bg-[#dfd8cc] border-[#b7ac9c] shadow-[0_22px_52px_rgba(65,54,42,0.18)]'
            }`}
          >
            {/* ------------------------------------------------------- */}
            {/* SECTION A: ROOFTOP VINKRI CROWN + UPPER FLOORS          */}
            {/* ------------------------------------------------------- */}
            <motion.div
              initial={false}
              animate={{
                y: isExpanded ? -16 : 0,
                opacity: isExpanded ? 0 : 1,
                height: isExpanded ? 0 : 'auto'
              }}
              transition={{
                height: { duration: 0.56, ease: [0.22, 1, 0.36, 1] },
                opacity: {
                  duration: isExpanded ? 0.26 : 0.42,
                  ease: 'easeOut',
                  delay: isExpanded ? 0 : 0.12
                },
                y: { duration: 0.52, ease: [0.22, 1, 0.36, 1] }
              }}
              className={`w-full overflow-hidden origin-top select-none ${
                isExpanded ? 'pointer-events-none' : 'pointer-events-auto'
              }`}
            >
              {/* ROOFTOP PENTHOUSE MARQUEE WITH ARCHITECTURAL CORNICE & LIGHTING */}
              <div className="w-full flex items-end pointer-events-none">
                {/* Left Penthouse Parapet Cap */}
                <div className={`${leftWingCls} flex flex-col justify-end`}>
                  <div
                    className={`relative h-6 sm:h-8 border-t border-r-[3px] sm:border-r-[4px] flex flex-col justify-between px-2 py-1 overflow-hidden ${framePierBg}`}
                  >
                    <div
                      className="absolute inset-0 opacity-15 mix-blend-overlay"
                      style={{ backgroundImage: ARCH_GRAIN_SVG }}
                    />
                    <div
                      className={`relative z-10 w-full h-[2px] ${
                        isDark
                          ? 'bg-[#f4be72]/60 shadow-[0_0_10px_rgba(244,190,114,0.55)]'
                          : 'bg-[#ffffff]/75'
                      }`}
                    />
                    <div
                      className={`relative z-10 w-full h-[3px] ${
                        isDark ? 'bg-[#0e0a07]' : 'bg-[#b5aa98]'
                      }`}
                    />
                  </div>
                </div>

                {/* Center VINKRI Backlit Penthouse Signage */}
                <div className={`${centerWingCls} flex flex-col justify-end`}>
                  <div
                    className={`relative mx-1 sm:mx-2 h-9 sm:h-11 md:h-12 rounded-t-[2px] border-t border-x flex items-center justify-center overflow-hidden ${
                      isDark
                        ? 'bg-gradient-to-b from-[#1d1c1e] via-[#131316] to-[#0c0a08] border-[#423f42]'
                        : 'bg-gradient-to-b from-[#33271e] via-[#271d16] to-[#1b130e] border-[#615244]'
                    }`}
                    style={{
                      boxShadow: isDark
                        ? 'inset 0 6px 14px rgba(0,0,0,0.6), 0 -6px 24px rgba(255,255,255,0.06)'
                        : 'inset 0 5px 12px rgba(0,0,0,0.4)'
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-15 mix-blend-overlay"
                      style={{ backgroundImage: ARCH_GRAIN_SVG }}
                    />
                    <div
                      aria-hidden="true"
                      className={`absolute inset-x-0 top-0 h-[3px] ${
                        isDark
                          ? 'bg-gradient-to-r from-[#3a3430] via-[#6e6964] to-[#3a3430]'
                          : 'bg-[#7d6c5a]'
                      }`}
                    />
                    {/* Soft Backlit Halo behind VINKRI letters */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-[22%] inset-y-2 rounded-full blur-md bg-white/10"
                    />
                    <span className="relative z-10 font-display font-bold text-white text-[15px] sm:text-[21px] md:text-[25px] tracking-[0.44em] pl-[0.44em] drop-shadow-[0_0_12px_rgba(255,255,255,0.55)]">
                      VINKRI
                    </span>
                  </div>
                  {renderSlabBeam(true)}
                </div>

                {/* Right Penthouse Parapet Cap */}
                <div className={`${rightWingCls} flex flex-col justify-end`}>
                  <div
                    className={`relative h-6 sm:h-8 border-t border-l-[3px] sm:border-l-[4px] flex flex-col justify-between px-1.5 py-1 overflow-hidden ${framePierBg}`}
                  >
                    <div
                      className="absolute inset-0 opacity-15 mix-blend-overlay"
                      style={{ backgroundImage: ARCH_GRAIN_SVG }}
                    />
                    <div
                      className={`relative z-10 w-full h-[2px] ${
                        isDark
                          ? 'bg-[#f4be72]/60 shadow-[0_0_10px_rgba(244,190,114,0.55)]'
                          : 'bg-[#ffffff]/75'
                      }`}
                    />
                    <div
                      className={`relative z-10 w-full h-[3px] ${
                        isDark ? 'bg-[#0e0a07]' : 'bg-[#b5aa98]'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Upper Stories Above Active Floor */}
              {upperSlices.map((slice) => {
                if (slice.id === 'roof') {
                  return renderSlabBeam(true, slice.id);
                }
                return renderArchitecturalFloorRow(slice, !isExpanded);
              })}
            </motion.div>

            {/* Expanded Header Cap When Upper Stories Collapse */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  key="expanded-header-cap"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className={`w-full px-3 sm:px-4 py-2 border-b flex items-center justify-between gap-2 ${
                    isDark
                      ? 'bg-[#1b130d] border-[#38291b] text-[#f5e7d6]'
                      : 'bg-[#d9d1c4] border-[#b7ac9c] text-[#261d15]'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-[1px] shrink-0"
                      style={{
                        backgroundColor: isDark ? heroSlice.wingBgDark : heroSlice.wingBgLight
                      }}
                    />
                    <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase truncate">
                      {heroSlice.name} · {heroSlice.category}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleFloor()}
                    className={`flex items-center gap-1 text-[9.5px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      isDark
                        ? 'bg-[#2a1d13] hover:bg-[#3a281a] border-[#523b27] text-[#f4cfa0]'
                        : 'bg-[#f6f3ed] hover:bg-white border-[#b5aa99] text-[#281f17]'
                    }`}
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>Full Building</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ------------------------------------------------------- */}
            {/* SECTION B: SELECTED HERO FLOOR                          */}
            {/* ------------------------------------------------------- */}
            <motion.div
              key={`hero-floor-${activeFloor}`}
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-30 w-full"
            >
              {renderArchitecturalFloorRow(heroSlice, !isExpanded)}
            </motion.div>

            {/* ------------------------------------------------------- */}
            {/* SECTION C: 3-ROW EXPANDED ARCHITECTURAL GALLERY (9)     */}
            {/* ------------------------------------------------------- */}
            <motion.div
              initial={false}
              animate={{
                height: isExpanded ? 'auto' : 0,
                opacity: isExpanded ? 1 : 0
              }}
              transition={{
                height: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
                opacity: {
                  duration: isExpanded ? 0.42 : 0.24,
                  ease: [0.22, 1, 0.36, 1],
                  delay: isExpanded ? 0.06 : 0
                }
              }}
              className="relative w-full overflow-hidden z-20"
            >
              <motion.div
                key={`floor-tiers-${activeFloor}`}
                initial={isExpanded ? { opacity: 0.4, y: 6 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                className="w-full flex flex-col"
              >
              {rows.map((rowProds, rIdx) => {
                const rowElement = (
                  <div key={`expanded-row-${rIdx}`} className="w-full flex flex-col">
                    <div className="w-full flex items-stretch">
                      {/* Left Recessed Architectural Extension Wing */}
                      <div
                        className={`${leftWingCls} relative flex flex-col justify-center px-2 sm:px-3.5 border-r-[3px] sm:border-r-[4px] overflow-hidden ${
                          isDark ? 'border-[#211811]' : 'border-[#b9ae9d]'
                        }`}
                        style={{
                          backgroundColor: isDark
                            ? heroSlice.wingBgDark
                            : heroSlice.wingBgLight,
                          boxShadow: isDark
                            ? 'inset 0 8px 16px rgba(0,0,0,0.62), inset 5px 0 10px rgba(0,0,0,0.48), inset -5px 0 10px rgba(0,0,0,0.48)'
                            : 'inset 0 6px 12px rgba(25,18,10,0.45), inset 4px 0 8px rgba(25,18,10,0.32)'
                        }}
                      >
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
                          style={{ backgroundImage: ARCH_GRAIN_SVG }}
                        />
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background:
                              'radial-gradient(ellipse 65% 38% at 50% 2%, rgba(255,244,218,0.18) 0%, transparent 75%)'
                          }}
                        />
                        <span className="relative z-10 text-[6.5px] sm:text-[8px] font-mono font-bold tracking-[0.16em] text-white/75 uppercase">
                          TIER 0{rIdx + 1} · GALLERY
                        </span>
                        <span className="relative z-10 text-[8.5px] sm:text-[11px] font-black tracking-tight text-white/95 uppercase leading-tight mt-0.5">
                          EDITIONS 0{rIdx * 3 + 1}–0{rIdx * 3 + 3}
                        </span>
                        <span className="relative z-10 hidden sm:block text-[7.5px] font-mono text-white/70 mt-0.5 truncate">
                          {rowProds.map((p) => p.name.split(' ')[0]).join(' · ')}
                        </span>
                      </div>

                      {/* Center 3 Photographed Window Bays Hosting 9 Product Vitrines */}
                      <div
                        className={`${centerWingCls} relative overflow-hidden ${
                          isDark ? 'bg-[#17100A]' : 'bg-[#e3ddd2]'
                        }`}
                      >
                        {rIdx === 0 && activeFloor === 1 && (
                          <div
                            className="relative w-full overflow-hidden"
                            style={{ aspectRatio: `${arch.cropWidthPx} / 11` }}
                          >
                            <div
                              className="relative h-full"
                              style={{
                                width: arch.innerWidthPct,
                                marginLeft: arch.innerMarginLeftPct
                              }}
                            >
                              <img
                                src={emptyFloorSrc}
                                alt=""
                                aria-hidden="true"
                                className="w-full h-auto block select-none pointer-events-none object-cover object-bottom"
                                style={{ aspectRatio: '656 / 103', marginTop: '-14.02%' }}
                              />
                            </div>
                          </div>
                        )}

                        <CenterCropSlice
                          src={emptyFloorSrc}
                          alt=""
                          height={103}
                          arch={arch}
                        >
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
                        </CenterCropSlice>
                      </div>

                      {/* Right Architectural Row Counter Bay */}
                      <div
                        className={`${rightWingCls} relative flex flex-col items-center justify-center border-l-[3px] sm:border-l-[4px] overflow-hidden ${
                          isDark ? 'border-[#211811]' : 'border-[#b9ae9d]'
                        }`}
                        style={{
                          backgroundColor: isDark
                            ? heroSlice.wingBgDark
                            : heroSlice.wingBgLight,
                          boxShadow: isDark
                            ? 'inset 0 8px 16px rgba(0,0,0,0.62), inset 5px 0 10px rgba(0,0,0,0.48), inset -5px 0 10px rgba(0,0,0,0.48)'
                            : 'inset 0 6px 12px rgba(25,18,10,0.45)'
                        }}
                      >
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
                          style={{ backgroundImage: ARCH_GRAIN_SVG }}
                        />
                        <span className="relative z-10 text-[10px] sm:text-[13px] font-display font-black text-white/90 tabular-nums leading-none">
                          R0{rIdx + 1}
                        </span>
                        <span className="relative z-10 text-[5.5px] sm:text-[7px] font-mono font-bold tracking-[0.18em] text-white/70 uppercase mt-0.5">
                          0{activeFloor}F
                        </span>
                      </div>
                    </div>
                    {renderSlabBeam(false)}
                  </div>
                );

                return (
                  <motion.div
                    key={`expanded-row-wrap-${rIdx}`}
                    initial={false}
                    animate={{
                      y: isExpanded ? 0 : -(10 + rIdx * 6),
                      opacity: isExpanded ? 1 : 0
                    }}
                    transition={{
                      duration: 0.46,
                      ease: [0.22, 1, 0.36, 1],
                      delay: isExpanded ? 0.06 + rIdx * 0.065 : 0
                    }}
                  >
                    {rowElement}
                  </motion.div>
                );
              })}
              </motion.div>
            </motion.div>

            {/* ------------------------------------------------------- */}
            {/* SECTION D: LOWER FLOORS & REAL GROUND BOUTIQUE LOBBY    */}
            {/* ------------------------------------------------------- */}
            <motion.div
              initial={false}
              animate={{
                y: isExpanded ? 16 : 0,
                opacity: isExpanded ? 0 : 1,
                height: isExpanded ? 0 : 'auto'
              }}
              transition={{
                height: { duration: 0.56, ease: [0.22, 1, 0.36, 1] },
                opacity: {
                  duration: isExpanded ? 0.26 : 0.42,
                  ease: 'easeOut',
                  delay: isExpanded ? 0 : 0.12
                },
                y: { duration: 0.52, ease: [0.22, 1, 0.36, 1] }
              }}
              className={`w-full overflow-hidden origin-top select-none ${
                isExpanded ? 'pointer-events-none' : 'pointer-events-auto'
              }`}
            >
              {lowerSlices.map((slice) => {
                if (slice.id !== 'ground') {
                  return renderArchitecturalFloorRow(slice, !isExpanded);
                }

                // FULL-WIDTH PHOTOGRAPHIC GROUND LOBBY ROW
                return (
                  <div
                    key={slice.id}
                    className={`w-full flex items-stretch pointer-events-none ${
                      isDark ? 'bg-[#17100A]' : 'bg-[#e3ddd2]'
                    }`}
                  >
                    {/* LEFT REAL PHOTOGRAPHIC GROUND BOUTIQUE WINDOWS + BOTANICAL PLANTERS */}
                    <div
                      className={`${leftWingCls} relative flex flex-col justify-between border-r-[3px] sm:border-r-[4px] overflow-hidden ${
                        isDark
                          ? 'bg-[#130d08] border-[#211811]'
                          : 'bg-[#dfd7ca] border-[#b9ae9d]'
                      }`}
                    >
                      {/* Top Architectural Signboard Fascia Band matching Center VINKRI Band */}
                      <div
                        className={`h-[14%] w-full border-b flex items-center px-2 sm:px-3 ${
                          isDark
                            ? 'bg-gradient-to-b from-[#664c32] via-[#533c26] to-[#3f2c1b] border-[#1f160e]'
                            : 'bg-gradient-to-b from-[#aa8d6b] via-[#967b5b] to-[#7c6347] border-[#6e563c]'
                        }`}
                      >
                        <div className="w-full h-[1px] bg-white/18" />
                      </div>

                      {/* Real Photographed Warm Storefront Boutique Display Windows (From Matching Ground Storefront!) */}
                      <div className="flex-1 p-1 sm:p-1.5 pb-2 grid grid-cols-2 gap-1 sm:gap-1.5 relative">
                        <div
                          className={`relative rounded-[1px] border overflow-hidden ${
                            isDark ? 'border-[#2f2217]' : 'border-[#9c8c79]'
                          }`}
                        >
                          <img
                            src={
                              isDark
                                ? '/assets/aistudio/arch/dark_ground_bay1.jpg'
                                : '/assets/aistudio/arch/light_ground_bay1.jpg'
                            }
                            alt=""
                            className="w-full h-full object-cover select-none"
                          />
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background:
                                'linear-gradient(122deg, rgba(255,255,255,0.12) 0%, transparent 45%)'
                            }}
                          />
                        </div>

                        <div
                          className={`relative rounded-[1px] border overflow-hidden ${
                            isDark ? 'border-[#2f2217]' : 'border-[#9c8c79]'
                          }`}
                        >
                          <img
                            src={
                              isDark
                                ? '/assets/aistudio/arch/dark_ground_bay2.jpg'
                                : '/assets/aistudio/arch/light_ground_bay2.jpg'
                            }
                            alt=""
                            className="w-full h-full object-cover select-none"
                          />
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background:
                                'linear-gradient(122deg, rgba(255,255,255,0.12) 0%, transparent 45%)'
                            }}
                          />
                        </div>
                      </div>

                      <PhotoPlanterCluster isDark={isDark} count={2} />
                    </div>

                    {/* CENTER VINKRI GROUND STOREFRONT & CENTER DOORS (Real Photographed Ground) */}
                    <div
                      className={`${centerWingCls} relative overflow-hidden ${
                        isDark ? 'bg-[#17100A]' : 'bg-[#e3ddd2]'
                      }`}
                    >
                      <CenterCropSlice
                        src={isDark ? slice.darkSrc : slice.lightSrc}
                        alt="VINKRI Ground Atelier Storefront"
                        height={slice.height}
                        arch={arch}
                      />
                    </div>

                    {/* RIGHT GROUND ARCHITECTURAL WALL ("IDEAS INTO EVERYDAY OBJECTS ->") */}
                    <div
                      className={`${rightWingCls} relative flex flex-col justify-between border-l-[3px] sm:border-l-[4px] overflow-hidden ${
                        isDark
                          ? 'bg-[#18120d] border-[#211811]'
                          : 'bg-[#cfc6b7] border-[#b9ae9d]'
                      }`}
                    >
                      <div
                        className={`relative h-[14%] w-full border-b flex items-center px-1.5 ${
                          isDark
                            ? 'bg-gradient-to-b from-[#664c32] via-[#533c26] to-[#3f2c1b] border-[#1f160e]'
                            : 'bg-gradient-to-b from-[#aa8d6b] via-[#967b5b] to-[#7c6347] border-[#6e563c]'
                        }`}
                      >
                        <div className="w-full h-[1px] bg-white/18" />
                      </div>

                      <div className="relative flex-1 flex flex-col items-start justify-center px-1.5 sm:px-2.5 pb-5 overflow-hidden">
                        {/* Subtle Wall Grain, Inset Plaque Border & Architectural Spotlight Grazing the Engraved Type */}
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 opacity-15 mix-blend-overlay"
                          style={{ backgroundImage: ARCH_GRAIN_SVG }}
                        />
                        <div
                          aria-hidden="true"
                          className="hidden sm:block absolute inset-[3px] border border-white/[0.08] pointer-events-none"
                        />
                        <span aria-hidden="true" className="hidden sm:block absolute top-[5px] right-[5px] w-[2px] h-[2px] rounded-full bg-white/30 pointer-events-none" />
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: isDark
                              ? 'radial-gradient(ellipse 80% 55% at 50% 10%, rgba(255,216,158,0.22) 0%, transparent 75%)'
                              : 'radial-gradient(ellipse 80% 55% at 50% 10%, rgba(255,255,255,0.40) 0%, transparent 75%)'
                          }}
                        />

                        <span
                          className={`relative z-10 text-[5.5px] sm:text-[7.5px] md:text-[8.5px] font-mono font-bold tracking-[0.12em] uppercase leading-[1.3] ${
                            isDark ? 'text-[#dfd0be]' : 'text-[#2b2017]'
                          }`}
                        >
                          IDEAS
                          <br />
                          INTO
                          <br />
                          EVERYDAY
                          <br />
                          OBJECTS
                        </span>
                        <ArrowRight
                          className={`relative z-10 w-2.5 h-2.5 sm:w-3 sm:h-3 mt-1 ${
                            isDark ? 'text-[#e5a045]' : 'text-[#c35626]'
                          }`}
                        />
                      </div>

                      <PhotoPlanterCluster isDark={isDark} count={1} />
                    </div>
                  </div>
                );
              })}

              {/* Ground Floor Granite & Brushed Bronze Plinth Skirting Beam */}
              <div
                aria-hidden="true"
                className={`w-full h-[5px] border-t ${
                  isDark
                    ? 'bg-gradient-to-b from-[#2f2217] via-[#1c140e] to-[#0d0906] border-[#513b27]/75'
                    : 'bg-gradient-to-b from-[#d2c8b8] via-[#b7ac9a] to-[#988c79] border-white/60'
                }`}
              />
            </motion.div>

            {/* Expanded Architectural Base Plinth (Flush with Left & Right Building Piers) */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  key="expanded-base-plinth"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className={`w-full px-3 sm:px-4 py-2 border-t flex items-center justify-between gap-2 ${
                    isDark
                      ? 'bg-[#1a120b] border-[#3a2a1b] text-[#cbb7a1]'
                      : 'bg-[#dfd8cc] border-[#b7ac9c] text-[#4d3f32]'
                  }`}
                >
                  <span className="text-[9.5px] font-mono uppercase tracking-wider truncate">
                    {nicheProducts.length} Editions on {heroSlice.name} · Click any piece to inspect
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleFloor()}
                    className={`text-[9.5px] font-mono font-bold uppercase tracking-wider underline underline-offset-4 cursor-pointer whitespace-nowrap shrink-0 ${
                      isDark ? 'text-[#e5a045] hover:text-[#f5c27d]' : 'text-[#c35626] hover:text-[#9c3e14]'
                    }`}
                  >
                    Close Floor View
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT 3D PERSPECTIVE ARCHITECTURAL SIDE ELEVATION (Intact) OR SYMMETRIC CORNER PILASTER (Expanded) */}
          {!isExpanded ? (
            <div
              aria-hidden="true"
              className="hidden sm:block relative w-6 md:w-10 shrink-0 overflow-hidden select-none pointer-events-none"
            >
              <img
                src={
                  isDark
                    ? '/assets/aistudio/arch/dark_side_wall.jpg'
                    : '/assets/aistudio/arch/light_side_wall.jpg'
                }
                alt=""
                className="w-full h-full block object-cover object-left select-none"
                style={{
                  WebkitMaskImage:
                    'linear-gradient(90deg, black 52%, transparent 100%)',
                  maskImage: 'linear-gradient(90deg, black 52%, transparent 100%)'
                }}
              />
            </div>
          ) : (
            <div
              aria-hidden="true"
              className={`hidden sm:flex flex-col justify-between relative w-2.5 md:w-3.5 shrink-0 border-y border-r overflow-hidden ${
                isDark
                  ? 'bg-gradient-to-l from-[#0e0a07] via-[#261c14] to-[#1a130d] border-[#36281c]'
                  : 'bg-gradient-to-l from-[#bdb3a3] via-[#d8d0c3] to-[#c7beb0] border-[#afa493]'
              }`}
            >
              <div
                className="absolute inset-0 opacity-15 mix-blend-overlay"
                style={{ backgroundImage: ARCH_GRAIN_SVG }}
              />
              <div
                className={`relative z-10 w-full h-[5px] border-b ${
                  isDark
                    ? 'bg-[#3c2d1f] border-black/60'
                    : 'bg-[#e6dfd4] border-[#9c907e]'
                }`}
              />
              <div
                className={`relative z-10 mx-auto w-[1px] flex-1 my-3 ${
                  isDark ? 'bg-[#6e5237]/25' : 'bg-white/40'
                }`}
              />
              <div
                className={`relative z-10 w-full h-[6px] border-t ${
                  isDark
                    ? 'bg-[#2a1f16] border-[#4e3a28]'
                    : 'bg-[#b3a896] border-[#dcd4c7]'
                }`}
              />
            </div>
          )}
        </div>

        {/* ----------------------------------------------------------- */}
        {/* REAL PHOTOGRAPHIC WET REFLECTIVE SIDEWALK (TRUE ALPHA FADE) */}
        {/* ----------------------------------------------------------- */}
        <AnimatePresence>
          {!isExpanded && (
            <motion.div
              key="wet-sidewalk"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden="true"
              className="relative w-full overflow-hidden pointer-events-none"
            >
              <div className="relative w-full h-11 sm:h-16 overflow-hidden">
                <img
                  src={
                    isDark
                      ? '/assets/aistudio/arch/dark_sidewalk.jpg'
                      : '/assets/aistudio/arch/light_sidewalk.jpg'
                  }
                  alt=""
                  className="w-full h-full block object-cover object-top select-none"
                  style={{
                    WebkitMaskImage:
                      'linear-gradient(90deg, transparent 0%, black 14%, black 86%, transparent 100%), linear-gradient(180deg, black 0%, black 38%, transparent 100%)',
                    WebkitMaskComposite: 'source-in',
                    maskImage:
                      'linear-gradient(90deg, transparent 0%, black 14%, black 86%, transparent 100%), linear-gradient(180deg, black 0%, black 38%, transparent 100%)',
                    maskComposite: 'intersect'
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </MotionConfig>
  );
};
