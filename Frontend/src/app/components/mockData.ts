import { Repository } from "./RepoCard";

export const mockRepos: Repository[] = [
  {
    id: 1,
    name: "pytorch",
    owner: "pytorch",
    fullName: "pytorch/pytorch",
    description: "Tensors and Dynamic neural networks in Python with strong GPU acceleration. The defacto research deep-learning framework.",
    language: "Python",
    stars: 81200,
    forks: 21800,
    watchers: 2100,
    updatedAt: "2h ago",
    difficulty: "Advanced",
    skills: ["Deep Learning", "Python", "C++", "CUDA", "Neural Networks", "Computer Vision"],
    aiSummary: "PyTorch is the dominant framework for research-grade deep learning. Excellent for CV, NLP, and RL experiments. Steep curve but industry-standard for ML engineers targeting top labs.",
    topics: ["machine-learning", "deep-learning", "neural-network", "python", "cuda"],
    saved: false,
    license: "BSD-3-Clause",
    openIssues: 11840,
    aiScore: 94,
  },
  {
    id: 2,
    name: "fastapi",
    owner: "fastapi",
    fullName: "fastapi/fastapi",
    description: "FastAPI framework, high performance, easy to learn, fast to code, ready for production",
    language: "Python",
    stars: 75400,
    forks: 6300,
    watchers: 1230,
    updatedAt: "5h ago",
    difficulty: "Beginner",
    skills: ["Python", "REST API", "OpenAPI", "Async", "Pydantic", "Swagger"],
    aiSummary: "FastAPI is the go-to Python API framework in 2024–2025. Auto-generated Swagger docs, type safety via Pydantic, and async-first design make it ideal for production microservices.",
    topics: ["api", "rest", "python", "fastapi", "openapi"],
    saved: true,
    license: "MIT",
    openIssues: 612,
    aiScore: 97,
  },
  {
    id: 3,
    name: "next.js",
    owner: "vercel",
    fullName: "vercel/next.js",
    description: "The React Framework – created and maintained by @vercel. Full-stack web applications with Server Components.",
    language: "TypeScript",
    stars: 123000,
    forks: 26800,
    watchers: 3200,
    updatedAt: "1h ago",
    difficulty: "Intermediate",
    skills: ["React", "TypeScript", "Node.js", "SSR", "Web Dev", "Edge Runtime"],
    aiSummary: "Next.js is the production-grade React framework. App Router, Server Components, and Edge runtime make it essential for modern full-stack web development at any scale.",
    topics: ["react", "nextjs", "typescript", "ssr", "web"],
    saved: false,
    license: "MIT",
    openIssues: 2840,
    aiScore: 98,
  },
  {
    id: 4,
    name: "langchain",
    owner: "langchain-ai",
    fullName: "langchain-ai/langchain",
    description: "Build context-aware reasoning applications using LangChain. Connect LLMs to your data.",
    language: "Python",
    stars: 90100,
    forks: 14600,
    watchers: 1850,
    updatedAt: "30m ago",
    difficulty: "Intermediate",
    skills: ["LLM", "Python", "RAG", "Agents", "AI", "Embeddings"],
    aiSummary: "LangChain is the most comprehensive framework for building LLM-powered applications. Essential for RAG pipelines, AI agents, and complex language model orchestration workflows.",
    topics: ["llm", "ai", "python", "langchain", "rag", "agents"],
    saved: false,
    license: "MIT",
    openIssues: 1920,
    aiScore: 89,
  },
  {
    id: 5,
    name: "rust",
    owner: "rust-lang",
    fullName: "rust-lang/rust",
    description: "Empowering everyone to build reliable and efficient software. A systems programming language.",
    language: "Rust",
    stars: 96200,
    forks: 12400,
    watchers: 2800,
    updatedAt: "3h ago",
    difficulty: "Advanced",
    skills: ["Rust", "Systems Programming", "Memory Safety", "Concurrency", "Compiler"],
    aiSummary: "The Rust compiler itself — studying it teaches memory safety, lifetimes, and zero-cost abstractions. Best for systems programmers ready for a major paradigm shift.",
    topics: ["rust", "systems", "compiler", "low-level", "safety"],
    saved: false,
    license: "MIT/Apache-2.0",
    openIssues: 8920,
    aiScore: 86,
  },
  {
    id: 6,
    name: "scikit-learn",
    owner: "scikit-learn",
    fullName: "scikit-learn/scikit-learn",
    description: "scikit-learn: machine learning in Python. Simple and efficient tools for predictive data analysis.",
    language: "Python",
    stars: 59100,
    forks: 25400,
    watchers: 2100,
    updatedAt: "12h ago",
    difficulty: "Beginner",
    skills: ["Machine Learning", "Python", "Statistics", "Data Science", "NumPy", "Classification"],
    aiSummary: "The canonical Python ML library. Excellent entry point for classical ML — clean API, comprehensive docs, and solid implementations of every fundamental algorithm you'll ever need.",
    topics: ["machine-learning", "python", "sklearn", "data-science", "statistics"],
    saved: true,
    license: "BSD-3-Clause",
    openIssues: 1640,
    aiScore: 96,
  },
  {
    id: 7,
    name: "shadcn-ui",
    owner: "shadcn",
    fullName: "shadcn/ui",
    description: "Beautifully designed components built with Radix UI and Tailwind CSS. Copy-paste into your apps.",
    language: "TypeScript",
    stars: 71200,
    forks: 4800,
    watchers: 980,
    updatedAt: "6h ago",
    difficulty: "Intermediate",
    skills: ["React", "TypeScript", "Tailwind CSS", "Accessibility", "UI/UX", "Radix UI"],
    aiSummary: "A copy-paste component library pairing Radix UI accessibility primitives with Tailwind CSS. Perfect for shipping polished React UIs without design debt or complex dependencies.",
    topics: ["react", "ui", "tailwind", "components", "accessibility"],
    saved: false,
    license: "MIT",
    openIssues: 420,
    aiScore: 91,
  },
  {
    id: 8,
    name: "transformers",
    owner: "huggingface",
    fullName: "huggingface/transformers",
    description: "Transformers: State-of-the-art Machine Learning for JAX, PyTorch and TensorFlow",
    language: "Python",
    stars: 136000,
    forks: 27200,
    watchers: 3100,
    updatedAt: "45m ago",
    difficulty: "Intermediate",
    skills: ["NLP", "Python", "BERT", "GPT", "Transformers", "HuggingFace", "Fine-tuning"],
    aiSummary: "The central hub for pre-trained transformer models. Whether you need text classification, generation, or translation, Transformers has a pipeline for it with minimal boilerplate.",
    topics: ["nlp", "transformers", "bert", "gpt", "huggingface", "llm"],
    saved: false,
    license: "Apache-2.0",
    openIssues: 890,
    aiScore: 99,
  },
];

