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
          padding: "0.6in 0.9in",
          boxSizing: "border-box",
          fontSize: "12.5px",
          lineHeight: "1.55",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Letterhead with Neural Brain Logo */}
        <div style={{ textAlign: "center", marginBottom: "20px", borderBottom: "2px solid #1a365d", paddingBottom: "12px" }}>
          <img 
            src="/images/1325-neural-brain-logo.jpeg" 
            alt="1325.AI Neural Brain Logo" 
            style={{ height: "70px", marginBottom: "6px" }}
          />
          <p style={{ fontSize: "11px", color: "#4a5568", margin: "0" }}>
            d/b/a Mansa Musa Marketplace, Inc. — Chicago, Illinois
          </p>
        </div>

        {/* Date and Subject */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "18px" }}>
          <p style={{ fontWeight: "bold", margin: 0 }}>
            RE: Securing Our Future — Team Documentation
          </p>
          <p style={{ margin: 0 }}>{currentDate}</p>
        </div>

        {/* Salutation */}
        <p style={{ margin: "0 0 16px 0" }}>Dear {recipientName},</p>

        {/* Body */}
        <div style={{ textAlign: "justify", flex: 1 }}>
          <p style={{ margin: "0 0 14px 0" }}>
            As we build and scale 1325.AI toward an Initial Public Offering, we must ensure our 
            foundation meets institutional standards. The enclosed Confidential Information and 
            Non-Disclosure Agreement is a critical component of that process—protecting our 
            collective work and preparing for investment.
          </p>

          {/* Why This Matters */}
          <div style={{ margin: "16px 0", paddingLeft: "14px", borderLeft: "3px solid #1a365d" }}>
            <p style={{ margin: "0 0 10px 0" }}>
              <strong>Protecting Our Work:</strong> This agreement legally anchors the proprietary 
              systems we are building—CMAL Engine, Susu Circles, and Economic Karma—to the company.
            </p>
            <p style={{ margin: "0 0 10px 0" }}>
              <strong>Preparing for Investment:</strong> Institutional investors require clear IP 
              records. This document provides proof our intellectual property is fully secured.
            </p>
            <p style={{ margin: "0" }}>
              <strong>Professionalism Over Personal Ties:</strong> While many of us share bonds 
              of family and friendship, this ensures those relationships remain protected from 
              business complexities.
            </p>
          </div>

          <p style={{ margin: "16px 0" }}>
            Please review the enclosed agreement, including <strong>Exhibit A</strong> where you 
            may list any prior inventions to exclude. If none, write "NONE" before signing.
          </p>

          {/* Action Items */}
          <div style={{ margin: "16px 0", padding: "12px 16px", backgroundColor: "#f7fafc", border: "1px solid #e2e8f0", borderRadius: "4px" }}>
            <p style={{ fontWeight: "bold", margin: "0 0 8px 0", fontSize: "11px" }}>Action Items:</p>
            <ol style={{ margin: 0, paddingLeft: "18px", fontSize: "11px" }}>
              <li style={{ marginBottom: "3px" }}>Review the enclosed agreement carefully</li>
              <li style={{ marginBottom: "3px" }}>Complete Exhibit A (list prior inventions or write "NONE")</li>
              <li style={{ marginBottom: "3px" }}>Sign and date where indicated</li>
              <li>Return the completed document via DocuSign</li>
            </ol>
          </div>

          <p style={{ margin: "16px 0 0 0" }}>
            I am honored to have you on this journey. Let us build something historic together.
          </p>
        </div>

        {/* Signature Block */}
        <div style={{ marginTop: "24px" }}>
          <p style={{ margin: "0 0 20px 0" }}>Respectfully,</p>
          <p style={{ fontWeight: "bold", margin: 0, fontSize: "13px" }}>Thomas D. Bowling</p>
          <p style={{ fontSize: "11px", margin: "3px 0 0 0" }}>Founder & Chief Architect</p>
          <p style={{ fontSize: "11px", color: "#4a5568", margin: "3px 0 0 0" }}>
            1325.AI | Mansa Musa Marketplace, Inc.
          </p>
        </div>

        {/* Footer */}
        <div style={{ 
          marginTop: "20px", 
          paddingTop: "12px", 
          borderTop: "1px solid #cbd5e0", 
          fontSize: "10px", 
          color: "#718096", 
          textAlign: "center" 
        }}>
          <p style={{ margin: 0 }}>
            USPTO Provisional Patent Application No. 63/969,202 — Filed January 27, 2026
          </p>
          <p style={{ margin: "3px 0 0 0" }}>
            CONFIDENTIAL — For Internal Distribution Only
          </p>
        </div>
      </div>
    );
  }
);

NDACoverLetter.displayName = "NDACoverLetter";

export default NDACoverLetter;
