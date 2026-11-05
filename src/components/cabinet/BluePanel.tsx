import React from 'react';
import { Eye, Star, ShoppingBag, Check } from 'lucide-react';
import { Product, ThemeMode } from '../../types';
import { ProductArtwork } from '../ProductArtwork';

interface BluePanelProps {
  product?: Product;
  bayIndex: number;
  onSelectProduct?: (product: Product) => void;
  onQuickAdd?: (product: Product) => void;
  isInCart?: boolean;
  isJustAdded?: boolean;
  theme?: ThemeMode;
}

export const BluePanel: React.FC<BluePanelProps> = ({
  product,
  bayIndex,
  onSelectProduct,
  onQuickAdd,
  isInCart = false,
  isJustAdded = false,
  theme = 'rustic-dark'
}) => {
  const isDark = theme === 'rustic-dark';

  return (
    <div
      onClick={() => product && onSelectProduct && onSelectProduct(product)}
      className={`group/blue-panel relative w-full rounded-2xl sm:rounded-3xl p-2.5 sm:p-3.5 transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden select-none ${
        isDark
          ? 'bg-gradient-to-b from-[#24170e] via-[#1d120a] to-[#140b06] border-2 border-[#e5a045] text-white shadow-[0_10px_28px_rgba(229,160,69,0.18),0_4px_16px_rgba(0,0,0,0.7)] hover:border-[#d2f53a] hover:shadow-[0_14px_34px_rgba(210,245,58,0.25)] hover:scale-[1.015]'
          : 'bg-[#008ba8] border-2 border-[#005a6e] text-white shadow-[0_10px_26px_rgba(0,139,168,0.3)] hover:shadow-[0_14px_34px_rgba(0,139,168,0.45)] hover:scale-[1.015]'
      }`}
    >
      {/* Subtle Satin Sheen Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/20 pointer-events-none rounded-2xl sm:rounded-3xl" />

      {/* Top Header Row: Bay Badge & Rating */}
      <div className="relative z-10 flex items-center justify-between mb-1.5 sm:mb-2">
        <span
          className={`text-[7.5px] sm:text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-xs ${
            isDark
              ? 'bg-[#311f12] text-[#f5c27d] border-[#573922]'
              : 'bg-[#005e73]/90 text-white border-white/20'
          }`}
        >
          BAY 0{bayIndex}
        </span>
        {product && (
          <div
            className={`flex items-center gap-1 text-[8.5px] sm:text-[10px] font-mono font-bold ${
              isDark ? 'text-amber-400' : 'text-amber-300'
            }`}
          >
            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
            <span>{product.rating}</span>
          </div>
        )}
      </div>

      {/* Product Image Viewport */}
      {product && (
        <div
          className={`relative z-10 aspect-[4/3] sm:aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden border shadow-inner mb-2 p-1.5 flex items-center justify-center transition-all duration-300 ${
            isDark
              ? 'bg-black/55 border-[#3d2717] group-hover/blue-panel:border-[#e5a045]/60'
              : 'bg-black/25 border-white/25 group-hover/blue-panel:border-white/50'
          }`}
        >
          <ProductArtwork
            productId={product.id}
            aspectRatio="square"
            theme={isDark ? 'rustic-dark' : 'warm-beige'}
            objectFit="cover"
            className="w-full h-full object-cover group-hover/blue-panel:scale-105 transition-transform duration-300"
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onSelectProduct) onSelectProduct(product);
            }}
            className={`absolute top-1.5 right-1.5 z-20 p-1 sm:p-1.5 rounded-md opacity-0 group-hover/blue-panel:opacity-100 transition-opacity backdrop-blur-md shadow-xs cursor-pointer border ${
              isDark
                ? 'bg-black/85 text-white hover:text-[#d2f53a] border-white/20'
                : 'bg-black/75 text-white hover:text-cyan-200 border-white/30'
            }`}
            title="Inspect Details"
          >
            <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </button>
        </div>
      )}

      {/* Product Information */}
      {product ? (
        <div className="relative z-10 min-w-0">
          <h4
            className="text-[10.5px] sm:text-xs md:text-sm font-black text-white tracking-tight leading-snug line-clamp-1 group-hover/blue-panel:underline"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {product.name}
          </h4>
          <p
            className={`text-[8px] sm:text-[9.5px] line-clamp-1 mt-0.5 ${
              isDark ? 'text-[#b8a695]' : 'text-cyan-100/80'
            }`}
          >
            {product.description || product.shortTag}
          </p>
        </div>
      ) : (
        <div className="py-6 text-center">
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-100/90">
            ATELIER ED. 0{bayIndex}
          </span>
        </div>
      )}

      {/* Bottom Footer: Price & Quick Action */}
      {product && (
        <div
          className={`relative z-10 pt-2 mt-2 border-t flex items-center justify-between gap-1 ${
            isDark ? 'border-[#3a2516]' : 'border-white/20'
          }`}
        >
          <span
            className={`text-[11px] sm:text-xs md:text-sm font-black font-mono ${
              isDark ? 'text-[#d2f53a]' : 'text-white'
            }`}
          >
            ₹{product.price.toLocaleString('en-IN')}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onQuickAdd) onQuickAdd(product);
            }}
            className={`py-1 px-2 sm:px-2.5 rounded-lg text-[8.5px] sm:text-[10px] font-mono font-black uppercase transition-all duration-200 flex items-center gap-1 cursor-pointer active:scale-95 shadow-sm ${
              isJustAdded
                ? 'bg-emerald-500 text-white'
                : isDark
                ? 'bg-[#d2f53a] hover:bg-[#bce427] text-black font-black'
                : 'bg-white hover:bg-[#e0f7fa] text-[#006078] font-black'
            }`}
          >
            {isJustAdded ? (
              <Check className="w-3 h-3 stroke-[3]" />
            ) : (
              <>
                <ShoppingBag className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span>{isInCart ? '+1' : 'Add'}</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
