import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Button, Hr, Img, Link,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "1325.AI"

interface Match {
  id: string
  title: string
  city?: string
  state?: string
  rent?: number
  bedrooms?: number
  bathrooms?: number
  image?: string
}

interface Props {
  searchLabel?: string
  matches?: Match[]
  manageUrl?: string
}

const LeaseSavedSearchMatchesEmail = ({ searchLabel, matches = [], manageUrl }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{matches.length} new home{matches.length === 1 ? '' : 's'} match your saved search</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Heading style={logo}>{SITE_NAME}</Heading>
        </Section>
        <Section style={contentSection}>
          <Heading style={h1}>
            {matches.length} new home{matches.length === 1 ? '' : 's'} for you
          </Heading>
          <Text style={text}>
            Fresh listings just dropped that match{searchLabel ? ` "${searchLabel}"` : ' your saved search'}.
          </Text>
          {matches.slice(0, 5).map((m) => (
            <Section key={m.id} style={card}>
              {m.image && <Img src={m.image} width="560" height="280" alt={m.title} style={cardImg} />}
              <Section style={{ padding: '14px 16px' }}>
                <Text style={cardTitle}>{m.title}</Text>
                <Text style={cardMeta}>
                  {[m.city, m.state].filter(Boolean).join(', ')}
                  {m.bedrooms ? ` • ${m.bedrooms} bd` : ''}
                  {m.bathrooms ? ` • ${m.bathrooms} ba` : ''}
                </Text>
                {m.rent && <Text style={cardPrice}>${Number(m.rent).toLocaleString()}/mo</Text>}
                <Link href={`https://1325.ai/stays/lease/${m.id}`} style={cardLink}>
                  View listing →
                </Link>
              </Section>
            </Section>
          ))}
          <Section style={{ textAlign: 'center' as const, padding: '20px 0 10px' }}>
            <Button style={button} href="https://1325.ai/stays/lease">
              Browse all new homes
            </Button>
          </Section>
          {manageUrl && (
            <Text style={smallText}>
              <Link href={manageUrl} style={mutedLink}>Manage your saved searches</Link>
            </Text>
          )}
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
  component: LeaseSavedSearchMatchesEmail,
  subject: (data: Record<string, any>) => {
    const n = Array.isArray(data.matches) ? data.matches.length : 0
    return `${n} new home${n === 1 ? '' : 's'} match your saved search`
  },
  displayName: 'Lease saved-search matches',
  previewData: {
    searchLabel: 'Chicago • $1k–$2.5k',
    matches: [
      { id: 'demo-1', title: 'Bronzeville Studio', city: 'Chicago', state: 'IL', rent: 950, bedrooms: 0, bathrooms: 1, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800' },
      { id: 'demo-2', title: 'Hyde Park 2BR Condo', city: 'Chicago', state: 'IL', rent: 2100, bedrooms: 2, bathrooms: 2, image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800' },
    ],
    manageUrl: 'https://1325.ai/stays/lease',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'DM Sans', Arial, sans-serif" }
const container = { padding: '0', maxWidth: '600px', margin: '0 auto' }
const headerSection = { backgroundColor: 'hsl(213, 100%, 20%)', padding: '24px 25px', textAlign: 'center' as const }
const logo = { color: '#fbbf24', fontSize: '24px', fontWeight: 'bold' as const, margin: '0' }
const contentSection = { padding: '30px 25px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: 'hsl(213, 100%, 20%)', margin: '0 0 12px' }
const text = { fontSize: '14px', color: '#55575d', lineHeight: '1.6', margin: '0 0 20px' }
const smallText = { fontSize: '12px', color: '#777', textAlign: 'center' as const, margin: '16px 0 0' }
const card = { border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' as const, margin: '0 0 16px' }
const cardImg = { width: '100%', height: 'auto', display: 'block' as const, objectFit: 'cover' as const }
const cardTitle = { fontSize: '16px', fontWeight: 'bold' as const, color: '#111', margin: '0 0 4px' }
const cardMeta = { fontSize: '13px', color: '#666', margin: '0 0 6px' }
const cardPrice = { fontSize: '15px', fontWeight: 'bold' as const, color: 'hsl(213, 100%, 20%)', margin: '0 0 8px' }
const cardLink = { color: '#fbbf24', fontSize: '13px', fontWeight: 'bold' as const, textDecoration: 'none' }
const mutedLink = { color: '#777', textDecoration: 'underline' }
const button = { backgroundColor: '#fbbf24', color: '#1e293b', padding: '12px 24px', borderRadius: '6px', fontWeight: 'bold' as const, textDecoration: 'none', display: 'inline-block' }
const hr = { borderColor: '#e5e7eb', margin: '20px 25px' }
const footer = { fontSize: '12px', color: '#999999', margin: '0 25px 20px', textAlign: 'center' as const }
