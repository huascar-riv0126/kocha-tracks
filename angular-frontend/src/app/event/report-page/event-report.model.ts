import { LatLng } from '../../map/zones/zone.model';
import { Severity } from '../details-page/severity-card/severity-card';
import { EventCategory } from '../event-category';

/** Datos de un evento reportado por un usuario desde la página Reportar (UH-55). */
export interface EventReport {
  title: string;
  category: EventCategory;
  description: string;
  reference: string;
  location: LatLng;
  severity: Severity;
  source?: string;
  notes?: string;
}
