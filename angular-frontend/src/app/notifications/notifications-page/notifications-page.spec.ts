// @vitest-environment jsdom
/// <reference types="vite/client" />
import '@angular/compiler';
import * as angularCore from '@angular/core';
import type { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StringsService } from '../../core/strings/strings-service/strings-service';
import { StringsServiceStub } from '../../testing/stubs';
import cardTemplate from '../notification-card/notification-card.html?raw';
import { NotificationCard } from '../notification-card/notification-card';
import listTemplate from '../notification-list/notification-list.html?raw';
import { NotificationList } from '../notification-list/notification-list';
import pageTemplate from './notifications-page.html?raw';
import { NotificationsPage } from './notifications-page';

if (!TestBed.platform) {
  TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
}

// Vitest runs these specs without Angular's build pipeline, so the templates
// are supplied as raw strings and the signal inputs/outputs of the reused
// components are registered explicitly for JIT compilation.
const registerSignalInput = angularCore.Input as unknown as (
  options: Record<string, unknown>,
) => PropertyDecorator;
const registerOutput = angularCore.Output as unknown as (alias?: string) => PropertyDecorator;
const registerViewChild = angularCore.ViewChild as unknown as (
  selector: unknown,
  opts?: Record<string, unknown>,
) => PropertyDecorator;

// Signal queries are invisible to JIT unless their metadata is provided too.
registerViewChild(NotificationList, { isSignal: true })(
  NotificationsPage.prototype,
  'notificationList',
);

registerSignalInput({ alias: 'notifications', isSignal: true, required: true })(
  NotificationList.prototype,
  'notifications',
);
registerOutput('cardClick')(NotificationList.prototype, 'cardClick');
registerOutput('menuClick')(NotificationList.prototype, 'menuClick');

registerSignalInput({ alias: 'notification', isSignal: true, required: true })(
  NotificationCard.prototype,
  'notification',
);
registerOutput('cardClick')(NotificationCard.prototype, 'cardClick');
registerOutput('menuClick')(NotificationCard.prototype, 'menuClick');

// The `signals` metadata flag is deliberately omitted: in JIT it prevents
// directive inputs and repeater views from updating in the same CD pass.
const PAGE_JIT_METADATA = { template: pageTemplate } as unknown as Component;
const LIST_JIT_METADATA = { template: listTemplate } as unknown as Component;
const CARD_JIT_METADATA = { template: cardTemplate, signals: true } as unknown as Component;

// `resolveComponentResources` is documented as a public API but is only
// exported under Angular's private `ɵ` prefix at runtime.
const resolveComponentResources = (
  angularCore as unknown as {
    ɵresolveComponentResources: (resolver: (url: string) => Promise<string>) => Promise<void>;
  }
).ɵresolveComponentResources;

const TEMPLATES: Record<string, string> = {
  'notifications-page.html': pageTemplate,
  'notification-list.html': listTemplate,
  'notification-card.html': cardTemplate,
};

describe('NotificationsPage', () => {
  let component: NotificationsPage;
  let fixture: ComponentFixture<NotificationsPage>;

  async function setup() {
    TestBed.overrideComponent(NotificationsPage, { set: PAGE_JIT_METADATA });
    TestBed.overrideComponent(NotificationList, { set: LIST_JIT_METADATA });
    TestBed.overrideComponent(NotificationCard, { set: CARD_JIT_METADATA });

    await resolveComponentResources((url) => {
      const template = Object.entries(TEMPLATES).find(([name]) => url.endsWith(name))?.[1];
      return template
        ? Promise.resolve(template)
        : Promise.reject(new Error(`Unexpected resource: ${url}`));
    });

    await TestBed.configureTestingModule({
      imports: [NotificationsPage],
      providers: [{ provide: StringsService, useClass: StringsServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function element(): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  function pill(key: string): HTMLButtonElement {
    return element().querySelector(`[data-testid="filter-${key}"]`) as HTMLButtonElement;
  }

  function cardElements(): HTMLElement[] {
    return Array.from(
      element().querySelectorAll('[data-testid="notification-card"]'),
    ) as HTMLElement[];
  }

  beforeEach(async () => {
    TestBed.resetTestingModule();
    await setup();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title, every filter pill and the bulk action', () => {
    expect(
      element().querySelector('[data-testid="notifications-page-title"]')?.textContent?.trim(),
    ).toBe('notifications.page.title');

    for (const key of ['all', 'unread', 'new', 'updates', 'confirmations', 'ended']) {
      expect(pill(key)).toBeTruthy();
    }
    expect(element().querySelector('[data-testid="mark-all-read"]')?.textContent?.trim()).toBe(
      'notifications.actions.mark_all_read',
    );
    expect(cardElements()).toHaveLength(6);
  });

  it('should not duplicate the navbar or the footer inside the page', () => {
    expect(element().querySelector('app-navbar')).toBeNull();
    expect(element().querySelector('app-footer')).toBeNull();
  });

  it('should activate the "all" filter by default and delegate each selection to the list', () => {
    const filterSpy = vi.spyOn(component.notificationList(), 'filterByText');

    expect(component.activeFilter()).toBe('all');
    expect(pill('all').getAttribute('aria-pressed')).toBe('true');
    expect(pill('all').classList.contains('bg-interactive-cta')).toBe(true);

    pill('unread').click();
    fixture.detectChanges();

    expect(component.activeFilter()).toBe('unread');
    expect(pill('unread').getAttribute('aria-pressed')).toBe('true');
    expect(pill('all').classList.contains('bg-interactive-cta')).toBe(false);
    expect(filterSpy).toHaveBeenCalledWith('no leido');
  });

  it('should send the expected query for every filter pill', () => {
    const filterSpy = vi.spyOn(component.notificationList(), 'filterByText');
    const expectedQueries: Record<string, string> = {
      all: '',
      unread: 'no leido',
      new: 'nuevo',
      updates: 'actualizacion',
      confirmations: 'confirmacion',
      ended: 'finalizacion',
    };

    for (const [key, query] of Object.entries(expectedQueries)) {
      pill(key).click();
      expect(filterSpy).toHaveBeenLastCalledWith(query);
    }
  });

  it('should display only confirmations when that filter is selected', () => {
    pill('confirmations').click();
    fixture.detectChanges();

    expect(cardElements()).toHaveLength(1);
    expect(element().querySelector('[data-testid="notification-title"]')?.textContent?.trim()).toBe(
      'Confirmación de reporte vecinal',
    );
  });

  it('should mark the clicked notification as read', () => {
    expect(component.notifications()[0].read).toBe(false);

    cardElements()[0].click();
    fixture.detectChanges();

    expect(component.notifications()[0].read).toBe(true);
    expect(component.unreadCount()).toBe(3);
  });

  it('should mark every notification as read and disable the bulk action', () => {
    const markAllButton = element().querySelector(
      '[data-testid="mark-all-read"]',
    ) as HTMLButtonElement;

    expect(markAllButton.disabled).toBe(false);
    markAllButton.click();
    fixture.detectChanges();

    expect(component.notifications().every((notification) => notification.read)).toBe(true);
    expect(component.unreadCount()).toBe(0);
    expect(markAllButton.disabled).toBe(true);
  });
});
