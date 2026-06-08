import { useState } from "react";
import { User, Bell, Palette, Zap, Check, AlertTriangle, Edit2, Moon, Sun } from "lucide-react";
import { UserProfile } from "../types";

interface SettingsPageProps {
  user: UserProfile;
  onUpdateUser: (u: UserProfile) => void;
  theme: "dark" | "light";
  onThemeChange: (t: "dark" | "light") => void;
  onLogout?: () => void;
  aiModel?: string;
  onAiModelChange?: (model: string) => void;
}

interface ToggleProps { on: boolean; onChange: () => void; color?: string; }
function Toggle({ on, onChange, color = "var(--blue)" }: ToggleProps) {
  return (
    <button
      onClick={onChange}
      className="relative rounded-full flex-shrink-0 transition-all"
      style={{ width: 40, height: 22, background: on ? color : "var(--surface-3)", boxShadow: on ? `0 0 10px ${color}` : "none", border: `1px solid ${on ? "transparent" : "var(--glass-border)"}` }}
    >
      <div className="absolute top-0.5 rounded-full transition-all" style={{ width: 16, height: 16, background: "white", left: on ? 21 : 2, boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
    </button>
  );
}


export function SettingsPage({ user, onUpdateUser, theme, onThemeChange, onLogout, aiModel = "GPT-4o", onAiModelChange }: SettingsPageProps) {
  const isLight = theme === "light";

  const [toggles, setToggles] = useState<Record<string, boolean>>({
    "Weekly AI Digest": true,
    "Personalized Picks": true,
    "Trending Repositories": false,
  });

  const [selects, setSelects] = useState<Record<string, string>>({
    "AI Model": aiModel,
    "Default Language Filter": "All Languages",
    "Default Difficulty": "All Levels",
    "Results Per Page": "12",
    "Accent Color": "Electric Blue",
  });

  const [editing, setEditing] = useState<string | null>(null);
  const [editVal, setEditVal]  = useState("");
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const toggle = (label: string) => setToggles(p => ({ ...p, [label]: !p[label] }));
  const setSelect = (label: string, val: string) => {
    setSelects(p => ({ ...p, [label]: val }));
    if (label === "AI Model") onAiModelChange?.(val);
  };

  const startEdit = (label: string, current: string) => { setEditing(label); setEditVal(current); };
  const commitEdit = (label: string) => {
    const map: Record<string, keyof UserProfile> = {
      "Display Name": "name", "Username": "username", "Bio": "bio",
    };
    if (map[label]) onUpdateUser({ ...user, [map[label]]: editVal });
    setEditing(null);
  };


  const exportData = () => {
    const blob = new Blob([JSON.stringify({ user, exportedAt: new Date().toISOString() }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "repolens-export.json";
    a.click(); URL.revokeObjectURL(url);
  };

  const sectionHeader = (_Icon: any, label: string, _color: string) => (
    <div className="flex items-center gap-3 px-5 py-3.5 border-b" style={{ borderColor: "var(--glass-border)", background: isLight ? "rgba(0,0,0,0.015)" : "rgba(255,255,255,0.02)" }}>
      <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)", letterSpacing: "-0.01em" }}>{label}</span>
    </div>
  );

  const rowStyle = (isLast: boolean) => ({
    borderBottom: isLast ? "none" : `1px solid ${isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.04)"}`,
  });

  const inputStyle = {
    background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)",
    border: "1px solid var(--blue-border)",
    color: "var(--foreground)",
    fontSize: "12px",
    minWidth: 160,
  };

  const accountFields = [
    { label: "Display Name", value: user.name },
    { label: "Email Address", value: "alex@example.com" },
    { label: "Username",      value: user.username },
    { label: "Bio",           value: user.bio },
  ];

  const notifFields = [
    { label: "Weekly AI Digest",      sub: "Trending repos in your stack" },
    { label: "Personalized Picks",    sub: "New AI recommendations for you" },
    { label: "Trending Repositories", sub: "When a repo in your topics goes viral" },
  ];

  const aiFields = [
    { label: "AI Model",               value: selects["AI Model"],               options: ["gemini-1.5-flash"] },
    { label: "Default Language Filter", value: selects["Default Language Filter"], options: ["All Languages", "Python", "TypeScript", "Rust"] },
    { label: "Default Difficulty",      value: selects["Default Difficulty"],      options: ["All Levels", "Beginner", "Intermediate", "Advanced"] },
    { label: "Results Per Page",        value: selects["Results Per Page"],        options: ["6", "12", "24", "48"] },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--foreground)" }}>Settings</h1>
        <p style={{ fontSize: "13px", color: "var(--muted-foreground)", marginTop: 2 }}>Manage your account and preferences</p>
      </div>

      <div className="space-y-4">

        {/* ── Account ── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface-1)", border: "1px solid var(--glass-border)" }}>
          {sectionHeader(User, "Account", "var(--blue)")}
          {accountFields.map((field, fi) => (
            <div key={field.label} className="flex items-center gap-4 px-5 py-3.5" style={rowStyle(fi === accountFields.length - 1)}>
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: "13px", color: "var(--foreground)" }}>{field.label}</p>
              </div>
              {editing === field.label ? (
                <div className="flex items-center gap-2">
                  <input
                    value={editVal}
                    onChange={e => setEditVal(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") commitEdit(field.label); if (e.key === "Escape") setEditing(null); }}
                    autoFocus
                    className="px-2 py-1 rounded-lg outline-none"
                    style={inputStyle}
                  />
                  <button onClick={() => commitEdit(field.label)} className="p-1.5 rounded-lg" style={{ background: "rgba(18,194,123,0.15)", border: "1px solid rgba(18,194,123,0.3)", color: "var(--green)" }}>
                    <Check size={11} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: "12px", color: "var(--muted-foreground)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{field.value}</span>
                  <button onClick={() => startEdit(field.label, field.value)} className="flex items-center gap-1 px-2.5 py-1 rounded-lg" style={{ background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)", border: "1px solid var(--glass-border)", color: "var(--muted-foreground)", fontSize: "11px" }}>
                    <Edit2 size={10} /> Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── AI Preferences ── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface-1)", border: "1px solid var(--glass-border)" }}>
          {sectionHeader(Zap, "AI Preferences", "var(--purple)")}
          {aiFields.map((field, fi) => (
            <div key={field.label} className="flex items-center gap-4 px-5 py-3.5" style={rowStyle(fi === aiFields.length - 1)}>
              <p className="flex-1" style={{ fontSize: "13px", color: "var(--foreground)" }}>{field.label}</p>
              <select
                value={selects[field.label]}
                onChange={e => setSelect(field.label, e.target.value)}
                className="px-3 py-1.5 rounded-xl mono"
                style={{ background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)", border: "1px solid var(--glass-border)", color: "var(--foreground)", fontSize: "12px", outline: "none" }}
              >
                {field.options.map(opt => (
                  <option key={opt} value={opt} style={{ background: isLight ? "#fff" : "var(--surface-1)" }}>{opt}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* ── Notifications ── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface-1)", border: "1px solid var(--glass-border)" }}>
          {sectionHeader(Bell, "Notifications", "var(--amber)")}
          {notifFields.map((field, fi) => (
            <div key={field.label} className="flex items-center gap-4 px-5 py-3.5" style={rowStyle(fi === notifFields.length - 1)}>
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: "13px", color: "var(--foreground)" }}>{field.label}</p>
                <p style={{ fontSize: "11px", color: "var(--muted-foreground)", marginTop: 1 }}>{field.sub}</p>
              </div>
              <Toggle on={toggles[field.label] ?? false} onChange={() => toggle(field.label)} color="var(--amber)" />
            </div>
          ))}
        </div>

        {/* ── Appearance ── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface-1)", border: "1px solid var(--glass-border)" }}>
          {sectionHeader(Palette, "Appearance", "var(--cyan)")}

          {/* Theme toggle */}
          <div className="flex items-center gap-4 px-5 py-3.5" style={rowStyle(false)}>
            <div className="flex-1">
              <p style={{ fontSize: "13px", color: "var(--foreground)" }}>Theme</p>
              <p style={{ fontSize: "11px", color: "var(--muted-foreground)", marginTop: 1 }}>Switch between dark and light interface</p>
            </div>
            <div className="flex items-center gap-2 p-1 rounded-xl" style={{ background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)", border: "1px solid var(--glass-border)" }}>
              <button
                onClick={() => onThemeChange("dark")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
                style={{ background: !isLight ? "var(--blue-dim)" : "transparent", border: !isLight ? "1px solid var(--blue-border)" : "1px solid transparent", color: !isLight ? "var(--blue)" : "var(--muted-foreground)", fontSize: "12px", fontWeight: !isLight ? 600 : 400 }}
              >
                <Moon size={12} /> Dark
              </button>
              <button
                onClick={() => onThemeChange("light")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
                style={{ background: isLight ? "var(--blue-dim)" : "transparent", border: isLight ? "1px solid var(--blue-border)" : "1px solid transparent", color: isLight ? "var(--blue)" : "var(--muted-foreground)", fontSize: "12px", fontWeight: isLight ? 600 : 400 }}
              >
                <Sun size={12} /> Light
              </button>
            </div>
          </div>

          {/* Accent color */}
          <div className="flex items-center gap-4 px-5 py-3.5" style={rowStyle(true)}>
            <p className="flex-1" style={{ fontSize: "13px", color: "var(--foreground)" }}>Accent Color</p>
            <select
              value={selects["Accent Color"]}
              onChange={e => setSelect("Accent Color", e.target.value)}
              className="px-3 py-1.5 rounded-xl mono"
              style={{ background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)", border: "1px solid var(--glass-border)", color: "var(--foreground)", fontSize: "12px", outline: "none" }}
            >
              {["Electric Blue", "Purple", "Cyan", "Green"].map(opt => (
                <option key={opt} value={opt} style={{ background: isLight ? "#fff" : "var(--surface-1)" }}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Danger zone ── */}
        <div className="rounded-2xl p-5" style={{ background: "rgba(240,76,93,0.04)", border: "1px solid rgba(240,76,93,0.2)" }}>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={14} style={{ color: "var(--red)" }} />
            <h3 style={{ fontSize: "13px", fontWeight: 600, color: "var(--red)", letterSpacing: "-0.01em" }}>Danger Zone</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--foreground)" }}>Export Data</p>
                <p style={{ fontSize: "11px", color: "var(--muted-foreground)", marginTop: 1 }}>Download your data as JSON</p>
              </div>
              <button
                onClick={exportData}
                className="px-4 py-2 rounded-xl transition-all flex-shrink-0 hover:opacity-80"
                style={{ background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)", border: "1px solid rgba(240,76,93,0.3)", color: "var(--muted-foreground)", fontSize: "12px" }}
              >
                Export
              </button>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--foreground)" }}>Delete Account</p>
                <p style={{ fontSize: "11px", color: "var(--muted-foreground)", marginTop: 1 }}>Permanently remove your account and all data</p>
              </div>
              {showDeleteConfirm ? (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>Are you sure?</span>
                  <button onClick={() => setShowDeleteConfirm(false)} className="px-3 py-1.5 rounded-xl" style={{ background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)", border: "1px solid var(--glass-border)", color: "var(--muted-foreground)", fontSize: "11px" }}>Cancel</button>
                  <button onClick={onLogout} className="px-3 py-1.5 rounded-xl" style={{ background: "rgba(240,76,93,0.15)", border: "1px solid rgba(240,76,93,0.4)", color: "var(--red)", fontSize: "11px", fontWeight: 600 }}>Confirm</button>
                </div>
              ) : (
                <button onClick={() => setShowDeleteConfirm(true)} className="px-4 py-2 rounded-xl transition-all flex-shrink-0" style={{ background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)", border: "1px solid rgba(240,76,93,0.3)", color: "var(--red)", fontSize: "12px" }}>
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
