import { Component } from '@angular/core';
import { MapPreview } from '../map-preview/map-preview';
import { Features } from '../features/features';
import { CtaSection } from '../cta-section/cta-section'; // 1. Importas CtaSection

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [MapPreview, Features, CtaSection], // 2. Lo agregas aquí
  templateUrl: './hero.html',
  styleUrls: ['./hero.css']
})
export class Hero {}