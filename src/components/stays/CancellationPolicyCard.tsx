import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CancellationPolicyType, CANCELLATION_POLICIES } from '@/types/vacation-rental';
import { Shield, Clock, AlertCircle } from 'lucide-react';

interface CancellationPolicyCardProps {
  selectedPolicy?: CancellationPolicyType;
  onPolicyChange?: (policy: CancellationPolicyType) => void;
  isEditable?: boolean;
  showDescription?: boolean;
}

const CancellationPolicyCard: React.FC<CancellationPolicyCardProps> = ({
  selectedPolicy = 'moderate',
  onPolicyChange,
  isEditable = false,
  showDescription = true,
}) => {
  const getPolicyIcon = (policy: CancellationPolicyType) => {
    switch (policy) {
      case 'flexible':
        return <Shield className="w-5 h-5 text-green-400" />;
      case 'moderate':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'strict':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
    }
  };

  const getPolicyColor = (policy: CancellationPolicyType) => {
    switch (policy) {
      case 'flexible':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'moderate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'strict':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  if (!isEditable) {
    const policy = CANCELLATION_POLICIES[selectedPolicy];
    return (
      <Card className="bg-slate-800/50 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            {getPolicyIcon(selectedPolicy)}
            Cancellation Policy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge className={getPolicyColor(selectedPolicy)}>
            {policy.label}
          </Badge>
          {showDescription && (
            <p className="text-white/70 mt-2 text-sm">
              {policy.description}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-lg">Cancellation Policy</CardTitle>
        <p className="text-white/60 text-sm">
          Choose how flexible you want to be with cancellations
        </p>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedPolicy}
          onValueChange={(value) => onPolicyChange?.(value as CancellationPolicyType)}
          className="space-y-3"
        >
          {(Object.entries(CANCELLATION_POLICIES) as [CancellationPolicyType, typeof CANCELLATION_POLICIES.flexible][]).map(
            ([key, policy]) => (
              <div
                key={key}
                className={`flex items-start space-x-3 p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedPolicy === key
                    ? 'border-mansagold bg-mansagold/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
                onClick={() => onPolicyChange?.(key)}
              >
                <RadioGroupItem value={key} id={key} className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor={key} className="text-white font-medium flex items-center gap-2 cursor-pointer">
                    {getPolicyIcon(key)}
                    {policy.label}
                  </Label>
                  <p className="text-white/60 text-sm mt-1">{policy.description}</p>
                  <p className="text-white/40 text-xs mt-1">
                    {policy.refund_percent}% refund if cancelled {policy.refund_cutoff_hours} hours before check-in
                  </p>
                </div>
              </div>
            )
          )}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default CancellationPolicyCard;
