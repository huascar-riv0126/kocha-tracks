import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { setRequiredInputs } from '@testutils/set-required-inputs';
import { StringsService } from '../../../core/strings/strings-service/strings-service';
import { StringsServiceStub } from '@testutils/stubs';
import { ZoneConfig } from './zone-config';
import { LatLng, Zone, ZONE_RADIUS_DEFAULT } from '../zone.model';
import { ZONES_MOCK } from '../zones-mock';

const radioZone: Zone = ZONES_MOCK[0];
const center: LatLng = [-17.3895, -66.1568];
const triangle: LatLng[] = [
  [-17.3895, -66.1568],
  [-17.39, -66.157],
  [-17.389, -66.155],
];

describe('ZoneConfig', () => {
  let component: ZoneConfig;
  let fixture: ComponentFixture<ZoneConfig>;

  async function setup(inputs: { zone?: Zone | null; center?: LatLng | null; points?: LatLng[] } = {}) {
    await TestBed.configureTestingModule({
      imports: [ZoneConfig],
      providers: [{ provide: StringsService, useClass: StringsServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(ZoneConfig);
    component = fixture.componentInstance;
    setRequiredInputs(fixture, {
      zone: inputs.zone ?? null,
      center: inputs.center ?? null,
      points: inputs.points ?? [],
    });
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    TestBed.resetTestingModule();
    await setup();
  });

  it('should create in create mode with defaults', () => {
    expect(component).toBeTruthy();
    expect(component.name()).toBe('');
    expect(component.zoneType()).toBe('radio');
    expect(component.radius()).toBe(ZONE_RADIUS_DEFAULT);
    expect(component.isValid()).toBe(false);
  });

  it('should preload the form when editing a zone', async () => {
    TestBed.resetTestingModule();
    await setup({ zone: radioZone });
    expect(component.name()).toBe(radioZone.name);
    expect(component.zoneType()).toBe('radio');
    expect(component.radius()).toBe(radioZone.radiusMeters);
    expect(component.isValid()).toBe(true);
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[data-testid="zone-config-radius-value"]')?.textContent?.trim()).toBe(
      '1.5 km',
    );
  });

  it('should update the name and enable save', () => {
    component.onNameChange('Mi casa - Zona Norte');
    fixture.detectChanges();
    expect(component.nameValid()).toBe(true);
    expect(component.isValid()).toBe(true);
    const save = fixture.nativeElement.querySelector(
      '[data-testid="zone-config-save"]',
    ) as HTMLButtonElement;
    expect(save.disabled).toBe(false);
  });

  it('should update the radius from the slider', () => {
    component.onNameChange('Test');
    component.onRadiusChange('2000');
    fixture.detectChanges();
    expect(component.radius()).toBe(2000);
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[data-testid="zone-config-radius-value"]')?.textContent?.trim()).toBe(
      '2.0 km',
    );
  });

  it('should switch to polygon mode and hide the slider', async () => {
    TestBed.resetTestingModule();
    await setup();
    component.onTypeChange('polygon');
    fixture.detectChanges();
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[data-testid="zone-config-radius-section"]')).toBeNull();
    expect(el.querySelector('[data-testid="zone-config-polygon-section"]')).toBeTruthy();
    expect(component.isValid()).toBe(false);
  });

  it('should validate polygon with at least 3 points', async () => {
    TestBed.resetTestingModule();
    await setup({ points: triangle });
    component.onNameChange('Trabajo');
    component.onTypeChange('polygon');
    fixture.detectChanges();
    expect(component.isValid()).toBe(true);
  });

  it('should emit a radio draft on save', async () => {
    TestBed.resetTestingModule();
    await setup({ zone: radioZone, center });
    const emitSpy = vi.spyOn(component.save, 'emit');
    component.onSave();
    expect(emitSpy).toHaveBeenCalledWith({
      name: radioZone.name,
      type: 'radio',
      radiusMeters: radioZone.radiusMeters,
      center,
    });
  });

  it('should emit a polygon draft on save', async () => {
    TestBed.resetTestingModule();
    await setup({ points: triangle });
    component.onNameChange('Trabajo - Av. América');
    component.onTypeChange('polygon');
    const emitSpy = vi.spyOn(component.save, 'emit');
    component.onSave();
    expect(emitSpy).toHaveBeenCalledWith({
      name: 'Trabajo - Av. América',
      type: 'polygon',
      points: triangle,
    });
  });

  it('should not emit save when invalid', () => {
    const emitSpy = vi.spyOn(component.save, 'emit');
    component.onSave();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit cancel and reset to the initial zone', async () => {
    TestBed.resetTestingModule();
    await setup({ zone: radioZone });
    const emitSpy = vi.spyOn(component.cancel, 'emit');
    component.onNameChange('Otro nombre');
    component.onRadiusChange('2000');
    component.onCancel();
    expect(component.name()).toBe(radioZone.name);
    expect(component.radius()).toBe(radioZone.radiusMeters);
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit undoPoint and clearPoints', async () => {
    TestBed.resetTestingModule();
    await setup({ points: triangle });
    const undoSpy = vi.spyOn(component.undoPoint, 'emit');
    const clearSpy = vi.spyOn(component.clearPoints, 'emit');
    component.onTypeChange('polygon');
    fixture.detectChanges();
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    (el.querySelector('[data-testid="zone-config-undo"]') as HTMLButtonElement)?.click();
    (el.querySelector('[data-testid="zone-config-clear"]') as HTMLButtonElement)?.click();
    expect(undoSpy).toHaveBeenCalled();
    expect(clearSpy).toHaveBeenCalled();
  });
});
