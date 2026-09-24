import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GetStringsPipe } from '../../core/strings/get-strings-pipe';

@Component({
  selector: 'app-footer',
  imports: [GetStringsPipe, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {}