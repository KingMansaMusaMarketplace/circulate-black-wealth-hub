import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Button, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "1325.AI"

interface BookingConfirmationProps {
  customerName?: string
  businessName?: string
  serviceName?: string
  bookingDate?: string
}

const BookingConfirmationEmail = ({ customerName, businessName, serviceName, bookingDate }: BookingConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your booking with {businessName || 'a business'} on {SITE_NAME} is confirmed</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Heading style={logo}>{SITE_NAME}</Heading>
        </Section>
        <Section style={contentSection}>
          <Heading style={h1}>
            Booking Confirmed! 🎉
          </Heading>
          <Text style={text}>
            {customerName ? `Hey ${customerName}, your` : 'Your'} booking has been confirmed. Here are the details:
          </Text>
          <Section style={detailsBox}>
            {businessName && <Text style={detailText}><strong>Business:</strong> {businessName}</Text>}
            {serviceName && <Text style={detailText}><strong>Service:</strong> {serviceName}</Text>}
            {bookingDate && <Text style={detailText}><strong>Date & Time:</strong> {bookingDate}</Text>}
          </Section>
          <Text style={text}>
            Need to make changes? Visit your dashboard to manage your bookings.
          </Text>
          <Section style={{ textAlign: 'center' as const, padding: '10px 0' }}>
            <Button style={button} href="https://1325.ai/customer/bookings">
              View My Bookings
            </Button>
          </Section>
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
  component: BookingConfirmationEmail,
  subject: (data: Record<string, any>) => `Booking Confirmed: ${data.businessName || 'Your appointment'}`,
  displayName: 'Booking confirmation',
  previewData: { customerName: 'Marcus', businessName: 'Soul Food Kitchen', serviceName: 'Catering Consultation', bookingDate: 'January 15, 2025 at 2:00 PM' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'DM Sans', Arial, sans-serif" }
const container = { padding: '0', maxWidth: '600px', margin: '0 auto' }
const headerSection = { backgroundColor: 'hsl(213, 100%, 20%)', padding: '24px 25px', textAlign: 'center' as const }
const logo = { color: '#fbbf24', fontSize: '24px', fontWeight: 'bold' as const, margin: '0' }
const contentSection = { padding: '30px 25px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: 'hsl(213, 100%, 20%)', margin: '0 0 20px' }
const text = { fontSize: '14px', color: '#55575d', lineHeight: '1.6', margin: '0 0 16px' }
const detailsBox = { backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #fbbf24', margin: '16px 0' }
const detailText = { fontSize: '14px', color: '#333', margin: '0 0 8px', lineHeight: '1.5' }
const button = { backgroundColor: '#fbbf24', color: '#1e293b', padding: '12px 24px', borderRadius: '6px', fontWeight: 'bold' as const, textDecoration: 'none', display: 'inline-block' }
const hr = { borderColor: '#e5e7eb', margin: '20px 25px' }
const footer = { fontSize: '12px', color: '#999999', margin: '0 25px 20px', textAlign: 'center' as const }
