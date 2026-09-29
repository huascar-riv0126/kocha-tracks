import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DataFlowGrid } from './data-flow-grid';
import { DataFlowCard } from './data-flow-card/data-flow-card';
import { StringsService } from '../../../core/strings/strings-service/strings-service';
import { StringsServiceStub } from '@testutils/stubs';

describe('DataFlowGrid', () => {
  let component: DataFlowGrid;
  let fixture: ComponentFixture<DataFlowGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataFlowGrid],
      providers: [
        { provide: StringsService, useClass: StringsServiceStub },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DataFlowGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render 3 step cards', () => {
    const cards = fixture.debugElement.queryAll(By.directive(DataFlowCard));
    expect(cards.length).toBe(3);
  });
});
