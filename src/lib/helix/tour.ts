// Hélice : les photos du hero sont posées en colimaçon (un escalier de cadres) ; en défilant,
// la caméra descend en spirale et s'arrête sur chaque image. Aucune dépendance autre que Three.js.
import {
  ACESFilmicToneMapping,
  BoxGeometry,
  CatmullRomCurve3,
  Color,
  Fog,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PMREMGenerator,
  PerspectiveCamera,
  PlaneGeometry,
  SRGBColorSpace,
  Scene,
  Texture,
  TextureLoader,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
} from 'three';
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
  const { canvas, stage, track } = cfg;
  const narrow = stage.clientWidth < 700;
  const images = narrow ? cfg.images.map((s) => s.replace('-1600.', '-800.')) : cfg.images;
  const N = images.length;
  const yieldToMain = () => new Promise<void>((r) => setTimeout(r, 0));

  let disposed = false;
  let raf = 0;
  let visible = true;
  let ready = false;
  let width = 1;
  let height = 1;
  let dist = 8;
  let mobile = false;
  let trackTop = 0;
  let trackH = 1;
  let viewH = 1;

  const camera = new PerspectiveCamera(FOV, 1, 0.1, 140);
  const fog = new Fog(0x1c1b1b, 12, 40);
  const scene = new Scene();
  scene.fog = fog;
  const group = new Group();
  scene.add(group);

  let renderer: WebGLRenderer | undefined;
  let pmrem: PMREMGenerator | undefined;
  let envTex: Texture | undefined;
  let ribbon: Mesh | undefined;
  let frameGeo: BoxGeometry | undefined;
  let photoGeo: PlaneGeometry | undefined;
  const frames: MeshStandardMaterial[] = [];
  const textures: Texture[] = [];

  const applySize = () => {
    if (!renderer) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio, width < 700 ? 1.25 : 2));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    mobile = width < 900;
    dist = Math.max(7.4, (W * 1.15) / (2 * Math.tan((FOV * Math.PI) / 360) * camera.aspect));
    fog.near = dist + 3;
    fog.far = dist + 30;
  };
  // Lectures de layout groupées ici (jamais dans la boucle de rendu) : ResizeObserver fournit les tailles.
  const measure = () => {
    trackTop = track.getBoundingClientRect().top + scrollY;
    trackH = track.offsetHeight;
    viewH = innerHeight;
  };
  const ro = new ResizeObserver(([e]) => {
    width = Math.max(1, Math.round(e.contentRect.width));
    height = Math.max(1, Math.round(e.contentRect.height));
    measure();
    applySize();
    request();
  });
  ro.observe(stage);

  const progress = () => clamp((scrollY - trackTop) / Math.max(1, trackH - viewH));
  const idxFor = (p: number) => {
    const travel = clamp((p - 0.1) / 0.8) * (N - 1);
    const fl = Math.floor(travel);
    const fr = travel - fl;
    return Math.min(N - 1, fl + smooth(HOLD, 1, fr));
  };

  const up = new Vector3(0, 1, 0);
  const pos = new Vector3();
  const tgt = new Vector3();
  const right = new Vector3();
  let cur = 0;
  let curP = 0;
  let lastIdx = -1;
  let last = performance.now();

  const frame = (now: number) => {
    raf = 0;
    if (disposed || !visible || !ready || !renderer) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const p = progress();
    curP += (p - curP) * (1 - Math.exp(-9 * dt));
    const u = idxFor(curP);
    cur += (u - cur) * (1 - Math.exp(-10 * dt));
    const settled = Math.abs(p - curP) < 1e-4 && Math.abs(u - cur) < 1e-4;
    if (settled) {
      curP = p;
      cur = u;
    }
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
    if (!settled) raf = requestAnimationFrame(frame);
  };
  // Rendu à la demande : une image n'est produite que si le défilement, une texture ou une taille a changé.
  function request() {
    if (raf || disposed || !visible || !ready) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  const onScroll = () => request();
  addEventListener('scroll', onScroll, { passive: true });
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) request();
  }, { rootMargin: '10% 0px' });
  io.observe(stage);

  // Initialisation découpée en tâches courtes : moteur, environnement, géométrie, puis textures.
  const build = async () => {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setClearColor(0x000000, 0);
    applySize();
    await yieldToMain();
    if (disposed) return;

    pmrem = new PMREMGenerator(renderer);
    envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.7;
    await yieldToMain();
    if (disposed) return;

    // Ruban central : la colonne vertébrale terracotta de la spirale.
    const pts: Vector3[] = [];
    for (let a = -0.9; a <= (N - 1) * STEP + 1; a += 0.04) {
      pts.push(new Vector3(Math.sin(a) * 2.3, -(a / STEP) * PITCH, Math.cos(a) * 2.3));
    }
    ribbon = new Mesh(
      new TubeGeometry(new CatmullRomCurve3(pts), pts.length * 3, 0.16, 10, false),
      new MeshStandardMaterial({ color: 0xb24824, metalness: 0.85, roughness: 0.3 }),
    );
    group.add(ribbon);

    frameGeo = new BoxGeometry(W + 0.2, H + 0.2, 0.16);
    photoGeo = new PlaneGeometry(W, H);
    const loader = new TextureLoader();
    const slots: ((done: () => void) => void)[] = [];
    images.forEach((src, i) => {
      const a = i * STEP;
      const card = new Group();
      card.position.set(Math.sin(a) * R, -i * PITCH, Math.cos(a) * R);
      card.rotation.y = a;
      const fm = new MeshStandardMaterial({ color: 0xd9d6d1, metalness: 0.7, roughness: 0.32, emissive: new Color(0xe8946f), emissiveIntensity: 0 });
      frames.push(fm);
      card.add(new Mesh(frameGeo, fm));
      const pm = new MeshBasicMaterial({ color: 0x2e2e2e, toneMapped: false });
      const photo = new Mesh(photoGeo, pm);
      photo.position.z = 0.085;
      card.add(photo);
      group.add(card);
      slots.push((done) => {
        loader.load(
          src,
          (t) => {
            if (disposed) return t.dispose();
            t.colorSpace = SRGBColorSpace;
            t.anisotropy = Math.min(4, renderer!.capabilities.getMaxAnisotropy());
            pm.map = t;
            pm.color.set(0xffffff);
            pm.needsUpdate = true;
            textures.push(t);
            request();
            done();
          },
          undefined,
          done,
        );
      });
    });
    await renderer.compileAsync(scene, camera);
    if (disposed) return;

    ready = true;
    request();
    // Échelonné : la 1re image d'abord, les autres une à une ensuite.
    const loadFrom = (k: number) => {
      if (!disposed && k < slots.length) slots[k](() => loadFrom(k + 1));
    };
    loadFrom(0);
  };
  build();

  return {
    /** Fait défiler jusqu'à la photo i. */
    jumpTo(i: number) {
      measure();
      const range = trackH - viewH;
      const p = 0.1 + 0.8 * ((i + HOLD / 2 + 0.05) / (N - 1));
      scrollTo({ top: trackTop + range * Math.min(0.99, p), behavior: 'smooth' });
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      removeEventListener('scroll', onScroll);
      io.disconnect();
      ro.disconnect();
      frameGeo?.dispose();
      photoGeo?.dispose();
      ribbon?.geometry.dispose();
      textures.forEach((t) => t.dispose());
      envTex?.dispose();
      pmrem?.dispose();
      renderer?.dispose();
    },
  };
}
