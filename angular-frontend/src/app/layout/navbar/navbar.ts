import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { GetStringsPipe } from '../../core/strings/get-strings-pipe';
import { BrandComponent } from '../../shared/brand/brand'; // Importación del nuevo componente

@Component({
  imports: [RouterLink, RouterLinkActive, GetStringsPipe, BrandComponent], // Agregado aquí
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {}