import React, { useState } from 'react';
import { TourPackage, Booking, UserProfile, Offer, Review } from '../types';
import { generateJourneyHubReceiptPDF } from '../utils/pdfGenerator';
import { Users, Compass, Calendar, IndianRupee, Clock, CheckCircle2, XCircle, Plus, Edit, Trash2, Download, ShieldCheck, Tag, Star, FileSpreadsheet, Search, RefreshCw } from 'lucide-react';

interface Props {
  packages: TourPackage[];
  bookings: Booking[];
  users: UserProfile[];
  offers: Offer[];
  reviews: Review[];
  onAddPackage: (pkg: TourPackage) => void;
  onUpdatePackage: (pkg: TourPackage) => void;
  onDeletePackage: (pkgId: string) => void;
  onApproveBooking: (bookingId: string) => void;
  onCancelBooking: (bookingId: string) => void;
  onAddOffer: (offer: Offer) => void;
}

export const AdminDashboard: React.FC<Props> = ({
  packages,
  bookings,
  users,
  offers,
  reviews,
  onAddPackage,
  onUpdatePackage,
  onDeletePackage,
  onApproveBooking,
  onCancelBooking,
  onAddOffer,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'packages' | 'bookings' | 'customers' | 'offers' | 'reviews'>('overview');

  // New Package Modal state
  const [isAddPkgOpen, setIsAddPkgOpen] = useState(false);
  const [pkgName, setPkgName] = useState('');
  const [pkgDest, setPkgDest] = useState('');
  const [pkgState, setPkgState] = useState('');
  const [pkgCountry, setPkgCountry] = useState('India');
  const [pkgDuration, setPkgDuration] = useState('5 Days / 4 Nights');
  const [pkgHotel, setPkgHotel] = useState('5-Star Luxury Resort');
  const [pkgTransport, setPkgTransport] = useState('Private AC SUV');
  const [pkgMeals, setPkgMeals] = useState('Breakfast & Dinner Included');
  const [pkgPriceInr, setPkgPriceInr] = useState<number>(24999);
  const [pkgCategory, setPkgCategory] = useState<'Honeymoon' | 'Adventure' | 'Heritage' | 'Beach' | 'Wildlife' | 'Family' | 'Luxury'>('Honeymoon');
  const [pkgImg, setPkgImg] = useState('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000');
  const [pkgDesc, setPkgDesc] = useState('Unforgettable travel experience with JourneyHub.');

  // Statistics
  const totalCustomers = users.filter((u) => u.role === 'customer').length;
  const totalPackages = packages.length;
  const totalBookings = bookings.length;
  const monthlyRevenueInr = bookings
    .filter((b) => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.grandTotalInr, 0);
  const upcomingTrips = bookings.filter((b) => b.bookingStatus === 'confirmed').length;
  const pendingBookings = bookings.filter((b) => b.bookingStatus === 'pending').length;
  const cancelledBookings = bookings.filter((b) => b.bookingStatus === 'cancelled').length;

  const handleCreatePackageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPkg: TourPackage = {
      id: `pkg-${Date.now()}`,
      name: pkgName,
      destination: pkgDest,
      state: pkgState,
      country: pkgCountry,
      duration: pkgDuration,
      hotel: pkgHotel,
      transport: pkgTransport,
      mealsIncluded: pkgMeals,
      priceInr: pkgPriceInr,
      availableSeats: 20,
      galleryImages: [pkgImg],
      description: pkgDesc,
      itinerary: [
        { day: 1, title: 'Arrival & Welcome', details: 'Airport pickup and hotel check-in.' },
        { day: 2, title: 'Sightseeing & Excursions', details: 'Guided tours of key landmarks.' },
      ],
      category: pkgCategory,
      rating: 5.0,
      reviewsCount: 1,
    };
    onAddPackage(newPkg);
    setIsAddPkgOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Administrator Operations Panel</span>
          </div>
          <h1 className="text-2xl font-black">JourneyHub Travel Agency Management</h1>
          <p className="text-xs text-slate-300 mt-1">Manage tour packages, customer bookings, revenue logs, and promotions.</p>
        </div>

        <button
          onClick={() => setIsAddPkgOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Tour Package
        </button>
      </div>

      {/* 7 DASHBOARD STAT CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <Users className="w-5 h-5 text-blue-600 mb-2" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Customers</span>
          <span className="text-xl font-black text-slate-900">{totalCustomers}</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <Compass className="w-5 h-5 text-indigo-600 mb-2" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tour Packages</span>
          <span className="text-xl font-black text-slate-900">{totalPackages}</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <Calendar className="w-5 h-5 text-sky-600 mb-2" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Bookings</span>
          <span className="text-xl font-black text-slate-900">{totalBookings}</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <IndianRupee className="w-5 h-5 text-emerald-600 mb-2" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Monthly Revenue</span>
          <span className="text-lg font-black text-emerald-700">₹{monthlyRevenueInr.toLocaleString('en-IN')}</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-2" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Upcoming Trips</span>
          <span className="text-xl font-black text-slate-900">{upcomingTrips}</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <Clock className="w-5 h-5 text-amber-600 mb-2" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Bookings</span>
          <span className="text-xl font-black text-slate-900">{pendingBookings}</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <XCircle className="w-5 h-5 text-red-600 mb-2" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cancelled</span>
          <span className="text-xl font-black text-slate-900">{cancelledBookings}</span>
        </div>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-1 overflow-x-auto">
        {(['overview', 'packages', 'bookings', 'customers', 'offers', 'reviews'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wider whitespace-nowrap ${
              activeSubTab === tab
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* SUB TAB: TOUR PACKAGES MANAGEMENT */}
      {(activeSubTab === 'overview' || activeSubTab === 'packages') && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-lg">Tour Packages Directory</h3>
            <button
              onClick={() => setIsAddPkgOpen(true)}
              className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Package
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-3 rounded-l-xl">Package Name</th>
                  <th className="p-3">Destination</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price (₹)</th>
                  <th className="p-3">Seats</th>
                  <th className="p-3 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                      <img src={pkg.galleryImages[0]} alt="" className="w-8 h-8 rounded-lg object-cover" />
                      <span>{pkg.name}</span>
                    </td>
                    <td className="p-3 text-slate-600">{pkg.destination}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold uppercase text-[10px]">
                        {pkg.category}
                      </span>
                    </td>
                    <td className="p-3 font-extrabold text-blue-700">₹{pkg.priceInr.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-slate-600">{pkg.availableSeats}</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => onDeletePackage(pkg.id)}
                        className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg"
                        title="Delete Package"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB TAB: BOOKINGS MANAGEMENT */}
      {(activeSubTab === 'overview' || activeSubTab === 'bookings') && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4">
          <h3 className="font-black text-slate-900 text-lg">All Customer Bookings</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-3 rounded-l-xl">Booking ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Package & Destination</th>
                  <th className="p-3">Travel Date</th>
                  <th className="p-3">Total Paid (₹)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right rounded-r-xl">Receipt & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {bookings.map((bk) => (
                  <tr key={bk.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-mono font-bold text-slate-900">{bk.id}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{bk.customerName}</div>
                      <div className="text-[10px] text-slate-400">{bk.customerEmail}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-slate-800">{bk.packageName}</div>
                      <div className="text-[10px] text-slate-500">{bk.destination}</div>
                    </td>
                    <td className="p-3 font-semibold text-slate-700">{bk.travelDate}</td>
                    <td className="p-3 font-extrabold text-blue-700">₹{bk.grandTotalInr.toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          bk.bookingStatus === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : bk.bookingStatus === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {bk.bookingStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <button
                        onClick={() => generateJourneyHubReceiptPDF(bk)}
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-lg"
                        title="Download Receipt PDF"
                      >
                        <Download className="w-3.5 h-3.5 inline" /> PDF
                      </button>

                      {bk.bookingStatus === 'pending' && (
                        <button
                          onClick={() => onApproveBooking(bk.id)}
                          className="px-2 py-1 bg-emerald-600 text-white font-bold rounded-lg text-[10px]"
                        >
                          Approve
                        </button>
                      )}

                      {bk.bookingStatus !== 'cancelled' && (
                        <button
                          onClick={() => onCancelBooking(bk.id)}
                          className="px-2 py-1 bg-red-100 text-red-700 hover:bg-red-200 font-bold rounded-lg text-[10px]"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD TOUR PACKAGE */}
      {isAddPkgOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-black text-slate-900">Add New Tour Package</h3>

            <form onSubmit={handleCreatePackageSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Package Name</label>
                <input
                  type="text"
                  required
                  value={pkgName}
                  onChange={(e) => setPkgName(e.target.value)}
                  placeholder="e.g. Manali Snow Expedition"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Destination</label>
                  <input
                    type="text"
                    required
                    value={pkgDest}
                    onChange={(e) => setPkgDest(e.target.value)}
                    placeholder="e.g. Manali & Solang Valley"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">State / Province</label>
                  <input
                    type="text"
                    required
                    value={pkgState}
                    onChange={(e) => setPkgState(e.target.value)}
                    placeholder="e.g. Himachal Pradesh"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Price per Person (₹)</label>
                  <input
                    type="number"
                    required
                    value={pkgPriceInr}
                    onChange={(e) => setPkgPriceInr(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={pkgCategory}
                    onChange={(e) => setPkgCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    <option value="Honeymoon">Honeymoon</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Heritage">Heritage</option>
                    <option value="Beach">Beach</option>
                    <option value="Wildlife">Wildlife</option>
                    <option value="Family">Family</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Banner Image URL</label>
                <input
                  type="url"
                  required
                  value={pkgImg}
                  onChange={(e) => setPkgImg(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={pkgDesc}
                  onChange={(e) => setPkgDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddPkgOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
                >
                  Create Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
