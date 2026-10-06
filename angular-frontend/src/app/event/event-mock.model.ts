import { Severity } from "./details-page/severity-card/severity-card";

export interface EventMock {
  id: number;
  title: string;
  coordinates: [number, number]; 
  state: 'activo' | 'resuelto';
  severity: Severity;
  elapsedTime: string;
  type: string;
  location: string;
  description: string;
  startDate: Date;
}