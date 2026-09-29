import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { LandingHero } from './landing-hero';
import { StringsService } from '../../core/strings/strings-service/strings-service';

describe('LandingHero', () => {
  let component: LandingHero;
  let fixture: ComponentFixture<LandingHero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingHero],
      providers: [{ provide: StringsService, useValue: { get: (key: string) => key } }],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingHero);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should scroll to mapa section on primary action (HU-4)', () => {
    const target = document.createElement('div');
    target.id = 'mapa';
    target.scrollIntoView = (() => undefined) as unknown as typeof target.scrollIntoView;
    document.body.appendChild(target);
    const spy = vi.spyOn(target, 'scrollIntoView');
    component.scrollTo('mapa');
    expect(spy).toHaveBeenCalled();
    target.remove();
  });
});
