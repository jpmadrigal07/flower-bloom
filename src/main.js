import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createFlower } from './flower.js';
import { createBloomController } from './animation.js';

// ── Scene ──────────────────────────────────────────────
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xc9e4f6);
scene.fog = new THREE.Fog(0xc9e4f6, 12, 28);

// ── Camera ─────────────────────────────────────────────
const camera = new THREE.PerspectiveCamera(
  45, window.innerWidth / window.innerHeight, 0.1, 100
);
camera.position.set(2.5, 2.2, 3.5);

// ── Renderer ───────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
document.body.appendChild(renderer.domElement);

// ── Controls ───────────────────────────────────────────
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1.2, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 1.5;
controls.maxDistance = 10;
controls.maxPolarAngle = Math.PI / 2 + 0.2;
controls.update();

// ── Lighting ───────────────────────────────────────────
scene.add(new THREE.AmbientLight(0xffffff, 0.4));

const sun = new THREE.DirectionalLight(0xffffff, 1.6);
sun.position.set(5, 8, 3);
scene.add(sun);

const fill = new THREE.DirectionalLight(0xfff0dd, 0.3);
fill.position.set(-4, 3, -2);
scene.add(fill);

scene.add(new THREE.HemisphereLight(0x87ceeb, 0x4a7c3f, 0.35));

// ── Ground ─────────────────────────────────────────────
const groundGeo = new THREE.CircleGeometry(8, 32);
groundGeo.rotateX(-Math.PI / 2);
const ground = new THREE.Mesh(
  groundGeo,
  new THREE.MeshStandardMaterial({ color: 0x4a7c3f, roughness: 0.95 })
);
scene.add(ground);

// ── Flower ─────────────────────────────────────────────
const flower = createFlower();
scene.add(flower.group);

const bloom = createBloomController(flower);

// ── Loop ───────────────────────────────────────────────
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  bloom.update(Math.min(clock.getDelta(), 0.05));
  controls.update();
  renderer.render(scene, camera);
}

animate();

// ── Replay ─────────────────────────────────────────────
window.addEventListener('keydown', (e) => {
  if (e.key === 'r' || e.key === 'R') bloom.reset();
});

// ── Resize ─────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
