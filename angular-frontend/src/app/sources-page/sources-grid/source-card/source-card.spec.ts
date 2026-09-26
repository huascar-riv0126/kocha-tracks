import { ComponentFixture, TestBed } from '@angular/core/testing';
import { setRequiredInputs } from '@testutils/set-required-inputs';
import { SourceCard } from './source-card';

const testInputs = {
  title: 'Test Card',
  linkHref: 'www.example.com',
  description: 'Test Description',
};

describe('SourceCard', () => {
  let component: SourceCard;
  let fixture: ComponentFixture<SourceCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceCard],
    }).compileComponents();

    fixture = TestBed.createComponent(SourceCard);
    component = fixture.componentInstance;
    setRequiredInputs(fixture, testInputs);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title and description', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h3')?.textContent?.trim()).toBe(testInputs.title);
    expect(el.querySelector('p')?.textContent?.trim()).toBe(testInputs.description);
  });
  
  it('should set the link href and open in a new tab', () => {
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    expect(link.getAttribute('href')).toBe(testInputs.linkHref);
    expect(link.getAttribute('target')).toBe('_blank');
  });
});
