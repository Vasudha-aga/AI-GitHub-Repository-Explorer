import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Given basic repo metadata, asks Gemini to generate:
 * - summary
 * - difficulty (Beginner / Intermediate / Advanced)
 * - required_skills []
 * - learning_outcomes []
 * - career_relevance
 * - ai_score (0-100)
 * - tech_stack { label, value }[]
 *
 * Returns parsed JSON object. Throws on failure.
 */
export async function analyzeRepo({ name, owner, description, language, stars, forks, topics, openIssues }) {
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

  const result   = await model.generateContent(prompt);
  const raw      = result.response.text();

  // Strip any accidental markdown fences
  const cleaned  = raw.replace(/```json|```/g, "").trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`Gemini returned invalid JSON: ${cleaned.slice(0, 200)}`);
  }

  return parsed;
}

/**
 * Generate personalised recommendations for a user based on their
 * search history and saved repos. Returns an array of search queries
 * and a short explanation for each.
 */
export async function generateRecommendations({ savedRepos, searchHistory, userProfile }) {
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

  const result  = await model.generateContent(prompt);
  const raw     = result.response.text();
  const cleaned = raw.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    return [];
  }
}
