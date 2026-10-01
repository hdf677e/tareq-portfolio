/* More work: WebGL ring of curved cards seen from an off-centre camera.
   - The camera sits inside the ring, left of centre, with a narrow lens: cards sweep
     in small from the right and pass large on the left.
   - Pinned page scroll and drag spin the ring freely, with momentum and no snapping.
     While moving, the view zooms in, cards bow and a wave rolls through the ring.
   - Intro: the ring flies in from far away, spinning. Exit: it spins off into the distance. */
import * as THREE from 'three';

// Proportions fitted to the reference at 1440x860: card 1.58:1, hairline gap,
// ring centre offset (in ring radii) and a 32° horizontal lens.
const H = 2.39, W = 3.77, GAP = 0.03, STEP = W + GAP;
const CX = 0.214, CZ = -0.446;            // ring centre relative to the camera, x R
const A0 = -0.247;                        // arc position (x R) of the card resting just left of centre
const HFOV = 29.6;
const TEX_W = 1600, TEX_H = Math.round(1600 * H / W);
const INTRO_MS = 2600;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const easeOut = (t, p = 4) => 1 - Math.pow(1 - t, p);
const easeIn = (t, p = 3) => Math.pow(t, p);

const cardVert = `
uniform float uR, uCx, uCz, uCenter, uVel, uFar, uSquash;
varying vec2 vUv;
void main(){
  vUv = uv;
  float th = (uCenter + position.x) / uR;
  float bow = sin(uv.x * 3.14159265) * uVel;
  float r = uR + uFar - bow * 0.9;
  float wave = sin(th * 4.0) * uVel * 0.22;
  float y = position.y * uSquash + wave;
  gl_Position = projectionMatrix * viewMatrix * vec4(uCx + sin(th) * r, y, uCz - cos(th) * r, 1.0);
}`;

const cardFrag = `
uniform sampler2D uImg, uUi;
uniform float uAlpha;
varying vec2 vUv;
float sdRound(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
void main(){
  vec2 size = vec2(${W.toFixed(2)}, ${H.toFixed(2)});
  float d = sdRound((vUv - 0.5) * size, size * 0.5, 0.15);
  float aa = fwidth(d);
  float mask = 1.0 - smoothstep(-aa, aa, d);
  vec3 col = texture2D(uImg, vUv).rgb;
  vec4 ui = texture2D(uUi, vUv);
  gl_FragColor = vec4(mix(col, ui.rgb, ui.a), mask * uAlpha);
}`;

const floorVert = `
varying vec2 vP;
void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vP = w.xz; gl_Position = projectionMatrix * viewMatrix * w; }`;

const floorFrag = `
uniform float uRot, uFade;
uniform vec2 uC;
varying vec2 vP;
void main(){
  float c = cos(uRot), s = sin(uRot);
  vec2 g = mat2(c, -s, s, c) * (vP - uC) / 0.9;
  vec2 w = abs(fract(g - 0.5) - 0.5) / fwidth(g);
  float line = 1.0 - min(min(w.x, w.y), 1.0);
  float fade = smoothstep(30.0, 3.0, length(vP));
  gl_FragColor = vec4(vec3(1.0), line * 0.16 * fade * uFade);
}`;

function loadImage(src){
  return new Promise(res => { const i = new Image(); i.decoding = 'async'; i.onload = () => res(i); i.onerror = () => res(null); i.src = src; });
}

// screenshot, cover-fit and top-aligned
function imageCanvas(img){
  const c = document.createElement('canvas'); c.width = TEX_W; c.height = TEX_H;
  const g = c.getContext('2d');
  g.fillStyle = '#1b1c18'; g.fillRect(0, 0, TEX_W, TEX_H);
  if(img){ const s = Math.max(TEX_W / img.width, TEX_H / img.height); g.drawImage(img, (TEX_W - img.width * s) / 2, 0, img.width * s, img.height * s); }
  return c;
}

