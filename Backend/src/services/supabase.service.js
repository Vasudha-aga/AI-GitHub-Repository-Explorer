import { supabase } from "../config/supabase.js";

// ════════════════════════════════════════════════════════════════
//  USERS
// ════════════════════════════════════════════════════════════════

export async function upsertUser({ github_id, username, name, email, avatar_url }) {
  const { data, error } = await supabase
    .from("users")
    .upsert(
      { github_id, username, name, email, avatar_url },
      { onConflict: "github_id" }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserById(id) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

// ════════════════════════════════════════════════════════════════
//  SAVED REPOSITORIES
// ════════════════════════════════════════════════════════════════

export async function getSavedRepos(userId) {
  const { data, error } = await supabase
    .from("saved_repositories")
    .select("*")
    .eq("user_id", userId)
    .order("saved_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function saveRepo(userId, { repo_id, repo_name, repo_url, repo_data }) {
  const { data, error } = await supabase
    .from("saved_repositories")
    .upsert(
      { user_id: userId, repo_id: String(repo_id), repo_name, repo_url, repo_data },
      { onConflict: "user_id,repo_id" }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function unsaveRepo(userId, repoId) {
  const { error } = await supabase
    .from("saved_repositories")
    .delete()
    .eq("user_id", userId)
    .eq("repo_id", String(repoId));

  if (error) throw error;
  return { success: true };
}

export async function isRepoSaved(userId, repoId) {
  const { data } = await supabase
    .from("saved_repositories")
    .select("id")
    .eq("user_id", userId)
    .eq("repo_id", String(repoId))
    .maybeSingle();

  return !!data;
}

// ════════════════════════════════════════════════════════════════
//  SEARCH HISTORY
// ════════════════════════════════════════════════════════════════

export async function addSearchHistory(userId, searchQuery) {
  const { data, error } = await supabase
    .from("search_history")
    .insert({ user_id: userId, search_query: searchQuery })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getSearchHistory(userId, limit = 50) {
  const { data, error } = await supabase
    .from("search_history")
    .select("*")
    .eq("user_id", userId)
    .order("searched_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function clearSearchHistory(userId) {
  const { error } = await supabase
    .from("search_history")
    .delete()
    .eq("user_id", userId);

  if (error) throw error;
  return { success: true };
}

// ════════════════════════════════════════════════════════════════
//  AI ANALYSIS CACHE
// ════════════════════════════════════════════════════════════════

export async function getCachedAnalysis(repoId) {
  const { data } = await supabase
    .from("ai_analysis")
    .select("*")
    .eq("repo_id", String(repoId))
    .maybeSingle();

  return data; // null if not cached
}

export async function saveAnalysis(repoId, analysis) {
  const { data, error } = await supabase
    .from("ai_analysis")
    .upsert(
      {
        repo_id:          String(repoId),
        summary:          analysis.summary,
        difficulty:       analysis.difficulty,
        required_skills:  analysis.required_skills,
        learning_outcomes:analysis.learning_outcomes,
        career_relevance: analysis.career_relevance,
        ai_score:         analysis.ai_score,
        tech_stack:       analysis.tech_stack,
        estimated_time:   analysis.estimated_time,
      },
      { onConflict: "repo_id" }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}
