import originalOutcome from './validator-outcome-original.json';
export { originalOutcome };
/** Original warning order, disposition backed by the separately recorded rerun. */
export const WARNING_REVIEW = [
  { number: 1, area: 'Patient summary', status: 'Resolved', action: 'Added an accurate fictional patient narrative; identifiers remain unissued.' },
  { number: 2, area: 'Celsius unit checking', status: 'Resolved', action: 'Terminology-enabled rerun no longer reports the offline Cel warning; quantity remains 36.8 °C.' },
  { number: 3, area: 'Celsius code checking', status: 'Resolved', action: 'Terminology-enabled rerun no longer reports the second offline UCUM warning; Cel was not changed.' },
  { number: 4, area: 'Observation performer', status: 'Resolved', action: 'Linked only the existing fictional professional; note explicitly says no actual service or measurement occurred.' },
  { number: 5, area: 'Facility terminology address', status: 'Publisher clarification required', action: 'Pinned profile requires a different address from the packaged CodeSystem. Preserved the required address; no fabricated alias or real identifier.' },
  { number: 6, area: 'Standard identifier type', status: 'Publisher clarification required', action: 'Trial addition of standard FI coding violated the pinned profile and was removed. Original extensible-binding warning remains; request a publisher-consistent profile correction.' },
  { number: 7, area: 'Facility summary', status: 'Resolved', action: 'Added a narrative stating inactive, fictional and not a registered provider.' },
  { number: 8, area: 'Professional summary', status: 'Resolved', action: 'Added a narrative stating inactive, fictional and without verified credentials.' },
  { number: 9, area: 'Professional role summary', status: 'Resolved', action: 'Added a narrative describing only the inactive sample affiliation and classification.' },
] as const;