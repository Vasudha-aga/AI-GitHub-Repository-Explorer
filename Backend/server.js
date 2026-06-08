import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./src/routes/auth.routes.js";
import repoRoutes from "./src/routes/repo.routes.js";
import aiRoutes   from "./src/routes/ai.routes.js";

const app  = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.includes("localhost") || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(null, process.env.FRONTEND_URL || true);
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));

// ── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/repos", repoRoutes);
app.use("/api/ai", aiRoutes);

// ── Health check ────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ status: "ok", ts: Date.now() }));

// ── Global error handler ────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("[ERROR]", err.message);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

app.listen(PORT, () => console.log(`✅  RepoLens backend running on http://localhost:${PORT}`));
