<template>
  <div ref="container" class="interactive-sky-container" @contextmenu.prevent>
    <div class="overlay-content">
      <h1>Cosmic Cloud Painter</h1>
      <div class="instruction-text">
        Left Click: Rotate &nbsp;|&nbsp; Right Click: Paint
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const container = ref(null);

let scene, camera, renderer, controls;
let cloudBlocks = []; 
let currentBlock = null; 

let axesLines;
let raycaster, drawingPlane;
let lastDrawingPoint = null;

const mouse = new THREE.Vector2();
const mouseSpeed = { value: 0, lastPos: new THREE.Vector2() };
let isRightMouseDown = false;

// --- 您的配色設定 ---
const BaseColors = {
  bg: 0x000000,       
  fog: 0x000000, // 霧氣通常建議與背景同色，以達最佳隱藏效果     
  axis: 0xFFFFFF,
};

const CloudPalette = [ 
  0xF4F6F0, // 恆星白
  0xFFD27D, // 核球黃
  0x4A3B2A, // 塵埃褐
  0x5f5387, // 星雲紫 (您的新增)
  0x424b93  // 星塵藍 (您的新增)
];

const init = () => {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(BaseColors.bg);
  scene.fog = new THREE.FogExp2(BaseColors.fog, 0.0015);

  camera = new THREE.PerspectiveCamera(75, container.value.clientWidth / container.value.clientHeight, 1, 2000);
  camera.position.set(0, 0, 200);

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1; 

  container.value.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: null 
  };

  raycaster = new THREE.Raycaster();
  drawingPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  lastDrawingPoint = new THREE.Vector3();

  createCustomAxes();
  createStars();

  window.addEventListener('resize', onWindowResize);
  document.addEventListener('mousemove', onDocumentMouseMove);
  document.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mouseup', onMouseUp);
  
  animate();
};

const onMouseDown = (event) => {
  if (event.button === 2) { 
    isRightMouseDown = true;
    lastDrawingPoint = null;

    const normal = new THREE.Vector3();
    camera.getWorldDirection(normal);
    drawingPlane.setFromNormalAndCoplanarPoint(normal, new THREE.Vector3(0, 0, 0));

    currentBlock = {
      sprites: [],
      blockOpacity: 1.0,
      decay: 0.0005 
    };
    cloudBlocks.push(currentBlock);
  }
};

const onMouseUp = () => {
  isRightMouseDown = false;
  currentBlock = null;
  lastDrawingPoint = null;
};

const createCloudTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 64; canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)'); 
  grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.5)'); 
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)'); 
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
};
const cloudTexture = createCloudTexture();

// --- 修改重點：讓核心更紮實的星星貼圖 ---
const createStarTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 64; // 解析度提高
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  // 增加實心核心區域 (0% -> 30%)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');   
  gradient.addColorStop(0.3, 'rgba(255, 255, 255, 1)'); 
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)'); 
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');     
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  
  return new THREE.CanvasTexture(canvas);
};

const starTexture = createStarTexture();

// --- 修改重點：大顆明顯的星星參數 ---
const createStars = () => {
  const geometry = new THREE.BufferGeometry();
  // 數量減少，避免大星星太擁擠 (原本 6000)
  const count = 3000; 
  const vertices = [];

  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    vertices.push(x, y, z);
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

  const material = new THREE.PointsMaterial({
    color: 0xF4F6F0,  
    map: starTexture, 
    size: 3,          // 修改：變大 (原本 3)
    sizeAttenuation: true, 
    transparent: true,
    opacity: 0.9,     // 修改：更亮 (原本 0.5)
    blending: THREE.AdditiveBlending,
    depthWrite: false 
  });

  const stars = new THREE.Points(geometry, material);
  scene.add(stars);
};

const createCustomAxes = () => {
  const size = 1000;
  const points = [];
  points.push(new THREE.Vector3(-size, 0, 0), new THREE.Vector3(size, 0, 0));
  points.push(new THREE.Vector3(0, -size, 0), new THREE.Vector3(0, size, 0));
  points.push(new THREE.Vector3(0, 0, -size), new THREE.Vector3(0, 0, size));
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: BaseColors.axis, opacity: 0.3, transparent: true });
  axesLines = new THREE.LineSegments(geometry, material);
  scene.add(axesLines);
};

