import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MapPreview } from '../map-preview/map-preview';
import { Features } from '../features/features';
import { CtaSection } from '../cta-section/cta-section';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink, MapPreview, Features, CtaSection],
  templateUrl: './hero.html',
  styleUrls: ['./hero.css']
})
export class Hero {}