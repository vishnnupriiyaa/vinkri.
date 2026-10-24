import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, Truck, Package, ShieldCheck } from 'lucide-react';
import { ThemeMode } from '../types';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  initialTrackingId?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  theme,
  initialTrackingId = ''
}) => {
  const isDark = theme === 'rustic-dark';
  const [trackingInput, setTrackingInput] = useState(initialTrackingId || '#VK-892415');
  const [searched, setSearched] = useState(true);

  if (!isOpen) return null;

  const steps = [
    { title: 'Blueprint & Component Selection', desc: 'Precision CNC teak & optical LED verification complete', date: 'Oct 23, 10:30 AM', done: true },
    { title: 'Hand-assembled in Hyderabad Atelier', desc: 'Circuitry soldered, resin polished, hand-rubbed oil patina applied', date: 'Oct 23, 02:15 PM', done: true },
    { title: 'Vault Packaging & Certificate', desc: 'Sealed inside shock-absorbing cedarwood vault box with serialized plaque', date: 'Oct 23, 05:40 PM', done: true },
    { title: 'BlueDart Express Courier Handover', desc: 'Air cargo transit to Hyderabad distribution hub', date: 'In Transit', current: true },
    { title: 'Delivered to Doorstep', desc: 'Estimated delivery tomorrow by 2:00 PM', date: 'Estimated Oct 24' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 lg:p-10 flex items-center justify-center">
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity" />

      <div
        className={`relative w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border my-8 transition-all ${
          isDark ? 'bg-[#150f0c] border-[#36291e] text-[#f7f2ea]' : 'bg-[#faf6f0] border-[#ded4c3] text-[#282019]'
        }`}
      >
        {/* Header */}
        <div className={`p-6 flex items-center justify-between border-b ${isDark ? 'border-[#2c2017]' : 'border-[#e8ded0]'}`}>
          <div className="flex items-center gap-2.5">
            <Package className={`w-5 h-5 ${isDark ? 'text-[#d2f53a]' : 'text-[#c35626]'}`} />
            <h3 className="text-base font-extrabold tracking-widest uppercase" style={{ fontFamily: 'var(--font-display)' }}>
              ATELIER TRANSIT TRACKER
            </h3>
          </div>
          <button onClick={onClose} className={`p-2 rounded-full cursor-pointer ${isDark ? 'hover:bg-[#281f18]' : 'hover:bg-[#ede3d3]'}`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-6 space-y-6">
          <div className="flex gap-2">
            <div className={`flex-1 flex items-center px-3 py-2 rounded-lg border ${isDark ? 'bg-[#1c1510] border-[#34271d]' : 'bg-white border-[#ded2c0]'}`}>
              <Search className="w-4 h-4 opacity-50 mr-2" />
              <input
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="Enter Tracking ID (e.g. #VK-892415)"
                className="w-full bg-transparent text-xs font-mono font-bold focus:outline-none"
              />
            </div>
            <button
              onClick={() => setSearched(true)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer ${
                isDark ? 'bg-[#d2f53a] text-black hover:bg-[#e0ff4f]' : 'bg-[#c35626] text-white hover:bg-[#a84419]'
              }`}
            >
              Track
            </button>
          </div>

          {searched && (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl border flex items-center justify-between ${isDark ? 'bg-[#1e1712] border-[#31251b]' : 'bg-white border-[#e6dccf]'}`}>
                <div>
                  <span className="text-[10px] font-mono opacity-60">PACKAGE SERIAL</span>
                  <p className="text-sm font-mono font-bold">{trackingInput || '#VK-892415'}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-emerald-500 flex items-center gap-1 justify-end">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    In Transit
                  </span>
                  <p className="text-xs font-semibold">Priority Air Express</p>
                </div>
              </div>

              {/* Timeline Steps */}
              <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-current/15">
                {steps.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-3">
                    <div
                      className={`absolute -left-6 mt-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center border text-[10px] ${
                        step.done
                          ? 'bg-emerald-500 border-emerald-400 text-white'
                          : step.current
                          ? isDark
                            ? 'bg-[#d2f53a] border-[#d2f53a] text-black ring-4 ring-[#d2f53a]/20'
                            : 'bg-[#c35626] border-[#c35626] text-white ring-4 ring-[#c35626]/20'
                          : isDark
                          ? 'bg-[#261f18] border-[#3d2f23] text-transparent'
                          : 'bg-[#ede3d3] border-[#d1c4b2] text-transparent'
                      }`}
                    >
                      {step.done ? <CheckCircle2 className="w-3 h-3" /> : '•'}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-baseline justify-between">
                        <h4 className="text-xs font-bold">{step.title}</h4>
                        <span className="text-[10px] font-mono opacity-60">{step.date}</span>
                      </div>
                      <p className={`text-[11px] mt-0.5 ${isDark ? 'text-[#9c8979]' : 'text-[#776657]'}`}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
