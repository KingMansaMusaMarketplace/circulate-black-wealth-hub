// Comprehensive User Guide Content for 1325.AI Platform
// This file contains all documentation organized by user type and feature

export interface GuideSection {
  id: string;
  title: string;
  icon: string;
  description: string;
  content: GuideContent[];
}

export interface GuideContent {
  id: string;
  title: string;
  summary: string;
  details: string;
  steps?: string[];
  tips?: string[];
  relatedLinks?: { label: string; path: string }[];
}

// ============================================
// CORE FEATURES - For All Users
// ============================================

export const CORE_FEATURES: GuideSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: 'Rocket',
    description: 'Everything you need to begin your journey with 1325.AI',
    content: [
      {
        id: 'create-account',
        title: 'Creating Your Account',
        summary: 'Sign up and set up your profile in minutes',
        details: 'Join the 1325.AI community by creating your free account. You can sign up as a Consumer, Business Owner, Partner, or Sales Agent depending on how you want to participate in our circular economy ecosystem.',
        steps: [
          'Visit the homepage and click "Join FREE Today" or "Sign Up"',
          'Enter your email address and create a secure password',
          'Select your account type: Consumer, Business Owner, Partner, or Sales Agent',
          'Complete your profile with relevant information',
          'Verify your email address to activate your account',
          'Start exploring the platform!'
        ],
        tips: [
          'Use a strong password with a mix of letters, numbers, and symbols',
          'Add a profile photo to build trust in the community',
          'Complete all profile fields to unlock all platform features'
        ],
        relatedLinks: [
          { label: 'Sign Up Page', path: '/signup' },
          { label: 'Login Page', path: '/login' }
        ]
      },
      {
        id: 'navigate-platform',
        title: 'Navigating the Platform',
        summary: 'Learn your way around the 1325.AI interface',
        details: 'The 1325.AI platform is designed for intuitive navigation. The main navigation bar provides quick access to all major features, while contextual menus appear based on your user type and current activity.',
        steps: [
          'Use the top navigation bar to access Directory, Services, Community, and more',
          'The Directory link takes you to browse all Black-owned businesses',
          'Services dropdown includes Karma Dashboard, Susu Circles, and other tools',
          'Access your profile and settings through the user menu (top right)',
          'Use the global search (Cmd/Ctrl + K) to find anything quickly',
          'Mobile users can access all features through the hamburger menu'
        ],
        tips: [
          'Keyboard shortcut Cmd/Ctrl + K opens global search instantly',
          'The Partner Program link in gold leads to our referral opportunity',
          'Look for the AI Assistant (Kayla) icon for voice-enabled help'
        ]
      },
      {
        id: 'account-types',
        title: 'Understanding Account Types',
        summary: 'Different ways to participate in the ecosystem',
        details: 'The 1325.AI platform supports multiple user types, each with unique features and benefits designed to maximize your participation in the circular economy.',
        steps: [
          'Consumer: Browse businesses, earn loyalty points, build your Karma score',
          'Business Owner: List your business, manage customers, track analytics',
          'Partner: Refer businesses, earn commissions, access marketing tools',
          'Sales Agent (Ambassador): Recruit businesses, earn tier-based commissions',
          'Corporate Sponsor: Support the mission, gain visibility, access impact data'
        ],
        tips: [
          'You can upgrade or change your account type at any time',
          'Founding Members get permanent special benefits',
          'Each account type has its own personalized dashboard'
        ]
      }
    ]
  },
  {
    id: 'business-directory',
    title: 'Business Directory',
    icon: 'Building2',
    description: 'Discover and support Black-owned businesses in your community',
    content: [
      {
        id: 'browse-businesses',
        title: 'Browsing Businesses',
        summary: 'Find Black-owned businesses near you',
        details: 'The business directory is the heart of 1325.AI, featuring verified Black-owned businesses across numerous categories. Use powerful search and filter tools to discover exactly what you need.',
        steps: [
          'Navigate to Directory from the main navigation',
          'Use the search bar to find businesses by name or keyword',
          'Filter by category (Restaurants, Retail, Services, etc.)',
          'Use "Near Me" to find businesses in your area',
          'View businesses in grid or list mode',
          'Toggle the map view to see business locations'
        ],
        tips: [
          'Verified businesses display a checkmark badge',
          'Star ratings come from real customer reviews',
          'Save favorite businesses to your profile for quick access'
        ],
        relatedLinks: [
          { label: 'Business Directory', path: '/directory' }
        ]
      },
      {
        id: 'business-profiles',
        title: 'Business Profiles',
        summary: 'Detailed information about each business',
        details: 'Each business profile contains comprehensive information including photos, services, hours of operation, contact details, reviews, and any current promotions or discounts.',
        steps: [
          'Click on any business card to view their full profile',
          'Browse photos and descriptions in the gallery section',
          'Check operating hours and location information',
          'Read customer reviews and ratings',
          'View available discounts and loyalty rewards',
          'Contact the business directly or book services'
        ],
        tips: [
          'Leave reviews after visiting to help other users',
          'Check for exclusive discounts for platform members',
          'Use the QR scan feature to earn points at checkout'
        ]
      },
      {
        id: 'search-filters',
        title: 'Search & Filters',
        summary: 'Advanced search capabilities',
        details: 'Our advanced search and filtering system helps you find the perfect business for your needs. Combine multiple filters to narrow down results.',
        steps: [
          'Enter keywords in the search bar for basic search',
          'Click the filter icon to access advanced filters',
          'Filter by category to browse specific business types',
          'Set minimum rating to see only top-rated businesses',
          'Filter by discount availability to find deals',
          'Use location filters to set your preferred distance'
        ],
        tips: [
          'Combine multiple filters for precise results',
          'Clear all filters with one click to start fresh',
          'Results update in real-time as you apply filters'
        ]
      }
    ]
  },
  {
    id: 'qr-loyalty',
    title: 'QR Codes & Loyalty',
    icon: 'QrCode',
    description: 'Earn points and rewards when you shop',
    content: [
      {
        id: 'scan-qr-codes',
        title: 'Scanning QR Codes',
        summary: 'Earn points at participating businesses',
        details: 'Our QR code system makes it easy to earn loyalty points at participating businesses. Simply scan the business QR code at checkout to automatically receive your points and any available discounts.',
        steps: [
          'Look for the QR code at participating business checkout areas',
          'Open the QR Scanner from the main navigation or app menu',
          'Allow camera access when prompted',
          'Point your camera at the QR code',
          'Confirm the transaction when prompted',
          'Watch your points balance grow!'
        ],
        tips: [
          'Ensure good lighting for faster scanning',
          'Points are credited instantly to your account',
          'Some businesses offer bonus points during special promotions'
        ],
        relatedLinks: [
          { label: 'QR Scanner', path: '/qr-scanner' }
        ]
      },
      {
        id: 'loyalty-points',
        title: 'Understanding Loyalty Points',
        summary: 'How the points system works',
        details: 'Loyalty points are earned every time you make a purchase at a participating business. These points can be redeemed for discounts, rewards, and special offers.',
        steps: [
          'Earn points by scanning QR codes at checkout',
          'Track your balance in the Loyalty section or dashboard',
          'View your transaction history for detailed records',
          'Points accumulate across all participating businesses',
          'Some actions like reviews also earn bonus points',
          'Points never expire for active accounts'
        ],
        tips: [
          'Higher-tier businesses may offer more points per dollar',
          'Look for double-points promotions',
          'Refer friends to earn bonus points'
        ],
        relatedLinks: [
          { label: 'Loyalty Dashboard', path: '/loyalty' }
        ]
      },
      {
        id: 'redeem-rewards',
        title: 'Redeeming Rewards',
        summary: 'Turn points into discounts and perks',
        details: 'Your earned loyalty points can be redeemed for various rewards including discounts at businesses, special merchandise, or converted into wallet balance for future purchases.',
        steps: [
          'Navigate to the Rewards page from your dashboard',
          'Browse available rewards and their point requirements',
          'Select a reward you want to redeem',
          'Confirm your redemption',
          'Use your reward code at checkout or online',
          'Track all redeemed rewards in your history'
        ],
        tips: [
          'Some rewards are time-limited, so check expiration dates',
          'Higher value rewards offer better points-to-value ratios',
          'Combine rewards with existing discounts for maximum savings'
        ]
      }
    ]
  }
];

