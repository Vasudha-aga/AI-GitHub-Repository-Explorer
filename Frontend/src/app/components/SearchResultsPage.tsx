import { useState } from "react";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { Repository, RepoCard, RepoCardSkeleton } from "./RepoCard";

interface SearchResultsPageProps {
  query: string;
  repos: Repository[];
  onViewRepo: (repo: Repository) => void;
  onSaveRepo: (id: number) => void;
  onSearch: (q: string) => void;
}

const DIFFS = ["All", "Beginner", "Intermediate", "Advanced"] as const;
const LANGS = ["All", "Python", "TypeScript", "JavaScript", "Rust", "Go"];

export function SearchResultsPage({ query, repos, onViewRepo, onSaveRepo, onSearch }: SearchResultsPageProps) {
  const [searchVal, setSearchVal] = useState(query);
  const [diffFilter, setDiffFilter] = useState("All");
  const [langFilter, setLangFilter] = useState("All");
  const [sortBy, setSortBy]         = useState<"stars"|"forks"|"ai">("ai");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = repos
    .filter(r => diffFilter === "All" || r.difficulty === diffFilter)
    .filter(r => langFilter === "All" || r.language === langFilter)
    .sort((a, b) =>
      sortBy === "stars" ? b.stars - a.stars :
      sortBy === "forks" ? b.forks - a.forks :
      b.aiScore - a.aiScore
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Search bar */}
      <div className="flex gap-3 mb-5">
        <div
          className="relative flex-1 rounded-xl flex items-center gap-3 px-4 py-2.5"
          style={{ background: "var(--surface-1)", border: "1px solid var(--glass-border)" }}
        >
          <Search size={14} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
          <input
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            onKeyDown={e => e.key === "Enter" && onSearch(searchVal)}
            className="flex-1 bg-transparent outline-none"
            style={{ color: "var(--foreground)", fontSize: "13px" }}
          />
          {searchVal !== query && (
            <button onClick={() => setSearchVal(query)} style={{ color: "var(--muted-foreground)" }}><X size={13} /></button>
          )}
        </div>
        <button
          onClick={() => onSearch(searchVal)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all hover:opacity-85"
          style={{ background: "var(--gradient-brand)", color: "white", fontSize: "13px", fontWeight: 600 }}
        >
          Search
        </button>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all"
          style={{
            background: showFilters ? "var(--blue-dim)" : "var(--surface-2)",
            border: `1px solid ${showFilters ? "var(--blue-border)" : "var(--glass-border)"}`,
            color: showFilters ? "var(--blue)" : "var(--muted-foreground)",
            fontSize: "13px",
          }}
        >
          <SlidersHorizontal size={14} />
          Filters
          <ChevronDown size={12} style={{ transform: showFilters ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div
          className="rounded-2xl p-5 mb-5 space-y-4"
          style={{ background: "var(--surface-1)", border: "1px solid var(--glass-border)" }}
        >
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="mono mb-2.5" style={{ fontSize: "9px", color: "var(--muted-foreground)", letterSpacing: "0.1em" }}>DIFFICULTY</p>
              <div className="flex flex-wrap gap-2">
                {DIFFS.map(f => (
                  <button key={f} onClick={() => setDiffFilter(f)}
                    className="px-3 py-1.5 rounded-xl transition-all"
                    style={{
                      fontSize: "12px",
                      background: diffFilter === f ? "var(--blue-dim)" : "var(--surface-2)",
                      border: `1px solid ${diffFilter === f ? "var(--blue-border)" : "var(--glass-border)"}`,
                      color: diffFilter === f ? "var(--blue)" : "var(--muted-foreground)",
                      fontWeight: diffFilter === f ? 600 : 400,
                    }}
                  >{f}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="mono mb-2.5" style={{ fontSize: "9px", color: "var(--muted-foreground)", letterSpacing: "0.1em" }}>LANGUAGE</p>
              <div className="flex flex-wrap gap-2">
                {LANGS.map(f => (
                  <button key={f} onClick={() => setLangFilter(f)}
                    className="px-3 py-1.5 rounded-xl transition-all"
                    style={{
                      fontSize: "12px",
                      background: langFilter === f ? "var(--purple-dim)" : "var(--surface-2)",
                      border: `1px solid ${langFilter === f ? "var(--purple-border)" : "var(--glass-border)"}`,
                      color: langFilter === f ? "var(--purple)" : "var(--muted-foreground)",
                      fontWeight: langFilter === f ? 600 : 400,
                    }}
                  >{f}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="mono mb-2.5" style={{ fontSize: "9px", color: "var(--muted-foreground)", letterSpacing: "0.1em" }}>SORT BY</p>
              <div className="flex gap-2">
                {(["ai", "stars", "forks"] as const).map(s => (
                  <button key={s} onClick={() => setSortBy(s)}
                    className="px-3 py-1.5 rounded-xl transition-all capitalize"
                    style={{
                      fontSize: "12px",
                      background: sortBy === s ? "rgba(18,194,123,0.1)" : "var(--surface-2)",
                      border: `1px solid ${sortBy === s ? "rgba(18,194,123,0.28)" : "var(--glass-border)"}`,
                      color: sortBy === s ? "var(--green)" : "var(--muted-foreground)",
                      fontWeight: sortBy === s ? 600 : 400,
                    }}
                  >{s === "ai" ? "AI Score" : s}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI context bar */}
      <div
        className="rounded-2xl p-4 mb-5"
        style={{ background: "var(--gradient-section), linear-gradient(135deg, rgba(79,142,247,0.07), rgba(109,104,245,0.05))", border: "1px solid rgba(79,142,247,0.14)" }}
      >
        <div>
          <p className="mono mb-1" style={{ fontSize: "9px", color: "var(--blue)", fontWeight: 700, letterSpacing: "0.1em" }}>AI SEARCH CONTEXT</p>
          <p style={{ fontSize: "13px", color: "var(--muted-foreground)", lineHeight: 1.6 }}>
            Showing <strong style={{ color: "var(--foreground)" }}>{filtered.length} repositories</strong> for "<em style={{ color: "var(--blue)" }}>{query}</em>".
            Results ranked by AI relevance score, weighing your Python & ML interest profile.
            {diffFilter !== "All" && ` Filtered to ${diffFilter} difficulty.`}
          </p>
        </div>
      </div>

      {/* Count */}
      <div className="flex items-center justify-between mb-4">
        <p style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
          <strong style={{ color: "var(--foreground)" }}>{filtered.length}</strong> repositories found
        </p>
        <div className="flex items-center gap-2">
          <div className="rounded-full" style={{ width: 6, height: 6, background: "var(--blue)", boxShadow: "0 0 4px var(--blue)" }} />
          <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>Sorted by {sortBy === "ai" ? "AI Score" : sortBy}</span>
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((repo, i) => (
            <RepoCard key={repo.id} repo={repo} onView={onViewRepo} onSave={onSaveRepo} index={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-24 text-center">
          <div
            className="flex items-center justify-center rounded-2xl mb-5"
            style={{ width: 72, height: 72, background: "var(--surface-2)", border: "1px solid var(--glass-border)" }}
          >
            <Search size={28} style={{ color: "var(--muted-foreground)" }} />
          </div>
          <h3 style={{ fontSize: "16px", fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 8, color: "var(--foreground)" }}>No repositories match your filters</h3>
          <p style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  );
}
