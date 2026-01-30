import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface TeamNDAEmailRequest {
  recipientEmail: string;
  recipientName: string;
  ndaPdfBase64?: string;
  coverLetterPdfBase64?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipientEmail, recipientName, ndaPdfBase64, coverLetterPdfBase64 }: TeamNDAEmailRequest = await req.json();

    if (!recipientEmail || !recipientName) {
      throw new Error("Missing required fields: recipientEmail and recipientName");
    }

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Georgia, 'Times New Roman', serif; line-height: 1.6; color: #1a1a1a; max-width: 650px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; border-bottom: 2px solid #1a365d; padding-bottom: 15px; margin-bottom: 25px; }
    .logo { height: 70px; margin-bottom: 8px; }
    .company-info { font-size: 12px; color: #4a5568; }
    h2 { color: #1a365d; font-size: 16px; margin-top: 25px; margin-bottom: 10px; }
    .section { margin-bottom: 20px; }
    .highlight-box { background: #f7fafc; border-left: 3px solid #1a365d; padding: 12px 16px; margin: 15px 0; }
    .action-items { background: #edf2f7; padding: 15px 20px; border-radius: 4px; margin: 20px 0; }
    .action-items h3 { margin-top: 0; color: #1a365d; font-size: 14px; }
    .action-items ol { margin: 0; padding-left: 20px; }
    .action-items li { margin-bottom: 8px; }
    .signature { margin-top: 30px; }
    .signature-name { font-weight: bold; font-size: 14px; }
    .signature-title { font-size: 12px; color: #4a5568; }
    .footer { margin-top: 25px; padding-top: 15px; border-top: 1px solid #cbd5e0; font-size: 10px; color: #718096; text-align: center; }
    ul { padding-left: 20px; }
    li { margin-bottom: 6px; }
  </style>
</head>
<body>
  <div class="header">
    <img src="https://circulate-black-wealth-hub.lovable.app/images/1325-neural-brain-logo.jpeg" alt="1325.AI" class="logo">
    <p class="company-info">d/b/a Mansa Musa Marketplace, Inc. — Chicago, Illinois</p>
  </div>

  <p>Dear ${recipientName},</p>

  <p>As we work toward our goal of taking 1325.AI to an IPO, it is essential that we maintain the highest standards of professional and legal protection. To help you understand the scope of the attached agreement, here is a simplified summary of how this protects our collective future:</p>

  <div class="section">
    <h2>1. Protecting Our Technology</h2>
    <ul>
      <li><strong>IP Ownership:</strong> Any inventions, code, or improvements created for 1325.AI (d/b/a Mansa Musa Marketplace, Inc.) belong to the company.</li>
      <li><strong>Patent Protection:</strong> The agreement specifically references our USPTO filing (No. 63/969,202), ensuring that systems like CMAL and Susu Circles are legally guarded.</li>
      <li><strong>Confidentiality:</strong> We all agree to keep technical architecture, algorithms, and business plans strictly confidential to maintain our competitive advantage.</li>
    </ul>
  </div>

  <div class="section">
    <h2>2. Safeguarding Our Competitive Edge</h2>
    <ul>
      <li><strong>Non-Competition:</strong> To protect our market position, team members agree not to work for competitors or build similar platforms for 24 months after their engagement ends.</li>
      <li><strong>Non-Solicitation:</strong> This prevents the "poaching" of our talented team members or our customer base by outside parties.</li>
    </ul>
  </div>

  <div class="section">
    <h2>3. Why This Is Necessary for an IPO</h2>
    <ul>
      <li><strong>Institutional Standards:</strong> Public markets and major investors require a "clean" title to all intellectual property to ensure the company's value is secure.</li>
      <li><strong>Professional Rigor:</strong> By documenting our standards of care—including security measures like two-factor authentication (2FA)—we demonstrate the operational maturity required of a top-tier tech firm.</li>
      <li><strong>Legal Certainty:</strong> In the event of a breach, the company has the right to seek immediate legal remedies to stop the unauthorized use of our technology.</li>
    </ul>
  </div>

  <div class="action-items">
    <h3>Action Items for the Team</h3>
    <ol>
      <li><strong>Review Exhibit A:</strong> If you have unrelated projects you owned prior to joining us, please list them on Page 11. If there are none, simply write "NONE".</li>
      <li><strong>Sign & Date:</strong> You may execute this document electronically.</li>
      <li><strong>Questions:</strong> If you need further clarity on any clause, please feel free to reach out to me directly.</li>
    </ol>
  </div>

  <p>Thank you for your dedication to the vision of 1325.AI. Together, we are building a secure and successful future.</p>

  <div class="signature">
    <p>Best regards,</p>
    <p class="signature-name">Thomas D. Bowling</p>
    <p class="signature-title">Founder & Chief Architect</p>
    <p class="signature-title">1325.AI | Mansa Musa Marketplace, Inc.</p>
  </div>

  <div class="footer">
    <p>USPTO Provisional Patent Application No. 63/969,202 — Filed January 27, 2026</p>
    <p>CONFIDENTIAL — For Authorized Recipients Only</p>
  </div>
</body>
</html>
    `;

    // Build attachments array
    const attachments: Array<{ filename: string; content: string }> = [];
    
    if (coverLetterPdfBase64) {
      attachments.push({
        filename: "1325AI_NDA_Cover_Letter.pdf",
        content: coverLetterPdfBase64,
      });
    }
    
    if (ndaPdfBase64) {
      attachments.push({
        filename: "1325AI_Team_NDA_Agreement.pdf",
        content: ndaPdfBase64,
      });
    }

    const emailResponse = await resend.emails.send({
      from: "1325.AI <Thomas@1325.AI>",
      to: [recipientEmail],
      subject: "Important: 1325.AI Team NDA Summary & Action Items",
      html: emailHtml,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    console.log("Team NDA email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending Team NDA email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