// ============================================
// FINANCIAL FEATURES - Susu & Karma
// ============================================

export const FINANCIAL_FEATURES: GuideSection[] = [
  {
    id: 'karma-system',
    title: 'Economic Karma System',
    icon: 'Sparkles',
    description: 'Track and grow your community economic impact',
    content: [
      {
        id: 'understanding-karma',
        title: 'What is Economic Karma?',
        summary: 'Your community impact score explained',
        details: 'Economic Karma is a unique scoring system that measures your contribution to the circular economy. Higher Karma scores unlock better benefits, discounts, and community recognition.',
        steps: [
          'Your Karma score starts at a base level when you join',
          'Score increases when you shop at Black-owned businesses',
          'Additional points for leaving reviews and referrals',
          'Score reflects your cumulative community impact',
          'Higher scores unlock premium benefits and recognition',
          'View your score and history on the Karma Dashboard'
        ],
        tips: [
          'Consistent activity maintains and grows your score',
          'A 5% monthly decay applies to encourage ongoing engagement',
          'The minimum floor is 10 points - you never lose everything'
        ],
        relatedLinks: [
          { label: 'Karma Dashboard', path: '/karma' }
        ]
      },
      {
        id: 'earning-karma',
        title: 'Earning Karma Points',
        summary: 'Activities that boost your score',
        details: 'Multiple activities contribute to your Karma score. The more you engage with the community and support Black-owned businesses, the faster your score grows.',
        steps: [
          'Make purchases at participating businesses (primary method)',
          'Leave helpful reviews after your visits',
          'Refer new users to the platform',
          'Participate in community events and challenges',
          'Contribute to Susu Circles',
          'Engage with forum discussions'
        ],
        tips: [
          'Quality reviews earn more Karma than quick ratings',
          'Successful referrals provide significant bonus points',
          'Some seasonal events offer double Karma opportunities'
        ]
      },
      {
        id: 'karma-benefits',
        title: 'Karma Tier Benefits',
        summary: 'Unlock rewards as you level up',
        details: 'Your Karma score places you in different tiers, each with increasing benefits. As you grow your score, you unlock exclusive discounts, recognition, and community privileges.',
        steps: [
          'Bronze Tier (0-100): Basic member benefits and discounts',
          'Silver Tier (100-500): Enhanced discounts and early access',
          'Gold Tier (500-1000): Premium benefits and community recognition',
          'Platinum Tier (1000+): VIP status with maximum benefits',
          'Check your current tier on the Karma Dashboard',
          'View progress to next tier and required points'
        ],
        tips: [
          'Tier status is recalculated monthly',
          'Special badges display on your profile at higher tiers',
          'Top Karma earners appear on the community leaderboard'
        ]
      }
    ]
  },
  {
    id: 'susu-circles',
    title: 'Susu Circles',
    icon: 'Users',
    description: 'Community-based rotational savings groups',
    content: [
      {
        id: 'what-are-susu',
        title: 'Understanding Susu Circles',
        summary: 'Traditional savings groups, modernized',
        details: 'Susu Circles are a digital version of traditional West African rotating savings groups. Members contribute regularly, and each member receives the full pot on a rotating basis - a powerful tool for community wealth building.',
        steps: [
          'A group of trusted members forms a circle',
          'Each member contributes a fixed amount regularly (weekly/monthly)',
          'One member receives the entire pool each period',
          'Rotation continues until everyone has received a payout',
          'The cycle can repeat indefinitely',
          'Platform handles all tracking and fund management securely'
        ],
        tips: [
          'Start with trusted friends or family to build comfort',
          'Smaller circles complete faster but with smaller payouts',
          'All funds are held in secure escrow until payout'
        ],
        relatedLinks: [
          { label: 'Susu Circles', path: '/susu-circles' }
        ]
      },
      {
        id: 'join-create-susu',
        title: 'Joining or Creating a Circle',
        summary: 'Get started with Susu savings',
        details: 'You can either join an existing Susu Circle via an invitation link, or create your own circle and invite members. The platform handles all the complexity of tracking contributions and payouts.',
        steps: [
          'To join: Accept an invitation link from a circle organizer',
          'To create: Click "Create Circle" on the Susu Circles page',
          'Set contribution amount and frequency (weekly/biweekly/monthly)',
          'Define the circle size (number of members)',
          'Invite members using the generated invite link',
          'Circle begins when all positions are filled'
        ],
        tips: [
          'A 1.5% platform fee applies to each payout',
          'Circle organizers can set payout order or use random assignment',
          'Members are notified before each contribution is due'
        ]
      },
      {
        id: 'susu-escrow',
        title: 'Secure Escrow System',
        summary: 'How your money is protected',
        details: 'All Susu Circle funds are held in a secure, patent-protected escrow system. This ensures that every contribution is tracked and every payout is guaranteed.',
        steps: [
          'Contributions are held in secure escrow immediately',
          'View real-time escrow balance in your circle dashboard',
          'Funds are released automatically on payout day',
          'Complete transaction history is always available',
          'Platform guarantees payout to the designated member',
          'All transactions are protected and auditable'
        ],
        tips: [
          'Check the escrow dashboard for complete transparency',
          'Late contributions trigger automatic notifications',
          'The escrow system is protected under Patent 63/969,202'
        ]
      }
    ]
  },
  {
    id: 'wallet',
    title: 'Digital Wallet',
    icon: 'Wallet',
    description: 'Manage your platform earnings and payments',
    content: [
      {
        id: 'wallet-overview',
        title: 'Your Digital Wallet',
        summary: 'Central hub for your platform finances',
        details: 'The digital wallet is your central hub for all monetary transactions on the platform. View balances, receive payouts, and manage withdrawals all in one place.',
        steps: [
          'Access your wallet from the main navigation or dashboard',
          'View current balance and recent transactions',
          'See pending deposits and scheduled payouts',
          'Track earnings from referrals and commissions',
          'Manage withdrawal requests',
          'Set up your preferred payout method'
        ],
        tips: [
          'Keep your wallet linked to receive automatic payouts',
          'Set up notifications for balance changes',
          'Review transaction history regularly'
        ],
        relatedLinks: [
          { label: 'Wallet', path: '/wallet' }
        ]
      },
      {
        id: 'withdrawals',
        title: 'Withdrawing Funds',
        summary: 'Cash out your earnings',
        details: 'When you are ready to withdraw funds from your wallet, you can request a payout to your linked bank account or payment method. Withdrawals are processed according to our payout schedule.',
        steps: [
          'Navigate to Wallet > Withdraw',
          'Enter the amount you wish to withdraw',
          'Minimum withdrawal is $10',
          'A 2% processing fee applies to withdrawals',
          'Select your payout method',
          'Confirm the withdrawal request',
          'Funds typically arrive within 3-5 business days'
        ],
        tips: [
          'Larger withdrawals may require additional verification',
          'Set up direct deposit for automatic payouts',
          'Keep some balance for using wallet-pay at businesses'
        ]
      }
    ]
  }
];

