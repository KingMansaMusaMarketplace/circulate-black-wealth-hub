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
        className="bg-white text-black p-8 max-w-[8.5in] mx-auto font-serif"
        style={{ fontFamily: "Georgia, Times New Roman, serif" }}
      >
        {/* Letterhead */}
        <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
          <img 
            src="/lovable-uploads/0a69e6cc-e735-4222-abff-7a9bb0178b2b.png" 
            alt="1325.AI Logo" 
            className="h-16 mx-auto mb-3"
          />
          <h1 className="text-xl font-bold tracking-wide">1325.AI</h1>
          <p className="text-sm text-gray-600">d/b/a Mansa Musa Marketplace, Inc.</p>
          <p className="text-xs text-gray-500 mt-1">Chicago, Illinois</p>
        </div>

        {/* Date */}
        <div className="text-right mb-6">
          <p>{currentDate}</p>
        </div>

        {/* Subject Line */}
        <div className="mb-6">
          <p className="font-bold">Subject: Securing Our Future: 1325.AI Team Documentation</p>
        </div>

        {/* Salutation */}
        <div className="mb-6">
          <p>Dear {recipientName},</p>
        </div>

        {/* Body */}
        <div className="space-y-4 leading-relaxed text-justify">
          <p>
            As we continue to build and scale 1325.AI (d/b/a Mansa Musa Marketplace, Inc.), I am more 
            inspired than ever by the talent and dedication within this group. We aren't just building 
            an app; we are building a legacy designed for long-term impact and, ultimately, a goal of 
            taking this company to an <strong>Initial Public Offering (IPO)</strong>.
          </p>

          <p>
            To reach that milestone, we must ensure our foundation is institutional-grade. The attached 
            <em> Confidential Information and Non-Disclosure Agreement</em> is a vital part of that process.
          </p>

          {/* Why This Matters Section */}
          <div className="my-6 pl-4 border-l-4 border-gray-300">
            <h3 className="font-bold mb-3">Why this matters for all of us:</h3>
            
            <div className="space-y-3">
              <div>
                <p className="font-semibold">🛡️ Protecting Our Hard Work:</p>
                <p className="text-sm ml-6">
                  This agreement legally anchors the proprietary systems we are building—such as the 
                  CMAL, Susu Circle Infrastructure, and Economic Karma algorithms—to the company. This 
                  ensures that the value we create together cannot be diluted or diverted by outside interests.
                </p>
              </div>

              <div>
                <p className="font-semibold">📈 Preparing for IPO and Investment:</p>
                <p className="text-sm ml-6">
                  Institutional investors and public markets require "clean" intellectual property records. 
                  This document provides the proof that our IP is fully secured, which is a prerequisite 
                  for the high-level valuation we are targeting.
                </p>
              </div>

              <div>
                <p className="font-semibold">🤝 Professionalism Over Personal Ties:</p>
                <p className="text-sm ml-6">
                  While many of us share deep bonds of friendship and family, this document ensures those 
                  personal relationships are protected from the complexities of business. It allows us to 
                  maintain our trust personally while remaining rigorous professionally.
                </p>
              </div>
            </div>
          </div>

          <p>
            Even though we operate on a foundation of mutual trust, this legal framework is what transforms 
            our hard work into a protected, tradable asset. It protects the "Economic Karma" we are all 
            investing into this project.
          </p>

          <p>
            Please review the document, including <strong>Exhibit A</strong> (where you can list any prior 
            inventions you wish to exclude), and let me know if you have any questions.
          </p>

          {/* Action Items Box */}
          <div className="my-6 p-4 bg-gray-50 border border-gray-200 rounded">
            <h4 className="font-bold mb-2">📋 Action Items:</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>
                <strong>Review Exhibit A:</strong> If you have unrelated projects you owned before joining us, 
                list them on Page 11. If none, write <strong>"NONE"</strong>.
              </li>
              <li>
                <strong>Sign & Date:</strong> You can execute this document electronically via DocuSign or HelloSign.
              </li>
              <li>
                <strong>Questions:</strong> If you need further clarity on any clause, feel free to reach out.
              </li>
            </ul>
          </div>

          <p>
            I am honored to have you on this journey toward the IPO. Let's build something historic.
          </p>
        </div>

        {/* Signature Block */}
        <div className="mt-10">
          <p>Best regards,</p>
          <div className="mt-8">
            <p className="font-bold">Thomas D. Bowling</p>
            <p className="text-sm">Founder & Chief Architect</p>
            <p className="text-sm text-gray-600">1325.AI | Mansa Musa Marketplace, Inc.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-4 border-t border-gray-300 text-xs text-gray-500 text-center">
          <p>USPTO Provisional Patent Application No. 63/969,202 • Filed January 27, 2026</p>
          <p className="mt-1">CONFIDENTIAL — For Internal Distribution Only</p>
        </div>
      </div>
    );
  }
);

NDACoverLetter.displayName = "NDACoverLetter";

export default NDACoverLetter;
