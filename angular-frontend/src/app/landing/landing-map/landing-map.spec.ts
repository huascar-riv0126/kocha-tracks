import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingMap } from './landing-map';
import { StringsService } from '../../core/strings/strings-service/strings-service';

describe('LandingMap', () => {
  let component: LandingMap;
  let fixture: ComponentFixture<LandingMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingMap],
      providers: [{ provide: StringsService, useValue: { get: (key: string) => key } }],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingMap);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should embed the interactive map', () => {
    const map = fixture.nativeElement.querySelector('app-map-view');
    expect(map).toBeTruthy();
  });
});
