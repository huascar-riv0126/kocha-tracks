import { NgClass } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { GetStringsPipe } from '../../core/strings/get-strings-pipe';
import { AppNotification, NOTIFICATION_TYPE_DOT_CLASS } from '../notification.model';

@Component({
  selector: 'app-notification-card',
  standalone: true,
  imports: [NgClass, GetStringsPipe],
  templateUrl: './notification-card.html',
})
export class NotificationCard {
  readonly notification = input.required<AppNotification>();

  readonly cardClick = output<AppNotification>();
  readonly menuClick = output<AppNotification>();

  readonly isUnread = computed(() => !this.notification().read);
  readonly typeDotClass = computed(() => NOTIFICATION_TYPE_DOT_CLASS[this.notification().type]);

  onCardClick(): void {
    this.cardClick.emit(this.notification());
  }

  onCardClickFromKeyboard(event: Event): void {
    // Ignore key events coming from nested controls such as the actions button.
    if (event.target !== event.currentTarget) return;
    event.preventDefault();
    this.onCardClick();
  }

  onMenuClick(event: MouseEvent): void {
    event.stopPropagation();
    this.menuClick.emit(this.notification());
  }
}
