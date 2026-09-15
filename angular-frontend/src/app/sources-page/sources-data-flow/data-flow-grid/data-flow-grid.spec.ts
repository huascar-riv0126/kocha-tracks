import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataFlowGrid } from './data-flow-grid';

describe('DataFlowGrid', () => {
  let component: DataFlowGrid;
  let fixture: ComponentFixture<DataFlowGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataFlowGrid],
    }).compileComponents();

    fixture = TestBed.createComponent(DataFlowGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
