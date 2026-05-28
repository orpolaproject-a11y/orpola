import type { Club } from "@/types/database";
import { createClient } from "@/lib/supabase/server";
import { SEED_CLUBS } from "@/data/seed-clubs";

const SELECT =
  "id, slug, name, description, sport_type, city, address, latitude, longitude, website, phone, price_range, schedule, verified";

export async function getClubs(city?: string): Promise<Club[]> {
  const supabase = await createClient();
  if (supabase) {
    let query = supabase.from("clubs").select(SELECT).order("name");
    if (city) query = query.ilike("city", `%${city}%`);
    const { data, error } = await query;
    if (error) {
      console.error("[getClubs] Supabase error:", error.message);
    }
    if (!error && data && data.length > 0) {
      return data as Club[];
    }
  }
  let clubs = SEED_CLUBS;
  if (city) {
    const q = city.toLowerCase();
    clubs = clubs.filter((c) => c.city.toLowerCase().includes(q));
  }
  return clubs;
}

export async function getClubBySlug(slug: string): Promise<Club | null> {
  const supabase = await createClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("clubs")
      .select(SELECT)
      .eq("slug", slug)
      .maybeSingle();
    if (error) {
      console.error("[getClubBySlug] Supabase error:", error.message);
    }
    if (!error && data) return data as Club;
  }
  return SEED_CLUBS.find((c) => c.slug === slug) ?? null;
}
