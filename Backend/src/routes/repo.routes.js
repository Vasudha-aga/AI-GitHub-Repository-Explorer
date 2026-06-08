import { Router } from "express";
import { authMiddleware, optionalAuth } from "../middleware/auth.middleware.js";
import {
  searchRepos,
  getRepoDetails,
  getSavedRepos,
  saveRepo,
  unsaveRepo,
  getHistory,
  clearHistory,
  getTrendingSearches,
  getRecommendations,
} from "../controllers/repo.controller.js";

const router = Router();

// Search — optionally authenticated (to mark saved repos and log history)
router.get("/search", optionalAuth, searchRepos);                     // GET  /api/repos/search?q=...

// Trending searches — no auth required
router.get("/trending", getTrendingSearches);           // GET  /api/repos/trending

// Recommendations — optionally authenticated (to read profile)
router.get("/recommendations", optionalAuth, getRecommendations); // GET /api/repos/recommendations

// Repo detail — optionally authenticated (to mark saved)
router.get("/:owner/:name", optionalAuth, getRepoDetails);            // GET  /api/repos/:owner/:name

// Protected — require login
router.get   ("/saved",          authMiddleware, getSavedRepos);  // GET    /api/repos/saved
router.post  ("/save",           authMiddleware, saveRepo);       // POST   /api/repos/save
router.delete("/save/:repoId",   authMiddleware, unsaveRepo);     // DELETE /api/repos/save/:repoId
router.get   ("/history",        authMiddleware, getHistory);     // GET    /api/repos/history
router.delete("/history",        authMiddleware, clearHistory);   // DELETE /api/repos/history

export default router;
