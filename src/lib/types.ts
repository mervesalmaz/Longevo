export interface Clinic {
  id: string;
  name: string;
  slug: string;
  description: string;
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
