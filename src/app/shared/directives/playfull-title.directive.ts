import { Directive, ElementRef, HostListener } from '@angular/core';

type Mode = 'magnet' | 'repel' | 'wave';

@Directive({
  selector: '[playfulTitle]',
  standalone: true,
})
export class PlayfulTitleDirective {
  private mode: Mode = 'magnet';

  constructor(private el: ElementRef<HTMLElement>) {}

  private letters() {
    return this.el.nativeElement.querySelectorAll<HTMLElement>('.letter');
  }

  private randomMode() {
    const modes: Mode[] = ['magnet', 'repel', 'wave'];
    this.mode = modes[Math.floor(Math.random() * modes.length)];
  }

  @HostListener('mouseenter')
  enter() {
    this.randomMode();
  }

  @HostListener('mousemove', ['$event'])
  move(e: MouseEvent) {
    const letters = this.letters();

    if (this.mode === 'wave') {
      this.waveEffect(e);
      return;
    }

    letters.forEach((letter) => {
      const rect = letter.getBoundingClientRect();

      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      const dx = e.clientX - x;
      const dy = e.clientY - y;

      const distance = Math.sqrt(dx * dx + dy * dy);

      const strength = Math.max(0, 1 - distance / 160);

      const direction = this.mode === 'repel' ? -1 : 1;

      const moveX = dx * strength * 0.2 * direction;
      const moveY = dy * strength * 0.2 * direction;

      letter.style.transform = `translate(${moveX}px,${moveY}px)`;

      if (distance < 30) {
        this.spawnParticles(x, y);
      }
    });
  }

  private waveEffect(e: MouseEvent) {
    const letters = this.letters();

    letters.forEach((letter) => {
      const rect = letter.getBoundingClientRect();

      const x = rect.left + rect.width / 2;
      const dx = Math.abs(e.clientX - x);

      const strength = Math.max(0, 1 - dx / 120);

      const lift = -16 * strength;

      letter.style.transform = `translateY(${lift}px)`;
    });
  }

  private spawnParticles(x: number, y: number) {
    for (let i = 0; i < 4; i++) {
      const star = document.createElement('div');

      star.className = 'title-particle';
      const particles = ['✨', '⭐', '💫', '🌟'];
      star.textContent = particles[Math.floor(Math.random() * particles.length)];

      const angle = Math.random() * Math.PI * 2;
      const distance = 20 + Math.random() * 20;

      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      star.style.left = x + 'px';
      star.style.top = y + 'px';
      star.style.setProperty('--tx', tx + 'px');
      star.style.setProperty('--ty', ty + 'px');

      document.body.appendChild(star);

      setTimeout(() => star.remove(), 600);
    }
  }

  @HostListener('mouseleave')
  leave() {
    this.letters().forEach((l) => {
      l.style.transform = 'translate(0,0)';
    });
  }
}
