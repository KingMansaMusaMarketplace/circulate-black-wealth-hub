// Draft BAA request emails. These only ASK vendors for their agreement and
// healthcare plan details; nothing here signs or accepts any terms.

export interface BaaRequestEmail {
  vendor: string;
  sendTo: string;
  subject: string;
  body: string;
}

const SIGNATURE = `Thomas D. Bowling
Founder, Chairman & CEO
MANSA MUSA MARKETPLACE, INC. | 1325.AI
Partner@1325.AI | Office: (312) 900-6004
1000 E. 111th St, Suite 1100, Chicago, IL 60628
www.1325.ai`;

const COMMON_QUESTIONS = `1. Will you sign a Business Associate Agreement (BAA) with us, and which plan does it require?
2. Which of your products and features are covered by the BAA?
3. What does the required plan cost per month or year?
4. Can you send your standard BAA so our healthcare attorney can review it before anything is signed?`;

const intro = (service: string) => `Hello,

I'm the founder of 1325.AI. We are building 1325 Clinical, an electronic medical record (EMR / EHR) for independent clinics. Today it runs only on fictional sample data. Before we accept any real patient information, every service that could touch it must be covered by a signed BAA reviewed by our healthcare attorney.

We currently use your service for ${service}.`;

const close = `Please do not send or request any patient information as part of this conversation. Nothing in this email accepts or signs any agreement; all terms will be reviewed by our attorney first.

Thank you,

${SIGNATURE}`;

export const BAA_REQUEST_EMAILS: BaaRequestEmail[] = [
  {
    vendor: 'Supabase',
    sendTo: 'Supabase HIPAA request form: forms.supabase.com/hipaa2 (paste this message into the form)',
    subject: 'BAA and HIPAA add-on request - 1325.AI (1325 Clinical)',
    body: `${intro('our database, sign-in and file storage')}

Your documentation says patient data requires a signed BAA, the HIPAA add-on and a High Compliance project. We'd like to start that process.

${COMMON_QUESTIONS}
5. What is the price of the HIPAA add-on on the Team plan, and is Point-in-Time Recovery priced separately?
6. Can our existing project be upgraded, or do you recommend a new High Compliance project?

${close}`,
  },
  {
    vendor: 'OpenAI',
    sendTo: 'baa@openai.com (or self-serve: API Platform > Settings > Organization > General)',
    subject: 'BAA request for OpenAI API - 1325.AI (1325 Clinical)',
    body: `${intro('AI writing and real-time voice conversations through the OpenAI API')}

${COMMON_QUESTIONS}
5. Are the Realtime (voice) API and speech-to-text included as HIPAA-eligible services?
6. What retention settings are required for covered use?

${close}`,
  },
  {
    vendor: 'Twilio',
    sendTo: 'Twilio sales or your Twilio account manager (twilio.com/en-us/hipaa)',
    subject: 'Business Associate Addendum request - 1325.AI (1325 Clinical)',
    body: `${intro('text messages and phone calls')}

We understand HIPAA accounts require Security Edition or Enterprise Edition.

${COMMON_QUESTIONS}
5. What is the price of Security Edition for a small, early-stage account?
6. Are SMS and voice both on the HIPAA-eligible products list?

${close}`,
  },
  {
    vendor: 'ElevenLabs',
    sendTo: 'ElevenLabs enterprise sales (elevenlabs.io/enterprise)',
    subject: 'Enterprise BAA request - 1325.AI (1325 Clinical)',
    body: `${intro('spoken voice')}

We understand BAAs are offered on Enterprise subscriptions with Zero Retention Mode.

${COMMON_QUESTIONS}
5. Is text-to-speech covered, or only ElevenLabs Agents?
6. What is the minimum Enterprise commitment?

${close}`,
  },
  {
    vendor: 'Resend',
    sendTo: 'Resend sales (resend.com/enterprise)',
    subject: 'Do you offer a HIPAA BAA? - 1325.AI (1325 Clinical)',
    body: `${intro('sending account and notification emails')}

We could not find a published BAA on your website, so we'd like to confirm directly.

${COMMON_QUESTIONS}
5. If a BAA is not available today, is one planned, and roughly when?

${close}`,
  },
  {
    vendor: 'Lovable',
    sendTo: 'Lovable sales (Enterprise contact form)',
    subject: 'Written confirmation on BAA availability - 1325.AI',
    body: `Hello,

I'm the founder of 1325.AI, a Lovable Business customer. We are building 1325 Clinical, an electronic medical record that today runs only on fictional sample data.

Your published terms say Lovable does not currently sign Business Associate Agreements and does not allow patient information. We plan to keep all patient information out of Lovable hosting and Lovable AI.

Could you please confirm in writing:
1. That no Lovable plan, including Enterprise, offers a BAA today.
2. Whether a BAA is planned, and roughly when.
3. Whether you have guidance for customers who keep patient data in separate BAA-covered services.

${close}`,
  },
];
