import { Search, Sparkles, Zap, ArrowRight, BarChart2 } from "lucide-react";
import { Repository, RepoCard } from "./RepoCard";
import { UserProfile } from "../types";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const activityData = [
  { day: "Mon", searches: 4,  saves: 2 },
  { day: "Tue", searches: 7,  saves: 5 },
  { day: "Wed", searches: 3,  saves: 1 },
  { day: "Thu", searches: 11, saves: 7 },
  { day: "Fri", searches: 14, saves: 9 },
  { day: "Sat", searches: 6,  saves: 4 },
  { day: "Sun", searches: 9,  saves: 5 },
];

const topLangs = [
  { name: "Python",     pct: 52, color: "#3572A5" },
  { name: "TypeScript", pct: 28, color: "#2b7489" },
  { name: "Rust",       pct: 12, color: "#dea584" },
  { name: "Go",         pct: 8,  color: "#00ADD8" },
];

interface DashboardPageProps {
  onNavigate: (page: string) => void;
  onViewRepo: (repo: Repository) => void;
  onSaveRepo: (id: number) => void;
  repos: Repository[];
  user: UserProfile;
  searchCount: number;
  theme: "dark" | "light";
}

function StatCard({ label, value, sub, color, glow }: { label: string; value: string; sub: string; color: string; glow: string }) {
  return (
    <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: "var(--surface-1)", border: "1px solid var(--glass-border)" }}>
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`, transform: "translate(30%,-30%)" }} />
      <p style={{ fontSize: "12px", color: "var(--muted-foreground)", letterSpacing: "0.02em", marginBottom: 12 }}>{label}</p>
      <p style={{ fontSize: "28px", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.04em", lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: "11px", color: "var(--muted-foreground)", marginTop: 6 }}>{sub}</p>
    </div>
  );
}

export function DashboardPage({ onNavigate, onViewRepo, onSaveRepo, repos, user, searchCount, theme: _theme }: DashboardPageProps) {
  const saved = repos.filter(r => r.saved);
  const firstName = user.name.split(" ")[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  const todayLabel = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }).toUpperCase();

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Welcome banner */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: "var(--gradient-section), linear-gradient(135deg, rgba(79,142,247,0.12) 0%, rgba(109,104,245,0.08) 50%, rgba(155,110,245,0.05) 100%)", border: "1px solid rgba(79,142,247,0.18)" }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(109,104,245,0.15) 0%, transparent 70%)", transform: "translate(20%,-30%)" }} />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-full" style={{ width: 8, height: 8, background: "var(--green)", boxShadow: "0 0 6px var(--green)" }} />
              <span className="mono" style={{ fontSize: "10px", color: "var(--muted-foreground)", letterSpacing: "0.1em" }}>LIVE · {todayLabel}</span>
            </div>
            <h1 style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--foreground)" }}>
              Good {greeting}, <span className="gradient-text">{firstName}</span>
            </h1>
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)", marginTop: 6, lineHeight: 1.5 }}>
              You've explored <strong style={{ color: "var(--foreground)" }}>{searchCount} repositories</strong> so far. Here's what's trending in your stack.
            </p>
          </div>
          <button
            onClick={() => onNavigate("search")}
            className="flex items-center gap-2.5 px-5 py-3 rounded-xl transition-all hover:opacity-85 active:scale-[0.98] flex-shrink-0"
            style={{ background: "var(--gradient-brand)", color: "white", fontSize: "13px", fontWeight: 600, boxShadow: "0 0 24px var(--blue-glow)", letterSpacing: "-0.01em" }}
          >
            <Search size={15} />
            Explore Repos
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Searches" value={String(searchCount)}           sub="↑ 12 this week"         color="var(--blue)"   glow="rgba(79,142,247,0.2)" />
        <StatCard label="Saved Repos"    value={String(saved.length)}           sub={`${saved.length} active bookmarks`} color="var(--amber)"  glow="rgba(240,160,80,0.2)" />
        <StatCard label="AI Insights"    value={String(user.aiInsightsCount)}   sub="Personalized tips"     color="var(--purple)" glow="rgba(109,104,245,0.2)" />
        <StatCard label="Day Streak"     value={`${user.streakDays}`}           sub="Personal best"         color="var(--red)"    glow="rgba(240,76,93,0.2)" />
      </div>

      {/* Charts + AI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl p-5" style={{ background: "var(--surface-1)", border: "1px solid var(--glass-border)" }}>
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 style={{ fontSize: "14px", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--foreground)" }}>Weekly Activity</h3>
              <p style={{ fontSize: "11px", color: "var(--muted-foreground)", marginTop: 2 }}>Searches & saves — last 7 days</p>
            </div>
            <BarChart2 size={15} style={{ color: "var(--muted-foreground)" }} />
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={activityData} margin={{ top: 12, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--blue)"   stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--blue)"   stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gPurple" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--purple)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--purple)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--surface-2)", border: "1px solid var(--glass-border)", borderRadius: 10, fontSize: 11 }} itemStyle={{ color: "var(--foreground)" }} labelStyle={{ color: "var(--muted-foreground)" }} />
              <Area type="monotone" dataKey="searches" stroke="var(--blue)"   strokeWidth={2} fill="url(#gBlue)"   name="Searches" dot={false} />
              <Area type="monotone" dataKey="saves"    stroke="var(--purple)" strokeWidth={2} fill="url(#gPurple)" name="Saves"    dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-5 mt-2">
            {[{ color: "var(--blue)", label: "Searches" }, { color: "var(--purple)", label: "Saves" }].map(l => (
              <div key={l.label} className="flex items-center gap-2">
                <div className="rounded-full" style={{ width: 8, height: 2, background: l.color }} />
                <span style={{ fontSize: "10px", color: "var(--muted-foreground)" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl p-5 flex-1" style={{ background: "var(--gradient-section), linear-gradient(145deg, rgba(79,142,247,0.08), rgba(109,104,245,0.06))", border: "1px solid rgba(79,142,247,0.15)" }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg" style={{ background: "var(--blue-dim)" }}>
                <Zap size={12} style={{ color: "var(--blue)" }} />
              </div>
              <span className="mono" style={{ fontSize: "9px", color: "var(--blue)", fontWeight: 700, letterSpacing: "0.12em" }}>AI INSIGHT</span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)", lineHeight: 1.65 }}>
              Based on your Python + ML profile, <strong style={{ color: "var(--foreground)" }}>huggingface/transformers</strong> is surging with <strong style={{ color: "var(--blue)" }}>+2.3k stars this week</strong>.
            </p>
            <button
              onClick={() => onNavigate("recommendations")}
              className="flex items-center gap-1.5 mt-4 transition-all hover:gap-2.5"
              style={{ fontSize: "12px", color: "var(--blue)", fontWeight: 500 }}
            >
              View AI recommendations <ArrowRight size={12} />
            </button>
          </div>

          <div className="rounded-2xl p-4" style={{ background: "var(--surface-1)", border: "1px solid var(--glass-border)" }}>
            <p style={{ fontSize: "12px", fontWeight: 600, marginBottom: 10, letterSpacing: "-0.01em" }}>Language Mix</p>
            <div className="space-y-2.5">
              {topLangs.map(l => (
                <div key={l.name}>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <div className="rounded-full" style={{ width: 7, height: 7, background: l.color }} />
                      <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{l.name}</span>
                    </div>
                    <span className="mono" style={{ fontSize: "10px", color: "var(--muted-foreground)" }}>{l.pct}%</span>
                  </div>
                  <div className="rounded-full overflow-hidden" style={{ height: 3, background: "var(--surface-2)" }}>
                    <div className="h-full rounded-full" style={{ width: `${l.pct}%`, background: l.color, boxShadow: `0 0 6px ${l.color}` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trending repos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <h2 style={{ fontSize: "15px", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--foreground)" }}>Trending For You</h2>
            <span className="px-2 py-0.5 rounded-full mono" style={{ fontSize: "9px", fontWeight: 700, background: "var(--blue-dim)", border: "1px solid var(--blue-border)", color: "var(--blue)", letterSpacing: "0.08em" }}>AI CURATED</span>
          </div>
          <button onClick={() => onNavigate("search")} className="flex items-center gap-1.5 transition-all hover:gap-2.5" style={{ fontSize: "12px", color: "var(--blue)", fontWeight: 500 }}>
            Explore all <ArrowRight size={13} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {repos.slice(0, 3).map((repo, i) => (
            <RepoCard key={repo.id} repo={repo} onView={onViewRepo} onSave={onSaveRepo} index={i} />
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Top ML Repos",    desc: "Curated list of top Machine Learning repositories", page: "results" },
          { title: "AI Picks For You", desc: "Personalized recommendations based on your profile", page: "recommendations" },
          { title: "Recent Searches",  desc: "Browse your recent search history",                  page: "history" },
        ].map(({ title, desc, page }) => (
          <button
            key={title}
            onClick={() => onNavigate(page)}
            className="flex items-start p-4 rounded-2xl text-left transition-all hover:translate-y-[-2px]"
            style={{ background: "var(--surface-1)", border: "1px solid var(--glass-border)" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(79,142,247,0.2)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--glass-border)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)", letterSpacing: "-0.01em" }}>{title}</p>
              <p style={{ fontSize: "11px", color: "var(--muted-foreground)", marginTop: 3, lineHeight: 1.5 }}>{desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
