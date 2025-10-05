import { ContentTone } from './content';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  industry: string;
  targetAudience: string;
  contentGoals: string[];
  tone: ContentTone;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  loading: boolean;
}
