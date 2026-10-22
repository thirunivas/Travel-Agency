import React, { useState } from 'react';
import { Booking, TourPackage } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  CircleDot,
  ArrowRight,
  Compass,
  Sparkles,
  Hotel,
  Car,
  Utensils,
  Plane,
  ChevronDown,
  ChevronUp,
  Download,
  Share2,
  Info,
  ShieldCheck,
  AlertCircle,
  Camera,
  Navigation,
} from 'lucide-react';
import { generateJourneyHubInvoicePdf } from '../utils/pdfGenerator';

interface Props {
  booking?: Booking | null;
  allBookings?: Booking[];
  packages?: TourPackage[];
  onSelectBooking?: (booking: Booking) => void;
  onOpenAiForDay?: (dayNum: number, dayTitle: string, packageName: string) => void;
}

export type RoadmapMilestoneStatus = 'completed' | 'current' | 'upcoming';

interface EnrichedDayPlan {
  day: number;
  title: string;
  details: string;
  timeSlot?: string;
  location?: string;
  status: RoadmapMilestoneStatus;
  hotelInfo?: string;
  transportInfo?: string;
  meals?: string;
  activityType: 'transfer' | 'sightseeing' | 'adventure' | 'relaxation' | 'departure';
}

export const JourneyRoadmap: React.FC<Props> = ({
  booking,
  allBookings = [],
  packages = [],
  onSelectBooking,
  onOpenAiForDay,
}) => {
  // Selected booking state (if not passed directly or if user wants to switch)
  const [activeBookingId, setActiveBookingId] = useState<string>(
    booking ? booking.id : allBookings[0]?.id || ''
  );
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'current' | 'upcoming'>('all');

  const currentBooking =
    allBookings.find((b) => b.id === activeBookingId) ||
    booking ||
    allBookings[0];

  const matchedPackage = currentBooking
    ? packages.find((p) => p.id === currentBooking.packageId || p.name === currentBooking.packageName) ||
      packages[0]
    : packages[0];

  // Calculate chronological status for each itinerary day based on travel date
  const computeEnrichedItinerary = (): EnrichedDayPlan[] => {
    if (!matchedPackage?.itinerary || matchedPackage.itinerary.length === 0) {
      return [
        {
          day: 1,
          title: 'Arrival & Welcome Briefing',
          details: 'Airport pickup, transfer to resort, and tour welcome orientation.',
          status: 'completed',
          timeSlot: '09:00 AM - 06:00 PM',
          location: currentBooking?.destination || 'Destination Hub',
          hotelInfo: currentBooking?.hotel || 'Luxury Partner Hotel',
          transportInfo: currentBooking?.transport || 'Private AC Vehicle',
          meals: 'Welcome Refreshments & Dinner',
          activityType: 'transfer',
        },
        {
          day: 2,
          title: 'Guided Sightseeing & Exploration',
          details: 'Full day escorted excursion to major scenic viewpoints and cultural spots.',
          status: 'current',
          timeSlot: '08:30 AM - 05:30 PM',
          location: currentBooking?.destination || 'Destination Hub',
          hotelInfo: currentBooking?.hotel || 'Luxury Partner Hotel',
          transportInfo: currentBooking?.transport || 'Private AC Vehicle',
          meals: 'Breakfast & Local Lunch',
          activityType: 'sightseeing',
        },
        {
          day: 3,
          title: 'Leisure, Souvenirs & Farewell Dinner',
          details: 'Free morning for local crafts shopping and evening farewell dinner.',
          status: 'upcoming',
          timeSlot: '10:00 AM - 08:00 PM',
          location: currentBooking?.destination || 'Destination Hub',
          hotelInfo: currentBooking?.hotel || 'Luxury Partner Hotel',
          transportInfo: currentBooking?.transport || 'Private AC Vehicle',
          meals: 'Gourmet Farewell Dinner',
          activityType: 'departure',
        },
      ];
    }

    const totalDays = matchedPackage.itinerary.length;
    // For demo purposes, we can determine status gracefully:
    // If booking status is confirmed: Day 1 is completed, Day 2 is current, subsequent days are upcoming
    // If booking is completed: All days completed
    return matchedPackage.itinerary.map((item, idx) => {
      let status: RoadmapMilestoneStatus = 'upcoming';

      if (currentBooking?.bookingStatus === 'completed') {
        status = 'completed';
      } else if (idx === 0) {
        status = 'completed';
      } else if (idx === 1) {
        status = 'current';
      } else {
        status = 'upcoming';
      }

      // Infer activity type
      let activityType: EnrichedDayPlan['activityType'] = 'sightseeing';
      const textLower = (item.title + ' ' + item.details).toLowerCase();
      if (idx === 0 || textLower.includes('arrival') || textLower.includes('airport') || textLower.includes('transfer')) {
        activityType = 'transfer';
      } else if (idx === totalDays - 1 || textLower.includes('departure') || textLower.includes('farewell')) {
        activityType = 'departure';
      } else if (textLower.includes('expedition') || textLower.includes('gondola') || textLower.includes('water sports') || textLower.includes('trek')) {
        activityType = 'adventure';
      } else if (textLower.includes('spa') || textLower.includes('leisure') || textLower.includes('cruise') || textLower.includes('beach')) {
        activityType = 'relaxation';
      }

      // Assign time slot simulation
      const timeSlots = [
        '09:00 AM - Check-in & Scenic Sunset Cruise',
        '08:30 AM - Morning Heritage Walk & Viewpoints',
        '09:30 AM - Adventure Excursion & Summit Ascent',
        '10:00 AM - Cultural Village & Artisan Markets',
        '11:00 AM - Nature Reserve & Wildlife Trail',
        '08:00 AM - Breakfast & Airport Departure',
      ];

      return {
        day: item.day,
        title: item.title,
        details: item.details,
        status,
        timeSlot: timeSlots[idx % timeSlots.length],
        location: matchedPackage.destination,
        hotelInfo: matchedPackage.hotel,
        transportInfo: matchedPackage.transport,
        meals: matchedPackage.mealsIncluded,
        activityType,
      };
    });
  };

  const enrichedItinerary = computeEnrichedItinerary();

  const filteredDays = enrichedItinerary.filter((dayPlan) => {
    if (statusFilter === 'all') return true;
    return dayPlan.status === statusFilter;
  });

  const completedCount = enrichedItinerary.filter((d) => d.status === 'completed').length;
  const currentCount = enrichedItinerary.filter((d) => d.status === 'current').length;
  const upcomingCount = enrichedItinerary.filter((d) => d.status === 'upcoming').length;
  const progressPercent = Math.round(
    ((completedCount + (currentCount > 0 ? 0.5 : 0)) / enrichedItinerary.length) * 100
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
      {/* Header & Meta */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">
            <Compass className="w-4 h-4 text-blue-600 animate-spin-slow" />
            <span>Interactive Itinerary Tracker</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-[10px] font-extrabold uppercase">
              Live Roadmap
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Journey Roadmap & Milestone Tracker
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Chronological step-by-step itinerary with real-time status markers and smart concierge tips.
          </p>
        </div>

        {/* Trip Switcher (if multiple bookings) */}
        {allBookings.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Trip:</span>
            <select
              value={activeBookingId}
              onChange={(e) => {
                setActiveBookingId(e.target.value);
                const chosen = allBookings.find((b) => b.id === e.target.value);
                if (chosen && onSelectBooking) onSelectBooking(chosen);
              }}
              className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              {allBookings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.packageName} ({b.id})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Trip Snapshot Banner */}
      {currentBooking && (
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50/40 to-slate-50 dark:from-slate-800/80 dark:via-slate-800/40 dark:to-slate-900/60 p-4 sm:p-5 rounded-2xl border border-blue-100 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                {currentBooking.id}
              </span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                {currentBooking.destination}
              </span>
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
              {currentBooking.packageName}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>
                Travel Date: <strong>{currentBooking.travelDate}</strong>
              </span>
              <span>•</span>
              <span>{currentBooking.adults} Travelers</span>
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => generateJourneyHubInvoicePdf(currentBooking)}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" /> Itinerary PDF
            </button>
          </div>
        </div>
      )}

      {/* Progress Bar & Status Marker Legend */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300">
            Roadmap Progress ({progressPercent}% Completed)
          </span>
          <span className="text-slate-500 font-semibold">
            {completedCount} of {enrichedItinerary.length} Milestones Cleared
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-600 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Status Filters & Marker Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            All Milestones ({enrichedItinerary.length})
          </button>

          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'completed'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed ({completedCount})
          </button>

          <button
            onClick={() => setStatusFilter('current')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'current'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
            }`}
          >
            <CircleDot className="w-3.5 h-3.5 animate-pulse" /> Active / Today ({currentCount})
          </button>

          <button
            onClick={() => setStatusFilter('upcoming')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'upcoming'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> Upcoming ({upcomingCount})
          </button>
        </div>
      </div>

      {/* Chronological Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {filteredDays.map((dayPlan) => {
          const isExpanded = expandedDay === dayPlan.day;
          const isCompleted = dayPlan.status === 'completed';
          const isCurrent = dayPlan.status === 'current';
          const isUpcoming = dayPlan.status === 'upcoming';

          return (
            <div key={dayPlan.day} className="relative group">
              {/* Status Marker Pin Icon on the timeline axis */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border-2 shadow-xs transition-transform group-hover:scale-110 ${
                  isCompleted
                    ? 'bg-emerald-500 border-white dark:border-slate-900 text-white'
                    : isCurrent
                    ? 'bg-blue-600 border-blue-200 dark:border-blue-400 text-white animate-bounce-short'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : isCurrent ? (
                  <CircleDot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <span className="text-[10px] font-black">{dayPlan.day}</span>
                )}
              </div>

              {/* Milestone Card */}
              <div
                className={`rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-800/80 shadow-md ring-1 ring-blue-400/30'
                    : isCompleted
                    ? 'bg-white dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-800'
                    : 'bg-white dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800/80 opacity-90'
                }`}
              >
                {/* Header row with click to expand */}
                <div
                  onClick={() => setExpandedDay(isExpanded ? null : dayPlan.day)}
                  className="p-4 sm:p-5 cursor-pointer flex items-center justify-between gap-3 select-none"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-black tracking-wider">
                        DAY {dayPlan.day}
                      </span>

                      {/* Status Marker Badge */}
                      {isCompleted && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </span>
                      )}
                      {isCurrent && (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                          In Progress / Today
                        </span>
                      )}
                      {isUpcoming && (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
                          Upcoming Milestone
                        </span>
                      )}

                      {/* Estimated time */}
                      {dayPlan.timeSlot && (
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1 ml-auto sm:ml-0">
                          <Clock className="w-3 h-3" /> {dayPlan.timeSlot}
                        </span>
                      )}
                    </div>

                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                      {dayPlan.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800/80 space-y-4 animate-in fade-in duration-200">
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {dayPlan.details}
                    </p>

                    {/* Meta Highlights Grid (Hotel, Transport, Meals) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                        <div className="text-slate-400 font-bold flex items-center gap-1 text-[10px] uppercase">
                          <Hotel className="w-3 h-3 text-blue-500" /> Accommodation
                        </div>
                        <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                          {dayPlan.hotelInfo || '5-Star Luxury Resort'}
                        </p>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                        <div className="text-slate-400 font-bold flex items-center gap-1 text-[10px] uppercase">
                          <Car className="w-3 h-3 text-indigo-500" /> Transport & Transfers
                        </div>
                        <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                          {dayPlan.transportInfo || 'Private AC SUV'}
                        </p>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                        <div className="text-slate-400 font-bold flex items-center gap-1 text-[10px] uppercase">
                          <Utensils className="w-3 h-3 text-amber-500" /> Dining Plan
                        </div>
                        <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                          {dayPlan.meals || 'Breakfast & Dinner'}
                        </p>
                      </div>
                    </div>

                    {/* AI Smart Concierge Tip for this day */}
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/30 p-3.5 rounded-xl border border-indigo-100 dark:border-indigo-900/50 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <p className="text-[11px] font-bold text-indigo-900 dark:text-indigo-300">
                            Smart Travel Concierge Tip
                          </p>
                          <p className="text-xs text-indigo-800/90 dark:text-indigo-200/90">
                            {dayPlan.activityType === 'adventure'
                              ? 'Wear warm layers and comfortable hiking shoes. Bring camera batteries as cold reduces battery life.'
                              : dayPlan.activityType === 'transfer'
                              ? 'Keep your JourneyHub booking voucher and photo ID readily accessible at the checkpoint.'
                              : 'Recommended photography golden hour is 05:30 PM for spectacular panoramic shots.'}
                          </p>
                        </div>
                      </div>

                      {onOpenAiForDay && (
                        <button
                          onClick={() =>
                            onOpenAiForDay(
                              dayPlan.day,
                              dayPlan.title,
                              currentBooking?.packageName || matchedPackage.name
                            )
                          }
                          className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] flex-shrink-0 flex items-center gap-1 transition-all shadow-xs"
                        >
                          <Sparkles className="w-3 h-3 text-amber-300" /> Ask AI
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
