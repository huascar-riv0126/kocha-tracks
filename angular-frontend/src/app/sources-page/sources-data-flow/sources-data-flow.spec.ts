import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SourcesDataFlow } from './sources-data-flow';

describe('SourcesDataFlow', () => {
  let component: SourcesDataFlow;
  let fixture: ComponentFixture<SourcesDataFlow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourcesDataFlow],
    }).compileComponents();

    fixture = TestBed.createComponent(SourcesDataFlow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
