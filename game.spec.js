const { test, expect } = require('@playwright/test');
const path = require('path');

test('Fighter Game Core Mechanics Validation', async ({ page }) => {
  // Open your local index.html file directly in a headless browser
  const filePath = path.resolve(__dirname, 'index.html');
  await page.goto(`file://${filePath}`);

  // 1. Verify Canvas initialized and engine loaded successfully
  const masterLog = await page.evaluate(() => typeof gameLoop === 'function');
  expect(masterLog).toBe(true);

  // 2. Read starting baseline health pools directly from browser memory
  let p2HealthStart = await page.evaluate(() => player2.health);
  expect(p2HealthStart).toBe(100);

  // 3. Simulate Player 1 walking forward into striking range (Hold 'D' key down)
  await page.keyboard.down('KeyD');
  await page.waitForTimeout(400); // Walk for 400 milliseconds
  await page.keyboard.up('KeyD');

  // 4. Fire off a punch (Tap Spacebar)
  await page.keyboard.press('Space');
  await page.waitForTimeout(200); // Wait for the animation frame collision to resolve

  // 5. Evaluate if damage matrices and state updates successfully connected
  let p2HealthEnd = await page.evaluate(() => player2.health);
  
  // Assert that Player 2's health pool is lower than 100
  expect(p2HealthEnd).toBeLessThan(100);
});
