import { describe, it, expect } from 'vitest';
import { buildSponsorCsv } from '@/utils/sponsorCsv';

describe('buildSponsorCsv', () => {
  it('neutralizes spreadsheet formulas in prospect fields', () => {
    const csv = buildSponsorCsv([
      {
        id: '1',
        company_name: '=HYPERLINK("http://evil.test","Click")',
        industry: '+cmd',
        primary_contact_name: '@SUM(A1)',
        primary_contact_email: '-2+3',
        pipeline_stage: 'research',
      } as any,
    ]);
    const row = csv.split('\n')[1];
    expect(row.startsWith(`"'=HYPERLINK(""http://evil.test"",""Click"")"`)).toBe(true);
    expect(row).toContain(`"'+cmd"`);
    expect(row).toContain(`"'@SUM(A1)"`);
    expect(row).toContain(`"'-2+3"`);
  });
});
