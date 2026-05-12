import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Globe } from 'lucide-react';

/**
 * Apple-compliant notice shown on iOS in place of subscription UI.
 * MUST NOT contain links, buttons, or any actionable element pointing
 * to an external purchase flow (Apple Guideline 3.1.1 / 3.1.3).
 */
export const IOSWebSubscribeNotice: React.FC<{ tierName?: string }> = ({ tierName }) => {
  return (
    <Card className="my-6 border-mansagold/40 bg-black/40">
      <CardContent className="p-6 text-center space-y-3">
        <div className="flex justify-center">
          <Globe className="h-8 w-8 text-mansagold" />
        </div>
        <h3 className="text-white font-semibold text-lg">
          Subscribe at 1325.ai to activate your {tierName ? `${tierName} ` : ''}business account
        </h3>
        <p className="text-white/70 text-sm leading-relaxed">
          Business subscriptions are managed on our website. To get started, open Safari
          on your device and visit <span className="text-mansagold font-medium">1325.ai</span>,
          then sign in with this account to activate your plan.
        </p>
        <p className="text-white/50 text-xs">
          Your existing subscription, if any, will remain active across all your devices.
        </p>
      </CardContent>
    </Card>
  );
};

export default IOSWebSubscribeNotice;
