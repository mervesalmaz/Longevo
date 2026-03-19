# Longevo

A TripAdvisor-style discovery and review platform for longevity clinics and doctors. Built with Next.js 14, Supabase, and Tailwind CSS.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn/ui
- **Database & Auth:** Supabase (PostgreSQL + Auth)
- **Deployment:** Vercel

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd longevo
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the migration SQL in your Supabase SQL editor:
   - Copy the contents of `supabase/migrations/00001_initial_schema.sql`
   - Paste and run in the SQL Editor

### 3. Configure environment variables

Copy the example env file and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Required variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_EMAIL=your-admin@email.com
```

### 4. Seed the database (optional)

```bash
npx tsx scripts/seed.ts
```

This seeds 8 clinics across Istanbul, Ankara, Berlin, and London with doctors, treatments, and reviews.

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/
    page.tsx              # Homepage
    search/page.tsx       # Search & discovery
    clinics/[slug]/       # Clinic detail
    reviews/new/          # Write review (auth required)
    auth/login/           # Login
    auth/signup/          # Signup
    auth/callback/        # OAuth callback
    admin/                # Admin dashboard
    not-found.tsx         # 404 page
  components/
    ui/                   # Shadcn/ui components
    navbar.tsx            # Navigation bar
    footer.tsx            # Footer
    clinic-card.tsx       # Clinic card component
    star-rating.tsx       # Star rating component
  lib/
    supabase/             # Supabase client utilities
    types.ts              # TypeScript types
    utils.ts              # Utility functions
supabase/
  migrations/             # Database migration SQL
scripts/
  seed.ts                 # Database seeding script
```

## Features

- Clinic search with filters (city, treatment, rating, verified)
- Clinic detail pages with doctor profiles and reviews
- User authentication (email/password)
- Review submission with star ratings
- Admin dashboard for clinic management
- Mobile responsive design
- Row Level Security (RLS) on all tables

## Deployment

Deploy to Vercel:

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Database Schema

- **clinics** - Clinic listings with location, contact info
- **doctors** - Doctors linked to clinics
- **treatments** - Available treatment types
- **clinic_treatments** - Junction table linking clinics to treatments
- **reviews** - User reviews with ratings
- **users_profile** - User profiles (auto-created on signup)
