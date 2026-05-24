class Fighter {
  constructor(side) {
    this.side = side;
    this.health = 100;
    this.attackBox = null;
    this.hitStun = false;
  }

  update() {
    // Existing physics engine and dual input logic
    
    // Attack state activation
    if (this.side === 'P1' && key.Space.pressed || this.side === 'P2' && key.Enter.pressed) {
      this.attackBox = {
        x: this.x + (this.side === 'P1' ? this.width : -this.width) * 0.5,
        y: this.y + this.height * 0.5,
        width: this.width * 0.5,
        height: this.height * 0.5,
        color: 'red'
      };
    }

    // Collision detection
    if (this.attackBox && this.opponent) {
      const collided = this.checkAABB(this.attackBox, this.opponent);
      if (collided) {
        this.health -= 10;
        this.hitStun = true;
        // Render debug boxes
        this.renderDebugBoxes();
      }
    }
  }

  checkAABB(box1, box2) {
    return !(box1.x + box1.width < box2.x ||
             box1.x > box2.x + box2.width ||
             box1.y + box1.height < box2.y ||
             box1.y > box2.y + box2.height);
  }

  renderDebugBoxes() {
    // Draw semi-transparent attack boxes
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.fillRect(this.attackBox.x, this.attackBox.y, this.attackBox.width, this.attackBox.height);
  }
}

// Existing game logic...