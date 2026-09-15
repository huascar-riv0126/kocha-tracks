import { Component } from '@angular/core';
import { DataFlowCard } from './data-flow-card/data-flow-card';

@Component({
  imports: [DataFlowCard],
  selector: 'app-data-flow-grid',
  templateUrl: './data-flow-grid.html',
})
export class DataFlowGrid {
  protected readonly flowSteps = [{
    "number": "1",
    "title": "Recopilación Multicanal",
    "description": "Ingesta automática vía API, web scraping institucional o reportes directos geo-referenciados de ciudadanos en Cochabamba."
  },
  {
    "number": "2",
    "title": "Validación Cívica y Filtros",
    "description": "Algoritmos cruzados con reportes de Tránsito de la Policía y aprobación comunitaria local para evitar reportes falsos o spam."
  },
  {
    "number": "3",
    "title": "Publicación en Mapa",
    "description": "Sincronización instantánea en el mapa interactivo vecinal con alertas tempranas y cálculo de rutas libres de bloqueos."
  }];
}
