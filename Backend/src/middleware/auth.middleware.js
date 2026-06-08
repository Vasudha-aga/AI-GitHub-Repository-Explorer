import jwt from "jsonwebtoken";
import { supabase, supabaseConfigured } from "../config/supabase.js";
import { getUserById } from "../services/supabase.service.js";

const LOCAL_JWT_SECRET = process.env.JWT_SECRET || "repolens-local-secret";

/**
 * Reads the Bearer token from Authorization header,
 * verifies it (via Supabase or local JWT), and attaches the user to req.user.
 *
 * Usage: router.get("/protected", authMiddleware, handler)
 */
export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  const token = authHeader.split(" ")[1];

  if (supabaseConfigured) {
    // ── Supabase verification ──
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return res.status(401).json({ error: "Invalid or expired session token" });
    }
    req.user  = data.user;
    req.token = token;
    return next();
  }

  // ── Local JWT verification ──
  try {
    const decoded = jwt.verify(token, LOCAL_JWT_SECRET);
    // Populate req.user with the shape controllers expect
    const dbUser = await getUserById(decoded.userId);
    req.user = { id: dbUser.id, email: dbUser.email, user_metadata: dbUser };
    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired local token" });
  }
}

/**
 * Optional auth — tries to authenticate but doesn't block if no token is present.
 * Useful for endpoints that behave differently for logged-in vs anonymous users.
 */
export async function optionalAuth(req, _res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(" ")[1];

  if (supabaseConfigured) {
    try {
      const { data } = await supabase.auth.getUser(token);
      req.user = data?.user || null;
    } catch {
      req.user = null;
    }
    return next();
  }

  // Local JWT
  try {
    const decoded = jwt.verify(token, LOCAL_JWT_SECRET);
    const dbUser = await getUserById(decoded.userId);
    req.user = { id: dbUser.id, email: dbUser.email, user_metadata: dbUser };
  } catch {
    req.user = null;
  }
  next();
}
