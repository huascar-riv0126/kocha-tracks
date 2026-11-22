import { NgClass } from '@angular/common';
import { Component, computed, signal, viewChild } from '@angular/core';
import { GetStringsPipe } from '../../core/strings/get-strings-pipe';
import { NotificationList } from '../notification-list/notification-list';
import { AppNotification } from '../notification.model';

export type NotificationFilterKey =
  'all' | 'unread' | 'new' | 'updates' | 'confirmations' | 'ended';

export interface NotificationFilter {
  key: NotificationFilterKey;
  labelKey: string;
}

const FILTER_QUERIES: Record<NotificationFilterKey, string> = {
  all: '',
  unread: 'no leido',
  new: 'nuevo',
  updates: 'actualizacion',
  confirmations: 'confirmacion',
  ended: 'finalizacion',
};

function daysAgo(days: number): Date {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - days);
  return date;
}

// Example data until the notifications HTTP service is wired in a later story.
const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notification-1',
    type: 'new_event',
    title: 'Nuevo reporte de deslizamiento en la Zona Norte',
    description: 'Vecinos reportaron movimiento de tierra tras las lluvias de la mañana.',
    read: false,
    createdAt: daysAgo(0),
    zoneName: 'Zona Norte',
  },
  {
    id: 'notification-2',
    type: 'event_update',
    title: 'Actualización del bloqueo en Av. América',
    description: 'El tránsito se normaliza gradualmente en ambos sentidos.',
    read: true,
    createdAt: daysAgo(0),
    zoneName: 'Centro',
  },
  {
    id: 'notification-3',
    type: 'event_update',
    title: 'Modificación en la ruta de evacuación',
    description: 'La ruta alterna fue habilitada por Protección Civil.',
    read: false,
    createdAt: daysAgo(1),
    zoneName: 'Zona Sur',
  },
  {
    id: 'notification-4',
    type: 'new_event',
    title: 'Confirmación de reporte vecinal',
    description: 'El reporte fue verificado por la autoridad municipal.',
    read: false,
    createdAt: daysAgo(1),
    zoneName: 'Zona Oeste',
  },
  {
    id: 'notification-5',
    type: 'event_end',
    title: 'Finalización de obras en Av. Blanco Galindo',
    description: 'Los trabajos concluyeron y el tránsito fue restablecido.',
    read: true,
    createdAt: daysAgo(3),
    zoneName: 'Zona Norte',
  },
  {
    id: 'notification-6',
    type: 'event_end',
    title: 'Cierre de vía finalizado',
    description: 'La vía fue reabierta después de la inspección técnica.',
    read: false,
    createdAt: daysAgo(5),
    zoneName: 'Zona Este',
  },
];

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [NgClass, NotificationList, GetStringsPipe],
  templateUrl: './notifications-page.html',
})
export class NotificationsPage {
  readonly notificationList = viewChild.required(NotificationList);

  readonly activeFilter = signal<NotificationFilterKey>('all');
  readonly notifications = signal<AppNotification[]>(INITIAL_NOTIFICATIONS);

  readonly filters: NotificationFilter[] = [
    { key: 'all', labelKey: 'notifications.filter.all' },
    { key: 'unread', labelKey: 'notifications.filter.unread' },
    { key: 'new', labelKey: 'notifications.filter.new' },
    { key: 'updates', labelKey: 'notifications.filter.updates' },
    { key: 'confirmations', labelKey: 'notifications.filter.confirmations' },
    { key: 'ended', labelKey: 'notifications.filter.ended' },
  ];

  readonly activePillClass = 'bg-interactive-cta text-white';
  readonly inactivePillClass =
    'bg-surface border border-border-default text-txt-secondary hover:bg-neutral-50';

  readonly unreadCount = computed(
    () => this.notifications().filter((notification) => !notification.read).length,
  );

  selectFilter(key: NotificationFilterKey): void {
    this.activeFilter.set(key);
    this.notificationList().filterByText(FILTER_QUERIES[key]);
  }

  onCardClick(notification: AppNotification): void {
    this.notifications.update((notifications) =>
      notifications.map((current) =>
        current.id === notification.id ? { ...current, read: true } : current,
      ),
    );
  }

  markAllAsRead(): void {
    this.notifications.update((notifications) =>
      notifications.map((notification) => ({ ...notification, read: true })),
    );
  }
}
