const THREE_MODULE = '/assets/vendor/three-0.185.1/three.module.min.js';
const FRONT_ANGLE = -0.35;

function drawLabelPanel(context, centerX, title, lines, reverse) {
  const panelWidth = 910;
  const left = centerX - (panelWidth / 2);
  context.fillStyle = reverse ? '#d8cda9' : '#17130e';
  context.fillRect(left, 44, panelWidth, 936);
  context.strokeStyle = '#c9943a';
  context.lineWidth = 18;
  context.strokeRect(left + 24, 68, panelWidth - 48, 888);
  context.fillStyle = reverse ? '#201911' : '#e8bf6a';
  context.textAlign = 'center';
  context.font = '700 86px Georgia, serif';
  context.fillText(title, centerX, 188);
  context.font = '600 34px Arial, sans-serif';
  lines.forEach((line, index) => context.fillText(line, centerX, 320 + (index * 74)));
}

function createWrapLabelTexture(THREE) {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const context = canvas.getContext('2d');
  context.fillStyle = '#21180f';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = '#5f421f';
  context.lineWidth = 5;
  for (let x = 0; x < canvas.width; x += 116) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x + 110, canvas.height);
    context.stroke();
  }
  drawLabelPanel(context, 512, 'COWBOY', ['ENERGIA', 'SUPLEMENTO ALIMENTAR', 'EM GOTAS', '30 mL'], false);
  drawLabelPanel(context, 1536, 'COMPOSIÇÃO', [
    'PORÇÃO: 12 GOTAS (1 mL)', 'FENO-GREGO 300 mg', 'TAURINA 50 mg · ARGININA 50 mg',
    'VITAMINA B6 3 mg', 'ZINCO 1,7 mg · BORO 1,1 mg',
  ], true);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function createBottle(THREE) {
  const bottle = new THREE.Group();
  const dark = new THREE.MeshStandardMaterial({ color: '#11100e', roughness: 0.32, metalness: 0.18 });
  const amber = new THREE.MeshPhysicalMaterial({ color: '#4c250b', roughness: 0.2, metalness: 0.03, transmission: 0.06, transparent: true, opacity: 0.96 });
  const profile = [
    new THREE.Vector2(0.54, -1.34), new THREE.Vector2(0.77, -1.25), new THREE.Vector2(0.84, -0.98),
    new THREE.Vector2(0.84, 0.64), new THREE.Vector2(0.79, 0.91), new THREE.Vector2(0.57, 1.15),
    new THREE.Vector2(0.44, 1.34), new THREE.Vector2(0.42, 1.49),
  ];
  const glass = new THREE.Mesh(new THREE.LatheGeometry(profile, 64), amber);
  glass.castShadow = true;
  glass.receiveShadow = true;
  bottle.add(glass);

  const label = new THREE.Mesh(
    new THREE.CylinderGeometry(0.852, 0.852, 1.59, 96, 1, true, -Math.PI / 2, Math.PI * 2),
    new THREE.MeshStandardMaterial({ map: createWrapLabelTexture(THREE), roughness: 0.48, metalness: 0.02 }),
  );
  label.position.y = -0.1;
  bottle.add(label);

  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.51, 0.51, 0.27, 48), dark);
  collar.position.y = 1.53;
  bottle.add(collar);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.48, 0.66, 48), dark);
  cap.position.y = 1.94;
  bottle.add(cap);
  const ribMaterial = new THREE.MeshStandardMaterial({ color: '#24201a', roughness: 0.28, metalness: 0.24 });
  for (let index = 0; index < 28; index += 1) {
    const angle = (index / 28) * Math.PI * 2;
    const rib = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.58, 0.045), ribMaterial);
    rib.position.set(Math.sin(angle) * 0.47, 1.94, Math.cos(angle) * 0.47);
    rib.rotation.y = -angle;
    bottle.add(rib);
  }
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.34, 0.34, 40), dark);
  neck.position.y = 2.42;
  bottle.add(neck);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.43, 48, 28), dark);
  bulb.scale.set(0.92, 1.36, 0.92);
  bulb.position.y = 2.94;
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
  const bottle = createBottle(THREE);
  const bounds = new THREE.Box3().setFromObject(bottle);
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  const target = center.clone().add(new THREE.Vector3(0, 0.04, 0));
  let rotation = FRONT_ANGLE;
  bottle.rotation.y = rotation;
  scene.add(bottle);
  scene.add(new THREE.HemisphereLight('#f8d391', '#211309', 2.15));
  const key = new THREE.DirectionalLight('#f7b853', 3.4);
  key.position.set(4, 5, 4);
  scene.add(key);
  const rim = new THREE.PointLight('#bf641f', 2.4, 18);
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
