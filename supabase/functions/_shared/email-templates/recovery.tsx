/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({
  siteName,
  confirmationUrl,
}: RecoveryEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Reset your 1325.AI password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={logoText}>1325.AI</Text>
        </Section>
        <Hr style={divider} />
        <Heading style={h1}>Reset your password</Heading>
        <Text style={text}>
          We received a request to reset your password. Click the button below to choose a new one.
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={confirmationUrl}>
            Reset Password
          </Button>
        </Section>
        <Text style={text}>
          This link will expire shortly. If you didn't request a password reset, you can safely ignore this email — your password will remain unchanged.
        </Text>
        <Text style={footer}>— The 1325.AI Team</Text>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'DM Sans', Inter, Arial, sans-serif" }
const container = { padding: '20px 25px', maxWidth: '560px', margin: '0 auto' }
const header = { textAlign: 'center' as const, padding: '20px 0 10px' }
const logoText = { fontSize: '28px', fontWeight: 'bold' as const, color: '#003366', margin: '0', letterSpacing: '-0.02em' }
const divider = { borderColor: '#e5e7eb', margin: '10px 0 25px' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#0a1628', margin: '0 0 20px', fontFamily: "'DM Sans', Inter, Arial, sans-serif" }
const text = { fontSize: '15px', color: '#6b7280', lineHeight: '1.6', margin: '0 0 20px' }
const buttonContainer = { textAlign: 'center' as const, margin: '10px 0 30px' }
const button = { backgroundColor: '#003366', color: '#ffffff', fontSize: '15px', fontWeight: '600' as const, borderRadius: '8px', padding: '14px 28px', textDecoration: 'none' }
const footer = { fontSize: '12px', color: '#9ca3af', margin: '30px 0 0', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }
