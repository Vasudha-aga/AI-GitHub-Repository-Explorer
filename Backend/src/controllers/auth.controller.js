import { supabase } from "../config/supabase.js";
import { upsertUser, getUserById } from "../services/supabase.service.js";

/**
 * GET /api/auth/github
 * Returns the Supabase OAuth redirect URL — frontend opens this in browser.
 */
export async function getGithubOAuthUrl(req, res) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${process.env.FRONTEND_URL}/auth/callback`,
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

  // Verify the token with Supabase
  const { data: { user }, error } = await supabase.auth.getUser(access_token);
  if (error || !user) return res.status(401).json({ error: "Invalid session token" });

  // Pull GitHub identity metadata
  const meta      = user.user_metadata || {};
  const githubId  = meta.provider_id || meta.sub || String(user.id);

  try {
    // Upsert into our users table
    const dbUser = await upsertUser({
      github_id:  githubId,
      username:   meta.user_name || meta.preferred_username || meta.login || "",
      name:       meta.full_name  || meta.name || "",
      email:      user.email      || "",
      avatar_url: meta.avatar_url || "",
    });

    res.json({
      user: {
        id:         dbUser.id,
        github_id:  dbUser.github_id,
        username:   dbUser.username,
        name:       dbUser.name,
        email:      dbUser.email,
        avatar_url: dbUser.avatar_url,
        created_at: dbUser.created_at,
      },
      access_token,
      refresh_token,
    });
  } catch (err) {
    console.error("[auth/session]", err.message);
    res.status(500).json({ error: "Failed to sync user with database" });
  }
}

/**
 * GET /api/auth/me
 * Protected — returns the current user's DB profile.
 */
export async function getMe(req, res) {
  try {
    const dbUser = await getUserById(req.user.id);
    res.json({ user: dbUser });
  } catch (err) {
    res.status(404).json({ error: "User not found" });
  }
}

/**
 * POST /api/auth/logout
 * Invalidates the session on Supabase side.
 */
export async function logout(req, res) {
  const { error } = await supabase.auth.admin.signOut(req.token);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
}
