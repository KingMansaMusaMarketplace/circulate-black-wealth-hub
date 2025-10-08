import { Search, QrCode, Gift, Heart } from 'lucide-react';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  illustration: any;
  features: string[];
  action?: {
    text: string;
    href?: string;
  };
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Mansa Musa Marketplace!',
    description: 'Your gateway to discovering and supporting Black-owned businesses in your community.',
    illustration: Heart,
    features: [
      'Discover amazing Black-owned businesses near you',
      'Earn rewards for every purchase you make',
      'Build stronger community connections',
      'Make a real economic impact'
    ]
  },
  {
    id: 'discovery',
    title: 'Discover Local Businesses',
    description: 'Find restaurants, shops, services, and more in your area with our powerful search and map features.',
    illustration: Search,
    features: [
      'Browse by category or search by name',
      'View businesses on an interactive map',
      'Read reviews from the community',
      'See business hours, contact info, and directions'
    ],
    action: {
      text: 'Explore Directory',
      href: '/directory'
    }
  },
  {
    id: 'qr-scanning',
    title: 'Scan QR Codes to Earn',
    description: 'Use our QR scanner when you visit participating businesses to earn points and unlock rewards.',
    illustration: QrCode,
    features: [
      'Scan QR codes at checkout to earn points',
      'Get instant confirmation of your rewards',
      'Track your point balance in real-time',
      'Works at all participating businesses'
    ],
    action: {
      text: 'Try QR Scanner',
      href: '/qr-scanner'
    }
  },
  {
    id: 'rewards',
    title: 'Redeem Amazing Rewards',
    description: 'Turn your points into discounts, free items, and exclusive offers from your favorite businesses.',
    illustration: Gift,
    features: [
      'Redeem points for discounts and free items',
      'Access exclusive member-only offers',
      'Save on future purchases automatically',
      'Special rewards for loyal customers'
    ],
    action: {
      text: 'View Rewards',
      href: '/loyalty'
    }
  }
];

export const FAQ_ITEMS = [
  {
    question: 'How do I earn points?',
    answer: 'You earn points by scanning QR codes at participating businesses when you make a purchase. Points are added to your account instantly!'
  },
  {
    question: 'How do I redeem my rewards?',
    answer: 'Visit the Loyalty section to see available rewards. Tap any reward to redeem it, and show the confirmation to the business when making your purchase.'
  },
  {
    question: 'How do I find businesses near me?',
    answer: 'Use the Directory page to browse businesses by category or search by name. The map view shows businesses closest to your location.'
  },
  {
    question: 'What if a business isn\'t listed?',
    answer: 'You can suggest new businesses through our contact form. We\'re always adding new partners to the marketplace!'
  },
  {
    question: 'How do QR codes work?',
    answer: 'Each participating business has a unique QR code. Scan it with our app after making a purchase to earn points. The business will confirm your purchase amount.'
  },
  {
    question: 'Is my personal information safe?',
    answer: 'Yes! We use industry-standard security measures to protect your data. We never share your personal information with third parties without your consent.'
  },
  {
    question: 'Can I use the app without creating an account?',
    answer: 'You can browse businesses without an account, but you\'ll need to sign up to earn points, redeem rewards, and save your favorite businesses.'
  },
  {
    question: 'Do points expire?',
    answer: 'Points remain active as long as you use the app regularly. Points may expire after 12 months of inactivity.'
  }
];

