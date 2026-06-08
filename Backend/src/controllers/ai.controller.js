import { analyzeRepo, generateRecommendations } from "../services/gemini.service.js";
import { getCachedAnalysis, saveAnalysis }      from "../services/supabase.service.js";
import * as db                                  from "../services/supabase.service.js";

/**
 * POST /api/ai/analyze
 * Body: { repo_id, name, owner, description, language, stars, forks, topics, openIssues }
 *
 * Flow:
 *  1. Check ai_analysis table — if cached, return instantly
 *  2. Call Gemini to generate analysis
 *  3. Save to DB cache
 *  4. Return analysis
 */
export async function analyze(req, res) {
  const { repo_id, name, owner, description, language, stars, forks, topics, openIssues } = req.body;
  if (!repo_id || !name || !owner) {
    return res.status(400).json({ error: "repo_id, name, and owner are required" });
  }

  try {
    // 1 — Cache hit
    const cached = await getCachedAnalysis(repo_id);
    if (cached) {
      console.log(`[ai/analyze] Cache hit for ${owner}/${name}`);
      return res.json({ analysis: cached, cached: true });
    }

    // 2 — Call Gemini
    console.log(`[ai/analyze] Calling Gemini for ${owner}/${name}...`);
    const analysis = await analyzeRepo({ name, owner, description, language, stars, forks, topics, openIssues });

    // 3 — Cache in DB
    let saved = analysis;
    try {
      saved = await saveAnalysis(repo_id, analysis);
    } catch (e) {
      console.warn(`[ai/analyze] Cache save failed (schema mismatch?):`, e.message);
    }

    // 4 — Return
    res.json({ analysis: saved, cached: false });
  } catch (err) {
    console.error("[ai/analyze]", err.message);
    res.status(500).json({ error: "AI analysis failed: " + err.message });
  }
}

/**
 * GET /api/ai/recommendations
 * Protected — generates personalised repo recommendations for the user.
 */
export async function recommendations(req, res) {
  try {
    const [savedRepos, searchHistory] = await Promise.all([
      db.getSavedRepos(req.user.id),
      db.getSearchHistory(req.user.id, 20),
    ]);

    const recs = await generateRecommendations({
      savedRepos,
      searchHistory,
      userProfile: req.user,
    });

    res.json({ recommendations: recs });
  } catch (err) {
    console.error("[ai/recommendations]", err.message);
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
}
