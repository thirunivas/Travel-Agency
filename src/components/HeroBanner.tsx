import React, { useState } from 'react';
import { NavTab } from '../types';
import {
  Plane,
  Train,
  Bus,
  Hotel,
  Package,
  Search,
  MapPin,
  Calendar,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  onNavigateTab: (tab: NavTab) => void;
  onExploreDestinations: () => void;
  onBookJourney: () => void;
}

export const HeroBanner: React.FC<Props> = ({
  onNavigateTab,
  onExploreDestinations,
  onBookJourney,
}) => {
  const [activeSearchTab, setActiveSearchTab] = useState<'flights' | 'trains' | 'buses' | 'hotels' | 'packages'>('packages');

  // Compact search panel state
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [searchDate, setSearchDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [passengers, setPassengers] = useState(2);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeSearchTab === 'flights') {
      onNavigateTab('flights');
    } else if (activeSearchTab === 'trains') {
      onNavigateTab('trains');
    } else if (activeSearchTab === 'buses') {
      onNavigateTab('buses');
    } else if (activeSearchTab === 'hotels') {
      onNavigateTab('hotels');
    } else {
      onNavigateTab('packages');
    }
  };

  return (
    <section className="relative min-h-[640px] sm:min-h-[700px] flex flex-col justify-between overflow-hidden bg-[#12304A] text-white shadow-xl">
      {/* High-quality scenic photograph: Kerala green mountains, tropical backwaters, coastline, blue sky, warm sunlight */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=2200"
          alt="Kerala tropical backwaters and green mountains under blue sky and warm sunlight"
          className="w-full h-full object-cover object-center scale-100 transition-all duration-1000"
        />
        {/* Subtle dark blue gradient overlay as requested */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#12304A]/85 via-[#12304A]/60 to-[#12304A]/90" />
      </div>

      {/* Hero Headline and Call to Actions */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-8 text-center space-y-6">
        {/* Trust Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-[#56C7EA] text-xs font-bold tracking-wide backdrop-blur-md shadow-sm">
          <Compass className="w-4 h-4 text-[#FFD166]" />
          <span className="text-white">JourneyHub – Discover Incredible India</span>
        </div>

        {/* Main Heading & Subtitle exactly as requested in Section 3 */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white drop-shadow-md leading-tight">
            Your Journey Begins Here
          </h1>
          <p className="text-base sm:text-xl lg:text-2xl text-sky-100 font-light max-w-3xl mx-auto leading-relaxed drop-shadow-sm">
            Discover incredible destinations, compare travel options, and plan your next adventure with JourneyHub.
          </p>
        </div>

        {/* Hero CTA Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onExploreDestinations}
            className="px-8 py-3.5 rounded-2xl bg-[#087EAB] hover:bg-[#12304A] text-white font-bold text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-2 border border-sky-400/30 cursor-pointer"
          >
            <span>Explore Destinations</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onBookJourney}
            className="px-8 py-3.5 rounded-2xl bg-[#FF9B54] hover:bg-[#FF7165] text-slate-900 font-black text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-2 border border-amber-300/40 cursor-pointer"
          >
            <span>Book Your Journey</span>
          </button>
        </div>
      </div>

      {/* Compact Travel Search Panel Over Lower Part of Hero Section */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 shadow-2xl border border-white/40 dark:border-slate-800 text-slate-900 dark:text-white">
          {/* 5 Search Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-slate-200 dark:border-slate-800">
            {[
              { id: 'packages', label: 'Holiday Packages', icon: Package },
              { id: 'flights', label: 'Flights', icon: Plane },
              { id: 'trains', label: 'Trains', icon: Train },
              { id: 'buses', label: 'Buses (KSRTC & SETC)', icon: Bus },
              { id: 'hotels', label: 'Hotels', icon: Hotel },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSearchTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSearchTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#087EAB] text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Compact Search Form (Does not get covered by background) */}
          <form onSubmit={handleSearchSubmit} className="pt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
              <div>
                <label className="block text-[11px] font-bold text-[#68798A] uppercase tracking-wider mb-1">
                  {activeSearchTab === 'hotels' ? 'Destination City' : 'Origin / From'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchFrom}
                    onChange={(e) => setSearchFrom(e.target.value)}
                    placeholder={
                      activeSearchTab === 'hotels'
                        ? 'e.g. Munnar, Ooty, Goa'
                        : activeSearchTab === 'flights'
                        ? 'e.g. Delhi, Mumbai'
                        : activeSearchTab === 'trains'
                        ? 'e.g. Chennai, Bangalore'
                        : 'e.g. Kochi, Chennai'
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#087EAB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#68798A] uppercase tracking-wider mb-1">
                  {activeSearchTab === 'hotels' ? 'Room Category' : 'Destination / To'}
                </label>
                <input
                  type="text"
                  value={searchTo}
                  onChange={(e) => setSearchTo(e.target.value)}
                  placeholder={
                    activeSearchTab === 'hotels'
                      ? 'Luxury / Heritage / Villa'
                      : activeSearchTab === 'packages'
                      ? 'e.g. Kerala, Tamil Nadu, Goa'
                      : 'e.g. Munnar, Madurai, Jaipur'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#087EAB]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#68798A] uppercase tracking-wider mb-1">
                  {activeSearchTab === 'hotels' ? 'Check-in Date' : 'Travel Date'}
                </label>
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#087EAB]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#68798A] uppercase tracking-wider mb-1">
                  {activeSearchTab === 'hotels' ? 'Guests' : 'Passengers'}
                </label>
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#087EAB]"
                >
                  <option value={1}>1 Person</option>
                  <option value={2}>2 Persons</option>
                  <option value={3}>3 Persons</option>
                  <option value={4}>4+ Family</option>
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#FF9B54] hover:bg-[#FF7165] text-slate-900 font-extrabold rounded-xl text-xs shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>
                    Search {activeSearchTab.charAt(0).toUpperCase() + activeSearchTab.slice(1)}
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
