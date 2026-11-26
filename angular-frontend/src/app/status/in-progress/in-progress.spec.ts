
import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import {
  TranslocoService,
  TranslocoTestingModule,
} from '@jsverse/transloco';
import { vi } from 'vitest';

import { InProgress } from './in-progress';

const es = {
  'inProgress.badge': 'En construcción',
  'inProgress.title': 'Estamos preparando este espacio',
  'inProgress.description':
    'Esta página o funcionalidad sigue en desarrollo. Estamos trabajando para que pronto puedas utilizarla.',
  'inProgress.home': 'Volver al inicio',
  'inProgress.back': 'Volver atrás',
  'inProgress.note.title':
    'No necesitas hacer nada por ahora.',
  'inProgress.note.description':
    'Puedes seguir utilizando el resto de la aplicación con normalidad.',
};

const en = {
  'inProgress.badge': 'Under construction',
  'inProgress.title': 'We are preparing this space',
  'inProgress.description':
    'This page or feature is still under development. We are working to make it available soon.',
  'inProgress.home': 'Back to home',
  'inProgress.back': 'Go back',
  'inProgress.note.title':
    'You do not need to do anything for now.',
  'inProgress.note.description':
    'You can continue using the rest of the application normally.',
};

describe('UH-53 - InProgress UI/UX', () => {
  let fixture: ComponentFixture<InProgress>;
  let component: InProgress;
  let root: HTMLElement;
  let router: Router;

  const locationMock = {
    getState: vi.fn<() => unknown>(),
    back: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    locationMock.getState.mockReturnValue({
      navigationId: 1,
    });

    await TestBed.configureTestingModule({
      imports: [
        InProgress,
        TranslocoTestingModule.forRoot({
          langs: { es, en },
          translocoConfig: {
            availableLangs: ['es', 'en'],
            defaultLang: 'es',
            reRenderOnLangChange: true,
          },
          preloadLangs: true,
        }),
      ],
      providers: [
        provideRouter([]),
        {
          provide: Location,
          useValue: locationMock,
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(InProgress);
    component = fixture.componentInstance;
    root = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the main card', () => {
    expect(
      root.querySelector('[data-testid="in-progress-card"]')
    ).toBeTruthy();
  });

  it('should render the construction icon', () => {
    expect(
      root.querySelector(
        '[data-testid="in-progress-icon"] svg'
      )
    ).toBeTruthy();
  });

  it('should show the construction badge', () => {
    const badge = root.querySelector(
      '[data-testid="in-progress-badge"]'
    );

    expect(badge?.textContent).toContain(
      'En construcción'
    );
  });

  it('should render the prototype title', () => {
    const title = root.querySelector(
      '[data-testid="in-progress-title"]'
    );

    expect(title?.textContent?.trim()).toBe(
      'Estamos preparando este espacio'
    );
  });

  it('should render the development description', () => {
    const description = root.querySelector(
      '[data-testid="in-progress-description"]'
    );

    expect(description?.textContent).toContain(
      'sigue en desarrollo'
    );
  });

  it('should show the informational footer', () => {
    expect(
      root.querySelector(
        '[data-testid="in-progress-note-title"]'
      )?.textContent
    ).toContain('No necesitas hacer nada por ahora');

    expect(
      root.querySelector(
        '[data-testid="in-progress-note-description"]'
      )?.textContent
    ).toContain('resto de la aplicación');
  });

  it('should have a home link to the root route', () => {
    const link = root.querySelector<HTMLAnchorElement>(
      '[data-testid="in-progress-home"]'
    );

    expect(link).toBeTruthy();
    expect(link?.getAttribute('href')).toBe('/');
  });

  it('should render the back button', () => {
    const button = root.querySelector<HTMLButtonElement>(
      '[data-testid="in-progress-back"]'
    );

    expect(button).toBeTruthy();
    expect(button?.type).toBe('button');
  });

  it('should go back when a previous navigation exists', () => {
    locationMock.getState.mockReturnValue({
      navigationId: 3,
    });

    const button = root.querySelector<HTMLButtonElement>(
      '[data-testid="in-progress-back"]'
    )!;

    button.click();

    expect(locationMock.back).toHaveBeenCalledTimes(1);
  });

  it('should go home on direct access', () => {
    locationMock.getState.mockReturnValue({
      navigationId: 1,
    });

    const navigateSpy = vi.spyOn(
      router,
      'navigateByUrl'
    ).mockResolvedValue(true);

    root.querySelector<HTMLButtonElement>(
      '[data-testid="in-progress-back"]'
    )!.click();

    expect(navigateSpy).toHaveBeenCalledWith('/');
    expect(locationMock.back).not.toHaveBeenCalled();
  });

  it('should use translated Spanish texts', () => {
    expect(
      root.querySelector('h1')?.textContent
    ).toContain('Estamos preparando este espacio');

    expect(
      root.querySelector(
        '[data-testid="in-progress-home"]'
      )?.textContent
    ).toContain('Volver al inicio');

    expect(
      root.querySelector(
        '[data-testid="in-progress-back"]'
      )?.textContent
    ).toContain('Volver atrás');
  });

  it('should translate the interface into English', async () => {
    TestBed.inject(TranslocoService)
      .setActiveLang('en');

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(root.querySelector('h1')?.textContent)
      .toContain('We are preparing this space');

    expect(
      root.querySelector(
        '[data-testid="in-progress-badge"]'
      )?.textContent
    ).toContain('Under construction');

    expect(
      root.querySelector(
        '[data-testid="in-progress-home"]'
      )?.textContent
    ).toContain('Back to home');

    expect(
      root.querySelector(
        '[data-testid="in-progress-back"]'
      )?.textContent
    ).toContain('Go back');
  });

  it('should not show untranslated keys', () => {
    expect(root.textContent).not.toContain(
      'inProgress.title'
    );

    expect(root.textContent).not.toContain(
      'inProgress.description'
    );
  });
});
