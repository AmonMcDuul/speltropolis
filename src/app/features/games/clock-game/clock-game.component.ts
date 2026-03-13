import { Component, signal, computed } from '@angular/core';
import { GameContainerComponent } from '../../../shared/components/game-container/game-container.component';

interface Time {
  hour: number;
  minute: number;
}

interface ClockNumber {
  value: number;
  x: number;
  y: number;
}

@Component({
  selector: 'app-clock-game',
  standalone: true,
  templateUrl: './clock-game.component.html',
  styleUrl: './clock-game.component.scss',
  imports: [GameContainerComponent],
})
export class ClockGameComponent {
  difficulty = signal<'hour' | 'half' | 'quarter' | 'five'>('hour');

  current = signal<Time>({ hour: 3, minute: 0 });

  answers = signal<string[]>([]);
  correct = signal('');

  ticks = Array.from({ length: 60 }, (_, i) => i);

  numbers: ClockNumber[] = [];

  constructor() {
    this.generateClockNumbers();
  }

  ngOnInit() {
    this.newQuestion();
  }

  generateClockNumbers() {
    for (let n = 1; n <= 12; n++) {
      const angle = (n * 30 * Math.PI) / 180;

      this.numbers.push({
        value: n,
        x: 100 + 80 * Math.sin(angle),
        y: 100 - 80 * Math.cos(angle),
      });
    }
  }

  setDifficulty(level: any) {
    this.difficulty.set(level);
    this.newQuestion();
  }

  newQuestion() {
    const time = this.generateTime();

    this.current.set(time);

    const correct = this.timeToText(time);

    this.correct.set(correct);

    this.answers.set(this.generateAnswers(correct));
  }

  generateTime(): Time {
    const hour = Math.floor(Math.random() * 12) + 1;

    let minute = 0;

    switch (this.difficulty()) {
      case 'hour':
        minute = 0;
        break;

      case 'half':
        minute = Math.random() < 0.5 ? 0 : 30;
        break;

      case 'quarter':
        minute = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
        break;

      case 'five':
        minute = Math.floor(Math.random() * 12) * 5;
        break;
    }

    return { hour, minute };
  }

  generateAnswers(correct: string) {
    const set = new Set<string>();

    set.add(correct);

    while (set.size < 4) {
      const h = Math.floor(Math.random() * 12) + 1;
      const m = Math.floor(Math.random() * 12) * 5;

      set.add(this.timeToText({ hour: h, minute: m }));
    }

    return Array.from(set).sort(() => Math.random() - 0.5);
  }

  answer(choice: string) {
    if (choice === this.correct()) {
      setTimeout(() => this.newQuestion(), 800);
    }
  }

  formatDigital(t: Time) {
    const mm = t.minute.toString().padStart(2, '0');

    return `${t.hour}:${mm}`;
  }

  timeToText(t: Time) {
    const h = t.hour;
    const m = t.minute;

    const next = h === 12 ? 1 : h + 1;

    if (m === 0) return `${h} uur`;

    if (m === 15) return `kwart over ${h}`;

    if (m === 30) return `half ${next}`;

    if (m === 45) return `kwart voor ${next}`;

    if (m < 30) return `${m} over ${h}`;

    return `${60 - m} voor ${next}`;
  }

  hourAngle = computed(() => {
    const t = this.current();

    return (t.hour % 12) * 30 + t.minute * 0.5;
  });

  minuteAngle = computed(() => {
    const t = this.current();

    return t.minute * 6;
  });
}
