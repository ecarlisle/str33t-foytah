function gameLoop() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw health bars
  const healthWidth = 300;
  const healthHeight = 30;

  // P1 health bar
  ctx.fillStyle = 'darkred';
  ctx.fillRect(50, 30, healthWidth, healthHeight);
  const p1Health = (this.health / 100) * healthWidth;
  ctx.fillStyle = 'green';
  ctx.fillRect(50, 30, p1Health, healthHeight);
  ctx.fillStyle = 'white';
  ctx.font = '16px Arial';
  ctx.fillText('P1', 40, 25);

  // P2 health bar
  ctx.fillStyle = 'darkred';
  ctx.fillRect(450, 30, healthWidth, healthHeight);
  const p2Health = (this.health / 100) * healthWidth;
  ctx.fillStyle = 'green';
  ctx.fillRect(450, 30, p2Health, healthHeight);
  ctx.fillStyle = 'white';
  ctx.font = '16px Arial';
  ctx.fillText('P2', 440, 25);

  // Other rendering code...
}