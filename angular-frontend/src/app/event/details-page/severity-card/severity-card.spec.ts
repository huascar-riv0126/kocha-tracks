import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeverityCard, Severity } from './severity-card';
import { setRequiredInputs } from '@testutils/set-required-inputs';
import { StringsServiceStub } from '@testutils/stubs'
import { StringsService } from '../../../core/strings/strings-service/strings-service';

describe('SeverityCard', () => {
  let component: SeverityCard;
  let fixture: ComponentFixture<SeverityCard>;

  const createWithSeverity = (severity: Severity) => {
    fixture = TestBed.createComponent(SeverityCard);
    component = fixture.componentInstance;
    setRequiredInputs(fixture, { severity });
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeverityCard],
      providers: [
        { provide: StringsService, useClass: StringsServiceStub }
      ],
    }).compileComponents();
  });

  it('should render the correct bar fill, width and aria value for "low"', () => {
    createWithSeverity('low');
    const el: HTMLElement = fixture.nativeElement;

    const track = el.querySelector('[role="progressbar"]') as HTMLElement;
    const fill = track.querySelector('div') as HTMLElement;

    expect(track.getAttribute('aria-valuenow')).toBe('4');
    expect(fill.style.width).toBe('4%');
    expect(fill.classList.contains('bg-[#10B981]')).toBe(true);
  });

  it('should render the correct bar fill, width and aria value for "mid"', () => {
    createWithSeverity('mid');
    const el: HTMLElement = fixture.nativeElement;

    const track = el.querySelector('[role="progressbar"]') as HTMLElement;
    const fill = track.querySelector('div') as HTMLElement;

    expect(track.getAttribute('aria-valuenow')).toBe('50');
    expect(fill.style.width).toBe('50%');
    expect(fill.classList.contains('bg-[#F5A54B]')).toBe(true);
  });

  it('should render the correct bar fill, width and aria value for "high"', () => {
    createWithSeverity('high');
    const el: HTMLElement = fixture.nativeElement;

    const track = el.querySelector('[role="progressbar"]') as HTMLElement;
    const fill = track.querySelector('div') as HTMLElement;

    expect(track.getAttribute('aria-valuenow')).toBe('100');
    expect(fill.style.width).toBe('100%');
    expect(fill.classList.contains('bg-[#EF4444]')).toBe(true);
  });

  it('should bold only the label matching the current severity', () => {
    createWithSeverity('mid');
    const el: HTMLElement = fixture.nativeElement;
    const labelEls = Array.from(el.querySelectorAll('p')) as HTMLElement[];

    const bold = labelEls.filter((p) => p.classList.contains('font-bold'));
    const semibold = labelEls.filter((p) => p.classList.contains('font-semibold'));

    expect(bold.length).toBe(1);
    expect(bold[0].textContent?.trim()).toBe('severity.mid');
    expect(semibold.map((p) => p.textContent?.trim())).toEqual(['severity.low', 'severity.high']);
  });
});
