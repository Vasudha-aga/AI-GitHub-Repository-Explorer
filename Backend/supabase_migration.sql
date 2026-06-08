-- ============================================================
-- RepoLens — Supabase SQL Migration
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- 1. USERS
-- Stores GitHub OAuth profile data synced after login
create table if not exists users (
  id          uuid primary key default gen_random_uuid(),
  github_id   text unique not null,
  username    text,
  name        text,
  email       text,
  avatar_url  text,
  tech_stack  text[],
  created_at  timestamptz default now()
);

-- 2. SAVED REPOSITORIES
-- One row per user-repo bookmark
create table if not exists saved_repositories (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid references users(id) on delete cascade,
  repo_id   text not null,           -- GitHub repo numeric ID (stored as text)
  repo_name text not null,           -- e.g. "pytorch/pytorch"
  repo_url  text,                    -- GitHub HTML URL
  repo_data jsonb,                   -- snapshot of full repo object
  saved_at  timestamptz default now(),
  unique(user_id, repo_id)           -- prevent duplicates
);

-- 3. SEARCH HISTORY
-- One row per search action
create table if not exists search_history (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references users(id) on delete cascade,
  search_query text not null,
  searched_at  timestamptz default now()
);

-- 4. AI ANALYSIS CACHE
-- One row per GitHub repo — shared across all users
-- repo_id is the GitHub numeric ID (string for safety)
create table if not exists ai_analysis (
  id                uuid primary key default gen_random_uuid(),
  repo_id           text unique not null,
  summary           text,
  difficulty        text check (difficulty in ('Beginner', 'Intermediate', 'Advanced')),
  required_skills   text[],
  learning_outcomes text[],
  career_relevance  text,
  ai_score          integer check (ai_score between 0 and 100),
  tech_stack        jsonb,            -- [{ label, value }]
  estimated_time    text,
  created_at        timestamptz default now()
);

-- ── Indexes for common query patterns ──────────────────────────────────────
create index if not exists idx_saved_repos_user    on saved_repositories(user_id);
create index if not exists idx_search_history_user on search_history(user_id, searched_at desc);
create index if not exists idx_ai_analysis_repo    on ai_analysis(repo_id);

-- ── Row Level Security ──────────────────────────────────────────────────────
-- Backend uses service-role key (bypasses RLS), so RLS is optional.
-- Enable only if you add direct Supabase JS calls from frontend later.

-- alter table users               enable row level security;
-- alter table saved_repositories  enable row level security;
-- alter table search_history      enable row level security;
-- alter table ai_analysis         enable row level security;
