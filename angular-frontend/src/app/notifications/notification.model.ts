export type NotificationType = 'new_event' | 'event_update' | 'event_end';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  read: boolean;
  createdAt?: Date;
  zoneName?: string;
  eventId?: number;
}

export const NOTIFICATION_TYPE_DOT_CLASS: Record<NotificationType, string> = {
  new_event: 'bg-status-danger-500',
  event_update: 'bg-accent-warning-500',
  event_end: 'bg-status-success-500',
};
