// ==========================================
// 1. THE FIGHTER ENTITY CLASS DEFINITION
// ==========================================
class Fighter {
  constructor(side) {
    this.side = side;
    this.width = 50;  
    this.height = 100;
    this.x = side === 'P1' ? 150 : 600; // Starting positions on screen
    this.y = 330;                      // Ground level clamp
    this.health = 100;
    this.vx = 0;
    this.isAttacking = false; 
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
    }, 150); // Active frame window
  }

  update() {
    // Sync attack box positions dynamically with direction orientation
    this.attackBox.x = this.x + (this.side === 'P1' ? this.width : -this.attackBox.width);
    this.attackBox.y = this.y + 20;

    // Listen for combat inputs to trigger the attack lifecycle
    if (this.side === 'P1' && key.Space.pressed && !this.isAttacking) {
      this.attack();
    }
    if (this.side === 'P2' && key.Enter.pressed && !this.isAttacking) {
      this.attack();
    }

    // Collision Processing
    if (this.isAttacking && this.opponent) {
      const collided = this.checkAABB(this.attackBox, this.opponent);
      if (collided) {
        this.opponent.health -= 10; // Deals damage to opponent
        this.opponent.hitStun = true;
        this.isAttacking = false;   // Turn off box on impact
        
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
    // Render Fighter Body (flashes white during hitStun)
    ctx.fillStyle = this.hitStun ? '#ffffff' : (this.side === 'P1' ? '#ef4444' : '#3b82f6');
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Render Debug Active Hitbox Bounds
    if (this.isAttacking) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillRect(this.attackBox.x, this.attackBox.y, this.attackBox.width, this.attackBox.height);
    }
  }
}

// ==========================================
// 2. CANVAS & CONTEXT INITIALIZATION
// ==========================================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 450;

// ==========================================
// 3. THE GLOBAL SIMULTANEOUS INPUT MAP
// ==========================================
const key = {
  a: { pressed: false },
  d: { pressed: false },
  W: { pressed: false },
  Space: { pressed: false },
  ArrowLeft: { pressed: false },
  ArrowRight: { pressed: false },
  ArrowUp: { pressed: false },
  Enter: { pressed: false }
};

window.addEventListener('keydown', (event) => {
  const k = event.key === ' ' ? 'Space' : event.key;
  if (key[k]) key[k].pressed = true;
});

window.addEventListener('keyup', (event) => {
  const k = event.key === ' ' ? 'Space' : event.key;
  if (key[k]) key[k].pressed = false;
});

// ==========================================
// 4. ENTITY INSTANTIATION
// ==========================================
const player1 = new Fighter('P1');
const player2 = new Fighter('P2');

player1.opponent = player2;
player2.opponent = player1;

// ==========================================
// 5. THE CORE ENGINE LIFECYCLE LOOP
// ==========================================
function gameLoop() {
  window.requestAnimationFrame(gameLoop);

  // Clear canvas completely to prevent artifact trails
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw neon cyan floor line boundary
  ctx.strokeStyle = '#06b6d4'; 
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 430);
  ctx.lineTo(canvas.width, 430);
  ctx.stroke();

  // Handle Player 1 Movement Input Vectors
  player1.vx = 0;
  if (key.a.pressed) player1.vx = -5;
  if (key.d.pressed) player1.vx = 5;
  player1.x += player1.vx;

  // Handle Player 2 Movement Input Vectors
  player2.vx = 0;
  if (key.ArrowLeft.pressed) player2.vx = -5;
  if (key.ArrowRight.pressed) player2.vx = 5;
  player2.x += player2.vx;

  // Keep players clamped inside the screen margins
  player1.x = Math.max(0, Math.min(player1.x, canvas.width - player1.width));
  player2.x = Math.max(0, Math.min(player2.x, canvas.width - player2.width));

  // Run logic calculations
  player1.update();
  player2.update();

  // Render updates to canvas viewport
  player1.render(ctx);
  player2.render(ctx);
}

// Kickstart the engine execution thread
console.log("Combined engine script compiled and executing.");
gameLoop();
