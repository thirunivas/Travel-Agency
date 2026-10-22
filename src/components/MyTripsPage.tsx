import React, { useState } from 'react';
import { Booking, UserProfile } from '../types';
import { generateJourneyHubReceiptPDF } from '../utils/pdfGenerator';
import {
  Calendar,
  MapPin,
  Users,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  Compass,
  ArrowRight,
  ShieldCheck,
  Building,
  Car,
  QrCode,
  Plane,
  Train,
  Bus,
  Hotel,
} from 'lucide-react';

interface Props {
  currentUser: UserProfile | null;
  bookings: Booking[];
  onNavigateToPackages: () => void;
  onOpenAuth: () => void;
  onViewDigitalTicket: (booking: Booking) => void;
}

export const MyTripsPage: React.FC<Props> = ({
  currentUser,
  bookings,
  onNavigateToPackages,
  onOpenAuth,
  onViewDigitalTicket,
}) => {
  const [activeTripFilter, setActiveTripFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  // If not logged in, prompt user
  if (!currentUser) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6 animate-in fade-in duration-300">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-[#E5F6FC] dark:bg-slate-800 text-[#087EAB] flex items-center justify-center shadow-sm">
          <Compass className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-[#12304A] dark:text-white">
            Access Your Trips & Itineraries
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            Please log in with your registered account to view your confirmed bookings, digital e-tickets, and travel vouchers.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <button
            onClick={onOpenAuth}
            className="px-6 py-3 rounded-xl bg-[#087EAB] hover:bg-[#12304A] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Sign In to JourneyHub
          </button>
          <button
            onClick={onNavigateToPackages}
            className="px-6 py-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 transition-all cursor-pointer"
          >
            Browse Packages First
          </button>
        </div>
      </div>
    );
  }

  // Filter bookings for user
  const userBookings = bookings.filter((b) => {
    const emailMatch =
      b.customerEmail && b.customerEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim();
    const idMatch = b.customerId && b.customerId === currentUser.id;
    return emailMatch || idMatch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[#087F65] dark:text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-[#FF9B54] text-xs font-bold">
            <Clock className="w-3.5 h-3.5" />
            Processing
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-200 text-red-700 text-xs font-bold">
            <XCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
            {status}
          </span>
        );
    }
  };

  const getTransportIcon = (type?: string) => {
    switch (type) {
      case 'flight':
        return <Plane className="w-4 h-4 text-[#087EAB]" />;
      case 'train':
        return <Train className="w-4 h-4 text-[#FF9B54]" />;
      case 'ksrtc':
        return <Bus className="w-4 h-4 text-[#087F65]" />;
      case 'setc':
      case 'bus':
        return <Bus className="w-4 h-4 text-[#087EAB]" />;
      case 'hotel':
        return <Hotel className="w-4 h-4 text-purple-600" />;
      default:
        return <Compass className="w-4 h-4 text-[#087F65]" />;
    }
  };

  const getDestinationThumbnail = (destination: string) => {
    const d = destination.toLowerCase();
    if (d.includes('kerala') || d.includes('munnar') || d.includes('alleppey') || d.includes('kochi')) {
      return 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=400';
    }
    if (d.includes('tamil') || d.includes('madurai') || d.includes('ooty') || d.includes('chennai') || d.includes('rameswaram')) {
      return 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=400';
    }
    if (d.includes('goa')) {
      return 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=400';
    }
    if (d.includes('rajasthan') || d.includes('jaipur') || d.includes('udaipur')) {
      return 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=400';
    }
    return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400';
  };

  return (
    <div className="bg-[#F4F8FB] dark:bg-[#12304A] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#087EAB] dark:text-[#56C7EA] mb-1">
              <Compass className="w-4 h-4" />
              <span>Customer Trips Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#12304A] dark:text-white">
              My Trips & Digital Tickets
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Review your routes, dates, seat manifests, and verified digital boarding vouchers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToPackages}
              className="px-5 py-2.5 rounded-xl bg-[#087EAB] hover:bg-[#12304A] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Book Another Journey</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Trips Filter Tabs */}
        <div className="flex items-center gap-2">
          {['all', 'upcoming', 'completed'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveTripFilter(filter as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all cursor-pointer ${
                activeTripFilter === filter
                  ? 'bg-[#087EAB] text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200'
              }`}
            >
              {filter} Trips
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {userBookings.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4 max-w-xl mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-[#E5F6FC] text-[#087EAB] flex items-center justify-center mx-auto">
              <Compass className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#12304A] dark:text-white">No Trips Booked Yet</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              You don't have any bookings under <span className="font-semibold text-slate-800 dark:text-slate-200">{currentUser.email}</span> yet.
            </p>
            <button
              onClick={onNavigateToPackages}
              className="mt-2 px-5 py-2.5 rounded-xl bg-[#087EAB] text-white font-bold text-xs shadow-md"
            >
              Explore Packages Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userBookings.map((trip) => (
              <div
                key={trip.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Card Header with Small Destination Image & Status */}
                  <div className="relative h-36 overflow-hidden bg-slate-100">
                    <img
                      src={getDestinationThumbnail(trip.destination)}
                      alt={trip.destination}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-[#12304A] dark:text-white flex items-center gap-1.5 shadow-xs">
                      {getTransportIcon(trip.transportType)}
                      <span>Ref: {trip.pnrNumber || trip.id}</span>
                    </div>

                    <div className="absolute top-3 right-3">
                      {getStatusBadge(trip.bookingStatus)}
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <span className="text-[10px] uppercase font-bold text-sky-200 block">
                        {trip.transportType?.toUpperCase() || 'TOUR'}
                      </span>
                      <h4 className="text-base font-black truncate leading-tight drop-shadow-sm">
                        {trip.packageName}
                      </h4>
                    </div>
                  </div>

                  {/* Trip Metadata */}
                  <div className="p-5 space-y-3 text-xs">
                    <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-[#087EAB] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#12304A] dark:text-white block">Route / Destination</span>
                        <span className="text-[11px] text-slate-500 leading-tight">
                          {trip.routeDetails || trip.destination}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-[#159B72] shrink-0" />
                      <div>
                        <span className="font-bold text-[#12304A] dark:text-white">Travel Date:</span>{' '}
                        <span>{trip.travelDate} {trip.returnDate ? `– ${trip.returnDate}` : ''}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Users className="w-3.5 h-3.5 text-[#FF9B54] shrink-0" />
                      <div>
                        <span className="font-bold text-[#12304A] dark:text-white">Passengers:</span>{' '}
                        <span>{trip.adults} Adult(s) {trip.children > 0 ? `, ${trip.children} Child` : ''}</span>
                      </div>
                    </div>

                    {trip.seatNumbers && trip.seatNumbers.length > 0 && (
                      <div className="p-2 rounded-xl bg-[#E5F6FC] dark:bg-slate-800 text-[11px] text-[#087EAB] font-bold">
                        Seats / Berth: {trip.seatNumbers.join(', ')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer with Price and Actions */}
                <div className="p-5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Fare</span>
                    <span className="text-base font-black text-[#087EAB] dark:text-[#56C7EA]">
                      ₹{(trip.grandTotalInr || trip.amountPaidInr).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewDigitalTicket(trip)}
                      className="px-3 py-2 rounded-xl bg-[#087EAB] hover:bg-[#12304A] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      title="View Digital Ticket / Boarding Pass"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Digital Ticket</span>
                    </button>

                    <button
                      onClick={() => generateJourneyHubReceiptPDF(trip)}
                      className="p-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all shadow-xs cursor-pointer"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
