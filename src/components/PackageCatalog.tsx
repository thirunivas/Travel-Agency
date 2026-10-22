import React, { useState } from 'react';
import { TourPackage } from '../types';
import {
  MapPin,
  Star,
  Calendar,
  Hotel,
  Car,
  Utensils,
  Check,
  ArrowRight,
  Compass,
  Filter,
  Search,
  IndianRupee,
} from 'lucide-react';

interface Props {
  packages: TourPackage[];
  onSelectPackage: (pkg: TourPackage) => void;
  onBookPackage: (pkg: TourPackage) => void;
  initialDestinationFilter?: string;
}

export const PackageCatalog: React.FC<Props> = ({
  packages,
  onSelectPackage,
  onBookPackage,
  initialDestinationFilter = 'All',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>(initialDestinationFilter);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Family', 'Honeymoon', 'Beach', 'Adventure', 'Heritage', 'Luxury'];
  const regions = ['All', 'Kerala', 'Tamil Nadu', 'Goa', 'Rajasthan', 'Himachal Pradesh', 'Karnataka', 'International'];

  const filteredPackages = packages.filter((pkg) => {
    const matchesCategory = selectedCategory === 'All' || pkg.category === selectedCategory;

    // Region matching
    let matchesRegion = true;
    if (selectedRegion !== 'All') {
      const target = selectedRegion.toLowerCase();
      matchesRegion =
        pkg.state.toLowerCase().includes(target) ||
        pkg.destination.toLowerCase().includes(target) ||
        pkg.country.toLowerCase().includes(target) ||
        pkg.name.toLowerCase().includes(target);
    }

    const matchesSearch =
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.country.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesRegion && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-300">
      {/* Catalog Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
            <Compass className="w-4 h-4" />
            <span>Curated Holiday Itineraries</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Tour & Vacation Packages
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Handpicked vacation packages featuring private transport, vetted hotel stays, and authentic experiences.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by package or destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Filter Options Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        {/* Region Filter */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Filter by Destination / Region:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedRegion === reg
                    ? 'bg-slate-900 text-white dark:bg-emerald-700 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Filter by Travel Style:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      {filteredPackages.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs max-w-md mx-auto space-y-3">
          <Filter className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">No packages found</h3>
          <p className="text-xs text-slate-500">
            No tour packages match your current region and category filter criteria.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedRegion('All');
              setSearchQuery('');
            }}
            className="mt-2 px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Destination Image */}
                <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={pkg.galleryImages[0]}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-bold text-slate-900 dark:text-white shadow-xs">
                    {pkg.category}
                  </div>

                  {/* Duration & Rating */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="flex items-center gap-1 font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-amber-300" />
                      {pkg.duration}
                    </span>
                    <span className="flex items-center gap-1 font-bold bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      {pkg.rating} ({pkg.reviewsCount})
                    </span>
                  </div>
                </div>

                {/* Package Details */}
                <div className="p-6 space-y-4">
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 mb-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {pkg.destination}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {pkg.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {pkg.description}
                  </p>

                  {/* Accommodation, Transport & Meals */}
                  <div className="space-y-1.5 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5 truncate">
                      <Hotel className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{pkg.hotel}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Car className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{pkg.transport}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Utensils className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{pkg.mealsIncluded}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Action Buttons */}
              <div className="px-6 py-4 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Starting from
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-slate-900 dark:text-white">
                      ₹{pkg.priceInr.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-500">/ person</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectPackage(pkg)}
                    className="px-3 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-xs"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => onBookPackage(pkg)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-emerald-700 dark:hover:bg-emerald-800 text-xs font-bold transition-all shadow-xs"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
