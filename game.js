class Fighter {
  constructor() {
    this.state = 'idle';
    this.attackBox = {
      position: { x: 0, y: 0 },
      size: { width: 100, height: 50 },
      direction: 'right'
    };
  }

  attack() {
    if (this.state === 'idle') {
      this.state = 'attacking';
      this.attackBox.position.x = this.position.x;
      this.attackBox.position.y = this.position.y;
      this.attackBox.direction = this.direction;
    }
  }

  update() {
    if (this.state === 'attacking') {
      this.drawAttackBox(); // Draw attack box for debugging
      // Check collision with opponent's hurt box
      if (checkAABB(this.attackBox, opponent.hurtBox)) {
        opponent.health -= 10;
        opponent.hitStun = true;
      }
      // Reset attack state after animation
      if (this.attackTimer > 0) {
        this.attackTimer--;
        if (this.attackTimer === 0) {
          this.state = 'idle';
        }
      }
    }
  }

  drawAttackBox() {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.fillRect(
      this.attackBox.position.x,
      this.attackBox.position.y,
      this.attackBox.size.width,
      this.attackBox.size.height
    );
  }
}

// AABB collision detection function
function checkAABB(attacker, defender) {
  return (
    attacker.position.x < defender.position.x + defender.size.width &&
    attacker.position.x + attacker.size.width > defender.position.x &&
    attacker.position.y < defender.position.y + defender.size.height &&
    attacker.position.y + attacker.size.height > defender.position.y
  );
}

// Hit stun visual effect
function drawHitStun(opponent) {
  if (opponent.hitStun) {
    ctx.fillStyle = 'red';
    ctx.fillRect(
      opponent.position.x,
      opponent.position.y,
      opponent.size.width,
      opponent.size.height
    );
    opponent.hitStun = false;
  }
}