import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingFeatures } from './landing-features';
import { StringsService } from '../../core/strings/strings-service/strings-service';

describe('LandingFeatures', () => {
  let component: LandingFeatures;
  let fixture: ComponentFixture<LandingFeatures>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingFeatures],
      providers: [{ provide: StringsService, useValue: { get: (key: string) => key } }],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingFeatures);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reuse info cards for the three features', () => {
    const cards = fixture.nativeElement.querySelectorAll('app-info-card');
    expect(cards.length).toBe(3);
  });
});
