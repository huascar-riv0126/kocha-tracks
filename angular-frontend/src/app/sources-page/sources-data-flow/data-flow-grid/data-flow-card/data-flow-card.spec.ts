import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataFlowCard } from './data-flow-card';

describe('DataFlowCard', () => {
  let component: DataFlowCard;
  let fixture: ComponentFixture<DataFlowCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataFlowCard],
    }).compileComponents();

    fixture = TestBed.createComponent(DataFlowCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('number', '01');
    fixture.componentRef.setInput('title', 'Test step');
    fixture.componentRef.setInput('description', 'Test description');
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
