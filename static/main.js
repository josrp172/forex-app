import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

// --- Scene Setup ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

// Camera Setup
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 11); // Eye level

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true; // Enable shadows for depth
renderer.shadowMap.type = THREE.SoftShadowMap;
container.appendChild(renderer.domElement);

// --- Lighting (Japan Sakura Vibe = Pink, Soft, Dreamy) ---
const ambientLight = new THREE.AmbientLight(0xffe6eb, 0.7); // Soft Pink tint
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
sunLight.position.set(5, 8, 5);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 1024;
sunLight.shadow.mapSize.height = 1024;
scene.add(sunLight);

// Fill light (Sakura Glow)
const fillLight = new THREE.DirectionalLight(0xffaec9, 0.5); // Pink fill
fillLight.position.set(-5, 2, -5);
scene.add(fillLight);

// --- Materials (Toon / Cel Shaded) ---
const format = (renderer.capabilities.isWebGL2) ? THREE.RedFormat : THREE.LuminanceFormat;
// A sharper 3-tone gradient for that anime look
const gradientColors = new Uint8Array([240, 240, 255]);
// Actually for smooth toon, we use a gradient texture that steps sharply
// Creating a small texture for the `gradientMap`
const colors = new Uint8Array([100, 180, 255, 255]);
const gradientMap = new THREE.DataTexture(colors, 4, 1, format);
gradientMap.minFilter = THREE.NearestFilter;
gradientMap.magFilter = THREE.NearestFilter;
gradientMap.needsUpdate = true;

const matParams = { gradientMap: gradientMap, shadowSide: THREE.DoubleSide };

// Palette (Pastry Theme)
const skinColor = 0xffe0bd;
const hairColor = 0x3e2723; // Dark Chocolate
const apronColor = 0xffab91; // Soft Salmon/Apricot
const shirtColor = 0xffffff;
const hatColor = 0xffffff;
const pantsColor = 0x5d4037; // Coffee

const skinMat = new THREE.MeshToonMaterial({ color: skinColor, ...matParams });
const hairMat = new THREE.MeshToonMaterial({ color: hairColor, ...matParams });
const apronMat = new THREE.MeshToonMaterial({ color: apronColor, ...matParams });
const shirtMat = new THREE.MeshToonMaterial({ color: shirtColor, ...matParams });
const hatMat = new THREE.MeshToonMaterial({ color: hatColor, ...matParams });
const pantsMat = new THREE.MeshToonMaterial({ color: pantsColor, ...matParams });
const blushMat = new THREE.MeshBasicMaterial({ color: 0xff8a80, transparent: true, opacity: 0.4 });
const breadMat = new THREE.MeshToonMaterial({ color: 0xf4a460, ...matParams }); // Sandy Brown
const darkBreadMat = new THREE.MeshToonMaterial({ color: 0x8d6e63, ...matParams });
const icingMat = new THREE.MeshToonMaterial({ color: 0xffcdd2, ...matParams }); // Pink Icing

// --- Character Build: "The Pastry Chef" ---
const charGroup = new THREE.Group();
scene.add(charGroup);

// 1. Head
const headGroup = new THREE.Group();
headGroup.position.set(0, 2.6, 0);
charGroup.add(headGroup);

// Face
const faceGeo = new THREE.SphereGeometry(0.75, 32, 32);
const face = new THREE.Mesh(faceGeo, skinMat);
headGroup.add(face);

// Hair (Ghibli Bob)
const hairGeo = new THREE.SphereGeometry(0.82, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6);
const hair = new THREE.Mesh(hairGeo, hairMat);
hair.rotation.x = -Math.PI / 2;
hair.position.y = 0.05;
hair.castShadow = true;
headGroup.add(hair);

// Bangs (Side sweeps)
const bangGeo = new THREE.CapsuleGeometry(0.2, 0.6, 4, 8);
const bangL = new THREE.Mesh(bangGeo, hairMat);
bangL.position.set(-0.5, 0.4, 0.55);
bangL.rotation.set(0, 0, 0.5);
headGroup.add(bangL);

const bangR = new THREE.Mesh(bangGeo, hairMat);
bangR.position.set(0.5, 0.4, 0.55);
bangR.rotation.set(0, 0, -0.5);
headGroup.add(bangR);

// Chef Hat (Poofy)
const hatBrimGeo = new THREE.CylinderGeometry(0.6, 0.58, 0.2, 32);
const hatBrim = new THREE.Mesh(hatBrimGeo, hatMat);
hatBrim.position.set(0, 0.8, 0);
hatBrim.rotation.x = -0.1; // Tilted slightly back
headGroup.add(hatBrim);

const hatTopGeo = new THREE.SphereGeometry(0.7, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.6);
const hatTop = new THREE.Mesh(hatTopGeo, hatMat);
hatTop.scale.set(1, 0.7, 1);
hatTop.position.set(0, 0.9, -0.1);
hatTop.rotation.x = 0.2;
headGroup.add(hatTop);