export const HELP_SECTIONS = [
  {
    title: 'Getting Started',
    items: [
      { 
        title: 'Creating Your Account', 
        description: 'Learn how to sign up and set up your profile',
        details: `Getting started with Mansa Musa Marketplace is easy! Here's how to create your account:

**Step 1: Sign Up**
- Click the "Sign Up" button in the top right corner
- Choose between Customer or Business account type
- Enter your email and create a secure password

**Step 2: Verify Your Email**
- Check your inbox for a verification email
- Click the verification link to activate your account

**Step 3: Complete Your Profile**
- Add your name and profile photo
- Set your location preferences to find nearby businesses
- Choose your interests to get personalized recommendations

**Tips for Success:**
- Use a strong password with at least 8 characters
- Enable two-factor authentication for extra security
- Complete your profile to unlock all features`
      },
      { 
        title: 'Finding Businesses', 
        description: 'Tips for discovering businesses in your area',
        details: `Discover amazing Black-owned businesses near you with these helpful tips:

**Using the Directory**
- Browse by category: Restaurants, Services, Retail, and more
- Use the search bar to find specific businesses or services
- Filter by distance, rating, or special offers

**Map View**
- Switch to map view to see businesses near your location
- Enable location services for accurate results
- Tap on markers to view business details quickly

**Advanced Search Tips:**
- Use keywords like "vegan", "delivery", or "open late"
- Check business hours before visiting
- Read reviews to find highly-rated options
- Look for businesses offering loyalty rewards

**Save Your Favorites:**
- Tap the heart icon to save businesses you love
- Access your favorites list anytime from your profile
- Get notified when saved businesses have new offers`
      },
      { 
        title: 'First QR Code Scan', 
        description: 'Step-by-step guide to earning your first points',
        details: `Ready to earn your first points? Follow this simple guide:

**Before You Visit:**
- Ensure you're logged into your account
- Check that the business participates in our rewards program
- Look for the Mansa Musa QR code at checkout

**At the Business:**
1. Complete your purchase as normal
2. Open the Mansa Musa app
3. Tap the QR Scanner icon
4. Point your camera at the business's QR code
5. Wait for the green checkmark confirmation

**After Scanning:**
- Points are added to your account instantly
- View your updated balance in the app
- Check your progress toward the next reward tier

**Troubleshooting Tips:**
- Make sure the QR code is well-lit and in focus
- Hold your phone steady until the scan completes
- If scanning fails, ask the business staff for assistance
- Check your internet connection`
      }
    ]
  },
  {
    title: 'Earning & Rewards',
    items: [
      { 
        title: 'How Points Work', 
        description: 'Understanding the point system and earning rates',
        details: `Master the points system and maximize your earnings:

**Earning Points:**
- Scan QR codes at participating businesses to earn points
- Earn 1 point per dollar spent (base rate)
- Bonus points during special promotions
- Extra points for trying new businesses

**Point Values:**
- 100 points = $5 reward value
- Points never decrease in value
- Combine points for bigger rewards
- Earn bonus points on birthdays and anniversaries

**Special Bonuses:**
- First purchase at a new business: +50 points
- Weekly challenge completions: +100 points
- Refer a friend: +200 points per successful referral
- Business reviews: +25 points per detailed review

**Tracking Your Points:**
- View your balance anytime in the Loyalty section
- See a history of all points earned and redeemed
- Get notifications when you reach reward milestones
- Track progress toward your next loyalty tier`
      },
      { 
        title: 'Redeeming Rewards', 
        description: 'How to use your points for discounts and freebies',
        details: `Turn your points into amazing rewards:

**How to Redeem:**
1. Go to the Loyalty section in the app
2. Browse available rewards
3. Tap on a reward to see details
4. Click "Redeem" when ready to use it
5. Show the redemption code to the business

**Types of Rewards:**
- **Discounts:** Percentage or dollar amount off purchases
- **Free Items:** Complimentary products or services
- **Exclusive Offers:** Special member-only deals
- **Partner Perks:** Benefits from partner businesses

**Redemption Tips:**
- Check expiration dates before redeeming
- Some rewards have usage restrictions
- Combine multiple small rewards strategically
- Save points for premium rewards during special events

**Managing Rewards:**
- Active rewards appear in "My Rewards"
- Set reminders before rewards expire
- Gift unused rewards to friends and family
- Contact support if you have redemption issues`
      },
      { 
        title: 'Loyalty Tiers', 
        description: 'Unlock better rewards as you earn more points',
        details: `Progress through loyalty tiers for enhanced benefits:

**Loyalty Tiers:**

**Bronze (0-999 points)**
- Standard earning rate: 1 point per $1
- Access to basic rewards catalog
- Monthly special offers

**Silver (1,000-4,999 points)**
- 1.25x point multiplier on all purchases
- Early access to new rewards
- Exclusive birthday rewards
- Priority customer support

**Gold (5,000-9,999 points)**
- 1.5x point multiplier on all purchases
- Premium rewards catalog access
- Free shipping on partner e-commerce
- VIP event invitations
- Quarterly bonus points

**Platinum (10,000+ points)**
- 2x point multiplier on all purchases
- Personal rewards concierge
- All premium benefits
- Annual bonus rewards package
- First access to new business partnerships

**Tier Benefits:**
- Tiers reset annually
- Maintain tier with regular activity
- Earn tier-specific badges
- Share achievements on social media`
      }
    ]
  },
  {
    title: 'Account & Privacy',
    items: [
      { 
        title: 'Managing Your Profile', 
        description: 'Update your information and preferences',
        details: `Keep your profile up-to-date and personalized:

**Profile Information:**
- **Personal Details:** Name, email, phone number
- **Profile Photo:** Upload a clear, recent photo
- **Location:** Set your home address for better recommendations
- **Preferences:** Choose favorite categories and interests

**How to Update:**
1. Tap your profile icon in the app
2. Select "Edit Profile"
3. Update any information
4. Save your changes

**Communication Preferences:**
- Email notifications: Choose what updates you receive
- Push notifications: Control app alerts
- SMS updates: Opt in/out of text messages
- Marketing communications: Manage promotional emails

**Privacy Controls:**
- Choose what information is visible to others
- Control business visibility settings
- Manage data sharing preferences
- Download your data anytime

**Profile Tips:**
- Add a profile photo to build community trust
- Keep your email updated to receive important notices
- Set accurate location for better business recommendations
- Review privacy settings regularly`
      },
      { 
        title: 'Privacy Settings', 
        description: 'Control what information you share',
        details: `We take your privacy seriously. Control your information:

**What We Collect:**
- Account information (email, name, password)
- Location data (only when you use map features)
- Purchase history (to calculate rewards)
- Device information (to provide app functionality)

**Your Privacy Controls:**

**Location Sharing:**
- Enable/disable location services
- Control when location is accessed
- Choose location accuracy level
- Delete location history

**Data Visibility:**
- Control who sees your profile
- Manage review and rating visibility
- Choose what appears in activity feed
- Opt out of public leaderboards

**Third-Party Sharing:**
- We never sell your data
- Control analytics tracking
- Manage cookie preferences
- Opt out of personalized ads

**Data Rights:**
- Request a copy of your data
- Export your purchase history
- Delete specific information
- Close your account and remove all data

**Security Features:**
- Two-factor authentication
- Login alerts
- Secure password requirements
- Session management`
      },
      { 
        title: 'Account Security', 
        description: 'Keep your account safe and secure',
        details: `Protect your account with these security best practices:

**Password Security:**
- Use at least 8 characters
- Combine letters, numbers, and symbols
- Avoid common words and patterns
- Don't reuse passwords from other sites
- Change passwords regularly

**Two-Factor Authentication (2FA):**
1. Go to Settings > Security
2. Enable Two-Factor Authentication
3. Choose authentication method:
   - SMS code
   - Authenticator app
   - Email verification
4. Backup your recovery codes

**Recognizing Security Threats:**
- **Phishing:** We'll never ask for your password via email
- **Suspicious Links:** Always verify URLs before clicking
- **Account Sharing:** Never share your login credentials
- **Public WiFi:** Use VPN or avoid sensitive transactions

**Account Recovery:**
- Set up recovery email and phone
- Save recovery codes in a secure place
- Answer security questions accurately
- Keep contact information updated

**Best Practices:**
- Log out of shared devices
- Review login activity regularly
- Enable biometric authentication
- Report suspicious activity immediately
- Update app to latest version

**If Your Account is Compromised:**
1. Change your password immediately
2. Enable 2FA if not already active
3. Review recent account activity
4. Contact support for assistance
5. Check connected payment methods`
      }
    ]
  }
];

export const CONTEXTUAL_TIPS = {
  'qr-scanner': {
    title: 'QR Code Scanner',
    tip: 'Point your camera at the QR code displayed at checkout. Make sure the code is well-lit and fully visible in the frame.'
  },
  'directory-map': {
    title: 'Map View',
    tip: 'Tap on any business marker to see details, or use the search bar to find specific types of businesses.'
  },
  'loyalty-rewards': {
    title: 'Rewards Catalog',
    tip: 'Rewards with a gold border are premium offers. Check back regularly as new rewards are added weekly!'
  },
  'business-profile': {
    title: 'Business Details',
    tip: 'Scroll down to see reviews, photos, and current offers. Tap the heart icon to save this business to your favorites.'
  }
};