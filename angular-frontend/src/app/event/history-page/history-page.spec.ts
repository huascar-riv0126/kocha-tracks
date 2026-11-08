import { ApplicationRef, PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import {
  TRANSLOCO_LOADER,
  Translation,
  TranslocoService,
  provideTransloco,
  provideTranslocoConfig,
} from '@jsverse/transloco';
import { routes } from '../../app.routes';
import { getTranslocoTestingModule } from '@testutils/stubs';
import { EventMockService } from '../event-mock';
import { EventHistoryPage } from './history-page';
import es from '../../../../public/i18n/es.json';
import en from '../../../../public/i18n/en.json';

describe('EventHistoryPage navigation', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule({ es, en })],
      providers: [
        provideRouter(routes, withComponentInputBinding()),
        provideTranslocoConfig({
          availableLangs: ['es', 'en'],
          defaultLang: 'es',
          reRenderOnLangChange: true,
        }),
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    }).compileComponents();
    harness = await RouterTestingHarness.create();
  });

  it('opens the history of the resolved event directly', async () => {
    await harness.navigateByUrl('/evento/1/historial');

    const page = harness.routeNativeElement!;
    expect(page.tagName.toLowerCase()).toBe('app-event-history-page');
    expect(page.textContent).toContain('Bloqueo en Av. Blanco Galindo Km 3');
    expect(page.querySelector('app-event-history')).toBeTruthy();
  });

  it('shows the event summary, related sources, help and example changes together', async () => {
    await harness.navigateByUrl('/evento/1/historial');

    const page = harness.routeNativeElement!;
    expect(page.querySelectorAll('app-event-change-row').length).toBe(2);
    expect(page.querySelector('app-history-event-card')).toBeTruthy();
    expect(page.querySelector('app-history-sources-card')).toBeTruthy();
    expect(page.querySelector('app-history-help-card')).toBeTruthy();
    expect(page.textContent).toContain('Datos de ejemplo');
  });

  it('lets the user reverse the example timeline chronologically', async () => {
    await harness.navigateByUrl('/evento/1/historial');
    const page = harness.routeNativeElement!;
    const titles = () =>
      Array.from(page.querySelectorAll('app-event-change-row h3'), (row) =>
        row.textContent!.trim(),
      );

    expect(titles()).toEqual(['Actualización de afectación', 'Publicación inicial']);

    page.querySelector<HTMLButtonElement>('app-event-history button')!.click();
    await harness.fixture.whenStable();

    expect(titles()).toEqual(['Publicación inicial', 'Actualización de afectación']);
    expect(page.textContent).toContain('Más antiguos primero');
  });

  it('updates the summary, changes and related newsrooms when the event id changes', async () => {
    await harness.navigateByUrl('/evento/1/historial');
    await harness.navigateByUrl('/evento/2/historial');

    const page = harness.routeNativeElement!;
    expect(page.textContent).toContain('Mantenimiento en Av. América');
    expect(page.textContent).not.toContain('Bloqueo en Av. Blanco Galindo');
    expect(page.querySelector('app-event-change-row h3')!.textContent).toContain(
      'Evento finalizado',
    );
    const sources = page.querySelector('app-history-sources-card')!;
    expect(sources.querySelector('a[href="https://unitel.bo/"]')).toBeTruthy();
    expect(sources.querySelector('a[href="https://www.opinion.com.bo/cochabamba/"]')).toBeTruthy();
    expect(sources.textContent).not.toContain('ATB');
    expect(sources.querySelector('a[href="/evento/2/detalles"]')).toBeTruthy();
  });

  it('does not invent news links for a mock event with only local user reports', async () => {
    await harness.navigateByUrl('/evento/1/historial');

    const sources = harness.routeNativeElement!.querySelector('app-history-sources-card')!;
    expect(sources.querySelectorAll('a[target="_blank"]').length).toBe(0);
    expect(sources.querySelector('a[href="/evento/1/detalles"]')).toBeTruthy();
  });

  it('shows the empty state for an existing event without example revisions', async () => {
    const events = TestBed.inject(EventMockService);
    events.addEvent({ ...events.getEvent(1)!, id: 99, title: 'Nuevo evento sin revisiones' });

    await harness.navigateByUrl('/evento/99/historial');

    const page = harness.routeNativeElement!;
    expect(page.textContent).toContain('Nuevo evento sin revisiones');
    expect(page.textContent).toContain('No hay cambios registrados.');
    expect(page.querySelectorAll('app-event-change-row').length).toBe(0);
    expect(page.querySelectorAll('app-history-sources-card a[target="_blank"]').length).toBe(0);
  });

  it('translates page content and example revisions without losing the selected order', async () => {
    await harness.navigateByUrl('/evento/1/historial');
    const page = harness.routeNativeElement!;
    page.querySelector<HTMLButtonElement>('app-event-history button')!.click();
    await harness.fixture.whenStable();

    TestBed.inject(TranslocoService).setActiveLang('en');
    await harness.fixture.whenStable();

    expect(page.querySelector('h1')!.textContent).toBe('Event history');
    expect(page.textContent).toContain('Example data:');
    expect(page.textContent).toContain('Oldest first');
    expect(
      Array.from(page.querySelectorAll('app-event-change-row h3'), (row) =>
        row.textContent!.trim(),
      ),
    ).toEqual(['Initial report', 'Impact update']);
    expect(page.textContent).not.toContain('Publicación inicial');
  });

  it('opens history from event details and links back to the same event', async () => {
    await harness.navigateByUrl('/evento/2/detalles');
    const historyLink = harness.routeNativeElement!.querySelector<HTMLAnchorElement>(
      'a[href="/evento/2/historial"]',
    )!;
    expect(historyLink).toBeTruthy();
    historyLink.click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(TestBed.inject(Router).url).toBe('/evento/2/historial');
    expect(harness.routeNativeElement!.tagName.toLowerCase()).toBe('app-event-history-page');
    harness
      .routeNativeElement!.querySelector<HTMLAnchorElement>(
        'app-history-sources-card a[href="/evento/2/detalles"]',
      )!
      .click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(TestBed.inject(Router).url).toBe('/evento/2/detalles');
    expect(harness.routeNativeElement!.tagName.toLowerCase()).toBe('app-event-details-page');
  });

  for (const id of ['abc', '0', '999']) {
    it(`redirects an invalid or unknown event ${id} to the existing 404 page`, async () => {
      await harness.navigateByUrl(`/evento/${id}/historial`);

      expect(harness.routeNativeElement!.tagName.toLowerCase()).toBe('app-not-found');
      expect(harness.routeNativeElement!.textContent).toContain('Página no encontrada');
      expect(TestBed.inject(Router).url).toBe('/404');
    });
  }
});

