export interface ContentCard {
  id: string;
  type: ContentType;
  title: string;
  content: string;
  tone: ContentTone;
  pillar: ContentPillar;
  engagement: EngagementMetrics;
  createdAt: string;
  isFavorited: boolean;
  platform: SocialPlatform[];
}

export type ContentType = 'post' | 'carousel' | 'thread';
export type ContentTone = 'Professional' | 'Casual' | 'Educational' | 'Storytelling';
export type ContentPillar = 'Thought Leadership' | 'Tips & Advice' | 'Personal Story' | 'Business Growth' | 'Behind the Scenes';

export interface EngagementMetrics {
  likes: number;
  comments: number;
  shares: number;
}

export type SocialPlatform = 'LinkedIn' | 'Twitter' | 'Instagram' | 'Facebook';
