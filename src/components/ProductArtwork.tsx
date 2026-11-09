import React, { useState } from 'react';
import { PRODUCTS_DATA } from '../data/products';

interface ProductArtworkProps {
  productId: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'shelf' | 'auto';
  showGlow?: boolean;
  theme?: 'rustic-dark' | 'warm-beige';
  isShelf?: boolean;
  objectFit?: 'cover' | 'contain';
}

export const ProductArtwork: React.FC<ProductArtworkProps> = ({
  productId,
  className = '',
  aspectRatio = 'square',
  theme = 'rustic-dark',
  isShelf = false,
  objectFit = 'cover'
}) => {
  const isDark = theme === 'rustic-dark';
  const [imgError, setImgError] = useState(false);

  // Dynamically source accurate, matching studio photography from single source of truth
  const product = PRODUCTS_DATA.find((p) => p.id === productId);
  const directImg = product?.imageThumbnail;
  const crop = null;

  return (
    <div
      className={`relative w-full h-full overflow-hidden flex items-center justify-center transition-all ${
        aspectRatio === 'square' ? 'aspect-square' : ''
      } ${className}`}
    >
      {/* Direct high-res studio photography */}
      {directImg && !imgError ? (
        <img
          src={directImg}
          alt={productId}
          onError={() => setImgError(true)}
          className={`w-full h-full ${
            objectFit === 'contain' ? 'object-contain' : 'object-cover'
          } transition-all duration-300 ${
            isDark
              ? 'brightness-[1.0] contrast-[1.05]'
              : 'brightness-[1.04] contrast-[1.04] saturate-[1.06]'
          }`}
        />
      ) : (
        /* Vector Fallback */
        <div
          className={`w-full h-full flex items-center justify-center rounded-lg ${
            isDark ? 'bg-[#18120d] text-[#d2f53a]' : 'bg-[#f4ecdf] text-[#c35626]'
          }`}
        >
          <span className="text-[10px] font-mono font-bold uppercase">{productId.split('-')[0]}</span>
        </div>
      )}
    </div>
  );
};
