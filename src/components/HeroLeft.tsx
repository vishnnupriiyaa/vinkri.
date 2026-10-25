import React from 'react';
import { Star, ArrowDown, ArrowRight, Plus } from 'lucide-react';
import { Product, ThemeMode } from '../types';
import { ProductArtwork } from './ProductArtwork';

interface HeroLeftProps {
  theme: ThemeMode;
  topSellers: Product[];
  wishlistIds?: string[];
  onToggleWishlist?: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onExploreStore: () => void;
  onViewAllTopSellers: () => void;
  onOpenVirtualStudio?: () => void;
}

export const HeroLeft: React.FC<HeroLeftProps> = ({
  theme,
  topSellers,
  wishlistIds = [],
  onToggleWishlist,
  onSelectProduct,
  onQuickAdd,
  onExploreStore,
  onViewAllTopSellers,
  onOpenVirtualStudio
}) => {
  const isDark = theme === 'rustic-dark';

  return (
    <div className="flex flex-col justify-between h-full pt-1 sm:pt-3 pb-2">
      {/* Top Text Block */}
      <div>
        {/* Eyebrow Kicker */}
        <p
          className={`text-[11px] font-bold tracking-[0.22em] uppercase mb-3 ${
            isDark ? 'text-[#8c7b6d]' : 'text-[#847365]'
          }`}
        >
          WELCOME TO VINKRI
        </p>

        {/* Main Headline */}
        <h1
          className={`text-3xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight leading-[1.08] sm:leading-[1.06] mb-4 ${
            isDark ? 'text-white' : 'text-[#1c140e]'
          }`}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          A Store full of{' '}
          <span
            className={`transition-colors duration-300 block sm:inline ${
              isDark ? 'text-[#d2f53a]' : 'text-[#c35626]'
            }`}
          >
            Soulful creations.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className={`text-xs sm:text-sm lg:text-[14px] leading-relaxed max-w-lg mb-6 font-normal ${
            isDark ? 'text-[#9c8979]' : 'text-[#5d4c3f]'
          }`}
        >
          Little objects made to light up spaces, hold memories and add a little
          personality to everyday life.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <button
            onClick={onExploreStore}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-xs sm:text-sm font-extrabold tracking-wider transition-all duration-200 cursor-pointer ${
              isDark
                ? 'bg-[#d2f53a] text-black hover:bg-[#e0ff4f]'
                : 'bg-[#c35626] text-white hover:bg-[#a84419]'
            }`}
          >
            <span>Explore the store</span>
            <span className="text-base leading-none">↓</span>
          </button>

          {onOpenVirtualStudio && (
            <button
              onClick={onOpenVirtualStudio}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-xs sm:text-sm font-bold tracking-wider transition-all duration-200 cursor-pointer border ${
                isDark
                  ? 'border-[#382b20] bg-[#16100c] text-[#d2f53a] hover:bg-[#201812] hover:border-[#d2f53a]/50 shadow-[0_0_15px_rgba(210,245,58,0.1)]'
                  : 'border-[#dfd3c1] bg-[#fbf6ed] text-[#c35626] hover:bg-[#f3ebd0] hover:border-[#c35626]/50 shadow-xs'
              }`}
            >
              <span>🌙 Dark Room Simulator</span>
            </button>
          )}
        </div>
      </div>

      {/* Top 3 Sellers Sub-section */}
      <div className="mt-2">
        {/* Header row: "Top 3 Sellers" and "View all →" */}
        <div className="flex items-center justify-between mb-3">
          <h2
            className={`text-sm sm:text-base font-bold tracking-tight ${
              isDark ? 'text-white' : 'text-[#231b15]'
            }`}
          >
            Top 3 Sellers
          </h2>
          <button
            onClick={onViewAllTopSellers}
            className={`text-xs font-semibold tracking-wider flex items-center gap-1 transition-colors cursor-pointer ${
              isDark
                ? 'text-[#9c8979] hover:text-[#d2f53a]'
                : 'text-[#7e6c5e] hover:text-[#c35626]'
            }`}
          >
            <span>View all</span>
            <span>→</span>
          </button>
        </div>

        {/* 3 product cards in horizontal grid */}
        <div className="grid grid-cols-3 gap-3">
          {topSellers.map((product) => (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className={`group relative flex flex-col rounded-xl overflow-hidden p-2.5 cursor-pointer transition-all border ${
                isDark
                  ? 'bg-[#140e0a] hover:bg-[#1b140f] border-[#291e16] hover:border-[#423124]'
                  : 'bg-white hover:bg-[#faf5ee] border-[#e6dccf] hover:border-[#cfbfab]'
              }`}
            >
              {/* Product Artwork Container */}
              <div
                className={`relative w-full aspect-[1.15/1] rounded-lg overflow-hidden flex items-center justify-center mb-2 border ${
                  isDark
                    ? 'bg-[#0a0705] border-[#201710]'
                    : 'bg-[#f4ede3] border-[#e2d5c3]'
                }`}
              >
                <ProductArtwork
                  productId={product.id}
                  aspectRatio="square"
                  theme={theme}
                  showGlow={false}
                  className="w-full h-full"
                />

                {/* Wishlist Heart Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onToggleWishlist) onToggleWishlist(product.id);
                  }}
                  className={`absolute top-1.5 right-1.5 p-1 rounded-full transition-all cursor-pointer ${
                    wishlistIds?.includes(product.id)
                      ? isDark
                        ? 'bg-[#d2f53a] text-black shadow-md'
                        : 'bg-[#c35626] text-white shadow-md'
                      : 'bg-black/40 text-white/80 hover:text-white opacity-80 sm:opacity-0 sm:group-hover:opacity-100'
                  }`}
                  title="Save to Wishlist"
                  aria-label={`Save ${product.name} to wishlist`}
                >
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </button>

                {/* Quick Add Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickAdd(product);
                  }}
                  className={`absolute bottom-1.5 right-1.5 p-1 rounded-full transition-all opacity-90 sm:opacity-0 sm:group-hover:opacity-100 shadow-md cursor-pointer ${
                    isDark
                      ? 'bg-[#d2f53a] text-black hover:scale-110'
                      : 'bg-[#c35626] text-white hover:scale-110'
                  }`}
                  title="Add to trolley"
                  aria-label={`Add ${product.name} to trolley`}
                >
                  <Plus className="w-3 h-3 stroke-[3]" />
                </button>
              </div>

              {/* Title */}
              <h3
                className={`text-[12px] font-bold tracking-tight truncate mb-0.5 ${
                  isDark ? 'text-white' : 'text-[#231b15]'
                }`}
              >
                {product.name}
              </h3>

              {/* Price */}
              <div className="mb-1">
                <span
                  className={`text-[12px] font-bold tabular-nums ${
                    isDark ? 'text-[#f5ede2]' : 'text-[#1c140e]'
                  }`}
                >
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Star Rating & Review Count */}
              <div className="flex items-center gap-0.5 text-[10px]">
                <div className="flex items-center text-amber-400">
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                </div>
                <span
                  className={`font-semibold ml-1 ${
                    isDark ? 'text-[#e5d8cb]' : 'text-[#4d3d31]'
                  }`}
                >
                  {product.rating.toFixed(1)}
                </span>
                <span
                  className={`tabular-nums ${
                    isDark ? 'text-[#847365]' : 'text-[#8d7c6e]'
                  }`}
                >
                  ({product.reviewsCount})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
