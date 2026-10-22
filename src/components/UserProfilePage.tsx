import React, { useState } from 'react';
import { UserProfile, Booking } from '../types';
import { User, Mail, Phone, Calendar, ShieldCheck, Edit3, Save, Check, MapPin, Compass } from 'lucide-react';

interface Props {
  currentUser: UserProfile | null;
  bookings: Booking[];
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onNavigateToTrips: () => void;
  onOpenAuth: () => void;
}

export const UserProfilePage: React.FC<Props> = ({
  currentUser,
  bookings,
  onUpdateProfile,
  onNavigateToTrips,
  onOpenAuth,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6 animate-in fade-in duration-300">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shadow-sm">
          <User className="w-8 h-8 text-slate-800 dark:text-emerald-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Traveller Profile
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            Sign in to your JourneyHub account to manage personal contact details, review loyalty rewards, and check your trip history.
          </p>
        </div>
        <button
          onClick={onOpenAuth}
          className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  // Filter bookings strictly for current user
  const userBookings = bookings.filter(
    (b) =>
      (b.customerEmail && b.customerEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim()) ||
      (b.customerId && b.customerId === currentUser.id)
  );

  const now = new Date();
  const upcomingTrips = userBookings.filter((b) => new Date(b.travelDate) >= now || b.bookingStatus === 'confirmed');
  const pastTrips = userBookings.filter((b) => new Date(b.travelDate) < now && b.bookingStatus !== 'confirmed');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onUpdateProfile({
      name: name.trim(),
      phone: phone.trim(),
    });

    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
            <User className="w-4 h-4" />
            <span>Account Details</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Traveller Profile
          </h1>
        </div>

        <div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setIsEditing(false);
                setName(currentUser.name);
                setPhone(currentUser.phone);
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2 text-xs font-semibold">
          <Check className="w-4 h-4 text-emerald-600" />
          Profile information updated successfully!
        </div>
      )}

      {/* Main Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-20 h-20 rounded-3xl bg-slate-900 text-white flex items-center justify-center text-2xl font-black shadow-md">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
              {currentUser.name}
              <ShieldCheck className="w-4 h-4 text-emerald-600" title="Verified Customer" />
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{currentUser.email}</p>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              {currentUser.role === 'admin' ? 'Agency Administrator' : 'Registered Traveller'}
            </span>
          </div>
        </div>

        {/* Profile Details or Edit Form */}
        {!isEditing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Full Name
              </span>
              <p className="font-bold text-slate-900 dark:text-white">{currentUser.name}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email Address
              </span>
              <p className="font-bold text-slate-900 dark:text-white">{currentUser.email}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> Contact Phone
              </span>
              <p className="font-bold text-slate-900 dark:text-white">{currentUser.phone || 'Not specified'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Member Since
              </span>
              <p className="font-bold text-slate-900 dark:text-white">
                {new Date(currentUser.createdAt || '2026-01-01').toLocaleDateString('en-IN', {
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Trips Activity Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Upcoming Trips Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Upcoming Trips</h3>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
              {upcomingTrips.length} Active
            </span>
          </div>

          {upcomingTrips.length === 0 ? (
            <p className="text-xs text-slate-500 py-4">No upcoming trips scheduled currently.</p>
          ) : (
            <div className="space-y-2">
              {upcomingTrips.slice(0, 2).map((t) => (
                <div key={t.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block">{t.packageName}</span>
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>{t.destination}</span>
                    <span>{t.travelDate}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={onNavigateToTrips}
            className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
          >
            View All in My Trips
          </button>
        </div>

        {/* Past Trips Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Past Vacations</h3>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              {pastTrips.length} Completed
            </span>
          </div>

          {pastTrips.length === 0 ? (
            <p className="text-xs text-slate-500 py-4">No past trip records found for this account.</p>
          ) : (
            <div className="space-y-2">
              {pastTrips.slice(0, 2).map((t) => (
                <div key={t.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block">{t.packageName}</span>
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>{t.destination}</span>
                    <span>{t.travelDate}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={onNavigateToTrips}
            className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
          >
            Review Booking History
          </button>
        </div>
      </div>
    </div>
  );
};
