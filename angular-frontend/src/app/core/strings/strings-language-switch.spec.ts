import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideTransloco, TranslocoPipe } from '@jsverse/transloco';
import { LanguageToggle } from '../../shared/language-toggle/language-toggle';
import { TranslocoHttpLoader } from '../../transloco-loader';
import { GetStringsPipe } from './get-strings-pipe';
import { STRINGS_LOADER } from './strings-token';
import { StringsService } from './strings-service/strings-service';

@Component({
  imports: [LanguageToggle, TranslocoPipe, GetStringsPipe],
  template: `
    <app-language-toggle />
    <nav>{{ 'navbar.home' | transloco }}</nav>
    <h1>{{ 'sources.hero.title' | getStrings }}</h1>
  `,
})
class LanguageSwitchHost {}

describe('Language switching with a dictionary loaded over HTTP', () => {
  let fixture: ComponentFixture<LanguageSwitchHost>;
  let http: HttpTestingController;

  const es = {
    'navbar.home': 'Inicio',
    'sources.hero.title': 'Fuentes de Datos sobre los eventos',
  };
  const en = {
    'navbar.home': 'Home',
    'sources.hero.title': 'Event Data Sources',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageSwitchHost],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTransloco({
          config: {
            availableLangs: ['es', 'en'],
            defaultLang: 'es',
            reRenderOnLangChange: true,
            prodMode: true,
          },
          loader: TranslocoHttpLoader,
        }),
        { provide: STRINGS_LOADER, useValue: () => Promise.resolve(es) },
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    await TestBed.inject(StringsService).load();
    fixture = TestBed.createComponent(LanguageSwitchHost);
    fixture.detectChanges();
    http.expectOne('/i18n/es.json').flush(es);
    await fixture.whenStable();
  });

  afterEach(() => {
    http.verify();
  });

  it('updates both translation pipes after the first switch to English finishes loading', async () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('nav')?.textContent).toBe('Inicio');
    expect(el.querySelector('h1')?.textContent).toBe('Fuentes de Datos sobre los eventos');

    el.querySelector('button')!.click();
    fixture.detectChanges();
    http.expectOne('/i18n/en.json').flush(en);
    await fixture.whenStable();

    expect(el.querySelector('nav')?.textContent).toBe('Home');
    expect(el.querySelector('h1')?.textContent).toBe('Event Data Sources');
  });

  it('keeps both pipes in sync on subsequent switches using cached dictionaries', async () => {
    const el: HTMLElement = fixture.nativeElement;
    const toggle = el.querySelector('button')!;
    toggle.click();
    fixture.detectChanges();
    http.expectOne('/i18n/en.json').flush(en);
    await fixture.whenStable();

    toggle.click();
    await fixture.whenStable();
    http.expectNone('/i18n/es.json');
    expect(el.querySelector('nav')?.textContent).toBe('Inicio');
    expect(el.querySelector('h1')?.textContent).toBe('Fuentes de Datos sobre los eventos');

    toggle.click();
    await fixture.whenStable();
    http.expectNone('/i18n/en.json');
    expect(el.querySelector('nav')?.textContent).toBe('Home');
    expect(el.querySelector('h1')?.textContent).toBe('Event Data Sources');
  });

  it('keeps Spanish selected when an earlier English request finishes later', async () => {
    const el: HTMLElement = fixture.nativeElement;
    const toggle = el.querySelector('button')!;
    toggle.click();
    fixture.detectChanges();
    const englishRequest = http.expectOne('/i18n/en.json');

    toggle.click();
    fixture.detectChanges();
    englishRequest.flush(en);
    await fixture.whenStable();

    expect(toggle.textContent?.trim()).toBe('ES');
    expect(el.querySelector('nav')?.textContent).toBe('Inicio');
    expect(el.querySelector('h1')?.textContent).toBe('Fuentes de Datos sobre los eventos');
  });
});
