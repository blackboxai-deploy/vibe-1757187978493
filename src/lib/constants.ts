// Main App Config
export const APP_NAME = 'Pqsaaay';
export const APP_TAGLINE = 'Platform berbagi kritik, saran, curhat, ide, dan voting untuk komunitas';

export const APP_CONFIG = {
  name: APP_NAME,
  description: APP_TAGLINE,
  version: '1.0.0',
  maxUsers: 15,
  avgDailyUsers: 5
};

export const COLORS = {
  primary: {
    sage: '#10B981',
    sageLight: '#6EE7B7',
    sageDark: '#047857'
  },
  secondary: {
    lavender: '#8B5CF6',
    lavenderLight: '#C4B5FD',
    lavenderDark: '#7C3AED'
  },
  accent: {
    peach: '#F97316',
    peachLight: '#FDBA74',
    peachDark: '#EA580C'
  },
  background: {
    cream: '#FFFBEB',
    white: '#FFFFFF',
    gray: '#F9FAFB'
  },
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    muted: '#9CA3AF'
  }
};

export const CATEGORIES = {
  KRITIK_SARAN: {
    id: 'kritik-saran',
    name: 'Kritik / Saran',
    description: 'Sampaikan kritik dan saran untuk perbaikan',
    icon: '💭',
    color: COLORS.primary.sage,
    hasComments: false,
    hasReactions: false,
    hasVoting: false,
    requiresTarget: true
  },
  CURHAT: {
    id: 'curhat',
    name: 'Curhat',
    description: 'Berbagi cerita dan perasaan',
    icon: '💝',
    color: COLORS.secondary.lavender,
    hasComments: true,
    hasReactions: true,
    hasVoting: false,
    requiresTarget: false
  },
  IDE_OPINI: {
    id: 'ide-opini',
    name: 'Ide / Opini',
    description: 'Bagikan ide dan pendapat untuk didiskusikan',
    icon: '💡',
    color: COLORS.accent.peach,
    hasComments: false,
    hasReactions: false,
    hasVoting: true,
    requiresTarget: false
  },
  VOTING: {
    id: 'voting',
    name: 'Voting',
    description: 'Buat dan ikuti voting komunitas',
    icon: '🗳️',
    color: COLORS.primary.sage,
    hasComments: false,
    hasReactions: false,
    hasVoting: true,
    requiresTarget: false
  }
} as const;

export const EMOJI_REACTIONS = {
  LOVE: { emoji: '❤️', name: 'love', label: 'Suka' },
  LAUGH: { emoji: '😂', name: 'laugh', label: 'Lucu' },
  SAD: { emoji: '😢', name: 'sad', label: 'Sedih' },
  THUMBS_UP: { emoji: '👍', name: 'thumbs_up', label: 'Setuju' }
} as const;

export const VOTING_TYPES = {
  BINARY: {
    id: 'binary',
    name: 'Binary Voting',
    description: 'Setuju atau Tidak Setuju',
    options: [
      { id: 'agree', label: 'Setuju', emoji: '👍', color: COLORS.primary.sage },
      { id: 'disagree', label: 'Tidak Setuju', emoji: '👎', color: COLORS.text.secondary }
    ]
  },
  LIKERT: {
    id: 'likert',
    name: 'Likert Scale',
    description: '5 tingkat persetujuan',
    options: [
      { id: 'strongly_disagree', label: 'Sangat Tidak Setuju', emoji: '😡', color: '#EF4444' },
      { id: 'disagree', label: 'Tidak Setuju', emoji: '😕', color: '#F97316' },
      { id: 'neutral', label: 'Netral', emoji: '😐', color: COLORS.text.secondary },
      { id: 'agree', label: 'Setuju', emoji: '😊', color: COLORS.primary.sage },
      { id: 'strongly_agree', label: 'Sangat Setuju', emoji: '😍', color: '#059669' }
    ]
  }
} as const;

export const DEFAULT_TARGETS = [
  'Ke Pengurus',
  'Ke Ketua',
  'Ke Sekretaris',
  'Ke Bendahara',
  'Ke Koordinator',
  'Ke Tim IT',
  'Ke Semua Anggota'
];

export const FORM_VALIDATION = {
  minContentLength: 10,
  maxContentLength: 1000,
  minTitleLength: 5,
  maxTitleLength: 100,
  maxNameLength: 50,
  maxTargetLength: 50
};

export const UI_CONFIG = {
  borderRadius: '20px',
  cardShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  hoverShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease-in-out',
  animationDuration: '300ms'
};

export const BREAKPOINTS = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1280px'
};

export const API_ENDPOINTS = {
  posts: '/api/posts',
  comments: '/api/comments',
  votes: '/api/votes',
  reactions: '/api/reactions',
  voting: '/api/voting'
};

export const STORAGE_KEYS = {
  posts: 'pqsaaay_posts',
  comments: 'pqsaaay_comments',
  votes: 'pqsaaay_votes',
  reactions: 'pqsaaay_reactions',
  voting: 'pqsaaay_voting'
};

export const ANONYMOUS_NAME = 'Anonim';

export const POSTS_PER_PAGE = 10;
export const COMMENTS_PER_PAGE = 20;