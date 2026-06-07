import { ArrowRight, Star, GitFork, CheckCircle2, Circle } from "lucide-react";
import { Repository } from "./RepoCard";

interface RecommendationsPageProps {
  repos: Repository[];
  onViewRepo: (repo: Repository) => void;
  onSaveRepo: (id: number) => void;
  searchCount: number;
}

const CAREER_PATHS = [
  {
    title: "ML Engineer",
    match: 92,
    color: "var(--blue)",
    glow: "var(--blue-glow)",
    border: "var(--blue-border)",
    dim: "var(--blue-dim)",
    steps: [
      { label: "scikit-learn", done: true },
      { label: "pytorch",      done: true },
      { label: "transformers", done: false },
      { label: "MLflow",       done: false },
    ],
    desc: "Build and deploy large-scale ML models in production environments.",
    progress: 50,
  },
  {
    title: "Full-Stack AI",
    match: 78,
    color: "var(--purple)",
    glow: "var(--purple-glow)",
    border: "var(--purple-border)",
    dim: "var(--purple-dim)",
    steps: [
      { label: "fastapi",   done: true },
      { label: "next.js",   done: true },
      { label: "langchain", done: false },
      { label: "shadcn-ui", done: false },
    ],
    desc: "Combine AI capabilities with modern web applications.",
    progress: 50,
  },
  {
    title: "AI Researcher",
    match: 65,
    color: "var(--violet)",
    glow: "rgba(155,110,245,0.2)",
    border: "rgba(155,110,245,0.22)",
    dim: "rgba(155,110,245,0.1)",
    steps: [
      { label: "pytorch",      done: true },
      { label: "transformers", done: false },
      { label: "jax",          done: false },
      { label: "triton",       done: false },
    ],
    desc: "Push the boundaries of AI research with cutting-edge tools.",
    progress: 25,
  },
];

const AI_INSIGHTS = [
  { icon: "01", text: "You've explored 12 Python ML repos — try building a mini-project with FastAPI + scikit-learn to solidify your learning." },
  { icon: "02", text: "Transformers repo has a 100-page study guide perfectly matched to your NLP learning goals." },
  { icon: "03", text: "Join the PyTorch Discord — 3 active study threads exactly match your current skill level." },
  { icon: "04", text: "Your next challenge: implement a custom attention mechanism from scratch in PyTorch." },
  { icon: "05", text: "You're in the top 12% of explorers in the ML Engineering learning path. Keep going!" },
  { icon: "06", text: "Based on your saves, explore vector databases (Qdrant, Weaviate) as your next topic area." },
];

function fmt(n: number) { return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n); }

