import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Hero } from './hero/hero'; 

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Hero],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Sistema de Monitoreo de Bloqueos Viales');
}