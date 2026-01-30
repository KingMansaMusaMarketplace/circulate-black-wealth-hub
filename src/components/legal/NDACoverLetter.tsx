import { forwardRef } from "react";
import { format } from "date-fns";

interface NDACoverLetterProps {
  recipientName?: string;
}

const NDACoverLetter = forwardRef<HTMLDivElement, NDACoverLetterProps>(
  ({ recipientName = "Team Member" }, ref) => {
    const currentDate = format(new Date(), "MMMM d, yyyy");

    return (
      <div 
        ref={ref}
        className="bg-white text-black"
        style={{ 
          fontFamily: "Georgia, 'Times New Roman', serif",
          width: "8.5in",
          height: "11in",
          padding: "0.5in 0.75in",
          boxSizing: "border-box",
          fontSize: "11px",
          lineHeight: "1.4"
        }}
      >
        {/* Letterhead with Neural Brain Logo */}
        <div style={{ textAlign: "center", marginBottom: "16px", borderBottom: "2px solid #1a365d", paddingBottom: "12px" }}>
          <img 
            src="/images/1325-neural-brain-logo.jpeg" 
            alt="1325.AI Neural Brain Logo" 
            style={{ height: "70px", marginBottom: "6px" }}
          />
          <p style={{ fontSize: "10px", color: "#4a5568", margin: "0" }}>
            d/b/a Mansa Musa Marketplace, Inc. — Chicago, Illinois
          </p>
        </div>

        {/* Date and Subject - Condensed */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
          <p style={{ fontWeight: "bold", margin: 0, fontSize: "11px" }}>
            RE: Securing Our Future — Team Documentation
          </p>
          <p style={{ margin: 0, fontSize: "11px" }}>{currentDate}</p>
        </div>

        {/* Salutation */}
        <p style={{ margin: "0 0 10px 0" }}>Dear {recipientName},</p>

        {/* Body - Ultra Compact */}
        <div style={{ textAlign: "justify" }}>
          <p style={{ margin: "0 0 8px 0" }}>
            As we build and scale 1325.AI toward an Initial Public Offering, we must ensure our 
            foundation meets institutional standards. The enclosed Confidential Information and 
            Non-Disclosure Agreement is a critical component of that process—protecting our 
            collective work and preparing for investment.
          </p>

          {/* Why This Matters - Inline Compact */}
          <div style={{ margin: "10px 0", paddingLeft: "12px", borderLeft: "3px solid #1a365d" }}>
            <p style={{ margin: "0 0 6px 0" }}>
              <strong>Protecting Our Work:</strong> This agreement legally anchors the proprietary 
              systems we are building—CMAL Engine, Susu Circles, and Economic Karma—to the company.
            </p>
            <p style={{ margin: "0 0 6px 0" }}>
              <strong>Preparing for Investment:</strong> Institutional investors require clear IP 
              records. This document provides proof our intellectual property is fully secured.
            </p>
            <p style={{ margin: "0" }}>
              <strong>Professionalism Over Personal Ties:</strong> While many of us share bonds 
              of family and friendship, this ensures those relationships remain protected from 
              business complexities.
            </p>
          </div>

          <p style={{ margin: "10px 0 8px 0" }}>
            Please review the enclosed agreement, including <strong>Exhibit A</strong> where you 
            may list any prior inventions to exclude. If none, write "NONE" before signing.
          </p>

          {/* Action Items - Ultra Compact */}
          <div style={{ margin: "10px 0", padding: "8px 12px", backgroundColor: "#f7fafc", border: "1px solid #e2e8f0" }}>
            <p style={{ fontWeight: "bold", margin: "0 0 4px 0", fontSize: "10px" }}>Action Items:</p>
            <div style={{ display: "flex", gap: "20px", fontSize: "10px" }}>
              <span>1. Review agreement</span>
              <span>2. Complete Exhibit A or write "NONE"</span>
              <span>3. Sign & date</span>
              <span>4. Return via DocuSign</span>
            </div>
          </div>

          <p style={{ margin: "8px 0 0 0" }}>
            I am honored to have you on this journey. Let us build something historic together.
          </p>
        </div>

        {/* Signature Block */}
        <div style={{ marginTop: "20px" }}>
          <p style={{ margin: "0 0 16px 0" }}>Respectfully,</p>
          <p style={{ fontWeight: "bold", margin: 0 }}>Thomas D. Bowling</p>
          <p style={{ fontSize: "10px", margin: "2px 0 0 0" }}>Founder & Chief Architect</p>
          <p style={{ fontSize: "10px", color: "#4a5568", margin: "2px 0 0 0" }}>
            1325.AI | Mansa Musa Marketplace, Inc.
          </p>
        </div>

        {/* Footer */}
        <div style={{ 
          marginTop: "20px", 
          paddingTop: "10px", 
          borderTop: "1px solid #cbd5e0", 
          fontSize: "9px", 
          color: "#718096", 
          textAlign: "center" 
        }}>
          <p style={{ margin: 0 }}>
            USPTO Provisional Patent Application No. 63/969,202 — Filed January 27, 2026
          </p>
          <p style={{ margin: "2px 0 0 0" }}>
            CONFIDENTIAL — For Internal Distribution Only
          </p>
        </div>
      </div>
    );
  }
);

NDACoverLetter.displayName = "NDACoverLetter";

export default NDACoverLetter;
