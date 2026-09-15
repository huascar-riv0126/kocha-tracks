import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SourcesGrid } from './sources-grid';

describe('SourcesGrid', () => {
  let component: SourcesGrid;
  let fixture: ComponentFixture<SourcesGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourcesGrid],
    }).compileComponents();

    fixture = TestBed.createComponent(SourcesGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
