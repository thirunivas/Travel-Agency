import React, { useState } from 'react';
import { Destination } from '../types';
import { MapPin, ArrowRight, Compass, Sparkles, Check, Search, Calendar, Users, IndianRupee } from 'lucide-react';

interface Props {
  destinations: Destination[];
  onSelectDestination: (categoryName: string) => void;
  onPlanTrip: () => void;
}

export const DestinationsPage: React.FC<Props> = ({
  destinations,
  onSelectDestination,
  onPlanTrip,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filterTabs = ['All', 'Kerala', 'Tamil Nadu', 'Goa', 'Rajasthan', 'Himachal Pradesh', 'Karnataka', 'International'];

  const filteredDestinations = destinations.filter((dest) => {
    const matchesCategory = selectedFilter === 'All' || dest.category === selectedFilter;
    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dest.tagline && dest.tagline.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white p-8 sm:p-12 shadow-xl">
        <img
          src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=1600"
          alt="Scenic Kerala Backwaters & Landscapes"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/80 text-emerald-100 text-xs font-semibold tracking-wide backdrop-blur-xs">
            <Compass className="w-3.5 h-3.5" />
            Curated Indian & Global Holidays
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Discover Captivating Destinations
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            From the tranquil backwaters of Kerala and regal citadels of Rajasthan to misty Nilgiri tea hills and tropical island getaways, explore handpicked holidays designed for every traveler.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onPlanTrip}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2"
            >
              Consult Travel Specialist <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Region Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedFilter(tab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedFilter === tab
                  ? 'bg-slate-900 text-white dark:bg-emerald-700 dark:text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-emerald-600"
          />
        </div>
      </div>

      {/* Destinations Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDestinations.map((dest) => (
          <div
            key={dest.id}
            className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Destination Image */}
              <div className="relative h-60 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={dest.imageUrl}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white shadow-xs backdrop-blur-xs">
                    {dest.category}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    {dest.name}
                  </h3>
                  {dest.tagline && (
                    <p className="text-xs text-amber-300 font-medium mt-0.5">
                      {dest.tagline}
                    </p>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {dest.shortDescription}
                </p>

                {/* Highlights */}
                {dest.highlights && dest.highlights.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Tour Highlights
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {dest.highlights.slice(0, 3).map((hl, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1"
                        >
                          <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          {hl}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-6 py-4 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Starting from
                </span>
                <div className="flex items-center text-base font-extrabold text-slate-900 dark:text-white">
                  <span>₹{dest.startingPriceInr.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] font-normal text-slate-500 ml-1">/ person</span>
                </div>
              </div>

              <button
                onClick={() => onSelectDestination(dest.category)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-emerald-700 dark:hover:bg-emerald-800 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs group-hover:gap-2"
              >
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
