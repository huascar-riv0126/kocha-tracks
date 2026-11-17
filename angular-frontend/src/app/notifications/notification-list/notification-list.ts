import { Component, computed, input, output, signal } from '@angular/core';
import { GetStringsPipe } from '../../core/strings/get-strings-pipe';
import { NotificationCard } from '../notification-card/notification-card';
import { AppNotification, NotificationType } from '../notification.model';

export type NotificationGroupKey = 'today' | 'yesterday' | 'this_week';

export interface NotificationGroup {
  key: NotificationGroupKey;
  labelKey: string;
  notifications: AppNotification[];
}

const GROUP_ORDER: NotificationGroupKey[] = ['today', 'yesterday', 'this_week'];

const GROUP_LABEL_KEYS: Record<NotificationGroupKey, string> = {
  today: 'notifications.group.today',
  yesterday: 'notifications.group.yesterday',
  this_week: 'notifications.group.this_week',
};

const TYPE_KEYWORDS: Record<NotificationType, string[]> = {
  new_event: ['nuevo', 'nueva'],
  event_update: ['actualizacion', 'modificacion', 'cambio'],
  event_end: ['finalizacion', 'finalizado', 'fin'],
};

const NOTIFICATION_TYPES: NotificationType[] = ['new_event', 'event_update', 'event_end'];

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

function dayNumber(date: Date): number {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / MS_PER_DAY;
}

function resolveGroup(createdAt: Date | undefined, now: Date): NotificationGroupKey {
  // Notifications without a date are kept in the catch-all group instead of
  // being silently dropped from the list.
  if (!createdAt || Number.isNaN(createdAt.getTime())) return 'this_week';

  const dayDifference = dayNumber(now) - dayNumber(createdAt);

  if (dayDifference <= 0) return 'today';
  if (dayDifference === 1) return 'yesterday';
  return 'this_week';
}

function typeFilter(filter: string): NotificationType | null {
  for (const type of NOTIFICATION_TYPES) {
    if (TYPE_KEYWORDS[type].some((keyword) => filter.includes(keyword))) {
      return type;
    }
  }
  return null;
}

function groupFilter(filter: string): NotificationGroupKey | null {
  if (filter.includes('hoy')) return 'today';
  if (filter.includes('ayer')) return 'yesterday';
  if (filter.includes('semana')) return 'this_week';
  return null;
}

function readFilter(filter: string): 'read' | 'unread' | null {
  if (filter.includes('no leid')) return 'unread';
  if (filter.includes('leid')) return 'read';
  return null;
}

function matchesFilter(
  notification: AppNotification,
  filter: string,
  group: NotificationGroupKey,
): boolean {
  if (!filter) return true;

  const wantedType = typeFilter(filter);
  const wantedGroup = groupFilter(filter);
  const wantedRead = readFilter(filter);

  if (wantedType || wantedGroup || wantedRead) {
    return (
      (!wantedType || notification.type === wantedType) &&
      (!wantedGroup || group === wantedGroup) &&
      (!wantedRead || (wantedRead === 'read' ? notification.read : !notification.read))
    );
  }

  const searchableText = normalizeText(
    [notification.title, notification.description, notification.zoneName ?? ''].join(' '),
  );

  return searchableText.includes(filter);
}

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [NotificationCard, GetStringsPipe],
  templateUrl: './notification-list.html',
})
export class NotificationList {
  readonly notifications = input.required<AppNotification[]>();

  readonly cardClick = output<AppNotification>();
  readonly menuClick = output<AppNotification>();

  private readonly filterText = signal('');
  private readonly normalizedFilter = computed(() => normalizeText(this.filterText()));

  readonly groups = computed<NotificationGroup[]>(() => {
    const filter = this.normalizedFilter();
    const now = new Date();
    const buckets: Record<NotificationGroupKey, AppNotification[]> = {
      today: [],
      yesterday: [],
      this_week: [],
    };

    for (const notification of this.notifications()) {
      const group = resolveGroup(notification.createdAt, now);

      if (matchesFilter(notification, filter, group)) {
        buckets[group].push(notification);
      }
    }

    return GROUP_ORDER.map((key) => ({
      key,
      labelKey: GROUP_LABEL_KEYS[key],
      notifications: [...buckets[key]].sort(
        (a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
      ),
    })).filter((group) => group.notifications.length > 0);
  });

  readonly isEmpty = computed(() => this.groups().length === 0);

  filterByText(filterText: string): void {
    this.filterText.set(filterText ?? '');
  }

  onCardClick(notification: AppNotification): void {
    this.cardClick.emit(notification);
  }

  onMenuClick(notification: AppNotification): void {
    this.menuClick.emit(notification);
  }
}
