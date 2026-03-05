import fs from "fs";
import { Mesh, Box3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Blob, FileReader } from "vblob";

// Patch for Three.js to run without DOM context
global.window = global;
global.Blob = Blob;
global.FileReader = FileReader;
global.THREE = require("three");
global.document = {
    createElement: () => {
        return {
            style: {},
            setAttribute: () => { },
            removeAttribute: () => { },
            addEventListener: () => { },
            removeEventListener: () => { }
        };
    },
    createElementNS: () => {
        return {
            style: {},
        };
    }
};

const loader = new GLTFLoader();

fs.readFile("./public/star_wars_ship.glb", (err, data) => {
    if (err) throw err;

    // Convert Node Buffer to ArrayBuffer
    const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);

    loader.parse(arrayBuffer, "", (gltf) => {
        const scene = gltf.scene;
        console.log("Scene loaded");

        scene.updateMatrixWorld(true);

        scene.traverse((child) => {
            if (child.isMesh) {
                const box = new Box3().setFromObject(child);
                const center = box.getCenter(new THREE.Vector3());
                console.log(`Mesh: ${child.name}, Center: [${center.x.toFixed(3)}, ${center.y.toFixed(3)}, ${center.z.toFixed(3)}]`);
            } else if (child.isGroup || child.type === "Object3D") {
                if (child.name) {
                    const box = new Box3().setFromObject(child);
                    if (!box.isEmpty()) {
                        const center = box.getCenter(new THREE.Vector3());
                        console.log(`Group: ${child.name}, Center: [${center.x.toFixed(3)}, ${center.y.toFixed(3)}, ${center.z.toFixed(3)}]`);
                    }
                }
            }
        });
    });
});
