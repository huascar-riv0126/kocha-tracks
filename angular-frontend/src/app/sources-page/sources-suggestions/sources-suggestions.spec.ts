import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SourcesSuggestions } from './sources-suggestions';
import { SuggestionForm } from './suggestion-form/suggestion-form';
import { StringsService } from '../../core/strings/strings-service/strings-service';
import { StringsServiceStub } from '@testutils/stubs';

describe('SourcesSuggestions', () => {
  let component: SourcesSuggestions;
  let fixture: ComponentFixture<SourcesSuggestions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourcesSuggestions],
      providers: [
        { provide: StringsService, useClass: StringsServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SourcesSuggestions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the app-suggestion-form component', () => {
    const formSection = fixture.debugElement.query(By.directive(SuggestionForm));
    expect(formSection).toBeTruthy();
  });
});
