const GOLD = '#b45309';
const NAVY = '#003366';

const statCard = (value: string, label: string) => `
  <td style="width: 33%; padding: 10px; vertical-align: top;">
    <div style="border: 1px solid #d4d4d8; border-radius: 8px; padding: 14px; text-align: center;">
      <div style="font-size: 20px; font-weight: bold; color: ${GOLD};">${value}</div>
      <div style="font-size: 12px; color: #3f3f46; margin-top: 4px;">${label}</div>
    </div>
  </td>`;

const tierRow = (tier: string, annual: string, monthly: string) => `
  <tr>
    <td style="padding: 9px 12px; border-bottom: 1px solid #e4e4e7; font-size: 14px; font-weight: bold; color: #000;">${tier}</td>
    <td style="padding: 9px 12px; border-bottom: 1px solid #e4e4e7; font-size: 14px; color: #000;">${annual}</td>
    <td style="padding: 9px 12px; border-bottom: 1px solid #e4e4e7; font-size: 14px; color: #3f3f46;">${monthly}</td>
  </tr>`;

const featureRow = (title: string, body: string) => `
  <div style="margin-bottom: 12px;">
    <div style="font-size: 15px; font-weight: bold; color: ${NAVY};">${title}</div>
    <div style="font-size: 14px; line-height: 1.6; color: #18181b;">${body}</div>
  </div>`;

