
import { BusinessCategory } from './types';

export const legalCategories: BusinessCategory[] = [
  {
    id: 'legal-services',
    name: 'Legal Services',
    description: 'Legal consultation and representation',
    icon: '⚖️',
    subcategories: [
      'Personal Injury Law',
      'Criminal Defense',
      'Family Law',
      'Business Law',
      'Real Estate Law',
      'Immigration Law',
      'Civil Rights Law',
      'Employment Law',
      'Bankruptcy Law',
      'Estate Planning',
      'Bail Bonds'
    ]
  },
  {
    id: 'bail-bonds',
    name: 'Bail Bonds',
    description: 'Bail bond services and legal assistance',
    icon: '🔗'
  },
  {
    id: 'notary-services',
    name: 'Notary Services',
    description: 'Document notarization and legal documentation',
    icon: '📋'
  },
  {
    id: 'paralegal-services',
    name: 'Paralegal Services',
    description: 'Legal support and document preparation',
    icon: '📝'
  }
];
