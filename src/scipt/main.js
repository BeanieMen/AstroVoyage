import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

import starsTexture from "../imgs/8k_stars.jpg";
import sunTexture from "../imgs/sun.jpg";
import mercuryTexture from "../imgs/8k_mercury.jpg";
import venusTexture from "../imgs/venus.jpg";
import earthTexture from "../imgs/earth.jpg";
import marsTexture from "../imgs/mars.jpg";
import jupiterTexture from "../imgs/jupiter.jpg";
import saturnTexture from "../imgs/saturn.jpg";
import saturnRingTexture from "../imgs/saturn ring.png";
import uranusTexture from "../imgs/uranus.jpg";
import uranusRingTexture from "../imgs/uranus ring.png";
import neptuneTexture from "../imgs/neptune.jpg";
import plutoTexture from "../imgs/pluto.jpg";

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.getElementById("mainCanvas"),
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.autoClear = false;

document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
bloomPass.threshold = 0;
bloomPass.strength = 1.1;
bloomPass.radius = 0;

const bloomComposer = new EffectComposer(renderer);
bloomComposer.setSize(window.innerWidth, window.innerHeight);
bloomComposer.renderToScreen = true;

bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(-90, 140, 140);
orbit.update();



const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
]);

const textureLoader = new THREE.TextureLoader();

const sunGeo = new THREE.SphereGeometry(16, 100, 100);
const sunMat = new THREE.MeshBasicMaterial({
  map: textureLoader.load(sunTexture),
});

const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

function createPlanete(size, texture, position, ring, orbitalRingSize = 0.5) {
  const geo = new THREE.SphereGeometry(size, 100, 100);
  const mat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture),
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = Math.PI / 2;
  const orbitGeo = new THREE.RingGeometry(
    position,
    position + orbitalRingSize,
    50
  );
  const orbitMat = new THREE.MeshBasicMaterial({
    colot: 0xffffff,
    side: THREE.DoubleSide,
  });
  const orbitMesh = new THREE.Mesh(orbitGeo, orbitMat);

  scene.add(orbitMesh);
  orbitMesh.rotation.x = -0.5 * Math.PI;
  orbitMesh.add(mesh);

  if (ring) {
    const ringGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      500
    );
    const ringMat = new THREE.MeshBasicMaterial({
      map: textureLoader.load(ring.texture),
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.x = position;
    orbitMesh.add(ringMesh);
  }

  mesh.position.x = position;
  return { mesh, orbitMesh };
}

const mercury = createPlanete(3.2, mercuryTexture, 28, false);
const venus = createPlanete(5.8, venusTexture, 44, false);
const earth = createPlanete(6, earthTexture, 62, false);

const mars = createPlanete(4, marsTexture, 78, false);
const jupiter = createPlanete(12, jupiterTexture, 100, false);
const saturn = createPlanete(10, saturnTexture, 138, {
  innerRadius: 10,
  outerRadius: 20,
  texture: saturnRingTexture,
});
const uranus = createPlanete(7, uranusTexture, 176, {
  innerRadius: 7,
  outerRadius: 12,
  texture: uranusRingTexture,
});

const neptune = createPlanete(7, neptuneTexture, 200, false);
const pluto = createPlanete(2.8, plutoTexture, 216, false);

const pointLight = new THREE.PointLight(0xffffff, 2500, 300);
scene.add(pointLight);

function animate() {
  //Self-rotation
  sun.rotateY(0.004);
  mercury.mesh.rotateY(0.004);
  venus.mesh.rotateY(0.002);
  earth.mesh.rotateY(0.02);
  mars.mesh.rotateY(0.018);
  jupiter.mesh.rotateY(0.04);
  saturn.mesh.rotateY(0.038);
  uranus.mesh.rotateY(0.03);
  neptune.mesh.rotateY(0.032);
  pluto.mesh.rotateY(0.008);

  //Around-sun-rotation
  mercury.orbitMesh.rotateZ(0.02);
  venus.orbitMesh.rotateZ(0.0075);
  earth.orbitMesh.rotateZ(0.005);
  mars.orbitMesh.rotateZ(0.004);
  jupiter.orbitMesh.rotateZ(0.001);
  saturn.orbitMesh.rotateZ(0.00045);
  uranus.orbitMesh.rotateZ(0.0002);
  neptune.orbitMesh.rotateZ(0.00005);
  pluto.orbitMesh.rotateZ(0.000035);
  renderer.render(scene, camera);
  bloomComposer.render();
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
