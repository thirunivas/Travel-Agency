import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  X,
  User,
  Compass,
  ArrowRight,
  PhoneCall,
  Calendar,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { UserProfile, Booking, TourPackage } from '../types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionTag?: {
    label: string;
    targetTab: string;
  };
}

interface Props {
  onNavigate: (tab: string) => void;
  currentUser?: UserProfile | null;
  bookings?: Booking[];
  packages?: TourPackage[];
  userName?: string;
  isOpenControlled?: boolean;
  onToggleControlled?: () => void;
}

export const FloatingAiAssistant: React.FC<Props> = ({
  onNavigate,
  currentUser,
  bookings = [],
  packages = [],
  userName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const effectiveUserName = currentUser?.name || userName || 'Traveler';

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = sessionStorage.getItem('jh_assistant_chat_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return [
      {
        id: 'msg-welcome',
        role: 'assistant',
        text: `Hello ${effectiveUserName}! Welcome to JourneyHub. I am your personal **Travel Assistant**.\n\nWhether you need destination recommendations, package highlights (Kerala, Goa, Rajasthan, and more), or help planning a customized family or honeymoon vacation, I am here to help.\n\nHow can I assist your travel plans today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sessionStorage.setItem('jh_assistant_chat_messages', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const quickQuestions = [
    'Which package is best for a family trip?',
    'Tell me about the Kerala holiday package.',
    'Recommend a romantic honeymoon destination.',
    'How do I view my booked trips and receipts?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
          userContext: {
            isLoggedIn: !!currentUser,
            userName: effectiveUserName,
            userEmail: currentUser?.email || 'Guest',
          },
        }),
      });

      const data = await response.json();
      let replyText =
        data.reply ||
        'I would love to help you plan your journey! You can browse our handpicked tour packages or reach our travel desk anytime at support@journeyhub.com.';

      let actionTag: { label: string; targetTab: string } | undefined;
      const lower = query.toLowerCase();
      if (lower.includes('package') || lower.includes('tour') || lower.includes('book')) {
        actionTag = { label: 'Browse Packages', targetTab: 'packages' };
      } else if (lower.includes('destination') || lower.includes('kerala') || lower.includes('rajasthan')) {
        actionTag = { label: 'Explore Destinations', targetTab: 'destinations' };
      } else if (lower.includes('trip') || lower.includes('booking') || lower.includes('receipt') || lower.includes('voucher')) {
        actionTag = { label: 'Open My Trips', targetTab: 'my-trips' };
      } else if (lower.includes('contact') || lower.includes('phone') || lower.includes('office')) {
        actionTag = { label: 'Contact Travel Desk', targetTab: 'contact' };
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionTag,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text:
          'Based on popular traveler requests, our **Kerala Backwaters & Munnar Hills (5 Days / 4 Nights)** is our top recommended family getaway, featuring private houseboats and scenic tea plantations starting from ₹22,499/person. For royal heritage, our **Rajasthan Forts & Desert Safari** is unforgettable.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionTag: { label: 'Browse Packages', targetTab: 'packages' },
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Discreet Trigger Button at Bottom-Right (Requirement 11) */}
      {!isOpen && (
        <button
          id="travel-assistant-btn"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-xl border border-slate-700/60 flex items-center gap-2.5 transition-all hover:scale-105 group"
          title="Open Travel Assistant"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-xs font-bold block leading-tight">Travel Assistant</span>
            <span className="text-[10px] text-emerald-400 font-medium">Online • Trip Advice</span>
          </div>
        </button>
      )}

      {/* Floating Travel Assistant Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] max-h-[600px] h-[550px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
                <Compass className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold flex items-center gap-1.5">
                  Travel Assistant
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                </h3>
                <p className="text-[11px] text-slate-300">JourneyHub Holiday Consultant</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/60 dark:bg-slate-900/60">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-[13px] leading-relaxed ${
                      isUser
                        ? 'bg-slate-900 text-white rounded-br-xs shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 rounded-bl-xs shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {msg.actionTag && (
                      <button
                        onClick={() => {
                          onNavigate(msg.actionTag!.targetTab);
                          setIsOpen(false);
                        }}
                        className="mt-2.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1 hover:bg-emerald-100 transition-colors"
                      >
                        <span>{msg.actionTag.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}

                    <span className="text-[10px] text-slate-400 block text-right mt-1">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-xs p-3 text-xs text-slate-500 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
                  <span>Consulting destination guide...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions pills */}
          <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] whitespace-nowrap transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about destinations, packages, or booking..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
