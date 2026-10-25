import React, { useState } from 'react';

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

  // Direct studio photography for all major categories (Desk Toys, Dioramas, Diecast Stands, Figurines, Lamps)
  const directImages: Record<string, string> = {
    // Top 3 Sellers & Lamps
    'moon-tree-light': '/assets/images/moon_tree_light_1792822133142.jpg',
    'crescent-bonsai': '/assets/images/crescent_moon_bonsai_1792823851166.jpg',
    'floating-levitron': '/assets/images/floating_levitron_1792823852255.jpg',
    // Dioramas
    'mount-everest-light': '/assets/images/mount_everest_light_1792822132587.jpg',
    'aeroplane-diorama': '/assets/images/aeroplane_diorama_1792823666542.jpg',
    'bonsai-sanctuary': '/assets/images/bonsai_sanctuary_1792823852211.jpg',
    // Diecast Car Stands
    'car-showcase': '/assets/images/car_showcase_1792822133725.jpg',
    'diecast-stack': '/assets/images/diecast_car_stand_1792823666503.jpg',
    'tiered-track-rack': '/assets/images/tiered_track_rack_1792823874061.jpg',
    // Desk Toys
    'grid-cube': '/assets/images/grid_cube_toy_1792822134419.jpg',
    'basketball-shooter': '/assets/images/basketball_shooter_1792823665203.jpg',
    'candy-dispenser': '/assets/images/candy_dispenser_1792823665976.jpg',
    'automaton-horse': '/assets/images/automaton_horse_1792823850330.jpg',
    'chrome-snake': '/assets/images/chrome_serpent_1792823850606.jpg',
    // Custom Figurines
    'buddha-halo-lamp': '/assets/images/buddha_halo_lamp_1792822134221.jpg',
    'shiva-trishul-lamp': '/assets/images/shiva_trishul_aura_1792823667127.jpg',
    'custom-figurine-duo': '/assets/images/custom_couple_figurine_1792823872735.jpg'
  };

  // Coordinates from the reference image for any remaining items
  const shelfCrops: Record<string, { left: string; top: string; width: string; height: string }> = {
    'grid-cube': { width: '2909%', height: '1800%', left: '-414.5%', top: '-148%' },
    'basketball-shooter': { width: '2909%', height: '1800%', left: '-745.5%', top: '-148%' },
    'candy-dispenser': { width: '2909%', height: '1800%', left: '-1127.3%', top: '-148%' },
    'mount-everest-light': { width: '2909%', height: '1800%', left: '-1509.1%', top: '-148%' },
    'aeroplane-diorama': { width: '2909%', height: '1800%', left: '-1918.2%', top: '-148%' },
    'car-showcase': { width: '2909%', height: '1800%', left: '-2327.3%', top: '-148%' }
  };

  const directImg = directImages[productId];
  const crop = shelfCrops[productId];

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
      ) : crop && !imgError ? (
        /* Sliced thumbnail from reference image */
        <div className="relative w-full h-full overflow-hidden select-none pointer-events-none">
          <img
            src={isDark ? '/assets/aistudio/dark_building.jpg' : '/assets/aistudio/light_building.jpg'}
            alt="Product render"
            onError={() => setImgError(true)}
            className={`max-w-none absolute transition-all duration-300 ${
              isDark
                ? 'brightness-[1.02] contrast-[1.06]'
                : 'brightness-[1.08] contrast-[1.03] sepia-[0.16] hue-rotate-[340deg]'
            }`}
            style={{
              left: crop.left,
              top: crop.top,
              width: crop.width,
              height: crop.height,
              objectFit: 'cover'
            }}
          />
        </div>
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
