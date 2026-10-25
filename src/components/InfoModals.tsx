import React, { useState } from 'react';
import { X, CheckCircle, Mail, MapPin, Phone, Clock, Send, Sparkles, Compass, Shield } from 'lucide-react';
import { ThemeMode } from '../types';

interface InfoModalProps {
  type: 'ABOUT' | 'PROCESS' | 'CONTACT' | null;
  onClose: () => void;
  theme: ThemeMode;
}

export const InfoModals: React.FC<InfoModalProps> = ({ type, onClose, theme }) => {
  const isDark = theme === 'rustic-dark';
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    topic: 'Custom Commission (Figurine / Diorama)',
    message: ''
  });

  if (!type) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 lg:p-10 flex items-center justify-center">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
      />

      <div
        className={`relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border my-8 transition-all ${
          isDark
            ? 'bg-[#18130f] border-[#36291e] text-[#f7f2ea]'
            : 'bg-[#faf6f0] border-[#ded4c3] text-[#282019]'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`p-6 flex items-center justify-between border-b ${
            isDark ? 'border-[#2d2219]' : 'border-[#e8ded0]'
          }`}
        >
          <div>
            <span
              className={`text-[11px] font-bold tracking-widest uppercase ${
                isDark ? 'text-[#d2f53a]' : 'text-[#c35626]'
              }`}
            >
              VINKRI ATELIER
            </span>
            <h3
              className="text-xl sm:text-2xl font-extrabold tracking-tight mt-0.5"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {type === 'ABOUT' && 'Soulful Objects with Personality'}
              {type === 'PROCESS' && 'The 5-Stage Artisan Process'}
              {type === 'CONTACT' && 'Connect with the Studio'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              isDark ? 'hover:bg-[#281f18]' : 'hover:bg-[#ede3d3]'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {type === 'ABOUT' && (
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
              <p>
                <strong>VINKRI</strong> was founded on a simple observation: modern spaces are flooded with mass-produced utility, but starved of soul and wonder.
              </p>
              <p className={isDark ? 'text-[#b8a796]' : 'text-[#635345]'}>
                Our 5-story atelier concept brings together horological gearcraft, scale topographical diorama builders, miniature landscape sculptors, and optical lighting engineers under one roof. Each floor represents an obsession:
              </p>
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl border ${
                  isDark ? 'bg-[#1e1712] border-[#31251b]' : 'bg-[#f5ede2] border-[#ded4c3]'
                }`}
              >
                <div>
                  <h5 className="font-bold text-xs uppercase tracking-wider mb-1">Kinetic Tactility</h5>
                  <p className="text-[11px] opacity-80">Smooth neodymium magnetic snaps, weighted brass pivots, and analog fidget rhythm.</p>
                </div>
                <div>
                  <h5 className="font-bold text-xs uppercase tracking-wider mb-1">Luminous Warmth</h5>
                  <p className="text-[11px] opacity-80">Diffused 2200K–3000K optical filaments that banish harsh glare into tranquil sanctuaries.</p>
                </div>
                <div>
                  <h5 className="font-bold text-xs uppercase tracking-wider mb-1">Topographical Precision</h5>
                  <p className="text-[11px] opacity-80">Geodetic relief data translated into miniature mountain peaks and clouds.</p>
                </div>
                <div>
                  <h5 className="font-bold text-xs uppercase tracking-wider mb-1">Custom Human Memory</h5>
                  <p className="text-[11px] opacity-80">Hand-painted 3D portraits preserving life milestones and spiritual reverence.</p>
                </div>
              </div>
            </div>
          )}

          {type === 'PROCESS' && (
            <div className="space-y-4 text-xs sm:text-sm">
              {[
                {
                  step: '01',
                  title: 'Architectural Blueprint & CAD',
                  desc: 'Every diorama and kinetic toy begins as an engineered 3D sketch with precise tolerances down to 0.05mm.'
                },
                {
                  step: '02',
                  title: 'Precision Timber & Resin Casts',
                  desc: 'Seasoned teak, walnut, and UV-stabilized crystal acrylics are CNC-milled and hand-sculpted.'
                },
                {
                  step: '03',
                  title: 'Embedded Micro-Circuitry & LEDs',
                  desc: 'Low-voltage, continuous-touch dimmers and discrete fiber-optic micro-diodes are woven invisibly into the structures.'
                },
                {
                  step: '04',
                  title: 'Artisan Patina & Hand Finishing',
                  desc: 'Each unit receives micro-brush weathering, matte protective varnishes, and inspection under studio lights.'
                },
                {
                  step: '05',
                  title: 'Vault Packaging & Certificate',
                  desc: 'Hand-packed into impact-absorbing wooden vault boxes with a serialized atelier craft certificate.'
                }
              ].map((p) => (
                <div
                  key={p.step}
                  className={`flex gap-4 p-3 rounded-xl border ${
                    isDark ? 'bg-[#1e1712] border-[#31251b]' : 'bg-[#f5ede2] border-[#ded4c3]'
                  }`}
                >
                  <span
                    className={`font-mono text-base font-black ${
                      isDark ? 'text-[#d2f53a]' : 'text-[#c35626]'
                    }`}
                  >
                    {p.step}
                  </span>
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm">{p.title}</h5>
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-[#a99787]' : 'text-[#6c5b4d]'}`}>
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {type === 'CONTACT' && (
            <div>
              {/* Hyderabad Flagship Atelier Card */}
              <div
                className={`p-4 rounded-xl border mb-5 flex flex-col sm:flex-row gap-3 sm:items-center justify-between text-xs ${
                  isDark ? 'bg-[#1f1712] border-[#36271c]' : 'bg-[#f5ede2] border-[#ded4c3]'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <MapPin className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? 'text-[#d2f53a]' : 'text-[#c35626]'}`} />
                  <div>
                    <p className={`font-extrabold text-sm ${isDark ? 'text-white' : 'text-[#282019]'}`}>Hyderabad Flagship Atelier</p>
                    <p className="opacity-80 text-xs mt-0.5">Hyderabad, Telangana</p>
                    <p className="opacity-65 text-[11px] mt-1 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>Visiting Hours: Tue–Sun 11:00 AM – 8:30 PM (Mondays by appointment)</span>
                    </p>
                    <p className="opacity-65 text-[11px] mt-0.5 flex items-center gap-2">
                      <Phone className="w-3 h-3" />
                      <span>Studio Direct: +91 40 4852 9100 · atelier@vinkri.com</span>
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-left sm:text-right">
                  <span
                    className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold uppercase ${
                      isDark ? 'bg-[#d2f53a] text-black' : 'bg-[#c35626] text-white'
                    }`}
                  >
                    Walk-in Studio Open
                  </span>
                </div>
              </div>

              {contactSubmitted ? (
                <div className="py-10 text-center space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold">Message Dispatched!</h4>
                  <p className="text-xs opacity-75">Our atelier lead will review your commission and reply within 12 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Your Name</label>
                    <input
                      required
                      placeholder="e.g. Priya Sharma"
                      value={contactData.name}
                      onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                        isDark ? 'bg-[#221a14] border-[#382b20]' : 'bg-white border-[#ded2c0]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={contactData.email}
                      onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                        isDark ? 'bg-[#221a14] border-[#382b20]' : 'bg-white border-[#ded2c0]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Topic / Commission Type</label>
                    <select
                      value={contactData.topic}
                      onChange={(e) => setContactData({ ...contactData, topic: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                        isDark ? 'bg-[#221a14] border-[#382b20]' : 'bg-white border-[#ded2c0]'
                      }`}
                    >
                      <option>Custom Commission (Figurine / Diorama)</option>
                      <option>Diecast Stand Custom Dimensions</option>
                      <option>Corporate Gifting & Bulk Order</option>
                      <option>General Studio Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Your Note or Specifications</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Tell us about the memory, space, or scale model you want to illuminate..."
                      value={contactData.message}
                      onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none resize-none ${
                        isDark ? 'bg-[#221a14] border-[#382b20]' : 'bg-white border-[#ded2c0]'
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer ${
                      isDark ? 'bg-[#d2f53a] text-black hover:bg-[#e0ff4f]' : 'bg-[#c35626] text-white hover:bg-[#a84419]'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send to Atelier Team</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
