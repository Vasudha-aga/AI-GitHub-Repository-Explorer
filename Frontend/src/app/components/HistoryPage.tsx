import { Search, Clock, ArrowRight, Trash2, Star } from "lucide-react";
import { SearchHistoryGroup } from "./mockData";

interface HistoryPageProps {
  history: SearchHistoryGroup[];
  onSearch: (q: string) => void;
  onClearHistory: () => void;
}

function fmtStars(n: number) {
  if (!n) return null;
  return n >= 1000 ? `${(n / 1000).toFixed(0)}k` : String(n);
}

export function HistoryPage({ history, onSearch, onClearHistory }: HistoryPageProps) {
  const totalItems = history.reduce((a, g) => a + g.items.length, 0);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--foreground)" }}>Search History</h1>
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)", marginTop: 2 }}>{totalItems} searches recorded</p>
          </div>
        </div>
        {totalItems > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all"
            style={{ background: "rgba(240,76,93,0.06)", border: "1px solid rgba(240,76,93,0.2)", color: "var(--red)", fontSize: "12px" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(240,76,93,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(240,76,93,0.06)"}
          >
            <Trash2 size={13} />
            Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="flex items-center justify-center rounded-2xl mb-4" style={{ width: 56, height: 56, background: "var(--surface-2)", border: "1px solid var(--glass-border)" }}>
            <History size={24} style={{ color: "var(--muted-foreground)" }} />
          </div>
          <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--foreground)", marginBottom: 6 }}>No search history</p>
          <p style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>Your searches will appear here as you explore repositories.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {history.map((group) => (
            <div key={group.date}>
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="mono px-2.5 py-1 rounded-lg"
                  style={{ fontSize: "10px", color: "var(--muted-foreground)", background: "var(--surface-2)", border: "1px solid var(--glass-border)", letterSpacing: "0.04em", whiteSpace: "nowrap", flexShrink: 0 }}
                >
                  {group.date}
                </span>
                <div className="flex-1 h-px" style={{ background: "var(--glass-border)" }} />
                <span style={{ fontSize: "10px", color: "var(--muted-foreground)", flexShrink: 0 }}>{group.items.length} searches</span>
              </div>

              <div className="relative pl-8">
                <div className="absolute left-2.5 top-2 bottom-2 w-px" style={{ background: "linear-gradient(to bottom, rgba(109,104,245,0.4), rgba(109,104,245,0.05))" }} />
                <div className="space-y-3">
                  {group.items.map((item, ii) => {
                    const stars = fmtStars(item.topStars);
                    return (
                      <div
                        key={ii}
                        className="relative flex items-start gap-4 p-4 rounded-2xl transition-all group"
                        style={{ background: "var(--surface-1)", border: "1px solid var(--glass-border)" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(109,104,245,0.25)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--glass-border)"; e.currentTarget.style.boxShadow = "none"; }}
                      >
                        <div className="absolute -left-[23px] top-5 rounded-full border-2" style={{ width: 10, height: 10, background: "var(--purple)", borderColor: "var(--background)", boxShadow: "0 0 6px var(--purple)" }} />
                        <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 34, height: 34, background: "var(--purple-dim)", border: "1px solid var(--purple-border)" }}>
                          <Search size={14} style={{ color: "var(--purple)" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)", lineHeight: 1.3 }}>{item.query}</p>
                          <div className="flex items-center flex-wrap gap-3 mt-1.5">
                            <div className="flex items-center gap-1">
                              <Clock size={10} style={{ color: "var(--muted-foreground)" }} />
                              <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{item.time}</span>
                            </div>
                            <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{item.results} results</span>
                            {stars && (
                              <div className="flex items-center gap-1">
                                <Star size={10} style={{ color: "var(--amber)" }} />
                                <span style={{ fontSize: "11px", color: "var(--amber)" }}>Top: {stars}★</span>
                              </div>
                            )}
                            {item.filters.map(f => (
                              <span key={f} className="px-2 py-0.5 rounded-md" style={{ fontSize: "9px", background: "var(--blue-dim)", border: "1px solid var(--blue-border)", color: "var(--blue)" }}>
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => onSearch(item.query)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                          style={{ background: "var(--blue-dim)", border: "1px solid var(--blue-border)", color: "var(--blue)", fontSize: "11px", fontWeight: 600, whiteSpace: "nowrap" }}
                        >
                          Re-search <ArrowRight size={10} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
