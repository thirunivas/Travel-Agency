import React, { useState, useEffect } from 'react';
import { TourPackage, UserProfile, Booking } from '../types';
import { generateJourneyHubReceiptPDF } from '../utils/pdfGenerator';
import {
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  Users,
  Hotel,
  Car,
  CreditCard,
  ShieldCheck,
  Download,
  X,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Check,
  Compass,
  AlertTriangle,
} from 'lucide-react';

interface Props {
  pkg: TourPackage | null;
  currentUser: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingComplete: (newBooking: Booking) => void;
  onOpenAuth: () => void;
}

export const BookingModal: React.FC<Props> = ({
  pkg,
  currentUser,
  isOpen,
  onClose,
  onBookingComplete,
  onOpenAuth,
}) => {
  // Steps matching Section 12:
  // 1: Passenger Details, 2: Review, 3: Payment, 4: Confirmation
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Passenger Details
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Trip Options
  const [travelDate, setTravelDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [hotelPref, setHotelPref] = useState<'Standard' | 'Deluxe' | 'Luxury'>('Deluxe');
  const [transportPref, setTransportPref] = useState<'Sedan' | 'SUV' | 'Tempo Traveller'>('Sedan');
  const [specialRequests, setSpecialRequests] = useState('');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking'>('UPI');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Confirmation
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (isOpen && pkg) {
      setCurrentStep(1);
      setCreatedBooking(null);
      setCustomerName(currentUser?.name || '');
      setCustomerEmail(currentUser?.email || '');
      setCustomerPhone(currentUser?.phone || '+91 98765 43210');

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 14);
      setTravelDate(futureDate.toISOString().split('T')[0]);

      setAdults(2);
      setChildren(0);
      setHotelPref('Deluxe');
      setTransportPref('Sedan');
      setSpecialRequests('');
      setPaymentMethod('UPI');
      setUpiId(currentUser?.email ? `${currentUser.email.split('@')[0]}@okaxis` : 'traveler@okaxis');
      setIsProcessing(false);
    }
  }, [isOpen, currentUser, pkg]);

  if (!isOpen || !pkg) return null;

  // Price calculations in INR (₹)
  const hotelMultiplier = hotelPref === 'Luxury' ? 1.25 : hotelPref === 'Deluxe' ? 1.1 : 1.0;
  const transportCost = transportPref === 'SUV' ? 2500 : transportPref === 'Tempo Traveller' ? 5000 : 0;
  const travelerFactor = adults + children * 0.5;
  const baseCost = Math.round(pkg.priceInr * travelerFactor * hotelMultiplier + transportCost);
  const taxesInr = Math.round(baseCost * 0.05); // 5% Tourism GST
  const grandTotalInr = baseCost + taxesInr;

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    setCurrentStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(3);
  };

  const handleConfirmAndPay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const returnDateObj = new Date(travelDate);
      returnDateObj.setDate(returnDateObj.getDate() + 5);

      const bookingId = `JH-BK-${Date.now().toString().slice(-6)}`;
      const newBooking: Booking = {
        id: bookingId,
        customerId: currentUser?.id || `cust-${Date.now()}`,
        customerName: customerName.trim() || currentUser?.name || 'Valued Traveller',
        customerEmail: customerEmail.trim() || currentUser?.email || 'traveller@journeyhub.com',
        customerPhone: customerPhone.trim() || '+91 98765 43210',
        packageId: pkg.id,
        packageName: pkg.name,
        destination: pkg.destination,
        hotel: `${hotelPref} Category (${pkg.hotel})`,
        transport: `Private ${transportPref} AC Ground Transfer`,
        transportType: 'package',
        pnrNumber: `JH-PK-${Math.floor(100000 + Math.random() * 900000)}`,
        seatNumbers: [`Private AC ${transportPref}`],
        routeDetails: `${pkg.destination} Sightseeing & Transfers`,
        travelDate: travelDate,
        returnDate: returnDateObj.toISOString().split('T')[0],
        pickupLocation: `${pkg.destination.split(',')[0]} Airport / Station`,
        dropLocation: `${pkg.destination.split(',')[0]} Airport / Station`,
        adults: adults,
        children: children,
        specialRequests: specialRequests.trim() || 'Standard travel hospitality',
        bookingStatus: 'confirmed',
        paymentStatus: 'paid',
        amountPaidInr: grandTotalInr,
        gstInr: taxesInr,
        discountInr: 0,
        grandTotalInr: grandTotalInr,
        paymentMethod: paymentMethod,
        paymentId: `PAY-${paymentMethod.replace(/\s+/g, '')}-${Math.floor(100000 + Math.random() * 900000)}`,
        createdAt: new Date().toISOString(),
        confirmedAt: new Date().toISOString(),
      };

      setCreatedBooking(newBooking);
      onBookingComplete(newBooking);
      setIsProcessing(false);
      setCurrentStep(4);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#F4F8FB] dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col my-auto">
        {/* Header (Deep Navy) */}
        <div className="px-6 py-4 bg-[#12304A] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#087EAB] flex items-center justify-center">
              <Compass className="w-4 h-4 text-[#FFD166]" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">{pkg.name}</h3>
              <p className="text-[11px] text-sky-200">
                {pkg.destination} • {pkg.duration}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 12 Booking Progress Indicator */}
        <div className="px-6 py-3 bg-white dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 shrink-0">
          <div className="flex items-center justify-between text-[11px] font-bold max-w-xl mx-auto overflow-x-auto gap-2">
            <span className="text-[#159B72] flex items-center gap-1 shrink-0">
              <Check className="w-3 h-3" /> Search
            </span>
            <span className="text-slate-300">→</span>
            <span className="text-[#159B72] flex items-center gap-1 shrink-0">
              <Check className="w-3 h-3" /> Select Service
            </span>
            <span className="text-slate-300">→</span>
            <span className={`shrink-0 ${currentStep === 1 ? 'text-[#087EAB] font-black' : currentStep > 1 ? 'text-[#159B72]' : 'text-slate-400'}`}>
              Passenger Details
            </span>
            <span className="text-slate-300">→</span>
            <span className={`shrink-0 ${currentStep === 2 ? 'text-[#087EAB] font-black' : currentStep > 2 ? 'text-[#159B72]' : 'text-slate-400'}`}>
              Review
            </span>
            <span className="text-slate-300">→</span>
            <span className={`shrink-0 ${currentStep === 3 ? 'text-[#087EAB] font-black' : currentStep > 3 ? 'text-[#159B72]' : 'text-slate-400'}`}>
              Payment
            </span>
            <span className="text-slate-300">→</span>
            <span className={`shrink-0 ${currentStep === 4 ? 'text-[#159B72] font-black' : 'text-slate-400'}`}>
              Confirmation
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-6">
          {/* STEP 1: PASSENGER DETAILS */}
          {currentStep === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-4">
                <h4 className="text-base font-bold text-[#12304A] dark:text-white">
                  Lead Passenger & Travel Dates
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#68798A] uppercase tracking-wider mb-1">
                      Full Name (as per ID)
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#68798A] uppercase tracking-wider mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#68798A] uppercase tracking-wider mb-1">
                      Email Address (for e-Ticket delivery)
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#68798A] uppercase tracking-wider mb-1">
                      Start Travel Date
                    </label>
                    <input
                      type="date"
                      required
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#68798A] uppercase tracking-wider mb-1">
                      Number of Adults
                    </label>
                    <select
                      value={adults}
                      onChange={(e) => setAdults(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                    >
                      <option value={1}>1 Adult</option>
                      <option value={2}>2 Adults</option>
                      <option value={3}>3 Adults</option>
                      <option value={4}>4 Adults</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#087EAB] hover:bg-[#12304A] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Continue to Review</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: REVIEW */}
          {currentStep === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-4">
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-4">
                <h4 className="text-base font-bold text-[#12304A] dark:text-white">
                  Review Itinerary & Customisation
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#68798A] uppercase tracking-wider mb-1">
                      Hotel Room Category
                    </label>
                    <select
                      value={hotelPref}
                      onChange={(e) => setHotelPref(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                    >
                      <option value="Standard">Standard 3-Star</option>
                      <option value="Deluxe">Deluxe 4-Star (Included)</option>
                      <option value="Luxury">Luxury 5-Star Heritage (+25%)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#68798A] uppercase tracking-wider mb-1">
                      Chauffeur Ground Transport
                    </label>
                    <select
                      value={transportPref}
                      onChange={(e) => setTransportPref(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                    >
                      <option value="Sedan">Private AC Sedan (Included)</option>
                      <option value="SUV">Innova Crysta SUV (+₹2,500)</option>
                      <option value="Tempo Traveller">Tempo Traveller (+₹5,000)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#68798A] uppercase tracking-wider mb-1">
                      Special Requests / Dietary Notes
                    </label>
                    <input
                      type="text"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="e.g. Pure vegetarian meals, ground floor room"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Visible Booking Summary */}
                <div className="p-4 rounded-xl bg-[#F4F8FB] dark:bg-slate-900 space-y-2 border border-slate-200/80 dark:border-slate-700 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Destination:</span>
                    <span className="font-bold text-[#12304A] dark:text-white">{pkg.destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Travel Date:</span>
                    <span className="font-bold text-[#12304A] dark:text-white">{travelDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Travellers:</span>
                    <span className="font-bold text-[#12304A] dark:text-white">{adults} Adult(s)</span>
                  </div>
                  <div className="pt-2 border-t flex justify-between font-bold text-sm text-[#087EAB]">
                    <span>Estimated Total (INR):</span>
                    <span>₹{grandTotalInr.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#087EAB] hover:bg-[#12304A] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Proceed to Payment</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: PAYMENT */}
          {currentStep === 3 && (
            <form onSubmit={handleConfirmAndPay} className="space-y-4">
              {/* Prototype Warning Notice with Orange Indicator */}
              <div className="p-4 rounded-2xl bg-[#FFF5E8] border border-amber-300 text-[#203447] text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-[#FF9B54]">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Prototype Payment</span>
                </div>
                <p className="font-semibold text-[11px] pl-6">
                  Demo Payment – No real money will be charged.
                </p>
              </div>

              {/* White Content Card for Summary */}
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-3">
                <h4 className="text-base font-bold text-[#12304A] dark:text-white">
                  Payment Summary & Mode
                </h4>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span>Base Package Fare:</span>
                    <span className="font-bold">₹{baseCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST & Tourism Taxes (5%):</span>
                    <span className="font-bold">₹{taxesInr.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="pt-2 border-t flex justify-between text-base font-black text-[#087EAB]">
                    <span>Grand Total:</span>
                    <span>₹{grandTotalInr.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="pt-3 space-y-2">
                  <label className="block text-xs font-bold text-[#12304A] dark:text-white">
                    Select Demo Payment Method
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['UPI', 'Credit Card', 'Debit Card', 'Net Banking'] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          paymentMethod === method
                            ? 'border-[#087EAB] bg-[#E5F6FC] text-[#087EAB] font-bold'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5 mx-auto mb-1 text-slate-400" />
                        <span className="text-[11px] block">{method}</span>
                      </button>
                    ))}
                  </div>

                  {paymentMethod === 'UPI' && (
                    <div className="pt-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. mobile@upi"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2.5 rounded-xl bg-[#159B72] hover:bg-[#087F65] text-white font-bold text-xs flex items-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isProcessing ? 'Processing...' : `Pay ₹${grandTotalInr.toLocaleString('en-IN')} (Demo)`}</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: CONFIRMATION & RECEIPT DOWNLOAD */}
          {currentStep === 4 && createdBooking && (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-[#159B72] flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h4 className="text-2xl font-black text-[#12304A] dark:text-white">
                  Trip Booking Confirmed!
                </h4>
                <p className="text-xs text-slate-500">
                  Booking Reference: <strong className="font-mono text-[#087EAB]">{createdBooking.id}</strong>
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-md mx-auto text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Package:</span>
                  <span className="font-bold text-[#12304A] dark:text-white">{createdBooking.packageName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Destination:</span>
                  <span className="font-bold text-[#12304A] dark:text-white">{createdBooking.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Travel Date:</span>
                  <span className="font-bold text-[#12304A] dark:text-white">{createdBooking.travelDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Paid:</span>
                  <span className="font-bold text-[#159B72]">
                    ₹{createdBooking.grandTotalInr.toLocaleString('en-IN')} (Confirmed)
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => generateJourneyHubReceiptPDF(createdBooking)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#087EAB] hover:bg-[#12304A] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Booking Receipt (PDF)</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer"
                >
                  Done / Return to JourneyHub
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
