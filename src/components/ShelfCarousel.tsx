import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Play, Pause, Plus } from 'lucide-react';
import { Product, ThemeMode } from '../types';
import { ProductArtwork } from './ProductArtwork';
import { sound } from '../utils/audio';

interface ShelfCarouselProps {
  products: Product[];
  theme: ThemeMode;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const ShelfCarousel: React.FC<ShelfCarouselProps> = ({
  products,
  theme,
  onSelectProduct,
  onQuickAdd
}) => {
  const isDark = theme === 'rustic-dark';
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<'normal' | 'reverse'>('normal');

  // Duplicate items twice to ensure seamless infinite loop
  const displayItems = [...products, ...products];

  const handlePrev = () => {
    sound.playClick();
    setDirection('reverse');
  };

  const handleNext = () => {
    sound.playClick();
    setDirection('normal');
  };

  return (
    <div
      className={`w-full py-1.5 px-4 sm:px-6 lg:px-8 border-b transition-colors duration-300 relative select-none ${
        isDark ? 'bg-[#0f0c09] border-[#221b14]' : 'bg-[#f5ede2] border-[#e2d5c3]'
      }`}
    >
      <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-3 overflow-hidden">
        {/* Left Title: "ON THE SHELF" and Circular Arrow */}
        <div className="flex items-center gap-2.5 shrink-0 z-20 bg-inherit pr-2">
          <span
            className={`text-[11px] font-extrabold tracking-[0.2em] uppercase flex items-center gap-1.5 ${
              isDark ? 'text-white' : 'text-[#231b15]'
            }`}
          >
            <span>ON THE SHELF</span>
            <span
              className={`w-1.5 h-1.5 rounded-full inline-block ${
                isPaused
                  ? 'bg-amber-400'
                  : isDark
                  ? 'bg-[#d2f53a] animate-pulse'
                  : 'bg-[#c35626] animate-pulse'
              }`}
            />
          </span>

          <button
            onClick={handlePrev}
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isDark
                ? 'bg-[#1c1510] text-[#cfbfaf] hover:text-white border border-[#33251a]'
                : 'bg-[#e8decb] text-[#554538] hover:text-black border border-[#cbbeab]'
            }`}
            title="Slide reverse"
            aria-label="Previous items"
          >
            <ArrowLeft className="w-3 h-3" />
          </button>
        </div>

        {/* Running Marquee Banner Track */}
        <div
          className="relative flex-1 overflow-hidden mask-[linear-gradient(to_right,transparent,black_30px,black_calc(100%-30px),transparent)]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className={`animate-shelf-marquee flex items-center gap-3 py-1 ${
              isPaused ? 'shelf-paused' : ''
            }`}
            style={{
              animationDirection: direction === 'reverse' ? 'reverse' : 'normal'
            }}
          >
            {displayItems.map((product, idx) => (
              <div
                key={`${product.id}-${idx}`}
                onClick={() => {
                  sound.playClick();
                  onSelectProduct(product);
                }}
                className={`group flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg cursor-pointer shrink-0 transition-all border ${
                  isDark
                    ? 'bg-[#16100c] hover:bg-[#201812] border-[#291e16] hover:border-[#423124]'
                    : 'bg-[#faf6f0] hover:bg-white border-[#e6dccf] hover:border-[#cfbfab]'
                }`}
              >
                {/* Mini thumbnail */}
                <div
                  className={`w-9 h-9 rounded-md overflow-hidden shrink-0 flex items-center justify-center border relative ${
                    isDark ? 'bg-[#0a0705] border-[#281e16]' : 'bg-[#eee5d8] border-[#dfd2be]'
                  }`}
                >
                  <ProductArtwork
                    productId={product.id}
                    aspectRatio="square"
                    theme={theme}
                    showGlow={false}
                    isShelf={true}
                    className="w-full h-full"
                  />
                </div>

                {/* Title & Category Tag */}
                <div className="flex flex-col min-w-[110px] sm:min-w-[125px] leading-tight">
                  <span
                    className={`text-[12px] font-bold tracking-tight truncate ${
                      isDark ? 'text-[#f5ede2] group-hover:text-white' : 'text-[#231b15] group-hover:text-black'
                    }`}
                  >
                    {product.name}
                  </span>
                  <div className="flex items-center justify-between gap-1 mt-0.5">
                    <span
                      className={`text-[9px] font-semibold tracking-wider uppercase ${
                        isDark ? 'text-[#847365]' : 'text-[#8c7a6b]'
                      }`}
                    >
                      {product.category}
                    </span>
                    <span className="text-[10px] font-bold opacity-80 tabular-nums">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Quick Add Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playChime();
                    onQuickAdd(product);
                  }}
                  className={`p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ${
                    isDark ? 'bg-[#d2f53a] text-black hover:scale-110' : 'bg-[#c35626] text-white hover:scale-110'
                  }`}
                  title="Add to trolley"
                >
                  <Plus className="w-3 h-3 stroke-[3]" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Circular Arrow & Pause Toggle */}
        <div className="shrink-0 flex items-center gap-1.5 z-20 bg-inherit pl-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isDark
                ? 'bg-[#1c1510] text-[#cfbfaf] hover:text-white border border-[#33251a]'
                : 'bg-[#e8decb] text-[#554538] hover:text-black border border-[#cbbeab]'
            }`}
            title={isPaused ? 'Resume auto-run banner' : 'Pause banner'}
            aria-label="Toggle banner animation"
          >
            {isPaused ? <Play className="w-2.5 h-2.5 fill-current" /> : <Pause className="w-2.5 h-2.5 fill-current" />}
          </button>

          <button
            onClick={handleNext}
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isDark
                ? 'bg-[#1c1510] text-[#cfbfaf] hover:text-white border border-[#33251a]'
                : 'bg-[#e8decb] text-[#554538] hover:text-black border border-[#cbbeab]'
            }`}
            title="Slide forward"
            aria-label="Next items"
          >
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
