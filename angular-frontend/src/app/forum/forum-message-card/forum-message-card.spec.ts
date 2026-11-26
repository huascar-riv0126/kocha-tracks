import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ForumMessageCard } from './forum-message-card';
import { ForumMessage } from './message-model';
import { StringsService } from '../../core/strings/strings-service/strings-service';
import { StringsServiceStub } from '@testutils/stubs';
import { setRequiredInputs } from '@testutils/set-required-inputs';

const BASE: ForumMessage = {
  id: 1,
  author: 'Daniel Mendoza',
  role: 'citizen',
  postedAt: new Date(),
  body: 'Texto de prueba del mensaje.',
  agreeCount: 14,
};

describe('ForumMessageCard', () => {
  let fixture: ComponentFixture<ForumMessageCard>;

  const create = (overrides: Partial<ForumMessage> = {}) => {
    fixture = TestBed.createComponent(ForumMessageCard);
    setRequiredInputs(fixture, { message: { ...BASE, ...overrides } });
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForumMessageCard],
      providers: [{ provide: StringsService, useClass: StringsServiceStub }],
    }).compileComponents();
  });

  afterEach(() => vi.useRealTimers());

  it('debería crearse correctamente', () => {
    create();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('debería mostrar el nombre del autor', () => {
    create({ author: 'Carla Espinoza' });
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[data-testid="author-name"]')?.textContent?.trim()).toBe('Carla Espinoza');
  });

  it('debería mostrar la inicial del autor en el avatar', () => {
    create({ author: 'Daniel Mendoza' });
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[data-testid="avatar"]')?.textContent?.trim()).toBe('D');
  });

  it('debería mostrar el cuerpo del mensaje', () => {
    create({ body: 'La inundación sigue obstruyendo ambos carriles.' });
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[data-testid="message-body"]')?.textContent?.trim())
      .toBe('La inundación sigue obstruyendo ambos carriles.');
  });

  it('debería mostrar el contador de ciudadanos que coinciden', () => {
    create({ agreeCount: 42 });
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[data-testid="agree-count"]')?.textContent).toContain('42');
  });

  // ── Insignia de moderador ────────────────────────────────────────────────

  it('debería mostrar la insignia MODERADOR cuando el rol es "moderator"', () => {
    create({ role: 'moderator' });
    const badge = fixture.nativeElement.querySelector('[data-testid="moderator-badge"]');
    expect(badge).not.toBeNull();
  });

  it('no debería mostrar la insignia MODERADOR cuando el rol es "citizen"', () => {
    create({ role: 'citizen' });
    const badge = fixture.nativeElement.querySelector('[data-testid="moderator-badge"]');
    expect(badge).toBeNull();
  });

  it('no debería mostrar la insignia MODERADOR cuando el rol es "verified"', () => {
    create({ role: 'verified' });
    const badge = fixture.nativeElement.querySelector('[data-testid="moderator-badge"]');
    expect(badge).toBeNull();
  });

  it('debería mostrar el texto de usuario verificado en el subtítulo cuando el rol es "verified"', () => {
    create({ role: 'verified' });
    const subtitle = fixture.nativeElement.querySelector('[data-testid="role-subtitle"]') as HTMLElement;
    expect(subtitle.textContent).toContain('forum.message.role.verified');
  });

  // ── Botones deshabilitados ───────────────────────────────────────────────

  it('debería renderizar el botón de Confirmar deshabilitado', () => {
    create();
    const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    const confirm = Array.from(buttons).find(b => b.textContent?.includes('forum.message.confirm'));
    expect(confirm).not.toBeUndefined();
    expect(confirm?.disabled).toBe(true);
  });

  it('debería renderizar el botón de Reportar deshabilitado', () => {
    create();
    const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    const report = Array.from(buttons).find(b => b.textContent?.includes('forum.message.report'));
    expect(report).not.toBeUndefined();
    expect(report?.disabled).toBe(true);
  });

  // ── Tiempo relativo ──────────────────────────────────────────────────────

  it('debería mostrar "Hace X min" cuando han pasado menos de 60 minutos', () => {
    vi.useFakeTimers();
    const postedAt = new Date('2026-11-22T10:00:00');
    vi.setSystemTime(new Date('2026-11-22T10:30:00')); // 30 min después
    create({ postedAt });
    const subtitle = fixture.nativeElement.querySelector('[data-testid="role-subtitle"]') as HTMLElement;
    expect(subtitle.textContent).toContain('Hace 30 min');
  });

  it('debería mostrar "Hace X h" cuando han pasado 60+ minutos en el mismo día', () => {
    vi.useFakeTimers();
    const postedAt = new Date('2026-11-22T08:00:00');
    vi.setSystemTime(new Date('2026-11-22T11:00:00')); // 3 h después, mismo día
    create({ postedAt });
    const subtitle = fixture.nativeElement.querySelector('[data-testid="role-subtitle"]') as HTMLElement;
    expect(subtitle.textContent).toContain('Hace 3 h');
  });

  it('debería mostrar "Hace X d" cuando el día cambia', () => {
    vi.useFakeTimers();
    const postedAt = new Date('2026-11-21T10:00:00');
    vi.setSystemTime(new Date('2026-11-22T10:00:00')); // 1 día después
    create({ postedAt });
    const subtitle = fixture.nativeElement.querySelector('[data-testid="role-subtitle"]') as HTMLElement;
    expect(subtitle.textContent).toContain('Hace 1 d');
  });
});
