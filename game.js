// Corrected version with proper Node.js syntax
// ...

// Replace invalid shell commands with child_process
const { execSync } = require('child_process');

try {
  // Check for comment marker
  execSync('grep -q "// ..." game.js');
  
  // Lint and commit changes
  execSync('node -c game.js');
  execSync('git add .');
  execSync('git commit -m "feat: implement tier 7 fighter mechanics"');
  console.log('Game updated successfully');
} catch (error) {
  console.error('Validation failed:', error.message);
  process.exit(1);
}