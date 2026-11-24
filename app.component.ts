import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <h1>🌦 Weather Dashboard</h1>
      <div class="links">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Dashboard</a>
        <a routerLink="/favorites" routerLinkActive="active">Favorites</a>
      </div>
    </nav>
    <main class="container"><router-outlet /></main>
  `
})
export class AppComponent {}
