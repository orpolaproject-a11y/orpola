import type { Club } from "@/types/database";
import { createClient } from "@/lib/supabase/server";
import { SEED_CLUBS } from "@/data/seed-clubs";

const SELECT =
  "id, slug, name, description, sport_type, city, address, latitude, longitude, website, phone, price_range, schedule, verified";

import { TEL_AVIV_MAP_CENTER as TEL_AVIV_CENTER } from "@/lib/constants";
const TEL_AVIV_RADIUS_KM = 35;

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function getClubs(city?: string): Promise<Club[]> {
  const supabase = await createClient();
  if (supabase) {
    let query = supabase.from("clubs").select(SELECT).order("name");
    if (city) query = query.ilike("city", `%${city}%`);
    const { data, error } = await query;
    if (error) console.error("[getClubs] Supabase error:", error.message);
    if (!error && data && data.length > 0) return data as Club[];
  }
  let clubs = SEED_CLUBS;
  if (city) {
    const q = city.toLowerCase();
    clubs = clubs.filter((c) => c.city.toLowerCase().includes(q));
  }
  return clubs;
}

export async function getClubsAroundTelAviv(): Promise<Club[]> {
  const all = await getClubs();
  return all.filter((club) => {
    if (club.latitude == null || club.longitude == null) return false;
    if (club.city.toLowerCase().includes("tel aviv")) return true;
    return distanceKm(TEL_AVIV_CENTER.lat, TEL_AVIV_CENTER.lng, club.latitude, club.longitude) <=
      TEL_AVIV_RADIUS_KM;
  });
}

export async function getClubBySlug(slug: string): Promise<Club | null> {
  const supabase = await createClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("clubs")
      .select(SELECT)
      .eq("slug", slug)
      .maybeSingle();
    if (error) console.error("[getClubBySlug] Supabase error:", error.message);
    if (!error && data) return data as Club;
  }
  return SEED_CLUBS.find((c) => c.slug === slug) ?? null;
}

