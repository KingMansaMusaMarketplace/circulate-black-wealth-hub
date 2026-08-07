/**
 * Kayla's plain-English explanations for every Admin Hub tool.
 * Written in her voice: warm, direct, no jargon, always one clear next step.
 */

export interface KaylaGuideEntry {
  /** What the feature is, in one sentence. */
  what: string;
  /** Why an administrator should care. */
  why: string;
  /** The single most useful action to take here. */
  doThis: string;
}

export const KAYLA_GUIDE: Record<string, KaylaGuideEntry> = {
  // Needs Attention
  'admin-submissions': {
    what: "Every business that filled out the signup form on our homepage lands here first.",
    why: "These are real people waiting on us. The longer they sit, the more likely they walk away.",
    doThis: "Work this list first thing each morning — approve the real ones, delete the junk.",
  },
  verifications: {
    what: "Businesses that asked to be marked as verified Black-owned.",
    why: "Verification is the promise our whole directory rests on. If we get it wrong, we lose trust.",
    doThis: "Open each one, check the proof they submitted, then approve or send it back with a reason.",
  },
  'business-review': {
    what: "Businesses my discovery robots found or flagged that a human needs to eyeball.",
    why: "I'm good, but I'm not perfect. This is where you catch the ones I wasn't sure about.",
    doThis: "Click the website link, confirm it's really Black-owned, then tap the Black-owned badge to verify.",
  },
  moderation: {
    what: "Photos, reviews, and listings that got flagged as possibly inappropriate.",
    why: "One bad photo on the directory reflects on the whole brand.",
    doThis: "Review the flagged item and either clear it or remove it — takes seconds.",
  },
  support: {
    what: "Help requests written in by our users and business owners.",
    why: "Fast replies turn a frustrated user into a loyal one.",
    doThis: "Answer the oldest ticket first, then close it out so it stops counting against us.",
  },
  'admin-fraud': {
    what: "Suspicious activity I've spotted — odd signups, strange point activity, repeat abuse.",
    why: "Catching this early protects our loyalty points and our sponsors' money.",
    doThis: "Press Run Analysis, then look at anything I've marked high risk.",
  },

  // Dashboard
  overview: {
    what: "The big picture: users, businesses, revenue, and growth, all on one screen.",
    why: "This is the screen to look at when someone asks 'how are we doing?'",
    doThis: "Glance at the growth number — if it's flat two weeks running, we've got a marketing problem.",
  },
  valuation: {
    what: "What the company is worth on paper, plus the numbers investors ask about.",
    why: "Investor conversations go better when these figures are current.",
    doThis: "Check this before any investor call so your numbers match the portal.",
  },
  growth: {
    what: "How new people are finding us and whether they bring others with them.",
    why: "Growth loops are cheaper than ads. This tells you which loop is actually spinning.",
    doThis: "Find your best-performing channel and put more effort there.",
  },
  'admin-revenue': {
    what: "Money in: subscription revenue by tier, monthly recurring revenue, and payouts.",
    why: "This is the truth about the business, separate from any projection.",
    doThis: "Compare this month to last month — that difference is the real story.",
  },

  // Analytics & SEO
  retention: {
    what: "Whether people who sign up actually stick around and come back.",
    why: "Signing people up is easy. Keeping them is the business.",
    doThis: "Look at where the drop-off happens and fix that step of the experience.",
  },
  geographic: {
    what: "Where our users and businesses are, on a map.",
    why: "It shows which cities are ready for a real launch push.",
    doThis: "Pick the strongest city outside Atlanta and plan an outreach round there.",
  },
  'admin-funnel': {
    what: "Step-by-step: how many people visit, start signing up, and finish.",
    why: "It tells you exactly where we're losing people in the signup flow.",
    doThis: "Find the step with the biggest drop and simplify it.",
  },
  'admin-seo': {
    what: "How we rank on Google for the searches that matter to us.",
    why: "Free traffic from search is our cheapest customer.",
    doThis: "Look at keywords sitting on page two — small fixes can move them to page one.",
  },
  'admin-backlinks': {
    what: "Other websites that link to us, and the ones that should but don't yet.",
    why: "Links from respected sites are what pushes us up in Google.",
    doThis: "Pick one gap site and ask them for a mention.",
  },
  'partner-success': {
    what: "Written success stories from partners we can use in sales and marketing.",
    why: "Proof from a real partner closes deals faster than any pitch deck.",
    doThis: "Add a fresh story after any big partner win — while it's still fresh.",
  },

  // Users & Access
  users: {
    what: "Every account on the platform, with the power to edit or suspend them.",
    why: "It's where you handle a problem account or help someone who's locked out.",
    doThis: "Search by email to find one person fast instead of scrolling.",
  },
  'beta-testers': {
    what: "The people testing new features before everyone else sees them.",
    why: "They catch our mistakes before customers do.",
    doThis: "Add trusted users here before turning on anything new.",
  },
  roles: {
    what: "Who has admin power, and how much of it.",
    why: "Admin access is the keys to the building. Fewer keys, fewer problems.",
    doThis: "Review this list monthly and remove anyone who no longer needs access.",
  },
  impersonate: {
    what: "Lets you see the site exactly as one specific user sees it.",
    why: "The fastest way to understand a bug someone reported.",
    doThis: "Use it when a user says 'it's broken' and you can't reproduce it.",
  },

  // Content & Support
  audit: {
    what: "A permanent record of every important action taken on the platform, and by whom.",
    why: "If something changes and nobody knows why, the answer is in here.",
    doThis: "Check this first whenever something looks off.",
  },

  // Business & Directory
  'admin-import': {
    what: "Bulk-add businesses from a spreadsheet and put them on the map automatically.",
    why: "It's how we grow the directory by hundreds at a time instead of one by one.",
    doThis: "Upload your list, press Validate All, then fix whatever it flags before importing.",
  },
  agents: {
    what: "Our sales agents and how much business each one is bringing in.",
    why: "Shows who's producing and who needs coaching.",
    doThis: "Reach out to your top agent this week — keep them motivated.",
  },
  'admin-commissions': {
    what: "What we owe each sales agent, and what's already been paid.",
    why: "Agents stay loyal when they get paid on time, every time.",
    doThis: "Clear pending payouts before the end of the month.",
  },
  'admin-enterprise-partners': {
    what: "Enterprise accounts like AAMES — their leadership seats and chapters.",
    why: "These are our biggest contracts. They need attention, not autopilot.",
    doThis: "Confirm each chapter has an active leader assigned.",
  },
  financial: {
    what: "The full financial picture: income, expenses, and payouts.",
    why: "It's the book of record for the business.",
    doThis: "Reconcile this against your bank statement monthly.",
  },
  subscriptions: {
    what: "Who's paying us, on which plan, and whether their payment is current.",
    why: "A failed payment left alone quietly becomes a lost customer.",
    doThis: "Look for past-due accounts and reach out before they cancel.",
  },
  loyalty: {
    what: "The points, tiers, and rewards customers earn for shopping Black-owned.",
    why: "Points are what bring people back a second and third time.",
    doThis: "Make sure reward amounts still make sense as we grow.",
  },
  'qr-fraud': {
    what: "Watches for people gaming the QR code scans to farm free points.",
    why: "Every fake scan costs us real reward money.",
    doThis: "Investigate any account with an unusual number of scans in one day.",
  },
  partners: {
    what: "Organizations applying to partner with us.",
    why: "Each approved partner brings their whole membership with them.",
    doThis: "Respond within 48 hours — momentum matters in partnerships.",
  },
  'partner-onboarding': {
    what: "Where each new partner is in the setup process.",
    why: "Partners who stall during setup rarely come back on their own.",
    doThis: "Find anyone stuck on the same step for over a week and call them.",
  },
  developers: {
    what: "Outside developers building on our platform.",
    why: "They extend what we can do without us hiring anyone.",
    doThis: "Approve legitimate developers quickly so they stay interested.",
  },
  'admin-api-clients': {
    what: "The access keys other systems use to connect to us, and how much they're using.",
    why: "Unusual usage can mean either a big new customer or a problem.",
    doThis: "Revoke any key you don't recognize.",
  },
  ecosystem: {
    what: "How our partners and developers feed business to each other.",
    why: "This is the network effect that makes the platform hard to copy.",
    doThis: "Look for the connections working best and repeat them.",
  },

  // Sponsors & Outreach
  'sponsors-manage': {
    what: "Corporate sponsors currently paying to support the platform.",
    why: "Sponsorship dollars fund the free tier for small businesses.",
    doThis: "Check that every sponsor's logo and benefits are live on the site.",
  },
  'sponsor-crm': {
    what: "The pipeline of companies we're courting for sponsorship.",
    why: "Big sponsorships take months. This keeps them from going cold.",
    doThis: "Move at least one company forward a stage this week.",
  },
  'outreach-crm': {
    what: "Our outreach to directory businesses that haven't claimed their listing.",
    why: "A claimed listing is the first step toward a paying customer.",
    doThis: "Send a claim invitation batch and watch the response rate.",
  },
  'investor-portal-admin': {
    what: "Approve or deny people asking to see the private investor materials.",
    why: "That material is confidential — access should be deliberate, never automatic.",
    doThis: "Verify who they are before you approve. When in doubt, ask first.",
  },

  // Marketing
  promos: {
    what: "Discount codes you can create and hand out.",
    why: "A well-timed code closes a hesitant signup.",
    doThis: "Always set an expiration date so a code can't live forever.",
  },
  flags: {
    what: "On/off switches for features across the platform.",
    why: "It lets us turn something off instantly if it misbehaves — no code change needed.",
    doThis: "Flip a feature on for beta testers first, everyone else second.",
  },
  broadcasts: {
    what: "Send an announcement to everybody on the platform at once.",
    why: "It's the fastest way to reach the whole community.",
    doThis: "Read it out loud before you send it. There's no unsend.",
  },
  'admin-email-list': {
    what: "Our marketing email subscribers.",
    why: "The email list is the one audience no algorithm can take away from us.",
    doThis: "Export it regularly so we always have a backup copy.",
  },
  'admin-emails': {
    what: "How our email campaigns performed — opens, clicks, unsubscribes.",
    why: "It tells you which subject lines and offers actually land.",
    doThis: "Repeat whatever got the highest click rate.",
  },
  'admin-marketing-analytics': {
    what: "Which campaigns and channels are bringing in real signups.",
    why: "Keeps us from spending money on something that isn't working.",
    doThis: "Cut the worst channel and move that budget to the best one.",
  },
  'admin-marketing-materials': {
    what: "Downloadable flyers, decks, and one-pagers for the team to use.",
    why: "Everybody pitching from the same materials keeps our story consistent.",
    doThis: "Grab the latest deck before any outside meeting.",
  },
  'admin-sentiment': {
    what: "How people are feeling about us, based on what they write.",
    why: "It catches a problem while it's still a mood, not yet a crisis.",
    doThis: "Read the negative comments directly — that's where the fix is.",
  },
  'admin-heygen': {
    what: "Creates spokesperson videos without hiring a crew.",
    why: "Video converts better than text, and this makes it nearly free.",
    doThis: "Keep scripts under 60 seconds. Short videos get watched.",
  },

  // Stays & Rides
  'mansa-stays': {
    what: "Admin for our vacation rental service.",
    why: "Hosts and guests both need issues handled fast.",
    doThis: "Check for bookings flagged as needing attention.",
  },
  'noire-rideshare': {
    what: "Admin for our rideshare service — drivers and rides.",
    why: "Driver approvals are a safety matter, not a formality.",
    doThis: "Never approve a driver without completed background documents.",
  },

  // Legal & IP
  patents: {
    what: "Our USPTO patent filing packages and intellectual property exports.",
    why: "This is the moat around what we've built. Keep it organized.",
    doThis: "Confirm the filing numbers here match what the attorney has on file.",
  },

  // Data & Reports
  exports: {
    what: "Download platform data as a spreadsheet.",
    why: "For board reports, accountants, and any deep analysis outside the app.",
    doThis: "Export only what you need — this data is confidential.",
  },
  reports: {
    what: "Reports that generate and email themselves on a schedule.",
    why: "Set it once and you stop pulling the same numbers by hand.",
    doThis: "Schedule a Monday morning summary to your inbox.",
  },
  database: {
    what: "The health and speed of the system underneath everything.",
    why: "Slow database, slow website, frustrated users.",
    doThis: "If a query is flagged slow, tell your developer the name of it.",
  },
  backups: {
    what: "Copies of the platform's data, and the ability to restore them.",
    why: "It's the difference between a bad day and a catastrophe.",
    doThis: "Confirm the most recent backup is dated today.",
  },

  // System
  system: {
    what: "Platform-wide configuration and maintenance mode.",
    why: "Changes here affect every single user immediately.",
    doThis: "Change one setting at a time so you know what caused what.",
  },
  ai: {
    what: "My AI toolkit: analytics chat, insights, moderation help, fraud detection, and more.",
    why: "It's the work of several staff members, available on demand.",
    doThis: "Try the Analytics Chat tab and just ask a question in plain English.",
  },
  'admin-ai-workforce': {
    what: "The status board for all 42 Agentic AI Employees across our seven divisions.",
    why: "It shows you what your AI team is working on right now.",
    doThis: "Check that every division shows active — an idle division means work isn't getting done.",
  },
  'kayla-cost': {
    what: "What my AI work costs you, tracked in real time.",
    why: "AI should save money, not quietly spend it. This keeps me accountable.",
    doThis: "Compare my monthly cost against the payroll we'd otherwise be paying.",
  },
  'system-health': {
    what: "Live status of the database, login system, and site services.",
    why: "First place to look when someone says the site is down.",
    doThis: "If anything shows red, check it here before you start troubleshooting elsewhere.",
  },
  webhooks: {
    what: "Automatic notifications we send to other systems when something happens here.",
    why: "It's how we keep outside tools in sync without manual work.",
    doThis: "Remove any webhook pointing somewhere we no longer use.",
  },
  'api-tokens': {
    what: "Admin-level access keys for connecting to our system programmatically.",
    why: "These are powerful. Treat them like passwords.",
    doThis: "Never paste a token into an email or a chat.",
  },
  setup: {
    what: "A helper for initial database setup.",
    why: "Only needed when standing something up for the first time.",
    doThis: "Leave this alone unless a developer asks you to use it.",
  },
  archive: {
    what: "Features we've turned off but kept, in case we want them back.",
    why: "Nothing is lost — it's just resting.",
    doThis: "Browse it before asking to build something new. We may already have it.",
  },

  // Documentation
  'user-guide': {
    what: "The full written documentation for the platform.",
    why: "It's the answer to most 'how do I…' questions.",
    doThis: "Send this link to any new team member on day one.",
  },
};

export function getKaylaGuide(id: string): KaylaGuideEntry | undefined {
  return KAYLA_GUIDE[id];
}
