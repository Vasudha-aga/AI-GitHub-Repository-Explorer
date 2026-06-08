import { useState } from "react";
import {
  LayoutDashboard, Search, BookmarkCheck, History,
  User, Settings, Sparkles, Zap, ChevronRight, LogOut
} from "lucide-react";
import { RepoLensLogo } from "./RepoLensLogo";
import { UserProfile } from "../types";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  savedCount: number;
  user: UserProfile;
  theme: "dark" | "light";
  onLogout: () => void;
}

const NAV_BASE = [
  { id: "dashboard",       label: "Dashboard",    icon: LayoutDashboard },
  { id: "search",          label: "Search Repos", icon: Search },
  { id: "recommendations", label: "AI Picks",     icon: Sparkles },
  { id: "saved",           label: "Saved",        icon: BookmarkCheck },
  { id: "history",         label: "History",      icon: History },
];

const BOTTOM = [
  { id: "profile",  label: "Profile",  icon: User },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({ currentPage, onNavigate, savedCount, user, theme, onLogout }: SidebarProps) {
  const isLight = theme === "light";
  const [collapsed, setCollapsed] = useState(false);
  const w = collapsed ? 64 : 228;

  const NAV = NAV_BASE.map(item => ({
    ...item,
    badge: item.id === "saved"
      ? (savedCount > 0 ? String(savedCount) : null)
      : item.id === "recommendations"
        ? "New"
        : null,
  }));

  return (
    <aside
      className="relative flex flex-col h-full select-none"
      style={{
        width: w, minWidth: w,
        background: "var(--sidebar)",
        borderRight: "1px solid var(--sidebar-border)",
        transition: "width .25s cubic-bezier(.4,0,.2,1), min-width .25s cubic-bezier(.4,0,.2,1)",
        zIndex: 30,
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 border-b overflow-hidden"
        style={{ borderColor: "var(--sidebar-border)", height: 56, flexShrink: 0 }}
      >
        <div
          className="flex items-center justify-center rounded-lg flex-shrink-0"
          style={{ width: 32, height: 32, background: isLight ? "rgba(255,255,255,0.85)" : "rgba(8,8,14,0.8)", border: `1px solid rgba(${isLight ? "46,110,220" : "79,142,247"},0.28)`, boxShadow: "0 0 16px var(--blue-glow)" }}
        >
          <RepoLensLogo size={20} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden whitespace-nowrap">
            <span className="gradient-text" style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.04em" }}>RepoLens</span>
            <div
              className="inline-flex items-center gap-1 ml-2 px-1.5 py-0.5 rounded"
              style={{ background: "var(--blue-dim)", border: "1px solid var(--blue-border)", verticalAlign: "middle" }}
            >
              <Zap size={8} style={{ color: "var(--blue)" }} />
              <span className="mono" style={{ fontSize: "8px", color: "var(--blue)", fontWeight: 700, letterSpacing: "0.08em" }}>AI</span>
            </div>
          </div>
        )}
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-hidden">
        {!collapsed && (
          <p className="mono px-3 mb-2" style={{ fontSize: "9px", color: "var(--muted-foreground)", letterSpacing: "0.12em", opacity: 0.7 }}>NAVIGATION</p>
        )}
        {NAV.map(({ id, label, icon: Icon, badge }) => {
          const active = currentPage === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              title={collapsed ? label : undefined}
              className="w-full flex items-center rounded-lg transition-all group relative"
              style={{
                gap: collapsed ? 0 : 10,
                padding: collapsed ? "9px 0" : "9px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                background: active ? "linear-gradient(90deg, rgba(79,142,247,0.14), rgba(109,104,245,0.08))" : "transparent",
                color: active ? "var(--blue)" : "var(--sidebar-foreground)",
                border: active ? "1px solid rgba(79,142,247,0.18)" : "1px solid transparent",
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = "var(--sidebar-accent)"; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full" style={{ width: 3, height: 18, background: "var(--blue)", boxShadow: "0 0 6px var(--blue)" }} />
              )}
              <Icon size={15} style={{ flexShrink: 0, strokeWidth: active ? 2.2 : 1.8 }} />
              {!collapsed && (
                <>
                  <span style={{ fontSize: "13px", fontWeight: active ? 600 : 400, flex: 1, textAlign: "left" }}>{label}</span>
                  {badge && (
                    <span
                      className="flex items-center justify-center rounded-full"
                      style={{
                        minWidth: 18, height: 18, padding: "0 5px",
                        background: badge === "New" ? "var(--purple-dim)" : "rgba(255,255,255,0.06)",
                        border: `1px solid ${badge === "New" ? "var(--purple-border)" : "var(--glass-border)"}`,
                        fontSize: "9px", fontWeight: 700,
                        color: badge === "New" ? "var(--purple)" : "var(--muted-foreground)",
                        fontFamily: "inherit",
                      }}
                    >
                      {badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-3 h-px" style={{ background: "var(--sidebar-border)" }} />

      {/* Bottom items */}
      <div className="px-2 py-3 space-y-0.5">
        {BOTTOM.map(({ id, label, icon: Icon }) => {
          const active = currentPage === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              title={collapsed ? label : undefined}
              className="w-full flex items-center rounded-lg transition-all"
              style={{
                gap: collapsed ? 0 : 10,
                padding: collapsed ? "9px 0" : "9px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                background: active ? "linear-gradient(90deg, rgba(79,142,247,0.14), rgba(109,104,245,0.08))" : "transparent",
                color: active ? "var(--blue)" : "var(--sidebar-foreground)",
                border: active ? "1px solid rgba(79,142,247,0.18)" : "1px solid transparent",
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = "var(--sidebar-accent)"; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <Icon size={15} style={{ flexShrink: 0 }} />
              {!collapsed && <span style={{ fontSize: "13px", fontWeight: active ? 600 : 400, flex: 1, textAlign: "left" }}>{label}</span>}
            </button>
          );
        })}
        <button
          title={collapsed ? "Sign out" : undefined}
          onClick={onLogout}
          className="w-full flex items-center rounded-lg transition-all"
          style={{ gap: collapsed ? 0 : 10, padding: collapsed ? "9px 0" : "9px 12px", justifyContent: collapsed ? "center" : "flex-start", color: "var(--muted-foreground)", border: "1px solid transparent" }}
          onMouseEnter={e => { e.currentTarget.style.color = "var(--red)"; e.currentTarget.style.background = "rgba(240,76,93,0.06)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "var(--muted-foreground)"; e.currentTarget.style.background = "transparent"; }}
        >
          <LogOut size={15} style={{ flexShrink: 0 }} />
          {!collapsed && <span style={{ fontSize: "13px" }}>Sign out</span>}
        </button>
      </div>


      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-14 flex items-center justify-center rounded-full z-10 transition-all hover:scale-110"
        style={{ width: 20, height: 20, background: "var(--surface-2)", border: "1px solid var(--glass-border)", color: "var(--muted-foreground)", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
      >
        <ChevronRight size={10} style={{ transform: collapsed ? "none" : "rotate(180deg)", transition: "transform .25s" }} />
      </button>
    </aside>
  );
}