// Eyes (Simple black dots/ovals)
const eyeGeo = new THREE.CapsuleGeometry(0.06, 0.12, 4, 8);
const eyeMat = new THREE.MeshBasicMaterial({ color: 0x333333 });

const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
eyeL.position.set(-0.22, 0.05, 0.68);
eyeL.rotation.z = Math.PI / 2; // horizontalish
headGroup.add(eyeL);

const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
eyeR.position.set(0.22, 0.05, 0.68);
eyeR.rotation.z = Math.PI / 2;
headGroup.add(eyeR);

// Blush
const blushGeo = new THREE.CircleGeometry(0.12, 16);
const blushL = new THREE.Mesh(blushGeo, blushMat);
blushL.position.set(-0.4, -0.08, 0.6);
blushL.rotation.y = -0.6;
headGroup.add(blushL);

const blushR = new THREE.Mesh(blushGeo, blushMat);
blushR.position.set(0.4, -0.08, 0.6);
blushR.rotation.y = 0.6;
headGroup.add(blushR);

// 2. Body
const bodyGroup = new THREE.Group();
bodyGroup.position.set(0, 1.3, 0);
charGroup.add(bodyGroup);

// Torso (Shirt)
const torsoGeo = new THREE.CylinderGeometry(0.5, 0.6, 1.4, 16);
const torso = new THREE.Mesh(torsoGeo, shirtMat);
torso.castShadow = true;
bodyGroup.add(torso);

// Apron (Front panel)
const apronGeo = new THREE.BoxGeometry(0.8, 1.0, 0.05);
const apron = new THREE.Mesh(apronGeo, apronMat);
apron.position.set(0, -0.1, 0.55); // Front of torso
apron.rotation.x = -0.05; // Follow body curve
apron.castShadow = true;
bodyGroup.add(apron);

// Apron Straps (Simple lines or thin boxes)
const strapGeo = new THREE.BoxGeometry(0.1, 0.8, 0.02);
const strapL = new THREE.Mesh(strapGeo, apronMat);
strapL.position.set(-0.35, 0.6, 0.45);
strapL.rotation.x = -0.3;
bodyGroup.add(strapL);

const strapR = new THREE.Mesh(strapGeo, apronMat);
strapR.position.set(0.35, 0.6, 0.45);
strapR.rotation.x = -0.3;
bodyGroup.add(strapR);

// Skirt/Pants (Uniform)
const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.15, 1.2, 16), pantsMat);
legL.position.set(-0.25, -1.2, 0);
bodyGroup.add(legL);

const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.15, 1.2, 16), pantsMat);
legR.position.set(0.25, -1.2, 0);
bodyGroup.add(legR);

// Arms
const armGeo = new THREE.CapsuleGeometry(0.14, 0.8, 4, 8);
const armL = new THREE.Mesh(armGeo, shirtMat);
armL.position.set(-0.7, 0.4, 0);
armL.rotation.z = Math.PI / 8;
bodyGroup.add(armL);

const armRGroup = new THREE.Group(); // Pivot for right arm (holding tray maybe?)
armRGroup.position.set(0.7, 0.5, 0);
bodyGroup.add(armRGroup);

const armR = new THREE.Mesh(armGeo, shirtMat);
armR.position.set(0, -0.3, 0);
armRGroup.add(armR);

// Hands
const handGeo = new THREE.SphereGeometry(0.15, 16, 16);
const handL = new THREE.Mesh(handGeo, skinMat);
handL.position.set(0, -0.5, 0);
armL.add(handL);

const handR = new THREE.Mesh(handGeo, skinMat);
handR.position.set(0, -0.5, 0);
armR.add(handR);


// --- 3D Pastry & Atmos Props ---

// Croissant Function
function createCroissant() {
    const group = new THREE.Group();
    const geo = new THREE.TorusGeometry(0.3, 0.12, 16, 32, Math.PI * 1.5);
    const mat = breadMat;
    const mesh = new THREE.Mesh(geo, mat);
    mesh.scale.set(1, 0.6, 0.6);
    group.add(mesh);
    return group;
}

// Donut Function
function createDonut(color) {
    const group = new THREE.Group();
    const geo = new THREE.TorusGeometry(0.3, 0.12, 16, 32);
    const mat = new THREE.MeshToonMaterial({ color: 0xc19a6b, ...matParams });
    const mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);

    const icingGeo = new THREE.TorusGeometry(0.3, 0.13, 16, 32, Math.PI * 2);
    const icing = new THREE.Mesh(icingGeo, new THREE.MeshToonMaterial({ color: color, ...matParams }));
    icing.position.y = 0.02;
    icing.scale.set(1, 1, 1);
    group.add(icing);

    return group;
}

