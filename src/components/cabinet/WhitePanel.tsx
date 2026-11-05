import React from 'react';
import { Eye, Star, ShoppingBag, Check } from 'lucide-react';
import { Product, ThemeMode } from '../../types';
import { ProductArtwork } from '../ProductArtwork';

interface WhitePanelProps {
  product?: Product;
  bayIndex: number;
  onSelectProduct?: (product: Product) => void;
  onQuickAdd?: (product: Product) => void;
  isInCart?: boolean;
  isJustAdded?: boolean;
  theme?: ThemeMode;
}

export const WhitePanel: React.FC<WhitePanelProps> = ({
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
      className={`group/white-panel relative w-full rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden select-none ${
        isDark
          ? 'bg-[#160f09] border border-[#382618] hover:border-[#e5a045]/70 text-[#f5efe6] shadow-[0_4px_16px_rgba(0,0,0,0.5)] hover:scale-[1.015]'
          : 'bg-white border border-[#decbb7] hover:border-[#c35626]/70 text-[#1e140d] shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(195,86,38,0.14)] hover:scale-[1.015]'
      }`}
    >
      {/* Top Header Row: Bay Badge & Rating */}
      <div className="relative z-10 flex items-center justify-between mb-1.5 sm:mb-2">
        <span
          className={`text-[7.5px] sm:text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
            isDark
              ? 'bg-[#22150c] text-[#a89685] border-[#382618]'
              : 'bg-[#faf4ec] text-[#69584b] border-[#ded4c3]'
          }`}
        >
          BAY 0{bayIndex}
        </span>
        {product && (
          <div
            className={`flex items-center gap-1 text-[8.5px] sm:text-[10px] font-mono font-bold ${
              isDark ? 'text-amber-400' : 'text-amber-500'
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
          className={`relative z-10 aspect-[4/3] sm:aspect-square w-full rounded-lg sm:rounded-xl overflow-hidden border shadow-inner mb-2 p-1.5 flex items-center justify-center transition-all duration-300 ${
            isDark
              ? 'bg-[#090604] border-[#261910] group-hover/white-panel:border-[#e5a045]/40'
              : 'bg-[#faf6f0] border-[#e6dac9] group-hover/white-panel:border-[#c35626]/40'
          }`}
        >
          <ProductArtwork
            productId={product.id}
            aspectRatio="square"
            theme={theme}
            objectFit="cover"
            className="w-full h-full object-cover group-hover/white-panel:scale-105 transition-transform duration-300"
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onSelectProduct) onSelectProduct(product);
            }}
            className={`absolute top-1.5 right-1.5 z-20 p-1 sm:p-1.5 rounded-md opacity-0 group-hover/white-panel:opacity-100 transition-opacity backdrop-blur-md shadow-xs cursor-pointer border ${
              isDark
                ? 'bg-black/85 text-white hover:text-[#d2f53a] border-white/20'
                : 'bg-white/90 text-[#1e140d] hover:text-[#c35626] border-[#decbb7]'
            }`}
            title="Inspect Details"
          >
            <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </button>
        </div>
      )}

      {/* Product Information */}
      {product && (
        <div className="relative z-10 min-w-0">
          <h4
            className={`text-[10.5px] sm:text-xs md:text-sm font-black tracking-tight leading-snug line-clamp-1 group-hover/white-panel:underline ${
              isDark ? 'text-white' : 'text-[#1e140d]'
            }`}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {product.name}
          </h4>
          <p
            className={`text-[8px] sm:text-[9.5px] line-clamp-1 mt-0.5 ${
              isDark ? 'text-[#a89685]' : 'text-[#69584b]'
            }`}
          >
            {product.description || product.shortTag}
          </p>
        </div>
      )}

      {/* Bottom Footer: Price & Quick Action */}
      {product && (
        <div
          className={`relative z-10 pt-2 mt-2 border-t flex items-center justify-between gap-1 ${
            isDark ? 'border-[#2a1b11]' : 'border-[#eedfcb]'
          }`}
        >
          <span
            className={`text-[11px] sm:text-xs md:text-sm font-black font-mono ${
              isDark ? 'text-[#e5a045]' : 'text-[#c35626]'
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
                ? 'bg-[#e5a045] hover:bg-[#cca348] text-black font-black'
                : 'bg-[#c35626] hover:bg-[#a8471d] text-white font-black'
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
