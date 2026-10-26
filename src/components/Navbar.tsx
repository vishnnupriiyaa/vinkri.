import React from 'react';
import { Search, Moon, Sun, Heart, Package, ShoppingBag } from 'lucide-react';
import { ThemeMode } from '../types';

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
  activeNav,
  onNavClick
}) => {
  const isDark = theme === 'rustic-dark';
  const navItems = ['HOME', 'ABOUT', 'SHOP', 'PROCESS', 'CONTACT'];

  return (
    <header
      className={`w-full transition-colors duration-300 border-b ${
        isDark ? 'bg-[#0a0705] border-[#1d1610] text-[#f7f2ea]' : 'bg-[#faf6f0] border-[#e6dccf] text-[#282019]'
      }`}
    >
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between gap-4">
        {/* Left: Brand Official Logo */}
        <div className="flex items-center">
          <button
            onClick={() => onNavClick('HOME')}
            className="group flex items-center gap-2 focus:outline-none cursor-pointer py-1"
            aria-label="VINKRI Home"
          >
            <div
              className={`relative overflow-hidden rounded-md transition-all duration-300 ${
                isDark
                  ? 'bg-black border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.06)] group-hover:border-[#d2f53a]/70 group-hover:shadow-[0_0_20px_rgba(210,245,58,0.3)]'
                  : 'bg-[#faf6f0] border border-[#e2d5c3] shadow-xs group-hover:border-[#c35626]/70 group-hover:shadow-[0_0_15px_rgba(195,86,38,0.18)] px-1'
              }`}
            >
              <img
                src="/assets/aistudio/50547_5739e055.jpg"
                alt="VINKRI"
                className={`h-7 sm:h-8 w-auto object-contain block max-w-[125px] sm:max-w-[145px] transition-all duration-300 ${
                  isDark ? '' : 'filter invert mix-blend-multiply'
                }`}
              />
            </div>
            <span className="sr-only">VINKRI</span>
          </button>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-9">
          {navItems.map((item) => {
            const isActive = activeNav === item;
            return (
              <button
                key={item}
                onClick={() => onNavClick(item)}
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

        {/* Right: Track, Search, Wishlist, Trolley & Theme */}
        <div className="flex items-center gap-2 sm:gap-3.5">
          {/* Track Order Button */}
          <button
            onClick={onOpenTracker}
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
            onClick={onOpenSearch}
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
            onClick={onOpenWishlist}
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

          {/* Virtual Dark Room Simulator Button */}
          <button
            onClick={onOpenVirtualStudio}
            className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider transition-all focus:outline-none cursor-pointer border shrink-0 ${
              isDark
                ? 'bg-[#18120d] border-[#382b20] text-[#d2f53a] hover:bg-[#251b14] hover:border-[#d2f53a]/50 shadow-[0_0_15px_rgba(210,245,58,0.15)]'
                : 'bg-[#eee6d9] border-[#ded4c3] text-[#c35626] hover:bg-[#e4dacb] hover:border-[#c35626]/50 shadow-xs'
            }`}
            title="Experience products in our Virtual Dark Room Simulator"
          >
            <Moon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="uppercase tracking-widest text-[10px] hidden sm:inline">DARK ROOM</span>
            <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-[#d2f53a]' : 'bg-[#c35626]'} animate-pulse shrink-0`} />
          </button>

          {/* Trolley Button with Rounded Badge Counter */}
          <button
            onClick={onOpenCart}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider transition-all focus:outline-none cursor-pointer shrink-0 ${
              isDark
                ? 'bg-[#18120d] text-white hover:bg-[#221a13]'
                : 'bg-[#eee6d9] text-[#241c16] hover:bg-[#e4dacb]'
            }`}
            aria-label={`View Trolley with ${cartCount} items`}
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:hidden" />
            <span className="tracking-widest uppercase hidden sm:inline">TROLLEY</span>
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
            onClick={onToggleTheme}
            className={`p-1.5 rounded-full transition-colors focus:outline-none cursor-pointer shrink-0 ${
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
