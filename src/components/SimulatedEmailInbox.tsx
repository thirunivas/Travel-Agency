import React, { useState } from 'react';
import { Mail, ShieldCheck, CheckCircle2, Download, Trash2, Inbox, ArrowLeft, Compass } from 'lucide-react';

export interface SimulatedEmail {
  id: string;
  to: string;
  subject: string;
  sentAt: string;
  type: 'verification' | 'booking' | 'reset';
  verificationCode?: string;
  bookingId?: string;
  bodyHtml: string;
}

interface Props {
  emails: SimulatedEmail[];
  onVerifyWithCode: (email: string, code: string) => void;
  onClearInbox: () => void;
}

export const SimulatedEmailInbox: React.FC<Props> = ({ emails, onVerifyWithCode, onClearInbox }) => {
  const [selectedEmail, setSelectedEmail] = useState<SimulatedEmail | null>(emails[0] || null);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center font-bold">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">JourneyHub Email Communications Inbox</h1>
            <p className="text-xs text-slate-500">
              Simulated Gmail inbox for customer verification codes, booking receipts, and travel updates.
            </p>
          </div>
        </div>

        {emails.length > 0 && (
          <button
            onClick={onClearInbox}
            className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold rounded-xl flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Inbox
          </button>
        )}
      </div>

      {emails.length === 0 ? (
        <div className="bg-white p-16 text-center rounded-3xl border border-slate-200 shadow-xs">
          <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-800">Your simulated inbox is empty</h3>
          <p className="text-xs text-slate-500 mt-1">
            Register a new customer account or make a booking to receive simulated emails here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Email List Column */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden divide-y divide-slate-100">
            <div className="p-4 bg-slate-50 font-black text-xs text-slate-700 uppercase tracking-wider">
              Inbox ({emails.length})
            </div>
            {emails.map((email) => (
              <div
                key={email.id}
                onClick={() => setSelectedEmail(email)}
                className={`p-4 cursor-pointer transition-all ${
                  selectedEmail?.id === email.id ? 'bg-blue-50/80 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
                  <span>To: {email.to}</span>
                  <span>{new Date(email.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-xs truncate">{email.subject}</h4>
              </div>
            ))}
          </div>

          {/* Email Preview Detail Column */}
          <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6">
            {selectedEmail ? (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-4">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider">
                    Official JourneyHub Communication
                  </span>
                  <h2 className="text-xl font-black text-slate-900 mt-2">{selectedEmail.subject}</h2>
                  <div className="text-xs text-slate-500 mt-1 flex justify-between">
                    <span>From: <strong>no-reply@journeyhub.com</strong></span>
                    <span>To: <strong>{selectedEmail.to}</strong></span>
                  </div>
                </div>

                {/* Email Body Rendering */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-4 text-slate-800 text-xs leading-relaxed">
                  <div className="flex items-center gap-2 text-blue-700 font-extrabold text-sm border-b border-slate-200 pb-3">
                    <Compass className="w-5 h-5 text-blue-600" />
                    <span>JourneyHub Travel Agency</span>
                  </div>

                  {selectedEmail.type === 'verification' && selectedEmail.verificationCode && (
                    <div className="space-y-3">
                      <p>Dear Valued Traveler,</p>
                      <p>Thank you for creating an account with JourneyHub. Please use the verification code below to verify your Gmail address:</p>

                      <div className="p-4 bg-blue-900 text-white rounded-2xl text-center space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-sky-300 block">Your Verification Code</span>
                        <span className="text-3xl font-mono font-black tracking-widest text-amber-400 block">{selectedEmail.verificationCode}</span>
                      </div>

                      <button
                        onClick={() => onVerifyWithCode(selectedEmail.to, selectedEmail.verificationCode!)}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <ShieldCheck className="w-4 h-4" /> Click to Instantly Verify Email Address
                      </button>
                    </div>
                  )}

                  {selectedEmail.type === 'booking' && (
                    <div className="space-y-3">
                      <p>Dear Valued Guest,</p>
                      <p>Your booking with JourneyHub has been successfully confirmed!</p>
                      <p><strong>Booking Reference:</strong> {selectedEmail.bookingId}</p>
                      <p>You can download your official JourneyHub Travel Receipt PDF directly from your customer dashboard.</p>
                    </div>
                  )}

                  {selectedEmail.type === 'reset' && (
                    <div className="space-y-3">
                      <p>Password reset instructions for {selectedEmail.to}. Use your initial account password to sign in.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                Select an email from the left list to view content.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
