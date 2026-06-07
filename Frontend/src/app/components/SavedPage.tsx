import { useState } from "react";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { Repository, RepoCard, RepoCardSkeleton } from "./RepoCard";

interface SavedPageProps {
  repos: Repository[];
  onViewRepo: (repo: Repository) => void;
  onSaveRepo: (id: number) => void;
}

export function SavedPage({ repos, onViewRepo, onSaveRepo }: SavedPageProps) {
  const [filter, setFilter] = useState("");
  const [diffFilter, setDiffFilter] = useState("All");

  const saved = repos.filter(r => r.saved);
  const filtered = saved
    .filter(r => diffFilter === "All" || r.difficulty === diffFilter)
    .filter(r =>
      r.name.toLowerCase().includes(filter.toLowerCase()) ||
      r.description.toLowerCase().includes(filter.toLowerCase()) ||
      r.language.toLowerCase().includes(filter.toLowerCase()) ||
      r.owner.toLowerCase().includes(filter.toLowerCase())
    );

  const langs = [...new Set(saved.map(r => r.language))];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--foreground)" }}>Saved Repositories</h1>
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)", marginTop: 2 }}>
              {saved.length} repository{saved.length !== 1 ? "ies" : "y"} bookmarked
            </p>
          </div>
        </div>
      </div>

      {saved.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div
            className="flex items-center justify-center rounded-3xl mb-5"
            style={{ width: 80, height: 80, background: "rgba(240,160,80,0.08)", border: "1px solid rgba(240,160,80,0.18)" }}
          >
            <BookmarkCheck size={34} style={{ color: "var(--amber)", opacity: 0.8 }} />
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 8, color: "var(--foreground)" }}>No saved repositories yet</h3>
          <p style={{ fontSize: "13px", color: "var(--muted-foreground)", lineHeight: 1.6, maxWidth: 320 }}>
            Save interesting repositories while exploring to revisit them later. Click the bookmark icon on any repository card.
          </p>
          <div
            className="flex items-center gap-2 mt-6 px-4 py-2 rounded-xl"
            style={{ background: "var(--blue-dim)", border: "1px solid var(--blue-border)" }}
          >
            <Sparkles size={13} style={{ color: "var(--blue)" }} />
            <span style={{ fontSize: "12px", color: "var(--blue)" }}>AI will recommend repos based on your saves</span>
          </div>
        </div>
      ) : (
        <>
          {/* Search + filters */}
          <div className="flex flex-wrap gap-3 mb-5">
            <div
              className="relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
              style={{ background: "var(--surface-1)", border: "1px solid var(--glass-border)", flex: "1 1 200px", maxWidth: 380 }}
            >
              <Search size={14} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
              <input
                value={filter}
                onChange={e => setFilter(e.target.value)}
                placeholder="Filter saved repos…"
                className="flex-1 bg-transparent outline-none"
                style={{ color: "var(--foreground)", fontSize: "13px" }}
              />
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal size={13} style={{ color: "var(--muted-foreground)" }} />
              {["All", "Beginner", "Intermediate", "Advanced"].map(d => (
                <button
                  key={d}
                  onClick={() => setDiffFilter(d)}
                  className="px-3 py-2 rounded-xl transition-all"
                  style={{
                    fontSize: "12px",
                    background: diffFilter === d ? "var(--blue-dim)" : "var(--surface-2)",
                    border: `1px solid ${diffFilter === d ? "var(--blue-border)" : "var(--glass-border)"}`,
                    color: diffFilter === d ? "var(--blue)" : "var(--muted-foreground)",
                    fontWeight: diffFilter === d ? 600 : 400,
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Language pills */}
          {langs.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {langs.map(lang => (
                <span
                  key={lang}
                  className="px-2.5 py-1 rounded-lg"
                  style={{ fontSize: "11px", background: "var(--surface-2)", border: "1px solid var(--glass-border)", color: "var(--muted-foreground)" }}
                >
                  {lang} · {saved.filter(r => r.language === lang).length}
                </span>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <p style={{ fontSize: "14px", color: "var(--muted-foreground)" }}>No saved repos match your filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((repo, i) => (
                <RepoCard key={repo.id} repo={repo} onView={onViewRepo} onSave={onSaveRepo} index={i} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
