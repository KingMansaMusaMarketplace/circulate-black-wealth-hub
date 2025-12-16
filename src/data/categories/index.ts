
import { BusinessCategory } from './types';
import { legalCategories } from './legal';
import { medicalCategories } from './medical';
import { technologyCategories } from './technology';
import { businessCategories as businessServiceCategories } from './business';
import { retailCategories } from './retail';
import { foodCategories } from './food';
import { beautyCategories } from './beauty';
import { serviceCategories } from './services';
import { serviceProviderCategories } from './service-providers';
import { educationCategories } from './education';
import { fitnessCategories } from './fitness';
import { entertainmentCategories } from './entertainment';
import { otherCategories } from './other';

// Combine all categories into a single array
export const businessCategories: BusinessCategory[] = [
  ...legalCategories,
  ...medicalCategories,
  ...technologyCategories,
  ...businessServiceCategories,
  ...retailCategories,
  ...foodCategories,
  ...beautyCategories,
  ...serviceCategories,
  ...serviceProviderCategories,
  ...educationCategories,
  ...fitnessCategories,
  ...entertainmentCategories,
  ...otherCategories
];

// Re-export types and utility functions
export type { BusinessCategory } from './types';
export { getCategoryById, getCategoryOptions } from './types';

// Export individual category arrays for specific use cases
export {
  legalCategories,
  medicalCategories,
  technologyCategories,
  businessServiceCategories,
  retailCategories,
  foodCategories,
  beautyCategories,
  serviceCategories,
  serviceProviderCategories,
  educationCategories,
  fitnessCategories,
  entertainmentCategories,
  otherCategories
};
