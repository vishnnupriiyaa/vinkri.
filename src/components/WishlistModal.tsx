import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Product, ThemeMode } from '../types';
import { ProductArtwork } from './ProductArtwork';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  products: Product[];
  theme: ThemeMode;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  products,
  theme,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct
}) => {
  const isDark = theme === 'rustic-dark';
  if (!isOpen) return null;

  const savedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 lg:p-10 flex items-center justify-center">
      <div onClick={onClose} className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity" />

      <div
        className={`relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border my-8 transition-all ${
          isDark ? 'bg-[#150f0c] border-[#36291e] text-[#f7f2ea]' : 'bg-[#faf6f0] border-[#ded4c3] text-[#282019]'
        }`}
      >
        <div className={`p-6 flex items-center justify-between border-b ${isDark ? 'border-[#2c2017]' : 'border-[#e8ded0]'}`}>
          <div className="flex items-center gap-2.5">
            <Heart className={`w-5 h-5 ${isDark ? 'text-[#d2f53a] fill-[#d2f53a]' : 'text-[#c35626] fill-[#c35626]'}`} />
            <h3 className="text-base font-extrabold tracking-widest uppercase">
              SAVED FOR LATER ({savedProducts.length})
            </h3>
          </div>
          <button onClick={onClose} className={`p-2 rounded-full cursor-pointer ${isDark ? 'hover:bg-[#281f18]' : 'hover:bg-[#ede3d3]'}`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
          {savedProducts.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Heart className="w-12 h-12 mx-auto opacity-30" />
              <p className="text-sm font-semibold">No saved creations yet.</p>
              <p className="text-xs opacity-60">Tap the heart on any item or floor to build your wishlist.</p>
            </div>
          ) : (
            savedProducts.map((p) => (
              <div
                key={p.id}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  isDark ? 'bg-[#1c1510] border-[#31251b]' : 'bg-white border-[#e8ded0]'
                }`}
              >
                <div
                  onClick={() => {
                    onClose();
                    onSelectProduct(p);
                  }}
                  className="flex items-center gap-3 cursor-pointer min-w-0"
                >
                  <div className={`w-14 h-14 rounded-lg overflow-hidden shrink-0 border ${isDark ? 'bg-[#100c09] border-[#2b2017]' : 'bg-[#f5ece0] border-[#decbb2]'}`}>
                    <ProductArtwork productId={p.id} aspectRatio="square" theme={theme} showGlow={false} className="w-full h-full" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold truncate">{p.name}</h4>
                    <p className={`text-[11px] ${isDark ? 'text-[#8c7b6c]' : 'text-[#857364]'}`}>
                      FLR 0{p.floorNumber} · ₹{p.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <button
                    onClick={() => {
                      onAddToCart(p);
                      onToggleWishlist(p.id);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer ${
                      isDark ? 'bg-[#d2f53a] text-black hover:bg-[#e0ff4f]' : 'bg-[#c35626] text-white hover:bg-[#a84419]'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Trolley</span>
                  </button>
                  <button
                    onClick={() => onToggleWishlist(p.id)}
                    className="p-1.5 opacity-60 hover:opacity-100 hover:text-red-400 cursor-pointer"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
