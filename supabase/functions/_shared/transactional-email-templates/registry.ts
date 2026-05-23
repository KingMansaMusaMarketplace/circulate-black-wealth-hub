/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as contactConfirmation } from './contact-confirmation.tsx'
import { template as businessContactNotification } from './business-contact-notification.tsx'
import { template as bookingConfirmation } from './booking-confirmation.tsx'
import { template as betaTesterWelcome } from './beta-tester-welcome.tsx'
import { template as businessLiveConfirmation } from './business-live-confirmation.tsx'
import { template as leaseSavedSearchMatches } from './lease-saved-search-matches.tsx'
import { template as dailyOpsDigest } from './daily-ops-digest.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'contact-confirmation': contactConfirmation,
  'business-contact-notification': businessContactNotification,
  'booking-confirmation': bookingConfirmation,
  'beta-tester-welcome': betaTesterWelcome,
  'business-live-confirmation': businessLiveConfirmation,
  'lease-saved-search-matches': leaseSavedSearchMatches,
  'daily-ops-digest': dailyOpsDigest,
}
