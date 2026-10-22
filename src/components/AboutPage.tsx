import React from 'react';
import {
  Compass,
  ShieldCheck,
  Award,
  Users,
  HeartHandshake,
  CheckCircle2,
  Hotel,
  Calendar,
  PhoneCall,
  MapPin,
  ArrowRight,
} from 'lucide-react';

interface Props {
  onNavigateToPackages: () => void;
  onNavigateToContact: () => void;
}

export const AboutPage: React.FC<Props> = ({
  onNavigateToPackages,
  onNavigateToContact,
}) => {
  const values = [
    {
      title: 'Experienced Travel Planning',
      desc: 'Our team of seasoned travel consultants brings over a decade of firsthand destination knowledge to curate balanced, immersive itineraries.',
      icon: Compass,
    },
    {
      title: 'Handpicked Holiday Packages',
      desc: 'Every tour package is individually vetted—from heritage houseboat stays in Kerala to desert safaris in Rajasthan—ensuring genuine memories.',
      icon: Award,
    },
    {
      title: 'Trusted Accommodation Partners',
      desc: 'We partner exclusively with verified 4-star, 5-star, and boutique properties prioritizing comfort, hygiene, and authentic local hospitality.',
      icon: Hotel,
    },
    {
      title: 'Flexible & Paced Itineraries',
      desc: 'No rushed schedules or mandatory tourist traps. Our journeys offer flexible pacing with private vehicles and dedicated drivers.',
      icon: Calendar,
    },
    {
      title: 'Dedicated Customer Support',
      desc: 'From initial holiday inquiry to your flight home, our 24/7 travel desk and local coordinators stand ready to assist your journey.',
      icon: PhoneCall,
    },
    {
      title: 'Transparent & Fair Pricing',
      desc: 'Clear INR (₹) rates with all taxes, permits, and transfers included upfront. Zero hidden costs or surprise surcharges.',
      icon: ShieldCheck,
    },
  ];

  const milestones = [
    { label: '50,000+', desc: 'Happy Travellers' },
    { label: '120+', desc: 'Curated Itineraries' },
    { label: '99.4%', desc: 'Guest Satisfaction Rate' },
    { label: '8+ Years', desc: 'Destination Expertise' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-in fade-in duration-300">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white p-8 sm:p-14 shadow-xl">
        <img
          src="https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&q=80&w=1600"
          alt="Coorg Coffee Plantations & Hills"
          className="absolute inset-0 w-full h-full object-cover opacity-65"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-700/80 text-emerald-100 text-xs font-bold tracking-wider uppercase backdrop-blur-xs">
            <Compass className="w-3.5 h-3.5" />
            About JourneyHub Travel Agency
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Travel With Confidence
          </h1>
          <p className="text-sm sm:text-lg text-slate-200 leading-relaxed font-light">
            JourneyHub is a premier travel agency dedicated to helping families, honeymooners, and adventurers discover enchanting destinations, compare thoughtful packages, and craft lifelong holiday memories.
          </p>
        </div>
      </div>

      {/* Our Mission & Values */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Our Promise
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Why Thousands of Travellers Trust Us
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            We believe travel should be effortless, authentic, and rejuvenating. Here is how we make that happen for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{v.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Agency Track Record Stats */}
      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 sm:p-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {milestones.map((m, idx) => (
            <div key={idx} className="space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white block">
                {m.label}
              </span>
              <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
                {m.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Call to action */}
      <div className="p-8 sm:p-12 rounded-3xl bg-emerald-800 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-2xl font-bold">Ready to Start Planning?</h3>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-md">
            Speak with our travel coordinators or browse our latest seasonal holiday packages.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onNavigateToPackages}
            className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs transition-all shadow-md"
          >
            Browse Tour Packages
          </button>
          <button
            onClick={onNavigateToContact}
            className="px-6 py-3 rounded-xl bg-emerald-900/60 hover:bg-emerald-900 text-white font-bold text-xs border border-emerald-600 transition-all"
          >
            Contact Travel Desk
          </button>
        </div>
      </div>
    </div>
  );
};
