import type { SponsorProspect } from '@/hooks/use-sponsor-crm';
import { getSponsorMeta } from '@/utils/sponsorOutreachEmail';

const HEADERS = [
  'Company',
  'Industry',
  'Tier',
  'Owner',
  'Stage',
  'Expected tier',
  'Deal value',
  'Contact name',
  'Contact email',
  'Phone',
  'Website',
  'Partnership portal',
  'Last contact',
  'Next follow-up',
];

const escape = (value: unknown) => {
  const text = value == null ? '' : String(value);
  return `"${text.replace(/"/g, '""')}"`;
};

export const buildSponsorCsv = (prospects: SponsorProspect[]): string => {
  const rows = prospects.map((p) => {
    const meta = getSponsorMeta(p);
    return [
      p.company_name,
      p.industry,
      meta.tier ?? '',
      meta.owner ?? '',
      p.pipeline_stage,
      p.expected_tier,
      p.deal_value,
      p.primary_contact_name,
      p.primary_contact_email,
      p.primary_contact_phone ?? meta.phone ?? '',
      p.website,
      meta.portal_url ?? '',
      p.last_contact_at ? new Date(p.last_contact_at).toLocaleDateString() : '',
      p.next_follow_up ? new Date(p.next_follow_up).toLocaleDateString() : '',
    ].map(escape).join(',');
  });
  return [HEADERS.map(escape).join(','), ...rows].join('\n');
};

export const downloadSponsorCsv = (prospects: SponsorProspect[], filename = 'sponsor-prospects.csv') => {
  const blob = new Blob([buildSponsorCsv(prospects)], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
