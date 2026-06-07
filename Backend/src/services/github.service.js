import axios from "axios";

const gh = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  },
});

// ── Search repositories ─────────────────────────────────────────────────────
export async function searchRepos(query, { language, sort = "stars", perPage = 12, page = 1 } = {}) {
  let q = query;
  if (language) q += ` language:${language}`;

  const { data } = await gh.get("/search/repositories", {
    params: { q, sort, order: "desc", per_page: perPage, page },
  });

  return {
    total: data.total_count,
    repos: data.items.map(normalizeRepo),
  };
}

// ── Get single repo ─────────────────────────────────────────────────────────
export async function getRepo(owner, name) {
  const { data } = await gh.get(`/repos/${owner}/${name}`);
  return normalizeRepo(data);
}

// ── Get repo contributors ───────────────────────────────────────────────────
export async function getContributors(owner, name, perPage = 5) {
  const { data } = await gh.get(`/repos/${owner}/${name}/contributors`, {
    params: { per_page: perPage },
  });
  return data.map(c => ({
    login:      c.login,
    avatar_url: c.avatar_url,
    commits:    c.contributions,
    html_url:   c.html_url,
  }));
}

// ── Get repo languages breakdown ────────────────────────────────────────────
export async function getLanguages(owner, name) {
  const { data } = await gh.get(`/repos/${owner}/${name}/languages`);
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  return Object.entries(data).map(([lang, bytes]) => ({
    name: lang,
    pct:  Math.round((bytes / total) * 100),
  }));
}

// ── Get GitHub user profile from OAuth token ─────────────────────────────────
export async function getGithubUser(accessToken) {
  const { data } = await axios.get("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return {
    github_id:  String(data.id),
    username:   data.login,
    name:       data.name || data.login,
    email:      data.email,
    avatar_url: data.avatar_url,
    bio:        data.bio,
    location:   data.location,
    website:    data.blog,
    github_url: data.html_url,
  };
}

// ── Normalise GitHub repo object into our Repository shape ──────────────────
function normalizeRepo(r) {
  return {
    id:          r.id,
    name:        r.name,
    owner:       r.owner.login,
    fullName:    r.full_name,
    description: r.description || "",
    language:    r.language || "Unknown",
    stars:       r.stargazers_count,
    forks:       r.forks_count,
    watchers:    r.watchers_count,
    openIssues:  r.open_issues_count,
    license:     r.license?.spdx_id || r.license?.name || "No license",
    topics:      r.topics || [],
    updatedAt:   timeAgo(r.updated_at),
    htmlUrl:     r.html_url,
    // These will be filled by Gemini later
    difficulty:  null,
    skills:      [],
    aiSummary:   null,
    aiScore:     null,
    saved:       false,
  };
}

function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins  = Math.floor(diff / 60000);
  if (mins < 60)   return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs  < 24)   return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
