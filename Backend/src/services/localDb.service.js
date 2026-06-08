import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, "..", "..", "db.json");

function readDb() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      users: [],
      saved_repositories: [],
      search_history: [],
      ai_analysis: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
  } catch (e) {
    console.error("Failed to parse db.json, resetting", e);
    return { users: [], saved_repositories: [], search_history: [], ai_analysis: [] };
  }
}

function writeDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Generates simple UUID-like string
function genUuid() {
  return "local-" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// ════════════════════════════════════════════════════════════════
// USERS
// ════════════════════════════════════════════════════════════════
export async function upsertUser({ github_id, username, name, email, avatar_url, bio = "" }) {
  const db = readDb();
  let userIndex = db.users.findIndex(u => u.github_id === github_id);

  const userData = {
    github_id,
    username: username || github_id,
    name: name || username || github_id,
    email: email || "",
    avatar_url: avatar_url || "",
    bio: bio || "",
    created_at: new Date().toISOString()
  };

  if (userIndex > -1) {
    db.users[userIndex] = { ...db.users[userIndex], ...userData };
  } else {
    userData.id = genUuid();
    db.users.push(userData);
    userIndex = db.users.length - 1;
  }

  writeDb(db);
  return db.users[userIndex];
}

export async function getUserById(id) {
  const db = readDb();
  const user = db.users.find(u => u.id === id);
  if (!user) throw new Error("User not found");
  return user;
}

export async function getUserByEmail(email) {
  const db = readDb();
  return db.users.find(u => u.email === email);
}

export async function createUser({ email, password, name, username }) {
  const db = readDb();
  if (db.users.some(u => u.email === email)) {
    throw new Error("Email already registered");
  }

  const newUser = {
    id: genUuid(),
    github_id: "local-email-" + Math.random().toString(36).substring(2, 7),
    username: username || email.split("@")[0],
    name: name || email.split("@")[0],
    email,
    password, // Storing password directly for mock local dev simplicity
    avatar_url: "",
    bio: "",
    created_at: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDb(db);
  return newUser;
}

export async function updateUser(id, updates) {
  const db = readDb();
  const idx = db.users.findIndex(u => u.id === id);
  if (idx === -1) throw new Error("User not found");

  db.users[idx] = { ...db.users[idx], ...updates };
  writeDb(db);
  return db.users[idx];
}

// ════════════════════════════════════════════════════════════════
// SAVED REPOSITORIES
// ════════════════════════════════════════════════════════════════
export async function getSavedRepos(userId) {
  const db = readDb();
  return db.saved_repositories
    .filter(r => r.user_id === userId)
    .sort((a, b) => new Date(b.saved_at).getTime() - new Date(a.saved_at).getTime());
}

export async function saveRepo(userId, { repo_id, repo_name, repo_url, repo_data }) {
  const db = readDb();
  const strRepoId = String(repo_id);
  const existingIdx = db.saved_repositories.findIndex(r => r.user_id === userId && r.repo_id === strRepoId);

  const saveObj = {
    id: genUuid(),
    user_id: userId,
    repo_id: strRepoId,
    repo_name,
    repo_url,
    repo_data,
    saved_at: new Date().toISOString()
  };

  if (existingIdx > -1) {
    db.saved_repositories[existingIdx] = saveObj;
  } else {
    db.saved_repositories.push(saveObj);
  }

  writeDb(db);
  return saveObj;
}

export async function unsaveRepo(userId, repoId) {
  const db = readDb();
  const strRepoId = String(repoId);
  db.saved_repositories = db.saved_repositories.filter(r => !(r.user_id === userId && r.repo_id === strRepoId));
  writeDb(db);
  return { success: true };
}

export async function isRepoSaved(userId, repoId) {
  const db = readDb();
  const strRepoId = String(repoId);
  return db.saved_repositories.some(r => r.user_id === userId && r.repo_id === strRepoId);
}

// ════════════════════════════════════════════════════════════════
// SEARCH HISTORY
// ════════════════════════════════════════════════════════════════
export async function addSearchHistory(userId, searchQuery) {
  const db = readDb();
  const entry = {
    id: genUuid(),
    user_id: userId,
    search_query: searchQuery,
    searched_at: new Date().toISOString()
  };
  db.search_history.push(entry);
  writeDb(db);
  return entry;
}

export async function getSearchHistory(userId, limit = 50) {
  const db = readDb();
  return db.search_history
    .filter(h => h.user_id === userId)
    .sort((a, b) => new Date(b.searched_at).getTime() - new Date(a.searched_at).getTime())
    .slice(0, limit);
}

export async function clearSearchHistory(userId) {
  const db = readDb();
  db.search_history = db.search_history.filter(h => h.user_id !== userId);
  writeDb(db);
  return { success: true };
}

export async function getTrendingSearches(limit = 5) {
  const db = readDb();
  const counts = {};
  for (const h of db.search_history) {
    if (!h.search_query) continue;
    counts[h.search_query] = (counts[h.search_query] || 0) + 1;
  }
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return sorted.slice(0, limit).map(s => s[0]);
}

// ════════════════════════════════════════════════════════════════
// AI ANALYSIS CACHE
// ════════════════════════════════════════════════════════════════
export async function getCachedAnalysis(repoId) {
  const db = readDb();
  const strRepoId = String(repoId);
  return db.ai_analysis.find(a => a.repo_id === strRepoId) || null;
}

export async function saveAnalysis(repoId, analysis) {
  const db = readDb();
  const strRepoId = String(repoId);
  const existingIdx = db.ai_analysis.findIndex(a => a.repo_id === strRepoId);

  const analysisObj = {
    id: genUuid(),
    repo_id: strRepoId,
    summary: analysis.summary,
    difficulty: analysis.difficulty,
    required_skills: analysis.required_skills,
    learning_outcomes: analysis.learning_outcomes,
    career_relevance: analysis.career_relevance,
    ai_score: Number(analysis.ai_score),
    tech_stack: analysis.tech_stack,
    estimated_time: analysis.estimated_time,
    created_at: new Date().toISOString()
  };

  if (existingIdx > -1) {
    db.ai_analysis[existingIdx] = analysisObj;
  } else {
    db.ai_analysis.push(analysisObj);
  }

  writeDb(db);
  return analysisObj;
}
