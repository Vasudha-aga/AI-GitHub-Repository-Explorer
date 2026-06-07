import { useState } from "react";
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
import { mockRepos, buildInitialHistory, defaultUser, SearchHistoryGroup, UserProfile } from "./components/mockData";

/* MARKER-MAKE-KIT-INVOKED */

type Page =
  | "dashboard" | "search" | "results" | "details"
  | "recommendations" | "saved" | "history" | "profile" | "settings";

export default function App() {
  const [loggedIn, setLoggedIn]         = useState(false);
  const [currentPage, setCurrentPage]   = useState<Page>("dashboard");
  const [searchQuery, setSearchQuery]   = useState("");
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [repos, setRepos]               = useState<Repository[]>(mockRepos);
  const [user, setUser]                 = useState<UserProfile>(defaultUser);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryGroup[]>(buildInitialHistory);
  const [searchCount, setSearchCount]   = useState(247);
  const [theme, setTheme]               = useState<"dark" | "light">("dark");
  const [aiModel, setAiModel]           = useState("GPT-4o");

  const handleSave = (id: number) =>
    setRepos(p => p.map(r => r.id === id ? { ...r, saved: !r.saved } : r));

  const handleView = (repo: Repository) => {
    setSelectedRepo(repo);
    setCurrentPage("details");
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setCurrentPage("results");
    setSearchCount(c => c + 1);
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const todayLabel = `Today — ${now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;
    const newItem = { query: q, time: timeStr, results: Math.floor(Math.random() * 40) + 5, topStars: 0, filters: [] };
    setSearchHistory(prev => {
      if (prev.length > 0 && prev[0].date === todayLabel) {
        return [{ ...prev[0], items: [newItem, ...prev[0].items] }, ...prev.slice(1)];
      }
      return [{ date: todayLabel, items: [newItem] }, ...prev];
    });
  };

  const handleClearHistory = () => setSearchHistory([]);
  const nav = (page: string) => setCurrentPage(page as Page);
  const savedCount = repos.filter(r => r.saved).length;

  if (!loggedIn) {
    return (
      <div className={theme}>
        <LoginPage onLogin={() => setLoggedIn(true)} theme={theme} onThemeChange={setTheme} />
      </div>
    );
  }

  const isLight = theme === "light";

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage onNavigate={nav} onViewRepo={handleView} onSaveRepo={handleSave} repos={repos} user={user} searchCount={searchCount} theme={theme} />;
      case "search":
        return <SearchPage onSearch={handleSearch} />;
      case "results":
        return <SearchResultsPage query={searchQuery} repos={repos} onViewRepo={handleView} onSaveRepo={handleSave} onSearch={handleSearch} />;
      case "details":
        return selectedRepo
          ? <RepoDetailsPage repo={selectedRepo} onBack={() => setCurrentPage("results")} onSave={handleSave} />
          : <DashboardPage onNavigate={nav} onViewRepo={handleView} onSaveRepo={handleSave} repos={repos} user={user} searchCount={searchCount} theme={theme} />;
      case "recommendations":
        return <RecommendationsPage repos={repos} onViewRepo={handleView} onSaveRepo={handleSave} searchCount={searchCount} />;
      case "saved":
        return <SavedPage repos={repos} onViewRepo={handleView} onSaveRepo={handleSave} />;
      case "history":
        return <HistoryPage history={searchHistory} onSearch={handleSearch} onClearHistory={handleClearHistory} />;
      case "profile":
        return <ProfilePage repos={repos} user={user} onUpdateUser={setUser} searchCount={searchCount} />;
      case "settings":
        return <SettingsPage user={user} onUpdateUser={setUser} theme={theme} onThemeChange={setTheme} onLogout={() => setLoggedIn(false)} aiModel={aiModel} onAiModelChange={setAiModel} />;
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
      {/* Video background — dark uses HLS stream, light uses the new MP4 */}
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
        <Sidebar currentPage={currentPage} onNavigate={nav} savedCount={savedCount} user={user} theme={theme} onLogout={() => setLoggedIn(false)} />
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
