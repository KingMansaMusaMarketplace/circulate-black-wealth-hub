
import { Business } from '@/types/business';
import { restaurantBusinesses } from './restaurants';
import { beautyAndWellnessBusinesses } from './beautyAndWellness';
import { fashionAndClothingBusinesses } from './fashionAndClothing';
import { technologyBusinesses } from './technology';
import { retailBusinesses } from './retail';
import { financialServicesBusinesses } from './financialServices';
import { healthServicesBusinesses } from './healthServices';
import { agricultureBusinesses } from './agriculture';
import { artAndEntertainmentBusinesses } from './artAndEntertainment';
import { legalServicesBusinesses } from './legalServices';
import { constructionBusinesses } from './construction';
import { realEstateBusinesses } from './realEstate';
import { fitnessBusinesses } from './fitness';
import { educationBusinesses } from './education';

// Export all business categories
export const allBusinesses: Business[] = [
  ...restaurantBusinesses,
  ...beautyAndWellnessBusinesses,
  ...fashionAndClothingBusinesses,
  ...technologyBusinesses,
  ...retailBusinesses,
  ...financialServicesBusinesses,
  ...healthServicesBusinesses,
  ...agricultureBusinesses,
  ...artAndEntertainmentBusinesses,
  ...legalServicesBusinesses,
  ...constructionBusinesses,
  ...realEstateBusinesses,
  ...fitnessBusinesses,
  ...educationBusinesses
];

// Export individual categories for easier filtering
export {
  restaurantBusinesses,
  beautyAndWellnessBusinesses,
  fashionAndClothingBusinesses,
  technologyBusinesses,
  retailBusinesses,
  financialServicesBusinesses,
  healthServicesBusinesses,
  agricultureBusinesses,
  artAndEntertainmentBusinesses,
  legalServicesBusinesses,
  constructionBusinesses,
  realEstateBusinesses,
  fitnessBusinesses,
  educationBusinesses
};
