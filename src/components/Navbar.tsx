import React, { useState } from 'react';
import { UserProfile, NavTab } from '../types';
import {
  Compass,
  MapPin,
  Package,
  Info,
  Phone,
  LogIn,
  UserPlus,
  LogOut,
  Menu,
  X,
  Luggage,
  User,
  ChevronDown,
  Bell,
  Plane,
  Train,
  Bus,
  Hotel,
} from 'lucide-react';

interface Props {
  currentUser: UserProfile | null;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onLogout: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  myTripsCount?: number;
  unreadNotificationsCount?: number;
  onOpenNotifications?: () => void;
}

export const Navbar: React.FC<Props> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onLogout,
  onOpenAuth,
  myTripsCount = 0,
  unreadNotificationsCount = 0,
  onOpenNotifications,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isBusesDropdownOpen, setIsBusesDropdownOpen] = useState(false);

  const mainNavLinks: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'destinations', label: 'Destinations', icon: MapPin },
    { id: 'packages', label: 'Packages', icon: Package },
    { id: 'flights', label: 'Flights', icon: Plane },
    { id: 'trains', label: 'Trains', icon: Train },
    { id: 'hotels', label: 'Hotels', icon: Hotel },
  ];

  const handleNavClick = (tabId: NavTab) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
    setIsBusesDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#12304A]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Agency Identity: JourneyHub – Discover Incredible India */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#087EAB] to-[#087F65] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 text-[#FFD166]" />
            </div>
            <div>
              <div className="flex items-center gap-1 leading-none">
                <span className="text-xl font-black tracking-tight text-[#12304A] dark:text-white">
                  Journey
                </span>
                <span className="text-xl font-black tracking-tight text-[#087EAB] dark:text-[#56C7EA]">
                  Hub
                </span>
              </div>
              <p className="text-[10px] font-bold text-[#159B72] tracking-wider uppercase mt-0.5">
                Discover Incredible India
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 bg-[#F4F8FB] dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200/70 dark:border-slate-700/60">
            {mainNavLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-slate-700 text-[#087EAB] dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-[#087EAB] dark:hover:text-white hover:bg-white/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Buses Dropdown Menu (All Buses, KSRTC Kerala, SETC Tamil Nadu) */}
            <div className="relative">
              <button
                onClick={() => setIsBusesDropdownOpen(!isBusesDropdownOpen)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'buses' || activeTab === 'ksrtc' || activeTab === 'setc'
                    ? 'bg-white dark:bg-slate-700 text-[#087EAB] dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#087EAB]'
                }`}
              >
                <Bus className="w-3.5 h-3.5" />
                <span>Buses</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isBusesDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-2 z-50 text-xs">
                  <button
                    onClick={() => handleNavClick('buses')}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/60 font-semibold flex items-center justify-between"
                  >
                    <span>All Bus Routes</span>
                    <span className="text-[10px] text-slate-400">Govt & Pvt</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('ksrtc')}
                    className="w-full text-left px-4 py-2 hover:bg-[#DFF7EE] dark:hover:bg-slate-700/60 font-bold text-[#087F65] flex items-center justify-between"
                  >
                    <span>🌴 KSRTC – Kerala</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">Govt</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('setc')}
                    className="w-full text-left px-4 py-2 hover:bg-[#E5F6FC] dark:hover:bg-slate-700/60 font-bold text-[#087EAB] flex items-center justify-between"
                  >
                    <span>🌊 SETC – Tamil Nadu</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-100 text-sky-800">Govt</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Icons & User Account */}
          <div className="flex items-center gap-2.5">
            {/* Notification Bell */}
            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-[#087EAB] transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF7165] text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            )}

            {/* My Trips Shortcut Button */}
            <button
              onClick={() => handleNavClick('my-trips')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                activeTab === 'my-trips'
                  ? 'bg-[#087EAB] text-white border-[#087EAB]'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#087EAB]'
              }`}
            >
              <Luggage className="w-3.5 h-3.5 text-[#FF9B54]" />
              <span className="hidden sm:inline">My Trips</span>
              {myTripsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#159B72] text-white text-[10px]">
                  {myTripsCount}
                </span>
              )}
            </button>

            {/* User Session Profile / Login */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <img
                    src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#087EAB]"
                  />
                  <span className="hidden md:block text-xs font-bold text-[#12304A] dark:text-white max-w-[100px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 text-xs">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                    </div>
                    <button
                      onClick={() => handleNavClick('profile')}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={() => handleNavClick('my-trips')}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Luggage className="w-3.5 h-3.5" />
                      <span>My Trips ({myTripsCount})</span>
                    </button>
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => handleNavClick('dashboard')}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-[#087EAB]"
                      >
                        Admin Control Panel
                      </button>
                    )}
                    <button
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950 text-red-600 font-bold border-t border-slate-100 dark:border-slate-800 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#087EAB] hover:bg-[#E5F6FC] transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#087EAB] hover:bg-[#12304A] text-white shadow-xs transition-colors cursor-pointer"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-4 space-y-2">
          {mainNavLinks.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Icon className="w-4 h-4 text-[#087EAB]" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-4 mb-1">
              Buses & Transports
            </span>
            <button
              onClick={() => handleNavClick('buses')}
              className="w-full text-left px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-100"
            >
              <Bus className="w-4 h-4 text-[#087EAB]" />
              <span>All Bus Routes</span>
            </button>
            <button
              onClick={() => handleNavClick('ksrtc')}
              className="w-full text-left px-4 py-2 rounded-xl text-xs font-bold text-[#087F65] flex items-center gap-2 hover:bg-[#DFF7EE]"
            >
              <span>🌴 KSRTC Kerala Buses</span>
            </button>
            <button
              onClick={() => handleNavClick('setc')}
              className="w-full text-left px-4 py-2 rounded-xl text-xs font-bold text-[#087EAB] flex items-center gap-2 hover:bg-[#E5F6FC]"
            >
              <span>🌊 SETC Tamil Nadu Buses</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
