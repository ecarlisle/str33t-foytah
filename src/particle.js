import { state } from './config.js';

export class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 10;
    this.vy = (Math.random() - 0.5) * 14 - 4; 
    this.size = Math.random() * 5 + 3; 
    this.gravity = 0.4;
    this.life = 1.0; 
    this.decay = Math.random() * 0.04 + 0.02;
  }

  update() {
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;

    if (this.y >= 430) {
      this.y = 430;
      this.vy = -this.vy * 0.4; 
      this.vx *= 0.6; 
    }
  }

  render(ctx) {
    ctx.fillStyle = `rgba(34, 211, 238, ${this.life})`; 
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}
