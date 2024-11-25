import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import GUI from "lil-gui";

const canvas = document.querySelector(".webgl");

const deubugObject = {
  color: "black",
};
const gui = new GUI({
  width: 300,
  title: "tweaks",
  closeFolders: true,
});

gui.close();

const scene = new THREE.Scene();
const group = new THREE.Group();

const fontLoader = new FontLoader();

const material = new THREE.MeshPhysicalMaterial();
const material2 = new THREE.MeshPhysicalMaterial();

material.metalness = 0;
material.roughness = 0;
material.transmission = 1;
material.ior = 1.5;
material.thickness = 1;
material.flatShading = true;

material2.metalness = 0;
material2.roughness = 0;

material2.transmission = 1;
material2.ior = 1.5;
material2.thickness = 1;

material.color = new THREE.Color(deubugObject.color);
material2.color = new THREE.Color("red");

fontLoader.load("/fonts/vindey.json", (font) => {
  const textGeometry = new TextGeometry("Arun", {
    font: font,
    size: 0.5,
    depth: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  const textMaterial = material2;
  textMaterial.flatShading = true;
  const text = new THREE.Mesh(textGeometry, textMaterial);

  text.scale.set(2, 2, 2);
  group.add(text);

  textGeometry.center();
});

const diamondGeometry = new THREE.BufferGeometry();

// Vertices for a basic diamond shape (in 3D space)
const vertices = new Float32Array([
  0,
  1,
  0, // Top vertex (apex)
  -0.5,
  0,
  0.5, // Bottom front-left
  0.5,
  0,
  0.5, // Bottom front-right
  0.5,
  0,
  -0.5, // Bottom back-right
  -0.5,
  0,
  -0.5, // Bottom back-left
  0,
  -1,
  0, // Bottom vertex (point)
]);

// Faces defined by vertices indices (triangular facets)
const indices = [
  // Top facets
  0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 1,

  // Bottom facets
  5, 2, 1, 5, 3, 2, 5, 4, 3, 5, 1, 4,
];

// Set up geometry attributes
diamondGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(vertices, 3)
);
diamondGeometry.setIndex(indices);
diamondGeometry.computeVertexNormals();

scene.add(group);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 11;
camera.lookAt(group.position);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);

window.addEventListener("resize", () => {
  (sizes.width = window.innerWidth), (sizes.height = window.innerHeight);

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(sizes.width, sizes.height);
});

const diamondTweak = gui.addFolder("diamondTweak");
const letterTweak = gui.addFolder("letterTweak");

diamondTweak.add(material, "transmission").min(0).max(1).step(0.0001);
diamondTweak.add(material, "ior").min(1).max(10).step(0.0001);
diamondTweak.add(material, "thickness").min(0).max(1).step(0.0001);
diamondTweak.addColor(deubugObject, "color").onChange(() => {
  material.color.set(deubugObject.color);
});

letterTweak.add(material2, "transmission").min(0).max(1).step(0.0001);
letterTweak.add(material2, "ior").min(1).max(10).step(0.0001);
letterTweak.add(material2, "thickness").min(0).max(1).step(0.0001);

// const ambientLight = new THREE.AmbientLight("magenta", 25);
// scene.add(ambientLight);

const rgbeLoader = new RGBELoader();
rgbeLoader.load("./textures/environmentMap/roof.hdr", (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = environmentMap;
  scene.environment = environmentMap;
});

for (let i = 0; i < 50; i++) {
  const diamond = new THREE.Mesh(diamondGeometry, material);

  diamond.position.x = (Math.random() - 0.5) * 10;
  diamond.position.y = (Math.random() - 0.5) * 10;
  diamond.position.z = (Math.random() - 0.5) * 10;

  // diamond.rotation.x = Math.random() * Math.PI;
  // diamond.rotation.y = Math.random() * Math.PI;

  const scale = Math.random();
  diamond.scale.set(scale, scale, scale);

  scene.add(diamond);
}

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  camera.position.x = Math.sin(elapsedTime) * 5;
  camera.position.z = Math.cos(elapsedTime) * 14;

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
