import React, { useState } from 'react';
import { BusItem, UserProfile, Booking } from '../types';
import { INITIAL_BUSES } from '../data/mockData';
import { SeatSelectionModal } from './SeatSelectionModal';
import {
  Bus,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Sparkles,
  Search,
} from 'lucide-react';

interface Props {
  currentUser: UserProfile | null;
  onBookBusSuccess: (booking: Booking) => void;
  onOpenAuth: () => void;
}

export const KsrtcBookingView: React.FC<Props> = ({
  currentUser,
  onBookBusSuccess,
}) => {
  const ksrtcServices = INITIAL_BUSES.filter((b) => b.operatorType === 'KSRTC');

  const [fromCity, setFromCity] = useState('Kochi');
  const [toCity, setToCity] = useState('Munnar');
  const [journeyDate, setJourneyDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [passengers, setPassengers] = useState(2);

  // Booking Flow State
  const [selectedBus, setSelectedBus] = useState<BusItem | null>(null);
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3 | 4>(1); // 1: passenger details, 2: seat selection, 3: review & payment, 4: confirmation
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<string[]>(['12 (Window)', '13 (Aisle)']);
  const [passengerName, setPassengerName] = useState(currentUser?.name || '');
  const [passengerEmail, setPassengerEmail] = useState(currentUser?.email || '');
  const [passengerPhone, setPassengerPhone] = useState(currentUser?.phone || '+91 98450 12345');
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  // Filter based on route
  const filteredBuses = ksrtcServices.filter((b) => {
    const matchFrom = !fromCity || b.fromCity.toLowerCase().includes(fromCity.toLowerCase());
    const matchTo = !toCity || b.toCity.toLowerCase().includes(toCity.toLowerCase());
    return matchFrom && matchTo;
  });

  const handleSelectBus = (bus: BusItem) => {
    setSelectedBus(bus);
    setBookingStep(1);
    setSelectedSeats(['14 (Window)', '15 (Aisle)'].slice(0, passengers));
    setPassengerName(currentUser?.name || 'Anoop Menon');
    setPassengerEmail(currentUser?.email || 'anoop.menon@example.com');
    setPassengerPhone(currentUser?.phone || '+91 94470 12345');
  };

  const handleCompletePayment = () => {
    if (!selectedBus) return;
    const baseFare = selectedBus.fareInr * passengers;
    const taxes = Math.round(baseFare * 0.05);
    const grandTotal = baseFare + taxes;
    const pnr = `KSRTC-KL-${Math.floor(100000 + Math.random() * 900000)}`;

    const newBooking: Booking = {
      id: `JH-BK-${Date.now().toString().slice(-6)}`,
      customerId: currentUser?.id || 'guest-ksrtc-user',
      customerName: passengerName,
      customerEmail: passengerEmail,
      customerPhone: passengerPhone,
      packageId: selectedBus.id,
      packageName: `KSRTC ${selectedBus.busType} (${selectedBus.fromCity} → ${selectedBus.toCity})`,
      destination: `${selectedBus.toCity}, Kerala`,
      hotel: 'KSRTC Express Bus - No Hotel',
      transport: `${selectedBus.operator} (${selectedBus.busType})`,
      transportType: 'ksrtc',
      pnrNumber: pnr,
      seatNumbers: selectedSeats.length > 0 ? selectedSeats : ['12 (Window)', '13 (Aisle)'],
      routeDetails: `${selectedBus.fromCity} KSRTC Stand → ${selectedBus.toCity} Bus Stand (via ${selectedBus.routeVia || 'Direct Highway'})`,
      travelDate: journeyDate,
      returnDate: '',
      pickupLocation: `${selectedBus.fromCity} KSRTC Stand`,
      dropLocation: `${selectedBus.toCity} KSRTC Stand`,
      adults: passengers,
      children: 0,
      specialRequests: 'KSRTC Online Booking. Window seats assigned.',
      bookingStatus: 'confirmed',
      paymentStatus: 'paid',
      amountPaidInr: baseFare,
      gstInr: taxes,
      discountInr: 0,
      grandTotalInr: grandTotal,
      paymentMethod: 'UPI',
      paymentId: `PAY-KSRTC-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      confirmedAt: new Date().toISOString(),
    };

    setCreatedBooking(newBooking);
    onBookBusSuccess(newBooking);
    setBookingStep(4);
  };

  return (
    <div className="bg-[#DFF7EE]/30 dark:bg-[#12304A] min-h-screen pb-20 animate-in fade-in duration-300">
      {/* 1. Introductory Banner: Green Western Ghats, winding roads, Kerala countryside, scenic bus journey */}
      <section className="relative h-64 sm:h-76 overflow-hidden bg-[#087F65] text-white">
        <img
          src="https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=2000"
          alt="Green Western Ghats and winding Kerala road"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#087F65] via-[#087F65]/70 to-[#087F65]/40" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#159B72]/90 text-white text-xs font-bold backdrop-blur-md mb-3 w-fit border border-emerald-400/40">
            <Bus className="w-3.5 h-3.5" />
            <span>KSRTC Kerala Official Booking Portal</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Explore Kerala by Road
          </h1>
          <p className="text-xs sm:text-sm text-emerald-50 mt-2 max-w-xl leading-relaxed">
            Discover Kerala with convenient bus journeys between cities, towns, and tourist destinations.
          </p>
        </div>
      </section>

      {/* 2. Proper Working Booking Form */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 space-y-8">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-xl border border-emerald-100 dark:border-slate-800"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
            <div>
              <label className="block text-[11px] font-bold text-[#087F65] uppercase tracking-wider mb-1">
                From
              </label>
              <input
                type="text"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                placeholder="e.g. Kochi, Trivandrum"
                className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#087F65]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#087F65] uppercase tracking-wider mb-1">
                To
              </label>
              <input
                type="text"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                placeholder="e.g. Munnar, Kozhikode"
                className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#087F65]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#087F65] uppercase tracking-wider mb-1">
                Journey Date
              </label>
              <input
                type="date"
                value={journeyDate}
                onChange={(e) => setJourneyDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#087F65]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#087F65] uppercase tracking-wider mb-1">
                Passengers
              </label>
              <select
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#087F65]"
              >
                <option value={1}>1 Passenger</option>
                <option value={2}>2 Passengers</option>
                <option value={3}>3 Passengers</option>
                <option value={4}>4 Passengers</option>
              </select>
            </div>

            <div>
              <button
                type="button"
                className="w-full py-2.5 bg-[#087F65] hover:bg-[#159B72] text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Search className="w-4 h-4" /> Search KSRTC Buses
              </button>
            </div>
          </div>
        </form>

        {/* 3. Bus Result Cards (kept white for readability, emerald green highlights) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#087F65] dark:text-white flex items-center gap-2">
              <Bus className="w-5 h-5 text-[#159B72]" /> KSRTC Services ({filteredBuses.length})
            </h2>
            <span className="text-xs text-slate-500">
              Government of Kerala Road Transport Corporation
            </span>
          </div>

          {filteredBuses.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                No KSRTC buses found for "{fromCity}" to "{toCity}".
              </p>
              <button
                onClick={() => {
                  setFromCity('');
                  setToCity('');
                }}
                className="px-4 py-2 rounded-xl bg-[#087F65] text-white text-xs font-bold"
              >
                Show All Kerala Routes
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBuses.map((bus) => (
                <div
                  key={bus.id}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  {/* Bus details */}
                  <div className="space-y-1.5 min-w-[220px]">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#DFF7EE] text-[#087F65] text-[10px] font-black uppercase tracking-wider">
                        {bus.operator}
                      </span>
                      <span className="text-xs font-bold text-amber-500">★ {bus.rating}</span>
                    </div>
                    <h4 className="text-base font-extrabold text-[#12304A] dark:text-white">
                      {bus.busType}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#159B72]" /> Via: {bus.routeVia}
                    </p>
                  </div>

                  {/* Timing & Duration */}
                  <div className="flex items-center justify-between gap-6 flex-1 max-w-sm">
                    <div className="text-left">
                      <span className="text-lg font-black text-[#12304A] dark:text-white">
                        {bus.departureTime}
                      </span>
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                        {bus.fromCity}
                      </p>
                    </div>

                    <div className="flex-1 flex flex-col items-center px-2">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" /> {bus.duration}
                      </span>
                      <div className="w-full flex items-center gap-1 my-1">
                        <div className="w-2 h-2 rounded-full bg-[#087F65]" />
                        <div className="flex-1 border-t border-slate-300 dark:border-slate-700" />
                        <Bus className="w-3.5 h-3.5 text-[#087F65]" />
                        <div className="flex-1 border-t border-slate-300 dark:border-slate-700" />
                        <div className="w-2 h-2 rounded-full bg-[#159B72]" />
                      </div>
                      <span className="text-[10px] text-[#087F65] font-bold">Kerala Highway</span>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-black text-[#12304A] dark:text-white">
                        {bus.arrivalTime}
                      </span>
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                        {bus.toCity}
                      </p>
                    </div>
                  </div>

                  {/* Fare & Select Bus Button */}
                  <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="text-left md:text-right">
                      <div className="text-xl font-black text-[#087F65]">
                        ₹{bus.fareInr.toLocaleString('en-IN')}
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        {bus.availableSeats} demo seats available
                      </span>
                    </div>

                    <button
                      onClick={() => handleSelectBus(bus)}
                      className="px-6 py-2.5 rounded-xl bg-[#087F65] hover:bg-[#159B72] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Select Bus</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Complete Booking Flow Modal */}
      {selectedBus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]">
            <div className="px-6 py-4 bg-[#087F65] text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Bus className="w-4 h-4" /> KSRTC Ticket Booking
                </h3>
                <p className="text-xs text-emerald-100">
                  {selectedBus.busType} • {selectedBus.fromCity} → {selectedBus.toCity}
                </p>
              </div>
              <button
                onClick={() => setSelectedBus(null)}
                className="text-white/80 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Step Progress */}
            <div className="px-6 py-3 bg-[#DFF7EE] dark:bg-slate-800 border-b border-emerald-100 dark:border-slate-700 flex items-center justify-between text-xs">
              <span className={`font-bold ${bookingStep === 1 ? 'text-[#087F65]' : 'text-slate-500'}`}>
                1. Passenger Info
              </span>
              <span>→</span>
              <span className={`font-bold ${bookingStep === 2 ? 'text-[#087F65]' : 'text-slate-500'}`}>
                2. Seat Layout
              </span>
              <span>→</span>
              <span className={`font-bold ${bookingStep === 3 ? 'text-[#087F65]' : 'text-slate-500'}`}>
                3. Review & Payment
              </span>
              <span>→</span>
              <span className={`font-bold ${bookingStep === 4 ? 'text-[#087F65]' : 'text-slate-500'}`}>
                4. Confirmation
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* STEP 1 */}
              {bookingStep === 1 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Primary Passenger Info
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-500 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-500 mb-1">Mobile (for KSRTC m-Ticket)</label>
                      <input
                        type="text"
                        value={passengerPhone}
                        onChange={(e) => setPassengerPhone(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-500 mb-1">Email ID</label>
                      <input
                        type="email"
                        value={passengerEmail}
                        onChange={(e) => setPassengerEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => setBookingStep(2)}
                      className="px-6 py-2.5 rounded-xl bg-[#087F65] text-white text-xs font-bold shadow-md hover:bg-[#159B72]"
                    >
                      Select Seats →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: SEATS */}
              {bookingStep === 2 && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-[#DFF7EE] dark:bg-slate-800 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#087F65]">Interactive Bus Seat Layout</span>
                      <p className="text-slate-600 dark:text-slate-300">
                        Select {passengers} seat(s) on the KSRTC 2+2 layout.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsSeatModalOpen(true)}
                      className="px-4 py-2 bg-[#087F65] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Open Bus Seat Grid
                    </button>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                    <span className="text-slate-400 font-bold block">Assigned Seats</span>
                    <p className="text-sm font-extrabold text-[#087F65] dark:text-white">
                      {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Seats 14, 15'}
                    </p>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => setBookingStep(1)}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => setBookingStep(3)}
                      className="px-6 py-2.5 rounded-xl bg-[#087F65] text-white text-xs font-bold shadow-md hover:bg-[#159B72]"
                    >
                      Review & Pay →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: REVIEW & PAYMENT */}
              {bookingStep === 3 && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 space-y-2">
                    <div className="flex justify-between font-bold">
                      <span>KSRTC Base Fare ({passengers} Passengers):</span>
                      <span>₹{(selectedBus.fareInr * passengers).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Kerala State Transport Cess & GST:</span>
                      <span>₹{Math.round(selectedBus.fareInr * passengers * 0.05).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="pt-2 border-t flex justify-between text-base font-black text-[#087F65]">
                      <span>Grand Total:</span>
                      <span>₹{Math.round(selectedBus.fareInr * passengers * 1.05).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-amber-200 bg-[#FFF5E8] text-[#203447] text-xs">
                    <p className="font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#159B72]" /> Prototype Payment
                    </p>
                    <p className="text-[11px] mt-0.5">Demo Payment – No real money will be charged.</p>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => setBookingStep(2)}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleCompletePayment}
                      className="px-6 py-2.5 rounded-xl bg-[#087F65] hover:bg-[#159B72] text-white text-xs font-bold shadow-md"
                    >
                      Confirm KSRTC Booking (₹{Math.round(selectedBus.fareInr * passengers * 1.05).toLocaleString('en-IN')})
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: CONFIRMATION */}
              {bookingStep === 4 && createdBooking && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#087F65] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#087F65] dark:text-white">
                      KSRTC Ticket Confirmed!
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      PNR: <span className="font-mono font-bold text-[#087F65]">{createdBooking.pnrNumber}</span>
                    </p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                      Seats: {createdBooking.seatNumbers?.join(', ')}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedBus(null)}
                    className="px-6 py-2.5 rounded-xl bg-[#087F65] text-white text-xs font-bold shadow-md"
                  >
                    Done / Return to KSRTC
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Seat Selection Modal */}
      {selectedBus && (
        <SeatSelectionModal
          isOpen={isSeatModalOpen}
          onClose={() => setIsSeatModalOpen(false)}
          serviceTitle={`KSRTC ${selectedBus.busType}`}
          serviceType="bus"
          passengerCount={passengers}
          baseFareInr={selectedBus.fareInr}
          onConfirmSeats={(seats) => {
            setSelectedSeats(seats);
          }}
        />
      )}
    </div>
  );
};
