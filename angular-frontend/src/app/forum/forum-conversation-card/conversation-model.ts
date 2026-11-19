export type ForumSeverity = 'high' | 'medium' | 'low';
export type ForumStatus = 'active' | 'finished' | 'confirmation';

export interface ForumConversation {
  id: number;
  title: string;
  severity: ForumSeverity;
  status: ForumStatus;
  commentCount: number;
  createdAt: Date;
}
