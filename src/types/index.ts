export type UserRole = "CUSTOMER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  passwordHash?: string | null;
  role: UserRole;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  cosmosXp: number;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationOtp {
  id: string;
  identifier: string; // phone or email
  otpCode: string;
  type: "PHONE_LOGIN" | "EMAIL_VERIFICATION" | "PASSWORD_RESET";
  expiresAt: string;
  createdAt: string;
}

export interface GamingZone {
  id: string;
  name: string;
  slug: string;
  description: string;
  specs: string;
  hourlyRate: number;
  imageUrl: string;
  totalStations: number;
  popularGames: string;
  isActive: boolean;
  displayOrder: number;
}

export interface Station {
  id: string;
  zoneId: string;
  stationNumber: number;
  name: string;
  status: "AVAILABLE" | "MAINTENANCE" | "RESERVED";
}

export interface Game {
  id: string;
  title: string;
  genre: string;
  zoneType: string; // 'PC' | 'PS5' | 'VR' | 'RACING' | 'ALL'
  coverUrl: string;
  isPopular: boolean;
  isActive: boolean;
  description?: string;
}

export interface PricingTier {
  id: string;
  title: string;
  zoneType: string;
  durationHours: number;
  price: number;
  originalPrice?: number | null;
  tag?: string | null; // e.g. "Most Popular", "Best Value"
  features: string; // JSON array of string perks
  isFeatured: boolean;
  isActive: boolean;
}

export interface Offer {
  id: string;
  title: string;
  code: string;
  description: string;
  discountType: "PERCENTAGE" | "FLAT";
  discountValue: number;
  applicableZone?: string | null;
  minDurationHours?: number | null;
  startDate: string;
  endDate: string;
  terms?: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  bannerUrl?: string | null;
}

export interface EventTournament {
  id: string;
  title: string;
  game: string;
  category: "TOURNAMENT" | "COMMUNITY_NIGHT" | "LAN_PARTY" | "SPECIAL";
  eventDate: string; // YYYY-MM-DD
  startTime: string; // e.g. "14:00"
  endTime?: string | null;
  entryFee: number;
  prizePool?: string | null;
  maxParticipants: number;
  currentParticipants: number;
  format: string; // e.g. "PS5 | 1v1 | Single Elimination"
  rules?: string | null;
  bannerUrl?: string | null;
  status: "UPCOMING" | "REGISTRATION_OPEN" | "ONGOING" | "COMPLETED" | "DRAFT";
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId?: string | null;
  playerName: string;
  playerPhone: string;
  playerEmail?: string | null;
  gamerTag?: string | null;
  paymentStatus: "PENDING" | "PAID" | "FREE";
  createdAt: string;
}

export interface Booking {
  id: string;
  bookingRef: string; // e.g. "CGM-2026-8921"
  userId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  zoneId: string;
  zoneName: string;
  stationId?: string | null;
  stationNumber?: number | null;
  bookingDate: string; // YYYY-MM-DD
  startTime: string; // "14:00"
  endTime: string; // "16:00"
  durationHours: number;
  playersCount: number;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  appliedOfferCode?: string | null;
  paymentMethod: "UPI" | "CARD" | "NETBANKING" | "PAY_AT_VENUE";
  paymentStatus: "PENDING" | "COMPLETED" | "REFUNDED" | "FAILED";
  bookingStatus: "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  specialRequests?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  gamePlayed?: string | null;
  isVerified: boolean;
  status: "APPROVED" | "PENDING" | "REJECTED";
  createdAt: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  imageUrl: string;
  category: "ARENA" | "PS5" | "PC" | "VR" | "SIMULATOR" | "TOURNAMENT";
  displayOrder: number;
  isPublished: boolean;
}

export interface BusinessSettings {
  id: string;
  businessName: string;
  tagline: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  googleMapsUrl: string;
  openingTime: string;
  closingTime: string;
  operatingDays: string;
  isSlotBookingActive: boolean;
  announcementText?: string | null;
  announcementActive: boolean;
}
