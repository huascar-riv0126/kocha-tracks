import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuggestionForm } from './suggestion-form';
import { StringsService } from '../../../core/strings/strings-service/strings-service';
import { StringsServiceStub } from '@testutils/stubs';

describe('SuggestionForm', () => {
  let component: SuggestionForm;
  let fixture: ComponentFixture<SuggestionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuggestionForm],
      providers: [
        { provide: StringsService, useClass: StringsServiceStub },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SuggestionForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
