import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { BrandComponent } from '../../shared/brand/brand';

@Component({
  selector: 'app-footer',
  imports: [TranslocoPipe, RouterLink, BrandComponent],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {}