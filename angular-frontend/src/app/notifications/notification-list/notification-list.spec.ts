import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { StringsService } from '../../core/strings/strings-service/strings-service';
import { setRequiredInputs } from '../../testing/set-required-inputs';
import { StringsServiceStub } from '../../testing/stubs';
import { AppNotification } from '../notification.model';
import { NotificationList } from './notification-list';

function daysAgo(days: number): Date {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - days);
  return date;
}

const todayNotification: AppNotification = {
  id: 'today-1',
  type: 'new_event',
  title: 'Nuevo evento en tu zona',
  description: 'Se reportó una inundación por lluvias en la Zona Sur.',
  read: false,
  createdAt: daysAgo(0),
};

const yesterdayNotification: AppNotification = {
  id: 'yesterday-1',
  type: 'event_update',
  title: 'Actualización del evento',
  description: 'El nivel del agua descendió durante la madrugada.',
  read: true,
  createdAt: daysAgo(1),
};

const weekNotification: AppNotification = {
  id: 'week-1',
  type: 'event_end',
  title: 'Evento finalizado',
  description: 'Los trabajos concluyeron y el tránsito fue restablecido.',
  read: false,
  createdAt: daysAgo(3),
};

const seedNotifications: AppNotification[] = [
  weekNotification,
  todayNotification,
  yesterdayNotification,
];

describe('NotificationList', () => {
  let component: NotificationList;
  let fixture: ComponentFixture<NotificationList>;

  async function setup(notifications: AppNotification[] = seedNotifications) {
    await TestBed.configureTestingModule({
      imports: [NotificationList],
      providers: [{ provide: StringsService, useClass: StringsServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationList);
    component = fixture.componentInstance;
    setRequiredInputs(fixture, { notifications });
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function element(): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  function groupKeys(): string[] {
    return component.groups().map((group) => group.key);
  }

  function groupIds(): string[][] {
    return component
      .groups()
      .map((group) => group.notifications.map((notification) => notification.id));
  }

  function cardElements(): HTMLElement[] {
    return Array.from(
      element().querySelectorAll('[data-testid="notification-card"]'),
    ) as HTMLElement[];
  }

  function applyFilter(filterText: string): void {
    component.filterByText(filterText);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await setup();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should group notifications into today, yesterday and this week', () => {
    expect(groupKeys()).toEqual(['today', 'yesterday', 'this_week']);
    expect(groupIds()).toEqual([['today-1'], ['yesterday-1'], ['week-1']]);
  });

  it('should render one header and section per non-empty group', () => {
    expect(element().querySelector('[data-testid="notification-group-today"]')).toBeTruthy();
    expect(element().querySelector('[data-testid="notification-group-yesterday"]')).toBeTruthy();
    expect(element().querySelector('[data-testid="notification-group-this_week"]')).toBeTruthy();

    expect(
      element()
        .querySelector('[data-testid="notification-group-title-today"]')
        ?.textContent?.trim(),
    ).toBe('notifications.group.today');
    expect(cardElements()).toHaveLength(3);
  });

  it('should hide groups without notifications', async () => {
    TestBed.resetTestingModule();
    await setup([todayNotification]);

    expect(groupKeys()).toEqual(['today']);
    expect(element().querySelector('[data-testid="notification-group-yesterday"]')).toBeNull();
    expect(element().querySelector('[data-testid="notification-group-this_week"]')).toBeNull();
  });

  it('should sort notifications inside a group from newest to oldest', async () => {
    const olderToday: AppNotification = {
      ...todayNotification,
      id: 'today-2',
      title: 'Evento anterior de hoy',
      createdAt: new Date(todayNotification.createdAt!.getTime() - 60 * 60 * 1000),
    };

    TestBed.resetTestingModule();
    await setup([olderToday, todayNotification]);

    expect(groupIds()).toEqual([['today-1', 'today-2']]);
  });

  it('should show the empty message when there are no notifications', async () => {
    TestBed.resetTestingModule();
    await setup([]);

    expect(component.isEmpty()).toBe(true);
    expect(
      element().querySelector('[data-testid="notification-list-empty"]')?.textContent?.trim(),
    ).toBe('notifications.list.empty');
  });

  it('should filter by event type keyword', () => {
    applyFilter('nuevo');
    expect(groupIds()).toEqual([['today-1']]);

    applyFilter('modificacion');
    expect(groupIds()).toEqual([['yesterday-1']]);

    applyFilter('finalizacion');
    expect(groupIds()).toEqual([['week-1']]);
  });

  it('should normalize accents and casing in the filter', () => {
    applyFilter('  FINALIZACIÓN  ');

    expect(groupIds()).toEqual([['week-1']]);
  });

  it('should filter by date group keyword', () => {
    applyFilter('hoy');
    expect(groupIds()).toEqual([['today-1']]);

    applyFilter('ayer');
    expect(groupIds()).toEqual([['yesterday-1']]);

    applyFilter('esta semana');
    expect(groupIds()).toEqual([['week-1']]);
  });

  it('should filter by read state', () => {
    applyFilter('no leido');
    expect(groupIds()).toEqual([['today-1'], ['week-1']]);

    applyFilter('leido');
    expect(groupIds()).toEqual([['yesterday-1']]);
  });

  it('should show every notification when the filter is empty', () => {
    applyFilter('nuevo');
    applyFilter('');

    expect(groupKeys()).toEqual(['today', 'yesterday', 'this_week']);
    expect(cardElements()).toHaveLength(3);
  });

  it('should show the empty message when the filter matches nothing', () => {
    applyFilter('sin coincidencias');

    expect(component.isEmpty()).toBe(true);
    expect(element().querySelector('[data-testid="notification-list-empty"]')).toBeTruthy();
    expect(cardElements()).toHaveLength(0);
  });

  it('should re-emit cardClick from the clicked card', () => {
    const emitSpy = vi.spyOn(component.cardClick, 'emit');

    cardElements()[0].click();

    expect(emitSpy).toHaveBeenCalledWith(todayNotification);
  });

  it('should re-emit menuClick without emitting cardClick', () => {
    const cardSpy = vi.spyOn(component.cardClick, 'emit');
    const menuSpy = vi.spyOn(component.menuClick, 'emit');
    const menuButton = element().querySelector(
      '[data-testid="notification-menu-button"]',
    ) as HTMLButtonElement;

    menuButton.click();

    expect(menuSpy).toHaveBeenCalledWith(todayNotification);
    expect(cardSpy).not.toHaveBeenCalled();
  });
});
