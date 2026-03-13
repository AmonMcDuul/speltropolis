import { Component, HostListener, signal } from '@angular/core';

interface Star {
  x: number;
  y: number;
  id: number;
}

@Component({
  selector: 'app-mouse-trail',
  standalone: true,
  templateUrl: './mouse-trail.component.html',
  styleUrl: './mouse-trail.component.scss',
})
export class MouseTrailComponent {
  stars = signal<Star[]>([]);
  id = 0;

  @HostListener('document:mousemove', ['$event'])
  move(e: MouseEvent) {
    const star = { x: e.clientX, y: e.clientY, id: this.id++ };

    this.stars.update((s) => [...s, star].slice(-12));

    setTimeout(() => {
      this.stars.update((s) => s.filter((st) => st.id !== star.id));
    }, 600);
  }
}
