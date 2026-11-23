import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { StringsService } from '../../core/strings/strings-service/strings-service';
import { setRequiredInputs } from '../../testing/set-required-inputs';
import { StringsServiceStub } from '../../testing/stubs';
import { AppNotification } from '../notification.model';
import { NotificationCard } from './notification-card';

const unreadNotification: AppNotification = {
  id: 'notification-1',
  type: 'new_event',
  title: 'Nuevo evento en tu zona',
  description: 'Se reportó una inundación por lluvias en la Zona Sur.',
  read: false,
};

const readNotification: AppNotification = {
  ...unreadNotification,
  id: 'notification-2',
  type: 'event_end',
  title: 'Evento finalizado',
  read: true,
};

describe('NotificationCard', () => {
  let component: NotificationCard;
  let fixture: ComponentFixture<NotificationCard>;

  async function setup(notification: AppNotification = unreadNotification) {
    await TestBed.configureTestingModule({
      imports: [NotificationCard],
      providers: [{ provide: StringsService, useClass: StringsServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationCard);
    component = fixture.componentInstance;
    setRequiredInputs(fixture, { notification });
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function element(): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  function cardElement(): HTMLElement {
    return element().querySelector('[data-testid="notification-card"]') as HTMLElement;
  }

  function typeDot(): HTMLElement {
    return element().querySelector('[data-testid="notification-type-dot"]') as HTMLElement;
  }

  beforeEach(async () => {
    await setup();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the notification title and description', () => {
    expect(element().querySelector('[data-testid="notification-title"]')?.textContent?.trim()).toBe(
      unreadNotification.title,
    );
    expect(
      element().querySelector('[data-testid="notification-description"]')?.textContent?.trim(),
    ).toBe(unreadNotification.description);
  });

  it('should use a red dot for a new event', () => {
    expect(typeDot().classList.contains('bg-status-danger-500')).toBe(true);
  });

  it('should use a yellow dot for an event update', async () => {
    TestBed.resetTestingModule();
    await setup({ ...unreadNotification, type: 'event_update' });

    expect(typeDot().classList.contains('bg-accent-warning-500')).toBe(true);
  });

  it('should use a green dot for an event ending', async () => {
    TestBed.resetTestingModule();
    await setup({ ...unreadNotification, type: 'event_end' });

    expect(typeDot().classList.contains('bg-status-success-500')).toBe(true);
  });

  it('should blink the left dot and show the blue dot when unread', () => {
    expect(typeDot().classList.contains('animate-pulse')).toBe(true);
    expect(element().querySelector('[data-testid="notification-unread-dot"]')).toBeTruthy();
  });

  it('should stop blinking and hide the blue dot when read', async () => {
    TestBed.resetTestingModule();
    await setup(readNotification);

    expect(typeDot().classList.contains('animate-pulse')).toBe(false);
    expect(element().querySelector('[data-testid="notification-unread-dot"]')).toBeNull();
  });

  it('should emit cardClick when the card is clicked', () => {
    const emitSpy = vi.spyOn(component.cardClick, 'emit');

    cardElement().click();

    expect(emitSpy).toHaveBeenCalledWith(unreadNotification);
  });

  it('should emit cardClick when Enter or Space is pressed on the card', () => {
    const emitSpy = vi.spyOn(component.cardClick, 'emit');

    cardElement().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    cardElement().dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));

    expect(emitSpy).toHaveBeenCalledTimes(2);
  });

  it('should emit menuClick from the actions button without opening the card', () => {
    const cardSpy = vi.spyOn(component.cardClick, 'emit');
    const menuSpy = vi.spyOn(component.menuClick, 'emit');
    const menuButton = element().querySelector(
      '[data-testid="notification-menu-button"]',
    ) as HTMLButtonElement;

    menuButton.click();

    expect(menuSpy).toHaveBeenCalledWith(unreadNotification);
    expect(cardSpy).not.toHaveBeenCalled();
  });

  it('should not open the card when Enter is pressed on the actions button', () => {
    const cardSpy = vi.spyOn(component.cardClick, 'emit');
    const menuButton = element().querySelector(
      '[data-testid="notification-menu-button"]',
    ) as HTMLButtonElement;

    menuButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(cardSpy).not.toHaveBeenCalled();
  });
});
