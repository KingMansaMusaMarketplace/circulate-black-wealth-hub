import outcome from './validator-outcome.json';
import { checkFictionalRoundTrip, exportFictionalBundle, facilityReference, manifest } from './pilot';

export function prepareFacilityReExport(facilityId: string, checked: boolean) {
  if (facilityId !== 'fictional') throw new Error('No fictional packet exists for this facility reference.');
  if (!checked) throw new Error('Check the unchanged fictional packet before re-export.');
  const content = exportFictionalBundle();
  checkFictionalRoundTrip(content);
  return { content, filename: '1325-fictional-kenya-fhir.json' };
}

export function getFacilityStatuses(checked: boolean, downloaded: boolean) {
  return [
    {
      id: 'fictional', name: '1325 Fictional Facility', identifier: 'Unissued test identifier',
      kind: 'Fictional sample', exportStatus: downloaded ? 'Local download requested' : checked ? 'Available for local download' : 'Read-back required',
      readBack: checked ? 'Checked this session' : 'Not checked this session',
      validationDate: manifest.validatedOn,
      canReExport: checked,
      errors: outcome.issue.filter(i => i.severity === 'error' || i.severity === 'fatal').length,
      warnings: outcome.issue.filter(i => i.severity === 'warning').length,
      findings: outcome.issue, transport: 'Not connected',
    },
    {
      id: 'public-reference', name: facilityReference.name, identifier: `${facilityReference.codeLabel}: ${facilityReference.code}`,
      kind: 'Public reference only', exportStatus: 'No export tested', readBack: 'Not applicable',
      validationDate: null, canReExport: false, errors: null, warnings: null, findings: [], transport: 'Not connected',
    },
  ];
}