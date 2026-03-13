import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GAMES } from '../games/game.registry';
import { MouseTrailComponent } from '../../core/components/mouse-trail/mouse-trail.component';
import { PlayfulTitleDirective } from '../../shared/directives/playfull-title.directive';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [PlayfulTitleDirective, MouseTrailComponent],
})
export class DashboardComponent {
  private router = inject(Router);
  games = signal(GAMES);
  openGame(route: string) {
    this.router.navigate([route]);
  }
}
