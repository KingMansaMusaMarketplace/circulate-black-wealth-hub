const swatch = (name: string, hex: string, rgb: string, text: string) => `
  <td style="width: 33%; padding: 8px; vertical-align: top;">
    <div style="padding: 18px 10px; background-color: ${hex}; color: ${text}; border-radius: 8px; text-align: center;">
      <div style="font-size: 15px; font-weight: bold;">${name}</div>
      <div style="font-size: 13px; margin-top: 6px;">${hex}</div>
      <div style="font-size: 13px;">${rgb}</div>
    </div>
  </td>`;

const rule = (heading: string, body: string) => `
  <div style="margin-bottom: 12px;">
    <div style="font-size: 15px; font-weight: bold; color: #003366;">${heading}</div>
    <div style="font-size: 14px; line-height: 1.6; color: #18181b;">${body}</div>
  </div>`;

export const getBrandAssetsContent = (): string => {
  const updated = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #000000;">

      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #000000; font-size: 34px; margin-bottom: 6px; font-weight: bold;">Brand Assets &amp; Guidelines</h1>
        <h2 style="color: #003366; font-size: 22px; margin: 0 0 10px; font-weight: bold;">1325.AI</h2>
        <p style="font-size: 15px; color: #3f3f46; margin: 0;">Logos, Colors, Typography &amp; Usage Rules</p>
        <p style="font-size: 12px; color: #71717a; margin-top: 6px;">Updated ${updated}</p>
      </div>

      <div style="margin-bottom: 26px;">
        <h3 style="color: #000000; font-size: 19px; margin-bottom: 10px; font-weight: bold;">Naming &amp; Usage</h3>
        ${rule('Primary name', 'Always write the product name as <strong>1325.AI</strong> &mdash; digits, a period, then &ldquo;AI&rdquo; in capitals. Never &ldquo;1325 AI&rdquo;, &ldquo;1325.ai&rdquo; in body copy, or &ldquo;Thirteen Twenty-Five&rdquo;.')}
        ${rule('Parent brand', '<strong>Mansa Musa Marketplace</strong> is the parent brand. Reference it only where context calls for it; never use it alone in place of 1325.AI.')}
        ${rule('AI workforce', 'Always write <strong>42 Agentic AI Employees</strong> &mdash; capital A in Agentic. Never shorten to &ldquo;42 AI agents&rdquo; or drop the word Agentic. Kayla is the AI Chief of Staff who leads them.')}
        ${rule('Patent language', 'Use the full form: <strong>U.S. Provisional Patent Application No. 63/969,202 &mdash; 45 claims pending</strong>. Short form only where space forces it: &ldquo;USPTO Provisional 63/969,202&rdquo;.')}
      </div>

      <div style="margin-bottom: 26px;">
        <h3 style="color: #000000; font-size: 19px; margin-bottom: 6px; font-weight: bold;">Brand Colors</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            ${swatch('Mansa Blue', '#003366', 'RGB(0, 51, 102)', '#ffffff')}
            ${swatch('Mansa Gold', '#FFB300', 'RGB(255, 179, 0)', '#000000')}
            ${swatch('True Black', '#000000', 'RGB(0, 0, 0)', '#ffffff')}
          </tr>
        </table>
        <p style="font-size: 13px; color: #52525b; margin-top: 10px;">
          Mansa Blue is the primary brand color. Mansa Gold is reserved for accents, calls to action and premium tiers.
          True Black is the standard background for digital surfaces. Avoid purple or indigo gradients.
        </p>
      </div>

      <div style="margin-bottom: 26px;">
        <h3 style="color: #000000; font-size: 19px; margin-bottom: 10px; font-weight: bold;">Logo Usage</h3>
        ${rule('Clear space', 'Leave clear space around the logo equal to at least the height of the &ldquo;1325&rdquo; mark on all four sides.')}
        ${rule('Minimum size', 'Never reproduce the logo smaller than 32px tall on screen or 0.5 inch in print.')}
        ${rule('Backgrounds', 'Use the full-color logo on black or dark navy. Use the reversed white logo on photography or busy backgrounds. Do not place the logo on gold.')}
        ${rule('Do not', 'Do not stretch, rotate, recolor, add drop shadows, outline, or place the logo inside a competing shape or badge.')}
      </div>

      <div style="margin-bottom: 26px;">
        <h3 style="color: #000000; font-size: 19px; margin-bottom: 10px; font-weight: bold;">Typography</h3>
        <p style="font-size: 14px; line-height: 1.7; color: #18181b; margin: 0;">
          Headlines use a clean geometric sans-serif in bold weight. Body copy uses a neutral sans-serif at a
          comfortable reading size with generous line spacing. The overall aesthetic is minimal and premium &mdash;
          heavy use of black space, restrained accents, no decorative or script fonts.
        </p>
      </div>

      <div style="margin-bottom: 26px;">
        <h3 style="color: #000000; font-size: 19px; margin-bottom: 10px; font-weight: bold;">Approved Boilerplate</h3>
        <p style="font-size: 14px; line-height: 1.7; color: #18181b; font-style: italic; margin: 0;">
          &ldquo;1325.AI is an agentic commerce platform connecting consumers with more than 47,000 verified community
          businesses while giving those businesses a complete AI-powered back office through 42 Agentic AI Employees
          and a live Model Context Protocol server.&rdquo;
        </p>
      </div>

      <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #1a1a1a; color: white; border-radius: 8px;">
        <h3 style="margin-bottom: 10px; font-size: 19px; font-weight: bold;">Need Source Logo Files?</h3>
        <p style="margin-bottom: 12px; font-size: 15px;">Contact our partnership team for SVG, PNG and vector packages.</p>
        <p style="margin-bottom: 6px; font-size: 15px;"><strong>Email:</strong> Partner@1325.AI</p>
        <p style="margin-bottom: 6px; font-size: 15px;"><strong>Phone:</strong> (312) 900-6004</p>
        <p style="margin-bottom: 0; font-size: 15px;"><strong>Web:</strong> https://1325.ai/media-kit</p>
      </div>
    </div>
  `;
};
