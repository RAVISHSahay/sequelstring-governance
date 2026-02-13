-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Contacts Table
create table if not exists contacts (
  id uuid default uuid_generate_v4() primary key,
  first_name text,
  last_name text,
  email text,
  phone text,
  job_title text,
  company text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Social Profiles Table
create table if not exists social_profiles (
  id uuid default uuid_generate_v4() primary key,
  contact_id uuid references contacts(id) on delete cascade,
  platform text not null,
  platform_user_id text,
  handle text,
  profile_url text,
  display_name text,
  bio text,
  avatar_url text,
  followers int default 0,
  is_connected boolean default false,
  status text default 'active',
  is_verified boolean default false,
  last_synced_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Social Events Table
create table if not exists social_events (
  id uuid default uuid_generate_v4() primary key,
  contact_id uuid references contacts(id) on delete cascade,
  social_account_id uuid references social_profiles(id) on delete set null,
  platform text not null,
  event_type text not null, -- 'new_post', 'mention', etc.
  title text,
  content text,
  event_url text,
  event_time timestamp with time zone default timezone('utc'::text, now()) not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Important Dates Table
create table if not exists important_dates (
  id uuid default uuid_generate_v4() primary key,
  contact_id uuid references contacts(id) on delete cascade,
  type text not null, -- 'Birthday', 'Anniversary', 'Custom'
  label text,
  date_day int not null,
  date_month int not null,
  year int,
  repeat_annually boolean default true,
  email_template_id text,
  send_time text,
  opt_out boolean default false,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- News Alerts (Intelligence)
create table if not exists news_alerts (
  id uuid default uuid_generate_v4() primary key,
  account_id uuid, -- Link to an 'accounts' table if you have one, or loose coupling
  title text not null,
  summary text,
  source_name text,
  source_url text,
  published_at timestamp with time zone,
  sentiment_score float,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Call History
create table if not exists calls (
  id uuid default uuid_generate_v4() primary key,
  contact_id uuid references contacts(id) on delete set null,
  user_id uuid, -- Sales rep ID
  start_time timestamp with time zone default timezone('utc'::text, now()) not null,
  end_time timestamp with time zone,
  duration int, -- seconds
  status text, -- 'completed', 'missed', etc.
  outcome text,
  notes text,
  recording_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
