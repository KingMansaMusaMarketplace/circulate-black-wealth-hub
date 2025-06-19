
import { Course } from './CourseCard';
import { Resource } from './ResourceCard';
import { CreditCard, TrendingUp, Briefcase, Home, PiggyBank, DollarSign, FileText, CheckCircle, BookOpen } from 'lucide-react';
import React from 'react';

export const courses: Course[] = [
  {
    id: '1',
    title: 'Building Credit and Managing Debt',
    description: 'Learn strategies for building excellent credit and managing debt effectively for business and personal growth.',
    modules: 6,
    duration: '4 hours',
    level: 'Beginner',
    progress: 75,
    enrolled: true,
    icon: React.createElement(CreditCard, { className: "h-6 w-6" }),
    color: 'bg-blue-500'
  },
  {
    id: '2',
    title: 'Investment Fundamentals for Black Wealth Building',
    description: 'Master the basics of investing with focus on building long-term wealth in the Black community.',
    modules: 8,
    duration: '6 hours',
    level: 'Intermediate',
    progress: 25,
    enrolled: true,
    icon: React.createElement(TrendingUp, { className: "h-6 w-6" }),
    color: 'bg-green-500'
  },
  {
    id: '3',
    title: 'Business Financial Management',
    description: 'Essential financial skills for Black entrepreneurs including cash flow, budgeting, and financial planning.',
    modules: 10,
    duration: '8 hours',
    level: 'Advanced',
    progress: 0,
    enrolled: false,
    icon: React.createElement(Briefcase, { className: "h-6 w-6" }),
    color: 'bg-purple-500'
  },
  {
    id: '4',
    title: 'Real Estate Investment for Beginners',
    description: 'Learn how to build wealth through real estate investment in Black communities.',
    modules: 7,
    duration: '5 hours',
    level: 'Beginner',
    progress: 0,
    enrolled: false,
    icon: React.createElement(Home, { className: "h-6 w-6" }),
    color: 'bg-orange-500'
  },
  {
    id: '5',
    title: 'Emergency Fund and Savings Strategies',
    description: 'Build financial security with proven savings strategies and emergency fund planning.',
    modules: 4,
    duration: '3 hours',
    level: 'Beginner',
    progress: 100,
    enrolled: true,
    icon: React.createElement(PiggyBank, { className: "h-6 w-6" }),
    color: 'bg-pink-500'
  }
];

export const resources: Resource[] = [
  {
    id: '1',
    title: 'Personal Budget Calculator',
    type: 'calculator',
    description: 'Interactive tool to create and manage your monthly budget with Black wealth-building focus.',
    downloadUrl: '/resources/budget-calculator',
    icon: React.createElement(DollarSign, { className: "h-5 w-5" })
  },
  {
    id: '2',
    title: 'Business Financial Plan Template',
    type: 'template',
    description: 'Comprehensive template for creating a financial plan for your Black-owned business.',
    downloadUrl: '/resources/business-financial-plan',
    icon: React.createElement(FileText, { className: "h-5 w-5" })
  },
  {
    id: '3',
    title: 'Credit Score Improvement Checklist',
    type: 'checklist',
    description: 'Step-by-step checklist to improve your credit score and access better financing.',
    downloadUrl: '/resources/credit-improvement-checklist',
    icon: React.createElement(CheckCircle, { className: "h-5 w-5" })
  },
  {
    id: '4',
    title: 'Investment Portfolio Diversification Guide',
    type: 'article',
    description: 'Learn how to diversify your investment portfolio with focus on Black-owned assets.',
    downloadUrl: '/resources/investment-diversification',
    icon: React.createElement(BookOpen, { className: "h-5 w-5" })
  }
];
