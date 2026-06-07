import { useState, useRef } from "react";
import { Search, Command, Sparkles, X, TrendingUp, Clock, Sun, Moon } from "lucide-react";
import { UserProfile } from "./mockData";

interface NavbarProps {
  onNavigate: (page: string) => void;
  onSearch?: (q: string) => void;
  user: UserProfile;
  theme: "dark" | "light";
  onThemeChange?: (t: "dark" | "light") => void;
  aiModel?: string;
}

const quickSuggestions = [
  { text: "pytorch deep learning", icon: TrendingUp, color: "var(--blue)" },
  { text: "fastapi REST API",       icon: TrendingUp, color: "var(--blue)" },
  { text: "langchain agents",       icon: TrendingUp, color: "var(--purple)" },
  { text: "react hooks patterns",   icon: Clock,      color: "var(--muted-foreground)" },
  { text: "rust async runtime",     icon: Clock,      color: "var(--muted-foreground)" },
];

export function Navbar({ onNavigate, onSearch, user, theme, onThemeChange, aiModel = "GPT-4o" }: NavbarProps) {
  const [searchVal, setSearchVal] = useState("");
  const [focused, setFocused]     = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isLight = theme === "light";

  const handleSearch = () => {
    if (searchVal.trim()) { onSearch?.(searchVal); setFocused(false); setSearchVal(""); }
  };

  const headerBg = isLight
    ? "rgba(245,245,250,0.9)"
    : "rgba(6,6,8,0.85)";

  return (
    <header
      className="flex items-center gap-4 px-6 flex-shrink-0 relative z-40"
      style={{
        height: 56,
        background: headerBg,
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--glass-border)",
      }}
    >
      {/* Search */}
      <div className="flex-1 max-w-lg relative">
        <div
          className="flex items-center gap-2 rounded-xl px-3.5 py-2 transition-all"
          style={{
            background: focused
              ? (isLight ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.05)")
              : (isLight ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.03)"),
            border: `1px solid ${focused ? "var(--blue-border)" : "var(--glass-border)"}`,
            boxShadow: focused ? "0 0 0 3px var(--blue-dim)" : "none",
          }}
        >
          <Search size={14} style={{ color: focused ? "var(--blue)" : "var(--muted-foreground)", flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            placeholder="Search repositories or ask AI…"
            className="flex-1 bg-transparent outline-none"
            style={{ color: "var(--foreground)", fontSize: "13px" }}
          />
          {searchVal && (
            <button onClick={() => setSearchVal("")} style={{ color: "var(--muted-foreground)" }}>
              <X size={13} />
            </button>
          )}
          {!searchVal && (
            <div
              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded mono"
              style={{ background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", fontSize: "9px", color: "var(--muted-foreground)", letterSpacing: "0.02em", flexShrink: 0 }}
            >
              <Command size={9} /> K
            </div>
          )}
        </div>

        {focused && (
          <div
            className="absolute top-full mt-2 left-0 right-0 rounded-xl overflow-hidden z-50"
            style={{ background: "var(--surface-1)", border: "1px solid var(--glass-border)", boxShadow: isLight ? "0 20px 60px rgba(0,0,0,0.12)" : "0 20px 60px rgba(0,0,0,0.7)" }}
          >
            <div className="px-3 pt-3 pb-1">
              <p className="mono" style={{ fontSize: "9px", color: "var(--muted-foreground)", letterSpacing: "0.1em" }}>QUICK SEARCHES</p>
            </div>
            {quickSuggestions.map(s => {
              const Icon = s.icon;
              return (
                <button
                  key={s.text}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all"
                  onMouseDown={() => { setSearchVal(s.text); onSearch?.(s.text); }}
                  style={{ color: "var(--foreground)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--glass-hover)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <Icon size={13} style={{ color: s.color, flexShrink: 0 }} />
                  <span style={{ fontSize: "13px" }}>{s.text}</span>
                </button>
              );
            })}
            <div className="px-3 py-2.5 border-t" style={{ borderColor: "var(--glass-border)" }}>
              <p style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>
                Press <kbd style={{ padding: "1px 5px", borderRadius: 4, background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)", border: "1px solid var(--glass-border)", fontFamily: "monospace", fontSize: "10px" }}>Enter</kbd> to search with AI
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Theme toggle */}
        <button
          onClick={() => onThemeChange?.(isLight ? "dark" : "light")}
          className="flex items-center justify-center rounded-lg transition-all"
          style={{ width: 32, height: 32, background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", color: "var(--muted-foreground)" }}
          title={isLight ? "Switch to dark mode" : "Switch to light mode"}
          onMouseEnter={e => e.currentTarget.style.color = "var(--foreground)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--muted-foreground)"}
        >
          {isLight ? <Moon size={13} /> : <Sun size={13} />}
        </button>

        <div
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
          style={{ background: "var(--purple-dim)", border: "1px solid var(--purple-border)" }}
        >
          <Sparkles size={11} style={{ color: "var(--purple)" }} />
          <span className="mono" style={{ fontSize: "9px", color: "var(--purple)", fontWeight: 600, letterSpacing: "0.08em" }}>{aiModel}</span>
        </div>

        {/* Avatar */}
        <button
          onClick={() => onNavigate("profile")}
          className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 transition-all"
          style={{ border: "1px solid transparent" }}
          onMouseEnter={e => { e.currentTarget.style.background = isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "var(--glass-border)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}
        >
          <div
            className="flex items-center justify-center rounded-full flex-shrink-0"
            style={{ width: 30, height: 30, background: "var(--gradient-brand)", fontSize: "11px", fontWeight: 800, color: "white", boxShadow: "0 0 12px var(--blue-glow)" }}
          >
            {user.initials}
          </div>
          <div className="hidden sm:block text-left">
            <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--foreground)", lineHeight: 1.2 }}>{user.name}</p>
            <p style={{ fontSize: "10px", color: "var(--muted-foreground)", lineHeight: 1.2 }}>{user.username}</p>
          </div>
        </button>
      </div>
    </header>
  );
}
