// Global camera shake tracking
export let state = {
  screenShakeTimer: 0,
  particles: []
};

export const canvas = document.getElementById('gameCanvas');
export const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 450;

export const inputMap = {
  KeyA: false, KeyD: false, KeyW: false, KeyQ: false,
  ArrowLeft: false, ArrowRight: false, ArrowUp: false, ShiftRight: false
};

window.addEventListener('keydown', (event) => {
  if (['Space', 'ArrowUp', 'ArrowDown', 'ShiftRight'].includes(event.code)) {
    event.preventDefault(); 
  }
  if (event.code in inputMap) inputMap[event.code] = true;
});

window.addEventListener('keyup', (event) => {
  if (event.code in inputMap) inputMap[event.code] = false;
});
