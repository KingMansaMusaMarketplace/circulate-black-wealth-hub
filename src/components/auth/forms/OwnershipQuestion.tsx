import React from 'react';

export type OwnershipAnswer = '' | 'yes' | 'no';

interface Props {
  value: OwnershipAnswer;
  onChange: (v: OwnershipAnswer) => void;
  ownerOk: boolean;
  onOwnerOk: (v: boolean) => void;
  attestOk: boolean;
  onAttestOk: (v: boolean) => void;
  answerError?: string;
  attestError?: string;
}

/** Returns an error message, or null when the ownership step is complete. */
export const ownershipError = (value: OwnershipAnswer, ownerOk: boolean, attestOk: boolean) => {
  if (!value) return { field: 'blackOwned', message: 'Please answer Yes or No' };
  if (!ownerOk || (value === 'yes' && !attestOk))
    return { field: 'attest', message: value === 'yes' ? 'Please check both boxes to continue' : 'Please check the box to continue' };
  return null;
};

/** Signup metadata saved for the 51% question (shared by every business sign-up form). */
export const ownershipMetadata = (value: OwnershipAnswer) => ({
  black_owned: value === 'yes',
  listing_type: value === 'yes' ? 'black_owned' : 'ally',
  ownership_certified_at: new Date().toISOString(),
  black_owned_attested_at: value === 'yes' ? new Date().toISOString() : null,
});

/** The "Is this business at least 51% Black-owned?" question, Ally welcome and confirmation boxes. */
const OwnershipQuestion: React.FC<Props> = ({ value, onChange, ownerOk, onOwnerOk, attestOk, onAttestOk, answerError, attestError }) => (
  <>
    <fieldset className="space-y-2">
      <legend className="text-foreground font-semibold">Is this business at least 51% Black-owned?</legend>
      <div className="grid grid-cols-2 gap-3">
        {(['yes', 'no'] as const).map((v) => (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={value === v}
            onClick={() => onChange(v)}
            className={`h-12 rounded-md border-2 font-semibold transition ${value === v ? 'border-mansagold bg-mansagold/15 text-foreground' : 'border-input text-foreground'}`}
          >
            {v === 'yes' ? 'Yes' : 'No'}
          </button>
        ))}
      </div>
      {answerError && <p className="text-sm text-destructive">{answerError}</p>}
      {value === 'no' && (
        <div className="text-sm text-foreground rounded-md bg-muted p-3 space-y-2">
          <p>
            <strong>Welcome, Ally!</strong> Thank you for standing with the community. Our main directory is for Black-owned
            businesses, so you'll join as an <strong>Ally Business</strong>, shown on our Allies page once approved.
          </p>
          <p className="font-semibold">As an Ally Business, you get:</p>
          <ul className="space-y-1">
            <li>✓ A <strong>free listing</strong> on our Allies page, with your phone, website and logo</li>
            <li>✓ A <strong>"Proud Ally of 1325.AI"</strong> badge for your own website</li>
            <li>✓ <strong>Kayla and the 42 Agentic AI Employees</strong> on the same plans as every business</li>
            <li>✓ Sponsor opportunities to show your support in a bigger way</li>
          </ul>
        </div>
      )}
    </fieldset>
    {value && (
      <div className="space-y-3 rounded-md border border-input p-3">
        <label className="flex items-start gap-3 text-sm text-foreground cursor-pointer">
          <input type="checkbox" checked={ownerOk} onChange={(e) => onOwnerOk(e.target.checked)} className="mt-0.5 h-6 w-6 shrink-0 accent-mansagold" />
          <span><strong className="text-foreground">Ownership.</strong> I certify that I am the legal owner or a duly authorized representative of the business identified above and possess the authority to register it in this directory.</span>
        </label>
        {value === 'yes' && (
          <label className="flex items-start gap-3 text-sm text-foreground cursor-pointer">
            <input type="checkbox" checked={attestOk} onChange={(e) => onAttestOk(e.target.checked)} className="mt-0.5 h-6 w-6 shrink-0 accent-mansagold" />
            <span><strong className="text-foreground">Legal attestation.</strong> I attest under penalty of perjury that this business is at least 51% Black-owned and that all information provided herein is accurate and truthful. I acknowledge that fraudulent submissions may result in permanent removal and potential legal action.</span>
          </label>
        )}
        {attestError && <p className="text-sm text-destructive">{attestError}</p>}
      </div>
    )}
  </>
);

export default OwnershipQuestion;

const PENDING_KEY = '1325_pending_business_signup';

/** Remember the latest short-form answer on this device (returning accounts keep their old sign-up details). */
export const savePendingOwnership = (email: string, value: OwnershipAnswer, businessName: string) => {
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify({ email: email.trim().toLowerCase(), value, businessName: businessName.trim(), at: Date.now() }));
  } catch { /* storage unavailable */ }
};

/** Pending answer for this email, if saved in the last 7 days. */
export const readPendingOwnership = (email?: string | null): { value: 'yes' | 'no'; businessName: string } | null => {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw || !email) return null;
    const p = JSON.parse(raw);
    if (p.email !== email.trim().toLowerCase() || Date.now() - p.at > 7 * 864e5) return null;
    if (p.value !== 'yes' && p.value !== 'no') return null;
    return { value: p.value, businessName: String(p.businessName || '') };
  } catch { return null; }
};

export const clearPendingOwnership = () => { try { localStorage.removeItem(PENDING_KEY); } catch { /* ignore */ } };
