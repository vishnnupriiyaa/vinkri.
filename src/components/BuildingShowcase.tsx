import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Play, Eye, ShoppingBag, Check, Sparkles } from 'lucide-react';
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

const FLOOR_CATEGORIES = [
  { number: 5, name: 'LEVEL 05', category: 'DESK TOYS', tagline: 'Play. Fidget. Display.' },
  { number: 4, name: 'LEVEL 04', category: 'CUSTOM DIORAMAS', tagline: 'Mini worlds. Big stories.' },
  { number: 3, name: 'LEVEL 03', category: 'DIECAST CAR STANDS', tagline: 'Display. Organize. Collect.' },
  { number: 2, name: 'LEVEL 02', category: 'CUSTOM FIGURINES', tagline: 'People. Moments. Memories.' },
  { number: 1, name: 'LEVEL 01', category: 'LUXURY CASES & STANDS', tagline: 'Preserve. Protect. Illuminate.' },
];

export const BuildingShowcase: React.FC<BuildingShowcaseProps> = ({
  theme,
  onSelectFloor,
  selectedFloorNumber,
  onSelectProduct,
  onQuickAdd,
  cartProductIds = [],
  isEntranceOpen = false
}) => {
  const isDark = theme === 'rustic-dark';
  const containerRef = useRef<HTMLDivElement>(null);

  // Active floor number (default: 3, matching the reference video)
  const [activeFloor, setActiveFloor] = useState<number>(3);

  // Whether the drop down is expanded (false = intact 5-story cabinet, true = drop down state)
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Active hovered product niche index (0 to 5)
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

  // Handle floor click toggle
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
    }, 1200);
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickAdd) onQuickAdd(product);
    setJustAddedId(product.id);
    setTimeout(() => setJustAddedId(null), 1400);
  };

  // Products belonging to the active floor (9 items)
  const allFloorProducts = PRODUCTS_DATA.filter((p) => p.floorNumber === activeFloor);
  
  // The 6 products displayed inside the empty animation space of Rows 2 & 3
  const nicheProducts = allFloorProducts.slice(3, 9);

  const currentFloorConfig =
    FLOOR_CATEGORIES.find((f) => f.number === activeFloor) || FLOOR_CATEGORIES[2];

  // Hero shelf image
  const heroImageSrc =
    activeFloor === 3
      ? isDark
        ? '/assets/aistudio/dark_floor3_hero.jpg'
        : '/assets/aistudio/building_floor3_hero.jpg'
      : isDark
      ? `/assets/aistudio/crops/dark_floor${activeFloor}.jpg`
      : `/assets/aistudio/crops/light_floor${activeFloor}.jpg`;

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
                  ? 'bg-[#e5a045] hover:bg-[#cca348] text-black font-black'
                  : 'bg-[#008ba8] hover:bg-[#00748d] text-white font-black'
                : isDark
                ? 'bg-[#26170d] hover:bg-[#382314] text-[#f5c27d] border border-[#4a2e19]'
                : 'bg-white hover:bg-neutral-100 text-[#006078] border border-[#decbb8]'
            }`}
          >
            <RotateCcw className="w-3 h-3" />
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
            <span className="opacity-90">
              {currentFloorConfig.name} • {currentFloorConfig.category}
            </span>
          </div>
        </div>

        {/* Floor Selection Pills (05 - 01) */}
        <div className="flex items-center gap-1">
          {FLOOR_CATEGORIES.map((f) => {
            const isActive = activeFloor === f.number;
            return (
              <button
                key={f.number}
                type="button"
                onClick={() => handleToggleFloor(f.number)}
                className={`px-2.5 py-1 rounded text-[9.5px] font-mono font-black transition-all cursor-pointer ${
                  isActive
                    ? isDark
                      ? 'bg-[#e5a045] text-black shadow-xs font-black'
                      : 'bg-[#008ba8] text-white shadow-xs font-black'
                    : isDark
                    ? 'bg-[#20140c] text-[#a89685] hover:text-white border border-[#301f13]'
                    : 'bg-white text-[#69584b] hover:text-[#1e140d] border border-[#decbb8]'
                }`}
                title={`Floor 0${f.number}: ${f.category} (Click to drop down products)`}
              >
                0{f.number}
              </button>
            );
          })}

          {/* Sequence Replay */}
          <button
            type="button"
            onClick={handleReplaySequence}
            className={`p-1.5 ml-1 rounded border transition-colors cursor-pointer ${
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
      {/* Exact UI Graphic from Video with Product Images in Empty Space  */}
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
          {/* SECTION A: UPPER SHELVING STRUCTURE                         */}
          {/* Dimensions: 656 x 284px                                     */}
          {/* Moves UPWARD and leaves canvas during drop down             */}
          {/* ----------------------------------------------------------- */}
          <motion.div
            initial={false}
            animate={{
              y: isExpanded ? -380 : 0,
              opacity: isExpanded ? 0 : 1,
              height: isExpanded ? 0 : 'auto',
              marginBottom: isExpanded ? 0 : undefined
            }}
            transition={{
              duration: 0.75,
              ease: [0.25, 1, 0.5, 1]
            }}
            className="w-full overflow-hidden origin-top select-none pointer-events-none"
            style={{ width: '656px', maxWidth: '100%' }}
          >
            <img
              src={
                isDark
                  ? '/assets/aistudio/dark_upper_floors.jpg'
                  : '/assets/aistudio/building_upper_floors.jpg'
              }
              alt="Upper Shelving Structure"
              className="w-full h-auto block select-none"
              style={{ aspectRatio: '656 / 284' }}
            />
          </motion.div>

          {/* ----------------------------------------------------------- */}
          {/* SECTION B: HERO PRODUCT SHOWCASE (SELECTED FLOOR)           */}
          {/* Dimensions: 656 x 104px                                     */}
          {/* Interactive Trigger: Clicking triggers the drop down        */}
          {/* ----------------------------------------------------------- */}
          <div
            onClick={() => handleToggleFloor()}
            className="group/shelf relative w-full z-30 select-none cursor-pointer"
            style={{ width: '656px', maxWidth: '100%' }}
            title={isExpanded ? 'Click to reassemble cabinet' : 'Click to trigger video drop down'}
          >
            <img
              src={heroImageSrc}
              alt={`${currentFloorConfig.name} Showcase`}
              className="w-full h-auto block select-none pointer-events-none group-hover/shelf:brightness-105 transition-[filter]"
              style={{ aspectRatio: '656 / 104' }}
            />

            {/* Subtle Interactive Hover Prompt */}
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
                {currentFloorConfig.name} • {currentFloorConfig.category}
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
                {isExpanded ? 'CLICK TO REASSEMBLE' : 'CLICK FLOOR TO EXPAND'}
              </span>
            </div>
          </div>

          {/* ----------------------------------------------------------- */}
          {/* SECTION C: THE 3-ROW SUSPENDED GANTRY                       */}
          {/* EXACT UI GRAPHIC FROM THE REFERENCE VIDEO                   */}
          {/* Row 1: THREE SOLID BLUE RECTANGULAR BLOCKS (DROPS DOWN)     */}
          {/* Rows 2 & 3: EMPTY ANIMATION SPACE FILLED WITH PRODUCT IMAGES*/}
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
            {/* The Exact Architectural SVG Graphic */}
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

                {/* Exact Reference Video Blue Gradient (Light Theme) */}
                <linearGradient id="videoBlueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0096b5" />
                  <stop offset="50%" stopColor="#008ba8" />
                  <stop offset="100%" stopColor="#007994" />
                </linearGradient>

                {/* Dark Theme Matching Color (Warm Amber-Gold / Cognac) */}
                <linearGradient id="darkBlockGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#e5a045" />
                  <stop offset="60%" stopColor="#c48235" />
                  <stop offset="100%" stopColor="#965f21" />
                </linearGradient>

                {/* Niche Ambient Warm Light Glow Filter */}
                <radialGradient id="nicheLightGlow" cx="50%" cy="30%" r="60%">
                  <stop offset="0%" stopColor="#fff8eb" stopOpacity={isDark ? "0.12" : "0.7"} />
                  <stop offset="100%" stopColor="#fff8eb" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* ------------------------------------------------------- */}
              {/* ROW 1: 3 COMPARTMENTS WITH THREE SOLID BLUE BLOCKS      */}
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

              {/* Outer Left & Right Wooden Frame Pillars */}
              <rect x="0" y="8" width="14" height="66" fill={isDark ? 'url(#darkWoodPost)' : 'url(#lightWoodPost)'} />
              <rect x="642" y="8" width="14" height="66" fill={isDark ? 'url(#darkWoodPost)' : 'url(#lightWoodPost)'} />

              {/* Interior Vertical Wooden Dividers */}
              <rect x="216" y="8" width="10" height="66" fill={isDark ? 'url(#darkWoodPost)' : 'url(#lightWoodPost)'} />
              <rect x="430" y="8" width="10" height="66" fill={isDark ? 'url(#darkWoodPost)' : 'url(#lightWoodPost)'} />

              {/* THREE SOLID BLUE RECTANGULAR BLOCKS (DROPS DOWN) */}
              <g
                style={{
                  transform: isExpanded ? 'translateY(0px)' : 'translateY(-70px)',
                  opacity: isExpanded ? 1 : 0,
                  transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1) 0.15s, opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1) 0.15s'
                }}
              >
                {/* Column 1 Blue Block */}
                <rect
                  x="28"
                  y="14"
                  width="174"
                  height="54"
                  rx="14"
                  ry="14"
                  fill={isDark ? 'url(#darkBlockGrad)' : 'url(#videoBlueGrad)'}
                  stroke={isDark ? '#e5a045' : '#00596c'}
                  strokeWidth="2"
                  className="cursor-pointer transition-transform hover:scale-[1.01]"
                  onClick={() => allFloorProducts[0] && onSelectProduct && onSelectProduct(allFloorProducts[0])}
                />

                {/* Column 2 Blue Block */}
                <rect
                  x="240"
                  y="14"
                  width="176"
                  height="54"
                  rx="14"
                  ry="14"
                  fill={isDark ? 'url(#darkBlockGrad)' : 'url(#videoBlueGrad)'}
                  stroke={isDark ? '#e5a045' : '#00596c'}
                  strokeWidth="2"
                  className="cursor-pointer transition-transform hover:scale-[1.01]"
                  onClick={() => allFloorProducts[1] && onSelectProduct && onSelectProduct(allFloorProducts[1])}
                />

                {/* Column 3 Blue Block */}
                <rect
                  x="454"
                  y="14"
                  width="174"
                  height="54"
                  rx="14"
                  ry="14"
                  fill={isDark ? 'url(#darkBlockGrad)' : 'url(#videoBlueGrad)'}
                  stroke={isDark ? '#e5a045' : '#00596c'}
                  strokeWidth="2"
                  className="cursor-pointer transition-transform hover:scale-[1.01]"
                  onClick={() => allFloorProducts[2] && onSelectProduct && onSelectProduct(allFloorProducts[2])}
                />
              </g>

              {/* ------------------------------------------------------- */}
              {/* ROW 2: THREE COMPARTMENTS WITH PRODUCT IMAGES           */}
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

              {/* Ambient Spotlight Gradients in Row 2 */}
              <rect x="14" y="82" width="202" height="70" fill="url(#nicheLightGlow)" />
              <rect x="226" y="82" width="204" height="70" fill="url(#nicheLightGlow)" />
              <rect x="440" y="82" width="202" height="70" fill="url(#nicheLightGlow)" />

              {/* Outer Pillars & Inner Dividers */}
              <rect x="0" y="82" width="14" height="70" fill={isDark ? 'url(#darkWoodPost)' : 'url(#lightWoodPost)'} />
              <rect x="642" y="82" width="14" height="70" fill={isDark ? 'url(#darkWoodPost)' : 'url(#lightWoodPost)'} />
              <rect x="216" y="82" width="10" height="70" fill={isDark ? 'url(#darkWoodPost)' : 'url(#lightWoodPost)'} />
              <rect x="430" y="82" width="10" height="70" fill={isDark ? 'url(#darkWoodPost)' : 'url(#lightWoodPost)'} />

              {/* ------------------------------------------------------- */}
              {/* ROW 3: THREE COMPARTMENTS WITH PRODUCT IMAGES           */}
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

              {/* Ambient Spotlight Gradients in Row 3 */}
              <rect x="14" y="160" width="202" height="72" fill="url(#nicheLightGlow)" />
              <rect x="226" y="160" width="204" height="72" fill="url(#nicheLightGlow)" />
              <rect x="440" y="160" width="202" height="72" fill="url(#nicheLightGlow)" />

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
            {/* PRODUCT IMAGES DIRECTLY IN THE EMPTY SPACES (ROWS 2 & 3)  */}
            {/* Pixel-perfect coordinates mapped directly to niches       */}
            {/* ========================================================= */}
            <div className="absolute inset-0 z-25 pointer-events-none">
              {/* ROW 2: 3 Compartments with Product Images */}
              <div
                className="absolute flex items-center justify-between pointer-events-auto"
                style={{
                  top: '33.06%', // 82px / 248px
                  height: '28.22%', // 70px / 248px
                  left: '2.13%', // 14px / 656px
                  right: '2.13%' // 14px / 656px
                }}
              >
                {[0, 1, 2].map((i) => {
                  const prod = nicheProducts[i];
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
                        className="max-h-[82%] max-w-[85%] object-contain select-none transition-transform duration-300 group-hover/niche:scale-110 drop-shadow-md"
                      />

                      {/* Floating Product Name & Price Badge on Hover */}
                      <div
                        className={`absolute bottom-1 px-2 py-0.5 rounded-md backdrop-blur-md transition-all duration-200 border flex items-center gap-1.5 shadow-sm ${
                          isHovered
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-2'
                        } ${
                          isDark
                            ? 'bg-[#1e130a]/95 text-[#f5efe6] border-[#e5a045]/60'
                            : 'bg-white/95 text-[#1e140d] border-[#decbb8]'
                        }`}
                      >
                        <span className="text-[8.5px] font-bold truncate max-w-[95px]">
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
                          className={`p-0.5 rounded text-[7px] font-bold uppercase transition-colors ${
                            justAddedId === prod.id
                              ? 'bg-emerald-500 text-white'
                              : isDark
                              ? 'bg-[#e5a045] hover:bg-[#cca348] text-black'
                              : 'bg-[#008ba8] hover:bg-[#00748d] text-white'
                          }`}
                          title="Quick Add"
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

              {/* ROW 3: 3 Compartments with Product Images */}
              <div
                className="absolute flex items-center justify-between pointer-events-auto"
                style={{
                  top: '64.51%', // 160px / 248px
                  height: '29.03%', // 72px / 248px
                  left: '2.13%', // 14px / 656px
                  right: '2.13%' // 14px / 656px
                }}
              >
                {[3, 4, 5].map((i) => {
                  const prod = nicheProducts[i];
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
                        className="max-h-[82%] max-w-[85%] object-contain select-none transition-transform duration-300 group-hover/niche:scale-110 drop-shadow-md"
                      />

                      {/* Floating Product Name & Price Badge on Hover */}
                      <div
                        className={`absolute bottom-1 px-2 py-0.5 rounded-md backdrop-blur-md transition-all duration-200 border flex items-center gap-1.5 shadow-sm ${
                          isHovered
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-2'
                        } ${
                          isDark
                            ? 'bg-[#1e130a]/95 text-[#f5efe6] border-[#e5a045]/60'
                            : 'bg-white/95 text-[#1e140d] border-[#decbb8]'
                        }`}
                      >
                        <span className="text-[8.5px] font-bold truncate max-w-[95px]">
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
                          className={`p-0.5 rounded text-[7px] font-bold uppercase transition-colors ${
                            justAddedId === prod.id
                              ? 'bg-emerald-500 text-white'
                              : isDark
                              ? 'bg-[#e5a045] hover:bg-[#cca348] text-black'
                              : 'bg-[#008ba8] hover:bg-[#00748d] text-white'
                          }`}
                          title="Quick Add"
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
          {/* SECTION D: LOWER PRODUCT SECTION (FLOORS 2, 1 & GROUND)     */}
          {/* Dimensions: 656 x 380px                                     */}
          {/* Moves DOWNWARD and leaves canvas during drop down           */}
          {/* ----------------------------------------------------------- */}
          <motion.div
            initial={false}
            animate={{
              y: isExpanded ? 420 : 0,
              opacity: isExpanded ? 0 : 1,
              height: isExpanded ? 0 : 'auto',
              marginTop: isExpanded ? 0 : undefined
            }}
            transition={{
              duration: 0.75,
              ease: [0.25, 1, 0.5, 1]
            }}
            className="w-full overflow-hidden origin-top select-none pointer-events-none"
            style={{ width: '656px', maxWidth: '100%' }}
          >
            <img
              src={
                isDark
                  ? '/assets/aistudio/dark_lower_floors.jpg'
                  : '/assets/aistudio/building_lower_floors.jpg'
              }
              alt="Lower Product Section"
              className="w-full h-auto block select-none"
              style={{ aspectRatio: '656 / 380' }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
