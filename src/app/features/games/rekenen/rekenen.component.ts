import { Component, signal, computed, HostListener } from '@angular/core';
import { GameContainerComponent } from '../../../shared/components/game-container/game-container.component';

type Operator = '+' | '-' | '*' | '/';

interface Problem {
  a: number;
  b: number;
  op: Operator;
}

@Component({
  selector: 'app-rekenen',
  imports: [GameContainerComponent],
  templateUrl: './rekenen.component.html',
  styleUrl: './rekenen.component.scss',
})
export class RekenenComponent {
  evaluating = signal(false);
  operatorList = ['+', '-', '*', '/'] as const;

  operators = signal<Operator[]>(['+']);

  min = signal(1);
  max = signal(10);

  table = signal<number | null>(null);

  answer = signal('');
  result = signal<number | null>(null);

  score = signal(0);
  streak = signal(0);

  problem = signal<Problem>(this.generate());

  keypad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  isCorrect = computed(() => {
    const r = this.result();
    if (r === null) return null;
    return Number(this.answer()) === r;
  });

  currentQuestion = computed(() => {
    const p = this.problem();
    return `${p.a} ${p.op} ${p.b}`;
  });

  toggleOperator(op: Operator) {
    this.table.set(null);

    const ops = [...this.operators()];

    if (ops.includes(op)) {
      if (ops.length === 1) return;
      this.operators.set(ops.filter((o) => o !== op));
    } else {
      ops.push(op);
      this.operators.set(ops);
    }
  }

  setTable(n: number) {
    this.table.set(n);
    this.operators.set(['*']);
  }

  generate(): Problem {
    if (this.table()) {
      const a = this.table()!;
      const b = Math.floor(Math.random() * 10) + 1;
      return { a, b, op: '*' };
    }

    const ops = this.operators();
    const op = ops[Math.floor(Math.random() * ops.length)];

    const min = this.min();
    const max = this.max();

    let a = Math.floor(Math.random() * (max - min + 1)) + min;
    let b = Math.floor(Math.random() * (max - min + 1)) + min;

    if (op === '-' && b > a) {
      [a, b] = [b, a];
    }

    if (op === '/') {
      const result = Math.floor(Math.random() * (max - min + 1)) + min;
      const b = Math.floor(Math.random() * (max - min + 1)) + min;

      const a = result * b;

      return { a, b, op };
    }

    return { a, b, op };
  }

  calculate(p: Problem) {
    switch (p.op) {
      case '+':
        return p.a + p.b;
      case '-':
        return p.a - p.b;
      case '*':
        return p.a * p.b;
      case '/':
        return p.a / p.b;
    }
  }

  submit() {
    if (this.evaluating()) return;

    const correct = this.calculate(this.problem());

    this.result.set(correct);
    this.evaluating.set(true);

    if (Number(this.answer()) === correct) {
      this.score.update((s) => s + 1);
      this.streak.update((s) => s + 1);

      this.confetti();
    } else {
      this.streak.set(0);
    }

    setTimeout(() => {
      this.nextProblem();
      this.evaluating.set(false);
    }, 700);
  }

  skip() {
    if (this.evaluating()) return;
    this.answer.set('');
    this.result.set(null);
    this.problem.set(this.generate());
  }

  nextProblem() {
    this.answer.set('');
    this.result.set(null);
    this.problem.set(this.generate());
  }

  input(n: string) {
    if (this.evaluating()) return;
    this.answer.set(this.answer() + n);
  }

  backspace() {
    if (this.evaluating()) return;
    this.answer.set(this.answer().slice(0, -1));
  }

  incMin() {
    if (this.min() < this.max() - 1) {
      this.min.update((v) => v + 1);
    }
  }

  decMin() {
    if (this.min() > 0) {
      this.min.update((v) => v - 1);
    }
  }

  incMax() {
    this.max.update((v) => v + 1);
  }

  decMax() {
    if (this.max() > this.min() + 1) {
      this.max.update((v) => v - 1);
    }
  }

  @HostListener('document:keydown.enter')
  enter() {
    this.submit();
  }

  @HostListener('document:keydown.backspace')
  handleBackspace() {
    this.backspace();
  }

  @HostListener('document:keydown', ['$event'])
  numberKey(e: KeyboardEvent) {
    if (this.evaluating()) return;
    if (e.key === 'Enter') return;
    if (e.key === 'Backspace') return;

    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      this.input(e.key);
    }
  }

  confetti() {
    const originX = window.innerWidth / 2;
    const originY = window.innerHeight / 2;

    for (let i = 0; i < 60; i++) {
      const el = document.createElement('div');
      el.className = 'confetti';

      el.style.left = originX + 'px';
      el.style.top = originY + 'px';

      el.style.background = `hsl(${Math.random() * 360},80%,60%)`;

      const angle = Math.random() * Math.PI * 2;
      const distance = 200 + Math.random() * 200;

      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      el.style.setProperty('--x', `${x}px`);
      el.style.setProperty('--y', `${y}px`);

      el.style.width = 6 + Math.random() * 8 + 'px';
      el.style.height = 6 + Math.random() * 8 + 'px';

      document.body.appendChild(el);

      setTimeout(() => el.remove(), 1200);
    }
  }
}
