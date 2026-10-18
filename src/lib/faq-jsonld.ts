// Paires Question/Réponse → nœud FAQPage du @graph de la page (assemblé par Layout).
import type { FaqItem } from '../data/home';
import type { JsonLdNode } from './jsonld';
import { absoluteUrl } from './url';

export const faqJsonLd = (path: string, items: FaqItem[]): JsonLdNode => ({
  '@type': 'FAQPage',
  '@id': `${absoluteUrl(path)}#faq`,
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.reponse },
  })),
});