// soft bottom shade, white title bottom-left, small dark round button bottom-right
function labelCanvas(item){
  const c = document.createElement('canvas'); c.width = TEX_W; c.height = TEX_H;
  const g = c.getContext('2d');
  const grd = g.createLinearGradient(0, TEX_H * 0.62, 0, TEX_H);
  grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(1, 'rgba(0,0,0,.45)');
  g.fillStyle = grd; g.fillRect(0, TEX_H * 0.62, TEX_W, TEX_H * 0.38);
  g.fillStyle = '#fff'; g.font = '400 46px Geist, system-ui, sans-serif';
  g.fillText(item.name, 44, TEX_H - 46);
  if(item.href){
    const x = TEX_W - 68, y = TEX_H - 62, r = 24;
    g.fillStyle = 'rgba(12,12,12,.85)'; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#fff'; g.lineWidth = 3; g.lineCap = 'round'; g.lineJoin = 'round';
    g.beginPath(); g.moveTo(x - 7, y + 7); g.lineTo(x + 7, y - 7); g.moveTo(x - 3, y - 7); g.lineTo(x + 7, y - 7); g.lineTo(x + 7, y + 3); g.stroke();
  }
  return c;
}

export function initWorkCarousel(section, items){
  const stage = section.querySelector('.wc-stage');
  const host = section.querySelector('.wc-canvas');
  const idxEl = section.querySelector('.wc-i');
  const nameEl = section.querySelector('.wc-name');
  const live = section.querySelector('.wc-live');
  const n = items.length;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Full ring: repeat the items until the circle is ~16 cards around.
  const SLOTS = n * Math.max(1, Math.round(16 / n));
  const CIRC = SLOTS * STEP;
  const R = CIRC / (Math.PI * 2);
  const cx = CX * R, cz = CZ * R, a0 = A0 * R;
  const wrap = s => s - Math.round(s / CIRC) * CIRC;

  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' }); }
  catch(e){ section.classList.add('wc-off'); return () => {}; }
  section.style.setProperty('--wc-n', n - 1);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x14160e, 1); // same olive near-black as --ink
  host.appendChild(renderer.domElement);
  const canvas = renderer.domElement;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(20, 1, 0.1, 200);
  camera.lookAt(0, 0, -1);

  const geo = new THREE.PlaneGeometry(W, H, 64, 8);
  const slots = Array.from({ length: SLOTS }, (_, j) => {
    const u = { uR: { value: R }, uCx: { value: cx }, uCz: { value: cz }, uCenter: { value: 0 }, uVel: { value: 0 },
                uFar: { value: 0 }, uSquash: { value: 1 }, uImg: { value: null }, uUi: { value: null }, uAlpha: { value: 0 } };
    const mat = new THREE.ShaderMaterial({ uniforms: u, vertexShader: cardVert, fragmentShader: cardFrag, transparent: true, depthWrite: false });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.frustumCulled = false;
    scene.add(mesh);
    return { u, mat, item: j % n };
  });

  const floorMat = new THREE.ShaderMaterial({
    uniforms: { uRot: { value: 0 }, uFade: { value: 0 }, uC: { value: new THREE.Vector2(cx, cz) } },
    vertexShader: floorVert, fragmentShader: floorFrag, transparent: true, depthWrite: false });
  const floorGeo = new THREE.PlaneGeometry(120, 120);
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -H / 2 - 0.45;
  scene.add(floor);

  // textures are per item and shared by every slot showing that item
  const textures = [];
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const makeTex = cnv => { const t = new THREE.CanvasTexture(cnv); t.anisotropy = maxAniso; textures.push(t); return t; };
  const setTex = (item, key, tex) => slots.forEach(s => { if(s.item === item) s.u[key].value = tex; });
  const placeholder = makeTex(imageCanvas(null)), blank = makeTex(document.createElement('canvas'));
  slots.forEach(s => { s.u.uImg.value = placeholder; s.u.uUi.value = blank; });
  const fontsReady = document.fonts ? document.fonts.load('400 46px Geist').catch(() => {}) : Promise.resolve();
  let dead = false;
  items.forEach((item, i) => {
    loadImage(item.image).then(img => { if(!dead) setTex(i, 'uImg', makeTex(imageCanvas(img))); });
    fontsReady.then(() => { if(!dead) setTex(i, 'uUi', makeTex(labelCanvas(item))); });
  });

  // keep the horizontal lens fixed so cards take the same share of the width everywhere
  let baseFov = 20;
  function fit(){
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const hf = w < 700 ? HFOV * 0.72 : HFOV;   // phones: bigger cards
    baseFov = 2 * Math.atan(Math.tan(hf * Math.PI / 360) / camera.aspect) * 180 / Math.PI;
  }
  fit();
  const ro = new ResizeObserver(fit); ro.observe(stage);

  let visible = false;
  const vio = new IntersectionObserver(es => { visible = es[0].isIntersecting; });
  vio.observe(section);

  // Scroll timeline while pinned: the cards, then an exit tail (EXIT of the pinned
  // distance, matching the extra 70svh in the section's CSS height).
  const EXIT = 0.7 / ((n - 1) * 0.55 + 0.7);

  // pointer: drag or flick to spin freely, click a card to open it
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  let base = 0, drag = 0, flick = 0, pos = 0, spinPos = 0, vel = 0, idx = -1, down = null;
  function hit(e){
    const r = canvas.getBoundingClientRect();
    ndc.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const d = ray.ray.direction;
    // camera is inside the ring: take the positive root of |t·d - c|² = R² in the xz plane
    const a = d.x * d.x + d.z * d.z, b = -2 * (d.x * cx + d.z * cz), c = cx * cx + cz * cz - R * R;
    if(a < 1e-6) return -1;
    const t = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
    const X = d.x * t - cx, Z = d.z * t - cz, y = d.y * t;
    const s = Math.atan2(X, -Z) * R + spinPos - a0;
    const j = Math.round(s / STEP);
    if(Math.abs(s - j * STEP) > W / 2 || Math.abs(y) > H / 2) return -1;
    return ((j % SLOTS) + SLOTS) % SLOTS;
  }
  const itemAt = slot => slot < 0 ? -1 : slots[slot].item;
  const open = i => {
    const href = i >= 0 && items[i].href;
    if(!href) return;
    if(href[0] === '#') location.hash = href.slice(1);          // in-site project page
    else window.open(href, '_blank', 'noopener');
  };

  canvas.addEventListener('pointerdown', e => {
    if(e.button !== 0) return;
    down = { x: e.clientX, lastX: e.clientX, lastT: performance.now(), d: drag, moved: false };
    flick = 0;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', e => {
    if(down){
      const perPx = STEP * 1.4 / stage.clientWidth;
      if(Math.abs(e.clientX - down.x) > 6) down.moved = true;
      drag = down.d - (e.clientX - down.x) * perPx;
      const now = performance.now(), dt = Math.max(1, now - down.lastT);
      flick = -(e.clientX - down.lastX) * perPx / dt * 16;       // units per frame
      down.lastX = e.clientX; down.lastT = now;
      canvas.style.cursor = 'grabbing';
      return;
    }
    const h = hit(e);
    canvas.style.cursor = h >= 0 && items[itemAt(h)].href ? 'pointer' : 'grab';
  });
  canvas.addEventListener('pointerup', e => {
    if(down && !down.moved) open(itemAt(hit(e)));
    if(down && performance.now() - down.lastT > 80) flick = 0;   // held still before release: no throw
    down = null; canvas.style.cursor = 'grab';
  });
  canvas.addEventListener('pointercancel', () => { down = null; });

  // keyboard: arrows spin one card, Enter opens the current one
  const onKey = e => {
    if(e.key === 'ArrowRight' || e.key === 'ArrowLeft'){ e.preventDefault(); flick = 0; drag += e.key === 'ArrowRight' ? STEP : -STEP; }
    else if(e.key === 'Enter') open(idx);
  };
  stage.addEventListener('keydown', onKey);

  let introAt = null, exit = 0, lastCss = '';
  let raf = requestAnimationFrame(function frame(now){
    raf = requestAnimationFrame(frame);
    if(!visible) return;
    const rect = section.getBoundingClientRect();
    const range = rect.height - innerHeight, cardLen = range * (1 - EXIT);
    base = (cardLen > 0 ? clamp(-rect.top / cardLen, 0, 1) : 0) * (n - 1) * STEP;

    if(!down && flick){ drag += flick; flick *= 0.95; if(Math.abs(flick) < 0.002) flick = 0; }
    pos += (base + drag - pos) * (reduce ? 1 : 0.075);

    // intro plays once the section is well into view, and replays after leaving upward
    const enterT = clamp(1 - rect.top / innerHeight, 0, 1);
    if(introAt === null && enterT > 0.4) introAt = now;
    if(enterT < 0.02) introAt = null;
    const intro = introAt === null ? 0 : (reduce ? 1 : clamp((now - introAt) / INTRO_MS, 0, 1));
    const exitT = range > 0 ? clamp((-rect.top - cardLen) / (range * EXIT), 0, 1) : 0;
    exit += (exitT - exit) * (reduce ? 1 : 0.1);

    // intro: most of a turn that brakes to a stop; exit: accelerate away
    const iE = easeOut(intro, 4), xE = easeIn(exit, 2);
    const spin = reduce ? 0 : -(1 - iE) * CIRC * 0.7 + xE * CIRC * 0.4;
    const prevSpin = spinPos;
    spinPos = pos + spin;
    vel += (clamp((spinPos - prevSpin) * 2.2, -1, 1) - vel) * 0.14;
    if(reduce) vel = 0;

    // moving pulls the view in, like leaning toward the ring
    camera.fov = baseFov * (1 - Math.abs(vel) * 0.14);
    camera.updateProjectionMatrix();

    const far = reduce ? 0 : (1 - easeOut(intro, 5)) * 30 + xE * 26;
    const squash = reduce ? 1 : (0.2 + 0.8 * easeOut(clamp(intro * 1.4 - 0.2, 0, 1), 3)) * (1 - xE * 0.6);
    const alpha = Math.min(1, intro * 4) * (1 - easeIn(exit, 1.5));
    for(let j = 0; j < SLOTS; j++){
      const u = slots[j].u;
      u.uCenter.value = wrap(j * STEP - spinPos + a0);
      u.uVel.value = vel;
      u.uFar.value = far;
      u.uSquash.value = squash;
      u.uAlpha.value = alpha;
    }
    floorMat.uniforms.uRot.value = -spinPos / R;
    floorMat.uniforms.uFade.value = Math.min(1, intro * 1.5) * (1 - exit);

    // corner labels fade on exit; a light canvas blur sells the intro and exit speed
    const blur = reduce ? 0 : (1 - easeOut(intro, 3)) * 8 + xE * 12;
    const css = `${exit.toFixed(3)}|${blur.toFixed(1)}`;
    if(css !== lastCss){
      lastCss = css;
      section.style.setProperty('--wc-x', exit.toFixed(3));
      canvas.style.filter = blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : '';
    }

    const i = ((Math.round(pos / STEP) % n) + n) % n;
    if(i !== idx){
      idx = i;
      if(idxEl) idxEl.textContent = String(i + 1).padStart(2, '0');
      if(nameEl) nameEl.textContent = items[i].name;
      if(live && document.activeElement === stage) live.textContent = `${items[i].name}, ${i + 1} of ${n}`;
    }
    renderer.render(scene, camera);
  });

  return function destroy(){
    dead = true;
    cancelAnimationFrame(raf);
    ro.disconnect(); vio.disconnect();
    stage.removeEventListener('keydown', onKey);
    slots.forEach(s => s.mat.dispose());
    textures.forEach(t => t.dispose());
    geo.dispose(); floorGeo.dispose(); floorMat.dispose();
    renderer.dispose();
    canvas.remove();
  };
}
