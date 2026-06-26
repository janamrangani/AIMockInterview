-- AI Mock Interview — Supabase schema
-- Single authoritative source of truth. Run in the Supabase SQL editor.
-- Safe to re-run: uses IF NOT EXISTS / DROP IF EXISTS / ON CONFLICT DO NOTHING throughout.

-- ── Companies ─────────────────────────────────────────────────────────────────
create table if not exists companies (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null,
  slug                  text unique not null,
  interview_style_notes text not null,
  created_at            timestamptz default now()
);

alter table companies disable row level security;

-- ── Profiles ──────────────────────────────────────────────────────────────────
create table if not exists profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  plan              text not null default 'free' check (plan in ('free', 'pack', 'admin')),
  pack_purchased_at timestamptz,
  pack_started_at   timestamptz,   -- explicit start; used for cap window calculation
  pack_expires_at   timestamptz,
  created_at        timestamptz default now()
);

alter table profiles enable row level security;

drop policy if exists "Users can view own profile"   on profiles;
drop policy if exists "Users can update own profile" on profiles;
create policy "Users can view own profile"   on profiles for select  using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update  using (auth.uid() = id) with check (auth.uid() = id);

create index if not exists idx_profiles_pack on profiles(plan, pack_expires_at) where plan = 'pack';

-- ── User Resumes ──────────────────────────────────────────────────────────────
-- Each upload is a new row. Active resume = most recent (order by created_at desc limit 1).
-- Replaces resume_filename / resume_text columns on profiles.
create table if not exists user_resumes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  filename    text not null,
  resume_text text not null,
  created_at  timestamptz default now()
);

alter table user_resumes enable row level security;

drop policy if exists "Users can view own resumes"   on user_resumes;
drop policy if exists "Users can insert own resumes" on user_resumes;
drop policy if exists "Users can delete own resumes" on user_resumes;
create policy "Users can view own resumes"   on user_resumes for select using (auth.uid() = user_id);
create policy "Users can insert own resumes" on user_resumes for insert with check (auth.uid() = user_id);
create policy "Users can delete own resumes" on user_resumes for delete using (auth.uid() = user_id);

create index if not exists idx_user_resumes_user on user_resumes(user_id, created_at desc);

-- ── Sessions ──────────────────────────────────────────────────────────────────
create table if not exists sessions (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  company_id          uuid not null references companies(id),
  role                text not null,
  status              text not null default 'in_progress' check (status in ('in_progress', 'completed')),
  custom_company_name text,           -- display name when company is "Other"
  question_count      int not null default 0,
  duration_seconds    int,            -- set on session completion
  started_at          timestamptz default now(),
  completed_at        timestamptz
);

alter table sessions enable row level security;

drop policy if exists "Users can view own sessions"   on sessions;
drop policy if exists "Users can insert own sessions" on sessions;
drop policy if exists "Users can update own sessions" on sessions;
drop policy if exists "Users can delete own sessions" on sessions;
create policy "Users can view own sessions"   on sessions for select using (auth.uid() = user_id);
create policy "Users can insert own sessions" on sessions for insert with check (auth.uid() = user_id);
create policy "Users can update own sessions" on sessions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete own sessions" on sessions for delete using (auth.uid() = user_id);

create index if not exists idx_sessions_user_started on sessions(user_id, started_at desc);
create index if not exists idx_sessions_user_status  on sessions(user_id, status);

-- ── Questions ─────────────────────────────────────────────────────────────────
create table if not exists questions (
  id              uuid primary key default gen_random_uuid(),
  session_id      uuid not null references sessions(id) on delete cascade,
  type            text not null check (type in ('behavioral', 'technical')),
  prompt_text     text not null,
  order_index     int not null,
  follow_up_count int not null default 0 check (follow_up_count <= 2)
);

alter table questions enable row level security;

drop policy if exists "Users can view own questions"   on questions;
drop policy if exists "Users can insert own questions" on questions;
drop policy if exists "Users can update own questions" on questions;
create policy "Users can view own questions"   on questions for select using (
  exists (select 1 from sessions s where s.id = questions.session_id and s.user_id = auth.uid())
);
create policy "Users can insert own questions" on questions for insert with check (
  exists (select 1 from sessions s where s.id = questions.session_id and s.user_id = auth.uid())
);
create policy "Users can update own questions" on questions for update using (
  exists (select 1 from sessions s where s.id = questions.session_id and s.user_id = auth.uid())
);

create index if not exists idx_questions_session on questions(session_id, order_index);

