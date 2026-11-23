import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { StringsService } from '../../core/strings/strings-service/strings-service';
import { StringsServiceStub } from '../../testing/stubs';
import { NotificationsPage } from './notifications-page';

describe('NotificationsPage', () => {
  let component: NotificationsPage;
  let fixture: ComponentFixture<NotificationsPage>;

  async function setup() {
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
