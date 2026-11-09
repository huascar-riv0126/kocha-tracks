/** Presentation data for one event revision. Text values are supplied by the caller. */
export interface EventChange {
  readonly id: string;
  readonly version: number;
  /** A valid instant; displayed in Bolivia time (UTC−4). */
  readonly occurredAt: Date;
  readonly type: 'started' | 'updated' | 'finished';
  readonly title: string;
  readonly field: string;
  readonly before: string;
  readonly after: string;
  readonly description: string;
  readonly isExample?: boolean;
}
