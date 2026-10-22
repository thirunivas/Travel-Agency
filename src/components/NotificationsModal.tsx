import React from 'react';
import { AppNotification, NavTab } from '../types';
import { X, Bell, CheckCircle2, Tag, Info, Clock, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onSelectNotification: (item: AppNotification) => void;
}

export const NotificationsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectNotification,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <CheckCircle2 className="w-4 h-4 text-[#159B72]" />;
      case 'offer':
        return <Tag className="w-4 h-4 text-[#FF9B54]" />;
      default:
        return <Info className="w-4 h-4 text-[#087EAB]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden shadow-2xl flex flex-col my-auto max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#12304A] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#FFD166]" />
            <div>
              <h3 className="text-base font-bold">Notifications</h3>
              <p className="text-[10px] text-slate-300">JourneyHub Travel Desk & Trip Alerts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-2.5 bg-[#F4F8FB] dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Recent Updates ({notifications.length})</span>
          <button
            onClick={onMarkAllAsRead}
            className="text-[#087EAB] dark:text-[#56C7EA] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" /> Mark all read
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No new notifications right now.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  onSelectNotification(n);
                  onClose();
                }}
                className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors flex items-start gap-3 ${
                  !n.read ? 'bg-[#E5F6FC]/40 dark:bg-slate-800/80 font-medium' : ''
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center shrink-0 shadow-xs">
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-[#12304A] dark:text-white truncate">
                      {n.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {n.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center shrink-0">
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-[#087EAB]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
