/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Hr, Link,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Metric { label: string; value: string | number }
interface IssueRow { title: string; count: number; users?: number; level?: string; permalink?: string }
interface EventRow { event: string; count: number }

interface Props {
  date?: string
  metrics?: Metric[]
  sentry?: { enabled: boolean; note?: string; error?: string; top_issues?: IssueRow[] }
  posthog?: { enabled: boolean; note?: string; error?: string; top_events?: EventRow[] }
}

const DailyOpsDigestEmail = ({ date, metrics = [], sentry, posthog }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your 1325.AI daily ops digest for {date}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🛡️ Daily Ops Digest</Heading>
        <Text style={subtitle}>{date} · 1325.AI</Text>

        <Section style={section}>
          <Heading as="h2" style={h2}>📊 Last 24h</Heading>
          {metrics.map((m) => (
            <Text key={m.label} style={metricRow}>
              <span>{m.label}</span>
              <strong style={metricValue}>{m.value}</strong>
            </Text>
          ))}
        </Section>

        <Hr style={hr} />

        <Section style={section}>
          <Heading as="h2" style={h2}>🐞 Sentry — Top Errors</Heading>
          {!sentry?.enabled && <Text style={muted}>{sentry?.note || 'Sentry not configured.'}</Text>}
          {sentry?.enabled && sentry.error && <Text style={muted}>Error: {sentry.error}</Text>}
          {sentry?.enabled && !sentry.error && (!sentry.top_issues || sentry.top_issues.length === 0) && (
            <Text style={muted}>No errors in the last 24h. 🎉</Text>
          )}
          {sentry?.top_issues?.map((i, idx) => (
            <Text key={idx} style={text}>
              {i.permalink ? <Link href={i.permalink} style={link}>{i.title}</Link> : i.title}
              {' — '}{i.count} events{i.users ? `, ${i.users} users` : ''}{i.level ? ` (${i.level})` : ''}
            </Text>
          ))}
        </Section>

        <Hr style={hr} />

        <Section style={section}>
          <Heading as="h2" style={h2}>📈 PostHog — Top Events</Heading>
          {!posthog?.enabled && <Text style={muted}>{posthog?.note || 'PostHog not configured.'}</Text>}
          {posthog?.enabled && posthog.error && <Text style={muted}>Error: {posthog.error}</Text>}
          {posthog?.top_events?.map((e, idx) => (
            <Text key={idx} style={text}><strong>{e.event}</strong> — {e.count.toLocaleString()}</Text>
          ))}
        </Section>

        <Text style={footer}>Sent by Kayla Ops · 1325.AI</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: DailyOpsDigestEmail,
  subject: (d: Record<string, any>) => `🛡️ 1325.AI Daily Ops Digest — ${d?.date || ''}`,
  displayName: 'Daily Ops Digest',
  previewData: {
    date: '2026-05-23',
    metrics: [
      { label: 'New users', value: 12 },
      { label: 'New businesses', value: 3 },
      { label: 'New bookings', value: 7 },
      { label: 'New reviews', value: 2 },
      { label: 'QR scans', value: 41 },
      { label: 'Kayla agent runs', value: 88 },
    ],
    sentry: { enabled: false, note: 'Add Sentry secrets to enable.' },
    posthog: { enabled: false, note: 'Add PostHog secrets to enable.' },
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }
const container = { padding: '24px', maxWidth: '640px', margin: '0 auto' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#003366', margin: '0 0 4px' }
const subtitle = { fontSize: '13px', color: '#888888', margin: '0 0 24px' }
const section = { margin: '0 0 16px' }
const h2 = { fontSize: '16px', fontWeight: 'bold' as const, color: '#003366', margin: '0 0 8px' }
const text = { fontSize: '14px', color: '#333333', margin: '4px 0', lineHeight: '1.5' }
const muted = { fontSize: '13px', color: '#888888', margin: '4px 0' }
const metricRow = { fontSize: '14px', color: '#333333', display: 'flex', justifyContent: 'space-between', margin: '6px 0', borderBottom: '1px solid #f0f0f0', paddingBottom: '6px' }
const metricValue = { color: '#003366' }
const link = { color: '#003366', textDecoration: 'underline' }
const hr = { borderColor: '#eeeeee', margin: '20px 0' }
const footer = { fontSize: '11px', color: '#aaaaaa', textAlign: 'center' as const, marginTop: '32px' }
