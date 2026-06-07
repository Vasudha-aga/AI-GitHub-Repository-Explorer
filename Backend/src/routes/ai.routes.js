import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { analyze, recommendations } from "../controllers/ai.controller.js";

const router = Router();

// analyze is public (no auth needed — anyone can get AI analysis of a repo)
router.post("/analyze",          analyze);                              // POST /api/ai/analyze

// recommendations require login
router.get ("/recommendations",  authMiddleware, recommendations);      // GET  /api/ai/recommendations

export default router;
