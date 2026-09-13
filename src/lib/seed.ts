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
  const address = "Bandra East, Mumbai, Maharashtra, India";
  const description = "Mumbai's ultimate gaming spot offering high‑end PC, PS5, VR, and racing simulator experiences.";
  insertOrIgnore("business_settings", ["key", "value"], ["name", name]);
  insertOrIgnore("business_settings", ["key", "value"], ["tagline", tagline]);
  insertOrIgnore("business_settings", ["key", "value"], ["address", address]);
  insertOrIgnore("business_settings", ["key", "value"], ["description", description]);
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
