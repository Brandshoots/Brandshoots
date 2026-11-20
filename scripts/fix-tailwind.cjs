const fs = require('fs');
const filePath = 'C:/Users/SURYARAJA/Desktop/Web & App/BrandShoots/tailwind.config.js';
let content = fs.readFileSync(filePath, 'utf8');

const oldContentBlock = `content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],`;

const newContentBlock = `content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "C:/Users/SURYARAJA/Desktop/Web & App/BrandShoots/index.html",
    "C:/Users/SURYARAJA/Desktop/Web & App/BrandShoots/src/**/*.{js,ts,jsx,tsx}",
  ],`;

content = content.replace(/content:\s*\[[\s\S]*?\],/, newContentBlock);
fs.writeFileSync(filePath, content);
console.log("Updated tailwind.config.js successfully!");
