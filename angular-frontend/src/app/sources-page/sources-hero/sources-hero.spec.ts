import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SourcesHero } from './sources-hero';

describe('SourcesHero', () => {
  let component: SourcesHero;
  let fixture: ComponentFixture<SourcesHero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourcesHero],
    }).compileComponents();

    fixture = TestBed.createComponent(SourcesHero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
