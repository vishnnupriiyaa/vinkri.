import React, { useState, useMemo } from 'react';
import { Star, Plus, Eye, Filter, ArrowUpDown, Moon } from 'lucide-react';
import { Product, ThemeMode } from '../types';
import { FLOORS_DATA } from '../data/products';
import { ProductArtwork } from './ProductArtwork';

interface CatalogSectionProps {
  products: Product[];
  theme: ThemeMode;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  selectedFloorFilter: number | null;
  onClearFloorFilter: () => void;
  wishlistIds?: string[];
  onToggleWishlist?: (productId: string) => void;
  onOpenVirtualDarkRoom?: (productId: string) => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  products,
  theme,
  onSelectProduct,
  onQuickAdd,
  selectedFloorFilter,
  onClearFloorFilter,
  wishlistIds = [],
  onToggleWishlist,
  onOpenVirtualDarkRoom
}) => {
  const isDark = theme === 'rustic-dark';
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const categories = [
    'ALL',
    'DESK TOYS',
    'CUSTOM DIORAMAS',
    'DIECAST CAR STANDS',
    'CUSTOM FIGURINES',
    'DECOR LAMPS'
  ];

  const displayedProducts = useMemo(() => {
    let list = products.filter((p) => {
      const matchesFloor = selectedFloorFilter ? p.floorNumber === selectedFloorFilter : true;
      const matchesCat = activeCategory === 'ALL' || p.category === activeCategory;
      return matchesFloor && matchesCat;
    });

    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list = [...list].sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [products, selectedFloorFilter, activeCategory, sortBy]);

  return (
    <section id="catalog-section" className="w-full pt-16 sm:pt-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-xs font-bold tracking-[0.25em] uppercase ${
                isDark ? 'text-[#a69686]' : 'text-[#847365]'
              }`}
            >
              COMPLETE ATELIER ARCHIVE
            </span>
            {selectedFloorFilter && (
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  isDark ? 'bg-[#d2f53a] text-black' : 'bg-[#c35626] text-white'
                }`}
              >
                Filtered: Level 0{selectedFloorFilter} ({FLOORS_DATA.find((f) => f.numeric === selectedFloorFilter)?.name})
              </span>
            )}
          </div>
          <h2
            className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-[#231b15]'
            }`}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Curated Creations Across 5 Levels
          </h2>
        </div>

        {/* Sort & Category Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sort Selector */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold ${
            isDark ? 'bg-[#18120d] border-[#31251b] text-[#b8a796]' : 'bg-white border-[#ded2c0] text-[#554538]'
          }`}>
            <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc' | 'rating')}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured Creations</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {/* Category Tabs */}
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                if (selectedFloorFilter) onClearFloorFilter();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                activeCategory === cat && !selectedFloorFilter
                  ? isDark
                    ? 'bg-[#d2f53a] text-black font-bold shadow-sm'
                    : 'bg-[#c35626] text-white font-bold shadow-sm'
                  : isDark
                  ? 'bg-[#1e1712] text-[#9c8979] hover:text-white border border-[#31251b]'
                  : 'bg-white text-[#6d5b4d] hover:text-black border border-[#e6dccf]'
              }`}
            >
              {cat}
            </button>
          ))}
          {selectedFloorFilter && (
            <button
              onClick={onClearFloorFilter}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold underline cursor-pointer ${
                isDark ? 'text-[#d2f53a]' : 'text-[#c35626]'
              }`}
            >
              Reset Floor Filter
            </button>
          )}
        </div>
      </div>

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {displayedProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => onSelectProduct(product)}
            className={`group relative flex flex-col rounded-2xl overflow-hidden p-4 cursor-pointer transition-all duration-300 border ${
              isDark
                ? 'bg-[#1b1510] hover:bg-[#231b15] border-[#2e2319] hover:border-[#4d3a2b] shadow-md hover:shadow-xl'
                : 'bg-white hover:bg-[#fbf7f0] border-[#e6dccf] hover:border-[#cfbfab] shadow-xs hover:shadow-md'
            }`}
          >
            {/* Top Tag & Floor label */}
            <div className="flex items-center justify-between text-[11px] mb-2 font-mono">
              <span
                className={`uppercase font-semibold tracking-wider truncate max-w-[140px] ${
                  isDark ? 'text-[#8f7e6f]' : 'text-[#847365]'
                }`}
              >
                {product.category}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  isDark ? 'bg-[#291f17] text-[#c9b9a8]' : 'bg-[#eee5d8] text-[#554538]'
                }`}
              >
                FLR 0{product.floorNumber}
              </span>
            </div>

            {/* Artwork Display */}
            <div
              className={`relative w-full aspect-square rounded-xl overflow-hidden flex items-center justify-center mb-3 border transition-all ${
                isDark ? 'bg-[#100c09] border-[#2b2017]' : 'bg-[#f5ede2] border-[#ded4c3]'
              }`}
            >
              <ProductArtwork
                productId={product.id}
                aspectRatio="square"
                theme={theme}
                showGlow={true}
                className="w-full h-full group-hover:scale-105 transition-transform duration-300"
              />

              {/* Wishlist Heart Button */}
              {onToggleWishlist && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(product.id);
                  }}
                  className={`absolute top-2.5 right-2.5 p-1.5 rounded-full transition-all cursor-pointer ${
                    wishlistIds.includes(product.id)
                      ? isDark
                        ? 'bg-[#d2f53a] text-black shadow-md'
                        : 'bg-[#c35626] text-white shadow-md'
                      : 'bg-black/40 text-white/80 hover:text-white opacity-85 sm:opacity-0 sm:group-hover:opacity-100'
                  }`}
                  title="Save to Wishlist"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </button>
              )}

              {/* Test in Dark Room Button */}
              {onOpenVirtualDarkRoom && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenVirtualDarkRoom(product.id);
                  }}
                  className={`absolute bottom-2.5 right-11 p-2 rounded-full transition-all opacity-85 sm:opacity-0 sm:group-hover:opacity-100 shadow-md cursor-pointer border ${
                    isDark
                      ? 'bg-[#18110b] border-[#382b20] text-[#d2f53a] hover:scale-110'
                      : 'bg-white border-[#ded4c3] text-[#c35626] hover:scale-110'
                  }`}
                  title="Test in Virtual Dark Room Simulator"
                  aria-label={`Test ${product.name} in dark room`}
                >
                  <Moon className="w-4 h-4 text-amber-400" />
                </button>
              )}

              {/* Quick Add Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickAdd(product);
                }}
                className={`absolute bottom-2.5 right-2.5 p-2 rounded-full transition-all opacity-90 sm:opacity-0 sm:group-hover:opacity-100 shadow-md cursor-pointer ${
                  isDark
                    ? 'bg-[#d2f53a] text-black hover:scale-110'
                    : 'bg-[#c35626] text-white hover:scale-110'
                }`}
                title="Add to trolley"
                aria-label={`Add ${product.name} to trolley`}
              >
                <Plus className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

            {/* Product Title */}
            <h3
              className={`text-sm sm:text-base font-bold tracking-tight mb-1 truncate ${
                isDark ? 'text-white' : 'text-[#231b15]'
              }`}
            >
              {product.name}
            </h3>

            {/* Short Tag */}
            <p
              className={`text-xs mb-3 line-clamp-1 ${
                isDark ? 'text-[#9c8979]' : 'text-[#776658]'
              }`}
            >
              {product.shortTag}
            </p>

            {/* Price and Rating row */}
            <div className="mt-auto pt-2 border-t border-current/10 flex items-center justify-between">
              <div>
                <span className="text-sm sm:text-base font-bold tabular-nums">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span
                    className={`text-[11px] line-through ml-1.5 tabular-nums ${
                      isDark ? 'text-[#776759]' : 'text-[#9c8979]'
                    }`}
                  >
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              <div className="flex items-center text-amber-400 text-xs font-semibold gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="opacity-60 text-[10px]">({product.reviewsCount})</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