describe('EventHistoryPage asynchronous translations', () => {
  it('keeps rendering pending until the initial dictionary and timeline are ready', async () => {
    let resolveDictionary!: (dictionary: Translation) => void;
    const dictionary = new Promise<Translation>((resolve) => {
      resolveDictionary = resolve;
    });

    await TestBed.configureTestingModule({
      imports: [EventHistoryPage],
      providers: [
        provideRouter([]),
        provideTransloco({
          config: { availableLangs: ['es', 'en'], defaultLang: 'es', prodMode: true },
        }),
        { provide: TRANSLOCO_LOADER, useValue: { getTranslation: () => dictionary } },
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(EventHistoryPage);
    fixture.componentRef.setInput('event', TestBed.inject(EventMockService).getEvent(1)!);
    fixture.detectChanges();

    let stableWhileDictionaryIsLoading = false;
    const stability = TestBed.inject(ApplicationRef).isStable.subscribe((stable) => {
      stableWhileDictionaryIsLoading = stable;
    });
    // Let Angular finish scheduled rendering, while the external loader remains unresolved.
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    const prematurelyStable = stableWhileDictionaryIsLoading;

    resolveDictionary(es);
    await fixture.whenStable();
    stability.unsubscribe();

    expect(prematurelyStable).toBe(false);
    expect(fixture.nativeElement.querySelector('h1').textContent).toBe('Historial del evento');
    expect(fixture.nativeElement.textContent).toContain('Datos de ejemplo');
    expect(fixture.nativeElement.querySelectorAll('app-event-change-row').length).toBe(2);
  });
});
