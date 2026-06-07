import * as github     from "../services/github.service.js";
import * as db         from "../services/supabase.service.js";
import { getCachedAnalysis, saveAnalysis } from "../services/supabase.service.js";
import { analyzeRepo }  from "../services/gemini.service.js";

// ── GET /api/repos/search?q=...&language=...&sort=stars&page=1 ───────────────
export async function searchRepos(req, res) {
  const { q, language, sort, page = 1 } = req.query;
  if (!q?.trim()) return res.status(400).json({ error: "Query parameter 'q' is required" });

  try {
    const userId = req.user?.id;
    const result = await github.searchRepos(q, { language, sort, page: Number(page) });

    // Mark which repos the user has already saved
    let savedIds = new Set();
    if (userId) {
      const saved = await db.getSavedRepos(userId);
      savedIds    = new Set(saved.map(s => s.repo_id));
    }

    const repos = result.repos.map(r => ({
      ...r,
      saved: savedIds.has(String(r.id)),
    }));

    // Log search to history (fire-and-forget — don't block the response)
    if (userId) {
      db.addSearchHistory(userId, q).catch(() => {});
    }

    res.json({ total: result.total, repos });
  } catch (err) {
    console.error("[repos/search]", err.message);
    res.status(500).json({ error: "GitHub search failed" });
  }
}

// ── GET /api/repos/:owner/:name ──────────────────────────────────────────────
export async function getRepoDetails(req, res) {
  const { owner, name } = req.params;
  const userId          = req.user?.id;

  try {
    const [repo, contributors, languages] = await Promise.all([
      github.getRepo(owner, name),
      github.getContributors(owner, name),
      github.getLanguages(owner, name),
    ]);

    // Check save status
    let saved = false;
    if (userId) {
      saved = await db.isRepoSaved(userId, repo.id);
    }

    // Fetch AI analysis (from cache or Gemini — handled in /api/ai/analyze)
    let analysis = await getCachedAnalysis(repo.id);

    res.json({
      ...repo,
      saved,
      contributors,
      languages,
      analysis: analysis || null, // null = frontend should call /api/ai/analyze
    });
  } catch (err) {
    console.error("[repos/details]", err.message);
    res.status(500).json({ error: "Failed to fetch repo details" });
  }
}

// ── GET /api/repos/saved ─────────────────────────────────────────────────────
export async function getSavedRepos(req, res) {
  try {
    const saved = await db.getSavedRepos(req.user.id);
    // repo_data column stores the full repo JSON snapshot
    const repos = saved.map(s => ({
      ...(s.repo_data || {}),
      id:       s.repo_id,
      name:     s.repo_name,
      repo_url: s.repo_url,
      saved:    true,
      saved_at: s.saved_at,
    }));
    res.json({ repos });
  } catch (err) {
    console.error("[repos/saved]", err.message);
    res.status(500).json({ error: "Failed to fetch saved repos" });
  }
}

// ── POST /api/repos/save ─────────────────────────────────────────────────────
export async function saveRepo(req, res) {
  const { repo_id, repo_name, repo_url, repo_data } = req.body;
  if (!repo_id || !repo_name) return res.status(400).json({ error: "repo_id and repo_name required" });

  try {
    const saved = await db.saveRepo(req.user.id, { repo_id, repo_name, repo_url, repo_data });
    res.json({ success: true, saved });
  } catch (err) {
    console.error("[repos/save]", err.message);
    res.status(500).json({ error: "Failed to save repository" });
  }
}

// ── DELETE /api/repos/save/:repoId ───────────────────────────────────────────
export async function unsaveRepo(req, res) {
  try {
    await db.unsaveRepo(req.user.id, req.params.repoId);
    res.json({ success: true });
  } catch (err) {
    console.error("[repos/unsave]", err.message);
    res.status(500).json({ error: "Failed to unsave repository" });
  }
}

// ── GET /api/repos/history ───────────────────────────────────────────────────
export async function getHistory(req, res) {
  try {
    const history = await db.getSearchHistory(req.user.id);
    res.json({ history });
  } catch (err) {
    console.error("[repos/history]", err.message);
    res.status(500).json({ error: "Failed to fetch history" });
  }
}

// ── DELETE /api/repos/history ────────────────────────────────────────────────
export async function clearHistory(req, res) {
  try {
    await db.clearSearchHistory(req.user.id);
    res.json({ success: true });
  } catch (err) {
    console.error("[repos/history/clear]", err.message);
    res.status(500).json({ error: "Failed to clear history" });
  }
}
