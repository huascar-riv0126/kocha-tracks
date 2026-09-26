import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingCta } from './landing-cta';
import { StringsService } from '../../core/strings/strings-service/strings-service';

describe('LandingCta', () => {
  let component: LandingCta;
  let fixture: ComponentFixture<LandingCta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingCta],
      providers: [{ provide: StringsService, useValue: { get: (key: string) => key } }],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingCta);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
