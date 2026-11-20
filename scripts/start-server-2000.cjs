const { spawn } = require('child_process');
const path = require('path');

const rootDir = 'C:\\Users\\SURYARAJA\\Desktop\\Web & App\\BrandShoots';
const viteBin = path.join(rootDir, 'node_modules', 'vite', 'bin', 'vite.js');

console.log('Launching Vite server on port 2000 from:', rootDir);

const child = spawn('node', [viteBin, '--port', '2000', '--strictPort', '--host'], {
  cwd: rootDir,
  stdio: 'inherit'
});

child.on('error', (err) => {
  console.error('Child process error:', err);
});

child.on('exit', (code) => {
  console.log('Vite server exited with code:', code);
  process.exit(code || 0);
});
