import React from 'react';
import { Compass, Phone, Mail, MapPin, Instagram, Facebook, Youtube, ShieldCheck } from 'lucide-react';
import { NavTab } from '../types';

interface Props {
  onNavigate?: (tab: NavTab) => void;
  onNavigateToDestinations?: () => void;
  onNavigateToPackages?: () => void;
  onNavigateToAbout?: () => void;
  onNavigateToContact?: () => void;
  onNavigateToFlights?: () => void;
  onNavigateToTrains?: () => void;
  onNavigateToBuses?: () => void;
  onNavigateToKsrtc?: () => void;
  onNavigateToSetc?: () => void;
  onNavigateToHotels?: () => void;
}

export const Footer: React.FC<Props> = ({
  onNavigate,
  onNavigateToDestinations,
  onNavigateToPackages,
  onNavigateToAbout,
  onNavigateToContact,
  onNavigateToFlights,
  onNavigateToTrains,
  onNavigateToBuses,
  onNavigateToKsrtc,
  onNavigateToSetc,
  onNavigateToHotels,
}) => {
  const handleNav = (tab: NavTab) => {
    if (onNavigate) {
      onNavigate(tab);
    } else {
      if (tab === 'destinations' && onNavigateToDestinations) onNavigateToDestinations();
      else if (tab === 'packages' && onNavigateToPackages) onNavigateToPackages();
      else if (tab === 'about' && onNavigateToAbout) onNavigateToAbout();
      else if (tab === 'contact' && onNavigateToContact) onNavigateToContact();
      else if (tab === 'flights' && onNavigateToFlights) onNavigateToFlights();
      else if (tab === 'trains' && onNavigateToTrains) onNavigateToTrains();
      else if (tab === 'buses' && onNavigateToBuses) onNavigateToBuses();
      else if (tab === 'ksrtc' && onNavigateToKsrtc) onNavigateToKsrtc();
      else if (tab === 'setc' && onNavigateToSetc) onNavigateToSetc();
      else if (tab === 'hotels' && onNavigateToHotels) onNavigateToHotels();
    }
  };

  return (
    <footer className="bg-[#12304A] text-white pt-16 pb-12 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-10">
          {/* Col 1: JourneyHub Brand */}
          <div className="space-y-4">
            <div
              onClick={() => handleNav('home')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#087EAB] to-[#087F65] text-white flex items-center justify-center shadow-md">
                <Compass className="w-5 h-5 text-[#FFD166]" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white">Journey</span>
                <span className="text-xl font-black tracking-tight text-[#56C7EA]">Hub</span>
              </div>
            </div>

            <p className="text-sm text-sky-200 font-medium italic">
              "Discover Incredible India."
            </p>

            <p className="text-xs text-slate-300 leading-relaxed">
              India's premier travel agency for holiday packages, nonstop domestic flights, scenic train journeys, verified resort stays, and official KSRTC & SETC government buses.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#instagram"
                onClick={(e) => e.preventDefault()}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-[#087EAB] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#facebook"
                onClick={(e) => e.preventDefault()}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-[#087EAB] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#youtube"
                onClick={(e) => e.preventDefault()}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-[#087EAB] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Transport Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Transport Bookings
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => handleNav('flights')}
                  className="hover:text-[#56C7EA] transition-colors cursor-pointer"
                >
                  ✈️ Flights
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('trains')}
                  className="hover:text-[#56C7EA] transition-colors cursor-pointer"
                >
                  🚆 Train Bookings
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('ksrtc')}
                  className="hover:text-[#159B72] transition-colors cursor-pointer font-bold text-emerald-300"
                >
                  🌴 KSRTC Kerala Buses
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('setc')}
                  className="hover:text-[#56C7EA] transition-colors cursor-pointer font-bold text-sky-300"
                >
                  🌊 SETC Tamil Nadu Buses
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('buses')}
                  className="hover:text-[#56C7EA] transition-colors cursor-pointer"
                >
                  🚌 All Highway Bus Routes
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('hotels')}
                  className="hover:text-[#56C7EA] transition-colors cursor-pointer"
                >
                  🏨 Handpicked Stays & Resorts
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Holidays & Regions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Holidays & Packages
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => handleNav('packages')}
                  className="hover:text-[#56C7EA] transition-colors cursor-pointer"
                >
                  Kerala Backwater Escape
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('packages')}
                  className="hover:text-[#56C7EA] transition-colors cursor-pointer"
                >
                  Tamil Nadu Heritage Tour
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('packages')}
                  className="hover:text-[#56C7EA] transition-colors cursor-pointer"
                >
                  Munnar Mountain Holiday
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('packages')}
                  className="hover:text-[#56C7EA] transition-colors cursor-pointer"
                >
                  Ooty Hill Station Trip
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('packages')}
                  className="hover:text-[#56C7EA] transition-colors cursor-pointer"
                >
                  Rameswaram Spiritual Journey
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('destinations')}
                  className="hover:text-[#56C7EA] transition-colors cursor-pointer font-bold text-amber-300"
                >
                  All 12 Incredible Destinations
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Verification */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Travel Help Desk
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#159B72] shrink-0" />
                <span>Connaught Place, New Delhi & Kochi, Kerala</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FFD166] shrink-0" />
                <span>+91 98765 43210 / 1800-JOURNEY</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#56C7EA] shrink-0" />
                <span>support@journeyhub.com</span>
              </p>
            </div>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-[11px] text-[#159B72] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                All Prices in Indian Rupees (₹)
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} JourneyHub – Discover Incredible India. All rights reserved.</p>
          <p>Govt. Registered Indian Travel & Transport Desk.</p>
        </div>
      </div>
    </footer>
  );
};
