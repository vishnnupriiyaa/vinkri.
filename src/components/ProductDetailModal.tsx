import React, { useState } from 'react';
import { X, Star, ShoppingBag, Check, ShieldCheck, Box, Sparkles, Layers, Truck, Trash2 } from 'lucide-react';
import { Product, ThemeMode } from '../types';
import { ProductArtwork } from './ProductArtwork';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  theme: ThemeMode;
  onAddToCart: (product: Product, quantity: number, finish?: string, lightMode?: string) => void;
  onOpenVirtualDarkRoom?: (productId: string) => void;
  isInCart?: boolean;
  onRemoveFromCart?: (productId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  theme,
  onAddToCart,
  onOpenVirtualDarkRoom,
  isInCart = false,
  onRemoveFromCart
}) => {
  const isDark = theme === 'rustic-dark';
  const [quantity, setQuantity] = useState(1);
  const [selectedFinish, setSelectedFinish] = useState('Seasoned Natural Teak');
  const [selectedLight, setSelectedLight] = useState('Warm Candlelight (2200K)');
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const finishes = ['Seasoned Natural Teak', 'Hand-rubbed Walnut', 'Matte Obsidian Black'];
  const lightModes = product.ledColors || ['Warm Amber (2700K)', 'Soft Candlelight (2200K)'];

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedFinish, selectedLight);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 lg:p-10 flex items-center justify-center">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
      />

      <div
        className={`relative w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border my-8 transition-all ${
          isDark
            ? 'bg-[#140f0c] border-[#36291e] text-[#f7f2ea]'
            : 'bg-[#faf6f0] border-[#ded4c3] text-[#282019]'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-colors cursor-pointer ${
            isDark ? 'bg-black/60 hover:bg-black text-white' : 'bg-white/80 hover:bg-white text-black'
          }`}
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Visual Artwork Display */}
          <div
            className={`p-6 sm:p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r relative overflow-hidden ${
              isDark ? 'bg-[#0a0705] border-[#251c14]' : 'bg-[#f4ebe0] border-[#e2d5c3]'
            }`}
          >
            <div className="w-full max-w-[280px] aspect-square rounded-xl overflow-hidden border p-1 shadow-xl">
              <ProductArtwork
                productId={product.id}
                aspectRatio="square"
                theme={theme}
                showGlow={true}
                className="w-full h-full rounded-lg"
              />
            </div>

            {/* Level archive tag */}
            <div
              className={`mt-4 text-[10px] font-mono tracking-wider px-2.5 py-1 rounded border ${
                isDark ? 'bg-[#18120d] border-[#31251b] text-[#c9b9a8]' : 'bg-[#eadecc] border-[#d4c3ae] text-[#5e4c3f]'
              }`}
            >
              FLOOR 0{product.floorNumber} ARCHITECTURAL ATELIER
            </div>
          </div>

          {/* Right Column: Customization, Specifications & Purchase */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div>
              {/* Category & Badge */}
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-[11px] font-extrabold tracking-widest uppercase ${
                    isDark ? 'text-[#d2f53a]' : 'text-[#c35626]'
                  }`}
                >
                  {product.category}
                </span>
                {product.badge && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isDark ? 'bg-[#2b2118] text-[#e0cfbe]' : 'bg-[#ede2d2] text-[#4d3d31]'
                    }`}
                  >
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Title */}
              <h2
                className="text-2xl font-extrabold tracking-tight mb-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {product.name}
              </h2>

              {/* Star Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <span className="text-xs font-bold">{product.rating}</span>
                <span
                  className={`text-xs ${
                    isDark ? 'text-[#9c8979]' : 'text-[#847365]'
                  }`}
                >
                  ({product.reviewsCount} verified reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2.5 mb-3">
                <span className="text-2xl font-extrabold tabular-nums">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span
                    className={`text-sm line-through tabular-nums ${
                      isDark ? 'text-[#7e6c5c]' : 'text-[#9e8b7b]'
                    }`}
                  >
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span
                  className={`text-[11px] font-bold ${
                    isDark ? 'text-emerald-400' : 'text-emerald-700'
                  }`}
                >
                  All taxes & shipping included
                </span>
              </div>

              {/* Description */}
              <p
                className={`text-xs sm:text-[13px] leading-relaxed mb-4 ${
                  isDark ? 'text-[#b8a797]' : 'text-[#5d4c3f]'
                }`}
              >
                {product.description}
              </p>

              {/* Finish Selector */}
              <div className="mb-3">
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 opacity-80">
                  Select Artisan Finish
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {finishes.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setSelectedFinish(f)}
                      className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer border ${
                        selectedFinish === f
                          ? isDark
                            ? 'bg-[#d2f53a] text-black border-[#d2f53a]'
                            : 'bg-[#c35626] text-white border-[#c35626]'
                          : isDark
                          ? 'bg-[#1c1510] border-[#31251b] text-[#c7b7a6]'
                          : 'bg-white border-[#ded2c0] text-[#554538]'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Light Mode Selector if applicable */}
              {product.powerSource && (
                <div className="mb-3">
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 opacity-80">
                    Lighting Spectrum
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {lightModes.map((lm) => (
                      <button
                        key={lm}
                        type="button"
                        onClick={() => setSelectedLight(lm)}
                        className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer border ${
                          selectedLight === lm
                            ? isDark
                              ? 'bg-amber-400 text-black border-amber-400 font-bold'
                              : 'bg-amber-700 text-white border-amber-700 font-bold'
                            : isDark
                            ? 'bg-[#1c1510] border-[#31251b] text-[#c7b7a6]'
                            : 'bg-white border-[#ded2c0] text-[#554538]'
                        }`}
                      >
                        {lm}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions: Quantity Stepper & Buy */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Stepper */}
                <div
                  className={`flex items-center rounded-lg border px-2.5 py-1.5 text-xs font-bold ${
                    isDark ? 'bg-[#0d0907] border-[#31251b]' : 'bg-white border-[#ded4c3]'
                  }`}
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 hover:opacity-75 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 tabular-nums">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 hover:opacity-75 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Trolley CTA */}
                <button
                  onClick={handleAdd}
                  disabled={added}
                  className={`flex-1 py-3 px-5 rounded-lg text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : isDark
                      ? 'bg-[#d2f53a] text-black hover:bg-[#e0ff4f] shadow-lg'
                      : 'bg-[#c35626] text-white hover:bg-[#a84419] shadow-md'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Added to Trolley</span>
                    </>
                  ) : isInCart ? (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add Another (+{quantity})</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Trolley · ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                    </>
                  )}
                </button>

                {/* Explicit Remove from Trolley if already in trolley */}
                {isInCart && onRemoveFromCart && (
                  <button
                    onClick={() => {
                      onRemoveFromCart(product.id);
                    }}
                    className="py-3 px-3.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 cursor-pointer transition-all"
                    title="Remove this creation from your trolley"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                )}
              </div>

              {/* Virtual Dark Room Simulator Action */}
              {onOpenVirtualDarkRoom && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenVirtualDarkRoom(product.id);
                  }}
                  className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all border ${
                    isDark
                      ? 'border-[#382b20] bg-[#1a120c] text-[#d2f53a] hover:bg-[#251a12] hover:border-[#d2f53a]/50 shadow-[0_0_15px_rgba(210,245,58,0.1)]'
                      : 'border-[#ded4c3] bg-[#fbf6ee] text-[#c35626] hover:bg-[#f3eadc] hover:border-[#c35626]/50 shadow-xs'
                  }`}
                >
                  <span>🌙 Test in Virtual Dark Room Simulator</span>
                </button>
              )}

              {/* Guarantees */}
              <div
                className={`flex items-center justify-center gap-3 text-[10px] font-semibold pt-1 ${
                  isDark ? 'text-[#8c7b6c]' : 'text-[#847365]'
                }`}
              >
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  1-Year Electrical Guarantee
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" />
                  Free Express Dispatch
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
