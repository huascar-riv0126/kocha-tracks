import { Component, computed, input } from '@angular/core';
import { GetStringsPipe } from '../../core/strings/get-strings-pipe';
import { Button } from '../../shared/button/button';
import { ForumMessage } from './message-model';

@Component({
  selector: 'app-forum-message-card',
  templateUrl: './forum-message-card.html',
  imports: [GetStringsPipe, Button],
})
export class ForumMessageCard {
  message = input.required<ForumMessage>();

  readonly initial = computed(() => this.message().author.charAt(0).toUpperCase());

  readonly isModerator = computed(() => this.message().role === 'moderator');
  readonly isVerified  = computed(() => this.message().role === 'verified');

  readonly timeAgo = computed(() => {
    const posted  = this.message().postedAt;
    const now     = new Date();
    const diffMs  = now.getTime() - posted.getTime();
    const diffMin = Math.floor(diffMs / 60_000);

    if (diffMin < 60) {
      return `Hace ${diffMin} min`;
    }

    const sameDay = now.toDateString() === posted.toDateString();
    if (sameDay) {
      return `Hace ${Math.floor(diffMs / 3_600_000)} h`;
    }

    return `Hace ${Math.floor(diffMs / 86_400_000)} d`;
  });
}
