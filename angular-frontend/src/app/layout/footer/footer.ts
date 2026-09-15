import { Component } from '@angular/core';
import { GetStringsPipe } from '../../core/strings/get-strings-pipe';

@Component({
  selector: 'app-footer',
  imports: [GetStringsPipe],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {}