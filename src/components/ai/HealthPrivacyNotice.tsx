import React from 'react';
import { cn } from '@/lib/utils';

/** Health-privacy notice shown under every Kayla chat box (state health-data laws). */
export const HealthPrivacyNotice: React.FC<{ className?: string }> = ({ className }) => (
  <p className={cn('mt-2 text-[11px] leading-snug text-muted-foreground', className)}>
    Please don't share personal health details. Kayla doesn't give medical advice — in an emergency, call 911.
  </p>
);

export default HealthPrivacyNotice;
