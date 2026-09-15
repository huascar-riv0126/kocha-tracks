import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuggestionForm } from './suggestion-form';

describe('SuggestionForm', () => {
  let component: SuggestionForm;
  let fixture: ComponentFixture<SuggestionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuggestionForm],
    }).compileComponents();

    fixture = TestBed.createComponent(SuggestionForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
