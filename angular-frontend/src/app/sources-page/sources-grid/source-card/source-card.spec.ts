import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SourceCard } from './source-card';

describe('SourceCard', () => {
  let component: SourceCard;
  let fixture: ComponentFixture<SourceCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceCard],
    }).compileComponents();

    fixture = TestBed.createComponent(SourceCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Test source');
    fixture.componentRef.setInput('description', 'Test description');
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
