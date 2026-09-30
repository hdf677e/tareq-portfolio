/* More work: WebGL ring of curved cards around the camera.
   - Intro: the ring flies in from far away, spinning, and unfolds into place.
   - Pinned page scroll turns the ring card by card; drag flicks it with momentum.
   - The ring is a full 360°, items repeat around it, so it can spin forever.
   - Cards bend with speed; exit spins the ring away into the distance. */
import * as THREE from 'three';

const W = 6.4, H = 4;    // card size (world units, 16:10)
const STEP = W + 0.55;   // arc length between card centres
const TEX_W = 1600, TEX_H = 1000;
const INTRO_MS = 2600;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const easeOut = (t, p = 4) => 1 - Math.pow(1 - t, p);
const easeIn = (t, p = 3) => Math.pow(t, p);

const cardVert = `
uniform float uR, uCenter, uVel, uFar, uSquash;
varying vec2 vUv;
void main(){
  vUv = uv;
  float th = (uCenter + position.x) / uR;
  // bow toward the camera with speed, and let the top and bottom edges wave
  float bow = sin(uv.x * 3.14159265) * uVel;
  float r = uR + uFar - bow * 1.1;
  float y = position.y * uSquash * (1.0 + abs(uVel) * 0.06 * cos((uv.x - 0.5) * 3.14159265));
  gl_Position = projectionMatrix * viewMatrix * vec4(sin(th) * r, y, -cos(th) * r, 1.0);
}`;

const cardFrag = `
uniform sampler2D uImg, uUi;
uniform float uPar, uDim, uHover, uAlpha;
varying vec2 vUv;
float sdRound(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
void main(){
  vec2 size = vec2(${W.toFixed(1)}, ${H.toFixed(1)});
  float d = sdRound((vUv - 0.5) * size, size * 0.5, 0.2);
  float aa = fwidth(d);
  float mask = 1.0 - smoothstep(-aa, aa, d);
  vec2 iuv = vec2((vUv.x - 0.5) * 0.9 + 0.5 + uPar, vUv.y);
  iuv = (iuv - 0.5) / (1.0 + uHover * 0.04) + 0.5;
  vec3 col = texture2D(uImg, iuv).rgb;
  vec4 ui = texture2D(uUi, vUv);
  col = mix(col, ui.rgb, ui.a) * uDim;
  gl_FragColor = vec4(col, mask * uAlpha);
}`;

const floorVert = `
varying vec2 vP;
void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vP = w.xz; gl_Position = projectionMatrix * viewMatrix * w; }`;

