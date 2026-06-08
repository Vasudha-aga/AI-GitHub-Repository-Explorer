import { Star, GitFork, BookmarkPlus, BookmarkCheck, ExternalLink, Sparkles, Clock, Eye, TrendingUp } from "lucide-react";

export interface Repository {
  id: number;
  name: string;
  owner: any;
  fullName: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  watchers: number;
  updatedAt: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  skills: string[];
  aiSummary: string;
  topics: string[];
  saved?: boolean;
  license: string;
  openIssues: number;
  aiScore: number;
  analysis?: any;
  contributors?: any[];
}

const LANG_COLORS: Record<string, string> = {
  Python:     "#3572A5",
  JavaScript: "#f1e05a",
  TypeScript: "#2b7489",
  Rust:       "#dea584",
  Go:         "#00ADD8",
  Java:       "#b07219",
  "C++":      "#f34b7d",
  Ruby:       "#701516",
  Swift:      "#FA7343",
  Kotlin:     "#A97BFF",
};

const DIFF: Record<string, { bg: string; border: string; color: string; dot: string }> = {
  Beginner:     { bg: "rgba(18,194,123,0.10)", border: "rgba(18,194,123,0.28)", color: "#12c27b", dot: "#12c27b" },
  Intermediate: { bg: "rgba(240,160,80,0.10)", border: "rgba(240,160,80,0.28)", color: "#f0a050", dot: "#f0a050" },
  Advanced:     { bg: "rgba(240,76,93,0.10)",  border: "rgba(240,76,93,0.28)",  color: "#f04c5d", dot: "#f04c5d" },
};

