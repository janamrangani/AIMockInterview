-- AI Mock Interview — Supabase schema
-- Run this in the Supabase SQL editor (or via `supabase db push`) to set up the database.

-- Companies: hardcoded list to start (Amazon, Google, Meta, etc.)
create table companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  interview_style_notes text not null, -- used as context in the AI prompt, e.g. Amazon's Leadership Principles
  created_at timestamptz default now()
);

-- Sessions: one mock interview attempt
create table sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company_id uuid not null references companies(id),
  role text not null, -- e.g. "SWE Intern", "New Grad SWE"
  status text not null default 'in_progress', -- in_progress | completed
  started_at timestamptz default now(),
  completed_at timestamptz
);

-- Questions: behavioral or technical, generated per session
create table questions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  type text not null check (type in ('behavioral', 'technical')),
  prompt_text text not null,
  order_index int not null
);

-- Answers: user responses, including follow-up answers
create table answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references questions(id) on delete cascade,
  user_answer_text text not null,
  is_followup boolean default false,
  parent_answer_id uuid references answers(id),
  created_at timestamptz default now()
);

-- Feedback: AI-generated scoring + notes per question
create table feedback (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  question_id uuid not null references questions(id) on delete cascade,
  score int check (score between 1 and 10),
  strengths_text text,
  gaps_text text,
  created_at timestamptz default now()
);

-- Generated documents: the "Interview Countdown Kit" add-ons
-- (LinkedIn rewrite, STAR stories, thank-you emails, etc.) — one flexible table for all of them
create table generated_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in (
    'linkedin_headline', 'star_story', 'interviewer_questions',
    'thank_you_email', 'negotiation_points', 'logistics_checklist',
    'tell_me_about_yourself'
  )),
  input_text text,
  output_text text not null,
  created_at timestamptz default now()
);

-- Companies are public — no RLS needed
alter table companies disable row level security;

-- Row Level Security: users can only see their own data
alter table sessions enable row level security;
alter table answers enable row level security;
alter table feedback enable row level security;
alter table generated_documents enable row level security;

create policy "Users can view own sessions" on sessions
  for select using (auth.uid() = user_id);
create policy "Users can insert own sessions" on sessions
  for insert with check (auth.uid() = user_id);

create policy "Users can view own generated documents" on generated_documents
  for select using (auth.uid() = user_id);
create policy "Users can insert own generated documents" on generated_documents
  for insert with check (auth.uid() = user_id);

-- Answers/feedback are scoped via their parent session — join-based policies
create policy "Users can view own answers" on answers
  for select using (
    exists (
      select 1 from questions q
      join sessions s on s.id = q.session_id
      where q.id = answers.question_id and s.user_id = auth.uid()
    )
  );

create policy "Users can view own feedback" on feedback
  for select using (
    exists (
      select 1 from sessions s
      where s.id = feedback.session_id and s.user_id = auth.uid()
    )
  );

-- ── Profiles: plan tracking (free | pack) ────────────────────────────────
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'pack', 'admin')),
  pack_purchased_at timestamptz,
  pack_expires_at   timestamptz,
  created_at        timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

-- Service role (used in API routes) bypasses RLS automatically.

-- Auto-create a profile row when a new user signs up
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ── Waitlist: email capture for the Unlimited plan ────────────────────────
create table waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz default now()
);

-- ── Seed a few starter companies
insert into companies (name, slug, interview_style_notes) values
('Amazon', 'amazon', 'Amazon interviews are structured around the 16 Leadership Principles. Expect "Tell me about a time..." behavioral questions with a strong bar for ownership, customer obsession, and data-driven decisions. Technical questions emphasize coding fundamentals (arrays, strings, trees, graphs) and clean, working code over cleverness.'),
('Google', 'google', 'Google interviews emphasize general cognitive ability, coding fundamentals, and "Googleyness" (collaboration, comfort with ambiguity). Behavioral questions probe how you handle ambiguity and work with others. Technical questions favor strong algorithmic fundamentals and clear communication of approach.'),
('Meta', 'meta', 'Meta interviews focus heavily on execution speed and impact. Behavioral questions map to their values around moving fast and having impact. Technical questions are coding-heavy with an emphasis on optimal solutions and clean implementation under time pressure.'),
('Microsoft', 'microsoft', 'Microsoft interviews blend technical depth with a collaborative, growth-mindset culture. Behavioral questions often explore how you've learned from failure or worked across teams. Technical questions cover core CS fundamentals with a focus on practical problem-solving.');
