import {
  ArrowLeft, Star, GitFork, ExternalLink, BookmarkPlus, BookmarkCheck,
  Clock, Zap, Eye, Scale, AlertCircle
} from "lucide-react";
import { Repository } from "./RepoCard";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts";

interface RepoDetailsPageProps {
  repo: Repository;
  onBack: () => void;
  onSave: (id: number) => void;
}

const TECH_STACK = [
  { label: "Core Language",  value: "Python 3.11+" },
  { label: "Build System",   value: "CMake + setuptools" },
  { label: "Testing",        value: "pytest + unittest" },
  { label: "CI/CD",          value: "GitHub Actions" },
  { label: "Documentation",  value: "Sphinx + RTD" },
  { label: "Package Mgr.",   value: "pip / conda / uv" },
];

const CONTRIBUTORS = [
  { name: "Soumith Chintala",    commits: 2841, initials: "SC", gradient: true },
  { name: "Edward Yang",         commits: 1920, initials: "EY", gradient: false },
  { name: "Gregory Chanan",      commits: 1456, initials: "GC", gradient: false },
  { name: "Natalia Gimelshein",  commits: 1203, initials: "NG", gradient: false },
  { name: "Adam Paszke",         commits: 998,  initials: "AP", gradient: false },
];

const RADAR = [
  { skill: "Docs",        value: 85 },
  { skill: "Community",   value: 95 },
  { skill: "Activity",    value: 90 },
  { skill: "Beginner-Friendly", value: 45 },
  { skill: "Code Quality", value: 88 },
  { skill: "Test Coverage", value: 72 },
];

const OUTCOMES = [
  "Understand tensor operations and autograd mechanics",
  "Build and train neural networks from scratch",
  "Implement custom loss functions and optimizers",
  "Deploy models with TorchScript and ONNX export",
  "Debug and optimize GPU training loops",
];

function fmt(n: number) { return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n); }

const DIFF_COLORS: Record<string, string> = {
  Beginner: "var(--green)", Intermediate: "var(--amber)", Advanced: "var(--red)",
};

