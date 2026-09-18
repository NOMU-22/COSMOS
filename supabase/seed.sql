-- Users (Use the password hash from the old db.ts, you can update it later or leave as is)
INSERT INTO users (id, name, email, phone, "passwordHash", role, "isEmailVerified", "isPhoneVerified", "cosmosXp", "createdAt", "updatedAt")
VALUES
('b4e4c278-f2b7-4e63-9114-118e950bc450', 'Cosmos Admin', 'admin@cosmosgaming.com', '+919820012345', '$2a$10$T... (Replace with real hash from old DB)', 'ADMIN', true, true, 5000, NOW(), NOW()),
('33e9b119-913a-4467-b50a-f10d29f046fa', 'Aryan Sharma', 'aryan@gamer.com', '+919876543210', '$2a$10$T... (Replace with real hash)', 'CUSTOMER', true, true, 450, NOW(), NOW());

-- Business Settings
INSERT INTO business_settings (id, "businessName", tagline, address, city, state, "postalCode", phone, whatsapp, email, instagram, "googleMapsUrl", "openingTime", "closingTime", "operatingDays", "isSlotBookingActive", "announcementText", "announcementActive")
VALUES
('settings-1', 'Cosmos Gaming Mumbai', 'Play • Compete • Win • Repeat', 'Office no 23, New Shopping Centre, Government Colony, Bandra East', 'Mumbai', 'Maharashtra', '400051', '+91 98200 12345', '+91 98200 12345', 'contact@cosmosgamingmumbai.com', 'https://www.instagram.com/cosmosgamingmumbai/', 'https://maps.google.com/?q=Office+no+23+New+Shopping+Centre+Government+Colony+Bandra+East+Mumbai+Maharashtra+400051', '11:00 AM', '11:00 PM', 'Monday - Sunday (All 7 Days)', true, '🔥 COSMOS FC 26 MONSOON CUP IS LIVE! Registrations are open now with ₹15,000 in Scholarship Prizes!', true);

-- Gaming Zones
INSERT INTO gaming_zones (id, name, slug, description, specs, "hourlyRate", "imageUrl", "totalStations", "popularGames", "isActive", "displayOrder")
VALUES
('zone-ps5', 'PlayStation 5 (PS5) Arena', 'ps5-arena', 'Experience 4K ultra-smooth console gaming on PlayStation 5 with DualSense haptic feedback and high-refresh gaming displays.', 'Sony PlayStation 5 Consoles • 4K HDR 120Hz Displays • DualSense Wireless Controllers • Pulse 3D Audio', 149, 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=80', 6, 'FC 26 / FIFA 26, WWE 2K26, Tekken 8, GTA 5, Mortal Kombat 1, Spider-Man 2', true, 1),
('zone-pc', 'High-End PC Esports Battleground', 'pc-esports', 'High-FPS competitive esports battle stations with mechanical RGB peripherals and high-refresh esports monitors.', 'Dedicated Esports Gaming Rigs • 240Hz High-Refresh Gaming Monitors • Mechanical RGB Keyboards • Ultra-light Gaming Mice', 129, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80', 8, 'Valorant, GTA 5 RP, CS2, Free Fire PC, Apex Legends, Fortnite', true, 2),
('zone-vr', 'VR Immersive Arena + Gun Setup', 'vr-immersive', 'Full 360-degree virtual reality arena with specialized VR gun controllers for realistic tactical and shooter gameplay.', 'Next-Gen VR Headsets • Specialized Haptic VR Gun Peripherals • 360° Room-Scale Tracking Sensors', 199, 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=1200&q=80', 2, 'Tactical VR Shooters, Beat Saber, Superhot VR, Half-Life: Alyx', true, 3),
('zone-racing', 'Steering Wheel Racing Simulator', 'racing-simulator', 'Professional force-feedback steering wheel and pedal rig for realistic motorsport, rally, and drift simulation.', 'Force-Feedback Racing Wheel • Responsive Pedal System • Ergonomic Bucket Racing Cockpit', 179, 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80', 2, 'F1 24, Forza Horizon 5, Assetto Corsa, Gran Turismo', true, 4);

-- Stations
INSERT INTO stations (id, "zoneId", "stationNumber", name, status)
VALUES
('station-ps5-1', 'zone-ps5', 1, 'PS5 Station #01', 'AVAILABLE'),
('station-ps5-2', 'zone-ps5', 2, 'PS5 Station #02', 'AVAILABLE'),
('station-pc-1', 'zone-pc', 1, 'PC Esports Rig #01', 'AVAILABLE'),
('station-vr-1', 'zone-vr', 1, 'VR Gun Pod #01', 'AVAILABLE'),
('station-sim-1', 'zone-racing', 1, 'Racing Cockpit #01', 'AVAILABLE');

-- Games
INSERT INTO games (id, title, genre, "zoneType", "coverUrl", "isPopular", "isActive", description)
VALUES
('game-1', 'EA Sports FC 26', 'Sports / Football', 'PS5', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80', true, true, null),
('game-2', 'Valorant', 'Tactical FPS', 'PC', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80', true, true, null);

-- Pricing Tiers
INSERT INTO pricing_tiers (id, title, "zoneType", "durationHours", price, "originalPrice", tag, features, "isFeatured", "isActive")
VALUES
('price-pc-1hr', 'PC Quick Session', 'High-End PC Esports', 1, 129, 150, 'Standard', '["240Hz Esports Display", "Mechanical RGB Peripherals", "Discord & Steam Ready", "Zero Input Lag"]', false, true),
('price-ps5-1hr', 'PS5 1v1 Arena', 'PlayStation 5 (PS5)', 1, 149, 180, 'Console Match', '["Sony PS5 Console", "4K 120Hz Ultra-HD Display", "2 DualSense Controllers", "All Top Sports & Fighting Games"]', false, true);

-- Offers
INSERT INTO offers (id, title, code, description, "discountType", "discountValue", "applicableZone", "minDurationHours", "startDate", "endDate", terms, status, "bannerUrl")
VALUES
('offer-1', 'Beat the House Pro Challenge', 'BEATTHEPRO', 'Challenge our house pro in FC 26 or Tekken. Win the match and your 1st hour is 100% FREE!', 'PERCENTAGE', 100, 'zone-ps5', 1, '2026-09-01', '2026-10-31', '1 match attempt per customer. Valid on PS5 arena games. Must inform front desk before starting.', 'PUBLISHED', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80');

-- Events
INSERT INTO events (id, title, game, category, "eventDate", "startTime", "endTime", "entryFee", "prizePool", "maxParticipants", "currentParticipants", format, rules, "bannerUrl", status)
VALUES
('event-fc26-monsoon', 'COSMOS FC 26 MONSOON CUP', 'EA Sports FC 26 (PS5)', 'TOURNAMENT', '2026-09-28', '13:30', '19:00', 299, '🏆 Winner: ₹10,000 Scholarship | 🥈 Runner-Up: ₹5,000 Scholarship + Membership + Official Merch', 32, 18, 'PS5 | 1v1 | Single Elimination Knockout', '6 min halves. Default competitive squads. Tactical defending mandatory. Referee decision is final.', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80', 'REGISTRATION_OPEN');

-- Gallery Images
INSERT INTO gallery_images (id, title, "imageUrl", category, "displayOrder", "isPublished")
VALUES
('gal-1', 'PlayStation 5 Battle Stations', 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=80', 'PS5', 1, true),
('gal-2', 'High-FPS PC Esports Arena', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80', 'PC', 2, true);
