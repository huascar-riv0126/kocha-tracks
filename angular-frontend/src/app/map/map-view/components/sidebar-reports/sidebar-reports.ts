import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventMockService } from '../../../../event/event-mock';
import { EventMock } from '../../../../event/event-mock.model';
import { ReportCardComponent } from '../report-card/report-card';
import { GetStringsPipe } from '../../../../core/strings/get-strings-pipe';

@Component({
  selector: 'app-sidebar-reports',
  standalone: true,
  imports: [CommonModule, ReportCardComponent, GetStringsPipe],
  templateUrl: './sidebar-reports.html',
  styleUrl: './sidebar-reports.css'
})
export class SidebarReportsComponent implements OnInit {
  @Output() eventSelected = new EventEmitter<EventMock>();

  activeTab: 'activos' | 'historicos' = 'activos';
  selectedCategoryKey: string = 'sidebar.category.all';
  selectedEventId: number | null = 1;

  categories = [
    { key: 'sidebar.category.all', labelKey: 'sidebar.category.all' },
    { key: 'sidebar.category.flood', labelKey: 'sidebar.category.flood' },
    { key: 'sidebar.category.fire', labelKey: 'sidebar.category.fire' },
    { key: 'sidebar.category.accident', labelKey: 'sidebar.category.accident' },
    { key: 'sidebar.category.roadblock', labelKey: 'sidebar.category.roadblock' },
    { key: 'sidebar.category.protest', labelKey: 'sidebar.category.protest' },
    { key: 'sidebar.category.other', labelKey: 'sidebar.category.other' }
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

  selectCategory(categoryKey: string): void {
    this.selectedCategoryKey = categoryKey;
  }

  onSelectEvent(event: EventMock): void {
    this.selectedEventId = event.id;
    this.eventSelected.emit(event);
  }
}