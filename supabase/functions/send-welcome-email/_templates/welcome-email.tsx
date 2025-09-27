import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface WelcomeEmailProps {
  fullName: string;
  email: string;
  userType: 'customer' | 'business' | 'sponsor';
  subscriptionTier: string;
  dashboardUrl: string;
}

export const WelcomeEmail = ({
  fullName = 'New User',
  email,
  userType = 'customer',
  subscriptionTier = 'free',
  dashboardUrl = 'https://localhost:5173/dashboard'
}: WelcomeEmailProps) => {
  const getPersonalizedContent = () => {
    switch (userType) {
      case 'business':
        return {
          title: 'Welcome to the Mansa Musa Business Network! 🏢',
          intro: 'Thank you for joining our community of Black-owned businesses. You\'re now part of a powerful network that\'s building economic empowerment together.',
          features: [
            '📊 Business Dashboard & Analytics',
            '📱 QR Code Generation for Customer Loyalty',
            '🎯 Customer Engagement Tools',
            '📈 Revenue Tracking & Insights',
            '🤝 Business Networking Opportunities'
          ],
          nextSteps: [
            'Complete your business profile',
            'Generate your first QR code',
            'Set up your rewards program',
            'Connect with local customers'
          ]
        };
      case 'sponsor':
        return {
          title: 'Welcome to Corporate Partnership! 🤝',
          intro: 'Thank you for supporting Black-owned businesses and community economic development. Your partnership makes a real difference.',
          features: [
            '🎯 Targeted Community Impact',
            '📊 Partnership Analytics & Reporting',
            '🌟 Brand Visibility in the Community',
            '📈 ROI Tracking for Sponsorships',
            '🤝 Direct Business Connections'
          ],
          nextSteps: [
            'Complete your company profile',
            'Explore sponsorship opportunities',
            'Connect with local businesses',
            'Review impact metrics'
          ]
        };
      default: // customer
        return {
          title: 'Welcome to Mansa Musa Marketplace! 🎉',
          intro: 'Thank you for joining our community! You\'re now part of a movement that supports Black-owned businesses and builds community wealth.',
          features: [
            '🏪 Discover Local Black-Owned Businesses',
            '📱 Scan QR Codes to Earn Loyalty Points',
            '🎁 Redeem Exclusive Rewards & Discounts',
            '🌟 Leave Reviews & Build Community',
            '📊 Track Your Community Impact'
          ],
          nextSteps: [
            'Complete your profile setup',
            'Discover businesses near you',
            'Start earning loyalty points',
            'Redeem your first reward'
          ]
        };
    }
  };

  const content = getPersonalizedContent();

  return (
    <Html>
      <Head />
      <Preview>{content.title}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&h=80&fit=crop&crop=center"
              width="180"
              height="60"
              alt="Mansa Musa Marketplace"
              style={logo}
            />
          </Section>

          {/* Main Content */}
          <Section style={content_section}>
            <Heading style={h1}>{content.title}</Heading>
            
            <Text style={text}>
              Hello {fullName},
            </Text>
            
            <Text style={text}>
              {content.intro}
            </Text>

            {/* Features Section */}
            <Section style={features_section}>
              <Heading style={h2}>What you can do now:</Heading>
              {content.features.map((feature, index) => (
                <Text key={index} style={feature_item}>
                  {feature}
                </Text>
              ))}
            </Section>

            {/* CTA Button */}
            <Section style={button_section}>
              <Button pX={20} pY={12} style={button} href={dashboardUrl}>
                Get Started with Your Dashboard
              </Button>
            </Section>

            {/* Next Steps */}
            <Section style={next_steps_section}>
              <Heading style={h2}>Your next steps:</Heading>
              {content.nextSteps.map((step, index) => (
                <Text key={index} style={step_item}>
                  {index + 1}. {step}
                </Text>
              ))}
            </Section>

            <Hr style={hr} />

            {/* Account Info */}
            <Section style={account_section}>
              <Heading style={h2}>Your Account Details:</Heading>
              <Text style={account_detail}>
                <strong>Email:</strong> {email}
              </Text>
              <Text style={account_detail}>
                <strong>Account Type:</strong> {userType.charAt(0).toUpperCase() + userType.slice(1)}
              </Text>
              <Text style={account_detail}>
                <strong>Plan:</strong> {subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)}
              </Text>
            </Section>

            <Hr style={hr} />

            {/* Support Section */}
            <Section style={support_section}>
              <Text style={support_text}>
                Need help getting started? Our community support team is here to help!
              </Text>
              <Text style={support_text}>
                📧 Email us at <Link href="mailto:support@mansamusa.com" style={link}>support@mansamusa.com</Link>
              </Text>
              <Text style={support_text}>
                💬 Visit our <Link href={`${dashboardUrl}/help`} style={link}>Help Center</Link>
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footer_text}>
              Building wealth. Building community. Building the future.
            </Text>
            <Text style={footer_text}>
              © 2024 Mansa Musa Marketplace. All rights reserved.
            </Text>
            <Text style={footer_links}>
              <Link href={`${dashboardUrl}/privacy`} style={footer_link}>Privacy Policy</Link> | 
              <Link href={`${dashboardUrl}/terms`} style={footer_link}> Terms of Service</Link> | 
              <Link href={`${dashboardUrl}/contact`} style={footer_link}> Contact Us</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const header = {
  padding: '20px 30px',
  backgroundColor: '#1a1a1a',
  borderRadius: '8px 8px 0 0',
};

const logo = {
  display: 'block',
  margin: '0 auto',
  borderRadius: '8px',
};

const content_section = {
  padding: '30px 30px 40px',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 30px',
  textAlign: 'center' as const,
  lineHeight: '1.3',
};

const h2 = {
  color: '#1a1a1a',
  fontSize: '20px',
  fontWeight: '600',
  margin: '30px 0 15px',
};

const text = {
  color: '#484848',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 20px',
};

const features_section = {
  backgroundColor: '#f8fafc',
  padding: '25px',
  borderRadius: '8px',
  margin: '30px 0',
};

const feature_item = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '8px 0',
};

const button_section = {
  textAlign: 'center' as const,
  margin: '40px 0',
};

const button = {
  backgroundColor: '#d4af37',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  width: '100%',
  maxWidth: '300px',
};

const next_steps_section = {
  backgroundColor: '#fef3cd',
  padding: '25px',
  borderRadius: '8px',
  margin: '30px 0',
};

const step_item = {
  color: '#92400e',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '8px 0',
  fontWeight: '500',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '30px 0',
};

const account_section = {
  backgroundColor: '#f1f5f9',
  padding: '20px',
  borderRadius: '6px',
  margin: '20px 0',
};

const account_detail = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
};

const support_section = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const support_text = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
};

const link = {
  color: '#d4af37',
  textDecoration: 'underline',
};

const footer = {
  backgroundColor: '#f9fafb',
  padding: '25px 30px',
  borderRadius: '0 0 8px 8px',
  textAlign: 'center' as const,
};

const footer_text = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '5px 0',
};

const footer_links = {
  margin: '15px 0 0',
};

const footer_link = {
  color: '#6b7280',
  fontSize: '12px',
  textDecoration: 'underline',
  margin: '0 4px',
};