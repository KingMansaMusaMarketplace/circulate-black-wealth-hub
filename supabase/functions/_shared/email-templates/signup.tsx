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
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Welcome to 1325.AI — Verify your email to get started</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={logoText}>1325.AI</Text>
        </Section>
        <Hr style={divider} />
        <Heading style={h1}>Welcome aboard!</Heading>
        <Text style={text}>
          Thanks for joining{' '}
          <Link href={siteUrl} style={link}>
            <strong>1325.AI</strong>
          </Link>
          — the platform built to circulate and grow Black wealth.
        </Text>
        <Text style={text}>
          Please verify your email address (
          <Link href={`mailto:${recipient}`} style={link}>
            {recipient}
          </Link>
          ) to activate your account:
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={confirmationUrl}>
            Verify My Email
          </Button>
        </Section>
        <Text style={footer}>
          If you didn't create an account, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'DM Sans', Inter, Arial, sans-serif" }
const container = { padding: '20px 25px', maxWidth: '560px', margin: '0 auto' }
const header = { textAlign: 'center' as const, padding: '20px 0 10px' }
const logoText = { fontSize: '28px', fontWeight: 'bold' as const, color: '#003366', margin: '0', letterSpacing: '-0.02em' }
const divider = { borderColor: '#e5e7eb', margin: '10px 0 25px' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#0a1628', margin: '0 0 20px', fontFamily: "'DM Sans', Inter, Arial, sans-serif" }
const text = { fontSize: '15px', color: '#6b7280', lineHeight: '1.6', margin: '0 0 20px' }
const link = { color: '#003366', textDecoration: 'underline' }
const buttonContainer = { textAlign: 'center' as const, margin: '10px 0 30px' }
const button = { backgroundColor: '#003366', color: '#ffffff', fontSize: '15px', fontWeight: '600' as const, borderRadius: '8px', padding: '14px 28px', textDecoration: 'none' }
const footer = { fontSize: '12px', color: '#9ca3af', margin: '30px 0 0', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }
