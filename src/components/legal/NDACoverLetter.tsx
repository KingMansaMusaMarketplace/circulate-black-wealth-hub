import { forwardRef } from "react";
import { format } from "date-fns";

interface NDACoverLetterProps {
  recipientName?: string;
}

const NDACoverLetter = forwardRef<HTMLDivElement, NDACoverLetterProps>(
  ({ recipientName = "Team" }, ref) => {
    const currentDate = format(new Date(), "MMMM d, yyyy");

    return (
      <div 
        ref={ref}
        className="bg-white text-black"
        style={{ 
          fontFamily: "Georgia, 'Times New Roman', serif",
          width: "8.5in",
          minHeight: "11in",
          padding: "1in",
          boxSizing: "border-box"
        }}
      >
        {/* Letterhead with Logo */}
        <div style={{ textAlign: "center", marginBottom: "40px", borderBottom: "2px solid #1a365d", paddingBottom: "24px" }}>
          <img 
            src="/lovable-uploads/0a69e6cc-e735-4222-abff-7a9bb0178b2b.png" 
            alt="1325.AI Neural Brain Logo" 
            style={{ height: "80px", marginBottom: "12px" }}
          />
          <h1 style={{ fontSize: "24px", fontWeight: "bold", letterSpacing: "2px", margin: "0", color: "#1a365d" }}>
            1325.AI
          </h1>
          <p style={{ fontSize: "12px", color: "#4a5568", margin: "4px 0 0 0" }}>
            d/b/a Mansa Musa Marketplace, Inc.
          </p>
          <p style={{ fontSize: "11px", color: "#718096", margin: "2px 0 0 0" }}>
            Chicago, Illinois
          </p>
        </div>

        {/* Date - Right Aligned */}
        <div style={{ textAlign: "right", marginBottom: "32px" }}>
          <p style={{ margin: 0 }}>{currentDate}</p>
        </div>

        {/* Subject Line */}
        <div style={{ marginBottom: "24px" }}>
          <p style={{ fontWeight: "bold", margin: 0 }}>
            RE: Securing Our Future — 1325.AI Team Documentation
          </p>
        </div>

        {/* Salutation */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ margin: 0 }}>Dear {recipientName},</p>
        </div>

        {/* Body - Professional Tone */}
        <div style={{ lineHeight: "1.7", textAlign: "justify" }}>
          <p style={{ marginBottom: "16px" }}>
            As we continue to build and scale 1325.AI, I remain deeply inspired by the talent and 
            dedication within our team. We are not simply building an application—we are constructing 
            a legacy designed for long-term impact and, ultimately, positioned for an Initial Public 
            Offering.
          </p>

          <p style={{ marginBottom: "16px" }}>
            To achieve that milestone, we must ensure our foundation meets institutional standards. 
            The enclosed Confidential Information and Non-Disclosure Agreement is a critical component 
            of that process.
          </p>

          {/* Why This Matters Section */}
          <div style={{ margin: "28px 0", paddingLeft: "20px", borderLeft: "3px solid #1a365d" }}>
            <p style={{ fontWeight: "bold", marginBottom: "16px", color: "#1a365d" }}>
              Why This Matters for All of Us:
            </p>
            
            <p style={{ marginBottom: "12px" }}>
              <strong>Protecting Our Work.</strong> This agreement legally anchors the proprietary 
              systems we are building—including the CMAL Engine, Susu Circle Infrastructure, and 
              Economic Karma algorithms—to the company. This ensures the value we create together 
              cannot be diluted or diverted by outside interests.
            </p>

            <p style={{ marginBottom: "12px" }}>
              <strong>Preparing for Investment.</strong> Institutional investors and public markets 
              require clear intellectual property records. This document provides proof that our IP 
              is fully secured—a prerequisite for the valuation we are targeting.
            </p>

            <p style={{ marginBottom: "0" }}>
              <strong>Professionalism Over Personal Ties.</strong> While many of us share bonds of 
              friendship and family, this document ensures those personal relationships remain 
              protected from the complexities of business. It allows us to maintain trust personally 
              while remaining rigorous professionally.
            </p>
          </div>

          <p style={{ marginBottom: "16px" }}>
            Even though we operate on a foundation of mutual trust, this legal framework transforms 
            our collective effort into a protected, tradable asset.
          </p>

          <p style={{ marginBottom: "16px" }}>
            Please review the enclosed agreement, including Exhibit A where you may list any prior 
            inventions you wish to exclude. If you have no prior inventions to disclose, simply 
            write "NONE" before signing.
          </p>

          {/* Action Items */}
          <div style={{ margin: "24px 0", padding: "16px", backgroundColor: "#f7fafc", border: "1px solid #e2e8f0" }}>
            <p style={{ fontWeight: "bold", marginBottom: "12px" }}>Action Items:</p>
            <ol style={{ margin: 0, paddingLeft: "20px" }}>
              <li style={{ marginBottom: "6px" }}>Review the full agreement carefully</li>
              <li style={{ marginBottom: "6px" }}>Complete Exhibit A (Prior Inventions) or write "NONE"</li>
              <li style={{ marginBottom: "6px" }}>Sign and date the final page</li>
              <li>Return the executed copy via DocuSign or physical delivery</li>
            </ol>
          </div>

          <p style={{ marginBottom: "0" }}>
            I am honored to have you on this journey. Let us build something historic together.
          </p>
        </div>

        {/* Signature Block */}
        <div style={{ marginTop: "48px" }}>
          <p style={{ margin: "0 0 32px 0" }}>Respectfully,</p>
          <div>
            <p style={{ fontWeight: "bold", margin: 0 }}>Thomas D. Bowling</p>
            <p style={{ fontSize: "14px", margin: "4px 0 0 0" }}>Founder & Chief Architect</p>
            <p style={{ fontSize: "13px", color: "#4a5568", margin: "2px 0 0 0" }}>
              1325.AI | Mansa Musa Marketplace, Inc.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          marginTop: "48px", 
          paddingTop: "16px", 
          borderTop: "1px solid #cbd5e0", 
          fontSize: "10px", 
          color: "#718096", 
          textAlign: "center" 
        }}>
          <p style={{ margin: 0 }}>
            USPTO Provisional Patent Application No. 63/969,202 — Filed January 27, 2026
          </p>
          <p style={{ margin: "4px 0 0 0" }}>
            CONFIDENTIAL — For Internal Distribution Only
          </p>
        </div>
      </div>
    );
  }
);

NDACoverLetter.displayName = "NDACoverLetter";

export default NDACoverLetter;
