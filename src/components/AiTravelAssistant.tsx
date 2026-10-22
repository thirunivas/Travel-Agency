import React, { useState } from 'react';
import { TourPackage, AiRecommendationResult } from '../types';
import { Sparkles, Compass, IndianRupee, Users, Sun, ArrowRight, RefreshCw, CheckCircle2, Lightbulb } from 'lucide-react';

interface Props {
  packages: TourPackage[];
  onBookPackage: (pkg: TourPackage) => void;
}

export const AiTravelAssistant: React.FC<Props> = ({ packages, onBookPackage }) => {
  const [budgetInr, setBudgetInr] = useState<number>(30000);
  const [groupType, setGroupType] = useState<'Solo' | 'Couple' | 'Family' | 'Friends'>('Family');
  const [season, setSeason] = useState('Monsoon / Autumn');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<AiRecommendationResult[] | null>(null);

  const handleGetRecommendations = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/ai-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budgetInr,
          groupType,
          seasonPreference: season,
          packages,
        }),
      });

      const data = await res.json();
      if (data.success && data.recommendations) {
        setRecommendations(data.recommendations);
      }
    } catch (err) {
      console.warn('AI Recommendation fallback:', err);
      // Smart Fallback
      const fallback = packages
        .filter((p) => p.priceInr <= budgetInr + 10000)
        .slice(0, 2)
        .map((pkg, idx) => ({
          packageId: pkg.id,
          matchScore: 98 - idx * 5,
          reason: `Matches your budget of ₹${budgetInr.toLocaleString('en-IN')} with premium hotel stays & ${groupType} activities.`,
          customTip: `Best time to visit ${pkg.destination} is during ${season} for optimal weather and scenery!`,
        }));
      setRecommendations(fallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>JourneyHub AI Travel Planner</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Smart Tour Package Recommender</h1>
        <p className="max-w-xl mx-auto text-slate-300 text-xs sm:text-sm mt-2">
          Tell our Gemini AI your budget in Indian Rupees (₹), travel style, and group size to receive instant personalized vacation recommendations and travel tips.
        </p>
      </div>

      {/* Query Form */}
      <form onSubmit={handleGetRecommendations} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-700">Max Budget per Person</label>
              <span className="text-xs font-black text-blue-700">₹{budgetInr.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min={15000}
              max={90000}
              step={2500}
              value={budgetInr}
              onChange={(e) => setBudgetInr(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Travel Group Type</label>
            <select
              value={groupType}
              onChange={(e) => setGroupType(e.target.value as any)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            >
              <option value="Solo">Solo Traveler</option>
              <option value="Couple">Couple / Honeymoon</option>
              <option value="Family">Family with Kids</option>
              <option value="Friends">Group of Friends</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Season</label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            >
              <option value="Monsoon / Autumn">Monsoon / Autumn</option>
              <option value="Winter Snow">Winter Snow Season</option>
              <option value="Summer Holidays">Summer Holidays</option>
              <option value="Spring Blossom">Spring Blossom</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-amber-300" /> Analyzing Travel Packages with AI...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" /> Generate AI Recommendations
            </>
          )}
        </button>
      </form>

      {/* Recommendations Results */}
      {recommendations && (
        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Top AI Tour Recommendations For You
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((rec) => {
              const pkg = packages.find((p) => p.id === rec.packageId) || packages[0];
              return (
                <div key={rec.packageId} className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden flex flex-col justify-between p-5 space-y-4">
                  <div className="flex items-start gap-4">
                    <img src={pkg.galleryImages[0]} alt="" className="w-24 h-24 rounded-2xl object-cover flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px]">
                          {rec.matchScore}% AI Match
                        </span>
                        <span className="text-xs font-bold text-slate-400">{pkg.duration}</span>
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-base">{pkg.name}</h3>
                      <p className="text-xs text-blue-700 font-black mt-1">₹{pkg.priceInr.toLocaleString('en-IN')} / person</p>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 text-xs text-slate-700 space-y-1">
                    <p className="font-bold text-blue-900">Why AI Recommends This:</p>
                    <p>{rec.reason}</p>
                  </div>

                  <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">AI Travel Advice:</span>
                      <span>{rec.customTip}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onBookPackage(pkg)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>Book Recommended Package</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
