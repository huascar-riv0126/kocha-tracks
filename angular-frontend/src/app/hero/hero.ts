import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.html',
  styleUrl: '../app.css'
})
export class Hero {
  // Función de scroll movida aquí para que el botón funcione
  irAlMapa() {
    const mapa = document.getElementById('seccion-mapa');
    if (mapa) {
      mapa.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}