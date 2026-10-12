import { Component, computed, effect, input, output, signal } from '@angular/core';
import { GetStringsPipe } from '../../../core/strings/get-strings-pipe';
import {
  LatLng,
  Zone,
  ZoneDraft,
  ZoneType,
  ZONE_POLYGON_MIN_POINTS,
  ZONE_RADIUS_DEFAULT,
  ZONE_RADIUS_MAX,
  ZONE_RADIUS_MIN,
  ZONE_RADIUS_STEP,
} from '../zone.model';

@Component({
  selector: 'app-zone-config',
  standalone: true,
  imports: [GetStringsPipe],
  templateUrl: './zone-config.html',
})
export class ZoneConfig {
  readonly zone = input<Zone | null>(null);
  readonly center = input<LatLng | null>(null);
  readonly points = input<LatLng[]>([]);

  readonly save = output<ZoneDraft>();
  readonly cancel = output<void>();
  readonly undoPoint = output<void>();
  readonly clearPoints = output<void>();

  readonly name = signal('');
  readonly zoneType = signal<ZoneType>('radio');
  readonly radius = signal(ZONE_RADIUS_DEFAULT);

  readonly radiusMin = ZONE_RADIUS_MIN;
  readonly radiusMax = ZONE_RADIUS_MAX;
  readonly radiusStep = ZONE_RADIUS_STEP;
  readonly polygonMinPoints = ZONE_POLYGON_MIN_POINTS;

  constructor() {
    effect(() => {
      const current = this.zone();
      this.name.set(current?.name ?? '');
      this.zoneType.set(current?.type ?? 'radio');
      this.radius.set(current?.radiusMeters ?? ZONE_RADIUS_DEFAULT);
    });
  }

  readonly isRadio = computed(() => this.zoneType() === 'radio');

  readonly formattedRadius = computed(() => `${(this.radius() / 1000).toFixed(1)} km`);

  readonly nameValid = computed(() => this.name().trim().length > 0);

  readonly geometryValid = computed(() =>
    this.isRadio()
      ? this.radius() >= ZONE_RADIUS_MIN
      : this.points().length >= ZONE_POLYGON_MIN_POINTS,
  );

  readonly isValid = computed(() => this.nameValid() && this.geometryValid());

  onNameChange(value: string): void {
    this.name.set(value);
  }

  onTypeChange(value: string): void {
    this.zoneType.set(value as ZoneType);
  }

  onRadiusChange(value: string): void {
    this.radius.set(Number(value));
  }

  onCancel(): void {
    const current = this.zone();
    this.name.set(current?.name ?? '');
    this.zoneType.set(current?.type ?? 'radio');
    this.radius.set(current?.radiusMeters ?? ZONE_RADIUS_DEFAULT);
    this.cancel.emit();
  }

  onSave(): void {
    if (!this.isValid()) return;
    const name = this.name().trim();
    if (this.isRadio()) {
      this.save.emit({
        name,
        type: 'radio',
        radiusMeters: this.radius(),
        center: this.center(),
      });
    } else {
      this.save.emit({ name, type: 'polygon', points: [...this.points()] });
    }
  }
}
