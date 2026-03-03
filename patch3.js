const fs = require('fs');

try {
  let fileData = fs.readFileSync('/Users/parth/parth-s-future-forge/src/components/HeroSection.tsx', 'utf8');

  // Replace standard GSAP scrub timing
  fileData = fileData.replace(/end: "bottom top"/g, 'end: "bottom -150%"');

  fs.writeFileSync('/Users/parth/parth-s-future-forge/src/components/HeroSection.tsx', fileData, 'utf8');
  console.log("Successfully increased scrolling timing by 150%");
} catch (error) {
  console.error("An error occurred during replacement:", error);
}
