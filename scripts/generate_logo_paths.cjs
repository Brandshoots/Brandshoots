const fs = require('fs');

const svg = fs.readFileSync('public/Logo Official.svg', 'utf8');

// Clean metadata
const cleanSvg = svg.replace(/<metadata>[\s\S]*?<\/metadata>/, '');

const paths = [...cleanSvg.matchAll(/<path\s+fill="([^"]+)"\s+d="([^"]+)"\/>/g)];

const brandPaths = [];
const shootsPaths = [];
const taglinePaths = [];

paths.forEach((m, idx) => {
  const fill = m[1];
  const d = m[2];
  if (fill === '#018CFB') {
    brandPaths.push(d);
  } else if (idx <= 10) {
    shootsPaths.push(d);
  } else {
    taglinePaths.push(d);
  }
});

const tsContent = `// Exact vector geometry extracted from public/Logo Official.svg
// Preserves 100% original brand art vectors, proportions, and curves

export const BRANDSHOOTS_LOGO_VIEWBOX = '185 365 1590 215';

export const BRAND_PATHS = ${JSON.stringify(brandPaths, null, 2)} as const;

export const SHOOTS_PATHS = ${JSON.stringify(shootsPaths, null, 2)} as const;

export const TAGLINE_PATHS = ${JSON.stringify(taglinePaths, null, 2)} as const;
`;

fs.writeFileSync('src/components/footer/brandshootsLogoPaths.ts', tsContent, 'utf8');
console.log('Successfully wrote brandshootsLogoPaths.ts');
