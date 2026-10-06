const fs = require('fs');

function inspect(file) {
  console.log('=== ' + file + ' ===');
  const s = fs.readFileSync(file, 'utf8');
  const paths = s.split('<path');
  for (let i = 1; i < paths.length; i++) {
    const chunk = paths[i];
    const fillMatch = chunk.match(/fill="([^"]+)"/);
    const fill = fillMatch ? fillMatch[1] : 'none';
    const dMatch = chunk.match(/d="([^"]+)"/);
    const d = dMatch ? dMatch[1].slice(0, 30) : '';
    console.log(`Path ${i}: fill=${fill} d=${d}`);
  }
}

inspect('Logo Official.svg');
inspect('logo.svg');
