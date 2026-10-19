// Visite salle par salle : une seule observation des étapes, partagée par le rail et le plan.
// Les étapes sont lues dans les liens `a[data-etape-link]` (ordre du DOM = ordre de la visite).
type Listener = (currentId: string | null) => void;

const LINKS = 'a[data-etape-link]';
const listeners = new Set<Listener>();
let started = false;

export const etapeIds = () => [
  ...new Set([...document.querySelectorAll<HTMLAnchorElement>(LINKS)].map((a) => a.hash.slice(1))),
];

function start() {
  if (started) return;
  started = true;
  const ids = etapeIds();
  const visible = new Set<string>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id));
      const current = [...ids].reverse().find((id) => visible.has(id)) ?? null;
      listeners.forEach((fn) => fn(current));
    },
    { rootMargin: '-50% 0px -50% 0px' },
  );
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) io.observe(el);
  });
}

/** Appelle `fn` avec l'id de l'étape sous la ligne médiane de l'écran (null hors des étapes). */
export function watchEtapes(fn: Listener) {
  if (!('IntersectionObserver' in window)) return;
  listeners.add(fn);
  start();
}

function mark(root: ParentNode, id: string | null) {
  for (const a of root.querySelectorAll<HTMLAnchorElement>(LINKS)) {
    if (id && a.hash === `#${id}`) a.setAttribute('aria-current', 'location');
    else a.removeAttribute('aria-current');
  }
}

export function initRail() {
  const rail = document.querySelector<HTMLElement>('[data-rail]');
  if (!rail) return;
  const label = rail.querySelector<HTMLElement>('[data-rail-label]');
  const prev = rail.querySelector<HTMLAnchorElement>('[data-rail-prev]');
  const next = rail.querySelector<HTMLAnchorElement>('[data-rail-next]');
  const ids = etapeIds();

  const setArrow = (a: HTMLAnchorElement | null, id: string | undefined) => {
    if (!a) return;
    if (id) a.href = `/#${id}`;
    else a.removeAttribute('href');
    a.setAttribute('aria-disabled', String(!id));
    if (!id) a.setAttribute('role', 'link');
  };

  watchEtapes((id) => {
    mark(rail, id);
    const i = id ? ids.indexOf(id) : -1;
    const current = id ? rail.querySelector<HTMLAnchorElement>(`${LINKS}[href$="#${id}"]`) : null;
    if (label) label.textContent = current?.dataset.label ?? '';
    setArrow(prev, i > 0 ? ids[i - 1] : undefined);
    setArrow(next, ids[i + 1]);
  });
}

export function initPlan() {
  const toggle = document.querySelector<HTMLButtonElement>('[data-plan-toggle]');
  const dialog = document.querySelector<HTMLDialogElement>('[data-plan-overlay]');
  if (!toggle || !dialog) return;
  let restoreFocus = true;
  let target: HTMLElement | null = null;

  toggle.addEventListener('click', () => {
    restoreFocus = true;
    dialog.showModal();
    toggle.setAttribute('aria-expanded', 'true');
    (dialog.querySelector<HTMLElement>('[aria-current]') ?? dialog.querySelector<HTMLElement>('[data-plan-close]'))?.focus();
  });

  dialog.querySelector('[data-plan-close]')?.addEventListener('click', () => dialog.close());

  dialog.addEventListener('click', (e) => {
    const link = (e.target as Element).closest<HTMLAnchorElement>('a[href]');
    if (!link) return;
    restoreFocus = false;
    target = link.hash ? document.getElementById(decodeURIComponent(link.hash.slice(1))) : null;
    if (target && !target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
      target.style.outline = 'none';
    }
    dialog.close();
  });

  dialog.addEventListener('close', () => {
    toggle.setAttribute('aria-expanded', 'false');
    if (restoreFocus) toggle.focus();
    else target?.focus({ preventScroll: true });
    target = null;
  });

  watchEtapes((id) => mark(dialog, id));
}

/** Parallaxe souris : écrit --mx / --my (-1 à 1) sur :root. Pointeur fin et mouvement autorisé seulement. */
export function initParallax() {
  const fine = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  if (!fine.matches) return;
  const root = document.documentElement;
  let x = 0;
  let y = 0;
  let frame = 0;
  addEventListener(
    'pointermove',
    (e) => {
      x = (e.clientX / innerWidth) * 2 - 1;
      y = (e.clientY / innerHeight) * 2 - 1;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        root.style.setProperty('--mx', x.toFixed(3));
        root.style.setProperty('--my', y.toFixed(3));
      });
    },
    { passive: true },
  );
}
