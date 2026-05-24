// ==========================================
// 1. THE FIGHTER ENTITY CLASS DEFINITION
// ==========================================
class Fighter {
  constructor(side) {
    this.side = side;
    this.width = 50;  
    this.height = 100;
    this.x = side === 'P1' ? 150 : 600; // Safe starting spacing
    this.y = 330;                      // Floor level alignment
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
    }, 150); // Active collision window
  }

  update() {
    // Dynamic attack box flipping based on player orientation
    this.attackBox.x = this.x + (this.side === 'P1' ? this.width : -this.attackBox.width);
    this.attackBox.y = this.y + 20;

    // Direct hardware button listeners
    if (this.side === 'P1' && key.Space.pressed && !this.isAttacking) {
      this.attack();
    }
    if (this.side === 'P2' && key.Enter.pressed && !this.isAttacking) {
      this.attack();
    }

    // AABB Collision processing matrix
    if (this.isAttacking && this.opponent) {
      const collided = this.checkAABB(this.attackBox, this.opponent);
      if (collided) {
        this.opponent.health -= 10; // Applies damage to target vector
        this.opponent.hitStun = true;
        this.isAttacking = false;   // Prevents multi-hit collision frames
        
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
    // Flash white on impact, otherwise standard character tracking colors
    ctx.fillStyle = this.hitStun ? '#ffffff' : (this.side === 'P1' ? '#ef4444' : '#3b82f6');
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Active strike zone overlay bounds
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

// HUD UI LAYOUT CONSTANTS
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

  // Clear canvas clean every loop to prevent frame trailing artifacts
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // --- RENDERING ARCADE HEALTH BARS HUD ---
  // Draw Static Underlayer Backgrounds (Red damage indicator)
  ctx.fillStyle = HEALTH_BAR_COLOR;
  ctx.fillRect(HEALTH_BAR_X_P1, HEALTH_BAR_Y, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT);
  ctx.fillRect(HEALTH_BAR_X_P2, HEALTH_BAR_Y, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT);

  // Calculate and draw Player 1 scaling foreground metric
  const healthWidthP1 = HEALTH_BAR_WIDTH * (Math.max(0, player1.health) / 100);
  ctx.fillStyle = HEALTH_FILL_COLOR;
  ctx.fillRect(HEALTH_BAR_X_P1, HEALTH_BAR_Y, healthWidthP1, HEALTH_BAR_HEIGHT);
  
  // Calculate and draw Player 2 scaling foreground metric
  const healthWidthP2 = HEALTH_BAR_WIDTH * (Math.max(0, player2.health) / 100);
  ctx.fillStyle = HEALTH_FILL_COLOR;
  ctx.fillRect(HEALTH_BAR_X_P2, HEALTH_BAR_Y, healthWidthP2, HEALTH_BAR_HEIGHT);

  // Write UI labels above tracking meters
  ctx.fillStyle = HEALTH_TEXT_COLOR;
  ctx.font = HEALTH_FONT;
  ctx.fillText('P1', HEALTH_BAR_X_P1, HEALTH_BAR_Y - 8);
  ctx.fillText('P2', HEALTH_BAR_X_P2 + HEALTH_BAR_WIDTH - 22, HEALTH_BAR_Y - 8);

  // Draw Ground Deck
  ctx.strokeStyle = '#06b6d4'; 
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 430);
  ctx.lineTo(canvas.width, 430);
  ctx.stroke();

  // Process P1 Active Horizontal Vector Shifts
  player1.vx = 0;
  if (key.a.pressed) player1.vx = -5;
  if (key.d.pressed) player1.vx = 5;
  player1.x += player1.vx;

  // Process P2 Active Horizontal Vector Shifts
  player2.vx = 0;
  if (key.ArrowLeft.pressed) player2.vx = -5;
  if (key.ArrowRight.pressed) player2.vx = 5;
  player2.x += player2.vx;

  // Hard screen edge boundary limits
  player1.x = Math.max(0, Math.min(player1.x, canvas.width - player1.width));
  player2.x = Math.max(0, Math.min(player2.x, canvas.width - player2.width));

  // Compute game logic matrices
  player1.update();
  player2.update();

  // Render player models to viewport frame
  player1.render(ctx);
  player2.render(ctx);
}

console.log("Master core engine running smoothly with HUD extensions loaded.");
gameLoop();
