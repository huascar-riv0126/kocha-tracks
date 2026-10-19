import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GetStringsPipe } from '../../core/strings/get-strings-pipe';
import { BrandComponent } from '../../shared/brand/brand'; // Importación del nuevo componente

@Component({
  selector: 'app-footer',
  imports: [GetStringsPipe, RouterLink, BrandComponent], // Agregado aquí
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {}