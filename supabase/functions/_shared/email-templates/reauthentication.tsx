/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your 1325.AI verification code</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={logoText}>1325.AI</Text>
        </Section>
        <Hr style={divider} />
        <Heading style={h1}>Verify your identity</Heading>
        <Text style={text}>Use the code below to confirm your identity:</Text>
        <Section style={codeContainer}>
          <Text style={codeStyle}>{token}</Text>
        </Section>
        <Text style={text}>
          This code will expire shortly. If you didn't request this, you can safely ignore this email.
        </Text>
        <Text style={footer}>— The 1325.AI Team</Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'DM Sans', Inter, Arial, sans-serif" }
const container = { padding: '20px 25px', maxWidth: '560px', margin: '0 auto' }
const header = { textAlign: 'center' as const, padding: '20px 0 10px' }
const logoText = { fontSize: '28px', fontWeight: 'bold' as const, color: '#003366', margin: '0', letterSpacing: '-0.02em' }
const divider = { borderColor: '#e5e7eb', margin: '10px 0 25px' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#0a1628', margin: '0 0 20px', fontFamily: "'DM Sans', Inter, Arial, sans-serif" }
const text = { fontSize: '15px', color: '#6b7280', lineHeight: '1.6', margin: '0 0 20px' }
const codeContainer = { textAlign: 'center' as const, margin: '10px 0 30px', backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '20px' }
const codeStyle = { fontFamily: "'DM Sans', Courier, monospace", fontSize: '32px', fontWeight: 'bold' as const, color: '#003366', margin: '0', letterSpacing: '0.15em' }
const footer = { fontSize: '12px', color: '#9ca3af', margin: '30px 0 0', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }
