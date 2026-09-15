export interface EventMock {
  id: number;
  title: string;
  coordinates: [number, number]; 
  state: 'activo' | 'resuelto';
  elapsedTime: string;
}