import React, { useState } from 'react';
import { Search, Moon, Sun, Heart, Package, Volume2, VolumeX, Store } from 'lucide-react';
import { ThemeMode } from '../types';
import { sound } from '../utils/audio';

interface NavbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenWishlist: () => void;
  onOpenTracker: () => void;
  onOpenVirtualStudio: () => void;
  onOpenStoreEntrance?: () => void;
  activeNav: string;
  onNavClick: (nav: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenSearch,
  onOpenWishlist,
  onOpenTracker,
  onOpenVirtualStudio,
  onOpenStoreEntrance,
  activeNav,
  onNavClick
}) => {
  const isDark = theme === 'rustic-dark';
  const [soundActive, setSoundActive] = useState(false);
  const navItems = ['HOME', 'ABOUT', 'SHOP', 'PROCESS', 'CONTACT'];

  const toggleSound = () => {
    sound.enabled = !soundActive;
    setSoundActive(!soundActive);
    if (!soundActive) {
      sound.playChime();
    }
  };

  return (
    <header
      className={`w-full transition-colors duration-300 border-b ${
        isDark ? 'bg-[#0a0705] border-[#1d1610] text-[#f7f2ea]' : 'bg-[#faf6f0] border-[#e6dccf] text-[#282019]'
      }`}
    >
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center">
          <button
            onClick={() => {
              sound.playClick();
              onNavClick('HOME');
            }}
            className="group text-left focus:outline-none cursor-pointer"
            aria-label="VINKRI Home"
          >
            <span
              className={`font-black tracking-[0.22em] text-xl sm:text-2xl transition-colors ${
                isDark ? 'text-white' : 'text-[#231b15]'
              }`}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              VINKRI
            </span>
          </button>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-9">
          {navItems.map((item) => {
            const isActive = activeNav === item;
            return (
              <button
                key={item}
                onClick={() => {
                  sound.playClick();
                  onNavClick(item);
                }}
                className={`relative py-1 text-[12px] font-bold tracking-[0.15em] transition-colors uppercase cursor-pointer ${
                  isActive
                    ? isDark
                      ? 'text-white'
                      : 'text-[#1c140d]'
                    : isDark
                    ? 'text-[#8c7b6d] hover:text-white'
                    : 'text-[#847365] hover:text-[#1c140d]'
                }`}
              >
                {item}
                {/* Active Indicator Line */}
                {isActive && (
                  <span
                    className={`absolute bottom-[-4px] left-0 right-0 h-[2px] rounded-full transition-all ${
                      isDark ? 'bg-[#d2f53a]' : 'bg-[#c35626]'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Sound, Track, Search, Wishlist, Trolley & Theme */}
        <div className="flex items-center gap-2 sm:gap-3.5">
          {/* Audio Chime Immersion Toggle */}
          <button
            onClick={toggleSound}
            className={`p-1.5 rounded-full transition-colors focus:outline-none cursor-pointer ${
              soundActive
                ? isDark
                  ? 'text-[#d2f53a]'
                  : 'text-[#c35626]'
                : isDark
                ? 'text-white/50 hover:text-white'
                : 'text-black/50 hover:text-black'
            }`}
            title={soundActive ? 'Atelier audio effects enabled' : 'Enable tactile audio chimes'}
            aria-label="Toggle Sound"
          >
            {soundActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Track Order Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenTracker();
            }}
            className={`p-1.5 transition-colors focus:outline-none cursor-pointer ${
              isDark ? 'text-white/80 hover:text-white' : 'text-black/80 hover:text-black'
            }`}
            title="Track active shipment"
            aria-label="Track Shipment"
          >
            <Package className="w-4 h-4 stroke-[2]" />
          </button>

          {/* Search Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenSearch();
            }}
            className={`p-1.5 transition-colors focus:outline-none cursor-pointer ${
              isDark ? 'text-white/80 hover:text-white' : 'text-black/80 hover:text-black'
            }`}
            title="Search creations (Cmd+K)"
            aria-label="Search"
          >
            <Search className="w-4 h-4 stroke-[2.2]" />
          </button>

          {/* Wishlist Button with Counter */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenWishlist();
            }}
            className={`relative p-1.5 transition-colors focus:outline-none cursor-pointer ${
              isDark ? 'text-white/80 hover:text-white' : 'text-black/80 hover:text-black'
            }`}
            title="Saved Wishlist"
            aria-label={`Wishlist with ${wishlistCount} items`}
          >
            <Heart className={`w-4 h-4 ${wishlistCount > 0 ? (isDark ? 'fill-[#d2f53a] text-[#d2f53a]' : 'fill-[#c35626] text-[#c35626]') : ''}`} />
            {wishlistCount > 0 && (
              <span className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                isDark ? 'bg-[#d2f53a] text-black' : 'bg-[#c35626] text-white'
              }`}>
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Re-enter Store Entrance Preview Button */}
          {onOpenStoreEntrance && (
            <button
              onClick={() => {
                sound.playDoorBell();
                onOpenStoreEntrance();
              }}
              className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-mono font-bold tracking-wider transition-all focus:outline-none cursor-pointer border ${
                isDark
                  ? 'bg-[#18120d] border-[#382b20] text-[#c9b9a8] hover:text-white hover:border-white/30'
                  : 'bg-[#eee6d9] border-[#ded4c3] text-[#7a6452] hover:text-[#1c140e] hover:border-[#7a6452]'
              }`}
              title="Experience the boutique storefront entrance"
            >
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span className="uppercase">ENTRANCE</span>
            </button>
          )}

          {/* Virtual Dark Room Simulator Button */}
          <button
            onClick={() => {
              sound.playChime();
              onOpenVirtualStudio();
            }}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider transition-all focus:outline-none cursor-pointer border ${
              isDark
                ? 'bg-[#18120d] border-[#382b20] text-[#d2f53a] hover:bg-[#251b14] hover:border-[#d2f53a]/50 shadow-[0_0_15px_rgba(210,245,58,0.15)]'
                : 'bg-[#eee6d9] border-[#ded4c3] text-[#c35626] hover:bg-[#e4dacb] hover:border-[#c35626]/50 shadow-xs'
            }`}
            title="Experience products in our Virtual Dark Room Simulator"
          >
            <Moon className="w-3.5 h-3.5 text-amber-400" />
            <span className="uppercase tracking-widest text-[10px] hidden sm:inline">DARK ROOM</span>
            <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-[#d2f53a]' : 'bg-[#c35626]'} animate-pulse`} />
          </button>

          {/* Trolley Button with Rounded Badge Counter */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenCart();
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider transition-all focus:outline-none cursor-pointer ${
              isDark
                ? 'bg-[#18120d] text-white hover:bg-[#221a13]'
                : 'bg-[#eee6d9] text-[#241c16] hover:bg-[#e4dacb]'
            }`}
            aria-label={`View Trolley with ${cartCount} items`}
          >
            <span className="tracking-widest uppercase">TROLLEY</span>
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                isDark ? 'bg-[#d2f53a] text-black' : 'bg-[#c35626] text-white'
              }`}
            >
              {cartCount}
            </span>
          </button>

          {/* Theme Toggle (Moon / Sun) */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleTheme();
            }}
            className={`p-1.5 rounded-full transition-colors focus:outline-none cursor-pointer ${
              isDark ? 'text-white/80 hover:text-white' : 'text-black/80 hover:text-black'
            }`}
            title={isDark ? 'Switch to Warm Beige Light Mode' : 'Switch to Rustic Brown Dark Mode'}
            aria-label="Toggle Color Theme"
          >
            {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
