const THREE_MODULE = '/assets/vendor/three-0.185.1/three.module.min.js';
const ATLAS_PATH = '/imagens/v3/referencias-reais/rotulo-360-video.webp';
const FRONT_ANGLE = -0.35;
const FRONT_CENTER_U = 238 / 1537;

function loadTexture(THREE, path) {
  return new Promise((resolve) => {
    new THREE.TextureLoader().load(path, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
      resolve(texture);
    }, undefined, () => resolve(null));
  });
}

function lathe(THREE, profile, material) {
  return new THREE.Mesh(new THREE.LatheGeometry(profile, 128), material);
}

function createRibbedCapGeometry(THREE, radius, height, grooves = 72) {
  const segments = 216;
  const positions = [];
  const indices = [];
  for (let row = 0; row <= 1; row += 1) {
    const y = (row === 0 ? -0.5 : 0.5) * height;
    for (let index = 0; index <= segments; index += 1) {
      const angle = (index / segments) * Math.PI * 2;
      const modulation = 0.018 * (0.5 + (0.5 * Math.cos(angle * grooves)));
      const currentRadius = radius + modulation;
      positions.push(Math.sin(angle) * currentRadius, y, Math.cos(angle) * currentRadius);
    }
  }
  for (let index = 0; index < segments; index += 1) {
    const next = index + 1;
    const lower = index;
    const upper = index + segments + 1;
    indices.push(lower, next, upper, next, upper + 1, upper);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function createStudioEnvironment(THREE, renderer) {
  const environment = new THREE.Scene();
  const boxMaterial = new THREE.MeshBasicMaterial({ color: '#fff8ee', side: THREE.BackSide });
  const softbox = (width, height, depth, x, y, z, color) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), boxMaterial.clone());
    mesh.material.color.set(color);
    mesh.position.set(x, y, z);
    environment.add(mesh);
  };
  softbox(2.8, 5.2, 0.18, -3.2, 1.6, 1.4, '#fff4e4');
  softbox(1.8, 4.2, 0.18, 3.1, 1.9, 1.0, '#dce4ea');
  softbox(4.8, 1.2, 0.18, 0, 4.6, -1.2, '#f5eee5');
  const pmrem = new THREE.PMREMGenerator(renderer);
  const target = pmrem.fromScene(environment, 0.04, 0.1, 12, { size: 128 });
  pmrem.dispose();
  environment.traverse((child) => { child.geometry?.dispose(); child.material?.dispose(); });
  return target;
}

function createBottle(THREE, atlas) {
  const bottle = new THREE.Group();
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: '#1a100a', roughness: 0.17, metalness: 0.02, transmission: 0.035, thickness: 0.22,
    clearcoat: 0.55, clearcoatRoughness: 0.14,
  });
  const rubberMaterial = new THREE.MeshStandardMaterial({ color: '#121110', roughness: 0.62, metalness: 0.01 });
  const plasticMaterial = new THREE.MeshPhysicalMaterial({ color: '#171716', roughness: 0.29, metalness: 0.06, clearcoat: 0.18, clearcoatRoughness: 0.28 });
  const profile = [
    new THREE.Vector2(0, -1.39), new THREE.Vector2(0.5, -1.38), new THREE.Vector2(0.65, -1.33),
    new THREE.Vector2(0.75, -1.23), new THREE.Vector2(0.79, -1.08), new THREE.Vector2(0.79, 0.91),
    new THREE.Vector2(0.77, 1.0), new THREE.Vector2(0.72, 1.11), new THREE.Vector2(0.64, 1.22),
    new THREE.Vector2(0.55, 1.32), new THREE.Vector2(0.47, 1.42), new THREE.Vector2(0.42, 1.5),
  ];
  const body = lathe(THREE, profile, glassMaterial);
  body.castShadow = true;
  body.receiveShadow = true;
  bottle.add(body);

  const atlasStart = -FRONT_ANGLE - (FRONT_CENTER_U * Math.PI * 2);
  const label = new THREE.Mesh(
    new THREE.CylinderGeometry(0.802, 0.802, 2.08, 160, 1, true, atlasStart, Math.PI * 2),
    new THREE.MeshStandardMaterial({ map: atlas, roughness: 0.48, metalness: 0.01 }),
  );
  label.position.y = -0.13;
  bottle.add(label);

  const baseRing = lathe(THREE, [
    new THREE.Vector2(0.58, 1.43), new THREE.Vector2(0.63, 1.45), new THREE.Vector2(0.63, 1.62),
    new THREE.Vector2(0.59, 1.67), new THREE.Vector2(0.51, 1.67),
  ], plasticMaterial);
  bottle.add(baseRing);
  const cap = new THREE.Mesh(createRibbedCapGeometry(THREE, 0.55, 0.61), plasticMaterial);
  cap.position.y = 1.97;
  bottle.add(cap);
  const capTop = lathe(THREE, [
    new THREE.Vector2(0.52, 2.27), new THREE.Vector2(0.49, 2.31), new THREE.Vector2(0.39, 2.34),
    new THREE.Vector2(0.32, 2.39), new THREE.Vector2(0.3, 2.47),
  ], plasticMaterial);
  bottle.add(capTop);
  const bulb = lathe(THREE, [
    new THREE.Vector2(0.27, 2.44), new THREE.Vector2(0.34, 2.49), new THREE.Vector2(0.34, 2.57),
    new THREE.Vector2(0.3, 2.65), new THREE.Vector2(0.285, 2.74), new THREE.Vector2(0.285, 3.31),
    new THREE.Vector2(0.26, 3.45), new THREE.Vector2(0.19, 3.56), new THREE.Vector2(0.09, 3.62), new THREE.Vector2(0, 3.64),
  ], rubberMaterial);
  bottle.add(bulb);
  return bottle;
}

