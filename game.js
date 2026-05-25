import { canvas, ctx, state, inputMap } from './src/config.js';
import { Fighter } from './src/fighter.js';
import { drawHUD } from './src/hud.js';

const player1 = new Fighter('P1');
const player2 = new Fighter('P2');
player1.opponent = player2;
player2.opponent = player1;

// Global input listener hooks to bridge instant edge triggers to fighter instances
window.addEventListener('keydown', (event) => {
  if (event.code === 'Space' && !player1.isAttacking) player1.attack();
  if (event.code === 'Enter' && !player2.isAttacking) player2.attack();
  if (event.code === 'KeyQ' && player1.specialGauge >= 50 && !player1.isAttacking) player1.exAttack();
  if (event.code === 'ShiftRight' && player2.specialGauge >= 50 && !player2.isAttacking) player2.exAttack();
});

function gameLoop() {
  window.requestAnimationFrame(gameLoop);
  ctx.save();

  if (state.screenShakeTimer > 0) {
    ctx.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);
    state.screenShakeTimer--;
  }

  ctx.clearRect(-10, -10, canvas.width + 20, canvas.height + 20);

  // Render Static UI & Gauges
  drawHUD(ctx, player1, player2);

  // Process movement vectors
  if (inputMap.KeyA) player1.vx = -5;
  else if (inputMap.KeyD) player1.vx = 5;
  if (inputMap.KeyW && player1.isGrounded) { player1.vy = -14; player1.isGrounded = false; }

  if (inputMap.ArrowLeft) player2.vx = -5;
  else if (inputMap.ArrowRight) player2.vx = 5;
  if (inputMap.ArrowUp && player2.isGrounded) { player2.vy = -14; player2.isGrounded = false; }

  // Update logic states
  player1.update();
  player2.update();

  // Cycle spark array list
  for (let i = state.particles.length - 1; i >= 0; i--) {
    state.particles[i].update();
    if (state.particles[i].life <= 0) state.particles.splice(i, 1);
    else state.particles[i].render(ctx);
  }

  // Render player vectors
  player1.render(ctx);
  player2.render(ctx);
  ctx.restore();
}

gameLoop();
