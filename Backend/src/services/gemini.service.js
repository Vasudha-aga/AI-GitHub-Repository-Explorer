import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiConfigured = !!process.env.GEMINI_API_KEY &&
  process.env.GEMINI_API_KEY !== "your-gemini-api-key-here";

let model = null;
if (geminiConfigured) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
} else {
  console.log("⚠️  Gemini API key not configured — using mock AI analysis");
}

// ── Mock generators ─────────────────────────────────────────────────────────

function mockAnalyzeRepo({ name, owner, description, language, stars, forks, topics, openIssues }) {
  const difficulty = stars > 50000 ? "Advanced" : stars > 10000 ? "Intermediate" : "Beginner";
  const score = Math.min(99, Math.max(60, Math.round(70 + (stars / 10000) * 3 + (forks / 5000) * 2)));

  return {
    summary: `${owner}/${name} is a ${difficulty.toLowerCase()}-level ${language || "multi-language"} project. ${description || "A popular open-source repository."} With ${stars.toLocaleString()} stars and an active contributor community, it's an excellent resource for developers looking to deepen their expertise.`,
    difficulty,
    required_skills: [
      language || "Programming",
      "Git & Version Control",
      "Code Review",
      "Testing",
      "Documentation",
    ],
    learning_outcomes: [
      `Understand the architecture of a large-scale ${language || "software"} project`,
      "Learn industry best practices for code organization and testing",
      "Gain experience with open-source contribution workflows",
      "Build proficiency in reading and navigating complex codebases",
      "Develop skills in collaborative development and code review",
    ],
    career_relevance: `Experience with ${owner}/${name} is valued by companies building ${language || "software"} applications. Relevant for software engineering, DevOps, and technical leadership roles.`,
    ai_score: score,
    tech_stack: [
      { label: "Core Language", value: language || "Multi-language" },
      { label: "Build System", value: language === "Python" ? "setuptools / pip" : language === "TypeScript" ? "npm / webpack" : "Make / CMake" },
      { label: "Testing", value: language === "Python" ? "pytest" : language === "TypeScript" ? "Jest / Vitest" : "Built-in testing" },
      { label: "CI/CD", value: "GitHub Actions" },
      { label: "Documentation", value: topics?.includes("docs") ? "Extensive docs" : "README + Wiki" },
      { label: "Package Manager", value: language === "Python" ? "pip / conda" : language === "TypeScript" ? "npm / yarn" : "Language default" },
    ],
    estimated_time: difficulty === "Beginner" ? "2-4 weeks" : difficulty === "Intermediate" ? "1-3 months" : "3-6 months",
  };
}

function mockGenerateRecommendations({ savedRepos, searchHistory }) {
  const savedNames = savedRepos.map(r => r.repo_name).slice(0, 5);
  const recentQueries = searchHistory.map(h => h.search_query).slice(0, 5);

  const baseRecs = [
    { query: "React state management 2025",    reason: "Popular topic that complements web development skills." },
    { query: "Python FastAPI microservices",     reason: "Build on your Python interest with modern API patterns." },
    { query: "LLM agent frameworks",             reason: "AI agents are the hottest area in software engineering right now." },
    { query: "Rust async programming tokio",     reason: "High-performance systems programming is increasingly in demand." },
    { query: "vector database comparison",       reason: "Essential infrastructure for AI-powered search applications." },
  ];

  // Personalise if there's history
  if (recentQueries.length > 0) {
    baseRecs[0] = { query: `${recentQueries[0]} advanced patterns`, reason: `Deepen your recent exploration of "${recentQueries[0]}".` };
  }
  if (savedNames.length > 0) {
    baseRecs[1] = { query: `alternatives to ${savedNames[0]}`, reason: `Discover projects similar to your saved repo "${savedNames[0]}".` };
  }

  return baseRecs;
}

// ── Real + fallback exports ─────────────────────────────────────────────────

/**
 * Given basic repo metadata, asks Gemini to generate:
 * - summary, difficulty, required_skills[], learning_outcomes[],
 *   career_relevance, ai_score, tech_stack[], estimated_time
 */
export async function analyzeRepo(repoInfo) {
  if (!geminiConfigured) {
    // Simulate a small delay for realistic UX
    await new Promise(r => setTimeout(r, 800));
    return mockAnalyzeRepo(repoInfo);
  }

  const { name, owner, description, language, stars, forks, topics, openIssues } = repoInfo;

  const prompt = `
You are an expert developer who evaluates open-source GitHub repositories for developers wanting to learn from them.

Analyze the following repository and respond ONLY with a valid JSON object. Do not include markdown, code fences, or any other text.

Repository:
- Full name: ${owner}/${name}
- Description: ${description || "No description provided"}
- Primary language: ${language}
- Stars: ${stars}
- Forks: ${forks}
- Open issues: ${openIssues}
- Topics: ${topics?.join(", ") || "none"}

Respond with this exact JSON structure:
{
  "summary": "2-3 sentence practical summary of what this repo does and why a developer should explore it",
  "difficulty": "Beginner" or "Intermediate" or "Advanced",
  "required_skills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "learning_outcomes": [
    "What you will learn outcome 1",
    "What you will learn outcome 2",
    "What you will learn outcome 3",
    "What you will learn outcome 4",
    "What you will learn outcome 5"
  ],
  "career_relevance": "1-2 sentences on career value and which job roles benefit most",
  "ai_score": number between 60 and 100,
  "tech_stack": [
    { "label": "Core Language", "value": "..." },
    { "label": "Build System", "value": "..." },
    { "label": "Testing", "value": "..." },
    { "label": "CI/CD", "value": "..." },
    { "label": "Documentation", "value": "..." },
    { "label": "Package Manager", "value": "..." }
  ],
  "estimated_time": "e.g. 2-4 weeks or 3-6 months"
}
`.trim();

  try {
    const result  = await model.generateContent(prompt);
    const raw     = result.response.text();
    const cleaned = raw.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      throw new Error(`Gemini returned invalid JSON: ${cleaned.slice(0, 200)}`);
    }

    return parsed;
  } catch (err) {
    console.error("Gemini API call failed:", err.message);
    console.log("Falling back to mock AI analysis...");
    return mockAnalyzeRepo(repoInfo);
  }
}

/**
 * Generate personalised recommendations for a user based on their
 * search history and saved repos.
 */
export async function generateRecommendations({ savedRepos, searchHistory, userProfile }) {
  if (!geminiConfigured) {
    await new Promise(r => setTimeout(r, 500));
    return mockGenerateRecommendations({ savedRepos, searchHistory });
  }

  const savedNames    = savedRepos.map(r => r.repo_name).slice(0, 10).join(", ");
  const recentQueries = searchHistory.map(h => h.search_query).slice(0, 10).join(", ");

  const prompt = `
You are a developer career coach. Based on this developer's activity, recommend 5 GitHub repository search queries they should explore next.

User profile:
- Saved repos: ${savedNames || "none yet"}
- Recent searches: ${recentQueries || "none yet"}

Respond ONLY with a valid JSON array (no markdown, no extra text):
[
  { "query": "search query here", "reason": "one sentence why this matches their interests" },
  ...
]
`.trim();

  try {
    const result  = await model.generateContent(prompt);
    const raw     = result.response.text();
    const cleaned = raw.replace(/```json|```/g, "").trim();

    try {
      return JSON.parse(cleaned);
    } catch {
      return baseRecs;
    }
  } catch (err) {
    console.error("Gemini API call failed:", err.message);
    console.log("Falling back to mock recommendations...");
    return mockGenerateRecommendations({ savedRepos, searchHistory });
  }
}
