// Global camera shake tracking metrics
let screenShakeTimer = 0;

// Global particle physics simulation array
let particles = [];

// ==========================================
// 1. THE PARTICLE COMPONENT ENGINE
// ==========================================
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    // Explode outward randomly in a circular burst vector
    this.vx = (Math.random() - 0.5) * 8;
    this.vy = (Math.random() - 0.5) * 12 - 3; // Pop upward slightly
    this.size = Math.random() * 4 + 3; // Variable particle sizes
    this.gravity = 0.4;
    this.life = 1.0; // Decay timer alpha ratio
    this.decay = Math.random() * 0.03 + 0.02;
  }

  update() {
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;

    // Bounce handling off the neon floor arena line
    if (this.y >= 430) {
      this.y = 430;
      this.vy = -this.vy * 0.5; // Absorb energy and bounce up
      this.vx *= 0.7; // Apply rolling friction drag
    }
  }

  render(ctx) {
    ctx.fillStyle = `rgba(34, 211, 238, ${this.life})`; // Glowing Cyan Spark matrix
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

// ==========================================
// 2. THE FIGHTER ENTITY CLASS DEFINITION
// ==========================================
class Fighter {
  constructor(side) {
    this.side = side;
    this.width = 50;  
    this.height = 100;
    this.x = side === 'P1' ? 150 : 600; 
    this.y = 330;                      
    this.health = 100;
    this.vx = 0;
    this.vy = 0;                       
    this.gravity = 0.6;                
    this.isGrounded = true;            
    this.isAttacking = false; 
    this.facing = side === 'P1' ? 'right' : 'left'; 
    this.attackBox = {
      x: this.x,
      y: this.y,
      width: 100,
      height: 50
    };
    this.hitStun = false;
    this.opponent = null; 
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 150); 
  }

  update() {
    // Dynamic Directional Facing Logic
    if (this.opponent) {
      if (this.x < this.opponent.x) {
        this.facing = 'right';
      } else {
        this.facing = 'left';
      }
    }

    // Core Gravity Calculation Loop
    if (this.y + this.height < 430) {
      this.vy += this.gravity;
      this.isGrounded = false;
    } else {
      if (this.vy >= 0) {
        this.vy = 0;
        this.y = 330; 
        this.isGrounded = true;
      }
    }

    // Apply Horizontal Velocity and Friction Decay
    this.x += this.vx;
    if (this.isGrounded) {
      this.vx *= 0.85; 
    } else {
      this.vx *= 0.95; 
    }

    // Apply Vertical Displacement
    this.y += this.vy;

    // Keep players locked inside horizontal screen walls
    this.x = Math.max(0, Math.min(this.x, canvas.width - this.width));

    // Project attackBox forward cleanly based on spatial orientation
    if (this.facing === 'right') {
      this.attackBox.x = this.x + this.width;
    } else {
      this.attackBox.x = this.x - this.attackBox.width;
    }
    this.attackBox.y = this.y + 20;

    // Trigger attack input marks dynamically
    if (this.side === 'P1' && inputMap.Space && !this.isAttacking) {
      this.attack();
    }
    if (this.side === 'P2' && inputMap.Enter && !this.isAttacking) {
      this.attack();
    }

    // Collision Matrix Validation
    if (this.isAttacking && this.opponent) {
      const collided = this.checkAABB(this.attackBox, this.opponent);
      if (collided) {
        this.opponent.health -= 10; 
        this.opponent.hitStun = true;
        this.isAttacking = false;   
        
        // Trigger impact camera rattle
        screenShakeTimer = 12; 
        if (this.facing === 'right') {
          this.opponent.vx = 14; 
        } else {
          this.opponent.vx = -14; 
        }

        // --- SPAWN TIER 9 NEON EXPLOSION SPARKS ---
        const contactX = this.facing === 'right' ? this.opponent.x : this.opponent.x + this.opponent.width;
        const contactY = this.attackBox.y + (this.attackBox.height / 2);
        for (let i = 0; i < 18; i++) {
          particles.push(new Particle(contactX, contactY));
        }
        
        setTimeout(() => {
          this.opponent.hitStun = false;
        }, 200);
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
    // Draw Main Body Rectangle (Flashes white on impact)
    ctx.fillStyle = this.hitStun ? '#ffffff' : (this.side === 'P1' ? '#ef4444' : '#3b82f6');
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Draw Spatial Visor Indicator Block
    ctx.fillStyle = '#ffffff';
    if (this.facing === 'right') {
      ctx.fillRect(this.x + this.width - 12, this.y + 15, 12, 18);
    } else {
      ctx.fillRect(this.x, this.y + 15, 12, 18);
    }

    // Draw Visual Attack Strike Flash Box
    if (this.isAttacking) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillRect(this.attackBox.x, this.attackBox.y, this.attackBox.width, this.attackBox.height);
    }
  }
}

// ==========================================
// 3. CANVAS & CONTEXT INITIALIZATION
// ==========================================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 450;

// HUD METRICS CONSTANTS
const HEALTH_BAR_WIDTH = 300;
const HEALTH_BAR_HEIGHT = 30;
const HEALTH_BAR_X_P1 = 50;
const HEALTH_BAR_X_P2 = 450;
const HEALTH_BAR_Y = 30;
const HEALTH_BAR_COLOR = '#7f1d1d';
const HEALTH_FILL_COLOR = '#22c55e';
const HEALTH_FONT = 'bold 16px sans-serif';
const HEALTH_TEXT_COLOR = '#ffffff';

// ==========================================
// 4. THE CORE INPUT HARDWARE MONITOR
// ==========================================
const inputMap = {
  KeyA: false,
  KeyD: false,
  KeyW: false,
  Space: false,
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  Enter: false
};

window.addEventListener('keydown', (event) => {
  if (['Space', 'ArrowUp', 'ArrowDown'].includes(event.code)) {
    event.preventDefault(); 
  }
  if (event.code in inputMap) {
    inputMap[event.code] = true;
  }
});

window.addEventListener('keyup', (event) => {
  if (event.code in inputMap) {
    inputMap[event.code] = false;
  }
});

// ==========================================
// 5. ENTITY INSTANTIATION
// ==========================================
const player1 = new Fighter('P1');
const player2 = new Fighter('P2');

player1.opponent = player2;
player2.opponent = player1;

// ==========================================
// 6. THE CORE ENGINE LIFECYCLE LOOP
// ==========================================
function gameLoop() {
  window.requestAnimationFrame(gameLoop);

  ctx.save();

  // Rendering camera screen shake translation
  if (screenShakeTimer > 0) {
    const dx = (Math.random() - 0.5) * 8;
    const dy = (Math.random() - 0.5) * 8;
    ctx.translate(dx, dy);
    screenShakeTimer--;
  }

  ctx.clearRect(-10, -10, canvas.width + 20, canvas.height + 20);

  // Draw HUD Background wrappers
  ctx.fillStyle = HEALTH_BAR_COLOR;
  ctx.fillRect(HEALTH_BAR_X_P1, HEALTH_BAR_Y, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT);
  ctx.fillRect(HEALTH_BAR_X_P2, HEALTH_BAR_Y, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT);

  // Scaling bars
  const healthWidthP1 = HEALTH_BAR_WIDTH * (Math.max(0, player1.health) / 100);
  ctx.fillStyle = HEALTH_FILL_COLOR;
  ctx.fillRect(HEALTH_BAR_X_P1, HEALTH_BAR_Y, healthWidthP1, HEALTH_BAR_HEIGHT);
  
  const healthWidthP2 = HEALTH_BAR_WIDTH * (Math.max(0, player2.health) / 100);
  ctx.fillStyle = HEALTH_FILL_COLOR;
  ctx.fillRect(HEALTH_BAR_X_P2, HEALTH_BAR_Y, healthWidthP2, HEALTH_BAR_HEIGHT);

  // Write Text Labels
  ctx.fillStyle = HEALTH_TEXT_COLOR;
  ctx.font = HEALTH_FONT;
  ctx.fillText('P1', HEALTH_BAR_X_P1, HEALTH_BAR_Y - 8);
  ctx.fillText('P2', HEALTH_BAR_X_P2 + HEALTH_BAR_WIDTH - 22, HEALTH_BAR_Y - 8);

  // Draw Ground Line
  ctx.strokeStyle = '#06b6d4'; 
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 430);
  ctx.lineTo(canvas.width, 430);
  ctx.stroke();

  // Process P1 Horizontal Vector Channels
  if (inputMap.KeyA) player1.vx = -5;
  else if (inputMap.KeyD) player1.vx = 5;

  if (inputMap.KeyW && player1.isGrounded) {
    player1.vy = -14;
    player1.isGrounded = false;
  }

  // Process P2 Horizontal Vector Channels
  if (inputMap.ArrowLeft) player2.vx = -5;
  else if (inputMap.ArrowRight) player2.vx = 5;

  if (inputMap.ArrowUp && player2.isGrounded) {
    player2.vy = -14;
    player2.isGrounded = false;
  }

  // Compute logic updates
  player1.update();
  player2.update();

  // Cycle and animate particle physics array list
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    if (particles[i].life <= 0) {
      particles.splice(i, 1); // Garbage collect dead particles
    } else {
      particles[i].render(ctx);
    }
  }

  // Render models to viewport canvas frame
  player1.render(ctx);
  player2.render(ctx);

  ctx.restore();
}

console.log("Tier 9 particle array simulation online.");
gameLoop();
