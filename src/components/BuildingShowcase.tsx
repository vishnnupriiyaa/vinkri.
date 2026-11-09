import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Play, ShoppingBag, Check, Sparkles, Info } from 'lucide-react';
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

  // Synchronize when selectedFloorNumber changes externally
  useEffect(() => {
    if (selectedFloorNumber !== undefined && selectedFloorNumber !== null) {
      setActiveFloor(selectedFloorNumber);
      setIsExpanded(true);
    }
  }, [selectedFloorNumber]);

  // Handle floor click toggle with immediate responsiveness
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

  // Replay animation sequence from start
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

  // Find active slice index
  const activeIndex = BUILDING_SLICES.findIndex((s) => s.floorNumber === activeFloor);
  const safeActiveIndex = activeIndex >= 0 ? activeIndex : 3;

  // Slices above the active floor (slides UP)
  const upperSlices = BUILDING_SLICES.slice(0, safeActiveIndex);

  // The active floor slice itself (stays in place as the showcase header)
  const heroSlice = BUILDING_SLICES[safeActiveIndex];

  // Slices below the active floor (slides DOWN)
  const lowerSlices = BUILDING_SLICES.slice(safeActiveIndex + 1);

  // All 9 distinct, non-repeating products for the active floor (matching their images & descriptions)
  const allFloorProducts = PRODUCTS_DATA.filter((p) => p.floorNumber === activeFloor);
  const nicheProducts = allFloorProducts.slice(0, 9);

  // Row 1 products (replaced the solid brown/blue blocks)
  const row1Products = nicheProducts.slice(0, 3);
  // Row 2 products
  const row2Products = nicheProducts.slice(3, 6);
  // Row 3 products
  const row3Products = nicheProducts.slice(6, 9);

  return (
    <div
      ref={containerRef}
      className="relative w-full flex flex-col items-center select-none font-sans"
    >
      {/* ============================================================== */}
      {/* 1. TOP INTERACTIVE CONTROLLER BAR                              */}
      {/* Clean, Uniform Floor Selector For All 5 Floors                 */}
      {/* ============================================================== */}
      <div
        className={`w-full max-w-[656px] mb-3 px-3 py-2 rounded-xl flex flex-wrap items-center justify-between gap-2 border transition-all duration-300 shadow-sm ${
          isDark
            ? 'bg-[#150e09] border-[#2c1d12] text-[#f7f2ea]'
            : 'bg-[#faf6f0] border-[#decbb8] text-[#2c1e13]'
        }`}
      >
        {/* Toggle / Reassemble Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleToggleFloor()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono font-black uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-95 shadow-sm ${
              isExpanded
                ? isDark
                  ? 'bg-[#e5a045] hover:bg-[#cca348] text-black font-black ring-2 ring-[#e5a045]/40'
                  : 'bg-[#008ba8] hover:bg-[#00748d] text-white font-black ring-2 ring-[#008ba8]/40'
                : isDark
                ? 'bg-[#26170d] hover:bg-[#382314] text-[#f5c27d] border border-[#4a2e19]'
                : 'bg-white hover:bg-neutral-100 text-[#006078] border border-[#decbb8]'
            }`}
          >
            <RotateCcw className={`w-3 h-3 transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`} />
            <span>{isExpanded ? 'Reassemble Cabinet' : 'Click Floor to Drop Down'}</span>
          </button>

          {/* Active floor category badge */}
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono font-bold">
            <span
              className={`w-2 h-2 rounded-full ${
                isExpanded
                  ? isDark
                    ? 'bg-[#e5a045] animate-pulse'
                    : 'bg-[#008ba8] animate-pulse'
                  : 'bg-emerald-500'
              }`}
            />
            <span className="opacity-90 font-black">
              {heroSlice.name} • {heroSlice.category}
            </span>
          </div>
        </div>

        {/* Floor Selection Tabs (05 - 01) - 100% Uniform & Consistent */}
        <div className="flex items-center gap-1 flex-wrap">
          {[5, 4, 3, 2, 1].map((floorNum) => {
            const isActive = activeFloor === floorNum && isExpanded;
            const slice = BUILDING_SLICES.find((s) => s.floorNumber === floorNum);

            return (
              <button
                key={floorNum}
                type="button"
                onClick={() => handleToggleFloor(floorNum)}
                className={`px-2 py-1 rounded text-[9.5px] font-mono font-black transition-all cursor-pointer flex items-center gap-1 active:scale-95 ${
                  isActive
                    ? isDark
                      ? 'bg-[#e5a045] text-black shadow-md font-black ring-1 ring-[#e5a045]'
                      : 'bg-[#008ba8] text-white shadow-md font-black ring-1 ring-[#008ba8]'
                    : isDark
                    ? 'bg-[#20140c] text-[#c2b09e] hover:text-white hover:bg-[#301f13] border border-[#301f13]'
                    : 'bg-white text-[#69584b] hover:text-[#1e140d] hover:bg-neutral-50 border border-[#decbb8]'
                }`}
                title={`Floor 0${floorNum}: ${slice?.category || ''} (Click to drop down products)`}
              >
                <span>0{floorNum}</span>
                <span className="hidden md:inline text-[8.5px] font-bold opacity-85 uppercase">
                  {floorNum === 5 ? 'TOYS' : floorNum === 4 ? 'DIORAMA' : floorNum === 3 ? 'CARS' : floorNum === 2 ? 'FIGURES' : 'LAMPS'}
                </span>
              </button>
            );
          })}

          {/* Sequence Replay */}
          <button
            type="button"
            onClick={handleReplaySequence}
            className={`p-1.5 ml-1 rounded border transition-colors cursor-pointer active:scale-95 ${
              isDark
                ? 'bg-[#20140c] text-[#a89685] hover:text-white border-[#301f13]'
                : 'bg-white text-[#69584b] hover:text-[#1e140d] border-[#decbb8]'
            }`}
            title="Replay Video Drop Down Animation"
          >
            <Play className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. THE 656PX ARCHITECTURAL BUILDING VIEWPORT                    */}
      {/* Clean Drop Down Mechanics For All Floors                       */}
      {/* ============================================================== */}
      <div
        className={`relative w-full max-w-[656px] rounded-2xl overflow-hidden border transition-all duration-300 shadow-2xl ${
          isDark
            ? 'bg-[#0a0705] border-[#2e2015] shadow-[0_20px_50px_rgba(0,0,0,0.85)]'
            : 'bg-[#faf6f0] border-[#decbb8] shadow-[0_20px_50px_rgba(195,86,38,0.12)]'
        }`}
      >
        <div className="relative w-full flex flex-col items-center">
          {/* ----------------------------------------------------------- */}
          {/* SECTION A: UPPER SLICES (ALL FLOORS ABOVE ACTIVE FLOOR)     */}
          {/* Slides UPWARD and leaves canvas during drop down            */}
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
          {/* Stays in place as the showcase header during drop down      */}
          {/* ----------------------------------------------------------- */}
          <div
            onClick={() => handleToggleFloor()}
            className="group/shelf relative w-full z-30 select-none cursor-pointer"
            style={{ width: '656px', maxWidth: '100%' }}
            title={isExpanded ? 'Click to reassemble cabinet' : 'Click to trigger video drop down'}
          >
            <img
              src={isDark ? heroSlice.darkSrc : heroSlice.lightSrc}
              alt={`${heroSlice.name} Showcase`}
              className="w-full h-auto block select-none pointer-events-none group-hover/shelf:brightness-105 transition-[filter]"
              style={{ aspectRatio: `656 / ${heroSlice.height}` }}
            />

            {/* Interactive Hover Prompt on Hero Shelf */}
            <div className="absolute inset-0 bg-black/0 group-hover/shelf:bg-black/15 transition-colors flex items-center justify-between px-4 pointer-events-none">
              <span
                className={`text-[8.5px] sm:text-[9.5px] font-mono font-black uppercase px-2.5 py-1 rounded backdrop-blur-md border shadow-xs transition-opacity ${
                  isExpanded
                    ? isDark
                      ? 'bg-[#22160d]/90 text-[#e5a045] border-[#e5a045]/60'
                      : 'bg-[#008ba8]/90 text-white border-white/40'
                    : isDark
                    ? 'bg-[#150e09]/90 text-[#c2b09e] border-[#382618]'
                    : 'bg-white/90 text-[#3a2517] border-[#decbb8]'
                }`}
              >
                {heroSlice.name} • {heroSlice.category}
              </span>

              <span
                className={`text-[8px] sm:text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded backdrop-blur-md border transition-all ${
                  isExpanded
                    ? 'bg-emerald-600 text-white border-emerald-400 opacity-90'
                    : 'opacity-0 group-hover/shelf:opacity-100 ' +
                      (isDark
                        ? 'bg-[#e5a045] text-black border-[#e5a045]'
                        : 'bg-[#008ba8] text-white border-[#005a6e]')
                }`}
              >
                {isExpanded ? 'CLICK TO REASSEMBLE ↺' : 'CLICK FLOOR TO EXPAND ▾'}
              </span>
            </div>
          </div>

          {/* Quick Floor Switcher Strip when Expanded (Uniform styling for all 5 floors) */}
          {isExpanded && (
            <div
              className={`w-full py-1.5 px-3 flex items-center justify-between border-b z-25 transition-colors ${
                isDark
                  ? 'bg-[#120c07] border-[#2c1d12] text-[#f7f2ea]'
                  : 'bg-[#f5ece1] border-[#decbb8] text-[#2c1e13]'
              }`}
              style={{ width: '656px', maxWidth: '100%' }}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[8.5px] font-mono font-bold tracking-wider opacity-75">
                  SELECT LEVEL:
                </span>
                <span className="text-[9px] font-mono font-black text-amber-500">
                  0{activeFloor} {heroSlice.category}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[5, 4, 3, 2, 1].map((floorNum) => {
                  const isCurrent = activeFloor === floorNum;
                  return (
                    <button
                      key={floorNum}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFloor(floorNum);
                      }}
                      className={`px-2 py-0.5 rounded text-[8.5px] font-mono font-black transition-all cursor-pointer flex items-center gap-1 active:scale-95 ${
                        isCurrent
                          ? isDark
                            ? 'bg-[#e5a045] text-black ring-1 ring-[#e5a045] font-black shadow-xs'
                            : 'bg-[#008ba8] text-white ring-1 ring-[#008ba8] font-black shadow-xs'
                          : isDark
                          ? 'bg-[#1e130a] text-[#c2b09e] hover:text-white hover:bg-[#2e1c10] border border-[#301f13]'
                          : 'bg-white text-[#69584b] hover:text-[#1e140d] hover:bg-neutral-100 border border-[#decbb8]'
                      }`}
                    >
                      <span>0{floorNum}</span>
                      <span className="text-[7.5px] font-semibold opacity-85 hidden sm:inline">
                        {floorNum === 5 ? 'TOYS' : floorNum === 4 ? 'DIORAMA' : floorNum === 3 ? 'CARS' : floorNum === 2 ? 'FIGURES' : 'LAMPS'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* SECTION C: THE 3-ROW SUSPENDED GANTRY                       */}
          {/* ALL 3 ROWS FILLED WITH UNIQUE, MATCHING PRODUCT IMAGES      */}
          {/* Row 1: Products 0, 1, 2 (Animate Down with Drop Down)       */}
          {/* Row 2: Products 3, 4, 5                                     */}
          {/* Row 3: Products 6, 7, 8                                     */}
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
            {/* The Architectural Wooden Cabinet SVG Structure */}
            <svg
              viewBox="0 0 656 248"
              className="w-full h-auto block select-none"
              style={{ aspectRatio: '656 / 248' }}
            >
              <defs>
                {/* Light Mode Wood Gradients */}
                <linearGradient id="lightWoodBeam" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#d3c2af" />
                  <stop offset="40%" stopColor="#bea892" />
                  <stop offset="100%" stopColor="#9a836d" />
                </linearGradient>
                <linearGradient id="lightWoodPost" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#9a836d" />
                  <stop offset="30%" stopColor="#d3c2af" />
                  <stop offset="70%" stopColor="#bea892" />
                  <stop offset="100%" stopColor="#8a735d" />
                </linearGradient>

                {/* Dark Mode Wood Gradients */}
                <linearGradient id="darkWoodBeam" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3a2517" />
                  <stop offset="40%" stopColor="#26160d" />
                  <stop offset="100%" stopColor="#160c06" />
                </linearGradient>
                <linearGradient id="darkWoodPost" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#160c06" />
                  <stop offset="30%" stopColor="#3a2517" />
                  <stop offset="70%" stopColor="#26160d" />
                  <stop offset="100%" stopColor="#140a05" />
                </linearGradient>

                {/* Niche Ambient Glow */}
                <radialGradient id="nicheAmbientGlow" cx="50%" cy="30%" r="60%">
                  <stop offset="0%" stopColor="#fff8eb" stopOpacity={isDark ? '0.12' : '0.65'} />
                  <stop offset="100%" stopColor="#fff8eb" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* ------------------------------------------------------- */}
              {/* ROW 1: 3 COMPARTMENTS                                   */}
              {/* ------------------------------------------------------- */}
              {/* Top Connecting Wooden Beam */}
              <rect
                x="0"
                y="0"
                width="656"
                height="8"
                fill={isDark ? 'url(#darkWoodBeam)' : 'url(#lightWoodBeam)'}
              />

              {/* Row 1 Background Cells */}
              <rect x="14" y="8" width="202" height="66" fill={isDark ? '#140d08' : '#ffffff'} />
              <rect x="226" y="8" width="204" height="66" fill={isDark ? '#140d08' : '#ffffff'} />
              <rect x="440" y="8" width="202" height="66" fill={isDark ? '#140d08' : '#ffffff'} />

              {/* Ambient Glow in Row 1 */}
              <rect x="14" y="8" width="202" height="66" fill="url(#nicheAmbientGlow)" />
              <rect x="226" y="8" width="204" height="66" fill="url(#nicheAmbientGlow)" />
              <rect x="440" y="8" width="202" height="66" fill="url(#nicheAmbientGlow)" />

              {/* Outer Left & Right Wooden Frame Pillars */}
              <rect x="0" y="8" width="14" height="66" fill={isDark ? 'url(#darkWoodPost)' : 'url(#lightWoodPost)'} />
              <rect x="642" y="8" width="14" height="66" fill={isDark ? 'url(#darkWoodPost)' : 'url(#lightWoodPost)'} />

              {/* Interior Vertical Wooden Dividers */}
              <rect x="216" y="8" width="10" height="66" fill={isDark ? 'url(#darkWoodPost)' : 'url(#lightWoodPost)'} />
              <rect x="430" y="8" width="10" height="66" fill={isDark ? 'url(#darkWoodPost)' : 'url(#lightWoodPost)'} />

              {/* ------------------------------------------------------- */}
              {/* ROW 2: 3 COMPARTMENTS                                   */}
              {/* ------------------------------------------------------- */}
              {/* Middle Horizontal Beam 1 */}
              <rect
                x="0"
                y="74"
                width="656"
                height="8"
                fill={isDark ? 'url(#darkWoodBeam)' : 'url(#lightWoodBeam)'}
              />

              {/* Row 2 Background Cells */}
              <rect x="14" y="82" width="202" height="70" fill={isDark ? '#140d08' : '#ffffff'} />
              <rect x="226" y="82" width="204" height="70" fill={isDark ? '#140d08' : '#ffffff'} />
              <rect x="440" y="82" width="202" height="70" fill={isDark ? '#140d08' : '#ffffff'} />

              {/* Ambient Glow in Row 2 */}
              <rect x="14" y="82" width="202" height="70" fill="url(#nicheAmbientGlow)" />
              <rect x="226" y="82" width="204" height="70" fill="url(#nicheAmbientGlow)" />
              <rect x="440" y="82" width="202" height="70" fill="url(#nicheAmbientGlow)" />

              {/* Outer Pillars & Inner Dividers */}
              <rect x="0" y="82" width="14" height="70" fill={isDark ? 'url(#darkWoodPost)' : 'url(#lightWoodPost)'} />
              <rect x="642" y="82" width="14" height="70" fill={isDark ? 'url(#darkWoodPost)' : 'url(#lightWoodPost)'} />
              <rect x="216" y="82" width="10" height="70" fill={isDark ? 'url(#darkWoodPost)' : 'url(#lightWoodPost)'} />
              <rect x="430" y="82" width="10" height="70" fill={isDark ? 'url(#darkWoodPost)' : 'url(#lightWoodPost)'} />

              {/* ------------------------------------------------------- */}
              {/* ROW 3: 3 COMPARTMENTS                                   */}
              {/* ------------------------------------------------------- */}
              {/* Middle Horizontal Beam 2 */}
              <rect
                x="0"
                y="152"
                width="656"
                height="8"
                fill={isDark ? 'url(#darkWoodBeam)' : 'url(#lightWoodBeam)'}
              />

              {/* Row 3 Background Cells */}
              <rect x="14" y="160" width="202" height="72" fill={isDark ? '#140d08' : '#ffffff'} />
              <rect x="226" y="160" width="204" height="72" fill={isDark ? '#140d08' : '#ffffff'} />
              <rect x="440" y="160" width="202" height="72" fill={isDark ? '#140d08' : '#ffffff'} />

              {/* Ambient Glow in Row 3 */}
              <rect x="14" y="160" width="202" height="72" fill="url(#nicheAmbientGlow)" />
              <rect x="226" y="160" width="204" height="72" fill="url(#nicheAmbientGlow)" />
              <rect x="440" y="160" width="202" height="72" fill="url(#nicheAmbientGlow)" />

              {/* Outer Pillars & Inner Dividers */}
              <rect x="0" y="160" width="14" height="72" fill={isDark ? 'url(#darkWoodPost)' : 'url(#lightWoodPost)'} />
              <rect x="642" y="160" width="14" height="72" fill={isDark ? 'url(#darkWoodPost)' : 'url(#lightWoodPost)'} />
              <rect x="216" y="160" width="10" height="72" fill={isDark ? 'url(#darkWoodPost)' : 'url(#lightWoodPost)'} />
              <rect x="430" y="160" width="10" height="72" fill={isDark ? 'url(#darkWoodPost)' : 'url(#lightWoodPost)'} />

              {/* Bottom Foundation Wooden Beam */}
              <rect
                x="0"
                y="232"
                width="656"
                height="16"
                fill={isDark ? 'url(#darkWoodBeam)' : 'url(#lightWoodBeam)'}
              />
            </svg>

            {/* ========================================================= */}
            {/* PRODUCT COMPARTMENTS IN ALL 3 ROWS (9 UNIQUE PRODUCTS)    */}
            {/* All Products Display Authentic Matching Images & Details  */}
            {/* ========================================================= */}
            <div className="absolute inset-0 z-25 pointer-events-none">
              {/* ------------------------------------------------------- */}
              {/* ROW 1: PRODUCTS 0, 1, 2 (ENTRANCE DROP DOWN ANIMATION)  */}
              {/* Replaced the solid brown/blue blocks                    */}
              {/* ------------------------------------------------------- */}
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
                  top: '3.23%', // 8px / 248px
                  height: '26.61%', // 66px / 248px
                  left: '2.13%', // 14px / 656px
                  right: '2.13%' // 14px / 656px
                }}
              >
                {[0, 1, 2].map((i) => {
                  const prod = row1Products[i];
                  if (!prod) return <div key={i} className="flex-1" />;
                  const isHovered = hoveredProductIndex === i;

                  return (
                    <div
                      key={prod.id}
                      onMouseEnter={() => setHoveredProductIndex(i)}
                      onMouseLeave={() => setHoveredProductIndex(null)}
                      onClick={() => onSelectProduct && onSelectProduct(prod)}
                      className="group/niche relative flex-1 h-full mx-1 flex flex-col items-center justify-center p-1.5 cursor-pointer overflow-hidden transition-all duration-300 rounded-xl"
                    >
                      {/* Product Image resting inside the compartment */}
                      <img
                        src={prod.imageThumbnail}
                        alt={prod.name}
                        className="max-h-[88%] max-w-[88%] object-contain select-none transition-transform duration-300 group-hover/niche:scale-110 drop-shadow-md"
                      />

                      {/* Floating Product Info Pill & Matching Description on Hover */}
                      <div
                        className={`absolute bottom-0.5 px-2 py-0.5 rounded-md backdrop-blur-md transition-all duration-200 border flex items-center gap-1.5 shadow-md ${
                          isHovered
                            ? 'opacity-100 translate-y-0 z-30'
                            : 'opacity-0 translate-y-2 pointer-events-none'
                        } ${
                          isDark
                            ? 'bg-[#1e130a]/95 text-[#f5efe6] border-[#e5a045]/60'
                            : 'bg-white/95 text-[#1e140d] border-[#decbb8]'
                        }`}
                      >
                        <span className="text-[8.5px] font-bold truncate max-w-[90px]">
                          {prod.name}
                        </span>
                        <span
                          className={`text-[8.5px] font-mono font-black ${
                            isDark ? 'text-[#e5a045]' : 'text-[#008ba8]'
                          }`}
                        >
                          ₹{prod.price}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => handleQuickAdd(prod, e)}
                          className={`p-0.5 rounded text-[7px] font-bold uppercase transition-colors cursor-pointer ${
                            justAddedId === prod.id
                              ? 'bg-emerald-500 text-white'
                              : isDark
                              ? 'bg-[#e5a045] hover:bg-[#cca348] text-black'
                              : 'bg-[#008ba8] hover:bg-[#00748d] text-white'
                          }`}
                          title="Quick Add to Cart"
                        >
                          {justAddedId === prod.id ? (
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          ) : (
                            <ShoppingBag className="w-2.5 h-2.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </motion.div>

              {/* ------------------------------------------------------- */}
              {/* ROW 2: PRODUCTS 3, 4, 5                                 */}
              {/* ------------------------------------------------------- */}
              <div
                className="absolute flex items-center justify-between pointer-events-auto"
                style={{
                  top: '33.06%', // 82px / 248px
                  height: '28.22%', // 70px / 248px
                  left: '2.13%', // 14px / 656px
                  right: '2.13%' // 14px / 656px
                }}
              >
                {[0, 1, 2].map((idx) => {
                  const i = idx + 3;
                  const prod = row2Products[idx];
                  if (!prod) return <div key={i} className="flex-1" />;
                  const isHovered = hoveredProductIndex === i;

                  return (
                    <div
                      key={prod.id}
                      onMouseEnter={() => setHoveredProductIndex(i)}
                      onMouseLeave={() => setHoveredProductIndex(null)}
                      onClick={() => onSelectProduct && onSelectProduct(prod)}
                      className="group/niche relative flex-1 h-full mx-1 flex flex-col items-center justify-center p-1.5 cursor-pointer overflow-hidden transition-all duration-300"
                    >
                      {/* Product Image resting inside the niche */}
                      <img
                        src={prod.imageThumbnail}
                        alt={prod.name}
                        className="max-h-[85%] max-w-[88%] object-contain select-none transition-transform duration-300 group-hover/niche:scale-110 drop-shadow-md"
                      />

                      {/* Floating Product Name & Price Badge on Hover */}
                      <div
                        className={`absolute bottom-1 px-2 py-0.5 rounded-md backdrop-blur-md transition-all duration-200 border flex items-center gap-1.5 shadow-sm ${
                          isHovered
                            ? 'opacity-100 translate-y-0 z-30'
                            : 'opacity-0 translate-y-2 pointer-events-none'
                        } ${
                          isDark
                            ? 'bg-[#1e130a]/95 text-[#f5efe6] border-[#e5a045]/60'
                            : 'bg-white/95 text-[#1e140d] border-[#decbb8]'
                        }`}
                      >
                        <span className="text-[8.5px] font-bold truncate max-w-[90px]">
                          {prod.name}
                        </span>
                        <span
                          className={`text-[8.5px] font-mono font-black ${
                            isDark ? 'text-[#e5a045]' : 'text-[#008ba8]'
                          }`}
                        >
                          ₹{prod.price}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => handleQuickAdd(prod, e)}
                          className={`p-0.5 rounded text-[7px] font-bold uppercase transition-colors cursor-pointer ${
                            justAddedId === prod.id
                              ? 'bg-emerald-500 text-white'
                              : isDark
                              ? 'bg-[#e5a045] hover:bg-[#cca348] text-black'
                              : 'bg-[#008ba8] hover:bg-[#00748d] text-white'
                          }`}
                          title="Quick Add to Cart"
                        >
                          {justAddedId === prod.id ? (
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          ) : (
                            <ShoppingBag className="w-2.5 h-2.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ------------------------------------------------------- */}
              {/* ROW 3: PRODUCTS 6, 7, 8                                 */}
              {/* ------------------------------------------------------- */}
              <div
                className="absolute flex items-center justify-between pointer-events-auto"
                style={{
                  top: '64.51%', // 160px / 248px
                  height: '29.03%', // 72px / 248px
                  left: '2.13%', // 14px / 656px
                  right: '2.13%' // 14px / 656px
                }}
              >
                {[0, 1, 2].map((idx) => {
                  const i = idx + 6;
                  const prod = row3Products[idx];
                  if (!prod) return <div key={i} className="flex-1" />;
                  const isHovered = hoveredProductIndex === i;

                  return (
                    <div
                      key={prod.id}
                      onMouseEnter={() => setHoveredProductIndex(i)}
                      onMouseLeave={() => setHoveredProductIndex(null)}
                      onClick={() => onSelectProduct && onSelectProduct(prod)}
                      className="group/niche relative flex-1 h-full mx-1 flex flex-col items-center justify-center p-1.5 cursor-pointer overflow-hidden transition-all duration-300"
                    >
                      {/* Product Image resting inside the niche */}
                      <img
                        src={prod.imageThumbnail}
                        alt={prod.name}
                        className="max-h-[85%] max-w-[88%] object-contain select-none transition-transform duration-300 group-hover/niche:scale-110 drop-shadow-md"
                      />

                      {/* Floating Product Name & Price Badge on Hover */}
                      <div
                        className={`absolute bottom-1 px-2 py-0.5 rounded-md backdrop-blur-md transition-all duration-200 border flex items-center gap-1.5 shadow-sm ${
                          isHovered
                            ? 'opacity-100 translate-y-0 z-30'
                            : 'opacity-0 translate-y-2 pointer-events-none'
                        } ${
                          isDark
                            ? 'bg-[#1e130a]/95 text-[#f5efe6] border-[#e5a045]/60'
                            : 'bg-white/95 text-[#1e140d] border-[#decbb8]'
                        }`}
                      >
                        <span className="text-[8.5px] font-bold truncate max-w-[90px]">
                          {prod.name}
                        </span>
                        <span
                          className={`text-[8.5px] font-mono font-black ${
                            isDark ? 'text-[#e5a045]' : 'text-[#008ba8]'
                          }`}
                        >
                          ₹{prod.price}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => handleQuickAdd(prod, e)}
                          className={`p-0.5 rounded text-[7px] font-bold uppercase transition-colors cursor-pointer ${
                            justAddedId === prod.id
                              ? 'bg-emerald-500 text-white'
                              : isDark
                              ? 'bg-[#e5a045] hover:bg-[#cca348] text-black'
                              : 'bg-[#008ba8] hover:bg-[#00748d] text-white'
                          }`}
                          title="Quick Add to Cart"
                        >
                          {justAddedId === prod.id ? (
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          ) : (
                            <ShoppingBag className="w-2.5 h-2.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* ----------------------------------------------------------- */}
          {/* SECTION D: LOWER SLICES (ALL FLOORS BELOW ACTIVE FLOOR)     */}
          {/* Slides DOWNWARD and leaves canvas during drop down          */}
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
          {/* 3. INTACT-STATE INTERACTIVE FLOOR OVERLAY & UNIFORM TABS    */}
          {/* Clean, Uniform Floor Indicators (05 - 01)                   */}
          {/* =========================================================== */}
          {!isExpanded && (
            <div className="absolute inset-0 z-40 pointer-events-auto">
              {/* Subtle top banner prompt */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none px-3 py-1 rounded-full backdrop-blur-md border text-[8.5px] font-mono font-bold uppercase tracking-widest shadow-md opacity-90 animate-pulse bg-black/60 text-amber-200 border-amber-500/40">
                ✦ CLICK ANY FLOOR TO DROP DOWN & SHOW PRODUCTS ✦
              </div>

              {/* Exact Floor Hit Areas with Uniform Colored Tabs */}
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
                            ? 'bg-[#e5a045]/20 border-[#e5a045] shadow-[0_0_25px_rgba(229,160,69,0.35)]'
                            : 'bg-[#008ba8]/20 border-[#008ba8] shadow-[0_0_25px_rgba(0,139,168,0.35)]'
                          : 'border-transparent bg-black/0 hover:bg-black/5'
                      }`}
                    />

                    {/* Left: Uniform Colored Floor Tab */}
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
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span className="text-[8.5px] font-mono font-black tracking-wider text-white/90">
                          0{floor} · FLOOR
                        </span>
                      </div>
                      <span className="text-[9.5px] font-black tracking-tight leading-none mt-0.5">
                        {slice.category}
                      </span>
                      <span className="text-[7.5px] font-medium opacity-85 leading-tight mt-0.5">
                        {slice.tagline}
                      </span>
                    </div>

                    {/* Right: Vertical Floor Indicator Badge + Action Button */}
                    <div className="relative z-10 flex items-center gap-2">
                      {isHovered && (
                        <div
                          className={`px-2.5 py-1 rounded-md backdrop-blur-md transition-all duration-200 text-[8.5px] font-mono font-black tracking-wider border shadow-md animate-bounce ${
                            isDark
                              ? 'bg-[#e5a045] text-black border-[#e5a045]'
                              : 'bg-[#008ba8] text-white border-[#00596c]'
                          }`}
                        >
                          DROP DOWN ▾
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
