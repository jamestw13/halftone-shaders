import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import halftoneVertexShader from './shaders/halftone/vertex.glsl';
import halftoneFragmentShader from './shaders/halftone/fragment.glsl';

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Loaders
const gltfLoader = new GLTFLoader();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

  // Update Materials
  material.uniforms.uResolution.value.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio);

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(sizes.pixelRatio);
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 7;
camera.position.y = 7;
camera.position.z = 7;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const rendererParameters = {};
rendererParameters.backgroundColor = '#26132f';

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setClearColor(rendererParameters.backgroundColor);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);

gui.addColor(rendererParameters, 'backgroundColor').onChange(() => {
  renderer.setClearColor(rendererParameters.backgroundColor);
});

/**
 * Material
 */
const materialParameters = {
  color: '#ff764d',
  repetition: 100,

  highlightColor: '#E5FFE0',
  highlightLowThreshold: 0.5,
  highlightHighThreshold: 1.5,

  shadowColor: '#8E19B8',
  shadowLowThreshold: -0.8,
  shadowHighThreshold: 1.5,
};

const material = new THREE.ShaderMaterial({
  vertexShader: halftoneVertexShader,
  fragmentShader: halftoneFragmentShader,
  uniforms: {
    uColor: new THREE.Uniform(new THREE.Color(materialParameters.color)),
    uResolution: new THREE.Uniform(new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)),
    uRepetition: new THREE.Uniform(materialParameters.repetition),

    uShadowColor: new THREE.Uniform(new THREE.Color(materialParameters.shadowColor)),
    uShadowLowThreshold: new THREE.Uniform(materialParameters.shadowLowThreshold),
    uShadowHighThreshold: new THREE.Uniform(materialParameters.shadowHighThreshold),

    uHighlightColor: new THREE.Uniform(new THREE.Color(materialParameters.highlightColor)),
    uHighlightLowThreshold: new THREE.Uniform(materialParameters.highlightLowThreshold),
    uHighlightHighThreshold: new THREE.Uniform(materialParameters.highlightHighThreshold),
  },
});

gui.addColor(materialParameters, 'color').onChange(() => {
  material.uniforms.uColor.value.set(materialParameters.color);
});
gui.add(materialParameters, 'repetition', 1, 150, 1).onChange(() => {
  material.uniforms.uRepetition.value = materialParameters.repetition;
});

gui.addColor(materialParameters, 'highlightColor').onChange(() => {
  material.uniforms.uHighlightColor.value.set(materialParameters.highlightColor);
});
gui.add(materialParameters, 'highlightLowThreshold', -5, 5, 0.1).onChange(() => {
  material.uniforms.uHighlightLowThreshold.value = materialParameters.highlightLowThreshold;
});
gui.add(materialParameters, 'highlightHighThreshold', -5, 5, 0.1).onChange(() => {
  material.uniforms.uHighlightHighThreshold.value = materialParameters.highlightHighThreshold;
});

gui.addColor(materialParameters, 'shadowColor').onChange(() => {
  material.uniforms.uShadowColor.value.set(materialParameters.shadowColor);
});
gui.add(materialParameters, 'shadowLowThreshold', -5, 5, 0.1).onChange(() => {
  material.uniforms.uShadowLowThreshold.value = materialParameters.shadowLowThreshold;
});
gui.add(materialParameters, 'shadowHighThreshold', -5, 5, 0.1).onChange(() => {
  material.uniforms.uShadowHighThreshold.value = materialParameters.shadowHighThreshold;
});

/**
 * Objects
 */
// Torus knot
const torusKnot = new THREE.Mesh(new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32), material);
torusKnot.position.x = 3;
scene.add(torusKnot);

// Sphere
const sphere = new THREE.Mesh(new THREE.SphereGeometry(), material);
sphere.position.x = -3;
scene.add(sphere);

// Suzanne
let suzanne = null;
gltfLoader.load('./suzanne.glb', gltf => {
  suzanne = gltf.scene;
  suzanne.traverse(child => {
    if (child.isMesh) child.material = material;
  });
  scene.add(suzanne);
});

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Rotate objects
  if (suzanne) {
    suzanne.rotation.x = -elapsedTime * 0.1;
    suzanne.rotation.y = elapsedTime * 0.25;
  }

  sphere.rotation.x = -elapsedTime * 0.1;
  sphere.rotation.y = elapsedTime * 0.2;

  torusKnot.rotation.x = -elapsedTime * 0.1;
  torusKnot.rotation.y = elapsedTime * 0.2;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
