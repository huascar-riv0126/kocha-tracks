
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { LandingCta } from './landing-cta';
import { StringsService } from '../../core/strings/strings-service/strings-service';
import { getTranslocoTestingModule } from '../../testing/stubs';

describe('LandingCta', () => {
  let component: LandingCta;
  let fixture: ComponentFixture<LandingCta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LandingCta,
        getTranslocoTestingModule(),
      ],
      providers: [
        provideRouter([]),
        {
          provide: StringsService,
          useValue: {
            get: (key: string) => key,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingCta);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should link the signup button to register', () => {
    const el: HTMLElement = fixture.nativeElement;

    const registerLink = el.querySelector(
      'a[routerLink="/register"]'
    ) as HTMLAnchorElement | null;

    expect(registerLink).toBeTruthy();
    expect(registerLink?.getAttribute('href')).toBe('/register');
  });
});
