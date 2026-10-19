import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { GetStringsPipe } from '../../core/strings/get-strings-pipe';
import { BrandComponent } from '../../shared/brand/brand';

@Component({
  imports: [RouterLink, RouterLinkActive, GetStringsPipe, BrandComponent],
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {}