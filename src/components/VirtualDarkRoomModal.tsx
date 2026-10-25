import React, { useState, useEffect } from 'react';
import {
  X,
  Moon,
  Sun,
  Lightbulb,
  Sparkles,
  ShoppingBag,
  Check,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Flame,
  Maximize2,
  Volume2
} from 'lucide-react';
import { Product, ThemeMode } from '../types';
import { PRODUCTS_DATA } from '../data/products';
import { ProductArtwork } from './ProductArtwork';
import { sound } from '../utils/audio';

interface VirtualDarkRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProductId?: string;
  theme: ThemeMode;
  onAddToCart: (product: Product, quantity?: number) => void;
  onSelectProductDetails?: (product: Product) => void;
}

type LightTemp = {
  name: string;
  kelvin: string;
  colorHex: string;
  glowRgba: string;
  bloomColor: string;
};

const LIGHT_TEMPS: LightTemp[] = [
  {
    name: 'Warm Amber',
    kelvin: '2200K',
    colorHex: '#ffaa44',
    glowRgba: 'rgba(255, 170, 68, 0.45)',
    bloomColor: 'rgba(255, 140, 40, 0.25)'
  },
  {
    name: 'Sunset Gold',
    kelvin: '2700K',
    colorHex: '#ffcc66',
    glowRgba: 'rgba(255, 204, 102, 0.45)',
    bloomColor: 'rgba(255, 180, 70, 0.25)'
  },
  {
    name: 'Temple Glow',
    kelvin: '3000K',
    colorHex: '#ffe8a3',
    glowRgba: 'rgba(255, 232, 163, 0.45)',
    bloomColor: 'rgba(255, 210, 110, 0.25)'
  },
  {
    name: 'Himalayan Cyan',
    kelvin: '6000K',
    colorHex: '#6ee7b7',
    glowRgba: 'rgba(110, 231, 183, 0.45)',
    bloomColor: 'rgba(45, 212, 191, 0.25)'
  },
  {
    name: 'Cyber Lime',
    kelvin: 'VINKRI',
    colorHex: '#d2f53a',
    glowRgba: 'rgba(210, 245, 58, 0.45)',
    bloomColor: 'rgba(180, 230, 40, 0.25)'
  }
];

type RoomEnv = {
  id: string;
  name: string;
  wallTexture: string;
  deskColor: string;
  deskTexture: string;
};

const ROOM_ENVS: RoomEnv[] = [
  {
    id: 'walnut-desk',
    name: 'Walnut Executive Desk',
    wallTexture: 'radial-gradient(ellipse at 50% 30%, #17130e 0%, #0a0806 70%, #050403 100%)',
    deskColor: '#2b1b12',
    deskTexture: 'linear-gradient(to bottom, #382417 0%, #1e130c 60%, #120b07 100%)'
  },
  {
    id: 'bedside',
    name: 'Bedside Nightstand',
    wallTexture: 'radial-gradient(ellipse at 50% 35%, #181517 0%, #0c0a0c 70%, #050405 100%)',
    deskColor: '#242022',
    deskTexture: 'linear-gradient(to bottom, #322b2f 0%, #1e191c 60%, #100d0e 100%)'
  },
  {
    id: 'niche',
    name: 'Recessed Wall Alcove',
    wallTexture: 'radial-gradient(ellipse at 50% 25%, #191612 0%, #0d0b09 70%, #050403 100%)',
    deskColor: '#30261f',
    deskTexture: 'linear-gradient(to bottom, #42352b 0%, #291e17 60%, #16100c 100%)'
  }
];

