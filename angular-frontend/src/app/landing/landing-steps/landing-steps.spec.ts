import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingSteps } from './landing-steps';
import { StringsService } from '../../core/strings/strings-service/strings-service';

describe('LandingSteps', () => {
  let component: LandingSteps;
  let fixture: ComponentFixture<LandingSteps>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingSteps],
      providers: [{ provide: StringsService, useValue: { get: (key: string) => key } }],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingSteps);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reuse data-flow cards for the three steps', () => {
    const cards = fixture.nativeElement.querySelectorAll('app-data-flow-card');
    expect(cards.length).toBe(3);
  });
});
