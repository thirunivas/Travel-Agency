import React, { useState, useEffect } from 'react';
import { TourPackage, Booking, UserProfile, NavTab, AppNotification } from './types';
import {
  INITIAL_PACKAGES,
  INITIAL_BOOKINGS,
  INITIAL_ADMIN_USER,
  DESTINATIONS,
  INITIAL_NOTIFICATIONS,
} from './data/mockData';

// Core Navigation & Pages
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { DestinationsPage } from './components/DestinationsPage';
import { PackageCatalog } from './components/PackageCatalog';
import { FlightBookingView } from './components/FlightBookingView';
import { TrainBookingView } from './components/TrainBookingView';
import { KsrtcBookingView } from './components/KsrtcBookingView';
import { SetcBookingView } from './components/SetcBookingView';
import { BusBookingView } from './components/BusBookingView';
import { HotelBookingView } from './components/HotelBookingView';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { MyTripsPage } from './components/MyTripsPage';
import { UserProfilePage } from './components/UserProfilePage';
import { DashboardPage } from './components/DashboardPage';
import { AuthView } from './components/AuthView';
import { Footer } from './components/Footer';
import { FloatingAiAssistant } from './components/FloatingAiAssistant';

// Modals
import { PackageDetailsModal } from './components/PackageDetailsModal';
import { BookingModal } from './components/BookingModal';
import { DigitalTicketModal } from './components/DigitalTicketModal';
import { NotificationsModal } from './components/NotificationsModal';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';

import { THEME_BACKGROUNDS, ThemeBackgroundKey } from './data/themeBackgrounds';
import { Phone, Mail, Compass, ShieldCheck, Palette, Bell } from 'lucide-react';

