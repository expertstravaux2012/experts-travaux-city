// Hélice : les photos du hero sont posées en colimaçon (un escalier de cadres) ; en défilant,
// la caméra descend en spirale et s'arrête sur chaque image. Aucune dépendance autre que Three.js.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export interface HelixConfig {
  canvas: HTMLCanvasElement;
  stage: HTMLElement;
  /** Élément très haut (piste de défilement) dont la progression pilote la visite. */
  track: HTMLElement;
  images: string[];
  onIndex?: (i: number) => void;
  onIntro?: (e: number) => void;
}

const STEP = 1.12; // angle entre deux cadres (rad)
const PITCH = 3.05; // descente entre deux cadres
const R = 5.25; // rayon de l'hélice
const W = 7.8;
const H = (W * 9) / 16;
const FOV = 42;
const HOLD = 0.34; // part de chaque étape où la caméra reste posée sur l'image

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export function startHelix(cfg: HelixConfig) {
  const { canvas, stage, track, images } = cfg;
  const N = images.length;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 140);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.7;
  const fog = new THREE.Fog(0x1c1b1b, 12, 40);
  scene.fog = fog;

  const group = new THREE.Group();
  scene.add(group);

  // Ruban central : la colonne vertébrale terracotta de la spirale.
  const pts: THREE.Vector3[] = [];
  for (let a = -0.9; a <= (N - 1) * STEP + 1; a += 0.04) {
    pts.push(new THREE.Vector3(Math.sin(a) * 2.3, -(a / STEP) * PITCH, Math.cos(a) * 2.3));
  }
  const ribbon = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), pts.length * 3, 0.16, 10, false),
    new THREE.MeshStandardMaterial({ color: 0xc4603c, metalness: 0.85, roughness: 0.3 }),
  );
  group.add(ribbon);

  // Cadres photo.
  const frameGeo = new THREE.BoxGeometry(W + 0.2, H + 0.2, 0.16);
  const photoGeo = new THREE.PlaneGeometry(W, H);
  const loader = new THREE.TextureLoader();
  const frames: THREE.MeshStandardMaterial[] = [];
  const textures: THREE.Texture[] = [];
  const photoMats: THREE.MeshBasicMaterial[] = [];
  images.forEach((src, i) => {
    const a = i * STEP;
    const card = new THREE.Group();
    card.position.set(Math.sin(a) * R, -i * PITCH, Math.cos(a) * R);
    card.rotation.y = a;
    const fm = new THREE.MeshStandardMaterial({ color: 0xd9d6d1, metalness: 0.7, roughness: 0.32, emissive: new THREE.Color(0xe8946f), emissiveIntensity: 0 });
    frames.push(fm);
    card.add(new THREE.Mesh(frameGeo, fm));
    const pm = new THREE.MeshBasicMaterial({ color: 0x2e2e2e, toneMapped: false });
    photoMats.push(pm);
    const photo = new THREE.Mesh(photoGeo, pm);
    photo.position.z = 0.085;
    card.add(photo);
    group.add(card);
    loader.load(src, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      pm.map = t;
      pm.color.set(0xffffff);
      pm.needsUpdate = true;
      textures.push(t);
    });
  });

  let width = 1;
  let height = 1;
  let dist = 8;
  let mobile = false;
  const resize = () => {
    width = stage.clientWidth;
    height = stage.clientHeight;
    renderer.setPixelRatio(Math.min(devicePixelRatio, width < 700 ? 1.5 : 2));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    mobile = width < 900;
    dist = Math.max(7.4, (W * 1.15) / (2 * Math.tan((FOV * Math.PI) / 360) * camera.aspect));
    fog.near = dist + 3;
    fog.far = dist + 30;
  };
  const ro = new ResizeObserver(resize);
  ro.observe(stage);
  resize();

  const progress = () => {
    const r = track.getBoundingClientRect();
    return clamp(-r.top / Math.max(1, track.offsetHeight - innerHeight));
  };
  const idxFor = (p: number) => {
    const travel = clamp((p - 0.1) / 0.8) * (N - 1);
    const fl = Math.floor(travel);
    const fr = travel - fl;
    return Math.min(N - 1, fl + smooth(HOLD, 1, fr));
  };

  const up = new THREE.Vector3(0, 1, 0);
  const pos = new THREE.Vector3();
  const tgt = new THREE.Vector3();
  const right = new THREE.Vector3();
  let cur = 0;
  let curP = 0;
  let lastIdx = -1;
  let last = performance.now();
  let raf = 0;
  let visible = true;

  const frame = (now: number) => {
    raf = 0;
    if (!visible) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const p = progress();
    curP += (p - curP) * (1 - Math.exp(-9 * dt));
    const u = idxFor(curP);
    cur += (u - cur) * (1 - Math.exp(-10 * dt));
    const intro = smooth(0, 0.1, curP);
    cfg.onIntro?.(intro);

    const f = cur - Math.floor(cur);
    const a = cur * STEP + 0.55 * (1 - intro);
    const y = -cur * PITCH + 1.2 * (1 - intro);
    const d = dist * (1 + 0.6 * (1 - intro));
    pos.set(Math.sin(a) * (R + d), y, Math.cos(a) * (R + d));
    tgt.set(Math.sin(a) * R, y, Math.cos(a) * R);
    right.set(Math.cos(a), 0, -Math.sin(a));
    const visH = 2 * d * Math.tan((FOV * Math.PI) / 360);
    if (mobile) {
      const sy = 0.2 * visH * (1 - intro);
      pos.addScaledVector(up, sy);
      tgt.addScaledVector(up, sy);
    } else {
      const sx = -0.34 * visH * camera.aspect * (1 - intro);
      pos.addScaledVector(right, sx);
      tgt.addScaledVector(right, sx);
    }
    camera.position.copy(pos);
    camera.up.copy(up);
    camera.lookAt(tgt);
    camera.rotateZ(Math.sin(Math.PI * f) * 0.035);

    frames.forEach((m, i) => {
      m.emissiveIntensity = 0.55 * clamp(1 - Math.abs(cur - i) * 1.6);
    });
    const idx = Math.round(cur);
    if (idx !== lastIdx) {
      lastIdx = idx;
      cfg.onIndex?.(idx);
    }
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  };
  const start = () => {
    if (!raf) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  };
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) start();
  }, { rootMargin: '10% 0px' });
  io.observe(stage);
  start();

  return {
    /** Fait défiler jusqu'à la photo i. */
    jumpTo(i: number) {
      const range = track.offsetHeight - innerHeight;
      const p = 0.1 + 0.8 * ((i + HOLD / 2 + 0.05) / (N - 1));
      const top = track.getBoundingClientRect().top + scrollY;
      scrollTo({ top: top + range * Math.min(0.99, p), behavior: 'smooth' });
    },
    dispose() {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      frameGeo.dispose();
      photoGeo.dispose();
      ribbon.geometry.dispose();
      textures.forEach((t) => t.dispose());
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
