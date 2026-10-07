const fs = require('fs');
const svg = fs.readFileSync('public/Logo Official.svg', 'utf8');

// Strip metadata to clean up SVG
const cleanSvg = svg.replace(/<metadata>[\s\S]*?<\/metadata>/, '');
console.log('Clean SVG length:', cleanSvg.length);

const paths = [...cleanSvg.matchAll(/<path([^>]+)\/?>/g)];
console.log('Total paths:', paths.length);
paths.forEach((p, i) => {
  const fill = p[1].match(/fill="([^"]+)"/)?.[1];
  const d = p[1].match(/d="([^"]+)"/)?.[1];
  console.log(`Path ${i}: fill=${fill}, d start=${d?.substring(0, 30)}, d length=${d?.length}`);
});

