import { supabase, supabaseConfigured } from "../config/supabase.js";
import * as localDb from "./localDb.service.js";

// ════════════════════════════════════════════════════════════════
//  USERS
// ════════════════════════════════════════════════════════════════

export async function upsertUser(fields) {
  if (!supabaseConfigured) return localDb.upsertUser(fields);

  const payload = { 
    github_id: fields.github_id, 
    username: fields.username, 
    name: fields.name, 
    email: fields.email, 
    avatar_url: fields.avatar_url 
  };
  if (fields.id) payload.id = fields.id;

  const { data, error } = await supabase
    .from("users")
    .upsert(payload, { onConflict: "github_id" })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserById(id) {
  if (!supabaseConfigured) return localDb.getUserById(id);

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function getUserByEmail(email) {
  if (!supabaseConfigured) return localDb.getUserByEmail(email);

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createUser(fields) {
  if (!supabaseConfigured) return localDb.createUser(fields);
  // For Supabase, user creation is handled via supabase.auth, then upsertUser syncs the profile
  return upsertUser(fields);
}

export async function updateUser(id, fields) {
  if (!supabaseConfigured) return localDb.updateUser(id, fields);

  try {
    const { data, error } = await supabase
      .from("users")
      .update(fields)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn("[updateUser] Warning:", err.message);
    const safeFields = { ...fields };
    delete safeFields.streak_count;
    delete safeFields.last_active_date;
    delete safeFields.tech_stack;
    delete safeFields.bio;
    delete safeFields.location;
    delete safeFields.website;

    if (Object.keys(safeFields).length < Object.keys(fields).length) {
      const { data, error } = await supabase
        .from("users")
        .update(safeFields)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    throw err;
  }
}

// ════════════════════════════════════════════════════════════════
//  SAVED REPOSITORIES
// ════════════════════════════════════════════════════════════════

export async function getSavedRepos(userId) {
  if (!supabaseConfigured) return localDb.getSavedRepos(userId);

  const { data, error } = await supabase
    .from("saved_repositories")
    .select("*")
    .eq("user_id", userId)
    .order("saved_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function saveRepo(userId, repoData) {
  if (!supabaseConfigured) return localDb.saveRepo(userId, repoData);

  try {
    const { data, error } = await supabase
      .from("saved_repositories")
      .insert([
        {
          user_id: userId,
          repo_id: String(repoData.id || repoData.repo_id),
          repo_name: repoData.fullName || repoData.name || repoData.repo_name,
          repo_url: repoData.htmlUrl || repoData.repo_url,
          repo_data: repoData.repo_data || repoData
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    // If the schema is outdated and repo_data column doesn't exist, retry without it
    console.warn("[saveRepo] Failed, retrying without repo_data:", err.message);
    const { data: fallbackData, error: fallbackError } = await supabase
      .from("saved_repositories")
      .insert([
        {
          user_id: userId,
          repo_id: String(repoData.id || repoData.repo_id),
          repo_name: repoData.fullName || repoData.name || repoData.repo_name,
          repo_url: repoData.htmlUrl || repoData.repo_url,
        }
      ])
      .select()
      .single();
    
    if (fallbackError) throw fallbackError;
    return fallbackData;
  }
}

export async function unsaveRepo(userId, repoId) {
  if (!supabaseConfigured) return localDb.unsaveRepo(userId, repoId);

  const { error } = await supabase
    .from("saved_repositories")
    .delete()
    .eq("user_id", userId)
    .eq("repo_id", String(repoId));

  if (error) throw error;
  return { success: true };
}

export async function isRepoSaved(userId, repoId) {
  if (!supabaseConfigured) return localDb.isRepoSaved(userId, repoId);

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
  if (!supabaseConfigured) return localDb.addSearchHistory(userId, searchQuery);

  const { data, error } = await supabase
    .from("search_history")
    .insert({ user_id: userId, search_query: searchQuery })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getSearchHistory(userId, limit = 50) {
  if (!supabaseConfigured) return localDb.getSearchHistory(userId, limit);

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
  if (!supabaseConfigured) return localDb.clearSearchHistory(userId);

  const { error } = await supabase
    .from("search_history")
    .delete()
    .eq("user_id", userId);

  if (error) throw error;
  return { success: true };
}

export async function getTrendingSearches(limit = 5) {
  if (!supabaseConfigured) return localDb.getTrendingSearches(limit);

  // Fallback to in-memory grouping of the last 1000 searches
  const { data, error } = await supabase
    .from("search_history")
    .select("search_query")
    .order("searched_at", { ascending: false })
    .limit(1000);

  if (error) throw error;

  const counts = {};
  for (const h of data) {
    if (!h.search_query) continue;
    counts[h.search_query] = (counts[h.search_query] || 0) + 1;
  }
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return sorted.slice(0, limit).map(s => s[0]);
}

// ════════════════════════════════════════════════════════════════
//  AI ANALYSIS CACHE
// ════════════════════════════════════════════════════════════════

export async function getCachedAnalysis(repoId) {
  if (!supabaseConfigured) return localDb.getCachedAnalysis(repoId);

  const { data } = await supabase
    .from("ai_analysis")
    .select("*")
    .eq("repo_id", String(repoId))
    .maybeSingle();

  return data; // null if not cached
}

export async function saveAnalysis(repoId, analysis) {
  if (!supabaseConfigured) return localDb.saveAnalysis(repoId, analysis);

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
