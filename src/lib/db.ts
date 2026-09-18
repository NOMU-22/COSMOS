import { createClient } from "@supabase/supabase-js";
import {
  User,
  VerificationOtp,
  GamingZone,
  Station,
  Game,
  PricingTier,
  Offer,
  EventTournament,
  EventRegistration,
  Booking,
  Review,
  GalleryImage,
  BusinessSettings,
} from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

export interface DatabaseSchema {
  users: User[];
  verification_otps: VerificationOtp[];
  gaming_zones: GamingZone[];
  stations: Station[];
  games: Game[];
  pricing_tiers: PricingTier[];
  offers: Offer[];
  events: EventTournament[];
  event_registrations: EventRegistration[];
  bookings: Booking[];
  reviews: Review[];
  gallery_images: GalleryImage[];
  business_settings: BusinessSettings[];
}

export const db = {
  async findMany<K extends keyof DatabaseSchema>(
    table: K,
    filterFn?: (item: DatabaseSchema[K][number]) => boolean
  ): Promise<DatabaseSchema[K]> {
    const { data, error } = await supabase.from(table).select("*");
    if (error) {
      console.error(`Error fetching from ${table}:`, error);
      return [] as any as DatabaseSchema[K];
    }
    const items = data || [];
    if (!filterFn) return items as DatabaseSchema[K];
    return (items as any[]).filter(filterFn) as DatabaseSchema[K];
  },

  async findOne<K extends keyof DatabaseSchema>(
    table: K,
    filterFn: (item: DatabaseSchema[K][number]) => boolean
  ): Promise<DatabaseSchema[K][number] | null> {
    const { data, error } = await supabase.from(table).select("*");
    if (error) {
      console.error(`Error fetching from ${table}:`, error);
      return null;
    }
    const items = data || [];
    const found = (items as any[]).find(filterFn);
    return found || null;
  },

  async insert<K extends keyof DatabaseSchema>(
    table: K,
    item: DatabaseSchema[K][number]
  ): Promise<DatabaseSchema[K][number]> {
    const { data, error } = await supabase.from(table).insert(item).select().single();
    if (error) {
      console.error(`Error inserting into ${table}:`, error);
      throw error;
    }
    return data;
  },

  async update<K extends keyof DatabaseSchema>(
    table: K,
    id: string,
    updates: Partial<DatabaseSchema[K][number]>
  ): Promise<DatabaseSchema[K][number] | null> {
    const { data, error } = await supabase
      .from(table)
      .update({ ...updates, updatedAt: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating ${table}:`, error);
      return null;
    }
    return data;
  },

  async delete<K extends keyof DatabaseSchema>(table: K, id: string): Promise<boolean> {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) {
      console.error(`Error deleting from ${table}:`, error);
      return false;
    }
    return true;
  },

  async count<K extends keyof DatabaseSchema>(
    table: K,
    filterFn?: (item: DatabaseSchema[K][number]) => boolean
  ): Promise<number> {
    const items = await this.findMany(table, filterFn);
    return items.length;
  },
};

export default db;
