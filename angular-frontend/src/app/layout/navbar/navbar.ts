import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { GetStringsPipe } from '../../core/strings/get-strings-pipe';

@Component({
  imports: [RouterLink, RouterLinkActive, GetStringsPipe],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {}
