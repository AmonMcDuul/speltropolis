import { Component, signal, HostListener } from '@angular/core';
import { GameContainerComponent } from '../../../shared/components/game-container/game-container.component';
import confetti from 'canvas-confetti';

interface Tile {
  value: number;
  id: number;
  merged?: boolean;
}

@Component({
  selector: 'app-twenty-forty-eight',
  imports: [GameContainerComponent],
  templateUrl: './twenty-forty-eight.component.html',
  styleUrl: './twenty-forty-eight.component.scss',
})
export class TwentyFortyEightComponent {
  size = 4;

  board = signal<Tile[][]>([]);
  score = signal(0);
  combo = signal(0);

  idCounter = 0;

  constructor() {
    this.reset();
  }

  reset() {
    const grid: Tile[][] = Array.from({ length: this.size }, () =>
      Array.from({ length: this.size }, () => ({ value: 0, id: this.id() })),
    );

    this.board.set(grid);
    this.score.set(0);
    this.combo.set(0);

    this.spawn();
    this.spawn();
  }

  id() {
    return this.idCounter++;
  }

  spawn() {
    const grid = this.board().map((r) => r.map((c) => ({ ...c })));

    const empty: { r: number; c: number }[] = [];

    grid.forEach((row, r) =>
      row.forEach((c, c2) => {
        if (c.value === 0) empty.push({ r, c: c2 });
      }),
    );

    if (!empty.length) return;

    const pos = empty[Math.floor(Math.random() * empty.length)];

    grid[pos.r][pos.c] = {
      value: Math.random() < 0.9 ? 2 : 4,
      id: this.id(),
    };

    this.board.set(grid);
  }

  move(dir: 'left' | 'right' | 'up' | 'down') {
    let grid = this.board().map((r) => r.map((c) => ({ ...c })));
    let moved = false;
    let mergedSomething = false;

    const slide = (row: Tile[]) => {
      const filtered = row.filter((t) => t.value !== 0);

      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i].value === filtered[i + 1].value) {
          filtered[i].value *= 2;
          filtered[i].merged = true;

          this.score.update((s) => s + filtered[i].value);

          if (filtered[i].value === 2048) this.fireConfetti();

          filtered.splice(i + 1, 1);

          mergedSomething = true;
        }
      }

      while (filtered.length < this.size) {
        filtered.push({ value: 0, id: this.id() });
      }

      return filtered;
    };

    const rotate = () => {
      grid = grid[0].map((_, i) => grid.map((r) => r[i])).reverse();
    };

    const applyLeft = () => {
      grid = grid.map((r) => {
        const newRow = slide(r);

        if (JSON.stringify(newRow.map((t) => t.value)) !== JSON.stringify(r.map((t) => t.value))) {
          moved = true;
        }

        return newRow;
      });
    };

    if (dir === 'left') applyLeft();

    if (dir === 'right') {
      grid = grid.map((r) => r.reverse());
      applyLeft();
      grid = grid.map((r) => r.reverse());
    }

    if (dir === 'up') {
      rotate();
      applyLeft();
      rotate();
      rotate();
      rotate();
    }

    if (dir === 'down') {
      rotate();
      rotate();
      rotate();
      applyLeft();
      rotate();
    }

    if (moved) {
      if (mergedSomething) {
        this.combo.update((c) => c + 1);
      } else {
        this.combo.set(0);
      }

      this.board.set(grid);
      this.spawn();
    }
  }

  fireConfetti() {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
  }

  @HostListener('window:keydown', ['$event'])
  key(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') this.move('left');
    if (e.key === 'ArrowRight') this.move('right');
    if (e.key === 'ArrowUp') this.move('up');
    if (e.key === 'ArrowDown') this.move('down');
  }

  startX = 0;
  startY = 0;

  touchStart(e: TouchEvent) {
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
  }

  touchEnd(e: TouchEvent) {
    const dx = e.changedTouches[0].clientX - this.startX;
    const dy = e.changedTouches[0].clientY - this.startY;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 30) this.move('right');
      if (dx < -30) this.move('left');
    } else {
      if (dy > 30) this.move('down');
      if (dy < -30) this.move('up');
    }
  }
}
