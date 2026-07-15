export interface Clinic {
  id: string;
  name: string;
  slug: string;
  /** Deprecated: use editorial_summary or original_description instead. Kept for backward compat. */
  description: string;
  /** Longevo-written positioning copy (max ~200 chars). Preferred on cards & hero. */
  editorial_summary?: string | null;
  /** Clinic's own long-form description. Shown as secondary on detail page. */
  original_description?: string | null;
  city: string;
  country: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  website: string;
  verified: boolean;
  cover_image_url: string;
  created_at: string;
  doctors?: Doctor[];
  clinic_treatments?: { treatment: Treatment }[];
  reviews?: Review[];
  avg_rating?: number;
  review_count?: number;
}

export interface Doctor {
  id: string;
  clinic_id: string;
  name: string;
  title: string;
  bio: string;
  avatar_url: string;
  specialties: string[];
  created_at: string;
}

export interface Treatment {
  id: string;
  name: string;
  slug: string;
  category: string;
  /** Estimated starting price in TRY. Null when unknown. */
  starting_price_try?: number | null;
}

export interface Review {
  id: string;
  clinic_id: string;
  user_id: string;
  rating: number;
  title: string;
  body: string;
  treatment_received: string;
  verified_visit: boolean;
  created_at: string;
  users_profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  display_name: string;
  avatar_url: string;
  created_at: string;
}

export type ArticleCategory = "Rehber" | "Bilimsel" | "Röportaj";

export interface Article {
  id: string;
  slug: string;
  category: ArticleCategory;
  title: string;
  excerpt: string | null;
  content: string | null;
  reading_time: number | null;
  featured: boolean;
  published: boolean;
  author: string | null;
  cover_image: string | null;
  created_at: string;
  published_at: string | null;
}
