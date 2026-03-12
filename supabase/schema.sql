-- ============================================================
-- JOBI JOB PORTAL - SUPABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. PROFILES (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text,
  role text not null check (role in ('candidate', 'employer')),
  avatar_url text,
  phone text,
  location text,
  bio text,
  website text,
  created_at timestamptz default now()
);

-- 2. COMPANIES (one per employer)
create table if not exists public.companies (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade unique,
  name text not null,
  logo_url text,
  location text,
  description text,
  website text,
  founded_year int,
  company_size text,
  industry text,
  created_at timestamptz default now()
);

-- 3. JOBS
create table if not exists public.jobs (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references public.companies(id) on delete cascade,
  posted_by uuid references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  job_type text check (job_type in ('Fulltime', 'Part time', 'Freelance', 'Fixed-Price', 'Internship')),
  experience text check (experience in ('Fresher', 'Intermediate', 'Expert', 'Internship', 'No-Experience')),
  salary_min numeric default 0,
  salary_max numeric default 0,
  salary_duration text check (salary_duration in ('Monthly', 'Weekly', 'Hourly', 'Yearly')),
  location text,
  country text,
  city text,
  state text,
  categories text[] default '{}',
  tags text[] default '{}',
  english_fluency text check (english_fluency in ('Basic', 'Conversational', 'Fluent', 'Native/Bilingual')),
  is_active boolean default true,
  deadline date,
  created_at timestamptz default now()
);

-- 4. CANDIDATE PROFILES
create table if not exists public.candidate_profiles (
  id uuid references public.profiles(id) on delete cascade primary key,
  title text,
  skills text[] default '{}',
  experience text,
  qualification text,
  salary_min text,
  salary_max text,
  salary_duration text,
  resume_url text,
  portfolio_url text,
  english_fluency text,
  available_from date,
  created_at timestamptz default now()
);

-- 5. APPLICATIONS
create table if not exists public.applications (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references public.jobs(id) on delete cascade,
  candidate_id uuid references public.profiles(id) on delete cascade,
  cover_letter text,
  resume_url text,
  status text default 'pending' check (status in ('pending', 'reviewing', 'shortlisted', 'rejected', 'hired')),
  created_at timestamptz default now(),
  unique(job_id, candidate_id)
);

-- 6. SAVED JOBS (candidate wishlist)
create table if not exists public.saved_jobs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  job_id uuid references public.jobs(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, job_id)
);

-- 7. SAVED CANDIDATES (employer bookmarks)
create table if not exists public.saved_candidates (
  id uuid default gen_random_uuid() primary key,
  employer_id uuid references public.profiles(id) on delete cascade,
  candidate_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(employer_id, candidate_id)
);

-- 8. MESSAGES
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references public.profiles(id) on delete cascade,
  receiver_id uuid references public.profiles(id) on delete cascade,
  subject text,
  body text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- 9. JOB ALERTS
create table if not exists public.job_alerts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  keyword text,
  location text,
  category text,
  job_type text,
  frequency text default 'daily' check (frequency in ('daily', 'weekly', 'monthly')),
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.jobs enable row level security;
alter table public.candidate_profiles enable row level security;
alter table public.applications enable row level security;
alter table public.saved_jobs enable row level security;
alter table public.saved_candidates enable row level security;
alter table public.messages enable row level security;
alter table public.job_alerts enable row level security;

-- PROFILES policies
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- COMPANIES policies
create policy "Companies are viewable by everyone" on public.companies for select using (true);
create policy "Employers can insert own company" on public.companies for insert with check (auth.uid() = user_id);
create policy "Employers can update own company" on public.companies for update using (auth.uid() = user_id);
create policy "Employers can delete own company" on public.companies for delete using (auth.uid() = user_id);

-- JOBS policies
create policy "Jobs are viewable by everyone" on public.jobs for select using (true);
create policy "Employers can post jobs" on public.jobs for insert with check (auth.uid() = posted_by);
create policy "Employers can update own jobs" on public.jobs for update using (auth.uid() = posted_by);
create policy "Employers can delete own jobs" on public.jobs for delete using (auth.uid() = posted_by);

-- CANDIDATE PROFILES policies
create policy "Candidate profiles viewable by everyone" on public.candidate_profiles for select using (true);
create policy "Candidates can insert own profile" on public.candidate_profiles for insert with check (auth.uid() = id);
create policy "Candidates can update own profile" on public.candidate_profiles for update using (auth.uid() = id);

-- APPLICATIONS policies
create policy "Candidates can view own applications" on public.applications for select using (auth.uid() = candidate_id);
create policy "Employers can view applications for their jobs" on public.applications for select using (
  exists (select 1 from public.jobs where jobs.id = applications.job_id and jobs.posted_by = auth.uid())
);
create policy "Candidates can apply to jobs" on public.applications for insert with check (auth.uid() = candidate_id);
create policy "Employers can update application status" on public.applications for update using (
  exists (select 1 from public.jobs where jobs.id = applications.job_id and jobs.posted_by = auth.uid())
);

-- SAVED JOBS policies
create policy "Users can view own saved jobs" on public.saved_jobs for select using (auth.uid() = user_id);
create policy "Users can save jobs" on public.saved_jobs for insert with check (auth.uid() = user_id);
create policy "Users can unsave jobs" on public.saved_jobs for delete using (auth.uid() = user_id);

-- SAVED CANDIDATES policies
create policy "Employers can view own saved candidates" on public.saved_candidates for select using (auth.uid() = employer_id);
create policy "Employers can save candidates" on public.saved_candidates for insert with check (auth.uid() = employer_id);
create policy "Employers can unsave candidates" on public.saved_candidates for delete using (auth.uid() = employer_id);

-- MESSAGES policies
create policy "Users can view own messages" on public.messages for select using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "Users can send messages" on public.messages for insert with check (auth.uid() = sender_id);
create policy "Recipients can mark as read" on public.messages for update using (auth.uid() = receiver_id);

-- JOB ALERTS policies
create policy "Users can view own alerts" on public.job_alerts for select using (auth.uid() = user_id);
create policy "Users can create alerts" on public.job_alerts for insert with check (auth.uid() = user_id);
create policy "Users can update own alerts" on public.job_alerts for update using (auth.uid() = user_id);
create policy "Users can delete own alerts" on public.job_alerts for delete using (auth.uid() = user_id);

-- ============================================================
-- TRIGGER: Auto-create profile on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'candidate')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- STORAGE BUCKETS (run separately or via dashboard)
-- ============================================================
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
-- insert into storage.buckets (id, name, public) values ('resumes', 'resumes', false);
-- insert into storage.buckets (id, name, public) values ('company-logos', 'company-logos', true);