// ============================================
// BUSINESS TOOLS - For Business Owners
// ============================================

export const BUSINESS_TOOLS: GuideSection[] = [
  {
    id: 'business-dashboard',
    title: 'Business Dashboard',
    icon: 'LayoutDashboard',
    description: 'Your command center for business management',
    content: [
      {
        id: 'dashboard-overview',
        title: 'Dashboard Overview',
        summary: 'Your business at a glance',
        details: 'The business dashboard provides a comprehensive overview of your business performance on the platform. Track key metrics, manage your profile, and engage with customers all from one central location.',
        steps: [
          'Access your dashboard after logging in as a business owner',
          'View key metrics: views, scans, revenue, reviews',
          'Monitor customer engagement trends over time',
          'See recent activity and notifications',
          'Quick access to all business management tools',
          'Track your verification status and subscription tier'
        ],
        tips: [
          'Check your dashboard daily to stay on top of activity',
          'Enable notifications for important events',
          'Compare current performance to previous periods'
        ],
        relatedLinks: [
          { label: 'Business Dashboard', path: '/business-dashboard' }
        ]
      },
      {
        id: 'qr-code-management',
        title: 'QR Code Management',
        summary: 'Set up and customize your business QR codes',
        details: 'Your business QR code is how customers earn loyalty points when shopping with you. Customize your QR code design, set point values, and download for printing.',
        steps: [
          'Navigate to QR Codes section in your dashboard',
          'Generate your unique business QR code',
          'Customize colors and add your logo',
          'Set the points value customers receive per scan',
          'Download in various formats for printing',
          'Display prominently at your checkout area'
        ],
        tips: [
          'Print QR codes at a minimum of 1.5 inches for reliable scanning',
          'Consider table tents, posters, and window clings',
          'Change point values during promotions to drive traffic'
        ]
      },
      {
        id: 'analytics',
        title: 'Analytics & Insights',
        summary: 'Understand your customers and performance',
        details: 'Detailed analytics help you understand customer behavior, peak hours, popular services, and revenue trends. Use these insights to optimize your business operations.',
        steps: [
          'View daily, weekly, and monthly performance reports',
          'Track customer visit patterns and frequency',
          'Analyze revenue trends and growth',
          'See which promotions drive the most engagement',
          'Monitor review scores and customer feedback',
          'Export reports for offline analysis'
        ],
        tips: [
          'Use peak hour data to optimize staffing',
          'Track which discount offers perform best',
          'Respond to reviews to boost engagement metrics'
        ]
      }
    ]
  },
  {
    id: 'verification',
    title: 'Business Verification',
    icon: 'BadgeCheck',
    description: 'Get verified and build trust with customers',
    content: [
      {
        id: 'verification-process',
        title: 'Verification Process',
        summary: 'Steps to become a verified business',
        details: 'Verified businesses receive a badge that increases customer trust, priority placement in search results, and access to premium features. The verification process confirms Black ownership of your business.',
        steps: [
          'Navigate to Verification in your business dashboard',
          'Upload required documentation:',
          '  - Business registration/LLC documents',
          '  - Photo ID of the owner',
          '  - Proof of 51%+ Black ownership',
          'Optionally upload additional supporting documents',
          'Submit your application for review',
          'Receive decision within 3-5 business days'
        ],
        tips: [
          'Ensure all documents are clear and legible',
          'Current documents (not expired) are required',
          'You can appeal if your initial application is declined'
        ]
      },
      {
        id: 'verification-benefits',
        title: 'Benefits of Verification',
        summary: 'What you get with verified status',
        details: 'Verification unlocks multiple benefits designed to help your business succeed on the platform and build customer trust.',
        steps: [
          'Verified badge displayed on your business profile',
          'Priority placement in search results',
          'Access to advanced analytics tools',
          'Eligibility for featured promotions',
          'Enhanced credibility with potential customers',
          'Ability to participate in B2B marketplace'
        ],
        tips: [
          'Verified businesses see 40% more engagement on average',
          'The badge appears in directory listings and profiles',
          'Verification is required for certain partnership programs'
        ]
      }
    ]
  },
  {
    id: 'bookings',
    title: 'Booking Management',
    icon: 'Calendar',
    description: 'Manage appointments and reservations',
    content: [
      {
        id: 'setup-bookings',
        title: 'Setting Up Bookings',
        summary: 'Enable online scheduling for your services',
        details: 'If your business offers services that require appointments (salons, consultations, etc.), you can enable the booking system to let customers schedule online.',
        steps: [
          'Go to Bookings in your business dashboard',
          'Enable booking feature for your business',
          'Set your available hours and days',
          'Define service types and durations',
          'Set any booking requirements or policies',
          'Customize confirmation and reminder messages'
        ],
        tips: [
          'Block off times for breaks and personal appointments',
          'Set buffer time between appointments for preparation',
          'Enable automated reminders to reduce no-shows'
        ]
      },
      {
        id: 'manage-appointments',
        title: 'Managing Appointments',
        summary: 'Handle bookings and customer scheduling',
        details: 'Once bookings are enabled, manage all appointments from your dashboard. View upcoming appointments, handle cancellations, and track your schedule.',
        steps: [
          'View all upcoming appointments in calendar view',
          'Click any appointment for details and customer info',
          'Confirm, reschedule, or cancel appointments',
          'Send messages to customers about their bookings',
          'Mark appointments as completed after service',
          'View booking history and analytics'
        ],
        tips: [
          'Customers receive automatic confirmations and reminders',
          'You can set cancellation policies to protect your time',
          'Track no-show rates to identify patterns'
        ]
      }
    ]
  }
];

