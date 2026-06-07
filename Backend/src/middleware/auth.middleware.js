import { supabase } from "../config/supabase.js";

/**
 * Reads the Bearer token from Authorization header,
 * verifies it with Supabase, and attaches the user to req.user.
 *
 * Usage: router.get("/protected", authMiddleware, handler)
 */
export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  const token = authHeader.split(" ")[1];

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return res.status(401).json({ error: "Invalid or expired session token" });
  }

  req.user  = data.user;           // full Supabase user object
  req.token = token;               // forward to services if needed
  next();
}
