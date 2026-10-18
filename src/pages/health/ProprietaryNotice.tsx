// Draft wording pending patent-attorney review. Patent status must stay "provisional — claims pending".
export const PROPRIETARY_NOTICE =
  '1325 Clinical is proprietary software of 1325.AI (Mansa Musa Marketplace, Inc.). Intellectual property rights are reserved, including applicable copyright and trade secret rights. Patent filing reference: U.S. Provisional Patent Application No. 63/969,202 — 46 claims pending. A provisional application is not an issued patent. Upon written approval from 1325.AI, the approved viewer receives a limited, revocable, non-exclusive, non-transferable license solely for internal evaluation of this fictional-data preview on one approved device during the authorized viewing period. This permission does not authorize copying, reproducing, sharing, recording, screenshotting, reverse-engineering, or using confidential materials to build a similar product, except where applicable law permits. No commercial, clinical, or production license is granted; any such use requires a separate written license agreement with 1325.AI and applicable healthcare approvals. Unauthorized use may result in revocation of access and legal remedies available under applicable law. All patient information shown is fictional.';

export default function ProprietaryNotice({ className = '' }: { className?: string }) {
  return (
    <p className={`text-[11px] leading-relaxed ${className}`}>
      <strong>PROPRIETARY &amp; CONFIDENTIAL.</strong> {PROPRIETARY_NOTICE}
    </p>
  );
}
