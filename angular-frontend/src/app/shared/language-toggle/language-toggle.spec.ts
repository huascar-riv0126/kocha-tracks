import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageToggle } from './language-toggle';
import { getTranslocoTestingModule } from '@testutils/stubs';
import { TranslocoService } from '@jsverse/transloco';
import { StringsService } from '../../core/strings/strings-service/strings-service';

describe('LanguageToggle', () => {
  let component: LanguageToggle;
  let fixture: ComponentFixture<LanguageToggle>;
  let translocoService: TranslocoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageToggle, getTranslocoTestingModule()],
      providers: [
        { provide: StringsService, useValue: { get: (key: string) => key } }
      ]
    }).compileComponents();

    translocoService = TestBed.inject(TranslocoService);
    fixture = TestBed.createComponent(LanguageToggle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change language dynamically when changeLang is called', () => {
    component.toggleLang();
    expect(translocoService.getActiveLang()).toBe('en');
    expect(component.currentLang()).toBe('en');

    component.toggleLang();
    expect(translocoService.getActiveLang()).toBe('es');
    expect(component.currentLang()).toBe('es');
  });
});
