import { intakeAvailability } from './intake-policy';

export const RELIABILITY_AREAS = [
  { id: 'backup', title: 'Backups', status: 'Not independently verified',
    requirements: ['Confirm approved healthcare hosting and written coverage for every backup service.', 'Define encrypted copies, access restrictions, retention and deletion with the clinic.', 'Document monitoring, failed-backup escalation and an accountable operations contact.', 'Verify a usable backup through an independently witnessed recovery test.'],
    evidence: ['Approved backup destination', 'Retention policy', 'Latest verified backup', 'Monitoring evidence'],
    steps: ['Identify approved records and destinations', 'Agree retention and access controls', 'Validate backup integrity', 'Record independent verification'] },
  { id: 'recovery', title: 'Recovery', status: 'Recovery test not performed',
    requirements: ['Agree acceptable downtime and acceptable data loss; no targets have been supplied.', 'Prepare a downtime procedure, escalation contacts and a clinic communication plan.', 'Test restoration in an isolated approved environment and reconcile restored records.', 'Document measured recovery results, unresolved issues and independent review before release.'],
    evidence: ['Downtime target', 'Data-loss target', 'Last recovery test', 'Measured recovery result'],
    steps: ['Confirm incident scope and authorization', 'Restore an isolated approved copy', 'Reconcile integrity and access', 'Obtain independent release review'] },
  { id: 'migration', title: 'Clinic migration', status: 'No records imported',
    requirements: ['Confirm clinic authorization, source-system export rights and approved destinations.', 'Map patient identity, dates, units, allergies, medicines, documents and source provenance.', 'Reconcile counts and missing or conflicting records without automatically merging patients.', 'Require clinician validation, a rollback plan and independent cutover approval.'],
    evidence: ['Authorized source system', 'Mapping approval', 'Reconciliation report', 'Cutover approval'],
    steps: ['Inventory authorized source records', 'Review mapping and identity exceptions', 'Validate in an isolated approved environment', 'Reconcile with clinician review', 'Confirm rollback and cutover approval'] },
] as const;

/** Preparation is not evidence of functioning infrastructure or approval. */
export function enterpriseReliability() {
  const intake = intakeAvailability();
  return {
    areas: RELIABILITY_AREAS,
    healthcareClearance: intake.cmeUpload ? 'requires_independent_verification' : 'blocked',
    backupStatus: 'unverified', recoveryStatus: 'not_tested', migrationStatus: 'not_started',
    uptimeCommitment: null, downtimeTargetMinutes: null, dataLossTargetMinutes: null,
    backupDestination: null, lastBackupAt: null, lastRecoveryTestAt: null,
    importedRecordCount: null, sourceSystem: null, independentApproval: null,
    canBackUp: false, canRestore: false, canImport: false, canApprove: false, canExport: false,
  } as const;
}