import { Component, output } from '@angular/core';
import { GetStringsPipe } from '../../../../core/strings/get-strings-pipe';

@Component({
  selector: 'app-zone-undo-button',
  standalone: true,
  imports: [GetStringsPipe],
  templateUrl: './zone-undo-button.html',
})
export class ZoneUndoButtonComponent {
  readonly undo = output<void>();
}