export function RecommendationsPage({ repos, onViewRepo, onSaveRepo, searchCount }: RecommendationsPageProps) {
  const recommended = repos.slice(1, 6);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: "var(--gradient-section), linear-gradient(135deg, rgba(109,104,245,0.12), rgba(155,110,245,0.08), rgba(79,142,247,0.06))", border: "1px solid rgba(109,104,245,0.2)" }}
      >
        <div className="absolute top-0 right-0 w-80 h-80 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(109,104,245,0.15) 0%, transparent 70%)", transform: "translate(30%,-30%)" }} />
        <div className="relative">
          <span className="mono" style={{ fontSize: "9px", color: "var(--purple)", fontWeight: 700, letterSpacing: "0.1em" }}>PERSONALIZED FOR YOU</span>
          <h1 style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--foreground)", marginTop: 4 }}>AI Recommendations</h1>
          <p style={{ fontSize: "13px", color: "var(--muted-foreground)", marginTop: 4 }}>
            Curated based on your {searchCount} searches and Python ML profile
          </p>
        </div>
      </div>

      {/* Career paths */}
      <div className="rounded-2xl p-5" style={{ background: "var(--surface-1)", border: "1px solid var(--glass-border)" }}>
        <div className="flex items-center gap-2.5 mb-5">
          <h2 style={{ fontSize: "14px", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--foreground)" }}>Career Path Matching</h2>
          <span className="mono px-2 py-0.5 rounded-full" style={{ fontSize: "9px", background: "rgba(240,160,80,0.1)", border: "1px solid rgba(240,160,80,0.25)", color: "var(--amber)", letterSpacing: "0.08em", fontWeight: 700 }}>AI SCORED</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CAREER_PATHS.map(path => (
            <div
              key={path.title}
              className="rounded-2xl p-5 cursor-pointer transition-all hover:translate-y-[-2px]"
              style={{ background: path.dim, border: `1px solid ${path.border}` }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 30px ${path.glow}`; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: path.color, letterSpacing: "-0.02em" }}>{path.title}</h3>
                <span className="mono" style={{ fontSize: "12px", fontWeight: 800, color: path.color }}>{path.match}%</span>
              </div>
              <p style={{ fontSize: "11px", color: "var(--muted-foreground)", lineHeight: 1.5, marginBottom: 14 }}>{path.desc}</p>

              {/* Steps */}
              <div className="space-y-1.5 mb-4">
                {path.steps.map(step => (
                  <div key={step.label} className="flex items-center gap-2">
                    {step.done
                      ? <CheckCircle2 size={12} style={{ color: path.color, flexShrink: 0 }} />
                      : <Circle size={12} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
                    }
                    <span style={{ fontSize: "12px", color: step.done ? "var(--foreground)" : "var(--muted-foreground)" }}>{step.label}</span>
                  </div>
                ))}
              </div>

              {/* Progress */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span style={{ fontSize: "10px", color: "var(--muted-foreground)" }}>Progress</span>
                  <span className="mono" style={{ fontSize: "10px", color: path.color, fontWeight: 700 }}>{path.progress}%</span>
                </div>
                <div className="rounded-full overflow-hidden" style={{ height: 3, background: "var(--surface-2)" }}>
                  <div className="h-full rounded-full" style={{ width: `${path.progress}%`, background: path.color, boxShadow: `0 0 6px ${path.glow}` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights grid */}
      <div
        className="rounded-2xl p-5"
        style={{ background: "var(--gradient-section), linear-gradient(145deg, rgba(79,142,247,0.06), rgba(109,104,245,0.04))", border: "1px solid rgba(79,142,247,0.13)" }}
      >
        <div className="flex items-center gap-2.5 mb-4">
          <h2 style={{ fontSize: "14px", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--foreground)" }}>AI Learning Insights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {AI_INSIGHTS.map((s, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3.5 rounded-xl transition-all"
              style={{ background: "var(--surface-2)", border: "1px solid var(--glass-border)" }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--glass-hover)"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--surface-2)"}
            >
              <span className="mono flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 24, height: 24, fontSize: "10px", fontWeight: 800, background: "var(--blue-dim)", border: "1px solid var(--blue-border)", color: "var(--blue)" }}>{s.icon}</span>
              <p style={{ fontSize: "12px", color: "var(--muted-foreground)", lineHeight: 1.6 }}>{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended repos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <h2 style={{ fontSize: "14px", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--foreground)" }}>Recommended For You</h2>
          </div>
          <span className="mono" style={{ fontSize: "10px", color: "var(--muted-foreground)" }}>Updated 5 min ago</span>
        </div>
        <div className="space-y-3">
          {recommended.map((repo, i) => {
            const matchPct = Math.round(97 - i * 4);
            const matchColor = matchPct >= 90 ? "var(--green)" : matchPct >= 80 ? "var(--blue)" : "var(--purple)";
            return (
              <div
                key={repo.id}
                className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all"
                style={{ background: "var(--surface-1)", border: "1px solid var(--glass-border)" }}
                onClick={() => onViewRepo(repo)}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(79,142,247,0.2)"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--glass-border)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                {/* Rank */}
                <div
                  className="flex items-center justify-center rounded-xl mono flex-shrink-0"
                  style={{ width: 38, height: 38, fontSize: "14px", fontWeight: 800, background: i === 0 ? "var(--gradient-brand)" : "var(--surface-2)", border: i === 0 ? "none" : "1px solid var(--glass-border)", color: i === 0 ? "white" : "var(--muted-foreground)", boxShadow: i === 0 ? "0 0 16px var(--blue-glow)" : "none" }}
                >
                  {i + 1}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--foreground)", letterSpacing: "-0.02em" }}>{repo.owner}/{repo.name}</span>
                    <span
                      className="px-2 py-0.5 rounded-full mono"
                      style={{ fontSize: "9px", fontWeight: 700, background: `${matchColor}18`, border: `1px solid ${matchColor}30`, color: matchColor }}
                    >
                      {matchPct}% match
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", color: "var(--muted-foreground)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {repo.aiSummary}
                  </p>
                </div>
                {/* Stats */}
                <div className="hidden sm:flex items-center gap-5 flex-shrink-0">
                  <div className="flex items-center gap-1.5">
                    <Star size={12} style={{ color: "var(--amber)" }} />
                    <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>{fmt(repo.stars)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <GitFork size={12} style={{ color: "var(--muted-foreground)" }} />
                    <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>{fmt(repo.forks)}</span>
                  </div>
                </div>
                <ArrowRight size={14} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
