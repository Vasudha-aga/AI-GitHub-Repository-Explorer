import { useState, useEffect, useRef } from "react";
import { LoginPage } from "./components/LoginPage";
import { Sidebar } from "./components/Sidebar";
import { Navbar } from "./components/Navbar";
import { DashboardPage } from "./components/DashboardPage";
import { SearchPage } from "./components/SearchPage";
import { SearchResultsPage } from "./components/SearchResultsPage";
import { RepoDetailsPage } from "./components/RepoDetailsPage";
import { RecommendationsPage } from "./components/RecommendationsPage";
import { SavedPage } from "./components/SavedPage";
import { HistoryPage } from "./components/HistoryPage";
import { ProfilePage } from "./components/ProfilePage";
import { SettingsPage } from "./components/SettingsPage";
import { VideoBackground } from "./components/VideoBackground";
import { Repository } from "./components/RepoCard";
import { UserProfile, SearchHistoryGroup, SearchHistoryItem } from "./types";
import api from "../services/api";

type Page =
  | "dashboard" | "search" | "results" | "details"
  | "recommendations" | "saved" | "history" | "profile" | "settings";

function mapApiUser(dbUser: any): UserProfile {
  const name = dbUser.name || "Developer";
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "D";

  const joined = dbUser.created_at
    ? new Date(dbUser.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "June 2026";

  return {
    name,
    username: dbUser.username ? `@${dbUser.username.replace(/^@/, "")}` : "@developer",
    initials,
    plan: "Pro Plan",
    bio: dbUser.bio || "Building modern software. Explorer of repositories.",
    location: dbUser.location || "Earth",
    website: dbUser.website || "",
    joinedDate: joined,
    streakDays: 14,
    aiInsightsCount: 89,
    email: dbUser.email,
    avatar: dbUser.avatar_url || undefined,
  };
}

function groupHistory(items: any[]): SearchHistoryGroup[] {
  const groups: Record<string, SearchHistoryItem[]> = {};

  if (!items || !Array.isArray(items)) return [];

  items.forEach(h => {
    const dateObj = new Date(h.searched_at);
    const dateLabel = dateObj.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);

    let finalLabel = dateLabel;
    if (dateObj.toDateString() === today.toDateString()) {
      finalLabel = `Today — ${dateLabel}`;
    } else if (dateObj.toDateString() === yesterday.toDateString()) {
      finalLabel = `Yesterday — ${dateLabel}`;
    }

    if (!groups[finalLabel]) groups[finalLabel] = [];

    const timeStr = dateObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

    groups[finalLabel].push({
      query: h.search_query,
      time: timeStr,
      results: 12,
      topStars: 0,
      filters: []
    });
  });

  return Object.entries(groups).map(([date, items]) => ({ date, items }));
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [savedRepos, setSavedRepos] = useState<Repository[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryGroup[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
  const [searchCount, setSearchCount] = useState(0);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("repolens_theme") as "dark" | "light") || "dark";
  });
  const [aiModel, setAiModel] = useState("gemini-1.5-flash");

  useEffect(() => {
    localStorage.setItem("repolens_theme", theme);
    document.documentElement.style.colorScheme = theme;
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
  }, [theme]);

  const isSyncing = useRef(false);

  // Initial load logic
  useEffect(() => {
    // 1. Check URL hash for OAuth redirect token
    const hash = window.location.hash;
    if (hash && hash.includes("access_token")) {
      isSyncing.current = true;
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (accessToken) {
        localStorage.setItem("access_token", accessToken);
        if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
        window.history.replaceState(null, "", window.location.pathname);
        syncSession(accessToken, refreshToken || "");
        return;
      }
    }

    // 2. Otherwise load existing session (skip if we are currently syncing)
    if (!isSyncing.current && localStorage.getItem("access_token")) {
      loadProfileAndData();
    }
  }, []);

  const syncSession = async (accessToken: string, refreshToken: string) => {
    try {
      const res = await api.post("/api/auth/session", { access_token: accessToken, refresh_token: refreshToken });
      setUser(mapApiUser(res.data.user));
      setLoggedIn(true);
      loadDashboardData();
    } catch (err) {
      console.error("Session sync failed:", err);
      localStorage.removeItem("access_token");
    }
  };

  const loadProfileAndData = async () => {
    try {
      const res = await api.get("/api/auth/me");
      setUser(mapApiUser(res.data.user));
      setLoggedIn(true);
      loadDashboardData();
    } catch (err) {
      console.error("Token verification failed, logging out", err);
      localStorage.removeItem("access_token");
      setLoggedIn(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      // Load saved repos
      const savedRes = await api.get("/api/repos/saved");
      setSavedRepos(savedRes.data.repos || []);

      // Load search history
      const historyRes = await api.get("/api/repos/history");
      const grouped = groupHistory(historyRes.data.history || []);
      setSearchHistory(grouped);
      setSearchCount((historyRes.data.history || []).length);

      // Run a default trending query so dashboard has cards
      const trendingRes = await api.get("/api/repos/search", { params: { q: "stars:>10000", log: false } });
      setRepos(trendingRes.data.repos || []);

      // Load trending queries
      api.get("/api/repos/trending").then(res => setTrendingSearches(res.data.trending || [])).catch(() => { });
    } catch (e) {
      console.error("Failed to load dashboard data:", e);
    }
  };

  // Re-load saved repos and history whenever logged in status changes or pages change
  useEffect(() => {
    if (loggedIn) {
      api.get("/api/repos/saved").then(res => setSavedRepos(res.data.repos || [])).catch(() => { });
      api.get("/api/repos/history").then(res => {
        setSearchHistory(groupHistory(res.data.history || []));
        setSearchCount((res.data.history || []).length);
      }).catch(() => { });
    }
  }, [loggedIn, currentPage]);

  const handleSave = async (id: number) => {
    const allMatching = [...repos, ...savedRepos];
    const repo = allMatching.find(r => r.id === id);
    if (!repo) return;

    const isCurrentlySaved = savedRepos.some(r => r.id === id);

    try {
      if (isCurrentlySaved) {
        await api.delete(`/api/repos/save/${id}`);
      } else {
        await api.post("/api/repos/save", {
          repo_id: repo.id,
          repo_name: repo.fullName || repo.name,
          repo_url: repo.htmlUrl,
          repo_data: repo
        });
      }

      // Refresh saved repos
      const savedRes = await api.get("/api/repos/saved");
      const updatedSaved = savedRes.data.repos;
      setSavedRepos(updatedSaved);

      // Toggle saved flag in current search results
      setRepos(prev => prev.map(r => r.id === id ? { ...r, saved: !isCurrentlySaved } : r));

      // Update selected repo if open
      if (selectedRepo?.id === id) {
        setSelectedRepo(prev => prev ? { ...prev, saved: !isCurrentlySaved } : null);
      }
    } catch (err) {
      console.error("Save toggle failed:", err);
    }
  };

  const handleView = async (repo: Repository) => {
    setSelectedRepo(repo);
    setCurrentPage("details");

    try {
      const res = await api.get(`/api/repos/${repo.owner}/${repo.name}`);
      let fullRepo = { ...repo, ...res.data };
      setSelectedRepo(fullRepo);

      if (!fullRepo.analysis && !fullRepo.aiSummary) {
        const aiRes = await api.post("/api/ai/analyze", {
          repo_id: fullRepo.id,
          name: fullRepo.name,
          owner: fullRepo.owner,
          description: fullRepo.description,
          language: fullRepo.language,
          stars: fullRepo.stars,
          forks: fullRepo.forks,
          topics: fullRepo.topics,
          openIssues: fullRepo.openIssues
        });
        
        if (aiRes.data?.analysis) {
          fullRepo.analysis = aiRes.data.analysis;
        }
      }

      if (fullRepo.analysis) {
        fullRepo = {
          ...fullRepo,
          difficulty: fullRepo.analysis.difficulty,
          skills: fullRepo.analysis.required_skills || fullRepo.analysis.skills || [],
          aiSummary: fullRepo.analysis.summary,
          aiScore: fullRepo.analysis.ai_score
        };
        setSelectedRepo(fullRepo);
        setRepos(prev => prev.map(r => r.id === repo.id ? fullRepo : r));
      }
    } catch (err) {
      console.error("Failed to load repo details:", err);
    }
  };

  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    setCurrentPage("results");
    try {
      const res = await api.get("/api/repos/search", { params: { q } });
      setRepos(res.data.repos);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const handleClearHistory = async () => {
    try {
      await api.delete("/api/repos/history");
      setSearchHistory([]);
      setSearchCount(0);
    } catch (err) {
      console.error("Failed to clear history:", err);
    }
  };

  const handleUpdateUser = async (updated: UserProfile) => {
    try {
      const res = await api.patch("/api/auth/me", {
        name: updated.name,
        username: updated.username.replace(/^@/, ""),
        bio: updated.bio,
        location: updated.location,
        website: updated.website,
        avatar: updated.avatar
      });
      setUser(mapApiUser(res.data.user));
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch { }
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setLoggedIn(false);
    setCurrentPage("dashboard");
  };

  const nav = (page: string) => setCurrentPage(page as Page);
  const savedCount = savedRepos.length;

  if (!loggedIn || !user) {
    return (
      <div className={theme}>
        <LoginPage onLogin={loadProfileAndData} theme={theme} onThemeChange={setTheme} />
      </div>
    );
  }

  const isLight = theme === "light";

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage onNavigate={nav} onViewRepo={handleView} onSaveRepo={handleSave} repos={repos} user={user} searchCount={searchCount} savedCount={savedCount} savedRepos={savedRepos} searchHistory={searchHistory} theme={theme} />;
      case "search":
        const recentSearchesFlat = searchHistory.flatMap(g => g.items).slice(0, 10);
        return <SearchPage onSearch={handleSearch} recentSearches={recentSearchesFlat} trendingSearches={trendingSearches} />;
      case "results":
        return <SearchResultsPage query={searchQuery} repos={repos} onViewRepo={handleView} onSaveRepo={handleSave} onSearch={handleSearch} />;
      case "details":
        return selectedRepo
          ? <RepoDetailsPage repo={selectedRepo} onBack={() => setCurrentPage("results")} onSave={handleSave} />
          : <DashboardPage onNavigate={nav} onViewRepo={handleView} onSaveRepo={handleSave} repos={repos} user={user} searchCount={searchCount} savedCount={savedCount} savedRepos={savedRepos} searchHistory={searchHistory} theme={theme} />;
      case "recommendations":
        return <RecommendationsPage repos={repos} onViewRepo={handleView} onSaveRepo={handleSave} searchCount={searchCount} />;
      case "saved":
        return <SavedPage repos={savedRepos} onViewRepo={handleView} onSaveRepo={handleSave} />;
      case "history":
        return <HistoryPage history={searchHistory} onSearch={handleSearch} onClearHistory={handleClearHistory} />;
      case "profile":
        return <ProfilePage repos={savedRepos} user={user} onUpdateUser={handleUpdateUser} searchCount={searchCount} searchHistory={searchHistory} />;
      case "settings":
        return <SettingsPage user={user} onUpdateUser={handleUpdateUser} theme={theme} onThemeChange={setTheme} onLogout={handleLogout} aiModel={aiModel} onAiModelChange={setAiModel} />;
      default:
        return <DashboardPage onNavigate={nav} onViewRepo={handleView} onSaveRepo={handleSave} repos={repos} user={user} searchCount={searchCount} theme={theme} />;
    }
  };

  return (
    <div
      className={theme}
      style={{
        background: "var(--background)",
        height: "100vh",
        overflow: "hidden",
        colorScheme: isLight ? "light" : "dark",
      }}
    >
      <VideoBackground
        theme={theme}
        overlayOpacity={isLight ? 0.82 : 0.88}
        overlayGradient={
          isLight
            ? "radial-gradient(ellipse 80% 60% at 60% 20%, rgba(46,110,220,0.05) 0%, transparent 60%)"
            : "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(79,142,247,0.07) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 20% 80%, rgba(109,104,245,0.06) 0%, transparent 50%)"
        }
        blur={isLight ? 18 : 24}
      />

      <div className="relative flex h-full z-10">
        <Sidebar currentPage={currentPage} onNavigate={nav} savedCount={savedCount} user={user} theme={theme} onLogout={handleLogout} />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Navbar onNavigate={nav} onSearch={handleSearch} user={user} theme={theme} onThemeChange={setTheme} aiModel={aiModel} />
          <main className="flex-1 overflow-y-auto">
            {renderPage()}
          </main>
        </div>
      </div>
    </div>
  );
}
