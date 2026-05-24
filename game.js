// ==========================================
// 1. CANVAS & CONTEXT INITIALIZATION
// ==========================================
const canvas = document.querySelector('canvas') || document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Hard-code layout metrics to match our strict 800x450 framework specification
canvas.width = 800;
canvas.height = 450;

// ==========================================
// 2. THE GLOBAL SIMULTANEOUS INPUT MAP
// ==========================================
const key = {
  // Player 1 Vectors
  a: { pressed: false },
  d: { pressed: false },
  W: { pressed: false },
  Space: { pressed: false },
  
  // Player 2 Vectors
  ArrowLeft: { pressed: false },
  ArrowRight: { pressed: false },
  ArrowUp: { pressed: false },
  Enter: { pressed: false }
};

// Map physical browser hardware events straight to our binary tracker state
window.addEventListener('keydown', (event) => {
  const k = event.key === ' ' ? 'Space' : event.key;
  if (key[k]) key[k].pressed = true;
});

window.addEventListener('keyup', (event) => {
  const k = event.key === ' ' ? 'Space' : event.key;
  if (key[k]) key[k].pressed = false;
});

// ==========================================
// 3. ENTITY INSTANTIATION
// ==========================================
const player1 = new Fighter('P1');
const player2 = new Fighter('P2');

// Cross-link the instances so the AABB collision checks know who to damage
player1.opponent = player2;
player2.opponent = player1;

// Give them basic placeholder horizontal velocities for physics movement
player1.vx = 0;
player2.vx = 0;

// ==========================================
// 4. THE CORE ENGINE LIFECYCLE LOOP
// ==========================================
function gameLoop() {
  window.requestAnimationFrame(gameLoop);

  // CRITICAL: Wipe the canvas clean every frame to completely prevent sprite bleeding
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw a placeholder ground floor line for visual alignment
  ctx.strokeStyle = '#444';
  ctx.beginPath();
  ctx.moveTo(0, 430);
  ctx.lineTo(canvas.width, 430);
  ctx.stroke();

  // Handle Player 1 Horizontal Movement Input Tracking
  player1.vx = 0;
  if (key.a.pressed) player1.vx = -5;
  if (key.d.pressed) player1.vx = 5;
  player1.x += player1.vx;

  // Handle Player 2 Horizontal Movement Input Tracking
  player2.vx = 0;
  if (key.ArrowLeft.pressed) player2.vx = -5;
  if (key.ArrowRight.pressed) player2.vx = 5;
  player2.x += player2.vx;

  // Basic screen edge boundaries (Keep players inside the 800px canvas window)
  player1.x = Math.max(0, Math.min(player1.x, canvas.width - player1.width));
  player2.x = Math.max(0, Math.min(player2.x, canvas.width - player2.width));

  // Update entity combat lifecycles and collision physics matrices
  player1.update();
  player2.update();

  // Render our fighters and active debugging hitboxes to the viewport
  player1.render(ctx);
  player2.render(ctx);
}

// Kickstart the engine!
console.log("Engine loaded successfully. Starting game loop...");
gameLoop();
