// Draft wording pending patent-attorney review. Patent status must stay "provisional — claims pending".
export const PROPRIETARY_NOTICE =
  '1325 Clinical is proprietary software of 1325.AI (Mansa Musa Marketplace, Inc.), protected by U.S. Provisional Patent Application No. 63/969,202 — 46 claims pending, and by copyright and trade secret law. Access is granted only by written approval from 1325.AI for evaluation purposes. No license to use, copy, reproduce, reverse-engineer, record, screenshot, or build similar products is granted. Any commercial or clinical use requires a separate written license agreement with 1325.AI. Unauthorized use is prohibited and may result in legal action. All patient information shown is fictional.';

export default function ProprietaryNotice({ className = '' }: { className?: string }) {
  return (
    <p className={`text-[11px] leading-relaxed ${className}`}>
      <strong>PROPRIETARY &amp; CONFIDENTIAL.</strong> {PROPRIETARY_NOTICE}
    </p>
  );
}
