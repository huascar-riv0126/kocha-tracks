import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SourcesSuggestions } from './sources-suggestions';

describe('SourcesSuggestions', () => {
  let component: SourcesSuggestions;
  let fixture: ComponentFixture<SourcesSuggestions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourcesSuggestions],
    }).compileComponents();

    fixture = TestBed.createComponent(SourcesSuggestions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
