import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { setRequiredInputs } from '@testutils/set-required-inputs';
import { StringsService } from '../../../core/strings/strings-service/strings-service';
import { StringsServiceStub } from '@testutils/stubs';
import { ZoneCard } from './zone-card';
import { Zone } from '../zone.model';

const radioZone: Zone = {
  id: 1,
  name: 'Mi casa - Zona Norte',
  type: 'radio',
  radiusMeters: 1500,
  activeEventsCount: 3,
};

const polygonZone: Zone = {
  id: 2,
  name: 'Trabajo - Av. América',
  type: 'polygon',
  activeEventsCount: 1,
};

const emptyZone: Zone = {
  id: 3,
  name: 'Universidad UMSS',
  type: 'radio',
  radiusMeters: 2000,
  activeEventsCount: 0,
};

describe('ZoneCard', () => {
  let component: ZoneCard;
  let fixture: ComponentFixture<ZoneCard>;

  async function setup(zone: Zone, selected = false, editing = false) {
    await TestBed.configureTestingModule({
      imports: [ZoneCard],
      providers: [{ provide: StringsService, useClass: StringsServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(ZoneCard);
    component = fixture.componentInstance;
    setRequiredInputs(fixture, { zone, selected, editing });
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    TestBed.resetTestingModule();
    await setup(radioZone);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the zone name', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[data-testid="zone-card-title"]')?.textContent?.trim()).toBe(
      radioZone.name,
    );
  });

  it('should render radio subtitle with formatted radius', () => {
    const el: HTMLElement = fixture.nativeElement;
    const subtitle = el
      .querySelector('[data-testid="zone-card-subtitle"]')
      ?.textContent?.replace(/\s+/g, ' ')
      .trim();
    expect(subtitle).toContain('1.5 km');
  });

  it('should render polygon subtitle', async () => {
    TestBed.resetTestingModule();
    await setup(polygonZone);
    const el: HTMLElement = fixture.nativeElement;
    const subtitle = el
      .querySelector('[data-testid="zone-card-subtitle"]')
      ?.textContent?.replace(/\s+/g, ' ')
      .trim();
    expect(subtitle).toContain('zones.type.custom');
    expect(subtitle).toContain('zones.type.polygon');
  });

  it('should show active events count when there are events', () => {
    const el: HTMLElement = fixture.nativeElement;
    const status = el.querySelector('[data-testid="zone-card-status"]')?.textContent ?? '';
    expect(status).toContain('3');
    expect(status).toContain('zones.events.active');
  });

  it('should show no incidents state when count is zero', async () => {
    TestBed.resetTestingModule();
    await setup(emptyZone);
    const el: HTMLElement = fixture.nativeElement;
    const status = el.querySelector('[data-testid="zone-card-status"]')?.textContent ?? '';
    expect(status).toContain('zones.events.none');
  });

  it('should show EDITANDO badge when editing', async () => {
    TestBed.resetTestingModule();
    await setup(radioZone, true, true);
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[data-testid="zone-card-editing"]')).toBeTruthy();
  });

  it('should not show EDITANDO badge by default', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[data-testid="zone-card-editing"]')).toBeNull();
  });

  it('should emit zoneSelected when card is clicked', () => {
    const emitSpy = vi.spyOn(component.zoneSelected, 'emit');
    component.onSelect();
    expect(emitSpy).toHaveBeenCalledWith(radioZone);
  });

  it('should emit editZone and deleteZone from action buttons', () => {
    const editSpy = vi.spyOn(component.editZone, 'emit');
    const deleteSpy = vi.spyOn(component.deleteZone, 'emit');
    const mouseEvent = new MouseEvent('click');
    vi.spyOn(mouseEvent, 'stopPropagation');
    component.onEdit(mouseEvent);
    component.onDelete(mouseEvent);
    expect(editSpy).toHaveBeenCalledWith(radioZone);
    expect(deleteSpy).toHaveBeenCalledWith(radioZone);
    expect(mouseEvent.stopPropagation).toHaveBeenCalledTimes(2);
  });
});
