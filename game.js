const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

class Fighter {
  constructor(x, y, color) {
    this.position = { x, y };
    this.velocity = { x: 0, y: 0 };
    this.height = 60;
    this.width = 40;
    this.health = 100;
    this.isAttacking = false;
    this.facingDirection = 'right';
    this.color = color;
  }

  update() {
    // Gravity
    this.velocity.y += 0.6;
    // Floor collision
    if (this.position.y + this.height > 330) {
      this.position.y = 330 - this.height;
      this.velocity.y = 0;
    }
    // Horizontal movement
    if (this.velocity.x > 0) {
      this.facingDirection = 'right';
    } else if (this.velocity.x < 0) {
      this.facingDirection = 'left';
    }
    // Update position
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

// Initialize game
const player1 = new Fighter(100, 330, 'blue');
const player2 = new Fighter(600, 330, 'red');

function gameLoop() {
  ctx.clearRect(0, 0, 800, 450);
  player1.update();
  player2.update();
  player1.draw();
  player2.draw();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);