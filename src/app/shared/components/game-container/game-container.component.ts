import { Component, input, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-container',
  templateUrl: './game-container.component.html',
  styleUrl: './game-container.component.scss',
})
export class GameContainerComponent {
  title = input<string>();
  private router = inject(Router);

  back() {
    this.router.navigate(['/']);
  }
}
