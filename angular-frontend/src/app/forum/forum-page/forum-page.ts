import { Component, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { GetStringsPipe } from '../../core/strings/get-strings-pipe';
import { ForumConversationCard } from '../forum-conversation-card/forum-conversation-card';
import { ForumMessageCard } from '../forum-message-card/forum-message-card';
import { ForumConversation } from '../forum-conversation-card/conversation-model';
import { ForumMessage } from '../forum-message-card/message-model';

const MOCK_CONVERSATIONS: ForumConversation[] = [
  {
    id: 1,
    title: 'Bloqueo en Av. Ayacucho y Heroínas — manifestación magisterial',
    severity: 'high',
    status: 'active',
    commentCount: 14,
    createdAt: new Date(Date.now() - 25 * 60_000),
  },
  {
    id: 2,
    title: 'Corte de agua en zona Norte deja sin servicio a 3 barrios',
    severity: 'medium',
    status: 'confirmation',
    commentCount: 7,
    createdAt: new Date(Date.now() - 2 * 3_600_000),
  },
  {
    id: 3,
    title: 'Desvío por obras en circunvalación — tráfico fluye con normalidad',
    severity: 'low',
    status: 'finished',
    commentCount: 3,
    createdAt: new Date(Date.now() - 86_400_000),
  },
];

const MOCK_MESSAGES: ForumMessage[] = [
  {
    id: 1,
    author: 'María López',
    role: 'moderator',
    postedAt: new Date(Date.now() - 20 * 60_000),
    body: 'Confirmado. Hay corte total en Ayacucho desde las 09:00. Recomendamos rutas alternativas por Blanco Galindo.',
    agreeCount: 12,
  },
  {
    id: 2,
    author: 'Carlos Mendoza',
    role: 'verified',
    postedAt: new Date(Date.now() - 15 * 60_000),
    body: 'Paso por la zona, el bloqueo llega hasta la esquina con Baptista. Los colectivos 103 están desviando por Lanza.',
    agreeCount: 5,
  },
  {
    id: 3,
    author: 'Ana Flores',
    role: 'citizen',
    postedAt: new Date(Date.now() - 8 * 60_000),
    body: '¿Alguien sabe si también están afectando la salida al norte? Necesito llegar al aeropuerto.',
    agreeCount: 2,
  },
];

@Component({
  selector: 'app-forum-page',
  templateUrl: './forum-page.html',
  imports: [GetStringsPipe, ForumConversationCard, ForumMessageCard, DatePipe],
})
export class ForumPage {
  readonly conversations = signal<ForumConversation[]>(MOCK_CONVERSATIONS);
  readonly messages = signal<ForumMessage[]>(MOCK_MESSAGES);

  readonly selectedConversation = signal<ForumConversation>(MOCK_CONVERSATIONS[0]);

  readonly searchQuery = signal('');

  readonly filteredConversations = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.conversations();
    return this.conversations().filter(c =>
      c.title.toLowerCase().includes(query),
    );
  });

  selectConversation(conv: ForumConversation): void {
    this.selectedConversation.set(conv);
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  newComment = signal('');

  onCommentInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.newComment.set(textarea.value);
  }
}
