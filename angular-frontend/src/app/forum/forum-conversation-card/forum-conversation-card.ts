import { Component, computed, input } from '@angular/core';
import { GetStringsPipe } from '../../core/strings/get-strings-pipe';

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

const SEVERITY_BADGE: Record<ForumSeverity, { classes: string; labelKey: string }> = {
  high:   { classes: 'bg-status-danger-100 text-status-danger-500',   labelKey: 'forum.severity.high' },
  medium: { classes: 'bg-accent-warning-100 text-accent-warning-600', labelKey: 'forum.severity.medium' },
  low:    { classes: 'bg-status-success-100 text-status-success-600', labelKey: 'forum.severity.low' },
};

const STATUS_BADGE: Record<ForumStatus, { classes: string; labelKey: string }> = {
  active:       { classes: 'bg-status-danger-100 text-status-danger-500',   labelKey: 'forum.status.active' },
  finished:     { classes: 'bg-status-success-100 text-status-success-600', labelKey: 'forum.status.finished' },
  confirmation: { classes: 'bg-accent-warning-100 text-accent-warning-600', labelKey: 'forum.status.confirmation' },
};

const BADGE_BASE =
  'inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none';

@Component({
  selector: 'app-forum-conversation-card',
  templateUrl: './forum-conversation-card.html',
  imports: [GetStringsPipe],
})
export class ForumConversationCard {
  conversation = input.required<ForumConversation>();

  readonly severityConfig = computed(() => SEVERITY_BADGE[this.conversation().severity]);
  readonly statusConfig   = computed(() => STATUS_BADGE[this.conversation().status]);

  readonly severityBadgeClass = computed(() => `${BADGE_BASE} ${this.severityConfig().classes}`);
  readonly statusBadgeClass   = computed(() => `${BADGE_BASE} ${this.statusConfig().classes}`);

  readonly timeAgo = computed(() => {
    const created = this.conversation().createdAt;
    const now = new Date();
    const diffMs  = now.getTime() - created.getTime();
    const diffMin = Math.floor(diffMs / 60_000);

    if (diffMin < 60) {
      return `Hace ${diffMin} min`;
    }

    const sameDay = now.toDateString() === created.toDateString();
    if (sameDay) {
      return `Hace ${Math.floor(diffMs / 3_600_000)} h`;
    }

    return `Hace ${Math.floor(diffMs / 86_400_000)} d`;
  });
}
