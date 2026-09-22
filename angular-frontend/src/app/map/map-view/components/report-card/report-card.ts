import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventMock } from '../../../../event/event-mock.model';

@Component({
  selector: 'app-report-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-card.html',
  styleUrl: './report-card.css'
})
export class ReportCardComponent {
  @Input({ required: true }) event!: EventMock;
  @Input() isSelected: boolean = false;
  @Output() cardClick = new EventEmitter<EventMock>();

  onSelect(): void {
    this.cardClick.emit(this.event);
  }
}