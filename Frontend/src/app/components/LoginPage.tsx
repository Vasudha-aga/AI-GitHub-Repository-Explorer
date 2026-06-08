import { useState } from "react";
import { Eye, EyeOff, Sparkles, ArrowRight, Sun, Moon, User, Mail, Lock } from "lucide-react";
import { VideoBackground } from "./VideoBackground";
import { RepoLensLogo } from "./RepoLensLogo";
import api from "../../services/api";

interface LoginPageProps {
  onLogin: () => void;
  theme: "dark" | "light";
  onThemeChange: (t: "dark" | "light") => void;
}

export function LoginPage({ onLogin, theme, onThemeChange }: LoginPageProps) {
  const [tab, setTab]           = useState<"signin" | "signup">("signin");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]         = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [focus, setFocus]       = useState("");
  const [error, setError]       = useState("");

  const isLight = theme === "light";

  const cardBg     = isLight ? "rgba(255,255,255,0.88)"  : "rgba(8,8,12,0.85)";
  const cardBorder = isLight ? "rgba(0,0,0,0.10)"        : "rgba(255,255,255,0.10)";
  const inputBg    = isLight ? "rgba(0,0,0,0.04)"        : "rgba(255,255,255,0.05)";
  const inputColor = isLight ? "#0a0a12"                 : "#f1f1f3";
  const headingColor = isLight ? "#0a0a12"               : "#f1f1f3";
  const dividerColor = isLight ? "rgba(0,0,0,0.08)"      : "rgba(255,255,255,0.07)";
  const githubBg   = isLight ? "rgba(0,0,0,0.06)"        : "rgba(255,255,255,0.07)";
  const githubBorder = isLight ? "rgba(0,0,0,0.12)"      : "rgba(255,255,255,0.12)";
  const githubColor  = isLight ? "#0a0a12"               : "#f1f1f3";
  const tabActiveBg  = isLight ? "rgba(46,110,220,0.12)" : "rgba(79,142,247,0.12)";
  const tabInactiveBg = isLight ? "transparent"          : "transparent";

  const heroTextColor  = isLight ? "#0a0a12" : "#f1f1f3";
  const heroSubColor   = isLight ? "rgba(10,10,18,0.65)" : "rgba(241,241,243,0.58)";

  const overlayOpacity = isLight ? 0.35 : 0.60;
  const overlayGradient = isLight
    ? "linear-gradient(135deg, rgba(46,110,220,0.08) 0%, rgba(90,85,224,0.06) 40%, rgba(232,232,242,0.15) 100%)"
    : "linear-gradient(135deg, rgba(79,142,247,0.12) 0%, rgba(109,104,245,0.10) 40%, rgba(6,6,8,0.25) 100%)";

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in both fields."); return; }
    setError(""); setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("access_token", res.data.access_token);
      if (res.data.refresh_token) {
        localStorage.setItem("refresh_token", res.data.refresh_token);
      }
      setLoading(false);
      onLogin();
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid email or password.");
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPwd) { setError("Please fill in all fields."); return; }
    if (password !== confirmPwd) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError(""); setLoading(true);
    try {
      const res = await api.post("/api/auth/register", {
        name,
        email,
        password,
        username: email.split("@")[0]
      });
      localStorage.setItem("access_token", res.data.access_token);
      if (res.data.refresh_token) {
        localStorage.setItem("refresh_token", res.data.refresh_token);
      }
      setLoading(false);
      onLogin();
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed.");
      setLoading(false);
    }
  };

  const handleGithubSSO = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await api.get("/api/auth/github");
      if (res.data.url) {
        // Redirect to Supabase GitHub OAuth
        window.location.href = res.data.url;
      } else {
        // local dev mode fallback: log in mock user
        const sessionRes = await api.post("/api/auth/session", {
          access_token: "mock-session-token",
          refresh_token: "mock-refresh-token"
        });
        localStorage.setItem("access_token", sessionRes.data.access_token);
        setLoading(false);
        onLogin();
      }
    } catch (err: any) {
      setError("GitHub sign in failed.");
      setLoading(false);
    }
  };


  const focusBorder = `1px solid rgba(${isLight ? "46,110,220" : "79,142,247"}, 0.6)`;
  const blurBorder  = `1px solid ${isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.08)"}`;

  const inputStyle = (field: string) => ({
    background: inputBg,
    border: focus === field ? focusBorder : blurBorder,
    color: inputColor,
    outline: "none",
    boxShadow: focus === field ? `0 0 0 3px rgba(${isLight ? "46,110,220" : "79,142,247"}, 0.12)` : "none",
  });

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden flex"
      style={{ background: isLight ? "#e8e8f2" : "#060608" }}
    >
      <VideoBackground
        theme={theme}
        overlayOpacity={overlayOpacity}
        overlayGradient={overlayGradient}
        blur={0}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(${isLight ? "232,232,242" : "4,4,8"},0.75) 100%)` }}
      />

      {/* Theme toggle button */}
      <button
        onClick={() => onThemeChange(isLight ? "dark" : "light")}
        className="absolute top-5 right-5 z-20 flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all hover:opacity-85"
        style={{
          background: isLight ? "rgba(255,255,255,0.75)" : "rgba(20,20,28,0.75)",
          border: `1px solid ${isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)"}`,
          backdropFilter: "blur(12px)",
          color: isLight ? "#0a0a12" : "#f1f1f3",
          fontSize: "12px",
          fontWeight: 600,
        }}
      >
        {isLight ? <Moon size={13} /> : <Sun size={13} />}
        {isLight ? "Dark mode" : "Light mode"}
      </button>

      {/* Left hero pane */}
      <div className="hidden lg:flex flex-col justify-center flex-1 px-16 py-12 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div style={{ width: 48, height: 48, background: isLight ? "rgba(255,255,255,0.8)" : "rgba(8,8,14,0.7)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 32px var(--blue-glow)", border: `1px solid rgba(${isLight ? "46,110,220" : "79,142,247"},0.25)`, backdropFilter: "blur(8px)" }}>
              <RepoLensLogo size={30} />
            </div>
            <span className="gradient-text" style={{ fontSize: "26px", fontWeight: 800, letterSpacing: "-0.05em" }}>RepoLens</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6" style={{ background: isLight ? "rgba(46,110,220,0.1)" : "rgba(79,142,247,0.1)", border: `1px solid rgba(${isLight ? "46,110,220" : "79,142,247"},0.25)`, backdropFilter: "blur(12px)" }}>
            <Sparkles size={11} style={{ color: "var(--blue)" }} />
            <span className="mono" style={{ fontSize: "10px", color: "var(--blue)", fontWeight: 700, letterSpacing: "0.1em" }}>AI-POWERED GITHUB EXPLORER</span>
          </div>

          <h1 style={{ fontSize: "clamp(44px, 5.5vw, 68px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.055em", color: heroTextColor, textShadow: isLight ? "0 2px 20px rgba(0,0,0,0.12)" : "0 2px 40px rgba(0,0,0,0.6)" }}>
            Discover repos<br />with the power<br />of{" "}
            <span style={{ background: "var(--gradient-brand)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", filter: "drop-shadow(0 0 24px rgba(79,142,247,0.6))" }}>
              AI intelligence
            </span>
          </h1>

          <p style={{ fontSize: "17px", color: heroSubColor, marginTop: 22, lineHeight: 1.75, maxWidth: 460, textShadow: isLight ? "none" : "0 1px 8px rgba(0,0,0,0.5)" }}>
            Search, analyze, and curate GitHub repositories. Get AI-generated summaries,
            difficulty ratings, and personalized learning paths — all in one place.
          </p>
        </div>
      </div>

      {/* Right form pane */}
      <div className="flex items-center justify-center flex-1 lg:flex-none lg:w-[480px] xl:w-[520px] px-6 lg:px-14 py-10 relative z-10">
        <div className="w-full relative" style={{ maxWidth: 420, background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 24, backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)", boxShadow: isLight ? "0 32px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(46,110,220,0.08)" : "0 32px 80px rgba(0,0,0,0.85), 0 0 0 1px rgba(79,142,247,0.08), inset 0 1px 0 rgba(255,255,255,0.07)" }}>
          {/* Top accent */}
          <div className="rounded-t-3xl" style={{ height: 2, background: "linear-gradient(90deg, transparent 0%, var(--blue) 30%, var(--purple) 70%, transparent 100%)", boxShadow: "0 0 16px var(--blue-glow)" }} />

          <div className="p-8">
            {/* Mobile logo */}
            <div className="flex items-center gap-3 mb-6 lg:hidden">
              <div style={{ width: 36, height: 36, background: isLight ? "rgba(255,255,255,0.9)" : "rgba(8,8,14,0.7)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid rgba(${isLight ? "46,110,220" : "79,142,247"},0.25)` }}>
                <RepoLensLogo size={22} />
              </div>
              <span className="gradient-text" style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.04em" }}>RepoLens</span>
            </div>

            {/* Tab switcher */}
            <div className="flex rounded-xl p-1 mb-6" style={{ background: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.04)", border: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.06)"}` }}>
              {(["signin", "signup"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setError(""); }}
                  className="flex-1 py-2 rounded-lg text-center transition-all"
                  style={{
                    fontSize: "13px",
                    fontWeight: tab === t ? 600 : 400,
                    background: tab === t ? tabActiveBg : tabInactiveBg,
                    color: tab === t ? "var(--blue)" : (isLight ? "rgba(10,10,18,0.5)" : "rgba(255,255,255,0.45)"),
                    border: tab === t ? `1px solid var(--blue-border)` : "1px solid transparent",
                  }}
                >
                  {t === "signin" ? "Sign In" : "Create Account"}
                </button>
              ))}
            </div>

            {/* Heading */}
            <div className="mb-5">
              <h2 style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.04em", color: headingColor }}>
                {tab === "signin" ? "Welcome back" : "Get started free"}
              </h2>
              <p style={{ fontSize: "13px", color: isLight ? "rgba(10,10,18,0.55)" : "var(--muted-foreground)", marginTop: 3 }}>
                {tab === "signin" ? "Sign in to continue your AI-powered exploration" : "Create your account and start exploring"}
              </p>
            </div>

            {/* GitHub SSO */}
            <button
              type="button"
              onClick={handleGithubSSO}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl mb-4 transition-all hover:opacity-85 active:scale-[0.98]"
              style={{ background: githubBg, border: `1px solid ${githubBorder}`, color: githubColor, fontSize: "13px", fontWeight: 500 }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              Continue with GitHub
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px" style={{ background: dividerColor }} />
              <span style={{ fontSize: "11px", color: isLight ? "rgba(10,10,18,0.45)" : "var(--muted-foreground)" }}>
                or {tab === "signin" ? "sign in" : "sign up"} with email
              </span>
              <div className="flex-1 h-px" style={{ background: dividerColor }} />
            </div>

            {/* Form */}
            <form onSubmit={tab === "signin" ? handleSignIn : handleSignUp} className="space-y-3">
              {tab === "signup" && (
                <div>
                  <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: isLight ? "rgba(10,10,18,0.55)" : "var(--muted-foreground)", marginBottom: 5, letterSpacing: "0.1em", textTransform: "uppercase" }}>Full Name</label>
                  <div className="relative">
                    <User size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: isLight ? "rgba(10,10,18,0.35)" : "rgba(255,255,255,0.3)" }} />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      onFocus={() => setFocus("name")}
                      onBlur={() => setFocus("")}
                      placeholder="Alex Kumar"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl transition-all"
                      style={inputStyle("name")}
                    />
                  </div>
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: isLight ? "rgba(10,10,18,0.55)" : "var(--muted-foreground)", marginBottom: 5, letterSpacing: "0.1em", textTransform: "uppercase" }}>Email address</label>
                <div className="relative">
                  <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: isLight ? "rgba(10,10,18,0.35)" : "rgba(255,255,255,0.3)" }} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocus("email")}
                    onBlur={() => setFocus("")}
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl transition-all"
                    style={inputStyle("email")}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label style={{ fontSize: "10px", fontWeight: 700, color: isLight ? "rgba(10,10,18,0.55)" : "var(--muted-foreground)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Password</label>
                  {tab === "signin" && <button type="button" style={{ fontSize: "12px", color: "var(--blue)", fontWeight: 500 }}>Forgot?</button>}
                </div>
                <div className="relative">
                  <Lock size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: isLight ? "rgba(10,10,18,0.35)" : "rgba(255,255,255,0.3)" }} />
                  <input
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocus("pwd")}
                    onBlur={() => setFocus("")}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-11 py-2.5 rounded-xl transition-all"
                    style={inputStyle("pwd")}
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: isLight ? "rgba(10,10,18,0.4)" : "var(--muted-foreground)" }}>
                    {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {tab === "signup" && (
                <div>
                  <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: isLight ? "rgba(10,10,18,0.55)" : "var(--muted-foreground)", marginBottom: 5, letterSpacing: "0.1em", textTransform: "uppercase" }}>Confirm Password</label>
                  <div className="relative">
                    <Lock size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: isLight ? "rgba(10,10,18,0.35)" : "rgba(255,255,255,0.3)" }} />
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPwd}
                      onChange={e => setConfirmPwd(e.target.value)}
                      onFocus={() => setFocus("confirm")}
                      onBlur={() => setFocus("")}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-11 py-2.5 rounded-xl transition-all"
                      style={inputStyle("confirm")}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: isLight ? "rgba(10,10,18,0.4)" : "var(--muted-foreground)" }}>
                      {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className="px-4 py-2.5 rounded-xl" style={{ background: "rgba(240,76,93,0.08)", border: "1px solid rgba(240,76,93,0.25)" }}>
                  <p style={{ fontSize: "12px", color: "var(--red)" }}>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: loading ? "rgba(79,142,247,0.35)" : "var(--gradient-brand)", color: "white", fontSize: "14px", fontWeight: 700, letterSpacing: "-0.01em", boxShadow: loading ? "none" : "0 0 28px rgba(79,142,247,0.35), 0 0 60px rgba(109,104,245,0.15)", cursor: loading ? "not-allowed" : "pointer", marginTop: 4 }}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full border-2" style={{ width: 16, height: 16, borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }} />
                    {tab === "signin" ? "Signing you in…" : "Creating account…"}
                  </>
                ) : (
                  <>{tab === "signin" ? "Sign In" : "Create Account"} <ArrowRight size={15} /></>
                )}
              </button>
            </form>

            <p className="text-center mt-4" style={{ fontSize: "13px", color: isLight ? "rgba(10,10,18,0.5)" : "var(--muted-foreground)" }}>
              {tab === "signin" ? (
                <>No account?{" "}<span onClick={() => { setTab("signup"); setError(""); }} style={{ color: "var(--blue)", cursor: "pointer", fontWeight: 600 }}>Create one free →</span></>
              ) : (
                <>Already have an account?{" "}<span onClick={() => { setTab("signin"); setError(""); }} style={{ color: "var(--blue)", cursor: "pointer", fontWeight: 600 }}>Sign in →</span></>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
