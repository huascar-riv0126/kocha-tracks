import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventDetailsPage } from './details-page';
import { EventMock } from '../event-mock.model';
import { StringsService } from '../../core/strings/strings-service/strings-service';
import { StringsServiceStub } from '@testutils/stubs';
import { setRequiredInputs } from '@testutils/set-required-inputs';
import { DetailsCard } from './details-card/details-card';
import { By } from '@angular/platform-browser';
import { SeverityCard } from './severity-card/severity-card';
import { ActionsCard } from './actions-card/actions-card';

const testEvent: EventMock = {
  id: 1,
  title: 'Test Event',
  coordinates: [-17.4000, -66.1400],
  state: 'activo',
  elapsedTime: '10 minutes',
  severity: 'low',
  type: 'Test',
  location: 'Location for test',
  description: 'Description for test',
  startDate: new Date('2026-10-01T13:45:00-04:00')
} as EventMock;

describe('EventDetailsPage', () => {
  let component: EventDetailsPage;
  let fixture: ComponentFixture<EventDetailsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventDetailsPage],
      providers: [{ provide: StringsService, useClass: StringsServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(EventDetailsPage);
    setRequiredInputs(fixture, { event: testEvent });
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the event received through the required input', () => {
    expect(component.event()).toEqual(testEvent);
  });
  
  it('should render its 3 sub-components', () => {
    expect(fixture.debugElement.query(By.directive(DetailsCard))).not.toBeNull();
    expect(fixture.debugElement.query(By.directive(SeverityCard))).not.toBeNull();
    expect(fixture.debugElement.query(By.directive(ActionsCard))).not.toBeNull();
  });
  
  it('should pass the event to the details card', () => {
    const detailsCard = fixture.debugElement.query(By.directive(DetailsCard))
      .componentInstance as DetailsCard;
  
    expect(detailsCard.event()).toEqual(testEvent);
  });
  
  it('should pass the event severity to the severity card', () => {
    const severityCard = fixture.debugElement.query(By.directive(SeverityCard))
      .componentInstance as SeverityCard;
  
    expect(severityCard.severity()).toBe(testEvent.severity);
  });
});