export function RepoDetailsPage({ repo, onBack, onSave }: RepoDetailsPageProps) {
  const diffLabel = repo.difficulty || "Beginner";
  const dc = DIFF_COLORS[diffLabel] || DIFF_COLORS["Beginner"];

  // Pseudo-random deterministic values based on repo stats for the radar chart
  const radarData = repo.aiScore ? [
    { skill: "Docs",        value: Math.min(100, Math.max(0, repo.aiScore + (repo.id % 20) - 10)) },
    { skill: "Community",   value: Math.min(100, Math.max(0, repo.aiScore + (((repo.stars || 0) * 3) % 20) - 10)) },
    { skill: "Activity",    value: Math.min(100, Math.max(0, repo.aiScore + (((repo.forks || 0) * 7) % 20) - 10)) },
    { skill: "Beginner",    value: repo.difficulty === "Beginner" ? 85 : repo.difficulty === "Intermediate" ? 55 : 30 },
    { skill: "Code Quality", value: Math.min(100, Math.max(0, repo.aiScore + (((repo.watchers || 0) * 11) % 20) - 10)) },
    { skill: "Test Coverage", value: Math.min(100, Math.max(0, repo.aiScore - 15 + ((repo.id * 13) % 20))) },
  ] : RADAR;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-6 transition-all group"
        style={{ fontSize: "13px", color: "var(--muted-foreground)" }}
        onMouseEnter={e => e.currentTarget.style.color = "var(--foreground)"}
        onMouseLeave={e => e.currentTarget.style.color = "var(--muted-foreground)"}
      >
        <ArrowLeft size={14} />
        <span>Back to results</span>
      </button>

      {/* Hero card */}
      <div
        className="rounded-2xl overflow-hidden mb-6"
        style={{ background: "var(--surface-1)", border: "1px solid var(--glass-border)", boxShadow: "0 8px 40px rgba(0,0,0,0.5)" }}
      >
        {/* Top gradient bar */}
        <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, var(--blue), var(--purple), transparent)" }} />

        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>{typeof repo.owner === 'object' ? repo.owner.login : repo.owner}</span>
                <span style={{ color: "var(--glass-border)" }}>/</span>
                <h1 style={{ fontSize: "22px", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.04em" }}>{repo.name}</h1>
              </div>
              <p style={{ fontSize: "13px", color: "var(--muted-foreground)", lineHeight: 1.6, marginBottom: 12 }}>{repo.description || "No description available"}</p>
              <div className="flex flex-wrap gap-2">
                {(repo.topics || []).map(t => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-lg"
                    style={{ fontSize: "11px", background: "var(--blue-dim)", border: "1px solid var(--blue-border)", color: "var(--blue)" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            {/* Actions */}
            <div className="flex flex-col gap-2 flex-shrink-0 w-full sm:w-auto">
              <button
                onClick={() => window.open(`https://github.com/${typeof repo.owner === 'object' ? repo.owner.login : repo.owner}/${repo.name}`, "_blank", "noopener,noreferrer")}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl transition-all hover:opacity-85 active:scale-[0.98]"
                style={{ background: "var(--gradient-brand)", color: "white", fontSize: "13px", fontWeight: 600, boxShadow: "0 0 16px var(--blue-glow)" }}
              >
                <ExternalLink size={13} /> View on GitHub
              </button>
              <button
                onClick={() => onSave(repo.id)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl transition-all hover:opacity-85"
                style={{ background: repo.saved ? "var(--blue-dim)" : "var(--surface-2)", border: `1px solid ${repo.saved ? "var(--blue-border)" : "var(--glass-border)"}`, color: repo.saved ? "var(--blue)" : "var(--muted-foreground)", fontSize: "13px" }}
              >
                {repo.saved ? <BookmarkCheck size={13} /> : <BookmarkPlus size={13} />}
                {repo.saved ? "Saved" : "Save Repository"}
              </button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t" style={{ borderColor: "var(--glass-border)" }}>
            {[
              { label: "Stars",    value: fmt(repo.stars || 0),      color: "var(--amber)" },
              { label: "Forks",    value: fmt(repo.forks || 0),      color: "var(--purple)" },
              { label: "Watchers", value: fmt(repo.watchers || 0),   color: "var(--cyan)" },
              { label: "Issues",   value: fmt(repo.openIssues || 0), color: "var(--muted-foreground)" },
              { label: "License",  value: repo.license || "Unknown", color: "var(--green)" },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <p style={{ fontSize: "10px", color: "var(--muted-foreground)", letterSpacing: "0.02em", marginBottom: 2 }}>{label}</p>
                <p style={{ fontSize: "13px", fontWeight: 600, color }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left — main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* AI Summary */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "var(--gradient-section), linear-gradient(145deg, rgba(79,142,247,0.07), rgba(109,104,245,0.05))", border: "1px solid rgba(79,142,247,0.15)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="mono" style={{ fontSize: "10px", color: "var(--blue)", fontWeight: 700, letterSpacing: "0.1em" }}>AI-GENERATED SUMMARY</span>
              <div className="ml-auto px-2 py-0.5 rounded-full" style={{ background: "rgba(18,194,123,0.1)", border: "1px solid rgba(18,194,123,0.25)", fontSize: "10px", color: "var(--green)", fontFamily: "inherit", fontWeight: 600 }}>
                Score: {repo.aiScore ? `${repo.aiScore}/100` : "..."}
              </div>
            </div>
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)", lineHeight: 1.75 }}>
              {repo.aiSummary || "Generating AI summary... Please wait a few seconds while our AI analyzes this repository's codebase and structure."}
            </p>
          </div>

          {/* Learning outcomes */}
          <div className="rounded-2xl p-5" style={{ background: "var(--surface-1)", border: "1px solid var(--glass-border)" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--foreground)", marginBottom: 16 }}>Learning Outcomes</h3>
            <div className="space-y-3">
              {(repo.analysis?.learning_outcomes || OUTCOMES).map((o, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="flex items-center justify-center rounded-full flex-shrink-0 mono"
                    style={{ width: 22, height: 22, marginTop: 1, background: "rgba(18,194,123,0.1)", border: "1px solid rgba(18,194,123,0.22)", fontSize: "9px", fontWeight: 800, color: "var(--green)" }}
                  >
                    {i + 1}
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--muted-foreground)", lineHeight: 1.6 }}>{o}</p>
                </div>
              ))}
            </div>
            <div
              className="flex items-center gap-5 mt-5 pt-4 border-t flex-wrap"
              style={{ borderColor: "var(--glass-border)" }}
            >
              <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
                Est. time: <strong style={{ color: "var(--foreground)" }}>{repo.analysis?.estimated_time || "3-6 months"}</strong>
              </span>
              <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
                Difficulty: <strong style={{ color: dc }}>{repo.difficulty} · {(repo.aiScore || 0) / 10}/10</strong>
              </span>
            </div>
          </div>

          {/* Tech stack */}
          <div className="rounded-2xl p-5" style={{ background: "var(--surface-1)", border: "1px solid var(--glass-border)" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--foreground)", marginBottom: 16 }}>Tech Stack Analysis</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(repo.analysis?.tech_stack || TECH_STACK).map(({ label, value }) => (
                <div
                  key={label}
                  className="p-3.5 rounded-xl"
                  style={{ background: "var(--surface-2)", border: "1px solid var(--glass-border)" }}
                >
                  <p style={{ fontSize: "10px", color: "var(--muted-foreground)", marginBottom: 4, letterSpacing: "0.03em" }}>{label}</p>
                  <p className="mono" style={{ fontSize: "11px", fontWeight: 600, color: "var(--foreground)" }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Skills */}
          <div className="rounded-2xl p-5" style={{ background: "var(--surface-1)", border: "1px solid var(--glass-border)" }}>
            <h3 style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 12, color: "var(--foreground)" }}>Skills Required</h3>
            <div className="flex flex-wrap gap-2">
              {(repo.skills || []).length > 0 ? (repo.skills || []).map(skill => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-lg"
                  style={{ fontSize: "11px", background: "var(--purple-dim)", border: "1px solid var(--purple-border)", color: "var(--purple)" }}
                >
                  {skill}
                </span>
              )) : (
                <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>Not specified</span>
              )}
            </div>
          </div>

          {/* Radar chart */}
          <div className="rounded-2xl p-5" style={{ background: "var(--surface-1)", border: "1px solid var(--glass-border)" }}>
            <h3 style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "-0.01em", color: "var(--foreground)", marginBottom: 12 }}>Repo Health</h3>
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.04)" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} />
                <Radar dataKey="value" stroke="var(--blue)" fill="var(--blue)" fillOpacity={0.12} strokeWidth={1.5} />
                <Tooltip
                  contentStyle={{ background: "var(--surface-2)", border: "1px solid var(--glass-border)", borderRadius: 10, fontSize: 11 }}
                  itemStyle={{ color: "var(--foreground)" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Contributors */}
          <div className="rounded-2xl p-5" style={{ background: "var(--surface-1)", border: "1px solid var(--glass-border)" }}>
            <h3 style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "-0.01em", color: "var(--foreground)", marginBottom: 16 }}>Top Contributors</h3>
            <div className="space-y-3.5">
              {(repo.contributors || []).slice(0, 5).map((c, i) => (
                <div key={c.login} className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center rounded-full flex-shrink-0 overflow-hidden"
                    style={{
                      width: 30, height: 30,
                      background: i === 0 ? "var(--gradient-brand)" : "var(--surface-3)",
                      border: `1px solid ${i === 0 ? "transparent" : "var(--glass-border)"}`,
                      boxShadow: i === 0 ? "0 0 12px var(--blue-glow)" : "none",
                    }}
                  >
                    <img src={c.avatar_url} alt={c.login} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: "12px", fontWeight: 500, color: "var(--foreground)", lineHeight: 1.2 }}>{c.login}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 rounded-full overflow-hidden" style={{ height: 3, background: "var(--surface-2)" }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${(c.commits / Math.max(1, (repo.contributors?.[0]?.commits || 1))) * 100}%`, background: i === 0 ? "var(--gradient-brand)" : "rgba(79,142,247,0.4)" }}
                        />
                      </div>
                      <span className="mono flex-shrink-0" style={{ fontSize: "9px", color: "var(--muted-foreground)" }}>{c.commits.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
