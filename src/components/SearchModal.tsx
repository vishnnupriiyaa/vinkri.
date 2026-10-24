import React, { useState, useMemo } from 'react';
import { Search as SearchIcon, X, Star, ArrowRight, Layers } from 'lucide-react';
import { Product, ThemeMode } from '../types';
import { ProductArtwork } from './ProductArtwork';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  theme: ThemeMode;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  theme,
  onSelectProduct
}) => {
  const isDark = theme === 'rustic-dark';
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'DESK TOYS', 'CUSTOM DIORAMAS', 'DIECAST CAR STANDS', 'CUSTOM FIGURINES', 'DECOR LAMPS'];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesQuery =
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.materials.some((m) => m.toLowerCase().includes(query.toLowerCase()));
      const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
      return matchesQuery && matchesCat;
    });
  }, [products, query, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 lg:p-10 flex items-start justify-center">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity"
      />

      <div
        className={`relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border mt-12 sm:mt-16 transition-all ${
          isDark
            ? 'bg-[#18130f] border-[#34271d] text-[#f7f2ea]'
            : 'bg-[#faf6f0] border-[#ded4c3] text-[#282019]'
        }`}
      >
        {/* Search Input Bar */}
        <div
          className={`flex items-center px-4 py-3.5 border-b ${
            isDark ? 'border-[#2d2219]' : 'border-[#e8ded0]'
          }`}
        >
          <SearchIcon
            className={`w-5 h-5 mr-3 shrink-0 ${
              isDark ? 'text-[#d2f53a]' : 'text-[#c35626]'
            }`}
          />
          <input
            autoFocus
            type="text"
            placeholder="Search creations, dioramas, desk toys, lamps..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base font-medium focus:outline-none placeholder:opacity-50"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full hover:opacity-80 text-xs font-bold mr-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors ${
              isDark ? 'hover:bg-[#281f18]' : 'hover:bg-[#ede3d3]'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pills */}
        <div
          className={`px-4 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar border-b ${
            isDark ? 'bg-[#140f0c] border-[#291f17]' : 'bg-[#f4ecdf] border-[#e4d8c6]'
          }`}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-md text-[11px] font-bold tracking-wider shrink-0 transition-all ${
                selectedCategory === cat
                  ? isDark
                    ? 'bg-[#d2f53a] text-black'
                    : 'bg-[#c35626] text-white'
                  : isDark
                  ? 'bg-[#211913] text-[#a89889] hover:text-white'
                  : 'bg-[#ede5d8] text-[#635246] hover:text-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2.5">
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-semibold opacity-70">
                No creations found matching "{query}"
              </p>
              <p className="text-xs opacity-50 mt-1">
                Try searching for "Bonsai", "Everest", "Cube", or "Car"
              </p>
            </div>
          ) : (
            filteredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  onSelectProduct(p);
                  onClose();
                }}
                className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                  isDark
                    ? 'bg-[#1e1712] hover:bg-[#251d16] border-[#31251b] hover:border-[#4d3a2b]'
                    : 'bg-white hover:bg-[#fbf7f0] border-[#e8ded0] hover:border-[#cfbfab]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-lg overflow-hidden shrink-0 flex items-center justify-center border ${
                      isDark ? 'bg-[#120e0b] border-[#2c2118]' : 'bg-[#f5ece0] border-[#dfd0bd]'
                    }`}
                  >
                    <ProductArtwork
                      productId={p.id}
                      aspectRatio="square"
                      theme={theme}
                      showGlow={false}
                      className="w-9 h-9"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold truncate">
                        {p.name}
                      </h4>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                          isDark ? 'bg-[#291f17] text-[#c9b9a9]' : 'bg-[#ede2d2] text-[#5e4d41]'
                        }`}
                      >
                        FLR 0{p.floorNumber}
                      </span>
                    </div>
                    <p
                      className={`text-[11px] line-clamp-1 mt-0.5 ${
                        isDark ? 'text-[#a29081]' : 'text-[#776657]'
                      }`}
                    >
                      {p.shortTag} · {p.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <span className="text-xs sm:text-sm font-bold tabular-nums">
                    ₹{p.price.toLocaleString('en-IN')}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center border group-hover:translate-x-1 transition-transform ${
                      isDark ? 'bg-[#271f17] border-[#382b20]' : 'bg-[#eee5d8] border-[#ded2c0]'
                    }`}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
