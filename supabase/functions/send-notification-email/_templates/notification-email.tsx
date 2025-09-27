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

interface NotificationEmailProps {
  type: 'points_milestone' | 'reward_expiry' | 'new_business' | 'special_offer' | 'weekly_digest';
  fullName: string;
  points?: number;
  businessName?: string;
  offerDetails?: string;
  rewardName?: string;
  expiryDate?: string;
  weeklyStats?: {
    pointsEarned: number;
    businessesVisited: number;
    rewardsRedeemed: number;
  };
  dashboardUrl: string;
}

export const NotificationEmail = ({
  type,
  fullName = 'User',
  points,
  businessName,
  offerDetails,
  rewardName,
  expiryDate,
  weeklyStats,
  dashboardUrl = 'https://localhost:5173/dashboard'
}: NotificationEmailProps) => {
  
  const getNotificationContent = () => {
    switch (type) {
      case 'points_milestone':
        return {
          emoji: '🏆',
          title: `Congratulations! You've reached ${points} points!`,
          preview: `You've hit a major milestone with ${points} loyalty points!`,
          message: `Amazing work, ${fullName}! You've just reached ${points} loyalty points by supporting Black-owned businesses in your community.`,
          cta: 'View Your Rewards',
          ctaUrl: `${dashboardUrl}/rewards`,
          additional: 'Keep supporting local businesses to earn even more points and unlock exclusive rewards!'
        };
        
      case 'reward_expiry':
        return {
          emoji: '⚠️',
          title: `Your ${rewardName} reward expires soon!`,
          preview: `Don't miss out! Your reward expires on ${expiryDate}`,
          message: `Hi ${fullName}, your "${rewardName}" reward is expiring on ${expiryDate}. Don't let this great deal slip away!`,
          cta: 'Redeem Now',
          ctaUrl: `${dashboardUrl}/rewards`,
          additional: 'After this date, the reward will no longer be available. Redeem it today!'
        };
        
      case 'new_business':
        return {
          emoji: '🏪',
          title: `New business alert: ${businessName} just joined!`,
          preview: `Discover ${businessName} - a new Black-owned business in your area`,
          message: `Exciting news, ${fullName}! ${businessName} has just joined the Mansa Musa Marketplace. Be among the first to support this new Black-owned business!`,
          cta: 'Visit Business',
          ctaUrl: `${dashboardUrl}/businesses`,
          additional: 'Early supporters often get special deals and help new businesses thrive in the community.'
        };
        
      case 'special_offer':
        return {
          emoji: '🎁',
          title: `Special offer from ${businessName}!`,
          preview: `Exclusive deal just for you at ${businessName}`,
          message: `Great news, ${fullName}! ${businessName} has a special offer just for loyal customers like you: ${offerDetails}`,
          cta: 'Get Offer',
          ctaUrl: `${dashboardUrl}/businesses`,
          additional: 'This exclusive offer is available for a limited time, so act fast!'
        };
        
      case 'weekly_digest':
        return {
          emoji: '📊',
          title: 'Your weekly community impact summary',
          preview: 'See how you supported Black-owned businesses this week',
          message: `Hi ${fullName}, here's your weekly impact summary for supporting Black-owned businesses in your community.`,
          cta: 'View Full Dashboard',
          ctaUrl: dashboardUrl,
          additional: 'Every scan, every purchase, every review helps build stronger communities!'
        };
        
      default:
        return {
          emoji: '📢',
          title: 'You have a new notification',
          preview: 'Check out what\'s new in your community',
          message: `Hi ${fullName}, you have a new notification from Mansa Musa Marketplace.`,
          cta: 'View Dashboard',
          ctaUrl: dashboardUrl,
          additional: 'Stay connected with your community.'
        };
    }
  };

  const content = getNotificationContent();

  return (
    <Html>
      <Head />
      <Preview>{content.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={emoji_header}>{content.emoji}</Text>
            <Img
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&h=50&fit=crop&crop=center"
              width="120"
              height="40"
              alt="Mansa Musa Marketplace"
              style={logo}
            />
          </Section>

          {/* Main Content */}
          <Section style={content_section}>
            <Heading style={h1}>{content.title}</Heading>
            
            <Text style={text}>
              {content.message}
            </Text>

            {/* Weekly Stats for digest */}
            {type === 'weekly_digest' && weeklyStats && (
              <Section style={stats_section}>
                <Heading style={h2}>This Week's Impact:</Heading>
                <div style={stats_grid}>
                  <div style={stat_item}>
                    <Text style={stat_number}>{weeklyStats.pointsEarned}</Text>
                    <Text style={stat_label}>Points Earned</Text>
                  </div>
                  <div style={stat_item}>
                    <Text style={stat_number}>{weeklyStats.businessesVisited}</Text>
                    <Text style={stat_label}>Businesses Visited</Text>
                  </div>
                  <div style={stat_item}>
                    <Text style={stat_number}>{weeklyStats.rewardsRedeemed}</Text>
                    <Text style={stat_label}>Rewards Redeemed</Text>
                  </div>
                </div>
              </Section>
            )}

            {/* CTA Button */}
            <Section style={button_section}>
              <Button pX={20} pY={12} style={button} href={content.ctaUrl}>
                {content.cta}
              </Button>
            </Section>

            <Text style={additional_text}>
              {content.additional}
            </Text>

            <Hr style={hr} />

            {/* Footer Message */}
            <Section style={footer_message}>
              <Text style={footer_text}>
                Thank you for being part of the Mansa Musa community. Together, we're building economic empowerment and community wealth! 💪
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footer_small}>
              <Link href={`${dashboardUrl}/profile`} style={footer_link}>Manage Notifications</Link> | 
              <Link href={`${dashboardUrl}/help`} style={footer_link}> Help Center</Link>
            </Text>
            <Text style={footer_small}>
              © 2024 Mansa Musa Marketplace. Building community wealth.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default NotificationEmail;

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
  maxWidth: '600px',
};

const header = {
  padding: '20px 30px',
  backgroundColor: '#1a1a1a',
  borderRadius: '8px 8px 0 0',
  textAlign: 'center' as const,
};

const emoji_header = {
  fontSize: '48px',
  margin: '0 0 10px',
  display: 'block',
};

const logo = {
  display: 'block',
  margin: '0 auto',
  borderRadius: '4px',
};

const content_section = {
  padding: '30px 30px 40px',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 20px',
  textAlign: 'center' as const,
  lineHeight: '1.3',
};

const h2 = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: '600',
  margin: '25px 0 15px',
  textAlign: 'center' as const,
};