// ============================================
// GROWTH PROGRAMS - Partners & Developers
// ============================================

export const GROWTH_PROGRAMS: GuideSection[] = [
  {
    id: 'partner-program',
    title: 'Partner Program',
    icon: 'Handshake',
    description: 'Earn commissions by referring businesses',
    content: [
      {
        id: 'partner-overview',
        title: 'Partner Program Overview',
        summary: 'Turn your network into income',
        details: 'The 1325.AI Partner Program allows directory owners, influencers, and community leaders to earn by referring Black-owned businesses to the platform. Earn $5 per signup plus 10% recurring revenue share.',
        steps: [
          'Apply through the Partner Portal',
          'Complete the application with your directory/network info',
          'Wait for approval (typically 1-2 business days)',
          'Receive your unique referral code and link',
          'Share with businesses in your network',
          'Track referrals and earnings in your dashboard'
        ],
        tips: [
          'Founding Partner status available until September 2026',
          'Founding Partners receive permanent enhanced benefits',
          'Larger networks may qualify for custom commission rates'
        ],
        relatedLinks: [
          { label: 'Partner Portal', path: '/partner-portal' }
        ]
      },
      {
        id: 'partner-commissions',
        title: 'Commission Structure',
        summary: 'How you earn as a partner',
        details: 'Partners earn through a dual-commission structure: a flat fee for each business signup and recurring revenue share from subscription payments.',
        steps: [
          '$5 flat fee per successful business signup',
          '10% recurring revenue share on subscription fees',
          'Commissions are calculated monthly',
          'Minimum payout threshold is $50',
          'Payments are processed on the 15th of each month',
          'View detailed earnings breakdown in your dashboard'
        ],
        tips: [
          'Focus on quality referrals that will actively use the platform',
          'Businesses that upgrade to premium subscriptions increase your share',
          'Provide onboarding support to improve retention'
        ]
      },
      {
        id: 'marketing-hub',
        title: 'Partner Marketing Hub',
        summary: 'Professional materials to help you succeed',
        details: 'Access our automated Marketing Hub to generate professional marketing materials with your referral code already embedded. Download welcome kits, flyers, social media assets, and more.',
        steps: [
          'Access Marketing Hub from your Partner Dashboard',
          'Browse available marketing materials by type',
          'Select materials that fit your marketing approach',
          'Your referral code is automatically embedded',
          'Download in various formats (PDF, PNG, etc.)',
          'Share via email, social media, or print'
        ],
        tips: [
          'Welcome Kits are great for in-person meetings',
          'Social media assets are sized for each platform',
          'All materials feature the $700/mo value for $100/mo message'
        ]
      }
    ]
  },
  {
    id: 'sales-agent',
    title: 'Sales Agent (Ambassador)',
    icon: 'UserCheck',
    description: 'Build a business recruiting businesses',
    content: [
      {
        id: 'ambassador-overview',
        title: 'Becoming a 1325 Ambassador',
        summary: 'The human layer of our Economic Operating System',
        details: 'Sales Agents (1325 Ambassadors) are independent representatives who recruit businesses to the platform. Build your own team, earn tier-based commissions, and grow with the platform.',
        steps: [
          'Apply through the Sales Agent signup page',
          'Complete the onboarding and training program',
          'Receive your unique agent referral code',
          'Begin reaching out to Black-owned businesses',
          'Track your referrals and commissions',
          'Advance through commission tiers as you grow'
        ],
        tips: [
          'Complete all training modules to maximize success',
          'Focus on businesses that would benefit most from the platform',
          'Build relationships before making the pitch'
        ],
        relatedLinks: [
          { label: 'Become an Agent', path: '/sales-agent' }
        ]
      },
      {
        id: 'agent-tiers',
        title: 'Agent Tier System',
        summary: 'Earn more as you refer more',
        details: 'Our tier system rewards your success with higher commission rates. As you refer more businesses, you automatically advance to higher tiers with better rates.',
        steps: [
          'Bronze Tier (0-5 referrals): Base commission rate',
          'Silver Tier (6-15 referrals): Enhanced commission rate',
          'Gold Tier (16-30 referrals): Premium commission rate',
          'Platinum Tier (31+ referrals): Maximum commission rate',
          'Tier status is updated automatically',
          'You never lose tier status once achieved'
        ],
        tips: [
          'Tier advancement is permanent - you never go back down',
          'Some promotional periods offer accelerated advancement',
          'Top agents may be invited to exclusive events'
        ]
      },
      {
        id: 'team-building',
        title: 'Building Your Team',
        summary: 'Recruit other agents and earn overrides',
        details: 'Experienced agents can recruit and mentor new agents, earning override commissions on their team recruits. Build a network of agents to multiply your earnings.',
        steps: [
          'After reaching Silver tier, you can recruit new agents',
          'Share your agent recruitment link with potential team members',
          'Earn recruitment bonuses when they sign up',
          'Receive override commissions on their successful referrals',
          'Support your team to help them succeed',
          'Track team performance in your agent dashboard'
        ],
        tips: [
          'Mentor your recruits to improve their success rate',
          'Override commissions are in addition to your direct earnings',
          'Larger teams can qualify for special incentives'
        ]
      }
    ]
  },
  {
    id: 'developer-program',
    title: 'Developer Program',
    icon: 'Code2',
    description: 'Build on the 1325.AI platform',
    content: [
      {
        id: 'api-overview',
        title: 'API Platform Overview',
        summary: 'License 1325.AI technology for your apps',
        details: 'The 1325.AI Developer Program allows you to license our patented technology to build your own community commerce applications. Access CMAL scoring, Voice AI, Susu escrow, and more via our APIs.',
        steps: [
          'Create a developer account in the Developer Portal',
          'Review API documentation and available endpoints',
          'Generate API keys (sandbox and production)',
          'Integrate APIs into your application',
          'Test thoroughly in sandbox mode',
          'Submit for review when ready for production'
        ],
        tips: [
          'Start with the Free tier (1,000 CMAL calls/month)',
          'Use sandbox mode extensively before going live',
          'Pro tier at $299/mo includes 50,000 CMAL calls'
        ],
        relatedLinks: [
          { label: 'Developer Portal', path: '/developers' }
        ]
      },
      {
        id: 'api-features',
        title: 'Available APIs',
        summary: 'Our technology at your fingertips',
        details: 'Access our full suite of patented technologies through well-documented, secure APIs. All APIs are protected under USPTO Patent Pending 63/969,202.',
        steps: [
          'CMAL API: Community Multiplier Algorithm for impact scoring',
          'Voice AI API: Kayla-powered conversational commerce',
          'Susu API: Escrow and rotational savings infrastructure',
          'Fraud Detection API: AI-powered fraud prevention',
          'Business Directory API: Access to verified business data',
          'Each API includes comprehensive documentation'
        ],
        tips: [
          'Rate limits vary by tier - check documentation',
          'SDKs available for JavaScript and Python',
          'Enterprise clients can request custom integrations'
        ]
      },
      {
        id: 'technical-partner',
        title: 'Becoming a Technical Partner',
        summary: 'Earn revenue share from your apps',
        details: 'Technical Partners earn a 5% revenue share on businesses onboarded through their applications. Apply for Technical Partner status after integrating our APIs.',
        steps: [
          'Successfully integrate at least one 1325.AI API',
          'Demonstrate a working application',
          'Apply for Technical Partner status in developer dashboard',
          'Pass technical review and compliance check',
          'Receive approval and start earning revenue share',
          'Track attribution and earnings in your dashboard'
        ],
        tips: [
          'Technical Partner status is separate from regular Partner status',
          'You can be both a Partner and Technical Partner',
          'Enterprise integrations may qualify for higher revenue share'
        ]
      }
    ]
  }
];

