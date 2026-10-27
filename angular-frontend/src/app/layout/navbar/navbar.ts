import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BrandComponent } from '../../shared/brand/brand';
import { LanguageToggle } from '../../shared/language-toggle/language-toggle';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  imports: [
    RouterLink,
    RouterLinkActive,
    BrandComponent,
    LanguageToggle,
    TranslocoPipe
  ],
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar { }
