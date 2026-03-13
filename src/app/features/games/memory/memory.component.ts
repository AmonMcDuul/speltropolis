import { Component, DestroyRef, inject, signal, computed } from '@angular/core';

import { GameContainerComponent } from '../../../shared/components/game-container/game-container.component';
import { GameEngine } from '../../../core/services/game-engine.service';

import confetti from 'canvas-confetti';

interface Card {
  symbol: string;
  flipped: boolean;
  matched: boolean;
}

@Component({
  selector: 'app-memory',
  standalone: true,
  imports: [GameContainerComponent],
  templateUrl: './memory.component.html',
  styleUrl: './memory.component.scss',
  providers: [GameEngine],
})
export class MemoryComponent {
  engine = inject(GameEngine);
  destroyRef = inject(DestroyRef);

  cards = signal<Card[]>([]);
  columns = signal(4);

  selected: Card[] = [];
  lock = false;

  size = signal(12);
  theme = signal('animals');

  timer = signal(0);
  interval?: any;

  stars = computed(() => {
    const t = this.timer();

    if (t < 20) return 3;
    if (t < 40) return 2;
    return 1;
  });

  win = signal(false);

  themes: Record<string, string[]> = {
    animals: [
      '🐶',
      '🐱',
      '🐭',
      '🐹',
      '🐰',
      '🦊',
      '🐻',
      '🐼',
      '🐨',
      '🐯',
      '🦁',
      '🐮',
      '🐷',
      '🐸',
      '🐵',
      '🐔',
      '🐧',
      '🐦',
      '🐤',
      '🦆',
      '🦉',
      '🐺',
      '🐗',
      '🐴',
      '🦄',
      '🐝',
      '🐛',
      '🦋',
      '🐌',
      '🐙',
    ],

    fruit: [
      '🍎',
      '🍏',
      '🍐',
      '🍊',
      '🍋',
      '🍌',
      '🍉',
      '🍇',
      '🍓',
      '🫐',
      '🍈',
      '🍒',
      '🍑',
      '🥭',
      '🍍',
      '🥥',
      '🥝',
      '🍅',
      '🥑',
      '🥦',
      '🥕',
      '🌽',
      '🥔',
      '🍠',
      '🍞',
      '🥐',
      '🥨',
      '🧀',
      '🍕',
      '🍔',
    ],
    space: [
      '🌍',
      '🌎',
      '🌏',
      '🌕',
      '🌖',
      '🌗',
      '🌘',
      '🌑',
      '🌒',
      '🌓',
      '🌔',
      '🌙',
      '⭐',
      '🌟',
      '✨',
      '☄️',
      '🌠',
      '🌌',
      '🪐',
      '🚀',
      '🛰️',
      '👨‍🚀',
      '👩‍🚀',
      '👽',
      '🛸',
      '🔭',
      '🌞',
      '🌛',
      '🌜',
      '🌚',
    ],
    emoji: [
      '😀',
      '😃',
      '😄',
      '😁',
      '😆',
      '😅',
      '😂',
      '🤣',
      '😊',
      '😇',
      '🙂',
      '😉',
      '😍',
      '😘',
      '😜',
      '🤪',
      '🤓',
      '😎',
      '🥳',
      '🤩',
      '🤖',
      '👻',
      '💩',
      '👾',
      '🎃',
      '😺',
      '😸',
      '😹',
      '😻',
      '🙀',
    ],
    vehicles: [
      '🚗',
      '🚕',
      '🚙',
      '🚌',
      '🚎',
      '🏎️',
      '🚓',
      '🚑',
      '🚒',
      '🚚',
      '🚛',
      '🚜',
      '🏍️',
      '🛵',
      '🚲',
      '🛴',
      '🚂',
      '🚆',
      '🚄',
      '🚅',
      '✈️',
      '🛩️',
      '🚁',
      '⛵',
      '🚤',
      '🛥️',
      '🚢',
      '🛰️',
      '🚀',
      '🛸',
    ],
    sports: [
      '⚽',
      '🏀',
      '🏈',
      '⚾',
      '🥎',
      '🎾',
      '🏐',
      '🏉',
      '🥏',
      '🎱',
      '🏓',
      '🏸',
      '🥊',
      '🥋',
      '⛳',
      '🏹',
      '🎣',
      '🤿',
      '🥌',
      '🛷',
      '⛸️',
      '🥇',
      '🥈',
      '🥉',
      '🏆',
      '🏅',
      '🎖️',
      '🏋️',
      '🤸',
      '🚴',
    ],
    ocean: [
      '🐙',
      '🦑',
      '🦐',
      '🦞',
      '🦀',
      '🐡',
      '🐠',
      '🐟',
      '🐬',
      '🐳',
      '🐋',
      '🦈',
      '🪼',
      '🐚',
      '🌊',
      '⛵',
      '🚤',
      '⚓',
      '🪸',
      '🪝',
      '🧜‍♀️',
      '🧜‍♂️',
      '🏝️',
      '🌴',
      '🌅',
      '🌞',
      '🐢',
      '🦭',
      '🐊',
      '🦦',
    ],
    fantasy: [
      '🧙',
      '🧝',
      '🧛',
      '🧟',
      '🧞',
      '🧚',
      '🐉',
      '🐲',
      '🦄',
      '👑',
      '⚔️',
      '🛡️',
      '🏹',
      '🔮',
      '🪄',
      '📜',
      '🧙‍♂️',
      '🧙‍♀️',
      '🧝‍♂️',
      '🧝‍♀️',
      '🧛‍♂️',
      '🧛‍♀️',
      '🧟‍♂️',
      '🧟‍♀️',
      '🧚‍♂️',
      '🧚‍♀️',
      '🪬',
      '💎',
      '🔥',
      '🌙',
    ],
    dinosaurs: [
      '🦖',
      '🦕',
      '🐉',
      '🐲',
      '🦎',
      '🐊',
      '🐍',
      '🦖',
      '🦕',
      '🐉',
      '🦎',
      '🐲',
      '🐊',
      '🐍',
      '🦖',
      '🦕',
      '🐉',
      '🐲',
      '🦎',
      '🐊',
      '🐍',
      '🦖',
      '🦕',
      '🐉',
      '🐲',
      '🦎',
      '🐊',
      '🐍',
      '🦖',
      '🦕',
    ],
  };
  themeKeys = Object.keys(this.themes);

  constructor() {
    this.start();

    this.destroyRef.onDestroy(() => {
      clearInterval(this.interval);
      this.engine.stop();
    });
  }

  shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  start() {
    this.win.set(false);

    clearInterval(this.interval);
    this.timer.set(0);

    this.interval = setInterval(() => {
      this.timer.update((t) => t + 1);
    }, 1000);

    const symbols = this.shuffle(this.themes[this.theme()]).slice(0, this.size() / 2);

    const pairs = [...symbols, ...symbols];

    const shuffled = this.shuffle(
      pairs.map((symbol) => ({
        symbol,
        flipped: false,
        matched: false,
      })),
    );

    this.cards.set(shuffled);

    const cols = Math.ceil(Math.sqrt(this.size()));
    this.columns.set(cols);

    this.selected = [];
    this.lock = false;

    this.engine.start();
  }

  setSize(size: number) {
    this.size.set(Number(size));
    this.start();
  }

  setTheme(theme: string) {
    this.theme.set(theme);
    this.start();
  }

  flip(card: Card) {
    if (this.lock) return;
    if (card.flipped || card.matched) return;

    card.flipped = true;

    this.selected.push(card);

    this.cards.update((c) => [...c]);

    if (this.selected.length !== 2) return;

    this.lock = true;

    const [a, b] = this.selected;

    if (a.symbol === b.symbol) {
      a.matched = true;
      b.matched = true;

      this.engine.addScore(10);

      this.selected = [];
      this.lock = false;

      this.cards.update((c) => [...c]);

      this.checkWin();
    } else {
      setTimeout(() => {
        a.flipped = false;
        b.flipped = false;

        this.selected = [];
        this.lock = false;

        this.cards.update((c) => [...c]);
      }, 900);
    }
  }

  checkWin() {
    const done = this.cards().every((c) => c.matched);

    if (!done) return;

    clearInterval(this.interval);

    this.win.set(true);

    confetti({
      particleCount: 150,
      spread: 90,
    });
  }

  getThemeEmoji(theme: string) {
    return this.themes[theme][0];
  }
}
