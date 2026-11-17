import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ForumConversationCard, ForumConversation } from './forum-conversation-card';
import { StringsService } from '../../core/strings/strings-service/strings-service';
import { StringsServiceStub } from '@testutils/stubs';
import { setRequiredInputs } from '@testutils/set-required-inputs';

const BASE: ForumConversation = {
  id: 1,
  title: 'Inundación Av. Blanco Galindo',
  severity: 'high',
  status: 'active',
  commentCount: 24,
  createdAt: new Date(),
};

describe('ForumConversationCard', () => {
  let fixture: ComponentFixture<ForumConversationCard>;

  const create = (overrides: Partial<ForumConversation> = {}) => {
    fixture = TestBed.createComponent(ForumConversationCard);
    setRequiredInputs(fixture, { conversation: { ...BASE, ...overrides } });
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForumConversationCard],
      providers: [{ provide: StringsService, useClass: StringsServiceStub }],
    }).compileComponents();
  });

  afterEach(() => vi.useRealTimers());

  it('should create', () => {
    create();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display the conversation title', () => {
    create({ title: 'Corte Av. Heroínas' });
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[data-testid="title"]')?.textContent?.trim()).toBe('Corte Av. Heroínas');
  });

  it('should display the comment count', () => {
    create({ commentCount: 42 });
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[data-testid="comments"]')?.textContent).toContain('42');
  });

  // ── Severidad ────────────────────────────────────────────────────────────

  it('should apply danger classes to severity badge when severity is "high"', () => {
    create({ severity: 'high' });
    const badge = fixture.nativeElement.querySelector('[data-testid="severity-badge"]') as HTMLElement;
    expect(badge.classList.contains('bg-status-danger-100')).toBe(true);
    expect(badge.classList.contains('text-status-danger-500')).toBe(true);
  });

  it('should apply warning classes to severity badge when severity is "medium"', () => {
    create({ severity: 'medium' });
    const badge = fixture.nativeElement.querySelector('[data-testid="severity-badge"]') as HTMLElement;
    expect(badge.classList.contains('bg-accent-warning-100')).toBe(true);
    expect(badge.classList.contains('text-accent-warning-600')).toBe(true);
  });

  it('should apply success classes to severity badge when severity is "low"', () => {
    create({ severity: 'low' });
    const badge = fixture.nativeElement.querySelector('[data-testid="severity-badge"]') as HTMLElement;
    expect(badge.classList.contains('bg-status-success-100')).toBe(true);
    expect(badge.classList.contains('text-status-success-600')).toBe(true);
  });

  // ── Estado ───────────────────────────────────────────────────────────────

  it('should apply danger classes to status badge when status is "active"', () => {
    create({ status: 'active' });
    const badge = fixture.nativeElement.querySelector('[data-testid="status-badge"]') as HTMLElement;
    expect(badge.classList.contains('bg-status-danger-100')).toBe(true);
    expect(badge.classList.contains('text-status-danger-500')).toBe(true);
  });

  it('should apply success classes to status badge when status is "finished"', () => {
    create({ status: 'finished' });
    const badge = fixture.nativeElement.querySelector('[data-testid="status-badge"]') as HTMLElement;
    expect(badge.classList.contains('bg-status-success-100')).toBe(true);
    expect(badge.classList.contains('text-status-success-600')).toBe(true);
  });

  it('should apply warning classes to status badge when status is "confirmation"', () => {
    create({ status: 'confirmation' });
    const badge = fixture.nativeElement.querySelector('[data-testid="status-badge"]') as HTMLElement;
    expect(badge.classList.contains('bg-accent-warning-100')).toBe(true);
    expect(badge.classList.contains('text-accent-warning-600')).toBe(true);
  });

  // ── Tiempo relativo ───────────────────────────────────────────────────────

  it('should show "Hace X min" when less than 60 minutes have passed', () => {
    vi.useFakeTimers();
    const createdAt = new Date('2026-11-16T10:00:00');
    vi.setSystemTime(new Date('2026-11-16T10:05:00')); // 5 min después
    create({ createdAt });
    const timeEl = fixture.nativeElement.querySelector('[data-testid="time-ago"]') as HTMLElement;
    expect(timeEl.textContent?.trim()).toBe('Hace 5 min');
  });

  it('should show "Hace X h" when 60+ minutes have passed but it is the same day', () => {
    vi.useFakeTimers();
    const createdAt = new Date('2026-11-16T08:00:00');
    vi.setSystemTime(new Date('2026-11-16T10:30:00')); // 2.5 h después, mismo día
    create({ createdAt });
    const timeEl = fixture.nativeElement.querySelector('[data-testid="time-ago"]') as HTMLElement;
    expect(timeEl.textContent?.trim()).toBe('Hace 2 h');
  });

  it('should show "Hace X d" when the day changes', () => {
    vi.useFakeTimers();
    const createdAt = new Date('2026-11-15T10:00:00');
    vi.setSystemTime(new Date('2026-11-16T10:00:00')); // 1 día después
    create({ createdAt });
    const timeEl = fixture.nativeElement.querySelector('[data-testid="time-ago"]') as HTMLElement;
    expect(timeEl.textContent?.trim()).toBe('Hace 1 d');
  });
});
