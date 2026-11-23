export type ForumUserRole = 'citizen' | 'verified' | 'moderator';

export interface ForumMessage {
  id: number;
  author: string;
  role: ForumUserRole;
  avatarUrl?: string;
  postedAt: Date;
  body: string;
  agreeCount: number;
}
