import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { By } from '@angular/platform-browser';
import { setRequiredInputs } from '@testutils/set-required-inputs';
import { StringsService } from '../../../core/strings/strings-service/strings-service';
import { StringsServiceStub } from '@testutils/stubs';
import { ZonesList } from './zones-list';
import { ZoneCard } from '../zone-card/zone-card';
import { ZONES_MOCK } from '../zones-mock';

describe('ZonesList', () => {
  let component: ZonesList;
  let fixture: ComponentFixture<ZonesList>;

  async function setup(
    inputs: { selectedId?: number | null; editingId?: number | null } = {},
  ) {
    await TestBed.configureTestingModule({
      imports: [ZonesList],
      providers: [{ provide: StringsService, useClass: StringsServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(ZonesList);
    component = fixture.componentInstance;
    setRequiredInputs(fixture, {
      zones: ZONES_MOCK,
      selectedId: inputs.selectedId ?? null,
      editingId: inputs.editingId ?? null,
    });
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    TestBed.resetTestingModule();
    await setup();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the header and new zone button', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[data-testid="zones-list"]')).toBeTruthy();
    expect(el.querySelector('[data-testid="zones-list-new"]')).toBeTruthy();
    expect(el.textContent).toContain('zones.my.title');
    expect(el.textContent).toContain('zones.new');
  });

  it('should render one card per zone', () => {
    const cards = fixture.debugElement.queryAll(By.directive(ZoneCard));
    expect(cards).toHaveLength(ZONES_MOCK.length);
  });

  it('should mark the selected zone', async () => {
    TestBed.resetTestingModule();
    await setup({ selectedId: 1 });
    const cards = fixture.debugElement.queryAll(By.directive(ZoneCard));
    expect(cards[0].componentInstance.selected()).toBe(true);
    expect(cards[1].componentInstance.selected()).toBe(false);
  });

  it('should mark the editing zone', async () => {
    TestBed.resetTestingModule();
    await setup({ selectedId: 1, editingId: 1 });
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[data-testid="zone-card-editing"]')).toBeTruthy();
  });

  it('should emit zoneSelected when a card is selected', () => {
    const emitSpy = vi.spyOn(component.zoneSelected, 'emit');
    component.onSelect(ZONES_MOCK[0]);
    expect(emitSpy).toHaveBeenCalledWith(ZONES_MOCK[0]);
  });

  it('should emit createNew when the button is clicked', () => {
    const emitSpy = vi.spyOn(component.createNew, 'emit');
    const button: HTMLButtonElement | null = fixture.nativeElement.querySelector(
      '[data-testid="zones-list-new"]',
    );
    button?.click();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should re-emit editZone and deleteZone from cards', () => {
    const editSpy = vi.spyOn(component.editZone, 'emit');
    const deleteSpy = vi.spyOn(component.deleteZone, 'emit');
    const cards = fixture.debugElement.queryAll(By.directive(ZoneCard));
    cards[0].triggerEventHandler('editZone', ZONES_MOCK[0]);
    cards[0].triggerEventHandler('deleteZone', ZONES_MOCK[0]);
    expect(editSpy).toHaveBeenCalledWith(ZONES_MOCK[0]);
    expect(deleteSpy).toHaveBeenCalledWith(ZONES_MOCK[0]);
  });

  it('should show empty state when there are no zones', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [ZonesList],
      providers: [{ provide: StringsService, useClass: StringsServiceStub }],
    }).compileComponents();
    const emptyFixture = TestBed.createComponent(ZonesList);
    setRequiredInputs(emptyFixture, { zones: [] });
    emptyFixture.detectChanges();
    await emptyFixture.whenStable();
    const el: HTMLElement = emptyFixture.nativeElement;
    expect(el.querySelector('[data-testid="zones-list-empty"]')).toBeTruthy();
    expect(el.querySelector('app-zone-card')).toBeNull();
  });
});
