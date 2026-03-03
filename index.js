const fs = require('fs');
let code = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');
if(code.indexOf('class Particle') > -1) {
    console.log('Particle background present in main section???');
} else {
    console.log('Clean section structure');
}
