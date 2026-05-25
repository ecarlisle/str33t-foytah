# 🕹️ Master Game Architecture State (DO NOT ERASE)

## 📌 Current Capabilities Matrix
- **Core Loop:** Running via requestAnimationFrame using standard HTML5 canvas (`gameCanvas`, 800x450).
- **Physics Engine:** True gravitational acceleration (`gravity = 0.6`) with ground clamping at `y = 330`.
- **Input System:** Unified mapping to physical hardware layout scan codes (`inputMap.KeyA`, `inputMap.Space`, etc.) to bypass OS text processing casing issues.
- **Combat Systems:** Spatial facing direction tracking (`right`/`left` relative to opponent), active attack box rendering, hit-stun flashing (`#ffffff`), and dynamic scaling HUD health bars.
- **Tier 8 Upgrades:** Impact velocity knockback and non-destructive camera matrix screen shaking using `ctx.save()` and `ctx.restore()`.

## 🛑 Hard Coding Guardrails
1. **NO PARTIAL REWRITES:** You must output every single line of the codebase from the canvas setup to the gameLoop execution. No shortcuts, no placeholder comments.
2. **INPUT INTEGRITY:** Never change `inputMap` properties back to `key.w` or `event.key`. It must remain mapped to `event.code`.
3. **RENDER INTEGRITY:** Do not delete `ctx.save()` or `ctx.restore()` from the `gameLoop`, or the camera screen shake will break the entire visual grid.
