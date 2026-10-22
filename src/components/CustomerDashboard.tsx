import React, { useState } from 'react';
import { UserProfile, Booking, Review } from '../types';
import { generateJourneyHubReceiptPDF } from '../utils/pdfGenerator';
import { Calendar, User, Mail, Phone, ShieldCheck, Download, Star, X, CheckCircle2, Clock, AlertCircle, RefreshCw, Send } from 'lucide-react';

interface Props {
  currentUser: UserProfile;
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
  onSubmitReview: (review: Review) => void;
  onOpenVerification: () => void;
}

export const CustomerDashboard: React.FC<Props> = ({
  currentUser,
  bookings,
  onCancelBooking,
  onSubmitReview,
  onOpenVerification,
}) => {
  const customerBookings = bookings.filter(
    (b) => b.customerId === currentUser.id || b.customerEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  // Review modal states
  const [reviewModalPkg, setReviewModalPkg] = useState<{ id: string; name: string } | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalPkg) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      packageId: reviewModalPkg.id,
      packageName: reviewModalPkg.name,
      customerName: currentUser.name,
      customerEmail: currentUser.email,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
      verifiedBooking: true,
    };

    onSubmitReview(newRev);
    setReviewModalPkg(null);
    setComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Profile Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
            {currentUser.name.charAt(0)}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900">{currentUser.name}</h2>
              {currentUser.isEmailVerified ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Traveler
                </span>
              ) : (
                <button
                  onClick={onOpenVerification}
                  className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 hover:bg-amber-200 text-[10px] font-bold flex items-center gap-1"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Verify Email Now
                </button>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {currentUser.email}</span>
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {currentUser.phone}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Bookings</span>
            <span className="text-xl font-black text-blue-700">{customerBookings.length} Trips</span>
          </div>
        </div>
      </div>

      {/* Bookings History List */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-slate-900">My Travel Bookings & Receipts</h3>

        {customerBookings.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 shadow-xs">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h4 className="font-bold text-slate-800 text-base">You haven't booked any tour packages yet</h4>
            <p className="text-xs text-slate-500 mt-1">Explore our destinations and book your dream vacation!</p>
          </div>
        ) : (
          customerBookings.map((bk) => (
            <div
              key={bk.id}
              className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-300 transition-all"
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-mono bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {bk.id}
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-base">{bk.packageName}</h4>

                  {bk.bookingStatus === 'confirmed' && (
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Confirmed
                    </span>
                  )}
                  {bk.bookingStatus === 'cancelled' && (
                    <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <X className="w-3.5 h-3.5 text-red-600" /> Cancelled
                    </span>
                  )}
                  {bk.bookingStatus === 'pending' && (
                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Review
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <p>Destination: <strong>{bk.destination}</strong> • Hotel: {bk.hotel}</p>
                  <p>Travel Dates: <strong>{bk.travelDate}</strong> to <strong>{bk.returnDate}</strong></p>
                  <p>Pickup: {bk.pickupLocation} | Drop: {bk.dropLocation}</p>
                </div>
              </div>

              {/* Right Side Actions & Price */}
              <div className="flex flex-col md:items-end justify-between gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block text-left md:text-right">Grand Total Paid</span>
                  <span className="text-lg font-black text-blue-700">₹{bk.grandTotalInr.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => generateJourneyHubReceiptPDF(bk)}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" /> Receipt PDF
                  </button>

                  {bk.bookingStatus === 'confirmed' && (
                    <button
                      onClick={() => setReviewModalPkg({ id: bk.packageId, name: bk.packageName })}
                      className="px-3 py-2 bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 font-bold rounded-xl text-xs flex items-center gap-1"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-500" /> Rate Trip
                    </button>
                  )}

                  {bk.bookingStatus !== 'cancelled' && (
                    <button
                      onClick={() => onCancelBooking(bk.id)}
                      className="px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 font-bold rounded-xl text-xs"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* REVIEW TRIP MODAL */}
      {reviewModalPkg && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-slate-900">Rate & Review Your Trip</h3>
            <p className="text-xs text-slate-500">{reviewModalPkg.name}</p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-2 rounded-xl text-lg font-bold transition-transform hover:scale-110 ${
                        star <= rating ? 'text-amber-500' : 'text-slate-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-600">{rating} / 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Trip Feedback / Review</label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell other travelers about your experience with JourneyHub..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewModalPkg(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
