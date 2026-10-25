import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, CheckCircle2, ShieldCheck, Truck, Tag, Receipt, Download } from 'lucide-react';
import { CartItem, ThemeMode } from '../types';
import { ProductArtwork } from './ProductArtwork';

interface TrolleyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  theme: ThemeMode;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOpenOrderTracker?: (trackingId: string) => void;
}

export const TrolleyDrawer: React.FC<TrolleyDrawerProps> = ({
  isOpen,
  onClose,
  items,
  theme,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenOrderTracker
}) => {
  const isDark = theme === 'rustic-dark';
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'success'>('cart');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [generatedTrackingId, setGeneratedTrackingId] = useState('');

  const [shippingForm, setShippingForm] = useState({
    name: 'Vishnu Priya',
    phone: '+91 98765 43210',
    address: 'Hyderabad',
    city: 'Hyderabad',
    pincode: '500001',
    paymentMethod: 'UPI (Google Pay / PhonePe)'
  });

  if (!isOpen) return null;

  const rawSubtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = Math.round((rawSubtotal * discountPercent) / 100);
  const subtotal = rawSubtotal - discountAmount;
  const freeShippingThreshold = 3000;
  const isFreeShipping = subtotal >= freeShippingThreshold || subtotal === 0;
  const shippingFee = isFreeShipping ? 0 : 199;
  const total = subtotal + shippingFee;

  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'SOULFUL10' || promoCode.trim().toUpperCase() === 'VINKRI10') {
      setDiscountPercent(10);
      setPromoError('');
    } else {
      setPromoError('Invalid code. Try "SOULFUL10"');
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const newTracking = `#VK-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedTrackingId(newTracking);
    setCheckoutStep('success');
    setTimeout(() => {
      onClearCart();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className={`w-screen max-w-md flex flex-col shadow-2xl transition-all duration-300 border-l ${
            isDark
              ? 'bg-[#150f0c] text-[#f7f2ea] border-[#31251b]'
              : 'bg-[#faf6f0] text-[#282019] border-[#e2d6c3]'
          }`}
        >
          {/* Header */}
          <div
            className={`p-5 flex items-center justify-between border-b ${
              isDark ? 'border-[#2d2219]' : 'border-[#e8ded0]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag
                className={`w-5 h-5 ${isDark ? 'text-[#d2f53a]' : 'text-[#c35626]'}`}
              />
              <h2 className="text-base font-extrabold tracking-widest uppercase">
                YOUR TROLLEY ({items.reduce((sum, item) => sum + item.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                isDark ? 'hover:bg-[#281f18]' : 'hover:bg-[#ede3d3]'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content based on checkout step */}
          {checkoutStep === 'cart' && (
            <>
              {/* Free Shipping Progress bar */}
              <div
                className={`px-5 py-3 border-b text-xs ${
                  isDark ? 'bg-[#1b140f] border-[#2d2219]' : 'bg-[#f4ecdf] border-[#e4d8c6]'
                }`}
              >
                <div className="flex items-center justify-between font-semibold mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" />
                    {isFreeShipping
                      ? 'You unlocked FREE Pan-India Courier!'
                      : `Add ₹${(freeShippingThreshold - subtotal).toLocaleString('en-IN')} more for FREE express shipping`}
                  </span>
                  <span>{Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%</span>
                </div>
                <div
                  className={`w-full h-1.5 rounded-full overflow-hidden ${
                    isDark ? 'bg-[#2b2118]' : 'bg-[#ded2bf]'
                  }`}
                >
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      isDark ? 'bg-[#d2f53a]' : 'bg-[#c35626]'
                    }`}
                    style={{
                      width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`
                    }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        isDark ? 'bg-[#221a14] text-[#8f7e6f]' : 'bg-[#ede2d2] text-[#857364]'
                      }`}
                    >
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-base">Your trolley is empty</h3>
                    <p
                      className={`text-xs max-w-xs ${
                        isDark ? 'text-[#9c8a7b]' : 'text-[#7d6b5e]'
                      }`}
                    >
                      Explore the 5 levels of soulful creations and add kinetic toys, dioramas or ambient lamps to your shelf.
                    </p>
                    <button
                      onClick={onClose}
                      className={`mt-4 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer ${
                        isDark
                          ? 'bg-[#d2f53a] text-black hover:bg-[#e0ff4f]'
                          : 'bg-[#c35626] text-white hover:bg-[#a84419]'
                      }`}
                    >
                      Start Exploring
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.product.id}
                      className={`flex gap-3.5 p-3 rounded-xl border transition-all ${
                        isDark
                          ? 'bg-[#1c1510] border-[#31251b]'
                          : 'bg-white border-[#e8ded0] shadow-xs'
                      }`}
                    >
                      {/* Thumbnail */}
                      <div
                        className={`w-16 h-16 rounded-lg overflow-hidden shrink-0 border flex items-center justify-center ${
                          isDark ? 'bg-[#100c09] border-[#2b2017]' : 'bg-[#f5ece0] border-[#decbb2]'
                        }`}
                      >
                        <ProductArtwork
                          productId={item.product.id}
                          aspectRatio="square"
                          theme={theme}
                          showGlow={false}
                          className="w-full h-full"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-xs font-bold truncate pr-1">
                              {item.product.name}
                            </h4>
                            <span
                              className={`text-[10px] uppercase font-semibold ${
                                isDark ? 'text-[#8c7b6c]' : 'text-[#887768]'
                              }`}
                            >
                              FLR 0{item.product.floorNumber} · {item.product.category}
                            </span>
                          </div>
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className={`p-1 rounded transition-colors cursor-pointer ${
                              isDark ? 'text-[#7e6c5c] hover:text-red-400' : 'text-[#9c8979] hover:text-red-600'
                            }`}
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Price & Quantity stepper */}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs font-bold tabular-nums">
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </span>

                          <div
                            className={`flex items-center rounded border overflow-hidden text-xs font-bold ${
                              isDark
                                ? 'bg-[#100c09] border-[#382b20]'
                                : 'bg-[#f4ebdf] border-[#ded2c0]'
                            }`}
                          >
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="px-2 py-0.5 hover:bg-black/20 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="px-2 py-0.5 tabular-nums">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="px-2 py-0.5 hover:bg-black/20 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Promo Code Input & Footer Summary */}
              {items.length > 0 && (
                <div
                  className={`p-5 border-t space-y-3.5 ${
                    isDark ? 'bg-[#18120d] border-[#2e2319]' : 'bg-[#f7efe3] border-[#e4d8c6]'
                  }`}
                >
                  {/* Promo Input */}
                  <div className="flex gap-2">
                    <input
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Coupon Code (e.g. SOULFUL10)"
                      className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-mono uppercase border focus:outline-none ${
                        isDark ? 'bg-[#100c09] border-[#36291e]' : 'bg-white border-[#ded2c0]'
                      }`}
                    />
                    <button
                      onClick={applyPromo}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer border ${
                        isDark ? 'bg-[#261f18] border-[#3d2f23] text-white hover:bg-[#342a22]' : 'bg-[#eee5d8] border-[#d8cab5] text-black hover:bg-[#e2d7c4]'
                      }`}
                    >
                      Apply
                    </button>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex items-center justify-between text-xs font-semibold text-emerald-500">
                      <span>Promo Applied (10% Off)</span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {promoError && <p className="text-[11px] text-rose-400">{promoError}</p>}

                  {/* Summary math */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-[#9c8a7b]' : 'text-[#7d6b5e]'}>Subtotal</span>
                      <span className="font-bold tabular-nums">₹{rawSubtotal.toLocaleString('en-IN')}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-500">
                        <span>Craft Promo</span>
                        <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-[#9c8a7b]' : 'text-[#7d6b5e]'}>Insured Express Shipping</span>
                      <span className="font-bold">
                        {shippingFee === 0 ? (
                          <span className={isDark ? 'text-[#d2f53a]' : 'text-[#c35626]'}>FREE</span>
                        ) : (
                          `₹${shippingFee}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-extrabold pt-2 border-t border-current/10">
                      <span>Total</span>
                      <span className="tabular-nums">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setCheckoutStep('details')}
                    className={`w-full py-3.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      isDark
                        ? 'bg-[#d2f53a] text-black hover:bg-[#e0ff4f] shadow-lg'
                        : 'bg-[#c35626] text-white hover:bg-[#a84419] shadow-md'
                    }`}
                  >
                    <span>Proceed to Delivery & Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}

          {/* Delivery & Payment Step */}
          {checkoutStep === 'details' && (
            <form onSubmit={handlePlaceOrder} className="flex-1 flex flex-col justify-between p-5 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-current/10">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-wider">Fast Courier Delivery (India)</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Full Name</label>
                    <input
                      required
                      value={shippingForm.name}
                      onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                        isDark ? 'bg-[#1e1712] border-[#382b20] focus:border-[#d2f53a]' : 'bg-white border-[#ded2c0] focus:border-[#c35626]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Contact Phone</label>
                    <input
                      required
                      value={shippingForm.phone}
                      onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                        isDark ? 'bg-[#1e1712] border-[#382b20] focus:border-[#d2f53a]' : 'bg-white border-[#ded2c0] focus:border-[#c35626]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Street Address</label>
                    <textarea
                      required
                      rows={2}
                      value={shippingForm.address}
                      onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none resize-none ${
                        isDark ? 'bg-[#1e1712] border-[#382b20] focus:border-[#d2f53a]' : 'bg-white border-[#ded2c0] focus:border-[#c35626]'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">City</label>
                      <input
                        required
                        value={shippingForm.city}
                        onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                          isDark ? 'bg-[#1e1712] border-[#382b20]' : 'bg-white border-[#ded2c0]'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">PIN Code</label>
                      <input
                        required
                        value={shippingForm.pincode}
                        onChange={(e) => setShippingForm({ ...shippingForm, pincode: e.target.value })}
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                          isDark ? 'bg-[#1e1712] border-[#382b20]' : 'bg-white border-[#ded2c0]'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Select Payment Method</label>
                    <select
                      value={shippingForm.paymentMethod}
                      onChange={(e) => setShippingForm({ ...shippingForm, paymentMethod: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                        isDark ? 'bg-[#1e1712] border-[#382b20]' : 'bg-white border-[#ded2c0]'
                      }`}
                    >
                      <option>UPI (Google Pay / PhonePe / Paytm)</option>
                      <option>Credit / Debit Cards (All Banks)</option>
                      <option>NetBanking</option>
                      <option>Cash on Delivery (COD)</option>
                    </select>
                  </div>
                </div>

                <div className={`p-3 rounded-lg text-xs space-y-1 ${isDark ? 'bg-[#1f1711]' : 'bg-[#eee5d8]'}`}>
                  <p className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    Insured Wooden Vault Dispatch
                  </p>
                  <p className="opacity-80">Free replacement in the rare event of transit disturbance.</p>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <button
                  type="submit"
                  className={`w-full py-3.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer ${
                    isDark ? 'bg-[#d2f53a] text-black hover:bg-[#e0ff4f]' : 'bg-[#c35626] text-white hover:bg-[#a84419]'
                  }`}
                >
                  <span>Confirm Order · ₹{total.toLocaleString('en-IN')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="w-full py-2 text-xs font-semibold text-center opacity-70 hover:opacity-100 cursor-pointer"
                >
                  Back to Trolley
                </button>
              </div>
            </form>
          )}

          {/* Success Step */}
          {checkoutStep === 'success' && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                Order Confirmed!
              </h3>
              <p className={`text-xs max-w-xs ${isDark ? 'text-[#a69687]' : 'text-[#7d6b5e]'}`}>
                Thank you, {shippingForm.name}. Your artisan creation has been logged in the VINKRI atelier ledger.
              </p>

              <div className={`p-3.5 rounded-xl text-xs font-mono font-bold w-full border ${isDark ? 'bg-[#1e1712] border-[#31251b]' : 'bg-white border-[#ded2c0]'}`}>
                <div className="text-[10px] opacity-60 uppercase mb-1">TRACKING NUMBER</div>
                <div className="text-base font-black text-emerald-500">{generatedTrackingId}</div>
                <div className="text-[10px] opacity-75 mt-1">Dispatched from Hyderabad Flagship Atelier</div>
              </div>

              <div className="w-full space-y-2 pt-2">
                {onOpenOrderTracker && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenOrderTracker(generatedTrackingId);
                    }}
                    className={`w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer border ${
                      isDark ? 'bg-[#221a13] border-[#382b20] text-white hover:bg-[#2c221a]' : 'bg-[#eee5d8] border-[#ded2c0] text-black hover:bg-[#e4dacb]'
                    }`}
                  >
                    Track Shipment Live
                  </button>
                )}
                <button
                  onClick={() => {
                    setCheckoutStep('cart');
                    onClose();
                  }}
                  className={`w-full py-3 rounded-lg text-xs font-extrabold uppercase tracking-wider cursor-pointer ${
                    isDark ? 'bg-[#d2f53a] text-black hover:bg-[#e0ff4f]' : 'bg-[#c35626] text-white hover:bg-[#a84419]'
                  }`}
                >
                  Return to Storefront
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
