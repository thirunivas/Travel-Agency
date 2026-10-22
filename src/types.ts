export type UserRole = 'admin' | 'customer';

export type NavTab =
  | 'home'
  | 'destinations'
  | 'packages'
  | 'flights'
  | 'trains'
  | 'buses'
  | 'ksrtc'
  | 'setc'
  | 'hotels'
  | 'about'
  | 'contact'
  | 'my-trips'
  | 'profile'
  | 'auth'
  | 'dashboard';

export interface Destination {
  id: string;
  name: string;
  category: 'Kerala' | 'Tamil Nadu' | 'Goa' | 'Rajasthan' | 'Himachal Pradesh' | 'Karnataka' | 'Meghalaya' | 'International';
  shortDescription: string;
  startingPriceInr: number;
  imageUrl: string;
  tagline?: string;
  highlights: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isEmailVerified: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export interface PriceBreakdown {
  basePriceInr: number;
  taxesAndGstInr: number;
  transportAllowanceInr: number;
  totalInr: number;
}

export interface TourPackage {
  id: string;
  name: string;
  destination: string;
  state: string;
  country: string;
  duration: string; // e.g., "5 Days / 4 Nights"
  hotel: string; // e.g., "5-Star Luxury Resort"
  transport: string; // e.g., "Private AC SUV & Transfers"
  mealsIncluded: string; // e.g., "Breakfast & Dinner Included"
  priceInr: number; // Price per person in INR (₹)
  availableSeats: number;
  galleryImages: string[];
  videoUrl?: string; // YouTube or scenic video stream
  description: string;
  placesToVisit?: string[];
  suggestedStays?: string[];
  activities?: string[];
  interestingFacts?: string[];
  priceBreakdown?: PriceBreakdown;
  itinerary: {
    day: number;
    title: string;
    details: string;
  }[];
  category: 'Honeymoon' | 'Adventure' | 'Heritage' | 'Beach' | 'Wildlife' | 'Family' | 'Luxury' | 'Nature';
  featured?: boolean;
  rating: number;
  reviewsCount: number;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'paid' | 'pending' | 'refunded';
export type TransportType = 'package' | 'flight' | 'train' | 'bus' | 'ksrtc' | 'setc' | 'hotel';

export interface Booking {
  id: string; // e.g. "JH-BK-2026-101"
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  packageId: string;
  packageName: string;
  destination: string;
  hotel: string;
  transport: string;
  transportType?: TransportType;
  pnrNumber?: string;
  seatNumbers?: string[];
  routeDetails?: string;
  travelDate: string; // YYYY-MM-DD
  returnDate: string; // YYYY-MM-DD
  pickupLocation: string;
  dropLocation: string;
  adults: number;
  children: number;
  specialRequests?: string;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  amountPaidInr: number;
  gstInr: number;
  discountInr: number;
  grandTotalInr: number;
  paymentMethod?: 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Wallet';
  paymentId?: string;
  createdAt: string; // ISO
  confirmedAt?: string;
  cancelledAt?: string;
  rejectionReason?: string;
}

export interface PaymentRecord {
  id: string;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  packageName: string;
  amountInr: number;
  gstInr: number;
  discountInr: number;
  paymentMethod: string;
  transactionRef: string;
  paymentStatus: PaymentStatus;
  date: string;
}

export interface Review {
  id: string;
  packageId: string;
  packageName: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  date: string;
  verifiedBooking: boolean;
}

export interface Offer {
  id: string;
  code: string;
  title: string;
  discountPercentage: number;
  flatDiscountInr?: number;
  validUntil: string;
  description: string;
  bannerImage: string;
  minBookingInr?: number;
}

export interface EmailNotification {
  id: string;
  to: string;
  subject: string;
  body: string;
  type: 'verification' | 'welcome' | 'confirmation' | 'cancellation' | 'payment' | 'reset_password';
  sentAt: string;
  read: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'booking' | 'offer' | 'info' | 'reminder';
  linkTab?: NavTab;
}

// ----------------- Transport Models -----------------

export interface FlightItem {
  id: string;
  flightNumber: string;
  airline: string;
  logo: string;
  fromCode: string;
  fromCity: string;
  toCode: string;
  toCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: string;
  priceInr: number;
  seatClass: string;
  baggage: string;
  availableSeats: number;
}

export interface TrainClassOption {
  code: '1A' | '2A' | '3A' | 'SL' | 'CC' | 'EC';
  name: string;
  fareInr: number;
  availableSeats: number;
  status: 'AVAILABLE' | 'WL' | 'RAC';
}

export interface TrainItem {
  id: string;
  trainNumber: string;
  trainName: string;
  fromStation: string;
  fromCode: string;
  toStation: string;
  toCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  runsOn: string[];
  classes: TrainClassOption[];
}

export interface BusItem {
  id: string;
  operator: string;
  operatorType: 'KSRTC' | 'SETC' | 'Private';
  busType: string;
  fromCity: string;
  toCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  fareInr: number;
  availableSeats: number;
  rating: number;
  amenities: string[];
  routeVia?: string;
}

export interface HotelItem {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  starRating: number;
  rating: number;
  reviewsCount: number;
  pricePerNightInr: number;
  imageUrl: string;
  images: string[];
  amenities: string[];
  description: string;
  verified: boolean;
  roomTypes: {
    name: string;
    bed: string;
    priceInr: number;
    available: number;
  }[];
}

export interface SeatInfo {
  seatId: string;
  row: number;
  col: number;
  type: 'window' | 'aisle' | 'middle' | 'berth-lower' | 'berth-upper' | 'berth-middle' | 'berth-side-lower' | 'berth-side-upper';
  status: 'available' | 'booked' | 'ladies';
  priceInr: number;
}

export interface AiRecommendationQuery {
  budgetInr: number;
  destinationPreference?: string;
  durationDays?: number;
  groupType: 'Solo' | 'Couple' | 'Family' | 'Friends';
  seasonPreference?: string;
}

export interface AiRecommendationResult {
  packageId: string;
  matchScore: number;
  reason: string;
  customTip: string;
}
