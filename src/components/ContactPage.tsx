import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, MessageSquare, ShieldCheck } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destination: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validate = () => {
    const err: Record<string, string> = {};
    if (!formData.name.trim()) err.name = 'Full name is required';
    if (!formData.email.trim()) {
      err.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      err.email = 'Please provide a valid email address';
    }
    if (!formData.message.trim()) {
      err.message = 'Please provide a short message or trip requirements';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        destination: '',
        message: '',
      });
      setErrors({});
    }, 400);
  };

  const officeLocations = [
    {
      city: 'Kochi Office (Kerala)',
      address: 'Marine Drive Road, Shanmugham Rd, Kochi, Kerala 682031',
      phone: '+91 484 238 9100 / +91 98470 12345',
      email: 'kerala@journeyhub.com',
    },
    {
      city: 'New Delhi Corporate Desk',
      address: 'Barakhamba Road, Connaught Place, New Delhi 110001',
      phone: '+91 11 4150 8800 / +91 98765 43210',
      email: 'delhi@journeyhub.com',
    },
    {
      city: 'Bangalore Regional Hub',
      address: 'Indiranagar 100ft Road, Bengaluru, Karnataka 560038',
      phone: '+91 80 4120 5500',
      email: 'bangalore@journeyhub.com',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <MessageSquare className="w-3.5 h-3.5" />
          Get In Touch
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Contact Our Travel Desk
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Have questions about an upcoming holiday or need a tailored family itinerary? Our experienced travel coordinators are ready to help you plan the perfect trip.
        </p>
      </div>

      {/* Main Grid: Form & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Information & Working Hours */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-6 shadow-xl relative overflow-hidden">
            <div className="space-y-2 relative z-10">
              <h2 className="text-xl font-bold">Central Travel Agency Desk</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect with our holiday specialists for package inquiries, honeymoon arrangements, and corporate group bookings.
              </p>
            </div>

            <div className="space-y-4 pt-2 text-xs relative z-10">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 text-amber-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px] block">Customer Support Phone</span>
                  <p className="font-semibold text-white mt-0.5">+91 98765 43210 / 1800-JOURNEY</p>
                  <p className="text-[11px] text-slate-400">Toll-free across India</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 text-emerald-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px] block">Inquiries & Bookings</span>
                  <p className="font-semibold text-white mt-0.5">support@journeyhub.com</p>
                  <p className="text-[11px] text-slate-400">Typical response within 4 business hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 text-sky-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px] block">Business Hours</span>
                  <p className="font-semibold text-white mt-0.5">Monday – Saturday: 9:00 AM – 8:00 PM IST</p>
                  <p className="text-[11px] text-slate-400">Sunday: 10:00 AM – 4:00 PM IST</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 relative z-10 flex items-center gap-2 text-[11px] text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Government Registered Travel Operator & IATA Verified</span>
            </div>
          </div>

          {/* Regional Offices */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Regional Branch Offices
            </h3>
            <div className="space-y-3">
              {officeLocations.map((loc, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1 text-xs"
                >
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                    {loc.city}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400">{loc.address}</p>
                  <div className="pt-1 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                    <span>{loc.phone}</span>
                    <span>•</span>
                    <span>{loc.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Inquiry Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Send Us an Inquiry</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Fill out the form below and an assigned travel consultant will get back to you with custom holiday options.
            </p>
          </div>

          {submitSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-start gap-3 text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Thank you for contacting JourneyHub!</p>
                <p className="text-slate-600 mt-0.5">
                  Your inquiry has been received. Our holiday consultant will reach out via phone or email shortly.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900 ${
                    errors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="e.g. rahul@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900 ${
                    errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Preferred Destination
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kerala, Rajasthan, Goa..."
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Your Message or Travel Requirements *
              </label>
              <textarea
                rows={4}
                placeholder="Tell us about your planned travel dates, number of travellers, hotel preferences, or any questions..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900 ${
                  errors.message ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {errors.message && <p className="text-[11px] text-red-500 mt-1">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-emerald-700 dark:hover:bg-emerald-800 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Sending Request...' : 'Submit Inquiry'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
