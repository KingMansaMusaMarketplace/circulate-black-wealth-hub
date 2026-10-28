import outcome from './validator-outcome.json';
import { facilityReference, manifest } from './pilot';

export function getFacilityStatuses(checked: boolean, downloaded: boolean) {
  return [
    {
      id: 'fictional', name: '1325 Fictional Facility', identifier: 'Unissued test identifier',
      kind: 'Fictional sample', exportStatus: downloaded ? 'Local download requested' : checked ? 'Available for local download' : 'Read-back required',
      readBack: checked ? 'Checked this session' : 'Not checked this session',
      validationDate: manifest.validatedOn,
      errors: outcome.issue.filter(i => i.severity === 'error' || i.severity === 'fatal').length,
      warnings: outcome.issue.filter(i => i.severity === 'warning').length,
      findings: outcome.issue, transport: 'Not connected',
    },
    {
      id: 'public-reference', name: facilityReference.name, identifier: `${facilityReference.codeLabel}: ${facilityReference.code}`,
      kind: 'Public reference only', exportStatus: 'No export tested', readBack: 'Not applicable',
      validationDate: null, errors: null, warnings: null, findings: [], transport: 'Not connected',
    },
  ];
}