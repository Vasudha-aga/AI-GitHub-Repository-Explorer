import { supabase } from "../config/supabase.js";
import {
  upsertUser,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
} from "../services/supabase.service.js";
import jwt from "jsonwebtoken";

const isSupabaseConfigured =
  process.env.SUPABASE_URL &&
  !process.env.SUPABASE_URL.includes("your-project-id") &&
  process.env.SUPABASE_ANON_KEY &&
  !process.env.SUPABASE_ANON_KEY.includes("your-anon-key");

const JWT_SECRET = process.env.JWT_SECRET || "repolens-local-secret";

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

// Streak Calculation Helper
async function processStreak(dbUser) {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
  
  const lastActive = dbUser.last_active_date;
  let streak = dbUser.streak_count || 0;

  if (lastActive === todayStr) {
    // Already logged in today, do nothing
    return dbUser;
  }

  // Check if last active was yesterday
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (lastActive === yesterdayStr) {
    streak += 1;
  } else {
    // Skipped a day or first login
    streak = 1;
  }

  try {
    const updatedUser = await updateUser(dbUser.id, {
      streak_count: streak,
      last_active_date: todayStr
    });
    return updatedUser;
  } catch (err) {
    // If updating fails (e.g. missing columns), return the user with patched values for the frontend
    console.warn("Could not update streak in DB, schema might be old.");
    return { ...dbUser, streak_count: streak, last_active_date: todayStr };
  }
}

/**
 * GET /api/auth/github
 * Returns the Supabase OAuth redirect URL — frontend opens this in browser.
 */
export async function getGithubOAuthUrl(req, res) {
  if (!isSupabaseConfigured) {
    // Return empty URL to indicate we are running in local mock mode
    return res.json({ url: "" });
  }

  const clientOrigin = req.headers.origin || process.env.FRONTEND_URL;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${clientOrigin}`,
      skipBrowserRedirect: true, // we just want the URL, not a server redirect
    },
  });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ url: data.url });
}

/**
 * POST /api/auth/session
 * Frontend sends the Supabase session (access_token + refresh_token) it received
 * after the OAuth callback. Backend validates it, upserts user in DB, returns profile.
 *
 * Body: { access_token, refresh_token }
 */
export async function handleSession(req, res) {
  const { access_token, refresh_token } = req.body;
  if (!access_token) return res.status(400).json({ error: "access_token required" });

  if (!isSupabaseConfigured) {
    // Handle mock token for GitHub OAuth fallback
    if (access_token === "mock-session-token") {
      try {
        const dbUser = await upsertUser({
          github_id: "local-mock-github-id",
          username: "alexkumar_dev",
          name: "Alex Kumar",
          email: "alex@example.com",
          avatar_url: "",
        });

        const token = signToken({ id: dbUser.id, email: dbUser.email });
        return res.json({
          user: dbUser,
          access_token: token,
          refresh_token: "mock-refresh-token",
        });
      } catch (err) {
        return res.status(500).json({ error: "Failed to initialize mock user" });
      }
    }
    return res.status(401).json({ error: "Invalid session token in local mode" });
  }

  // Verify the token with Supabase
  const { data: { user }, error } = await supabase.auth.getUser(access_token);
  if (error || !user) return res.status(401).json({ error: "Invalid session token" });

  // Pull GitHub identity metadata
  const meta      = user.user_metadata || {};
  const githubId  = meta.provider_id || meta.sub || String(user.id);

  try {
    // Upsert into our users table
    let dbUser = await upsertUser({
      id:         user.id,
      github_id:  githubId,
      username:   meta.user_name || meta.preferred_username || meta.login || "",
      name:       meta.full_name  || meta.name || "",
      email:      user.email      || "",
      avatar_url: meta.avatar_url || "",
    });

    dbUser = await processStreak(dbUser);

    res.json({
      user: dbUser,
      access_token,
      refresh_token,
    });
  } catch (err) {
    console.error("[auth/session]", err.message);
    res.status(500).json({ error: "Failed to sync user with database" });
  }
}

/**
 * POST /api/auth/register
 * Body: { email, password, name, username }
 */
export async function register(req, res) {
  const { email, password, name, username } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const existing = await getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    let user = await createUser({ email, password, name, username });
    user = await processStreak(user);

    if (!isSupabaseConfigured) {
      const token = signToken({ id: user.id, email: user.email });
      return res.json({ user, access_token: token });
    }

    // For real Supabase, we also need to return the token.
    // In typical setups, signUp logs the user in if verification is disabled,
    // otherwise we wait for verification. For simplicity, we sign in the user.
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) return res.status(400).json({ error: authError.message });

    res.json({
      user,
      access_token: authData.session.access_token,
      refresh_token: authData.session.refresh_token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    if (!isSupabaseConfigured) {
      let user = await getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      user = await processStreak(user);

      const token = signToken({ id: user.id, email: user.email });
      return res.json({ user, access_token: token });
    }

    // Real Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) return res.status(401).json({ error: authError.message });

    const meta = authData.user.user_metadata || {};
    let dbUser = await upsertUser({
      github_id: "sb-" + authData.user.id,
      username: meta.user_name || email.split("@")[0],
      name: meta.full_name || email.split("@")[0],
      email: email,
      avatar_url: meta.avatar_url || "",
    });
    
    dbUser = await processStreak(dbUser);

    res.json({
      user: dbUser,
      access_token: authData.session.access_token,
      refresh_token: authData.session.refresh_token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * GET /api/auth/me
 * Protected — returns the current user's DB profile.
 */
export async function getMe(req, res) {
  try {
    let dbUser = await getUserById(req.user.id);
    dbUser = await processStreak(dbUser);
    res.json({ user: dbUser });
  } catch (err) {
    res.status(404).json({ error: "User not found" });
  }
}

/**
 * PATCH /api/auth/me
 * Protected — updates display name, username, bio, location, website, etc.
 */
export async function updateMe(req, res) {
  const { name, username, bio, location, website, avatar } = req.body;
  try {
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (username !== undefined) updates.username = username;
    if (bio !== undefined) updates.bio = bio;
    if (location !== undefined) updates.location = location;
    if (website !== undefined) updates.website = website;
    if (avatar !== undefined) updates.avatar_url = avatar; // sync key name
    if (req.body.tech_stack !== undefined) updates.tech_stack = req.body.tech_stack;

    const dbUser = await updateUser(req.user.id, updates);
    res.json({ user: dbUser });
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile: " + err.message });
  }
}

/**
 * POST /api/auth/logout
 * Invalidates the session on Supabase side if configured.
 */
export async function logout(req, res) {
  if (isSupabaseConfigured) {
    const { error } = await supabase.auth.admin.signOut(req.token);
    if (error) return res.status(500).json({ error: error.message });
  }
  res.json({ success: true });
}

