// scripts/dev.js
const { exec } = require('child_process');

// Start dev process
const devProcess = exec('npm run services:up && npm run services:wait:database && npm run migrations:up && next dev');

// Listen for Ctrl+C or termination
process.on('SIGINT', () => {
  console.log('Detected Ctrl+C, cleaning up...');
  exec('npm run services:down', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error during cleanup: ${error}`);
      process.exit(1);
    }
    console.log('Cleanup complete.');
    process.exit(0);
  });
});
