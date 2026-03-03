const fs = require('fs');

const path = 'src/components/HeroSection.tsx';
let data = fs.readFileSync(path, 'utf8');

const anchor1Target = "    // Strict Scroll Scrubbing";
const anchor2Target = "  }, { scope: sectionRef });";

const p1 = data.indexOf(anchor1Target);
const p2 = data.indexOf(anchor2Target);

if(p1 > -1 && p2 > -1) {
    const chunk1 = data.substring(0, p1);
    const chunk2 = data.substring(p2, data.length);
    
    const replacement1 = `    // Split text animations dynamically over content behind it
    if (textRef.current) {
        gsap.to(".hero-title-upper", {
        y: "-150%",
        opacity: 0,
        ease: "none",
        scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
        }
        });

        // The bottom text goes DOWN
        gsap.to(".hero-title-lower", {
        y: "150%",
        opacity: 0,
        ease: "none",
        scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
        }
        });
        
        // Scale and show middle layer
        gsap.fromTo(".middle-3d-model", {
        scale: 0.1,
        y: "20vh",
        opacity: 0,
        }, {
        scale: 1,
        y: "-5vh",
        opacity: 1,
        ease: "none",
        scrollTrigger: {
            trigger: sectionRef.current, 
            start: "top top",
            end: "bottom top", 
            scrub: true,
        }
        });
    }

`;
    data = chunk1 + replacement1 + chunk2;
} else { console.log('first anchor fail'); }

const anchor3Target = "        {/* Massive Central Typography */}";
const anchor4Target = '          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-t border-border pt-8">';

const p3 = data.indexOf(anchor3Target);
const p4 = data.indexOf(anchor4Target);

if(p3 > -1 && p4 > -1) {
    const chunk3 = data.substring(0, p3);
    const chunk4 = data.substring(p4, data.length);
    
    const replacement2 = `        {/* Massive Typography & 3D Split */}
        <div className="md:col-span-9 relative border-border" style={{ minHeight: "400px" }}>
          
          {/* Middle 3D Model Layer */}
          <div className="middle-3d-model absolute top-[10%] left-1/2 -translate-x-1/2 w-[120%] h-[120%] max-w-[800px] aspect-video z-0 pointer-events-auto">
            <div className="sketchfab-embed-wrapper w-full h-full rounded-2xl overflow-hidden mix-blend-screen bg-black/50">
              <iframe 
                title="Star Wars - Delta 7 Jedi Starfighter" 
                frameBorder="0" 
                allowFullScreen={true}
                allow="autoplay; fullscreen; xr-spatial-tracking" 
                src="https://sketchfab.com/models/053a14f9353a4f4aa6300fa0a398ffab/embed?autostart=1&transparent=1&ui_theme=dark" 
                className="w-full h-full"
              ></iframe>
            </div>
          </div>

          <h1 className="font-display text-5xl sm:text-7xl md:text-[7rem] lg:text-[8rem] font-bold leading-[0.9] tracking-tighter mb-8 text-foreground uppercase relative z-10 pointer-events-none">
            <div className="hero-title-upper relative">
              <div className="overflow-hidden pb-2"><div className="hero-title-line drop-shadow-md pb-4 pt-1">Designing</div></div>
            </div>
            
            <div className="hero-title-lower relative mt-2 md:mt-4">
              <div className="overflow-hidden pb-2"><div className="hero-title-line drop-shadow-md pb-4">The Future</div></div>
              <div className="overflow-hidden"><div className="hero-title-line text-primary drop-shadow-md">With AI</div></div>
            </div>
          </h1>

`;
    data = chunk3 + replacement2 + chunk4;
} else { console.log('second anchor fail'); }

fs.writeFileSync(path, data, 'utf8');
