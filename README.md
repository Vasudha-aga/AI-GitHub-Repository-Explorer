# RepoLens (AI GitHub Repository Explorer)
<!-- Placeholder -->

**RepoLens** is a modern, AI-powered GitHub repository explorer designed to help developers seamlessly discover, understand, and save open-source projects. By integrating the GitHub API with Google's Gemini AI, RepoLens analyzes repositories to provide clear, practical summaries, skill requirements, and learning outcomes in plain English—no matter what language the original repository is written in.

## 🚀 Key Features

- **🧠 AI-Powered Repository Analysis**: Automatically generate insights, difficulty levels, required skills, and practical learning outcomes for any GitHub repository using the Gemini API.
- **🔍 Advanced GitHub Search**: Explore the vast GitHub ecosystem with a fast, intuitive search interface.
- **📈 Trending & Top ML Repos**: Discover highly-rated Machine Learning repositories and globally trending projects right from your dashboard.
- **👤 Personalized "AI Picks For You"**: Get customized repository recommendations tailored to your "Favorite Technologies" saved in your profile.
- **💾 Save & Track**: Bookmark repositories for later, build a streak, and monitor your search history over time.
- **🎨 Beautiful, Responsive UI**: A premium user interface featuring dynamic micro-animations, glassmorphism, and responsive design, built with modern web aesthetics in mind.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js with Vite
- **Language**: TypeScript
- **Styling**: Vanilla CSS (CSS Modules / CSS Variables for theming)
- **Icons**: Lucide React
- **Charts**: Recharts

### Backend
- **Framework**: Node.js with Express
- **Database**: Supabase (PostgreSQL) or Local JSON Fallback
- **AI Integration**: Google Generative AI (Gemini 1.5 Flash)
- **External API**: GitHub REST API

## 📦 Local Setup & Installation

### Prerequisites
- Node.js (v16+)
- A GitHub Personal Access Token
- A Google Gemini API Key
- (Optional) A Supabase Project

### 1. Clone the repository
``bash
git clone https://github.com/your-username/AI-GitHub-Repository-Explorer.git
cd AI-GitHub-Repository-Explorer
``

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
``bash
cd Backend
npm install
``

Create a `.env` file in the `Backend` directory and add your keys:
```env
PORT=4000

# GitHub API (For searching and fetching repo details)
GITHUB_TOKEN=your_github_personal_access_token

# Google Gemini API (For AI analysis)
GEMINI_API_KEY=your_gemini_api_key

# Supabase (Optional - uses local db.json if left empty)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
```

*(Note: If using Supabase, run the \`supabase_migration.sql\` script in your Supabase SQL Editor to set up the tables).*

Start the backend server:
```bash
npm run dev
# OR: node --watch server.js
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd Frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```

Your application should now be running at **http://localhost:5173** (Frontend) and communicating with the API at **http://localhost:4000** (Backend).

## 🗄️ Database Schema (Supabase)

If using Supabase, the following primary tables are used:
- \`users\`: Stores user profile data, avatars, and their \`tech_stack\`.
- \`saved_repositories\`: Tracks which repositories users have bookmarked.
- \`search_history\`: Logs user search queries for history tracking.
- \`ai_analysis\`: Caches the Gemini AI results for specific repositories to prevent redundant API calls.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

