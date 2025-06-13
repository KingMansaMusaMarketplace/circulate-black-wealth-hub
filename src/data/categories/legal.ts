
import { BusinessCategory } from './types';

export const legalCategories: BusinessCategory[] = [
  {
    id: 'legal',
    name: 'Legal Services',
    description: 'Law firms, attorneys, and legal consultation',
    icon: '⚖️',
    subcategories: [
      'Personal Injury',
      'Family Law',
      'Criminal Defense',
      'Business Law',
      'Real Estate Law',
      'Immigration Law',
      'Estate Planning',
      'Employment Law'
    ]
  },
  {
    id: 'attorneys-general',
    name: 'Attorneys & General Law',
    description: 'General practice attorneys and legal consultation',
    icon: '⚖️'
  },
  {
    id: 'personal-injury-lawyers',
    name: 'Personal Injury Lawyers',
    description: 'Attorneys specializing in personal injury cases',
    icon: '🩹'
  },
  {
    id: 'criminal-defense-attorneys',
    name: 'Criminal Defense Attorneys',
    description: 'Legal defense for criminal cases',
    icon: '🛡️'
  },
  {
    id: 'family-lawyers',
    name: 'Family Lawyers',
    description: 'Divorce, custody, and family law attorneys',
    icon: '👨‍👩‍👧‍👦'
  },
  {
    id: 'business-attorneys',
    name: 'Business Attorneys',
    description: 'Corporate and business law specialists',
    icon: '🏢'
  },
  {
    id: 'estate-planning-lawyers',
    name: 'Estate Planning Lawyers',
    description: 'Wills, trusts, and estate planning attorneys',
    icon: '📜'
  },
  {
    id: 'immigration-attorneys',
    name: 'Immigration Attorneys',
    description: 'Immigration and citizenship legal services',
    icon: '🌍'
  },
  {
    id: 'tax-attorneys',
    name: 'Tax Attorneys',
    description: 'Tax law and IRS representation',
    icon: '📊'
  },
  {
    id: 'employment-lawyers',
    name: 'Employment Lawyers',
    description: 'Workplace rights and employment law',
    icon: '💼'
  },
  {
    id: 'real-estate-attorneys',
    name: 'Real Estate Attorneys',
    description: 'Property law and real estate transactions',
    icon: '🏠'
  },
  {
    id: 'bankruptcy-lawyers',
    name: 'Bankruptcy Lawyers',
    description: 'Debt relief and bankruptcy proceedings',
    icon: '💸'
  },
  {
    id: 'intellectual-property-lawyers',
    name: 'Intellectual Property Lawyers',
    description: 'Patents, trademarks, and IP protection',
    icon: '💡'
  }
];
