import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getGithubOAuthUrl,
  handleSession,
  getMe,
  logout,
} from "../controllers/auth.controller.js";

const router = Router();

// Public
router.get("/github",  getGithubOAuthUrl); // GET  /api/auth/github  → returns OAuth URL
router.post("/session", handleSession);     // POST /api/auth/session → validate + sync user

// Protected
router.get("/me",     authMiddleware, getMe);    // GET  /api/auth/me
router.post("/logout", authMiddleware, logout);   // POST /api/auth/logout

export default router;
