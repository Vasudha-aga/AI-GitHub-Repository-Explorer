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
  streak_count?: number;
  tech_stack?: string[];
}
