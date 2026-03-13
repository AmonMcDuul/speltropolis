import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'games/memory',
    loadComponent: () =>
      import('./features/games/memory/memory.component').then((m) => m.MemoryComponent),
  },
  {
    path: 'games/space-invaders',
    loadComponent: () =>
      import('./features/games/space-invaders/space-invaders.component').then(
        (m) => m.SpaceInvadersComponent,
      ),
  },
  {
    path: 'games/rekenen',
    loadComponent: () =>
      import('./features/games/rekenen/rekenen.component').then((m) => m.RekenenComponent),
  },
  {
    path: 'games/klok-kijken',
    loadComponent: () =>
      import('./features/games/clock-game/clock-game.component').then((m) => m.ClockGameComponent),
  },
  {
    path: 'games/leren-typen',
    loadComponent: () =>
      import('./features/games/typing-laser/typing-laser.component').then(
        (m) => m.TypingLaserComponent,
      ),
  },
  {
    path: 'games/find',
    loadComponent: () =>
      import('./features/games/find/find.component').then((m) => m.FindComponent),
  },
];
