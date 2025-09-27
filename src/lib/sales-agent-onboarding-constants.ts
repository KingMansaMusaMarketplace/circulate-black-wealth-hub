import { Target, FileText, GraduationCap, Link2, DollarSign } from 'lucide-react';

export const SALES_AGENT_ONBOARDING_STEPS = [
  {
    title: "Welcome to the Sales Agent Program",
    description: "Join our exclusive sales agent program and start earning commissions by referring new customers and businesses to Mansa Musa Marketplace.",
    illustration: Target,
    features: [
      "Earn up to 25% commission on referrals",
      "Access to exclusive marketing materials",
      "Real-time dashboard to track your earnings",
      "Monthly payout system"
    ],
    action: {
      text: "Learn More",
      href: "/sales-agent"
    }
  },
  {
    title: "Complete Your Application",
    description: "Fill out your sales agent application with your personal information and business experience to get started.",
    illustration: FileText,
    features: [
      "Simple application process",
      "Share your business background",
      "Explain why you want to join",
      "Provide marketing ideas"
    ]
  },
  {
    title: "Pass the Qualification Test",
    description: "Take our quick qualification test to demonstrate your knowledge of our platform and sales processes.",
    illustration: GraduationCap,
    features: [
      "Multiple choice questions",
      "Covers platform knowledge",
      "Sales best practices",
      "Instant results"
    ]
  },
  {
    title: "Get Your Referral Code",
    description: "Once approved, you'll receive your unique referral code to start sharing with potential customers and businesses.",
    illustration: Link2,
    features: [
      "Unique tracking code",
      "Custom referral links",
      "QR code for easy sharing",
      "Social media ready"
    ]
  },
  {
    title: "Start Earning Commissions",
    description: "Begin referring customers and businesses to start earning commissions. Track your progress in your personalized dashboard.",
    illustration: DollarSign,
    features: [
      "Real-time earnings tracking",
      "Monthly commission payouts",
      "Performance analytics",
      "Referral history"
    ]
  }
];

export const SALES_AGENT_ONBOARDING_STORAGE_KEY = 'sales-agent-onboarding-completed';