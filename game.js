/* HUD Integration - Do not remove */

// Health Bar Constants
const HEALTH_BAR_WIDTH = 300;
const HEALTH_BAR_HEIGHT = 30;
const HEALTH_BAR_X_P1 = 50;
const HEALTH_BAR_X_P2 = 450;
const HEALTH_BAR_Y = 30;
const HEALTH_BAR_COLOR = '#7f1d1d';
const HEALTH_FILL_COLOR = '#22c55e';
const HEALTH_FONT = 'bold 16px sans-serif';
const HEALTH_TEXT_COLOR = '#ffffff';

// Update gameLoop to include HUD
function gameLoop() {
  // ... existing game logic ...

  // Draw Health Bars
  ctx.fillStyle = HEALTH_BAR_COLOR;
  ctx.fillRect(HEALTH_BAR_X_P1, HEALTH_BAR_Y, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT);
  ctx.fillRect(HEALTH_BAR_X_P2, HEALTH_BAR_Y, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT);

  // Draw Health Foreground
  const healthWidth = HEALTH_BAR_WIDTH * (Math.max(0, player1.health) / 100);
  ctx.fillStyle = HEALTH_FILL_COLOR;
  ctx.fillRect(HEALTH_BAR_X_P1, HEALTH_BAR_Y, healthWidth, HEALTH_BAR_HEIGHT);
  
  const healthWidthP2 = HEALTH_BAR_WIDTH * (Math.max(0, player2.health) / 100);
  ctx.fillStyle = HEALTH_FILL_COLOR;
  ctx.fillRect(HEALTH_BAR_X_P2, HEALTH_BAR_Y, healthWidthP2, HEALTH_BAR_HEIGHT);

  // Draw Health Labels
  ctx.fillStyle = HEALTH_TEXT_COLOR;
  ctx.font = HEALTH_FONT;
  ctx.fillText('P1', HEALTH_BAR_X_P1 + 10, HEALTH_BAR_Y - 5);
  ctx.fillText('P2', HEALTH_BAR_X_P2 + 10, HEALTH_BAR_Y - 5);

  // ... existing rendering logic ...

  requestAnimationFrame(gameLoop);
}