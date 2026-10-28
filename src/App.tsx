/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ShelfCarousel } from './components/ShelfCarousel';
import { HeroLeft } from './components/HeroLeft';
import { BuildingShowcase } from './components/BuildingShowcase';
import { CatalogSection } from './components/CatalogSection';
import { TrolleyDrawer } from './components/TrolleyDrawer';
import { SearchModal } from './components/SearchModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { FloorDetailModal } from './components/FloorDetailModal';
import { WishlistModal } from './components/WishlistModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { VirtualDarkRoomModal } from './components/VirtualDarkRoomModal';
import { LogoEntranceIntro } from './components/LogoEntranceIntro';
import { InfoModals } from './components/InfoModals';
import { Footer } from './components/Footer';
import { PRODUCTS_DATA, FLOORS_DATA } from './data/products';
import { Product, FloorInfo, CartItem, ThemeMode } from './types';
import { Check } from 'lucide-react';

export default function App() {
  // Theme state: Rustic Brown Dark Mode (default) vs Warm Beige Light Mode
  const [theme, setTheme] = useState<ThemeMode>('rustic-dark');

  // Navigation state
  const [activeNav, setActiveNav] = useState('HOME');
  const [infoModalType, setInfoModalType] = useState<'ABOUT' | 'PROCESS' | 'CONTACT' | null>(null);

  // Virtual Dark Room Simulator state
  const [isDarkRoomOpen, setIsDarkRoomOpen] = useState(false);
  const [darkRoomProductId, setDarkRoomProductId] = useState<string>('moon-tree-light');

  // Trolley state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState<string[]>(['moon-tree-light']);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Tracking state
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [activeTrackingId, setActiveTrackingId] = useState('#VK-892415');

  // Search state
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Store Entrance Preview State (cute entrance experience before main website)
  const [isEntranceOpen, setIsEntranceOpen] = useState(true);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<FloorInfo | null>(null);
  const [selectedFloorSlot, setSelectedFloorSlot] = useState<'left' | 'center' | 'right'>('center');
  const [selectedFloorProductId, setSelectedFloorProductId] = useState<string | null>(null);
  const [floorFilter, setFloorFilter] = useState<number | null>(null);

  const handleOpenFloor = (
    floor: FloorInfo,
    slot: 'left' | 'center' | 'right' = 'center',
    productId?: string
  ) => {
    setSelectedFloor(floor);
    setSelectedFloorSlot(slot);
    setSelectedFloorProductId(productId || null);
  };

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleOpenDarkRoom = (productId?: string) => {
    if (productId) setDarkRoomProductId(productId);
    setIsDarkRoomOpen(true);
  };

  const topSellers = PRODUCTS_DATA.filter((p) => p.isTopSeller);
  const shelfProducts = PRODUCTS_DATA.filter((p) => p.isOnShelf);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'rustic-dark' ? 'warm-beige' : 'rustic-dark'));
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${quantity}x "${product.name}" to Trolley`);
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      showToast(exists ? 'Removed from Wishlist' : 'Saved to Wishlist');
      return next;
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    const item = cartItems.find((i) => i.product.id === productId);
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    if (item) {
      showToast(`Removed "${item.product.name}" from Trolley`);
    } else {
      showToast('Removed item from Trolley');
    }
  };

  const handleClearCart = () => {
    setCartItems([]);
    showToast('Trolley cleared');
  };

  const handleNavClick = (nav: string) => {
    setActiveNav(nav);
    if (nav === 'HOME') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (nav === 'SHOP') {
      const el = document.getElementById('catalog-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (nav === 'ABOUT' || nav === 'PROCESS' || nav === 'CONTACT') {
      setInfoModalType(nav as 'ABOUT' | 'PROCESS' | 'CONTACT');
    }
  };

  const handleExploreStore = () => {
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewAllTopSellers = () => {
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenTrackerWithId = (trackingId: string) => {
    setActiveTrackingId(trackingId);
    setIsTrackerOpen(true);
  };

  const isDark = theme === 'rustic-dark';

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-500 font-sans selection:bg-[#d2f53a] selection:text-black overflow-x-hidden w-full max-w-full ${
        isDark ? 'bg-[#0a0705] text-[#f7f2ea]' : 'bg-[#faf6f0] text-[#282019]'
      }`}
    >
      {/* 1. Header / Navigation Bar */}
      <Navbar
        theme={theme}
        onToggleTheme={handleToggleTheme}
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenVirtualStudio={() => handleOpenDarkRoom()}
        activeNav={activeNav}
        onNavClick={handleNavClick}
      />

      {/* 2. Sub-Header Carousel ("ON THE SHELF") */}
      <ShelfCarousel
        products={shelfProducts}
        theme={theme}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onQuickAdd={(p) => handleAddToCart(p, 1)}
      />

      {/* Main Hero Container - Directly integrated with the building */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* 3. Hero Section (2-Column Grid Layout matching reference image) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left Column (5 Cols): Welcome text, headline, CTA, and Top 3 Sellers */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <HeroLeft
              theme={theme}
              topSellers={topSellers}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onQuickAdd={(p) => handleAddToCart(p, 1)}
              onExploreStore={handleExploreStore}
              onViewAllTopSellers={handleViewAllTopSellers}
              onOpenVirtualStudio={() => handleOpenDarkRoom()}
            />
          </div>

          {/* Right Column (7 Cols): The 5-Story Glass Architectural Atelier Building */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <BuildingShowcase
              theme={theme}
              onSelectFloor={handleOpenFloor}
              selectedFloorNumber={floorFilter}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onQuickAdd={(p) => handleAddToCart(p, 1)}
              onOpenStorePhilosophy={() => setInfoModalType('ABOUT')}
            />
          </div>
        </section>

        {/* 4. Complete Atelier Archive (Catalog Section) */}
        <CatalogSection
          products={PRODUCTS_DATA}
          theme={theme}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onQuickAdd={(p) => handleAddToCart(p, 1)}
          selectedFloorFilter={floorFilter}
          onClearFloorFilter={() => setFloorFilter(null)}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onOpenVirtualDarkRoom={(id) => handleOpenDarkRoom(id)}
        />
      </main>

      {/* 5. Footer */}
      <Footer
        theme={theme}
        onSelectFloorNumber={(floorNum) => {
          setFloorFilter(floorNum);
          const el = document.getElementById('catalog-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenNavModal={(nav) => setInfoModalType(nav)}
      />

      {/* Animated VINKRI Logo Website Entry Portal */}
      <LogoEntranceIntro
        isOpen={isEntranceOpen}
        onEnterStore={() => setIsEntranceOpen(false)}
      />

      {/* Trolley Drawer */}
      <TrolleyDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        theme={theme}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onOpenOrderTracker={handleOpenTrackerWithId}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={PRODUCTS_DATA}
        theme={theme}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlistIds}
        products={PRODUCTS_DATA}
        theme={theme}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={(p) => handleAddToCart(p, 1)}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        theme={theme}
        initialTrackingId={activeTrackingId}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        theme={theme}
        onAddToCart={handleAddToCart}
        onOpenVirtualDarkRoom={(id) => handleOpenDarkRoom(id)}
        isInCart={selectedProduct ? cartItems.some((item) => item.product.id === selectedProduct.id) : false}
        onRemoveFromCart={handleRemoveCartItem}
      />

      {/* Floor Detail Modal / Immersive Floor Interior Experience */}
      <FloorDetailModal
        floor={selectedFloor}
        onClose={() => {
          setSelectedFloor(null);
          setSelectedFloorProductId(null);
        }}
        theme={theme}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onQuickAdd={(p) => handleAddToCart(p, 1)}
        onOpenVirtualDarkRoom={(id) => handleOpenDarkRoom(id)}
        onSwitchFloor={(newFloor) => {
          setSelectedFloor(newFloor);
          setSelectedFloorProductId(null);
        }}
        initialSlot={selectedFloorSlot}
        initialProductId={selectedFloorProductId}
        wishlistIds={wishlistIds}
        onToggleWishlist={handleToggleWishlist}
        cartProductIds={cartItems.map((item) => item.product.id)}
        onRemoveFromCart={handleRemoveCartItem}
      />

      {/* Virtual Dark Room Simulator Modal */}
      <VirtualDarkRoomModal
        isOpen={isDarkRoomOpen}
        onClose={() => setIsDarkRoomOpen(false)}
        initialProductId={darkRoomProductId}
        theme={theme}
        onAddToCart={handleAddToCart}
        onSelectProductDetails={(p) => setSelectedProduct(p)}
      />

      {/* Info Modals (About, Process, Contact) */}
      <InfoModals
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
        theme={theme}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold transition-all border animate-bounce ${
            isDark
              ? 'bg-[#1e1712] text-white border-[#d2f53a] shadow-[0_0_20px_rgba(210,245,58,0.25)]'
              : 'bg-white text-black border-[#c35626] shadow-xl'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center ${
              isDark ? 'bg-[#d2f53a] text-black' : 'bg-[#c35626] text-white'
            }`}
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
