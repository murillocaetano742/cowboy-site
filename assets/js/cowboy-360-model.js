(function () {
  'use strict';

  var stage = document.querySelector('[data-model]');
  if (!stage) return;
  var canvas = stage.querySelector('canvas');
  var status = document.querySelector('[data-model-status]');
  var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-rotate]'));
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var state = { yaw: 0, pitch: 0, velocity: 0, target: null, lastInteraction: 0, dragging: false, started: false };
  var api = null;

  function say(message) { if (status) status.textContent = message; }

  function supportsWebGL() {
    try {
      var probe = document.createElement('canvas');
      return Boolean(window.WebGLRenderingContext && (probe.getContext('webgl') || probe.getContext('experimental-webgl')));
    } catch (error) { return false; }
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (window.THREE) return resolve();
      var script = document.createElement('script');
      script.src = src; script.async = true;
      script.onload = resolve;
      script.onerror = function () { reject(new Error('script')); };
      document.head.appendChild(script);
    });
  }

  function studioEnvironment(THREE, renderer) {
    // Procedural equirectangular "studio": warm dark room with two softboxes and a gold floor glow.
    var size = 512;
    var c = document.createElement('canvas'); c.width = size * 2; c.height = size;
    var ctx = c.getContext('2d');
    var sky = ctx.createLinearGradient(0, 0, 0, size);
    sky.addColorStop(0, '#3a2f20'); sky.addColorStop(.5, '#17130e'); sky.addColorStop(.82, '#241b10'); sky.addColorStop(1, '#4a3418');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, c.width, c.height);
    function softbox(x, y, w, h, alpha) {
      var g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(w, h));
      g.addColorStop(0, 'rgba(255,246,228,' + alpha + ')'); g.addColorStop(.35, 'rgba(255,240,215,' + alpha * .55 + ')'); g.addColorStop(1, 'rgba(255,240,215,0)');
      ctx.fillStyle = g; ctx.fillRect(x - w, y - h, w * 2, h * 2);
    }
    softbox(size * .55, size * .28, 170, 110, 1.35);
    softbox(size * 1.55, size * .32, 130, 80, 1);
    softbox(size * 1.0, size * .16, 260, 40, .5);
    var texture = new THREE.CanvasTexture(c);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    var pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    var env = pmrem.fromEquirectangular(texture).texture;
    texture.dispose(); pmrem.dispose();
    return env;
  }

  function ribTexture(THREE) {
    var c = document.createElement('canvas'); c.width = 512; c.height = 64;
    var ctx = c.getContext('2d');
    for (var x = 0; x < c.width; x += 1) {
      var v = 128 + Math.round(90 * Math.sin((x / c.width) * Math.PI * 2 * 44));
      ctx.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')';
      ctx.fillRect(x, 0, 1, c.height);
    }
    var texture = new THREE.CanvasTexture(c);
    texture.wrapS = THREE.RepeatWrapping;
    return texture;
  }

  function shadowTexture(THREE) {
    var c = document.createElement('canvas'); c.width = 256; c.height = 256;
    var ctx = c.getContext('2d');
    var g = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
    g.addColorStop(0, 'rgba(0,0,0,.75)'); g.addColorStop(.5, 'rgba(0,0,0,.35)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }

  function build(THREE) {
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    renderer.physicallyCorrectLights = true;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(30, 1, .1, 50);
    camera.position.set(0, 2.7, 9.6);
    camera.lookAt(0, 2.75, 0);

    var env = studioEnvironment(THREE, renderer);
    scene.environment = env;

    var key = new THREE.SpotLight(0xfff1dc, 110, 40, Math.PI / 5, .6, 2); key.position.set(4, 8, 6); scene.add(key);
    var fill = new THREE.PointLight(0xfff4e2, 28, 30, 2); fill.position.set(-1.5, 3.2, 8.5); scene.add(fill);
    var rim = new THREE.SpotLight(0xd9b06a, 45, 40, Math.PI / 5, .7, 2); rim.position.set(-5, 5, -4); scene.add(rim);
    scene.add(new THREE.AmbientLight(0x6a5a44, 1.1));

    var bottle = new THREE.Group();
    scene.add(bottle);

    // Materials
    var glass = new THREE.MeshPhysicalMaterial({ color: 0x070504, roughness: .16, metalness: 0, clearcoat: 1, clearcoatRoughness: .1, envMapIntensity: 1.1 });
    var plastic = new THREE.MeshPhysicalMaterial({ color: 0x0a0908, roughness: .45, metalness: 0, clearcoat: .6, clearcoatRoughness: .35, envMapIntensity: .9 });
    var rubber = new THREE.MeshStandardMaterial({ color: 0x0c0b0a, roughness: .85, metalness: 0, envMapIntensity: .5 });

    // Body: lathe profile (radius, height) in bottle units. Bottle height ~ 4.9 units.
    var profile = [
      [0, 0], [.72, 0], [.9, .05], [.98, .16], [1, .5], [1, 3.05], [.97, 3.3], [.86, 3.5], [.68, 3.66], [.58, 3.78], [.56, 3.9], [.56, 4.12], [0, 4.12],
    ].map(function (p) { return new THREE.Vector2(p[0], p[1]); });
    var body = new THREE.Mesh(new THREE.LatheGeometry(profile, 96), glass);
    bottle.add(body);

    // Label wrapped around the body (texture front centered at u = .5)
    var labelTexture = new THREE.TextureLoader().load(stage.dataset.texture, function () { render(); });
    labelTexture.encoding = THREE.sRGBEncoding;
    labelTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    var labelMaterial = new THREE.MeshPhysicalMaterial({ map: labelTexture, roughness: .7, metalness: 0, clearcoat: .2, clearcoatRoughness: .55, envMapIntensity: .45, emissive: 0xffffff, emissiveMap: labelTexture, emissiveIntensity: .22 });
    var labelHeight = 2.62;
    var label = new THREE.Mesh(new THREE.CylinderGeometry(1.012, 1.012, labelHeight, 128, 1, true), labelMaterial);
    label.position.y = .3 + labelHeight / 2;
    label.rotation.y = Math.PI / 2; // bring u = .5 to face +z
    bottle.add(label);

    // Collar ring at the neck top
    var collar = new THREE.Mesh(new THREE.CylinderGeometry(.66, .66, .22, 96), plastic);
    collar.position.y = 4.12 + .11;
    bottle.add(collar);

    // Ribbed cap
    var ribs = ribTexture(THREE);
    var capMaterial = new THREE.MeshPhysicalMaterial({ color: 0x0a0908, roughness: .5, metalness: 0, clearcoat: .5, clearcoatRoughness: .4, bumpMap: ribs, bumpScale: .012, envMapIntensity: .9 });
    var cap = new THREE.Mesh(new THREE.CylinderGeometry(.7, .72, 1.05, 128, 1), capMaterial);
    cap.position.y = 4.34 + .525;
    bottle.add(cap);
    var capTop = new THREE.Mesh(new THREE.CylinderGeometry(.5, .7, .14, 96), plastic);
    capTop.position.y = 4.34 + 1.05 + .07;
    bottle.add(capTop);

    // Rubber bulb
    var bulbProfile = [[0, 0], [.3, 0], [.38, .12], [.4, .4], [.37, .62], [.28, .78], [.14, .88], [0, .9]].map(function (p) { return new THREE.Vector2(p[0], p[1]); });
    var bulb = new THREE.Mesh(new THREE.LatheGeometry(bulbProfile, 64), rubber);
    bulb.position.y = 4.34 + 1.19;
    bottle.add(bulb);

    // Soft contact shadow
    var shadow = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 4.2), new THREE.MeshBasicMaterial({ map: shadowTexture(THREE), transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = .002; shadow.scale.set(1, .55, 1);
    scene.add(shadow);

    function resize() {
      var width = stage.clientWidth, height = stage.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      // Fit: keep the whole bottle in view on narrow stages.
      var fit = Math.max(1, 1.25 / camera.aspect);
      camera.position.z = 9.6 * Math.min(fit, 1.6);
      render();
    }

    function render() {
      bottle.rotation.y = state.yaw;
      bottle.rotation.x = state.pitch;
      renderer.render(scene, camera);
    }

    var last = performance.now();
    function frame(now) {
      var dt = Math.min(.05, (now - last) / 1000); last = now;
      var idle = now - state.lastInteraction > 3500;
      if (state.target !== null) {
        var diff = state.target - state.yaw;
        if (Math.abs(diff) < .002) { state.yaw = state.target; state.target = null; }
        else state.yaw += diff * Math.min(1, dt * 7);
      } else if (!state.dragging) {
        state.yaw += state.velocity * dt;
        state.velocity *= Math.pow(.08, dt);
        if (idle && !reduceMotion) state.yaw += .35 * dt;
      }
      state.pitch += (0 - state.pitch) * Math.min(1, dt * (state.dragging ? 0 : 4));
      render();
      window.requestAnimationFrame(frame);
    }

    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(stage); else window.addEventListener('resize', resize);
    resize();
    window.requestAnimationFrame(frame);

    return {
      nudge: function (direction) { state.target = (state.target === null ? state.yaw : state.target) + direction * (Math.PI / 3); state.lastInteraction = performance.now(); },
      reset: function () { state.target = Math.round(state.yaw / (Math.PI * 2)) * Math.PI * 2; state.lastInteraction = performance.now(); },
    };
  }

  function bindPointer() {
    var lastX = 0, lastY = 0, lastT = 0;
    canvas.addEventListener('pointerdown', function (event) {
      if (event.button !== 0 && event.pointerType === 'mouse') return;
      state.dragging = true; state.target = null; state.velocity = 0;
      lastX = event.clientX; lastY = event.clientY; lastT = performance.now();
      stage.setAttribute('data-touched', 'true');
      canvas.setPointerCapture(event.pointerId);
    });
    canvas.addEventListener('pointermove', function (event) {
      if (!state.dragging) return;
      var now = performance.now();
      var dx = event.clientX - lastX, dy = event.clientY - lastY;
      var dyaw = dx * .012;
      state.yaw += dyaw;
      state.pitch = Math.max(-.35, Math.min(.35, state.pitch + dy * .004));
      var dt = Math.max(1, now - lastT) / 1000;
      state.velocity = dyaw / dt;
      lastX = event.clientX; lastY = event.clientY; lastT = now;
      state.lastInteraction = now;
    });
    function release() { if (!state.dragging) return; state.dragging = false; state.lastInteraction = performance.now(); }
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', release);
    canvas.addEventListener('lostpointercapture', release);
    canvas.addEventListener('keydown', function (event) {
      if (!api) return;
      if (event.key === 'ArrowLeft') { api.nudge(-1); event.preventDefault(); }
      if (event.key === 'ArrowRight') { api.nudge(1); event.preventDefault(); }
      if (event.key === 'Home') { api.reset(); event.preventDefault(); }
    });
  }

  function start() {
    if (state.started) return;
    state.started = true;
    if (!supportsWebGL()) { say('A visualização 3D não está disponível neste navegador. A foto acima mostra o frasco.'); return; }
    say('Carregando o frasco em 3D…');
    loadScript(stage.dataset.script).then(function () {
      api = build(window.THREE);
      bindPointer();
      stage.setAttribute('data-ready', 'true');
      say(reduceMotion ? 'Frasco em 3D pronto. Use os botões ou as setas para girar.' : 'Frasco em 3D pronto. Arraste para girar.');
      buttons.forEach(function (button) {
        button.addEventListener('click', function () {
          if (!api) return;
          stage.setAttribute('data-touched', 'true');
          if (button.dataset.rotate === 'reset') api.reset(); else api.nudge(Number(button.dataset.rotate));
        });
      });
    }).catch(function () {
      say('Não foi possível carregar a visualização 3D agora. A foto acima mostra o frasco.');
    });
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      if (entries.some(function (entry) { return entry.isIntersecting; })) { observer.disconnect(); start(); }
    }, { rootMargin: '600px 0px' });
    observer.observe(stage);
  } else {
    start();
  }
})();
