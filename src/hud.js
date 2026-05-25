const HEALTH_BAR_WIDTH = 300;
const HEALTH_BAR_HEIGHT = 30;
const HEALTH_BAR_X_P1 = 50;
const HEALTH_BAR_X_P2 = 450;
const HEALTH_BAR_Y = 30;

export function drawHUD(ctx, player1, player2) {
  // Health Wrappers
  ctx.fillStyle = '#7f1d1d';
  ctx.fillRect(HEALTH_BAR_X_P1, HEALTH_BAR_Y, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT);
  ctx.fillRect(HEALTH_BAR_X_P2, HEALTH_BAR_Y, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT);

  // Health Fills
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(HEALTH_BAR_X_P1, HEALTH_BAR_Y, HEALTH_BAR_WIDTH * (Math.max(0, player1.health) / 100), HEALTH_BAR_HEIGHT);
  ctx.fillRect(HEALTH_BAR_X_P2, HEALTH_BAR_Y, HEALTH_BAR_WIDTH * (Math.max(0, player2.health) / 100), HEALTH_BAR_HEIGHT);

  // EX Bars
  ctx.fillStyle = '#0c4a6e';
  ctx.fillRect(HEALTH_BAR_X_P1, 65, HEALTH_BAR_WIDTH, 12);
  ctx.fillRect(HEALTH_BAR_X_P2, 65, HEALTH_BAR_WIDTH, 12);

  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(HEALTH_BAR_X_P1, 65, HEALTH_BAR_WIDTH * (player1.specialGauge / 100), 12);
  const p2MeterFill = HEALTH_BAR_WIDTH * (player2.specialGauge / 100);
  ctx.fillRect(HEALTH_BAR_X_P2 + HEALTH_BAR_WIDTH - p2MeterFill, 65, p2MeterFill, 12);

  // Labels
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('P1', HEALTH_BAR_X_P1, HEALTH_BAR_Y - 8);
  ctx.fillText('P2', HEALTH_BAR_X_P2 + HEALTH_BAR_WIDTH - 22, HEALTH_BAR_Y - 8);

  // Neon Floor
  ctx.strokeStyle = '#06b6d4'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(0, 430); ctx.lineTo(800, 430); ctx.stroke();
}