// Gold Coin Function (Forex Element)
function createCoin() {
    const group = new THREE.Group();
    const geo = new THREE.CylinderGeometry(0.25, 0.25, 0.05, 32);
    const mat = new THREE.MeshToonMaterial({ color: 0xffd700, ...matParams }); // Gold
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = Math.PI / 2; // Face forward

    // Shine detail
    const inner = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.06, 32), new THREE.MeshToonMaterial({ color: 0xffecb3, ...matParams }));
    inner.rotation.x = Math.PI / 2;
    group.add(mesh);
    group.add(inner);
    return group;
}

// Floating Objects (Pastries + Coins)
const floatingObjects = [];
const propTypes = [
    () => createCroissant(),
    () => createDonut(0xffcdd2),
    () => createDonut(0xbbdefb),
    () => createCoin(),
    () => createCoin(),
];

// Increase count to fill canvas better
for (let i = 0; i < 20; i++) {
    const typeFn = propTypes[Math.floor(Math.random() * propTypes.length)];
    const obj = typeFn();

    // Spread wider
    const x = (Math.random() - 0.5) * 25;
    const y = (Math.random() - 0.5) * 15;
    const z = (Math.random() * -8) - 2;

    obj.position.set(x, y, z);
    obj.userData = {
        speedRot: (Math.random() - 0.5) * 0.03,
        initialY: y
    };

    scene.add(obj);
    floatingObjects.push(obj);
}

// --- Sakura Particle System ---
const petalCount = 100; // Falling confetti/petals
const petals = [];
const petalGeo = new THREE.PlaneGeometry(0.15, 0.15); // Slightly larger
const petalMat = new THREE.MeshBasicMaterial({
    color: 0xffb7c5,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8
});

for (let i = 0; i < petalCount; i++) {
    const petal = new THREE.Mesh(petalGeo, petalMat);
    // Spread across entire screen width
    petal.position.set(
        (Math.random() - 0.5) * 30,
        Math.random() * 20 - 5,
        (Math.random() - 0.5) * 10 - 2
    );
    petal.userData = {
        speedY: Math.random() * 0.03 + 0.01,
        speedX: (Math.random() - 0.5) * 0.02,
        speedRot: (Math.random() - 0.5) * 0.05
    };
    scene.add(petal);
    petals.push(petal);
}


// --- Animation & Position Logic ---
charGroup.position.set(2, -1.5, 0);
charGroup.rotation.y = -0.3;

// Mouse tracking
let targetLookX = 0;
let targetLookY = 0;
const clock = new THREE.Clock();
const bubble = document.getElementById('speech-bubble');
let activeTargetEl = null;

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // Character Breathing/Floating
    // Use the current set position as base? No, we need a base Y reference.
    // Let's assume updateLayout sets the correct Y, and we just add the offset.
    // But updateLayout is outside loop.
    // Let's store base Y in userData.
    const baseY = charGroup.userData.baseY !== undefined ? charGroup.userData.baseY : -1.5;
    charGroup.position.y = baseY + Math.sin(time * 1.5) * 0.05;

    // Head Tracking
    headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, targetLookX * 0.5, 0.1);
    headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, targetLookY * 0.3, 0.1);

    // Arm Animation (Subtle wave of spatula/hand)
    armRGroup.rotation.z = Math.PI / 1.3 + Math.sin(time * 3) * 0.1; // Waving hand

    // Floating Objects (Pastries/Coins)
    floatingObjects.forEach((p, idx) => {
        p.rotation.x += p.userData.speedRot;
        p.rotation.y += p.userData.speedRot;
        p.position.y = p.userData.initialY + Math.sin(time + idx) * 0.5;
    });

    // Sakura Petals Falling
    petals.forEach(p => {
        p.position.y -= p.userData.speedY; // Fall down
        p.position.x += Math.sin(time + p.position.y) * 0.005; // Gentle sway
        p.rotation.x += p.userData.speedRot;
        p.rotation.z += p.userData.speedRot;

        // Reset if falls below screen
        if (p.position.y < -8) {
            p.position.y = 8;
            p.position.x = (Math.random() - 0.5) * 30;
        }
    });

    // Speech Bubble Tracking
    // Use Character World Position + Offset to be stable (ignore head tilt)
    const headPos = charGroup.position.clone();

    // Adjust height based on scale?
    // charGroup is scaled. But .position is world coord.
    // We need to add height * scale.
    // Base Height of head is roughly 2.6 (headGroup y) + rad 0.8 => 3.4
    // Let's approximate.
    const currentScale = charGroup.scale.x;
    headPos.y += 3.2 * currentScale;

    // Project to 2D
    headPos.project(camera);

    // Check visibility and map to screen
    if (headPos.z < 1) { // in front of camera
        const x = (headPos.x * .5 + .5) * window.innerWidth;
        const y = (-(headPos.y * .5) + .5) * window.innerHeight;

        if (bubble) {
            bubble.style.transform = `translate(-50%, -100%)`; // Center bottom anchor
            bubble.style.left = `${x}px`;
            bubble.style.top = `${y}px`;

            if (time > 0.5) bubble.classList.add('visible');
        }
    }

    renderer.render(scene, camera);
}