-- ── Answers ───────────────────────────────────────────────────────────────────
-- follow_up_index: 0 = initial answer, 1 = first follow-up, 2 = second follow-up
create table if not exists answers (
  id               uuid primary key default gen_random_uuid(),
  question_id      uuid not null references questions(id) on delete cascade,
  user_answer_text text not null,
  follow_up_index  int not null default 0,   -- replaces is_followup boolean
  is_followup      boolean generated always as (follow_up_index > 0) stored,  -- backwards-compat alias
  parent_answer_id uuid references answers(id),
  created_at       timestamptz default now()
);

alter table answers enable row level security;

drop policy if exists "Users can view own answers"   on answers;
drop policy if exists "Users can insert own answers" on answers;
create policy "Users can view own answers" on answers for select using (
  exists (
    select 1 from questions q
    join sessions s on s.id = q.session_id
    where q.id = answers.question_id and s.user_id = auth.uid()
  )
);
create policy "Users can insert own answers" on answers for insert with check (
  exists (
    select 1 from questions q
    join sessions s on s.id = q.session_id
    where q.id = answers.question_id and s.user_id = auth.uid()
  )
);

create index if not exists idx_answers_question on answers(question_id, follow_up_index);

-- ── Feedback ──────────────────────────────────────────────────────────────────
-- Always store full strengths + gaps. Gate visibility in the API layer, not here.
create table if not exists feedback (
  id             uuid primary key default gen_random_uuid(),
  session_id     uuid not null references sessions(id) on delete cascade,
  question_id    uuid not null references questions(id) on delete cascade,
  score          int check (score between 1 and 10),
  strengths_text text,
  gaps_text      text,
  created_at     timestamptz default now()
);

alter table feedback enable row level security;

drop policy if exists "Users can view own feedback"   on feedback;
drop policy if exists "Users can insert own feedback" on feedback;
create policy "Users can view own feedback" on feedback for select using (
  exists (select 1 from sessions s where s.id = feedback.session_id and s.user_id = auth.uid())
);
create policy "Users can insert own feedback" on feedback for insert with check (
  exists (select 1 from sessions s where s.id = feedback.session_id and s.user_id = auth.uid())
);

create index if not exists idx_feedback_session  on feedback(session_id);
create index if not exists idx_feedback_question on feedback(question_id);

-- ── Generated Documents ───────────────────────────────────────────────────────
-- Countdown Kit outputs — stores company/role context alongside the generated content.
create table if not exists generated_documents (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  company_id  uuid references companies(id),   -- null when custom company name used
  role        text,
  type        text not null check (type in (
    'linkedin_headline', 'star_story', 'interviewer_questions',
    'thank_you_email', 'negotiation_points', 'logistics_checklist',
    'tell_me_about_yourself'
  )),
  input_text  text,
  output_text text not null,
  created_at  timestamptz default now()
);

alter table generated_documents enable row level security;

drop policy if exists "Users can view own generated documents"   on generated_documents;
drop policy if exists "Users can insert own generated documents" on generated_documents;
create policy "Users can view own generated documents"   on generated_documents for select using (auth.uid() = user_id);
create policy "Users can insert own generated documents" on generated_documents for insert with check (auth.uid() = user_id);

create index if not exists idx_generated_docs_user on generated_documents(user_id, type, created_at desc);

-- ── Payment History ───────────────────────────────────────────────────────────
create table if not exists payment_history (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users(id) on delete cascade,
  stripe_session_id  text not null unique,
  stripe_customer_id text,
  amount_cents       int not null,
  currency           text not null default 'usd',
  plan_granted       text not null,
  created_at         timestamptz default now()
);

alter table payment_history enable row level security;

drop policy if exists "Users can view own payment history" on payment_history;
create policy "Users can view own payment history" on payment_history for select using (auth.uid() = user_id);

create index if not exists idx_payment_history_user on payment_history(user_id, created_at desc);

-- ── Waitlist ──────────────────────────────────────────────────────────────────
create table if not exists waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz default now()
);

