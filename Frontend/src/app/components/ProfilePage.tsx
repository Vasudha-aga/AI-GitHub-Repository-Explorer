import { useState } from "react";
import { GitBranch, Calendar, MapPin, Link2, Edit3, Check, X, Camera, Plus } from "lucide-react";
import { Repository } from "./RepoCard";
import { UserProfile } from "./mockData";
import { BarChart, Bar, XAxis, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface ProfilePageProps {
  repos: Repository[];
  user: UserProfile;
  onUpdateUser: (u: UserProfile) => void;
  searchCount: number;
}

const AVATARS = [
  { id: "m1", emoji: "👨🏻‍💻", label: "Dev M1" },
  { id: "m2", emoji: "👨🏽‍💻", label: "Dev M2" },
  { id: "m3", emoji: "👨🏿‍💻", label: "Dev M3" },
  { id: "m4", emoji: "🧑🏻‍🚀", label: "Astronaut" },
  { id: "m5", emoji: "🧑🏽‍🔬", label: "Scientist" },
  { id: "m6", emoji: "🧑🏿‍🎨", label: "Artist" },
  { id: "m7", emoji: "🦸🏻‍♂️", label: "Hero M" },
  { id: "m8", emoji: "🧙🏽‍♂️", label: "Wizard" },
  { id: "f1", emoji: "👩🏻‍💻", label: "Dev F1" },
  { id: "f2", emoji: "👩🏽‍💻", label: "Dev F2" },
  { id: "f3", emoji: "👩🏿‍💻", label: "Dev F3" },
  { id: "f4", emoji: "👩🏻‍🚀", label: "Astronaut F" },
  { id: "f5", emoji: "👩🏽‍🔬", label: "Scientist F" },
  { id: "f6", emoji: "👩🏿‍🎨", label: "Artist F" },
  { id: "f7", emoji: "🦸🏻‍♀️", label: "Hero F" },
  { id: "f8", emoji: "🧙🏽‍♀️", label: "Wizard F" },
];

const DEFAULT_TECH = ["Python", "TypeScript", "Machine Learning", "React", "FastAPI", "PyTorch", "RAG", "LLMs"];

const ALL_TECH_OPTIONS = [
  "Python", "TypeScript", "JavaScript", "Rust", "Go", "Java", "C++", "C#", "Swift", "Kotlin",
  "React", "Vue", "Angular", "Next.js", "Svelte", "Node.js", "FastAPI", "Django", "Flask", "Spring Boot",
  "Machine Learning", "Deep Learning", "LLMs", "RAG", "NLP", "Computer Vision", "PyTorch", "TensorFlow",
  "scikit-learn", "HuggingFace", "LangChain", "OpenAI API",
  "Docker", "Kubernetes", "AWS", "GCP", "Azure", "Terraform", "CI/CD",
  "PostgreSQL", "MongoDB", "Redis", "GraphQL", "REST API", "gRPC",
  "WebAssembly", "Rust async", "Tokio", "Edge Computing",
];

const WEEKLY = [
  { day: "Mon", count: 5 }, { day: "Tue", count: 9 }, { day: "Wed", count: 3 },
  { day: "Thu", count: 11 }, { day: "Fri", count: 14 }, { day: "Sat", count: 7 }, { day: "Sun", count: 6 },
];

const LANG_DIST = [
  { name: "Python",     value: 52, color: "#3572A5" },
  { name: "TypeScript", value: 28, color: "#2b7489" },
  { name: "Rust",       value: 12, color: "#dea584" },
  { name: "Go",         value: 8,  color: "#00ADD8" },
];

const AI_INSIGHTS = [
  "Strong affinity for Python-based ML frameworks — 72% of searches",
  "Search pattern suggests focus on production ML deployment",
  "Preferred repos have exceptional documentation (avg. 89/100)",
  "Consider exploring Go for high-performance backend services",
  "You're 2 repos away from completing the ML Engineer path",
  "Your saves are 3× more AI-focused than average Pro user",
];

export function ProfilePage({ repos, user, onUpdateUser, searchCount }: ProfilePageProps) {
  const [editing, setEditing]         = useState(false);
  const [draft, setDraft]             = useState<UserProfile>(user);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [techStack, setTechStack]     = useState<string[]>(DEFAULT_TECH);
  const [draftTech, setDraftTech]     = useState<string[]>(DEFAULT_TECH);
  const [newTech, setNewTech]         = useState("");

  const saved = repos.filter(r => r.saved);
  const weekTotal = WEEKLY.reduce((a, b) => a + b.count, 0);

  const saveEdits = () => {
    onUpdateUser(draft);
    setTechStack(draftTech);
    setEditing(false);
    setShowAvatarPicker(false);
  };
  const cancelEdits = () => {
    setDraft(user);
    setDraftTech(techStack);
    setEditing(false);
    setShowAvatarPicker(false);
  };

  const toggleTech = (t: string) =>
    setDraftTech(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);

  const addCustomTech = () => {
    const val = newTech.trim();
    if (val && !draftTech.includes(val)) setDraftTech(p => [...p, val]);
    setNewTech("");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      {/* Profile hero */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface-1)", border: "1px solid var(--glass-border)", boxShadow: "0 8px 40px rgba(0,0,0,0.4)" }}>
        {/* Banner */}
        <div className="h-36 relative" style={{ background: "linear-gradient(135deg, rgba(79,142,247,0.25) 0%, rgba(109,104,245,0.2) 40%, rgba(155,110,245,0.15) 70%, rgba(79,142,247,0.1) 100%)" }}>
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(79,142,247,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(109,104,245,0.25) 0%, transparent 50%)" }} />
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          {editing ? (
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button onClick={saveEdits} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: "rgba(18,194,123,0.25)", border: "1px solid rgba(18,194,123,0.4)", color: "var(--green)", fontSize: "12px", backdropFilter: "blur(8px)" }}>
                <Check size={11} /> Save
              </button>
              <button onClick={cancelEdits} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", fontSize: "12px", backdropFilter: "blur(8px)" }}>
                <X size={11} /> Cancel
              </button>
            </div>
          ) : (
            <button onClick={() => { setDraft(user); setEditing(true); }} className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.85)", fontSize: "12px", backdropFilter: "blur(8px)" }}>
              <Edit3 size={11} /> Edit Profile
            </button>
          )}
        </div>

        <div className="px-6 pb-6">
          {/* Avatar row — avatar straddles the banner bottom, name sits below */}
          <div className="flex items-end gap-5" style={{ marginTop: -44, paddingTop: 0 }}>
            <div className="relative flex-shrink-0" style={{ marginBottom: 0 }}>
              <div
                className="flex items-center justify-center rounded-2xl border-4"
                style={{ width: 88, height: 88, background: (editing ? draft.avatar : user.avatar) ? "var(--surface-2)" : "var(--gradient-brand)", borderColor: "var(--surface-1)", fontSize: (editing ? draft.avatar : user.avatar) ? "42px" : "26px", fontWeight: 800, color: "white", boxShadow: "0 0 32px var(--blue-glow)", lineHeight: 1 }}
              >
                {(editing ? draft.avatar : user.avatar) || user.initials}
              </div>
              {editing && (
                <button
                  onClick={() => setShowAvatarPicker(p => !p)}
                  className="absolute -bottom-1 -right-1 flex items-center justify-center rounded-full"
                  style={{ width: 26, height: 26, background: "var(--blue)", border: "2px solid var(--surface-1)", color: "white", boxShadow: "0 2px 8px var(--blue-glow)" }}
                >
                  <Camera size={11} />
                </button>
              )}
            </div>
            {/* Spacer so name doesn't float up into banner */}
            <div style={{ height: 44 }} />
          </div>

          {/* Name + username — always below the banner, never overlapping */}
          <div className="mt-3 mb-5">
            {editing ? (
              <input
                value={draft.name}
                onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                className="rounded-lg px-2 py-1 outline-none mb-1"
                style={{ background: "var(--surface-2)", border: "1px solid var(--blue-border)", color: "var(--foreground)", fontSize: "20px", fontWeight: 800, letterSpacing: "-0.04em", width: 220, display: "block" }}
              />
            ) : (
              <h1 style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--foreground)", marginBottom: 2 }}>{user.name}</h1>
            )}
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>{user.username}</p>
          </div>

          {/* Avatar picker */}
          {showAvatarPicker && editing && (
            <div className="mb-5 p-4 rounded-2xl" style={{ background: "var(--surface-2)", border: "1px solid var(--glass-border)" }}>
              <p className="mono mb-3" style={{ fontSize: "9px", color: "var(--muted-foreground)", letterSpacing: "0.1em" }}>CHOOSE YOUR AVATAR</p>
              <div className="grid grid-cols-8 gap-2">
                {/* Default initials option */}
                <button
                  onClick={() => { setDraft(d => ({ ...d, avatar: undefined })); }}
                  className="flex items-center justify-center rounded-xl transition-all hover:scale-110"
                  style={{ height: 44, background: draft.avatar === undefined ? "var(--blue-dim)" : "var(--surface-1)", border: `1px solid ${draft.avatar === undefined ? "var(--blue-border)" : "var(--glass-border)"}`, fontSize: "11px", fontWeight: 800, color: "var(--blue)" }}
                  title="Default initials"
                >
                  {user.initials}
                </button>
                {AVATARS.map(av => (
                  <button
                    key={av.id}
                    onClick={() => setDraft(d => ({ ...d, avatar: av.emoji }))}
                    className="flex items-center justify-center rounded-xl transition-all hover:scale-110"
                    style={{ height: 44, fontSize: "22px", background: draft.avatar === av.emoji ? "var(--blue-dim)" : "var(--surface-1)", border: `1px solid ${draft.avatar === av.emoji ? "var(--blue-border)" : "var(--glass-border)"}` }}
                    title={av.label}
                  >
                    {av.emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {editing ? (
            <textarea
              value={draft.bio}
              onChange={e => setDraft(d => ({ ...d, bio: e.target.value }))}
              rows={2}
              className="w-full rounded-xl px-3 py-2 outline-none resize-none mb-3"
              style={{ background: "var(--surface-2)", border: "1px solid var(--blue-border)", color: "var(--muted-foreground)", fontSize: "13px", lineHeight: 1.7, maxWidth: 560 }}
            />
          ) : (
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)", lineHeight: 1.7, marginBottom: 14, maxWidth: 560 }}>{user.bio}</p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 mb-5">
            {editing ? (
              <>
                <div className="flex items-center gap-1.5">
                  <MapPin size={12} style={{ color: "var(--muted-foreground)" }} />
                  <input value={draft.location} onChange={e => setDraft(d => ({ ...d, location: e.target.value }))} className="bg-transparent outline-none border-b" style={{ borderColor: "var(--blue-border)", color: "var(--muted-foreground)", fontSize: "12px", width: 160 }} />
                </div>
                <div className="flex items-center gap-1.5">
                  <Link2 size={12} style={{ color: "var(--muted-foreground)" }} />
                  <input value={draft.website} onChange={e => setDraft(d => ({ ...d, website: e.target.value }))} className="bg-transparent outline-none border-b" style={{ borderColor: "var(--blue-border)", color: "var(--muted-foreground)", fontSize: "12px", width: 140 }} />
                </div>
              </>
            ) : (
              <>
                {[
                  { icon: MapPin,    text: user.location },
                  { icon: Link2,     text: user.website },
                  { icon: Calendar,  text: `Joined ${user.joinedDate}` },
                  { icon: GitBranch, text: `${searchCount} searches` },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5">
                    <Icon size={12} style={{ color: "var(--muted-foreground)" }} />
                    <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>{text}</span>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Favorite Technologies */}
          <div>
            <p className="mono mb-2" style={{ fontSize: "9px", color: "var(--muted-foreground)", letterSpacing: "0.1em" }}>FAVORITE TECHNOLOGIES</p>
            {editing ? (
              <div>
                {/* Selected chips */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {draftTech.map(tech => (
                    <button
                      key={tech}
                      onClick={() => toggleTech(tech)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all"
                      style={{ fontSize: "12px", background: "var(--blue-dim)", border: "1px solid var(--blue-border)", color: "var(--blue)" }}
                    >
                      {tech}
                      <X size={9} style={{ opacity: 0.7 }} />
                    </button>
                  ))}
                </div>
                {/* Preset options */}
                <p style={{ fontSize: "11px", color: "var(--muted-foreground)", marginBottom: 8 }}>Click to add from presets:</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {ALL_TECH_OPTIONS.filter(t => !draftTech.includes(t)).map(tech => (
                    <button
                      key={tech}
                      onClick={() => toggleTech(tech)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all hover:opacity-80"
                      style={{ fontSize: "11px", background: "var(--surface-2)", border: "1px solid var(--glass-border)", color: "var(--muted-foreground)" }}
                    >
                      <Plus size={9} />{tech}
                    </button>
                  ))}
                </div>
                {/* Custom input */}
                <div className="flex items-center gap-2">
                  <input
                    value={newTech}
                    onChange={e => setNewTech(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") addCustomTech(); }}
                    placeholder="Add custom technology…"
                    className="flex-1 px-3 py-1.5 rounded-xl outline-none"
                    style={{ background: "var(--surface-2)", border: "1px solid var(--glass-border)", color: "var(--foreground)", fontSize: "12px" }}
                  />
                  <button
                    onClick={addCustomTech}
                    className="px-3 py-1.5 rounded-xl"
                    style={{ background: "var(--blue-dim)", border: "1px solid var(--blue-border)", color: "var(--blue)", fontSize: "12px" }}
                  >
                    Add
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {techStack.length === 0 ? (
                  <p style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>No technologies added yet. Edit your profile to add some.</p>
                ) : techStack.map(tech => (
                  <span key={tech} className="px-2.5 py-1 rounded-lg" style={{ fontSize: "12px", background: "var(--blue-dim)", border: "1px solid var(--blue-border)", color: "var(--blue)" }}>{tech}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Searches", value: String(searchCount),     color: "var(--blue)",   sub: "↑ 12 this week" },
          { label: "Saved Repos",    value: String(saved.length),    color: "var(--amber)",  sub: "All active" },
          { label: "Day Streak",     value: String(user.streakDays), color: "var(--red)",    sub: "Personal best" },
        ].map(({ label, value, color, sub }) => (
          <div key={label} className="rounded-2xl p-5 text-center" style={{ background: "var(--surface-1)", border: "1px solid var(--glass-border)" }}>
            <p style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.04em", color }}>{value}</p>
            <p style={{ fontSize: "11px", color: "var(--muted-foreground)", marginTop: 3, lineHeight: 1.3 }}>{label}</p>
            <p style={{ fontSize: "10px", color: "var(--muted-foreground)", marginTop: 2, opacity: 0.7 }}>{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Weekly activity */}
        <div className="rounded-2xl p-5" style={{ background: "var(--surface-1)", border: "1px solid var(--glass-border)" }}>
          <p style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 4, color: "var(--foreground)" }}>Weekly Search Activity</p>
          <p style={{ fontSize: "11px", color: "var(--muted-foreground)", marginBottom: 12 }}>{weekTotal} searches this week</p>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={WEEKLY} barSize={22}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--surface-2)", border: "1px solid var(--glass-border)", borderRadius: 10, fontSize: 11 }} itemStyle={{ color: "var(--foreground)" }} />
              <Bar dataKey="count" radius={[5, 5, 0, 0]} name="Searches">
                {WEEKLY.map((_, i) => (
                  <Cell key={i} fill={i === 4 ? "var(--blue)" : "rgba(79,142,247,0.25)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Language dist */}
        <div className="rounded-2xl p-5" style={{ background: "var(--surface-1)", border: "1px solid var(--glass-border)" }}>
          <p style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 4, color: "var(--foreground)" }}>Language Distribution</p>
          <p style={{ fontSize: "11px", color: "var(--muted-foreground)", marginBottom: 8 }}>Based on saved & searched repos</p>
          <div className="space-y-3">
            {LANG_DIST.map(l => (
              <div key={l.name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full" style={{ width: 8, height: 8, background: l.color, boxShadow: `0 0 4px ${l.color}` }} />
                    <span style={{ fontSize: "12px", color: "var(--foreground)" }}>{l.name}</span>
                  </div>
                  <span className="mono" style={{ fontSize: "10px", color: "var(--muted-foreground)" }}>{l.value}%</span>
                </div>
                <div className="rounded-full overflow-hidden" style={{ height: 4, background: "var(--surface-2)" }}>
                  <div className="h-full rounded-full" style={{ width: `${l.value}%`, background: l.color, boxShadow: `0 0 6px ${l.color}` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI insights */}
      <div className="rounded-2xl p-5" style={{ background: "var(--gradient-section), linear-gradient(145deg, rgba(79,142,247,0.07), rgba(109,104,245,0.05))", border: "1px solid rgba(79,142,247,0.14)" }}>
        <div className="flex items-center gap-2.5 mb-4">
          <h3 style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "-0.01em", color: "var(--foreground)" }}>AI Learning Profile</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {AI_INSIGHTS.map((insight, i) => (
            <div key={i} className="flex items-start gap-2.5 p-3.5 rounded-xl" style={{ background: "var(--surface-2)", border: "1px solid var(--glass-border)" }}>
              <div className="mono flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 20, height: 20, marginTop: 1, background: "var(--purple-dim)", border: "1px solid var(--purple-border)", fontSize: "9px", fontWeight: 800, color: "var(--purple)" }}>
                {i + 1}
              </div>
              <p style={{ fontSize: "12px", color: "var(--muted-foreground)", lineHeight: 1.6 }}>{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