const onDocumentMouseMove = (event) => {
  // 安全檢查：如果容器還沒掛載，就不執行
  if (!container.value) return;

  // --- 修正重點開始 ---
  // 1. 取得畫布容器在視窗中的精確位置與尺寸
  const rect = container.value.getBoundingClientRect();

  // 2. 計算滑鼠相對於「容器左上角」的座標
  // event.clientX - rect.left = 滑鼠在畫布內的 X 像素位置
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // 3. 轉換為標準化設備座標 (NDC) -1 到 +1
  // 必須除以容器的寬高 (rect.width, rect.height)，而不是 window 的寬高
  mouse.x = (x / rect.width) * 2 - 1;
  mouse.y = -(y / rect.height) * 2 + 1;
  // --- 修正重點結束 ---

  const currentPos = new THREE.Vector2(event.clientX, event.clientY);
  const distanceToLastMouse = currentPos.distanceTo(mouseSpeed.lastPos);
  mouseSpeed.value = distanceToLastMouse;
  mouseSpeed.lastPos.copy(currentPos);

  if (!isRightMouseDown || !currentBlock) return;

  raycaster.setFromCamera(mouse, camera);
  const targetPoint = new THREE.Vector3();
  raycaster.ray.intersectPlane(drawingPlane, targetPoint);

  if (targetPoint) {
    if (lastDrawingPoint) {
      const dist3D = lastDrawingPoint.distanceTo(targetPoint);
      const stepSize = 3; 
      const steps = Math.floor(dist3D / stepSize);

      for (let i = 1; i <= steps; i++) {
        const lerpFactor = i / (steps + 1);
        const intermediatePoint = new THREE.Vector3().lerpVectors(lastDrawingPoint, targetPoint, lerpFactor);
        spawnCloud(intermediatePoint, mouseSpeed.value);
      }
    }
    spawnCloud(targetPoint, mouseSpeed.value);
    if (!lastDrawingPoint) lastDrawingPoint = new THREE.Vector3();
    lastDrawingPoint.copy(targetPoint);
  }
};

const spawnCloud = (position, speed) => {
  const normalizedSpeed = Math.min(Math.max(speed, 1), 50);
  const size = 40 / Math.log(normalizedSpeed + 2) + (Math.random() * 8); 
  
  const colorIndex = Math.floor(Math.random() * CloudPalette.length);
  const color = CloudPalette[colorIndex];
  
  const baseOpacityScale = 0.15 / Math.log(normalizedSpeed + 1.2);

  const material = new THREE.SpriteMaterial({
    map: cloudTexture,
    color: color,
    transparent: true,
    opacity: baseOpacityScale,
    blending: THREE.AdditiveBlending, 
    depthWrite: false
  });

  const sprite = new THREE.Sprite(material);
  
  const jitter = normalizedSpeed * 0.1;
  sprite.position.set(
    position.x + (Math.random() - 0.5) * jitter,
    position.y + (Math.random() - 0.5) * jitter,
    position.z + (Math.random() - 0.5) * 10 
  );
  sprite.scale.set(size, size, 1);
  
  sprite.userData = {
    baseOpacityScale: baseOpacityScale,
    rotationSpeed: (Math.random() - 0.5) * 0.01
  };

  scene.add(sprite);
  if (currentBlock) {
    currentBlock.sprites.push(sprite);
  }
};

const animate = () => {
  requestAnimationFrame(animate);
  if (controls) controls.update();

  for (let i = cloudBlocks.length - 1; i >= 0; i--) {
    const block = cloudBlocks[i];
    block.blockOpacity -= block.decay;

    if (block.blockOpacity <= 0) {
      block.sprites.forEach(sprite => {
        scene.remove(sprite);
        sprite.material.dispose();
      });
      cloudBlocks.splice(i, 1);
    } else {
      block.sprites.forEach(sprite => {
        sprite.material.opacity = block.blockOpacity * sprite.userData.baseOpacityScale;
        sprite.material.rotation += sprite.userData.rotationSpeed;
      });
    }
  }
  renderer.render(scene, camera);
};

const onWindowResize = () => {
  if (!container.value) return;
  camera.aspect = container.value.clientWidth / container.value.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
};

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize);
  document.removeEventListener('mousemove', onDocumentMouseMove);
  document.removeEventListener('mousedown', onMouseDown);
  document.removeEventListener('mouseup', onMouseUp);
  if (renderer) renderer.dispose();
  if (controls) controls.dispose();
});
</script>

<style scoped>
.interactive-sky-container {
  position: relative;
  width: 100%;
  height: 80vh;
  overflow: hidden;
  background-color: #000000; /* 與 JS 設定一致 */
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.overlay-content {
  position: absolute;
  top: 30px;
  left: 30px;
  pointer-events: none;
  color: #e2e8f0; /* 確保文字顏色夠亮 */
  z-index: 10;    /* 確保層級高於 Canvas */
  
  /* --- 修改重點：移除或註解掉這行 --- */
  /* mix-blend-mode: overlay; */ 
  
  /* 如果你堅持要有混合效果，且背景是全黑，可以使用 difference */
  /* mix-blend-mode: difference; */ 
}

h1 {
  font-size: 2em;
  margin: 0;
  font-weight: 300;
  letter-spacing: 0.1em;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
}

.instruction-text {
  margin-top: 10px;
  font-size: 0.9em;
  color: #94a3b8;
  letter-spacing: 0.05em;
  opacity: 0.8;
}
</style>