// Responsive Logic
function updateLayout() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);

    // Calculate visible width at z=0 (approx character depth)
    // vFOV is 45 degrees
    const vFOV = THREE.MathUtils.degToRad(camera.fov);
    const visibleHeight = 2 * Math.tan(vFOV / 2) * camera.position.z;
    const visibleWidth = visibleHeight * camera.aspect;

    // Default Desktop
    let scale = 1;
    let posX = 2.5;
    let posY = -1.5;

    if (width <= 1280) { // Increased breakpoint for iPad Pro / Landscapes
        // Tablet
        scale = 1.0; // Keep scale large

        // Position: Right side with Padding
        const rightEdge = visibleWidth / 2;
        // User said "still too far right", so we need MORE padding (move left).
        posX = rightEdge - 4.5;

        posY = -1.3;
    }

    // Mobile Phone (Portrait/Small)
    if (width < 600) {
        scale = 0.75;
        posX = 0; // Center is best for phones
        posY = -0.8;
    }

    charGroup.scale.set(scale, scale, scale);

    // Smooth transition if resized, but direct set is fine
    charGroup.userData.baseY = posY;
    charGroup.position.set(posX, posY, 0);
}

window.addEventListener('resize', updateLayout);
updateLayout(); // Initial call

// scale/pos in animate loop might drift if we set it here? 
// The animate loop had `charGroup.position.y = -1.5 + sine...`.
// We need to update animate loop to use `baseY` + sine wave.


// Mouse Listeners
document.addEventListener('mousemove', (e) => {
    targetLookX = (e.clientX / window.innerWidth) * 2 - 1;
    targetLookY = (e.clientY / window.innerHeight) * 2 - 1; // Corrected Y Check ? No, usually inverted for pitch
    // Actually typically mouse Y down is +1, screen Y up is +1 in 3D. 
    targetLookY = -((e.clientY / window.innerHeight) * 2 - 1);
});

animate();

// --- Text Animation (Staggered Character Fade) ---
function fadeText(element, newText) {
    if (!element) return; // Null check for element
    element.style.transition = 'opacity 0.5s, transform 0.5s';
    element.style.opacity = '0';
    element.style.transform = 'translateY(-5px)';

    setTimeout(() => {
        element.innerHTML = '';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        element.style.transition = 'none';

        const chars = [...newText];
        chars.forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.opacity = '0';
            span.style.display = 'inline-block';
            span.style.minWidth = (char === ' ') ? '0.3em' : '0';
            span.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            span.style.transform = 'translateY(5px)';
            element.appendChild(span);

            setTimeout(() => {
                span.style.opacity = '1';
                span.style.transform = 'translateY(0)';
            }, 50 * i);
        });
    }, 500);
}

window.addEventListener('DOMContentLoaded', () => {
    const title = document.getElementById('header-title');
    const desc = document.getElementById('header-desc');
    const startBtn = document.getElementById('start-btn');
    const backBtn = document.getElementById('back-home-btn');
    const introCard = document.querySelector('.intro-card');
    const curriculumLayer = document.getElementById('curriculum-layer');

    // 1. Start Pure Japanese (Japan Vibe)
    fadeText(title, "「リリ、ようこそ！」");
    fadeText(desc, "二人のための場所を作ったよ。");

    // 2. Switch to English after 4.5 seconds (Retaining Original Message)
    setTimeout(() => {
        fadeText(title, "Hey, Riri! Welcome!");
        fadeText(desc, "I made this little space just for us to explore.");
    }, 4500);

    // --- Interaction Hooks (Check existence first) ---
    if (startBtn && introCard && curriculumLayer) {
        startBtn.addEventListener('click', () => {
            introCard.style.opacity = '0';
            introCard.style.pointerEvents = 'none';
            curriculumLayer.classList.remove('hidden');
        });
    }

    if (backBtn && curriculumLayer && introCard) {
        backBtn.addEventListener('click', () => {
            curriculumLayer.classList.add('hidden');
            introCard.style.opacity = '1';
            introCard.style.pointerEvents = 'auto';
        });
    }

    // Hover Listeners for Line Animation (Only if on Map page)
    const cards = document.querySelectorAll('.level-card');
    if (cards.length > 0) {
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                activeTargetEl = card;
            });
            card.addEventListener('mouseleave', () => {
                activeTargetEl = null;
            });
        });
    }
});
