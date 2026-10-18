export interface NavLink {
  label: string;
  href: string;
}

const links: NavLink[] = [
  { label: 'Méthode', href: '/#methode' },
  { label: 'À propos', href: '/#apropos' },
];

export const navigation = {
  links,
  cta: { label: 'Prendre rendez-vous', href: '/#rendez-vous' },
} as const;