function fmt(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

interface RepoCardProps {
  repo: Repository;
  onView: (repo: Repository) => void;
  onSave: (id: number) => void;
  index?: number;
}

export function RepoCard({ repo, onView, onSave, index = 0 }: RepoCardProps) {
  const diffLabel = repo.difficulty || "Beginner";
  const d = DIFF[diffLabel] || DIFF["Beginner"];
  const lc = LANG_COLORS[repo.language || ""] ?? "#8b5cf6";
  const aiScore = repo.aiScore || 0;
  const scoreColor = aiScore >= 95 ? "var(--green)" : aiScore >= 85 ? "var(--blue)" : "var(--amber)";

  return (
    <div
      className="card-hover flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--glass-border)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}
    >
      {/* Header band */}
      <div
        className="px-4 pt-4 pb-3"
        style={{ borderBottom: "1px solid var(--glass-border)", background: "var(--glass-bg)" }}
      >
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex-1 min-w-0">
            <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{typeof repo.owner === 'object' ? repo.owner.login : repo.owner}</span>
            <span style={{ fontSize: "11px", color: "var(--muted-foreground)", margin: "0 4px" }}>/</span>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.02em" }}>{repo.name}</span>
          </div>
          <span
            className="flex items-center gap-1 px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ fontSize: "10px", fontWeight: 700, background: d.bg, border: `1px solid ${d.border}`, color: d.color }}
          >
            <div className="rounded-full" style={{ width: 5, height: 5, background: d.dot }} />
            {repo.difficulty}
          </span>
        </div>
        <p style={{ fontSize: "13px", color: "var(--muted-foreground)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", marginBottom: 16 }}>
          {repo.description || "No description available"}
        </p>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col px-4 py-3.5 gap-3.5">
        {/* AI summary */}
        <div
          className="rounded-xl p-3"
          style={{ background: "var(--gradient-section), linear-gradient(135deg, rgba(79,142,247,0.07), rgba(109,104,245,0.04))", border: "1px solid rgba(79,142,247,0.12)" }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Sparkles size={10} style={{ color: "var(--blue)" }} />
              <span className="mono" style={{ fontSize: "9px", color: "var(--blue)", fontWeight: 700, letterSpacing: "0.1em" }}>AI SUMMARY</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp size={9} style={{ color: scoreColor }} />
              <span className="mono" style={{ fontSize: "9px", color: scoreColor, fontWeight: 700 }}>{repo.aiScore}/100</span>
            </div>
          </div>
          <p style={{ fontSize: "11px", color: "var(--muted-foreground)", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {repo.aiSummary || "Analysis pending"}
          </p>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5">
          {(repo.skills || []).slice(0, 5).map(skill => (
            <span
              key={skill}
              className="px-2 py-0.5 rounded-md"
              style={{ fontSize: "10px", color: "var(--muted-foreground)", background: "var(--surface-2)", border: "1px solid var(--glass-border)" }}
            >
              {skill}
            </span>
          ))}
          {(repo.skills || []).length > 5 && (
            <span style={{ fontSize: "10px", color: "var(--muted-foreground)", alignSelf: "center" }}>+{(repo.skills || []).length - 5}</span>
          )}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-0 flex-wrap" style={{ gap: "0 16px" }}>
          <div className="flex items-center gap-1.5">
            <div className="rounded-full" style={{ width: 8, height: 8, background: lc, boxShadow: `0 0 4px ${lc}` }} />
            <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{repo.language || "Unknown"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={11} style={{ color: "#f0a050" }} />
            <span className="mono" style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{fmt(repo.stars || 0)}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork size={11} style={{ color: "var(--blue)" }} />
            <span className="mono" style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{fmt(repo.forks || 0)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye size={11} style={{ color: "var(--muted-foreground)" }} />
            <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{fmt(repo.watchers || 0)}</span>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <Clock size={10} style={{ color: "var(--muted-foreground)" }} />
            <span style={{ fontSize: "10px", color: "var(--muted-foreground)" }}>{repo.updatedAt}</span>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex gap-2 px-4 pb-4">
        <button
          onClick={() => onView(repo)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all hover:opacity-85 active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, rgba(79,142,247,0.15), rgba(109,104,245,0.10))",
            border: "1px solid rgba(79,142,247,0.22)",
            color: "var(--blue)",
            fontSize: "12px",
            fontWeight: 600,
          }}
        >
          <ExternalLink size={12} />
          View Details
        </button>
        <button
          onClick={() => onSave(repo.id)}
          className="flex items-center justify-center rounded-xl px-3 transition-all hover:opacity-85 active:scale-[0.98]"
          style={{
            border: `1px solid ${repo.saved ? "rgba(79,142,247,0.3)" : "var(--glass-border)"}`,
            background: repo.saved ? "rgba(79,142,247,0.1)" : "var(--surface-2)",
            color: repo.saved ? "var(--blue)" : "var(--muted-foreground)",
          }}
          title={repo.saved ? "Remove from saved" : "Save repository"}
        >
          {repo.saved ? <BookmarkCheck size={15} /> : <BookmarkPlus size={15} />}
        </button>
      </div>
    </div>
  );
}

/* Loading skeleton */
export function RepoCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface-1)", border: "1px solid var(--glass-border)" }}>
      <div className="px-4 pt-4 pb-3" style={{ borderBottom: "1px solid var(--glass-border)" }}>
        <div className="h-4 w-36 rounded-lg mb-2 animate-pulse" style={{ background: "var(--surface-2)" }} />
        <div className="h-3 w-full rounded mb-1.5 animate-pulse" style={{ background: "var(--surface-2)" }} />
        <div className="h-3 w-3/4 rounded animate-pulse" style={{ background: "var(--surface-2)" }} />
      </div>
      <div className="px-4 py-3.5">
        <div className="h-16 rounded-xl mb-3 animate-pulse" style={{ background: "var(--surface-2)" }} />
        <div className="flex gap-1.5 mb-3">
          {[60, 80, 70, 50].map(w => (
            <div key={w} className="h-5 rounded-md animate-pulse" style={{ width: w, background: "var(--surface-2)" }} />
          ))}
        </div>
        <div className="h-3 w-full rounded animate-pulse" style={{ background: "var(--surface-2)" }} />
      </div>
      <div className="flex gap-2 px-4 pb-4">
        <div className="flex-1 h-9 rounded-xl animate-pulse" style={{ background: "var(--surface-2)" }} />
        <div className="w-10 h-9 rounded-xl animate-pulse" style={{ background: "var(--surface-2)" }} />
      </div>
    </div>
  );
}
