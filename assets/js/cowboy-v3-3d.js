const THREE_MODULE = '/assets/vendor/three-0.185.1/three.module.min.js';
const FRONT_ANGLE = -0.35;
const REAL_LABEL_ATLAS = Object.freeze({
  path: '/imagens/v3/referencias-reais/rotulo-360-video.webp',
  frontCenterU: 238 / 1537,
});

async function loadRealLabelAtlas(THREE) {
  const loader = new THREE.TextureLoader();
  return new Promise((resolve) => {
    loader.load(REAL_LABEL_ATLAS.path, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
      resolve(texture);
    }, undefined, () => resolve(null));
  });
}

function createBottle(THREE, labelTexture) {
  const bottle = new THREE.Group();
  const dark = new THREE.MeshStandardMaterial({ color: '#11100e', roughness: 0.32, metalness: 0.18 });
  const amber = new THREE.MeshPhysicalMaterial({ color: '#15120e', roughness: 0.25, metalness: 0.02, transmission: 0.02, transparent: true, opacity: 1 });
  const profile = [
    new THREE.Vector2(0.53, -1.34), new THREE.Vector2(0.64, -1.32), new THREE.Vector2(0.73, -1.25),
    new THREE.Vector2(0.78, -1.12), new THREE.Vector2(0.79, -0.98), new THREE.Vector2(0.79, 0.58),
    new THREE.Vector2(0.79, 0.72), new THREE.Vector2(0.79, 0.86), new THREE.Vector2(0.79, 0.91),
    new THREE.Vector2(0.77, 1), new THREE.Vector2(0.73, 1.1), new THREE.Vector2(0.67, 1.2),
    new THREE.Vector2(0.59, 1.29), new THREE.Vector2(0.51, 1.38), new THREE.Vector2(0.45, 1.46),
    new THREE.Vector2(0.42, 1.49),
  ];
  const glass = new THREE.Mesh(new THREE.LatheGeometry(profile, 64), amber);
  glass.castShadow = true;
  glass.receiveShadow = true;
  bottle.add(glass);

  const frontLocalAngle = -FRONT_ANGLE;
  const atlasStartAngle = frontLocalAngle - (REAL_LABEL_ATLAS.frontCenterU * Math.PI * 2);
  const label = new THREE.Mesh(
    new THREE.CylinderGeometry(0.802, 0.802, 2.08, 128, 1, true, atlasStartAngle, Math.PI * 2),
    new THREE.MeshStandardMaterial({ map: labelTexture, roughness: 0.55, metalness: 0.01 }),
  );
  label.position.y = -0.13;
  bottle.add(label);

  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.61, 0.61, 0.27, 48), dark);
  collar.position.y = 1.53;
  bottle.add(collar);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.57, 0.66, 48), dark);
  cap.position.y = 1.96;
  bottle.add(cap);
  const ribMaterial = new THREE.MeshStandardMaterial({ color: '#24201a', roughness: 0.28, metalness: 0.24 });
  for (let index = 0; index < 64; index += 1) {
    const angle = (index / 64) * Math.PI * 2;
    const rib = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.59, 0.028), ribMaterial);
    rib.position.set(Math.sin(angle) * 0.56, 1.96, Math.cos(angle) * 0.56);
    rib.rotation.y = angle;
    bottle.add(rib);
  }
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.28, 40), dark);
  neck.position.y = 2.43;
  bottle.add(neck);
  const bulbProfile = [
    new THREE.Vector2(0.23, 2.53), new THREE.Vector2(0.29, 2.58), new THREE.Vector2(0.31, 2.68),
    new THREE.Vector2(0.31, 3.2), new THREE.Vector2(0.28, 3.36), new THREE.Vector2(0.2, 3.48),
    new THREE.Vector2(0.1, 3.55), new THREE.Vector2(0, 3.58),
  ];
  const bulb = new THREE.Mesh(new THREE.LatheGeometry(bulbProfile, 48), dark);
  bottle.add(bulb);
  return bottle;
}