export const VirtualDarkRoomModal: React.FC<VirtualDarkRoomModalProps> = ({
  isOpen,
  onClose,
  initialProductId,
  theme,
  onAddToCart,
  onSelectProductDetails
}) => {
  const isDark = theme === 'rustic-dark';

  // Product selection
  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialProductId || 'moon-tree-light'
  );

  useEffect(() => {
    if (initialProductId) {
      setSelectedProductId(initialProductId);
    }
  }, [initialProductId]);

  // Lighting parameters
  const [roomAmbient, setRoomAmbient] = useState<number>(0); // 0% = pitch dark room, 100% = studio daylight
  const [lampBrightness, setLampBrightness] = useState<number>(90); // 0% = off, 100% = maximum glow
  const [selectedTempIndex, setSelectedTempIndex] = useState<number>(0);
  const [isFlickering, setIsFlickering] = useState<boolean>(false);
  const [selectedEnvId, setSelectedEnvId] = useState<string>('walnut-desk');
  const [added, setAdded] = useState(false);

  // Subtle organic flicker simulation
  const [flickerOffset, setFlickerOffset] = useState<number>(1);
  useEffect(() => {
    if (!isFlickering || lampBrightness === 0) {
      setFlickerOffset(1);
      return;
    }
    const interval = setInterval(() => {
      // 0.94 to 1.06 oscillation
      const noise = 0.94 + Math.random() * 0.12;
      setFlickerOffset(noise);
    }, 120);
    return () => clearInterval(interval);
  }, [isFlickering, lampBrightness]);

  if (!isOpen) return null;

  const currentProduct =
    PRODUCTS_DATA.find((p) => p.id === selectedProductId) || PRODUCTS_DATA[0];
  const activeTemp = LIGHT_TEMPS[selectedTempIndex];
  const activeEnv = ROOM_ENVS.find((e) => e.id === selectedEnvId) || ROOM_ENVS[0];

  // Calculated optical lighting effects
  const effectiveLampLight = (lampBrightness / 100) * flickerOffset;
  const ambientFactor = roomAmbient / 100; // 0.0 to 1.0

  // Wall bounce radial glow
  const wallBounceOpacity = Math.min(1, effectiveLampLight * 0.9);
  const wallBounceRadius = 180 + effectiveLampLight * 280;

  // Desk spill glow
  const deskSpillOpacity = Math.min(1, effectiveLampLight * 0.85);

  const handlePrevProduct = () => {
    sound.playClick();
    const idx = PRODUCTS_DATA.findIndex((p) => p.id === selectedProductId);
    const prevIdx = idx > 0 ? idx - 1 : PRODUCTS_DATA.length - 1;
    setSelectedProductId(PRODUCTS_DATA[prevIdx].id);
  };

  const handleNextProduct = () => {
    sound.playClick();
    const idx = PRODUCTS_DATA.findIndex((p) => p.id === selectedProductId);
    const nextIdx = idx < PRODUCTS_DATA.length - 1 ? idx + 1 : 0;
    setSelectedProductId(PRODUCTS_DATA[nextIdx].id);
  };

  const handleQuickAdd = () => {
    sound.playChime();
    onAddToCart(currentProduct, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-2 sm:p-4 lg:p-6 flex items-center justify-center select-none">
      {/* Dark overlay backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity"
      />

      {/* Main Container */}
      <div
        className={`relative w-full max-w-6xl rounded-2xl overflow-y-auto border flex flex-col my-auto max-h-[96vh] transition-all duration-300 ${
          isDark
            ? 'shadow-[0_0_80px_rgba(0,0,0,0.9)] border-[#382b20] bg-[#0c0907] text-[#f7f2ea]'
            : 'shadow-[0_20px_70px_rgba(0,0,0,0.2)] border-[#ded4c3] bg-[#faf6f0] text-[#282019]'
        }`}
      >
        {/* Top Control Bar */}
        <div
          className={`px-3.5 sm:px-5 py-2.5 sm:py-3.5 border-b flex items-center justify-between backdrop-blur-sm z-20 shrink-0 transition-colors ${
            isDark ? 'border-[#241a12] bg-[#140e0a]/80' : 'border-[#e2d5c3] bg-[#f4ebe0]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                isDark
                  ? 'bg-[#d2f53a]/15 text-[#d2f53a] border-[#d2f53a]/30'
                  : 'bg-[#c35626]/15 text-[#c35626] border-[#c35626]/30'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-mono tracking-widest uppercase font-bold ${
                    isDark ? 'text-[#d2f53a]' : 'text-[#c35626]'
                  }`}
                >
                  HYDERABAD ATELIER
                </span>
                <span className={isDark ? 'text-white/40' : 'text-black/30'}>·</span>
                <span
                  className={`text-[10px] font-mono tracking-widest uppercase ${
                    isDark ? 'text-white/70' : 'text-[#69584b]'
                  }`}
                >
                  {isDark ? 'VIRTUAL DARK ROOM SIMULATOR' : 'LIGHTING & AMBIENT STUDIO'}
                </span>
              </div>
              <h3
                className={`text-sm sm:text-base font-extrabold tracking-tight ${
                  isDark ? 'text-white' : 'text-[#1e140d]'
                }`}
              >
                Low-Light & Ambient Glow Simulator
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick dark room preset switch */}
            <div
              className={`hidden sm:flex items-center gap-1 p-1 rounded-lg border ${
                isDark ? 'bg-[#1d1610] border-[#33251a]' : 'bg-white border-[#ded4c3]'
              }`}
            >
              <button
                onClick={() => {
                  sound.playClick();
                  setRoomAmbient(0);
                }}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  roomAmbient === 0
                    ? isDark
                      ? 'bg-[#d2f53a] text-black shadow-md'
                      : 'bg-[#c35626] text-white shadow-sm'
                    : isDark
                    ? 'text-[#9c8979] hover:text-white'
                    : 'text-[#69584b] hover:text-black'
                }`}
                title="Total Dark Room"
              >
                <Moon className="w-3 h-3" />
                <span>Pitch Dark (0%)</span>
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setRoomAmbient(25);
                }}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  roomAmbient === 25
                    ? isDark
                      ? 'bg-[#d2f53a] text-black shadow-md'
                      : 'bg-[#c35626] text-white shadow-sm'
                    : isDark
                    ? 'text-[#9c8979] hover:text-white'
                    : 'text-[#69584b] hover:text-black'
                }`}
                title="Cozy Ambient"
              >
                <Sparkles className="w-3 h-3" />
                <span>Cozy Dusk (25%)</span>
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setRoomAmbient(85);
                }}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  roomAmbient === 85
                    ? isDark
                      ? 'bg-[#d2f53a] text-black shadow-md'
                      : 'bg-[#c35626] text-white shadow-sm'
                    : isDark
                    ? 'text-[#9c8979] hover:text-white'
                    : 'text-[#69584b] hover:text-black'
                }`}
                title="Daylight Room"
              >
                <Sun className="w-3 h-3" />
                <span>Daylight (85%)</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className={`p-1.5 rounded-full transition-colors cursor-pointer border ${
                isDark
                  ? 'bg-[#1c1510] text-[#cfbfaf] hover:text-white hover:bg-[#281f18] border-[#33251a]'
                  : 'bg-white text-[#45372d] hover:text-black hover:bg-[#ede3d3] border-[#ded4c3]'
              }`}
              aria-label="Close Virtual Studio"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center Canvas Area: 3D Dark Room Simulation */}
        <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] overflow-hidden flex flex-col justify-end">
          {/* Dynamic Room Wall Backdrop */}
          <div
            className="absolute inset-0 transition-all duration-700 pointer-events-none"
            style={{
              background: activeEnv.wallTexture,
              opacity: 1
            }}
          />

          {/* Daylight wash overlay when roomAmbient > 0 */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500 bg-gradient-to-b from-[#f2ebe0] via-[#dfd4c4] to-[#c7baa7]"
            style={{
              opacity: ambientFactor * 0.75,
              mixBlendMode: 'screen'
            }}
          />

          {/* Behind-Product Radial Glow Bloom (Simulating genuine optical halo) */}
          <div
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-300 rounded-full blur-[65px]"
            style={{
              bottom: '28%',
              width: `${wallBounceRadius * 1.8}px`,
              height: `${wallBounceRadius * 1.5}px`,
              backgroundColor: activeTemp.colorHex,
              opacity: wallBounceOpacity * (0.35 + 0.5 * (1 - ambientFactor * 0.7))
            }}
          />

          {/* Secondary Soft Ambient Bloom */}
          <div
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-300 rounded-full blur-[110px]"
            style={{
              bottom: '22%',
              width: `${wallBounceRadius * 2.8}px`,
              height: `${wallBounceRadius * 2.2}px`,
              backgroundColor: activeTemp.bloomColor,
              opacity: wallBounceOpacity * 0.55
            }}
          />

          {/* Realistic Desk Surface in the lower 32% */}
          <div
            className="absolute inset-x-0 bottom-0 h-[34%] transition-all duration-500 border-t border-black/40 z-10"
            style={{
              background: activeEnv.deskTexture
            }}
          >
            {/* Spill Light onto Desk Surface */}
            <div
              className="absolute inset-x-0 top-0 h-full pointer-events-none blur-[40px] transition-all duration-300"
              style={{
                background: `radial-gradient(ellipse at 50% 0%, ${activeTemp.glowRgba} 0%, transparent 75%)`,
                opacity: deskSpillOpacity * (0.55 + 0.45 * (1 - ambientFactor * 0.8))
              }}
            />

            {/* Specular Table Edge Highlight */}
            <div
              className="absolute inset-x-0 top-0 h-[1.5px] pointer-events-none transition-all duration-300"
              style={{
                background: `radial-gradient(ellipse at 50% 0%, ${activeTemp.colorHex} 0%, transparent 60%)`,
                opacity: wallBounceOpacity * 0.8
              }}
            />
          </div>

          {/* Product Centerpiece */}
          <div className="relative z-20 mx-auto mb-10 sm:mb-12 flex flex-col items-center">
            {/* Ground Contact Shadow */}
            <div
              className="absolute -bottom-5 w-56 sm:w-72 h-8 rounded-full blur-[10px] pointer-events-none transition-all duration-300"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                transform: `scale(${1 + effectiveLampLight * 0.15})`
              }}
            />

            {/* Reflection on table */}
            <div
              className="absolute -bottom-28 w-52 sm:w-64 h-32 overflow-hidden pointer-events-none opacity-20 blur-[2px] transition-all duration-300"
              style={{
                transform: 'scaleY(-0.7)',
                maskImage: 'linear-gradient(to top, transparent, black)'
              }}
            >
              <ProductArtwork
                productId={currentProduct.id}
                aspectRatio="square"
                theme="rustic-dark"
                className="w-full h-full"
              />
            </div>

            {/* Main Product Container */}
            <div className="relative w-52 xs:w-64 sm:w-80 md:w-96 aspect-square transition-all duration-300">
              {/* Optical Glow Halo directly behind the product frame */}
              <div
                className="absolute inset-4 rounded-full blur-[35px] pointer-events-none transition-all duration-300"
                style={{
                  backgroundColor: activeTemp.colorHex,
                  opacity: effectiveLampLight * 0.6
                }}
              />

              {/* Product Artwork with dynamic brightness & bloom */}
              <div
                className="relative w-full h-full rounded-2xl overflow-hidden border transition-all duration-300 shadow-2xl"
                style={{
                  borderColor:
                    effectiveLampLight > 0.4
                      ? `${activeTemp.colorHex}55`
                      : 'rgba(255, 255, 255, 0.1)',
                  boxShadow:
                    effectiveLampLight > 0
                      ? `0 0 ${40 * effectiveLampLight}px ${activeTemp.glowRgba}, 0 20px 45px rgba(0,0,0,0.85)`
                      : '0 20px 45px rgba(0,0,0,0.85)',
                  filter: `brightness(${0.4 + ambientFactor * 0.5 + effectiveLampLight * 0.5}) contrast(${1.05 + effectiveLampLight * 0.1})`
                }}
              >
                <ProductArtwork
                  productId={currentProduct.id}
                  aspectRatio="square"
                  theme="rustic-dark"
                  className="w-full h-full"
                />

                {/* Night-room color wash */}
                <div
                  className="absolute inset-0 pointer-events-none mix-blend-color transition-all duration-300"
                  style={{
                    backgroundColor: activeTemp.colorHex,
                    opacity: effectiveLampLight * 0.18
                  }}
                />
              </div>

              {/* Prev/Next arrows floating on canvas */}
              <button
                onClick={handlePrevProduct}
                className={`absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full transition-all flex items-center justify-center cursor-pointer border shadow-xl z-30 ${
                  isDark
                    ? 'bg-[#1c1510]/90 text-white hover:bg-[#d2f53a] hover:text-black border-[#382b20]'
                    : 'bg-white/95 text-[#282019] hover:bg-[#c35626] hover:text-white border-[#ded4c3]'
                }`}
                title="Previous creation"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNextProduct}
                className={`absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full transition-all flex items-center justify-center cursor-pointer border shadow-xl z-30 ${
                  isDark
                    ? 'bg-[#1c1510]/90 text-white hover:bg-[#d2f53a] hover:text-black border-[#382b20]'
                    : 'bg-white/95 text-[#282019] hover:bg-[#c35626] hover:text-white border-[#ded4c3]'
                }`}
                title="Next creation"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Floor badge & Live lumen indicator */}
            <div className="mt-3 flex items-center gap-2 z-20">
              <span
                className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border font-bold ${
                  isDark
                    ? 'bg-black/80 border-white/20 text-[#d2f53a]'
                    : 'bg-white/95 border-[#ded4c3] text-[#c35626] shadow-xs'
                }`}
              >
                FLR 0{currentProduct.floorNumber} · {currentProduct.category}
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  isDark
                    ? 'bg-black/80 border-white/20 text-white/80'
                    : 'bg-white/95 border-[#ded4c3] text-[#45372d] shadow-xs'
                }`}
              >
                {effectiveLampLight > 0
                  ? `EMITTED LUMENS: ~${Math.round(effectiveLampLight * 240)} lm`
                  : 'OPTICAL EMITTERS OFF'}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Interactive Control Dashboard */}
        <div
          className={`p-4 sm:p-5 border-t z-20 shrink-0 space-y-4 transition-colors ${
            isDark ? 'bg-[#120d09] border-[#261c14]' : 'bg-[#f4ebe0] border-[#ded4c3]'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-center">
            {/* Product Meta & Actions */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4
                  className={`text-base sm:text-lg font-black truncate ${
                    isDark ? 'text-white' : 'text-[#1c140e]'
                  }`}
                >
                  {currentProduct.name}
                </h4>
                {currentProduct.badge && (
                  <span
                    className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold shrink-0 ${
                      isDark ? 'bg-[#d2f53a]/20 text-[#d2f53a]' : 'bg-[#c35626]/15 text-[#c35626]'
                    }`}
                  >
                    {currentProduct.badge}
                  </span>
                )}
              </div>
              <p
                className={`text-xs line-clamp-1 mb-2 ${
                  isDark ? 'text-[#a99787]' : 'text-[#69584b]'
                }`}
              >
                {currentProduct.description}
              </p>
              <div className="flex items-center gap-3">
                <span
                  className={`text-base font-extrabold ${
                    isDark ? 'text-white' : 'text-[#1c140e]'
                  }`}
                >
                  ₹{currentProduct.price.toLocaleString('en-IN')}
                </span>
                {currentProduct.originalPrice && (
                  <span
                    className={`text-xs line-through ${
                      isDark ? 'text-[#8c7b6d]' : 'text-[#9c8979]'
                    }`}
                  >
                    ₹{currentProduct.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <button
                  onClick={handleQuickAdd}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                    added
                      ? 'bg-emerald-500 text-white'
                      : isDark
                      ? 'bg-[#d2f53a] text-black hover:bg-[#e0ff4f]'
                      : 'bg-[#c35626] text-white hover:bg-[#a64319] shadow-sm'
                  }`}
                >
                  {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                  <span>{added ? 'Added to Trolley' : 'Add to Trolley'}</span>
                </button>
                {onSelectProductDetails && (
                  <button
                    onClick={() => {
                      onClose();
                      onSelectProductDetails(currentProduct);
                    }}
                    className={`text-xs underline font-semibold cursor-pointer ${
                      isDark ? 'text-[#b8a796] hover:text-white' : 'text-[#7a6452] hover:text-[#1c140e]'
                    }`}
                  >
                    Details & Specs →
                  </button>
                )}
              </div>
            </div>

            {/* Sliders: Room Ambient & Lamp Output */}
            <div
              className={`space-y-3 p-3 rounded-xl border ${
                isDark ? 'bg-[#18110c] border-[#2e2117]' : 'bg-white border-[#ded4c3] shadow-xs'
              }`}
            >
              {/* Room Ambient Light Slider */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                  <span
                    className={`flex items-center gap-1.5 ${
                      isDark ? 'text-white/90' : 'text-[#231b15]'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-amber-500" />
                    <span>Room Ambient Light</span>
                  </span>
                  <span
                    className={`font-mono text-[10px] font-bold ${
                      isDark ? 'text-[#d2f53a]' : 'text-[#c35626]'
                    }`}
                  >
                    {roomAmbient === 0 ? '0% (Pitch Black)' : `${roomAmbient}%`}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={roomAmbient}
                  onChange={(e) => setRoomAmbient(Number(e.target.value))}
                  className={`w-full cursor-pointer h-1.5 rounded-lg ${
                    isDark ? 'accent-[#d2f53a] bg-[#2a1e15]' : 'accent-[#c35626] bg-[#ded4c3]'
                  }`}
                />
              </div>

              {/* Lamp Output / Brightness Slider */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                  <span
                    className={`flex items-center gap-1.5 ${
                      isDark ? 'text-white/90' : 'text-[#231b15]'
                    }`}
                  >
                    <Lightbulb
                      className={`w-3.5 h-3.5 ${isDark ? 'text-[#d2f53a]' : 'text-[#c35626]'}`}
                    />
                    <span>Product Lamp Brightness</span>
                  </span>
                  <span
                    className={`font-mono text-[10px] font-bold ${
                      isDark ? 'text-[#d2f53a]' : 'text-[#c35626]'
                    }`}
                  >
                    {lampBrightness}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={lampBrightness}
                  onChange={(e) => setLampBrightness(Number(e.target.value))}
                  className={`w-full cursor-pointer h-1.5 rounded-lg ${
                    isDark ? 'accent-[#d2f53a] bg-[#2a1e15]' : 'accent-[#c35626] bg-[#ded4c3]'
                  }`}
                />
              </div>
            </div>

            {/* Lighting Temperature & Candle Flicker Controls */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-bold ${
                    isDark ? 'text-white/80' : 'text-[#231b15]'
                  }`}
                >
                  Optical Color Temperature
                </span>
                {/* Candlelight Flicker Toggle */}
                <button
                  onClick={() => {
                    sound.playClick();
                    setIsFlickering(!isFlickering);
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-all border cursor-pointer ${
                    isFlickering
                      ? isDark
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-amber-500/20 text-amber-800 border-amber-500/50'
                      : isDark
                      ? 'bg-[#1a130e] text-[#8e7e70] border-[#31251b] hover:text-white'
                      : 'bg-white text-[#69584b] border-[#ded4c3] hover:text-black'
                  }`}
                  title="Simulate realistic flickering candlelight oscillation"
                >
                  <Flame className="w-3 h-3 text-amber-500" />
                  <span>Candle Flicker {isFlickering ? 'ON' : 'OFF'}</span>
                </button>
              </div>

              {/* Color Temperature Pills */}
              <div className="grid grid-cols-5 gap-1.5">
                {LIGHT_TEMPS.map((t, idx) => {
                  const isSelected = selectedTempIndex === idx;
                  return (
                    <button
                      key={t.name}
                      onClick={() => {
                        sound.playClick();
                        setSelectedTempIndex(idx);
                      }}
                      className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        isSelected
                          ? isDark
                            ? 'border-white bg-[#221812] shadow-md scale-102'
                            : 'border-[#c35626] bg-white ring-1 ring-[#c35626]/40 shadow-xs scale-102'
                          : isDark
                          ? 'border-[#2d2016] bg-[#160f0a] hover:bg-[#1e150f]'
                          : 'border-[#ded4c3] bg-white/70 hover:bg-white'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-black/40 shadow-sm"
                        style={{ backgroundColor: t.colorHex }}
                      />
                      <span
                        className={`text-[9px] font-mono font-bold leading-tight truncate w-full ${
                          isDark ? 'text-white/90' : 'text-[#231b15]'
                        }`}
                      >
                        {t.kelvin}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Surface Environment Switcher */}
              <div className="flex items-center gap-1.5 pt-1">
                <span
                  className={`text-[10px] shrink-0 font-medium ${
                    isDark ? 'text-[#8c7b6d]' : 'text-[#786452]'
                  }`}
                >
                  Room Surface:
                </span>
                <div className="flex items-center gap-1 overflow-x-auto text-[10px]">
                  {ROOM_ENVS.map((env) => (
                    <button
                      key={env.id}
                      onClick={() => {
                        sound.playClick();
                        setSelectedEnvId(env.id);
                      }}
                      className={`px-2 py-0.5 rounded transition-all cursor-pointer truncate ${
                        selectedEnvId === env.id
                          ? isDark
                            ? 'bg-[#2a1f16] text-[#d2f53a] font-bold border border-[#443224]'
                            : 'bg-white text-[#c35626] border-[#ded4c3] shadow-xs font-bold'
                          : isDark
                          ? 'text-[#9c8979] hover:text-white'
                          : 'text-[#69584b] hover:text-black'
                      }`}
                    >
                      {env.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Product Strip below */}
          <div
            className={`pt-2 border-t flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none ${
              isDark ? 'border-[#221710]' : 'border-[#ded4c3]'
            }`}
          >
            <span
              className={`text-[10px] font-mono uppercase shrink-0 font-semibold ${
                isDark ? 'text-[#8c7b6d]' : 'text-[#786452]'
              }`}
            >
              QUICK TEST:
            </span>
            {PRODUCTS_DATA.map((prod) => {
              const isSelected = prod.id === selectedProductId;
              return (
                <button
                  key={prod.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedProductId(prod.id);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-all border flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? isDark
                        ? 'bg-[#d2f53a] text-black border-[#d2f53a] shadow-sm'
                        : 'bg-[#c35626] text-white border-[#c35626] shadow-sm'
                      : isDark
                      ? 'bg-[#18110b] text-[#b8a796] border-[#291d14] hover:text-white hover:border-[#423023]'
                      : 'bg-white text-[#5c4a3d] border-[#ded4c3] hover:text-black hover:bg-[#faf6f1]'
                  }`}
                >
                  <span className="text-[9px] font-mono opacity-70">FLR 0{prod.floorNumber}</span>
                  <span className="truncate max-w-[120px]">{prod.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