const floorFrag = `
uniform float uRot, uFade;
varying vec2 vP;
void main(){
  float c = cos(uRot), s = sin(uRot);
  vec2 g = mat2(c, -s, s, c) * vP / 1.4;
  vec2 w = abs(fract(g - 0.5) - 0.5) / fwidth(g);
  float line = 1.0 - min(min(w.x, w.y), 1.0);
  float fade = smoothstep(40.0, 4.0, length(vP));
  gl_FragColor = vec4(vec3(1.0), line * 0.14 * fade * uFade);
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

// bottom gradient, category, title and arrow button
function labelCanvas(item){
  const c = document.createElement('canvas'); c.width = TEX_W; c.height = TEX_H;
  const g = c.getContext('2d');
  const grd = g.createLinearGradient(0, TEX_H * 0.5, 0, TEX_H);
  grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(1, 'rgba(0,0,0,.75)');
  g.fillStyle = grd; g.fillRect(0, TEX_H * 0.5, TEX_W, TEX_H * 0.5);
  g.fillStyle = 'rgba(255,255,255,.72)'; g.font = '500 28px "Geist Mono", ui-monospace, monospace';
  g.fillText(item.cat.toUpperCase(), 80, TEX_H - 158);
  g.fillStyle = '#fff'; g.font = '500 66px Geist, system-ui, sans-serif';
  g.fillText(item.name, 80, TEX_H - 78);
  if(item.href){
    const x = TEX_W - 124, y = TEX_H - 102;
    g.beginPath(); g.arc(x, y, 46, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#111'; g.lineWidth = 5; g.lineCap = 'round'; g.lineJoin = 'round';
    g.beginPath(); g.moveTo(x - 13, y + 13); g.lineTo(x + 13, y - 13); g.moveTo(x - 7, y - 13); g.lineTo(x + 13, y - 13); g.lineTo(x + 13, y + 7); g.stroke();
  }
  return c;
}

export function initWorkCarousel(section, items){
  const stage = section.querySelector('.wc-stage');
  const host = section.querySelector('.wc-canvas');
  const head = section.querySelector('.more-head');
  const hud = section.querySelector('.wc-hud');
  const idxEl = section.querySelector('.wc-i');
  const nameEl = section.querySelector('.wc-name');
  const live = section.querySelector('.wc-live');
  const n = items.length;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Full ring: repeat the items until the circle is about 10+ cards around.
  const SLOTS = n * Math.max(1, Math.round(10 / n));
  const CIRC = SLOTS * STEP;
  const R = CIRC / (Math.PI * 2);
  const wrap = s => s - Math.round(s / CIRC) * CIRC;

  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' }); }
  catch(e){ section.classList.add('wc-off'); return () => {}; }
  section.style.setProperty('--wc-n', n - 1);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x050505, 1);
  host.appendChild(renderer.domElement);
  const canvas = renderer.domElement;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
  camera.lookAt(0, 0, -1);

  const geo = new THREE.PlaneGeometry(W, H, 64, 8);
  const slots = Array.from({ length: SLOTS }, (_, j) => {
    const u = { uR: { value: R }, uCenter: { value: 0 }, uVel: { value: 0 }, uFar: { value: 0 }, uSquash: { value: 1 },
                uImg: { value: null }, uUi: { value: null }, uPar: { value: 0 }, uDim: { value: 1 }, uHover: { value: 0 }, uAlpha: { value: 0 } };
    const mat = new THREE.ShaderMaterial({ uniforms: u, vertexShader: cardVert, fragmentShader: cardFrag, transparent: true, depthWrite: false });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.frustumCulled = false;
    scene.add(mesh);
    return { u, mat, item: j % n };
  });

  const floorMat = new THREE.ShaderMaterial({ uniforms: { uRot: { value: 0 }, uFade: { value: 0 } }, vertexShader: floorVert, fragmentShader: floorFrag, transparent: true, depthWrite: false });
  const floorGeo = new THREE.PlaneGeometry(120, 120);
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -H / 2 - 1.1;
  scene.add(floor);

  // textures are per item and shared by every slot showing that item
  const textures = [];
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const makeTex = cnv => { const t = new THREE.CanvasTexture(cnv); t.anisotropy = maxAniso; textures.push(t); return t; };
  const setTex = (item, key, tex) => slots.forEach(s => { if(s.item === item) s.u[key].value = tex; });
  const placeholder = makeTex(imageCanvas(null)), blank = makeTex(document.createElement('canvas'));
  slots.forEach(s => { s.u.uImg.value = placeholder; s.u.uUi.value = blank; });
  const fontsReady = document.fonts ? Promise.all([document.fonts.load('500 66px Geist'), document.fonts.load('500 28px "Geist Mono"')]).catch(() => {}) : Promise.resolve();
  let dead = false;
  items.forEach((item, i) => {
    loadImage(item.image).then(img => { if(!dead) setTex(i, 'uImg', makeTex(imageCanvas(img))); });
    fontsReady.then(() => { if(!dead) setTex(i, 'uUi', makeTex(labelCanvas(item))); });
  });

  // Size and place the active card from the page layout: its left edge lines up
  // with the heading, and it is centred in the space between heading and footer.
  // Layout offsets (not rects) so reveal transforms don't skew the measurement.
  const edge = 2 * R * Math.tan(W / 2 / R);   // projected width of the curved card at the camera's distance
  function fit(){
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false);
    const wrapEl = head.offsetParent;
    const gap = Math.max(32, Math.min(64, h * 0.06));
    const left = wrapEl.offsetLeft + head.offsetLeft;
    const top = wrapEl.offsetTop + head.offsetTop + head.offsetHeight + gap;
    const bottom = hud.offsetTop - gap;
    let ch = Math.max(140, bottom - top), cw = ch * edge / H;
    if(cw > head.offsetWidth){ cw = head.offsetWidth; ch = cw * H / edge; }
    const k = cw / edge;                       // pixels per world unit
    camera.aspect = w / h;
    camera.fov = 2 * Math.atan(h / k / 2 / R) * 180 / Math.PI;
    camera.setViewOffset(w, h, w / 2 - (left + cw / 2), h / 2 - (top + (bottom - top) / 2), w, h);
    camera.updateProjectionMatrix();
  }
  fit();
  const ro = new ResizeObserver(fit); ro.observe(stage); ro.observe(head);

  let visible = false;
  const vio = new IntersectionObserver(es => { visible = es[0].isIntersecting; });
  vio.observe(section);

  // Scroll timeline while pinned: one slice per card, then an exit tail
  // (EXIT of the pinned distance, matching the extra 70svh in the CSS height).
  // Each card holds for the first and last 20% of its slice and eases between.
  const EXIT = 0.7 / ((n - 1) * 0.55 + 0.7);
  function scrollBase(p){
    if(n < 2) return 0;
    const f = p * (n - 1), seg = Math.min(Math.floor(f), n - 2);
    const t = clamp((f - seg - 0.2) / 0.6, 0, 1);
    return (seg + t * t * (3 - 2 * t)) * STEP;
  }

  // pointer: drag or flick to spin (with momentum), click a card to open it
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  let base = 0, drag = 0, flick = 0, pos = 0, spinPos = 0, vel = 0, idx = -1, hover = -1, down = null;
  function hit(e){
    const r = canvas.getBoundingClientRect();
    ndc.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const d = ray.ray.direction, hz = Math.hypot(d.x, d.z);
    if(hz < 1e-4) return -1;
    const t = R / hz, y = d.y * t;
    const s = Math.atan2(d.x * t, -d.z * t) * R + spinPos;
    const j = Math.round(s / STEP), local = s - j * STEP;
    if(Math.abs(local) > W / 2 || Math.abs(y) > H / 2) return -1;
    return ((j % SLOTS) + SLOTS) % SLOTS;
  }
  const itemAt = slot => slot < 0 ? -1 : slots[slot].item;
  const open = i => { if(i >= 0 && items[i].href) window.open(items[i].href, '_blank', 'noopener'); };
  const settle = () => { drag = Math.round((base + drag) / STEP) * STEP - base; };   // land on the nearest card

  canvas.addEventListener('pointerdown', e => {
    if(e.button !== 0) return;
    down = { x: e.clientX, lastX: e.clientX, lastT: performance.now(), d: drag, moved: false };
    flick = 0;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', e => {
    if(down){
      const perPx = STEP * 1.6 / stage.clientWidth;
      if(Math.abs(e.clientX - down.x) > 6) down.moved = true;
      drag = down.d - (e.clientX - down.x) * perPx;
      const now = performance.now(), dt = Math.max(1, now - down.lastT);
      flick = -(e.clientX - down.lastX) * perPx / dt * 16;       // units per frame
      down.lastX = e.clientX; down.lastT = now;
      canvas.style.cursor = 'grabbing';
      return;
    }
    hover = hit(e);
    canvas.style.cursor = hover >= 0 && items[itemAt(hover)].href ? 'pointer' : 'grab';
  });
  canvas.addEventListener('pointerup', e => {
    if(down && !down.moved) open(itemAt(hit(e)));
    else if(down && Math.abs(flick) < 0.05) settle();
    down = null; canvas.style.cursor = 'grab';
  });
  canvas.addEventListener('pointercancel', () => { down = null; settle(); });
  canvas.addEventListener('pointerleave', () => { if(!down) hover = -1; });

  // keyboard: arrows spin one card, Enter opens the current one
  const onKey = e => {
    if(e.key === 'ArrowRight' || e.key === 'ArrowLeft'){
      e.preventDefault(); flick = 0;
      drag = Math.round((base + drag) / STEP) * STEP - base + (e.key === 'ArrowRight' ? STEP : -STEP);
    } else if(e.key === 'Enter') open(idx);
  };
  stage.addEventListener('keydown', onKey);

  let introAt = null, exit = 0, lastCss = '';
  let raf = requestAnimationFrame(function frame(now){
    raf = requestAnimationFrame(frame);
    if(!visible) return;
    const rect = section.getBoundingClientRect();
    const range = rect.height - innerHeight, cardLen = range * (1 - EXIT);
    base = scrollBase(cardLen > 0 ? clamp(-rect.top / cardLen, 0, 1) : 0);

    // momentum after a flick, then settle on a card
    if(!down && flick){
      drag += flick; flick *= 0.94;
      if(Math.abs(flick) < 0.02){ flick = 0; settle(); }
    }
    pos += (base + drag - pos) * (reduce ? 1 : 0.085);

    // intro plays once the section is well into view, and replays after leaving upward
    const enterT = clamp(1 - rect.top / innerHeight, 0, 1);
    if(introAt === null && enterT > 0.4) introAt = now;
    if(enterT < 0.02) introAt = null;
    const intro = reduce ? (introAt === null ? 0 : 1) : (introAt === null ? 0 : clamp((now - introAt) / INTRO_MS, 0, 1));
    const exitT = range > 0 ? clamp((-rect.top - cardLen) / (range * EXIT), 0, 1) : 0;
    exit += (exitT - exit) * (reduce ? 1 : 0.1);

    // intro: most of a turn that brakes to a stop; exit: accelerate away
    const iE = easeOut(intro, 4), xE = easeIn(exit, 2);
    const spin = reduce ? 0 : -(1 - iE) * CIRC * 0.8 + xE * CIRC * 0.45;
    const prevSpin = spinPos;
    spinPos = pos + spin;
    vel += (clamp((spinPos - prevSpin) * 1.2, -1.4, 1.4) - vel) * 0.18;
    if(reduce) vel = 0;

    const far = reduce ? 0 : (1 - easeOut(intro, 5)) * 34 + xE * 30;
    const squash = reduce ? 1 : (0.25 + 0.75 * easeOut(clamp(intro * 1.4 - 0.2, 0, 1), 3)) * (1 - xE * 0.6);
    const alpha = Math.min(1, intro * 4) * (1 - easeIn(exit, 1.5));

    for(let j = 0; j < SLOTS; j++){
      const s = slots[j], u = s.u;
      const centre = wrap(j * STEP - spinPos);
      const dist = Math.abs(centre / STEP);
      u.uCenter.value = centre;
      u.uVel.value = vel;
      u.uFar.value = far;
      u.uSquash.value = squash;
      u.uPar.value = clamp(centre / STEP, -1.5, 1.5) * 0.035;
      u.uDim.value = 1 - Math.min(dist, 1.6) * 0.32;
      u.uHover.value += ((hover === j && !down ? 1 : 0) - u.uHover.value) * 0.12;
      u.uAlpha.value = alpha;
    }
    floorMat.uniforms.uRot.value = -spinPos / R;
    floorMat.uniforms.uFade.value = Math.min(1, intro * 1.5) * (1 - exit);

    // header and footer blur away on exit; a light canvas blur sells the speed
    const blur = reduce ? 0 : (1 - easeOut(intro, 3)) * 10 + xE * 14;
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
