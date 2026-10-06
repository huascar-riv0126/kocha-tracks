import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { EventMock } from './event-mock.model';
import { EventMockService } from './event-mock';

export const eventResolver: ResolveFn<EventMock | RedirectCommand> = (route) => {
  const router = inject(Router);
  const rawId = route.paramMap.get('eventId') ?? '';

  const event = /^[1-9]\d{0,9}$/.test(rawId)
    ? inject(EventMockService).getEvent(Number(rawId))
    : undefined;

  return event ?? new RedirectCommand(router.parseUrl('/404'), { skipLocationChange: true });
};
