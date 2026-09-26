import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingPage } from './landing-page';
import { StringsService } from '../core/strings/strings-service/strings-service';

describe('LandingPage', () => {
  let component: LandingPage;
  let fixture: ComponentFixture<LandingPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingPage],
      providers: [{ provide: StringsService, useValue: { get: (key: string) => key } }],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compose hero, map, features, steps and cta like the Figma', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('app-landing-hero')).toBeTruthy();
    expect(el.querySelector('app-landing-map')).toBeTruthy();
    expect(el.querySelector('app-landing-features')).toBeTruthy();
    expect(el.querySelector('app-landing-steps')).toBeTruthy();
    expect(el.querySelector('app-landing-cta')).toBeTruthy();
  });
});
