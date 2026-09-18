-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  passwordHash TEXT,
  role TEXT NOT NULL DEFAULT 'CUSTOMER',
  isEmailVerified BOOLEAN DEFAULT false,
  isPhoneVerified BOOLEAN DEFAULT false,
  cosmosXp INTEGER DEFAULT 0,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Verification OTPs Table
CREATE TABLE verification_otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,
  otpCode TEXT NOT NULL,
  type TEXT NOT NULL,
  expiresAt TIMESTAMP WITH TIME ZONE NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gaming Zones Table
CREATE TABLE gaming_zones (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  specs TEXT NOT NULL,
  hourlyRate INTEGER NOT NULL,
  imageUrl TEXT NOT NULL,
  totalStations INTEGER NOT NULL,
  popularGames TEXT NOT NULL,
  isActive BOOLEAN DEFAULT true,
  displayOrder INTEGER NOT NULL
);

-- Stations Table
CREATE TABLE stations (
  id TEXT PRIMARY KEY,
  zoneId TEXT NOT NULL REFERENCES gaming_zones(id) ON DELETE CASCADE,
  stationNumber INTEGER NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'AVAILABLE'
);

-- Games Table
CREATE TABLE games (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  genre TEXT NOT NULL,
  zoneType TEXT NOT NULL,
  coverUrl TEXT NOT NULL,
  isPopular BOOLEAN DEFAULT false,
  isActive BOOLEAN DEFAULT true,
  description TEXT
);

-- Pricing Tiers Table
CREATE TABLE pricing_tiers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  zoneType TEXT NOT NULL,
  durationHours INTEGER NOT NULL,
  price INTEGER NOT NULL,
  originalPrice INTEGER,
  tag TEXT,
  features JSONB NOT NULL,
  isFeatured BOOLEAN DEFAULT false,
  isActive BOOLEAN DEFAULT true
);

-- Offers Table
CREATE TABLE offers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  discountType TEXT NOT NULL,
  discountValue INTEGER NOT NULL,
  applicableZone TEXT,
  minDurationHours INTEGER,
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  terms TEXT,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  bannerUrl TEXT
);

-- Events Table
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  game TEXT NOT NULL,
  category TEXT NOT NULL,
  eventDate DATE NOT NULL,
  startTime TIME NOT NULL,
  endTime TIME,
  entryFee INTEGER NOT NULL,
  prizePool TEXT,
  maxParticipants INTEGER NOT NULL,
  currentParticipants INTEGER DEFAULT 0,
  format TEXT NOT NULL,
  rules TEXT,
  bannerUrl TEXT,
  status TEXT NOT NULL DEFAULT 'UPCOMING'
);

-- Event Registrations Table
CREATE TABLE event_registrations (
  id TEXT PRIMARY KEY,
  eventId TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  userId UUID REFERENCES users(id) ON DELETE SET NULL,
  playerName TEXT NOT NULL,
  playerPhone TEXT NOT NULL,
  playerEmail TEXT,
  gamerTag TEXT,
  paymentStatus TEXT NOT NULL DEFAULT 'PENDING',
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings Table
CREATE TABLE bookings (
  id TEXT PRIMARY KEY,
  bookingRef TEXT NOT NULL UNIQUE,
  userId UUID REFERENCES users(id) ON DELETE SET NULL,
  customerName TEXT NOT NULL,
  customerPhone TEXT NOT NULL,
  customerEmail TEXT,
  zoneId TEXT NOT NULL REFERENCES gaming_zones(id) ON DELETE RESTRICT,
  zoneName TEXT NOT NULL,
  stationId TEXT REFERENCES stations(id) ON DELETE SET NULL,
  stationNumber INTEGER,
  bookingDate DATE NOT NULL,
  startTime TIME NOT NULL,
  endTime TIME NOT NULL,
  durationHours INTEGER NOT NULL,
  playersCount INTEGER NOT NULL,
  subtotal INTEGER NOT NULL,
  discountAmount INTEGER DEFAULT 0,
  totalAmount INTEGER NOT NULL,
  appliedOfferCode TEXT,
  paymentMethod TEXT NOT NULL,
  paymentStatus TEXT NOT NULL,
  bookingStatus TEXT NOT NULL,
  specialRequests TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE reviews (
  id TEXT PRIMARY KEY,
  authorName TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  gamePlayed TEXT,
  isVerified BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'PENDING',
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery Images Table
CREATE TABLE gallery_images (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  imageUrl TEXT NOT NULL,
  category TEXT NOT NULL,
  displayOrder INTEGER NOT NULL,
  isPublished BOOLEAN DEFAULT true
);

-- Business Settings Table
CREATE TABLE business_settings (
  id TEXT PRIMARY KEY,
  businessName TEXT NOT NULL,
  tagline TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postalCode TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  instagram TEXT NOT NULL,
  googleMapsUrl TEXT NOT NULL,
  openingTime TEXT NOT NULL,
  closingTime TEXT NOT NULL,
  operatingDays TEXT NOT NULL,
  isSlotBookingActive BOOLEAN DEFAULT true,
  announcementText TEXT,
  announcementActive BOOLEAN DEFAULT false
);
