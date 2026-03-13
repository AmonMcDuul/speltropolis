import { Component, signal, HostListener, DestroyRef, inject } from '@angular/core';

import { GameContainerComponent } from '../../../shared/components/game-container/game-container.component';

interface WordEnemy {
  text: string;
  x: number;
}

@Component({
  selector: 'app-typing-laser',
  templateUrl: './typing-laser.component.html',
  styleUrl: './typing-laser.component.scss',
  imports: [GameContainerComponent],
})
export class TypingLaserComponent {
  destroyRef = inject(DestroyRef);

  words = signal<WordEnemy[]>([]);
  typed = signal('');

  score = signal(0);
  speed = signal(60);

  gameOver = signal(false);

  width = 700;
  laserX = 80;

  interval?: any;

  wordList = [
    'kat',
    'hond',
    'vis',
    'maan',
    'ster',
    'boom',
    'tak',
    'zon',
    'dag',
    'nacht',
    'stoel',
    'tafel',
    'raam',
    'deur',
    'boek',
    'pen',
    'pot',
    'glas',
    'bord',
    'mes',
    'auto',
    'bus',
    'trein',
    'fiets',
    'boot',
    'vliegtuig',
    'raket',
    'motor',
    'brood',
    'appel',
    'peer',
    'banaan',
    'druif',
    'kaas',
    'melk',
    'soep',
    'rijst',
    'vogel',
    'koe',
    'schaap',
    'geit',
    'kip',
    'paard',
    'beer',
    'wolf',
    'vos',
    'muis',
    'regen',
    'wind',
    'storm',
    'sneeuw',
    'ijs',
    'wolk',
    'mist',
    'zonlicht',
    'school',
    'klas',
    'leraar',
    'kind',
    'vriend',
    'spelen',
    'rennen',
    'springen',
    'computer',
    'tablet',
    'telefoon',
    'internet',
    'scherm',
    'toetsenbord',
    'tuin',
    'bloem',
    'gras',
    'plant',
    'boomstam',
    'wortel',
    'oceaan',
    'rivier',
    'meer',
    'strand',
    'zand',
    'golf',
    'ruimte',
    'planeet',
    'ster',
    'maan',
    'satelliet',
    'astronaut',
    'driehoek',
    'vierkant',
    'cirkel',
    'lijn',
    'hoek',
    'rood',
    'blauw',
    'groen',
    'geel',
    'paars',
    'oranje',
  ];

  constructor() {
    this.spawnWord();

    this.interval = setInterval(() => this.update(), 30);

    this.destroyRef.onDestroy(() => clearInterval(this.interval));
  }

  spawnWord() {
    const text = this.wordList[Math.floor(Math.random() * this.wordList.length)];

    this.words.update((w) => [...w, { text, x: this.width }]);
  }

  update() {
    if (this.gameOver()) return;

    this.words.update((list) => {
      const updated = list.map((w) => ({
        ...w,
        x: w.x - this.speed() * 0.03,
      }));

      const hit = updated.some((w) => w.x <= this.laserX);

      if (hit) {
        this.gameOver.set(true);
      }

      return updated;
    });
  }

  @HostListener('window:keydown', ['$event'])
  key(e: KeyboardEvent) {
    if (this.gameOver()) return;

    if (e.key.length !== 1) return;

    const char = e.key.toLowerCase();

    const target = this.words()[0];

    if (!target) return;

    const next = this.typed() + char;

    if (target.text.startsWith(next)) {
      this.typed.set(next);

      if (next === target.text) {
        this.destroyWord();
      }
    }
  }

  destroyWord() {
    this.words.update((w) => w.slice(1));

    this.typed.set('');

    this.score.update((s) => s + 1);

    if (this.score() % 5 === 0) {
      this.speed.update((s) => s + 20);
    }

    this.spawnWord();
  }

  restart() {
    this.words.set([]);

    this.score.set(0);

    this.speed.set(60);

    this.typed.set('');

    this.gameOver.set(false);

    this.spawnWord();
  }
}
