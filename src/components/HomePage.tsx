import React, { useState } from 'react';
import { TourPackage, Destination, NavTab } from '../types';
import { HeroBanner } from './HeroBanner';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  Calendar,
  CreditCard,
  MapPin,
  Star,
  CheckCircle2,
  Phone,
  Hotel,
  Car,
  HeartHandshake,
  Users,
  Award,
  Sparkles,
  ChevronRight,
  Bus,
  Plane,
  Train,
} from 'lucide-react';

interface Props {
  packages: TourPackage[];
  destinations: Destination[];
  onNavigateTab: (tab: NavTab) => void;
  onSelectPackage: (pkg: TourPackage) => void;
  onBookPackage: (pkg: TourPackage) => void;
  onSelectDestination: (categoryName: string) => void;
}

export const HomePage: React.FC<Props> = ({
  packages,
  destinations,
  onNavigateTab,
  onSelectPackage,
  onBookPackage,
  onSelectDestination,
}) => {
  const [activePackageCategory, setActivePackageCategory] = useState<string>('All');

  const agencyHighlights = [
    {
      title: 'Handpicked Stays & Resorts',
      desc: 'Carefully vetted 4-star & 5-star properties, heritage houseboats, and eco-bungalows with guaranteed quality standards.',
      icon: Hotel,
    },
    {
      title: 'Customized & Flexible Itineraries',
      desc: 'Paced for families, honeymooners, and explorers with private chauffeur-driven vehicles and dedicated assistance.',
      icon: Compass,
    },
    {
      title: '100% Transparent INR (₹) Pricing',
      desc: 'All luxury accommodations, daily breakfast, GST, and private ground transfers included with zero surprise fees.',
      icon: CreditCard,
    },
    {
      title: '24/7 Dedicated Support',
      desc: 'Our local on-ground destination managers and concierge desk are with you at every step of your travel journey.',
      icon: Phone,
    },
  ];

  const testimonials = [
    {
      quote:
        'Our family holiday in Munnar and Alleppey was magical. The private houseboat in the backwaters was impeccably clean, and the tea plantation stay was breathtaking. JourneyHub made every arrangement seamless.',
      author: 'Ananya & Rajesh Nair',
      location: 'Bangalore • Kerala Backwaters Vacation',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    },
    {
      quote:
        'We booked our honeymoon to Rajasthan through JourneyHub. The heritage palace hotel in Udaipur with lake views and the starlit desert camp in Jaisalmer were straight out of a dream. Highly recommended!',
      author: 'Vikram & Sneha Mehta',
      location: 'Mumbai • Royal Rajasthan Heritage',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    },
    {
      quote:
        'The Tamil Nadu heritage and Ooty toy train trip exceeded our expectations. Our chauffeur was courteous and experienced on Nilgiri mountain roads. Madurai Meenakshi darshan was unforgettable.',
      author: 'Pooja & Devendra Sharma',
      location: 'Delhi • Tamil Nadu & Nilgiris Tour',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    },
  ];

  // Filter packages if category tab selected
  const filteredPackages = packages.filter((p) => {
    if (activePackageCategory === 'All') return true;
    return p.state.toLowerCase().includes(activePackageCategory.toLowerCase()) || p.category === activePackageCategory;
  });

  return (
    <div className="space-y-16 pb-20 animate-in fade-in duration-300">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Real-world Indian Travel Agency Theme) */}
      {/* ========================================================================= */}
      <HeroBanner
        onNavigateTab={onNavigateTab}
        onExploreDestinations={() => onNavigateTab('destinations')}
        onBookJourney={() => onNavigateTab('packages')}
      />

      {/* ========================================================================= */}
      {/* 2. FAST TRANSPORT BOOKING TILES (KSRTC, SETC, Flights, Trains) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* KSRTC Kerala Quick Tile */}
          <div
            onClick={() => onNavigateTab('ksrtc')}
            className="p-5 rounded-3xl bg-gradient-to-br from-[#087F65] to-[#159B72] text-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider">
                Kerala Government Bus
              </span>
              <h3 className="text-xl font-black mt-2 leading-tight">Explore Kerala by Road</h3>
              <p className="text-xs text-emerald-100 mt-1">
                KSRTC Garuda Scania, SWIFT AC Sleeper & Super Fast buses.
              </p>
            </div>
            <div className="pt-4 flex items-center justify-between text-xs font-bold text-white border-t border-white/20">
              <span>Book KSRTC Buses</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* SETC Tamil Nadu Quick Tile */}
          <div
            onClick={() => onNavigateTab('setc')}
            className="p-5 rounded-3xl bg-gradient-to-br from-[#087EAB] to-[#12304A] text-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider">
                Tamil Nadu Express Bus
              </span>
              <h3 className="text-xl font-black mt-2 leading-tight">Explore Tamil Nadu by Road</h3>
              <p className="text-xs text-sky-100 mt-1">
                SETC Ultra Deluxe, AC Sleeper & Airavat coastal coaches.
              </p>
            </div>
            <div className="pt-4 flex items-center justify-between text-xs font-bold text-white border-t border-white/20">
              <span>Book SETC Buses</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Flights Quick Tile */}
          <div
            onClick={() => onNavigateTab('flights')}
            className="p-5 rounded-3xl bg-gradient-to-br from-[#12304A] to-[#203447] text-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#56C7EA]/30 text-[#56C7EA] text-[10px] font-black uppercase tracking-wider">
                Domestic Flights
              </span>
              <h3 className="text-xl font-black mt-2 leading-tight">Compare Airfares</h3>
              <p className="text-xs text-slate-300 mt-1">
                Nonstop IndiGo, Air India, Vistara flights with live seat maps.
              </p>
            </div>
            <div className="pt-4 flex items-center justify-between text-xs font-bold text-[#56C7EA] border-t border-white/10">
              <span>Search Flights</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Trains Quick Tile */}
          <div
            onClick={() => onNavigateTab('trains')}
            className="p-5 rounded-3xl bg-gradient-to-br from-[#FF9B54] to-[#FF7165] text-slate-900 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-black/15 text-[10px] font-black uppercase tracking-wider">
                Indian Railways
              </span>
              <h3 className="text-xl font-black mt-2 leading-tight">Scenic Train Journeys</h3>
              <p className="text-xs text-slate-800 mt-1">
                Vande Bharat & Superfast Express with confirmed berth booking.
              </p>
            </div>
            <div className="pt-4 flex items-center justify-between text-xs font-extrabold text-slate-900 border-t border-black/10">
              <span>Book Trains</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. DESTINATION CARD BACKGROUNDS (Section 5) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#087EAB] dark:text-[#56C7EA] block mb-1">
              Top Travel Regions
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#12304A] dark:text-white tracking-tight">
              Featured Destinations
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
              From sun-drenched backwaters and tea hills to historic Dravidian temples and golden sands.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('destinations')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#087EAB] dark:text-[#56C7EA] hover:underline cursor-pointer"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Destination Cards Grid with subtle dark gradient, rounded corners, soft shadows, hover slight zoom & elevation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.slice(0, 4).map((dest) => (
            <div
              key={dest.id}
              onClick={() => onSelectDestination(dest.category)}
              className="group cursor-pointer rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Full-width photograph with subtle dark gradient at bottom for text readability */}
              <div className="relative h-56 overflow-hidden bg-slate-100">
                <img
                  src={dest.imageUrl}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-[10px] font-bold text-[#FFD166] uppercase tracking-wider block">
                    {dest.tagline || 'Incredible India'}
                  </span>
                  <h3 className="text-xl font-black text-white leading-snug drop-shadow-sm">{dest.name}</h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {dest.shortDescription}
                </p>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Starting from</span>
                    <span className="text-base font-black text-[#087EAB] dark:text-[#56C7EA]">
                      ₹{dest.startingPriceInr.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDestination(dest.category);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#E5F6FC] hover:bg-[#087EAB] text-[#087EAB] hover:text-white dark:bg-slate-800 dark:text-[#56C7EA] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. THE 12 HOLIDAY PACKAGES (Section 6) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#087F65] dark:text-[#159B72] block mb-1">
              Handpicked Tour Packages
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#12304A] dark:text-white tracking-tight">
              Holiday Packages of Incredible India
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
              Complete itineraries with private chauffeured transfers, verified stays, and guided sightseeing.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('packages')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#087EAB] dark:text-[#56C7EA] hover:underline cursor-pointer"
          >
            <span>Browse All {packages.length} Packages</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Category Tabs Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {['All', 'Kerala', 'Tamil Nadu', 'Goa', 'Rajasthan', 'Himachal', 'Karnataka', 'Meghalaya'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActivePackageCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activePackageCategory === cat
                  ? 'bg-[#087EAB] text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Photographic Package Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => onSelectPackage(pkg)}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Full-width Destination Photo with Dark Gradient Overlay */}
                <div className="relative h-60 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={pkg.galleryImages[0]}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                  {/* Badge */}
                  <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-bold text-[#12304A] dark:text-white shadow-xs">
                    {pkg.category} Holiday
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                    <span className="flex items-center gap-1 font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-[#FFD166]" />
                      {pkg.duration}
                    </span>
                    <span className="flex items-center gap-1 font-bold bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-xs">
                      <Star className="w-3.5 h-3.5 text-[#FFD166] fill-[#FFD166]" />
                      {pkg.rating} ({pkg.reviewsCount})
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <span className="text-[11px] font-semibold text-[#087F65] dark:text-[#159B72] flex items-center gap-1 mb-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {pkg.destination}
                    </span>
                    <h3 className="text-lg font-black text-[#12304A] dark:text-white leading-snug group-hover:text-[#087EAB] transition-colors">
                      {pkg.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {pkg.description}
                  </p>

                  <div className="space-y-1.5 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5 truncate">
                      <Hotel className="w-3.5 h-3.5 text-[#087EAB] shrink-0" />
                      <span className="truncate">{pkg.hotel}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Car className="w-3.5 h-3.5 text-[#087EAB] shrink-0" />
                      <span className="truncate">{pkg.transport}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="px-6 py-4 bg-[#F4F8FB]/80 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Starting from
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-[#087EAB]">
                      ₹{pkg.priceInr.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-500">/ person</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPackage(pkg);
                    }}
                    className="px-3 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    View Details
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookPackage(pkg);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#FF9B54] hover:bg-[#FF7165] text-slate-900 font-black text-xs transition-all shadow-xs cursor-pointer"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. WHY TRAVEL WITH JOURNEYHUB */}
      {/* ========================================================================= */}
      <section className="bg-white dark:bg-slate-900/60 py-16 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#087EAB]">
              Why Travel With JourneyHub
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#12304A] dark:text-white tracking-tight">
              India's Most Trusted Travel Companion
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              We eliminate holiday friction by managing every detail—pre-verified luxury stays, private chauffeurs, instant digital vouchers, and 24/7 on-ground assistance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {agencyHighlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-[#F4F8FB] dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#087EAB]/10 text-[#087EAB] flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-[#12304A] dark:text-white text-base">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. VERIFIED TRAVELLER TESTIMONIALS */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#087F65]">
            Real Experiences
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#12304A] dark:text-white tracking-tight">
            Loved by Travellers Across the Nation
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#FFD166]">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FFD166]" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-xs font-bold text-[#12304A] dark:text-white">
                    {t.author}
                  </h4>
                  <p className="text-[10px] text-slate-500">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