// ============================================
// ACCOUNT & SUPPORT
// ============================================

export const ACCOUNT_SUPPORT: GuideSection[] = [
  {
    id: 'account-settings',
    title: 'Account Settings',
    icon: 'Settings',
    description: 'Manage your profile and preferences',
    content: [
      {
        id: 'profile-management',
        title: 'Managing Your Profile',
        summary: 'Keep your information up to date',
        details: 'Your profile is how other users and businesses see you on the platform. Keep it updated with accurate information to build trust and receive relevant recommendations.',
        steps: [
          'Access Settings from the user menu',
          'Update your display name and photo',
          'Add or update your contact information',
          'Set your location preferences',
          'Configure notification settings',
          'Manage connected accounts and payment methods'
        ],
        tips: [
          'A complete profile increases your visibility in the community',
          'Profile photos help businesses recognize returning customers',
          'Keep your email current to receive important notifications'
        ],
        relatedLinks: [
          { label: 'Settings', path: '/settings' }
        ]
      },
      {
        id: 'security',
        title: 'Account Security',
        summary: 'Protect your account and data',
        details: 'We take security seriously. Enable additional security features to protect your account, transactions, and personal information.',
        steps: [
          'Use a strong, unique password',
          'Enable two-factor authentication (2FA) when available',
          'Review login history for unauthorized access',
          'Set up account recovery options',
          'Monitor connected devices and sessions',
          'Report any suspicious activity immediately'
        ],
        tips: [
          'Never share your password or login credentials',
          'Log out when using shared devices',
          'Update your password periodically'
        ]
      },
      {
        id: 'privacy',
        title: 'Privacy Settings',
        summary: 'Control what others see',
        details: 'Manage your privacy preferences to control what information is visible to other users, businesses, and the public.',
        steps: [
          'Access Privacy settings from your account',
          'Control profile visibility (public, members only, private)',
          'Manage who can see your activity',
          'Set review visibility preferences',
          'Configure data sharing preferences',
          'Download your data or request deletion'
        ],
        tips: [
          'Some features require public profile elements',
          'You can always request a full data export',
          'We never sell your personal data to third parties'
        ]
      }
    ]
  },
  {
    id: 'support',
    title: 'Getting Help',
    icon: 'HelpCircle',
    description: 'Contact support and find answers',
    content: [
      {
        id: 'contact-support',
        title: 'Contacting Support',
        summary: 'Reach our support team',
        details: 'Our support team is available to help with any questions or issues. We typically respond within 24 hours during business days.',
        steps: [
          'Email: Thomas@1325.AI',
          'Contact form: Available on the Contact page',
          'In-app support: Use the Help button in the app',
          'Provide as much detail as possible about your issue',
          'Include screenshots if applicable',
          'Check your email for our response'
        ],
        tips: [
          'Check the FAQ first - your question may already be answered',
          'Be specific about what you were doing when the issue occurred',
          'Include your account email for faster service'
        ],
        relatedLinks: [
          { label: 'Contact Us', path: '/contact' }
        ]
      },
      {
        id: 'community-help',
        title: 'Community Resources',
        summary: 'Connect with other users',
        details: 'Join our community to connect with other users, share experiences, and get peer support.',
        steps: [
          'Visit the Community Forum to browse discussions',
          'Search for topics related to your question',
          'Post new questions if not already answered',
          'Help others by sharing your experience',
          'Follow topics to stay updated',
          'Participate in community events and challenges'
        ],
        tips: [
          'Community members often share helpful tips and tricks',
          'Helping others can boost your Karma score',
          'Mark solutions as accepted to help future users'
        ]
      }
    ]
  }
];

// ============================================
// ALL SECTIONS COMBINED
// ============================================

export const ALL_USER_GUIDE_SECTIONS = [
  { category: 'Core Features', sections: CORE_FEATURES },
  { category: 'Financial Features', sections: FINANCIAL_FEATURES },
  { category: 'Business Tools', sections: BUSINESS_TOOLS },
  { category: 'Growth Programs', sections: GROWTH_PROGRAMS },
  { category: 'Account & Support', sections: ACCOUNT_SUPPORT }
];
