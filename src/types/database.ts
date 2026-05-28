export type SportType = "running" | "cycling" | "both";

export type Club = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sport_type: SportType;
  city: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  website: string | null;
  phone: string | null;
  price_range: string | null;
  schedule: string | null;
  verified: boolean;
};
