import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Button, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "1325.AI"

interface BusinessLiveConfirmationProps {
  businessName?: string
  category?: string
  listingUrl?: string
}

const BusinessLiveConfirmationEmail = ({
  businessName,
  category,
  listingUrl,
}: BusinessLiveConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>
      {businessName ? `${businessName} is live on ${SITE_NAME}!` : `Your business is live on ${SITE_NAME}!`}
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Heading style={logo}>{SITE_NAME}</Heading>
        </Section>

        <Section style={contentSection}>
          <Heading style={h1}>You're live! 🎉</Heading>
          <Text style={text}>
            Congratulations{businessName ? `, ${businessName}` : ''} — your business profile is
            now visible to customers in our community directory.
          </Text>

          <Section style={detailsBox}>
            {businessName && (
              <Text style={detailText}><strong>Business:</strong> {businessName}</Text>
            )}
            {category && (
              <Text style={detailText}><strong>Category:</strong> {category}</Text>
            )}
            <Text style={detailText}>
              <strong>Status:</strong> Live on the directory
            </Text>
          </Section>

          {listingUrl && (
            <Section style={{ textAlign: 'center' as const, padding: '10px 0 20px' }}>
              <Button style={button} href={listingUrl}>
                View Your Listing
              </Button>
            </Section>
          )}

          <Heading style={h2}>Next steps to get more customers</Heading>
          <Section style={stepsBox}>
            <Text style={stepText}>
              <strong>1. Add a logo and banner.</strong> Listings with branding get noticeably more clicks.
            </Text>
            <Text style={stepText}>
              <strong>2. Share your QR code.</strong> Print it for your storefront so customers can scan and earn loyalty points.
            </Text>
            <Text style={stepText}>
              <strong>3. Invite your team.</strong> Add staff so they can help manage bookings and respond to reviews.
            </Text>
          </Section>

          <Text style={text}>
            Questions? Just reply to this email — a real person will get back to you.
          </Text>
        </Section>

        <Hr style={hr} />
        <Text style={footer}>
          {SITE_NAME} — Empowering Community Businesses
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: BusinessLiveConfirmationEmail,
  subject: (data: Record<string, any>) =>
    data?.businessName
      ? `${data.businessName} is live on ${SITE_NAME}!`
      : `Your business is live on ${SITE_NAME}!`,
  displayName: 'Business live confirmation',
  previewData: {
    businessName: 'Harper & Vine Coffee Roasters',
    category: 'Food & Drink',
    listingUrl: 'https://1325.ai/business/sample-id',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'DM Sans', Arial, sans-serif" }
const container = { padding: '0', maxWidth: '600px', margin: '0 auto' }
const headerSection = { backgroundColor: 'hsl(213, 100%, 20%)', padding: '24px 25px', textAlign: 'center' as const }
const logo = { color: '#fbbf24', fontSize: '24px', fontWeight: 'bold' as const, margin: '0' }
const contentSection = { padding: '30px 25px' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: 'hsl(213, 100%, 20%)', margin: '0 0 16px' }
const h2 = { fontSize: '17px', fontWeight: 'bold' as const, color: 'hsl(213, 100%, 20%)', margin: '24px 0 12px' }
const text = { fontSize: '14px', color: '#55575d', lineHeight: '1.6', margin: '0 0 16px' }
const detailsBox = { backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #fbbf24', margin: '16px 0' }
const detailText = { fontSize: '14px', color: '#333333', margin: '0 0 8px', lineHeight: '1.5' }
const stepsBox = { backgroundColor: '#fffaf0', padding: '15px 18px', borderRadius: '8px', margin: '8px 0 20px' }
const stepText = { fontSize: '14px', color: '#333333', margin: '0 0 10px', lineHeight: '1.5' }
const button = { backgroundColor: '#fbbf24', color: 'hsl(213, 100%, 20%)', padding: '14px 32px', borderRadius: '6px', fontWeight: 'bold' as const, textDecoration: 'none', display: 'inline-block', fontSize: '15px' }
const hr = { borderColor: '#e5e7eb', margin: '20px 25px' }
const footer = { fontSize: '12px', color: '#999999', margin: '0 25px 20px', textAlign: 'center' as const }