-- ── Auto-create profile on signup ─────────────────────────────────────────────
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ── Seed companies ────────────────────────────────────────────────────────────
insert into companies (name, slug, interview_style_notes) values
('Amazon', 'amazon', 'Amazon interviews are structured around the 16 Leadership Principles. Expect "Tell me about a time..." behavioral questions with a strong bar for ownership, customer obsession, and data-driven decisions. Technical questions emphasize coding fundamentals (arrays, strings, trees, graphs) and clean, working code over cleverness.'),
('Google', 'google', 'Google interviews emphasize general cognitive ability, coding fundamentals, and "Googleyness" (collaboration, comfort with ambiguity). Behavioral questions probe how you handle ambiguity and work with others. Technical questions favor strong algorithmic fundamentals and clear communication of approach.'),
('Meta', 'meta', 'Meta interviews focus heavily on execution speed and impact. Behavioral questions map to their values around moving fast and having impact. Technical questions are coding-heavy with an emphasis on optimal solutions and clean implementation under time pressure.'),
('Microsoft', 'microsoft', 'Microsoft interviews blend technical depth with a collaborative, growth-mindset culture. Behavioral questions often explore how you''ve learned from failure or worked across teams. Technical questions cover core CS fundamentals with a focus on practical problem-solving.'),
('Apple', 'apple', 'Apple interviews emphasize craftsmanship, attention to detail, and the "Directly Responsible Individual" (DRI) model. Behavioral questions focus on ownership, cross-functional collaboration, and delivering polished products. Technical questions cover algorithms, system design, and performance optimization with high expectations for code quality.'),
('Netflix', 'netflix', 'Netflix has a high bar for senior talent and a "Freedom and Responsibility" culture. Behavioral questions probe judgment under ambiguity, candor, and outsized personal impact. Technical questions are rigorous with emphasis on distributed systems at massive scale and clear communication of trade-offs.'),
('Uber', 'uber', 'Uber interviews are fast-paced and data-driven. Behavioral questions focus on moving fast under ambiguity, handling operational complexity, and making data-driven decisions. Technical questions emphasize real-time systems, marketplace infrastructure, and platform scale.'),
('Airbnb', 'airbnb', 'Airbnb''s "Belong Anywhere" culture drives behavioral questions focused on community, belonging, and creative problem-solving. Technical questions blend systems design with product thinking and test both engineering depth and user empathy.'),
('Stripe', 'stripe', 'Stripe has an extremely high technical bar and a "users first" philosophy. Behavioral questions focus on user empathy, first-principles thinking, and technical depth. Technical questions are deep and detailed — expect to justify every design decision.'),
('OpenAI', 'openai', 'OpenAI is mission-driven around safe and beneficial AGI. Behavioral questions focus on safety mindset, research rigor, and genuine mission alignment. Technical questions often involve ML systems, reasoning about model behavior, and engineering at the frontier of AI.'),
('Salesforce', 'salesforce', 'Salesforce''s "Ohana" culture and customer success values drive behavioral questions around trust, customer impact, and collaboration. Technical questions cover enterprise-scale cloud systems and building reliable B2B software.'),
('LinkedIn', 'linkedin', 'LinkedIn''s "Members First" mission shapes behavioral questions around member impact and data-driven product decisions. Technical questions cover large-scale graph systems, feed ranking, and infrastructure serving 900M+ users.'),
('Twitter/X', 'twitter', 'Twitter/X values small teams with large impact and fast iteration. Behavioral questions focus on autonomy, directness, and shipping quickly. Technical questions cover distributed systems, real-time data pipelines, and content ranking at scale.'),
('Spotify', 'spotify', 'Spotify''s autonomous "Squad" model shapes behavioral questions around squad ownership, cross-functional collaboration, and data-driven product decisions. Technical questions mix backend scale with data and ML engineering.'),
('Adobe', 'adobe', 'Adobe interviews blend creativity tools expertise with enterprise cloud scale. Behavioral questions focus on customer empathy and delivering quality creative software. Technical questions cover graphics systems, document processing, and cloud services.'),
('Nvidia', 'nvidia', 'Nvidia interviews have a very high technical bar. Behavioral questions focus on technical innovation and deep domain expertise. Technical questions are highly specialized covering GPU architecture, CUDA programming, and high-performance computing.'),
('Goldman Sachs', 'goldman-sachs', 'Goldman Sachs technology interviews combine finance domain knowledge with rigorous engineering. Behavioral questions focus on risk management, integrity, and client focus. Technical questions cover high-performance systems and low-latency financial data processing.'),
('JPMorgan', 'jpmorgan', 'JPMorgan interviews reflect a large financial institution with major technology investment. Behavioral questions focus on risk awareness and compliance mindset. Technical questions cover distributed systems and fintech infrastructure handling sensitive financial data.'),
('McKinsey', 'mckinsey', 'McKinsey interviews are heavily case-based. Expect structured problem-solving cases (market sizing, profitability, strategy) assessed on hypothesis-driven thinking and clear recommendations. The Personal Experience Interview (PEI) assesses leadership and entrepreneurial drive using STAR format.'),
('Other', 'other', 'General professional interview. Behavioral questions follow the STAR format focusing on impact, ownership, collaboration, and problem-solving. Technical questions cover core CS fundamentals, algorithms, data structures, and system design appropriate to the role level.')
on conflict (slug) do nothing;
