import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventMock } from '../../../../event/event-mock.model';
import { GetStringsPipe } from '../../../../core/strings/get-strings-pipe';

@Component({
  selector: 'app-report-card',
  standalone: true,
  imports: [CommonModule, GetStringsPipe],
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