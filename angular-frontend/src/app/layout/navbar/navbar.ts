import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { GetStringsPipe } from '../../core/strings/get-strings-pipe';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    GetStringsPipe
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {}