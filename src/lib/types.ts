export interface Post {
  id: string;
  category: 'kritik-saran' | 'curhat' | 'ide-opini';
  title?: string;
  content: string;
  author: string;
  isAnonymous: boolean;
  target?: string; // untuk kritik-saran
  timestamp: string;
  reactions?: { [emoji: string]: number };
  votes?: { up: number; down: number };
  commentsCount?: number;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  author: string;
  isAnonymous: boolean;
  timestamp: string;
  parentId?: string; // untuk nested comments
}

export interface Voting {
  id: string;
  title: string;
  description: string;
  type: 'binary' | 'likert';
  creator: string;
  isAnonymous: boolean;
  requireIdentity: boolean;
  options: VotingOption[];
  responses: VotingResponse[];
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
}

export interface VotingOption {
  id: string;
  text: string;
  value: number; // untuk likert: 1-5, untuk binary: 0-1
}

export interface VotingResponse {
  id: string;
  votingId: string;
  optionId: string;
  voter: string;
  isAnonymous: boolean;
  timestamp: string;
}

export interface Reaction {
  id: string;
  postId: string;
  emoji: string;
  user: string;
  isAnonymous: boolean;
  timestamp: string;
}

export interface PostFormData {
  category: 'kritik-saran' | 'curhat' | 'ide-opini';
  title?: string;
  content: string;
  author: string;
  isAnonymous: boolean;
  target?: string;
}

export interface CommentFormData {
  postId: string;
  content: string;
  author: string;
  isAnonymous: boolean;
  parentId?: string;
}

export interface VotingFormData {
  title: string;
  description: string;
  type: 'binary' | 'likert';
  creator: string;
  isAnonymous: boolean;
  requireIdentity: boolean;
  expiresAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface DatabaseSchema {
  posts: Post[];
  comments: Comment[];
  votings: Voting[];
  reactions: Reaction[];
  lastUpdated: string;
}

export type PostCategory = 'kritik-saran' | 'curhat' | 'ide-opini';
export type VotingType = 'binary' | 'likert';
export type SortOrder = 'newest' | 'oldest' | 'most-voted' | 'most-commented';

export interface FilterOptions {
  category?: PostCategory;
  sortBy?: SortOrder;
  showAnonymous?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface Stats {
  totalPosts: number;
  totalComments: number;
  totalVotings: number;
  totalReactions: number;
  categoryCounts: {
    'kritik-saran': number;
    'curhat': number;
    'ide-opini': number;
  };
  recentActivity: number; // posts in last 24h
}