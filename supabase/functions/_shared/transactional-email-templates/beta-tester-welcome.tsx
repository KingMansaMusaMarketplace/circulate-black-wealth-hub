import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr, Button,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "1325.AI"

interface BetaTesterWelcomeProps {
  name?: string
  betaCode?: string
  expirationDate?: string
}

const BetaTesterWelcomeEmail = ({ name, betaCode, expirationDate }: BetaTesterWelcomeProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>🎉 Congratulations! You've been selected as a {SITE_NAME} Beta Tester</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Heading style={logo}>{SITE_NAME}</Heading>
        </Section>
        <Section style={contentSection}>
          <Heading style={h1}>
            🎉 Congratulations{name ? `, ${name}` : ''}!
          </Heading>
          <Text style={text}>
            <strong>Thank you for being selected as one of our exclusive Beta Testers!</strong> We're thrilled to have you join us on this journey as we build something truly special for our community.
          </Text>
          <Text style={text}>
            As a valued Beta Tester, you'll receive <strong>completely free access</strong> to all business owner features on {SITE_NAME} — no charges, no credit card required. This is our way of saying thank you for helping us shape the future of our platform.
          </Text>

          <Section style={codeSection}>
            <Text style={codeLabel}>Your Exclusive Beta Code</Text>
            <Text style={codeValue}>{betaCode || 'CODE'}</Text>
            <Text style={codeInstructions}>
              Use this code when you sign up as a Business Owner on {SITE_NAME}. This code is uniquely tied to your email address and can only be used once — please do not share it with anyone.
            </Text>
          </Section>

          {expirationDate && (
            <Text style={expirationText}>
              ⏰ <strong>Please note:</strong> This beta code expires on <strong>{expirationDate}</strong>. Be sure to sign up before then to secure your free access.
            </Text>
          )}

          <Hr style={divider} />

          <Heading style={h2}>📊 What We Track & Why</Heading>
          <Text style={text}>
            Transparency matters to us. Here's exactly what we monitor during the beta period so there are no surprises:
          </Text>
          <Text style={listItem}>
            <strong>• Session Time:</strong> We track how long you're active on the platform each day. This helps us understand which features keep you engaged and where we might need to improve the experience.
          </Text>
          <Text style={listItem}>
            <strong>• Active Days:</strong> We count the days you log in and use the platform. This tells us how often our beta testers return, which is a key measure of how useful the platform is in your daily business operations.
          </Text>
          <Text style={listItem}>
            <strong>• Feature Interactions:</strong> We monitor which features you use most. This guides our development priorities — the features you love get enhanced, and the ones that need work get improved.
          </Text>
          <Text style={listItem}>
            <strong>• Engagement Score:</strong> Based on your activity, we calculate an overall engagement score (Low, Medium, High). This helps our team identify testers who might need additional support or onboarding help.
          </Text>

          <Hr style={divider} />

          <Heading style={h2}>🔒 Your Privacy & Business Data</Heading>
          <Text style={text}>
            <strong>We want to be crystal clear:</strong> We will <strong>NOT</strong> have access to any of your personal business information, financial records, customer data, or any proprietary details you enter into the platform. Your business data is <strong>yours and yours alone</strong>.
          </Text>
          <Text style={text}>
            The only data we collect is the platform usage metrics described above — nothing more. We use this information solely to improve the {SITE_NAME} experience for everyone. Your trust is everything to us.
          </Text>

          <Hr style={divider} />

          <Heading style={h2}>🤝 What We Ask of You</Heading>
          <Text style={listItem}>
            <strong>• Be Active:</strong> Try to use the platform regularly so we can gather meaningful feedback on real-world usage.
          </Text>
          <Text style={listItem}>
            <strong>• Share Feedback:</strong> If something doesn't work right, feels confusing, or could be better — let us know! Your input directly shapes our product.
          </Text>
          <Text style={listItem}>
            <strong>• Keep It Confidential:</strong> As a beta tester, you're getting early access to features that aren't publicly available yet. Please do not share screenshots, beta codes, or details about unreleased features with anyone outside the program.
          </Text>
          <Text style={listItem}>
            <strong>• Report Bugs:</strong> If you encounter any issues, please report them. You're helping us catch problems before they reach our wider community.
          </Text>

          <Hr style={divider} />

          <Heading style={h2}>🚀 Getting Started</Heading>
          <Text style={text}>
            Ready to dive in? Here's how to get started:
          </Text>
          <Text style={listItem}>
            1. Visit <strong>1325.ai</strong>
          </Text>
          <Text style={listItem}>
            2. Click <strong>"Sign Up"</strong> and select <strong>"Business Owner"</strong>
          </Text>
          <Text style={listItem}>
            3. Enter your beta code: <strong>{betaCode || 'CODE'}</strong>
          </Text>
          <Text style={listItem}>
            4. Complete your profile and start exploring!
          </Text>

          <Section style={ctaSection}>
            <Button href="https://1325.ai/auth" style={ctaButton}>
              Sign Up Now — It's Free!
            </Button>
          </Section>

          <Hr style={divider} />

          <Text style={text}>
            Once again, <strong>thank you</strong> for being part of this journey. Your participation as a Beta Tester is invaluable and we genuinely appreciate your time and trust.
          </Text>
          <Text style={text}>
            If you have any questions at all, don't hesitate to reach out to us.
          </Text>
          <Text style={footer}>
            With gratitude,<br />
            The {SITE_NAME} Team
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: BetaTesterWelcomeEmail,
  subject: '🎉 Welcome to the 1325.AI Beta Program!',
  displayName: 'Beta tester welcome',
  previewData: { name: 'Jane Doe', betaCode: 'BETA1234', expirationDate: 'June 30, 2026' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Segoe UI', Arial, sans-serif" }
const container = { maxWidth: '600px', margin: '0 auto' }
const headerSection = { backgroundColor: '#1a1a2e', padding: '30px 25px', textAlign: 'center' as const }
const logo = { color: '#D4AF37', fontSize: '28px', fontWeight: 'bold' as const, margin: '0', letterSpacing: '1px' }
const contentSection = { padding: '30px 25px' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#1a1a2e', margin: '0 0 20px' }
const h2 = { fontSize: '18px', fontWeight: 'bold' as const, color: '#1a1a2e', margin: '0 0 12px' }
const text = { fontSize: '15px', color: '#333333', lineHeight: '1.6', margin: '0 0 16px' }
const listItem = { fontSize: '14px', color: '#333333', lineHeight: '1.6', margin: '0 0 10px', paddingLeft: '8px' }
const codeSection = { backgroundColor: '#f8f5ec', borderRadius: '10px', padding: '24px', margin: '24px 0', textAlign: 'center' as const, border: '2px dashed #D4AF37' }
const codeLabel = { fontSize: '13px', color: '#666666', textTransform: 'uppercase' as const, letterSpacing: '1px', margin: '0 0 8px', fontWeight: 'bold' as const }
const codeValue = { fontSize: '32px', fontWeight: 'bold' as const, color: '#D4AF37', margin: '0 0 12px', fontFamily: 'monospace', letterSpacing: '3px' }
const codeInstructions = { fontSize: '13px', color: '#666666', margin: '0', lineHeight: '1.5' }
const expirationText = { fontSize: '14px', color: '#c0392b', backgroundColor: '#fdf2f2', padding: '12px 16px', borderRadius: '6px', margin: '0 0 16px' }
const divider = { borderColor: '#e8e8e8', margin: '28px 0' }
const ctaSection = { textAlign: 'center' as const, margin: '24px 0' }
const ctaButton = { backgroundColor: '#D4AF37', color: '#1a1a2e', padding: '14px 32px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold' as const, textDecoration: 'none' }
const footer = { fontSize: '14px', color: '#666666', margin: '20px 0 0', lineHeight: '1.6' }
