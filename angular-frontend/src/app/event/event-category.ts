/**
 * Categorías de eventos del sistema.
 * Reutilizan las claves de texto que ya usa el panel lateral del mapa (`sidebar.category.*`).
 */
export type EventCategory = 'flood' | 'fire' | 'accident' | 'roadblock' | 'protest' | 'other';

export interface EventCategoryOption {
  value: EventCategory;
  labelKey: string;
}

export const EVENT_CATEGORIES: readonly EventCategoryOption[] = [
  { value: 'flood', labelKey: 'sidebar.category.flood' },
  { value: 'fire', labelKey: 'sidebar.category.fire' },
  { value: 'accident', labelKey: 'sidebar.category.accident' },
  { value: 'roadblock', labelKey: 'sidebar.category.roadblock' },
  { value: 'protest', labelKey: 'sidebar.category.protest' },
  { value: 'other', labelKey: 'sidebar.category.other' },
];
