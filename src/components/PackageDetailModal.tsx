import React, { useState } from 'react';
import { TourPackage, Review } from '../types';
import { X, MapPin, Calendar, Hotel, Car, Utensils, Star, ShieldCheck, CheckCircle2, ArrowRight, User } from 'lucide-react';

interface Props {
  pkg: TourPackage | null;
  onClose: () => void;
  onBook: (pkg: TourPackage) => void;
  reviews: Review[];
}

export const PackageDetailModal: React.FC<Props> = ({ pkg, onClose, onBook, reviews }) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!pkg) return null;

  const packageReviews = reviews.filter((r) => r.packageId === pkg.id);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8 relative max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-slate-900/60 hover:bg-slate-900 text-white rounded-full transition-colors backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Hero Header */}
        <div className="relative h-72 sm:h-80 bg-slate-950 flex-shrink-0 overflow-hidden">
          <img
            src={pkg.galleryImages[activeImageIdx] || pkg.galleryImages[0]}
            alt={pkg.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

          {/* Gallery Thumbnails */}
          {pkg.galleryImages.length > 1 && (
            <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto pb-1 z-10">
              {pkg.galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImageIdx === idx ? 'border-amber-400 scale-105 shadow-md' : 'border-white/50 opacity-70'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="absolute top-4 left-4 z-10 bg-blue-600 text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
            {pkg.category}
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Title & Price Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>{pkg.destination}, {pkg.state}, {pkg.country}</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">{pkg.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-amber-500 font-extrabold text-xs">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{pkg.rating}</span>
                </div>
                <span className="text-xs text-slate-400">({pkg.reviewsCount} customer reviews)</span>
              </div>
            </div>

            <div className="text-left sm:text-right bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Total Price</span>
              <span className="text-2xl font-black text-blue-700">₹{pkg.priceInr.toLocaleString('en-IN')}</span>
              <span className="text-xs text-slate-500 block font-semibold">per person (Incl. GST)</span>
            </div>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
              <span className="text-slate-400 font-bold block mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" /> Duration
              </span>
              <span className="font-extrabold text-slate-900">{pkg.duration}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
              <span className="text-slate-400 font-bold block mb-1 flex items-center gap-1">
                <Hotel className="w-3.5 h-3.5 text-blue-600" /> Hotel Stay
              </span>
              <span className="font-bold text-slate-800 truncate block">{pkg.hotel}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
              <span className="text-slate-400 font-bold block mb-1 flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-blue-600" /> Transport
              </span>
              <span className="font-bold text-slate-800 truncate block">{pkg.transport}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
              <span className="text-slate-400 font-bold block mb-1 flex items-center gap-1">
                <Utensils className="w-3.5 h-3.5 text-blue-600" /> Meals
              </span>
              <span className="font-bold text-slate-800 truncate block">{pkg.mealsIncluded}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 mb-2">Package Overview</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{pkg.description}</p>
          </div>

          {/* Day-by-Day Itinerary */}
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" /> Day-by-Day Tour Itinerary
            </h3>

            <div className="space-y-3">
              {pkg.itinerary.map((item) => (
                <div key={item.day} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-lg bg-blue-600 text-white font-extrabold text-[11px]">
                      Day {item.day}
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs">{item.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-1">{item.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 mb-3">Customer Reviews & Ratings</h3>

            {packageReviews.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No reviews submitted yet for this package.</p>
            ) : (
              <div className="space-y-3">
                {packageReviews.map((rev) => (
                  <div key={rev.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" /> {rev.customerName}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400" /> {rev.rating}/5
                      </div>
                    </div>
                    <p className="text-slate-600 mt-1">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom CTA */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between gap-4 flex-shrink-0">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Price per traveler</span>
            <span className="text-xl font-black text-blue-700">₹{pkg.priceInr.toLocaleString('en-IN')}</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onBook(pkg);
            }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all"
          >
            <span>Book Tour Package Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
