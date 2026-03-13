import { Injectable, signal } from '@angular/core';

@Injectable()
export class GameEngine {
  score = signal(0);
  time = signal(0);
  running = signal(false);

  private timer?: any;

  start() {
    this.reset();

    this.running.set(true);

    this.timer = setInterval(() => {
      this.time.update((t) => t + 1);
    }, 1000);
  }

  stop() {
    this.running.set(false);

    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  addScore(points: number) {
    this.score.update((s) => s + points);
  }

  reset() {
    this.score.set(0);
    this.time.set(0);
  }
}
