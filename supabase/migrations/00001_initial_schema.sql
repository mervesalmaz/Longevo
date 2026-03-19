-- Longevo Database Schema
-- Run this in your Supabase SQL editor or via migrations

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

create table public.clinics (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  city text not null,
  country text not null,
  address text,
  lat float,
  lng float,
  phone text,
  website text,
  verified boolean default false,
  cover_image_url text,
  created_at timestamp with time zone default now()
);

create table public.doctors (
  id uuid primary key default uuid_generate_v4(),
  clinic_id uuid references public.clinics(id) on delete cascade,
  name text not null,
  title text,
  bio text,
  avatar_url text,
  specialties text[] default '{}',
  created_at timestamp with time zone default now()
);

create table public.treatments (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  category text
);

create table public.clinic_treatments (
  clinic_id uuid references public.clinics(id) on delete cascade,
  treatment_id uuid references public.treatments(id) on delete cascade,
  primary key (clinic_id, treatment_id)
);

create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  clinic_id uuid references public.clinics(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  title text,
  body text,
  treatment_received text,
  verified_visit boolean default false,
  created_at timestamp with time zone default now()
);

create table public.users_profile (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone default now()
);

-- ============================================
-- INDEXES
-- ============================================

create index idx_clinics_slug on public.clinics(slug);
create index idx_clinics_city on public.clinics(city);
create index idx_clinics_country on public.clinics(country);
create index idx_doctors_clinic_id on public.doctors(clinic_id);
create index idx_reviews_clinic_id on public.reviews(clinic_id);
create index idx_reviews_user_id on public.reviews(user_id);
create index idx_treatments_slug on public.treatments(slug);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table public.clinics enable row level security;
alter table public.doctors enable row level security;
alter table public.treatments enable row level security;
alter table public.clinic_treatments enable row level security;
alter table public.reviews enable row level security;
alter table public.users_profile enable row level security;

-- Clinics: anyone can read
create policy "Clinics are viewable by everyone"
  on public.clinics for select using (true);

-- Doctors: anyone can read
create policy "Doctors are viewable by everyone"
  on public.doctors for select using (true);

-- Treatments: anyone can read
create policy "Treatments are viewable by everyone"
  on public.treatments for select using (true);

-- Clinic treatments: anyone can read
create policy "Clinic treatments are viewable by everyone"
  on public.clinic_treatments for select using (true);

-- Reviews: anyone can read, authenticated users can insert their own
create policy "Reviews are viewable by everyone"
  on public.reviews for select using (true);

create policy "Authenticated users can insert reviews"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own reviews"
  on public.reviews for update
  using (auth.uid() = user_id);

create policy "Users can delete their own reviews"
  on public.reviews for delete
  using (auth.uid() = user_id);

-- User profiles: anyone can read, users can manage their own
create policy "Profiles are viewable by everyone"
  on public.users_profile for select using (true);

create policy "Users can insert their own profile"
  on public.users_profile for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.users_profile for update
  using (auth.uid() = id);

-- ============================================
-- FUNCTION: Auto-create user profile on signup
-- ============================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users_profile (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    null
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
