import React, { useState } from 'react';
import { TrainItem, TrainClassOption, UserProfile, Booking } from '../types';
import { INITIAL_TRAINS } from '../data/mockData';
import { SeatSelectionModal } from './SeatSelectionModal';
import {
  Search,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Sparkles,
} from 'lucide-react';

interface Props {
  currentUser: UserProfile | null;
  onBookTrainSuccess: (booking: Booking) => void;
  onOpenAuth: () => void;
}

export const TrainBookingView: React.FC<Props> = ({
  currentUser,
  onBookTrainSuccess,
}) => {
  const [trains] = useState<TrainItem[]>(INITIAL_TRAINS);
  const [fromStation, setFromStation] = useState('Chennai');
  const [toStation, setToStation] = useState('Madurai');
  const [journeyDate, setJourneyDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [passengers, setPassengers] = useState(1);
  const [quota, setQuota] = useState('GENERAL');

  // Booking Flow State
  const [selectedTrain, setSelectedTrain] = useState<TrainItem | null>(null);
  const [selectedClass, setSelectedClass] = useState<TrainClassOption | null>(null);
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [selectedBerths, setSelectedBerths] = useState<string[]>([]);
  const [passengerName, setPassengerName] = useState(currentUser?.name || '');
  const [passengerEmail, setPassengerEmail] = useState(currentUser?.email || '');
  const [passengerPhone, setPassengerPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [berthPreference, setBerthPreference] = useState('Lower Berth (LB)');
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  const filteredTrains = trains.filter((t) => {
    const matchFrom = !fromStation || t.fromStation.toLowerCase().includes(fromStation.toLowerCase()) || t.fromCode.toLowerCase().includes(fromStation.toLowerCase());
    const matchTo = !toStation || t.toStation.toLowerCase().includes(toStation.toLowerCase()) || t.toCode.toLowerCase().includes(toStation.toLowerCase());
    return matchFrom && matchTo;
  });

  const handleStartBooking = (train: TrainItem, cls: TrainClassOption) => {
    setSelectedTrain(train);
    setSelectedClass(cls);
    setBookingStep(1);
    setSelectedBerths([`B3-14 (${berthPreference})`]);
    setPassengerName(currentUser?.name || 'Venkatesh Raman');
    setPassengerEmail(currentUser?.email || 'venkatesh.raman@example.com');
    setPassengerPhone(currentUser?.phone || '+91 98401 23456');
  };

  const handleCompletePayment = () => {
    if (!selectedTrain || !selectedClass) return;
    const baseFare = selectedClass.fareInr * passengers;
    const taxes = Math.round(baseFare * 0.05);
    const grandTotal = baseFare + taxes;
    const pnr = `IRCTC-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    const newBooking: Booking = {
      id: `JH-BK-${Date.now().toString().slice(-6)}`,
      customerId: currentUser?.id || 'guest-rail-user',
      customerName: passengerName,
      customerEmail: passengerEmail,
      customerPhone: passengerPhone,
      packageId: selectedTrain.id,
      packageName: `${selectedTrain.trainName} (${selectedTrain.trainNumber}) • Class ${selectedClass.code}`,
      destination: `${selectedTrain.toStation} (${selectedTrain.toCode})`,
      hotel: 'Train Booking - No Hotel',
      transport: `${selectedTrain.trainName} (${selectedClass.name})`,
      transportType: 'train',
      pnrNumber: pnr,
      seatNumbers: selectedBerths.length > 0 ? selectedBerths : ['Coach B3, Berth 24 (Lower)'],
      routeDetails: `${selectedTrain.fromStation} (${selectedTrain.fromCode}) → ${selectedTrain.toStation} (${selectedTrain.toCode})`,
      travelDate: journeyDate,
      returnDate: '',
      pickupLocation: `${selectedTrain.fromStation} Railway Station (${selectedTrain.fromCode})`,
      dropLocation: `${selectedTrain.toStation} Railway Station (${selectedTrain.toCode})`,
      adults: passengers,
      children: 0,
      specialRequests: `${quota} Quota. Preferred Berth: ${berthPreference}`,
      bookingStatus: 'confirmed',
      paymentStatus: 'paid',
      amountPaidInr: baseFare,
      gstInr: taxes,
      discountInr: 0,
      grandTotalInr: grandTotal,
      paymentMethod: 'UPI',
      paymentId: `PAY-RAIL-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      confirmedAt: new Date().toISOString(),
    };

    setCreatedBooking(newBooking);
    onBookTrainSuccess(newBooking);
    setBookingStep(4);
  };

  return (
    <div className="bg-[#F4F8FB] dark:bg-[#12304A] min-h-screen pb-20 animate-in fade-in duration-300">
      {/* 1. Introductory Scenic Indian Railway Banner */}
      <section className="relative h-64 sm:h-72 overflow-hidden bg-[#12304A] text-white">
        <img
          src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=2000"
          alt="Scenic train journey through green Indian landscapes"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12304A] via-[#12304A]/60 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#087EAB]/80 text-white text-xs font-semibold backdrop-blur-md mb-3 w-fit">
            <span>🚆 Indian Railways Booking Desk</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Scenic Railway Journeys
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-2 max-w-xl">
            Book Vande Bharat, Rajdhani, Shatabdi, and Superfast express trains with instant PNR generation and confirmed berths.
          </p>
        </div>
      </section>

      {/* 2. Plain Station Search Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 space-y-8">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-200/90 dark:border-slate-800"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
            <div>
              <label className="block text-[11px] font-bold text-[#68798A] uppercase tracking-wider mb-1">
                From Station
              </label>
              <input
                type="text"
                value={fromStation}
                onChange={(e) => setFromStation(e.target.value)}
                placeholder="e.g. Chennai, Delhi, Kasaragod"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#087EAB]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#68798A] uppercase tracking-wider mb-1">
                To Station
              </label>
              <input
                type="text"
                value={toStation}
                onChange={(e) => setToStation(e.target.value)}
                placeholder="e.g. Madurai, Mysuru, TVC"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#087EAB]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#68798A] uppercase tracking-wider mb-1">
                Journey Date
              </label>
              <input
                type="date"
                value={journeyDate}
                onChange={(e) => setJourneyDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#087EAB]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#68798A] uppercase tracking-wider mb-1">
                Quota
              </label>
              <select
                value={quota}
                onChange={(e) => setQuota(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#087EAB]"
              >
                <option value="GENERAL">General Quota</option>
                <option value="TATKAL">Tatkal Quota</option>
                <option value="LADIES">Ladies Quota</option>
                <option value="SENIOR_CITIZEN">Senior Citizen</option>
              </select>
            </div>

            <div>
              <button
                type="button"
                className="w-full py-2.5 bg-[#087EAB] hover:bg-[#12304A] text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Search className="w-4 h-4" /> Search Trains
              </button>
            </div>
          </div>
        </form>

        {/* 3. Train Results Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#12304A] dark:text-white">
              Available Trains ({filteredTrains.length})
            </h2>
            <span className="text-xs text-slate-500">Live IRCTC Berth Availability</span>
          </div>

          {filteredTrains.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                No direct trains found for "{fromStation}" to "{toStation}".
              </p>
              <button
                onClick={() => {
                  setFromStation('');
                  setToStation('');
                }}
                className="px-4 py-2 rounded-xl bg-[#087EAB] text-white text-xs font-bold"
              >
                View All Express Trains
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTrains.map((train) => (
                <div
                  key={train.id}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-md bg-[#087EAB]/10 text-[#087EAB] font-mono text-xs font-bold">
                        #{train.trainNumber}
                      </span>
                      <h4 className="text-base font-extrabold text-[#12304A] dark:text-white">
                        {train.trainName}
                      </h4>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Runs: {train.runsOn.join(', ')}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold text-[#159B72]">
                        <Clock className="w-3.5 h-3.5" /> {train.duration}
                      </span>
                    </div>
                  </div>

                  {/* Journey Timeline */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-left">
                      <span className="text-lg font-black text-[#12304A] dark:text-white">
                        {train.departureTime}
                      </span>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {train.fromStation} ({train.fromCode})
                      </p>
                    </div>

                    <div className="flex-1 flex flex-col items-center px-4">
                      <span className="text-[10px] text-slate-400">Direct Express Route</span>
                      <div className="w-full flex items-center gap-1 my-1">
                        <div className="w-2 h-2 rounded-full bg-[#087EAB]" />
                        <div className="flex-1 border-t-2 border-dashed border-slate-300 dark:border-slate-700" />
                        <div className="w-2 h-2 rounded-full bg-[#159B72]" />
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-black text-[#12304A] dark:text-white">
                        {train.arrivalTime}
                      </span>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {train.toStation} ({train.toCode})
                      </p>
                    </div>
                  </div>

                  {/* Class Selection Options */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                    {train.classes.map((cls) => (
                      <div
                        key={cls.code}
                        onClick={() => handleStartBooking(train, cls)}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 hover:border-[#087EAB] hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition-all flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-[#12304A] dark:text-white">
                            {cls.code}
                          </span>
                          <span className="text-[10px] font-bold text-[#159B72] bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                            AVL {cls.availableSeats}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{cls.name}</p>
                        <div className="pt-2 flex items-baseline justify-between">
                          <span className="text-sm font-black text-[#087EAB]">
                            ₹{cls.fareInr.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] font-bold text-[#087EAB] flex items-center">
                            Book <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Complete Train Booking Modal */}
      {selectedTrain && selectedClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]">
            <div className="px-6 py-4 bg-[#12304A] text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <span>🚆 Train Ticket Reservation</span>
                </h3>
                <p className="text-xs text-slate-300">
                  {selectedTrain.trainName} ({selectedTrain.trainNumber}) • Class {selectedClass.code} ({selectedClass.name})
                </p>
              </div>
              <button
                onClick={() => setSelectedTrain(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Progress Bar */}
            <div className="px-6 py-3 bg-[#F4F8FB] dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <span className={`font-bold ${bookingStep === 1 ? 'text-[#087EAB]' : 'text-slate-500'}`}>
                1. Passenger Info
              </span>
              <span>→</span>
              <span className={`font-bold ${bookingStep === 2 ? 'text-[#087EAB]' : 'text-slate-500'}`}>
                2. Berth Choice
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

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* STEP 1 */}
              {bookingStep === 1 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-[#12304A] dark:text-white">
                    Passenger Details (as per Aadhaar / Passport)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-500 mb-1">Passenger Name</label>
                      <input
                        type="text"
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-500 mb-1">Mobile Number (for SMS PNR)</label>
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
                      className="px-6 py-2.5 rounded-xl bg-[#087EAB] text-white text-xs font-bold shadow-md hover:bg-[#12304A]"
                    >
                      Proceed to Berth Preference →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: BERTH PREFERENCE */}
              {bookingStep === 2 && (
                <div className="space-y-4 text-xs">
                  <h4 className="text-sm font-bold text-[#12304A] dark:text-white">
                    Berth Selection & Quota
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['Lower Berth (LB)', 'Middle Berth (MB)', 'Upper Berth (UB)', 'Side Lower (SL)', 'Side Upper (SU)', 'Window Seat (CC)'].map((b) => (
                      <div
                        key={b}
                        onClick={() => {
                          setBerthPreference(b);
                          setSelectedBerths([`B3-14 (${b})`]);
                        }}
                        className={`p-3.5 rounded-xl border cursor-pointer font-bold transition-all ${
                          berthPreference === b
                            ? 'border-[#087EAB] bg-[#087EAB]/10 text-[#087EAB]'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                        }`}
                      >
                        {b}
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-[#E5F6FC] dark:bg-slate-800 text-xs">
                    <span className="font-bold text-[#087EAB]">Berth Allocation Notice:</span>
                    <p className="text-slate-600 dark:text-slate-300 mt-1">
                      Berth will be confirmed automatically under {quota} Quota based on Indian Railways coach allocation rules.
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
                      <span>Base Railway Fare ({selectedClass.name}):</span>
                      <span>₹{(selectedClass.fareInr * passengers).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>IRCTC Convenience Fee & GST:</span>
                      <span>₹{Math.round(selectedClass.fareInr * passengers * 0.05).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="pt-2 border-t flex justify-between text-base font-black text-[#087EAB]">
                      <span>Grand Total:</span>
                      <span>₹{Math.round(selectedClass.fareInr * passengers * 1.05).toLocaleString('en-IN')}</span>
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
                      className="px-6 py-2.5 rounded-xl bg-[#159B72] hover:bg-[#087F65] text-white text-xs font-bold shadow-md"
                    >
                      Confirm Train Booking (₹{Math.round(selectedClass.fareInr * passengers * 1.05).toLocaleString('en-IN')})
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: CONFIRMATION */}
              {bookingStep === 4 && createdBooking && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#12304A] dark:text-white">
                      Train Ticket Booked!
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      PNR: <span className="font-mono font-bold text-[#087EAB]">{createdBooking.pnrNumber}</span>
                    </p>
                    <p className="text-xs font-bold text-[#159B72] mt-0.5">
                      Coach B3 • Berth {berthPreference} (CONFIRMED)
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedTrain(null)}
                    className="px-6 py-2.5 rounded-xl bg-[#087EAB] text-white text-xs font-bold shadow-md"
                  >
                    Done / Return to Train Search
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
