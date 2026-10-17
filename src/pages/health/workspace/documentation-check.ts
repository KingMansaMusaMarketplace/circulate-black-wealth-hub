import { findVisit } from './sample-visits';

type Found = { label: string; line: number; quote: string };
type Missing = { code: string; label: string };
type Template = { found: Found[]; missing: Missing[] };

const templates: Record<string, Template> = {
  'visit-back-pain-v1': {
    found: [
      { label: 'Reason for visit', line: 1, quote: 'Doctor: Hi Avery, this is a follow-up for your low back pain. This is a fictional sample visit.' },
      { label: 'Symptom severity', line: 2, quote: 'Patient: The pain is better than last month, maybe a 4 out of 10 now.' },
      { label: 'Exam findings', line: 5, quote: 'Doctor: Your strength is 5 out of 5 in both legs and the straight leg raise is negative.' },
      { label: 'Assessment', line: 7, quote: 'Doctor: My impression is improving mechanical low back pain.' },
      { label: 'Plan', line: 8, quote: 'Doctor: Keep doing the home exercises and try standing breaks every 45 minutes.' },
      { label: 'Follow-up', line: 9, quote: 'Doctor: I will see you again in six weeks.' },
    ],
    missing: [
      { code: 'visit_time', label: 'Total visit time is not documented.' },
      { code: 'medication_review', label: 'No medication review is documented.' },
    ],
  },
  'visit-blood-pressure-v1': {
    found: [
      { label: 'Reason for visit', line: 1, quote: 'Doctor: Good morning Sam, we are checking your blood pressure today. This is a fictional sample visit.' },
      { label: 'Medicine adherence', line: 2, quote: 'Patient: I have been taking the pill most days, but I miss it maybe twice a week.' },
      { label: 'Vital signs', line: 4, quote: 'Doctor: Today your blood pressure is 142 over 90 and your heart rate is 78.' },
      { label: 'Exam findings', line: 5, quote: 'Doctor: Heart and lung exam sound normal.' },
      { label: 'Assessment', line: 6, quote: 'Doctor: Your blood pressure is still above goal.' },
      { label: 'Follow-up', line: 8, quote: 'Doctor: Please check your blood pressure at home and bring the log in four weeks.' },
    ],
    missing: [
      { code: 'medication_name', label: 'Medicine name and dose are not documented.' },
      { code: 'headache_details', label: 'Headache details (how long, how severe) are not documented.' },
      { code: 'visit_time', label: 'Total visit time is not documented.' },
    ],
  },
  'visit-knee-v1': {
    found: [
      { label: 'How the injury happened', line: 2, quote: 'Patient: I twisted my right knee playing basketball three days ago.' },
      { label: 'Exam findings', line: 4, quote: 'Doctor: There is moderate swelling of the right knee and tenderness along the inside joint line.' },
      { label: 'Exam limitation', line: 5, quote: 'Doctor: Ligament testing is limited today because of pain.' },
      { label: 'Assessment (unconfirmed)', line: 6, quote: 'Doctor: I am concerned about a possible meniscus injury, but I cannot confirm that today.' },
      { label: 'Imaging ordered', line: 8, quote: 'Doctor: We will order an MRI of the right knee.' },
    ],
    missing: [
      { code: 'mri_reason', label: 'The medical reason for the MRI order is not tied to specific findings in writing.' },
      { code: 'pain_severity', label: 'Pain severity is not documented.' },
      { code: 'follow_up', label: 'A follow-up plan or date is not documented.' },
      { code: 'visit_time', label: 'Total visit time is not documented.' },
    ],
  },
};

/** Fictional documentation check. Never suggests billing codes or visit levels and never approves payment. */
export function checkSampleDocumentation(visitId: string) {
  const visit = findVisit(visitId);
  const template = templates[visitId];
  if (!visit || !template) throw new Error('Unknown sample visit');
  for (const f of template.found) if (visit.lines[f.line - 1] !== f.quote) throw new Error('Documentation source changed; review required');
  return {
    visitId, found: template.found, missing: template.missing,
    status: 'draft' as const, fictional: true as const, suggestsCodes: false as const, canSubmitClaim: false as const,
  };
}
export type SampleDocumentationCheck = ReturnType<typeof checkSampleDocumentation>;