export const getMediaKitContent = (): string => {
  const year = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #000000;">

      <!-- Cover -->
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #000000; font-size: 34px; margin-bottom: 6px; font-weight: bold;">Media Kit</h1>
        <h2 style="color: ${NAVY}; font-size: 22px; margin: 0 0 10px; font-weight: bold;">1325.AI</h2>
        <p style="font-size: 15px; color: #3f3f46; margin: 0;">Press, Partnership &amp; Sponsorship Resources</p>
        <p style="font-size: 12px; color: #71717a; margin-top: 6px;">Updated ${year}</p>
      </div>

      <!-- Company overview -->
      <div style="margin-bottom: 26px;">
        <h3 style="color: #000000; font-size: 19px; margin-bottom: 10px; font-weight: bold;">Company Overview</h3>
        <p style="line-height: 1.7; font-size: 14px; color: #18181b; margin: 0 0 10px;">
          1325.AI is an agentic commerce platform that connects consumers with verified Black-owned and community
          businesses, and gives those businesses a full back office run by artificial intelligence. The company is named
          after Mansa Musa, the 14th-century African emperor widely regarded as the wealthiest person in history.
        </p>
        <p style="line-height: 1.7; font-size: 14px; color: #18181b; margin: 0;">
          The platform pairs the largest verified directory of community businesses in the United States with
          42 Agentic AI Employees led by Kayla, our AI Chief of Staff. Together they handle marketing, bookkeeping,
          customer follow-up, review management and compliance, replacing roughly four staff roles at a fraction of
          the cost.
        </p>
      </div>

      <!-- Fast facts -->
      <div style="margin-bottom: 26px;">
        <h3 style="color: #000000; font-size: 19px; margin-bottom: 10px; font-weight: bold;">Fast Facts</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #18181b;">
          <tr><td style="padding: 6px 0; width: 32%;"><strong>Founded</strong></td><td style="padding: 6px 0;">2024</td></tr>
          <tr><td style="padding: 6px 0;"><strong>Founder &amp; CEO</strong></td><td style="padding: 6px 0;">Thomas D. Bowling</td></tr>
          <tr><td style="padding: 6px 0;"><strong>Headquarters</strong></td><td style="padding: 6px 0;">1000 E. 111th St., Suite 1100, Chicago, Illinois 60628</td></tr>
          <tr><td style="padding: 6px 0;"><strong>Parent brand</strong></td><td style="padding: 6px 0;">Mansa Musa Marketplace</td></tr>
          <tr><td style="padding: 6px 0;"><strong>Website</strong></td><td style="padding: 6px 0;">https://1325.ai</td></tr>
        </table>
      </div>

      <!-- Platform statistics -->
      <div style="margin-bottom: 26px;">
        <h3 style="color: #000000; font-size: 19px; margin-bottom: 6px; font-weight: bold;">Platform Statistics</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            ${statCard('47,000+', 'Verified Businesses')}
            ${statCard('42', 'Agentic AI Employees')}
            ${statCard('$2.10T / $9.1T', 'U.S. / Global Market')}
          </tr>
          <tr>
            ${statCard('Live', 'MCP Server (ChatGPT &amp; Claude)')}
            ${statCard('17', 'Revenue Streams')}
            ${statCard('iOS + Android', 'Mobile Platforms')}
          </tr>
        </table>
      </div>

      <div style="page-break-before: always;"></div>

      <!-- Core capabilities -->
      <div style="margin-bottom: 26px;">
        <h3 style="color: #000000; font-size: 19px; margin-bottom: 12px; font-weight: bold;">Core Capabilities</h3>
        ${featureRow('Verified Business Directory', 'More than 47,000 verified community businesses, searchable by category, city and radius, with reviews, ratings and ownership verification.')}
        ${featureRow('Kayla &amp; 42 Agentic AI Employees', 'Autonomous AI workers handling marketing, bookkeeping, customer follow-up, pricing, grants research and compliance for every business on the platform.')}
        ${featureRow('Live MCP Server', 'ChatGPT, Claude and Cursor can discover and recommend our verified businesses directly through our Model Context Protocol (MCP) server &mdash; putting community businesses inside the AI tools consumers already use.')}
        ${featureRow('Loyalty Points &amp; Coalition Rewards', 'Customers earn redeemable points for supporting community businesses, with QR scanning at the point of sale.')}
        ${featureRow('Community Savings (Susu)', 'Traditional community savings circles rebuilt digitally with escrow protection and identity verification.')}
        ${featureRow('Business Verification', 'Multi-step verification with AI evidence review and a confidence threshold before any business is published as verified.')}
      </div>

      <!-- IP -->
      <div style="margin-bottom: 26px; border: 2px solid ${GOLD}; border-radius: 8px; padding: 16px;">
        <h3 style="color: ${GOLD}; font-size: 17px; margin: 0 0 8px; font-weight: bold;">Protected Intellectual Property</h3>
        <p style="font-size: 14px; line-height: 1.6; color: #18181b; margin: 0;">
          U.S. Provisional Patent Application No. 63/969,202 &mdash; 45 claims pending, covering our agentic commerce
          infrastructure and community wealth-circulation technology.
        </p>
      </div>

      <!-- Sponsorship -->
      <div style="margin-bottom: 26px;">
        <h3 style="color: #000000; font-size: 19px; margin-bottom: 10px; font-weight: bold;">Sponsorship &amp; Partnership Tiers</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #f4f4f5;">
            <th style="text-align: left; padding: 9px 12px; font-size: 13px; color: #3f3f46;">Tier</th>
            <th style="text-align: left; padding: 9px 12px; font-size: 13px; color: #3f3f46;">Annual</th>
            <th style="text-align: left; padding: 9px 12px; font-size: 13px; color: #3f3f46;">Monthly</th>
          </tr>
          ${tierRow('Founding Sponsor', '$21,000', '$1,750 / month')}
          ${tierRow('Bronze Partner', '$60,000', '$5,000 / month')}
          ${tierRow('Silver Partner', '$180,000', '$15,000 / month')}
          ${tierRow('Gold Partner', '$300,000', '$25,000 / month')}
          ${tierRow('Platinum Partner', '$600,000', '$50,000 / month')}
          ${tierRow('Founding Partner', 'By invitation', 'Bespoke engagement')}
        </table>
        <p style="font-size: 13px; color: #52525b; margin-top: 10px;">
          Full tier benefits and availability: https://1325.ai/sponsors
        </p>
      </div>

      <!-- Boilerplate -->
      <div style="margin-bottom: 26px;">
        <h3 style="color: #000000; font-size: 19px; margin-bottom: 10px; font-weight: bold;">Press Boilerplate</h3>
        <p style="font-size: 14px; line-height: 1.7; color: #18181b; font-style: italic; margin: 0;">
          &ldquo;1325.AI is an agentic commerce platform connecting consumers with more than 47,000 verified community
          businesses while giving those businesses a complete AI-powered back office. Through 42 Agentic AI Employees
          and a live Model Context Protocol server, 1325.AI makes community businesses discoverable inside the AI
          assistants consumers use every day. Founded in 2024 by Thomas D. Bowling and headquartered in Chicago,
          Illinois, the company&rsquo;s technology is covered by U.S. Provisional Patent Application No. 63/969,202
          with 45 claims pending.&rdquo;
        </p>
      </div>

      <!-- Contact -->
      <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #1a1a1a; color: white; border-radius: 8px;">
        <h3 style="margin-bottom: 10px; font-size: 19px; font-weight: bold;">Media &amp; Partnership Contact</h3>
        <p style="margin-bottom: 6px; font-size: 15px;"><strong>Email:</strong> Partner@1325.AI</p>
        <p style="margin-bottom: 6px; font-size: 15px;"><strong>Phone:</strong> (312) 900-6004</p>
        <p style="margin-bottom: 0; font-size: 15px;"><strong>Web:</strong> https://1325.ai/media-kit</p>
      </div>
    </div>
  `;
};
