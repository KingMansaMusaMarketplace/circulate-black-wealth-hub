import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "1325.AI"

interface ContactConfirmationProps {
  name?: string
  subject?: string
}

const ContactConfirmationEmail = ({ name, subject }: ContactConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Thanks for reaching out to {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Heading style={logo}>{SITE_NAME}</Heading>
        </Section>
        <Section style={contentSection}>
          <Heading style={h1}>
            {name ? `Thank you, ${name}!` : 'Thank you for reaching out!'}
          </Heading>
          <Text style={text}>
            We've received your message{subject ? ` regarding "${subject}"` : ''} and our team will get back to you as soon as possible.
          </Text>
          <Text style={text}>
            We typically respond within 24-48 business hours. In the meantime, feel free to explore our directory of community businesses.
          </Text>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>
          Best regards,<br />The {SITE_NAME} Team — Empowering Community Businesses
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactConfirmationEmail,
  subject: 'Thanks for contacting 1325.AI',
  displayName: 'Contact form confirmation',
  previewData: { name: 'Jane', subject: 'Partnership Inquiry' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'DM Sans', Arial, sans-serif" }
const container = { padding: '0', maxWidth: '600px', margin: '0 auto' }
const headerSection = { backgroundColor: 'hsl(213, 100%, 20%)', padding: '24px 25px', textAlign: 'center' as const }
const logo = { color: '#fbbf24', fontSize: '24px', fontWeight: 'bold' as const, margin: '0' }
const contentSection = { padding: '30px 25px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: 'hsl(213, 100%, 20%)', margin: '0 0 20px' }
const text = { fontSize: '14px', color: '#55575d', lineHeight: '1.6', margin: '0 0 16px' }
const hr = { borderColor: '#e5e7eb', margin: '20px 25px' }
const footer = { fontSize: '12px', color: '#999999', margin: '0 25px 20px', lineHeight: '1.5' }
