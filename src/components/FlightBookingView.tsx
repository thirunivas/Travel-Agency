import React, { useState } from 'react';
import { FlightItem, UserProfile, Booking } from '../types';
import { INITIAL_FLIGHTS } from '../data/mockData';
import { SeatSelectionModal } from './SeatSelectionModal';
import {
  Plane,
  Calendar,
  Users,
  Search,
  ArrowRight,
  ShieldCheck,
  Luggage,
  Clock,
  CheckCircle2,
  CreditCard,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface Props {
  currentUser: UserProfile | null;
  onBookFlightSuccess: (booking: Booking) => void;
  onOpenAuth: () => void;
}

export const FlightBookingView: React.FC<Props> = ({
  currentUser,
  onBookFlightSuccess,
  onOpenAuth,
}) => {
  const [flights] = useState<FlightItem[]>(INITIAL_FLIGHTS);
  const [fromCity, setFromCity] = useState('Delhi');
  const [toCity, setToCity] = useState('Kochi');
  const [travelDate, setTravelDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState('Economy');

  // Booking Flow State
  const [selectedFlight, setSelectedFlight] = useState<FlightItem | null>(null);
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3 | 4>(1); // 1: passenger details, 2: seat selection, 3: review & payment, 4: confirmed
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [passengerName, setPassengerName] = useState(currentUser?.name || '');
  const [passengerEmail, setPassengerEmail] = useState(currentUser?.email || '');
  const [passengerPhone, setPassengerPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card'>('UPI');
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  // Filter flights by selected routes
  const filteredFlights = flights.filter((f) => {
    const matchFrom = !fromCity || f.fromCity.toLowerCase().includes(fromCity.toLowerCase()) || f.fromCode.toLowerCase().includes(fromCity.toLowerCase());
    const matchTo = !toCity || f.toCity.toLowerCase().includes(toCity.toLowerCase()) || f.toCode.toLowerCase().includes(toCity.toLowerCase());
    return matchFrom && matchTo;
  });

  const handleStartBooking = (flight: FlightItem) => {
    setSelectedFlight(flight);
    setBookingStep(1);
    setSelectedSeats([]);
    setPassengerName(currentUser?.name || 'Rahul Sharma');
    setPassengerEmail(currentUser?.email || 'rahul.sharma@example.com');
    setPassengerPhone(currentUser?.phone || '+91 98765 43210');
  };

  const handleCompletePayment = () => {
    if (!selectedFlight) return;
    const baseFare = selectedFlight.priceInr * passengers;
    const taxes = Math.round(baseFare * 0.05);
    const grandTotal = baseFare + taxes;
    const pnr = `JH-FL-${Math.floor(100000 + Math.random() * 900000)}`;

    const newBooking: Booking = {
      id: `JH-BK-${Date.now().toString().slice(-6)}`,
      customerId: currentUser?.id || 'guest-flyer',
      customerName: passengerName,
      customerEmail: passengerEmail,
      customerPhone: passengerPhone,
      packageId: selectedFlight.id,
      packageName: `${selectedFlight.airline} Flight ${selectedFlight.flightNumber} (${selectedFlight.fromCode} → ${selectedFlight.toCode})`,
      destination: `${selectedFlight.toCity} (${selectedFlight.toCode})`,
      hotel: 'Flight Booking - No Hotel',
      transport: `${selectedFlight.airline} (${selectedFlight.seatClass})`,
      transportType: 'flight',
      pnrNumber: pnr,
      seatNumbers: selectedSeats.length > 0 ? selectedSeats : ['12A (Window)'],
      routeDetails: `${selectedFlight.fromCity} (${selectedFlight.fromCode}) → ${selectedFlight.toCity} (${selectedFlight.toCode})`,
      travelDate: travelDate,
      returnDate: '',
      pickupLocation: `${selectedFlight.fromCity} Airport (${selectedFlight.fromCode})`,
      dropLocation: `${selectedFlight.toCity} Airport (${selectedFlight.toCode})`,
      adults: passengers,
      children: 0,
      specialRequests: `${cabinClass} Class Booking. Window/Aisle Preference.`,
      bookingStatus: 'confirmed',
      paymentStatus: 'paid',
      amountPaidInr: baseFare,
      gstInr: taxes,
      discountInr: 0,
      grandTotalInr: grandTotal,
      paymentMethod: paymentMethod === 'UPI' ? 'UPI' : 'Credit Card',
      paymentId: `PAY-FL-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      confirmedAt: new Date().toISOString(),
    };

    setCreatedBooking(newBooking);
    onBookFlightSuccess(newBooking);
    setBookingStep(4);
  };

  return (
    <div className="bg-[#F4F8FB] dark:bg-[#12304A] min-h-screen pb-20 animate-in fade-in duration-300">
      {/* 1. Subtle Airport & Sky Introductory Banner */}
      <section className="relative h-64 sm:h-72 overflow-hidden bg-[#12304A] text-white">
        <img
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=2000"
          alt="Airport Runway & Blue Sky"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12304A] via-[#12304A]/60 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#087EAB]/80 text-white text-xs font-semibold backdrop-blur-md mb-3 w-fit">
            <Plane className="w-3.5 h-3.5" />
            <span>Domestic & International Air Travel</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Fly Across Incredible India
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-2 max-w-xl">
            Compare nonstop flights with IndiGo, Air India, Vistara, and SpiceJet. Direct e-tickets with transparent INR fares.
          </p>
        </div>
      </section>

      {/* 2. Plain, Readable Search Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 space-y-8">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-200/90 dark:border-slate-800"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
            <div>
              <label className="block text-[11px] font-bold text-[#68798A] uppercase tracking-wider mb-1">
                From City / Code
              </label>
              <input
                type="text"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                placeholder="e.g. Delhi, Mumbai, BLR"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#087EAB]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#68798A] uppercase tracking-wider mb-1">
                To Destination
              </label>
              <input
                type="text"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                placeholder="e.g. Kochi, Goa, Chennai"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#087EAB]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#68798A] uppercase tracking-wider mb-1">
                Departure Date
              </label>
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#087EAB]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#68798A] uppercase tracking-wider mb-1">
                Travellers & Class
              </label>
              <select
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#087EAB]"
              >
                <option value={1}>1 Adult (Economy)</option>
                <option value={2}>2 Adults (Economy)</option>
                <option value={3}>3 Adults (Economy)</option>
                <option value={4}>4 Adults (Economy)</option>
              </select>
            </div>

            <div>
              <button
                type="button"
                className="w-full py-2.5 bg-[#087EAB] hover:bg-[#12304A] text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Search className="w-4 h-4" /> Search Flights
              </button>
            </div>
          </div>
        </form>

        {/* 3. Flight Results List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#12304A] dark:text-white">
              Available Flights ({filteredFlights.length})
            </h2>
            <span className="text-xs text-slate-500">
              Showing verified domestic fares in INR (₹)
            </span>
          </div>

          {filteredFlights.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                No direct flights found for "{fromCity}" to "{toCity}".
              </p>
              <button
                onClick={() => {
                  setFromCity('');
                  setToCity('');
                }}
                className="px-4 py-2 rounded-xl bg-[#087EAB] text-white text-xs font-bold"
              >
                View All Available Flights
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredFlights.map((flight) => (
                <div
                  key={flight.id}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  {/* Airline Info */}
                  <div className="flex items-center gap-4 min-w-[200px]">
                    <div className="w-12 h-12 rounded-2xl bg-[#E5F6FC] dark:bg-slate-800 flex items-center justify-center text-xl shrink-0">
                      {flight.logo}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[#12304A] dark:text-white text-base">
                        {flight.airline}
                      </h4>
                      <p className="text-xs text-slate-500 font-mono">
                        {flight.flightNumber} • {flight.seatClass}
                      </p>
                    </div>
                  </div>

                  {/* Flight Timing & Stops */}
                  <div className="flex items-center justify-between gap-6 flex-1 max-w-md">
                    <div className="text-left">
                      <span className="text-lg font-black text-[#12304A] dark:text-white">
                        {flight.departureTime}
                      </span>
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                        {flight.fromCity} ({flight.fromCode})
                      </p>
                    </div>

                    <div className="flex-1 flex flex-col items-center px-2">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" /> {flight.duration}
                      </span>
                      <div className="w-full flex items-center gap-1 my-1">
                        <div className="w-2 h-2 rounded-full bg-[#087EAB]" />
                        <div className="flex-1 border-t border-slate-300 dark:border-slate-700" />
                        <Plane className="w-3.5 h-3.5 text-[#087EAB] -rotate-45" />
                        <div className="flex-1 border-t border-slate-300 dark:border-slate-700" />
                        <div className="w-2 h-2 rounded-full bg-[#159B72]" />
                      </div>
                      <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                        {flight.stops}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-black text-[#12304A] dark:text-white">
                        {flight.arrivalTime}
                      </span>
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                        {flight.toCity} ({flight.toCode})
                      </p>
                    </div>
                  </div>

                  {/* Price & Book Action */}
                  <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="text-left md:text-right">
                      <div className="text-xl font-black text-[#087EAB]">
                        ₹{flight.priceInr.toLocaleString('en-IN')}
                      </div>
                      <span className="text-[10px] text-slate-400 block">per adult • {flight.availableSeats} seats left</span>
                    </div>

                    <button
                      onClick={() => handleStartBooking(flight)}
                      className="px-6 py-2.5 rounded-xl bg-[#087EAB] hover:bg-[#12304A] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Book Flight</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Complete Flight Booking Flow Modal */}
      {selectedFlight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]">
            {/* Header */}
            <div className="px-6 py-4 bg-[#12304A] text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Plane className="w-4 h-4 text-[#56C7EA]" /> Flight Booking Checkout
                </h3>
                <p className="text-xs text-slate-300">
                  {selectedFlight.airline} {selectedFlight.flightNumber} • {selectedFlight.fromCity} ({selectedFlight.fromCode}) → {selectedFlight.toCity} ({selectedFlight.toCode})
                </p>
              </div>
              <button
                onClick={() => setSelectedFlight(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="px-6 py-3 bg-[#F4F8FB] dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <span className={`font-bold ${bookingStep === 1 ? 'text-[#087EAB]' : 'text-slate-500'}`}>
                1. Passenger Details
              </span>
              <span>→</span>
              <span className={`font-bold ${bookingStep === 2 ? 'text-[#087EAB]' : 'text-slate-500'}`}>
                2. Seat Selection
              </span>
              <span>→</span>
              <span className={`font-bold ${bookingStep === 3 ? 'text-[#087EAB]' : 'text-slate-500'}`}>
                3. Review & Payment
              </span>
              <span>→</span>
              <span className={`font-bold ${bookingStep === 4 ? 'text-[#159B72]' : 'text-slate-500'}`}>
                4. Confirmation
              </span>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* STEP 1: PASSENGER DETAILS */}
              {bookingStep === 1 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-[#12304A] dark:text-white">
                    Primary Passenger Contact
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Full Name (as per Govt ID)</label>
                      <input
                        type="text"
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-slate-800"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={passengerPhone}
                        onChange={(e) => setPassengerPhone(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-slate-800"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 mb-1">Email Address (for Digital Boarding Pass)</label>
                      <input
                        type="email"
                        value={passengerEmail}
                        onChange={(e) => setPassengerEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-slate-800"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => setBookingStep(2)}
                      className="px-6 py-2.5 rounded-xl bg-[#087EAB] text-white text-xs font-bold shadow-md hover:bg-[#12304A] transition-colors"
                    >
                      Proceed to Seat Selection →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: SEAT SELECTION */}
              {bookingStep === 2 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#E5F6FC] dark:bg-slate-800 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#087EAB]">Select Aircraft Seat</span>
                      <p className="text-slate-600 dark:text-slate-300">
                        Choose your preferred window, aisle, or extra legroom seats.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsSeatModalOpen(true)}
                      className="px-4 py-2 bg-[#087EAB] text-white rounded-xl text-xs font-bold shadow-xs"
                    >
                      Open Seat Map
                    </button>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                    <span className="text-slate-400 font-bold block">Assigned Seats</span>
                    <p className="text-sm font-extrabold text-[#12304A] dark:text-white">
                      {selectedSeats.length > 0 ? selectedSeats.join(', ') : '12A (Default Window Seat Assigned)'}
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
                      className="px-6 py-2.5 rounded-xl bg-[#087EAB] text-white text-xs font-bold shadow-md hover:bg-[#12304A]"
                    >
                      Review & Pay →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: REVIEW & PAYMENT */}
              {bookingStep === 3 && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-[#F4F8FB] dark:bg-slate-800 space-y-2">
                    <div className="flex justify-between font-bold">
                      <span>Base Airfare ({passengers} Traveller):</span>
                      <span>₹{(selectedFlight.priceInr * passengers).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Aviation GST & Airport Utility Fees:</span>
                      <span>₹{Math.round(selectedFlight.priceInr * passengers * 0.05).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="pt-2 border-t flex justify-between text-base font-black text-[#087EAB]">
                      <span>Grand Total:</span>
                      <span>₹{Math.round(selectedFlight.priceInr * passengers * 1.05).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-amber-200 bg-[#FFF5E8] text-[#203447] text-xs">
                    <p className="font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#159B72]" /> Prototype Payment
                    </p>
                    <p className="text-[11px] mt-0.5">Demo Payment – No real money will be charged.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="font-bold block">Select Payment Method</label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('UPI')}
                        className={`flex-1 p-3 rounded-xl border text-center font-bold transition-all ${
                          paymentMethod === 'UPI' ? 'border-[#087EAB] bg-[#087EAB]/10 text-[#087EAB]' : 'border-slate-200'
                        }`}
                      >
                        UPI / QR Code
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Card')}
                        className={`flex-1 p-3 rounded-xl border text-center font-bold transition-all ${
                          paymentMethod === 'Card' ? 'border-[#087EAB] bg-[#087EAB]/10 text-[#087EAB]' : 'border-slate-200'
                        }`}
                      >
                        Debit / Credit Card
                      </button>
                    </div>
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
                      className="px-6 py-2.5 rounded-xl bg-[#159B72] hover:bg-[#087F65] text-white text-xs font-bold shadow-md"
                    >
                      Confirm Demo Booking (₹{Math.round(selectedFlight.priceInr * passengers * 1.05).toLocaleString('en-IN')})
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: CONFIRMATION */}
              {bookingStep === 4 && createdBooking && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#12304A] dark:text-white">
                      Flight Booking Confirmed!
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      PNR: <span className="font-mono font-bold text-[#087EAB]">{createdBooking.pnrNumber}</span>
                    </p>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                    Your e-ticket & boarding voucher have been generated and saved to your "My Trips" dashboard.
                  </p>
                  <button
                    onClick={() => setSelectedFlight(null)}
                    className="px-6 py-2.5 rounded-xl bg-[#087EAB] text-white text-xs font-bold shadow-md"
                  >
                    Done / Return to Flights
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Seat Selection Modal */}
      {selectedFlight && (
        <SeatSelectionModal
          isOpen={isSeatModalOpen}
          onClose={() => setIsSeatModalOpen(false)}
          serviceTitle={`${selectedFlight.airline} ${selectedFlight.flightNumber}`}
          serviceType="flight"
          passengerCount={passengers}
          baseFareInr={selectedFlight.priceInr}
          onConfirmSeats={(seats) => {
            setSelectedSeats(seats);
          }}
        />
      )}
    </div>
  );
};
