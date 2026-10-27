import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Navbar } from './navbar';
import { StringsService } from '../../core/strings/strings-service/strings-service';
import { getTranslocoTestingModule } from '../../testing/stubs';
import { TranslocoService } from '@jsverse/transloco';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;
  let translocoService: TranslocoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar, getTranslocoTestingModule()],
      providers: [
        provideRouter([]),
        { provide: StringsService, useValue: { get: (key: string) => key } },
      ],
    }).compileComponents();

    translocoService = TestBed.inject(TranslocoService);
    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should link Mapa to the /map route', () => {
    fixture.detectChanges();
    const links: HTMLAnchorElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.navbar-links a'),
    );
    const mapLink = links.find(link => link.getAttribute('href') === '/map');
    expect(mapLink).toBeTruthy();
  });

  it('should link Inicio to the landing root route', () => {
    fixture.detectChanges();
    const links: HTMLAnchorElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.navbar-links a'),
    );
    const homeLink = links.find(link => link.getAttribute('href') === '/');
    expect(homeLink).toBeTruthy();
  });

  it('should change language dynamically when changeLang is called', () => {
    component.changeLang('en');
    expect(translocoService.getActiveLang()).toBe('en');
    expect(component.currentLang()).toBe('en');

    component.changeLang('es');
    expect(translocoService.getActiveLang()).toBe('es');
    expect(component.currentLang()).toBe('es');
  });
});
