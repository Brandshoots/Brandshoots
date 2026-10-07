const fs = require('fs');
const svg = fs.readFileSync('public/Logo Official.svg', 'utf8');

// Match all path d attributes and calculate approximate bounding box
const paths = [...svg.matchAll(/<path\s+fill="([^"]+)"\s+d="([^"]+)"/g)];

paths.forEach((p, i) => {
  const fill = p[1];
  const d = p[2];
  // extract numbers
  const nums = d.match(/[-+]?\d*\.?\d+/g)?.map(Number) || [];
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (let j = 0; j < nums.length; j += 2) {
    const x = nums[j];
    const y = nums[j+1];
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  console.log(`Path ${i}: fill=${fill}, X: [${minX.toFixed(1)}, ${maxX.toFixed(1)}], Y: [${minY.toFixed(1)}, ${maxY.toFixed(1)}]`);
});
