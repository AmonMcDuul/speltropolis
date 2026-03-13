import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
  OnDestroy,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { GameContainerComponent } from '../../../shared/components/game-container/game-container.component';

interface Bullet {
  x: number;
  y: number;
  vy: number;
  active: boolean;
}

interface Alien {
  x: number;
  y: number;
  alive: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

@Component({
  selector: 'app-space-invaders',
  standalone: true,
  imports: [GameContainerComponent],
  templateUrl: './space-invaders.component.html',
  styleUrl: './space-invaders.component.scss',
})
export class SpaceInvadersComponent implements AfterViewInit, OnDestroy {
  platformId = inject(PLATFORM_ID);

  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;

  width = 800;
  height = 500;

  playerX = 400;
  playerSpeed = 7;

  bullets: Bullet[] = [];
  enemyBullets: Bullet[] = [];
  aliens: Alien[] = [];
  particles: Particle[] = [];

  alienDir = 1;
  alienSpeed = 0.4;

  score = 0;
  lives = 3;
  wave = 1;

  running = true;

  lastShot = 0;
  shootCooldown = 350;

  keys: any = {};

  mobileLeft = false;
  mobileRight = false;

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    this.ctx = ctx;

    canvas.width = this.width;
    canvas.height = this.height;

    this.spawnAliens();

    requestAnimationFrame(() => this.loop());
  }

  ngOnDestroy() {
    this.running = false;
  }

  spawnAliens() {
    this.aliens = [];

    const rows = 4;
    const cols = 10;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        this.aliens.push({
          x: 80 + x * 60,
          y: 60 + y * 50,
          alive: true,
        });
      }
    }
  }

  shoot() {
    const now = Date.now();

    if (now - this.lastShot < this.shootCooldown) return;

    this.lastShot = now;

    this.bullets.push({
      x: this.playerX,
      y: this.height - 50,
      vy: -7,
      active: true,
    });
  }

  enemyShoot(a: Alien) {
    this.enemyBullets.push({
      x: a.x,
      y: a.y,
      vy: 2.2,
      active: true,
    });
  }

  spawnExplosion(x: number, y: number) {
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 3;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 30,
      });
    }
  }

  update() {
    if (this.keys['ArrowLeft'] || this.mobileLeft) {
      this.playerX -= this.playerSpeed;
    }

    if (this.keys['ArrowRight'] || this.mobileRight) {
      this.playerX += this.playerSpeed;
    }

    for (const b of this.bullets) {
      if (!b.active) continue;
      b.y += b.vy;
      if (b.y < 0) b.active = false;
    }

    for (const b of this.enemyBullets) {
      if (!b.active) continue;
      b.y += b.vy;
      if (b.y > this.height) b.active = false;
    }

    let edge = false;

    for (const a of this.aliens) {
      if (!a.alive) continue;

      a.x += this.alienDir * this.alienSpeed;

      if (a.x > this.width - 40 || a.x < 40) {
        edge = true;
      }

      if (Math.random() < 0.00015 * this.wave) {
        this.enemyShoot(a);
      }
    }

    if (edge) {
      this.alienDir *= -1;

      for (const a of this.aliens) {
        a.y += 20;
      }
    }

    for (const b of this.bullets) {
      if (!b.active) continue;

      for (const a of this.aliens) {
        if (!a.alive) continue;

        if (b.x > a.x - 15 && b.x < a.x + 15 && b.y > a.y - 15 && b.y < a.y + 15) {
          a.alive = false;
          b.active = false;

          this.score += 10;

          this.spawnExplosion(a.x, a.y);
        }
      }
    }

    for (const b of this.enemyBullets) {
      if (!b.active) continue;

      if (b.x > this.playerX - 25 && b.x < this.playerX + 25 && b.y > this.height - 50) {
        b.active = false;
        this.lives--;

        this.spawnExplosion(this.playerX, this.height - 40);

        if (this.lives <= 0) {
          this.running = false;
        }
      }
    }

    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;

      p.life--;
    }

    this.particles = this.particles.filter((p) => p.life > 0);

    if (this.aliens.every((a) => !a.alive)) {
      this.wave++;
      this.alienSpeed += 0.15;
      this.spawnAliens();
    }
  }

  draw() {
    const ctx = this.ctx;

    ctx.clearRect(0, 0, this.width, this.height);

    ctx.fillStyle = '#4dabf7';
    ctx.fillRect(this.playerX - 25, this.height - 40, 50, 15);

    ctx.fillStyle = 'yellow';

    for (const b of this.bullets) {
      if (!b.active) continue;
      ctx.fillRect(b.x - 2, b.y, 4, 10);
    }

    ctx.fillStyle = 'red';

    for (const b of this.enemyBullets) {
      if (!b.active) continue;
      ctx.fillRect(b.x - 2, b.y, 4, 10);
    }

    ctx.fillStyle = '#69db7c';

    for (const a of this.aliens) {
      if (!a.alive) continue;

      ctx.fillRect(a.x - 15, a.y - 15, 30, 20);
    }

    ctx.fillStyle = 'orange';

    for (const p of this.particles) {
      ctx.fillRect(p.x, p.y, 3, 3);
    }

    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';

    ctx.fillText(`Score: ${this.score}`, 10, 20);
    ctx.fillText(`Lives: ${this.lives}`, 10, 40);
    ctx.fillText(`Wave: ${this.wave}`, 10, 60);

    if (!this.running) {
      ctx.font = '40px Arial';
      ctx.fillText('GAME OVER', this.width / 2 - 120, this.height / 2);
    }
  }

  loop() {
    if (this.running) {
      this.update();
    }

    this.draw();

    requestAnimationFrame(() => this.loop());
  }

  restart() {
    this.score = 0;
    this.wave = 1;
    this.lives = 3;
    this.alienSpeed = 0.4;
    this.running = true;

    this.spawnAliens();
  }

  @HostListener('document:keydown', ['$event'])
  keydown(e: KeyboardEvent) {
    this.keys[e.key] = true;

    if (e.key === ' ') {
      this.shoot();
    }

    if (e.key === 'r' && !this.running) {
      this.restart();
    }
  }

  @HostListener('document:keyup', ['$event'])
  keyup(e: KeyboardEvent) {
    this.keys[e.key] = false;
  }

  moveLeft(v: boolean) {
    this.mobileLeft = v;
  }
  moveRight(v: boolean) {
    this.mobileRight = v;
  }
}
