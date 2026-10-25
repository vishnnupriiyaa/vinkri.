import React from 'react';
import { ThemeMode } from '../types';
import { FLOORS_DATA } from '../data/products';

interface FooterProps {
  theme: ThemeMode;
  onSelectFloorNumber: (floorNum: number) => void;
  onOpenNavModal: (nav: 'ABOUT' | 'PROCESS' | 'CONTACT') => void;
}

export const Footer: React.FC<FooterProps> = ({
  theme,
  onSelectFloorNumber,
  onOpenNavModal
}) => {
  const isDark = theme === 'rustic-dark';

  return (
    <footer
      className={`w-full border-t transition-colors duration-300 mt-16 sm:mt-24 ${
        isDark
          ? 'bg-[#100d0a] border-[#291f17] text-[#ded0c2]'
          : 'bg-[#f4efe7] border-[#e2d8c7] text-[#2c221a]'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Col 1: Wordmark & Mission */}
          <div className="space-y-3">
            <h3
              className="text-2xl font-black tracking-[0.25em] uppercase"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              VINKRI
            </h3>
            <p
              className={`text-xs leading-relaxed max-w-xs ${
                isDark ? 'text-[#a49383]' : 'text-[#6b5a4d]'
              }`}
            >
              Little objects made to light up spaces, hold memories and add a little personality to everyday life.
            </p>
            <div className="pt-2 text-xs font-semibold">
              <span className={isDark ? 'text-[#d2f53a]' : 'text-[#c35626]'}>
                Hyderabad Flagship Studio
              </span>
              <p className={`text-[11px] mt-0.5 ${isDark ? 'text-[#847365]' : 'text-[#857467]'}`}>
                Hyderabad · Crafted with seasoned timber, brass & optics.
              </p>
            </div>
          </div>

          {/* Col 2: The 5 Atelier Levels */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest uppercase opacity-80">
              ATELIER FLOORS
            </h4>
            <ul className="space-y-2 text-xs">
              {FLOORS_DATA.map((floor) => (
                <li key={floor.number}>
                  <button
                    onClick={() => onSelectFloorNumber(floor.numeric)}
                    className={`hover:underline flex items-center gap-2 transition-colors ${
                      isDark ? 'text-[#baa897] hover:text-white' : 'text-[#615144] hover:text-black'
                    }`}
                  >
                    <span className="font-mono text-[10px] opacity-70">FLR {floor.number}</span>
                    <span>{floor.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Studio & Practice */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest uppercase opacity-80">
              EXPLORE
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onOpenNavModal('ABOUT')}
                  className={`hover:underline transition-colors ${
                    isDark ? 'text-[#baa897] hover:text-white' : 'text-[#615144] hover:text-black'
                  }`}
                >
                  About VINKRI Atelier
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenNavModal('PROCESS')}
                  className={`hover:underline transition-colors ${
                    isDark ? 'text-[#baa897] hover:text-white' : 'text-[#615144] hover:text-black'
                  }`}
                >
                  Our 5-Stage Craft Process
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenNavModal('CONTACT')}
                  className={`hover:underline transition-colors ${
                    isDark ? 'text-[#baa897] hover:text-white' : 'text-[#615144] hover:text-black'
                  }`}
                >
                  Custom Commissions & Dioramas
                </button>
              </li>
              <li className={`text-[11px] pt-1 ${isDark ? 'text-[#847365]' : 'text-[#88776a]'}`}>
                Pan-India & Global Express Transit
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Assurance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest uppercase opacity-80">
              ARTISAN GUARANTEE
            </h4>
            <p
              className={`text-xs leading-relaxed ${
                isDark ? 'text-[#a49383]' : 'text-[#6b5a4d]'
              }`}
            >
              Every VINKRI creation includes our 1-year electrical guarantee, protective custom wooden vault boxing, and insured delivery.
            </p>
            <div
              className={`p-3 rounded-lg border text-[11px] font-mono ${
                isDark ? 'bg-[#18130f] border-[#2f2319]' : 'bg-[#ece4d6] border-[#d9ccba]'
              }`}
            >
              CURRENCY: INR (₹) · ALL PRICES INCL. GST
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div
          className={`pt-6 border-t flex flex-col sm:flex-row items-center justify-between text-[11px] gap-2 ${
            isDark ? 'border-[#241c14] text-[#7d6d5f]' : 'border-[#ded4c3] text-[#8c7b6d]'
          }`}
        >
          <p>© {new Date().getFullYear()} VINKRI Soulful Creations. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Rustic Brown Dark / Warm Beige Dual Theme</span>
            <span>·</span>
            <span>Ideas into Everyday Objects</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
