import { state, canvas } from './config.js';
import { Particle } from './particle.js';

export class Fighter {
  constructor(side) {
    this.side = side;
    this.width = 50;  
    this.height = 100;
    this.x = side === 'P1' ? 150 : 600; 
    this.y = 330;                      
    this.health = 100;
    this.specialGauge = 0; 
    this.vx = 0;
    this.vy = 0;                       
    this.gravity = 0.6;                
    this.isGrounded = true;            
    this.isAttacking = false; 
    this.isExAttacking = false; 
    this.facing = side === 'P1' ? 'right' : 'left'; 
    this.attackBox = { x: this.x, y: this.y, width: 60, height: 25 };
    this.hitStun = false;
    this.opponent = null; 
  }

  attack() {
    this.isExAttacking = false;
    this.attackBox.width = 60;
    this.attackBox.height = 25;
    this.isAttacking = true;
    setTimeout(() => { this.isAttacking = false; }, 120);
  }

  exAttack() {
    this.specialGauge -= 50;
    this.isExAttacking = true;
    this.attackBox.width = 140; 
    this.attackBox.height = 40;
    this.isAttacking = true;
    setTimeout(() => { 
      this.isAttacking = false; 
      this.isExAttacking = false;
    }, 200);
  }

  update() {
    if (this.opponent) {
      this.facing = this.x < this.opponent.x ? 'right' : 'left';
    }

    if (this.y + this.height < 430) {
      this.vy += this.gravity;
      this.isGrounded = false;
    } else if (this.vy >= 0) {
      this.vy = 0;
      this.y = 330; 
      this.isGrounded = true;
    }

    this.x += this.vx;
    this.vx *= this.isGrounded ? 0.85 : 0.95; 
    this.y += this.vy;
    this.x = Math.max(0, Math.min(this.x, canvas.width - this.width));

    if (this.facing === 'right') {
      this.attackBox.x = this.x + this.width;
    } else {
      this.attackBox.x = this.x - this.attackBox.width;
    }
    this.attackBox.y = this.isExAttacking ? this.y + 20 : this.y + 30;

    if (this.isAttacking && this.opponent) {
      const collided = this.checkAABB(this.attackBox, this.opponent);
      if (collided) {
        const damageDealt = this.isExAttacking ? 25 : 10;
        this.opponent.health -= damageDealt;
        this.opponent.hitStun = true;
        this.isAttacking = false;   
        
        if (!this.isExAttacking) {
          this.specialGauge = Math.min(100, this.specialGauge + 25);
        }

        state.screenShakeTimer = this.isExAttacking ? 25 : 12; 
        const knockbackForce = this.isExAttacking ? 24 : 14;
        this.opponent.vx = this.facing === 'right' ? knockbackForce : -knockbackForce;

        const contactX = this.facing === 'right' ? this.opponent.x : this.opponent.x + this.opponent.width;
        const contactY = this.attackBox.y + (this.attackBox.height / 2);
        const particleCount = this.isExAttacking ? 35 : 18;
        for (let i = 0; i < particleCount; i++) {
          state.particles.push(new Particle(contactX, contactY));
        }
        
        setTimeout(() => { this.opponent.hitStun = false; }, 200);
      }
    }
  }

  checkAABB(box1, box2) {
    return (
      box1.x < box2.x + box2.width &&
      box1.x + box1.width > box2.x &&
      box1.y < box2.y + box2.height &&
      box1.y + box1.height > box2.y
    );
  }

  render(ctx) {
    ctx.fillStyle = this.hitStun ? '#ffffff' : (this.side === 'P1' ? '#ef4444' : '#3b82f6');
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.fillStyle = '#ffffff';
    if (this.facing === 'right') ctx.fillRect(this.x + this.width - 12, this.y + 15, 12, 18);
    else ctx.fillRect(this.x, this.y + 15, 12, 18);

    if (this.isAttacking) {
      ctx.fillStyle = this.isExAttacking ? '#38bdf8' : '#facc15'; 
      ctx.fillRect(this.attackBox.x, this.attackBox.y, this.attackBox.width, this.attackBox.height);
    }
  }
}
