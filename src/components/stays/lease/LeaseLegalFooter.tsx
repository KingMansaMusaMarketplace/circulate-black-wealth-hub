import React from "react";

/**
 * Legal footer required on every lease listing/search/detail/host page.
 * Listing platform only — not a broker, no escrow, no lease signing.
 */
const LeaseLegalFooter: React.FC = () => (
  <div className="mt-12 border-t border-white/10 pt-6 text-xs text-white/50 space-y-2 max-w-4xl mx-auto">
    <p>
      <strong className="text-white/70">Mansa Stays is a listing platform, not a real estate broker.</strong>{" "}
      We do not handle lease signing, escrow, security deposits, rent collection, or tenant background checks.
      All lease terms are agreed directly between landlord and tenant.
    </p>
    <p>
      <strong className="text-white/70">Fair Housing:</strong> Listings on Mansa Stays comply with the federal Fair
      Housing Act. It is illegal to discriminate based on race, color, religion, sex, national origin, familial status,
      or disability. Many states and cities also prohibit discrimination based on source of income (including Section 8
      vouchers), sexual orientation, gender identity, age, marital status, and other protected characteristics.
    </p>
    <p>
      Mansa Stays is a service of Mansa Musa Marketplace. Service fee: $99 per successful lease, paid by the landlord
      after both parties confirm the lease in-app. Full refund available within 7 days of confirmation.
    </p>
  </div>
);

export default LeaseLegalFooter;
