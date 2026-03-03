const fs = require('fs');
let code = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');
code = code.replace(/end: "bottom top"/g, 'end: "bottom -150%"');
fs.writeFileSync('src/components/HeroSection.tsx', code);
