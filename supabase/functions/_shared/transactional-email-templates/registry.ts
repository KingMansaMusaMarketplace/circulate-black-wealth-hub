// Transactional Email Template Registry
// Each template must satisfy the TemplateEntry interface.
// To add a new template:
//   1. Create a .tsx file in this directory
//   2. Export: export const template = { ... } satisfying TemplateEntry
//   3. Import and register it in the TEMPLATES map below

import type { ComponentType } from 'npm:react@18.3.1'

export interface TemplateEntry {
  /** The React Email component to render */
  component: ComponentType<any>
  /** Email subject — static string or function of template data */
  subject: string | ((data: Record<string, any>) => string)
  /** Human-readable name for the template */
  displayName?: string
  /** Sample data for previewing the template */
  previewData?: Record<string, any>
  /** Fixed recipient — overrides caller-provided recipientEmail */
  to?: string
}

// ── Register templates below ──────────────────────────────────────────
// Example:
//   import { template as welcomeTemplate } from './welcome.tsx'
//   TEMPLATES['welcome'] = welcomeTemplate

export const TEMPLATES: Record<string, TemplateEntry> = {}
