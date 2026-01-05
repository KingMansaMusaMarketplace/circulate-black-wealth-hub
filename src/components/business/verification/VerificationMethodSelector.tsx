import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Phone, Video, Shield, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type VerificationMethod = 'documents' | 'phone' | 'video' | 'combined';

interface VerificationMethodSelectorProps {
  selectedMethod: VerificationMethod;
  onMethodChange: (method: VerificationMethod) => void;
  phoneVerified?: boolean;
  videoSubmitted?: boolean;
  documentsUploaded?: boolean;
}

const METHODS = [
  {
    id: 'documents' as const,
    title: 'Document Verification',
    description: 'Upload business registration, ownership documents, and ID',
    icon: FileText,
    recommended: true,
    requirements: [
      'Government-issued ID',
      'Business registration',
      'Ownership documents',
      'Address verification'
    ]
  },
  {
    id: 'phone' as const,
    title: 'Phone Verification',
    description: 'Verify your business phone number with OTP',
    icon: Phone,
    recommended: false,
    requirements: [
      'Access to business phone',
      '6-digit verification code'
    ]
  },
  {
    id: 'video' as const,
    title: 'Video Verification',
    description: 'Record a video confirming your identity and ownership',
    icon: Video,
    recommended: false,
    requirements: [
      'Camera access',
      'Read verification script',
      'Show face clearly'
    ]
  },
  {
    id: 'combined' as const,
    title: 'Combined Verification',
    description: 'Complete all methods for the strongest verification',
    icon: Shield,
    recommended: false,
    premium: true,
    requirements: [
      'All document verification',
      'Phone verification',
      'Video verification'
    ]
  }
];

const VerificationMethodSelector: React.FC<VerificationMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange,
  phoneVerified,
  videoSubmitted,
  documentsUploaded
}) => {
  const getCompletionStatus = (methodId: VerificationMethod) => {
    switch (methodId) {
      case 'documents':
        return documentsUploaded;
      case 'phone':
        return phoneVerified;
      case 'video':
        return videoSubmitted;
      case 'combined':
        return documentsUploaded && phoneVerified && videoSubmitted;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Choose Verification Method</h3>
        <p className="text-sm text-muted-foreground">
          Select how you'd like to verify your business ownership
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {METHODS.map((method) => {
          const isSelected = selectedMethod === method.id;
          const isComplete = getCompletionStatus(method.id);
          const Icon = method.icon;

          return (
            <Card
              key={method.id}
              className={cn(
                'cursor-pointer transition-all hover:border-primary/50',
                isSelected && 'border-primary ring-2 ring-primary/20',
                isComplete && 'border-green-500 bg-green-50/50'
              )}
              onClick={() => onMethodChange(method.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className={cn(
                    'p-2 rounded-full',
                    isSelected ? 'bg-primary/20' : 'bg-muted'
                  )}>
                    <Icon className={cn(
                      'h-5 w-5',
                      isSelected ? 'text-primary' : 'text-muted-foreground'
                    )} />
                  </div>
                  <div className="flex items-center gap-2">
                    {method.recommended && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    )}
                    {method.premium && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        Premium Badge
                      </span>
                    )}
                    {isComplete && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                </div>
                <CardTitle className="text-base">{method.title}</CardTitle>
                <CardDescription className="text-xs">
                  {method.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {method.requirements.map((req, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                      {req}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default VerificationMethodSelector;
