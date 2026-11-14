import React, { useState, useEffect } from 'react';
import { PRODUCTS_DATA } from '../data/products';

interface ProductArtworkProps {
  productId: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'shelf' | 'auto';
  showGlow?: boolean;
  theme?: 'rustic-dark' | 'warm-beige';
  isShelf?: boolean;
  objectFit?: 'cover' | 'contain';
  loading?: 'eager' | 'lazy';
}

export const ProductArtwork: React.FC<ProductArtworkProps> = ({
  productId,
  className = '',
  aspectRatio = 'square',
  theme = 'rustic-dark',
  objectFit = 'cover',
  loading = 'lazy'
}) => {
  const isDark = theme === 'rustic-dark';
  const [retryCount, setRetryCount] = useState(0);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setRetryCount(0);
    setImgError(false);
  }, [productId]);

  // Dynamically source accurate, matching studio photography from single source of truth
  const product = PRODUCTS_DATA.find((p) => p.id === productId);
  const baseImg = product?.imageThumbnail;
  const directImg = baseImg
    ? retryCount > 0
      ? `${baseImg}${baseImg.includes('?') ? '&' : '?'}r=${retryCount}`
      : baseImg
    : undefined;

  const handleImgError = () => {
    if (retryCount < 3) {
      const delay = retryCount === 0 ? 400 : retryCount === 1 ? 1200 : 2400;
      window.setTimeout(() => {
        setRetryCount((c) => c + 1);
      }, delay);
    } else {
      setImgError(true);
    }
  };

  return (
    <div
      className={`relative w-full h-full overflow-hidden flex items-center justify-center transition-all ${
        aspectRatio === 'square' ? 'aspect-square' : ''
      } ${isDark ? 'bg-[#17100b]' : 'bg-[#f2e9dc]'} ${className}`}
    >
      {/* Direct high-res studio photography with unified warm color grading */}
      {directImg && !imgError ? (
        <>
          <img
            src={directImg}
            alt={product?.name || productId}
            loading={loading}
            decoding="async"
            referrerPolicy="no-referrer"
            onError={handleImgError}
            className={`w-full h-full ${
              objectFit === 'contain' ? 'object-contain' : 'object-cover'
            } transition-all duration-300 ${
              isDark
                ? 'brightness-[0.91] contrast-[1.06] saturate-[0.94] sepia-[0.06]'
                : 'brightness-[1.02] contrast-[1.03] saturate-[1.04]'
            }`}
          />
          {/* Subtle architectural vignette to unify bright & moody studio backdrops */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 ${
              isDark
                ? 'bg-[radial-gradient(ellipse_at_center,transparent_54%,rgba(14,9,5,0.48)_100%)]'
                : 'bg-[radial-gradient(ellipse_at_center,transparent_64%,rgba(120,92,64,0.12)_100%)]'
            }`}
          />
        </>
      ) : (
        /* Resilient Fallback */
        <div
          className={`w-full h-full flex flex-col items-center justify-center rounded-lg p-2 text-center ${
            isDark ? 'bg-[#18120d] text-[#e5a045]' : 'bg-[#f4ecdf] text-[#c35626]'
          }`}
        >
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider line-clamp-2">
            {product?.name || productId.replace(/-/g, ' ')}
          </span>
        </div>
      )}
    </div>
  );
};
