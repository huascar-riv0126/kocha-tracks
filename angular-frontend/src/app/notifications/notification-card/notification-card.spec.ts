// @vitest-environment jsdom
/// <reference types="vite/client" />
import '@angular/compiler';
import * as angularCore from '@angular/core';
import type { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { StringsService } from '../../core/strings/strings-service/strings-service';
import { setRequiredInputs } from '../../testing/set-required-inputs';
import { StringsServiceStub } from '../../testing/stubs';
import { AppNotification } from '../notification.model';
import { NotificationCard } from './notification-card';
import template from './notification-card.html?raw';

if (!TestBed.platform) {
  TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
}

// When Vitest runs without Angular's build pipeline, components are compiled
// with JIT. Signal-based inputs are normally described by the Angular compiler
// in the component metadata, so the test registers that metadata itself.
const registerSignalInput = angularCore.Input as unknown as (
  options: Record<string, unknown>,
) => PropertyDecorator;

registerSignalInput({
  alias: 'notification',
  isSignal: true,
  required: true,
})(NotificationCard.prototype, 'notification');

const JIT_SIGNAL_METADATA = {
  template,
  signals: true,
} as unknown as Component;

// `resolveComponentResources` is documented as a public API but is only
// exported under Angular's private `ɵ` prefix at runtime.
const resolveComponentResources = (
  angularCore as unknown as {
    ɵresolveComponentResources: (resolver: (url: string) => Promise<string>) => Promise<void>;
  }
).ɵresolveComponentResources;

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
    TestBed.overrideComponent(NotificationCard, { set: JIT_SIGNAL_METADATA });

    // Resolve the component's original `templateUrl` before TestBed reads its
    // definition. The override above already carries the raw template, so this
    // only covers the initial JIT-compiled metadata.
    await resolveComponentResources((url) =>
      url.endsWith('notification-card.html')
        ? Promise.resolve(template)
        : Promise.reject(new Error(`Unexpected resource: ${url}`)),
    );

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
    TestBed.resetTestingModule();
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
