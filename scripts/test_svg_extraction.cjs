const fs = require('fs');

const svg = fs.readFileSync('public/Logo Official.svg', 'utf8');

// Extract all paths
const pathMatches = [...svg.matchAll(/<path\s+fill="([^"]+)"\s+d="([^"]+)"\/>/g)];

console.log('Found path matches:', pathMatches.length);

const brandPaths = [];
const shootsPaths = [];
const otherPaths = [];

pathMatches.forEach((m, idx) => {
  const fill = m[1];
  const d = m[2];
  if (fill === '#018CFB') {
    brandPaths.push(d);
  } else if (idx <= 10) {
    shootsPaths.push(d);
  } else {
    otherPaths.push(d);
  }
});

console.log('BRAND paths count:', brandPaths.length);
console.log('SHOOTS paths count:', shootsPaths.length);
console.log('Tagline paths count:', otherPaths.length);
