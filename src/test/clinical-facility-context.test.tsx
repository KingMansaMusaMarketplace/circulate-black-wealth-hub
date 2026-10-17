import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import FacilitySelector from '@/pages/health/FacilitySelector';
import { DEFAULT_FACILITY_CONTEXT, SAMPLE_FACILITIES, changeSampleFacility, resolveFacilityContext } from '@/pages/health/workspace/facility-context';
import { intakeAvailability } from '@/pages/health/workspace/intake-policy';
afterEach(cleanup);
describe('fictional facility selection', () => {
  it('keeps practice and hospital examples in one fictional selector', () => {
    expect(resolveFacilityContext(DEFAULT_FACILITY_CONTEXT).facility.kind).toBe('practice');
    expect(resolveFacilityContext(changeSampleFacility('sample-hospital')).facility.kind).toBe('hospital');
    for (const facility of SAMPLE_FACILITIES) expect(resolveFacilityContext(changeSampleFacility(facility.id)).fictional).toBe(true);
  });
  it('resets department when changing facility', () => {
    expect(resolveFacilityContext({ facilityId: 'sample-hospital', department: 'Cardiology' }).facility.id).toBe('sample-hospital');
    expect(changeSampleFacility('sample-outpatient')).toEqual({ facilityId: 'sample-outpatient', department: 'Primary Care' });
  });
  it('rejects real clinic IDs and unrelated departments', () => {
    expect(() => changeSampleFacility('actual-clinic')).toThrow();
    expect(() => resolveFacilityContext({ facilityId: 'sample-practice', department: 'Cardiology' })).toThrow();
  });
  it('never unlocks records, agreements or calls in hospital context', () => {
    for (const facility of SAMPLE_FACILITIES) {
      resolveFacilityContext(changeSampleFacility(facility.id));
      expect(intakeAvailability()).toEqual({ agreementUpload: false, cmeUpload: false, patientCalls: false });
    }
  });
  it('changes facility and department through the controls', () => {
    function Harness() {
      const [value, setValue] = useState(DEFAULT_FACILITY_CONTEXT);
      return <><FacilitySelector value={value} onChange={setValue} /><output aria-label="Selected context">{value.facilityId}:{value.department}</output></>;
    }
    render(<Harness />);
    fireEvent.keyDown(screen.getByRole('combobox', { name: 'Facility' }), { key: 'ArrowDown' });
    fireEvent.click(screen.getByRole('option', { name: 'Sample Hospital · Main Campus' }));
    fireEvent.keyDown(screen.getByRole('combobox', { name: 'Department' }), { key: 'ArrowDown' });
    fireEvent.click(screen.getByRole('option', { name: 'Cardiology' }));
    expect(screen.getByLabelText('Selected context').textContent).toBe('sample-hospital:Cardiology');
    fireEvent.keyDown(screen.getByRole('combobox', { name: 'Facility' }), { key: 'ArrowDown' });
    fireEvent.click(screen.getByRole('option', { name: 'Sample Medical Practice' }));
    expect(screen.getByLabelText('Selected context').textContent).toBe('sample-practice:Primary Care');
  });
});