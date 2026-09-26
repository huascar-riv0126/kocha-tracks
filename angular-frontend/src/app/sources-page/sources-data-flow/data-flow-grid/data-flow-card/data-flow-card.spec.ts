import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataFlowCard } from './data-flow-card';
import { setRequiredInputs } from '@testutils/set-required-inputs';

const testInputs = {
  number: '1',
  title: 'Test Card',
  description: 'Test Description',
};

describe('DataFlowCard', () => {
  let component: DataFlowCard;
  let fixture: ComponentFixture<DataFlowCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataFlowCard],
    }).compileComponents();

    fixture = TestBed.createComponent(DataFlowCard);
    component = fixture.componentInstance;
    setRequiredInputs(fixture, testInputs);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the number, title and description', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[testid="step-number"]')?.textContent?.trim()).toBe(String(testInputs.number));
    expect(el.querySelector('[testid="step-title"]')?.textContent?.trim()).toBe(testInputs.title);
    expect(el.querySelector('[testid="step-description"]')?.textContent?.trim()).toBe(testInputs.description);
  });
});
