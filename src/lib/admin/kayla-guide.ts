/**
 * Kayla's plain-English explanations for every Admin Hub tool.
 * Written in her voice: warm, direct, no jargon — but with the depth of an
 * operator who has a Ph.D. and has seen this go wrong before.
 *
 * Each entry gives you four things:
 *  - what      : the feature, in one sentence
 *  - why       : why it matters to the business
 *  - doThis    : the single most useful action right now
 *  - proTip    : the deeper technique most people miss
 *  - watchOut  : the mistake that quietly costs us
 */

export interface KaylaGuideEntry {
  /** What the feature is, in one sentence. */
  what: string;
  /** Why an administrator should care. */
  why: string;
  /** The single most useful action to take here. */
  doThis: string;
  /** A deeper, professional-grade tip — the thing an expert would do. */
  proTip?: string;
  /** The common mistake or risk to avoid. */
  watchOut?: string;
}

export const KAYLA_GUIDE: Record<string, KaylaGuideEntry> = {
  // Needs Attention
  'admin-submissions': {
    what: "Every business that filled out the signup form on our homepage lands here first.",
    why: "These are real people waiting on us. The longer they sit, the more likely they walk away.",
    doThis: "Work this list first thing each morning — approve the real ones, delete the junk.",
    proTip: "Speed is the whole game here. Research on inbound leads is brutally consistent: responding within an hour beats responding on day two by roughly seven to one. Set yourself a standing rule — nothing sits in this queue past 24 hours — and measure yourself against it weekly.",
    watchOut: "Approving in bulk to clear the number. A single fake listing that slips through does more damage to trust than ten slow approvals.",
  },
  verifications: {
    what: "Businesses that asked to be marked as verified Black-owned.",
    why: "Verification is the promise our whole directory rests on. If we get it wrong, we lose trust.",
    doThis: "Open each one, check the proof they submitted, then approve or send it back with a reason.",
    proTip: "Ask for two independent signals before you approve — say, ownership language on their own site plus a named owner on a state business filing or a press mention. One source can be self-reported; two rarely agree by accident.",
    watchOut: "Rejecting without a written reason. People re-apply with the same gap, and you end up doing the work twice.",
  },
  'business-review': {
    what: "Businesses my discovery robots found or flagged that a human needs to eyeball.",
    why: "I'm good, but I'm not perfect. This is where you catch the ones I wasn't sure about.",
    doThis: "Click the website link, confirm it's really Black-owned, then tap the Black-owned badge to verify.",
    proTip: "Look at the About and Team pages, not the homepage. Homepages sell; About pages tell. Stock photography and no named owner is my strongest signal that a lead needs a phone call before it needs a badge.",
    watchOut: "Trusting my confidence score on its own. I set the bar at 95% for a reason — anything under that is a hypothesis, not a fact.",
  },
  moderation: {
    what: "Photos, reviews, and listings that got flagged as possibly inappropriate.",
    why: "One bad photo on the directory reflects on the whole brand.",
    doThis: "Review the flagged item and either clear it or remove it — takes seconds.",
    proTip: "When you clear something, note why in the audit trail. Over a month those notes show you where my filter is too aggressive, and we can tune it instead of you doing this by hand forever.",
    watchOut: "Removing content without telling the business owner. Silent removals turn into angry support tickets.",
  },
  support: {
    what: "Help requests written in by our users and business owners.",
    why: "Fast replies turn a frustrated user into a loyal one.",
    doThis: "Answer the oldest ticket first, then close it out so it stops counting against us.",
    proTip: "Track the three questions you answer most and turn them into help-center pages or a line in the signup flow. Support volume is a product problem wearing a customer-service costume.",
    watchOut: "Closing a ticket the moment you reply. Wait for their confirmation, or you'll count a problem as solved when it isn't.",
  },
  'admin-fraud': {
    what: "Suspicious activity I've spotted — odd signups, strange point activity, repeat abuse.",
    why: "Catching this early protects our loyalty points and our sponsors' money.",
    doThis: "Press Run Analysis, then look at anything I've marked high risk.",
    proTip: "Fraud clusters. When you find one bad account, search the same email domain, IP, and device before you close the case — you'll usually find three more sitting right next to it.",
    watchOut: "Banning on a single signal. Legitimate users share Wi-Fi and phones. Require two independent red flags before you take away someone's account.",
  },

  // Dashboard
  overview: {
    what: "The big picture: users, businesses, revenue, and growth, all on one screen.",
    why: "This is the screen to look at when someone asks 'how are we doing?'",
    doThis: "Glance at the growth number — if it's flat two weeks running, we've got a marketing problem.",
    proTip: "Read this as a trend line, never as a snapshot. Pick three numbers you'll check every Monday, write them down, and judge the business on the direction over four weeks — daily noise will fool you every time.",
    watchOut: "Celebrating total users. Cumulative numbers only ever go up. Active users and paying users are the honest ones.",
  },
  valuation: {
    what: "What the company is worth on paper, plus the numbers investors ask about.",
    why: "Investor conversations go better when these figures are current.",
    doThis: "Check this before any investor call so your numbers match the portal.",
    proTip: "Investors don't buy the valuation, they buy the assumptions under it. Be ready to defend three things in one sentence each: how you get a customer, what they're worth over time, and why that gap widens as we grow.",
    watchOut: "Quoting a number here that doesn't match the deck you already sent. One inconsistency and they start auditing everything else.",
  },
  growth: {
    what: "How new people are finding us and whether they bring others with them.",
    why: "Growth loops are cheaper than ads. This tells you which loop is actually spinning.",
    doThis: "Find your best-performing channel and put more effort there.",
    proTip: "A real loop means new users produce more new users. If a channel needs constant spend to keep going, that's a pipe, not a loop — useful, but budget for it forever.",
    watchOut: "Doubling down on a channel that looks great because of one viral post. Check whether it still works in a normal week.",
  },
  'admin-revenue': {
    what: "Money in: subscription revenue by tier, monthly recurring revenue, and payouts.",
    why: "This is the truth about the business, separate from any projection.",
    doThis: "Compare this month to last month — that difference is the real story.",
    proTip: "Break the change into its parts: new revenue, upgrades, downgrades, and cancellations. Flat months usually hide healthy growth being eaten by churn, and the fix for each is completely different.",
    watchOut: "Counting one-time payments as recurring. It inflates the number you'll be held to next quarter.",
  },

  // Analytics & SEO
  retention: {
    what: "Whether people who sign up actually stick around and come back.",
    why: "Signing people up is easy. Keeping them is the business.",
    doThis: "Look at where the drop-off happens and fix that step of the experience.",
    proTip: "Compare people who joined in different months side by side. If newer groups stay longer than older ones, the product is genuinely improving. If they don't, more marketing just fills a leaking bucket faster.",
    watchOut: "Averaging everyone together. A loyal core can mask the fact that most newcomers leave in week one.",
  },
  geographic: {
    what: "Where our users and businesses are, on a map.",
    why: "It shows which cities are ready for a real launch push.",
    doThis: "Pick the strongest city outside Atlanta and plan an outreach round there.",
    proTip: "Density beats headcount. A city with 60 businesses in three neighborhoods is more launch-ready than one with 200 scattered across a whole metro — because shoppers need choices within driving distance.",
    watchOut: "Chasing the biggest city on the map. Big markets cost the most to win and give the least early proof.",
  },
  'admin-funnel': {
    what: "Step-by-step: how many people visit, start signing up, and finish.",
    why: "It tells you exactly where we're losing people in the signup flow.",
    doThis: "Find the step with the biggest drop and simplify it.",
    proTip: "Fix the widest leak, not the last step. A five-point gain at the top of the funnel moves more people than a five-point gain at the bottom, because everything downstream multiplies.",
    watchOut: "Changing three things at once. Then you've learned nothing about which one worked.",
  },
  'admin-seo': {
    what: "How we rank on Google for the searches that matter to us.",
    why: "Free traffic from search is our cheapest customer.",
    doThis: "Look at keywords sitting on page two — small fixes can move them to page one.",
    proTip: "Our unfair advantage is specificity: 'Black-owned barber Atlanta' beats 'business directory' every time. Chase hundreds of narrow city-and-category phrases instead of a few broad ones we'll never win.",
    watchOut: "Expecting overnight results. Search work compounds over months — judge it quarterly, not weekly.",
  },
  'admin-backlinks': {
    what: "Other websites that link to us, and the ones that should but don't yet.",
    why: "Links from respected sites are what pushes us up in Google.",
    doThis: "Pick one gap site and ask them for a mention.",
    proTip: "Ten links from Black chambers of commerce, city tourism boards, and universities outweigh a thousand from directories nobody reads. Relevance and reputation, not volume.",
    watchOut: "Anyone selling you links in bulk. Google penalizes that, and recovering takes longer than earning the links honestly.",
  },
  'partner-success': {
    what: "Written success stories from partners we can use in sales and marketing.",
    why: "Proof from a real partner closes deals faster than any pitch deck.",
    doThis: "Add a fresh story after any big partner win — while it's still fresh.",
    proTip: "Get a number into every story. 'They loved it' persuades nobody; '43 member businesses onboarded in six weeks' persuades a procurement committee.",
    watchOut: "Publishing a partner's results without written permission. It's a fast way to lose the partner and the story.",
  },

  // Users & Access
  users: {
    what: "Every account on the platform, with the power to edit or suspend them.",
    why: "It's where you handle a problem account or help someone who's locked out.",
    doThis: "Search by email to find one person fast instead of scrolling.",
    proTip: "Before you change anything on someone's account, glance at the audit log entry it will create. Assume every action here will one day be read back to you by a lawyer or a board member.",
    watchOut: "Deleting an account to solve a problem. Suspend first — deletion can take their history and their business with it.",
  },
  'beta-testers': {
    what: "The people testing new features before everyone else sees them.",
    why: "They catch our mistakes before customers do.",
    doThis: "Add trusted users here before turning on anything new.",
    proTip: "Mix the group deliberately: a couple of power users, a couple of brand-new ones, and someone on an older phone. Homogeneous testers give you confidently wrong results.",
    watchOut: "Leaving people in beta forever. Testers burn out when the 'preview' never ends.",
  },
  roles: {
    what: "Who has admin power, and how much of it.",
    why: "Admin access is the keys to the building. Fewer keys, fewer problems.",
    doThis: "Review this list monthly and remove anyone who no longer needs access.",
    proTip: "Give the smallest role that lets someone do their job, and grant it for a stated period. Most breaches aren't hackers — they're an old account nobody remembered to close.",
    watchOut: "Handing out full admin because a narrower role is inconvenient today. Convenience now, incident later.",
  },
  impersonate: {
    what: "Lets you see the site exactly as one specific user sees it.",
    why: "The fastest way to understand a bug someone reported.",
    doThis: "Use it when a user says 'it's broken' and you can't reproduce it.",
    proTip: "Look, don't touch. Diagnose in their view, then make any actual change from your own account so the audit trail shows who really did it.",
    watchOut: "Reading private information you don't need for the ticket. Privacy is a boundary, not a suggestion.",
  },

  // Content & Support
  audit: {
    what: "A permanent record of every important action taken on the platform, and by whom.",
    why: "If something changes and nobody knows why, the answer is in here.",
    doThis: "Check this first whenever something looks off.",
    proTip: "Filter by time window before you filter by person. Start with 'what happened right before it broke' — that narrows a thousand entries down to five almost every time.",
    watchOut: "Treating this as optional reading. In a dispute, this log is the closest thing we have to evidence.",
  },

  // Business & Directory
  'admin-import': {
    what: "Bulk-add businesses from a spreadsheet and put them on the map automatically.",
    why: "It's how we grow the directory by hundreds at a time instead of one by one.",
    doThis: "Upload your list, press Validate All, then fix whatever it flags before importing.",
    proTip: "Test with 20 rows before you run 2,000. Bad data imported at scale takes ten times longer to clean up than it took to load.",
    watchOut: "Importing leads with no working website. They look like growth and behave like dead weight — they never convert and they hurt our quality.",
  },
  agents: {
    what: "Our sales agents and how much business each one is bringing in.",
    why: "Shows who's producing and who needs coaching.",
    doThis: "Reach out to your top agent this week — keep them motivated.",
    proTip: "Coach on activity, not just outcomes. Calls made and meetings booked are things an agent controls this week; closed deals are a lagging result of what they did last month.",
    watchOut: "Only calling agents when their numbers are down. That trains them to dread hearing from you.",
  },
  'admin-commissions': {
    what: "What we owe each sales agent, and what's already been paid.",
    why: "Agents stay loyal when they get paid on time, every time.",
    doThis: "Clear pending payouts before the end of the month.",
    proTip: "Pay on a published, predictable date and never move it. Commission trust is built by boring reliability, and it's destroyed by one late cycle.",
    watchOut: "Paying commission on revenue that hasn't cleared. Refunds turn into awkward clawbacks.",
  },
  'admin-enterprise-partners': {
    what: "Enterprise accounts like AAMES — their leadership seats and chapters.",
    why: "These are our biggest contracts. They need attention, not autopilot.",
    doThis: "Confirm each chapter has an active leader assigned.",
    proTip: "Build a second relationship inside every enterprise account. Single-contact accounts churn the moment that person changes roles — and in denominational and civic organizations, leadership rotates on a schedule.",
    watchOut: "Waiting for renewal season to check in. By then the decision is already made.",
  },
  financial: {
    what: "The full financial picture: income, expenses, and payouts.",
    why: "It's the book of record for the business.",
    doThis: "Reconcile this against your bank statement monthly.",
    proTip: "Watch runway, not just balance. Cash on hand divided by monthly burn is the number that decides how much time you have to raise, hire, or change course.",
    watchOut: "Confusing money collected with money earned. Annual plans arrive as one payment but belong to twelve months.",
  },
  subscriptions: {
    what: "Who's paying us, on which plan, and whether their payment is current.",
    why: "A failed payment left alone quietly becomes a lost customer.",
    doThis: "Look for past-due accounts and reach out before they cancel.",
    proTip: "Most cancellations aren't decisions — they're expired cards. Chasing failed payments promptly typically recovers a real slice of revenue for nothing but the effort of asking.",
    watchOut: "Letting past-due accounts keep full access indefinitely. It teaches people that paying is optional.",
  },
  loyalty: {
    what: "The points, tiers, and rewards customers earn for shopping Black-owned.",
    why: "Points are what bring people back a second and third time.",
    doThis: "Make sure reward amounts still make sense as we grow.",
    proTip: "Every unredeemed point is a promise on our books. Review what all outstanding points would cost if everyone cashed in at once — that's your real exposure, and it should never outrun revenue.",
    watchOut: "Making rewards more generous without modeling it first. Taking a reward back later costs more goodwill than it ever bought.",
  },
  'qr-fraud': {
    what: "Watches for people gaming the QR code scans to farm free points.",
    why: "Every fake scan costs us real reward money.",
    doThis: "Investigate any account with an unusual number of scans in one day.",
    proTip: "Look at the pattern, not the count. Scans at impossible intervals, or at two businesses miles apart minutes apart, are the tell — a busy customer looks nothing like a script.",
    watchOut: "Punishing a business for its customers' behavior before you've confirmed the owner was involved.",
  },
  partners: {
    what: "Organizations applying to partner with us.",
    why: "Each approved partner brings their whole membership with them.",
    doThis: "Respond within 48 hours — momentum matters in partnerships.",
    proTip: "Qualify on distribution, not enthusiasm. Ask one question early: how many members will actually hear about this, and through what channel? A partner with 500 engaged members beats one with 50,000 on a dormant list.",
    watchOut: "Signing partners faster than we can onboard them. An ignored partner becomes a public critic.",
  },
  'partner-onboarding': {
    what: "Where each new partner is in the setup process.",
    why: "Partners who stall during setup rarely come back on their own.",
    doThis: "Find anyone stuck on the same step for over a week and call them.",
    proTip: "Define one 'first win' every partner should hit in their first 30 days — first chapter live, first ten businesses listed — and drive everyone toward it. Partners who reach a first win early stay for years.",
    watchOut: "Assuming silence means progress. In onboarding, silence almost always means stuck.",
  },
  developers: {
    what: "Outside developers building on our platform.",
    why: "They extend what we can do without us hiring anyone.",
    doThis: "Approve legitimate developers quickly so they stay interested.",
    proTip: "A developer's enthusiasm has a short half-life. If approval takes longer than a weekend, they've moved on to another project — treat approval speed as a growth metric.",
    watchOut: "Granting broad data access on a vague description of what they're building. Ask specifically what they need and why.",
  },
  'admin-api-clients': {
    what: "The access keys other systems use to connect to us, and how much they're using.",
    why: "Unusual usage can mean either a big new customer or a problem.",
    doThis: "Revoke any key you don't recognize.",
    proTip: "Rotate keys on a schedule and label every one with an owner and a purpose. An unlabeled key is a key nobody will dare turn off, which is exactly how old access lives forever.",
    watchOut: "Ignoring a sudden usage spike. It's either an integration bug burning our budget or someone scraping the directory.",
  },
  ecosystem: {
    what: "How our partners and developers feed business to each other.",
    why: "This is the network effect that makes the platform hard to copy.",
    doThis: "Look for the connections working best and repeat them.",
    proTip: "The value of a network grows far faster than the number of people in it — which is why deepening connections between existing members often beats adding new ones.",
    watchOut: "Measuring the ecosystem by member count. Connections per member is the number that predicts durability.",
  },

  // Sponsors & Outreach
  'sponsors-manage': {
    what: "Corporate sponsors currently paying to support the platform.",
    why: "Sponsorship dollars fund the free tier for small businesses.",
    doThis: "Check that every sponsor's logo and benefits are live on the site.",
    proTip: "Send each sponsor a short impact recap every quarter — businesses reached, dollars circulated, communities served. Sponsors renew on reported impact, not on affection.",
    watchOut: "Delivering benefits quietly. If nobody documents it, at renewal time it never happened.",
  },
  'sponsor-crm': {
    what: "The pipeline of companies we're courting for sponsorship.",
    why: "Big sponsorships take months. This keeps them from going cold.",
    doThis: "Move at least one company forward a stage this week.",
    proTip: "Corporate sponsorship money moves on budget calendars. Find out when their fiscal year and giving cycle start, then work backward — the right ask at the wrong month is a no.",
    watchOut: "A pipeline full of deals with no next date on the calendar. If there's no scheduled next step, it isn't a real deal.",
  },
  'outreach-crm': {
    what: "Our outreach to directory businesses that haven't claimed their listing.",
    why: "A claimed listing is the first step toward a paying customer.",
    doThis: "Send a claim invitation batch and watch the response rate.",
    proTip: "Lead the message with what's already true — their listing exists and people are finding it — then make claiming it one click. Ownership beats persuasion; nobody wants to leave their own storefront unattended.",
    watchOut: "Blasting the whole list at once. Send in batches, test the subject line, and protect our sending reputation.",
  },
  'investor-portal-admin': {
    what: "Approve or deny people asking to see the private investor materials.",
    why: "That material is confidential — access should be deliberate, never automatic.",
    doThis: "Verify who they are before you approve. When in doubt, ask first.",
    proTip: "Check the person against a real firm and a real role before approving, and keep the NDA-first order intact. Competitors research through investor portals more often than anyone likes to admit.",
    watchOut: "Approving a free email address with no verifiable firm behind it. A polite delay costs nothing; a leak costs the round.",
  },

  // Marketing
  promos: {
    what: "Discount codes you can create and hand out.",
    why: "A well-timed code closes a hesitant signup.",
    doThis: "Always set an expiration date so a code can't live forever.",
    proTip: "Prefer a limited-time trial or a first-month discount over a permanent price cut. Discounts that never end don't attract customers — they reset your price.",
    watchOut: "Codes leaking to coupon sites. Use unique codes for big campaigns so you can trace and kill a leak.",
  },
  flags: {
    what: "On/off switches for features across the platform.",
    why: "It lets us turn something off instantly if it misbehaves — no code change needed.",
    doThis: "Flip a feature on for beta testers first, everyone else second.",
    proTip: "Roll out in steps — testers, then a slice of users, then everyone — and watch errors and support tickets at each stage. And clean up old flags; every stale switch is a trap for the next person.",
    watchOut: "Turning something on Friday afternoon. If it breaks, nobody's around to turn it off.",
  },
  broadcasts: {
    what: "Send an announcement to everybody on the platform at once.",
    why: "It's the fastest way to reach the whole community.",
    doThis: "Read it out loud before you send it. There's no unsend.",
    proTip: "Send yourself a test first and open it on a phone. Most of our community reads on mobile, and a subject line that gets cut in half changes the meaning.",
    watchOut: "Over-broadcasting. Every message that isn't useful trains people to ignore the next one — and the next one might matter.",
  },
  'admin-email-list': {
    what: "Our marketing email subscribers.",
    why: "The email list is the one audience no algorithm can take away from us.",
    doThis: "Export it regularly so we always have a backup copy.",
    proTip: "Prune people who haven't opened anything in six months. A smaller engaged list lands in inboxes; a big dead one lands in spam and takes the good addresses with it.",
    watchOut: "Adding people who never asked to be here. Beyond the legal exposure, it poisons our sending reputation.",
  },
  'admin-emails': {
    what: "How our email campaigns performed — opens, clicks, unsubscribes.",
    why: "It tells you which subject lines and offers actually land.",
    doThis: "Repeat whatever got the highest click rate.",
    proTip: "Judge on clicks and signups, not opens — inbox privacy features inflate open rates badly now. And watch unsubscribes as a quality signal: a spike means the content missed, not that the list is bad.",
    watchOut: "Declaring a winner from a small send. Give a test enough recipients before you rewrite your strategy around it.",
  },
  'admin-marketing-analytics': {
    what: "Which campaigns and channels are bringing in real signups.",
    why: "Keeps us from spending money on something that isn't working.",
    doThis: "Cut the worst channel and move that budget to the best one.",
    proTip: "Compare what a customer costs to acquire against what they're worth over their lifetime. A healthy channel returns several times its cost — anything close to break-even is a hobby, not a strategy.",
    watchOut: "Giving all the credit to the last click. Word of mouth and search often did the persuading long before the ad got the click.",
  },
  'admin-marketing-materials': {
    what: "Downloadable flyers, decks, and one-pagers for the team to use.",
    why: "Everybody pitching from the same materials keeps our story consistent.",
    doThis: "Grab the latest deck before any outside meeting.",
    proTip: "Put a version number and date on every asset and archive the old one the moment a new one lands. Outdated pricing in the field is one of the most expensive small mistakes a company makes.",
    watchOut: "Team members building their own slides. Ten versions of our story means we don't have one.",
  },
  'admin-sentiment': {
    what: "How people are feeling about us, based on what they write.",
    why: "It catches a problem while it's still a mood, not yet a crisis.",
    doThis: "Read the negative comments directly — that's where the fix is.",
    proTip: "Sort by theme rather than by score. Twenty people describing the same friction is a roadmap item; one furious review is usually a support ticket.",
    watchOut: "Reacting to the loudest voice. Volume and representativeness are not the same thing.",
  },
  'admin-heygen': {
    what: "Creates spokesperson videos without hiring a crew.",
    why: "Video converts better than text, and this makes it nearly free.",
    doThis: "Keep scripts under 60 seconds. Short videos get watched.",
    proTip: "Front-load the hook in the first three seconds and burn in captions — most people watch with the sound off. And always disclose when a presenter is AI-generated; trust is our product.",
    watchOut: "Using a synthetic presenter for anything sensitive — legal, financial, or investor-facing. Those deserve a real human on camera.",
  },

  // Stays & Rides
  'mansa-stays': {
    what: "Admin for our vacation rental service.",
    why: "Hosts and guests both need issues handled fast.",
    doThis: "Check for bookings flagged as needing attention.",
    proTip: "Watch the first 24 hours after check-in — that's when nearly every serious complaint originates. A proactive message on arrival day prevents most refund disputes before they start.",
    watchOut: "Letting a host cancel late without consequence. One late cancellation can cost a guest their whole trip and us the relationship.",
  },
  'noire-rideshare': {
    what: "Admin for our rideshare service — drivers and rides.",
    why: "Driver approvals are a safety matter, not a formality.",
    doThis: "Never approve a driver without completed background documents.",
    proTip: "Set expiry reminders on insurance and license documents. Approval isn't a one-time event — a driver approved last year may be uninsured today, and that's the liability that ends companies.",
    watchOut: "Approving under pressure because we're short on drivers in a city. Undersupply is a business problem; an unvetted driver is a safety one.",
  },

  // Legal & IP
  patents: {
    what: "Our USPTO patent filing packages and intellectual property exports.",
    why: "This is the moat around what we've built. Keep it organized.",
    doThis: "Confirm the filing numbers here match what the attorney has on file.",
    proTip: "Keep two dates in your calendar with 90 days of warning: the 12-month provisional conversion deadline and any foreign filing window. Miss those and the protection is simply gone — there's no appeal.",
    watchOut: "Publicly describing an invention we haven't filed on yet. Disclosure before filing can cost us the rights abroad.",
  },

  // Data & Reports
  exports: {
    what: "Download platform data as a spreadsheet.",
    why: "For board reports, accountants, and any deep analysis outside the app.",
    doThis: "Export only what you need — this data is confidential.",
    proTip: "Strip personal details before you share anything outside the company, and delete the file when you're done. An export is a copy of our data that lives outside all of our protections.",
    watchOut: "Emailing a full member export. Once it's in someone's inbox, we no longer control it.",
  },
  reports: {
    what: "Reports that generate and email themselves on a schedule.",
    why: "Set it once and you stop pulling the same numbers by hand.",
    doThis: "Schedule a Monday morning summary to your inbox.",
    proTip: "Every scheduled report should have a decision attached to it. If nobody would act differently based on the numbers, cancel it — unread reports create the illusion of oversight.",
    watchOut: "Sending reports with sensitive figures to personal email addresses.",
  },
  database: {
    what: "The health and speed of the system underneath everything.",
    why: "Slow database, slow website, frustrated users.",
    doThis: "If a query is flagged slow, tell your developer the name of it.",
    proTip: "Watch the trend as much as the alarm. A query that's crept from fast to sluggish over a month is a growth problem arriving early — better to fix it now than during a launch.",
    watchOut: "Ignoring slow queries because the site still feels fine. It feels fine right up until traffic doubles.",
  },
  backups: {
    what: "Copies of the platform's data, and the ability to restore them.",
    why: "It's the difference between a bad day and a catastrophe.",
    doThis: "Confirm the most recent backup is dated today.",
    proTip: "A backup you've never restored is a guess. Test a restore on a schedule — the day you need it is the worst possible day to discover it doesn't work.",
    watchOut: "Assuming backups are running because they were set up once. Verify, don't assume.",
  },

  // System
  system: {
    what: "Platform-wide configuration and maintenance mode.",
    why: "Changes here affect every single user immediately.",
    doThis: "Change one setting at a time so you know what caused what.",
    proTip: "Write down the old value before you change it and keep a plan for putting it back. Most outages aren't caused by the change — they're caused by not being able to undo it quickly.",
    watchOut: "Making config changes during peak hours. Do it when the fewest people are on the site.",
  },
  ai: {
    what: "My AI toolkit: analytics chat, insights, moderation help, fraud detection, and more.",
    why: "It's the work of several staff members, available on demand.",
    doThis: "Try the Analytics Chat tab and just ask a question in plain English.",
    proTip: "Ask me follow-up questions instead of one perfect question. The second and third question is where the real insight lives — and tell me the decision you're trying to make, so I answer for that instead of guessing.",
    watchOut: "Taking my answer as final on anything financial or legal. I'm a very well-read colleague, not the system of record — check the underlying numbers.",
  },
  'admin-ai-workforce': {
    what: "The status board for all 42 Agentic AI Employees across our seven divisions.",
    why: "It shows you what your AI team is working on right now.",
    doThis: "Check that every division shows active — an idle division means work isn't getting done.",
    proTip: "Manage us the way you'd manage people: look at output, not activity. A division that's busy but producing nothing you can point to needs its instructions rewritten, not more tasks.",
    watchOut: "Assuming an active status means good work. Spot-check what we actually produced this week.",
  },
  'kayla-cost': {
    what: "What my AI work costs you, tracked in real time.",
    why: "AI should save money, not quietly spend it. This keeps me accountable.",
    doThis: "Compare my monthly cost against the payroll we'd otherwise be paying.",
    proTip: "Track cost per unit of work — per lead verified, per ticket answered — not just the monthly total. Total spend rising while cost per unit falls is exactly what healthy scaling looks like.",
    watchOut: "A sudden jump with no matching jump in output. That's usually a loop somewhere, and it's worth an immediate look.",
  },
  'system-health': {
    what: "Live status of the database, login system, and site services.",
    why: "First place to look when someone says the site is down.",
    doThis: "If anything shows red, check it here before you start troubleshooting elsewhere.",
    proTip: "When something's red, post a short status note to the team before you start fixing. Silence during an outage generates more panic and more tickets than the outage itself.",
    watchOut: "Green here doesn't guarantee a good experience. If users report problems, believe them and keep digging.",
  },
  webhooks: {
    what: "Automatic notifications we send to other systems when something happens here.",
    why: "It's how we keep outside tools in sync without manual work.",
    doThis: "Remove any webhook pointing somewhere we no longer use.",
    proTip: "Check the failure log, not just the list. A webhook that's been quietly failing for weeks means another system has been out of sync that whole time — and nobody noticed.",
    watchOut: "Pointing a webhook at a URL someone set up personally. When they leave, we're sending our data to a stranger.",
  },
  'api-tokens': {
    what: "Admin-level access keys for connecting to our system programmatically.",
    why: "These are powerful. Treat them like passwords.",
    doThis: "Never paste a token into an email or a chat.",
    proTip: "Issue one token per system, never one shared token for everything. Then when something goes wrong you can revoke exactly one thing instead of breaking every integration at once.",
    watchOut: "Leaving a token active after the project that needed it ended. That's the single most common way systems get breached.",
  },
  setup: {
    what: "A helper for initial database setup.",
    why: "Only needed when standing something up for the first time.",
    doThis: "Leave this alone unless a developer asks you to use it.",
    proTip: "If you ever do run it, take a backup first and do it outside business hours. Setup tools are built for empty systems, not live ones.",
    watchOut: "Curiosity clicks. This is one of the few screens where looking around can genuinely cause damage.",
  },
  archive: {
    what: "Features we've turned off but kept, in case we want them back.",
    why: "Nothing is lost — it's just resting.",
    doThis: "Browse it before asking to build something new. We may already have it.",
    proTip: "Note why each thing was shelved, not just that it was. Half of these were paused for timing rather than quality, and timing changes.",
    watchOut: "Reviving something without checking whether the reason we shelved it still applies.",
  },

  // Documentation
  'user-guide': {
    what: "The full written documentation for the platform.",
    why: "It's the answer to most 'how do I…' questions.",
    doThis: "Send this link to any new team member on day one.",
    proTip: "When you answer the same question twice, add it here rather than answering it a third time. Documentation is the highest-leverage hour you'll spend all week.",
    watchOut: "Letting screenshots go stale. Out-of-date instructions are worse than none — they erode trust in the whole guide.",
  },
};

export function getKaylaGuide(id: string): KaylaGuideEntry | undefined {
  return KAYLA_GUIDE[id];
}