const text = {
  color: '#484848',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 25px',
  textAlign: 'center' as const,
};

const stats_section = {
  backgroundColor: '#f8fafc',
  padding: '25px',
  borderRadius: '8px',
  margin: '25px 0',
};

const stats_grid = {
  display: 'flex',
  justifyContent: 'space-around',
  textAlign: 'center' as const,
  marginTop: '20px',
};

const stat_item = {
  flex: '1',
  textAlign: 'center' as const,
};

const stat_number = {
  color: '#d4af37',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0',
  display: 'block',
};

const stat_label = {
  color: '#6b7280',
  fontSize: '12px',
  margin: '5px 0 0',
  display: 'block',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const button_section = {
  textAlign: 'center' as const,
  margin: '30px 0',
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
  width: '200px',
};

const additional_text = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '20px 0',
  textAlign: 'center' as const,
  fontStyle: 'italic',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '30px 0',
};

const footer_message = {
  backgroundColor: '#fef3cd',
  padding: '20px',
  borderRadius: '6px',
  textAlign: 'center' as const,
};

const footer_text = {
  color: '#92400e',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
  fontWeight: '500',
};

const footer = {
  backgroundColor: '#f9fafb',
  padding: '20px 30px',
  borderRadius: '0 0 8px 8px',
  textAlign: 'center' as const,
};

const footer_small = {
  color: '#9ca3af',
  fontSize: '11px',
  lineHeight: '16px',
  margin: '5px 0',
};

const footer_link = {
  color: '#6b7280',
  fontSize: '11px',
  textDecoration: 'underline',
  margin: '0 4px',
};