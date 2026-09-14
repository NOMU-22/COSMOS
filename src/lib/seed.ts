import db from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

// Helper to insert a row if it does not already exist (based on provided columns)
function insertOrIgnore(table: string, columns: string[], values: any[]) {
  const record: any = {};
  columns.forEach((col, i) => {
    record[col] = values[i];
  });
  // Ensure every table has an id field
  if (!record.id) {
    record.id = uuidv4();
  }
  // Check for existing record with the same column values
  const exists = db.findMany(
    table as any,
    (item: any) => columns.every((col, i) => item[col] === values[i])
  );
  if (!exists.length) {
    db.insert(table as any, record);
  }
}

// Seed business information (uses business_settings key/value pairs)
function seedBusinessInfo() {
  const name = "Cosmos Gaming Centre";
  const tagline = "Play • Compete • Win • Repeat";
  const address = "Office no 23, New Shopping Centre, Government Colony, Bandra East, Mumbai, Maharashtra 400051";
  const description = "Mumbai's ultimate gaming spot offering high‑end PC, PS5, VR, and racing simulator experiences.";
  const googleMapsUrl = "https://maps.google.com/?q=Office+no+23+New+Shopping+Centre+Government+Colony+Bandra+East+Mumbai+Maharashtra+400051";
  const googleMapsEmbed = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.9258768!2d72.8483!3d19.0548!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9d8e2d5f5e1%3A0xa2d4f8c3b1e69045!2sNew%20Shopping%20Centre%2C%20Government%20Colony%2C%20Bandra%20East%2C%20Mumbai%2C%20Maharashtra%20400051!5e0!3m2!1sen!2sin!4v1726306000000!5m2!1sen!2sin";
  insertOrIgnore("business_settings", ["key", "value"], ["name", name]);
  insertOrIgnore("business_settings", ["key", "value"], ["tagline", tagline]);
  insertOrIgnore("business_settings", ["key", "value"], ["address", address]);
  insertOrIgnore("business_settings", ["key", "value"], ["description", description]);
  insertOrIgnore("business_settings", ["key", "value"], ["googleMapsUrl", googleMapsUrl]);
  insertOrIgnore("business_settings", ["key", "value"], ["googleMapsEmbed", googleMapsEmbed]);
}

// Seed gaming zones
function seedZones() {
  const zones = [
    { name: "PC Zone", description: "High‑end gaming PCs with latest titles", capacity: 10 },
    { name: "PS5 Zone", description: "PlayStation 5 consoles for console gamers", capacity: 5 },
    { name: "VR Zone", description: "Immersive VR experience with gun and motion setups", capacity: 4 },
    { name: "Racing Simulators", description: "Racing seat rigs with realistic steering wheel", capacity: 2 },
  ];
  zones.forEach((zone) => {
    insertOrIgnore("gaming_zones", ["name", "description", "capacity"], [zone.name, zone.description, zone.capacity]);
  });
}

// Seed a default admin user (password: admin123)
async function seedAdminUser() {
  const bcrypt = await import("bcryptjs");
  const passwordHash = await bcrypt.hash("admin123", 10);
  insertOrIgnore(
    "users",
    ["name", "email", "password_hash", "role", "is_email_verified", "is_phone_verified"],
    ["Admin", "admin@cosmosgaming.com", passwordHash, "ADMIN", 1, 0]
  );
}

export async function seedDatabase() {
  console.log("Seeding Cosmos Gaming Mumbai database...");
  seedBusinessInfo();
  seedZones();
  await seedAdminUser();
  console.log("Seeding complete.");
}

if (require.main === module) {
  seedDatabase();
}
