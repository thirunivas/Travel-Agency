import React, { useState } from 'react';
import { TourPackage } from '../types';
import {
  X,
  Calendar,
  MapPin,
  Star,
  Hotel,
  Car,
  Utensils,
  CheckCircle2,
  XCircle,
  IndianRupee,
  ShieldCheck,
  ChevronRight,
  Clock,
  Play,
  Lightbulb,
  Compass,
  Sparkles,
} from 'lucide-react';

interface Props {
  pkg: TourPackage | null;
  onClose: () => void;
  onProceedToBook: (pkg: TourPackage) => void;
}

export const PackageDetailsModal: React.FC<Props> = ({
  pkg,
  onClose,
  onProceedToBook,
}) => {
  if (!pkg) return null;

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  const inclusions = [
    `${pkg.hotel} accommodation with daily breakfast`,
    `Private AC Vehicle (${pkg.transport}) for all sightseeing and airport transfers`,
    'Toll charges, parking fees, driver allowance, and state highway taxes',
    'Guided walking tour at primary heritage & scenic viewpoints',
    '24/7 dedicated on-call on-trip travel desk assistance',
  ];

  const exclusions = [
    'Domestic or international flight tickets (unless specified)',
    'Optional adventure water sports, pony rides, or hot air ballooning',
    'Personal expenses, laundry, telephone calls, and room mini-bar charges',
    'Monument entrance camera fees and travel insurance',
  ];

  const priceBreakdown = pkg.priceBreakdown || {
    basePriceInr: Math.round(pkg.priceInr * 0.85),
    taxesAndGstInr: Math.round(pkg.priceInr * 0.08),
    transportAllowanceInr: Math.round(pkg.priceInr * 0.07),
    totalInr: pkg.priceInr,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col my-auto">
        {/* Modal Top Nav / Header */}
        <div className="px-6 py-4 bg-[#12304A] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-wider text-[#FFD166] uppercase">
              {pkg.category} Holiday
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-300 font-medium">
              {pkg.state}, {pkg.country}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-[#F4F8FB]/50 dark:bg-slate-950">
          {/* 1. Destination Gallery & Title Header */}
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#087F65] dark:text-[#159B72] font-semibold text-xs">
                <MapPin className="w-4 h-4" />
                <span>{pkg.destination}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12304A] dark:text-white">
                {pkg.name}
              </h2>
            </div>

            {/* Gallery Main & Thumbnails */}
            <div className="space-y-3">
              <div className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative shadow-inner">
                <img
                  src={pkg.galleryImages[activeImageIdx] || pkg.galleryImages[0]}
                  alt={pkg.name}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-[#FFD166] fill-[#FFD166]" />
                  {pkg.rating} ({pkg.reviewsCount} verified reviews)
                </div>

                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-medium">
                  Photo {activeImageIdx + 1} of {pkg.galleryImages.length}
                </div>
              </div>

              {pkg.galleryImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {pkg.galleryImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIdx(i)}
                      className={`h-16 w-24 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        activeImageIdx === i
                          ? 'border-[#087EAB] scale-95 shadow-md'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-1 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#087EAB]" /> Duration
                </span>
                <p className="font-bold text-[#12304A] dark:text-white text-xs">{pkg.duration}</p>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-1 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <Hotel className="w-3 h-3 text-[#087EAB]" /> Stay
                </span>
                <p className="font-bold text-[#12304A] dark:text-white text-xs truncate">{pkg.hotel}</p>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-1 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <Car className="w-3 h-3 text-[#087EAB]" /> Ground Transport
                </span>
                <p className="font-bold text-[#12304A] dark:text-white text-xs truncate">{pkg.transport}</p>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-1 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <Utensils className="w-3 h-3 text-[#087EAB]" /> Meals Included
                </span>
                <p className="font-bold text-[#12304A] dark:text-white text-xs truncate">{pkg.mealsIncluded}</p>
              </div>
            </div>
          </div>

          {/* 2. Destination Video Section */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-[#12304A] dark:text-white flex items-center gap-2">
              <Play className="w-4 h-4 text-[#FF7165]" />
              Destination Video Teaser
            </h3>
            <p className="text-xs text-slate-500">
              Watch an authentic scenic walkthrough of {pkg.destination} before you pack your bags.
            </p>

            <div className="relative h-52 sm:h-64 rounded-xl overflow-hidden bg-slate-900 group">
              <img
                src={pkg.galleryImages[0]}
                alt="Video thumbnail"
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 flex flex-col items-center justify-center p-4">
                <button
                  onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                  className="w-14 h-14 rounded-full bg-[#FF7165] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform cursor-pointer"
                >
                  <Play className="w-6 h-6 fill-white ml-1" />
                </button>
                <span className="text-white text-xs font-bold mt-2 drop-shadow-sm">
                  {isPlayingVideo ? 'Previewing Cinematic Reel' : `Play 4K Travel Highlights of ${pkg.name}`}
                </span>
                <span className="text-[10px] text-slate-300">Curated by JourneyHub On-Ground Explorers</span>
              </div>
            </div>
          </div>

          {/* 3. Overview Description */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-[#12304A] dark:text-white">Trip Overview</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {pkg.description}
            </p>
          </div>

          {/* 4. Places to Visit */}
          {pkg.placesToVisit && pkg.placesToVisit.length > 0 && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-[#12304A] dark:text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#087EAB]" /> Key Places to Visit
              </h3>
              <div className="flex flex-wrap gap-2">
                {pkg.placesToVisit.map((place, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-[#E5F6FC] dark:bg-slate-700 text-[#087EAB] dark:text-[#56C7EA] text-xs font-bold flex items-center gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5" /> {place}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 5. Hotels & Suggested Stays */}
          {pkg.suggestedStays && pkg.suggestedStays.length > 0 && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-[#12304A] dark:text-white flex items-center gap-2">
                <Hotel className="w-4 h-4 text-[#159B72]" /> Suggested Stays & Handpicked Resorts
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {pkg.suggestedStays.map((stay, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-xs space-y-1"
                  >
                    <span className="font-bold text-[#12304A] dark:text-white block">{stay}</span>
                    <span className="text-[10px] text-emerald-600 font-bold">✓ Pre-Verified Quality</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Activities */}
          {pkg.activities && pkg.activities.length > 0 && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-[#12304A] dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF9B54]" /> Included Experiences & Activities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {pkg.activities.map((act, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-amber-50/50 dark:bg-slate-700/40">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#159B72] shrink-0" />
                    <span className="font-medium text-slate-800 dark:text-slate-200">{act}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. Interesting Facts */}
          {pkg.interestingFacts && pkg.interestingFacts.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#FFF5E8] dark:bg-slate-800 border border-amber-200 dark:border-slate-700 shadow-xs space-y-2">
              <h3 className="text-base font-bold text-[#12304A] dark:text-white flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[#FF9B54]" /> Interesting Facts & Destination Lore
              </h3>
              <ul className="space-y-1.5 text-xs text-[#203447] dark:text-slate-300">
                {pkg.interestingFacts.map((fact, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#FF9B54] font-bold">•</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 8. Day by Day Itinerary */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#12304A] dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#087EAB]" />
              Day-by-Day Travel Itinerary
            </h3>

            <div className="space-y-3">
              {pkg.itinerary && pkg.itinerary.length > 0 ? (
                pkg.itinerary.map((item) => (
                  <div
                    key={item.day}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 shadow-xs space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#087EAB] text-white font-bold text-[11px]">
                        Day {item.day}
                      </span>
                      <h4 className="font-bold text-[#12304A] dark:text-white text-xs sm:text-sm">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 pl-1 leading-relaxed">
                      {item.details}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-2xl bg-white text-xs text-slate-500">
                  Detailed day-by-day customized travel itinerary will be provided upon booking confirmation.
                </div>
              )}
            </div>
          </div>

          {/* 9. Price Breakdown Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-[#12304A] dark:text-white flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-[#159B72]" /> Transparent INR (₹) Price Breakdown
            </h3>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Accommodations & Sightseeing Base Fare:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  ₹{priceBreakdown.basePriceInr.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Dedicated Chauffeur & Private Transport Allowance:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  ₹{priceBreakdown.transportAllowanceInr.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">5% Tourism GST & Highway Toll Passes:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  ₹{priceBreakdown.taxesAndGstInr.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-sm font-black text-[#087EAB]">
                <span>All-Inclusive Starting Price (per person):</span>
                <span>₹{priceBreakdown.totalInr.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Inclusions & Exclusions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-[#DFF7EE]/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
              <h4 className="font-bold text-[#087F65] dark:text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#159B72]" /> Package Inclusions
              </h4>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-emerald-300/90">
                {inclusions.map((inc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#159B72] font-bold">•</span>
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 space-y-3">
              <h4 className="font-bold text-rose-900 dark:text-rose-300 text-xs sm:text-sm flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-600" /> Package Exclusions
              </h4>
              <ul className="space-y-2 text-xs text-rose-800 dark:text-rose-300/90">
                {exclusions.map((exc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>{exc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Sticky Bottom Bar with Pricing & Book Action */}
        <div className="px-6 py-4 bg-white dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Starting From
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-[#087EAB] dark:text-white">
                ₹{pkg.priceInr.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-500">/ person (all inclusive)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
            >
              Back to Packages
            </button>

            <button
              onClick={() => {
                onClose();
                onProceedToBook(pkg);
              }}
              className="px-6 py-2.5 rounded-xl bg-[#FF9B54] hover:bg-[#FF7165] text-slate-900 font-black text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Book This Package</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