export const trendingSearches = [
  "LLM agent frameworks",
  "React 19 server components",
  "Rust async runtime",
  "Vector databases comparison",
  "AI code generation tools",
  "Edge computing patterns",
];

export const recentSearches = [
  { query: "fastapi python REST API",         time: "2 hours ago",  results: 24,  filters: ["Python"] },
  { query: "machine learning beginners",       time: "Yesterday",    results: 48,  filters: ["Python", "ML"] },
  { query: "TypeScript best practices 2025",   time: "2 days ago",   results: 31,  filters: ["TypeScript"] },
  { query: "kubernetes operators tutorial",    time: "3 days ago",   results: 18,  filters: [] },
];

export const filterChips = [
  "Python", "JavaScript", "TypeScript", "Machine Learning",
  "Data Science", "Web Development", "AI", "Rust", "Go", "LLM",
];

export interface SearchHistoryItem {
  query: string;
  time: string;
  results: number;
  topStars: number;
  filters: string[];
}

export interface SearchHistoryGroup {
  date: string;
  items: SearchHistoryItem[];
}

function dateLabel(d: Date) {
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function buildInitialHistory(): SearchHistoryGroup[] {
  const today = new Date();
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const d2 = new Date(today); d2.setDate(today.getDate() - 2);
  const d3 = new Date(today); d3.setDate(today.getDate() - 3);
  return [
    {
      date: `Today — ${dateLabel(today)}`,
      items: [
        { query: "fastapi python REST API",        time: "2:34 PM",  results: 24, topStars: 75400,  filters: ["Python"] },
        { query: "pytorch deep learning tutorial", time: "11:20 AM", results: 18, topStars: 81200,  filters: ["Python", "ML"] },
        { query: "react hooks best practices",     time: "9:05 AM",  results: 31, topStars: 0,      filters: ["TypeScript"] },
      ],
    },
    {
      date: `Yesterday — ${dateLabel(yesterday)}`,
      items: [
        { query: "machine learning beginners python", time: "4:45 PM",  results: 48, topStars: 59100, filters: ["Python"] },
        { query: "TypeScript generics advanced",      time: "2:12 PM",  results: 15, topStars: 0,     filters: ["TypeScript"] },
        { query: "kubernetes operators tutorial",     time: "10:30 AM", results: 22, topStars: 0,     filters: [] },
      ],
    },
    {
      date: dateLabel(d2),
      items: [
        { query: "LangChain RAG implementation", time: "3:22 PM", results: 19, topStars: 90100, filters: ["Python", "AI"] },
        { query: "vector database comparison",   time: "1:08 PM", results: 8,  topStars: 0,     filters: [] },
      ],
    },
    {
      date: dateLabel(d3),
      items: [
        { query: "Rust async programming tokio",    time: "5:00 PM",  results: 12, topStars: 96200,  filters: ["Rust"] },
        { query: "nextjs app router migration",     time: "11:45 AM", results: 27, topStars: 123000, filters: ["TypeScript"] },
        { query: "tailwindcss v4 breaking changes", time: "9:30 AM",  results: 9,  topStars: 0,      filters: [] },
      ],
    },
  ];
}

export interface UserProfile {
  name: string;
  username: string;
  initials: string;
  plan: string;
  bio: string;
  location: string;
  website: string;
  joinedDate: string;
  streakDays: number;
  aiInsightsCount: number;
  email?: string;
  avatar?: string;
}

export const defaultUser: UserProfile = {
  name: "Alex Kumar",
  username: "@alexkumar_dev",
  initials: "AK",
  plan: "Pro Plan",
  bio: "ML Engineer & Open Source enthusiast. Building AI-powered apps with Python and TypeScript. Always learning, always shipping. 🚀",
  location: "San Francisco, CA",
  website: "alexkumar.dev",
  joinedDate: "March 2024",
  streakDays: 14,
  aiInsightsCount: 89,
};