function disposeObject(THREE, object) {
  object.traverse((child) => {
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

export async function startBottle3D(root) {
  const poster = root.querySelector('[data-v3-3d-poster]');
  const status = root.querySelector('[data-v3-3d-status]');
  const resetButton = root.querySelector('[data-v3-3d-reset]');
  const stage = root.querySelector('.v3-model-stage');
  const canvas = root.querySelector('canvas');
  if (!canvas || !stage) return { destroy() {} };
  let THREE;
  try { THREE = await import(THREE_MODULE); } catch {
    if (status) status.textContent = 'A visualização interativa não está disponível neste dispositivo. A imagem do frasco permanece disponível.';
    return { destroy() {} };
  }
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' }); } catch {
    if (status) status.textContent = 'A visualização interativa não está disponível neste dispositivo. A imagem do frasco permanece disponível.';
    return { destroy() {} };
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  const labelTexture = await loadRealLabelAtlas(THREE);
  if (!labelTexture) {
    renderer.dispose();
    if (status) status.textContent = 'A visualização 3D não pôde carregar a textura real do vídeo 360. A foto original do frasco permanece disponível.';
    return { destroy() {} };
  }
  const bottle = createBottle(THREE, labelTexture);
  const bounds = new THREE.Box3().setFromObject(bottle);
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  const target = center.clone().add(new THREE.Vector3(0, 0.04, 0));
  let rotation = FRONT_ANGLE;
  bottle.rotation.y = rotation;
  scene.add(bottle);
  scene.add(new THREE.HemisphereLight('#f8d391', '#211309', 2.15));
  const key = new THREE.DirectionalLight('#fff1d2', 2.3);
  key.position.set(4, 5, 4);
  scene.add(key);
  const rim = new THREE.PointLight('#bf641f', 1.15, 18);
  rim.position.set(-3, 1.2, -3);
  scene.add(rim);
  const base = new THREE.Mesh(new THREE.CircleGeometry(2.5, 64), new THREE.MeshBasicMaterial({ color: '#261507', transparent: true, opacity: 0.45 }));
  base.rotation.x = -Math.PI / 2;
  base.position.y = bounds.min.y;
  scene.add(base);

  let width = 1;
  let height = 1;
  let previousWidth = 0;
  let previousHeight = 0;
  let dragging = false;
  let previousX = 0;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function frameCamera() {
    const radians = THREE.MathUtils.degToRad(camera.fov / 2);
    const verticalDistance = (size.y / (2 * Math.tan(radians))) * 1.16;
    const horizontalDistance = (size.x / (2 * Math.tan(radians) * camera.aspect)) * 1.16;
    camera.position.set(0, target.y + 0.06, Math.max(verticalDistance, horizontalDistance, 6.9));
    camera.lookAt(target);
  }
  function render() { bottle.rotation.y = rotation; renderer.render(scene, camera); }
  function resize() {
    const box = stage.getBoundingClientRect();
    width = Math.max(1, Math.round(box.width));
    height = Math.max(300, Math.round(box.height));
    if (width === previousWidth && height === previousHeight) return;
    previousWidth = width;
    previousHeight = height;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    frameCamera();
    render();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(stage);
  canvas.hidden = false;
  if (poster) poster.hidden = true;
  if (status) status.textContent = reducedMotion ? 'Visualização pronta. Use os controles para girar o frasco.' : 'Arraste horizontalmente ou use as setas para girar o frasco.';
  resize();
  function rotateBy(delta) { rotation += delta; render(); }
  function resetView() { rotation = FRONT_ANGLE; render(); canvas.focus(); }
  function pointerDown(event) { dragging = true; previousX = event.clientX; canvas.setPointerCapture(event.pointerId); }
  function pointerMove(event) { if (!dragging) return; rotateBy((event.clientX - previousX) * 0.012); previousX = event.clientX; }
  function pointerUp(event) { dragging = false; if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId); }
  function keydown(event) {
    if (event.key === 'ArrowLeft') { event.preventDefault(); rotateBy(-0.18); }
    if (event.key === 'ArrowRight') { event.preventDefault(); rotateBy(0.18); }
    if (event.key === 'Home') { event.preventDefault(); resetView(); }
  }
  canvas.addEventListener('pointerdown', pointerDown);
  canvas.addEventListener('pointermove', pointerMove);
  canvas.addEventListener('pointerup', pointerUp);
  canvas.addEventListener('pointercancel', pointerUp);
  canvas.addEventListener('keydown', keydown);
  resetButton?.addEventListener('click', resetView);
  return {
    rotateLeft: () => rotateBy(-0.18), rotateRight: () => rotateBy(0.18), reset: resetView,
    destroy() {
      observer.disconnect();
      canvas.removeEventListener('pointerdown', pointerDown);
      canvas.removeEventListener('pointermove', pointerMove);
      canvas.removeEventListener('pointerup', pointerUp);
      canvas.removeEventListener('pointercancel', pointerUp);
      canvas.removeEventListener('keydown', keydown);
      resetButton?.removeEventListener('click', resetView);
      disposeObject(THREE, bottle);
      base.geometry.dispose();
      base.material.dispose();
      renderer.dispose();
    },
  };
}
