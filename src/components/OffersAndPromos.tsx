import React from 'react';
import { Offer } from '../types';
import { Tag, Copy, Sparkles, CheckCircle2 } from 'lucide-react';

interface Props {
  offers: Offer[];
}

export const OffersAndPromos: React.FC<Props> = ({ offers }) => {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-8 rounded-3xl shadow-xl">
        <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Tag className="w-4 h-4" />
          <span>Exclusive JourneyHub Discounts</span>
        </div>
        <h1 className="text-3xl font-black">Special Tour Offers & Promo Codes</h1>
        <p className="text-xs text-blue-100/80 mt-1 max-w-xl">
          Apply these promo codes during booking checkout to save up to 20% on all domestic and international holiday packages!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all relative overflow-hidden flex flex-col justify-between space-y-4"
          >
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-[10px] font-black uppercase rounded-full">
                  {offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} FLAT OFF`}
                </span>
                <span className="text-[10px] text-slate-400 font-bold">Valid till {offer.validTill}</span>
              </div>

              <h3 className="font-extrabold text-slate-900 text-lg">{offer.title}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{offer.description}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Use Code</span>
                <span className="text-sm font-mono font-black text-blue-700 tracking-wider">{offer.code}</span>
              </div>

              <button
                onClick={() => handleCopy(offer.code)}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition-colors"
              >
                {copiedCode === offer.code ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Code
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
