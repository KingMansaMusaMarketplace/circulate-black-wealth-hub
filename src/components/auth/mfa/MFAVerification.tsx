
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  VerificationForm, 
  ExpiredView, 
  BackButton, 
  MFAHeader,
  useMFAVerification
} from './verification';

interface MFAVerificationProps {
  factorId: string;
  challengeId: string;
  onVerify: (factorId: string, code: string, challengeId: string) => Promise<any>;
  onCancel: () => void;
}

export const MFAVerification: React.FC<MFAVerificationProps> = ({ 
  factorId, 
  challengeId,
  onVerify,
  onCancel
}) => {
  const {
    isSubmitting,
    timeLeft,
    isExpired,
    handleVerify,
  } = useMFAVerification({ factorId, challengeId, onVerify });

  if (isExpired) {
    return <ExpiredView onCancel={onCancel} />;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <MFAHeader />
      <CardContent>
        <VerificationForm 
          onSubmit={(code) => handleVerify(code)}
          isSubmitting={isSubmitting}
          timeLeft={timeLeft}
        />
        <div className="mt-4">
          <BackButton onCancel={onCancel} />
        </div>
      </CardContent>
    </Card>
  );
};

export default MFAVerification;
