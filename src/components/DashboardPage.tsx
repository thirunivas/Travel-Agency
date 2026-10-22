import React, { useState } from 'react';
import {
  UserProfile,
  Booking,
  TourPackage,
  Offer,
} from '../types';
import {
  LayoutDashboard,
  User,
  Sparkles,
  Settings,
  HelpCircle,
  LogOut,
  Calendar,
  CreditCard,
  Download,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  PlusCircle,
  ArrowRight,
  Filter,
  ShieldCheck,
  Bell,
  Sun,
  Moon,
  ChevronRight,
  TrendingUp,
  MapPin,
  Compass,
  Phone,
  Mail,
  Eye,
  Milestone,
  Route,
} from 'lucide-react';
import { generateJourneyHubInvoicePdf } from '../utils/pdfGenerator';
import { JourneyRoadmap } from './JourneyRoadmap';

interface Props {
  currentUser: UserProfile;
  bookings: Booking[];
  packages: TourPackage[];
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onLogout: () => void;
  onBookPackage: (pkg: TourPackage) => void;
  onOpenAiAssistant: () => void;
  onNavigateToServices: () => void;
}

export const DashboardPage: React.FC<Props> = ({
  currentUser,
  bookings,
  packages,
  theme,
  onToggleTheme,
  onLogout,
  onBookPackage,
  onOpenAiAssistant,
  onNavigateToServices,
}) => {
  const [sidebarTab, setSidebarTab] = useState<'dashboard' | 'roadmap' | 'profile' | 'features' | 'settings' | 'help'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<Booking | null>(null);

  // Settings states
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [currencyPref, setCurrencyPref] = useState<'INR' | 'USD'>('INR');

  // Filter bookings for user
  const userBookings = currentUser.role === 'admin'
    ? bookings
    : bookings.filter((b) =>
        (b.customerEmail && b.customerEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
        (b.customerId && b.customerId === currentUser.id)
      );

  const filteredBookings = userBookings.filter((b) => {
    const matchesSearch =
      b.packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.bookingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate high-impact statistics
  const totalBookingsCount = userBookings.length;
  const activeToursCount = userBookings.filter((b) => b.bookingStatus === 'confirmed' || b.bookingStatus === 'pending').length;
  const totalSpentInr = userBookings.reduce((sum, b) => (b.bookingStatus !== 'cancelled' ? sum + (b.grandTotalInr || 0) : sum), 0);
  const loyaltyPoints = Math.floor(totalSpentInr / 500);

  // Recent activity logs
  const activityLogs = [
    {
      id: 'act-1',
      title: 'Successful Login',
      desc: `Logged in as ${currentUser.name} (${currentUser.role})`,
      time: 'Just now',
      type: 'auth',
      icon: CheckCircle2,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60',
    },
    ...(userBookings.slice(0, 3).map((b) => ({
      id: `act-${b.id}`,
      title: `Booking ${b.bookingStatus.toUpperCase()}: ${b.packageName}`,
      desc: `Travel ID ${b.id} • ₹${(b.grandTotalInr || 0).toLocaleString('en-IN')}`,
      time: b.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'Recent',
      type: 'booking',
      icon: Calendar,
      color: b.bookingStatus === 'confirmed' ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60' : 'text-amber-500 bg-amber-50 dark:bg-amber-950/60',
    }))),
    {
      id: 'act-qr',
      title: 'Digital PDF Verification QR Active',
      desc: 'Instant QR code generation validated for all trip passes.',
      time: 'Today',
      type: 'system',
      icon: ShieldCheck,
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* ========================================================================= */}
        {/* SIDEBAR NAVIGATION (Requirement 4 & 5) */}
        {/* ========================================================================= */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
          {/* User mini-card in sidebar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-sm flex-shrink-0">
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt="" className="w-full h-full object-cover rounded-xl" />
              ) : (
                currentUser.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="overflow-hidden">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate flex items-center gap-1">
                {currentUser.name}
                {currentUser.isEmailVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 capitalize truncate">
                {currentUser.role} Account
              </p>
            </div>
          </div>

          {/* Navigation Items List */}
          <nav className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1.5">
            <button
              onClick={() => setSidebarTab('dashboard')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                sidebarTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setSidebarTab('roadmap')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                sidebarTab === 'roadmap'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
                <span>Journey Roadmap</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 text-[9px] font-extrabold uppercase">
                Live
              </span>
            </button>

            <button
              onClick={() => setSidebarTab('profile')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                sidebarTab === 'profile'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setSidebarTab('features')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                sidebarTab === 'features'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4" />
                <span>Features & Tours</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setSidebarTab('settings')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                sidebarTab === 'settings'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setSidebarTab('help')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                sidebarTab === 'help'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4" />
                <span>Help & FAQ</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </nav>

          {/* Quick AI Assistance Promo card in Sidebar */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 rounded-2xl border border-indigo-700/50 shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
              <h4 className="text-xs font-bold">Google Gemini AI</h4>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Need personalized recommendations or help navigating your workspace?
            </p>
            <button
              onClick={onOpenAiAssistant}
              className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              Ask AI Assistant <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* MAIN DASHBOARD CONTENT AREA */}
        {/* ========================================================================= */}
        <main className="flex-1 space-y-8">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {sidebarTab === 'dashboard' && (
            <>
              {/* Header Greeting & Quick Actions Toolbar */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">
                    <Compass className="w-4 h-4 animate-spin-slow" />
                    JourneyHub Workspace
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Welcome back, {currentUser.name}!
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Here is your real-time travel performance, trip bookings, and automated receipt hub.
                  </p>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap gap-2.5 items-center">
                  <button
                    onClick={onNavigateToServices}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all"
                  >
                    <PlusCircle className="w-4 h-4" /> Book New Tour
                  </button>

                  <button
                    onClick={onOpenAiAssistant}
                    className="px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 text-xs font-bold flex items-center gap-2 border border-indigo-200 dark:border-indigo-800 transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" /> AI Concierge
                  </button>
                </div>
              </div>

              {/* Statistics / Key Metric Cards (Requirement 4) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Bookings</span>
                    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">{totalBookingsCount}</h3>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Synchronized with cloud
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Active Tours</span>
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">{activeToursCount}</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                      Confirmed & In-Progress
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Spent (₹)</span>
                    <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <CreditCard className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">₹{totalSpentInr.toLocaleString('en-IN')}</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                      Indian Rupee (INR)
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Reward Points</span>
                    <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">{loyaltyPoints} pts</h3>
                    <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-0.5">
                      Tier: Silver Traveler
                    </p>
                  </div>
                </div>
              </div>

              {/* Journey Roadmap: Chronological Timeline with Status Markers */}
              <JourneyRoadmap
                booking={userBookings.find((b) => b.bookingStatus === 'confirmed' || b.bookingStatus === 'pending') || userBookings[0]}
                allBookings={userBookings}
                packages={packages}
                onSelectBooking={(b) => setSelectedBookingForDetails(b)}
                onOpenAiForDay={(dayNum, dayTitle, pkgName) => {
                  onOpenAiAssistant();
                }}
              />

              {/* Data Table Section: Bookings & Digital PDF Receipts (Requirement 4) */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Bookings & Travel Records</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Manage, filter, and download verified PDF receipts with embedded QR codes.
                    </p>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search destination, ID..."
                        className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                      />
                    </div>

                    <select
                      value={statusFilter}
                      onChange={(e: any) => setStatusFilter(e.target.value)}
                      className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white font-semibold"
                    >
                      <option value="all">All Statuses</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="px-4 py-3.5">Booking ID</th>
                        <th className="px-4 py-3.5">Tour Destination</th>
                        <th className="px-4 py-3.5">Travel Dates</th>
                        <th className="px-4 py-3.5">Amount (₹)</th>
                        <th className="px-4 py-3.5">Status</th>
                        <th className="px-4 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-800 dark:text-slate-200">
                      {filteredBookings.length > 0 ? (
                        filteredBookings.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="px-4 py-3.5 font-bold font-mono text-blue-600 dark:text-blue-400">
                              {b.id}
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="font-bold text-slate-900 dark:text-white">{b.packageName}</div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-red-400" /> {b.destination}
                              </div>
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap">
                              <div>{b.travelDate}</div>
                              <div className="text-[11px] text-slate-500">
                                {b.adults} Adults {b.children > 0 ? `• ${b.children} Children` : ''}
                              </div>
                            </td>
                            <td className="px-4 py-3.5 font-bold whitespace-nowrap">
                              ₹{(b.grandTotalInr || 0).toLocaleString('en-IN')}
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  b.bookingStatus === 'confirmed'
                                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                                    : b.bookingStatus === 'pending'
                                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                                    : 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800'
                                }`}
                              >
                                {b.bookingStatus}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-right whitespace-nowrap space-x-2">
                              <button
                                onClick={() => setSelectedBookingForDetails(b)}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition-colors inline-flex items-center gap-1"
                                title="View Details"
                              >
                                <Eye className="w-3 h-3" /> View
                              </button>

                              <button
                                onClick={() => generateJourneyHubInvoicePdf(b)}
                                className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors inline-flex items-center gap-1 shadow-xs"
                                title="Download PDF with QR"
                              >
                                <Download className="w-3 h-3" /> PDF
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-4 py-10 text-center text-slate-500 dark:text-slate-400">
                            <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                            No booking records found matching your filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Activity Feed (Requirement 4) */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    Recent Workspace Activities
                  </h3>
                  <span className="text-[11px] text-slate-500 font-semibold">Real-time event stream</span>
                </div>

                <div className="space-y-3">
                  {activityLogs.map((act) => {
                    const Icon = act.icon;
                    return (
                      <div
                        key={act.id}
                        className="flex items-start justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-800"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${act.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{act.title}</h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{act.desc}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 whitespace-nowrap ml-2">
                          {act.time}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* TAB: JOURNEY ROADMAP DEDICATED VIEW */}
          {sidebarTab === 'roadmap' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <JourneyRoadmap
                booking={userBookings.find((b) => b.bookingStatus === 'confirmed' || b.bookingStatus === 'pending') || userBookings[0]}
                allBookings={userBookings}
                packages={packages}
                onSelectBooking={(b) => setSelectedBookingForDetails(b)}
                onOpenAiForDay={(dayNum, dayTitle, pkgName) => {
                  onOpenAiAssistant();
                }}
              />
            </div>
          )}

          {/* TAB 2: PROFILE SECTION (Requirement 5) */}
          {sidebarTab === 'profile' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-8 animate-in fade-in">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">User Profile & Credentials</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage your account information and preferences.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="w-20 h-20 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-md">
                  {currentUser.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt="" className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    currentUser.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
                    {currentUser.name}
                    {currentUser.isEmailVerified && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                        Verified
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{currentUser.email}</p>
                  <p className="text-[11px] text-slate-400">Account Type: <span className="font-bold uppercase text-blue-600 dark:text-blue-400">{currentUser.role}</span></p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">Full Name</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{currentUser.name}</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">Email Address</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{currentUser.email}</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">Phone Number</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{currentUser.phone || '+91 98765 43210'}</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">Member Since</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">July 2026</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FEATURES & TOURS (Requirement 5) */}
          {sidebarTab === 'features' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Holiday Tour Packages</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Direct booking catalog with all-inclusive pricing in INR (₹).
                  </p>
                </div>
                <button
                  onClick={onNavigateToServices}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors"
                >
                  Full Catalog View
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {packages.slice(0, 4).map((pkg) => (
                  <div
                    key={pkg.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between"
                  >
                    <div className="h-40 relative overflow-hidden">
                      <img
                        src={pkg.galleryImages[0]}
                        alt={pkg.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold">
                        {pkg.category}
                      </span>
                    </div>

                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">{pkg.name}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-red-500" /> {pkg.destination}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">Price Per Person</span>
                          <span className="text-base font-black text-blue-600 dark:text-blue-400">
                            ₹{pkg.priceInr.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <button
                          onClick={() => onBookPackage(pkg)}
                          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS (Requirement 5) */}
          {sidebarTab === 'settings' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-8 animate-in fade-in">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Workspace Preferences & Settings</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Configure appearance, notifications, and localization.</p>
              </div>

              <div className="space-y-4">
                {/* Dark / Light Mode Switch */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center">
                      {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Theme Mode</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Currently set to {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
                    </div>
                  </div>
                  <button
                    onClick={onToggleTheme}
                    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-xs font-bold text-slate-800 dark:text-white transition-colors"
                  >
                    Switch to {theme === 'dark' ? 'Light' : 'Dark'}
                  </button>
                </div>

                {/* Notifications Switch */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300 flex items-center justify-center">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Booking Email Confirmations</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Receive instant itinerary PDF updates via email</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: HELP & FAQ (Requirement 5) */}
          {sidebarTab === 'help' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 animate-in fade-in">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Help & Knowledge Base</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Instant answers and support shortcuts.</p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">How do I download my PDF receipt?</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Click the <strong>Dashboard</strong> tab, find your tour booking in the records table, and click the <strong>PDF</strong> button. It will immediately generate an official receipt complete with a QR code.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">How do I ask the Google AI Assistant?</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Click the floating glowing <strong>AI Assistant</strong> button in the bottom-right corner of any screen to get 24/7 answers, package recommendations, or navigation help.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <p className="text-xs text-slate-500">Need further assistance?</p>
                <button
                  onClick={onOpenAiAssistant}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Launch AI Chatbot
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal for Booking Details */}
      {selectedBookingForDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Booking Voucher Details
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedBookingForDetails.packageName}</h3>
              </div>
              <button
                onClick={() => setSelectedBookingForDetails(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 font-semibold">Booking ID:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedBookingForDetails.id}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 font-semibold">Traveler Name:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedBookingForDetails.customerName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 font-semibold">Travel Date:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedBookingForDetails.travelDate}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 font-semibold">Total Paid (₹):</span>
                <span className="font-black text-blue-600 dark:text-blue-400 text-sm">
                  ₹{(selectedBookingForDetails.grandTotalInr || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => generateJourneyHubInvoicePdf(selectedBookingForDetails)}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download PDF Receipt
              </button>
              <button
                onClick={() => setSelectedBookingForDetails(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
