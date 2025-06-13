
import { BusinessCategory } from './types';
import { legalCategories } from './legal';
import { medicalCategories } from './medical';
import { technologyCategories } from './technology';
import { businessCategories } from './business';
import { retailCategories } from './retail';
import { foodCategories } from './food';
import { beautyCategories } from './beauty';
import { serviceCategories } from './services';
import { educationCategories } from './education';
import { fitnessCategories } from './fitness';
import { entertainmentCategories } from './entertainment';
import { otherCategories } from './other';

// Combine all categories into a single array
export const businessCategories: BusinessCategory[] = [
  ...legalCategories,
  ...medicalCategories,
  ...technologyCategories,
  ...businessCategories,
  ...retailCategories,
  ...foodCategories,
  ...beautyCategories,
  ...serviceCategories,
  ...educationCategories,
  ...fitnessCategories,
  ...entertainmentCategories,
  ...otherCategories
];

// Re-export types and utility functions
export { BusinessCategory, getCategoryById, getCategoryOptions } from './types';

// Export individual category arrays for specific use cases
export {
  legalCategories,
  medicalCategories,
  technologyCategories,
  retailCategories,
  foodCategories,
  beautyCategories,
  serviceCategories,
  educationCategories,
  fitnessCategories,
  entertainmentCategories,
  otherCategories
};
