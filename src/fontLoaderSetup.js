import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

const canvas = document.querySelector(".webgl");

const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const matCapTexture = textureLoader.load("/textures/matcaps/8.png");
matCapTexture.colorSpace = THREE.SRGBColorSpace;

const fontLoader = new FontLoader();

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
  textGeometry.center();
  const textMaterial = new THREE.MeshMatcapMaterial();
  textMaterial.matcap = matCapTexture;
  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);
});

// const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
// const cubeMaterial = new THREE.MeshBasicMaterial();
// cubeMaterial.color = new THREE.Color("white");
// const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

// const group = new THREE.Group();
// group.add(cube);

// scene.add(group);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
// camera.lookAt(group.position);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;

window.addEventListener("resize", () => {
  (sizes.width = window.innerWidth), (sizes.height = window.innerHeight);

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", () => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
});

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
