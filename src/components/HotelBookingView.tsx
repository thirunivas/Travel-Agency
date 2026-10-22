import React, { useState } from 'react';
import { HotelItem, UserProfile, Booking } from '../types';
import { INITIAL_HOTELS } from '../data/mockData';
import {
  Hotel,
  MapPin,
  Star,
  Search,
  Calendar,
  Users,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Wifi,
  Coffee,
  Sparkles,
} from 'lucide-react';

interface Props {
  currentUser: UserProfile | null;
  onBookHotelSuccess: (booking: Booking) => void;
  onOpenAuth: () => void;
}

export const HotelBookingView: React.FC<Props> = ({
  currentUser,
  onBookHotelSuccess,
}) => {
  const [hotels] = useState<HotelItem[]>(INITIAL_HOTELS);
  const [searchCity, setSearchCity] = useState('');
  const [checkInDate, setCheckInDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 8);
    return d.toISOString().split('T')[0];
  });
  const [guests, setGuests] = useState(2);

  // Booking Modal State
  const [selectedHotel, setSelectedHotel] = useState<HotelItem | null>(null);
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);
  const [guestName, setGuestName] = useState(currentUser?.name || '');
  const [guestEmail, setGuestEmail] = useState(currentUser?.email || '');
  const [guestPhone, setGuestPhone] = useState(currentUser?.phone || '+91 98450 12345');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  const filteredHotels = hotels.filter((h) => {
    if (!searchCity) return true;
    return (
      h.city.toLowerCase().includes(searchCity.toLowerCase()) ||
      h.state.toLowerCase().includes(searchCity.toLowerCase()) ||
      h.name.toLowerCase().includes(searchCity.toLowerCase())
    );
  });

  const handleStartBooking = (hotel: HotelItem) => {
    setSelectedHotel(hotel);
    setSelectedRoomIndex(0);
    setIsConfirmed(false);
    setGuestName(currentUser?.name || 'Anita Desai');
    setGuestEmail(currentUser?.email || 'anita.desai@example.com');
    setGuestPhone(currentUser?.phone || '+91 98200 45678');
  };

  const handleCompletePayment = () => {
    if (!selectedHotel) return;
    const room = selectedHotel.roomTypes[selectedRoomIndex] || selectedHotel.roomTypes[0];
    const nights = 3;
    const baseFare = room.priceInr * nights;
    const taxes = Math.round(baseFare * 0.12);
    const grandTotal = baseFare + taxes;
    const pnr = `HTL-RES-${Math.floor(100000 + Math.random() * 900000)}`;

    const newBooking: Booking = {
      id: `JH-BK-${Date.now().toString().slice(-6)}`,
      customerId: currentUser?.id || 'guest-hotel-user',
      customerName: guestName,
      customerEmail: guestEmail,
      customerPhone: guestPhone,
      packageId: selectedHotel.id,
      packageName: `${selectedHotel.name} (${room.name})`,
      destination: `${selectedHotel.city}, ${selectedHotel.state}`,
      hotel: `${selectedHotel.name} - ${room.name}`,
      transport: 'Hotel Stay Reservation (Airport / Station Pickup Available)',
      transportType: 'hotel',
      pnrNumber: pnr,
      seatNumbers: [`Room ${Math.floor(100 + Math.random() * 400)} (${room.name})`],
      routeDetails: `${selectedHotel.address}`,
      travelDate: checkInDate,
      returnDate: checkOutOutCalculation(checkInDate),
      pickupLocation: selectedHotel.city,
      dropLocation: selectedHotel.address,
      adults: guests,
      children: 0,
      specialRequests: `${room.name} with ${room.bed}. Complimentary Breakfast & Welcome Drink.`,
      bookingStatus: 'confirmed',
      paymentStatus: 'paid',
      amountPaidInr: baseFare,
      gstInr: taxes,
      discountInr: 0,
      grandTotalInr: grandTotal,
      paymentMethod: 'UPI',
      paymentId: `PAY-HTL-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      confirmedAt: new Date().toISOString(),
    };

    setCreatedBooking(newBooking);
    onBookHotelSuccess(newBooking);
    setIsConfirmed(true);
  };

  function checkOutOutCalculation(inDate: string) {
    try {
      const d = new Date(inDate);
      d.setDate(d.getDate() + 3);
      return d.toISOString().split('T')[0];
    } catch {
      return inDate;
    }
  }

  return (
    <div className="bg-[#F4F8FB] dark:bg-[#12304A] min-h-screen pb-20 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <section className="relative h-60 sm:h-68 overflow-hidden bg-[#12304A] text-white">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2000"
          alt="Luxury Resort Stays across India"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12304A] via-[#12304A]/60 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#087EAB]/80 text-white text-xs font-semibold backdrop-blur-md mb-3 w-fit">
            <Hotel className="w-3.5 h-3.5" />
            <span>Verified Stays & Resorts</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Handpicked Stays & Heritage Resorts
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-2 max-w-xl">
            From Kerala backwater luxury villas to royal Rajasthani palace havelis and Nilgiri tea bungalows.
          </p>
        </div>
      </section>

      {/* 2. Hotel Search Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 space-y-8">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-200/90 dark:border-slate-800"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
            <div>
              <label className="block text-[11px] font-bold text-[#68798A] uppercase tracking-wider mb-1">
                Destination / City
              </label>
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="e.g. Kumarakom, Ooty, Goa, Jaipur"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#087EAB]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#68798A] uppercase tracking-wider mb-1">
                Check-in Date
              </label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#087EAB]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#68798A] uppercase tracking-wider mb-1">
                Check-out Date
              </label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#087EAB]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#68798A] uppercase tracking-wider mb-1">
                Guests & Rooms
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#087EAB]"
              >
                <option value={1}>1 Guest, 1 Room</option>
                <option value={2}>2 Guests, 1 Room</option>
                <option value={3}>3 Guests, 1 Room</option>
                <option value={4}>4 Guests, 2 Rooms</option>
              </select>
            </div>

            <div>
              <button
                type="button"
                className="w-full py-2.5 bg-[#087EAB] hover:bg-[#12304A] text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Search className="w-4 h-4" /> Find Stays
              </button>
            </div>
          </div>
        </form>

        {/* 3. Hotels Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#12304A] dark:text-white">
              Verified Stays ({filteredHotels.length})
            </h2>
            <span className="text-xs text-slate-500">
              100% Quality Checked by JourneyHub Team
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredHotels.map((hotel) => (
              <div
                key={hotel.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-60 overflow-hidden bg-slate-100">
                    <img
                      src={hotel.imageUrl}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

                    <div className="absolute top-3 left-3 bg-[#159B72] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified Stay
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <div>
                        <span className="text-[11px] text-amber-300 font-bold block">
                          {'★'.repeat(hotel.starRating)} {hotel.starRating}-Star Property
                        </span>
                        <h3 className="text-lg font-black leading-tight drop-shadow-sm">{hotel.name}</h3>
                      </div>
                      <span className="bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-bold">
                        ★ {hotel.rating} ({hotel.reviewsCount})
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#087EAB]" /> {hotel.address}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {hotel.description}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {hotel.amenities.slice(0, 3).map((a, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Starting Nightly</span>
                    <span className="text-lg font-black text-[#087EAB]">
                      ₹{hotel.pricePerNightInr.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-500"> / night + taxes</span>
                  </div>

                  <button
                    onClick={() => handleStartBooking(hotel)}
                    className="px-5 py-2.5 rounded-xl bg-[#087EAB] hover:bg-[#12304A] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Reserve Room</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hotel Reservation Modal */}
      {selectedHotel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]">
            <div className="px-6 py-4 bg-[#12304A] text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Hotel className="w-4 h-4 text-[#56C7EA]" /> Hotel Reservation
                </h3>
                <p className="text-xs text-slate-300">{selectedHotel.name} • {selectedHotel.city}</p>
              </div>
              <button
                onClick={() => setSelectedHotel(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {!isConfirmed ? (
                <>
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Select Room Type
                    </label>
                    <div className="space-y-2">
                      {selectedHotel.roomTypes.map((room, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedRoomIndex(idx)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                            selectedRoomIndex === idx
                              ? 'border-[#087EAB] bg-[#E5F6FC] dark:bg-slate-800 text-[#087EAB]'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                          }`}
                        >
                          <div>
                            <span className="font-extrabold text-xs text-[#12304A] dark:text-white block">
                              {room.name}
                            </span>
                            <span className="text-[11px] text-slate-500">{room.bed}</span>
                          </div>
                          <span className="text-sm font-black text-[#087EAB]">
                            ₹{room.priceInr.toLocaleString('en-IN')} / night
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <label className="font-bold text-slate-700 dark:text-slate-300 block">Guest Information</label>
                    <input
                      type="text"
                      placeholder="Guest Full Name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800"
                    />
                    <input
                      type="text"
                      placeholder="Contact Number"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800"
                    />
                  </div>

                  <div className="p-4 rounded-2xl border border-amber-200 bg-[#FFF5E8] text-[#203447] text-xs">
                    <p className="font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#159B72]" /> Prototype Payment
                    </p>
                    <p className="text-[11px] mt-0.5">Demo Payment – No real money will be charged.</p>
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      onClick={() => setSelectedHotel(null)}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCompletePayment}
                      className="px-6 py-2.5 rounded-xl bg-[#087EAB] hover:bg-[#12304A] text-white text-xs font-bold shadow-md"
                    >
                      Confirm Stay (3 Nights)
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#159B72] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#12304A] dark:text-white">
                      Hotel Reservation Confirmed!
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Confirmation Ref: <span className="font-mono font-bold text-[#087EAB]">{createdBooking?.pnrNumber}</span>
                    </p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                      Check-in: {checkInDate} • {selectedHotel.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedHotel(null)}
                    className="px-6 py-2.5 rounded-xl bg-[#087EAB] text-white text-xs font-bold shadow-md"
                  >
                    Done / Return to Stays
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
