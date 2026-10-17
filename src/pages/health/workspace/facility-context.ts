/** Fictional presentation IDs, never clinic IDs or access grants. */
export const SAMPLE_FACILITIES = [
  { id: 'sample-practice', name: 'Sample Medical Practice', kind: 'practice', departments: ['Primary Care'] },
  { id: 'sample-hospital', name: 'Sample Hospital · Main Campus', kind: 'hospital', departments: ['Primary Care', 'Orthopedics', 'Cardiology'] },
  { id: 'sample-outpatient', name: 'Sample Hospital · Outpatient Center', kind: 'hospital', departments: ['Primary Care', 'Orthopedics'] },
] as const;
export type FacilityContext = { facilityId: string; department: string };
export const DEFAULT_FACILITY_CONTEXT: FacilityContext = { facilityId: 'sample-practice', department: 'Primary Care' };
export function resolveFacilityContext(context: FacilityContext) {
  const facility = SAMPLE_FACILITIES.find((item) => item.id === context.facilityId);
  if (!facility) throw new Error('Unknown fictional facility');
  if (!facility.departments.some((name) => name === context.department)) throw new Error('Department does not belong to this fictional facility');
  return { facility, fictional: true as const };
}
export function changeSampleFacility(facilityId: string): FacilityContext {
  const facility = SAMPLE_FACILITIES.find((item) => item.id === facilityId);
  if (!facility) throw new Error('Unknown fictional facility');
  return { facilityId, department: facility.departments[0] };
}