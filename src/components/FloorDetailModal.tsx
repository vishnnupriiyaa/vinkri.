import React from 'react';
import { X, ArrowRight, Eye, Sparkles, Plus, ShoppingBag, Moon } from 'lucide-react';
import { FloorInfo, Product, ThemeMode } from '../types';
import { PRODUCTS_DATA } from '../data/products';
import { ProductArtwork } from './ProductArtwork';

interface FloorDetailModalProps {
  floor: FloorInfo | null;
  onClose: () => void;
  theme: ThemeMode;
  onSelectProduct: (product: Product) => void;
  onQuickAdd?: (product: Product) => void;
  onOpenVirtualDarkRoom?: (productId: string) => void;
}

export const FloorDetailModal: React.FC<FloorDetailModalProps> = ({
  floor,
  onClose,
  theme,
  onSelectProduct,
  onQuickAdd,
  onOpenVirtualDarkRoom
}) => {
  const isDark = theme === 'rustic-dark';
  if (!floor) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 lg:p-10 flex items-center justify-center">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
      />

      <div
        className={`relative w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border my-8 transition-all ${
          isDark
            ? 'bg-[#140f0c] border-[#36291e] text-[#f7f2ea]'
            : 'bg-[#faf6f0] border-[#ded4c3] text-[#282019]'
        }`}
      >
        {/* Top Header Bar */}
        <div
          className="p-6 sm:p-7 flex items-start justify-between border-b relative"
          style={{
            borderColor: `${floor.accentHex}30`,
            background: isDark
              ? `linear-gradient(to right, ${floor.accentHex}18, transparent)`
              : `linear-gradient(to right, ${floor.accentHex}12, transparent)`
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-xl flex flex-col items-center justify-center font-mono font-black border shadow-lg shrink-0"
              style={{
                backgroundColor: `${floor.accentHex}20`,
                borderColor: `${floor.accentHex}50`,
                color: floor.accentHex
              }}
            >
              <span className="text-[10px] uppercase opacity-75 leading-none">LEVEL</span>
              <span className="text-3xl font-black leading-none mt-1">{floor.number}</span>
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3
                  className="text-2xl sm:text-3xl font-black tracking-tight"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {floor.name}
                </h3>
                <span
                  className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${floor.accentHex}25`,
                    color: floor.accentHex
                  }}
                >
                  {floor.tagline}
                </span>
              </div>
              <p
                className={`text-xs sm:text-sm mt-1.5 max-w-xl leading-relaxed ${
                  isDark ? 'text-[#b09e8e]' : 'text-[#69584b]'
                }`}
              >
                {floor.description}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isDark ? 'hover:bg-[#281f18]' : 'hover:bg-[#ede3d3]'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Exhibition Chambers on this Floor */}
        <div className="p-6 sm:p-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4
              className={`text-xs font-bold tracking-widest uppercase ${
                isDark ? 'text-[#a49282]' : 'text-[#7e6d5e]'
              }`}
            >
              3 EXHIBITION CHAMBERS ON THIS LEVEL
            </h4>
            {onOpenVirtualDarkRoom && floor.items[0]?.productId && (
              <button
                onClick={() => {
                  onClose();
                  onOpenVirtualDarkRoom(floor.items[0].productId!);
                }}
                className={`text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 transition-all cursor-pointer border ${
                  isDark
                    ? 'border-[#382b20] bg-[#18110c] text-[#d2f53a] hover:bg-[#251b14]'
                    : 'border-[#ded4c3] bg-white text-[#c35626] hover:bg-[#f6eee0]'
                }`}
              >
                <Moon className="w-3 h-3 text-amber-400" />
                <span>Simulate Level in Dark Room →</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {floor.items.map((item, index) => {
              const product = item.productId
                ? PRODUCTS_DATA.find((p) => p.id === item.productId)
                : null;

              return (
                <div
                  key={index}
                  onClick={() => {
                    if (product) {
                      onClose();
                      onSelectProduct(product);
                    }
                  }}
                  className={`group flex flex-col p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    isDark
                      ? 'bg-[#1a130e] hover:bg-[#221a13] border-[#2c2017] hover:border-[#423124] shadow-md'
                      : 'bg-white hover:bg-[#fbf7f0] border-[#e8ded0] hover:border-[#cfbfab] shadow-xs'
                  }`}
                >
                  {/* Chamber label */}
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase mb-2 opacity-65">
                    <span>CHAMBER {item.slot.toUpperCase()}</span>
                    <span>FLR {floor.number}</span>
                  </div>

                  {/* Artwork display */}
                  <div
                    className={`w-full aspect-square rounded-lg overflow-hidden flex items-center justify-center mb-3 border relative ${
                      isDark ? 'bg-[#0a0705] border-[#221912]' : 'bg-[#f4eae0] border-[#ded1be]'
                    }`}
                  >
                    {product ? (
                      <>
                        <ProductArtwork
                          productId={product.id}
                          aspectRatio="square"
                          theme={theme}
                          showGlow={false}
                          className="w-full h-full group-hover:scale-105 transition-transform"
                        />
                        {/* Quick Add Button */}
                        {onQuickAdd && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onQuickAdd(product);
                            }}
                            className={`absolute bottom-2 right-2 p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all ${
                              isDark ? 'bg-[#d2f53a] text-black hover:scale-110' : 'bg-[#c35626] text-white hover:scale-110'
                            }`}
                            title="Add to trolley"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[3]" />
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="text-center p-3 text-xs opacity-50">Atelier Exhibit</div>
                    )}
                  </div>

                  {/* Title & description */}
                  <h5 className="text-sm font-bold tracking-tight mb-1 truncate">
                    {item.title}
                  </h5>
                  <p
                    className={`text-[11px] leading-relaxed line-clamp-2 mb-3 flex-1 ${
                      isDark ? 'text-[#9c8a7b]' : 'text-[#726253]'
                    }`}
                  >
                    {item.description}
                  </p>

                  {/* Footer link */}
                  <div className="flex items-center justify-between pt-2 border-t border-current/10 text-xs font-bold">
                    {product ? (
                      <>
                        <span className="tabular-nums">₹{product.price.toLocaleString('en-IN')}</span>
                        <span
                          className={`flex items-center gap-1 text-[11px] font-semibold group-hover:translate-x-1 transition-transform ${
                            isDark ? 'text-[#d2f53a]' : 'text-[#c35626]'
                          }`}
                        >
                          <span>Inspect</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </>
                    ) : (
                      <span className="text-[11px] opacity-60">Studio Original</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
