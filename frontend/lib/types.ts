export type Platform =
  | 'INSTAGRAM'
  | 'LINKEDIN'
  | 'TWITTER_X'
  | 'FACEBOOK'
  | 'BLOG'
  | 'GENERAL';

export type ContentType = 'SOCIAL_POST' | 'BLOG_DRAFT';

export type ContentStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED';

export interface ContentItem {
  id: number;
  title: string;
  body: string;
  contentType: ContentType;
  contentTypeDisplay: string;
  platform: Platform;
  platformDisplay: string;
  status: ContentStatus;
  statusDisplay: string;
  scheduledAt: string | null;
  tags: string | null;
  author: string | null;
  createdAt: string;
  updatedAt: string;
  characterCount: number;
}

export interface ContentRequest {
  title: string;
  body: string;
  contentType: ContentType;
  platform: Platform;
  status: ContentStatus;
  scheduledAt?: string | null;
  tags?: string;
  author?: string;
}

export interface WeeklyActivity {
  day: string;
  date: string;
  total: number;
  scheduled: number;
  published: number;
  drafts: number;
}

export interface DashboardStats {
  totalContent: number;
  draftsCount: number;
  scheduledCount: number;
  publishedCount: number;
  archivedCount: number;
  upcomingCount: number;
  upcomingPosts: ContentItem[];
  recentlyUpdated: ContentItem[];
  platformDistribution: Record<string, number>;
  weeklyOverview: WeeklyActivity[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
