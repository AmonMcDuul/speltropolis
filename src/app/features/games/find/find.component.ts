import { Component, computed, signal } from '@angular/core';
import { GameContainerComponent } from '../../../shared/components/game-container/game-container.component';

interface Setting {
  label: string;
  a: string;
  b: string;
}

@Component({
  selector: 'app-find',
  imports: [GameContainerComponent],
  templateUrl: './find.component.html',
  styleUrl: './find.component.scss',
})
export class FindComponent {
  gridSize = signal(12);

  grid = signal<string[][]>([]);

  score = signal(0);

  found = signal(false);

  settings: Setting[] = [
    { label: 'E / 3', a: 'E', b: '3' },
    { label: 'U / V', a: 'U', b: 'V' },
    { label: 'A / 4', a: 'A', b: '4' },
    // { label: 'l / I', a: 'l', b: 'I' },
    { label: 'B / 8', a: 'B', b: '8' },
    { label: 'O / 0', a: 'O', b: '0' },
  ];

  current = signal<Setting | null>(null);

  uniqueRow = 0;
  uniqueCol = 0;
  gridColumns = computed(() => `repeat(${this.gridSize()}, 1fr)`);

  constructor() {
    this.selectRandomSetting();
  }

  selectRandomSetting() {
    const s = this.settings[Math.floor(Math.random() * this.settings.length)];

    this.current.set(s);

    this.generateGrid();
  }

  generateGrid() {
    const s = this.current();

    if (!s) return;

    const size = this.gridSize();

    const g = Array.from({ length: size }, () => Array(size).fill(s.a));

    this.uniqueRow = Math.floor(Math.random() * size);
    this.uniqueCol = Math.floor(Math.random() * size);

    g[this.uniqueRow][this.uniqueCol] = s.b;

    this.grid.set(g);
  }

  selectCell(r: number, c: number) {
    if (r === this.uniqueRow && c === this.uniqueCol) {
      this.score.update((v) => v + 1);

      this.found.set(true);

      setTimeout(() => {
        this.found.set(false);
        this.selectRandomSetting();
      }, 400);
    }
  }

  setGridSize(n: number) {
    this.gridSize.set(n);
  }
}
