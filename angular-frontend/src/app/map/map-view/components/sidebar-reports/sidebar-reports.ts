import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- 1. Importar FormsModule
import { EventMockService } from '../../../../event/event-mock';
import { EventMock } from '../../../../event/event-mock.model';
import { ReportCardComponent } from '../report-card/report-card';

@Component({
  selector: 'app-sidebar-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, ReportCardComponent], // <-- 2. Agregar FormsModule
  templateUrl: './sidebar-reports.html',
  styleUrl: './sidebar-reports.css'
})
export class SidebarReportsComponent implements OnInit {
  @Output() eventSelected = new EventEmitter<EventMock>();

  activeTab: 'activos' | 'historicos' = 'activos';
  selectedCategory: string = 'Todo';
  selectedEventId: number | null = 1;

  // Dropdown de Departamentos para Históricos
  selectedDepartment: string = 'Cochabamba';
  departments: string[] = [
    'Beni',
    'Chuquisaca',
    'Cochabamba',
    'La Paz',
    'Oruro',
    'Pando',
    'Potosí',
    'Santa Cruz',
    'Tarija'
  ];

  categories: string[] = [
    'Todo', 'Inundación', 'Incendio', 'Accidente', 'Corte de vía', 'Protesta', 'Otro'
  ];

  events: EventMock[] = [];

  constructor(private eventMockService: EventMockService) {}

  ngOnInit(): void {
    this.events = this.eventMockService.getEvents();
  }

  get filteredEvents(): EventMock[] {
    if (this.activeTab === 'activos') {
      return this.events.filter(e => e.state === 'activo');
    }
    return this.events.filter(e => e.state === 'resuelto');
  }

  selectTab(tab: 'activos' | 'historicos'): void {
    this.activeTab = tab;
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  onDepartmentChange(dept: string): void {
    this.selectedDepartment = dept;
  }

  onSelectEvent(event: EventMock): void {
    this.selectedEventId = event.id;
    this.eventSelected.emit(event);
  }
}