function disposeObject(THREE, root) {
  root.traverse((child) => {
    if (!child.isMesh) return;
    child.geometry?.dispose();
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      if (!material) return;
      Object.values(material).forEach((value) => { if (value instanceof THREE.Texture) value.dispose(); });
      material.dispose();
    });
  });
}

async function start() {
  const root = document.querySelector('[data-studio-model]');
  const stage = root?.querySelector('.studio-stage');
  const canvas = root?.querySelector('canvas');
  const poster = root?.querySelector('[data-studio-poster]');
  const status = root?.querySelector('[data-studio-status]');
  if (!root || !stage || !canvas) return;
  let THREE;
  try { THREE = await import(THREE_MODULE); } catch {
    if (status) status.textContent = 'O estudo WebGL não está disponível neste dispositivo. A foto original permanece disponível.';
    return;
  }
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    if (status) status.textContent = 'O estudo WebGL não está disponível neste dispositivo. A foto original permanece disponível.';
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const atlas = await loadTexture(THREE, ATLAS_PATH);
  if (!atlas) {
    renderer.dispose();
    if (status) status.textContent = 'O estudo não pôde carregar a textura real do vídeo 360. A foto original permanece disponível.';
    return;
  }
  const scene = new THREE.Scene();
  const environment = createStudioEnvironment(THREE, renderer);
  scene.environment = environment.texture;
  const bottle = createBottle(THREE, atlas);
  bottle.rotation.y = FRONT_ANGLE;
  scene.add(bottle);
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  const bounds = new THREE.Box3().setFromObject(bottle);
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  const target = center.clone().add(new THREE.Vector3(0, 0.03, 0));
  const key = new THREE.DirectionalLight('#fff7ee', 2.2);
  key.position.set(-3.5, 5.2, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.bias = -0.00035;
  scene.add(key);
  const rim = new THREE.DirectionalLight('#dfe8ee', 1.15);
  rim.position.set(4, 3, -3);
  scene.add(rim);
  scene.add(new THREE.HemisphereLight('#d8e0e4', '#29221d', 0.55));
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.ShadowMaterial({ color: '#120e0b', opacity: 0.28 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = bounds.min.y;
  ground.receiveShadow = true;
  scene.add(ground);

  let width = 0;
  let height = 0;
  let rotation = FRONT_ANGLE;
  let dragging = false;
  let previousX = 0;
  function frameCamera() {
    const radians = THREE.MathUtils.degToRad(camera.fov / 2);
    const vertical = (size.y / (2 * Math.tan(radians))) * 1.18;
    const horizontal = (size.x / (2 * Math.tan(radians) * camera.aspect)) * 1.18;
    camera.position.set(0, target.y + 0.02, Math.max(vertical, horizontal, 7));
    camera.lookAt(target);
  }
  function render() { bottle.rotation.y = rotation; renderer.render(scene, camera); }
  function resize() {
    const box = stage.getBoundingClientRect();
    const nextWidth = Math.max(1, Math.round(box.width));
    const nextHeight = Math.max(320, Math.round(box.height));
    if (nextWidth === width && nextHeight === height) return;
    width = nextWidth; height = nextHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    frameCamera();
    render();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(stage);
  function rotateBy(delta) { rotation += delta; render(); }
  function reset() { rotation = FRONT_ANGLE; render(); canvas.focus(); }
  function pointerDown(event) { dragging = true; previousX = event.clientX; canvas.setPointerCapture(event.pointerId); }
  function pointerMove(event) { if (!dragging) return; rotateBy((event.clientX - previousX) * 0.012); previousX = event.clientX; }
  function pointerUp(event) { dragging = false; if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId); }
  function keydown(event) {
    if (event.key === 'ArrowLeft') { event.preventDefault(); rotateBy(-0.18); }
    if (event.key === 'ArrowRight') { event.preventDefault(); rotateBy(0.18); }
    if (event.key === 'Home') { event.preventDefault(); reset(); }
  }
  canvas.addEventListener('pointerdown', pointerDown);
  canvas.addEventListener('pointermove', pointerMove);
  canvas.addEventListener('pointerup', pointerUp);
  canvas.addEventListener('pointercancel', pointerUp);
  canvas.addEventListener('keydown', keydown);
  root.querySelector('[data-studio-left]')?.addEventListener('click', () => rotateBy(-0.18));
  root.querySelector('[data-studio-right]')?.addEventListener('click', () => rotateBy(0.18));
  root.querySelector('[data-studio-reset]')?.addEventListener('click', reset);
  canvas.hidden = false;
  if (poster) poster.hidden = true;
  if (status) status.textContent = 'Estudo pronto. Arraste ou use as setas para girar o frasco.';
  resize();
}

start();
