import { TestBed } from '@angular/core/testing';
import { StringsService } from './strings-service/strings-service';
import { GetStringsPipe } from './get-strings-pipe';
import { TranslocoService } from '@jsverse/transloco';
import { getTranslocoTestingModule } from '../../testing/stubs';
import { StringsFallbackMissingHandler } from './strings-fallback-missing-handler';

describe('StringsService <-> Transloco 2-Bridge System', () => {
  let stringsService: StringsService;
  let translocoService: TranslocoService;
  let getStringsPipe: GetStringsPipe;
  let missingHandler: StringsFallbackMissingHandler;

  const esTranslations = {
    'landing.hero.title': 'Monitorea rutas bloqueadas',
    'navbar.home': 'Inicio',
    'legacy.only.key': 'Texto solo en legacy',
  };

  const enTranslations = {
    'landing.hero.title': 'Monitor blocked routes',
    'navbar.home': 'Home',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        getTranslocoTestingModule({
          es: esTranslations,
          en: enTranslations,
        }),
      ],
      providers: [
        StringsService,
        GetStringsPipe,
        StringsFallbackMissingHandler,
      ],
    }).compileComponents();

    stringsService = TestBed.inject(StringsService);
    translocoService = TestBed.inject(TranslocoService);
    getStringsPipe = TestBed.inject(GetStringsPipe);
    missingHandler = TestBed.inject(StringsFallbackMissingHandler);
  });

  it('Bridge 1: StringsService.get() dynamically reflects Transloco active language', () => {
    translocoService.setActiveLang('es');
    expect(stringsService.get('navbar.home')).toBe('Inicio');
    expect(getStringsPipe.transform('navbar.home')).toBe('Inicio');

    translocoService.setActiveLang('en');
    expect(stringsService.get('navbar.home')).toBe('Home');
    expect(getStringsPipe.transform('navbar.home')).toBe('Home');
  });

  it('Bridge 1: StringsService signal updates when Transloco language changes', () => {
    translocoService.setActiveLang('es');
    expect(stringsService.strings()['landing.hero.title']).toBe('Monitorea rutas bloqueadas');

    translocoService.setActiveLang('en');
    expect(stringsService.strings()['landing.hero.title']).toBe('Monitor blocked routes');
  });

  it('Bridge 2: Transloco missing handler falls back to StringsService store when key is absent in Transloco', () => {
    // Simulate legacy strings having a key not in Transloco's active dictionary
    (stringsService as any)._strings.set({
      'legacy.only.key': 'Texto legacy recuperado',
    });

    const result = missingHandler.handle('legacy.only.key', {
      activeLang: 'es',
      defaultLang: 'es',
      reRenderOnLangChange: true,
      prodMode: false,
      failedRetries: 2,
      availableLangs: ['es', 'en'],
      missingHandler: { logMissingKey: false, useFallbackTranslation: false, allowEmpty: false },
      flatten: { aot: false },
      interpolation: ['{{', '}}'],
      scopes: { keepCasing: false, autoPrefixKeys: true },
    });

    expect(result).toBe('Texto legacy recuperado');
  });

  it('Bridge 2: Missing handler returns the key itself if neither Transloco nor StringsService has it', () => {
    const result = missingHandler.handle('unknown.key', {
      activeLang: 'es',
      defaultLang: 'es',
      reRenderOnLangChange: true,
      prodMode: false,
      failedRetries: 2,
      availableLangs: ['es', 'en'],
      missingHandler: { logMissingKey: false, useFallbackTranslation: false, allowEmpty: false },
      flatten: { aot: false },
      interpolation: ['{{', '}}'],
      scopes: { keepCasing: false, autoPrefixKeys: true },
    });

    expect(result).toBe('unknown.key');
  });
});