export function App() {
  // Theme state ('light' | 'dark')
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('jh_theme');
    return savedTheme === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('jh_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Persistent Application State
  const [packages, setPackages] = useState<TourPackage[]>(() => {
    const saved = localStorage.getItem('jh_packages');
    return saved ? JSON.parse(saved) : INITIAL_PACKAGES;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('jh_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('jh_users');
    return saved ? JSON.parse(saved) : [INITIAL_ADMIN_USER];
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('jh_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Active User session (persisted in localStorage)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const savedSession = localStorage.getItem('jh_current_user');
    if (savedSession) {
      try {
        return JSON.parse(savedSession);
      } catch (e) {
        console.warn('Failed to parse saved user session:', e);
      }
    }
    const savedUsers = localStorage.getItem('jh_users');
    const userList: UserProfile[] = savedUsers ? JSON.parse(savedUsers) : [INITIAL_ADMIN_USER];
    return userList.find((u) => u.email === 'thirunivas418@gmail.com') || userList[0] || null;
  });

  // Navigation Active Tab
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [destinationFilterForPackages, setDestinationFilterForPackages] = useState<string>('All');

  // Modals state
  const [selectedDetailPackage, setSelectedDetailPackage] = useState<TourPackage | null>(null);
  const [bookingPackage, setBookingPackage] = useState<TourPackage | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [viewingDigitalTicketBooking, setViewingDigitalTicketBooking] = useState<Booking | null>(null);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);

  // Background Theme key ('golden-sunrise', 'misty-hills', 'royal-palace', 'azure-coast', 'serene-minimal')
  const [themeBackgroundKey, setThemeBackgroundKey] = useState<ThemeBackgroundKey>(() => {
    const saved = localStorage.getItem('jh_theme_bg');
    return (saved as ThemeBackgroundKey) || 'golden-sunrise';
  });
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);

  const handleSelectThemeBackground = (key: ThemeBackgroundKey) => {
    setThemeBackgroundKey(key);
    localStorage.setItem('jh_theme_bg', key);
  };

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('jh_packages', JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem('jh_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('jh_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('jh_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('jh_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('jh_current_user');
    }
  }, [currentUser]);

  // Auth Handlers
  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setActiveTab('auth');
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setActiveTab('home');
  };

  const handleRegisterUser = (newUser: UserProfile) => {
    setUsers((prev) => {
      const filtered = prev.filter(
        (u) => u.id !== newUser.id && u.email.toLowerCase() !== newUser.email.toLowerCase()
      );
      return [...filtered, newUser];
    });
    setCurrentUser(newUser);
    setActiveTab('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('jh_current_user');
    setIsBookingModalOpen(false);
    setBookingPackage(null);
    setSelectedDetailPackage(null);
    setActiveTab('home');
  };

  const handleUpdateProfile = (updatedData: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedData };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  // Booking handlers for Tour Package
  const handleInitiateBooking = (pkg: TourPackage) => {
    setBookingPackage(pkg);
    setIsBookingModalOpen(true);
  };

  const handleBookingComplete = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    // Create notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Booking Confirmed!',
      message: `Your booking for "${newBooking.packageName}" (PNR: ${newBooking.pnrNumber || newBooking.id}) is confirmed.`,
      timestamp: 'Just now',
      read: false,
      type: 'booking',
      linkTab: 'my-trips',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleTransportBookingSuccess = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `${newBooking.transportType?.toUpperCase() || 'TRAVEL'} Ticket Confirmed!`,
      message: `Confirmed ticket for ${newBooking.packageName}. PNR: ${newBooking.pnrNumber || newBooking.id}`,
      timestamp: 'Just now',
      read: false,
      type: 'booking',
      linkTab: 'my-trips',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleSelectDestinationForCatalog = (destinationCategory: string) => {
    setDestinationFilterForPackages(destinationCategory);
    setActiveTab('packages');
  };

  // Calculate trips count strictly for active logged in user
  const myBookingsCount = currentUser
    ? bookings.filter(
        (b) =>
          (b.customerEmail && b.customerEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim()) ||
          (b.customerId && b.customerId === currentUser.id)
      ).length
    : 0;

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const activeBg = THEME_BACKGROUNDS[themeBackgroundKey] || THEME_BACKGROUNDS['golden-sunrise'];

  return (
    <div
      className={`min-h-screen bg-[#F4F8FB] dark:bg-[#12304A] text-[#203447] dark:text-slate-100 font-sans antialiased flex flex-col justify-between transition-colors duration-500 relative overflow-x-hidden`}
    >
      {/* Soothing natural ambient lighting & organic texture */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className={`absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br ${activeBg.ambientPrimary} blur-3xl opacity-60 transition-all duration-700`}
        />
        <div
          className={`absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-gradient-to-bl ${activeBg.ambientSecondary} blur-3xl opacity-50 transition-all duration-700`}
        />
        <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.02] bg-[radial-gradient(#12304A_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="relative z-10 flex flex-col justify-between min-h-screen">
        <div>
          {/* Professional Agency Top Contact & Notice Ribbon */}
          <div className="bg-[#12304A] text-white px-4 py-2 text-xs font-medium border-b border-slate-800">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-4 text-[11px] text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#FFD166]" />
                  <span>+91 98765 43210 / 1800-JOURNEY</span>
                </span>
                <span className="hidden md:flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#159B72]" />
                  <span>support@journeyhub.com</span>
                </span>
                <span className="hidden lg:inline text-slate-400">
                  • Govt. Registered Indian Travel & Transport Agency
                </span>
              </div>

              {/* Theme & Demo Role Switcher */}
              <div className="flex items-center gap-2 text-[10px]">
                <button
                  onClick={() => setIsThemeSelectorOpen(true)}
                  className="px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[#FFD166] font-semibold transition-colors flex items-center gap-1 cursor-pointer border border-slate-700/80"
                  title="Switch Aesthetic Theme Background"
                >
                  <Palette className="w-3 h-3 text-[#FFD166]" />
                  <span>Theme: {activeBg.name}</span>
                </button>

                <span className="text-slate-400 pl-1 hidden sm:inline">Viewing as:</span>
                <span className="font-bold text-[#159B72] hidden sm:inline">
                  {currentUser ? `${currentUser.name} (${currentUser.role})` : 'Guest'}
                </span>
                <button
                  onClick={() => {
                    const demoUser: UserProfile = {
                      id: 'usr-demo-kerala',
                      name: 'Priya Sharma',
                      email: 'priya.sharma@example.com',
                      phone: '+91 98450 12345',
                      role: 'customer',
                      isEmailVerified: true,
                      createdAt: '2026-01-15T00:00:00.000Z',
                    };
                    setCurrentUser(demoUser);
                  }}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors cursor-pointer"
                >
                  Demo Traveller
                </button>
              </div>
            </div>
          </div>

          {/* Main Navigation Bar */}
          <Navbar
            currentUser={currentUser}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            theme={theme}
            onToggleTheme={toggleTheme}
            onLogout={handleLogout}
            onOpenAuth={handleOpenAuth}
            myTripsCount={myBookingsCount}
            unreadNotificationsCount={unreadNotifsCount}
            onOpenNotifications={() => setIsNotificationsModalOpen(true)}
          />

          {/* Main Page Views */}
          <main>
            {/* 1. HOME PAGE */}
            {activeTab === 'home' && (
              <HomePage
                packages={packages}
                destinations={DESTINATIONS}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onSelectPackage={(pkg) => setSelectedDetailPackage(pkg)}
                onBookPackage={handleInitiateBooking}
                onSelectDestination={handleSelectDestinationForCatalog}
              />
            )}

            {/* 2. DESTINATIONS PAGE */}
            {activeTab === 'destinations' && (
              <DestinationsPage
                onSelectDestination={handleSelectDestinationForCatalog}
                onNavigateToPackages={() => {
                  setDestinationFilterForPackages('All');
                  setActiveTab('packages');
                }}
              />
            )}

            {/* 3. PACKAGES CATALOG PAGE */}
            {activeTab === 'packages' && (
              <PackageCatalog
                packages={packages}
                onSelectPackage={(pkg) => setSelectedDetailPackage(pkg)}
                onBookPackage={handleInitiateBooking}
                initialDestinationFilter={destinationFilterForPackages}
              />
            )}

            {/* 4. FLIGHTS BOOKING PAGE */}
            {activeTab === 'flights' && (
              <FlightBookingView
                currentUser={currentUser}
                onBookFlightSuccess={handleTransportBookingSuccess}
                onOpenAuth={() => handleOpenAuth('login')}
              />
            )}

            {/* 5. TRAINS BOOKING PAGE */}
            {activeTab === 'trains' && (
              <TrainBookingView
                currentUser={currentUser}
                onBookTrainSuccess={handleTransportBookingSuccess}
                onOpenAuth={() => handleOpenAuth('login')}
              />
            )}

            {/* 6. BUSES SEARCH PAGE */}
            {activeTab === 'buses' && (
              <BusBookingView
                currentUser={currentUser}
                onBookBusSuccess={handleTransportBookingSuccess}
                onNavigateToKsrtc={() => setActiveTab('ksrtc')}
                onNavigateToSetc={() => setActiveTab('setc')}
              />
            )}

            {/* 7. KSRTC KERALA BOOKING PAGE */}
            {activeTab === 'ksrtc' && (
              <KsrtcBookingView
                currentUser={currentUser}
                onBookBusSuccess={handleTransportBookingSuccess}
                onOpenAuth={() => handleOpenAuth('login')}
              />
            )}

            {/* 8. SETC TAMIL NADU BOOKING PAGE */}
            {activeTab === 'setc' && (
              <SetcBookingView
                currentUser={currentUser}
                onBookBusSuccess={handleTransportBookingSuccess}
                onOpenAuth={() => handleOpenAuth('login')}
              />
            )}

            {/* 9. HOTELS BOOKING PAGE */}
            {activeTab === 'hotels' && (
              <HotelBookingView
                currentUser={currentUser}
                onBookHotelSuccess={handleTransportBookingSuccess}
                onOpenAuth={() => handleOpenAuth('login')}
              />
            )}

            {/* 10. MY TRIPS PAGE */}
            {activeTab === 'my-trips' && (
              <MyTripsPage
                currentUser={currentUser}
                bookings={bookings}
                onNavigateToPackages={() => {
                  setDestinationFilterForPackages('All');
                  setActiveTab('packages');
                }}
                onOpenAuth={() => handleOpenAuth('login')}
                onViewDigitalTicket={(b) => setViewingDigitalTicketBooking(b)}
              />
            )}

            {/* 11. USER PROFILE PAGE */}
            {activeTab === 'profile' && (
              <UserProfilePage
                currentUser={currentUser}
                bookings={bookings}
                onUpdateProfile={handleUpdateProfile}
                onNavigateToTrips={() => setActiveTab('my-trips')}
                onOpenAuth={() => handleOpenAuth('login')}
              />
            )}

            {/* 12. ABOUT US PAGE */}
            {activeTab === 'about' && (
              <AboutPage
                onNavigateToPackages={() => setActiveTab('packages')}
                onNavigateToContact={() => setActiveTab('contact')}
              />
            )}

            {/* 13. CONTACT PAGE */}
            {activeTab === 'contact' && <ContactPage />}

            {/* 14. AUTH VIEW */}
            {activeTab === 'auth' && (
              <AuthView
                initialMode={authMode}
                onLoginSuccess={handleLoginSuccess}
                onRegisterUser={handleRegisterUser}
                onCancel={() => setActiveTab('home')}
                existingUsers={users}
              />
            )}

            {/* 15. ADMIN DASHBOARD */}
            {activeTab === 'dashboard' && currentUser?.role === 'admin' && (
              <DashboardPage
                currentUser={currentUser}
                packages={packages}
                bookings={bookings}
                users={users}
                onUpdatePackages={setPackages}
                onUpdateBookings={setBookings}
                onUpdateUsers={setUsers}
              />
            )}
          </main>
        </div>

        {/* Global Footer */}
        <Footer
          onNavigateToDestinations={() => setActiveTab('destinations')}
          onNavigateToPackages={() => setActiveTab('packages')}
          onNavigateToAbout={() => setActiveTab('about')}
          onNavigateToContact={() => setActiveTab('contact')}
          onNavigateToFlights={() => setActiveTab('flights')}
          onNavigateToTrains={() => setActiveTab('trains')}
          onNavigateToBuses={() => setActiveTab('buses')}
          onNavigateToKsrtc={() => setActiveTab('ksrtc')}
          onNavigateToSetc={() => setActiveTab('setc')}
          onNavigateToHotels={() => setActiveTab('hotels')}
        />
      </div>

      {/* Package Details Modal */}
      <PackageDetailsModal
        pkg={selectedDetailPackage}
        onClose={() => setSelectedDetailPackage(null)}
        onProceedToBook={(pkg) => {
          setSelectedDetailPackage(null);
          handleInitiateBooking(pkg);
        }}
      />

      {/* Tour Package 5-Step Booking Modal */}
      <BookingModal
        pkg={bookingPackage}
        currentUser={currentUser}
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setBookingPackage(null);
        }}
        onBookingComplete={handleBookingComplete}
        onOpenAuth={() => handleOpenAuth('login')}
      />

      {/* Digital Ticket Modal */}
      <DigitalTicketModal
        booking={viewingDigitalTicketBooking}
        isOpen={!!viewingDigitalTicketBooking}
        onClose={() => setViewingDigitalTicketBooking(null)}
      />

      {/* Notifications Drawer / Modal */}
      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
        onSelectNotification={(n) => {
          if (n.linkTab) setActiveTab(n.linkTab);
          setNotifications((prev) => prev.map((item) => (item.id === n.id ? { ...item, read: true } : item)));
        }}
      />

      {/* Theme Background Selector Modal */}
      <ThemeSelectorModal
        isOpen={isThemeSelectorOpen}
        onClose={() => setIsThemeSelectorOpen(false)}
        currentThemeKey={themeBackgroundKey}
        onSelectTheme={handleSelectThemeBackground}
      />

      {/* Floating AI Concierge / Assistant */}
      <FloatingAiAssistant
        packages={packages}
        onSelectPackage={(pkg) => setSelectedDetailPackage(pkg)}
      />
    </div>
  );
}

export default App;
