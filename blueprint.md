# Project Blueprint: Local 2D Fighting Game (Street Fighter Style)

## Technical Stack
- Frontend: HTML5 Canvas (800x450 resolution, pixel art scaling, 60FPS lock)
- Language: Pure, clean vanilla JavaScript (No external framework dependencies)
- State Tracking: Object-Oriented Programming (OOP) with clean class modules

## Core Mechanics & Architecture

### 1. Canvas & Engine Lifecycle (`game.js`)
- Must maintain an explicit, un-blocked `requestAnimationFrame` loop.
- Every frame must clear the context entirely (`ctx.clearRect(0,0,800,450)`) before calculating updates or drawing objects to prevent sprite bleeding.
- Implement a rigid boundary friction/gravity constant (`gravity = 0.6`).

### 2. Player Entity Class (`Fighter`)
- Track detailed state properties: `position {x, y}`, `velocity {x, y}`, `height`, `width`, `health (100)`, `isAttacking`, `facingDirection`.
- Mechanics: Horizontal velocity damping (friction), jumping vertical arcs, platform floor clamping (`y = 330` for ground level).
- Box-Model Hitboxes: Separate `hurtbox` (for taking damage) and a dynamic, short-lived `attackbox` (generated only during an active attack frame).

### 3. Controls & Dual-Player Setup
- Player 1 (Left Side): `A` (Left), `D` (Right), `W` (Jump), `Space` (Light Attack/Punch).
- Player 2 (Right Side): `ArrowLeft` (Left), `ArrowRight` (Right), `ArrowUp` (Jump), `Enter` (Light Attack/Punch).
- All key states must be tracked inside a central binary key-map dictionary to support flawless simultaneous button registration.

## Git Workflow Execution Rule
- After completing any functional module or file modification, automatically stage and commit the progress using: `git add . && git commit -m "feat: [brief description]"`

