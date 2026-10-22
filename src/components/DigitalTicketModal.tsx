import React from 'react';
import { Booking } from '../types';
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  ShieldCheck,
  Compass,
  ArrowRight,
  QrCode,
  Tag,
} from 'lucide-react';
import { generateJourneyHubReceiptPDF } from '../utils/pdfGenerator';

interface Props {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DigitalTicketModal: React.FC<Props> = ({ booking, isOpen, onClose }) => {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    generateJourneyHubReceiptPDF(booking);
  };

  const getTransportIcon = (type?: string) => {
    switch (type) {
      case 'flight':
        return '✈️';
      case 'train':
        return '🚆';
      case 'ksrtc':
      case 'setc':
      case 'bus':
        return '🚌';
      case 'hotel':
        return '🏨';
      default:
        return '🌴';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]">
        {/* Top Action Bar */}
        <div className="px-6 py-4 bg-[#12304A] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">{getTransportIcon(booking.transportType)}</span>
            <div>
              <h3 className="text-sm font-bold tracking-tight">Official Digital e-Ticket / Boarding Voucher</h3>
              <p className="text-[10px] text-[#56C7EA] font-mono">PNR: {booking.pnrNumber || booking.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Download PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Print Voucher"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Ticket Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F4F8FB] dark:bg-slate-950 print:bg-white print:p-0">
          {/* Main Card with Ticket Perforations */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden relative">
            {/* Header Ribbon */}
            <div className="p-6 bg-gradient-to-r from-[#087EAB] to-[#12304A] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-[#087EAB] flex items-center justify-center font-black shadow-md">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight leading-none">JourneyHub</h2>
                  <p className="text-[10px] text-[#56C7EA] font-semibold tracking-widest uppercase mt-1">
                    Discover Incredible India • Verified e-Ticket
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#159B72] text-white text-xs font-bold shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" /> CONFIRMED & PAID
                </span>
                <p className="text-[10px] text-slate-200 mt-1">Ref: {booking.id}</p>
              </div>
            </div>

            {/* Journey Segment */}
            <div className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#F4F8FB] dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Service / Tour</span>
                  <h4 className="text-base font-extrabold text-[#12304A] dark:text-white leading-snug">
                    {booking.packageName}
                  </h4>
                  <p className="text-xs text-[#087EAB] font-semibold mt-0.5">{booking.transport}</p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Travel Date</span>
                  <span className="text-sm font-black text-[#12304A] dark:text-white flex items-center sm:justify-end gap-1">
                    <Calendar className="w-4 h-4 text-[#087EAB]" /> {booking.travelDate}
                  </span>
                  {booking.returnDate && (
                    <span className="text-[11px] text-slate-500 block">Return: {booking.returnDate}</span>
                  )}
                </div>
              </div>

              {/* Route Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#159B72]" /> Boarding / Pickup Point
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white text-xs">
                    {booking.pickupLocation || booking.destination}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#FF7165]" /> Destination / Drop Point
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white text-xs">
                    {booking.dropLocation || booking.destination}
                  </p>
                </div>
              </div>

              {/* Perforation Separator */}
              <div className="relative py-2 flex items-center justify-between">
                <div className="w-4 h-8 bg-[#F4F8FB] dark:bg-slate-950 rounded-r-full -ml-6 border-r border-y border-slate-200 dark:border-slate-800" />
                <div className="flex-1 border-t-2 border-dashed border-slate-300 dark:border-slate-700 mx-2" />
                <div className="w-4 h-8 bg-[#F4F8FB] dark:bg-slate-950 rounded-l-full -mr-6 border-l border-y border-slate-200 dark:border-slate-800" />
              </div>

              {/* Passenger & Seat Assignment */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Lead Passenger</span>
                  <p className="font-bold text-[#12304A] dark:text-white text-sm">{booking.customerName}</p>
                  <p className="text-[11px] text-slate-500">{booking.customerPhone}</p>
                  <p className="text-[11px] text-slate-500">{booking.customerEmail}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Travellers & Seats</span>
                  <p className="font-bold text-[#12304A] dark:text-white text-sm">
                    {booking.adults} Adult(s) {booking.children > 0 ? `, ${booking.children} Child` : ''}
                  </p>
                  <p className="text-xs font-black text-[#087EAB] bg-[#E5F6FC] dark:bg-slate-800 px-2 py-0.5 rounded inline-block mt-1">
                    Seats: {booking.seatNumbers && booking.seatNumbers.length > 0 ? booking.seatNumbers.join(', ') : 'Reserved (Auto)'}
                  </p>
                </div>

                <div className="space-y-1 sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Fare Paid</span>
                  <p className="text-xl font-black text-[#159B72]">
                    ₹{booking.grandTotalInr.toLocaleString('en-IN')}
                  </p>
                  <span className="text-[10px] text-slate-400">Method: {booking.paymentMethod || 'UPI Verified'}</span>
                </div>
              </div>

              {/* Barcode & QR Code Section */}
              <div className="pt-4 border-t border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* Visual SVG QR Code */}
                  <div className="w-16 h-16 bg-white p-1 rounded-xl border border-slate-200 shadow-xs shrink-0 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
                      <rect width="100" height="100" fill="white" />
                      {/* Top left corner */}
                      <rect x="10" y="10" width="25" height="25" fill="#12304A" />
                      <rect x="15" y="15" width="15" height="15" fill="white" />
                      <rect x="18" y="18" width="9" height="9" fill="#087EAB" />
                      {/* Top right corner */}
                      <rect x="65" y="10" width="25" height="25" fill="#12304A" />
                      <rect x="70" y="15" width="15" height="15" fill="white" />
                      <rect x="73" y="18" width="9" height="9" fill="#087EAB" />
                      {/* Bottom left corner */}
                      <rect x="10" y="65" width="25" height="25" fill="#12304A" />
                      <rect x="15" y="70" width="15" height="15" fill="white" />
                      <rect x="18" y="73" width="9" height="9" fill="#087EAB" />
                      {/* Data patterns */}
                      <rect x="42" y="12" width="6" height="6" fill="#12304A" />
                      <rect x="52" y="18" width="6" height="6" fill="#159B72" />
                      <rect x="42" y="28" width="8" height="8" fill="#12304A" />
                      <rect x="42" y="42" width="16" height="16" fill="#087EAB" />
                      <rect x="12" y="44" width="8" height="8" fill="#12304A" />
                      <rect x="25" y="48" width="6" height="6" fill="#159B72" />
                      <rect x="68" y="44" width="8" height="8" fill="#12304A" />
                      <rect x="80" y="52" width="6" height="6" fill="#12304A" />
                      <rect x="42" y="68" width="10" height="10" fill="#12304A" />
                      <rect x="68" y="68" width="20" height="20" fill="#12304A" />
                    </svg>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Scan & Board</span>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Show this QR code to the driver or conductor at boarding time.
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Valid Govt. ID proof required.</p>
                  </div>
                </div>

                {/* Simulated Barcode */}
                <div className="text-center sm:text-right space-y-1">
                  <div className="inline-flex gap-1 h-8 items-end px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
                    {[3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 4, 1, 2, 4, 2, 1, 3, 2].map((w, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-800 dark:bg-slate-200 h-6"
                        style={{ width: `${w * 1.5}px` }}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] font-mono text-slate-400 tracking-widest block">
                    *{booking.pnrNumber || booking.id}*
                  </p>
                </div>
              </div>
            </div>

            {/* Prototype Notice Footer */}
            <div className="px-6 py-3 bg-[#FFF5E8] dark:bg-amber-950/30 border-t border-amber-200 dark:border-amber-900/40 text-[11px] text-[#203447] dark:text-amber-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#159B72]" /> Demo Payment – No real money will be charged.
              </span>
              <span className="font-semibold text-slate-500">JourneyHub Customer Desk: 1800-JOURNEY</span>
            </div>
          </div>
        </div>

        {/* Modal Close Action */}
        <div className="px-6 py-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#087EAB] hover:bg-[#12304A] text-white text-xs font-bold transition-all shadow-md"
          >
            Close Voucher
          </button>
        </div>
      </div>
    </div>
  );
};
