import { useState } from "react";
import { Search, Sparkles, Clock, X, ArrowRight } from "lucide-react";
import { SearchHistoryItem } from "../types";

const filterChips = [
  "Python", "JavaScript", "TypeScript", "Machine Learning",
  "Data Science", "Web Development", "AI", "Rust", "Go", "LLM",
];
interface SearchPageProps {
  onSearch: (query: string) => void;
  recentSearches: SearchHistoryItem[];
  trendingSearches: string[];
}

export function SearchPage({ onSearch, recentSearches, trendingSearches }: SearchPageProps) {
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [focused, setFocused] = useState(false);

  const toggle = (f: string) => setActiveFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

  const go = (q?: string) => {
    const effective = q ?? (query || activeFilters.join(", "));
    if (effective.trim()) onSearch(effective);
  };

  return (
    <div className="flex flex-col items-center px-6 py-10 max-w-2xl mx-auto w-full">
      {/* Hero */}
      <div className="text-center mb-10 w-full">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
          style={{ background: "var(--blue-dim)", border: "1px solid var(--blue-border)" }}
        >
          <Sparkles size={11} style={{ color: "var(--blue)" }} />
          <span className="mono" style={{ fontSize: "10px", color: "var(--blue)", fontWeight: 700, letterSpacing: "0.1em" }}>AI-POWERED REPO SEARCH</span>
        </div>

        <h1 style={{ fontSize: "38px", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.04em", color: "var(--foreground)" }}>
          Find your next<br /><span className="gradient-text">open-source project</span>
        </h1>
        <p style={{ fontSize: "14px", color: "var(--muted-foreground)", marginTop: 12, lineHeight: 1.6 }}>
          Search by topic, language, or describe what you want to build. AI understands intent, not just keywords.
        </p>
      </div>

      {/* Big search box */}
      <div className="w-full mb-4">
        <div
          className="relative rounded-2xl overflow-hidden transition-all"
          style={{
            border: `1px solid ${focused ? "var(--blue-border)" : "var(--glass-border)"}`,
            boxShadow: focused ? `0 0 0 4px var(--blue-dim), 0 8px 40px rgba(0,0,0,0.5)` : "0 4px 20px rgba(0,0,0,0.3)",
            background: "var(--surface-1)",
          }}
        >
          {/* Top accent when focused */}
          {focused && <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, var(--blue), var(--purple), transparent)" }} />}

          <div className="flex items-center gap-3 px-5 py-4">
            <Sparkles size={18} style={{ color: focused ? "var(--blue)" : "var(--muted-foreground)", flexShrink: 0, transition: "color .2s" }} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={e => e.key === "Enter" && go()}
              placeholder={`Try "Python ML frameworks for beginners" or "React state management 2025"`}
              className="flex-1 bg-transparent outline-none"
              style={{ color: "var(--foreground)", fontSize: "15px" }}
            />
            {query && (
              <button onClick={() => setQuery("")} style={{ color: "var(--muted-foreground)", flexShrink: 0 }}>
                <X size={15} />
              </button>
            )}
          </div>
          <div
            className="flex items-center justify-between px-5 py-3 border-t"
            style={{ borderColor: "var(--glass-border)", background: "var(--surface-2)" }}
          >
            <div className="flex flex-wrap gap-2">
              {activeFilters.map(f => (
                <span
                  key={f}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                  style={{ fontSize: "11px", background: "var(--blue-dim)", border: "1px solid var(--blue-border)", color: "var(--blue)" }}
                >
                  {f}
                  <button onClick={() => toggle(f)}><X size={9} /></button>
                </span>
              ))}
              {activeFilters.length === 0 && (
                <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>Add filters below to narrow results</span>
              )}
            </div>
            <button
              onClick={() => go()}
              className="flex items-center gap-2 px-5 py-2 rounded-xl transition-all hover:opacity-85 active:scale-[0.98]"
              style={{ background: "var(--gradient-brand)", color: "white", fontSize: "13px", fontWeight: 600, boxShadow: "0 0 16px var(--blue-glow)" }}
            >
              <Search size={13} />
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Filter chips */}
      <div className="w-full mb-8">
        <div className="flex items-center gap-2 mb-2.5">
          <span style={{ fontSize: "11px", color: "var(--muted-foreground)", letterSpacing: "0.05em" }}>FILTER BY TOPIC</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {filterChips.map(chip => {
            const active = activeFilters.includes(chip);
            return (
              <button
                key={chip}
                onClick={() => toggle(chip)}
                className="px-3.5 py-1.5 rounded-xl transition-all"
                style={{
                  fontSize: "12px",
                  fontWeight: active ? 600 : 400,
                  background: active ? "linear-gradient(135deg, rgba(79,142,247,0.18), rgba(109,104,245,0.12))" : "var(--surface-2)",
                  border: active ? "1px solid var(--blue-border)" : "1px solid var(--glass-border)",
                  color: active ? "var(--blue)" : "var(--muted-foreground)",
                  boxShadow: active ? "0 0 12px var(--blue-dim)" : "none",
                }}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </div>

      {/* Trending + Recent */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Trending */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "var(--surface-1)", border: "1px solid var(--glass-border)" }}
        >
          <div className="px-4 py-3.5 border-b flex items-center gap-2.5" style={{ borderColor: "var(--glass-border)", background: "var(--surface-2)" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "-0.01em", color: "var(--foreground)" }}>Trending Searches</span>
          </div>
          <div className="divide-y" style={{ "--tw-divide-opacity": 1 } as any}>
            {trendingSearches.map((s, i) => (
              <button
                key={s}
                onClick={() => go(s)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all"
                onMouseEnter={e => e.currentTarget.style.background = "var(--glass-hover)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                style={{ borderBottom: "1px solid var(--glass-border)" }}
              >
                <span
                  className="mono flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{ width: 24, height: 24, fontSize: "10px", fontWeight: 800, background: i < 3 ? "var(--blue-dim)" : "var(--surface-2)", border: `1px solid ${i < 3 ? "var(--blue-border)" : "var(--glass-border)"}`, color: i < 3 ? "var(--blue)" : "var(--muted-foreground)" }}
                >
                  {i + 1}
                </span>
                <span style={{ fontSize: "13px", color: "var(--foreground)", flex: 1 }}>{s}</span>
                {i < 3 && <div className="rounded-full" style={{ width: 6, height: 6, background: "var(--blue)", boxShadow: "0 0 4px var(--blue)" }} />}
                <ArrowRight size={12} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
              </button>
            ))}
          </div>
        </div>

        {/* Recent */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "var(--surface-1)", border: "1px solid var(--glass-border)" }}
        >
          <div className="px-4 py-3.5 border-b flex items-center gap-2.5" style={{ borderColor: "var(--glass-border)", background: "var(--surface-2)" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "-0.01em", color: "var(--foreground)" }}>Recent Searches</span>
          </div>
          <div>
            {recentSearches.map((s, i) => (
              <button
                key={s.query}
                onClick={() => go(s.query)}
                className="w-full flex items-start gap-3 px-4 py-3 text-left transition-all"
                onMouseEnter={e => e.currentTarget.style.background = "var(--glass-hover)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                style={{ borderBottom: i < recentSearches.length - 1 ? "1px solid var(--glass-border)" : "none" }}
              >
                <Clock size={12} style={{ color: "var(--muted-foreground)", flexShrink: 0, marginTop: 2 }} />
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: "13px", color: "var(--foreground)" }}>{s.query}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span style={{ fontSize: "10px", color: "var(--muted-foreground)" }}>{s.results} results · {s.time}</span>
                    {s.filters.map(f => (
                      <span key={f} className="px-1.5 py-0.5 rounded" style={{ fontSize: "9px", background: "var(--surface-2)", border: "1px solid var(--glass-border)", color: "var(--muted-foreground)" }}>{f}</span>
                    ))}
                  </div>
                </div>
                <ArrowRight size={12} style={{ color: "var(--muted-foreground)", flexShrink: 0, marginTop: 2 }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
