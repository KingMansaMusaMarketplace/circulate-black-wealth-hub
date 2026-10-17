import { findVisit } from './sample-visits';

export type GuideLanguage = 'en' | 'es';
type Translation = Record<GuideLanguage, string>;
type Item = { line: number; quote: string; text: Translation };
type Gap = 'exercise_details' | 'medicine_details' | 'monitoring_frequency' | 'ice_and_brace_details' | 'follow_up_timing' | 'urgent_care_instructions';
type Template = { summary: Item; plan: Item[]; gaps: Gap[] };
const templates: Record<string, Template> = {
  'visit-back-pain-v1': {
    summary: { line: 7, quote: 'Doctor: My impression is improving mechanical low back pain.', text: { en: 'The doctor thinks your lower back pain is getting better.', es: 'El médico cree que su dolor en la parte baja de la espalda está mejorando.' } },
    plan: [
      { line: 8, quote: 'Doctor: Keep doing the home exercises and try standing breaks every 45 minutes.', text: { en: 'Keep doing your home exercises. Try taking a break to stand every 45 minutes.', es: 'Siga haciendo sus ejercicios en casa. Intente levantarse cada 45 minutos.' } },
      { line: 9, quote: 'Doctor: I will see you again in six weeks.', text: { en: 'See the doctor again in six weeks.', es: 'Vuelva a ver al médico en seis semanas.' } },
    ], gaps: ['exercise_details', 'urgent_care_instructions'],
  },
  'visit-blood-pressure-v1': {
    summary: { line: 6, quote: 'Doctor: Your blood pressure is still above goal.', text: { en: 'Your blood pressure is still higher than the doctor’s goal.', es: 'Su presión arterial sigue por encima de la meta del médico.' } },
    plan: [
      { line: 7, quote: 'Doctor: Let us work on taking the medicine every day, and I may adjust the dose next time.', text: { en: 'Work on taking your medicine every day. The doctor may change the dose at the next visit; no dose change is documented here.', es: 'Procure tomar su medicamento todos los días. El médico podría cambiar la dosis en la próxima visita; aquí no se documenta ningún cambio de dosis.' } },
      { line: 8, quote: 'Doctor: Please check your blood pressure at home and bring the log in four weeks.', text: { en: 'Check your blood pressure at home. Write down the readings and bring them in four weeks.', es: 'Mida su presión arterial en casa. Anote las lecturas y tráigalas en cuatro semanas.' } },
    ], gaps: ['medicine_details', 'monitoring_frequency', 'urgent_care_instructions'],
  },
  'visit-knee-v1': {
    summary: { line: 6, quote: 'Doctor: I am concerned about a possible meniscus injury, but I cannot confirm that today.', text: { en: 'The doctor is concerned about a possible injury to the cartilage in your knee, called the meniscus. It is not confirmed.', es: 'Al médico le preocupa una posible lesión del cartílago de la rodilla, llamado menisco. No está confirmada.' } },
    plan: [
      { line: 7, quote: 'Doctor: Use ice, rest, and the knee brace for now.', text: { en: 'For now, use ice, rest, and your knee brace.', es: 'Por ahora, use hielo, descanse y use la rodillera.' } },
      { line: 8, quote: 'Doctor: We will order an MRI of the right knee.', text: { en: 'The doctor plans to order a magnetic resonance imaging (MRI) scan of your right knee. No result is included.', es: 'El médico planea solicitar una resonancia magnética de su rodilla derecha. No se incluye ningún resultado.' } },
    ], gaps: ['ice_and_brace_details', 'follow_up_timing', 'urgent_care_instructions'],
  },
};
const gapLabels: Record<Gap, Translation> = {
  exercise_details: { en: 'The exercises and how often to do them are not described.', es: 'No se describen los ejercicios ni con qué frecuencia hacerlos.' },
  medicine_details: { en: 'Medicine name, dose, and timing are missing. The doctor must confirm them.', es: 'Faltan el nombre, la dosis y el horario del medicamento. El médico debe confirmarlos.' },
  monitoring_frequency: { en: 'How often to check blood pressure is not stated.', es: 'No se indica con qué frecuencia medir la presión arterial.' },
  ice_and_brace_details: { en: 'Ice duration and brace instructions are not supplied.', es: 'No se indica cuánto tiempo usar hielo ni cómo usar la rodillera.' },
  follow_up_timing: { en: 'A follow-up date is not supplied.', es: 'No se indica una fecha de seguimiento.' },
  urgent_care_instructions: { en: 'Warning signs and when to seek urgent care are not documented. The doctor must supply these instructions.', es: 'No se documentan señales de alarma ni cuándo buscar atención urgente. El médico debe proporcionar estas instrucciones.' },
};

/** Fixed paraphrases only; do not accept clinical text or inherit a note's approval. */
export function buildSampleCareGuide(visitId: string, language: GuideLanguage) {
  const visit = findVisit(visitId);
  const template = templates[visitId];
  if (!visit || !template || (language !== 'en' && language !== 'es')) throw new Error('Unknown sample visit or language');
  const localize = (item: Item) => {
    if (visit.lines[item.line - 1] !== item.quote) throw new Error('Care guide source changed; review required');
    return { text: item.text[language], line: item.line, quote: item.quote };
  };
  return {
    visitId, language, summary: localize(template.summary), plan: template.plan.map(localize),
    gaps: template.gaps.map((code) => ({ code, text: gapLabels[code][language] })),
    status: 'draft' as const, fictional: true as const, canDeliver: false as const,
  };
}
export type SampleCareGuide = ReturnType<typeof buildSampleCareGuide>;