import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GetStringsPipe } from '../../core/strings/get-strings-pipe';

@Component({
  selector: 'app-brand',
  standalone: true, 
  imports: [CommonModule, RouterModule, GetStringsPipe],
  templateUrl: './brand.html',
})
export class BrandComponent {
  @Input() variant: 'light' | 'dark' | 'logo-only' = 'light';
  @Input() isClickable: boolean = true;
}