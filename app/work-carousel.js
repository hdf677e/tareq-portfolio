/* More work: WebGL carousel of curved cards on a cylinder around the camera.
   Page scroll (the section is pinned) and horizontal drag move the ring;
   cards bow with scroll speed and the floor grid turns with them. */
import * as THREE from 'three';

const R = 11;            // cylinder radius
const W = 6.4, H = 4;    // card size (world units, 16:10)
const STEP = W + 0.55;   // arc length between card centres
const TEX_W = 1600, TEX_H = 1000;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

const cardVert = `
uniform float uCenter, uVel, uRise, uFar;
varying vec2 vUv;
void main(){
  vUv = uv;
  float th = (uCenter + position.x) / ${R.toFixed(1)};
  float r = ${R.toFixed(1)} + uFar - sin(uv.x * 3.14159265) * uVel * 0.6;
  vec3 p = vec3(sin(th) * r, position.y * (1.0 + abs(uVel) * 0.015) - uRise, -cos(th) * r);
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
}`;

// Dissolve: a noisy left-to-right field. Entry reveals pixels below uIn,
// exit burns away pixels below uOut; both edges glow lime.
const cardFrag = `
uniform sampler2D uImg, uUi;
uniform float uPar, uDim, uHover, uAlpha, uIn, uOut, uSeed;
varying vec2 vUv;
float sdRound(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p){ float v = 0.0, a = 0.5; for(int i = 0; i < 4; i++){ v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }
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

  const float E = 0.055;
  float f = vUv.x * 0.6 + fbm(vUv * vec2(10.0, 6.5) + uSeed) * 0.4;
  float tIn = uIn * (1.0 + 2.0 * E) - E, tOut = uOut * (1.0 + 2.0 * E) - E;
  float shown = (1.0 - smoothstep(tIn - 0.004, tIn + 0.004, f)) * smoothstep(tOut - 0.004, tOut + 0.004, f);
  float gIn = (1.0 - smoothstep(0.0, E, tIn - f)) * step(uIn, 0.999);
  float gOut = (1.0 - smoothstep(0.0, E, f - tOut)) * step(0.001, uOut);
  float g = max(gIn, gOut);
  vec3 lime = vec3(0.725, 0.886, 0.357);
  col = mix(col, lime * 0.9, pow(g, 1.6) * 0.9) + mix(lime, vec3(1.0), 0.5) * pow(g, 6.0) * 0.8;
  gl_FragColor = vec4(col, mask * uAlpha * shown);
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
  float fade = smoothstep(34.0, 4.0, length(vP));
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
  const idxEl = section.querySelector('.wc-i');
  const nameEl = section.querySelector('.wc-name');
  const live = section.querySelector('.wc-live');
  const n = items.length;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' }); }
  catch(e){ section.classList.add('wc-off'); return () => {}; }
  section.style.setProperty('--wc-n', n - 1);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x050505, 1);
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0, 0);
  camera.lookAt(0, 0, -R);

  const geo = new THREE.PlaneGeometry(W, H, 64, 1);
  const cards = items.map(() => {
    const u = { uImg: { value: null }, uUi: { value: null }, uCenter: { value: 0 }, uVel: { value: 0 }, uRise: { value: 0 }, uFar: { value: 0 }, uIn: { value: 0 }, uOut: { value: 0 }, uSeed: { value: 0 },
                uPar: { value: 0 }, uDim: { value: 1 }, uHover: { value: 0 }, uAlpha: { value: 0 } };
    const mat = new THREE.ShaderMaterial({ uniforms: u, vertexShader: cardVert, fragmentShader: cardFrag, transparent: true, depthWrite: false });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.frustumCulled = false;
    u.uSeed.value = Math.random() * 50;
    scene.add(mesh);
    return { u, mat };
  });

  const floorMat = new THREE.ShaderMaterial({ uniforms: { uRot: { value: 0 }, uFade: { value: 0 } }, vertexShader: floorVert, fragmentShader: floorFrag, transparent: true, depthWrite: false });
  const floorGeo = new THREE.PlaneGeometry(90, 90);
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -H / 2 - 1.1;
  scene.add(floor);

  const textures = [];
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const makeTex = canvas => { const t = new THREE.CanvasTexture(canvas); t.anisotropy = maxAniso; textures.push(t); return t; };
  const fontsReady = document.fonts ? Promise.all([document.fonts.load('500 66px Geist'), document.fonts.load('500 28px "Geist Mono"')]).catch(() => {}) : Promise.resolve();
  items.forEach((item, i) => {
    cards[i].u.uImg.value = makeTex(imageCanvas(null));
    loadImage(item.image).then(img => { if(!dead) cards[i].u.uImg.value = makeTex(imageCanvas(img)); });
    fontsReady.then(() => { if(!dead) cards[i].u.uUi.value = makeTex(labelCanvas(item)); });
  });
  const blank = makeTex(document.createElement('canvas'));
  cards.forEach(c => { c.u.uUi.value = blank; });

  // Size and place the active card from the page layout: its left edge lines up
  // with the heading, and it is centred in the space between heading and footer.
  // Layout offsets (not rects) so reveal transforms don't skew the measurement.
  const head = section.querySelector('.more-head'), hud = section.querySelector('.wc-hud');
  const edge = 2 * R * Math.tan(W / 2 / R);   // projected width of the curved card at the camera's distance
  function fit(){
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false);
    const wrap = head.offsetParent;
    const gap = Math.max(32, Math.min(64, h * 0.06));
    const left = wrap.offsetLeft + head.offsetLeft;
    const top = wrap.offsetTop + head.offsetTop + head.offsetHeight + gap;
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

  // Scroll timeline while pinned: card slices, then an exit tail (EXIT of the
  // pinned distance, matching the extra 70svh in the section's CSS height).
  const EXIT = 0.7 / ((n - 1) * 0.55 + 0.7);
  // Each card gets an equal slice of the scroll; it holds in place for the first and
  // last 20% of its slice and eases to the next card in between.
  let base = 0;
  function scrollBase(p){
    if(n < 2) return 0;
    const f = p * (n - 1), seg = Math.min(Math.floor(f), n - 2);
    const t = clamp((f - seg - 0.2) / 0.6, 0, 1);
    return (seg + t * t * (3 - 2 * t)) * STEP;
  }

  // pointer: drag to move, click a card to open it
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  let cur = 0, vel = 0, drag = 0, idx = -1, hover = -1, down = null, dead = false;
  function hit(e){
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const d = ray.ray.direction, hz = Math.hypot(d.x, d.z);
    if(hz < 1e-4) return -1;
    const t = R / hz, y = camera.position.y + d.y * t;
    const s = Math.atan2(d.x * t, -d.z * t) * R + cur;
    const i = Math.round(s / STEP);
    if(i < 0 || i >= n || Math.abs(s - i * STEP) > W / 2 || Math.abs(y) > H / 2) return -1;
    return i;
  }
  const open = i => { if(i >= 0 && items[i].href) window.open(items[i].href, '_blank', 'noopener'); };
  const canvas = renderer.domElement;
  canvas.addEventListener('pointerdown', e => {
    if(e.button !== 0) return;
    down = { x: e.clientX, d: drag, moved: false };
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', e => {
    if(down){
      const dx = e.clientX - down.x;
      if(Math.abs(dx) > 6) down.moved = true;
      drag = down.d - dx / stage.clientWidth * STEP * 1.6;
      canvas.style.cursor = 'grabbing';
      return;
    }
    hover = hit(e);
    canvas.style.cursor = hover >= 0 && items[hover].href ? 'pointer' : 'grab';
  });
  canvas.addEventListener('pointerup', e => {
    if(down && !down.moved) open(hit(e));
    else if(down) drag = Math.round((base + drag) / STEP) * STEP - base;   // settle on the nearest card
    down = null; canvas.style.cursor = 'grab';
  });
  canvas.addEventListener('pointercancel', () => { down = null; });
  canvas.addEventListener('pointerleave', () => { if(!down) hover = -1; });

  // keyboard: arrows scroll to the previous/next card, Enter opens it
  const onKey = e => {
    if(e.key === 'ArrowRight' || e.key === 'ArrowLeft'){
      e.preventDefault();
      const to = clamp(idx + (e.key === 'ArrowRight' ? 1 : -1), 0, n - 1);
      drag = 0;
      const cardLen = (section.offsetHeight - innerHeight) * (1 - EXIT);
      window.scrollTo({ top: section.getBoundingClientRect().top + scrollY + cardLen * to / (n - 1), behavior: reduce ? 'instant' : 'smooth' });
    } else if(e.key === 'Enter') open(idx);
  };
  stage.addEventListener('keydown', onKey);

  let enter = 0, exit = 0, lastCss = '';
  let raf = requestAnimationFrame(function frame(){
    raf = requestAnimationFrame(frame);
    if(!visible) return;
    const rect = section.getBoundingClientRect();
    const range = rect.height - innerHeight, cardLen = range * (1 - EXIT);
    const max = (n - 1) * STEP;
    base = scrollBase(cardLen > 0 ? clamp(-rect.top / cardLen, 0, 1) : 0);
    drag = clamp(drag, -base - STEP * 0.4, max - base + STEP * 0.4);
    const prev = cur;
    cur += (base + drag - cur) * (reduce ? 1 : 0.085);
    vel += (clamp((cur - prev) * 4, -1, 1) - vel) * 0.12;
    if(reduce) vel = 0;

    // entry runs while the section rises into view, exit during the pinned tail;
    // both are smoothed so fast scrolling still glides
    const enterT = clamp(1 - rect.top / (innerHeight * 0.75), 0, 1);
    const exitT = range > 0 ? clamp((-rect.top - cardLen) / (range * EXIT), 0, 1) : 0;
    const k = reduce ? 1 : 0.08;
    enter += (enterT - enter) * k; exit += (exitT - exit) * k;
    const ease = t => 1 - Math.pow(1 - t, 3);

    for(let i = 0; i < n; i++){
      const c = cards[i];
      const centre = i * STEP - cur;
      const dist = Math.abs(centre / STEP);
      const inT = clamp(enter * 1.15 - dist * 0.22, 0, 1);
      const outT = clamp(exit * 1.35 - Math.max(0, 1 - dist) * 0.3, 0, 1);
      c.u.uCenter.value = centre;
      c.u.uVel.value = vel;
      c.u.uPar.value = clamp(centre / STEP, -1.5, 1.5) * 0.035;
      c.u.uDim.value = 1 - Math.min(dist, 1.5) * 0.3;
      c.u.uHover.value += ((hover === i && !down ? 1 : 0) - c.u.uHover.value) * 0.12;
      if(reduce){ c.u.uIn.value = 1; c.u.uOut.value = 0; c.u.uAlpha.value = enter * (1 - exit); continue; }
      c.u.uIn.value = inT; c.u.uOut.value = outT; c.u.uAlpha.value = 1;
      c.u.uRise.value = 0;
      c.u.uFar.value = (1 - ease(inT)) * 2.5 + ease(outT) * 3.5;
    }

    // floor fades with the cards; header and footer blur away on exit
    floorMat.uniforms.uFade.value = Math.min(1, enter * 1.4) * (1 - exit);
    const css = exit.toFixed(3);
    if(css !== lastCss){ lastCss = css; section.style.setProperty('--wc-x', css); }
    floorMat.uniforms.uRot.value = -cur / R;

    const i = clamp(Math.round(cur / STEP), 0, n - 1);
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
    cards.forEach(c => c.mat.dispose());
    textures.forEach(t => t.dispose());
    geo.dispose(); floorGeo.dispose(); floorMat.dispose();
    renderer.dispose();
    canvas.remove();
  };
}
